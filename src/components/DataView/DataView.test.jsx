import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DataView from './DataView';

describe('DataView', () => {
  it('should render the component', () => {
    const mockData = {
      column1: ['data1', 'data2'],
    };
    render(<DataView tableData={mockData} />);
    expect(screen.getByText('data1')).toBeInTheDocument();
  });

  it('should display "No compatible data" message when there is no data', () => {
    render(<DataView tableData={{}} />);
    expect(screen.getByText('No compatible data')).toBeInTheDocument();
  });

  it('should handle undefined columns gracefully', () => {
    const mockDataWithUndefined = {
      column1: ['data1', 'data2'],
      undefined: ['data3', 'data4'],
    };
    render(<DataView tableData={mockDataWithUndefined} />);
    expect(screen.getByText('data1')).toBeInTheDocument();
    expect(screen.getByText('data2')).toBeInTheDocument();
  });

  it('should handle columns with no data gracefully', () => {
    const mockDataWithEmptyColumn = {
      column1: ['data1', 'data2'],
      column2: [],
    };
    render(<DataView tableData={mockDataWithEmptyColumn} />);
    expect(screen.getByText('data1')).toBeInTheDocument();
    expect(screen.getByText('data2')).toBeInTheDocument();
  });

  it('should render all rows and columns correctly', () => {
    const mockData = {
      column1: ['data1', 'data2'],
      column2: ['data3', 'data4'],
    };
    render(<DataView tableData={mockData} />);
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
    render(<DataView tableData={mockDataWithDifferentLengths} />);
    expect(screen.getByText('data1')).toBeInTheDocument();
    expect(screen.getByText('data2')).toBeInTheDocument();
    expect(screen.getByText('data3')).toBeInTheDocument();
    expect(screen.queryByText('data4')).not.toBeInTheDocument();
  });

  // New test cases to enhance coverage
  it('should render the column headers correctly', () => {
    const mockData = {
      'Origin values': ['BD', 'HD'],
      'Origin total': [2260, 1865],
    };
    render(<DataView tableData={mockData} />);
    expect(screen.getByText('Origin values')).toBeInTheDocument();
    expect(screen.getByText('Origin total')).toBeInTheDocument();
  });

  it('should render data correctly when tableData prop is null', () => {
    render(<DataView tableData={null} />);
    expect(screen.getByText('No compatible data')).toBeInTheDocument();
  });

  it('should render data correctly when tableData prop is not provided', () => {
    render(<DataView />);
    expect(screen.getByText('No compatible data')).toBeInTheDocument();
  });

  it('should render each cell correctly', () => {
    const mockData = {
      'Origin values': ['BD', 'HD'],
    };
    render(<DataView tableData={mockData} />);
    expect(screen.getByText('BD')).toBeInTheDocument();
    expect(screen.getByText('HD')).toBeInTheDocument();
  });

  it('should handle empty strings in data gracefully', () => {
    const mockData = {
      'Origin values': ['BD', ''],
    };
    render(<DataView tableData={mockData} />);
    expect(screen.getByText('BD')).toBeInTheDocument();
    // Ensure an empty cell doesn't throw an error
  });

  it('should handle null values in data gracefully', () => {
    const mockData = {
      'Origin values': ['BD', null],
    };
    render(<DataView tableData={mockData} />);
    expect(screen.getByText('BD')).toBeInTheDocument();
    // Ensure a null cell doesn't throw an error
  });
});
