import ConnectedElasticConnectorView from './components/Views/ElasticConnectorView/ConnectedElasticConnectorView';
import Elastic2CSVWidget from './components/Widgets/Elastic2CSVWidget';

const applyConfig = (config) => {
  //elasticconnector view
  config.views.contentTypesViews.elasticconnector =
    ConnectedElasticConnectorView;

  //elastic connector elastic_csv_widget
  config.widgets.id.elastic_csv_widget = Elastic2CSVWidget;

  return config;
};

export default applyConfig;
