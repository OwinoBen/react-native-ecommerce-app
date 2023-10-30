import {
  DRIVER_REGISTER,
  GET_DATA_BY_CATEGORY,
  GET_VENDOR_DETAIL,
  VENDOR_REGISTER,
} from '../../config/urls';
import {apiGet, apiPost} from '../../utils/utils';
import store from '../store';
import types from '../types';
const {dispatch} = store;

// save vendor listing and category data

export function saveVendorListingAndCategoryInfo(data) {
  dispatch({
    type: types.CATEGORY_INFO_DATA,
    payload: data,
  });
}

//Get vendor info and Category data
export function getDataByCategoryId(query = '', data = {}, headers = {}) {
  console.log(query, 'data;;;;;;;;;;;;;;');
  return new Promise((resolve, reject) => {
    apiGet(GET_DATA_BY_CATEGORY + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get vendor info and Category data
export function getVendorDetail(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_DETAIL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get vendor info and Category data
export function getSubcategoryDetail(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_DETAIL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function vendorRegisteration(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(VENDOR_REGISTER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function driverRegisteration(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(DRIVER_REGISTER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
