import React from 'react';
import DataView from '../../../DataView/DataView';

const DataViewWrapper = ({ tableData }) =>
  tableData ? <DataView tableData={tableData} /> : 'No table data';

export default DataViewWrapper;
