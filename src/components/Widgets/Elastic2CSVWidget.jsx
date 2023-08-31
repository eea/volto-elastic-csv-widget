import React, { useState, useEffect } from 'react';
import { Button, Modal, Grid, Label } from 'semantic-ui-react';
import { map } from 'lodash';
import axios from 'axios';

import { FormFieldWrapper } from '@plone/volto/components';
import { createAggregatedPayload } from '../../helpers';

export const payloadConfig = {
  //objectProvides: 'Page',
  cluster_name: 'wise-marine',
  index: 'wisetest_searchui',
};

const WidgetModalEditor = ({ value: propValue, onChange, onClose }) => {
  const [value, setValue] = useState(propValue);
  const [results, setResults] = useState([]);

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  useEffect(() => {
    axios
      .post(
        '/marine/_es/globalsearch/_search',
        createAggregatedPayload(payloadConfig),
      )
      .then((response) => {
        console.log('full resp', response);
        setResults(response.data.hits.hits);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleQueryChange = (e) => {};

  console.log('results', results);
  return (
    <Modal open={true} size="fullscreen" className="chart-editor-modal">
      <Modal.Content scrolling>
        {/* insert content here */}
        <p>es databuilder widget</p>
        <input onChange={handleQueryChange} />

        <h2>Results</h2>
        {results &&
          results.length > 0 &&
          results.map((item, index) => {
            return <div key={index}>_id : {item._id}</div>;
          })}
      </Modal.Content>
      <Modal.Actions>
        <Grid>
          <Grid.Row>
            <Grid.Column computer={12} tablet={12} verticalAlign="middle">
              <Button primary floated="right" onClick={() => onChange(value)}>
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

  const handleModalChange = (value) => {
    onChange(id, {
      value,
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
          onChange={handleModalChange}
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
