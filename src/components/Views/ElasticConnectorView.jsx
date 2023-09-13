import React from 'react';
import { Container } from 'semantic-ui-react';
import DataView from '../DataView/DataView';
import './styles.less';

const ElasticConnectorConfigView = ({ content, tableData }) => {
  const title = content?.title;

  return (
    <Container className="elastic-connector-config">
      <h2>{title}</h2>
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
