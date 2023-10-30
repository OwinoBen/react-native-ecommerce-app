import {GET_PRODUTC_DATA_BY_BRANDID,GET_BRANDPRODUCTS_DATA_BASED_VARIANTS} from '../../config/urls';
import {apiGet, apiPost} from '../../utils/utils';
import store from '../store';
const {dispatch} = store;

//get Product Detail
export function getBrandProductsByBrandId(query = '', data = {}, headers = {}) {
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



///get Product By Category filter
export const getBrandProductsByFilters = (
  query = '',
  data = {},
  headers = {},
) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_BRANDPRODUCTS_DATA_BASED_VARIANTS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};