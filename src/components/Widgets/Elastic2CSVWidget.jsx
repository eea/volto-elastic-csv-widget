/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Modal, Grid, Label } from 'semantic-ui-react';
import { map } from 'lodash';
import axios from 'axios';

import { FormFieldWrapper, InlineForm } from '@plone/volto/components';
import {
  buildTableFromFields,
  buildTableFromAggs,
  createAggregatedPayload,
} from '../../helpers';

import PanelsSchema from './panelsSchema';
import DataView from '../DataView/DataView';

const WidgetModalEditor = ({ onChange, onClose, block, value }) => {
  const [results, setResults] = useState({});
  const [intValue, setIntValue] = React.useState(
    value?.formValue ? value.formValue : {},
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hits, setHits] = useState([]);
  const [aggBuckets, setAggBuckets] = useState([]);

  const [tableData, setTableData] = React.useState(value?.tableData);

  const {
    index = '',
    fields = [],
    website = '',
    content_type = '',
    use_aggs = false,
    agg_field = '',
  } = intValue;

  const row_size = hits.length;

  useEffect(() => {
    const payloadConfig = {
      objectProvides: content_type,
      cluster_name: website,
      index: index,
      agg_field,
      use_aggs,
    };
    setIsLoading(true);
    axios
      .post('/_es/globalsearch/_search', createAggregatedPayload(payloadConfig))
      .then((response) => {
        setIsLoading(false);

        setResults(response.data);
        if (response?.data?.hits?.hits) {
          setHits(response.data.hits.hits);
          setIntValue({
            ...intValue,
            hits: response.data.hits.hits,
          });
        }
        if (
          response.data.aggregations &&
          agg_field &&
          use_aggs &&
          response.data.aggregations[agg_field]?.buckets
        ) {
          setAggBuckets(response.data.aggregations[`${agg_field}`].buckets);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content_type, website, index]);

  React.useEffect(() => {
    if (use_aggs && agg_field) {
      const dataFromAggs =
        aggBuckets && aggBuckets.length > 0
          ? buildTableFromAggs(aggBuckets, agg_field)
          : {};
      setTableData(dataFromAggs);
    } else {
      const dataFromHits =
        hits &&
        hits.length > 0 &&
        intValue?.fields &&
        intValue?.fields.length > 0
          ? buildTableFromFields(hits, intValue?.fields)
          : {};
      setTableData(dataFromHits);
    }
  }, [hits, fields, aggBuckets, agg_field, use_aggs]);

  let schema = PanelsSchema({
    data: intValue,
    aggs: results?.aggregations,
    hits: results?.hits,
  });

  const handleChangeField = (val, id) => {
    setIntValue({ ...intValue, [id]: val });
  };

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
              formData={intValue}
            />
          </Grid.Column>
          <Grid.Column mobile={12} tablet={12} computer={7}>
            <div className="dataview-container">
              {!isLoading ? <DataView tableData={tableData} /> : 'Loading...'}
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
                onClick={() => onChange({ formValue: intValue, tableData })}
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
      {/* TODO: make sure to insert a data table view.. like the view */}
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
