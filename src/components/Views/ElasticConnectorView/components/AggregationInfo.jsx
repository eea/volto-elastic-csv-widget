import React from 'react';
import InfoLine from './InfoLine';

const AggregationInfo = ({ connectorConfig, fields }) => (
  <>
    <InfoLine
      label="Use aggregations"
      value={connectorConfig?.use_aggs ? 'Yes' : 'No'}
    />
    <InfoLine label="Fields" value={fields.join(', ')} />
  </>
);

export default AggregationInfo;
