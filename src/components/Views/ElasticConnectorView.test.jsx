import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';

import ElasticConnectorView from './ElasticConnectorView';

window.URL.createObjectURL = jest.fn(() => 'test');
window.__SERVER__ = false;

describe('ElasticConnectorView', () => {
  const id = 'elastic-connector-config';

  const IntlWrapper = ({ children }) => (
    <IntlProvider locale="en">{children}</IntlProvider>
  );

  it('should display view', () => {
    const { container } = render(<ElasticConnectorView tableData={{}} />, {
      wrapper: IntlWrapper,
    });
    waitFor(() => expect(container.querySelector(id)).toBeInTheDocument());
  });
});
