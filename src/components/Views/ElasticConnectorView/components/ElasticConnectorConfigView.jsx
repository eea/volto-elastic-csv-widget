/* eslint-disable no-unused-expressions */

import React from 'react';
import { Container } from 'semantic-ui-react';
import Title from './Title';
import InfoLine from './InfoLine';
import AggregationInfo from './AggregationInfo';

const ElasticConnectorConfigView = ({ content, tableData }) => {
  const title = content?.title;

  const connectorConfig = content?.elastic_csv_widget?.formValue;

  const not_agg_fields =
    connectorConfig &&
    Object.keys(connectorConfig).length > 0 &&
    connectorConfig?.fields &&
    connectorConfig.fields.length > 0
      ? connectorConfig?.fields.map((field) => field.field)
      : [];

  let fields = [];

  if (connectorConfig?.use_aggs && connectorConfig?.agg_fields) {
    connectorConfig?.agg_fields.forEach((field) => {
      fields = [...fields, `${field?.field}_count`, `${field?.field}_values`];
    });
  } else fields = [...fields, ...not_agg_fields];

  return (
    <Container className="elastic-connector-config">
      <Title text={title} />
      <InfoLine label="Index" value={connectorConfig?.index} />
      <InfoLine label="Website" value={connectorConfig?.website} />
      <InfoLine label="Content type" value={connectorConfig?.content_type} />
      {Object.keys(tableData).length > 0 && (
        <AggregationInfo connectorConfig={connectorConfig} fields={fields} />
      )}
      {!tableData && <p>No table data.</p>}
    </Container>
  );
};

export default ElasticConnectorConfigView;
