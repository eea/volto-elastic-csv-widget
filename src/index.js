import EsConnectorView from './components/Views/ElasticConnectorView/ConnectedElasticConnectorView';
import Elastic2CSVWidget from './components/Widgets/Elastic2CSVWidget/Elastic2CSVWidget';
import PayloadWidget from './components/Widgets/PayloadWidget/PayloadWidget';

const applyConfig = (config) => {
  //elasticconnector view
  config.views.contentTypesViews.elasticconnector = EsConnectorView;

  //elastic connector elastic_csv_widget
  config.widgets.id.elastic_csv_widget = Elastic2CSVWidget;
  config.widgets.id.raw_payload_widget = PayloadWidget;

  return config;
};

export default applyConfig;
