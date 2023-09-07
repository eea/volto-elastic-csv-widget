import React from 'react';
import DataView from '../DataView/DataView';

const ElasticConnectorView = (props) => {
  const tableData = props?.content.elastic_csv_widget?.tableData;

  return <>{tableData && <DataView tableData={tableData} />}</>;
};

export default ElasticConnectorView;
