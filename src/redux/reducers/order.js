import types from '../types';

const initial_state = {
  storeSelectedVendor: {},
  notificationForBide: {}
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.STORE_SELECTED_VENDOR: {
      const data = action.payload;
      console.log(data, 'thi sis api')
      return {
        ...state,
        storeSelectedVendor: data,
      };
    }

    case types.NOTIFICATION_FOR_BIDE: {
      return {
        ...state,
        notificationForBide: action.payload,
      };
    }

    default: {
      return {...state};
    }
  }
}
