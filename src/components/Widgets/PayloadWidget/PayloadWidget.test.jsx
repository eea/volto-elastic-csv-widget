import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import PayloadWidget from './PayloadWidget';

const renderWithIntl = (component) => {
  return render(<IntlProvider locale="en">{component}</IntlProvider>);
};

describe('PayloadWidget', () => {
  test('renders without crash', () => {
    const { getByPlaceholderText } = renderWithIntl(
      <PayloadWidget
        id="test-id"
        title="Test title"
        placeholder="Test placeholder"
      />,
    );
    expect(getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  test('displays initial JSON data', () => {
    const initialData = { key: 'value' };
    const { container } = renderWithIntl(
      <PayloadWidget id="test-id" title="Test title" data={initialData} />,
    );
    const textarea = container.querySelector('textarea');
    expect(textarea.value).toBe(JSON.stringify(initialData, null, 2));
  });
});
