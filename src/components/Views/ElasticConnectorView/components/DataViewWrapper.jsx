import React from 'react';
import TableDataView from '../../../DataView/DataView';

const DataViewWrapper = ({ tableData }) =>
  tableData ? <TableDataView tableData={tableData} /> : 'No table data';

export default DataViewWrapper;
