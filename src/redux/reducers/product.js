import types from '../types';

const initial_state = {
  productListData: [],
  productDetailData: {},
  walletData: null,
};

export default function (state = initial_state, action) {
  switch (action.type) {
    case types.PRODUCT_LIST_DATA: {
      const data = action.payload;
      return {
        ...state,
        productListData: data,
      };
    }

    case types.WALLET_DATA: {
      const data = action.payload;
      return {
        ...state,
        walletData: data,
      };
    }

    case types.PRODUCT_DETAIL: {
      const data = action.payload;
      return {...state, productDetailData: data};
    }

    default: {
      return {...state};
    }
  }
}
