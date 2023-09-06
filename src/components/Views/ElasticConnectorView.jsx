import React from 'react';
import DataView from '../DataView/DataView';

const ElasticConnectorView = (props) => {
  const fields = props?.content.elastic_csv_widget?.fields;
  const hits = props?.content.elastic_csv_widget?.hits;

  return <>{hits && fields && <DataView hits={hits} fields={fields} />}</>;
};

export default ElasticConnectorView;
