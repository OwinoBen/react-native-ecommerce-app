import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Platform,
  Pressable,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import Geocoder from 'react-native-geocoding';
import * as RNLocalize from 'react-native-localize';
import MapView, { PROVIDER_GOOGLE, Marker, PROVIDER_DEFAULT } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
import RazorpayCheckout from 'react-native-razorpay';
import { useSelector } from 'react-redux';
import CustomCallouts from '../../../Components/CustomCallouts';
import GradientButton from '../../../Components/GradientButton';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { mapStyleGrey } from '../../../utils/constants/MapStyle';
import {
  deviceCountryCode,
  getColorCodeWithOpactiyNumber,
  getCurrentLocation,
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import PaymentProcessingModal from '../../CourierService/PaymentProcessingModal';
import AvailableDriver from './AvailableDriver';
import SelectPaymentModalView from './SelectPaymentModalView';
import stylesFun from './styles';
import BottomViewModal from '../../../Components/BottomViewModal';
import DatePicker from 'react-native-date-picker';
import { chekLocationPermission } from '../../../utils/permissions';
import { FlutterwaveButton, PayWithFlutterwave } from 'flutterwave-react-native';
import { generateTransactionRef } from '../../../utils/paystackMethod';
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';


const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function ChooseCarTypeAndTime({ navigation, route }) {
  const paramData = route?.params?.promocodeDetail
    ? route?.params?.promocodeDetail
    : route?.params;
  console.log('my route', paramData);
  const bottomSheetRef = useRef(null);
  const mapRef = useRef();

  const {
    appData,
    currencies,
    languages,
    themeColors,
    appStyle,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot || {});
  const { additional_preferences, digit_after_decimal, distance_unit_for_time } = appData?.profile?.preferences || {};
  const { userData } = useSelector((state) => state?.auth || {});
  const { pickUpTimeType, location } = useSelector((state) => state?.home || {});
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const { profile } = appData || {};
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });
console.log(themeColors,'themeColorsthemeColorsthemeColors')
  const [state, setState] = useState({
    region: {
      latitude: paramData?.location[0]?.latitude
        ? Number(paramData?.location[0]?.latitude)
        : 30.7191,
      longitude: paramData?.location[0]?.longitude
        ? Number(paramData?.location[0]?.longitude)
        : 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    isLoading: false,
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
    availableVendors: !isEmpty(paramData?.cabVendors)
      ? paramData?.cabVendors
      : [],
    availableCarList: [],
    selectedCarOption: null,

    showCarModal: true,
    showPaymentModal: false,
    redirectFromNow: false,
    date: new Date(),
    slectedDate: paramData?.datetime?.slectedDate
      ? paramData?.datetime?.slectedDate
      : null,
    selectedTime: paramData?.datetime?.selectedTime
      ? paramData?.datetime?.selectedTime
      : null,

    isModalVisible: false,
    selectedVendorOption: !isEmpty(paramData?.cabVendors)
      ? paramData?.cabVendors[0]
      : null,
    pageNo: 1,
    limit: 12,
    uploadImages: [],
    totalDistance: 0,
    totalDuration: 0,
    updatedAmount: null,
    couponInfo: null,
    loyalityAmount: null,
    pickedUpTime: paramData?.datetime?.selectedTime
      ? paramData?.datetime?.selectedTime
      : null,
    pickedUpDate: paramData?.datetime?.slectedDate
      ? paramData?.datetime?.slectedDate
      : null,
    selectedPayment: {},
    taskInstruction: '',
    allSubmittedAnswers: null,
    indicatorLoader: false,
    defaultDeviceCountryCode: null,
    isScheduleModalVisible: false,
    scheduleDateTime: {},
    myCurrentLocationDetails: {},
    allListedDrivers: [],
    isModalVisibleForPayFlutterWave: false,
    paymentDataFlutterWave: null,
    disableButton: false,
    showBidPriceModal: false
  });
  const {
    selectedPayment,
    couponInfo,
    updatedAmount,
    totalDistance,
    totalDuration,
    isModalVisible,
    isLoading,
    region,
    availableCarList,
    selectedCarOption,
    showCarModal,
    showPaymentModal,
    redirectFromNow,
    slectedDate,
    selectedTime,
    selectedVendorOption,
    date,
    availableVendors,
    pageNo,
    limit,
    loyalityAmount,
    pickedUpTime,
    pickedUpDate,
    uploadImages,
    taskInstruction,
    allSubmittedAnswers,
    indicatorLoader,
    defaultDeviceCountryCode,
    isScheduleModalVisible,
    scheduleDateTime,
    myCurrentLocationDetails,
    allListedDrivers,
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
    disableButton,
    showBidPriceModal
  } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const [updateSeatNO, setUpdateSeatNo] = useState(1);
  const [showFinalUpdatedSeatNo, setShowFinalUpdatedSeatNo] = useState(1);
  const [bidRidePrice, setBidRidePrice] = useState(0);
  const [bideRequestLoading, setBideRequestLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (paramData && paramData?.selectedMethod) {
        updateState({ selectedPayment: paramData?.selectedMethod });
      }
    }, [paramData]),
  );
  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, { language: 'en' }); // set the language
    setTimeout(() => {
      onCenter();
    }, 3000);
  }, []);



  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  useEffect(() => {
    {
      !!selectedVendorOption && _getAllCarAndPrices(true);
    }
    getDeviceCounrtyCode();
  }, [selectedVendorOption]);

  const getDeviceCounrtyCode = () => {
    deviceCountryCode()
      .then((res) => {
        updateState({
          defaultDeviceCountryCode: `+${res[0]?.countryCodes[0]}`,
        });
      })
      .catch((error) => {
        console.log(error, 'erroror');
      });
  };
  useEffect(() => {
    updateState({
      updatedAmount: paramData?.couponInfo?.new_amount,
      couponInfo: paramData?.couponInfo,
    });
  }, [paramData?.couponInfo, paramData?.couponInfo?.new_amount]);


  useEffect(() => {
    !!pickUpTimeType && pickUpTimeType == 'now' ? _getAllCarAndPrices() : onDateSet(pickUpTimeType)
  }, [updateSeatNO]);

  const onDateSet = useCallback((date) => {
    let time = moment(date).format("HH:mm ");
    let dateSelectd = moment(date).format("YYYY-MM-DD");
    updateState({
      isLoading: true,
      scheduleDateTime: {
        selectedDateAndTime: `${dateSelectd} ${time}`,
        slectedDate: dateSelectd,
        selectedTime: moment(date).format("HH:mm"),
        date: date,
        isScheduleModalVisible: false,
      },
    });
    updateState({ isScheduleModalVisible: false });
    _getAllCarAndPrices(false, { selectedDateAndTime: `${dateSelectd} ${time}` });
  }, [date])

  const clearScheduleDate = useCallback(() => {
    actions.saveSchduleTime('now');
    updateState({
      isLoading: true,
      scheduleDateTime: {}
    });
    _getAllCarAndPrices(false, { selectedDateAndTime: null });
  }, [])



  //Get list of all orders api
  const _getAllCarAndPrices = (showInitalModal = true, scheduleDateTime = null) => {
    if (showInitalModal) {
      updateState({ showCarModal: true });
    }
    updateState({ isLoading: true });

    const apiQuery = `/${selectedVendorOption?.id}/${paramData?.id}?page=${pageNo}&limit=${limit}`
    const apiData = {
      locations: paramData?.location,
      schedule_date_delivery: scheduleDateTime?.selectedDateAndTime
        ? scheduleDateTime?.selectedDateAndTime
        : `${pickedUpDate ? pickedUpDate : ''} ${pickedUpTime ? pickedUpTime : ''
        }`,
      is_cab_pooling: !!paramData?.rideType == 'Pooling' ? 1 : 0,
      no_seats_for_pooling: updateSeatNO,
    }

    const apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }

    console.log(apiData, "apiDataapiDataapiData");

    actions
      .getAllCarAndPrices(apiQuery, apiData, apiHeader)
      .then((res) => {
        console.log(res, "resresresresres");
        const bidModalStatus = paramData?.rideType == 'bideRide' ? true : false
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
          selectedCarOption: res?.data?.products?.data[0],
          showBidPriceModal: (res?.data?.products?.data[0] && bidModalStatus) ? true : false,
          isLoading: false,
          isRefreshing: false,
        });
        setShowFinalUpdatedSeatNo(updateSeatNO);
        setBidRidePrice(Number(res?.data?.products?.data[0]?.tags_price))
      })
      .catch(errorMethod);
  };

  const _onUpdateSeatNo = (type) => {
    if (type == 'increase') {
      setUpdateSeatNo(updateSeatNO + 1);
    } else {
      setUpdateSeatNo(updateSeatNO - 1);
    }
  };

  let redirectTimeout = useRef();

  //flutter wave

  const handleOnRedirect = (data) => {
    // clear scheduled action
    clearTimeout(redirectTimeout.current);
    // delay action to prevent from reoccurring
    redirectTimeout.current = setTimeout(() => {
      try {
        if (data && data?.transaction_id) {
          let apiData = {
            payment_option_id: paymentDataFlutterWave?.payment_option_id,
            order_number: paymentDataFlutterWave?.orderDetail?.order_number,
            transaction_id: data?.transaction_id,
            amount: paymentDataFlutterWave?.total_payable_amount,
            action: 'pickup_delivery',
          };

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
              console.log(res, 'open..SdkUrl');
              if (res && res?.status == 'Success') {
                console.log(
                  paymentDataFlutterWave,
                  'paymentDataFlutterWave....',
                );
                let newOrderDetail = paymentDataFlutterWave?.orderDetail;
                newOrderDetail['dispatch_traking_url'] =
                  res?.data?.dispatch_traking_url;
                paymentDataFlutterWave['orderDetail'] = newOrderDetail;
                updateState({
                  indicatorLoader: false,
                });
                navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
                  ...paymentDataFlutterWave,
                  orderId: paymentDataFlutterWave?.orderDetail?.id,
                  fromCab: true,
                });
              } else {
                redirectTimeout = setTimeout(() => {
                  // do something with the result
                  updateState({
                    isModalVisibleForPayFlutterWave: false,
                    indicatorLoader: false,
                    // deliveryFeeLoader: false,
                  });
                }, 200);
              }
            })
            .catch((error) => {
              console.log(error, 'errorerrorerrorerrorerror');
              updateState({
                isModalVisibleForPayFlutterWave: false,
                indicatorLoader: false,
              });
            });
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
                  indicatorLoader: false,
                  deliveryFeeLoader: false,
                });
              }, 200);
            })
            .catch((error) => console.log(error, 'errorrrr'));
        }
      } catch (error) {
        console.log('error raised', error);
        redirectTimeout = setTimeout(() => {
          // do something with the result
          updateState({
            isModalVisibleForPayFlutterWave: false,
            indicatorLoader: false,
          });
        }, 200);
      }
    }, 100);
  };

  //error handling of api
  const errorMethod = (error) => {
    // alert("utyhtgyrtertcytfgh")
    console.log(error, 'errorOccured');
    updateState({
      isLoading: false,
      isRefreshing: false,
      indicatorLoader: false,
      isModalVisibleForPayFlutterWave: false,
    });
    showError(error?.message || error?.error || error?.description);
  };


  const sendStripeToken = (extraData, data) => {

    data['order_number'] = extraData?.orderDetail?.order_number;
    data['action'] = 'pickup_delivery';
    data['stripe_token'] = paramData?.tokenInfo;
    data['card_last_four_digit'] = paramData?.cardInfo?.last4;
    data['card_expiry_month'] = paramData?.cardInfo?.expiryMonth;
    data['card_expiry_year'] = paramData?.cardInfo?.expiryYear;

    actions
      .openPaymentWebUrlPost(`/${selectedPayment?.code}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'res>>>>>++++++++');
        updateState({
          isModalVisible: false,
          isLoading: false,
          isRefreshing: false,
          indicatorLoader: false,
        });
        let newObj = extraData?.orderDetail;
        newObj['dispatch_traking_url'] = res?.data?.data?.dispatch_traking_url;
        extraData['orderDetail'] = newObj;

        navigation.navigate(
          navigationStrings.PICKUPTAXIORDERDETAILS,
          extraData,
        );
      })
      .catch(errorMethod);
  };

  const checkPaymentOptions = (extraData, res) => {

    console.log(extraData, 'extraData');
    console.log(res, 'res');
    let paymentId = selectedPayment?.id;
    // let order_number = res?.orderDetail?.order_number;
    // console.log('api res success', res);

    let paymentData = {
      total_payable_amount: Number(
        extraData?.orderDetail?.payable_amount
          ? extraData?.orderDetail?.payable_amount
          : extraData?.orderDetail?.total_amount,
      ).toFixed(appData?.profile?.preferences?.digit_after_decimal),
      payment_option_id: selectedPayment?.id,
      orderDetail: extraData?.orderDetail,
      redirectFrom: 'pickup_delivery',
      selectedPayment: selectedPayment,
      extraData: extraData,
    };

    console.log(paymentData, 'paymentData>paymentData');
    console.log(paymentId, 'paymentData>paymentData123');
    updateState({
      isModalVisible: false,
      isLoading: false,
      isRefreshing: false,
      indicatorLoader: false,
    });
    switch (paymentId) {
      case 4: //Stripe Payment Getway
        sendStripeToken(extraData, res);
        break;
      case 6: //Payfast Payment Getway
        navigation.navigate(navigationStrings.PAYFAST, paymentData);
        break;
      case 32: //PAYPHONE Payment Getway
        navigation.navigate(navigationStrings.PAYPHONE, paymentData);
        break;
      case 18: //Authorize.net Payment Gatway
        navigation.navigate(navigationStrings.AuthorizeNet, paymentData);
        break;
      case 5: // PayStack Payment Getway
        navigation.navigate(navigationStrings.PAYSTACK, paymentData);
        break;
      case 42: //DIRECTPAYONLINE Payment Gatway
        navigation.navigate(navigationStrings.DIRECTPAYONLINE, paymentData);
        break;
      case 47: //Khalti Payment Gatway
        navigation.navigate(navigationStrings.KHALTI, paymentData);
        break;
      case 52: //SKIP_CASH Payment Gatway
        navigation.navigate(navigationStrings.SKIP_CASH, paymentData);
        break;
        case 57: //Peaspal Payment Gatway
        navigation.navigate(navigationStrings.PESAPAL, paymentData);
        break;
      case 30: //FlutterWave Payment Getway
        updateState({
          isModalVisibleForPayFlutterWave: true,
          paymentDataFlutterWave: paymentData,
        });

        // openPayTabs(paymentData)

        break;
      default:
        console.log('i mah shfjgdghdjgs');
        navigation.navigate(
          navigationStrings.PICKUPTAXIORDERDETAILS,
          extraData,
        );
        break;
    }
  };
  const _paymentWithPlugnPayMethods = (extraData, response, data) => {

    console.log(extraData, response, paramData, 'extradataextradata')
    let selectedMethod = paramData?.selectedMethod?.code;
    let CardNumber = paramData?.Card_Number.split(" ").join("")
    let expirydate

    if (paramData?.selectedMethod?.id == 50) {

      expirydate = paramData?.year.concat(paramData?.date)
      console.log(expirydate, paramData?.year, paramData?.date, 'expirydate')
    }
    else {
      expirydate = paramData?.expiryDate
    }

    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${response?.data?.payable_amount || data?.amount}&cv=${paramData?.cvc}&dt=${expirydate}&cno=${CardNumber}&order_number=${response?.data?.order_number}&action=pickup_delivery`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      )
      .then((res) => {
        console.log(res, "Response>>>>>");
        if (
          res &&
          (res?.status == 'Success' || res?.status == 200)

        ) {
          let newObj = extraData?.orderDetail;
          newObj["dispatch_traking_url"] = res?.data?.data?.dispatch_traking_url;
          extraData["orderDetail"] = newObj;
          navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS,
            extraData
          );
        }
      })
      .catch((err) => {
        console.log('Error>>>>>>>>>>>', err)
        showError(err?.msg)
      })
  }
  const _finalPayment = (data) => {
    if (isEmpty(selectedPayment)) {
      // showError(strings.PLEASE_SELECT_A_PAYMENT_METHOD);
      _redirectToPayement();
      return;
    }

    updateState({
      isLoading: true,
      indicatorLoader: true,
    });

    actions
      .placeDelievryOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, 'resresresresplaceDelievryOrder');
        if (res && res?.status == 200) {
          let extraData = {
            orderId: res?.data?.id,
            fromVendorApp: true,
            selectedVendor: { id: selectedCarOption?.vendor_id },
            orderDetail: res?.data,
            fromCab: paramData?.pickup_taxi ? false : true,
            pickup_taxi: paramData?.pickup_taxi,
            totalDuration: totalDuration,
            selectedCarOption: selectedCarOption?.sku,
          };
          console.log(extraData, data, "extraData, data");
          if (selectedPayment?.id == 49 || selectedPayment?.id == 50 || selectedPayment?.id == 53) { _paymentWithPlugnPayMethods(extraData, res, data) }
          else { checkPaymentOptions(extraData, data); }

        } else {
          console.log(res, 'res>>>>>');
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
            indicatorLoader: false,
          });
          showError(res?.message || res?.error);
        }
      })
      .catch(errorMethod);
  };
  const _confirmAndPay = () => {
    console.log(selectedPayment, 'selectedPayment.id');


    const orderFinalPrice = paramData?.bidData?.bid_price ? Number(paramData?.bidData?.bid_price) : selectedCarOption?.total_tags_price ? selectedCarOption?.total_tags_price : selectedCarOption?.tags_price;

    let data = {};
    data['task_type'] = scheduleDateTime?.selectedDateAndTime
      ? ''
      : pickUpTimeType
        ? pickUpTimeType
        : '';
    data['schedule_time'] = scheduleDateTime?.selectedDateAndTime
      ? `${scheduleDateTime?.selectedDateAndTime}`
      : pickUpTimeType == 'now'
        ? ''
        : slectedDate && selectedTime && `${slectedDate} ${selectedTime}`;
    data['recipient_phone'] = '';
    data['recipient_email'] = '';
    data['task_description'] = taskInstruction;
    data['amount'] = orderFinalPrice
    data['tags_amount'] = selectedCarOption?.tags_price;
    data['tollamount'] = selectedCarOption?.toll_fee
      ? selectedCarOption?.toll_fee
      : 0;
    data['servicechargeamount'] = selectedCarOption?.service_charge_amount
      ? selectedCarOption?.service_charge_amount
      : 0;
    data['payment_option_id'] = selectedPayment ? selectedPayment?.id : 1;
    data['vendor_id'] = selectedCarOption?.vendor_id;
    data['product_id'] = selectedCarOption?.id;
    data['currency_id'] = currencies?.primary_currency?.id;
    data['tasks'] = paramData?.tasks;
    data['images_array'] = uploadImages;
    data['agent_id'] = paramData?.bidData?.driver_id
    if (paramData?.bidData?.driver_id) {
      data['bid_task_type'] = paramData?.bidData?.task_type
    }
    data['user_product_order_form'] = allSubmittedAnswers
      ? allSubmittedAnswers
      : [];
    data["is_postpay"] = profile?.preferences?.is_postpay_enable
    if (couponInfo) {
      data['coupon_id'] = couponInfo?.id;
    }
    data['order_time_zone'] = RNLocalize.getTimeZone();
    data['bookingType'] = paramData?.friendBookingDetails?.bookingType;
    (data[
      'friendName'
    ] = `${paramData?.friendBookingDetails?.firstName} ${paramData?.friendBookingDetails?.lastName}`),
      (data['friendPhoneNumber'] = paramData?.friendBookingDetails?.bookingType
        ? paramData?.friendBookingDetails?.mobileNumber?.includes('+')
          ? paramData?.friendBookingDetails?.mobileNumber
          : ` ${defaultDeviceCountryCode}${paramData?.friendBookingDetails?.mobileNumber}`
        : '')

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
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT_TAXI, {
        ...userData,
        fromCart: true,
      })();
    } else {
      selectedPayment.id == 10 ? renderRazorPay(data) : _finalPayment(data);
    }
  };
  const renderRazorPay = (data) => {
    let options = {
      description: 'Payment for your order',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: appData?.profile?.preferences?.razorpay_api_key, // Your api key
      amount: Number(selectedCarOption?.total_tags_price) * 100,
      name: appData?.profile?.company_name,
      prefill: {
        email: userData?.email,
        contact: userData?.phone_number || '',
        name: userData?.name,
      },
      theme: { color: themeColors.primary_color },
    };

    RazorpayCheckout.open(options)
      .then((res) => {
        console.log(`Success for razor: `, res);
        if (res?.razorpay_payment_id) {
          data['transaction_id'] = res?.razorpay_payment_id;
          _finalPayment(data); // placeOrder
        }
      })
      .catch(errorMethod);
  };


  const onPressAvailableVendor = (item) => {
    updateState({
      isLoading: true,
      availableCarList: [],
      pageNo: 1,
      selectedVendorOption: item,
    });
  };
  //Modal to select car

  //getAllNearByDrivers
  useEffect(() => {
    chekLocationPermission(false)
      .then((result) => {
        if (result !== 'goback') {
          getCurrentLocation('home')
            .then((res) => {
              updateState({
                myCurrentLocationDetails: res,
              });
            })
            .catch((err) => {
              console.log('error raised', location);
              // console.log("default location",location)
            });
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);


  const _selectedProductForDrivers = (item) => {
    updateState({
      selectedCarOption: item,
      showBidPriceModal: paramData?.rideType == 'bideRide' ? true : false
    });
    setBidRidePrice(Number(item?.tags_price))
  };

  useEffect(() => {
    if (
      myCurrentLocationDetails?.latitude &&
      myCurrentLocationDetails?.longitude
    ) {
      getAllDrivers();
    }
  }, [selectedCarOption?.tags]);

  const getAllDrivers = () => {
    actions
      .getAllNearByDrivers(
        {
          latitude: myCurrentLocationDetails?.latitude,
          longitude: myCurrentLocationDetails?.longitude,
          tag: selectedCarOption?.tags,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'all listed drivers');
        updateState({
          allListedDrivers: res?.data,
        });
      })
      .catch(errorMethod);
  };

  const renderVendors = ({ item }) => {
    return (
      <TouchableOpacity
        disabled={selectedVendorOption.id == item.id}
        onPress={() => onPressAvailableVendor(item)}
        style={{
          backgroundColor:
            selectedVendorOption.id == item.id
              ? themeColors.primary_color
              : 'white',
          padding: moderateScale(8),
          borderRadius: moderateScale(4),
          borderWidth: selectedVendorOption.id == item.id ? 0 : 0.5,
          borderColor: themeColors.primary_color,
        }}>
        <Text
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.regular,
            color:
              selectedVendorOption.id == item.id
                ? themeColors.secondary_color
                : colors.black,
          }}>
          {item?.name || item?.translation_title}
        </Text>
      </TouchableOpacity>
    );
  };

  const carModalHeader = () => {
    if (!!showPaymentModal) {
      return (
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
            padding: moderateScale(16),
            // alignItems: 'center',
            borderRadius: 8,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {!!(paramData?.showPaymentModal && paramData?.rideType == 'bideRide') ?
              <View />
              :
              <TouchableOpacity
                onPress={() =>
                  redirectFromNow
                    ? updateState({ showCarModal: true, showPaymentModal: false })
                    : updateState({ showPaymentModal: false })
                }>
                <Image
                  style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
                  source={imagePath.backArrowCourier}
                />
              </TouchableOpacity>
            }
            <View
              style={{
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity77
                  : colors.black,
                width: moderateScale(40),
                height: moderateScale(4),
                borderRadius: 8,
                marginRight: moderateScale(34),
              }}
            />
            <Text />
          </View>
          <View style={{ marginBottom: moderateScaleVertical(32) }} />
        </View>
      );
    }
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          borderRadius: 8,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          marginTop: moderateScaleVertical(18),
        }}>
        <View
          style={{
            // padding: moderateScale(16),
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Image style={{ opacity: 0 }} source={imagePath.backArrowCourier} />

            <View
              style={{
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity77
                  : colors.black,
                width: moderateScale(40),
                height: moderateScale(4),
                borderRadius: 8,
                marginRight: moderateScale(34),
              }}
            />
          </View>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? colors.whiteOpacity77 : colors.black,
              marginTop: moderateScaleVertical(8),
            }}>
            {availableCarList?.length > 0 ? strings.CHOOSE_A_TRIP : ''}
          </Text>
        </View>
        <View style={{ marginVertical: moderateScale(8) }}>
          {availableVendors?.length > 1 ? (
            <FlatList
              horizontal
              data={availableVendors}
              renderItem={renderVendors}
              extraData={availableVendors}
              ItemSeparatorComponent={() => (
                <View style={{ marginRight: moderateScale(12) }} />
              )}
              ListHeaderComponent={() => (
                <View style={{ marginLeft: moderateScale(16) }} />
              )}
              ListFooterComponent={() => (
                <View style={{ marginRight: moderateScale(16) }} />
              )}
              showsHorizontalScrollIndicator={false}
            />
          ) : null}
        </View>
      </View>
    );
  };






  const _selectCarModalView = () => {
    return (
      <AvailableDriver
        isCabPooling={!!paramData?.rideType && paramData?.rideType == 'Pooling' ? true : false}
        onPressAvailableCar={_selectedProductForDrivers}
        rideType={paramData?.rideType}
        disabled={disableButton}
        isLoading={isLoading}
        _onUpdateSeatNo={_onUpdateSeatNo}
        updateSeatNo={showFinalUpdatedSeatNo}
        selectedCarOption={selectedCarOption}
        allListedDrivers={allListedDrivers}
        onPressPickUpNow={() => {
          selectedCarOption
            ? updateState({
              // pickUpTimeType: 'now',
              showPaymentModal: true,
              redirectFromNow: true,
              showCarModal: false,
            })
            : showError(strings.PLEASE_SELECT_CAR);
        }}
        onPressPickUplater={() => {
          selectedCarOption
            ? updateState({
              // pickUpTimeType: 'schedule',
              redirectFromNow: false,
              showCarModal: false,
            })
            : showError(strings.PLEASE_SELECT_CAR);
        }}
        availableCarList={availableCarList}
        // onPressAvailableVendor={(item) => onPressAvailableVendor(item)}
        selectedVendorOption={selectedVendorOption}
        _select={() => {
          selectedVendorOption
            ? _getAllCarAndPrices(true)
            : showError(strings.PLEASE_SELECT_OPTION);
        }}
        availableVendors={availableVendors}
        navigation={navigation}
        _onShowBidePriceModal={_onShowBidePriceModal}
      />

    );
  };

  const _redirectToPayement = () => {
    moveToNewScreen(navigationStrings.PAYMENT_OPTIONS, {
      screenName: strings.PAYMENT,
      paramData: paramData,
    })();
  };

  const uploadImage = async (img) => {
    console.log('selected image', img);
    let fileName = img.path.split('Pictures/');
    console.log(fileName, 'fileName...');
    const imgData = new FormData();
    imgData.append('upload_photo', {
      uri: img.path,
      name: fileName[1],
      fileName: fileName[1],
      type: img.mime,
    });
    try {
      const res = await actions.imageUpload(imgData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        'Content-Type': 'multipart/form-data',
      });
      console.log('image upload res', res);
      updateState({
        uploadImages: [...uploadImages, ...[res.image]],
      });
    } catch (error) {
      console.log('erro rraised', error);
      showError(error?.error || error?.message);
    }
  };

  const updateInstruction = (val) => {
    updateState({ taskInstruction: val });
  };

  const onQuestionAnswerSubmit = (item) => {
    updateState({
      allSubmittedAnswers: item,
    });
  };

  //Biding Rice Funcationality>>>>>>>>>>>>>>>>>>

  const _onRidePriceIncerimentDecrimentPrice = async (type) => {
    if (type == 'minus') {
      return await Number(bidRidePrice) - 10
    } else {
      return await Number(bidRidePrice) + 10
    }

  }
  const _onSetBidPrice = async (type) => {
    const selectedBidPrice = await _onRidePriceIncerimentDecrimentPrice(type)
    if (selectedBidPrice < selectedCarOption?.min_tags_price) {
      alert(`you can't select price below ${selectedCarOption?.min_tags_price}`)
      setBidRidePrice(Number(selectedCarOption?.min_tags_price))
    } else {
      setBidRidePrice(selectedBidPrice)
    }
  }



  // create bid Request>>>>>>>>>>>>>>

  const _onCreateBidRequest = () => {
    setBideRequestLoading(true)
    const apiData = {
      product_id: selectedCarOption?.id,
      vendor_id: selectedCarOption?.vendor_id,
      tasks: paramData?.tasks,
      requested_price: Number(bidRidePrice).toFixed(2),
      min_requested_price: selectedCarOption?.min_tags_price || 0,
      max_requested_price: selectedCarOption?.max_tags_price || 0
    }

    const apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }
    console.log(apiData, apiHeader, "apiHeaderapiHeaderapiHeader");
    actions.createBidRequest(apiData, apiHeader).then((res) => {
      const apiResponseData = res?.data
      showSuccess(res?.message)
      setBideRequestLoading(false)
      updateState({
        showBidPriceModal: false
      })
      setTimeout(() => {
        setBidRidePrice(selectedCarOption?.tags_price)
        moveToNewScreen(navigationStrings.BIDINGDRIVERSLIST, { paramData: { ...paramData, apiResponseData } })()
      }, 1000);
    }).catch((error) => {
      showError(error?.message)
      setBideRequestLoading(false)
      updateState({
        showBidPriceModal: false
      })
    })

  }

  // bid price modal show hide
  const _onShowBidePriceModal = (selectedCar) => {
    updateState({
      selectedCarOption: selectedCar,
      showBidPriceModal: true
    })
  }
  const _bidModalClose = () => {
    updateState({
      showBidPriceModal: false,
    });
  }

  //show paymentModal after bid accept 
  useEffect(() => {
    if (paramData?.showPaymentModal) {
      updateState({
        showPaymentModal: paramData?.showPaymentModal,
        showCarModal: false
      })
    }
  }, [paramData])


  // fare price modal Main view
  const _ModalFarePriceMainView = () => {
    return (
      <View>
        <View style={{
          backgroundColor: getColorCodeWithOpactiyNumber(colors.blue.substring(1), 20),
          width: moderateScale(width - 40), alignItems: 'center', paddingVertical: moderateScaleVertical(10), borderRadius: moderateScale(8)
        }}>
          <Text style={{ fontSize: textScale(14) }}>Recommended price {tokenConverterPlusCurrencyNumberFormater(
            Number(selectedCarOption?.tags_price),
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
          )}</Text>
          <Text style={{ fontSize: textScale(14) }}>Travel time ~ {selectedCarOption?.duration} {distance_unit_for_time ? distance_unit_for_time : 'km'}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: moderateScaleVertical(20) }}>
          <TouchableOpacity style={{
            backgroundColor: themeColors?.primary_color,
            flex: 0.15,
            height: moderateScaleVertical(50),
            justifyContent: 'center', alignItems: 'center', borderRadius: moderateScale(8)
          }}
            onPress={() => _onSetBidPrice('minus')}>
            <Text style={{ color: colors.white, fontFamily: fontFamily?.bold }}>- 10</Text>
          </TouchableOpacity>
          <View style={{ flex: 0.7, marginHorizontal: moderateScale(10) }}>
            <TextInputWithUnderlineAndLabel
              txtInputStyle={{ textAlign: 'center' }}
              isEditable={false}
              placeholder={'Recommend fare,adjustable'}
              onChangeText={(text) => setBidRidePrice(text)}
              value={`${Number(bidRidePrice).toFixed(2)}`} />
          </View>
          <TouchableOpacity style={{
            backgroundColor: themeColors?.primary_color,
            flex: 0.15,
            height: moderateScaleVertical(50),
            justifyContent: 'center', alignItems: 'center', borderRadius: moderateScale(8)
          }}
            onPress={() => _onSetBidPrice('plus')}>
            <Text style={{ color: colors.white, fontFamily: fontFamily?.bold }}>+ 10</Text>
          </TouchableOpacity>
        </View>
        <GradientButton
          indicator={bideRequestLoading}
          indicatorColor={colors.white}
          colorsArray={[themeColors?.primary_color, themeColors?.primary_color]}
          textStyle={{
            textTransform: 'none',
            fontSize: textScale(13),
            color: colors.white,
          }}
          onPress={_onCreateBidRequest}
          btnText={`Find Driver`}

        />
      </View>
    )
  }

  const _modalClose = () => {
    updateState({
      isScheduleModalVisible: false,
    });
  };

  const _modalCloseModal = () => {
    updateState({
      isScheduleModalVisible: false,
    });
    _getAllCarAndPrices(false);
  };

  const _openDateTimeModal = () => {
    updateState({
      isScheduleModalVisible: true,
    });
  };

  const _selectPaymentView = () => {

    return (
      <SelectPaymentModalView
        _confirmAndPay={_confirmAndPay}
        slectedDate={
          scheduleDateTime?.slectedDate
            ? scheduleDateTime?.slectedDate
            : pickedUpDate
        }
        isModalVisible={isModalVisible}
        selectedTime={
          scheduleDateTime?.selectedTime
            ? scheduleDateTime?.selectedTime
            : pickedUpTime
        }
        date={date}
        onPressBack={() =>
          redirectFromNow
            ? updateState({ showCarModal: true, showPaymentModal: false })
            : updateState({ showPaymentModal: false })
        }
        totalDistance={totalDistance}
        totalDuration={totalDuration}
        selectedCarOption={selectedCarOption}
        navigation={navigation}
        couponInfo={paramData?.couponInfo}
        updatedPrice={updatedAmount}
        loyalityAmount={loyalityAmount}
        removeCoupon={() => removeCoupon()}
        pickUpTimeType={pickUpTimeType}
        redirectToPayement={() => _redirectToPayement()}
        selectedPayment={selectedPayment}
        pickup_taxi={paramData?.pickup_taxi}
        uploadImage={uploadImage}
        updateInstruction={updateInstruction}
        productFaqQuestionAnswers={selectedCarOption}
        onQuestionAnswerSubmit={(item) => onQuestionAnswerSubmit(item)}
        indicatorLoader={indicatorLoader}
        _openDateTimeModal={_openDateTimeModal}
        allScreenParamsData={paramData}
        distnce_unit={distance_unit_for_time}
        paymentInfoAfterBidAccept={paramData}
      />
    );
  };

  const removeCoupon = () => {
    updateState({
      updatedAmount: null,
      couponInfo: null,
    });
  };

  const _updateState = () => {
    // navigationStrings.CABDRIVERLOCATIONANDDETAIL
    updateState({ isModalVisible: false });
    navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL, {});
  };

  const onCenter = useCallback(() => {
    if (
      paramData?.location?.length > 0 &&
      !!mapRef?.current?.fitToCoordinates
    ) {
      mapRef.current.fitToCoordinates(paramData?.location, {
        edgePadding: {
          right: 80,
          bottom: 500,
          left: 80,
          top: 80,
        },
      });
    }
  }, []);


  const onPressPickUpNow = () => {
    _onMoveNextToPaymentScreen()
  };

  const _onMoveNextToPaymentScreen = () => {
    selectedCarOption
      ? updateState({
        // pickUpTimeType: 'now',
        showPaymentModal: true,
        redirectFromNow: true,
        showCarModal: false,
      })
      : showError(strings.PLEASE_SELECT_CAR);
  }








  const renderDriverTypeMarkes = (type) => {
    switch (type?.vehicle_type_id) {
      case 1:
        return imagePath.icmanMarker;
        break;
      case 2:
        return imagePath.iccycleMarker;
        break;
      case 3:
        return imagePath.icBikeMarker1;
        break;
      case 4:
        return imagePath.icCar;
        break;
      case 5:
        return imagePath.ictruckMarker;
        break;
    }
  };

  return (
    <View style={{ ...styles.container }}>
      <View style={{ flex: 1 }}>
        {!!paramData?.location.length > 0 && (
          <MapView
            ref={mapRef}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            customMapStyle={
              mapStyleGrey
            }
            style={{ height: height / 4 }}
            region={region}
            initialRegion={region}
            tracksViewChanges={false}>
            <CustomCallouts data={paramData?.tasks} />

            {allListedDrivers?.map((coordinate, index) => {
              return (
                <Marker.Animated
                  // tracksViewChanges={agent_location == null}
                  coordinate={{
                    latitude: Number(coordinate?.agentlog?.lat),
                    longitude: Number(coordinate?.agentlog?.long),
                  }}>
                  <Image
                    style={{
                      zIndex: 99,
                      // height:46,
                      // width: 32,
                      transform: [
                        {
                          rotate: `${Number(
                            coordinate?.agentlog?.heading_angle
                              ? coordinate?.agentlog?.heading_angle
                              : 0,
                          )}deg`,
                        },
                      ],
                    }}
                    source={renderDriverTypeMarkes(coordinate)}
                  />
                </Marker.Animated>
              );
            })}

            <MapViewDirections
              origin={paramData?.location[0]}
              waypoints={
                paramData?.location?.length > 2
                  ? paramData?.location.slice(1, -1)
                  : []
              }
              destination={paramData?.location[paramData?.location.length - 1]}
              apikey={profile?.preferences?.map_key}
              strokeWidth={4}
              strokeColor={colors.black}
              optimizeWaypoints={true}
              onStart={(params) => {
                // console.log(Started routing between "${params.origin}" and "${params.destination}");
              }}
              precision={'high'}
              timePrecision={'now'}
              mode={'DRIVING'}
              // maxZoomLevel={20}
              onReady={(result) => {
                console.log(result, 'result>>>>');
                console.log(`Distance: ${result.distance} km`);
                console.log(`Duration: ${result.duration} min.`);
                updateState({
                  totalDistance: distance_unit_for_time
                    ? distance_unit_for_time === 'mile'
                      ? (result.distance * 0.621371).toFixed(2)
                      : result.distance.toFixed(2)
                    : result.distance.toFixed(2),
                  totalDuration: result.duration.toFixed(2),
                });
                // mapRef.current.fitToCoordinates(result.coordinates, {
                //   edgePadding: {
                //     right: width / 3.2,
                //     bottom: height ,
                //     left: width / 3.2,
                //     top: height / 20,
                //   },
                // });
              }}
              onError={(errorMessage) => {
                // console.log('GOT AN ERROR');
              }}
            />
          </MapView>
        )}

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
          }}
          onPress={onCenter}>
          <Image
            style={{
              width: moderateScale(34),
              height: moderateScale(34),
              borderRadius: moderateScale(34 / 2),
            }}
            source={imagePath.mapNavigation}
          />
        </TouchableOpacity>
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={[height / 1.25, height / 1.25]}
          activeOffsetY={[-1, 1]}
          failOffsetX={[-5, 5]}
          animateOnMount={true}
          handleComponent={carModalHeader}
          onChange={() => playHapticEffect(hapticEffects.impactMedium)}>
          <View
            style={{
              flex: 1,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
            }}>
            {!!showCarModal && _selectCarModalView()}
            {!!showPaymentModal && _selectPaymentView()}
          </View>
        </BottomSheet>


        {!!(showCarModal && paramData?.rideType != 'bideRide') && (
          <View
            style={{
              width: "90%",
              position: "absolute",
              bottom: 20,
              marginHorizontal: moderateScale(16),
              flexDirection: 'row',
            }}>


            {availableCarList?.length > 0 && getBundleId() != appIds.appi && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!scheduleDateTime?.selectedDateAndTime ? <Pressable
                  onPress={clearScheduleDate}
                  hitSlop={{
                    left: 40,
                    right: 40,
                    top: 40,
                    bottom: 40
                  }}
                >
                  <Image style={{
                    tintColor: colors.redColor,
                    marginRight: moderateScale(8)
                  }} source={imagePath.closeButton} />
                </Pressable> : null}
                <GradientButton
                  colorsArray={[colors.white, colors.white]}
                  textStyle={{
                    textTransform: "none",
                    fontSize: textScale(13),
                    color: themeColors?.primary_color,
                  }}
                  onPress={_openDateTimeModal}
                  btnText={`${scheduleDateTime?.selectedDateAndTime
                    ? `${scheduleDateTime?.selectedDateAndTime}`
                    : slectedDate || selectedTime
                      ? `${slectedDate} ${selectedTime}`
                      : appIds.jiffex == getBundleId() ? 'Schedule a order' : 'Schedule a ride'
                    }`}
                  btnStyle={styles.scheduleBtnStyle}
                />
              </View>
            )}


            {availableCarList?.length > 0 && (
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={{
                  textTransform: "none",

                  fontSize: textScale(14),

                  marginHorizontal: moderateScale(5),
                }}
                onPress={
                  selectedCarOption?.variant[0]?.price > 0
                    ? onPressPickUpNow
                    : () => { }
                }
                btnText={
                  selectedCarOption?.variant[0]?.price > 0
                    ? `${strings.CONFIRM} ${selectedCarOption?.translation[0]?.title}`
                    : strings.NORIDEAVAILABLE
                }
                containerStyle={{ flex: 1 }}
                btnStyle={{ borderRadius: moderateScale(4) }}
              />
            )}
          </View>
        )}
      </View>



      <View style={styles.topView}>

        <TouchableOpacity
          style={{
            marginTop: moderateScaleVertical(4),
            height: moderateScale(40),
            width: moderateScale(40),
            borderRadius: moderateScale(16),
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() =>
            // navigation.navigate(navigationStrings.PICKUPLOCATION)
            navigation.goBack()
          }>
          <Image
            source={imagePath.backArrowCourier}
            style={{
              tintColor: colors.black,
            }}
          />
        </TouchableOpacity>


      </View>
      {isModalVisibleForPayFlutterWave && (
        <Modal
          onBackdropPress={() =>
            updateState({
              isModalVisibleForPayFlutterWave: false,
              indicatorLoader: false,
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
              height: height / 2,
              justifyContent: 'flex-end',
            }}>
            <PayWithFlutterwave
              onAbort={() =>
                updateState({
                  isModalVisibleForPayFlutterWave: false,
                  indicatorLoader: false,
                })
              }
              onRedirect={handleOnRedirect}
              options={{
                tx_ref: generateTransactionRef(10),
                authorization:
                  appData?.profile?.preferences?.flutterwave_public_key,
                customer: {
                  email: userData?.email,
                  name: userData?.name,
                },
                amount:
                  Number(paymentDataFlutterWave?.total_payable_amount) || 0,
                currency: currencies?.primary_currency?.iso_code,
                payment_options: 'card',
              }}
            />
          </View>
        </Modal>
      )}
      <PaymentProcessingModal isModalVisible={isModalVisible} updateModalState={_updateState} />

      <DatePicker
        modal
        open={isScheduleModalVisible}
        date={scheduleDateTime?.date ? scheduleDateTime?.date : new Date()}
        locale={
          languages?.primary_language?.sort_code
            ? languages?.primary_language?.sort_code
            : "en"
        }
        mode="datetime"
        textColor={isDarkMode ? colors.black : colors.blackB}
        minimumDate={new Date()}
        style={{ width: width - 20, height: height / 4.4 }}
        onConfirm={date => onDateSet(date)}
        onCancel={() => updateState({ isScheduleModalVisible: false })}
      />


      {showBidPriceModal && (
        <BottomViewModal
          isDatetimePicker={true}
          show={showBidPriceModal}
          mainContainView={_ModalFarePriceMainView}
          closeModal={_bidModalClose}
          modalMainContainerStyle={{
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0
          }}
        />
      )}
    </View>
  );
}


export default gestureHandlerRootHOC(ChooseCarTypeAndTime)