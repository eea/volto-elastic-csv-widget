import React, { useState, useEffect } from 'react';
import { Button, Modal, Grid, Label } from 'semantic-ui-react';
import { map } from 'lodash';
import axios from 'axios';

import { FormFieldWrapper } from '@plone/volto/components';

const createPayload = (query) => {
  return {
    query: {
      function_score: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  minimum_should_match: '75%',
                  fields: [
                    'title^2',
                    'subject^1.5',
                    'description^1.5',
                    'all_fields_for_freetext',
                  ],
                },
              },
            ],
          },
        },
        functions: [
          { exp: { 'issued.date': { offset: '30d', scale: '1800d' } } },
        ],
        score_mode: 'sum',
      },
    },
    aggs: {},
    size: 10,
    index: 'data_searchui',
    source: { exclude: ['embedding'] },
    track_total_hits: true,
  };
};

const WidgetModalEditor = ({ value: propValue, onChange, onClose }) => {
  const [value, setValue] = useState(propValue);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  useEffect(() => {
    if (query) {
      axios
        .post('/marine/_es/globalsearch/_search', createPayload(query))
        .then((response) => {
          setResults(response.data.hits.hits);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [query]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

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
