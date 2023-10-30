import {
  ACCEPTREJECTDRIVERUPDATE,
  ACCEPT_REJECT_ORDER,
  ALL_VENDOR_ORDERS,
  CANCEL_ORDER,
  DISPATCHER_URL,
  GENERATE_INVOICE,
  GET_ALL_ORDERS,
  GET_ALL_VENDOR_ORDERS,
  GET_CANCEL_REASONS,
  GET_DETAIL_OF_PRODUCT_FOR_REPLACE,
  GET_DRIVER_RATING_DETAIL,
  GET_ORDER_DETAIL,
  GET_ORDER_DETAIL_FOR_BILLING,
  GET_PRODUCTS_FOR_REPLACE,
  GET_RATING_DETAIL,
  GET_RETURN_ORDER_DETAIL,
  GET_RETURN_PRODUCT_DETAIL,
  GET_VENDOR_PROFILE,
  GET_VENDOR_REVENUE,
  GET_VENDOR_REVENUE_DASHBOARD_DATA,
  GET_VENDOR_TRANSACTIONS,
  GIVE_RATING_REVIEWS,
  MY_PENDING_ORDERS,
  RATE_TO_DRIVER,
  REPEAT_ORDER,
  RESCHDULE_ORDER,
  SOTRE_VENDORS,
  STORE_VENDOR_COUNT,
  SUBMIT_PRODUCT_FOR_REPLACEMENT,
  SUBMIT_RETURN_ORDER,
  UPLOAD_PRODUCT_IMAGE,
  VENDER_UPDATE_ORDER,
  ORDER_TRACING_DEEPLINKING,
  EDIT_CUSTOMER_ORDER,
  DISCARD_EDIT_CUSTOMER_ORDER,
  DFROP_LOCATION_CHANGE_AFTER_ORDER_PLACE,
  ALL_ORDERS_P2P,
  COMPLETE_PICKUP_DROP_OFF,
  GET_UPCOMING_ONGOING_ORDERS,
  P2P_ORDER_DETAIL,
  SEND_NOTIFCATION_TO_VENDOR,
} from '../../config/urls';
import { apiGet, apiPost } from '../../utils/utils';
import store from '../store';
import types from '../types';
const { dispatch } = store;

//Get Order Detail For Billing
export function getOrderDetailForBilling(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_ORDER_DETAIL_FOR_BILLING + data.order_id, {}, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get Cart Detail
export function getOrderDetail(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GET_ORDER_DETAIL, data, headers)

      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//add delete product from cart
export const getOrderListing = (query = '', data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_ORDERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

///VENDOR ORDERS ACTIONS

//SAVE USER'S LAST SELECTED VENDOR

export const savedSelectedVendor = (data) => {
  dispatch({
    type: types.STORE_SELECTED_VENDOR,
    payload: data,
  });
};

//get all orders of specific vendor
export const _getListOfVendorOrders = (query = '', data, headers = {}) => {
  console.log('query++++ query', query);
  console.log('query++++ data', data);
  console.log('query++++ headers', headers);
  return new Promise((resolve, reject) => {
    apiGet(GET_ALL_VENDOR_ORDERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get Vendor Transactions
export const getVendorTransactions = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_TRANSACTIONS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//give order rating
export const giveRating = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GIVE_RATING_REVIEWS, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//accept Reject order

export const updateOrderStatus = (data, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(ACCEPT_REJECT_ORDER, data, headers)
      .then((res) => {
        console.log('checking update status response>>>', res);
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// get order ratings

export const getRating = (query = '', data = {}, headers = {}) => {
  console.log(query, data, headers, 'IN ORDER>JS');
  return new Promise((resolve, reject) => {
    apiGet(GET_RATING_DETAIL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// get order ratings

export const getDriverRating = (query = '', data = {}, headers = {}) => {
  console.log(query, data, headers, 'IN ORDER>JS');
  return new Promise((resolve, reject) => {
    apiGet(GET_DRIVER_RATING_DETAIL + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Get revenue data
export const getRevenueData = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_REVENUE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Get revenue dashboard data
export const getRevenueDashboardData = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_REVENUE_DASHBOARD_DATA, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Get Vendor Profile
export const getVendorProfile = (data = {}, headers = {}) => {
  return new Promise((resolve, reject) => {
    apiPost(GET_VENDOR_PROFILE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//Get Cart Detail
export function getOrderDetailPickUp(data = {}, headers = {}) {
  return apiPost(DISPATCHER_URL, data, headers);
}

//Get RETUREN ORDER Detail
export function getReturnOrderDetailData(url = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_RETURN_ORDER_DETAIL + url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Repeat ORDER
export function repeatOrder(url = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(REPEAT_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Get RETURN PRODUCT Detail
export function getReturnProductrDetailData(url = '', data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(GET_RETURN_PRODUCT_DETAIL + url, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Upload return order image
export function uploadReturnOrderImage(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(UPLOAD_PRODUCT_IMAGE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Submit return order
export function submitReturnOrder(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(SUBMIT_RETURN_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

//Submit return order
export function cancelOrder(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(CANCEL_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function allPendingOrders(query, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiGet(MY_PENDING_ORDERS + query, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function acceptRejectDriveUpdate(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(ACCEPTREJECTDRIVERUPDATE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function ratingToDriver(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(RATE_TO_DRIVER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function genrateInvoice(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(GENERATE_INVOICE, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function venderUpdateOrder(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(VENDER_UPDATE_ORDER, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export function orderTracingForDeepLinking(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(ORDER_TRACING_DEEPLINKING, data, headers)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}



export function storeVendors(query, headers = {}) {
  return apiGet(SOTRE_VENDORS + query, {}, headers);
}

export function vendorOrderCount(query, headers = {}) {
  return apiGet(STORE_VENDOR_COUNT + query, {}, headers);
}

export function allVendorOrders(query, headers = {}) {
  return apiGet(ALL_VENDOR_ORDERS + query, {}, headers);
}

export function rescheduleOrder(data = {}, headers = {}) {
  return apiPost(RESCHDULE_ORDER, data, headers);
}

export function customerEditOrder(data = {}, headers = {}) {
  return apiPost(EDIT_CUSTOMER_ORDER, data, headers);
}

export function discardCustomerEditOrder(data = {}, headers = {}) {
  return apiPost(DISCARD_EDIT_CUSTOMER_ORDER, data, headers);
}

export function dropLocationChangeAfterOrderPlace(data = {}, headers = {}) {
  return apiPost(DFROP_LOCATION_CHANGE_AFTER_ORDER_PLACE, data, headers);
}

//Replace Product
export function getProductsForReplace(url, data = {}, headers = {}) {
  return apiGet(GET_PRODUCTS_FOR_REPLACE + url, data, headers);
}

export function getDetailOfProductToReplace(url = '', data = {}, headers = {}) {
  return apiGet(GET_DETAIL_OF_PRODUCT_FOR_REPLACE + url, data, headers);
}

export function submitProductForReplacement(data = {}, headers = {}) {
  return apiPost(SUBMIT_PRODUCT_FOR_REPLACEMENT, data, headers);
}

export function getCancellationReason(data = {}, headers = {}) {
  return apiGet(GET_CANCEL_REASONS, data, headers);
}



// check for new bides

export function notificationDataForBid(data = {}) {
  dispatch({
    type: types.NOTIFICATION_FOR_BIDE,
    payload: data,
  });
}

export function getAllP2pOrders(url = '', data = {}, headers = {}) {
  return apiGet(ALL_ORDERS_P2P + url, data, headers);
}



export function pickUpDropoffComplete(data = {}, headers = {}) {
  return apiPost(COMPLETE_PICKUP_DROP_OFF, data, headers);
}


export function getUpcomingAndOngoingOrders(url, data = {}, headers = {}) {
  return apiGet(GET_UPCOMING_ONGOING_ORDERS + url, data, headers);
}


export function getP2pOrderDetail(data = {}, headers = {}) {
  return apiPost(P2P_ORDER_DETAIL, data, headers);
}
export function sendNotificationToVendor(data = {}, headers = {}) {
  return apiPost(SEND_NOTIFCATION_TO_VENDOR, data, headers);
}
