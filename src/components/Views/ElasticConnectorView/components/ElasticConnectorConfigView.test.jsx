import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ElasticConnectorConfigView from './ElasticConnectorConfigView';

jest.mock('./Title', () => () => <div>Title Mock</div>);
jest.mock('./InfoLine', () => () => <div>InfoLine Mock</div>);
jest.mock('./AggregationInfo', () => () => <div>AggregationInfo Mock</div>);

describe('ElasticConnectorConfigView', () => {
  test('renders without crashing', () => {
    render(<ElasticConnectorConfigView content={{}} tableData={{}} />);
  });

  test('renders content title', () => {
    render(
      <ElasticConnectorConfigView
        content={{ title: 'Test Title' }}
        tableData={{}}
      />,
    );
    expect(screen.getByText('Title Mock')).toBeInTheDocument();
  });
});
