function extractUniqueFields(data) {
  let fieldsSet = new Set();

  if (data?.hits && data.hits.length > 0) {
    data.hits.forEach((hit) => {
      for (let key in hit._source) {
        fieldsSet.add(key);
      }
    });
  }

  let result = [];
  fieldsSet.forEach((field) => {
    result.push([field, field]);
  });

  return result;
}

const fieldSchema = (hits) => {
  return {
    title: 'Field',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['field', 'title', 'secondLevelAgg'],
      },
    ],

    properties: {
      field: {
        title: 'Field',
        choices: extractUniqueFields(hits),
      },
      title: {
        title: 'Title',
        type: 'string',
      },
      secondLevelAgg: {
        title: 'Aggregation',
        choices: extractUniqueFields(hits),
      },
    },

    required: [''],
  };
};

export default ({ data = {}, aggs = {}, hits = {} }) => {
  const websites = aggs?.cluster_name?.buckets
    ? aggs?.cluster_name?.buckets.map((item, i) => [item.key, item.key])
    : [];

  const contentTypes = aggs?.objectProvides?.buckets
    ? aggs?.objectProvides?.buckets.map((item, i) => [item.key, item.key])
    : [];

  return {
    title: 'Elastic data editor',
    fieldsets: [
      {
        id: 'default',
        title: 'Elastic editor ',
        fields: [
          'index',
          ...(data?.index ? ['website', 'content_type', 'use_aggs'] : []),
          ...(data?.use_aggs ? ['agg_fields'] : ['fields']),
        ],
      },
    ],
    properties: {
      index: {
        title: 'Index',
        choices: [['wisetest_searchui', 'wisetest_searchui']],
      },
      website: {
        title: 'Website',
        choices: websites,
      },
      use_aggs: {
        title: 'Use aggregations',
        description: 'Aggregate data based on field values',
        type: 'boolean',
      },
      content_type: {
        title: 'Content-type',
        description: 'Choose the content-type you wish to create data with',
        choices: contentTypes,
      },
      agg_fields: {
        title: 'Aggregation field',
        widget: 'object_list',
        schema: fieldSchema(hits),
      },
      fields: {
        title: 'Fields',
        widget: 'object_list',
        schema: fieldSchema(hits),
      },
    },
    required: [],
  };
};
