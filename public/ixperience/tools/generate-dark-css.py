#!/usr/bin/env python3
"""Generate the dark-theme override stylesheet for the iXperience page clone.

The cloned page is built by Webflow, so its colours live in hundreds of small
rules instead of a themeable palette. This script reads the published Webflow
stylesheet and re-emits every rule that declares a colour, prefixed with
`html.ix-dark`, with light neutrals flipped to dark ones:

  * light backgrounds  -> dark backgrounds (hue and alpha preserved)
  * dark text          -> light text
  * light/dark borders -> mid-grey borders

Colours that are already dark (white text on a black panel), and saturated
brand colours such as the iX pink, are re-emitted unchanged. They still have to
be emitted: a generated rule is one class more specific than its source, so
dropping them would break the original cascade between overlapping selectors
(`.btn` would win over `.btn.btn-pink`).

Usage:
    curl -s <webflow css url> -o /tmp/ixmain.css
    python3 tools/generate-dark-css.py /tmp/ixmain.css assets/ix-dark.css
"""
import colorsys
import re
import sys

BG_PROPS = {"background", "background-color"}
TEXT_PROPS = {"color"}
BORDER_PROPS = {
    "border",
    "border-color",
    "border-top",
    "border-right",
    "border-bottom",
    "border-left",
    "border-top-color",
    "border-right-color",
    "border-bottom-color",
    "border-left-color",
}
COLOUR_PROPS = BG_PROPS | TEXT_PROPS | BORDER_PROPS

NAMED = {"white": (1.0, 1.0, 1.0, 1.0), "black": (0.0, 0.0, 0.0, 1.0)}

COLOUR_TOKEN = re.compile(
    r"var\(--[a-z0-9-]+\)|#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b",
    re.I,
)

# Selectors the page never paints in the light theme, or that are themed by
# hand in assets/ix-enhance.css.
SKIP_SELECTOR = re.compile(r"^(html|:root|::|\*)|w-lightbox|w-slider-nav", re.I)

# How saturated a colour has to be before it counts as a brand colour that the
# dark theme must not touch.
BRAND_SATURATION = 0.25

DARK_BG = (0.082, 0.094, 0.114)  # #15181d
LIGHT_TEXT = (0.914, 0.925, 0.949)  # #e9ecf2
BORDER = (0.169, 0.192, 0.231)  # #2b313b


def parse_colour(token, variables, depth=0):
    token = token.strip()
    low = token.lower()
    if low in NAMED:
        return NAMED[low]
    if low.startswith("var(") and depth < 5:
        name = low[4:-1].split(",")[0].strip()
        if name in variables:
            return parse_colour(variables[name], variables, depth + 1)
        return None
    if low.startswith("#"):
        hex_digits = low[1:]
        if len(hex_digits) in (3, 4):
            hex_digits = "".join(c * 2 for c in hex_digits)
        if len(hex_digits) not in (6, 8):
            return None
        try:
            parts = [int(hex_digits[i : i + 2], 16) / 255 for i in range(0, len(hex_digits), 2)]
        except ValueError:
            return None
        if len(parts) == 3:
            parts.append(1.0)
        return tuple(parts)
    if low.startswith("rgb"):
        nums = re.findall(r"[\d.]+%?", low)
        if len(nums) < 3:
            return None
        channels = []
        for num in nums[:3]:
            value = float(num.rstrip("%"))
            channels.append(value / 100 if num.endswith("%") else value / 255)
        alpha = 1.0
        if len(nums) > 3:
            alpha = float(nums[3].rstrip("%"))
            alpha = alpha / 100 if nums[3].endswith("%") else alpha
        return tuple(channels) + (alpha,)
    return None


def to_css(rgba):
    r, g, b, a = rgba
    channels = [max(0, min(255, round(c * 255))) for c in (r, g, b)]
    if a >= 0.999:
        return "#%02x%02x%02x" % tuple(channels)
    return "rgba(%d,%d,%d,%s)" % (channels[0], channels[1], channels[2], round(a, 3))


def luminance(rgba):
    return 0.2126 * rgba[0] + 0.7152 * rgba[1] + 0.0722 * rgba[2]


def saturation(rgba):
    return colorsys.rgb_to_hls(*rgba[:3])[2]


def tint(rgba, target):
    """Recolour to `target`'s lightness while keeping hue, saturation, alpha."""
    hue, _, sat = colorsys.rgb_to_hls(*rgba[:3])
    lightness = colorsys.rgb_to_hls(*target)[1]
    r, g, b = colorsys.hls_to_rgb(hue, lightness, sat)
    return (r, g, b, rgba[3])


def flip(prop, rgba):
    """Return the dark-theme colour for `rgba`, or None to keep it as is."""
    if rgba[3] < 0.05:
        return None  # fully transparent
    lum = luminance(rgba)
    brand = saturation(rgba) > BRAND_SATURATION
    if prop in BORDER_PROPS:
        if brand or 0.2 < lum < 0.75:
            return None
        return BORDER + (rgba[3],)
    if prop in BG_PROPS:
        if lum < 0.7:
            return None
        return tint(rgba, DARK_BG) if brand else DARK_BG + (rgba[3],)
    if lum > 0.42 or brand:  # text that is already light, or a brand colour
        return None
    return tint(rgba, LIGHT_TEXT) if saturation(rgba) > 0.08 else LIGHT_TEXT + (rgba[3],)


def declarations(body):
    for chunk in body.split(";"):
        if ":" not in chunk:
            continue
        prop, _, value = chunk.partition(":")
        yield prop.strip().lower(), value.strip()


def convert(body, variables):
    out = []
    for prop, value in declarations(body):
        if prop not in COLOUR_PROPS:
            continue
        if prop in BG_PROPS and ("url(" in value or "gradient(" in value):
            continue  # images and gradients are left to the light stylesheet

        def replace(match):
            rgba = parse_colour(match.group(0), variables)
            if rgba is None:
                return match.group(0)
            flipped = flip(prop, rgba)
            return match.group(0) if flipped is None else to_css(flipped)

        out.append("%s:%s" % (prop, COLOUR_TOKEN.sub(replace, value)))
    return out


def prefix(selector):
    parts = []
    for sel in selector.split(","):
        sel = sel.strip()
        if not sel or SKIP_SELECTOR.search(sel):
            continue
        parts.append("html.ix-dark " + sel)
    return ",".join(parts)


def parse(css):
    """Yield (media_query_or_None, selector, body) for every style rule."""
    pos = 0
    media = None
    media_end = None
    rule = re.compile(r"([^{}]+)\{([^{}]*)\}")
    at_rule = re.compile(r"@([a-z-]+)([^{]*)\{", re.I)
    while pos < len(css):
        if media_end is not None and pos >= media_end:
            media, media_end = None, None
        at = at_rule.match(css, pos)
        if at:
            name = at.group(1).lower()
            depth, i = 1, at.end()
            while i < len(css) and depth:
                if css[i] == "{":
                    depth += 1
                elif css[i] == "}":
                    depth -= 1
                i += 1
            if name == "media" and media is None:
                media = "@media" + at.group(2).strip()
                media_end = i - 1
                pos = at.end()
            else:
                pos = i
            continue
        m = rule.match(css, pos)
        if m:
            yield media, m.group(1), m.group(2)
            pos = m.end()
            continue
        pos += 1


def root_variables(css):
    variables = {}
    for match in re.finditer(r":root\s*\{([^}]*)\}", css):
        for prop, value in declarations(match.group(1)):
            if prop.startswith("--"):
                variables[prop] = value
    return variables


def main():
    css = open(sys.argv[1], encoding="utf-8").read()
    variables = root_variables(css)

    blocks = {}
    order = []
    for media, selector, body in parse(css):
        decls = convert(body, variables)
        if not decls:
            continue
        sel = prefix(selector)
        if not sel:
            continue
        key = (media, sel)
        if key not in blocks:
            blocks[key] = []
            order.append(key)
        for decl in decls:
            if decl not in blocks[key]:
                blocks[key].append(decl)

    lines = [
        "/* GENERATED by tools/generate-dark-css.py - do not edit by hand. */",
        "/* Dark-theme counterparts of the Webflow stylesheet's colours. */",
    ]
    current_media = None
    for media, sel in order:
        if media != current_media:
            if current_media is not None:
                lines.append("}")
            if media is not None:
                lines.append(media + "{")
            current_media = media
        lines.append("%s{%s}" % (sel, ";".join(blocks[(media, sel)])))
    if current_media is not None:
        lines.append("}")

    out = "\n".join(lines) + "\n"
    open(sys.argv[2], "w", encoding="utf-8").write(out)
    print("wrote %s (%d rules, %d bytes)" % (sys.argv[2], len(order), len(out)))


if __name__ == "__main__":
    main()
