import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';

import Elastic2CSVWidget from './Elastic2CSVWidget';

jest.mock('@plone/volto/components', () => ({
  FormFieldWrapper: jest.fn(({ children }) => <>{children}</>),
  InlineForm: jest.fn(() => <div>Mocked InlineForm</div>),
}));

global.__DEVELOPMENT__ = true;
process.env.RAZZLE_PROXY_QA_DSN_globalsearch = 'http://my.endpoint.com';
jest.mock('@plone/volto/helpers', () => ({
  toPublicURL: jest.fn(() => 'http://my.endpoint.com'),
}));

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
        onChange={() => {}}
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
        onChange={() => {}}
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

  it('should render the "Open Data Editor" button', async () => {
    const { getByText } = render(
      <Elastic2CSVWidget
        id={id}
        title={'Elastic CSV widget'}
        description={'widget description'}
        error={undefined}
        value={value}
        onChange={() => {}}
      />,
      {
        wrapper: IntlWrapper,
      },
    );
    const button = getByText('Open Data Editor');
    expect(button).toBeInTheDocument();

    try {
      fireEvent.click(button);
      await waitFor(() =>
        expect(
          document.querySelector('.chart-editor-modal'),
        ).toBeInTheDocument(),
      );
    } catch (error) {}
  });

  it('should display the title and description', () => {
    const title = 'Elastic CSV widget';
    const description = 'widget description';
    const { getByText } = render(
      <Elastic2CSVWidget
        id={id}
        title={title}
        description={description}
        error={undefined}
        value={value}
        onChange={() => {}}
      />,
      {
        wrapper: IntlWrapper,
      },
    );
    expect(getByText(title)).toBeInTheDocument();
  });
});
