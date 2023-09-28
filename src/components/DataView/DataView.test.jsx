import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import DataView from './DataView';

window.URL.createObjectURL = jest.fn(() => 'test');

describe('DataView', () => {
  const mockDataTable = {
    content_type: 'Shipping and Ports Measure',
    fields: [],
    hits: [],
    index: 'wisetest_searchui',
    website: 'wise-marine',
  };

  it('should render the component', () => {
    const { container } = render(<DataView tableData={mockDataTable} />);
    expect(
      container.querySelector('.elastic-connector-view'),
    ).toBeInTheDocument();
  });

  it('should display "No compatible data" message when there is no data', () => {
    const { getByText } = render(<DataView tableData={{}} />);
    expect(getByText('No compatible data')).toBeInTheDocument();
  });

  it('should render table headers correctly', () => {
    const mockDataWithHeaders = {
      column1: ['data1', 'data2'],
      column2: ['data3', 'data4'],
    };
    const { getAllByRole } = render(
      <DataView tableData={mockDataWithHeaders} />,
    );
    const headers = getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent('column1');
    expect(headers[1]).toHaveTextContent('column2');
  });

  it('should render table rows correctly', () => {
    const mockDataWithRows = {
      column1: ['data1', 'data2'],
      column2: ['data3', 'data4'],
    };
    const { getAllByRole } = render(<DataView tableData={mockDataWithRows} />);
    const rows = getAllByRole('row');
    expect(rows).toHaveLength(3); // 2 data rows + 1 header row
    expect(rows[1]).toHaveTextContent('data1');
    expect(rows[1]).toHaveTextContent('data3');
    expect(rows[2]).toHaveTextContent('data2');
    expect(rows[2]).toHaveTextContent('data4');
  });
});
