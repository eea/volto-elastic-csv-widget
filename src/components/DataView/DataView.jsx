import React from 'react';
import { Container } from 'semantic-ui-react';
import { Table } from 'semantic-ui-react';

import './styles.less';

const DataView = ({ tableData }) => {
  const rows =
    tableData && Object.keys(tableData).length > 0 && Object.keys(tableData)[0]
      ? tableData[Object.keys(tableData)[0]].length
      : 0;

  return (
    <Container className="elastic-connector-view">
      <div style={{ overflow: 'auto', width: '100%' }}>
        {rows ? (
          <Table textAlign="left" striped>
            <Table.Header>
              <Table.Row>
                {Object.keys(tableData || {}).map((column) => (
                  <Table.HeaderCell key={column}>
                    {column && column !== 'undefined' ? column : ''}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Array(Math.max(0, rows))
                .fill()
                .map((_, i) => (
                  <Table.Row key={i}>
                    {Object.keys(tableData || {}).map((column, j) => (
                      <Table.Cell key={`${i}-${column}}`}>
                        {tableData && tableData[column] && tableData[column][i]
                          ? tableData[column][i]
                          : ''}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        ) : (
          <p>No data</p>
        )}
      </div>
    </Container>
  );
};

export default DataView;
