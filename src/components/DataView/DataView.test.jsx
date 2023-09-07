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
});
