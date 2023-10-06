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
  });

  describe('buildTableFromAggs', () => {
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
  });
});
