export default ({ data = {}, aggs = {} }) => {
  console.log(data, ' vals in schema');
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
        fields: ['index', ...(data?.index ? ['content_type', 'website'] : [])],
      },
    ],
    properties: {
      index: {
        title: 'Index',
        choices: [['wisetest_searchui', 'wisetest_searchui']],
      },
      content_type: {
        title: 'Content-type',
        description: 'Choose the content-type you wish to create data with',
        choices: contentTypes,
      },
      website: {
        title: 'Website',
        choices: websites,
      },
    },
    required: [],
  };
};
