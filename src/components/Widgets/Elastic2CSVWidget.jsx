/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Modal, Grid, Label } from 'semantic-ui-react';
import { map } from 'lodash';
import axios from 'axios';

import isEqual from 'lodash/isEqual';

import config from '@plone/volto/registry';

import { FormFieldWrapper, InlineForm } from '@plone/volto/components';

import { toPublicURL } from '@plone/volto/helpers';

import {
  buildTableFromFields,
  buildTableFromAggs,
  createAggregatedPayload,
} from '../../helpers';

import PanelsSchema from './panelsSchema';
import DataView from '../DataView/DataView';

import './styles.less';

const WidgetModalEditor = ({ onChange, onClose, block, value }) => {
  const [results, setResults] = useState({});
  const [formValue, setFormValue] = React.useState(
    value?.formValue ? value.formValue : {},
  );
  const [elasticQueryConfig, setElasticQueryConfig] = React.useState(
    value?.elasticQueryConfig ? value.elasticQueryConfig : {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hits, setHits] = useState([]);
  const [aggBuckets, setAggBuckets] = useState([]);

  const [tableData, setTableData] = React.useState(value?.tableData);
  const [emptyFields, setEmptyFields] = React.useState([]);

  const {
    index = '',
    fields = [],
    website = '',
    content_type = '',
    use_aggs = false,
    agg_fields = [],
  } = formValue;

  const row_size = hits.length;

  const previousPayloadConfigRef = React.useRef(null);

  const stringifiedAggFields = JSON.stringify(agg_fields);
  const stringifiedFields = JSON.stringify(fields);

  useEffect(() => {
    const es_endpoint = toPublicURL(`/_es/globalsearch/_search/`);

    const payloadConfig = {
      objectProvides: content_type,
      cluster_name: website,
      index: index,
      agg_fields,
      use_aggs,
    };

    setElasticQueryConfig({
      es_endpoint,
      payloadConfig: createAggregatedPayload(payloadConfig),
    });

    if (isEqual(payloadConfig, previousPayloadConfigRef.current)) {
      return; // Payload hasn't changed, so we don't make a new request.
    }

    previousPayloadConfigRef.current = payloadConfig;

    const cancelTokenSource = axios.CancelToken.source(); // Create a cancel token source
    setIsLoading(true);

    axios
      .post(es_endpoint, createAggregatedPayload(payloadConfig), {
        cancelToken: cancelTokenSource.token,
      })
      .then((response) => {
        setIsLoading(false);

        setResults(response.data);

        if (response?.data?.hits?.hits) {
          setHits(response.data.hits.hits);
          setFormValue((prevFormValue) => ({
            ...prevFormValue,
            hits: response.data.hits.hits,
          }));
        }

        if (response.data.aggregations && agg_fields.length > 0 && use_aggs) {
          let buckets = [];
          agg_fields.forEach((agg_field) => {
            if (response.data.aggregations[agg_field.field]?.buckets) {
              let bucketObj = {};
              bucketObj[agg_field.field] =
                response.data.aggregations[`${agg_field.field}`].buckets;
              buckets = [...buckets, bucketObj];
            }
            setAggBuckets(buckets);
          });
        }
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
        }
      });

    return () => {
      // Cancel the request if the component is unmounted or the effect runs again
      cancelTokenSource.cancel();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content_type, website, index, use_aggs, stringifiedAggFields]);

  useEffect(() => {
    let nextTableData = {};

    if (use_aggs && agg_fields.length > 0) {
      const dataFromAggs =
        aggBuckets && aggBuckets.length > 0
          ? buildTableFromAggs(aggBuckets, agg_fields)
          : {};

      if (Object.keys(dataFromAggs).length > 0) {
        nextTableData = dataFromAggs;
      }
    } else if (
      hits &&
      hits.length > 0 &&
      fields &&
      fields.length > 0 &&
      !use_aggs
    ) {
      const dataFromHits = buildTableFromFields(hits, fields);

      if (Object.keys(dataFromHits).length > 0) {
        nextTableData = dataFromHits;
      }
    }

    if (!isEqual(nextTableData, tableData)) {
      setTableData(nextTableData);
    }
  }, [
    hits,
    stringifiedFields,
    aggBuckets,
    stringifiedAggFields,
    use_aggs,
    tableData,
  ]);

  let schema = PanelsSchema({
    data: formValue,
    aggs: results?.aggregations,
    hits: results?.hits,
  });

  const handleChangeField = (val, id) => {
    setFormValue({ ...formValue, [id]: val });
  };

  const getEmptyFields = () => {
    let emptyFields = [];

    // Check for empty string fields
    if (!index) emptyFields.push('index');
    if (!website) emptyFields.push('website');
    if (!content_type) emptyFields.push('content_type');

    // Conditionally check for agg_field or fields based on use_aggs
    if (use_aggs) {
      if (agg_fields.length === 0) emptyFields.push('agg_fields');
    } else {
      if (fields.length === 0) emptyFields.push('fields');
    }

    return emptyFields;
  };

  React.useEffect(() => {
    setEmptyFields(getEmptyFields());
  }, [
    index,
    website,
    content_type,
    use_aggs,
    stringifiedAggFields,
    stringifiedFields,
  ]);

  return (
    <Modal open={true} size="fullscreen" className="chart-editor-modal">
      <Modal.Content scrolling>
        <Grid stackable reversed="mobile vertically tablet vertically">
          <Grid.Column
            mobile={12}
            tablet={12}
            computer={5}
            className="map-editor-column"
          >
            <InlineForm
              block={block}
              schema={schema}
              onChangeField={(id, value) => {
                handleChangeField(value, id);
              }}
              formData={formValue}
            />
          </Grid.Column>
          <Grid.Column mobile={12} tablet={12} computer={7}>
            <div className="dataview-container">
              {isLoading && (
                <p className="elastic-data-loader">
                  <span>L</span>
                  <span>o</span>
                  <span>a</span>
                  <span>d</span>
                  <span>i</span>
                  <span>n</span>
                  <span>g</span>
                  <span> </span>
                  <span>d</span>
                  <span>a</span>
                  <span>t</span>
                  <span>a</span>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </p>
              )}
              {emptyFields.length === 0 ? (
                <>{!isLoading && <DataView tableData={tableData} />}</>
              ) : (
                <div>
                  <h4>Please complete the following fields:</h4>
                  <ul>
                    {emptyFields.map((field, index) => (
                      <li key={index}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Grid.Column>
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={12} tablet={12} verticalAlign="middle">
              <Button
                primary
                floated="right"
                onClick={() =>
                  onChange({
                    formValue: formValue,
                    elasticQueryConfig,
                  })
                }
              >
                Apply changes
              </Button>
              <Button floated="right" onClick={onClose}>
                Close
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Actions>
    </Modal>
  );
};

const Elastic2CSVWidget = ({
  id,
  title,
  description,
  error,
  value: propValue,
  onChange,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const [value, setValue] = useState(propValue);

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  const handleModalChange = (val) => {
    onChange(id, {
      ...val,
    });
    setShowEditor(false);
  };

  if (__SERVER__) return '';

  return (
    <FormFieldWrapper {...{ id, title, description, error, value }} columns={1}>
      <div className="wrapper">
        <label htmlFor={`field-${id}`}>{title}</label>
        <Button
          floated="right"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowEditor(true);
          }}
        >
          Open Data Editor
        </Button>
      </div>
      {description && <p className="help">{description}</p>}
      {showEditor ? (
        <WidgetModalEditor
          value={value}
          onChange={(val) => handleModalChange(val)}
          onClose={() => setShowEditor(false)}
        />
      ) : (
        ''
      )}
      {map(error, (message) => (
        <Label key={message} basic color="red" pointing>
          {message}
        </Label>
      ))}
    </FormFieldWrapper>
  );
};

export default Elastic2CSVWidget;
