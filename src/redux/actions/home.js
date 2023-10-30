import {
  HOMEPAGE_DATA_URL,
  SEARCH,
  SEARCH_BY_BRAND,
  SEARCH_BY_CATEGORY,
  SEARCH_BY_VENDOR,
  GET_ADDRESS,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  SET_PRIMARY_ADDRESS,
  GETALLTEMPLCARDS,
  VENDOR_ALL,
  GETALLVENDORS,
  ADD_RIDER,
  GET_PRODUCT_ESTIMATION_WITH_ADDONS,
  GET_ESTIMATION,
  PICK_UP_LOCATION_SEARCH,
  GET_SUBCATEGORY_VENDORS,
  HOMEPAGE_DATA_URL_V2,
  SEARCH_V2,
  GET_PRODUCTS_ON_DASHBOARD,
  ORDER_RIDE_BID_DETAILS,
  DECLINE_RIDE_BID,
  ACCEPT_RIDE_BID,
  ACCEPT_RIDE_FOR_BID,
  SERACH_ALL_ITEMS,
  GET_SUBCATEGORY_VENDORS_V2,
} from '../../config/urls';
import { apiPost, setItem, getItem, apiGet, saveBidData, clearUserData, clearBidData } from '../../utils/utils';
import store from '../store';
import types from '../types';

const { dispatch } = store;

//Get Homme banners and Category data
export function homeData(data = {}, headers = {}, isShortCode = false) {
  return new Promise((resolve, reject) => {
    apiPost(HOMEPAGE_DATA_URL, data, headers)

      .then((res) => {
        if (!isShortCode) {
          dispatch({
            type: types.HOME_DATA,
            payload: res.data,
          });
        }
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onGlobalSearch(query = '', data = {}, headers = {}) {
  console.log('search global');
  return new Promise((resolve, reject) => {
    apiPost(SEARCH + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function pickuplocationSearch(
  data = {},
  headers = {},
  isShortCode = false,
) {
  return new Promise((resolve, reject) => {
    apiPost(PICK_UP_LOCATION_SEARCH, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onSearchByCategory(query = '', data = {}, headers = {}) {
  console.log('search by category');
  return new Promise((resolve, reject) => {
    apiPost(SEARCH_BY_CATEGORY + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onSearchByVendor(query = '', data = {}, headers = {}) {
  console.log('search by vendor');
  return new Promise((resolve, reject) => {
    apiPost(SEARCH_BY_VENDOR + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onSearchByBrand(query = '', data = {}, headers = {}) {
  console.log('search by brand');
  return new Promise((resolve, reject) => {
    apiPost(SEARCH_BY_BRAND + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function locationData(res) {
  setItem('location', res);
  dispatch({
    type: types.LOCATION_DATA,
    payload: res,
  });
}
export function constLocationData(res) {
  dispatch({
    type: types.CONST_CUR_LOC,
    payload: res,
  });
}
export function profileAddress(res) {
  setItem('profileAddress', res)
    .then((suc) => {
      dispatch({
        type: types.PROFILE_ADDRESS,
        payload: res,
      });
    })
    .catch((err) => { });
}

// export function updateProfileAddress(res) {
//   setItem('profileAddress', res).then(suc=>{
//     dispatch({
//       type: types.PROFILE_ADDRESS,
//       payload: res,
//     });
//   }).catch(err=>{
//
//   })
// }

export const addAddress = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ADD_ADDRESS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateAddress = (query = '', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_ADDRESS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAddress = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_ADDRESS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteAddress = (query = '', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(DELETE_ADDRESS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const setPrimaryAddress = (query = '', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(SET_PRIMARY_ADDRESS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export function dineInData(res) {
  console.log(res, 'dine_in_type in action');
  setItem('dine_in_type', res);
  dispatch({
    type: types.DINE_IN_DATA,
    payload: res,
  });
}

//Get all temp ordres from driver
export const getAllTempOrders = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GETALLTEMPLCARDS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export function vendorAll(query, data, headers = {}) {
  console.log('sending headers', data);
  return apiGet(VENDOR_ALL + query, data, headers);
}

//Get all vendors
export function getAllVendors(data = {}, headers = {}, isShortCode = false) {
  return new Promise((resolve, reject) => {
    apiGet(GETALLVENDORS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const saveSchduleTime = (data) => {
  dispatch({
    type: types.SAVE_SCHEDULE_TIME,
    payload: data,
  });
};

export const addRider = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ADD_RIDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllRiderList = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(ADD_RIDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getProductEstimationWithAddons = (url, data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_ESTIMATION_WITH_ADDONS + url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const productEstimation = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_ESTIMATION, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getSubCategoryVendors = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_SUBCATEGORY_VENDORS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getSubCategoryVendorsV2 = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_SUBCATEGORY_VENDORS_V2, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const isLocationSearched = (flag) => {
  dispatch({
    type: types.IS_LOCATION_SEARCHED,
    payload: flag,
  });
};

//Get Homme banners and Category data
export function homeDataV2(data = {}, headers = {}, isShortCode = false, isSaveRedux= true) {
  return new Promise((resolve, reject) => {


    apiPost(HOMEPAGE_DATA_URL_V2, data, headers)
      .then((res) => {
        if (!isShortCode) {
          if(isSaveRedux){
          dispatch({
            type: types.HOME_DATA,
            payload: res.data,
          });
        }
        }
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onGlobalSearchV2(query = '', data = {}, headers = {}) {
  console.log('search global');
  return new Promise((resolve, reject) => {
    apiPost(SEARCH_V2 + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export function viewAllSearchItemV2(query = '', data = {}, headers = {}) {
  console.log('search global');
  return new Promise((resolve, reject) => {
    apiPost(SERACH_ALL_ITEMS + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function onGetProductsOnHomePage(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_PRODUCTS_ON_DASHBOARD, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const saveBidInfo = (data = null) => {
  dispatch({
    type: types.LAST_BID_INFO,
    payload: data,
  });
}

export const saveBidInAsync = (data) => {
  saveBidData(data).then((res) => {
    saveBidInfo(data)
  }).catch((err) => {

  })
}

export const clearLastBidData = () => {
  saveBidInfo(null)
  clearBidData()
}


export const setCountryFlag = (data) =>{
    setItem('countryFlag', data)
    dispatch({
      type: types.COUNTRY_FLAG,
      payload: data,
    })
}

export const orderRideBidDetails = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ORDER_RIDE_BID_DETAILS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });

};


export const declineRideBid = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(DECLINE_RIDE_BID, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const acceptRideBid = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ACCEPT_RIDE_BID, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const acceptRideForBid = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ACCEPT_RIDE_FOR_BID, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};




