import React from 'react';
import { render } from '@testing-library/react';
import InfoLine from './InfoLine';
import '@testing-library/jest-dom';

test('renders without crashing', () => {
  render(<InfoLine label="Label" value="Value" />);
});

test('renders correct label and value', () => {
  const { getByText } = render(<InfoLine label="Label" value="Value" />);
  expect(getByText('Label: Value')).toBeInTheDocument();
});

test('displays "Not selected" for undefined value', () => {
  const { getByText } = render(<InfoLine label="Label" />);
  expect(getByText('Label: Not selected')).toBeInTheDocument();
});
