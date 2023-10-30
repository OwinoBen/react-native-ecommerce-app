import types from '../types';

const initial_state = {
  userData: {},
  profileAddress: {},
  isSkip: false,
  isVideoSplash: false,
  appSessionInfo: 'shortcode',
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.APP_SESSION_INFO: {
      return {...state, appSessionInfo: action.payload};
    }
    case types.LOGIN: {
      return {...state, userData: action.payload};
    }
    case types.USER_LOGOUT: {
      return {...state, userData: undefined};
    }

    default: {
      return {...state};
    }
  }
}
