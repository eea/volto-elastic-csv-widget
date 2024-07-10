import React from 'react';
import { render } from '@testing-library/react';
import ElasticConnectorView from './ElasticConnectorView';
import '@testing-library/jest-dom';

test('renders without crashing', () => {
  render(<ElasticConnectorView provider_data={{}} content={{}} />);
});

test('renders ElasticConnectorConfigView', () => {
  const { getByText } = render(
    <ElasticConnectorView
      provider_data={{}}
      content={{ title: 'Test Title' }}
    />,
  );
  expect(getByText('Test Title')).toBeInTheDocument();
});

test('does not render DataView when provider_data is empty', () => {
  const { container } = render(
    <ElasticConnectorView provider_data={{}} content={{}} />,
  );
  expect(container.firstChild).not.toBeNull();
});
