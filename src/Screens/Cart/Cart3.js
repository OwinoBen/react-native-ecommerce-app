import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { handleNextAction, StripeProvider } from '@stripe/stripe-react-native';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  FlatList,
  I18nManager,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import * as RNLocalize from 'react-native-localize';
import Modal from 'react-native-modal';
import RazorpayCheckout from 'react-native-razorpay';
import { useSelector } from 'react-redux';
import AddressModal3 from '../../Components/AddressModal3';
import BorderTextInput from '../../Components/BorderTextInput';
import ButtonComponent from '../../Components/ButtonComponent';
import ChooseAddressModal from '../../Components/ChooseAddressModal';
import ConfirmationModal from '../../Components/ConfirmationModal';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import HorizontalLine from '../../Components/HorizontalLine';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import ProductListLoader from '../../Components/Loaders/ProductListLoader';
import MarketCard3 from '../../Components/MarketCard3';
import ProductsComp from '../../Components/ProductsComp';
import SelectPaymentModal from '../../Components/SelectPaymentModal';
import WishlistCard from '../../Components/WishlistCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { hitSlopProp } from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import {
  cameraHandler,
  getHourAndMinutes,
  tokenConverterPlusCurrencyNumberFormater,
} from '../../utils/commonFunction';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import {
  getImageUrl,
  getParameterByName,
  showError,
  showInfo,
  showSuccess,
  timeInLocalLangauge
} from '../../utils/helperFunctions';
import { generateTransactionRef, payWithCard } from '../../utils/paystackMethod';
import { androidCameraPermission } from '../../utils/permissions';
import { getItem, removeItem, setItem } from '../../utils/utils';
import stylesFun from './styles';

import BottomModal from '../../Components/BottomModal';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import DropDown from '../../Components/DropDown';

let clickedItem = {};
let isFAQsSubmitted = true;
let addtionSelectedImageIndex = null;
let addtionSelectedImage = null;
let dayAfterToday = new Date().getTime() + 24 * 60 * 60 * 1000;

import { enableFreeze } from "react-native-screens";
import { CouponDiscount, DeliverableSection, PromoCodeAvailableSection, SwipeableSection } from './parts';
import Footer from './parts/Footer';
import useInterval from '../../utils/useInterval';
import axios from 'axios';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
enableFreeze(true);


function Cart({  route }) {
  let navigation = useNavigation()
  let paramsData = route?.params;
  console.log(paramsData, 'paramsDataparamsData')
  let actionSheet = useRef(null);
  const bottomSheetRef = useRef(null);
  const checkCartItem = useSelector((state) => state?.cart?.cartItemCount);
  const darkthemeusingDevice = useDarkMode();
  const reloadData = useSelector((state) => state?.reloadData?.reloadData);
  const [defaultSelectedTable, setDefaultSelectedTable] = useState('');
  const [type, setType] = useState('');
  const [vendorAddress, setVendorAddress] = useState({});
  const [instruction, setInstruction] = useState('');
  const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState('');
  const [sel_types, setSelTypes] = useState('');
  const [viewHeight, setViewHeight] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [wishlistArray, setWishlistArray] = useState([]);
  const [cartData, setCartData] = useState({});
  const [selectedPayment, setSelectedPayment] = useState({});
  const [selectedTipvalue, setSelectedTipvalue] = useState(null);
  const [selectedTipAmount, setSelectedTipAmount] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [scheduleType, setScheduleType] = useState(null);
  const [localeSheduledOrderDate, setLocaleSheduledOrderDate] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);
  const [deepLinkUrl, setDeepLinkUrl] = useState(null);
  const [btnLoadrId, setBtnLoaderId] = useState(null);
  const [swipeKey, setSwipeKey] = useState(null);
  const [pickupDriverComment, setPickupDriverComment] = useState(null);
  const [dropOffDriverComment, setDropOffDriverComment] = useState(null);
  const [vendorComment, setVendorComment] = useState(null);
  const [localePickupDate, setLocalPickupDate] = useState(null);
  const [localeDropOffDate, setLocaleDropOffDate] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [minimumDelayVendorDate, setMinimumDelayVendorDate] = useState(null);
  const [sheduledorderdate, setSheduledorderdate] = useState(null);
  const [sheduledpickupdate, setSheduledpickupdate] = useState(null);
  const [sheduleddropoffdate, setSheduleddropoffdate] = useState(null);
  const [productFaqs, setProductFaqs] = useState([]);
  const [myAnswerdArray, setMyAllanswers] = useState([]);
  const [myFaqValidationArray, setMyFaqValidationArray] = useState([]);
  const [validationFucCalled, setvalidationFucCalled] = useState(true);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [kycTxtInpts, setKycTxtInpts] = useState([]);
  const [kycImages, setKycImages] = useState([]);
  const [kycPdfs, setKycPdfs] = useState([]);
  const [apiScheduledDate, setApiScheduledDate] = useState(null);
  const [laundrySelectedPickupDate, setLaundrySelectedPickupDate] =
    useState(null);
  const [laundrySelectedPickupSlot, setLaundrySelectedPickupSlot] =
    useState('');
  const [laundryAvailablePickupSlot, setLaundryAvailablePickupSlot] = useState(
    [],
  );
  const [laundrySelectedDropOffDate, setLaundrySelectedDropOffDate] =
    useState(null);
  const [laundrySelectedDropOffSlot, setLaundrySelectedDropOffSlot] =
    useState('');
  const [laundryAvailableDropOffSlot, setLaundryAvailableDropOffSlot] =
    useState([]);
  const [selectedItemForPrescription, setItemForPrescription] = useState({});
  const [isPrescriptionModal, setPrescriptionModal] = useState(false);
  const [selectedPrescriptionImgs, setPrescriptionImgs] = useState([]);
  const [isPrescriptionLoading, setPrescriptionLoading] = useState(false);
  const [isCheckSlotLoading, setCheckSloatLoading] = useState(false);
  const [isShimmerLoading, setIsShimmerLoading] = useState(true);
  const [isValidSlot, setIsValidSlot] = useState(true);
  const [isVisibleMtnGateway, setIsVisibleMtnGateway] = useState(false)
  const [mtnGatewayResponse, setMtnGatewayResponse] = useState('')
  const [responseTimer, setResponseTimer] = useState(420)
  const [paymentModal, setPaymentModal] = useState(false)


  const [state, setState] = useState({
    showTaxFeeArea: false,
    isGiftBoxSelected: false,
    selectViaMap: false,
    // paymentModal: false,
    deliveryFeeLoader: false,
    isTableDropDown: false,
    btnLoader: false,
    placeLoader: false,
    isVisibleTimeModal: false,
    isVisible: false,
    isLoadingB: true,
    isModalVisibleForClearCart: false,
    isVisibleAddressModal: false,
    isRefreshing: false,
    isProductOrderForm: false,
    isProductLoader: false,
    isSubmitFaqLoader: false,
    isCategoryKyc: false,
    isCategoryKycLoader: false,
    isSubmitKycLoader: false,
    isModalVisibleForPayFlutterWave: false,
    paymentDataFlutterWave: null,
    selectedType: null,
    orderAmount: '',
    codMinAmount: '',
  });

  const {
    isVisibleTimeModal,
    isLoadingB,
    isModalVisibleForClearCart,
    isVisibleAddressModal,
    isVisible,
    isRefreshing,
    isTableDropDown,
    btnLoader,
    placeLoader,
    showTaxFeeArea,
    isGiftBoxSelected,
    selectViaMap,
    // paymentModal,
    deliveryFeeLoader,
    isProductOrderForm,
    isProductLoader,
    isSubmitFaqLoader,
    isCategoryKyc,
    isCategoryKycLoader,
    isSubmitKycLoader,
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
    selectedType,
    orderAmount,
    codMinAmount,
  } = state;
  console.log(laundrySelectedDropOffDate, availableTimeSlots, 'laundrySelectedPickupDatelaundrySelectedPickupDate')
  //Redux store data
  const userData = useSelector((state) => state?.auth?.userData);
  const {
    appData,
    allAddresss,
    themeColors,
    currencies,
    languages,
    appStyle,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
  const selectedLanguage = languages?.primary_language?.sort_code;
  const fontFamily = appStyle?.fontSizeData;
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const styles = stylesFun({
    fontFamily,
    themeColors,
    isDarkMode,
    MyDarkTheme,
  });

  const { preferences } = appData?.profile;
  console.log(preferences, cartData, 'perferences-------')
  const { additional_preferences, digit_after_decimal } = preferences;

  const selectedAddressData = useSelector(
    (state) => state?.cart?.selectedAddress,
  );
  const recommendedVendorsdata = appMainData?.vendors;
  const { dineInType, appMainData, location } = useSelector(
    (state) => state?.home,
  );
  console.log(localeSheduledOrderDate, 'localeSheduledOrderDate')
  //Update states on screens
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  let businessType = appData?.profile?.preferences?.business_type || null;

  const closeForm = () => {
    setPrescriptionModal(false);
    updateState({
      isProductOrderForm: false,
      isCategoryKyc: false,
    });
    Keyboard.dismiss();
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     const backHandler = BackHandler.addEventListener(
  //       'hardwareBackPress',
  //       androidBackButtonHandler,
  //     );
  //     return () => backHandler.remove();
  //   }, []),
  // );

  const androidBackButtonHandler = () => {
    setPaymentModal(false)
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!checkCartItem?.data?.item_count) {
        updateState({ isLoadingB: true });
      }
      getCartDetail();
      return () => { };
    }, [
      currencies,
      languages,
      route?.params?.promocodeDetail,
      allAddresss,
      selectedAddress,
      isRefreshing,
      checkCartItem?.data?.item_count,
      sel_types,
    ]),
  );

  useEffect(() => {
    if (
      !!checkCartItem?.data &&
      !!checkCartItem?.data?.products &&
      !!checkCartItem?.data?.products?.length
    ) {
      checkforAddressUpdate();
    }
  }, [selectedAddress, allAddresss]);
  useEffect(() => {
    if (!isVisibleMtnGateway && mtnGatewayResponse) {
      showError('Request TimeOut')
      //   navigation.goBack()
      updateState({ placeLoader: false, isLoading: false })
      getCartDetail()
    }
  }, [isVisibleMtnGateway])
  //check for addreess Update and change
  const checkforAddressUpdate = () => {
    if (allAddresss?.length == 0) {
      setSelectedAddress(null);
      actions.saveAddress(null);
      return;
    }
    if (!selectedAddress && allAddresss?.length) {
      let find = allAddresss.find((x) => x.is_primary);
      if (find) {
        setSelectedAddress(find);
        actions.saveAddress(find);
      } else {
        actions.saveAddress(null);
        setSelectedAddress(null);
      }
      return;
    }
  };

  //get All address
  const getAllAddress = () => {
    if (!!userData?.auth_token) {
      actions
        .getAddress(
          {},
          {
            code: appData?.profile?.code,
          },
        )
        .then((res) => {
          updateState({
            isLoadingB: false,
          });
          if (res?.data) {
            actions.saveAllUserAddress(res?.data);
          }
        })
        .catch(errorMethod);
    }
  };

  const getDate = (date) => {
    const local = moment.utc(date).local().format('DD MMM YYYY hhðŸ‡²ðŸ‡²a');
    return local;
  };
  //get the entire cart detail
  const getCartDetail = () => {
    // alert("cart detail hit")
    let apiData = `/?type=${dineInType}${paramsData?.data?.queryURL ? `&${paramsData?.data?.queryURL}` : ''
      }`;
    if (!!sel_types) {
      apiData = apiData + `&code=${sel_types}`;
    }
    console.log('Sending api data', apiData);
    let apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      systemuser: DeviceInfo.getUniqueId(),
      timezone: RNLocalize.getTimeZone(),
      device_token: DeviceInfo.getUniqueId(),
    };
    console.log('Sending api header', apiHeader);
    actions
      .getCartDetail(apiData, {}, apiHeader)
      .then((res) => {
        console.log('cart details>>>', res);
        closeForm();
        actions.cartItemQty(res);
        setIsShimmerLoading(false);

        !(
          dineInType === 'delivery' ||
          dineInType === 'on_demand' ||
          dineInType === 'p2p'
        ) && setVendorAddress(res?.data?.vendor_details?.vendor_address || {});
        let checkDate = !!res?.data?.scheduled_date_time;
        updateState({ deliveryFeeLoader: false, isSubmitFaqLoader: false });

        if (!!checkDate && res?.data?.schedule_type == 'schedule') {
          let formatDate = new Date(res?.data?.scheduled_date_time);
          setLocaleSheduledOrderDate(
            timeInLocalLangauge(formatDate, selectedLanguage),
          );
        } else {
          setScheduleType('now');
          setLocaleSheduledOrderDate(null);
        }

        //schedule date for pickup and  dropoff
        let checkDateDropOFf = !!res?.data?.schedule_dropoff;
        let checkDatePickUp = !!res?.data?.schedule_pickup;

        if (!!checkDatePickUp) {
          let formatDate2 = new Date(res?.data?.schedule_pickup);
          setLocalPickupDate(
            timeInLocalLangauge(formatDate2, selectedLanguage),
          );
        }

        if (!!checkDateDropOFf) {
          let formatDate3 = new Date(res?.data?.schedule_dropoff);
          setLocaleDropOffDate(
            timeInLocalLangauge(formatDate3, selectedLanguage),
          );
        }
        setPickupDriverComment(
          res?.data?.comment_for_pickup_driver
            ? res?.data?.comment_for_pickup_driver
            : pickupDriverComment,
        );
        setDropOffDriverComment(
          res?.data?.comment_for_dropoff_driver
            ? res?.data?.comment_for_dropoff_driver
            : dropOffDriverComment,
        );
        setVendorComment(
          res?.data?.comment_for_vendor
            ? res?.data?.comment_for_vendor
            : vendorComment,
        );
        setSheduledorderdate(res?.data?.scheduled_date_time);
        setSheduledpickupdate(res?.data?.schedule_pickup);
        setSheduleddropoffdate(res?.data?.schedule_dropoff);

        setScheduleType(res?.data?.schedule_type);
        if (res && !isEmpty(res?.data)) {
          if (
            !!res?.data?.vendor_details?.vendor_tables &&
            res?.data?.vendor_details?.vendor_tables?.length > 0
          ) {
            res?.data?.vendor_details?.vendor_tables.forEach(
              (item, indx) =>
              (tableData[indx] = {
                id: item?.id,
                label: `${strings.CATEGORY}: ${item?.category?.title ? item?.category?.title : ''
                  } | ${strings.TABLE}: ${item?.table_number ? item?.table_number : 0
                  } | ${strings.SEAT_CAPACITY}: ${item?.seating_number ? item?.seating_number : 0
                  }`,
                value: `${strings.CATEGORY}: ${item?.category?.title ? item?.category?.title : ''
                  } | ${strings.TABLE}: ${item?.table_number ? item?.table_number : 0
                  } | ${strings.SEAT_CAPACITY}: ${item?.seating_number ? item?.seating_number : 0
                  }`,
                title: item?.category?.title,
                table_number: item?.table_number,
                seating_number: item?.seating_number,
                vendor_id: res?.data?.vendor_details?.vendor_address.id,
              }),
              setTableData(tableData),
            );
            const data = {
              vendor_id: tableData[0].vendor_id,
              table: tableData[0].id,
            };
            _vendorTableCart(data, tableData[0]);
          }
          var months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May',
            'Jun', 'Jul', 'Aug', 'Sept',
            'Oct', 'Nov', 'Dec'
          ];
          function monthNameToNum(monthname) {
            var month = months.indexOf(monthname);
            return month ? month + 1 : 0;
          }
          if (!!res?.data?.products.length && res?.data?.products[0]?.delaySlot) {
            var delaySlot = res?.data?.products[0]?.delaySlot.replace(/,/g, "").split(" ");
            const mont = monthNameToNum(delaySlot[1])
            const timeSlot = `${delaySlot[2]}-${mont > 9 ? '' : '0'}${mont}-${delaySlot[0]}`
            setMinimumDelayVendorDate(timeSlot);
          }
          setCartItems((!!res?.data && !!res?.data?.products) ? res?.data?.products : []);
          let currentDate = moment(new Date()).format('YYYY-MM-DD');
          // console.log(res?.data?.scheduled_date_time.slice(0, -6), "res?.data?.scheduled_date_time")
          let getApiScheduledDate =
            currentDate == res?.data?.scheduled_date_time?.slice(0, -6);
          setApiScheduledDate(getApiScheduledDate);

          // if (getBundleId == appIds.masa) {
          //   if (currentDate == sheduledorderdate || currentDate == getApiScheduledDate) {
          //     setAvailableTimeSlots([])
          //   } else {
          //     setAvailableTimeSlots(res?.data?.slots)
          //   }
          // } else {
          //   setAvailableTimeSlots(res?.data?.slots);
          // }
          // getBundleId == appIds.masa ? currentDate == sheduledorderdate ||  currentDate == getApiScheduledDate ? setAvailableTimeSlots([]):  setAvailableTimeSlots(res?.data?.slots): setAvailableTimeSlots(res?.data?.slots)
          setAvailableTimeSlots(res?.data?.slots);
          // setLaundryAvailablePickupSlot(res?.data?.slots);
          // setLaundryAvailableDropOffSlot(res?.data?.slots);

          setCartData(res?.data);

          updateState({
            isLoadingB: false,
            isRefreshing: false,
          });
          if (!res?.data?.schedule_type && !isEmpty(res?.data?.products) && res?.data?.products.length > 0) {
            //if schedule type is null then hit the api again with now option
            setDateAndTimeSchedule();
          }
        } else {
          setCartItems([]);
          setCartData({});
          updateState({
            isLoadingB: false,
            isRefreshing: false,
            deliveryFeeLoader: false,
          });
        }
      })
      .catch(errorMethod);

    getItem('selectedTable')
      .then((res) => {
        setDefaultSelectedTable(res);
      })
      .catch(errorMethod);
  };

  console.log('cart data_++++++++', cartData, businessType, dineInType);
  //add /delete products from cart
  const addDeleteCartItems = (item, index, type) => {
    let quanitity = null;
    let itemToUpdate = cloneDeep(item);
    let quantityToIncrease = !!itemToUpdate?.product?.batch_count
      ? Number(itemToUpdate?.product?.batch_count)
      : 1;
    if (type == 1) {
      quanitity = Number(itemToUpdate.quantity) + quantityToIncrease;
    } else {
      if (
        Number(itemToUpdate.quantity - itemToUpdate?.product?.batch_count) <=
        itemToUpdate?.product?.minimum_order_count
      ) {
        quanitity = itemToUpdate.quantity - 1;
      } else {
        quanitity = Number(itemToUpdate.quantity) - quantityToIncrease;
      }
    }
    if (quanitity) {
      let data = {};
      data['cart_id'] = itemToUpdate?.cart_id;
      data['quantity'] = quanitity;
      data['cart_product_id'] = itemToUpdate?.id;
      data['type'] = dineInType;
      setBtnLoaderId(item?.id);
      updateState({ btnLoader: true });
      actions.increaseDecreaseItemQty(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
        .then((res) => {
          console.log('cart detail', res);
          actions.cartItemQty(res);
          setCartItems(res?.data?.products);
          setCartData(res?.data);
          actions.reloadData(!reloadData);

          updateState({
            btnLoader: false,
          });
        })
        .catch(errorMethod);
    } else {
      updateState({ btnLoader: true });
      removeItem('selectedTable');
      removeProductFromCart(itemToUpdate);
    }
  };


  //decrementing/removeing products from cart
  const removeProductFromCart = (item) => {
    console.log(item, "itemmmmm?>>>>>");
    let data = {};
    data['cart_id'] = item?.cart_id;
    data['cart_product_id'] = item?.id;
    data['type'] = dineInType;
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log('cart res remove', res);
        actions.reloadData(!reloadData);
        if (!!res?.data && !!res?.data?.products) {
          actions.cartItemQty(res);
          setCartItems(res?.data?.products || []);
          setCartData(res?.data);
          actions.reloadData(!reloadData);
          updateState({
            isLoadingB: false,
            btnLoader: false,
            deliveryFeeLoader: false,
          });
        } else {
          actions.cartItemQty({});
          updateState({
            isLoadingB: false,
            btnLoader: false,
            deliveryFeeLoader: false,
          });
        }
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Close modal for Clear cart
  const closeOptionModal = () => {
    updateState({ isModalVisibleForClearCart: false });
  };

  const bottomButtonClick = () => {
    setIsShimmerLoading(true);
    updateState({ isModalVisibleForClearCart: false });
    removeItem('selectedTable');
    setTimeout(() => {
      clearEntireCart();
    }, 1000);
  };

  //Clear cart
  const clearEntireCart = () => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        actions.cartItemQty({});
        console.log(res, '<==resOccured');
        setCartItems([]);
        setCartData({});

        updateState({
          isLoadingB: false,
        });
        // getAllWishListData();
        showSuccess(res?.message);
      })
      .catch(err => console.log(err, "errr>>?"));
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, '<==errorOccured');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      btnLoader: false,
      placeLoader: false,
      deliveryFeeLoader: false,
      isProductLoader: false,
      isSubmitFaqLoader: false,
      isCategoryKycLoader: false,
      isSubmitKycLoader: false,
      isModalVisibleForPayFlutterWave: false,
      isProductOrderForm: false,
    });
    setPrescriptionModal(false);
    setPrescriptionLoading(false);
    showError(
      error?.error?.description ||
      error?.description ||
      error?.message ||
      error?.error ||
      error,
    );
  };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS, {
      vendor: vendor,
      cartId: cartData?.id,
    })();
  };

  useEffect(() => {
    if (paramsData?.transactionId && !!checkCartItem?.data) {
      _directOrderPlace();
    }
  }, [paramsData?.transactionId]);
  console.log(selectedPayment, 'selectedPaymentselectedPayment')
  //Verify your promo code
  const _removeCoupon = (item, cartData) => {
    // updateState({ isLoadingB: true });
    let data = {};
    data['vendor_id'] = item?.vendor_id;
    data['cart_id'] = cartData?.id;
    data['coupon_id'] = item?.couponData?.coupon_id;

    actions
      .removePromoCode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        if (res) {
          showSuccess(res?.message || res?.error);
          getCartDetail();
        } else {
          updateState({ isLoadingB: false });
        }
      })
      .catch(errorMethod);
  };

  console.log('cart data++++', cartData);

  //flutter wave
  var redirectTimeout;
  const handleOnRedirect = (data) => {
    clearTimeout(redirectTimeout);
    redirectTimeout = setTimeout(() => {
      // do something with the result
      updateState({ isModalVisibleForPayFlutterWave: false });
    }, 200);
    try {
      if (data && data?.transaction_id) {
        let apiData = {
          payment_option_id: paymentDataFlutterWave?.payment_option_id,
          order_number: paymentDataFlutterWave?.orderDetail?.order_number,
          transaction_id: data?.transaction_id,
          amount: paymentDataFlutterWave?.total_payable_amount,
          action: 'cart',
        };

        console.log(apiData, 'apiData');
        actions
          .openSdkUrl(
            `/${paymentDataFlutterWave?.selectedPayment?.code?.toLowerCase()}`,
            apiData,
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
            },
          )
          .then((res) => {
            console.log(res, 'openSdkUrl');
            if (res && res?.status == 'Success') {
              setCartItems([]);
              setCartData({});
              actions.reloadData(!reloadData);
              moveToNewScreen(navigationStrings.ORDERSUCESS, {
                orderDetail: {
                  order_number:
                    paymentDataFlutterWave?.orderDetail?.order_number,
                  id: paymentDataFlutterWave?.orderDetail?.id,
                },
              })();
            } else {
              redirectTimeout = setTimeout(() => {
                // do something with the result
                updateState({
                  isModalVisibleForPayFlutterWave: false,
                  placeLoader: false,
                  deliveryFeeLoader: false,
                });
              }, 200);
            }
          })
          .catch(errorMethod);
      } else {
        let apiData = {
          order_number: paymentDataFlutterWave?.orderDetail?.order_number,
          action: 'cart',
        };
        actions
          .cancelSdkUrl(
            `/${paymentDataFlutterWave?.selectedPayment?.code?.toLowerCase()}`,
            apiData,
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
            },
          )
          .then((res) => {
            console.log(res, 'cancelPaytabUrl---resfrompaytab');
            redirectTimeout = setTimeout(() => {
              // do something with the result
              updateState({
                isModalVisibleForPayFlutterWave: false,
                placeLoader: false,
                deliveryFeeLoader: false,
              });
            }, 200);
          })
          .catch(errorMethod);
      }
    } catch (error) {
      console.log('error raised', error);
      redirectTimeout = setTimeout(() => {
        // do something with the result
        updateState({
          isModalVisibleForPayFlutterWave: false,
          placeLoader: false,
        });
      }, 200);
    }
  };

  //flutter wave
  const checkPaymentOptions = (res) => {

    updateState({ placeLoader: true });

    let paymentId = res?.data?.payment_option_id;
    let order_number = res?.data?.order_number;


    // setSelectedPayment(selectedPayment);
    console.log('api res success', res);

    let paymentData = {
      total_payable_amount: (
        Number(cartData?.total_payable_amount) +
        (selectedTipAmount != null && selectedTipAmount != ''
          ? Number(selectedTipAmount)
          : 0)
      ).toFixed(appData?.profile?.preferences?.digit_after_decimal),
      payment_option_id: selectedPayment?.id,
      orderDetail: res?.data,
      redirectFrom: 'cart',
      selectedPayment: selectedPayment,
    };
    if (
      !!paymentId &&
      !!(
        Number(cartData?.total_payable_amount) + Number(selectedTipAmount) ===
        0
      )
    ) {
      moveToNewScreen(navigationStrings.ORDERSUCESS, {
        orderDetail: res?.data,
      })();
      updateState({ placeLoader: false });
      return;
    }

    switch (paymentId) {
      case 4: _offineLinePayment(order_number);
        return;
      case 48: mtnGateway(res);
        return;
      case 5: //Paystack Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAYSTACK, paymentData);
        return;
      case 6: //Payfast Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAYFAST, paymentData);
        return;
      case 7: //Mobbex Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.MOBBEX, paymentData);
        return;
      case 8: //Yoco Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.YOCO, paymentData);
        return;
      case 9: //Pyalink Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAYLINK, paymentData);
        return;
      case 12: //Simplify Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.SIMPLIFY, paymentData);
        return;
      case 13: //Square Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.SQUARE, paymentData);
        break;
      case 15: //Pagarme Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAGARME, paymentData);
        return;
      case 17: //Checkout Payment Getway
        updateState({ placeLoader: false });
        checkoutPayment(paymentData);
        return;
      case 18: //AuthorizeNet Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.AuthorizeNet, paymentData);
        return;
      case 19: //FPX Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.FPX, paymentData);
        return;
      case 20: //AuthorizeNet Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.KONGOPAY, paymentData);
        return;

      case 22: //AuthorizeNet Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.AVENUE, paymentData);
        return;
      case 24: //Cashfree Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.CASH_FREE, paymentData);
        return;
      case 25: //Easebuzz Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.EASEBUZZ, paymentData);
        return;
      case 28: //Easebuzz Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.VNPAY, paymentData);
        return;
      case 26: //ToyyibPay Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.TOYYIAPAY, paymentData);
        return;
      case 36: //ToyyibPay Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.MYCASH, paymentData);
        return;
      case 27: //Paytab Payment Getway
        openPayTabs(paymentData);
        return;

      case 30: //Paytab Payment Getway
        // updateState({ placeLoader: false });
        updateState({
          isModalVisibleForPayFlutterWave: true,
          paymentDataFlutterWave: paymentData,
        });

        // openPayTabs(paymentData)

        return;

      case 29: //Easebuzz Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.MPAISA, paymentData);
        return;

      case 34: //Easebuzz Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.WINDCAVE, paymentData);
        return;

      case 32: //PAYPHONE Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PAYPHONE, paymentData);
        return;

      case 37: //STRIPEOXXO Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.STRIPEOXXO, paymentData);
        return;

      case 39: //STRIPEOXXO Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.STRIPEIDEAL, paymentData);
        return;

      case 21: //VIVAWALLET Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.VIVAWALLET, paymentData);
        return;
      case 40: //USEREDE Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.USEREDE, paymentData);
        return;
      case 41: //OPENPAY Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.OPENPAY, paymentData);
        return;
      case 42: //Direct Pay Online Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.DIRECTPAYONLINE, paymentData);
        return;
      case 44: //Conekta Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.CONEKTA, paymentData);
        return;
      case 47: //Direct Pay Online Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.KHALTI, paymentData);
        return;
      case 52: //SaamanShop: skipCash  Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.SKIP_CASH, paymentData);
        return;
      case 57: //stafood: pesapal  Payment Getway
        updateState({ placeLoader: false });
        navigation.navigate(navigationStrings.PESAPAL, paymentData);
        return;
      default:
        if (
          !!businessType &&
          businessType == 'home_service' &&
          res?.data?.vendors?.length == 1
        ) {
          _getOrderDetail(res?.data?.vendors[0]);
        }
        else {
          moveToNewScreen(navigationStrings.ORDERSUCESS, {
            orderDetail: res?.data,
          })();
          actions.cartItemQty({});
        }
        return;
    }
  };

  const openPayTabs = async (data) => {
    data['serverKey'] = appData?.profile?.preferences?.paytab_server_key;
    data['clientKey'] = appData?.profile?.preferences?.paytab_client_key;
    data['profileID'] = appData?.profile?.preferences?.paytab_profile_id;
    data['currency'] = currencies?.primary_currency?.iso_code;
    data['merchantname'] = appData?.profile?.company_name;
    data['countrycode'] = appData?.profile?.country?.code;
    try {
      const res = await payWithCard(data);
      console.log('payWithCard res++++', res);
      if (res && res?.transactionReference) {
        let apiData = {
          payment_option_id: data?.payment_option_id,
          order_number: data?.orderDetail?.order_number,
          transaction_id: res?.transactionReference,
          amount: data?.total_payable_amount,
          action: 'cart',
        };

        console.log(apiData, 'apiData');
        actions
          .openPaytabUrl(apiData, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          })
          .then((res) => {
            console.log(res, 'resfrompaytab');
            if (res && res?.status == 'Success') {
              updateState({ placeLoader: false, deliveryFeeLoader: false });
              setCartItems([]);
              setCartData({});
              actions.reloadData(!reloadData);
              moveToNewScreen(navigationStrings.ORDERSUCESS, {
                orderDetail: {
                  order_number: data?.orderDetail?.order_number,
                  id: data?.orderDetail?.id,
                },
              })();
            } else {
              updateState({ placeLoader: false, deliveryFeeLoader: false });
            }
          })
          .catch(errorMethod);
      } else {
        let apiData = {
          order_number: data?.orderDetail?.order_number,
          action: 'cart',
        };
        actions
          .cancelPaytabUrl(apiData, {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          })
          .then((res) => {
            console.log(res, 'cancelPaytabUrl---resfrompaytab');
            updateState({ placeLoader: false, deliveryFeeLoader: false });
          })
          .catch(errorMethod);
      }
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const checkoutPayment = (paymentData) => {
    let queryData = `/${paymentData?.selectedPayment?.code?.toLowerCase()}?amount=${paymentData?.total_payable_amount
      }&payment_option_id=${paymentData?.payment_option_id}&order_number=${paymentData?.orderDetail?.order_number
      }&token=${!!cardInfo ? cardInfo : null}&action=cart`;

    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'ressssss');
        setCartItems([]);
        setCartData({});
        actions.reloadData(!reloadData);
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          orderDetail: {
            order_number: paymentData?.orderDetail?.order_number,
            id: paymentData?.orderDetail?.id,
          },
        })();
      })
      .catch(errorMethod);
  };
  const _paymentWithPlugnPayMethods = (response) => {

    let selectPaymentCode = selectedPayment?.code?.toLowerCase()
    let CardNumber = paramsData?.CardNumber ? paramsData?.CardNumber.split(" ").join("") : ''
    console.log("paramsData =>", paramsData);
    let expirydate
    if (selectedPayment?.id == 50) {

      expirydate = paramsData?.year ? paramsData?.year.concat(paramsData?.date) : ''
      console.log(expirydate, 'expirydate')
    }
    else {
      expirydate = paramsData?.expiryDate || ''
    }
    let cvc = paramsData?.cvc || ''
    let Order_Number = response?.data?.order_number || ''
    let saveCard = !!paramsData?.saveCardDetails ? 1 : 0
    let amount = Number(cartData?.total_payable_amount) +
      (selectedTipAmount != null && selectedTipAmount != "" ? Number(selectedTipAmount) : 0)

    let savedCardId = paramsData?.selectedSavedListCardNumber && paramsData?.selectedSavedListCardNumber.id || ''

    let queryData = `/${selectPaymentCode}?amount=${amount}&cv=${cvc}&dt=${expirydate}&cno=${CardNumber}&order_number=${Order_Number}&card_id=${savedCardId}&action=cart`;
    if (selectedPayment?.id == 50 && !!CardNumber) { queryData = queryData + `&save_card=${saveCard}` }
    console.log('QueryData----------', queryData)
    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      )
      .then((res) => {
        console.log(res, "Response>>>>>");
        if (res?.status == 'Success' || res?.status == 200) {
          updateState({ isLoadingB: false })
          moveToNewScreen(navigationStrings.ORDERSUCESS, {
            orderDetail: response?.data,
          })();
        }
        else {
          updateState({ isLoadingB: false, placeLoader: false })
          showError(res?.msg)
        }
        // getPlugnPayUrlData(res)
      })
      .catch((err) => {
        updateState({ isLoadingB: false, placeLoader: false })
        console.log('Error>>>>>>>>>>>', err)
        showError(err?.msg || err?.error)
      })
  }


  const _directOrderPlace = () => {
    let data = {};
    data['vendor_id'] = cartData?.products[0]?.vendor_id;
    data['address_id'] =
      dineInType != 'delivery'
        ? ''
        : paramsData?.selectedAddressData?.id || selectedAddressData?.id;
    data["payment_option_id"] =
      paramsData?.selectedPayment?.id || selectedPayment?.id || 1;

    data['type'] = dineInType || '';
    data['is_gift'] = isGiftBoxSelected ? 1 : 0;
    data['specific_instructions'] = instruction;
    data['order_product'] = [54, 56]

    if (paramsData?.transactionId) {
      data['transaction_id'] = paramsData?.transactionId;
    }
    if (!!selectedTipAmount) {
      data['tip'] = selectedTipAmount || '';
    }
    data['amount'] = Number(cartData?.total_payable_amount) +
      (selectedTipAmount != null && selectedTipAmount != ""
        ? Number(selectedTipAmount)
        : 0),
      placeOrderData(data);
  };

  const placeOrderData = (data) => {
    console.log('Sending data', data);

    let headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      latitude: !isEmpty(location) ? location?.latitude.toString() : '',
      longitude: !isEmpty(location) ? location?.longitude.toString() : '',
      // systemuser: DeviceInfo.getUniqueId(),
    };
    console.log(headerData, 'headerData');

    actions
      .placeOrder(data, headerData)
      .then((res) => {
        console.log(res, "placeOrder");

        navigation.popToTop();
        actions.reloadData(!reloadData);
        actions.cartItemQty(0);
        setPickupDriverComment(null);
        setDropOffDriverComment(null);
        setVendorComment(null);
        setLocalPickupDate(null);
        setLocaleDropOffDate(null);
        setSheduledpickupdate(null);
        setModalType(null);
        setSheduleddropoffdate(null);

        if (selectedPayment?.id === 49 || selectedPayment?.id === 50 || selectedPayment?.id === 53) {
          updateState({ placeLoader: true, isLoadingB: true })
          _paymentWithPlugnPayMethods(res);
          return;
        }
        else {
          checkPaymentOptions(res);
        }
        if (
          selectedPayment?.id != 32 &&
          selectedPayment?.id != 17 &&
          selectedPayment?.id != 4 &&
          selectedPayment?.id != 27 &&
          selectedPayment?.id != 26 &&
          selectedPayment?.id != 30 &&
          selectedPayment?.id != 29 &&
          selectedPayment?.id != 37 &&
          selectedPayment?.id != 21 &&
          selectedPayment?.id != 36 &&
          selectedPayment?.id != 39 &&
          selectedPayment?.id != 34 &&
          selectedPayment?.id != 41 &&
          selectedPayment?.id != 44 &&
          selectedPayment?.id != 49 &&
          selectedPayment?.id != 50 &&
          selectedPayment?.id != 53 &&
          selectedPayment?.id != 48
        ) {
          setCartItems([]);
          setCartData({});
          actions.reloadData(!reloadData);
          if (selectedPayment?.id == 1 || res?.data?.payable_amount == 0) {
            updateState({
              isLoadingB: false,
              placeLoader: false,
            });
            showSuccess(res?.message);
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res?.data,
            })();
            return;
          }
          return;
        }
      })
      .catch(errorMethod);
  };

  const _getOrderDetail = ({ order_id, vendor_id }) => {
    // return;
    let data = {};
    data['order_id'] = order_id;
    data['vendor_id'] = vendor_id;
    // updateState({ isLoading: true });
    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        timezone: RNLocalize.getTimeZone(),
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res===> order detail');
        if (res?.data) {
          if (
            !!businessType &&
            businessType == 'home_service' &&
            res?.data?.vendors?.length == 1 &&
            res?.data?.vendors[0]?.dispatch_traking_url
          ) {
            setCartItems([]);
            setCartData({});
            actions.reloadData(!reloadData);

            updateState({
              isLoadingB: false,
              placeLoader: false,
            });
            navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
              orderId: order_id,
              fromVendorApp: true,
              selectedVendor: { id: vendor_id },
              orderDetail: res?.data?.vendors[0],
              showRating:
                res?.data?.vendors[0]?.order_status?.current_status?.id != 6
                  ? false
                  : true,
            });
            actions.cartItemQty({});
          } else {
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res?.data,
            })();
            setCartItems([]);
            setCartData({});
            actions.reloadData(!reloadData);
            updateState({
              isLoadingB: false,
              placeLoader: false,
            });
          }
        }
      })
      .catch(errorMethod);
  };

  // false, 'schedule', value
  const setDateAndTimeSchedule = (

    toHitApiForPlaceOrder = false,
    dateType = scheduleType,
    scheduleDate = sheduledorderdate,
  ) => {

    if (!userData?.auth_token) {
      return;
    }

    let data = {};

    if (businessType == 'laundry') {
      data['comment_for_pickup_driver'] = pickupDriverComment;
      data['comment_for_dropoff_driver'] = dropOffDriverComment;
      data['comment_for_vendor'] = vendorComment;
      data['schedule_pickup'] = laundrySelectedPickupDate
        ? laundrySelectedPickupDate
        : null;
      data['schedule_dropoff'] = laundrySelectedDropOffDate
        ? laundrySelectedDropOffDate
        : null;
      data['slot'] = !!laundrySelectedPickupSlot
        ? laundrySelectedPickupSlot
        : null;
      data['dropoff_scheduled_slot'] = !!laundrySelectedDropOffSlot
        ? laundrySelectedDropOffSlot
        : null;
    } else {
      data['task_type'] = !!selectedTimeSlots ? 'schedule' : dateType;

      if (!!selectedTimeSlots) {
        const date = selectedDateFromCalendar;
        const time = selectedTimeSlots.split('-')[0];

        // const formatDate = moment(
        //   `${date} ${time}`,
        //   'YYYY-MM-DD HH:mm:ss',
        // ).format();
        // console.log('formatDate', formatDate);
        data['schedule_dt'] = selectedDateFromCalendar;
      } else {
        data['schedule_dt'] =
          dateType != 'now' && scheduleDate
            ? new Date(scheduleDate).toISOString()
            : null;
      }
      data['specific_instructions'] = instruction;
      data['slot'] = selectedTimeSlots;
    }
    console.log(data, 'schedule api data');

    // updateState({isLoading: false});

    actions
      .scheduledOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'schedulte api res res>>>');
        if (res && res?.status == 'Success') {
          if (toHitApiForPlaceOrder && businessType == 'laundry') {
            _finalPayment();
          }
          updateState({
            // isLoadingB: toHitApiForPlaceOrder ? true : false,
          });
        } else {
          updateState({
            isLoadingB: false,
          });
        }
      })
      .catch((error) => console.log(error, 'errororor'));
  };

  const _finalPayment = () => {
    // if (selectedPayment?.id == 4 && selectedPayment?.off_site == 0) {
    //   _offineLinePayment();
    //   return;
    if (
      selectedPayment?.id == 10 &&
      selectedPayment?.off_site == 0 &&
      !!(
        Number(cartData?.total_payable_amount) + Number(selectedTipAmount) !==
        0
      )
    ) {
      _renderRazor();
      return;
    }
    if (
      selectedPayment?.id === 3 &&
      selectedPayment?.off_site === 1 &&
      !!(
        Number(cartData?.total_payable_amount) + Number(selectedTipAmount) !==
        0
      )
    ) {
      _webPayment();
      return;
    }
    else {
      _directOrderPlace();
    }

  };

  const formatDateSlot = (date, time) => {
    return moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm:ss').format();
  };

  console.log(vendorAddress, 'vendorAddress....');

  //Clear cart
  const placeOrder = () => {
    isFAQsSubmitted = true;
    if (!!userData?.auth_token) {
      if (businessType == 'laundry') {
        const pickupTime = laundrySelectedPickupSlot.split('-')[0];
        const dropTime = laundrySelectedDropOffSlot.split('-')[0];
        const formattedPickup = formatDateSlot(
          laundrySelectedPickupDate,
          pickupTime,
        );
        const formattedDrop = formatDateSlot(
          laundrySelectedDropOffDate,
          dropTime,
        );

        if (formattedPickup >= formattedDrop) {
          showError('Drop off date time must be greater then pickup date time');
          return;
        }
      }

      if (
        !!cartData?.closed_store_order_scheduled &&
        cartData?.products[0]?.vendor?.is_vendor_closed &&
        !localeSheduledOrderDate
      ) {
        showInfo(strings.SCHEDULE_DATE_REQUIRED);
        return;
      }
      if (!!cartData?.delay_date && !localeSheduledOrderDate) {
        showInfo(strings.SCHEDULE_DATE_REQUIRED);
        return;
      }
      if (!!cartData?.pickup_delay_date && !!cartData?.dropoff_delay_date) {
        showInfo(strings.SCHEDULE_DATE_REQUIRED);
        return;
      }
      if (
        Number(cartData?.total_payable_amount) +
        (selectedTipAmount != null && selectedTipAmount != ''
          ? Number(selectedTipAmount)
          : 0) !=
        0 &&
        isEmpty(selectedPayment)
      ) {
        // showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
        setPaymentModal(true)
        // moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS)();
        return;
      }

      if (cartData?.without_category_kyc === 0 && cartData?.category_kyc_count !== 0) {
        showError('Please submit KYC form!');
        return;
      }
      cartItems.map((itm, inx) => {
        itm?.vendor_products.map((item, index) => {
          if (item?.faq_count && item?.user_product_order_form == null) {
            isFAQsSubmitted = false;
          }
        });
      });

      // if (!isFAQsSubmitted) {
      //   showInfo("Please fill all product's FAQs");
      //   return;
      // }

      updateState({ placeLoader: true });
      var d1 = new Date();
      var d2 = new Date(localeSheduledOrderDate);

      if (
        !selectedAddressData &&
        (dineInType === 'delivery' ||
          dineInType === 'on_demand' ||
          dineInType === 'p2p')
      ) {
        // showError(strings.PLEASE_SELECT_ADDRESS);
        setModalVisible(true);
      } else if (!selectedPayment) {
        errorMethod(strings.PLEASE_SELECT_PAYMENT_METHOD);
      } else if (scheduleType == 'schedule' && d1.getTime() >= d2.getTime()) {
        errorMethod(strings.INVALID_SCHEDULED_DATE);
      } else {
        if (
          !!(
            !!userData?.client_preference?.verify_email &&
            !userData?.verify_details?.is_email_verified
          ) ||
          !!(
            !!userData?.client_preference?.verify_phone &&
            !userData?.verify_details?.is_phone_verified
          )
        ) {
          updateState({
            isLoadingB: false,
            placeLoader: false,
          });
          moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
            ...userData,
            fromCart: true,
          })();
        } else {
          _finalPayment();
        }
      }
    } else {
      updateState({ placeLoader: false });
      setAppSessionRedirection();
    }
  };

  const setAppSessionRedirection = () => {
    actions.setRedirection('cart');
    actions.setAppSessionData('on_login');
  };

  useEffect(() => {
    if (paramsData?.redirectFrom && !!checkCartItem?.data) {
      _directOrderPlace();
    }
  }, [paramsData?.redirectFrom]);

  const swipeRef = useRef(null);

  const openDeleteView = async (item) => {
    updateState({ deliveryFeeLoader: true });
    let itemToUpdate = cloneDeep(item);
    removeItem('selectedTable');
    removeProductFromCart(itemToUpdate);
    // if (!!swipeRef && swipeRef?.current) {
    //     swipeRef?.current.openRight()
    // }
  };

  const swipeBtns = (progress, dragX) => {
    return (
      <Animated.View
        key={String(cartItems?.length)}
        style={{
          ...styles.swipeView,
        }}>
        <FastImage
          source={imagePath.deleteRed}
          resizeMode="contain"
          style={{
            width: moderateScale(16),
            height: moderateScale(16),
          }}
        />
      </Animated.View>
    );
  };

  const _webPayment = () => {
    let selectedMethod = selectedPayment.code.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;

    console.log(returnUrl, 'returnUrl');
    console.log(cancelUrl, 'cancelUrl');
    let queryData = `/${selectedMethod}?tip=${selectedTipAmount && selectedTipAmount != ''
      ? Number(selectedTipAmount)
      : 0
      }&amount=${(
        Number(cartData?.total_payable_amount) +
        (selectedTipAmount != null && selectedTipAmount != ''
          ? Number(selectedTipAmount)
          : 0)
      ).toFixed(
        appData?.profile?.preferences?.digit_after_decimal,
      )}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&address_id=${selectedAddressData?.id
      }&payment_option_id=${selectedPayment?.id}&action=cart`;

    actions
      .openPaymentWebUrl(
        queryData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'response===>');
        setPickupDriverComment(null);
        setDropOffDriverComment(null);
        setVendorComment(null);
        setLocalPickupDate(null);
        setLocaleDropOffDate(null);
        setModalType(null);
        setSheduledpickupdate(null);
        setSheduleddropoffdate(null);
        updateState({
          isLoadingB: false,
          isRefreshing: false,
          placeLoader: false,
        });
        if (res && res?.status == 'Success' && res?.data) {
          // updateState({allAvailAblePaymentMethods: res?.data});
          navigation.navigate(navigationStrings.WEBPAYMENTS, {
            paymentUrl: res?.data,
            paymentTitle: selectedPayment?.title,
            redirectFrom: 'cart',
            selectedAddressData: selectedAddressData,
          });

          setSelectedPayment(selectedPayment);
        }

      })
      .catch(errorMethod);
  };
  // const _createPaymentMethod = async (cardInfo, res2) => {
  //   console.log(cardInfo, '_createPaymentMethod>>>ardInfo');
  //   if (res2) {
  //    await createPaymentMethod({
  //       type: 'Card',
  //       // token:tokenInfo,
  //       card: cardInfo,
  //       billing_details: {
  //         name: 'Jenny Rosen',
  //       },
  //     }).then((res) => {
  //         // updateState({isLoadingB: false});
  //         console.log('_createPaymentMethod res', res);
  //         if (res && res?.error && res?.error?.message) {
  //           showError(res?.error?.message);
  //           updateState({
  //             isRefreshing:false,
  //             isLoadingB: false,
  //             placeLoader: false,
  //           });
  //         } else {
  //           console.log(res, 'success_createPaymentMethod ');
  //           actions
  //             .getStripePaymentIntent(
  //               // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
  //               {
  //                 payment_option_id: selectedPayment?.id,
  //                 action: 'cart',
  //                 amount:
  //                   Number(cartData?.total_payable_amount) +
  //                   (selectedTipAmount != null && selectedTipAmount != ''
  //                     ? Number(selectedTipAmount)
  //                     : 0),
  //                 payment_method_id: res?.paymentMethod?.id,
  //               },
  //               {
  //                 code: appData?.profile?.code,
  //                 currency: currencies?.primary_currency?.id,
  //                 language: languages?.primary_language?.id,
  //               },
  //             )
  //             .then(async (res) => {
  //               console.log(res, 'getStripePaymentIntent response');
  //               if (res && res?.client_secret) {
  //                 const {paymentIntent, error} = await handleNextAction(
  //                   res?.client_secret,
  //                 );
  //                 if (paymentIntent) {
  //                   console.log(paymentIntent, 'paymentIntent');
  //                   if (paymentIntent) {
  //                     actions
  //                       .confirmPaymentIntentStripe(
  //                         {
  //                           payment_option_id: selectedPayment?.id,
  //                           action: 'cart',
  //                           amount:
  //                             Number(cartData?.total_payable_amount) +
  //                             (selectedTipAmount != null &&
  //                             selectedTipAmount != ''
  //                               ? Number(selectedTipAmount)
  //                               : 0),
  //                           payment_intent_id: paymentIntent?.id,
  //                           address_id: selectedAddressData?.id,
  //                           tip:
  //                             selectedTipAmount && selectedTipAmount != ''
  //                               ? Number(selectedTipAmount)
  //                               : 0,
  //                         },
  //                         {
  //                           code: appData?.profile?.code,
  //                           currency: currencies?.primary_currency?.id,
  //                           language: languages?.primary_language?.id,
  //                         },
  //                       )
  //                       .then((res) => {
  //                         updateState({isRefreshing: false});
  //                         if (res && res?.status == 'Success' && res?.data) {
  //                           // updateState({allAvailAblePaymentMethods: res?.data});
  //                           actions.cartItemQty({});
  //                           setCartItems([]);
  //                           setCartData({});
  //                           setSelectedPayment({
  //                             id: 1,
  //                             off_site: 0,
  //                             title: 'Cash On Delivery',
  //                             title_lng: strings.CASH_ON_DELIVERY,
  //                           });
  //                           setPickupDriverComment(null);
  //                           setDropOffDriverComment(null);
  //                           setVendorComment(null);
  //                           setLocalPickupDate(null);
  //                           setLocaleDropOffDate(null);
  //                           setModalType(null);
  //                           setSheduledpickupdate(null);

  //                           updateState({
  //                             isLoadingB: false,
  //                             placeLoader: false,
  //                           });
  //                           moveToNewScreen(navigationStrings.ORDERSUCESS, {
  //                             orderDetail: res?.data,
  //                           })();
  //                           showSuccess(res?.message);
  //                         } else {
  //                           setSelectedPayment({
  //                             id: 1,
  //                             off_site: 0,
  //                             title: 'Cash On Delivery',
  //                             title_lng: strings.CASH_ON_DELIVERY,
  //                           });
  //                           updateState({
  //                             isLoadingB: false,
  //                             placeLoader: false,
  //                           });
  //                         }
  //                       })
  //                       .catch(errorMethod);
  //                   }
  //                 } else {
  //                   updateState({
  //                     isRefreshing:false,
  //                     isLoadingB: false,
  //                     placeLoader: false,
  //                   });
  //                   console.log(error, 'error');
  //                   showError(error?.message || 'payment failed');
  //                 }
  //               } else {
  //                 updateState({isLoadingB: false});
  //               }
  //             })
  //             .catch(errorMethod);

  //         }
  //       })
  //       .catch(errorMethod);
  //   }ONS
  // };



  const _paymentWithStripe = async (
    cardInfo,
    tokenInfo,
    paymentMethodId,
    order_number,
  ) => {
    actions.getStripePaymentIntent(
      // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
      {
        payment_option_id: selectedPayment?.id,
        action: 'cart',
        amount:
          Number(cartData?.total_payable_amount) +
          (selectedTipAmount != null && selectedTipAmount != ''
            ? Number(selectedTipAmount)
            : 0),
        payment_method_id: paymentMethodId,
        order_number: order_number,
        card: cardInfo,
      },
      {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      },
    )
      .then(async (res) => {
        if (res && res?.client_secret) {
          const { paymentIntent, error } = await handleNextAction(
            res?.client_secret,
          );
          if (paymentIntent) {
            if (paymentIntent) {
              actions.confirmPaymentIntentStripe(
                {
                  order_number: order_number,
                  payment_option_id: selectedPayment?.id,
                  action: 'cart',
                  amount:
                    Number(cartData?.total_payable_amount) +
                    (selectedTipAmount != null && selectedTipAmount != ''
                      ? Number(selectedTipAmount)
                      : 0),
                  payment_intent_id: paymentIntent?.id,
                  address_id: selectedAddressData?.id,
                  tip:
                    selectedTipAmount && selectedTipAmount != ''
                      ? Number(selectedTipAmount)
                      : 0,
                },
                {
                  code: appData?.profile?.code,
                  currency: currencies?.primary_currency?.id,
                  language: languages?.primary_language?.id,
                },
              )
                .then((res) => {
                  console.log(res, 'secondresponse');
                  updateState({ isRefreshing: false });
                  if (res && res?.status == 'Success' && res?.data) {
                    // updateState({allAvailAblePaymentMethods: res?.data});
                    actions.cartItemQty({});
                    setCartItems([]);
                    setCartData({});
                    actions.reloadData(!reloadData);
                    setSelectedPayment({
                      id: 1,
                      off_site: 0,
                      title: 'Cash On Delivery',
                      title_lng: strings.CASH_ON_DELIVERY,
                    });
                    setPickupDriverComment(null);
                    setDropOffDriverComment(null);
                    setVendorComment(null);
                    setLocalPickupDate(null);
                    setLocaleDropOffDate(null);
                    setModalType(null);
                    setSheduledpickupdate(null);

                    updateState({
                      isLoadingB: false,
                      placeLoader: false,
                    });
                    moveToNewScreen(navigationStrings.ORDERSUCESS, {
                      orderDetail: res?.data,
                    })();
                    showSuccess(res?.message);
                  } else {
                    setSelectedPayment({
                      id: 1,
                      off_site: 0,
                      title: 'Cash On Delivery',
                      title_lng: strings.CASH_ON_DELIVERY,
                    });
                    updateState({
                      isLoadingB: false,
                      placeLoader: false,
                    });
                  }
                })
                .catch(errorMethod);
            }
          } else {
            updateState({
              isRefreshing: false,
              isLoadingB: false,
              placeLoader: false,
            });
            console.log(error, 'error');
            showError(error?.message || 'payment failed');
          }
        } else {
          updateState({ isLoadingB: false });
        }
      })
      .catch(errorMethod);
  };

  //Offline payments
  const _offineLinePayment = async (order_number) => {
    console.log("payment method id++++", paymentMethodId)
    if (!!paymentMethodId) {
      _paymentWithStripe(cardInfo, tokenInfo, paymentMethodId, order_number);
    } else {
      errorMethod(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
    }
  };
  const _renderRazor = () => {
    updateState({ isLoadingB: true });
    let options = {
      description: 'Payment for your order',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: appData?.profile?.preferences?.razorpay_api_key, // Your api key
      amount: (
        (Number(cartData?.total_payable_amount) +
          (selectedTipAmount != null && selectedTipAmount != ''
            ? Number(selectedTipAmount)
            : 0)) *
        100
      ).toFixed(0),
      name: appData?.profile?.company_name,
      prefill: {
        email: userData?.email,
        contact: userData?.phone_number || '',
        name: userData?.name,
      },
      theme: { color: themeColors.primary_color },
    };

    console.log(options, 'optios');
    RazorpayCheckout.open(options)
      .then((res) => {
        console.log(`Success for razor: `, res);
        if (res?.razorpay_payment_id) {
          let data = {};
          data['address_id'] = selectedAddressData?.id;
          data['payment_option_id'] = selectedPayment?.id;
          data['type'] = dineInType || '';
          data['transaction_id'] = res?.razorpay_payment_id;
          placeOrderData(data); // placeOrder
        } else {
          console.log(res, 'razorpay_payment_id>>>>res');
        }
      })
      .catch(errorMethod);
  };

  const paymentReponse = (res) => {
    axios({
      method: "get",
      url: res?.responseUrl,
      headers: {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        authorization: `${userData?.auth_token}`

      },
    }).then((response) => {
      console.log(response, 'reseserserseeseers');
      if (response?.data?.status == "SUCCESSFUL") {
        setIsVisibleMtnGateway(false)

        showSuccess(response?.data?.message)
        // getAllSubscriptions(true);
        updateState({ isLoading: false, placeLoader: false })
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          orderDetail: {
            order_number:
              response?.data?.order_number,
            id: response?.data?.order_id,
          },
        })()

      }
    })
      .catch((error) => {
        console.log(error, 'error');
        setMtnGatewayResponse('')
        setIsVisibleMtnGateway(false)
        showError(error?.response?.data?.message)
      })
  }


  useInterval(
    () => {
      if (!!isVisibleMtnGateway) { paymentReponse(mtnGatewayResponse); }
    },
    !!isVisibleMtnGateway ? 5000 : null,
  );


  const mtnGateway = (res) => {

    updateState({ isLoadingB: true, placeLoader: true })
    let data = {}

    data['amount'] = res?.data?.total_amount
    data['currency'] = currencies?.primary_currency?.iso_code
    data['order_no'] = res?.data?.order_number
    data['subscription_id'] = ''
    data['from'] = 'cart'

    actions.mtnGateway(data, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    })
      .then((response) => {
        console.log(response, 'rsrseereeseresre')
        updateState({ isLoadingB: false, placeLoader: false })
        if (response?.status == 'Success') {
          setIsVisibleMtnGateway(true)
          setMtnGatewayResponse(response)
          paymentReponse(response)

        }
      })
      .catch((err) => {
        console.log(err, 'ererrerererere')
        updateState({ isLoadingB: false, placeLoader: false })
        showError(err?.message)
      })
  }

  const clearSceduleDate = async () => {
    setScheduleType('now');
    setLocaleSheduledOrderDate(null);
    setSheduledorderdate(null);
  };

  useEffect(() => {
    if (
      scheduleType != null &&
      scheduleType == 'now' &&
      !!checkCartItem?.data &&
      !!checkCartItem?.data?.products &&
      !!checkCartItem?.data?.products?.length
    ) {
      setDateAndTimeSchedule();
    }
  }, [scheduleType]);

  const _selectTime = (item) => {
    setModalType('schedule');
    updateState({
      isVisibleTimeModal: true,
    });
  };
  //Select Time Laundry
  const _selectTimeLaundry = (item) => {
    console.log('item', item)
    if (item == 'dropoff') {
      setModalType('dropoff');
      updateState({
        isVisibleTimeModal: true,
      });
    } else {
      setModalType('pickup');
      updateState({
        isVisibleTimeModal: true,
      });
    }
  };

  const selectOrderDate = () => {
    if (businessType == 'laundry') {
      if (laundrySelectedPickupDate > laundrySelectedDropOffDate) {
        alert('Please select valid dates.');
        return;
      }
      if (
        modalType == 'pickup' &&
        (!laundrySelectedPickupDate || !laundrySelectedPickupSlot)
      ) {
        alert('Please select pickup date and time slots');
        return;
      }
      if (
        modalType !== 'pickup' &&
        (!laundrySelectedDropOffDate || !laundrySelectedDropOffSlot)
      ) {
        alert('Please select drop-off date and time slots');
        return;
      }
      if (
        !cartData?.same_day_delivery_for_schedule &&
        laundrySelectedDropOffDate == laundrySelectedPickupDate
      ) {
        alert('You can not schedule pickup and drop off on the same day ');
        return;
      } else {
        onClose();
        setDateAndTimeSchedule();
        return;
      }
    }
    else {
      if (availableTimeSlots.length > 0 || cartData?.slots.length > 0) {
        if (selectedDateFromCalendar == '' || selectedTimeSlots == '') {

          alert(strings.PLEASE_SELECT_DATETIME_SLOTS);
          return;
        } else {

          // let formatDate = new Date(selectedDateFromCalendar);
          const date = selectedDateFromCalendar;
          const time = selectedTimeSlots.split('-')[0];
          const formatDate = moment(
            `${date} ${time}`,
            'YYYY-MM-DD HH:mm:ss',
          ).format();

          setLocaleSheduledOrderDate(
            moment(new Date(formatDate)).format('lll'),
          );
        }
      }

      onClose();
      if (modalType != 'schedule' && businessType != 'laundry') {
        setScheduleType('schedule');
      }
      setDateAndTimeSchedule();
    }
  };

  function makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters?.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const deleteItem = async (i, index) => {
    setSwipeKey(makeid(5));
    openDeleteView(i);
    swipeRef.current.close();
    // return;

    // Animated.timing(height, {
    //   toValue: 0,
    //   duration: 350,
    //   useNativeDriver: false,
    // }).start(() => openDeleteView(i));
  };

  const getAllWishListData = () => {
    if (!!userData?.auth_token) {
      getAllWishlistItems();
      return;
    }
    setWishlistArray([]);
    updateState({ isRefreshing: false });
    return;
  };
  /*  GET ALL WISHLISTED ITEMS API FUNCTION  */
  const getAllWishlistItems = () => {
    // updateState({ isLoadingB: true });
    actions
      .getWishlistProducts(
        `?limit=${10}&page=${1}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        setWishlistArray(res?.data?.data);
        updateState({
          isLoadingB: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  // discard customer edit order in cart

  const _onDiscardCustomerEditOrder = () => {
    const apiData = {
      orderid: cartData?.order_id,
    };

    actions
      .discardCustomerEditOrder(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        showSuccess(res?.message);
        updateState({
          isLoadingB: false,
        });
        getCartDetail();
      })
      .catch(errorMethod);
  };

  const renderMinAmountMsg = (item) => {
    if (
      Number(item?.vendor?.order_min_amount) >
      Number(item?.payable_amount ? item?.payable_amount : 0).toFixed(
        appData?.profile?.preferences?.digit_after_decimal,
      )
    ) {
      return (
        <Text
          numberOfLines={1}
          style={{
            ...styles.priceItemLabel2,
            color: colors.redB,
            fontSize: textScale(13),
            fontFamily: fontFamily.medium,
            marginTop: moderateScaleVertical(10),
            paddingHorizontal: moderateScale(5),
          }}>
          {`${strings.ACCEPTING_ORDER_MSG
            } ${tokenConverterPlusCurrencyNumberFormater(
              item?.vendor?.order_min_amount,
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}
        </Text>
      );
    }
  };

  const onSelectDropDown = (val) => {
    setSelTypes(val?.code);
    setTimeout(() => {
      updateState({
        deliveryFeeLoader: true,
      });
    }, 800);
  };

  const renderDropDown = (val, item) => {
    return (
      <TouchableOpacity
        onPress={() => onSelectDropDown(val)}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // marginBottom: moderateScaleVertical(8),
          justifyContent: 'space-between',
          marginVertical: moderateScaleVertical(8),
          // padding: moderateScale(8)
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FastImage
              source={
                (sel_types || item?.sel_types) == val?.code
                  ? imagePath.radioNewActive
                  : imagePath.radioInActive
              }
              style={{
                tintColor: themeColors.primary_color,
                height: moderateScale(14),
                width: moderateScale(14),
                marginRight: moderateScale(4),
              }}
              resizeMode="contain"
            />
            {appIds.hokitch == getBundleId() ? (
              <Text
                style={{
                  fontSize: textScale(12),
                  color:
                    (!!sel_types ? sel_types : item?.sel_types) == val?.code
                      ? themeColors.primary_color
                      : colors.black,
                  fontFamily:
                    (!!sel_types ? sel_types : item?.sel_types) == val?.code
                      ? fontFamily.bold
                      : fontFamily.regular,
                  textAlign: 'left',
                }}>
                {strings.CHARGES}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: textScale(12),
                  color:
                    (!!sel_types ? sel_types : item?.sel_types) == val?.code
                      ? themeColors.primary_color
                      : colors.black,
                  fontFamily:
                    (!!sel_types ? sel_types : item?.sel_types) == val?.code
                      ? fontFamily.bold
                      : fontFamily.regular,
                  textAlign: 'left',
                }}>
                {val?.courier_name}
              </Text>
            )}
          </View>
        </View>

        <Text
          style={{
            fontSize: textScale(12),
            color:
              (!!sel_types ? sel_types : item?.sel_types) == val?.code
                ? themeColors.primary_color
                : colors.black,
            fontFamily:
              (!!sel_types ? sel_types : item?.sel_types) == val?.code
                ? fontFamily.bold
                : fontFamily.regular,
            textAlign: 'left',
          }}>
          {val?.rate}
        </Text>
      </TouchableOpacity>
    );
  };
  const _redirectVendorProducts = (item) => {
    moveToNewScreen(navigationStrings.PRODUCT_LIST, {
      fetchOffers: true,
      id: item?.vendor?.id,
      vendor:
        item?.redirect_to == staticStrings.ONDEMANDSERVICE
          ? false
          : item?.redirect_to == staticStrings.PRODUCT
            ? false
            : true,
      name: item?.vendor?.name,
      isVendorList: false,
    })();
  };
  const onModalDropDown = () => {
    setSelTypes(val?.code);
  };

  const getProductFAQs = (item) => {
    clickedItem = item;
    updateState({
      isProductOrderForm: true,
      isProductLoader: true,
    });
    actions
      .getProductFaqs(
        `/${item?.product?.id}`,
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        console.log(res, 'ressssssss>>>>>>>');
        setProductFaqs(res?.data);
        updateState({
          isProductLoader: false,
        });
      })
      .catch(errorMethod);
  };

  const setAllRequiredQuestions = (item, index) => {
    if (validationFucCalled) {
      if (item?.is_required) {
        setvalidationFucCalled(false);
        const arraywithAllRequiredQuestion = [...myFaqValidationArray];
        arraywithAllRequiredQuestion[index] = true;

        setMyFaqValidationArray(arraywithAllRequiredQuestion);
      } else {
        setvalidationFucCalled(false);
      }
    }
  };

  const onChangeText = (item, text, index, arrLength) => {
    // const myAnswerdArray = [];

    const answerdArray = [...myAnswerdArray];

    answerdArray[index] = {
      question: item?.translations[0]?.name,
      answer: text,
      product_faq_id: item?.id,
    };

    if (item?.is_required) {
      setvalidationFucCalled(false);
      const arraywithAllRequiredQuestion = [...myFaqValidationArray];
      arraywithAllRequiredQuestion[index] = false;
      setMyFaqValidationArray(arraywithAllRequiredQuestion);
      if (text === '') {
        const arraywithAllRequiredQuestion = [...myFaqValidationArray];
        arraywithAllRequiredQuestion[index] = true;
        setMyFaqValidationArray(arraywithAllRequiredQuestion);
      }
    }
    setMyAllanswers(answerdArray);
  };

  const setAllFormData = () => {
    const isRequired = myFaqValidationArray.some(checkRequird);
    function checkRequird(checkRequird) {
      return checkRequird == true;
    }

    if (isRequired) {
      alert(strings.PLEASEFILDALL);
    } else {
      updateState({
        isSubmitFaqLoader: true,
      });
      console.log(myAnswerdArray, 'myAnswerdArraymyAnswerdArray');
      actions
        .updateProductFAQs(
          {
            product_id: clickedItem?.product?.id,
            user_product_order_form: myAnswerdArray,
          },
          {
            code: appData?.profile?.code,
          },
        )
        .then((res) => {
          getCartDetail();
        })
        .catch(errorMethod);
    }
  };

  const openPickerForPrescription = async (item, index) => {
    setItemForPrescription(item);
    setPrescriptionModal(true);
  };

  const _renderItem = ({ item, index }) => {
    console.log("cart itemitem",item)
    return (
      <View>
        {index === 0 && (
          <View style={Platform.OS === 'ios' ? { zIndex: 5000 } : {}}>
            {dineInType === 'dine_in' &&
              userData?.auth_token &&
              !!cartData?.vendor_details?.vendor_tables &&
              cartData?.vendor_details?.vendor_tables?.length > 0 && (
                <DropDownPicker
                  items={tableData}
                  onOpen={() => updateState({ isTableDropDown: true })}
                  onClose={() => updateState({ isTableDropDown: false })}
                  defaultValue={
                    deepLinkUrl
                      ? deepLinkUrl == 1
                        ? tableData[0]?.label
                        : tableData[1]?.label
                      : tableData[0]?.label || ''
                  }
                  containerStyle={styles.dropDownContainerStyle}
                  style={{
                    marginHorizontal: moderateScale(20),
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  labelStyle={
                    isDarkMode
                      ? { color: MyDarkTheme.colors.text }
                      : { color: colors.textGrey }
                  }
                  itemStyle={{
                    justifyContent: 'flex-start',
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                  }}
                  dropDownStyle={{
                    ...styles.dropDownStyle,
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.greyColor1,
                  }}
                  onChangeItem={(item) => _onTableSelection(item)}
                />
              )}
          </View>
        )}
        <View
          key={swipeKey + Math.random()}
          style={{
            ...styles.mainViewRednderItem,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          {renderMinAmountMsg(item)}
          <View
            style={{
              ...styles.vendorView,
              // paddingHorizontal: moderateScale(8),
              flexDirection: 'column',
            }}>
            {/* <TouchableOpacity onPress={() => _redirectVendorProducts(item)}>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {item?.vendor?.name}
              </Text>
            </TouchableOpacity> */}

            {!!cartData?.closed_store_order_scheduled &&
              !!item?.vendor?.is_vendor_closed ? (
              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: colors.redB,
                  fontSize: textScale(9),
                }}>
                {/* {strings.WE_ARE_NOT_ACCEPTING} {item?.delaySlot} */}
                {getBundleId() == appIds.masa
                  ? `${strings.WE_ACCEPT_ONLY_SCHEDULE_ORDER} ${item?.delaySlot} `
                  : ` ${strings.WE_ARE_NOT_ACCEPTING} ${item?.delaySlot} `}
              </Text>
            ) : null}

            {item?.is_vendor_closed ? (
              <Text
                numberOfLines={1}
                style={{
                  ...styles.priceItemLabel2,
                  color: colors.redB,
                  fontSize: textScale(9),
                }}>
                {strings.VENDOR_NOT_ACCEPTING_ORDERS}
              </Text>
            ) : null}
          </View>

          {/************ start  render cart items *************/}

          <View style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}>

            <View>
              <SwipeableSection
                item={item}
                openDeleteView={openDeleteView}
                deleteItem={deleteItem}
                addDeleteCartItems={addDeleteCartItems}
                selectCartItem={selectCartItem}
                swipeRef={swipeRef}
                swipeKey={swipeKey}
                swipeBtns={swipeBtns}
                isDarkMode={isDarkMode}
                styles={styles}
                fontFamily={fontFamily}
                btnLoadrId={btnLoadrId}
                btnLoader={btnLoader}
                digit_after_decimal={digit_after_decimal}
                additional_preferences={additional_preferences}
                currencies={currencies}
                cartData={cartData}
                scheduleType={scheduleType}
                openPickerForPrescription={openPickerForPrescription}
                parentIndex={index}
                // showCheckBox={appStyle?.homePageLayout == 10}
              />
            </View>
          </View>
          {/************ end render cart items *************/}
          <DeliverableSection item={item} fontFamily={fontFamily} styles={styles} />

          {/* offerview */}
          <PromoCodeAvailableSection themeColors={themeColors} item={item} styles={styles} cartData={cartData} _removeCoupon={_removeCoupon} _getAllOffers={_getAllOffers} />



          {/* offerview end */}

          {/* start amount view       */}
          <CouponDiscount item={item} isDarkMode={isDarkMode} styles={styles} digit_after_decimal={digit_after_decimal} additional_preferences={additional_preferences} currencies={currencies} preferences={preferences} renderDropDown={renderDropDown} sel_types={sel_types} />
        </View >
      </View >
    );
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      setType(type);
      updateState({
        updateData: data,
        isVisible: visible,
        selectedId: id,
      });
    } else {
      setAppSessionRedirection();
    }
  };
  const setModalVisibleForAddessModal = (visible, type, id, data) => {
    updateState({ selectViaMap: false });
    if (!!userData?.auth_token) {
      updateState({ isVisible: false });
      setTimeout(() => {
        setType(type);
        updateState({
          updateData: data,
          isVisibleAddressModal: visible,
          selectedId: id,
        });
      }, 1000);
    } else {
      setAppSessionRedirection();
    }
  };

  const selectedTip = (tip) => {
    if (tip == 'custom') {
      setSelectedTipvalue(tip);
      setSelectedTipAmount(null);
    } else {
      if (selectedTipvalue && selectedTipvalue?.value == tip?.value) {
        setSelectedTipvalue(null);
        setSelectedTipAmount(null);
      } else {
        setSelectedTipvalue(tip);
        setSelectedTipAmount(tip?.value);
      }
    }
  };

  const _onGiftBoxSelection = () => {
    updateState({ isGiftBoxSelected: !isGiftBoxSelected });
  };
  console.log(kycImages, 'kycImageskycImages');
  //get footer start
  const getFooter = () => {
    return (
      <Footer
        preferences={preferences}
        setPaymentModal={(item) => setPaymentModal(item)}
        updateState={updateState}
        setAppSessionRedirection={setAppSessionRedirection}
        deleteItem={deleteItem}
        addDeleteCartItems={addDeleteCartItems}
        isDarkMode={isDarkMode}
        styles={styles}
        fontFamily={fontFamily}
        digit_after_decimal={digit_after_decimal}
        additional_preferences={additional_preferences}
        currencies={currencies}
        cartData={cartData}
        appData={appData}
        showTaxFeeArea={showTaxFeeArea}
        selectedTipAmount={selectedTipAmount}
        codMinAmount={codMinAmount}
        userData={userData}
        scheduleType={scheduleType}
        selectedPayment={selectedPayment}
        placeLoader={placeLoader}
        _selectTime={_selectTime}
        localeSheduledOrderDate={localeSheduledOrderDate}
        placeOrder={placeOrder}
        _onGiftBoxSelection={_onGiftBoxSelection}
        themeColors={themeColors}
        isGiftBoxSelected={isGiftBoxSelected}
        selectedTip={selectedTip}
        setInstruction={setInstruction}
        selectedTipvalue={selectedTipvalue}
        setSelectedTipAmount={setSelectedTipAmount}
        clearSceduleDate={clearSceduleDate}
        _selectTimeLaundry={_selectTimeLaundry}
        laundrySelectedPickupDate={laundrySelectedPickupDate}
        laundrySelectedDropOffDate={laundrySelectedDropOffDate}
        laundrySelectedPickupSlot={laundrySelectedPickupSlot}
        laundrySelectedDropOffSlot={laundrySelectedDropOffSlot}
        businessType={businessType}
        pickupDriverComment={pickupDriverComment}
        setPickupDriverComment={setPickupDriverComment}
        dropOffDriverComment={dropOffDriverComment}
        setDropOffDriverComment={setDropOffDriverComment}
        vendorComment={vendorComment}
        setVendorComment={setVendorComment}
        _renderUpSellProducts={_renderUpSellProducts}
        _renderCrossSellProducts={_renderCrossSellProducts}
        dineInType={dineInType}
        onSelectPaymentMethod={() =>
          !!userData?.auth_token
            ? setPaymentModal(true)
            : setAppSessionRedirection()
        }
        onCategoryKYC={onCategoryKYC}
        containerStyle={{
          ...styles.placeOrderButtonStyle,
          marginHorizontal: moderateScale(10),
        }}

      />
    )
  };

  //end footer

  //Header section of cart screen

  console.log("cartDatacartData", cartData)

  const homeType = (data) => {
    let value = strings.HOME;
    if (!isEmpty(vendorAddress)) {
      return (value = strings.HOME_1);
    }
    switch (data?.type) {
      case 1:
        value = strings.HOME;
        break;
      case 2:
        value = strings.WORK;
        break;
      case 3:
        value =
          data?.type_name == 0 || data?.type_name == null
            ? strings.UNKNOWN
            : data?.type_name;
        break;
      default:
        value = strings.ADD_ADDRESS;
        break;
    }
    return value;
  };
  const getHeader = () => {
    return (
      <>
        {/* <TouchableOpacity
          disabled={!isEmpty(vendorAddress)}
          onPress={() => setModalVisible(true)}
          style={{
            ...styles.topLable,
            marginVertical: moderateScale(7),
            justifyContent: 'space-between',
            backgroundColor: isDarkMode ? MyDarkTheme.colors.background : null,
          }}>
          <View style={{ flexDirection: 'row', flex: 0.85 }}>
            <FastImage
              source={imagePath.mapIcon}
              resizeMode="contain"
              style={{
                width: moderateScale(50),
                height: moderateScale(50),
              }}
            />
            <View style={styles.addressView}>
              <Text
                style={{
                  ...styles.homeTxt,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {homeType(selectedAddressData)}
              </Text>

              <Text
                numberOfLines={2}
                style={{
                  ...styles.addAddressTxt,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  marginTop: moderateScaleVertical(4),
                }}>
                {!isEmpty(vendorAddress)
                  ? vendorAddress?.address
                  : selectedAddressData
                    ? `${!!selectedAddressData?.house_number
                      ? selectedAddressData?.house_number + ',  '
                      : ''
                    }${selectedAddressData?.address}`
                    : strings.TAP_HERE_ADD_ADDRESS}
              </Text>
            </View>
          </View>
          {isEmpty(vendorAddress) && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setModalVisible(true)}>
              <FastImage
                source={imagePath.icEdit1}
                resizeMode="contain"
                style={styles.editIcon}
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity> */}
        {!!cartData?.editing_order?.id && (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                marginVertical: moderateScaleVertical(10),
                fontFamily: fontFamily?.regular,
              }}>
              Order{' '}
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                  color: themeColors?.primary_color,
                }}>
                {' '}
                {cartData?.editing_order?.order_number}
              </Text>{' '}
              being edited
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: moderateScale(10),
              }}
              onPress={_onDiscardCustomerEditOrder}>
              <Image source={imagePath.deleteRed} />
              <Text
                style={{
                  marginHorizontal: moderateScale(4),
                  color: colors.redB,
                  fontFamily: fontFamily.bold,
                }}>
                DISCARD
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  //Native modal for Modal
  const openClearCartModal = () => {
    Alert.alert('', strings.AREYOUSURE, [
      {
        text: strings.CANCEL,
        onPress: () => { },
        // style: 'destructive',
      },
      { text: strings.CONFIRM, onPress: () => bottomButtonClick() },
    ]);
  };
  //SelectAddress
  const selectAddress = (address) => {
    console.log('here....', address);
    if (!!userData?.auth_token) {
      // updateState({ isLoadingB: true });
      let data = {};
      let query = `/${address?.id}`;
      actions
        .setPrimaryAddress(query, data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          console.log(res, 'response ... set primary');
          actions.saveAddress(address);
          setSelectedAddress(address);
          updateState({
            isVisible: false,
            isLoadingB: false,
            placeLoader: false,
          });
        })
        .catch(errorMethod);
    }
  };

  useEffect(() => {
    getAllAddress();
    return () => { };
  }, []);

  //Add and update the addreess
  const addUpdateLocation = (childData, isSAveAddAdress) => {

    // setModalVisible(false);
    console.log(childData, isSAveAddAdress, "childDatachildData");
    console.log(isSAveAddAdress, "childDatachildDataisSAveAddAdress");
    // alert(isSAveAddAdress)
    updateState({ isLoading: true });

    if (getBundleId() === appIds.bumprkar) {
      if (isSAveAddAdress) {
        actions
          .addAddress(childData, {
            code: appData?.profile?.code,
          })
          .then(res => {
            updateState({
              isLoading: false,
              isLoadingB: false,
              isVisible: false,
              isVisibleAddressModal: false,
              placeLoader: false,
              selectViaMap: false,
            });
            getAllAddress();
            setTimeout(() => {
              let address = res?.data;
              address['is_primary'] = 1;
              setSelectedAddress(address);
              actions.saveAddress(address);
            });
            showSuccess(res.message);
          })
          .catch(error => {
            updateState({
              isLoading: false,
              isLoadingB: false,
              isVisible: false,
              isVisibleAddressModal: false,
            });
            showError(error?.message || error?.error);
          });
      } else {
        updateState({
          isLoading: false,
          isLoadingB: false,
          // isVisible: false,
          // isVisibleAddressModal: false,
          isVisibleAddressModal: true,
          placeLoader: false,
          selectViaMap: false,
        });
      }


    } else {
      actions
        .addAddress(childData, {
          code: appData?.profile?.code,
        })
        .then(res => {
          updateState({
            isLoading: false,
            isLoadingB: false,
            isVisible: false,
            isVisibleAddressModal: false,
            placeLoader: false,
            selectViaMap: false,
          });
          getAllAddress();
          setTimeout(() => {
            let address = res?.data;
            address['is_primary'] = 1;
            setSelectedAddress(address);
            actions.saveAddress(address);
          });
          showSuccess(res.message);
        })
        .catch(error => {
          updateState({
            isLoading: false,
            isLoadingB: false,
            isVisible: false,
            isVisibleAddressModal: false,
          });
          showError(error?.message || error?.error);
        });
    }
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1, isRefreshing: true });
  };

  const onClose = () => {
    setSelectedDateFromCalendar('');
    setSelectedTimeSlots('');
    updateState({
      isVisibleTimeModal: false,
    });
  };

  const onDateChangeSecond = (value) => {
    if (modalType == 'pickup') {
      setLocalPickupDate(
        `${value.toLocaleDateString(selectedLanguage, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}, ${value.toLocaleTimeString(selectedLanguage, {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      );
      setSheduledpickupdate(value);
    } else {
      setLocaleDropOffDate(
        `${value.toLocaleDateString(selectedLanguage, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}, ${value.toLocaleTimeString(selectedLanguage, {
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      );
      setSheduleddropoffdate(value);
    }
  };

  const onDateChange = (value) => {
    setSheduledorderdate(value);
    setScheduleType('schedule');
    setLocaleSheduledOrderDate(
      `${value.toLocaleDateString(selectedLanguage, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}, ${value.toLocaleTimeString(selectedLanguage, {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
    );
    setDateAndTimeSchedule(false, 'schedule', value);
  };

  useEffect(() => {
    if (!!checkCartItem?.data) {
      getItem('deepLinkUrl')
        .then((res) => {
          if (res) {
            let table_number = getParameterByName('table', res);
            setDeepLinkUrl(table_number);
          }
        })
        .catch(errorMethod);
    }
  }, [deepLinkUrl]);

  const _onTableSelection = (item) => {
    const data = {
      vendor_id: item?.vendor_id,
      table: item?.id,
    };
    _vendorTableCart(data, item);
  };

  const _vendorTableCart = (data, item) => {
    if (!!userData?.auth_token) {
      actions
        .vendorTableCart(data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          removeItem('deepLinkUrl');
          setItem('selectedTable', item?.label);
        })
        .catch(errorMethod);
      return;
    }
    return;
  };

  const onPressRecommendedVendors = (item) => {
    if (!item?.is_show_category || item?.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
          item,
          rootProducts: true,
          // categoryData: data,
        })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: item?.id,
          vendor: true,
          name: item?.name,
        })();

      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  const renderRecommendedVendors = ({ item, index }) => {
    return (
      <View
        key={String(index)}
        style={{
          width: moderateScale(width / 2),
          marginLeft: moderateScale(5),
        }}>
        <MarketCard3
          data={item}
          extraStyles={{
            marginTop: 0,
            marginVertical: moderateScaleVertical(2),
          }}
          fastImageStyle={{
            height: moderateScaleVertical(110),
          }}
          imageResizeMode="cover"
          onPress={() => onPressRecommendedVendors(item)}
          isMaxSaftey={false}
        />
      </View>
    );
  };

  const ListEmptyComp = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#fff',
          }}>
          {appIds.codiner == DeviceInfo.getBundleId() ? (
            <FastImage
              source={{
                uri: Image.resolveAssetSource(imagePath.emptyCart3).uri,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              style={{
                marginVertical: moderateScaleVertical(20),
                height: moderateScale(120),
                width: moderateScale(140),
              }}
              resizeMode="contain"
            />
          ) : (
            <FastImage
              source={{
                uri: Image.resolveAssetSource(imagePath.icEmptyCartD).uri,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }}
              style={{
                marginVertical: moderateScaleVertical(20),
                height: moderateScale(120),
                width: moderateScale(120),
              }}
              tintColor={isDarkMode && colors.white}
            // resizeMode="contain"s
            />
          )}

          <Text
            style={{
              ...styles.textStyle,
              color: isDarkMode ? colors.white : colors.blackOpacity40,
            }}>
            {strings.YOUR_CART_EMPTY_ADD_ITEMS}
          </Text>
        </View>
        <HorizontalLine
          lineStyle={{
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity77
              : colors.greyA,
            marginVertical: moderateScaleVertical(16),
          }}
        />
        {wishlistArray?.length > 0 && (
          <View>
            <Text
              style={{
                ...styles.commTextStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.SHOP_FROM_WISHLIST}
            </Text>
            {wishlistArray.map((val, i) => {
              return (
                <View key={String(i)}>
                  <WishlistCard
                    data={val.product}
                    onPress={moveToNewScreen(
                      navigationStrings.PRODUCTDETAIL,
                      val.product,
                    )}
                  />
                </View>
              );
            })}
          </View>
        )}
        <View style={{ marginVertical: moderateScaleVertical(8) }} />

        {recommendedVendorsdata && recommendedVendorsdata?.length > 0 && (
          <View>
            <Text
              style={{
                ...styles.commTextStyle,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.RECOMMENDED_VENDORS}
            </Text>
            <FlatList
              horizontal
              data={recommendedVendorsdata}
              extraData={recommendedVendorsdata}
              renderItem={renderRecommendedVendors}
              keyExtractor={(item, index) => item?.id.toString()}
              keyboardShouldPersistTaps="always"
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
            />
          </View>
        )}

        <View style={{ marginBottom: moderateScale(100) }} />
      </View>
    );
  };
  const renderCardItemLoader = () => {
    return (
      <View>
        <HeaderLoader
          widthLeft={moderateScale(140)}
          rectWidthLeft={moderateScale(140)}
          heightLeft={15}
          rectHeightLeft={15}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(30),
          }}
          isRight={false}
        />
        <ProductListLoader
          widthLeft={moderateScale(100)}
          mainView={{
            marginHorizontal: moderateScale(15),
            marginTop: moderateScale(5),
            alignItems: 'flex-start',
          }}
        />
        <HeaderLoader
          widthLeft={width - moderateScale(30)}
          rectWidthLeft={width - moderateScale(30)}
          heightLeft={moderateScale(35)}
          rectHeightLeft={moderateScale(35)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
          isRight={false}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(15),
          }}
        />
        <HeaderLoader
          widthLeft={moderateScale(90)}
          rectWidthLeft={moderateScale(90)}
          heightLeft={moderateScale(15)}
          rectHeightLeft={moderateScale(15)}
          rectHeightRight={moderateScale(15)}
          heightRight={moderateScale(15)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: moderateScaleVertical(8),
          }}
        />
      </View>
    );
  };

  if (isShimmerLoading) {
    return (
      <WrapperContainer
        bgColor={
          isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
        }
        statusBarColor={colors.backgroundGrey}
        source={loaderOne}
      >
        <Header
          centerTitle={'strings.CART'}
          noLeftIcon
          leftIcon={imagePath.icBackb}
          onPressLeft={()=>navigation.navigate()}
        />
        {/* <View
          style={{
            // flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#fff',
          }}>
          <FastImage
            source={{uri: Image.resolveAssetSource(imagePath.icEmptyCartD).uri}}
            style={{
              marginVertical: moderateScaleVertical(20),
              height: moderateScale(120),
              width: moderateScale(120),
            }}

            // resizeMode="contain"s
          />
          <Text style={{...styles.textStyle}}>
            {strings.YOUR_CART_EMPTY_ADD_ITEMS}
          </Text>
        </View> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={15}
            rectHeightLeft={15}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
            }}
            isRight={false}
          />
          <HeaderLoader
            widthLeft={moderateScale(100)}
            rectWidthLeft={moderateScale(100)}
            heightLeft={15}
            rectHeightLeft={15}
            isRight={false}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(10),
              alignSelf: 'center',
            }}

          // resizeMode="contain"s
          />
          {renderCardItemLoader()}
          {renderCardItemLoader()}
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(30),
            }}
          />
          <HeaderLoader
            widthLeft={moderateScale(60)}
            rectWidthLeft={moderateScale(60)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(8),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(90)}
            rectWidthLeft={width - moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(20),
            }}
            isRight={false}
          />
          <View style={{ flexDirection: 'row' }}>
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(15),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
            <HeaderLoader
              widthLeft={moderateScale(80)}
              rectWidthLeft={moderateScale(80)}
              heightLeft={moderateScale(40)}
              rectHeightLeft={moderateScale(40)}
              rx={5}
              ry={5}
              viewStyles={{
                marginTop: moderateScaleVertical(10),
                marginHorizontal: moderateScale(0),
                marginLeft: moderateScale(8),
              }}
              isRight={false}
            />
          </View>
          <HeaderLoader
            widthLeft={moderateScale(90)}
            rectWidthLeft={moderateScale(90)}
            heightLeft={moderateScale(15)}
            rectHeightLeft={moderateScale(15)}
            rectHeightRight={moderateScale(15)}
            heightRight={moderateScale(15)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
          />
          <HeaderLoader
            widthLeft={width - moderateScale(30)}
            rectWidthLeft={width - moderateScale(30)}
            heightLeft={moderateScale(40)}
            rectHeightLeft={moderateScale(40)}
            rx={5}
            ry={5}
            viewStyles={{
              marginTop: moderateScaleVertical(15),
            }}
            isRight={false}
          />
        </ScrollView>
      </WrapperContainer>
    );
  }

  const _renderUpSellProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };

  const _renderCrossSellProducts = ({ item }) => {
    return (
      <ProductsComp
        item={item}
        onPress={() =>
          navigation.navigate(navigationStrings.PRODUCTDETAIL, { data: item })
        }
      />
    );
  };


  const checkVendorSlots = async (date) => {
    if (businessType == 'laundry') {
      if (modalType !== 'pickup') {
        try {
          let vendorId = cartItems[0].vendor.id;
          // vendor_id,date,delivery
          const res = await actions.getVendorDropoffSlots(
            `?vendor_id=${vendorId}&date=${date}&delivery=${dineInType}`,
            {},
            {
              code: appData?.profile?.code,
              timezone: RNLocalize.getTimeZone(),
            },
          );
          setCheckSloatLoading(false);
          const availableSlots = !!res && Array.isArray(res) ? res : !!res?.data && Array.isArray(res?.data) ? res?.data : []

          setLaundryAvailableDropOffSlot(availableSlots);
        } catch (error) {
          setCheckSloatLoading(false);

          console.log('error riased', error);
        }
        return;
      }
    }

    try {
      let vendorId = cartItems[0].vendor.id;
      // vendor_id,date,delivery
      const res = await actions.checkVendorSlots(
        `?vendor_id=${vendorId}&date=${date}&delivery=${dineInType}`,
        {
          code: appData?.profile?.code,
          // currency: currencies?.primary_currency?.id,
          // language: languages?.primary_language?.id,
          // systemuser: DeviceInfo.getUniqueId(),
          timezone: RNLocalize.getTimeZone(),
          // device_token: DeviceInfo.getUniqueId(),
        },
      );

      const availableSlots = !!res && Array.isArray(res) ? res : !!res?.data && Array.isArray(res?.data) ? res?.data : []
      setCheckSloatLoading(false);
      if (modalType == 'pickup') {
        setLaundryAvailablePickupSlot(availableSlots);
      }
      setAvailableTimeSlots(availableSlots);
      if (res?.length == 0) {
        setSelectedTimeSlots('');
      }
      setCheckSloatLoading(false);
    } catch (error) {
      setCheckSloatLoading(false);

      console.log('error riased', error);
    }
  };

  const checkValidSlotSelected = (item) => {
    console.log(item, "item?....item", localeSheduledOrderDate, selectedDateFromCalendar)

  }

  const onSelectTime = (item) => {
    actions.checkSlotsLimit({
      schedule_datetime: selectedDateFromCalendar ? selectedDateFromCalendar : moment(new Date()).format("YYYY-MM-DD"),
      schedule_slot:
        item?.value,
      vendor_id:
        cartData?.products[0]?.vendor_id
    }, {
      code: appData?.profile?.code
    }).then((res) => {
      if (res?.orderCount <= res?.orders_per_slot) {
        if (businessType == 'laundry') {
          if (modalType == 'pickup') {
            setLaundrySelectedPickupSlot(item?.value);
          } else {
            setLaundrySelectedDropOffSlot(item?.value);
          }
        } else {
          setSelectedTimeSlots(item?.value);
        }
      }
      else {
        alert("This slot is not available, please select different slot.")
        return
      }

    }).catch(errorMethod)
  };

  const onSelectPayment = (data) => {
    console.log('my data++++', data);

    // const [paymentMethodId, setPaymentMethodId] = useState(null);
    setPaymentMethodId(data?.payment_method_id);
    setSelectedPayment(data?.selectedPaymentMethod);
    if (!!data?.cardInfo) {
      setCardInfo(data?.cardInfo);
    }
    if (!!data?.tokenInfo) {
      setTokenInfo(data?.tokenInfo);
    }
  };

  const isSlotSelected = (item) => {
    if (selectedTimeSlots == item?.value) {
      return true;
    } else {
      return false;
    }
  };

  const isSlotSelected1 = (item) => {
    if (laundrySelectedPickupSlot == item?.value) {
      return true;
    } else {
      return false;
    }
  };

  const isSlotSelected2 = (item) => {
    if (laundrySelectedDropOffSlot == item?.value) {
      return true;
    } else {
      return false;
    }
  };

  const renderTimeSlots = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={String(index)}
        activeOpacity={0.8}
        onPress={() => onSelectTime(item)}
        style={{
          backgroundColor:
            businessType == 'laundry'
              ? isSlotSelected1(item)
                ? themeColors?.primary_color
                : colors.white
              : isSlotSelected(item)
                ? themeColors.primary_color
                : colors.white,
          padding: 8,
          borderRadius: 8,
          borderWidth:
            businessType == 'laundry'
              ? isSlotSelected1(item)
                ? 0
                : 1
              : isSlotSelected(item)
                ? 0
                : 1,
          borderColor: colors.borderColorGrey,
        }}>
        <Text
          style={{
            color:
              businessType == 'laundry'
                ? isSlotSelected1(item)
                  ? colors.white
                  : colors.black
                : isSlotSelected(item)
                  ? colors.white
                  : colors.black,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}>
          {item?.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeSlots2 = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={String(index)}
        activeOpacity={0.8}
        onPress={() => onSelectTime(item)}
        style={{
          backgroundColor: isSlotSelected2(item)
            ? themeColors.primary_color
            : colors.white,
          padding: 8,
          borderRadius: 8,
          borderWidth: isSlotSelected2(item) ? 0 : 1,
          borderColor: colors.borderColorGrey,
        }}>
        <Text
          style={{
            color: isSlotSelected2(item) ? colors.white : colors.black,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}>
          {item?.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const onSelectDateFromCalendar = (day) => {
    setCheckSloatLoading(true);
    setSelectedDateFromCalendar(day.dateString);
    setScheduleType('schedule');
    setModalType('schedule');
    setSheduledorderdate(day.dateString);
    checkVendorSlots(day.dateString);
  };

  const laundrySlotSelection = (day) => {
    setCheckSloatLoading(true);

    if (modalType == 'pickup') {
      setLaundrySelectedPickupDate(day.dateString);
      setLaundrySelectedPickupSlot('');
    } else {
      setLaundrySelectedDropOffDate(day.dateString);
      setLaundrySelectedDropOffSlot('');
    }
    // setScheduleType('schedule');
    // setModalType('schedule');
    checkVendorSlots(day.dateString);
  };

  const openCloseMapAddress = (type) => {
    updateState({ selectViaMap: type == 1 ? true : false });
  };
  const onSelect = (val, item, index) => {
    updateState({
      selectedType: val?.translations[0].name,
    });
    onChangeText(item, val?.translations[0].name, index, item?.length);
  };
  const renderProductForm = () => {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          style={{
            maxHeight: height / 2,
            minHeight: moderateScaleVertical(250),
            borderTopLeftRadius: moderateScale(16),
            borderTopRightRadius: moderateScale(16),
            backgroundColor: colors.white,
            padding: moderateScale(12),
          }}>
          {isProductLoader ? (
            <View>
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                  marginHorizontal: 0,
                }}
                widthLeft={width - moderateScale(25)}
                rectWidthLeft={width - moderateScale(25)}
                heightLeft={moderateScaleVertical(45)}
                rectHeightLeft={moderateScaleVertical(45)}
                isRight={false}
                rx={7}
                ry={7}
              />
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                  marginHorizontal: 0,
                }}
                widthLeft={width - moderateScale(25)}
                rectWidthLeft={width - moderateScale(25)}
                heightLeft={moderateScaleVertical(45)}
                rectHeightLeft={moderateScaleVertical(45)}
                isRight={false}
                rx={7}
                ry={7}
              />
              <HeaderLoader
                viewStyles={{
                  marginTop: moderateScaleVertical(8),
                  marginBottom: moderateScaleVertical(16),
                  marginHorizontal: 0,
                }}
                widthLeft={width - moderateScale(25)}
                rectWidthLeft={width - moderateScale(25)}
                heightLeft={moderateScaleVertical(45)}
                rectHeightLeft={moderateScaleVertical(45)}
                isRight={false}
                rx={7}
                ry={7}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                borderRadius: moderateScale(8),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text />

                <TouchableOpacity onPress={closeForm}>
                  <Image source={imagePath.closeButton} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {productFaqs.map((item, index) => {
                  setAllRequiredQuestions(item, index);
                  if (item?.file_type === 'Text') {
                    return (
                      <View
                        style={{
                          marginTop: moderateScaleVertical(10),
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              marginBottom: moderateScaleVertical(10),
                              color: colors.redColor,
                            }}>
                            {`${item?.is_required ? '* ' : ''}`}
                          </Text>
                          <Text
                            style={{
                              marginBottom: moderateScaleVertical(10),
                              fontFamily: fontFamily.medium,
                              color: isDarkMode ? colors.white : colors.blackC,
                            }}>
                            {item?.translations[0]?.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            // marginVertical: moderateScaleVertical(16),
                            backgroundColor: isDarkMode
                              ? colors.whiteOpacity15
                              : colors.greyNew,
                            height: moderateScale(42),
                            borderRadius: moderateScale(4),
                            paddingHorizontal: moderateScale(8),
                          }}>
                          <TextInput
                            placeholder={strings.ANSWER}
                            onChangeText={(text) =>
                              onChangeText(item, text, index, item?.length)
                            }
                            style={{
                              ...styles.insctructionText,
                              color: isDarkMode
                                ? colors.textGreyB
                                : colors.black,
                            }}
                            placeholderTextColor={
                              isDarkMode
                                ? colors.textGreyB
                                : colors.blackOpacity40
                            }
                          />
                        </View>
                      </View>
                    );
                  }
                  if (item?.file_type === 'selector') {
                    return (
                      <View
                        style={{
                          marginTop: moderateScaleVertical(10),
                          zIndex: 5,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              marginBottom: moderateScaleVertical(10),
                              color: colors.redColor,
                            }}>
                            {`${item?.is_required ? '* ' : ''}`}
                          </Text>
                          <Text
                            style={{
                              marginBottom: moderateScaleVertical(10),
                              fontFamily: fontFamily.medium,
                              color: isDarkMode ? colors.white : colors.blackC,
                            }}>
                            {item?.translations[0]?.name}
                          </Text>
                        </View>
                        <DropDown
                          value={selectedType}
                          modalStyle={{
                            width: width - moderateScale(50),
                          }}
                          selectedIndexByProps={-1}
                          placeholder={strings.SELECT_ANS}
                          data={item?.options}
                          fetchValues={(val) => onSelect(val, item, index)}
                          marginBottom={0}
                        // inputStyle={{ borderColor: countryError !== '' ? colors.redColor : colors.lightGray }}
                        />
                        {/* <View
                          style={{
                            // marginVertical: moderateScaleVertical(16),
                            backgroundColor: isDarkMode
                              ? colors.whiteOpacity15
                              : colors.greyNew,
                            height: moderateScale(42),
                            borderRadius: moderateScale(4),
                            paddingHorizontal: moderateScale(8),
                          }}>
                          <TextInput
                            placeholder={strings.ANSWER}
                            onChangeText={(text) =>
                              onChangeText(item, text, index, item?.length)
                            }
                            style={{
                              ...styles.insctructionText,
                              color: isDarkMode ? colors.textGreyB : colors.black,
                            }}
                            placeholderTextColor={
                              isDarkMode
                                ? colors.textGreyB
                                : colors.blackOpacity40
                            }
                          />
                        </View> */}
                      </View>
                    );
                  }
                })}
                <GradientButton
                  colorsArray={[
                    themeColors.primary_color,
                    themeColors.primary_color,
                  ]}
                  textStyle={{
                    textTransform: 'none',
                    fontSize: textScale(12),
                  }}
                  indicator={isSubmitFaqLoader}
                  indicatorColor={colors.white}
                  onPress={setAllFormData}
                  btnText={strings.SUBMIT}
                  marginTop={moderateScaleVertical(16)}
                  marginBottom={moderateScaleVertical(16)}
                />
              </ScrollView>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  };

  // Category KYC start

  const onCategoryKYC = () => {
    updateState({
      isCategoryKyc: true,
      isCategoryKycLoader: true,
    });
    actions
      .getCategoryKycDocument(
        {
          category_ids: cartData?.category_ids,
        },
        { code: appData?.profile?.code },
      )
      .then((res) => {
        console.log(res?.data, 'res?.data>>>');
        setKycTxtInpts(res?.data?.filter((x) => x?.file_type == 'Text'));
        setKycImages(res?.data?.filter((x) => x?.file_type == 'Image'));
        setKycPdfs(res?.data?.filter((x) => x?.file_type == 'Pdf'));

        updateState({
          isCategoryKycLoader: false,
        });
      })
      .catch(errorMethod);
  };

  const showActionSheet = () => {
    actionSheet.current.show();
  };
  const updateImages = (type, index) => {
    addtionSelectedImageIndex = index;
    addtionSelectedImage = type;
    showActionSheet(false);
  };

  const getDoc = async (value, index) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      let data = cloneDeep(kycPdfs);
      if (res) {
        data[index].value = res[0].uri;
        data[index].filename = res[0].name;
        data[index].fileData = res[0];
        setKycPdfs(data);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const cameraHandle = async (index) => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus) {
      if (index == 0 || index == 1) {
        cameraHandler(index, {
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
        })
          .then((res) => {
            if (isPrescriptionModal) {
              let imgData = [...selectedPrescriptionImgs];
              const isFound = imgData?.some(
                (item) => item?.filename == res?.filename,
              );
              if (isFound) {
                alert('File already uploaded');
                return;
              }
              imgData?.push({
                mime: res?.mime,
                path: res?.path,
                filename: res?.filename,
              });
              setPrescriptionImgs(imgData);
              return;
            }

            let data = cloneDeep(kycImages);
            data[addtionSelectedImageIndex].value = res?.sourceURL || res?.path;
            data[addtionSelectedImageIndex].fileData = res;
            setKycImages(data);
          })
          .catch((err) => {
            console.log(err, 'err>>>>');
          });
      }
    }
  };

  const onSubmitKycDocs = () => {
    let formdata = new FormData();
    formdata?.append('category_ids', cartData?.category_ids);
    var isRequired = true;
    if (!isEmpty(kycTxtInpts)) {
      kycTxtInpts.map((i, inx) => {
        if (i?.contents != '' && !!i?.contents) {
          formdata?.append(i?.translations[0].slug, i?.contents);
        } else if (i?.is_required) {
          if (isRequired) {
            alert(
              `${strings.PLEASE_ENTER
              } ${i?.translations[0].name.toLowerCase()}`,
            );
            isRequired = false;
            return;
          }
        }
      });
    }

    let concatinatedArray = kycImages.concat(kycPdfs);
    if (!isEmpty(concatinatedArray)) {
      concatinatedArray.map((i, inx) => {
        if (i?.value) {
          formdata?.append(
            i?.translations[0].slug,
            i?.file_type == 'Image'
              ? {
                uri: i.fileData?.path,
                name: i.fileData?.filename,
                filename: i.fileData?.filename,
                type: i.fileData?.mime,
              }
              : i?.fileData,
          );
        } else if (i?.is_required) {
          if (isRequired) {
            alert(
              `${strings.PLEASE_UPLOAD
              } ${i?.translations[0].name.toLowerCase()}`,
            );
            isRequired = false;
            return;
          }
        }
      });
    }

    if (!isRequired) {
      return;
    }
    updateState({
      isSubmitKycLoader: true,
    });

    actions
      .submitCategoryKYC(formdata, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        console.log(res, 'res_submit_Kyc>>>>');
        updateState({
          isCategoryKyc: false,
          isSubmitKycLoader: false,
        });
        showSuccess(res?.message);
        getCartDetail();
      })
      .catch(errorMethod);
  };

  //Get TextInput
  const getTextInputField = (type, index) => {
    return (
      <BorderTextInput
        // secureTextEntry={true}
        placeholder={type?.translations[0]?.name || ''}
      // onChangeText={(text) => handleDynamicTxtInput(text, index, type)}
      />
    );
  };

  const getImageFieldView = (type, index) => {
    return (
      <View
        style={{
          marginRight: moderateScale(15),
          marginTop: moderateScale(10),
          width: moderateScale(95),
        }}>
        <TouchableOpacity
          onPress={() => updateImages(type, index)}
          style={styles.imageUpload}>
          {kycImages[index].value != undefined &&
            kycImages[index].value != null &&
            kycImages[index].value != '' ? (
            <Image
              source={{ uri: kycImages[index].value }}
              style={styles.imageStyle2}
            />
          ) : (
            <Image source={imagePath?.icPhoto} />
          )}
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={{ ...styles.label3, minHeight: moderateScale(25) }}>
          {type?.translations[0]?.name}
          {type.is_required ? '*' : ''}
        </Text>
      </View>
    );
  };

  const getPdfView = (type, index) => {
    return (
      <View
        style={{ marginRight: moderateScale(20), marginTop: moderateScale(20) }}>
        <TouchableOpacity
          onPress={() => getDoc(type, index)}
          style={{
            ...styles.imageUpload,
            height: 100,
            width: 100,
            borderRadius: moderateScale(4),
            borderWidth: 1,
            borderColor: colors.blue,
          }}>
          <Text style={styles.uploadStyle}>
            {kycPdfs[index].value != undefined &&
              kycPdfs[index].value != null &&
              kycPdfs[index].value != ''
              ? `${kycPdfs[index].filename}`
              : `+ ${strings.UPLOAD}`}
          </Text>
        </TouchableOpacity>
        <Text style={styles.label3}>
          {type?.translations[0]?.name}
          {type.is_required ? '*' : ''}
        </Text>
      </View>
    );
  };

  const renderCategoryKYC = () => {
    return (
      <View>
        {isCategoryKycLoader ? (
          <View>
            <HeaderLoader
              viewStyles={{
                marginTop: moderateScaleVertical(8),
                marginBottom: moderateScaleVertical(16),
                marginHorizontal: 0,
              }}
              widthLeft={width - moderateScale(25)}
              rectWidthLeft={width - moderateScale(25)}
              heightLeft={moderateScaleVertical(120)}
              rectHeightLeft={moderateScaleVertical(120)}
              isRight={false}
              rx={7}
              ry={7}
            />
            <HeaderLoader
              viewStyles={{
                marginTop: moderateScaleVertical(8),
                marginBottom: moderateScaleVertical(16),
                marginHorizontal: 0,
              }}
              widthLeft={width - moderateScale(25)}
              rectWidthLeft={width - moderateScale(25)}
              heightLeft={moderateScaleVertical(120)}
              rectHeightLeft={moderateScaleVertical(120)}
              isRight={false}
              rx={7}
              ry={7}
            />
            <HeaderLoader
              viewStyles={{
                marginTop: moderateScaleVertical(8),
                marginBottom: moderateScaleVertical(16),
                marginHorizontal: 0,
              }}
              widthLeft={width - moderateScale(25)}
              rectWidthLeft={width - moderateScale(25)}
              heightLeft={moderateScaleVertical(120)}
              rectHeightLeft={moderateScaleVertical(120)}
              isRight={false}
              rx={7}
              ry={7}
            />
          </View>
        ) : (
          <View
            style={{
              // flex: 1,
              paddingHorizontal: moderateScale(15),
            }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: moderateScaleVertical(60),
              }}>
              {!isEmpty(kycTxtInpts) &&
                kycTxtInpts.map((item, index) => {
                  return getTextInputField(item, index);
                })}

              {!isEmpty(kycImages) && (
                <View style={styles.viewStyleForUploadImage}>
                  {kycImages.map((item, index) => {
                    return getImageFieldView(item, index);
                  })}
                </View>
              )}

              {!isEmpty(kycPdfs) && (
                <View style={styles.viewStyleForUploadImage}>
                  {kycPdfs.map((item, index) => {
                    return getPdfView(item, index);
                  })}
                </View>
              )}
            </ScrollView>
            <ButtonComponent
              onPress={onSubmitKycDocs}
              btnText={'Submit'}
              borderRadius={moderateScale(13)}
              textStyle={{ color: colors.white }}
              containerStyle={{
                position: 'absolute',
                backgroundColor: themeColors.primary_color,
                width: width - moderateScale(30),
                bottom: 10,
              }}
              placeLoader={isSubmitKycLoader}
            />
          </View>
        )}
      </View>
    );
  };

  const onCloseModal = () => {
    setLaundrySelectedPickupSlot('');
    setLaundrySelectedDropOffSlot('');
    setLaundrySelectedDropOffDate(null);
    setLaundrySelectedPickupDate(null);
    setLaundryAvailablePickupSlot([]);
    setLaundryAvailableDropOffSlot([]);
    updateState({
      isVisibleTimeModal: false,
    });
  };
  const onAddPrescriptionDocs = () => {
    showActionSheet();
  };

  const onSubmitPrescriptionDocs = () => {
    if (isEmpty(selectedPrescriptionImgs)) {
      alert('Please upload atleast one image.');
      return;
    }
    setPrescriptionLoading(true);
    let formdata = new FormData();
    formdata?.append('vendor_id', selectedItemForPrescription?.vendor_id);
    formdata?.append('product_id', selectedItemForPrescription?.product_id);

    selectedPrescriptionImgs.map((item) => {
      formdata?.append('prescriptions[]', {
        name: item?.filename || item?.mime,
        type: item?.mime,
        uri: item?.path,
      });
    });

    actions
      .addPrescriptions(formdata, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        'Content-Type': 'multipart/form-data',
      })
      .then((res) => {
        setPrescriptionImgs([]);
        setPrescriptionLoading(false);
        setPrescriptionModal(false);
        showSuccess(res?.message);
        getCartDetail();
      })
      .catch(errorMethod);
  };

  const onRemovePrescriptionImg = (item, type) => {
    if (type == 'API') {
      actions
        .deletePrescriptions(
          {
            prescription_id: item?.prescription_id,
          },
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          setPrescriptionModal(false);
          setTimeout(() => {
            showSuccess(res?.message);
            getCartDetail();
          }, 500);
        })
        .catch(errorMethod);
    }

    const imgData = [...selectedPrescriptionImgs];
    const indexOfObject = imgData?.findIndex((object) => {
      return object.filename === item?.filename;
    });
    imgData?.splice(indexOfObject, 1);
    setPrescriptionImgs(imgData);
  };

  const renderUploadedPrescriptionImgs = ({ item, index }) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          marginRight: moderateScale(10),
        }}>
        <FastImage
          source={{
            uri: getImageUrl(item?.proxy_url, item?.image_path, '300/300'),
            priority: FastImage.priority.high,
            cache: FastImage.cacheControl.immutable,
          }}
          style={{
            height: width / 4.5,
            width: width / 4.5,
            borderRadius: moderateScale(8),
          }}
        />
        <TouchableOpacity
          hitSlop={hitSlopProp}
          onPress={() => onRemovePrescriptionImg(item, 'API')}
          style={{
            position: 'absolute',
            right: -2,
            top: 0,
          }}>
          <Image
            source={imagePath.crossC}
            style={{
              height: 12,
              width: 12,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderPrescriptionModalView = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: textScale(14),
          }}>
          Prescriptions Details
        </Text>

        <ScrollView>
          {!isEmpty(
            selectedItemForPrescription?.product?.uploaded_prescriptions,
          ) && (
              <View>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                    marginVertical: moderateScaleVertical(10),
                    color: colors.blackOpacity70,
                  }}>
                  Added Prescriptions (
                  {
                    selectedItemForPrescription?.product?.uploaded_prescriptions
                      ?.length
                  }
                  )
                </Text>
                <View>
                  <FlatList
                    horizontal
                    data={
                      selectedItemForPrescription?.product
                        ?.uploaded_prescriptions || []
                    }
                    contentContainerStyle={{
                      height: width / 4,
                    }}
                    renderItem={renderUploadedPrescriptionImgs}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </View>
            )}

          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(12),
              color: colors.blackOpacity70,
              marginVertical: moderateScaleVertical(10),
            }}>
            Add Prescriptions
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: width / 4,
              }}>
              <TouchableOpacity onPress={onAddPrescriptionDocs}>
                <Image
                  source={imagePath.icAddPlaceholder}
                  style={{
                    height: width / 4.5,
                    width: width / 4.5,
                  }}
                />
              </TouchableOpacity>
              {selectedPrescriptionImgs.map((item) => (
                <View>
                  <Image
                    source={{ uri: item?.path }}
                    style={{
                      height: width / 4.5,
                      width: width / 4.5,
                      borderRadius: moderateScale(8),
                      marginLeft: moderateScale(10),
                    }}
                  />
                  <TouchableOpacity
                    hitSlop={hitSlopProp}
                    onPress={() => onRemovePrescriptionImg(item)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: -3,
                    }}>
                    <Image
                      source={imagePath.crossC}
                      style={{
                        height: 12,
                        width: 12,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
        <ButtonWithLoader
          isLoading={isPrescriptionLoading}
          onPress={onSubmitPrescriptionDocs}
          btnText={'Submit'}
          borderRadius={moderateScale(13)}
          textStyle={{ color: colors.white }}
          btnStyle={{
            position: 'absolute',
            backgroundColor: themeColors.primary_color,
            width: width - moderateScale(30),
            bottom: 10,
            borderWidth: 0,
          }}
        // placeLoader={}
        />
      </View>
    );
  };

  const selectCartItem = async (item) => {

    console.log("item++++", item)

    let apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      systemuser: DeviceInfo.getUniqueId(),
      timezone: RNLocalize.getTimeZone(),
      device_token: DeviceInfo.getUniqueId(),
    };
    let apiData = {
      cart_id: item?.cart_id,
      is_cart_checked: item?.is_cart_checked == 0 ? 1 : 0,
      cart_product_id: item?.id,
      type: dineInType
    }
    updateState({ deliveryFeeLoader: true })

    try {
      console.log("item++++", item)
      const res = await actions.cartItemChecked(apiData, apiHeader)
      console.log('res+++++++', res)
      actions.cartItemQty(res);
      setCartItems(res.data.products);
      setCartData(res.data);
      updateState({ deliveryFeeLoader: false })

    } catch (error) {
      console.log("error raised", error)
      updateState({ deliveryFeeLoader: false })
    }
  }


  // Category KYC end
  console.log(cartItems, "cartItemscartItems");
  const renderCustomLeft = () => {
    return(

      <TouchableOpacity onPress={()=>{navigation.navigate(navigationStrings.HOMESTACK)}}
     
      style={{ justifyContent: 'center', alignItems: 'center', borderRadius: moderateScale(12), height: moderateScaleVertical(37), width: moderateScale(37), backgroundColor: colors.greyColor}}
      >
        <Image source={imagePath.left_arrow} />
      </TouchableOpacity>
    )
  }
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoading={deliveryFeeLoader}>
      <Header
        headerStyle={{backgroundColor: themeColors.primary_color, height: 71 }}
        textStyle={{color:colors.white}}

        centerTitle={strings.CART}
        customLeft={renderCustomLeft}
        // leftIcon={imagePath.left_arrow} 
        isRightText={cartItems && !!cartItems?.length}
        onPressRightTxt={() => openClearCartModal()}
        // onPressLeft={() => navigation.goBack()}
      />

      {
        <FlatList
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems?.length ? getHeader() : null}
          ListFooterComponent={cartItems?.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItem}
          style={{
            flex: 1,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          ListEmptyComponent={() =>
            !isShimmerLoading ? <ListEmptyComp /> : <></>
          }
        />
      }
      {!!isModalVisibleForClearCart && (
        <ConfirmationModal
          closeModal={() => closeOptionModal()}
          ShowModal={isModalVisibleForClearCart}
          showBottomButton={true}
          mainText={strings.AREYOUSURE}
          bottomButtonClick={bottomButtonClick}
        // updateStatus={(item) => updateStatus(item)}
        />
      )}
      <ChooseAddressModal
        isVisible={isVisible}
        onClose={() => {
          updateState({ placeLoader: false });
          setModalVisible(false);
        }}
        openAddressModal={() =>
          setModalVisibleForAddessModal(true, 'addAddress')
        }
        selectAddress={(data) => selectAddress(data)}
        selectedAddress={selectedAddressData}
      />
      <AddressModal3
        isVisible={isVisibleAddressModal}
        onClose={() => setModalVisibleForAddessModal(!isVisibleAddressModal)}
        type={type}
        passLocation={(data, value) => addUpdateLocation(data, value)}
        navigation={navigation}
        selectViaMap={selectViaMap}
        openCloseMapAddress={openCloseMapAddress}
        constCurrLoc={location}
      />
      {/* Date time modal */}
      <Modal
        transparent={true}
        isVisible={isVisibleTimeModal}
        animationType={'none'}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        onLayout={(event) => {
          setViewHeight(event.nativeEvent.layout.height);
        }}>
        <TouchableOpacity style={styles.closeButton} onPress={onCloseModal}>
          <Image
            style={isDarkMode && { tintColor: MyDarkTheme.colors.white }}
            source={imagePath.crossB}
          />
        </TouchableOpacity>
        <View
          style={
            isDarkMode
              ? [
                styles.modalMainViewContainer,
                { backgroundColor: MyDarkTheme.colors.lightDark },
              ]
              : styles.modalMainViewContainer
          }>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={{
              ...styles.modalMainViewContainer,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
            }}>
            <View
              style={{
                // flex: 0.6,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text
                style={{
                  ...styles.carType,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.blackC,
                }}>
                {strings.SELECTDATEANDTIME}
              </Text>
            </View>

            {businessType == 'laundry' ? (
              <View>
                <Fragment>
                  <ScrollView>
                    {modalType == 'pickup' ? (
                      <Calendar
                        current={new Date()}
                        minDate={
                          !!minimumDelayVendorDate
                            ? minimumDelayVendorDate
                            : new Date()
                        }
                        onDayPress={laundrySlotSelection}
                        markedDates={{
                          [laundrySelectedPickupDate]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: themeColors.primary_color,
                            selectedTextColor: colors.white,
                          },
                        }}
                        theme={{
                          arrowColor: themeColors.primary_color,
                          textDayFontFamily: fontFamily.medium,
                          textMonthFontFamily: fontFamily.medium,
                          textDayHeaderFontFamily: fontFamily.bold,
                        }}
                      />
                    ) : (
                      <Calendar
                        current={
                          getBundleId() == appIds.masa
                            ? dayAfterToday
                            : new Date()
                        }
                        minDate={
                          !!minimumDelayVendorDate
                            ? minimumDelayVendorDate
                            : getBundleId() == appIds.masa
                              ? dayAfterToday
                              : new Date()
                        }
                        onDayPress={laundrySlotSelection}
                        markedDates={{
                          [laundrySelectedDropOffDate]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: themeColors.primary_color,
                            selectedTextColor: colors.white,
                          },
                        }}
                        theme={{
                          arrowColor: themeColors.primary_color,
                          textDayFontFamily: fontFamily.medium,
                          textMonthFontFamily: fontFamily.medium,
                          textDayHeaderFontFamily: fontFamily.bold,
                        }}
                      />
                    )}

                    {modalType == 'pickup' ? (
                      <View>
                        <Text
                          style={{
                            marginHorizontal: moderateScale(24),
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                            marginBottom: moderateScaleVertical(8),
                          }}>
                          {strings.TIME_SLOT}
                        </Text>
                        {isCheckSlotLoading ? (
                          <Text
                            style={{
                              fontFamily: fontFamily.medium,
                              color: colors.blackOpacity66,
                              marginLeft: moderateScale(24),
                            }}>
                            {strings.LOADING}...
                          </Text>
                        ) : (
                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={laundryAvailablePickupSlot || []}
                            renderItem={renderTimeSlots}
                            keyExtractor={(item) => item?.value || ''}
                            ItemSeparatorComponent={() => (
                              <View style={{ marginRight: moderateScale(12) }} />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View style={{ marginRight: moderateScale(24) }} />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.blackOpacity66,
                                  }}>
                                  {!laundrySelectedPickupDate
                                    ? strings.PLEASE_SELECT_DATE
                                    : strings.SLOTS_NOT_FOUND_FOR_DATE}
                                </Text>
                              </View>
                            )}
                          />
                        )}
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{
                            marginHorizontal: moderateScale(24),
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                            marginBottom: moderateScaleVertical(8),
                          }}>
                          {strings.TIME_SLOT}
                        </Text>
                        {isCheckSlotLoading ? (
                          <Text
                            style={{
                              fontFamily: fontFamily.medium,
                              color: colors.blackOpacity66,
                              marginLeft: moderateScale(24),
                            }}>
                            Loading...
                          </Text>
                        ) : (
                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={laundryAvailableDropOffSlot || []}
                            renderItem={renderTimeSlots2}
                            keyExtractor={(item) => item?.value || ''}
                            ItemSeparatorComponent={() => (
                              <View style={{ marginRight: moderateScale(12) }} />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View style={{ marginRight: moderateScale(24) }} />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.blackOpacity66,
                                  }}>
                                  {!laundrySelectedDropOffDate
                                    ? strings.PLEASE_SELECT_DATE
                                    : strings.SLOTS_NOT_FOUND_FOR_DATE}
                                </Text>
                              </View>
                            )}
                          />
                        )}
                      </View>
                    )}
                  </ScrollView>
                </Fragment>
              </View>
            ) : (
              <View>
                {(!!availableTimeSlots && availableTimeSlots?.length > 0) ||
                  (!!cartData &&
                    !!cartData?.slots &&
                    !!cartData?.slots?.length > 0) ? (
                  <Fragment>
                    <ScrollView>
                      {console.log(minimumDelayVendorDate, '+++minimumDelayVendorDate', new Date())}
                      <Calendar
                        current={
                          getBundleId() == appIds.masa
                            ? dayAfterToday
                            : new Date()
                        }
                        minDate={
                          !!minimumDelayVendorDate
                            ? minimumDelayVendorDate
                            : getBundleId() == appIds.masa
                              ? dayAfterToday
                              : new Date()
                        }
                        onDayPress={onSelectDateFromCalendar}
                        markedDates={{
                          [selectedDateFromCalendar]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: themeColors.primary_color,
                            selectedTextColor: colors.white,
                          },
                        }}
                        theme={{
                          arrowColor: themeColors.primary_color,
                          textDayFontFamily: fontFamily.medium,
                          textMonthFontFamily: fontFamily.medium,
                          textDayHeaderFontFamily: fontFamily.bold,
                          // textDayFontSize: textScale(12),
                          // textMonthFontSize: textScale(10),
                          // textDayHeaderFontSize: textScale(10),
                        }}
                      />
                      {/* {
                        getBundleId == appIds.masa ? currentDate == sheduledorderdate || currentDate == apiScheduledDate ? null : (<View>
                          <Text
                            style={{
                              marginHorizontal: moderateScale(24),
                              fontFamily: fontFamily.medium,
                              fontSize: textScale(12),
                              marginBottom: moderateScaleVertical(8),
                              // height:moderateScale(20)
                            }}>
                            {strings.TIME_SLOT}
                          </Text>
                          {console.log(availableTimeSlots, "availableTimeSlots")}
                          <FlatList
                            horizontal
                            data={availableTimeSlots || []}
                            renderItem={renderTimeSlots}
                            keyExtractor={(item) => item?.value || ''}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                              <View style={{ marginRight: moderateScale(12) }} />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View style={{ marginRight: moderateScale(24) }} />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.redB,
                                  }}>
                                  {strings.SLOT_NOT_AVAILABAL}
                                </Text>
                              </View>
                            )}
                          />
                        </View>) : (<View>
                          <Text
                            style={{
                              marginHorizontal: moderateScale(24),
                              fontFamily: fontFamily.medium,
                              fontSize: textScale(12),
                              marginBottom: moderateScaleVertical(8),
                              // height:moderateScale(20)
                            }}>
                            {strings.TIME_SLOT}
                          </Text>
                          <FlatList
                            horizontal
                            data={availableTimeSlots || []}
                            renderItem={renderTimeSlots}
                            keyExtractor={(item) => item?.value || ''}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                              <View style={{ marginRight: moderateScale(12) }} />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View style={{ marginRight: moderateScale(24) }} />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.redB,
                                  }}>
                                  {strings.SLOT_NOT_AVAILABAL}
                                </Text>
                              </View>
                            )}
                          />
                        </View>)
                      } */}

                      <View>
                        <Text
                          style={{
                            marginHorizontal: moderateScale(24),
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                            marginBottom: moderateScaleVertical(8),
                            // height:moderateScale(20)
                          }}>
                          {strings.TIME_SLOT}
                        </Text>
                        {isCheckSlotLoading ? (
                          <Text
                            style={{
                              fontFamily: fontFamily.medium,
                              color: colors.blackOpacity66,
                              marginLeft: moderateScale(24),
                            }}>
                            Loading...
                          </Text>
                        ) : (
                          <FlatList
                            horizontal
                            data={availableTimeSlots || []}
                            renderItem={renderTimeSlots}
                            keyExtractor={(item) => item?.value || ''}
                            showsHorizontalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                              <View style={{ marginRight: moderateScale(12) }} />
                            )}
                            ListHeaderComponent={() => (
                              <View style={{ marginLeft: moderateScale(24) }} />
                            )}
                            ListFooterComponent={() => (
                              <View style={{ marginRight: moderateScale(24) }} />
                            )}
                            ListEmptyComponent={() => (
                              <View>
                                <Text
                                  style={{
                                    fontFamily: fontFamily.medium,
                                    color: colors.redB,
                                  }}>
                                  {strings.SLOT_NOT_AVAILABAL}
                                </Text>
                              </View>
                            )}
                          />
                        )}
                      </View>
                    </ScrollView>
                  </Fragment>
                ) : (
                  <DatePicker
                    locale={selectedLanguage}
                    date={
                      !!sheduledorderdate
                        ? new Date(sheduledorderdate)
                        : new Date()
                    }
                    textColor={isDarkMode ? colors.white : colors.blackB}
                    mode="datetime"
                    minimumDate={
                      !!cartData?.delay_date
                        ? new Date(cartData?.delay_date)
                        : new Date()
                    }
                    // maximumDate={undefined}
                    // style={styles.datetimePickerText}
                    // onDateChange={setDate}
                    onDateChange={(value) => onDateChange(value)}
                  />
                )}
              </View>
            )}
            <View
              style={{
                // styles.bottomAddToCartView,
                // { top: viewHeight - height / 6 },
                marginHorizontal: moderateScale(24),
              }}>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                // textStyle={styles.textStyle}
                onPress={selectOrderDate}
                marginTop={moderateScaleVertical(10)}
                marginBottom={moderateScaleVertical(30)}
                btnText={strings.SELECT}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
      {!!paymentModal ? (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[height]}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          handleComponent={null}>
          {/* <Header
            leftIcon={
              appStyle?.homePageLayout === 2
                ? imagePath.backArrow
                : appStyle?.homePageLayout === 3 ||
                  appStyle?.homePageLayout === 5
                  ? imagePath.icBackb
                  : imagePath.back
            }
            onPressLeft={() => updateState({ paymentModal: false })}
            centerTitle={strings.PAYMENT}
            headerStyle={
              isDarkMode
                ? { backgroundColor: MyDarkTheme.colors.background }
                : { backgroundColor: colors.backgroundGrey }
            }
          /> */}
          <BottomSheetScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.backgroundGrey,
            }}>
            {/* <StripeProvider
              publishableKey={preferences?.stripe_publishable_key}
              merchantIdentifier="merchant.identifier"> */}
            <SelectPaymentModal
              onSelectPayment={onSelectPayment}
              codMinAmount={codMinAmount}
              amount={orderAmount}
              paymentModalClose={() => setPaymentModal(false)}
              dineInType={dineInType}
            />
            {/* </StripeProvider> */}

          </BottomSheetScrollView>
        </BottomSheet>
      ) : null}
      {/* <Modal
        isVisible={paymentModal}
        style={{
          margin: 0,
        }}>
        <View style={{flex: 1}}>
          <StripeProvider
            publishableKey={preferences?.stripe_publishable_key}
            merchantIdentifier="merchant.identifier">
            <SelectPaymentModal
              onSelectPayment={onSelectPayment}
              paymentModalClose={() => updateState({paymentModal: false})}
              dineInType={dineInType}
            />
          </StripeProvider>
        </View>
      </Modal> */}

      <BottomModal
        onBackdropPress={closeForm}
        isVisible={isProductOrderForm}
        renderModalContent={renderProductForm}
      />
      <BottomModal
        onBackdropPress={closeForm}
        isVisible={isCategoryKyc}
        renderModalContent={renderCategoryKYC}
      />

      <BottomModal
        onBackdropPress={closeForm}
        isVisible={isPrescriptionModal}
        // isVisible={true}
        renderModalContent={renderPrescriptionModalView}
        mainViewStyle={{
          minHeight: height / 2.3,
        }}
      />

      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => cameraHandle(index)}
      />
      <Modal
        onBackdropPress={() =>
          updateState({
            isModalVisibleForPayFlutterWave: false,
            placeLoader: false,
          })
        }
        isVisible={isModalVisibleForPayFlutterWave}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
          // marginBottom: 20,
        }}>
        <View
          style={{
            padding: moderateScale(20),
            backgroundColor: colors?.white,
            height: height / 8,
            justifyContent: 'flex-end',
          }}>
          {
            !!appData?.profile?.preferences?.flutterwave_public_key ?
              <PayWithFlutterwave
                onAbort={() =>
                  updateState({
                    isModalVisibleForPayFlutterWave: false,
                    placeLoader: false,
                  })
                }
                onRedirect={handleOnRedirect}
                options={{
                  tx_ref: generateTransactionRef(10),
                  authorization: appData?.profile?.preferences?.flutterwave_public_key,
                  customer: {
                    email: userData?.email,
                    name: userData?.name,
                  },
                  amount: paymentDataFlutterWave?.total_payable_amount || 0,
                  currency: currencies?.primary_currency?.iso_code,
                  payment_options: 'card',
                }}
              /> : <></>
          }
        </View >
      </Modal >
      <Modal
        isVisible={isVisibleMtnGateway}
        style={{
          // // margin: 0,
          // // justifyContent: 'flex-end',
          // // marginBottom: 20,
          // // height:moderateScaleVertical(100),
          // marginHorizontal:moderateScale(20),

        }}
      >
        <View style={{ height: moderateScaleVertical(150), backgroundColor: 'white', borderRadius: moderateScale(15) }}>
          <Text style={{
            color: isDarkMode ? 'white' : themeColors?.primary_color,
            fontSize: textScale(15),
            padding: moderateScale(10)
          }}>Waiting for response ....</Text>
          <View style={{ justifyContent: "center", alignItems: "center", padding: moderateScale(25) }}>

            <CountdownCircleTimer
              isPlaying
              duration={Number(responseTimer)}
              colors={[themeColors?.primary_color]}
              size={40}
              strokeWidth={5}
            >
              {({ remainingTime }) => {

                remainingTime == 1 && responseTimer != null && setIsVisibleMtnGateway(false)
                var seconds = parseInt(remainingTime) //because moment js dont know to handle number in string format
                var format = moment.duration(seconds, 'seconds').minutes() + ':' + moment.duration(seconds, 'seconds').seconds();
                return (<>
                  <Text>{format}</Text>
                </>
                )

              }}
            </CountdownCircleTimer>
          </View>
        </View>
      </Modal>
    </WrapperContainer >
  );
}
export default React.memo(Cart);