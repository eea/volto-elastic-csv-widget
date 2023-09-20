import React from 'react';
import { Container } from 'semantic-ui-react';
import DataView from '../DataView/DataView';
import './styles.less';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';

const isEmpty = (object) => {
  return Object.keys(object).length === 0;
};

const ElasticConnectorConfigView = ({ content, tableData }) => {
  const title = content?.title;

  const connectorConfig = content?.elastic_csv_widget?.formValue;

  const not_agg_fields =
    connectorConfig && connectorConfig.length > 0
      ? connectorConfig?.fields.map((field) => field.field)
      : [];

  const fields = connectorConfig?.use_aggs
    ? [
        `${connectorConfig?.agg_field}_count`,
        `${connectorConfig?.agg_field}_values`,
      ]
    : not_agg_fields;

  return (
    <Container className="elastic-connector-config">
      <h2>{title}</h2>
      <h4>Index: {connectorConfig?.index || 'Not selected'}</h4>
      <h4>Website: {connectorConfig?.website || 'Not selected'}</h4>
      <h4>Content type: {connectorConfig?.content_type || 'Not selected'}</h4>
      {Object.keys(tableData).length > 0 && (
        <>
          <h4>Use aggregations: {connectorConfig?.use_aggs ? 'Yes' : 'No'}</h4>
          <h4>Fields: {fields.map((field) => field).join(', ')}</h4>
        </>
      )}
      {tableData ? '' : <p>No table data.</p>}
    </Container>
  );
};

const ElasticConnectorView = ({ provider_data, content }) => {
  const tableData =
    provider_data && !isEmpty(provider_data) ? provider_data : '';

  return (
    <>
      <ElasticConnectorConfigView content={content} tableData={tableData} />
      {tableData && <DataView tableData={tableData} />}
    </>
  );
};

export default compose(
  connectToProviderData((props) => {
    return {
      provider_url: props.location.pathname,
    };
  }),
)(ElasticConnectorView);
