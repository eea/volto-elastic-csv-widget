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
});
