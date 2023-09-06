import React from 'react';
import { Container } from 'semantic-ui-react';
import { Table } from 'semantic-ui-react';

import './styles.less';

function buildTable(items, fields) {
  let table = {};

  fields.forEach((fieldObj) => {
    // Get the field name from the field object.
    let fieldName = fieldObj.field;

    // For each field, extract values from all items.
    table[fieldName] = items.map((item) => item._source[fieldName]);
  });

  return table;
}

const DataView = (props) => {
  const [tableData, setTableData] = React.useState({});
  const [columns, setColumns] = React.useState([]);

  const row_size = props.hits.length;

  React.useEffect(() => {
    const newData =
      props.hits &&
      props?.hits.length > 0 &&
      props?.fields &&
      props?.fields.length > 0
        ? buildTable(props.hits, props?.fields)
        : {};
    setTableData(newData);
    setColumns(Object.keys(newData || {}));
  }, [props.hits, props.fields]);

  return (
    <Container className="elastic-connector-view">
      <div style={{ overflow: 'auto', width: '100%' }}>
        {row_size ? (
          <Table textAlign="left" striped>
            <Table.Header>
              <Table.Row>
                {columns.map((column) => (
                  <Table.HeaderCell key={column}>
                    {column && column !== 'undefined' ? column : ''}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Array(Math.max(0, row_size))
                .fill()
                .map((_, i) => (
                  <Table.Row key={i}>
                    {columns.map((column, j) => (
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
