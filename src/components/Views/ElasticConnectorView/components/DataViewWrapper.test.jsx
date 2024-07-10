import React from 'react';
import { render } from '@testing-library/react';
import DataViewWrapper from './DataViewWrapper';
import '@testing-library/jest-dom';

test('renders without crashing', () => {
  render(<DataViewWrapper tableData={{}} />);
});

test('does not render TableDataView when tableData is empty', () => {
  const { getByText } = render(<DataViewWrapper />);
  expect(getByText('No table data')).toBeInTheDocument();
});
