export const FETCH_CONNECTOR_DATA = 'FETCH_CONNECTOR_DATA';

export function fetchConnectorData(payload) {
  return {
    type: FETCH_CONNECTOR_DATA,
    payload,
  };
}
