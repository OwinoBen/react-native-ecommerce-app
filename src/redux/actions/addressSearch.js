import store from '../store';
import types from '../types';
const { dispatch } = store;
  
  export const addressSearch = (data) => {
    dispatch({
      type: types.ADDRESS_SEARCH,
      payload: data,
    });
  };
 
  
