import {
  createAggregatedPayload,
  buildTableFromFields,
  buildTableFromAggs,
} from './helpers';

describe('Helper Functions', () => {
  describe('createAggregatedPayload', () => {
    it('should create a default payload', () => {
      const payload = createAggregatedPayload({});
      expect(payload).toHaveProperty('index', '');
      expect(payload).toHaveProperty('track_total_hits', true);
    });

    it('should handle all provided parameters', () => {
      const payloadConfig = {
        objectProvides: 'someObject',
        cluster_name: 'someCluster',
        index: 'someIndex',
        size: 200,
        use_aggs: true,
        agg_fields: [
          { field: 'someField', secondLevelAgg: 'someSecondLevelAgg' },
        ],
      };
      const payload = createAggregatedPayload(payloadConfig);
      expect(payload).toHaveProperty('index', 'someIndex');
      expect(payload).toHaveProperty('size', 200);
      expect(payload.query.bool.must).toHaveLength(6); // Adjust as per expected length
    });

    it('should use custom size if provided', () => {
      const payload = createAggregatedPayload({ size: 50 });
      expect(payload).toHaveProperty('size', 50);
    });

    it('should create appropriate mustQueries with objectProvides and cluster_name', () => {
      const payload = createAggregatedPayload({
        objectProvides: 'someObject',
        cluster_name: 'someCluster',
      });
      expect(payload.query.bool.must).toContainEqual(
        expect.objectContaining({
          bool: expect.objectContaining({
            should: [{ term: { objectProvides: 'someObject' } }],
          }),
        }),
      );
      expect(payload.query.bool.must).toContainEqual(
        expect.objectContaining({
          bool: expect.objectContaining({
            should: [{ term: { cluster_name: 'someCluster' } }],
          }),
        }),
      );
    });

    it('should add aggregations based on agg_fields', () => {
      const payload = createAggregatedPayload({
        use_aggs: true,
        agg_fields: [{ field: 'testField' }],
      });
      expect(payload.aggs).toHaveProperty(
        'testField.terms.field',
        'testField.keyword',
      );
    });

    it('should include second level aggregations when specified', () => {
      const payload = createAggregatedPayload({
        use_aggs: true,
        agg_fields: [
          {
            field: 'testField',
            secondLevelAgg: 'secondLevelTestField',
          },
        ],
      });

      expect(payload.aggs).toHaveProperty(
        'testField.aggs.secondLevelTestField.terms.field',
        'secondLevelTestField.keyword',
      );
    });
  });

  describe('buildTableFromFields', () => {
    it('should build a table from provided items and fields', () => {
      const items = [
        { _source: { field1: 'value1', field2: 'value2' } },
        { _source: { field1: 'value3', field2: 'value4' } },
      ];
      const fields = [
        { field: 'field1' },
        { field: 'field2', title: 'Field Two' },
      ];
      const table = buildTableFromFields(items, fields);
      expect(table).toEqual({
        field1: ['value1', 'value3'],
        'Field Two': ['value2', 'value4'],
      });
    });

    it('should handle items missing a field', () => {
      const items = [
        { _source: { field1: 'value1', field2: 'value2' } },
        { _source: { field1: 'value3' } },
      ];
      const fields = [{ field: 'field1' }, { field: 'field2' }];
      const table = buildTableFromFields(items, fields);
      expect(table).toEqual({
        field1: ['value1', 'value3'],
        field2: ['value2', undefined],
      });
    });
  });

  describe('buildTableFromAggs', () => {
    it('should handle empty fields gracefully', () => {
      const table = buildTableFromAggs(
        [{ testField: [{ key: 'key1', doc_count: 10 }] }],
        [],
      );
      expect(table).toEqual({});
    });

    it('should handle empty data gracefully', () => {
      const fields = [{ field: 'testField', title: 'Test Field' }];
      const table = buildTableFromAggs([], fields);
      expect(table).toEqual({
        'Test Field values': [],
        'Test Field total': [],
      });
    });

    it('should ignore fields with invalid properties', () => {
      const data = [
        {
          testField: [{ key: 'key1', doc_count: 10 }],
          otherField: [{ key: 'key2', doc_count: 20 }],
        },
      ];
      const fields = [{}, { field: 'testField' }];
      const table = buildTableFromAggs(data, fields);
      expect(table).not.toHaveProperty('otherField values');
      expect(table).toEqual({
        testField_values: ['key1'],
        testField_total: [10],
      });
    });
  });
  it('should build a table from provided data and fields', () => {
    const data = [
      {
        testField: [
          { key: 'key1', doc_count: 10 },
          { key: 'key2', doc_count: 20 },
        ],
      },
    ];
    const fields = [{ field: 'testField', title: 'Test Field' }];
    const table = buildTableFromAggs(data, fields);
    expect(table).toEqual({
      'Test Field values': ['key1', 'key2'],
      'Test Field total': [10, 20],
    });
  });

  it('should handle second-level aggregations', () => {
    const data = [
      {
        testField: [
          {
            key: 'key1',
            doc_count: 10,
            secondLevelTestField: {
              buckets: [
                { key: 'subKey1', doc_count: 5 },
                { key: 'subKey2', doc_count: 5 },
              ],
            },
          },
        ],
      },
    ];
    const fields = [
      { field: 'testField', secondLevelAgg: 'secondLevelTestField' },
    ];
    const table = buildTableFromAggs(data, fields);
    expect(table).toEqual({
      testField_values: ['key1'],
      testField_total: [10],
      subKey1: [5],
      subKey2: [5],
    });
  });

  it('should return an empty object when non-array data is provided', () => {
    const table = buildTableFromAggs({}, []);
    expect(table).toEqual({});
  });
});
