import { wikiRepos } from '../data/wikiRepos';

export function WikiPage() {
  return (
    <div style={{ backgroundColor: '#FAF9F7', minHeight: '100vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              color: '#1A1A1A',
              fontSize: '36px',
              fontWeight: '600',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
            }}
          >
            Wiki
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '16px' }}>
            Repositories and resources for the team
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '28px',
          }}
        >
          {wikiRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '28px',
                boxShadow: '0 4px 12px rgba(26, 26, 26, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                textDecoration: 'none',
                border: '1px solid #E8E6E3',
                transition: 'box-shadow 250ms ease, transform 250ms ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 8px 24px rgba(26, 26, 26, 0.08)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  '0 4px 12px rgba(26, 26, 26, 0.06)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="#6B6B6B"
                    aria-hidden="true"
                  >
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                  </svg>
                </span>
                <h2
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    color: '#1A1A1A',
                    fontSize: '20px',
                    fontWeight: '600',
                  }}
                >
                  {repo.name}
                </h2>
              </div>

              <p
                style={{
                  color: '#6B6B6B',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  flex: 1,
                }}
              >
                {repo.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: '#6B6B6B',
                    fontWeight: '500',
                  }}
                >
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#00ADD8',
                      display: 'inline-block',
                    }}
                  />
                  {repo.language}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {repo.topics.map((topic) => (
                  <span
                    key={topic}
                    style={{
                      backgroundColor: '#F5F3F0',
                      color: '#6B6B6B',
                      fontSize: '12px',
                      fontWeight: '500',
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
