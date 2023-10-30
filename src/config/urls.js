export const SOCKET_URL = 'https://chat.royoorders.com';

//  export const API_BASE_URL = 'https://patazone.rostaging.com/api/v1'
export const API_BASE_URL = 'https://patazone.co.ke/api/v1'

export const getApiUrl = (endpoint) => API_BASE_URL + endpoint;

export const SEND_OTP = getApiUrl('/auth/sendOtp');
export const LOGIN_BY_USERNAME = getApiUrl('/auth/loginViaUsername');
export const VENDOR_LOGIN_BY_USERNAME = getApiUrl('/auth/login');
export const DELETE_ACCOUNT = getApiUrl('/auth/deleteUser');
export const PHONE_LOGIN_OTP = getApiUrl('/auth/verify/phoneLoginOtp');
export const LOGIN_API = getApiUrl('/auth/login');
export const SIGN_UP_API = getApiUrl('/auth/register');
export const FORGOT_API = getApiUrl('/auth/forgotPassword');
export const APP_INITIAL_SETTINGS = getApiUrl('/header');
export const HOMEPAGE_DATA_URL = getApiUrl('/homepage');
export const HOMEPAGE_DATA_URL_V2 = getApiUrl('/v2/homepage');
export const GET_DATA_BY_CATEGORY = getApiUrl('/category');
export const GET_DATA_BY_CATEGORY_OPTAMIZE = getApiUrl('/v2/category');
export const GET_PRODUCT_DATA_BY_PRODUCTID = getApiUrl('/product');
export const GET_PRODUCT_DATA_BY_VENDORID = getApiUrl('/vendor');
export const GET_PRODUTC_DATA_BY_BRANDID = getApiUrl('/brand');
export const CHECK_VENDORS = getApiUrl('/checkIsolateSingleVendor');
export const GET_WISHLIST_PRODUCT = getApiUrl('/wishlists');
export const ADD_REMOVE_TO_WISHLIST = getApiUrl('/wishlist/update');
export const PROFILE_BASIC_INFO = getApiUrl('/update/profile');
export const UPLOAD_PROFILE_IMAGE = getApiUrl('/update/image');
export const CHANGE_PASSWORD = getApiUrl('/changePassword');
export const CONTACT_US = getApiUrl('/contact-us');
export const VERIFY_ACCOUNT = getApiUrl('/auth/verifyAccount');
export const RESEND_OTP = getApiUrl('/auth/sendToken');
// export const INCREASE_ITEM_QNT = getApiUrl('/cart/increaseItem');
// export const DECREASE_ITEM_QNT = getApiUrl('/cart/decreaseItem');
export const GET_DATA_BY_CATEGORY_FILTERS = getApiUrl('/category/filters');
export const GET_DATA_BY_CATEGORY_FILTERS_OPTAMIZE = getApiUrl('/v2/category/filters');
export const GET_DATA_BY_VENDOR_FILTERS = getApiUrl('/vendor/filters');
export const GET_PRODUCT_DATA_BASED_VARIANTS = getApiUrl('/productByVariant');
export const GET_PRODUCT_TAGS = getApiUrl('/getAllProductTags');
export const GET_BRANDPRODUCTS_DATA_BASED_VARIANTS = getApiUrl('/brand/filters');
export const MY_WALLET = getApiUrl('/myWallet');
export const SOCAIL_LOGIN_API = getApiUrl('/social/login');
export const ADD_PRODUCT_TO_CART = getApiUrl('/cart/add');
export const GET_CART_DETAIL = getApiUrl('/cart/list');
export const REMOVE_CART_PRODUCTS = getApiUrl('/cart/remove');
export const UPDATE_CART = getApiUrl('/cart/updateQuantity');
export const SEARCH = getApiUrl('/search/all');
export const SEARCH_V2 = getApiUrl('/v2/search/all');
export const CLEAR_CART = getApiUrl('/cart/empty');
export const ADD_ADDRESS = getApiUrl('/user/address');
export const SEARCH_BY_CATEGORY = getApiUrl('/search/category');
export const SEARCH_BY_VENDOR = getApiUrl('/search/vendor');
export const SEARCH_BY_BRAND = getApiUrl('/search/brand');
export const UPDATE_ADDRESS = getApiUrl('/user/address');
export const GET_ALL_PROMO_CODES = getApiUrl('/promo-code/list');
export const GET_ALL_PROMO_CODES_FOR_PRODUCTLIST = getApiUrl(
  '/promo-code/vendor_promo_code',
);
export const VERIFY_PROMO_CODE = getApiUrl('/promo-code/verify');
export const RESET_PASSWORD = getApiUrl('/auth/resetPassword');
export const REMOVE_PROMO_CODE = getApiUrl('/promo-code/remove');
export const GET_ALL_CELEBRITY = getApiUrl('/celebrity');
export const GET_ADDRESS = getApiUrl('/addressBook');
export const DELETE_ADDRESS = getApiUrl('/delete/address');
export const SET_PRIMARY_ADDRESS = getApiUrl('/primary/address');
export const GET_PRODUCTS_BASED_ON_CELEBRITYFILTER =
  getApiUrl('/celebrity/filters');
export const GET_PRODUCTS_BASED_ON_CELEBRITY = getApiUrl('/celebrityProducts');
export const PLACE_ORDER = getApiUrl('/place/order');
export const GET_ORDER_DETAIL = getApiUrl('/order-detail');
export const GET_ORDER_DETAIL_FOR_BILLING = getApiUrl(
  '/order/orderDetails_for_notification/',
);
export const GET_ALL_ORDERS = getApiUrl('/orders');
export const GET_VENDOR_DETAIL = getApiUrl('/vendor/category/list');
export const SEND_REFFERAL_CODE = getApiUrl('/send/referralcode');
export const GIVE_RATING_REVIEWS = getApiUrl('/rating/update-product-rating');
export const GET_RATING_DETAIL = getApiUrl('/rating/get-product-rating');
export const GET_DRIVER_RATING_DETAIL = getApiUrl('/rating/get-driver-rating');

export const ACCEPT_REJECT_ORDER = getApiUrl('/update/order/status');

export const GET_ALL_CAR_AND_PRICE = getApiUrl(
  '/pickup-delivery/get-list-of-vehicles',
);

export const PLACE_DELIVERY_ORDER = getApiUrl('/pickup-delivery/create-order');
export const LIST_OF_PAYMENTS = getApiUrl('/payment/options');
export const LIST_OF_CMS = getApiUrl('/cms/page/list');
export const CMS_PAGE_DETAIL = getApiUrl('/cms/page/detail');

export const GET_VENDOR_REVENUE = getApiUrl('/store/revenue');
export const GET_VENDOR_TRANSACTIONS = getApiUrl('/get-vendor-transactions');
export const GET_VENDOR_REVENUE_DASHBOARD_DATA = getApiUrl(
  '/vendor-dasboard-data',
);
export const GET_VENDOR_PROFILE = getApiUrl('/get-vendor-profile');
export const GETWEBURL = getApiUrl('/payment');
export const GET_ALL_PROMO_CODES_CAB_ORDER = getApiUrl(
  '/pickup-delivery/promo-code/list',
);
export const VERIFY_PROMO_CODE_CAB_ORDER = getApiUrl(
  '/pickup-delivery/promo-code/verify',
);

export const GET_ALL_SUBSCRIPTION_PLANS = getApiUrl('/user/subscription/plans');
export const SELECT_SPECIFIC_PLAN = getApiUrl('/user/subscription/selectPlan');
export const PURCHASE_SPECIFIC_PLAN = getApiUrl('/user/subscription/purchase');
export const CANCEL_SPECIFIC_PLAN = getApiUrl('/user/subscription/cancel');
// export const RENEW_SPECIFIC_PLAN = getApiUrl('/user/subscription/cancel');

export const GET_LOYALTY_INFO = getApiUrl('/user/loyalty/info');
export const GET_RETURN_ORDER_DETAIL = getApiUrl(
  '/return-order/get-order-data-in-model',
);
export const GET_RETURN_PRODUCT_DETAIL = getApiUrl(
  '/return-order/get-return-products',
);

export const UPLOAD_PRODUCT_IMAGE = getApiUrl('/upload-file');
export const REPEAT_ORDER = getApiUrl('/repeatOrder');

export const SUBMIT_RETURN_ORDER = getApiUrl(
  '/return-order/update-product-return',
);

export const VENDOR_TABLE_CART = getApiUrl('/add/vendorTable/cart');

export const SCHEDULE_ORDER = getApiUrl('/cart/schedule/update');
export const MY_PENDING_ORDERS = getApiUrl('/my_pending_orders');
export const DISPATCHER_URL = getApiUrl(
  '/pickup-delivery/order-tracking-details',
);
export const CART_PRODUCT_SCHEDULE = getApiUrl('/cart/product-schedule/update');
export const TIP_AFTER_ORDER = getApiUrl('/orders/tip-after-order');
export const VALIDATE_PROMO_CODE = getApiUrl('/promo-code/validate_promo_code');
export const UPLOAD_PHOTO = getApiUrl('/upload-image-pickup');
export const LAST_ADDED = getApiUrl('/cart/product/lastAdded');
export const DIFFERENT_ADD_ONS = getApiUrl(
  '/cart/product/variant/different-addons',
);
export const WALLET_CREDIT = getApiUrl('/myWallet/credit');
export const VENDOR_REGISTER = getApiUrl('/vendor/register');
export const DRIVER_REGISTER = getApiUrl('/driver/register');
export const CANCEL_ORDER = getApiUrl('/return-order/vendor-order-for-cancel');
export const WALLET_USER_VERIFY = getApiUrl('/wallet/transfer/user/verify');
export const WALLET_TRANSFER_CONFIRM = getApiUrl('/wallet/transfer/confirm');
export const VENDOR_SLOTS = getApiUrl('/vendor/slots');
export const NEW_VENDOR_FILTER = getApiUrl(
  '/v2/vendor/vendorProductsFilterOptimize',
);
export const GETALLTEMPLCARDS = getApiUrl('/get/edited-orders');
export const ACCEPTREJECTDRIVERUPDATE = getApiUrl('/edit-order/approve/reject');

// Vendor App collection
export const GET_ALL_VENDOR_ORDERS = getApiUrl('/mystore');
export const GET_ALL_PRODUCTSBY_STORE_ID = getApiUrl('/mystore/product/list');
export const GET_ALL_PRODUCTSBY_VENDOR_ID = getApiUrl(
  '/mystore/vendor/product/list',
);
export const ADD_VENDOR_PRODUCT = getApiUrl('/mystore/product/add');
export const GET_VENDOR_CATEGORY = getApiUrl('/mystore/vendor/category');
export const GET_PRODUCT_DETAIL = getApiUrl('/mystore/product/detail');
export const CREATE_PRODUCT_VARIANT = getApiUrl(
  '/mystore/product/createvariant',
);
export const DELETE_PRODUCT_VARIANT = getApiUrl(
  '/mystore/product/deletevariant',
);
export const UPDATE_PRODUCT_STATUS = getApiUrl(
  '/mystore/product/status-update',
);
export const DELETE_VENDOR_PRODUCT = getApiUrl('/mystore/product/delete');
export const UPDATE_VENDOR_PRODUCT = getApiUrl('/mystore/product/update');
export const ADD_PRODUCT_IMAGE = getApiUrl('/mystore/product/addProductImage');
export const GET_PRODUCT_IMAGE = getApiUrl('/mystore/product/getProductImages');
export const DELETE_PRODUCT_IMAGE = getApiUrl('/mystore/product/deleteimage');
export const VENDOR_ALL = getApiUrl('/vendor/all');

//new optamize apis
export const VENDOR_OPTIMIZE = getApiUrl('/vendor-optimize');
export const VENDOR_OPTIMIZE_FILTERS = getApiUrl('/vendor-optimize-filters');

export const GETALLVENDORS = getApiUrl('/vendor/all');
export const USER_REGISTRATION_DOCUMENT = getApiUrl(
  '/user/registration/document',
);
export const GET_USER_PROFILE = getApiUrl('/getProfile');
export const VENDOR_PRODUCTS_OPTIMIZE_FILTERS = getApiUrl(
  '/vendor/vendorProductsFilterOptimize',
);

export const GET_PAYMENT_INTENT = getApiUrl('/create-payment-intent');
export const CONFIRM_PAYMENT_INTENT = getApiUrl('/confirm-payment-intent');
export const GET_PRODUCT_FAQS = getApiUrl('/products_faq');
export const UPDATE_PRODUCT_FAQS_CART = getApiUrl('/cart/productfaq/update');
export const RATE_TO_DRIVER = getApiUrl('/rating/update-driver-rating');
export const GET_CATEGORY_KYC_DOCUMENT = getApiUrl('/category_kyc_document');
export const SUBMIT_CATEGORY_KYC = getApiUrl('/submit_category_kyc');

export const SOTRE_VENDORS = getApiUrl('/mystore/vendors');
export const STORE_VENDOR_COUNT = getApiUrl('/mystore/vendor/dashboard');
export const ALL_VENDOR_ORDERS = getApiUrl('/mystore/vendor/orders');
export const VENDOR_CATEGORIES = getApiUrl(
  '/mystore/vendor/product-category/list',
);
export const ALL_VENDOR_DATA = getApiUrl(
  '/mystore/vendor/products-with-category/list',
);
export const ORDER_AFTER_PAYMENT = getApiUrl('/order/after/payment');

export const PAYTABURL = getApiUrl('/payment/complete/paytab');
export const CANCELPAYTABURL = getApiUrl('/payment/failed/paytab');

export const SDKPAYMENTWAVEURL = getApiUrl('/payment/sdk_complete');
export const SDKPAYMENTCANCELWAVEURL = getApiUrl('/payment/sdk_failed');

export const VENDOR_DROPOFF_SLOTS = getApiUrl('/vendor/dropoffslots');
export const ADD_RIDER = getApiUrl('/pickup-delivery/add-rider');

export const VENDOR_OPTIMIZE_V2 = getApiUrl('/v2/vendor-optimize');
export const GET_MORE_CATEGORIES = getApiUrl('/v2/vendor-optimize-category');
export const PICK_UP_LOCATION_SEARCH = getApiUrl('/dropoff-location');
// export const GET_DATA_BY_CATEGORY_FILTERS_OPTAMIZE = getApiUrl('/v2/category/filters',);

export const ALL_NEARBY_DRIVERS = getApiUrl('/get/agents');

//Laundry Service APIs
export const GET_PRODUCT_ESTIMATION_WITH_ADDONS = getApiUrl(
  '/estimation/get-product-estimation-with-addons',
);

export const GET_ESTIMATION = getApiUrl('/estimation/get-estimation');
export const RESCHDULE_ORDER = getApiUrl('/mystore/vendor/rescheduleOrder');
export const ADD_PRESCRIPTIONS = getApiUrl('/upload/prescriptions');
export const DELETE_PRESCRIPTION = getApiUrl('/delete/prescriptions');
export const GET_SUBCATEGORY_VENDORS = getApiUrl('/get/subcategory/vendor');
export const VENDER_UPDATE_ORDER = getApiUrl('/order-update');
export const GET_SUBCATEGORY_VENDORS_V2 = getApiUrl('/v2/get/subcategory/vendor');
export const SERACH_ALL_ITEMS = getApiUrl('/v2/search/all');

//Chat Apis
export const START_CHAT = getApiUrl('/chat/startChat');
export const SEND_NOTIFCATION = getApiUrl('/chat/sendNotificationToUser');
export const USER_CHAT = '/api/room/fetchRoomByUserId';
export const AGENT_CHAT = '/api/room/fetchRoomByUserId';
export const VENDOR_CHAT = '/api/room/fetchRoomByVendor';
export const SEND_MESSAGE = '/api/chat/sendMessageJoin';
export const GET_ALL_MESSAGES = '/api/chat';
export const ALL_ROOM_USER = '/api/chat/getRoomUser';
export const P2P_USER_TO_USER_CHAT = '/api/room/fetchRoomByUserIdUserToUser';
export const GET_PRODUCT_RELATED_TO_CHAT = getApiUrl('/chat/fetchOrderDetail');

// static drop-location
export const STATIC_DROP_LOCATIONS = getApiUrl('/static-dropoff-locations');
export const GENERATE_INVOICE = getApiUrl('/generate-facturama-invoice');
export const CHECK_PRODUCT_AVAILAABILITY = getApiUrl(
  '/checkProductAvailibility',
);

// order Tracing Url For DeepLinking
export const ORDER_TRACING_DEEPLINKING = getApiUrl('/order-tracking');

// edit order api
export const EDIT_CUSTOMER_ORDER = getApiUrl('/user/editorder');

// discard Edit order from Cart
export const DISCARD_EDIT_CUSTOMER_ORDER = getApiUrl('/user/discardeditorder');

// pickup-delivery drop location change after order place
export const DFROP_LOCATION_CHANGE_AFTER_ORDER_PLACE = getApiUrl('/pickup-delivery/edit-order')

//Replace Order
export const GET_PRODUCTS_FOR_REPLACE = getApiUrl('/replace-order/get-replace-order-data-in-model');
export const GET_DETAIL_OF_PRODUCT_FOR_REPLACE = getApiUrl(
  '/replace-order/get-replace-products',
);
export const SUBMIT_PRODUCT_FOR_REPLACEMENT = getApiUrl(
  '/replace-order/update-product-replace',
);

//Cancle order
export const GET_CANCEL_REASONS = getApiUrl(
  '/cancel-order/get-cancel-order-reason',
);

//P2P
export const GET_AVAILABLE_ATTRIBUTES = getApiUrl(
  '/mystore/product/availableListOfAttribute',
);
export const SUBMIT_PRODUCT_WITH_ATTRIBUTE = getApiUrl(
  '/mystore/product/addProductWithAttribute',
);
export const GET_PRODUCT_BY_P2P_CATEGORY = getApiUrl('/v2/attribute/category');

export const GET_P2P_CATEGORIES = getApiUrl('/v2/getP2pCategories');

// E-commerce slots
export const CHECK_VENDOR_PINCODE = getApiUrl('/checkVendorPincode');
export const GET_VENDOR_SHIPPING_SLOTS = getApiUrl(
  '/getShippingProductDeliverySlots',
);
export const GET_PRODUCT_DELIVERY_SLOTS_INTERVAL = getApiUrl(
  '/getProductDeliverySlotsInterval',
);

//Refer and Earn
export const GET_INFLUENCER_REFER_EARN_CATEGORIES = getApiUrl(
  '/influencer/refer-earn',
);
export const GET_DETAILS_OF_INFLUENCE_CATEGORY = getApiUrl(
  '/influencer/get-influencer-form',
);
export const SAVE_INFULENCER_INFO = getApiUrl(
  '/influencer/save-influencer-form',
);

export const CHECK_SLOTS_LIMIT = getApiUrl('/cart/checkSlotOrders');
export const GET_SLOTS_FOR_APPOINTMENT = getApiUrl('/getTimeSlotsForOndemand');
export const GET_SLOTS_FOR_APPOINTMENT_FROM_DISPATHCER = getApiUrl('/getslotsFormDispatcher');


export const GET_PRODUCTS_ON_DASHBOARD = getApiUrl('/v2/get_products')
// bid and ride and instant booking api here

//create bid request 
export const CREATE_BID_REQUEST = getApiUrl(
  "/create/user/bid_ride_request"
);


export const ORDER_RIDE_BID_DETAILS = getApiUrl(
  '/order-ride-bid-details',
);

export const DECLINE_RIDE_BID = getApiUrl(
  '/decline-ride-bid',
);

export const ACCEPT_RIDE_BID = getApiUrl(
  '/accept-ride-bid',
);
export const ACCEPT_RIDE_FOR_BID = getApiUrl(
  '/accept-ride-bid-request',
);

//saved card list
export const SAVED_CARD_LIST = getApiUrl('/user/get-user-cards');

//delete card

export const DELETE_CARD = getApiUrl('/user/deleteCard');

// time slots of driver
export const GET_DRIVER_SLOTS = getApiUrl('/getDispatcherGerenalSlot');
export const SEND_PRODUCT_BOOKING_DATA = getApiUrl('/get_product_price_from_dispatcher');


export const MTNGATEWAY = getApiUrl('/mtn/create-token')

//sendNotificationToVendor ****************>
export const SEND_NOTIFCATION_TO_VENDOR = getApiUrl('/order/vendorReached');

export const VIEW_ALL_CATEGORIES = getApiUrl(
  '/v2/categoriesAll',
);

export const GET_UPCOMING_ONGOING_ORDERS = getApiUrl(
  '/orders_upcoming_ongoing',
);

export const ALL_ORDERS_P2P = getApiUrl(
  '/orders-all',
);

export const P2P_ORDER_DETAIL = getApiUrl(
  '/order-detail_p2p',
);

export const COMPLETE_PICKUP_DROP_OFF = getApiUrl(
  '/user/orderVenderStatusUpdate',
);

export const CART_ITEM_CHECKED = getApiUrl('/cart/updateCartCheckedStatus')
export const SEARCH_ALL_ITEMS = getApiUrl('/v2/search/all');
export const GET_PRODUCT_DATA_BASED_VARIANTS_2 = getApiUrl('/v2/productByVariant')