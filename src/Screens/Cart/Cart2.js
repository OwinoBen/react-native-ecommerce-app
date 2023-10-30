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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import DashedLine from 'react-native-dashed-line';
import DatePicker from 'react-native-date-picker';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import AddressModal2 from '../../Components/AddressModal2';
import ButtonComponent from '../../Components/ButtonComponent';
import ChooseAddressModal from '../../Components/ChooseAddressModal';
import ConfirmationModal from '../../Components/ConfirmationModal';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
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
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function Cart2({navigation, route}) {
  let paramsData = route?.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    isVisible: false,
    isVisibleTimeModal: false,
    cartItems: [],
    cartData: {},
    isLoadingB: false,
    isModalVisibleForClearCart: false,
    isVisibleAddressModal: false,
    type: '',
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
    selectedTimeOptions: [
      {id: 1, title: strings.NOW, type: 'now'},
      {id: 2, title: strings.SCHEDULE_ORDER, type: 'schedule'},
    ],
    selectedTimeOption: null,
    sheduledorderdate: null,
    scheduleType: null,
    viewHeight: 0,
  });
  const {
    isLoading,
    cartItems,
    isVisibleTimeModal,
    cartData,
    isLoadingB,
    isModalVisibleForClearCart,
    isVisibleAddressModal,
    isVisible,
    type,
    selectedAddress,
    selectedPayment,
    isRefreshing,
    selectedTipvalue,
    selectedTipAmount,
    selectedTimeOptions,
    selectedTimeOption,
    sheduledorderdate,
    scheduleType,
    viewHeight,
  } = state;

  //Redux store data
  const userData = useSelector((state) => state?.auth?.userData);
  const dineInType = useSelector((state) => state?.home?.dineInType);
  const {appData, allAddresss, themeColors, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  const selectedLanguage = languages?.primary_language?.sort_code;

  const fontFamily = appStyle?.fontSizeData;
  // const styles = stylesFun({fontFamily, themeColors});
  const styles = stylesFunc({fontFamily, themeColors});

  const selectedAddressData = useSelector(
    (state) => state?.cart?.selectedAddress,
  );
  //Update states on screens
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  // styles funcation
  // const fontFamily = appStyle?.fontSizeData;
  // const styles = stylesFun({fontFamily, themeColors});

  //On focus fucntion
  useFocusEffect(
    React.useCallback(() => {
      if (paramsData && paramsData?.selectedMethod) {
        updateState({selectedPayment: paramsData?.selectedMethod});
      }
      checkforAddressUpdate();
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
      }
    }
    if (selectedAddress && allAddresss.length) {
      let find = allAddresss.find((x) => x.id == selectedAddress.id);
      if (find) {
      } else {
        updateState({selectedAddress: null});
        actions.saveAddress(null);
      }
    }
  };

  //get All address
  const getAllAddress = () => {
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
        },
      )
      .then((res) => {
        console.log(res, 'res>>>');
        actions.cartItemQty(res);
        updateState({isLoadingB: false, isRefreshing: false});
        if (res && res.data) {
          updateState({
            cartItems: res.data.products,
            cartData: res.data,
            selectedTimeOption:
              res?.data?.schedule_type == 'now'
                ? {id: 1, title: strings.NOW, type: 'now'}
                : res?.data?.schedule_type == 'schedule'
                ? {id: 2, title: strings.SCHEDULE_ORDER, type: 'schedule'}
                : {id: 1, title: strings.NOW, type: 'now'},
          });
        }
      })
      .catch(errorMethod);
  };

  //add /delete products from cart
  const addDeleteCartItems = (item, index, type) => {
    let quanitity = null;
    let itemToUpdate = cloneDeep(item);
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
      removeProductFromCart(itemToUpdate);
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (item) => {
    let data = {};
    data['cart_id'] = item?.cart_id;
    data['cart_product_id'] = item?.id;
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

  //Clear cart
  const placeOrder = () => {
    if (!!userData?.auth_token) {
      if (!selectedAddressData) {
        // showError(strings.PLEASE_SELECT_ADDRESS);
        setModalVisible(true);
      } else if (!selectedPayment) {
        showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
      } else {
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
        `/${selectedMethod}?amount=${cartData?.total_payable_amount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&address_id=${selectedAddressData?.id}&payment_option_id=${selectedPayment?.id}&action=cart`,
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
          `/${selectedMethod}?amount=${cartData?.total_payable_amount}&auth_token=${userData?.auth_token}&address_id=${selectedAddressData?.id}&payment_option_id=${selectedPayment?.id}&action=cart&stripe_token=${paramsData?.tokenInfo}`,
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
      showError(
        'You have not added the cart detail for the selected payment method',
      );
    }
  };

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
  const onDateChange = (value) => {
    // console.log(value, 'value');
    // _onDateChange(value);
    updateState({
      sheduledorderdate: value,
    });
  };

  useEffect(() => {
    // console.log(scheduleType, 'scheduleType scheduleType');
    if (scheduleType != null && scheduleType == 'now') {
      setDateAndTimeSchedule();
    }
  }, [scheduleType]);

  const selectOrderDate = () => {
    onClose();
    updateState({
      scheduleType: 'schedule',
    });
    setDateAndTimeSchedule();
  };

  const onClose = () => {
    updateState({
      isVisibleTimeModal: false,
    });
  };

  const setDateAndTimeSchedule = () => {
    console.log(scheduleType, 'scheduleType>>>updated');
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
        console.log(res, 'response');
        updateState({
          isLoadingB: false,
        });
      })
      .catch(errorMethod);
  };

  //render cart item and cart detail
  const _renderItem = ({item, index}) => {
    // return <OffersCard />;

    let {itemCount} = state;
    return (
      <>
        <View style={styles.mainContainer}>
          <View style={{flexDirection: 'column'}}>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.vendorText, {color: MyDarkTheme.colors.text}]
                  : styles.vendorText
              }>
              {item?.vendor?.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fontFamily.regular,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyF,
                marginTop: moderateScale(8),
              }}>
              Westheimer Road · 2.9 kms
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fontFamily.regular,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyF,
                marginVertical: moderateScale(2),
              }}>
              German · Continental
            </Text>
          </View>
          <View>
            <FastImage
              source={{
                uri: getImageUrl(
                  item?.vendor?.banner?.proxy_url,
                  item?.vendor?.banner?.image_path,
                  '300/300',
                ),
                priority: FastImage.priority.high,
              }}
              style={styles.cartVendorImage}
            />
          </View>
        </View>

        <View style={{marginHorizontal: moderateScale(20)}}>
          {item?.vendor_products.length
            ? item?.vendor_products.map((i, inx) => {
                return (
                  <View>
                    <View style={styles.cartCountView}>
                      <View style={{flex: 0.5}}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.cartItemTitle,
                            {
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                            },
                          ]}>
                          {i?.product?.translation[0]?.title}
                        </Text>
                        {i?.variant_options.length
                          ? i?.variant_options.map((j, jnx) => {
                              return (
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={[
                                      styles.cartItemWeight2,
                                      {
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.textGreyB,
                                      },
                                    ]}
                                    numberOfLines={1}>
                                    {j.title}{' '}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.cartItemWeight2,
                                      {
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.textGreyB,
                                      },
                                    ]}
                                    numberOfLines={1}>
                                    {`(${j.option})`}
                                  </Text>
                                </View>
                              );
                            })
                          : null}
                      </View>

                      <View style={{flex: 0.3, justifyContent: 'center'}}>
                        <View style={styles.cartAddRemoveView}>
                          <TouchableOpacity
                            style={{flex: 0.3, alignItems: 'center'}}
                            onPress={() => addDeleteCartItems(i, inx, 2)}>
                            <Text style={styles.countViewItems}>-</Text>
                          </TouchableOpacity>
                          <View style={{flex: 0.4, alignItems: 'center'}}>
                            <Text
                              style={[
                                styles.countViewItems,
                                {fontSize: textScale(12)},
                              ]}>
                              {i?.quantity}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={{flex: 0.3, alignItems: 'center'}}
                            onPress={() => addDeleteCartItems(i, inx, 1)}>
                            <Text style={styles.countViewItems}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View
                        style={{
                          flex: 0.25,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.itemPriceText,
                            {
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                            },
                          ]}>
                          {tokenConverterPlusCurrencyNumberFormater(
                            Number(i?.variants?.quantity_price),
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                          )}
                        </Text>
                      </View>
                    </View>

                    {!!i?.product_addons.length && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: moderateScale(10),
                        }}>
                        <Text
                          style={[
                            styles.cartItemWeight2,
                            {
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.textGreyB,
                            },
                          ]}>
                          {strings.EXTRA}
                        </Text>
                        {i?.product_addons.length
                          ? i?.product_addons.map((j, jnx) => {
                              return (
                                <View style={{flexDirection: 'row'}}>
                                  <Text
                                    style={[
                                      styles.cartItemWeight2,
                                      {
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.textGreyB,
                                      },
                                    ]}
                                    numberOfLines={1}>
                                    {j.addon_title}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.cartItemWeight2,
                                      {
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.textGreyB,
                                      },
                                    ]}
                                    numberOfLines={
                                      1
                                    }>{`(${j.option_title})`}</Text>
                                  <Text
                                    style={[
                                      styles.cartItemWeight2,
                                      {
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.textGrey,
                                      },
                                    ]}
                                    numberOfLines={
                                      1
                                    }>{` ${tokenConverterPlusCurrencyNumberFormater(
                                    Number(j.price) * Number(j.multiplier),
                                    appData?.profile?.preferences
                                      ?.digit_after_decimal,
                                    digit_after_decimal,
                                    additional_preferences,
                                    currencies?.primary_currency?.symbol,
                                  )} `}</Text>
                                </View>
                              );
                            })
                          : null}
                      </View>
                    )}
                  </View>
                );
              })
            : null}
        </View>

        <TouchableOpacity
          disabled={item?.couponData ? true : false}
          onPress={() => _getAllOffers(item.vendor, cartData)}
          activeOpacity={0.7}
          style={styles.applyPromoBtn}>
          {item?.couponData ? (
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: themeColors.primary_color,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(12),
                }}>
                {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
              </Text>
              <Text
                onPress={() => _removeCoupon(item, cartData)}
                style={[
                  styles.removeCoupon,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.cartItemPrice,
                  },
                ]}>
                {strings.REMOVE}
              </Text>
            </View>
          ) : (
            <Text style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
              {strings.APPLY_PROMO_CODE}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.itemPriceDiscountTaxView}>
          {!!item?.discount_amount && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={[
                  styles.priceItemLabel,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  },
                ]}>
                {strings.DISCOUNT}
              </Text>
              <Text
                style={[
                  styles.priceItemLabel,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  },
                ]}>{`- ${tokenConverterPlusCurrencyNumberFormater(
                Number(item?.discount_amount ? item?.discount_amount : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}`}</Text>
            </View>
          )}
          {!!item?.deliver_charge && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={[
                  styles.priceItemLabel,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  },
                ]}>
                {strings.DELIVERY_CHARGES}
              </Text>
              <Text
                style={[
                  styles.priceItemLabel,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  },
                ]}>
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(item?.deliver_charge ? item?.deliver_charge : 0),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
            </View>
          )}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={[
                styles.priceItemLabel2,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey},
              ]}>
              {strings.AMOUNT}
            </Text>
            <Text
              style={[
                styles.priceItemLabel2,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey},
              ]}>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(item?.payable_amount ? item?.payable_amount : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </View>
        </View>
      </>
    );
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
        actions.saveAddress(res.data);
        getAllAddress();
        showSuccess(res.message);
        setTimeout(() => {
          updateState({
            selectedAddress: res.data,
          });
        }, 1000);
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

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: type,
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
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
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  //Footer section in cart screen
  const getFooter = () => {
    return (
      <>
        <View style={{marginHorizontal: moderateScale(20)}}>
          <TextInput
            multiline={true}
            numberOfLines={4}
            style={styles.instructionView}
            placeholderTextColor={
              isDarkMode ? colors.textGreyB : colors.textGreyB
            }
            placeholder={strings.ANY_RESTAURANT_REQUESTS}></TextInput>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: textScale(15),
              marginVertical: moderateScale(20),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {strings.ORDER_DETAIL}
          </Text>
          <View style={[styles.bottomTabLableValue]}>
            <Text
              style={[
                styles.totalTxts,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
              ]}>
              {strings.SUBTOTAL}
            </Text>
            <Text
              style={[
                styles.totalTxts,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
              ]}>
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
                style={[
                  styles.totalTxts,
                  {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
                ]}>
                {strings.WALLET}
              </Text>
              <Text
                style={[
                  styles.totalTxts,
                  {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
                ]}>
                {tokenConverterPlusCurrencyNumberFormater(
                  cartData?.wallet_amount ? cartData?.wallet_amount : 0,
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
                style={[
                  styles.totalTxts,
                  {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
                ]}>
                {strings.LOYALTY}
              </Text>
              <Text
                style={[
                  styles.totalTxts,
                  {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
                ]}>{`-${tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.loyalty_amount ? cartData?.loyalty_amount : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}`}</Text>
            </View>
          )}

          {!!cartData?.total_discount_amount && (
            <View style={styles.bottomTabLableValue}>
              <Text
                style={[
                  styles.totalTxts,
                  {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
                ]}>
                {strings.TOTAL_DISCOUNT}
              </Text>
              <Text
                style={[
                  styles.totalTxts,
                  {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
                ]}>{`-${tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_discount_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}`}</Text>
            </View>
          )}
          {!!cartData?.total_tax && (
            <View style={styles.bottomTabLableValue}>
              <Text
                style={[
                  styles.totalTxts,
                  {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
                ]}>
                {strings.TAX_AMOUNT}
              </Text>
              <Text
                style={[
                  styles.totalTxts,
                  {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
                ]}>{`${tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_tax ? cartData?.total_tax : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}`}</Text>
            </View>
          )}
          <View style={{height: 5}} />
          <DashedLine
            dashLength={5}
            dashThickness={0.5}
            dashGap={2}
            dashColor={colors.greyLight}
          />

          {!!cartData?.tip &&
            cartData?.tip.length &&
            Number(cartData?.total_payable_amount) != 0 && (
              <View
                style={[
                  styles.bottomTabLableValue,
                  {flexDirection: 'column', marginTop: 20},
                ]}>
                <Text
                  style={[
                    styles.priceTipLabel,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                    },
                  ]}>
                  {strings.DOYOUWANTTOGIVEATIP}
                </Text>

                <KeyboardAwareScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  enableOnAndroid={true}>
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
                                      : colors.textGreyB,
                                }
                          }>
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
                </KeyboardAwareScrollView>

                {!!selectedTipvalue && selectedTipvalue == 'custom' && (
                  <View
                    style={{
                      borderRadius: 5,
                      borderWidth: 0.5,
                      borderColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
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
                          : colors.black,
                      }}
                      maxLength={5}
                      returnKeyType={'done'}
                      keyboardType={'number-pad'}
                      placeholder={strings.ENTER_CUSTOM_AMOUNT}
                      placeholderTextColor={
                        isDarkMode ? MyDarkTheme.colors.text : colors.black
                      }
                    />
                  </View>
                )}
              </View>
            )}

          <View style={styles.amountPayable}>
            <Text
              style={[
                styles.totalTxts2,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
              ]}>
              {strings.AMOUNT_PAYABLE}
            </Text>
            <Text
              style={[
                styles.priceItemLabel3,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey},
              ]}>
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
        <View style={{height: moderateScaleVertical(40)}} />

        <TouchableOpacity
          onPress={() =>
            !!userData?.auth_token
              ? moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS)()
              : showError(strings.UNAUTHORIZED_MESSAGE)
          }
          style={[
            styles.paymentMainView,
            {
              justifyContent: 'space-between',
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
              source={imagePath.paymentMethod}
            />
            <Text
              style={[
                styles.selectedMethod,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey},
              ]}>
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
              style={{
                transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            />
          </View>
        </TouchableOpacity>

        {/* {payment submit button} */}

        <View
          style={{
            flexDirection: 'row',
            marginVertical: moderateScaleVertical(20),
            marginHorizontal: moderateScale(20),
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
              <Text>
                {sheduledorderdate && scheduleType
                  ? `${moment(sheduledorderdate).format('DD MMM,YYYY HH:mm')}`
                  : null}
              </Text>
            )}
          </View>
        </View>

        <View
          style={{
            marginHorizontal: moderateScale(20),
            marginTop:
              Platform.OS === 'ios'
                ? moderateScaleVertical(15)
                : moderateScaleVertical(25),
            marginBottom: moderateScaleVertical(110),
          }}>
          <ButtonComponent
            onPress={() => placeOrder()}
            btnText={strings.PLACE_ORDER}
            borderRadius={moderateScale(15)}
            textStyle={{color: '#fff'}}
            containerStyle={{
              backgroundColor: themeColors.primary_color,
              width: '100%',
            }}
          />
        </View>
      </>
    );
  };

  //Header section of cart screen
  const getHeader = () => {
    return (
      <>
        {/* Delivery Location */}
        <View style={[styles.topLable, {marginTop: moderateScale(20)}]}>
          <View
            style={{flex: 0.35, flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{tintColor: colors.black}}
              source={imagePath.locationGreen}
            />
            <Text numberOfLines={1} style={styles.deliveryLocationAndTime}>
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
    );
  };

  const selectedTip = (tip) => {
    console.log(tip, 'tip >>>ITEM');

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

  //Native modal for Modal
  const openClearCartModal = () => {
    Alert.alert('', strings.AREYOUSURE, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      {text: strings.CONFIRM, onPress: () => bottomButtonClick()},
    ]);
  };
  //SelectAddress
  const selectAddress = (address) => {
    actions.saveAddress(address);
    updateState({
      isVisible: false,
      selectedAddress: address,
    });
  };
  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      source={loaderOne}
      isLoadingB={isLoadingB}>
      <Header
        centerTitle={strings.CART}
        leftIcon={imagePath.backArrow}
        isRightText={cartItems && cartItems?.length}
        onPressRightTxt={() => openClearCartModal()}
      />
      <View style={{height: 1, backgroundColor: colors.borderColorD}} />
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
          // ListHeaderComponent={cartItems?.length ? getHeader() : null}
          ListFooterComponent={cartItems?.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.backgroundGrey,
          }}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItem}
          ListEmptyComponent={() => (
            <>
              {!isLoadingB && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <LottieView
                    source={loaderSix}
                    autoPlay
                    loop
                    style={{
                      height: moderateScaleVertical(100),
                      width: moderateScale(100),
                    }}
                  />
                  <Text style={styles.textStyle}>{strings.NOPRODUCTCART}</Text>
                </View>
              )}
            </>
          )}
          // style={{flex: 1}}
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
      <AddressModal2
        isVisible={isVisibleAddressModal}
        onClose={() => setModalVisibleForAddessModal(false)}
        passLocation={(data) => addUpdateLocation(data)}
        type={type}
      />

      <Modal
        transparent={true}
        isVisible={isVisibleTimeModal}
        animationType={'none'}
        style={styles.modalContainer}
        onLayout={(event) => {
          updateState({viewHeight: event.nativeEvent.layout.height});
        }}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image source={imagePath.crossB} />
        </TouchableOpacity>
        <View style={styles.modalMainViewContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.modalMainViewContainer}>
            <View
              style={{
                // flex: 0.6,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10,
              }}>
              <Text style={styles.carType}>{strings.SELECTDATEANDTIME}</Text>
            </View>

            <View style={{alignItems: 'center', height: height / 3.5}}>
              <DatePicker
                locale={selectedLanguage}
                date={
                  sheduledorderdate ? new Date(sheduledorderdate) : new Date()
                }
                mode="datetime"
                minimumDate={new Date()}
                maximumDate={undefined}
                style={{width: width - 20, height: height / 3.5}}
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

export function stylesFunc({fontFamily, themeColors}) {
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      marginHorizontal: moderateScale(20),
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(20),
    },
    cartVendorImage: {
      height: moderateScale(80),
      width: moderateScale(80),
      borderRadius: moderateScale(15),
    },
    cartCountView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: moderateScaleVertical(5),
    },
    cartItemTitle: {
      opacity: 0.8,
      color: colors.black,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    cartAddRemoveView: {
      borderRadius: moderateScale(15),
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingVertical: moderateScaleVertical(3),
      borderWidth: 1,
      borderColor: colors.borderColorD,
      alignItems: 'center',
    },
    countViewItems: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(20),
      color: themeColors.primary_color,
    },
    itemPriceText: {
      fontFamily: fontFamily.medium,
      color: colors.black,
      fontSize: textScale(14),
      marginVertical: moderateScaleVertical(8),
    },
    applyPromoBtn: {
      marginHorizontal: moderateScale(15),
      borderRadius: moderateScale(15),
      borderWidth: 1,
      borderColor: colors.borderColorD,
      paddingVertical: moderateScaleVertical(15),
      paddingHorizontal: moderateScaleVertical(10),
      marginVertical: moderateScaleVertical(10),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    instructionView: {
      height: moderateScale(80),
      borderRadius: moderateScale(15),
      backgroundColor: colors.borderColorD,
      marginVertical: moderateScaleVertical(10),
      padding: moderateScale(10),
    },
    totalTxts: {
      color: colors.black,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    totalTxts2: {
      color: colors.black,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    topLable: {
      flexDirection: 'row',
      paddingHorizontal: moderateScale(10),
    },
    deliveryLocationAndTime: {
      ...commonStyles.mediumFont14,
      color: colors.textGreyB,
    },
    clearCartView: {
      height: moderateScaleVertical(30),
      backgroundColor: getColorCodeWithOpactiyNumber(
        themeColors.primary_color.substr(1),
        20,
      ),
      marginTop: moderateScaleVertical(10),
      justifyContent: 'center',
      alignItems: 'center',
    },

    clearCart: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      color: themeColors.primary_color,
      opacity: 1,
      alignSelf: 'center',
    },
    vendorText: {
      ...commonStyles.futuraHeavyBt,
      marginRight: moderateScale(20),
      color: colors.blackB,
      opacity: 1,
    },

    viewOffers: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },
    removeCoupon: {
      color: colors.themeColor,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },

    price: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    priceItemLabelVat: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
    },
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    priceItemLabel3: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    addInstruction: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      textDecorationLine: 'underline',
    },
    selectedMethod: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      marginLeft: moderateScale(10),
    },
    paymentMainView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: moderateScaleVertical(20),
      paddingHorizontal: moderateScale(5),
      paddingVertical: moderateScaleVertical(10),
      borderRadius: moderateScale(15),
      backgroundColor: colors.lightGreyBgB,
    },

    // cart item design start from here
    cartItemMainContainer: {
      flexDirection: 'row',
      paddingVertical: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(10),
      backgroundColor: colors.white,
    },
    cartItemImage: {
      height: width / 4.5,
      width: width / 4.5,
      backgroundColor: colors.white,
    },
    cartItemName: {
      fontSize: textScale(15),
      fontFamily: fontFamily.bold,
      marginTop: moderateScaleVertical(5),
      color: colors.black,
      opacity: 0.8,
    },
    cartItemDetailsCon: {
      width: width - width / 4 - 20,
      paddingHorizontal: moderateScale(10),
    },
    cartItemPrice: {
      fontFamily: fontFamily.bold,
      color: colors.cartItemPrice,
      fontSize: textScale(14),
      marginVertical: moderateScaleVertical(8),
    },
    cartItemWeight: {
      color: colors.textGreyB,
    },
    cartItemWeight2: {
      color: colors.textGreyB,
      fontSize: moderateScaleVertical(11),
    },
    rattingContainer: {
      paddingRight: moderateScale(16),
      width: moderateScaleVertical(100),
    },
    incDecBtnContainer: {
      backgroundColor: themeColors.primary_color,
      borderRadius: moderateScale(5),
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingVertical: moderateScaleVertical(3),
    },
    cartItemRatting: {
      tintColor: colors.orange,
      marginTop: moderateScaleVertical(2),
      marginTop: moderateScaleVertical(8),
    },
    cartItemRattingNum: {
      marginLeft: moderateScaleVertical(5),
      fontFamily: fontFamily.bold,
      color: colors.orange,
      marginTop: moderateScaleVertical(8),
    },
    cartItemValueBtn: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(20),
      color: colors.white,
    },
    cartItemValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
      color: colors.white,
      marginTop: moderateScaleVertical(5),
    },
    cartItemLine: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginBottom: moderateScaleVertical(10),
    },

    itemPriceDiscountTaxView: {
      flexDirection: 'column',
      marginHorizontal: moderateScale(20),
      paddingVertical: moderateScale(5),
      paddingHorizontal: moderateScale(10),
    },
    bottomTabLableValue: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(5),
    },
    amountPayable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(10),
    },

    dashedLine: {
      height: 1,
      borderRadius: 1,
      borderWidth: 0.5,
      borderColor: colors.borderLight,
      borderStyle: 'dashed',
    },
    address: {
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBgColor,
      fontSize: textScale(10),
    },

    containerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      ...commonStyles.mediumFont16,
      fontSize: textScale(18),
    },
    tipArrayStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderColor: colors.textGreyB,
      marginRight: 5,
      marginVertical: 20,
      borderRadius: moderateScale(5),
      borderColor: themeColors.primary_color,
    },
    tipArrayStyle2: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderColor: colors.textGreyB,
      marginRight: 5,
      marginVertical: 20,
      borderRadius: moderateScale(5),
      borderColor: themeColors.primary_color,
    },
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: moderateScaleVertical(height / 2),
      overflow: 'hidden',
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    modalMainViewContainer: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      // overflow: 'hidden',
      // paddingHorizontal: moderateScale(24),
    },
    carType: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
    },
    bottomAddToCartView: {
      marginHorizontal: moderateScale(20),
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    mainComponent: {
      flex: 1,
      backgroundColor: colors.backgroundGrey,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
  });
  return styles;
}
