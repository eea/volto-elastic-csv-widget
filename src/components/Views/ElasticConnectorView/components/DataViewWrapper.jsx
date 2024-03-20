import React from 'react';
import TableDataView from '../../../TableDataView/TableDataView';

const DataViewWrapper = ({ tableData }) =>
  tableData ? <TableDataView tableData={tableData} /> : 'No table data';

export default DataViewWrapper;
