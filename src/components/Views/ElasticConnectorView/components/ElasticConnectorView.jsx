import React from 'react';
import ElasticConnectorConfigView from './ElasticConnectorConfigView';
import DataViewWrapper from './DataViewWrapper';

const isEmpty = (object) => {
  return Object.keys(object).length === 0;
};

const ElasticConnectorView = ({ provider_data, content }) => {
  const tableData =
    provider_data && !isEmpty(provider_data) ? provider_data : '';

  return (
    <>
      <ElasticConnectorConfigView content={content} tableData={tableData} />
      <DataViewWrapper tableData={tableData} />
    </>
  );
};

export default ElasticConnectorView;
