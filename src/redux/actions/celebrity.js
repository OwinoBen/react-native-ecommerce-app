import {
  GET_PRODUTC_DATA_BY_BRANDID,
  GET_BRANDPRODUCTS_DATA_BASED_VARIANTS,
  GET_ALL_CELEBRITY,
  GET_PRODUCTS_BASED_ON_CELEBRITY,
  GET_PRODUCTS_BASED_ON_CELEBRITYFILTER,
} from '../../config/urls';
import {apiGet, apiPost} from '../../utils/utils';
import store from '../store';
const {dispatch} = store;

//get all celebrity
export function _getAllCelebrityData(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_CELEBRITY + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//get celebrity on the basic of alphabets
export function _getAllCelebrityByAlphabets(
  query = '',
  data = {},
  headers = {},
) {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUTC_DATA_BY_BRANDID + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}



//get list of Product by CelebrityID
export function getCelebrityProductsByCelebrityId(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCTS_BASED_ON_CELEBRITY + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}



///get list of Product by Celebrity filter
export const getCelebrityProductsByFilters = (
  query = '',
  data = {},
  headers = {},
) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_PRODUCTS_BASED_ON_CELEBRITYFILTER + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
