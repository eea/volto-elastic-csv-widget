import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';

import Elastic2CSVWidget from './Elastic2CSVWidget';

window.URL.createObjectURL = jest.fn(() => 'test');
window.__SERVER__ = false;

describe('Elastic2CSVWidget', () => {
  const id = 'elastic_csv_widget';
  const value = {
    content_type: 'Shipping and Ports Measure',
    fields: [],
    hits: [],
    index: 'wisetest_searchui',
    website: 'wise-marine',
  };

  const IntlWrapper = ({ children }) => (
    <IntlProvider locale="en">{children}</IntlProvider>
  );

  it('should render the component', () => {
    const { container } = render(
      <Elastic2CSVWidget
        id={id}
        title={'Elastic CSV widget'}
        description={'widget description'}
        error={undefined}
        value={value}
        onChange
      />,
      {
        wrapper: IntlWrapper,
      },
    );
    waitFor(() =>
      expect(container.querySelector(`.${`field-${id}`}`)).toBeInTheDocument(),
    );
  });

  it('should display widget modal editor', () => {
    const { container } = render(
      <Elastic2CSVWidget
        id={id}
        title={'Elastic CSV widget'}
        description={'widget description'}
        error={undefined}
        value={value}
        onChange
      />,
      {
        wrapper: IntlWrapper,
      },
    );
    waitFor(() =>
      expect(
        container.querySelector('.chart-editor-modal'),
      ).toBeInTheDocument(),
    );
  });
});
