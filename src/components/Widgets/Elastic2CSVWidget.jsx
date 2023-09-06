/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Modal, Grid, Label } from 'semantic-ui-react';
import { map } from 'lodash';
import axios from 'axios';

import { FormFieldWrapper, InlineForm } from '@plone/volto/components';
import { createAggregatedPayload } from '../../helpers';

import PanelsSchema from './panelsSchema';
import DataView from '../DataView/DataView';

const WidgetModalEditor = ({ onChange, onClose, block, value }) => {
  const [results, setResults] = useState({});
  const [intValue, setIntValue] = React.useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [hits, setHits] = useState([]);

  useEffect(() => {
    const payloadConfig = {
      objectProvides: intValue.content_type,
      cluster_name: intValue.website,
      index: intValue.index,
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
      })
      .catch((error) => {
        setIsLoading(false);

        // console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intValue.index, intValue.content_type, intValue.website]);

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
              <DataView hits={hits} fields={intValue?.fields} />
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
                onClick={() => onChange(intValue)}
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
