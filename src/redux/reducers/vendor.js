import types from '../types';

const initial_state = {
  categoryData: {},
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.CATEGORY_INFO_DATA: {
      const data = action.payload;
      return {
        categoryData: data,
      };
    }

    default: {
      return {...state};
    }
  }
}
