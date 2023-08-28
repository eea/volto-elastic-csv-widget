import ElasticConnectorView from "./components/Views/ElasticConnectorView";

const applyConfig = (config) => {

  //elasticconnector view
  config.views.contentTypesViews.elasticconnector = ElasticConnectorView;
 
  //elastic connector elastic_csv_widget 
  config.widgets.views.id.elastic_csv_widget = Elastic2CSVWidget


  return config;
};

export default applyConfig;
