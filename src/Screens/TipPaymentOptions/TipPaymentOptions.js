import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import CheckoutPaymentView from '../../Components/CheckoutPaymentView';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  showError,
} from '../../utils/helperFunctions';
import stylesFun from './styles';

import {
  CardField,
  createToken,
  initStripe,
  StripeProvider,
  createPaymentMethod,
  confirmPayment,
  handleNextAction
} from '@stripe/stripe-react-native';
import { generateTransactionRef, payWithCard } from '../../utils/paystackMethod';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import Modal from 'react-native-modal';
import PaymentGateways from '../../Components/PaymentGateways';
import TextTabBar from '../../Components/TextTabBar';
import FastImage from 'react-native-fast-image';
import { isEmpty } from 'lodash';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import useInterval from '../../utils/useInterval';
import axios from 'axios';
import moment from 'moment';

export default function TipPaymentOptions({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const [year, setYear] = useState()
  const [date, setDate] = useState()
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const [btnLoader, setBtnLoader] = useState(false)
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, appStyle, themeColors, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  console.log(year, date, 'year,date')
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily });
  const data = route?.params?.data;
  const userData = useSelector((state) => state?.auth?.userData);
  // console.log(selectedPaymentMethodHandler, 'selectedPaymentMethod');
  const [cardNumber, setCardNUmber] = useState()
  const [cvc, setCvc] = useState()
  const [expiryDate, setExpiryDate] = useState()
  const [accept, isAccept] = useState(false);
  const [isVisibleMtnGateway, setIsVisibleMtnGateway] = useState(false)
  const [mtnGatewayResponse, setMtnGatewayResponse] = useState('')
  const [responseTimer, setResponseTimer] = useState(420)

  const [state, setState] = useState({
    isLoading: false,

    payementMethods: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    tokenInfo: null,
    isModalVisibleForPayFlutterWave: false,
    paymentDataFlutterWave: null,
    cardFill: true,
    savedCardData: [],
    selectedSavedListCardNumber: null,
  });
  const {
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
    payementMethods,
    cardInfo,
    tokenInfo,
    selectedPaymentMethod,
    isLoading,
    cardFill,
    savedCardData,
    selectedSavedListCardNumber
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    updateState({ isLoading: true });
    getListOfPaymentMethod();
  }, []);

  // useEffect(() => {
  //   getSavedCardList()
  // }, [])
  const paymentReponse = (res) => {
    axios({
      method: "get",
      url: res?.responseUrl,
      headers: {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        authorization: `${userData.auth_token}`

      },
    }).then((response) => {
      console.log(response, 'reseserserseeseers');
      if (response?.data?.status == "SUCCESSFUL") {
        setIsVisibleMtnGateway(false)
        navigation.goBack()
      }
    })
      .catch((error) => {
        console.log(error, 'error');
        setMtnGatewayResponse('')
        setIsVisibleMtnGateway(false)
        showError(error?.response?.data?.message)
        navigation.goBack()
      })
  }
  useEffect(() => {
    if (!isVisibleMtnGateway && mtnGatewayResponse) {
      showError('Request TimeOut')
      navigation.goBack()
    }
  }, [isVisibleMtnGateway])

  useInterval(
    () => {

      if (!!isVisibleMtnGateway) { paymentReponse(mtnGatewayResponse); }

    },
    !!isVisibleMtnGateway ? 5000 : null,
  );

  const getSavedCardList = () => {

    actions.getSavedCardsList({},
      {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      },
    )
      .then((res) => {
        console.log('getSavedCardList =>', res);
        updateState({ isLoading: false, isRefreshing: false });
        if (res && res?.data) {
          updateState({ savedCardData: res?.data })
        }
      })
      .catch(errorMethod);
  }

  //Get list of all payment method
  const getListOfPaymentMethod = () => {
    actions
      .getListOfPaymentMethod(
        '/wallet',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'allpayments gate');
        updateState({ isLoading: false, payementMethods: res?.data });
        !isEmpty(res?.data) && res?.data.map((item) => {
          item.id == 50 && getSavedCardList()
        })
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoadingB: false });
    showError(error?.message || error?.error);
  };

  const _createPaymentMethod = async (cardInfo, res2) => {
    console.log(res2, 'cardInfo');
    if (res2) {
      await createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardInfo,
        token: res2
      })
        .then((res) => {
          // updateState({isLoadingB: false});
          console.log('_createPaymentMethod res', res);
          if (res && res?.error && res?.error?.message) {
            showError(res?.error?.message);
          } else {
            console.log(res, 'success_createPaymentMethod ');
            actions
              .getStripePaymentIntent(
                // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
                {
                  payment_option_id: selectedPaymentMethod?.id,
                  action: 'tip',
                  amount: data?.selectedTipAmount,
                  payment_method_id: res?.paymentMethod?.id,
                  order_number: data?.order_number,
                },
                {
                  code: appData?.profile?.code,
                  currency: currencies?.primary_currency?.id,
                  language: languages?.primary_language?.id,
                },
              )
              .then(async (res) => {
                console.log(res, 'getStripePaymentIntent response');
                if (res && res?.client_secret) {
                  const { paymentIntent, error } = await handleNextAction(
                    res?.client_secret,
                  );
                  if (paymentIntent) {
                    console.log(data?.order_number, 'paymentIntent');
                    if (paymentIntent) {
                      actions
                        .confirmPaymentIntentStripe(
                          {
                            payment_option_id: selectedPaymentMethod?.id,
                            action: 'tip',
                            tip_amount: data?.selectedTipAmount,
                            payment_intent_id: paymentIntent?.id,
                            order_number: data?.order_number,
                          },
                          {
                            code: appData?.profile?.code,
                            currency: currencies?.primary_currency?.id,
                            language: languages?.primary_language?.id,
                          },
                        )
                        .then((res) => {
                          updateState({ isLoading: false });
                          if (res && res?.status == 'Success' && res?.data) {
                            Alert.alert('', strings.PAYMENT_SUCCESS, [
                              {
                                text: strings.OK,
                                onPress: () => console.log('Cancel Pressed'),
                              },
                            ]);
                            navigation.navigate(navigationStrings.ORDER_DETAIL);
                          }
                        })
                        .catch((error) => console.log(error, 'errrorrrer'));
                    }
                  } else {
                    updateState({ isLoading: false });
                    console.log(error, 'error');
                    showError(error?.message || 'payment failed');
                  }
                } else {
                  updateState({ isLoadingB: false });
                }
              })
              .catch(errorMethod);
          }
        })
        .catch(errorMethod);
    }
  };

  const openPayTabs = async (data) => {
    data['serverKey'] = appData?.profile?.preferences?.paytab_server_key;
    data['clientKey'] = appData?.profile?.preferences?.paytab_client_key;
    data['profileID'] = appData?.profile?.preferences?.paytab_profile_id;
    data['currency'] = currencies?.primary_currency?.iso_code;
    data['merchantname'] = appData?.profile?.company_name;
    data['countrycode'] = appData?.profile?.country?.code;
    console.log('openPayTabsdata', data);

    try {
      const res = await payWithCard(data);
      console.log('payWithCard res++++', res);
      if (res && res?.transactionReference) {
        let apiData = {
          payment_option_id: data?.payment_option_id,
          transaction_id: res?.transactionReference,
          amount: data?.total_payable_amount,
          order_number: data?.order_number,
          action: 'tip',
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
              navigation.goBack();
            }
          })
          .catch(errorMethod);
      }
    } catch (error) {
      console.log('error raised', error);
    }
  };

  //flutter wave
  var redirectTimeout;
  const handleOnRedirect = (data) => {
    console.log('flutterwaveresponse', data);
    clearTimeout(redirectTimeout);
    redirectTimeout = setTimeout(() => {
      // do something with the result
      updateState({ isModalVisibleForPayFlutterWave: false });
    }, 200);
    try {
      if (data && data?.transaction_id) {
        let apiData = {
          payment_option_id: paymentDataFlutterWave?.payment_option_id,
          transaction_id: data?.transaction_id,
          amount: paymentDataFlutterWave?.total_payable_amount,
          order_number: paymentDataFlutterWave?.order_number,
          action: 'tip',
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
            console.log(res, 'resfrompaytab');
            if (res && res?.status == 'Success') {
              navigation.goBack();
            } else {
              redirectTimeout = setTimeout(() => {
                // do something with the result
                updateState({ isModalVisibleForPayFlutterWave: false });
              }, 200);
            }
          })
          .catch(errorMethod);
      } else {
        redirectTimeout = setTimeout(() => {
          // do something with the result
          updateState({ isModalVisibleForPayFlutterWave: false });
        }, 200);
      }
    } catch (error) {
      console.log('error raised', error);
      redirectTimeout = setTimeout(() => {
        // do something with the result
        updateState({ isModalVisibleForPayFlutterWave: false });
      }, 200);
    }
  };
  //flutter wave
  const checkInputHandler = (type, data) => {
    if (type === 'Card Number') {

      let re = data.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardNUmber(re)
    }
    if (type === 'ExpiryDate') {

      let ed = data.replace(/^([1-9]\/|[2-9])$/g, '0$1/' // To handle 3/ > 03/
      ).replace(
        /^(0[1-9]{1}|1[0-2]{1})$/g, '$1/' // 11 > 11/
      ).replace(
        /^([0-1]{1})([3-9]{1})$/g, '0$1/$2' // 13 > 01/3
      ).replace(
        /^(\d)\/(\d\d)$/g, '0$1/$2' // To handle 1/11 > 01/11
      ).replace(
        /^(0?[1-9]{1}|1[0-2]{1})([0-9]{2})$/g, '$1/$2' // 141 > 01/41
      ).replace(
        /^([0]{1,})\/|[0]{1,}$/g, '0' // To handle 0/ > 0 and 00 > 0
      ).replace(
        /[^\d\/]|^[\/]{0,}$/g, '' // To allow only numbers and /
      ).replace(
        /\/\//g, '/').trim()
      setExpiryDate(ed)

    }
    if (type === 'CVC') {
      setCvc(data)
    }
    if (type === 'Year') {
      let year = data.replace(/^\d{5}$/).trim()
      setYear(year)
    }
    if (type === 'Date') {
      let year = data.replace(/^([1-9]\/|[2-9])$/g, '0$1').trim()
      setDate(year)
    }
  }

  const deleteCard = (item) => {
    Alert.alert('', strings.DELETE_CARD, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      {
        text: strings.CONFIRM,
        onPress: () => {
          deleteSaveCard(item)
        },
      },
    ]);
  }
  const deleteSaveCard = (item) => {
    let query = `?id=${item?.id}`
    actions.deleteCard(query, {}, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    })
      .then((res) => {

        console.log(res, 'resereserseersre')
        alert(res?.message)
        getSavedCardList()

      })
      .catch((err) => { console.log(err, 'errorrrrrrrrrr') })
  }

  const _isCheck = () => {
    isAccept(!accept)
  }

  const selectSavedCard = (data, inx) => {
    {
      selectedSavedListCardNumber && selectedSavedListCardNumber?.id == data?.id
        ? (updateState({ selectedSavedListCardNumber: null }))
        : updateState({ selectedSavedListCardNumber: data });
    }
  };
  const renderSavedCardList = ({ item, index }) => {
    console.log("renderSavedCardList =>", index)
    const expDate = item?.expiration
    // const expDate = item?.expiration.slice(0, 4) + "/" + item?.expiration.slice(4)
    return (
      <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => selectSavedCard(item, index)}
          style={{
            marginVertical: moderateScaleVertical(8), borderRadius: moderateScaleVertical(13),
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Image
            source={
              selectedSavedListCardNumber &&
                selectedSavedListCardNumber?.id == item.id
                ? imagePath.radioActive
                : imagePath.radioInActive
            }
          />
          <View style={{ marginLeft: moderateScale(10) }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.caseOnDeliveryText,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.caseOnDeliveryText
                }>
                {'Card No:'}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.caseOnDeliveryText,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.caseOnDeliveryText
                }>
                {item?.card_hint}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.caseOnDeliveryText,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.caseOnDeliveryText
                }>
                {'Exp Date:'}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.caseOnDeliveryText,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.caseOnDeliveryText
                }>
                {expDate}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteCard(item)}>
          <Image source={imagePath?.delete} />
        </TouchableOpacity>
      </View>

    )
  }


  //Change Payment method/ Navigate to payment screen
  const selectPaymentOption = async () => {
    console.log(selectedPaymentMethod, "selectedPaymentMethodselectedPaymentMethod")
    if (selectedPaymentMethod) {
      if (
        selectedPaymentMethod?.id == 4 &&
        selectedPaymentMethod?.off_site == 0
      ) {
        if (cardInfo) {
          updateState({ isLoading: true });
          await createToken({ ...cardInfo, type: 'Card' })
            .then((res) => {
              if (res && res?.token && res.token?.id) {
                _createPaymentMethod(cardInfo, res.token?.id);
              } else {
                updateState({ isLoading: false });
              }
            })
            .catch((err) => {
              updateState({ isLoading: false });
              errorMethod;
            });
        } else {
          updateState({ isLoading: false });
          showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
      } else {
        if (selectedPaymentMethod?.id == 27) {
          let paymentData = {
            payment_option_id: selectedPaymentMethod?.id,
            total_payable_amount: data?.selectedTipAmount,
            order_number: data?.order_number,
          };
          setTimeout(() => {
            openPayTabs(paymentData);
          }, 500);
        } else if (selectedPaymentMethod?.id == 30) {
          let paymentData = {
            payment_option_id: selectedPaymentMethod?.id,
            total_payable_amount: data?.selectedTipAmount,
            order_number: data?.order_number,
            selectedPayment: selectedPaymentMethod,
          };
          updateState({
            isModalVisibleForPayFlutterWave: true,
            paymentDataFlutterWave: paymentData,
          });
        } else
          if (
            (selectedPaymentMethod?.id == 49 || selectedPaymentMethod?.id == 50 || selectedPaymentMethod?.id == 53) &&
            selectedPaymentMethod?.off_site == 1
          ) {
            _paymentWithPlugnPayMethods()
          }
          else
            if (
              (selectedPaymentMethod?.id == 48) &&
              selectedPaymentMethod?.off_site == 1
            ) {
              mtnGateway()
            }
            else {
              console.log('imhere');
              setTimeout(() => {
                updateState({ isLoading: false });
                _webPayment(selectedPaymentMethod);
              }, 1000);
            }
      }
    } else {
      showError(strings.SELECTPAYEMNTMETHOD);
    }
  };

  //Select/ Update payment method
  const selectPaymentMethod = (data, inx) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == data?.id
        ? updateState({ selectedPaymentMethod: null })
        : updateState({ selectedPaymentMethod: data });
    }
  };

  const mtnGateway = () => {
    setBtnLoader(true)
    let dataForGatweay = {}

    dataForGatweay['amount'] = data?.selectedTipAmount
    dataForGatweay['currency'] = currencies?.primary_currency?.iso_code
    dataForGatweay['order_no'] = data?.order_number
    dataForGatweay['subscription_id'] = ''
    dataForGatweay['from'] = 'tip'
    actions.mtnGateway(dataForGatweay, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    })
      .then((res) => {
        console.log(res, 'rsrseereeseresre')
        setBtnLoader(false)
        if (res?.status == 'Success') {
          // updateState({ isLoading: false })
          setIsVisibleMtnGateway(true)
          setMtnGatewayResponse(res)
          paymentReponse(res)
          // navigation.goBack()

        }
      })
      .catch((err) => {
        console.log(err, 'ererrerererere')
        setBtnLoader(false)
        showError(err?.message)
      })
  }
  const _paymentWithPlugnPayMethods = () => {

    let selectedMethod = selectedPaymentMethod.code;
    let CardNumber = cardNumber.split(" ").join("")
    let expirydate
    if (selectedPaymentMethod?.id == 50) {

      expirydate = year.concat(date)
      console.log(expirydate, 'expirydate')
    }
    else {
      expirydate = expiryDate
    }
    let queryData = `/${selectedMethod}?amount=${data?.selectedTipAmount}&cv=${cvc}&dt=${expirydate}&payment_option_id=${selectedPaymentMethod?.id}&cno=${CardNumber}&order_number=${data?.order_number}&action=tip`;
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
        if (
          res &&
          (res?.status == 'Success' || res?.status == 200)

        ) {
          navigation.navigate(navigationStrings.ORDER_DETAIL);
        }
      })
      .catch((err) => {
        console.log('Error>>>>>>>>>>>', err)
        showError(err?.msg)
      })
  }

  const _checkoutPayment = (token) => {
    console.log(token, 'tokenOfCheckout');

    let selectedMethod = selectedPaymentMethod.code.toLowerCase();
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${data?.selectedTipAmount}&payment_option_id=${selectedPaymentMethod?.id}&token=${token}&order_number=${data?.order_number}&action=tip`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'responseFromServer');
        updateState({ isLoading: false, isRefreshing: false });
        if (res && res?.status == 'Success' && res?.data) {
          Alert.alert('', strings.PAYMENT_SUCCESS, [
            {
              text: strings.OK,
              onPress: () => console.log('Cancel Pressed'),
              // style: 'destructive',
            },
          ]);
          navigation.navigate(navigationStrings.ORDER_DETAIL);
        }
      })
      .catch(errorMethod);
  };

  const _renderItemPayments = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => selectPaymentMethod(item, index)}
          key={index}
          style={[styles.caseOnDeliveryView]}>
          <Image
            source={
              selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                ? imagePath.radioActive
                : imagePath.radioInActive
            }
          />
          <Text
            style={
              isDarkMode
                ? [styles.caseOnDeliveryText, { color: MyDarkTheme.colors.text }]
                : styles.caseOnDeliveryText
            }>
            {appIds?.qdelo === getBundleId() ? item?.id == 10 ? `Online / ${(item?.title_lng ? item?.title_lng : item?.title)}` : (item?.title_lng ? item?.title_lng : item?.title) : item?.title_lng ? item?.title_lng : item?.title}

          </Text>
        </TouchableOpacity>
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id == 4
        ) && (
            <View>
              <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: colors.white,
                  textColor: colors.black,
                }}
                style={{
                  width: '100%',
                  height: 50,
                  marginVertical: 10,
                }}
                onCardChange={(cardDetails) => {
                  _onChangeStripeData(cardDetails);
                }}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          )}
        {/* {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 1 &&
          (selectedPaymentMethod?.id === 49 || selectedPaymentMethod?.id === 50 ||selectedPaymentMethod?.id == 53)
        ) && (
            <PaymentGateways
            isCardNumber={cardNumber}
            cvc={cvc}
            expiryDate={expiryDate}
            year={year}
            onChangeExpiryDateText={(data) => checkInputHandler('ExpiryDate', data)}
            onChangeText={(data) => checkInputHandler('Card Number', data)}
            onChangeCvcText={(data) => checkInputHandler('CVC', data)}
            onChangeYearText={(data) => checkInputHandler('Year', data)}
            onChangeDateText={(data) => checkInputHandler('Date', data)}
            paymentid={selectedPaymentMethod?.id}
            eDate={date}
            />
          )} */}
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 1 &&
          (selectedPaymentMethod?.id === 49 || selectedPaymentMethod?.id == 50)
        ) && (
            selectedPaymentMethod?.id == 50 ?
              <>
                <View style={{
                  flexDirection: 'row',
                  marginTop: moderateScale(10),
                  justifyContent: 'space-around'
                }}>
                  <TextTabBar
                    text={'Card Fill'}
                    isActive={cardFill}
                    containerStyle={
                      isDarkMode
                        ? { backgroundColor: MyDarkTheme.colors.background }
                        : { backgroundColor: colors.white, width: width / 2 }
                    }
                    onPress={() => updateState({ cardFill: true })}
                    activeStyle={{ color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}
                  />
                  <TextTabBar
                    text={'Saved Card'}
                    isActive={!cardFill}
                    containerStyle={
                      isDarkMode
                        ? { backgroundColor: MyDarkTheme.colors.background }
                        : { backgroundColor: colors.white, width: width / 2 }
                    }
                    onPress={() => updateState({ cardFill: false })}
                    activeStyle={{ color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}
                  />
                </View>
                {
                  cardFill ?
                    <>
                      <PaymentGateways
                        isCardNumber={cardNumber}
                        cvc={cvc}
                        expiryDate={expiryDate}
                        year={year}
                        onChangeExpiryDateText={(data) => checkInputHandler('ExpiryDate', data)}
                        onChangeText={(data) => checkInputHandler('Card Number', data)}
                        onChangeCvcText={(data) => checkInputHandler('CVC', data)}
                        onChangeYearText={(data) => checkInputHandler('Year', data)}
                        onChangeDateText={(data) => checkInputHandler('Date', data)}
                        paymentid={selectedPaymentMethod?.id}
                        eDate={date}
                      />
                      <View style={{ flexDirection: "row", alignItems: 'center', }}>
                        <TouchableOpacity
                          onPress={_isCheck}
                          style={{

                            marginRight: 10,
                          }}>
                          <FastImage
                            style={{
                              width: moderateScale(15),
                              height: moderateScale(15),
                            }}
                            tintColor={
                              isDarkMode ? MyDarkTheme.colors.text : colors.black
                            }
                            source={
                              accept
                                ? imagePath.checkBox2Active
                                : imagePath.checkBox2InActive
                            }
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                        <Text> Save Card</Text>
                      </View>


                    </>
                    :
                    <FlatList
                      keyExtractor={(itm, inx) => String(inx)}
                      data={savedCardData}
                      renderItem={renderSavedCardList}
                      ListEmptyComponent={() =>
                        <View>
                          <Text style={{ textAlign: 'center' }}>
                            {" No Saved Cards"}
                          </Text>
                        </View>
                      }
                    />

                }
              </>
              :
              <PaymentGateways
                isCardNumber={cardNumber}
                cvc={cvc}
                expiryDate={expiryDate}
                year={year}
                onChangeExpiryDateText={(data) => checkInputHandler('ExpiryDate', data)}
                onChangeText={(data) => checkInputHandler('Card Number', data)}
                onChangeCvcText={(data) => checkInputHandler('CVC', data)}
                onChangeYearText={(data) => checkInputHandler('Year', data)}
                onChangeDateText={(data) => checkInputHandler('Date', data)}
                paymentid={selectedPaymentMethod?.id}
                eDate={date}
              />
          )}
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 17
        ) && (
            <CheckoutPaymentView
              cardTokenized={(e) => {
                if (e.token) {
                  _checkoutPayment(e.token);
                }
              }}
              cardTokenizationFailed={(e) => {
                setTimeout(() => {
                  updateState({ isLoading: false });
                  showError(strings.INVALID_CARD_DETAILS);
                }, 1000);
              }}
              onPressSubmit={(res) => {
                updateState({
                  isLoading: true,
                });
              }}
              btnTitle={strings.SELECT}
              isSubmitBtn
              submitBtnStyle={{
                width: '100%',
                height: moderateScale(45),
              }}
            />
          )}
      </>
    );
  };

  const _onChangeStripeData = (cardDetails) => {
    if (cardDetails?.complete) {
      updateState({
        cardInfo: {
          brand: cardDetails.brand,
          complete: true,
          expiryMonth: cardDetails?.expiryMonth,
          expiryYear: cardDetails?.expiryYear,
          last4: cardDetails?.last4,
          postalCode: cardDetails?.postalCode,
        },
      });
    } else {
      updateState({ cardInfo: null });
    }
  };

  const _webPayment = () => {
    let selectedMethod = selectedPaymentMethod.code.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;

    updateState({ isLoading: true });
    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${data?.selectedTipAmount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&payment_option_id=${selectedPaymentMethod?.id}&order_number=${data?.order_number}&action=tip`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, "ress?>>>");
        updateState({ isLoading: false });
        if (
          res &&
          (res?.status == 'Success' || res?.status == '200') &&
          (res?.data || res?.payment_link || res?.redirect_url)
        ) {
          console.log('generate payment url', res.data);
          let sendingData = {
            id: selectedPaymentMethod?.id,
            title: selectedPaymentMethod?.title,
            screenName: navigationStrings.ORDER_DETAIL,
            paymentUrl: res.data || res?.payment_link || res?.redirect_url,
            action: 'tip',
            tip_amount: data?.selectedTipAmount,
            order_number: data?.order_number,
          };
          navigation.navigate(navigationStrings.ALL_IN_ONE_PAYMENTS, {
            data: sendingData,
          });
          // navigation.navigate(navigationStrings.WEBPAYMENTS, {
          //   paymentUrl: res?.data,
          //   paymentTitle: selectedPaymentMethod?.title,
          //   redirectFrom: 'tip',
          // tip_amount: data?.selectedTipAmount,
          // order_number: data?.order_number,
          // });
        }
        else if (res?.status == '201') {
          showError(res?.message || '')
        }
      })
      .catch(errorMethod);
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={strings.PAYMENT}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.backgroundGrey }
        }
      />
      <View style={{ height: 1, backgroundColor: colors.borderLight }} />
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{ marginHorizontal: moderateScaleVertical(20) }}>
        <FlatList
          data={payementMethods}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          // horizontal
          style={{ marginTop: moderateScaleVertical(10) }}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItemPayments}
          ListEmptyComponent={() =>
            !isLoading && (
              <Text style={{ textAlign: 'center' }}>
                {strings.NO_PAYMENT_METHOD}
              </Text>
            )
          }
        />
      </KeyboardAwareScrollView>
      {selectedPaymentMethod == null || selectedPaymentMethod.id != 17 ? (
        <View
          style={{
            marginHorizontal: moderateScaleVertical(20),
            marginBottom: 65,
          }}>
          <GradientButton
            textStyle={styles.textStyle}
            onPress={selectPaymentOption}
            marginTop={moderateScaleVertical(10)}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.SELECT}
            indicator={btnLoader}
          />
        </View>
      ) : (
        <></>
      )}
      <Modal
        onBackdropPress={() =>
          updateState({ isModalVisibleForPayFlutterWave: false })
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
          {!!appData?.profile?.preferences?.flutterwave_public_key && <PayWithFlutterwave
            onAbort={() =>
              updateState({ isModalVisibleForPayFlutterWave: false })
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
              amount: paymentDataFlutterWave?.total_payable_amount,
              currency: currencies?.primary_currency?.iso_code,
              payment_options: 'card',
            }}
          />}
        </View>
      </Modal>
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
          <Text style={{ color: isDarkMode ? 'white' : themeColors?.primary_color, fontSize: textScale(15), padding: moderateScale(10) }}>Waiting for response ....</Text>
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
    </WrapperContainer>
  );
}
