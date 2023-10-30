import {
  ADD_PRODUCT_IMAGE,
  ADD_PRODUCT_TO_CART,
  ADD_REMOVE_TO_WISHLIST,
  ADD_VENDOR_PRODUCT,
  ALL_VENDOR_DATA,
  CHECK_PRODUCT_AVAILAABILITY,
  CHECK_SLOTS_LIMIT,
  CHECK_VENDORS,
  CHECK_VENDOR_PINCODE,
  CREATE_BID_REQUEST,
  CREATE_PRODUCT_VARIANT,
  DELETE_PRODUCT_IMAGE,
  DELETE_PRODUCT_VARIANT,
  DELETE_VENDOR_PRODUCT,
  GET_ALL_PRODUCTSBY_STORE_ID,
  GET_ALL_PRODUCTSBY_VENDOR_ID,
  GET_DATA_BY_CATEGORY,
  GET_DATA_BY_CATEGORY_FILTERS,
  GET_DATA_BY_CATEGORY_FILTERS_OPTAMIZE,
  GET_DATA_BY_CATEGORY_OPTAMIZE,
  GET_DATA_BY_VENDOR_FILTERS,
  GET_DRIVER_SLOTS,
  GET_MORE_CATEGORIES,
  GET_PRODUCT_DATA_BASED_VARIANTS_2,
  GET_PRODUCT_DATA_BY_PRODUCTID,
  GET_PRODUCT_DATA_BY_VENDORID,
  GET_PRODUCT_DELIVERY_SLOTS_INTERVAL,
  GET_PRODUCT_DETAIL,
  GET_PRODUCT_IMAGE,
  GET_PRODUCT_TAGS,
  GET_SLOTS_FOR_APPOINTMENT_FROM_DISPATHCER,
  GET_VENDOR_CATEGORY,
  GET_VENDOR_SHIPPING_SLOTS,
  GET_WISHLIST_PRODUCT,
  MY_WALLET,
  NEW_VENDOR_FILTER,
  SEND_PRODUCT_BOOKING_DATA,
  UPDATE_PRODUCT_STATUS,
  UPDATE_VENDOR_PRODUCT,
  VENDOR_CATEGORIES,
  VENDOR_OPTIMIZE,
  VENDOR_OPTIMIZE_FILTERS,
  VENDOR_OPTIMIZE_V2,
  VENDOR_PRODUCTS_OPTIMIZE_FILTERS,
  WALLET_CREDIT
} from '../../config/urls';
import { apiGet, apiPost, setWalletData } from '../../utils/utils';
import store from '../store';
import types from '../types';
const { dispatch } = store;

// save vendor listing and category data
export function saveProductListingAndCategoryInfo(data) {
  dispatch({
    type: types.PRODUCT_LIST_DATA,
    payload: data,
  });
}

export function storeWishList(data) { }

//Get all Products by Vendor id

export function getProductByVendorId(query = '', data = {}, headers = {}) {
  console.log('sendng headers', headers);
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_DATA_BY_VENDORID + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get all Products by Vendor id

export function getProductByVendorCategoryId(
  query = '',
  data = {},
  headers = {},
) {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_DATA_BY_VENDORID + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get Category data
export function getProductByCategoryId(query = '', data = {}, headers = {}) {
  console.log(query, data, headers, 'checkkkkprdct');
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

export function getProductByCategoryIdOptamize(
  query = '',
  data = {},
  headers = {},
) {
  return new Promise((resolve, reject) => {
    apiGet(GET_DATA_BY_CATEGORY_OPTAMIZE + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

///Add Product to Cartr
export const addProductsToCart = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ADD_PRODUCT_TO_CART, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

///get Product By Category filter
export const getProductByCategoryFilters = (
  query = '',
  data = {},
  headers = {},
) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_DATA_BY_CATEGORY_FILTERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

///get Product By Category filter optamize
export const getProductByCategoryFiltersOptamize = (
  query = '',
  data = {},
  headers = {},
) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_DATA_BY_CATEGORY_FILTERS_OPTAMIZE + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/** Get All Products Tags for Filter */
export const getAllProductTags = (query = '', data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_TAGS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

///get Product By Category filter
export const getProductByVendorFilters = (
  query = '',
  data = {},
  headers = {},
) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_DATA_BY_VENDOR_FILTERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const newVendorFilters = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(NEW_VENDOR_FILTER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const vendorFilterOptimize = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(VENDOR_PRODUCTS_OPTIMIZE_FILTERS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//get Product Detail Based on variants
export function getProductDetailByVariants(
  query = '',
  data = {},
  headers = {},
) {
  return new Promise((resolve, reject) => {
    apiPost(GET_PRODUCT_DATA_BASED_VARIANTS_2 + query, data, headers)
      .then((res) => {
        // dispatch({
        //   type: types.PRODUCT_DETAIL,
        //   payload: res.data.products,
        // });
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//get Product Detail
export function getProductDetailByProductId(
  query = '',
  data = {},
  headers = {},
) {
  return new Promise((resolve, reject) => {
    apiGet(GET_PRODUCT_DATA_BY_PRODUCTID + query, data, headers)
      .then((res) => {
        // dispatch({
        //   type: types.PRODUCT_DETAIL,
        //   payload: res.data.products,
        // });
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getWishlistProducts(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_WISHLIST_PRODUCT + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error, 'error>>>>>');
        reject(error);
      });
  });
}

export function updateProductWishListData(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    let url = ADD_REMOVE_TO_WISHLIST + query;
    apiGet(ADD_REMOVE_TO_WISHLIST + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

export const setWallet = (data) => {
  dispatch({
    type: types.WALLET_DATA,
    payload: data,
  });
};

export function walletHistory(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(MY_WALLET + query, data, headers)
      .then((res) => {
        setWalletData(res.data).then((suc) => {
          setWallet(res.data);
          resolve(res);
        });

        resolve(res);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

//Get Product by category id for specific store
export function getProductBySpecificId(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_PRODUCTSBY_STORE_ID + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get Product by category id for specific Vendor
export function getAllProductByVendorId(query = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_ALL_PRODUCTSBY_VENDOR_ID + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function checkSingleVendor(data = {}, header = {}) {
  return new Promise((resolve, reject) => {
    apiPost(CHECK_VENDORS, data, header)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function walletCredit(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(WALLET_CREDIT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Vendor App
export function addVendorProduct(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(ADD_VENDOR_PRODUCT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getVendorCategories(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_CATEGORY, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getVendorProductDetail(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_PRODUCT_DETAIL, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function postVendorProductStatusUpdate(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_PRODUCT_STATUS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createProductVariant(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(CREATE_PRODUCT_VARIANT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteProductVariant(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(DELETE_PRODUCT_VARIANT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteVendorProduct(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(DELETE_VENDOR_PRODUCT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function updateVendorProduct(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(UPDATE_VENDOR_PRODUCT, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function addProductImage(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(ADD_PRODUCT_IMAGE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getProductImage(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_PRODUCT_IMAGE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function deleteProductImage(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(DELETE_PRODUCT_IMAGE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getVendorFilters(query = '', data = {}, headers = {}) {
  console.log(query, data, headers, 'query,data,dataquery,data,data');
  return new Promise((resolve, reject) => {
    apiGet(VENDOR_OPTIMIZE_FILTERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getProductByVendorIdOptamize(
  query = '',
  data = {},
  headers = {},
) {
  console.log('sendng headers', headers);
  return new Promise((resolve, reject) => {
    apiGet(VENDOR_OPTIMIZE + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function allVendorCategories(query, headers) {
  return apiGet(VENDOR_CATEGORIES + query, {}, headers);
}

export function allVendorData(query, headers) {
  return apiGet(ALL_VENDOR_DATA + query, {}, headers);
}

export function getProductByVendorIdOptamizeV2(
  query = '',
  data = {},
  headers = {},
) {

  return apiGet(VENDOR_OPTIMIZE_V2 + query, data, headers);
}

export function getMoreCategories(query = '', data = {}, headers = {}) {
  return apiPost(GET_MORE_CATEGORIES + query, data, headers);
}

export function checkProductAvailibility(data = {}, headers = {}) {
  return apiPost(CHECK_PRODUCT_AVAILAABILITY, data, headers);
}

export function checkVendorPincode(data = {}, headers = {}) {
  return apiPost(CHECK_VENDOR_PINCODE, data, headers);
}

export function getVendorShippingSlots(data = {}, headers = {}) {
  return apiPost(GET_VENDOR_SHIPPING_SLOTS, data, headers);
}

export function getProductDeliverySlotsInterval(data = {}, headers = {}) {
  return apiPost(GET_PRODUCT_DELIVERY_SLOTS_INTERVAL, data, headers);
}

export function checkSlotsLimit(data = {}, headers = {}) {
  return apiPost(CHECK_SLOTS_LIMIT, data, headers);
}
export function getAppointmentSlots(data = {}, headers = {}) {
  return apiPost(GET_SLOTS_FOR_APPOINTMENT_FROM_DISPATHCER, data, headers);
}

// create bid request>>>>>>>>>>
export function createBidRequest(data = {}, headers = {}) {
  return apiPost(CREATE_BID_REQUEST, data, headers);
}

export function getDriverSlots(query = '', data = {}, headers = {}) {
  return apiGet(GET_DRIVER_SLOTS + query, data, headers);
}

export function sendProductBookingData(data = {}, headers = {}) {
  return apiPost(SEND_PRODUCT_BOOKING_DATA, data, headers);
}

