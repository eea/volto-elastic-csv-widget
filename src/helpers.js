const createAggregatedPayload = (payloadConfig) => {
  const {
    objectProvides = '',
    cluster_name = '',
    index = '',
    //size = 10000,
    size = 100,
    use_aggs,
    agg_fields,
  } = payloadConfig;

  let mustQueries = [
    { match_all: {} },
    {
      constant_score: {
        filter: {
          bool: {
            should: [
              {
                bool: {
                  must_not: {
                    exists: {
                      field: 'expires',
                    },
                  },
                },
              },
              {
                range: {
                  expires: {
                    gte: '2023-08-31T13:32:08Z',
                  },
                },
              },
            ],
          },
        },
      },
    },
    {
      bool: {
        should: [
          {
            range: {
              readingTime: {},
            },
          },
        ],
        minimum_should_match: 1,
      },
    },
    {
      term: { hasWorkflowState: 'published' },
    },
  ];

  if (cluster_name) {
    mustQueries.push({
      bool: {
        should: [{ term: { cluster_name: cluster_name } }],
        minimum_should_match: 1,
      },
    });
  }

  if (objectProvides) {
    mustQueries.push({
      bool: {
        should: [{ term: { objectProvides: objectProvides } }],
        minimum_should_match: 1,
      },
    });
  }

  // Define default aggregations
  let aggregations = {
    objectProvides: {
      terms: {
        field: 'objectProvides',
        size: 1000000,
      },
    },
    cluster_name: {
      terms: {
        field: 'cluster_name',
        size: 1000000,
      },
    },
  };

  // Add aggregation for agg_field if use_aggs and agg_field are true
  if (use_aggs && agg_fields.length > 0) {
    agg_fields.forEach((agg_field) => {
      aggregations[agg_field.field] = {
        terms: {
          field: `${agg_field.field}.keyword`,
          size: 1000000,
        },
      };
    });
  }

  return {
    index,
    query: {
      function_score: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
      },
    },
    aggs: aggregations,
    size: size,
    source: { exclude: ['embedding'] },
    track_total_hits: true,
  };
};

const buildTableFromFields = (items, fields) => {
  let table = {};

  fields.forEach((fieldObj) => {
    // Get the field name from the field object.
    let fieldName = fieldObj.field;
    const fieldLabel = fieldObj.title ? fieldObj.title : fieldObj.field;

    // For each field, extract values from all items.
    table[fieldLabel] = items.map((item) => item._source[fieldName]);
  });

  return table;
};

const buildTableFromAggs = (data, fields) => {
  let table = {};
  fields.forEach((field) => {
    const fieldLabel = field.title ? field.title + ' ' : field.field + '_';
    let valuesColumn = `${fieldLabel}values`;
    let countColumn = `${fieldLabel}count`;

    table = { ...table, [valuesColumn]: [], [countColumn]: [] };
    data.forEach((bucket) => {
      if (Object.keys(bucket)[0] === field.field) {
        Object.values(bucket)[0].forEach((currentBucket) => {
          // Add the bucket key and doc_count to the table.
          table[valuesColumn].push(currentBucket.key);
          table[countColumn].push(currentBucket.doc_count);
        });
      }
    });
  });

  return table;
};

export { createAggregatedPayload, buildTableFromFields, buildTableFromAggs };
