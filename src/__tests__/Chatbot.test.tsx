import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Chatbot } from '../components/Chatbot';
import { getBotReply } from '../utils/chatbot';
import { products } from '../data/products';

function renderChatbot() {
  render(
    <BrowserRouter>
      <Chatbot />
    </BrowserRouter>
  );
}

function ask(question: string) {
  fireEvent.change(screen.getByPlaceholderText('Ask a question...'), {
    target: { value: question },
  });
  fireEvent.click(screen.getByText('Send'));
}

describe('getBotReply', () => {
  it('lists categories', () => {
    expect(getBotReply('what categories do you have?').text).toContain('Electronics');
  });

  it('answers budget questions with items below the limit', () => {
    const reply = getBotReply('anything under $50');
    expect(reply.products.length).toBeGreaterThan(0);
    expect(reply.products.every((product) => product.price < 50)).toBe(true);
  });

  it('returns the cheapest product', () => {
    const cheapest = [...products].sort((a, b) => a.price - b.price)[0];
    expect(getBotReply('what is the cheapest item?').products).toEqual([cheapest]);
  });

  it('matches products by keyword', () => {
    const reply = getBotReply('do you sell headphones');
    expect(reply.products.some((product) => product.name === 'Wireless Headphones')).toBe(true);
  });

  it('answers shipping and returns questions', () => {
    expect(getBotReply('how long is shipping?').text).toContain('business days');
    expect(getBotReply('what is your return policy?').text).toContain('30 days');
  });

  it('falls back when nothing matches', () => {
    expect(getBotReply('zzzzqqq').text).toContain("couldn't find a match");
  });
});

describe('Chatbot', () => {
  it('is collapsed until toggled', () => {
    renderChatbot();
    expect(screen.queryByPlaceholderText('Ask a question...')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Shopping Assistant'));
    expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
  });

  it('shows the question and an answer with product links', () => {
    renderChatbot();
    fireEvent.click(screen.getByText('Shopping Assistant'));
    ask('headphones');

    expect(screen.getByText('headphones')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Wireless Headphones' });
    expect(link).toHaveAttribute('href', '/product/elec-1');
  });

  it('ignores empty input', () => {
    renderChatbot();
    fireEvent.click(screen.getByText('Shopping Assistant'));
    ask('   ');
    expect(screen.getAllByRole('log')[0].children).toHaveLength(1);
  });
});
