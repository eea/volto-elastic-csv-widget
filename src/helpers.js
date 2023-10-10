const createAggregatedPayload = (payloadConfig) => {
  const {
    objectProvides = '',
    cluster_name = '',
    index = '',
    //size = 10000, 10k payload size will make the widget slower
    //using aggs and low size is better for now bc we can use small size payload
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
          // Ordering by count, but it can as well be by key, or more
          //https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html#sort-search-results
          ...(agg_field.sort && agg_field.sortBy
            ? { order: { [agg_field.sortBy]: agg_field.sort } }
            : {}),
        },
      };

      // Check if secondLevelAgg is present and is truthy
      if (agg_field.secondLevelAgg) {
        aggregations[agg_field.field].aggs = {
          [agg_field.secondLevelAgg]: {
            terms: {
              field: `${agg_field.secondLevelAgg}.keyword`,
              size: 1000000,
            },
          },
        };
      }
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
  // Check for valid input
  if (!Array.isArray(data) || !Array.isArray(fields) || fields.length === 0) {
    return {};
  }

  let table = {};

  fields.forEach((field) => {
    // Ensure valid field data
    if (!field.field && !field.title) {
      return;
    }

    const fieldLabel = field.title ? field.title + ' ' : field.field + '_';
    let valuesColumn = `${fieldLabel}values`;
    let countColumn = `${fieldLabel}total`;
    table[valuesColumn] = [];
    table[countColumn] = [];

    // Traverse through data and extract first-level values and counts
    data.forEach((datum) => {
      // Ensure the data contains necessary field
      if (!datum[field.field]) {
        return;
      }

      (datum[field.field] || []).forEach((bucket) => {
        // Check for valid bucket data
        if (bucket.key == null || typeof bucket.doc_count !== 'number') {
          return;
        }

        table[valuesColumn].push(bucket.key);
        table[countColumn].push(bucket.doc_count);

        // Handle second-level aggregation if specified
        if (field.secondLevelAgg && bucket[field.secondLevelAgg]) {
          (bucket[field.secondLevelAgg].buckets || []).forEach((subBucket) => {
            // Ensure valid sub-bucket data
            if (
              subBucket.key == null ||
              typeof subBucket.doc_count !== 'number'
            ) {
              return;
            }

            if (!table[subBucket.key]) {
              table[subBucket.key] = Array(table[valuesColumn].length - 1).fill(
                0,
              );
            }
            table[subBucket.key].push(subBucket.doc_count);
          });

          // Ensure all columns have the same length after each push to the table
          const maxColLength = Math.max(
            ...Object.values(table).map((col) => col.length),
          );
          Object.keys(table).forEach((colKey) => {
            while (table[colKey].length < maxColLength) {
              table[colKey].push(0);
            }
          });
        }
      });
    });
  });

  return table;
};

export { createAggregatedPayload, buildTableFromFields, buildTableFromAggs };
