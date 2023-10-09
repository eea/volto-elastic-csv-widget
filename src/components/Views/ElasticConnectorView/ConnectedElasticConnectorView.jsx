import React from 'react';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import ElasticConnectorView from './components/ElasticConnectorView';

const ConnectedElasticConnectorView = (props) => {
  return <ElasticConnectorView {...props} />;
};

export default compose(
  connectToProviderData((props) => {
    return {
      provider_url: props.location.pathname,
    };
  }),
)(ConnectedElasticConnectorView);
