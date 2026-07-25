import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { getBotReply } from '../utils/chatbot';
import { theme } from '../theme';

interface Message {
  id: number;
  author: 'user' | 'bot';
  text: string;
  products: Product[];
}

const GREETING: Message = {
  id: 0,
  author: 'bot',
  text: 'Hi! Ask me about products, prices, shipping, or returns.',
  products: [],
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) {
      transcript.scrollTop = transcript.scrollHeight;
    }
  }, [messages, isOpen]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;

    const reply = getBotReply(question);
    setMessages((previous) => [
      ...previous,
      { id: previous.length, author: 'user', text: question, products: [] },
      { id: previous.length + 1, author: 'bot', text: reply.text, products: reply.products },
    ]);
    setDraft('');
  }

  return (
    <section
      style={{
        backgroundColor: theme.colors.surface,
        padding: '24px',
        borderRadius: theme.radii.md,
        boxShadow: theme.shadows.md,
        marginTop: '24px',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: theme.colors.text,
          fontSize: '14px',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        Shopping Assistant
        <span aria-hidden="true" style={{ color: theme.colors.primary, fontSize: '12px' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div style={{ marginTop: '16px' }}>
          <div
            ref={transcriptRef}
            role="log"
            aria-label="Chat transcript"
            style={{
              maxHeight: '260px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.author === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                  backgroundColor:
                    message.author === 'user' ? theme.colors.primary : theme.colors.surfaceAlt,
                  color: message.author === 'user' ? theme.colors.surface : theme.colors.text,
                  padding: '10px 12px',
                  borderRadius: theme.radii.sm,
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              >
                {message.text}
                {message.products.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
                    {message.products.map((product) => (
                      <li key={product.id} style={{ marginTop: '4px' }}>
                        <Link
                          to={`/product/${product.id}`}
                          style={{
                            color: theme.colors.primary,
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          {product.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
            <label htmlFor="chatbot-input" style={{ display: 'none' }}>
              Ask the shopping assistant
            </label>
            <input
              id="chatbot-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                minWidth: 0,
                padding: '10px 12px',
                borderRadius: theme.radii.sm,
                border: `1px solid ${theme.colors.border}`,
                fontSize: '14px',
                color: theme.colors.text,
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: theme.colors.text,
                color: theme.colors.surface,
                border: 'none',
                padding: '10px 16px',
                borderRadius: theme.radii.sm,
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
