import React from 'react';
import { render } from '@testing-library/react';
import Title from './Title';
import '@testing-library/jest-dom';

test('renders without crashing', () => {
  render(<Title text="Test Title" />);
});

test('renders correct text', () => {
  const { getByText } = render(<Title text="Test Title" />);
  expect(getByText('Test Title')).toBeInTheDocument();
});

test('does not render non-string content', () => {
  const { container } = render(<Title text={null} />);
  expect(container.textContent).toBe('');
});
