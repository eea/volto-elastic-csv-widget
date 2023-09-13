import React from 'react';
import { Container } from 'semantic-ui-react';
import DataView from '../DataView/DataView';
import './styles.less';

const ElasticConnectorConfigView = ({ content, tableData }) => {
  const title = content?.title;
  const connectorConfig = content?.elastic_csv_widget?.formValue;

  return (
    <Container className="elastic-connector-config">
      <h2>{title}</h2>
      <h4>Index: {connectorConfig?.index || 'Not selected'}</h4>
      <h4>Website: {connectorConfig?.website || 'Not selected'}</h4>
      <h4>Content type: {connectorConfig?.content_type || 'Not selected'}</h4>
      {Object.keys(tableData).length > 0 && (
        <>
          <h4>Use aggregations: {connectorConfig?.use_aggs ? 'Yes' : 'No'}</h4>
        </>
      )}
    </Container>
  );
};
const ElasticConnectorView = (props) => {
  const tableData = props?.content.elastic_csv_widget?.tableData;

  return (
    <>
      <ElasticConnectorConfigView
        content={props?.content}
        tableData={tableData}
      />
      {tableData && <DataView tableData={tableData} />}
    </>
  );
};

export default ElasticConnectorView;
