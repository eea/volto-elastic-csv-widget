import React from 'react';

const InfoLine = ({ label, value }) => (
  <h4>
    {label}: {value || 'Not selected'}
  </h4>
);

export default InfoLine;
