import React from 'react';
import { render } from '@testing-library/react';
import AggregationInfo from './AggregationInfo';
import '@testing-library/jest-dom';

test('renders without crashing', () => {
  render(<AggregationInfo connectorConfig={{}} fields={[]} />);
});

test('renders aggregations info correctly', () => {
  const { getByText } = render(
    <AggregationInfo
      connectorConfig={{ use_aggs: true }}
      fields={['field1', 'field2']}
    />,
  );
  expect(getByText('Use aggregations: Yes')).toBeInTheDocument();
  expect(getByText('Fields: field1, field2')).toBeInTheDocument();
});

test('shows "No" when use_aggs is false', () => {
  const { getByText } = render(
    <AggregationInfo connectorConfig={{ use_aggs: false }} fields={[]} />,
  );
  expect(getByText('Use aggregations: No')).toBeInTheDocument();
});
