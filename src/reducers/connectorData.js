import { FETCH_CONNECTOR_DATA } from '../actions/connectorData';

const initialState = {
  data: {},
};

export default function connectorDataReducer(
  state = initialState,
  action = {},
) {
  switch (action.type) {
    case FETCH_CONNECTOR_DATA:
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
}
