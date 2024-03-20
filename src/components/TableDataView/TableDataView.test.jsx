import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TableDataView from './TableDataView';

describe('TableDataView', () => {
  it('should render the component', () => {
    const mockData = {
      column1: ['data1', 'data2'],
    };
    render(<TableDataView tableData={mockData} />);
    expect(screen.getByText('data1')).toBeInTheDocument();
  });

  it('should display "No compatible data" message when there is no data', () => {
    render(<TableDataView tableData={{}} />);
    expect(screen.getByText('No compatible data')).toBeInTheDocument();
  });

  it('should handle undefined columns gracefully', () => {
    const mockDataWithUndefined = {
      column1: ['data1', 'data2'],
      undefined: ['data3', 'data4'],
    };
    render(<TableDataView tableData={mockDataWithUndefined} />);
    expect(screen.getByText('data1')).toBeInTheDocument();
    expect(screen.getByText('data2')).toBeInTheDocument();
  });

  it('should handle columns with no data gracefully', () => {
    const mockDataWithEmptyColumn = {
      column1: ['data1', 'data2'],
      column2: [],
    };
    render(<TableDataView tableData={mockDataWithEmptyColumn} />);
    expect(screen.getByText('data1')).toBeInTheDocument();
    expect(screen.getByText('data2')).toBeInTheDocument();
  });

  it('should render all rows and columns correctly', () => {
    const mockData = {
      column1: ['data1', 'data2'],
      column2: ['data3', 'data4'],
    };
    render(<TableDataView tableData={mockData} />);
    expect(screen.getByText('data1')).toBeInTheDocument();
    expect(screen.getByText('data2')).toBeInTheDocument();
    expect(screen.getByText('data3')).toBeInTheDocument();
    expect(screen.getByText('data4')).toBeInTheDocument();
  });

  it('should handle rows with varied lengths', () => {
    const mockDataWithDifferentLengths = {
      column1: ['data1', 'data2'],
      column2: ['data3'],
    };
    render(<TableDataView tableData={mockDataWithDifferentLengths} />);
    expect(screen.getByText('data1')).toBeInTheDocument();
    expect(screen.getByText('data2')).toBeInTheDocument();
    expect(screen.getByText('data3')).toBeInTheDocument();
    expect(screen.queryByText('data4')).not.toBeInTheDocument();
  });

  it('should render the column headers correctly', () => {
    const mockData = {
      'Origin values': ['BD', 'HD'],
      'Origin total': [2260, 1865],
    };
    render(<TableDataView tableData={mockData} />);
    expect(screen.getByText('Origin values')).toBeInTheDocument();
    expect(screen.getByText('Origin total')).toBeInTheDocument();
  });

  it('should render data correctly when tableData prop is null', () => {
    render(<TableDataView tableData={null} />);
    expect(screen.getByText('No compatible data')).toBeInTheDocument();
  });

  it('should render data correctly when tableData prop is not provided', () => {
    render(<TableDataView />);
    expect(screen.getByText('No compatible data')).toBeInTheDocument();
  });

  it('should render each cell correctly', () => {
    const mockData = {
      'Origin values': ['BD', 'HD'],
    };
    render(<TableDataView tableData={mockData} />);
    expect(screen.getByText('BD')).toBeInTheDocument();
    expect(screen.getByText('HD')).toBeInTheDocument();
  });

  it('should handle empty strings in data gracefully', () => {
    const mockData = {
      'Origin values': ['BD', ''],
    };
    render(<TableDataView tableData={mockData} />);
    expect(screen.getByText('BD')).toBeInTheDocument();
    // Ensure an empty cell doesn't throw an error
  });

  it('should handle null values in data gracefully', () => {
    const mockData = {
      'Origin values': ['BD', null],
    };
    render(<TableDataView tableData={mockData} />);
    expect(screen.getByText('BD')).toBeInTheDocument();
    // Ensure a null cell doesn't throw an error
  });

  it('should display elastic-connector-view', () => {
    const mockData = {
      'Origin values': ['BD', null],
    };
    const { container } = render(<TableDataView tableData={mockData} />);
    const modalElement = container.querySelector('.elastic-connector-view');
    expect(modalElement).toBeInTheDocument();
  });

  it('should display dataview-table-header-cell', () => {
    const mockData = {
      'Origin values': ['BD', null],
    };
    const { container } = render(<TableDataView tableData={mockData} />);
    const modalElement = container.querySelector('.dataview-table-header-cell');
    expect(modalElement).toBeInTheDocument();
  });

  it('should display no-data-message', () => {
    const mockData = '';
    const { container } = render(<TableDataView tableData={mockData} />);
    const modalElement = container.querySelector('.no-data-message');
    expect(modalElement).toBeInTheDocument();
  });
});
