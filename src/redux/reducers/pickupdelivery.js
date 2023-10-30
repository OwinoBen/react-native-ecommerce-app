import types from '../types';

const initial_state = {
  carData: {},
};

export default function (state = initial_state, action) {
  switch (action.type) {
    default: {
      return {...state};
    }
  }
}
