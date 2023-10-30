import {cloneDeep, isEmpty} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  I18nManager,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as RNLocalize from 'react-native-localize';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {tokenConverterPlusCurrencyNumberFormater} from '../../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
} from '../../utils/helperFunctions';
import validator from '../../utils/validations';
import stylesFunc from './styles';

export default function ShippingDetails({navigation, route}) {
  const paramData = route?.params;
  console.log(paramData, 'paramData>>>>>');
  const {appData, currencies, languages, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot || {},
  );
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};

  const {pickUpTimeType} = useSelector((state) => state?.home);

  const userData = useSelector((state) => state?.auth?.userData);
  const [state, setState] = useState({
    message: '',

    selected1: false,
    selected2: false,
    currentPosition: 0,
    packageDesc:
      'Iphone 8 and accessories. Total of 2 items. Has lot of delicate stuff, so please handle with care.',
    availablePayments: [
      {
        id: 1,
        title: strings.CASH_ON_DELIVERY,
        off_site: 0,
      },
    ],
    selectedPayment: {
      id: 1,
      title: strings.CASH_ON_DELIVERY,
      off_site: 0,
    },

    selecteddelivery: null,
    username: '',
    email: '',
    callingCode: '91',
    cca2: 'IN',
    phoneNumber: '',
    selectedVendorOption: !isEmpty(paramData?.cabVendors)
      ? paramData?.cabVendors[0]
      : null,
    loyalityAmount: null,
    availableCarList: [],
    selectedCarOption: null,
    pageNo: 1,
    limit: 12,
    isLoading: false,
    isLoadingB: false,
    availableVendors: !isEmpty(paramData?.cabVendors)
      ? paramData?.cabVendors
      : [],
    couponInfo: null,
    updatedAmount: null,
  });

  const {
    updatedAmount,
    selectedPayment,
    couponInfo,
    availableVendors,
    isLoading,
    isLoadingB,
    pageNo,
    limit,
    selectedCarOption,
    loyalityAmount,
    availableCarList,
    selectedVendorOption,
    username,
    email,
    phoneNumber,
    from,
    to,
    shipmentDate,
    shipmentTime,
    callingCode,
    cca2,
    message,
    selected1,
    selected2,
    packageDesc,
    availablePayments,
    deliveryPack,
    selectPayment,
    selecteddelivery,
  } = state;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});
  const commonStyles = commonStylesFunc({fontFamily});

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  useEffect(() => {
    console.log(selectedVendorOption, 'selectedVendorOption');
    {
      !!selectedVendorOption && _getAllCarAndPrices();
    }
  }, [selectedVendorOption]);

  useEffect(() => {
    updateState({
      updatedAmount: paramData?.promocodeDetail?.couponInfo?.new_amount,
      couponInfo: paramData?.promocodeDetail?.couponInfo,
    });
  }, [
    paramData?.promocodeDetail?.couponInfo,
    paramData?.promocodeDetail?.new_amount,
  ]);

  //Get list of all services api
  const _getAllCarAndPrices = () => {
    updateState({isLoading: true, showVendorModal: false, showCarModal: true});
    actions
      .getAllCarAndPrices(
        `/${selectedVendorOption?.id}?page=${pageNo}&limit=${limit}`,
        {locations: paramData?.location},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'all available car res>>>');
        updateState({
          loyalityAmount: res?.data?.loyalty_amount_saved
            ? Number(res?.data?.loyalty_amount_saved).toFixed(
                appData?.profile?.preferences?.digit_after_decimal,
              )
            : 0,
          availableCarList:
            pageNo == 1
              ? res?.data?.products?.data
              : [...availableCarList, ...res?.data?.products?.data],
          selectedCarOption: selectedCarOption
            ? selectedCarOption
            : res?.data?.products?.data[0],
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  //error handling of api
  const errorMethod = (error) => {
    console.log(error, 'error>>>');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  //Validate form
  const isValidData = () => {
    const error = validator({username, email, phoneNumber});
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const onContinue = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    updateState({currentPosition: state.currentPosition + 1});
  };

  const onStepback = () => {
    updateState({currentPosition: state.currentPosition - 1});
  };

  const selectPackageHandler = (data) => {
    let packingData = cloneDeep(availableCarList);

    updateState({
      availableCarList: packingData.map((item) => {
        if (item.id == data.id) {
          return {
            ...item,
            active: data?.active ? false : true,
          };
        } else {
          return {
            ...item,
            active: false,
          };
        }
      }),
      selectedCarOption: data,
    });
  };

  const selectPaymentHandler = (data) => {
    let packingData = cloneDeep(availablePayments);

    updateState({
      availablePayments: packingData.map((item) => {
        if (item.id == data.id) {
          return {
            ...item,
            active: data?.active ? false : true,
          };
        } else {
          return {
            ...item,
            active: false,
          };
        }
      }),
      selectPayment: data,
    });
  };

  const receiverDetails = () => {
    return (
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: moderateScaleVertical(20),
        }}>
        {showPackageDetails()}
        <View style={styles.enter_details_heading}>
          <Text style={styles.labelStyle}>
            {strings.ENTER_RECEIVER_DETAILS}
          </Text>
        </View>

        <BorderTextInput
          onChangeText={_onChangeText('username')}
          placeholder={strings.RECIPIENT_NAME}
          value={username}
        />

        <BorderTextInput
          onChangeText={_onChangeText('email')}
          placeholder={`${strings.EMAIL}*`}
          value={email}
          keyboardType={'email-address'}
          autoCapitalize={'none'}
        />

        {/* <BorderTextInput
          onChangeText={_onChangeText('apartment')}
          placeholder={strings.APT_FLOOR}
          value={message}
        /> */}

        {/* <BorderTextInput
          onChangeText={_onChangeText('city')}
          placeholder={strings.CITY}
          value={message}
        /> */}
        <PhoneNumberInput
          onCountryChange={_onCountryChange}
          onChangePhone={(phoneNumber) =>
            updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
          }
          cca2={cca2}
          phoneNumber={phoneNumber}
          callingCode={state.callingCode}
          placeholder={strings.RECEIVER_PHONE_NUMBER}
        />
        <BorderTextInput
          onChangeText={_onChangeText('message')}
          placeholder={strings.MESSSAGE_FOR_US}
          value={message}
          containerStyle={{
            // zindex: 1000,
            height: moderateScaleVertical(108),
            padding: 5,
            marginTop: moderateScaleVertical(20),
          }}
          mainStyle={{zIndex: -1000}}
          // textInputStyle={{height:moderateScaleVertical(108)}}
          textAlignVertical={'top'}
          multiline={true}
        />
      </KeyboardAwareScrollView>
    );
  };

  const packageDetails = () => {
    return (
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: moderateScaleVertical(20),
        }}>
        <View style={styles.enter_details_heading}>
          <Text style={styles.labelStyle}>{strings.PACKAGE_DETAILS}</Text>
        </View>

        <DropDownPicker
          items={[
            {label: 'Apple', value: 'apple'},
            {label: 'Banana', value: 'banana'},
          ]}
          placeholder={strings.PACKAGE_WEIGHT}
          containerStyle={styles.dropdownContainerStyle1}
          placeholderStyle={styles.dropdownPlaceholderStyle}
          style={styles.dropdownStyle1}
          itemStyle={styles.dropdownItemStyle}
          labelStyle={I18nManager.isRTL && styles.dropdownLabelStyleLeft}
          zIndex={5000}
          dropDownStyle={styles.pickerStyle}
        />

        <DropDownPicker
          items={[
            {label: 'Apple', value: 'apple'},
            {label: 'Banana', value: 'banana'},
          ]}
          placeholder={strings.FREIGHT_ON_VALUE}
          placeholderStyle={styles.dropdownPlaceholderStyle}
          containerStyle={styles.dropdownContainerStyle2}
          style={styles.dropdownStyle2}
          itemStyle={styles.dropdownItemStyle}
          labelStyle={I18nManager.isRTL && styles.dropdownLabelStyleLeft}
          zIndex={4000}
          dropDownStyle={styles.pickerStyle}
        />

        <BorderTextInput
          onChangeText={_onChangeText('name')}
          placeholder={strings.INVOICE_VALUE}
          value={message}
          color={colors.textGreyD}
          textInputStyle={{
            marginHorizontal: moderateScale(14),
            opacity: 0.7,
          }}
        />

        <DropDownPicker
          items={[
            {label: 'Apple', value: 'apple'},
            {label: 'Banana', value: 'banana'},
          ]}
          placeholder={strings.SHIPMENT_PURPOSE}
          placeholderStyle={styles.dropdownPlaceholderStyle}
          containerStyle={styles.dropdownContainerStyle3}
          style={styles.dropdownStyle3}
          itemStyle={styles.dropdownItemStyle}
          labelStyle={I18nManager.isRTL && styles.dropdownLabelStyleLeft}
          zIndex={3000}
          dropDownStyle={styles.pickerStyle}
        />

        <View style={styles.enter_details_heading}>
          <Text style={styles.contentsStyle}>{strings.PACKAGE_CONTENTS}</Text>
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={styles.content_options_view}>
            <Text style={styles.content_options_text}>{strings.DOCUMENTS}</Text>

            <TouchableOpacity
              onPress={() =>
                updateState({selected1: selected1 ? false : true})
              }>
              <Image
                source={
                  selected1 ? imagePath.radioActive : imagePath.radioInActive
                }
                style={{marginHorizontal: moderateScaleVertical(12)}}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.content_options_view}>
            <Text style={styles.content_options_text}>{strings.PRODUCTS}</Text>

            <TouchableOpacity
              onPress={() =>
                updateState({selected2: selected2 ? false : true})
              }>
              <Image
                source={
                  selected2 ? imagePath.radioActive : imagePath.radioInActive
                }
                style={{marginHorizontal: moderateScaleVertical(12)}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  };

  const confirmDetails = () => {
    return (
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: moderateScaleVertical(20),
        }}>
        <View style={styles.enter_details_heading}>
          <Text style={styles.labelStyle}>{strings.CONFIRM_DETAILS_}</Text>
        </View>

        <View style={{marginVertical: moderateScaleVertical(10)}}>
          <View style={styles.subheading}>
            <Text style={styles.labelStyle}>{strings.RECEIVER_DETAILS}</Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.RECIPIENT_NAME_LIST}</Text>
            <Text style={styles.itemValue}>{'Pawan Kumar'}</Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.COUNTRY}</Text>
            <Text style={styles.itemValue}>{'Country'}</Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.ADDRESS}</Text>
            <Text style={styles.itemValue}>{'Address'}</Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.POSTAL_CODE}</Text>
            <Text style={styles.itemValue}>{'Postal Code'}</Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.CITY}</Text>
            <Text style={styles.itemValue}>{'City'}</Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.PHONE_NUMBER}</Text>
            <Text style={styles.itemValue}>{'Phone no'}</Text>
          </View>
        </View>

        <View style={{marginVertical: moderateScaleVertical(10)}}>
          <View style={styles.subheading}>
            <Text style={styles.labelStyle}>
              {strings.PACKAGE_DETAILS_LIST}
            </Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.PACKAGE_WEIGHT}</Text>
            <Text style={styles.itemValue}>{'3 kg'}</Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.FREIGHT_ON_VALUE}</Text>
            <Text style={styles.itemValue}>{'1523'}</Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.INVOICE_VALUE}</Text>
            <Text style={styles.itemValue}>{'258'}</Text>
          </View>

          <View style={styles.listItemStyle}>
            <Text style={styles.itemLabel}>{strings.SHIPMENT_PURPOSE}</Text>
            <Text style={styles.itemValue}>{'Birthday'}</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS, {
      vendor: vendor,
      cabOrder: true,
      pickUp: true,
      // cartId: cartData.id,
    })();
  };

  const removeCoupon = () => {
    updateState({
      updatedAmount: null,
      couponInfo: null,
    });
  };

  const _finalPayment = (data) => {
    updateState({
      isLoading: true,
    });
    actions
      .placeDelievryOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, '_confirmAndPay res>>>');
        if (res && res?.status == 200) {
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
          });
          navigation.navigate(navigationStrings.PICKUPORDERDETAIL, {
            orderId: res?.data?.id,
            fromVendorApp: true,
            selectedVendor: {id: selectedCarOption?.vendor_id},
            orderDetail: res?.data,
            fromCab: true,
          });
        } else {
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
          });
          showError(res?.message || res?.error);
        }
      })
      .catch(errorMethod);
  };

  const payAndSubmit = () => {
    console.log(selectedCarOption, 'selectedCarOption');
    let data = {};

    data['task_type'] = pickUpTimeType ? pickUpTimeType : '';
    data['schedule_time'] =
      pickUpTimeType == 'now' ? '' : paramData?.selectedDateAndTime;
    data['recipient_phone'] = `${callingCode}${phoneNumber}`;
    data['recipient_email'] = email;
    data['task_description'] = message;
    data['amount'] = selectedCarOption?.tags_price;
    data['payment_method'] = 1;
    data['vendor_id'] = selectedCarOption?.vendor_id;
    data['product_id'] = selectedCarOption?.id;
    data['currency_id'] = currencies?.primary_currency?.id;
    data['tasks'] = paramData?.tasks;
    if (couponInfo) {
      data['coupon_id'] = couponInfo?.id;
    }
    data['order_time_zone'] = RNLocalize.getTimeZone();
    console.log(data, 'data>>>');

    if (
      !!(
        !!data?.client_preference?.verify_email &&
        !data?.verify_details?.is_email_verified
      ) ||
      !!(
        !!data?.client_preference?.verify_phone &&
        !data?.verify_details?.is_phone_verified
      )
    ) {
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT_SECOND, {
        ...userData,
        formCart: true,
      })();
    } else {
      _finalPayment(data);
    }
  };

  const payment = () => {
    return (
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: moderateScale(20),
          marginTop: moderateScale(width / 6),
        }}>
        <View style={styles.totalPayableView}>
          <View>
            <Text style={[styles.totalPayableText, {textAlign: 'center'}]}>
              {strings.TOTAL_PAYABLE}
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={[
                  styles.totalPayableValue,
                  {
                    textDecorationLine: updatedAmount ? 'line-through' : 'none',
                    opacity: updatedAmount ? 0.5 : 1,
                    textAlign: 'center',
                  },
                ]}>
                {selectedCarOption
                  ? `${tokenConverterPlusCurrencyNumberFormater(
                      Number(selectedCarOption?.variant[0]?.multiplier) *
                        Number(selectedCarOption?.variant[0]?.price),
                      digit_after_decimal,
                      additional_preferences,
                      currencies?.primary_currency?.symbol,
                    )}`
                  : ''}
              </Text>

              {updatedAmount && (
                <Text style={[styles.totalPayableValue, {paddingLeft: 5}]}>
                  {`${tokenConverterPlusCurrencyNumberFormater(
                    Number(selectedCarOption.tags_price) -
                      Number(updatedAmount) >
                      0
                      ? Number(selectedCarOption.tags_price) -
                          Number(updatedAmount)
                      : 0,
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}`}
                </Text>
              )}
            </View>
          </View>
        </View>

        {!!loyalityAmount && (
          <View
            style={{
              flexDirection: 'row',
              // paddingHorizontal: moderateScale(20),
              justifyContent: 'space-between',
            }}>
            <Text style={styles.distanceDura0tionDeliveryLable}>
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                styles.distanceDurationDeliveryValue
              }>{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(selectedCarOption?.variant[0]?.multiplier) *
                Number(loyalityAmount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
          </View>
        )}

        <TouchableOpacity
          // disabled={item?.couponData ? true : false}
          onPress={() => _getAllOffers(selectedCarOption, '')}
          style={styles.offersViewB}>
          {couponInfo ? (
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
                  {`${strings.CODE} ${couponInfo?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                {/* <Image source={imagePath.crossBlueB}  /> */}
                <Text
                  onPress={removeCoupon}
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
        {/* {availablePayments &&
          availablePayments.length &&
          availablePayments.map((itm, inx) => {
            if (inx == availablePayments.length - 1) {
              return (
                <TouchableOpacity
                  onPress={() => selectPaymentHandler(itm)}
                  key={inx}
                  style={[
                    styles.caseOnDeliveryView,
                    // {...getAndCheckStyle(itm)},
                  ]}>
                  <Image
                    source={
                      itm?.active
                        ? imagePath.radioActive
                        : imagePath.radioInActive
                    }
                  />
                  <Text style={styles.caseOnDeliveryText}>
                    {strings.CASH_ON_DELIVERY}
                  </Text>
                </TouchableOpacity>
              );
            }
          })} */}

        <TouchableOpacity
          // onPress={() =>
          //   !!userData?.auth_token
          //     ? moveToNewScreen(navigationStrings.ALL_PAYMENT_METHODS)()
          //     : showError(strings.UNAUTHORIZED_MESSAGE)
          // }
          style={[styles.paymentMainView, {justifyContent: 'space-between'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={imagePath.paymentMethod} />
            <Text style={styles.selectedMethod}>
              {selectedPayment
                ? selectedPayment.title
                : strings.SELECT_PAYMENT_METHOD}
            </Text>
          </View>
          <View>
            <Image
              source={imagePath.goRight}
              style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
            />
          </View>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  };
  //upadte box style on click
  const getAndCheckStyle = (item) => {
    console.log(item, 'item>>>item');
    console.log(selectedCarOption, 'selectedCarOption>>>selectedCarOption');
    if (selectedCarOption && selectedCarOption.id == item.id) {
      return {
        backgroundColor: colors.white,
        borderColor: themeColors.primary_color,
      };
    } else {
      return {
        backgroundColor: 'transparent',
        borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      };
    }
  };
  const _renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => selectPackageHandler(item)}
        key={index}
        style={[styles.packingBoxStyle, {...getAndCheckStyle(item)}]}>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={{
              uri: getImageUrl(
                item?.media[0]?.image?.path?.image_fit,
                item?.media[0]?.image?.path?.image_path,
                '1000/1000',
              ),
            }}
            style={{height: 50, width: width / 3 - 40}}
            resizeMode={'contain'}
          />
        </View>
        <View
          style={{
            flex: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text numberOfLines={1} style={styles.boxTitle}>
            {item?.translation[0]?.title}
          </Text>
          <Text numberOfLines={2} style={styles.boxTitle2}>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(item.tags_price),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const showPackageDetails = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          // marginVertical: moderateScaleVertical(10),
          // marginHorizontal: moderateScale(20),
        }}>
        <FlatList
          data={availableCarList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          extraData={availableCarList}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItems}
        />
      </View>
    );
  };

  const onPressAvailableVendor = (item) => {
    updateState({
      isLoadingB: true,
      // availableCarList: [],
      pageNo: 1,
      selectedVendorOption: item,
    });
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={imagePath.back}
        centerTitle={strings.SHIPPING_DETAILS}
        headerStyle={{backgroundColor: colors.backgroundGrey}}
      />

      <View style={{...commonStyles.headerTopLine}} />
      {availableCarList && availableCarList.length ? (
        <>
          {/* <View style={styles.bottomSection}>
            <StepIndicators
              currentPosition={state.currentPosition}
              themeColor={themeColors}
              stepCount={2}
            />
          </View> */}
          {availableVendors.length > 1 && !state.currentPosition ? (
            <View>
              <ScrollView
                contentContainerStyle={{height: 45, marginVertical: 20}}
                horizontal
                showsHorizontalScrollIndicator={false}>
                {availableVendors.map((i, inx) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => onPressAvailableVendor(i)}
                      style={{
                        flexDirection: 'row',
                        // paddingVertical: 8,
                        // marginTop: 20,
                        height: 45,
                        width:
                          availableVendors.length <= 2 ? width / 2 : width / 3,
                        borderBottomColor:
                          selectedVendorOption?.id == i?.id
                            ? themeColors.primary_color
                            : colors.textGreyJ,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          selectedVendorOption?.id == i?.id
                            ? getColorCodeWithOpactiyNumber(
                                themeColors.primary_color.substr(1),
                                20,
                              )
                            : 'transparent',
                        borderBottomWidth:
                          selectedVendorOption?.id == i?.id ? 3 : 1,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.carType2,
                          {
                            color:
                              selectedVendorOption?.id == i?.id
                                ? themeColors.primary_color
                                : colors.textGreyJ,
                          },
                        ]}>
                        {i.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          {(() => {
            switch (state.currentPosition) {
              case 0:
                return receiverDetails();
              case 1:
                // return packageDetails();
                return payment();
              // case 2:
              //   return confirmDetails();
              // case 3:
              //   return payment();
            }
          })()}
          <View
            style={{
              marginHorizontal: moderateScaleVertical(20),
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              justifyContent: 'flex-end',
              zIndex: 1000,
            }}>
            <GradientButton
              onPress={state.currentPosition == 1 ? payAndSubmit : onContinue}
              btnText={(() => {
                switch (state.currentPosition) {
                  case 0:
                    return strings.CONTINUE;
                  // case 1:
                  //   return strings.CONTINUE;
                  // case 2:
                  //   return strings.CONFIRM_DETAILS;
                  case 1:
                    return strings.PAY_SEND_ITEM;
                }
              })()}
            />
            {state.currentPosition == 0 ? null : (
              <TouchableOpacity onPress={onStepback}>
                <Text style={styles.skipText}>{strings.STEP_BACK}</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : null}
    </WrapperContainer>
  );
}
