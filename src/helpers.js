const createAggregatedPayload = (payloadConfig) => {
  const {
    objectProvides = '',
    cluster_name = '',
    index = '',
    //size = 10000,
    size = 100,
    use_aggs,
    agg_field,
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
  if (use_aggs && agg_field) {
    aggregations[agg_field] = {
      terms: {
        field: `${agg_field}.keyword`,
        size: 1000000,
      },
    };
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

    // For each field, extract values from all items.
    table[fieldName] = items.map((item) => item._source[fieldName]);
  });

  return table;
};

const buildTableFromAggs = (data, fieldName) => {
  let valuesColumn = `${fieldName}_values`;
  let countColumn = `${fieldName}_count`;

  let table = {
    [valuesColumn]: [],
    [countColumn]: [],
  };

  data.forEach((bucket) => {
    // Add the bucket key and doc_count to the table.
    table[valuesColumn].push(bucket.key);
    table[countColumn].push(bucket.doc_count);
  });

  return table;
};

export { createAggregatedPayload, buildTableFromFields, buildTableFromAggs };
