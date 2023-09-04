const createAggregatedPayload = (payloadConfig) => {
  const {
    objectProvides = '',
    cluster_name = '',
    index = '',
    //size = 10000,
    size = 100,
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
    aggs: {
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
    },
    size: size,
    source: { exclude: ['embedding'] },
    track_total_hits: true,
  };
};

export { createAggregatedPayload };
