import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import DatePicker from 'react-native-date-picker';
import DeviceInfo from 'react-native-device-info';
import DropDownPicker from 'react-native-dropdown-picker';
import FastImage from 'react-native-fast-image';
import {TextInput} from 'react-native-gesture-handler';
import * as RNLocalize from 'react-native-localize';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import AddressModal from '../../Components/AddressModal';
import ButtonComponent from '../../Components/ButtonComponent';
import ChooseAddressModal from '../../Components/ChooseAddressModal';
import ConfirmationModal from '../../Components/ConfirmationModal';
import GradientButton from '../../Components/GradientButton';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import {
  loaderOne,
  loaderSix,
} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  getParameterByName,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import {getItem, removeItem, setItem} from '../../utils/utils';
import stylesFun from './styles';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function Cart({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  let paramsData = route?.params;
  const [state, setState] = useState({
    isLoading: true,
    isVisibleTimeModal: false,
    isVisible: false,
    cartItems: [],
    cartData: {},
    isLoadingB: false,
    isModalVisibleForClearCart: false,
    isVisibleAddressModal: false,
    type: '',
    vendorAddress: '',
    selectedAddress: null,
    selectedPayment: {
      id: 1,
      off_site: 0,
      title: 'Cash On Delivery',
      title_lng: strings.CASH_ON_DELIVERY,
    },
    // selectedPayment: null,
    isRefreshing: false,
    selectedTipvalue: null,
    selectedTipAmount: null,
    viewHeight: 0,
    tableData: [],
    isTableDropDown: false,
    defaultSelectedTable: '',
    deepLinkUrl: null,
    selectedTimeOptions: [
      {id: 1, title: strings.NOW, type: 'now'},
      {id: 2, title: strings.SCHEDULE_ORDER, type: 'schedule'},
    ],
    selectedTimeOption: null,
    sheduledorderdate: null,
    scheduleType: null,
  });
  const {
    viewHeight,
    isVisibleTimeModal,
    isLoading,
    cartItems,
    cartData,
    isLoadingB,
    isModalVisibleForClearCart,
    isVisibleAddressModal,
    isVisible,
    type,
    selectedAddress,
    selectedPayment,
    isRefreshing,
    vendorAddress,
    selectedTipvalue,
    selectedTipAmount,
    tableData,
    isTableDropDown,
    defaultSelectedTable,
    deepLinkUrl,
    selectedTimeOptions,
    selectedTimeOption,
    sheduledorderdate,
    scheduleType,
  } = state;

  //Redux store data
  const userData = useSelector((state) => state?.auth?.userData);
  const {appData, allAddresss, themeColors, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});
  const selectedAddressData = useSelector(
    (state) => state?.cart?.selectedAddress,
  );

  const dineInType = useSelector((state) => state?.home?.dineInType);
  const selectedLanguage = languages?.primary_language?.sort_code;
  //Update states on screens
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  console.log('cart itemss', cartItems);

  // styles funcation
  // const fontFamily = appStyle?.fontSizeData;
  // const styles = stylesFun({fontFamily, themeColors});

  //On focus fucntion
  console.log(RNLocalize.getTimeZone(), 'timezone');
  useFocusEffect(
    React.useCallback(() => {
      if (paramsData && paramsData?.selectedMethod) {
        updateState({selectedPayment: paramsData?.selectedMethod});
      }
      updateState({isLoadingB: true});
      getCartDetail();
    }, [
      currencies,
      languages,
      route?.params?.promocodeDetail,
      allAddresss,
      selectedAddress,
      paramsData,
      isRefreshing,
    ]),
  );

  useEffect(() => {
    checkforAddressUpdate();
  }, [selectedAddress, allAddresss]);

  //check for addreess Update and change
  const checkforAddressUpdate = () => {
    if (allAddresss.length == 0) {
      updateState({selectedAddress: null});
      actions.saveAddress(null);
    }
    if (!selectedAddress && allAddresss.length) {
      let find = allAddresss.find((x) => x.is_primary);

      if (find) {
        updateState({selectedAddress: find});
        actions.saveAddress(find);
      } else {
        selectAddress(allAddresss[0]);
      }
    }
    if (selectedAddress && allAddresss.length) {
      // let find2=

      let find = allAddresss.find(
        (x) =>
          x.id == selectedAddress.id &&
          x.is_primary == selectedAddress.is_primary,
      );
      if (find) {
        selectAddress(find);
      } else {
        selectAddress(allAddresss[0]);
        // updateState({selectedAddress: null});
        // actions.saveAddress(null);
      }
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
          if (res.data) {
            actions.saveAllUserAddress(res.data);
          }
        })
        .catch(errorMethod);
    }
  };

  //get the entire cart detail
  const getCartDetail = () => {
    actions
      .getCartDetail(
        `/?type=${dineInType}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
          timezone: RNLocalize.getTimeZone(),
        },
      )
      .then((res) => {
        console.log(res.data, 'cart detail');
        actions.cartItemQty(res);
        updateState({
          isLoadingB: false,
          isRefreshing: false,
          sheduledorderdate: res?.data?.scheduled_date_time,
          scheduleType: res?.data?.schedule_type,
          selectedTimeOption:
            res?.data?.schedule_type == 'now'
              ? {id: 1, title: strings.NOW, type: 'now'}
              : res?.data?.schedule_type == 'schedule'
              ? {id: 2, title: 'Schedule Order', type: 'schedule'}
              : {id: 1, title: strings.NOW, type: 'now'},
        });
        if (res && res.data) {
          if (res.data.vendor_details.vendor_tables) {
            res.data.vendor_details.vendor_tables.forEach(
              (item, indx) =>
                (tableData[indx] = {
                  id: item.id,
                  label: `Category: ${
                    item.category.title ? item.category.title : ''
                  } | Table: ${
                    item.table_number ? item.table_number : 0
                  } | Seat Capacity: ${
                    item.seating_number ? item.seating_number : 0
                  }`,
                  value: `Category: ${
                    item.category.title ? item.category.title : ''
                  } | Table: ${
                    item.table_number ? item.table_number : 0
                  } | Seat Capacity: ${
                    item.seating_number ? item.seating_number : 0
                  }`,
                  title: item.category.title,
                  table_number: item.table_number,
                  seating_number: item.seating_number,
                  vendor_id: res.data.vendor_details.vendor_address.id,
                }),
              updateState({
                tableData: tableData,
              }),
            );
          }
          updateState({
            cartItems: res.data.products,
            vendorAddress: res.data.address,
            cartData: res.data,
          });
        } else {
          updateState({
            cartItems: [],
            cartData: {},
            vendorAddress: '',
          });
        }
      })
      .catch(errorMethod);

    getItem('selectedTable')
      .then((res) => {
        updateState({
          defaultSelectedTable: res,
        });
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  //add /delete products from cart
  const addDeleteCartItems = (item, index, type) => {
    let quanitity = null;
    let itemToUpdate = cloneDeep(item);
    console.log('item', item);
    // return;
    if (type == 1) {
      quanitity = Number(itemToUpdate.quantity) + 1;
    } else {
      quanitity = Number(itemToUpdate.quantity) - 1;
    }
    if (quanitity) {
      updateState({isLoadingB: true});
      let data = {};
      data['cart_id'] = itemToUpdate?.cart_id;
      data['quantity'] = quanitity;
      data['cart_product_id'] = itemToUpdate?.id;
      data['type'] = dineInType;
      console.log('sendng api data', data);

      actions
        .increaseDecreaseItemQty(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          actions.cartItemQty(res);
          updateState({
            cartItems: res.data.products,
            cartData: res.data,
            isLoadingB: false,
          });
        })
        .catch(errorMethod);
    } else {
      updateState({isLoadingB: true});
      removeItem('selectedTable');
      removeProductFromCart(itemToUpdate);
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (item) => {
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
        actions.cartItemQty(res);
        updateState({
          cartItems: res.data.products,
          cartData: res.data,
          isLoadingB: false,
        });
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Close modal for Clear cart
  const closeOptionModal = () => {
    updateState({isModalVisibleForClearCart: false});
  };

  const bottomButtonClick = () => {
    updateState({isLoadingB: true, isModalVisibleForClearCart: false});
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
        actions.cartItemQty(res);
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
        });
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS, {
      vendor: vendor,
      cartId: cartData.id,
    })();
  };

  useEffect(() => {
    if (paramsData?.transactionId) {
      _directOrderPlace();
    }
  }, [paramsData?.transactionId]);

  //Verify your promo code
  const _removeCoupon = (item, cartData) => {
    updateState({isLoadingB: true});
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
          updateState({isLoadingB: false});
        }
      })
      .catch(errorMethod);
  };

  const _directOrderPlace = () => {
    let data = {};
    data['address_id'] =
      paramsData?.selectedAddressData?.id || selectedAddressData?.id;
    data['payment_option_id'] =
      paramsData?.selectedPayment?.id || selectedPayment?.id;

    if (paramsData?.transactionId) {
      data['transaction_id'] = paramsData?.transactionId;
    }
    actions
      .placeOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty({});
        updateState({
          cartItems: [],
          cartData: {},
          isLoadingB: false,
        });
        moveToNewScreen(navigationStrings.ORDERSUCESS, {
          orderDetail: res.data,
        })();
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const setDateAndTimeSchedule = () => {
    let data = {};
    data['task_type'] = scheduleType;
    data['schedule_dt'] =
      scheduleType != 'now' && sheduledorderdate
        ? new Date(sheduledorderdate).toISOString()
        : null;
    console.log(data, 'setDateAndTimeSchedule data');

    actions
      .scheduledOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        updateState({
          isLoadingB: false,
        });
      })
      .catch(errorMethod);
  };

  const _finalPayment = () => {
    if (selectedPayment?.id == 1 && selectedPayment?.off_site == 0) {
      updateState({isLoadingB: true});
      _directOrderPlace();
    } else {
      if (selectedPayment?.off_site == 1) {
        _webPayment();
      } else {
        _offineLinePayment();
      }
    }
  };

  //Clear cart
  const placeOrder = () => {
    var d1 = new Date();
    var d2 = new Date(sheduledorderdate);
    console.log(d1);
    if (!!userData?.auth_token) {
      if (!selectedAddressData) {
        // showError(strings.PLEASE_SELECT_ADDRESS);
        setModalVisible(true);
      } else if (!paramsData?.selectedMethod) {
        showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
      }
      // else if (!(sheduledorderdate && selectedTimeOption)) {
      //   showError(strings.PLEASE_SELECT_ORDER_TYPE);
      // } else if (d1.getTime() >= d2.getTime()) {
      //   showError(strings.INVALID_SCHEDULED_DATE);
      // }
      else if (!(sheduledorderdate && selectedTimeOption)) {
        showError(strings.PLEASE_SELECT_ORDER_TYPE);
      } else if (scheduleType == 'schedule' && d1.getTime() >= d2.getTime()) {
        showError(strings.INVALID_SCHEDULED_DATE);
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
          moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {
            ...userData,
            fromCart: true,
          })();
        } else {
          _finalPayment();
        }
      }
    } else {
      actions.setAppSessionData('on_login');
    }
  };

  useEffect(() => {
    if (paramsData?.redirectFrom) {
      _directOrderPlace();
    }
  }, [paramsData?.redirectFrom]);

  const _webPayment = () => {
    let selectedMethod = selectedPayment.code.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/cart`;

    updateState({isLoadingB: true});
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?tip=${
          selectedTipAmount && selectedTipAmount != ''
            ? Number(selectedTipAmount)
            : 0
        }&amount=${
          cartData?.total_payable_amount
        }&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&address_id=${
          selectedAddressData?.id
        }&payment_option_id=${selectedPayment?.id}&action=cart`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({isLoadingB: false, isRefreshing: false});
        if (res && res?.status == 'Success' && res?.data) {
          // updateState({allAvailAblePaymentMethods: res?.data});
          navigation.navigate(navigationStrings.WEBPAYMENTS, {
            paymentUrl: res?.data,
            paymentTitle: selectedPayment?.title,
            redirectFrom: 'cart',
            selectedAddressData: selectedAddressData,
            selectedPayment: selectedPayment,
          });
        }
      })
      .catch(errorMethod);
  };

  //Offline payments
  const _offineLinePayment = async () => {
    if (paramsData?.tokenInfo) {
      updateState({isLoadingB: true});
      let selectedMethod = selectedPayment.code.toLowerCase();
      updateState({isLoadingB: true});
      actions
        .openPaymentWebUrl(
          `/${selectedMethod}?tip=${
            selectedTipAmount && selectedTipAmount != ''
              ? Number(selectedTipAmount)
              : 0
          }&amount=${cartData?.total_payable_amount}&auth_token=${
            userData?.auth_token
          }&address_id=${selectedAddressData?.id}&payment_option_id=${
            selectedPayment?.id
          }&action=cart&stripe_token=${paramsData?.tokenInfo}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          updateState({isRefreshing: false});
          if (res && res?.status == 'Success' && res?.data) {
            // updateState({allAvailAblePaymentMethods: res?.data});
            actions.cartItemQty({});
            updateState({
              cartItems: [],
              cartData: {},
              isLoadingB: false,
            });
            moveToNewScreen(navigationStrings.ORDERSUCESS, {
              orderDetail: res.data,
            })();
            showSuccess(res?.message);
          } else {
            updateState({isLoadingB: false});
          }
        })
        .catch(errorMethod);
    } else {
      showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
    }
  };

  useEffect(() => {
    // console.log(scheduleType, 'scheduleType scheduleType');
    if (scheduleType != null && scheduleType == 'now') {
      setDateAndTimeSchedule();
    }
  }, [scheduleType]);

  const _selectTime = (item) => {
    // console.log(item, 'item');
    // console.log(selectedTimeOption, 'selectedTimeOption selectedTimeOption');
    updateState({
      scheduleType: item?.type,
    });

    {
      selectedTimeOption && selectedTimeOption?.id == item?.id
        ? updateState({
            isVisibleTimeModal: item?.type === 'schedule' ? true : false,
            isLoading: true,
          })
        : updateState({
            selectedTimeOption: item,
            isLoading: true,
            isVisibleTimeModal: item?.type === 'schedule' ? true : false,
          });
    }
  };

  const selectOrderDate = () => {
    onClose();
    updateState({
      scheduleType: 'schedule',
    });
    setDateAndTimeSchedule();
  };

  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
          paddingHorizontal: moderateScale(10),
          marginVertical: moderateScaleVertical(10),
          marginBottom: moderateScaleVertical(10),
        }}>
        <View style={styles.vendorView}>
          <Text
            numberOfLines={1}
            style={
              isDarkMode
                ? [styles.vendorText, {color: MyDarkTheme.colors.text}]
                : styles.vendorText
            }>
            {item?.vendor?.name}
          </Text>
        </View>
        {item?.vendor_products.length
          ? item?.vendor_products.map((i, inx) => {
              return (
                <View key={inx}>
                  <View style={[styles.cartItemMainContainer]}>
                    <View
                      style={[
                        styles.cartItemImage,
                        {
                          backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.lightDark
                            : colors.white,
                        },
                      ]}>
                      <FastImage
                        source={
                          i?.cartImg != '' && i?.cartImg != null
                            ? {
                                uri: getImageUrl(
                                  i?.cartImg?.path?.proxy_url,
                                  i?.cartImg?.path?.image_path,
                                  '300/300',
                                ),
                                priority: FastImage.priority.high,
                              }
                            : imagePath.patternOne
                        }
                        style={styles.imageStyle}
                      />
                    </View>

                    <View style={styles.cartItemDetailsCon}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flex: 0.6}}>
                          <Text
                            numberOfLines={1}
                            style={
                              isDarkMode
                                ? [
                                    styles.priceItemLabel2,
                                    {
                                      opacity: 0.8,
                                      color: MyDarkTheme.colors.text,
                                    },
                                  ]
                                : [styles.priceItemLabel2, {opacity: 0.8}]
                            }>
                            {i?.product?.translation[0]?.title}
                          </Text>
                          {i?.variant_options.length
                            ? i?.variant_options.map((j, jnx) => {
                                return (
                                  <View style={{flexDirection: 'row'}}>
                                    <Text
                                      style={
                                        isDarkMode
                                          ? [
                                              styles.cartItemWeight2,
                                              {
                                                color: MyDarkTheme.colors.text,
                                              },
                                            ]
                                          : styles.cartItemWeight2
                                      }
                                      numberOfLines={1}>
                                      {j.title}{' '}
                                    </Text>
                                    <Text
                                      style={
                                        isDarkMode
                                          ? [
                                              styles.cartItemWeight2,
                                              {
                                                color: MyDarkTheme.colors.text,
                                              },
                                            ]
                                          : styles.cartItemWeight2
                                      }
                                      numberOfLines={1}>{`(${j.option})`}</Text>
                                  </View>
                                );
                              })
                            : null}
                        </View>

                        <View style={{flex: 0.3, justifyContent: 'center'}}>
                          <View style={styles.incDecBtnContainer}>
                            <TouchableOpacity
                              style={{flex: 0.3, alignItems: 'center'}}
                              onPress={() => addDeleteCartItems(i, inx, 2)}>
                              <Text style={styles.cartItemValueBtn}>-</Text>
                            </TouchableOpacity>
                            <View style={{flex: 0.4, alignItems: 'center'}}>
                              <Text style={styles.cartItemValue}>
                                {i?.quantity}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={{flex: 0.3, alignItems: 'center'}}
                              onPress={() => addDeleteCartItems(i, inx, 1)}>
                              <Text style={styles.cartItemValueBtn}>+</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{flex: 0.5, justifyContent: 'center'}}>
                          {!!i?.product_addons.length && (
                            <View>
                              <Text
                                style={
                                  isDarkMode
                                    ? [
                                        styles.cartItemWeight2,
                                        {
                                          color: MyDarkTheme.colors.text,
                                        },
                                      ]
                                    : styles.cartItemWeight2
                                }>
                                {strings.EXTRA}
                              </Text>
                            </View>
                          )}
                          {i?.product_addons.length
                            ? i?.product_addons.map((j, jnx) => {
                                return (
                                  <View style={{flexDirection: 'row'}}>
                                    <Text
                                      style={
                                        isDarkMode
                                          ? [
                                              styles.cartItemWeight2,
                                              {
                                                color: MyDarkTheme.colors.text,
                                              },
                                            ]
                                          : styles.cartItemWeight2
                                      }
                                      numberOfLines={1}>
                                      {j.addon_title}
                                    </Text>
                                    <Text
                                      style={
                                        isDarkMode
                                          ? [
                                              styles.cartItemWeight2,
                                              {
                                                color: MyDarkTheme.colors.text,
                                              },
                                            ]
                                          : styles.cartItemWeight2
                                      }
                                      numberOfLines={
                                        1
                                      }>{`(${j.option_title})`}</Text>
                                    <Text
                                      style={
                                        isDarkMode
                                          ? [
                                              styles.cartItemWeight2,
                                              {
                                                color: MyDarkTheme.colors.text,
                                              },
                                            ]
                                          : [
                                              styles.cartItemWeight2,
                                              {color: colors.textGrey},
                                            ]
                                      }
                                      numberOfLines={1}>
                                      {' '}
                                      {tokenConverterPlusCurrencyNumberFormater(
                                        Number(j.price) * Number(j.multiplier),
                                        digit_after_decimal,
                                        additional_preferences,
                                        currencies?.primary_currency?.symbol,
                                      )}
                                    </Text>
                                  </View>
                                );
                              })
                            : null}
                        </View>

                        <View
                          style={{
                            flex: 0.5,
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text style={styles.cartItemPrice}>
                            {tokenConverterPlusCurrencyNumberFormater(
                              Number(i?.variants?.quantity_price),
                              digit_after_decimal,
                              additional_preferences,
                              currencies?.primary_currency?.symbol,
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.dashedLine} />
                </View>
              );
            })
          : null}

        {item?.isDeliverable ? null : (
          <View style={{marginHorizontal: moderateScale(10)}}>
            <Text
              style={{
                fontSize: moderateScale(12),
                fontFamily: fontFamily.medium,
                color: colors.redFireBrick,
              }}>
              {strings.ITEM_NOT_DELIVERABLE}
            </Text>
          </View>
        )}

        {/* offerview */}
        <TouchableOpacity
          disabled={item?.couponData ? true : false}
          onPress={() => _getAllOffers(item.vendor, cartData)}
          style={styles.offersViewB}>
          {item?.couponData ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{flex: 0.7, flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{tintColor: themeColors.primary_color}}
                  source={imagePath.percent}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                  {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                {/* <Image source={imagePath.crossBlueB}  /> */}
                <Text
                  onPress={() => _removeCoupon(item, cartData)}
                  style={[styles.removeCoupon, {color: colors.cartItemPrice}]}>
                  {strings.REMOVE}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{tintColor: themeColors.primary_color}}
                source={imagePath.percent}
              />
              <Text
                style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                {strings.APPLY_PROMO_CODE}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {!!item?.discount_amount && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.DISCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                  : styles.priceItemLabel
              }>{`- ${tokenConverterPlusCurrencyNumberFormater(
              Number(item?.discount_amount ? item?.discount_amount : 0),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
          </View>
        )}
        {!!item?.deliver_charge && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.DELIVERY_CHARGES}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(item?.deliver_charge ? item?.deliver_charge : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </View>
        )}
        <View style={styles.itemPriceDiscountTaxView}>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                    },
                  ]
                : styles.priceItemLabel2
            }>
            {strings.AMOUNT}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                    },
                  ]
                : styles.priceItemLabel2
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(item?.payable_amount ? item?.payable_amount : 0),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      </View>
    );
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: type,
        selectedId: id,
      });
    } else {
      actions.setAppSessionData('on_login');
    }
  };
  const setModalVisibleForAddessModal = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({isVisible: false});
      setTimeout(() => {
        updateState({
          updateData: data,
          isVisibleAddressModal: visible,
          type: type,
          selectedId: id,
        });
      }, 1000);
    } else {
      actions.setAppSessionData('on_login');
    }
  };

  const selectedTip = (tip) => {
    if (selectedTipvalue == 'custom') {
      updateState({selectedTipvalue: tip, selectedTipAmount: null});
    } else {
      if (selectedTipvalue && selectedTipvalue?.value == tip?.value) {
        updateState({selectedTipvalue: null, selectedTipAmount: null});
      } else {
        updateState({selectedTipvalue: tip, selectedTipAmount: tip?.value});
      }
    }
  };

  // const onPressPickUplater = () => {
  //   updateState({
  //     isVisibleTimeModal: true,
  //   });
  // };
  //Footer section in cart screen

  const getFooter = () => {
    return (
      <>
        {/* Price section */}
        <View style={styles.priceSection}>
          <View style={[styles.bottomTabLableValue]}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {strings.SUBTOTAL}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel
              }>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.gross_paybale_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </View>
          {!!cartData?.wallet_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.WALLET}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(cartData?.wallet_amount ? cartData?.wallet_amount : 0),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
            </View>
          )}
          {!!cartData?.loyalty_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.LOYALTY}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>{`-${tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.loyalty_amount ? cartData?.loyalty_amount : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}`}</Text>
            </View>
          )}

          {!!cartData?.wallet_amount_used && (
            <View style={styles.bottomTabLableValue}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.WALLET}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>{`-${tokenConverterPlusCurrencyNumberFormater(
                Number(
                  cartData?.wallet_amount_used
                    ? cartData?.wallet_amount_used
                    : 0,
                ),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}`}</Text>
            </View>
          )}
          {!!cartData?.total_subscription_discount && (
            <View style={styles.bottomTabLableValue}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.TOTALSUBSCRIPTION}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>{`-${tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_subscription_discount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}`}</Text>
            </View>
          )}

          {/* {!!cartData?.total_discount_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text style={styles.priceItemLabel}>
                {strings.TOTAL_DISCOUNT}
              </Text>
              <Text style={styles.priceItemLabel}>{`-${
                currencies?.primary_currency?.symbol
              }${Number(cartData?.total_discount_amount).toFixed( appData?.profile?.preferences?.digit_after_decimal)}`}</Text>
            </View>
          )} */}

          {!!cartData?.tip &&
            cartData?.tip.length &&
            Number(cartData?.total_payable_amount) != 0 && (
              <View
                style={[
                  styles.bottomTabLableValue,
                  {flexDirection: 'column', marginTop: 20},
                ]}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.priceTipLabel, {color: MyDarkTheme.colors.text}]
                      : [styles.priceTipLabel]
                  }>
                  {strings.DOYOUWANTTOGIVEATIP}
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {cartData?.tip.map((j, jnx) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.tipArrayStyle,
                          {
                            backgroundColor:
                              selectedTipvalue?.value == j?.value
                                ? themeColors.primary_color
                                : 'transparent',
                          },
                        ]}
                        onPress={() => selectedTip(j)}>
                        <Text
                          style={
                            isDarkMode
                              ? {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : MyDarkTheme.colors.text,
                                }
                              : {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : colors.black,
                                }
                          }>
                          {tokenConverterPlusCurrencyNumberFormater(
                            j.value,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                          )}
                        </Text>
                        <Text
                          style={{
                            color:
                              selectedTipvalue?.value == j?.value
                                ? colors.white
                                : colors.textGreyB,
                          }}>
                          {j.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    style={[
                      styles.tipArrayStyle2,
                      {
                        backgroundColor:
                          selectedTipvalue == 'custom'
                            ? themeColors.primary_color
                            : 'transparent',
                      },
                    ]}
                    onPress={() => selectedTip('custom')}>
                    <Text
                      style={
                        isDarkMode
                          ? {
                              color:
                                selectedTipvalue == 'custom'
                                  ? colors.white
                                  : MyDarkTheme.colors.text,
                            }
                          : {
                              color:
                                selectedTipvalue == 'custom'
                                  ? colors.white
                                  : colors.black,
                            }
                      }>
                      {strings.CUSTOM}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>

                {!!selectedTipvalue && selectedTipvalue == 'custom' && (
                  <View
                    style={{
                      borderRadius: 5,
                      borderWidth: 0.5,
                      borderColor: colors.textGreyB,
                      height: 40,
                    }}>
                    <TextInput
                      value={selectedTipAmount}
                      onChangeText={(text) =>
                        updateState({selectedTipAmount: text})
                      }
                      style={{
                        height: 40,
                        alignItems: 'center',
                        paddingHorizontal: 10,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGreyOpcaity7,
                      }}
                      maxLength={5}
                      returnKeyType={'done'}
                      keyboardType={'number-pad'}
                      placeholder={strings.ENTER_CUSTOM_AMOUNT}
                      placeholderTextColor={
                        isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGreyOpcaity7
                      }
                    />
                  </View>
                )}
              </View>
            )}

          {!!cartData?.total_tax && (
            <View style={styles.bottomTabLableValue}>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {strings.TAX_AMOUNT}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.priceItemLabel, {color: MyDarkTheme.colors.text}]
                    : styles.priceItemLabel
                }>
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(cartData?.total_tax ? cartData?.total_tax : 0),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
            </View>
          )}

          <View style={styles.amountPayable}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel2, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel2
              }>
              {strings.AMOUNT_PAYABLE}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel2, {color: MyDarkTheme.colors.text}]
                  : styles.priceItemLabel2
              }>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_payable_amount) +
                  (selectedTipAmount != null && selectedTipAmount != ''
                    ? Number(selectedTipAmount)
                    : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </View>
        </View>

        {/* Add instruction */}
        {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.addInstruction}>{strings.ADD_INSTRUCTIONS}</Text>
        </View> */}
        <View style={{height: moderateScaleVertical(20)}} />

        <View style={{height: 2}} />
        {/* select payment method */}
        <TouchableOpacity
          onPress={() =>
            !!userData?.auth_token
              ? moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS, {
                  screenName: strings.PAYMENT,
                })()
              : showError(strings.UNAUTHORIZED_MESSAGE)
          }
          style={
            isDarkMode
              ? [
                  styles.paymentMainView,
                  {
                    justifyContent: 'space-between',
                    backgroundColor: MyDarkTheme.colors.lightDark,
                  },
                ]
              : [styles.paymentMainView, {justifyContent: 'space-between'}]
          }>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
              source={imagePath.paymentMethod}
            />
            <Text
              style={
                isDarkMode
                  ? [styles.selectedMethod, {color: MyDarkTheme.colors.text}]
                  : styles.selectedMethod
              }>
              {selectedPayment.title_lng
                ? selectedPayment.title_lng
                : selectedPayment.title
                ? selectedPayment.title
                : strings.SELECT_PAYMENT_METHOD}
            </Text>
          </View>
          <View>
            <Image
              source={imagePath.goRight}
              style={
                isDarkMode
                  ? {
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                      tintColor: MyDarkTheme.colors.text,
                    }
                  : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
              }
            />
          </View>
        </TouchableOpacity>

        {/* {payment submit button} */}
        {userData ? (
          <View
            style={{
              flexDirection: 'row',
              marginVertical: moderateScaleVertical(20),
              marginHorizontal: moderateScale(10),
            }}>
            {selectedTimeOptions.map((i, inx) => {
              return (
                <TouchableOpacity
                  onPress={() => _selectTime(i)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor:
                      selectedTimeOption && selectedTimeOption?.id == i.id
                        ? themeColors?.primary_color
                        : getColorCodeWithOpactiyNumber(
                            themeColors.primary_color.substr(1),
                            20,
                          ),
                    borderColor: themeColors.primary_color,
                    borderWidth:
                      selectedTimeOption && selectedTimeOption?.id == i.id
                        ? 1
                        : 0,
                    borderRadius: 10,
                    marginRight: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.medium,
                      color:
                        selectedTimeOption && selectedTimeOption?.id == i.id
                          ? colors.white
                          : themeColors.primary_color,
                    }}>
                    {i.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <View
              style={{
                justifyContent: 'center',
              }}>
              {selectedTimeOption?.type === 'now' ? null : (
                <Text style={isDarkMode && {color: MyDarkTheme.colors.text}}>
                  {sheduledorderdate && scheduleType
                    ? `${moment(sheduledorderdate).format('DD MMM,YYYY HH:mm')}`
                    : null}
                </Text>
              )}
            </View>
          </View>
        ) : null}

        {!!cartData?.deliver_status && (
          <View style={styles.paymentView}>
            <ButtonComponent
              onPress={() => {
                placeOrder();
              }}
              btnText={strings.PLACE_ORDER}
              borderRadius={moderateScale(13)}
              textStyle={{color: '#fff'}}
              containerStyle={styles.placeOrderButtonStyle}
            />
          </View>
        )}
        <View
          style={{
            height: moderateScaleVertical(65),
            backgroundColor: colors.transparent,
          }}></View>
      </>
    );
  };

  //Header section of cart screen
  const getHeader = () => {
    return (
      <>
        {vendorAddress ? (
          <View
            style={{
              height: isTableDropDown
                ? moderateScaleVertical(190)
                : moderateScaleVertical(120),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: moderateScale(20),
                marginTop: moderateScaleVertical(10),
              }}>
              <Image
                style={
                  isDarkMode
                    ? {tintColor: MyDarkTheme.colors.text}
                    : {tintColor: colors.black}
                }
                source={imagePath.locationGreen}
              />
              <Text
                numberOfLines={1}
                style={
                  isDarkMode
                    ? [
                        styles.deliveryLocationAndTime,
                        {color: MyDarkTheme.colors.text},
                      ]
                    : styles.deliveryLocationAndTime
                }>
                {strings.ADDRESS}:
              </Text>
              <Text
                numberOfLines={1}
                style={
                  isDarkMode
                    ? [styles.address, {color: MyDarkTheme.colors.text}]
                    : styles.address
                }>
                {vendorAddress}
              </Text>
            </View>
            <View style={styles.clearCartView}>
              <TouchableOpacity onPress={() => openClearCartModal()}>
                <Text style={styles.clearCart}>{strings.CLEARCART}</Text>
              </TouchableOpacity>
            </View>

            {dineInType === 'dine_in' &&
              userData?.auth_token &&
              cartData?.vendor_details?.vendor_tables && (
                <DropDownPicker
                  items={tableData}
                  onOpen={() => updateState({isTableDropDown: true})}
                  onClose={() => updateState({isTableDropDown: false})}
                  defaultValue={
                    deepLinkUrl
                      ? deepLinkUrl == 1
                        ? tableData[0]?.label
                        : tableData[1]?.label
                      : defaultSelectedTable || tableData[0]?.label || ''
                  }
                  containerStyle={{
                    height: 40,
                    marginTop: moderateScaleVertical(10),
                  }}
                  style={{
                    marginHorizontal: moderateScale(20),
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : '#fafafa',
                  }}
                  labelStyle={
                    isDarkMode
                      ? {color: MyDarkTheme.colors.text}
                      : {color: colors.textGrey}
                  }
                  itemStyle={{
                    justifyContent: 'flex-start',
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                  }}
                  dropDownStyle={{
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : '#fafafa',
                    height: 80,
                    width: width - moderateScale(40),
                    alignSelf: 'center',
                  }}
                  onChangeItem={(item) => _onTableSelection(item)}
                />
              )}
          </View>
        ) : (
          <>
            <View style={[styles.topLable, {marginTop: moderateScale(20)}]}>
              <View
                style={{
                  flex: 0.35,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  style={
                    isDarkMode
                      ? {tintColor: MyDarkTheme.colors.text}
                      : {tintColor: colors.black}
                  }
                  source={imagePath.locationGreen}
                />
                <Text
                  numberOfLines={1}
                  style={
                    isDarkMode
                      ? [
                          styles.deliveryLocationAndTime,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.deliveryLocationAndTime
                  }>
                  {strings.DELIVERYAT}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  flex: 0.7,
                  // flexWrap: 'wrap',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => setModalVisible(true)}>
                <Text numberOfLines={1} style={styles.address}>
                  {selectedAddressData
                    ? selectedAddressData?.address
                    : strings.ADD_ADDRESS}
                </Text>
              </TouchableOpacity>
            </View>
            {/* clear cart  */}
            <View style={styles.clearCartView}>
              <TouchableOpacity onPress={() => openClearCartModal()}>
                <Text style={styles.clearCart}>{strings.CLEARCART}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </>
    );
  };

  //Native modal for Modal
  const openClearCartModal = () => {
    Alert.alert('', strings.AREYOUSURE, [
      {
        text: strings.CANCEL,
        onPress: () => {},
        // style: 'destructive',
      },
      {text: strings.CONFIRM, onPress: () => bottomButtonClick()},
    ]);
  };
  //SelectAddress
  const selectAddress = (address) => {
    if (!!userData?.auth_token) {
      updateState({isLoadingB: true});
      let data = {};
      let query = `/${address?.id}`;
      actions
        .setPrimaryAddress(query, data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          actions.saveAddress(address);
          updateState({
            isVisible: false,
            isLoadingB: false,
            selectedAddress: address,
          });
        })
        .catch((error) => {
          updateState({isLoadingB: false});
          showError(error?.message || error?.error);
        });
    }
  };

  //Add and update the addreess
  const addUpdateLocation = (childData) => {
    // setModalVisible(false);
    updateState({isLoading: true});
    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
        });
        getAllAddress();
        setTimeout(() => {
          let address = res.data;
          address['is_primary'] = 1;

          updateState({
            selectedAddress: address,
          });
          actions.saveAddress(address);
        });

        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isVisible: false,
          isVisibleAddressModal: false,
        });
        showError(error?.message || error?.error);
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  const onClose = () => {
    updateState({
      isVisibleTimeModal: false,
    });
  };

  const onDateChange = (value) => {
    // console.log(value, 'value');
    // _onDateChange(value);
    updateState({
      sheduledorderdate: value,
    });
  };

  useEffect(() => {
    getItem('deepLinkUrl')
      .then((res) => {
        if (res) {
          let table_number = getParameterByName('table', res);
          console.log(res, 'table_number');
          updateState({deepLinkUrl: table_number});
        }
      })
      .catch((error) => {
        showError(error.message);
      });
  }, []);

  const _onTableSelection = (item) => {
    const data = {
      vendor_id: item.id,
      table: item.table_number,
    };
    actions
      .vendorTableCart(data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        removeItem('deepLinkUrl');
        setItem('selectedTable', item?.label);
      })
      .catch((error) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
        });
        showError(error?.message || error?.error);
      });
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoadingB}>
      {<HeaderWithFilters centerTitle={strings.CART} noLeftIcon={true} />}

      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <View
        style={
          isDarkMode
            ? [
                styles.mainComponent,
                {backgroundColor: MyDarkTheme.colors.background},
              ]
            : styles.mainComponent
        }>
        <FlatList
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems?.length ? getHeader() : null}
          ListFooterComponent={cartItems?.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: colors.backgroundGrey}}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItem}
          ListEmptyComponent={() => (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <LottieView
                source={loaderSix}
                autoPlay
                loop
                style={{
                  height: moderateScaleVertical(100),
                  width: moderateScale(100),
                }}
              />
              <Text
                style={[
                  styles.textStyle,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  },
                ]}>
                {strings.NOPRODUCTCART}
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
          }}
        />
      </View>
      {!!isModalVisibleForClearCart && (
        <ConfirmationModal
          closeModal={() => closeOptionModal()}
          ShowModal={isModalVisibleForClearCart}
          showBottomButton={true}
          mainText={strings.AREYOUSURE}
          bottomButtonClick={bottomButtonClick}
          updateStatus={(item) => updateStatus(item)}
        />
      )}
      <ChooseAddressModal
        isVisible={isVisible}
        onClose={() => setModalVisible(false)}
        openAddressModal={() =>
          setModalVisibleForAddessModal(true, 'addAddress')
        }
        selectAddress={(data) => selectAddress(data)}
        selectedAddress={selectedAddressData}
      />
      <AddressModal
        isVisible={isVisibleAddressModal}
        onClose={() => setModalVisibleForAddessModal(false)}
        type={type}
        passLocation={(data) => addUpdateLocation(data)}
      />

      {/* Date time modal */}
      <Modal
        transparent={true}
        isVisible={isVisibleTimeModal}
        animationType={'none'}
        style={styles.modalContainer}
        onLayout={(event) => {
          updateState({viewHeight: event.nativeEvent.layout.height});
        }}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image
            style={isDarkMode && {tintColor: MyDarkTheme.colors.white}}
            source={imagePath.crossB}
          />
        </TouchableOpacity>
        <View
          style={
            isDarkMode
              ? [
                  styles.modalMainViewContainer,
                  {backgroundColor: MyDarkTheme.colors.lightDark},
                ]
              : styles.modalMainViewContainer
          }>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={
              isDarkMode
                ? [
                    styles.modalMainViewContainer,
                    {backgroundColor: MyDarkTheme.colors.lightDark},
                  ]
                : styles.modalMainViewContainer
            }>
            <View
              style={{
                // flex: 0.6,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text
                style={
                  isDarkMode
                    ? [styles.carType, {color: MyDarkTheme.colors.text}]
                    : styles.carType
                }>
                {strings.SELECTDATEANDTIME}
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                height: height / 3.5,
              }}>
              <DatePicker
                locale={selectedLanguage}
                date={
                  sheduledorderdate ? new Date(sheduledorderdate) : new Date()
                }
                textColor={isDarkMode ? '#fff' : colors.blackB}
                mode="datetime"
                minimumDate={new Date()}
                maximumDate={undefined}
                style={styles.datetimePickerText}
                // onDateChange={setDate}
                onDateChange={(value) => onDateChange(value)}
              />
            </View>
          </ScrollView>
          <View
            style={[
              styles.bottomAddToCartView,
              {top: viewHeight - height / 6},
            ]}>
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
        </View>
      </Modal>
    </WrapperContainer>
  );
}
