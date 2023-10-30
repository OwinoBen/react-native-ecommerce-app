import types from '../types';

const initialState = {
  internetConnection: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    // case types.NO_INTERNET: {
    //   const internetConnection = action.payload.internetConnection;
    //   return {...state, internetConnection};
    // }

    default:
      return state;
  }
}
