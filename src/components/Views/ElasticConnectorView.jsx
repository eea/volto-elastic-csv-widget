import React from 'react';
import DataView from '../DataView/DataView';

const ElasticConnectorView = (props) => {
  const tableData = props?.content.elastic_csv_widget?.tableData;

  console.log(props?.content.elastic_csv_widget, 'elasticdata');

  return <>{tableData && <DataView tableData={tableData} />}</>;
};

export default ElasticConnectorView;
