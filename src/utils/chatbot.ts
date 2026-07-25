import { Product } from '../types';
import { products, categories } from '../data/products';

export interface BotReply {
  text: string;
  products: Product[];
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'any', 'are', 'buy', 'can', 'do', 'find', 'for', 'get', 'good',
  'have', 'hi', 'how', 'i', 'in', 'is', 'it', 'looking', 'me', 'my', 'need', 'of',
  'on', 'or', 'products', 'recommend', 'show', 'some', 'something', 'the', 'to',
  'want', 'what', 'which', 'with', 'you', 'your',
]);

const MAX_SUGGESTIONS = 3;

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`;
}

function listNames(matches: Product[]) {
  return matches.map((p) => `${p.name} (${formatPrice(p.price)})`).join(', ');
}

function matchCategory(message: string) {
  return categories.find((category) => {
    const words = category.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    return words.some((word) => message.includes(word));
  });
}

function searchProducts(message: string) {
  const terms = message
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2 && !STOP_WORDS.has(term));

  const scored = products
    .map((product) => {
      const name = product.name.toLowerCase();
      const description = product.description.toLowerCase();
      const score = terms.reduce((total, term) => {
        if (name.includes(term)) return total + 2;
        if (description.includes(term)) return total + 1;
        return total;
      }, 0);
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, MAX_SUGGESTIONS).map((entry) => entry.product);
}

export function getBotReply(message: string): BotReply {
  const normalized = message.trim().toLowerCase();

  if (!normalized) {
    return { text: 'Ask me about a product, a category, or your order.', products: [] };
  }

  if (/^(hi|hey|hello|yo)\b/.test(normalized)) {
    return {
      text: `Hi! I can help you find products across ${categories.join(', ')}. What are you looking for?`,
      products: [],
    };
  }

  if (/(ship|delivery|deliver)/.test(normalized)) {
    return {
      text: 'Orders ship within 2 business days, and delivery takes 3-5 business days.',
      products: [],
    };
  }

  if (/(return|refund|exchange)/.test(normalized)) {
    return {
      text: 'You can return any item within 30 days of delivery for a full refund.',
      products: [],
    };
  }

  if (/(cart|checkout|order|payment|pay)/.test(normalized)) {
    return {
      text: 'Add items with the "Add to Cart" button, then open the cart from the header to check out.',
      products: [],
    };
  }

  if (/(categor|department|sections?)/.test(normalized)) {
    return { text: `We currently stock: ${categories.join(', ')}.`, products: [] };
  }

  const budgetMatch = normalized.match(/(?:under|below|less than|cheaper than)\s*\$?(\d+(?:\.\d+)?)/);
  if (budgetMatch) {
    const limit = Number(budgetMatch[1]);
    const affordable = products
      .filter((product) => product.price < limit)
      .sort((a, b) => a.price - b.price)
      .slice(0, MAX_SUGGESTIONS);

    if (affordable.length === 0) {
      return { text: `Nothing is under ${formatPrice(limit)} right now.`, products: [] };
    }
    return {
      text: `Here's what I found under ${formatPrice(limit)}: ${listNames(affordable)}.`,
      products: affordable,
    };
  }

  if (/(cheapest|least expensive|lowest price|best deal)/.test(normalized)) {
    const cheapest = [...products].sort((a, b) => a.price - b.price)[0];
    return {
      text: `Our lowest priced item is the ${cheapest.name} at ${formatPrice(cheapest.price)}.`,
      products: [cheapest],
    };
  }

  const category = matchCategory(normalized);
  if (category) {
    const inCategory = products.filter((product) => product.category === category);
    return {
      text: `${category} has ${inCategory.length} items, for example: ${listNames(
        inCategory.slice(0, MAX_SUGGESTIONS)
      )}.`,
      products: inCategory.slice(0, MAX_SUGGESTIONS),
    };
  }

  const matches = searchProducts(normalized);
  if (matches.length > 0) {
    return { text: `These might be a good fit: ${listNames(matches)}.`, products: matches };
  }

  return {
    text: `I couldn't find a match for that. Try a product name, or ask about ${categories.join(', ')}.`,
    products: [],
  };
}
