// import stripe from 'tipsi-stripe';
import {
  CardField,
  createPaymentMethod,
  createToken,
  initStripe,
  StripeProvider,
  handleNextAction
} from '@stripe/stripe-react-native';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import RazorpayCheckout from 'react-native-razorpay';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';
import CheckoutPaymentView from '../../Components/CheckoutPaymentView';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import PaymentGateways from '../../Components/PaymentGateways';
import TextTabBar from '../../Components/TextTabBar';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import {
  currencyNumberFormatter,
  tokenConverterPlusCurrencyNumberFormater,
} from '../../utils/commonFunction';
import { getImageUrl, otpTimerCounter, showError, showSuccess } from '../../utils/helperFunctions';
import { generateTransactionRef, payWithCard } from '../../utils/paystackMethod';
import stylesFun from './styles';
import { isEmpty } from 'lodash';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';
import axios from 'axios';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import useInterval from '../../utils/useInterval';
import moment from 'moment';

export default function AddMoney({ navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const [cardNumber, setCardNUmber] = useState()
  const [cvc, setCvc] = useState()
  const [expiryDate, setExpiryDate] = useState()
  const [isVisibleMtnGateway, setIsVisibleMtnGateway] = useState(false)
  const[responseTimer,setResponseTimer] = useState(420)

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    amount: '',
    data: [
      { id: 0, amount: 10 },
      { id: 1, amount: 20 },
      { id: 2, amount: 50 },
      { id: 3, amount: 100 },
    ],
    allAvailAblePaymentMethods: [],
    selectedPaymentMethod: null,
    isLoadingB: false,
    cardInfo: null,
    isModalVisibleForPayFlutterWave: false,
    paymentDataFlutterWave: null,
    cardFill: true,
    savedCardData: [],
    selectedSavedListCardNumber: null,
    btnLoader: false
  });
  //update your state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Redux Store Data
  const { appData, themeColors, appStyle, currencies, languages } = useSelector((state) => state?.initBoot);
  const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};
  const userData = useSelector((state) => state.auth.userData);
  const { preferences } = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });
  const [year, setYear] = useState()
  const [date, setDate] = useState()
  const [accept, isAccept] = useState(false);
  const[mtnGatewayResponse,setMtnGatewayResponse] = useState('')
  const commonStyles = commonStylesFun({ fontFamily });
  const {
    allAvailAblePaymentMethods,
    selectedPaymentMethod,
    amount,
    isLoadingB,
    cardInfo,
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
    cardFill,
    savedCardData,
    selectedSavedListCardNumber,
    btnLoader
  } = state;
  useEffect(() => {
    getListOfPaymentMethod();
  }, []);
  // useEffect(() => {
  //   getSavedCardList()
  // }, [])
  useEffect(() => {
    if (
      preferences &&
      preferences?.stripe_publishable_key != '' &&
      preferences?.stripe_publishable_key != null
    ) {
      initStripe({
        publishableKey: preferences?.stripe_publishable_key,
        merchantIdentifier: 'merchant.identifier',
      });
    }
  }, []);

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
        console.log('payment list options', res.data);
        updateState({ isLoadingB: false, isRefreshing: false });
        if (res && res?.data) {
          updateState({ allAvailAblePaymentMethods: res?.data });
          !isEmpty(res?.data) && res?.data.map((item) => {
            item.id == 50 && getSavedCardList()
          })
        }
      })
      .catch(errorMethod);
  };

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

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, 'errorerrorerror');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      isModalVisibleForPayFlutterWave: false,
    });
    showError(error?.error?.reason || error?.message || error?.error);
  };

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    return navigation.navigate(screenName, { data });
  };
  //Onchange Texinput function
  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  //Select Amount
  const chooseAmount = (item) => {
    let addedAmount = item.amount;
    updateState({ amount: addedAmount });
  };

  //Render all Available amounts
  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={() => chooseAmount(item)}>
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : '#fff',
            flexDirection: 'row',
            paddingVertical: moderateScaleVertical(8),
          }}>
          <View
            style={
              isDarkMode
                ? [
                  styles.selectAmountCon,
                  {
                    backgroundColor: MyDarkTheme.colors.lightDark,
                    borderColor: MyDarkTheme.colors.text,
                  },
                ]
                : styles.selectAmountCon
            }>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.chooseAddMoney, { color: MyDarkTheme.colors.text }]
                  : styles.chooseAddMoney
              }>
              {`+ ${currencies?.primary_currency?.symbol}`}{' '}
              {currencyNumberFormatter(
                item.amount,
                appData?.profile?.preferences?.digit_after_decimal,
              )}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


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
  const _selectPaymentMethod = (item) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == item?.id
        ? updateState({ selectedPaymentMethod: null })
        : updateState({ selectedPaymentMethod: item });
      setCardNUmber("")
      setYear("")
      setDate("")
      setExpiryDate("")
      setCvc("")
    }
  };
  const _renderItemPayments = ({ item, index }) => {
 
    return (
      <>
        <TouchableOpacity onPress={() => _selectPaymentMethod(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: moderateScaleVertical(5),
            }}>
            <Image
              source={
                selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                  ? imagePath.radioActive
                  : imagePath.radioInActive
              }
            />
            <Text
              style={[
                styles.title,
                {
                  color:
                    selectedPaymentMethod &&
                      selectedPaymentMethod?.id == item.id
                      ? isDarkMode
                        ? colors.white
                        : colors.blackC
                      : colors.textGreyJ,
                },
              ]}>
              {appIds?.qdelo === getBundleId() ? item?.id == 10 ? `Online / ${(item?.title_lng ? item?.title_lng : item?.title)}` : (item?.title_lng ? item?.title_lng : item?.title) : item?.title_lng ? item?.title_lng : item?.title}
            </Text>
          </View>
        </TouchableOpacity>

        {selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 4 && (
            <View>
              <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: '#FFFFFF',
                  textColor: '#000000',
                }}
                style={{
                  width: '100%',
                  height: 50,
                  marginVertical: 10,
                }}
                onCardChange={(cardDetails) => {
                  // console.log('cardDetails', cardDetails);
                  _onChangeStripeData(cardDetails);
                }}
                onFocus={(focusedField) => {
                  console.log('focusField', focusedField);
                }}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          )}
        {console.log(selectedPaymentMethod, "selectedPaymentMethod>>>>")}

        {selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 17 && (
            <CheckoutPaymentView
              cardTokenized={(e) => {
                if (e.token) {
                  _checkoutPayment(e.token);
                }
              }}
              cardTokenizationFailed={(e) => {
                setTimeout(() => {
                  updateState({ isLoadingB: false });
                  showError(strings.INVALID_CARD_DETAILS);
                }, 1000);
              }}
              onPressSubmit={(res) => {
                updateState({
                  isLoadingB: true,
                });
              }}
              btnTitle={strings.ADD}
              isSubmitBtn
              submitBtnStyle={{
                width: '100%',
                height: moderateScale(40),
              }}
            />
          )}
        {/* {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 1 &&
          (selectedPaymentMethod?.id === 49 || selectedPaymentMethod?.id === 50 || selectedPaymentMethod?.id === 53)
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
      </>
    );
  };

  const _onChangeStripeData = (cardDetails) => {
    if (cardDetails?.complete) {
      updateState({
        cardInfo: cardDetails,
      });
    } else {
      updateState({ cardInfo: null });
    }
  };

  const renderRazorPay = () => {
    let options = {
      description: 'Payment for your order',
      image: getImageUrl(
        appData?.profile?.logo?.image_fit,
        appData?.profile?.logo?.image_path,
        '1000/1000',
      ),
      currency: currencies?.primary_currency?.iso_code,
      key: preferences?.razorpay_api_key, // Your api key
      amount: amount * 100,
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
        if (res?.razorpay_payment_id) {
          const data = {};
          data['amount'] = amount;
          data['transaction_id'] = res?.razorpay_payment_id;
          actions
            .walletCredit(data, {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
            })
            .then((res) => {
              Alert.alert('', strings.PAYMENT_SUCCESS, [
                {
                  text: strings.OK,
                  onPress: () => console.log('Okay pressed'),
                },
              ]);
              navigation.navigate(navigationStrings.WALLET);
            })
            .catch(errorMethod);
        }
      })
      .catch(errorMethod);
  };
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
  const openPayTabs = async (data) => {
    console.log(appData, 'openPayTabsappData');
    console.log('openPayTabsdata', data);

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
          transaction_id: res?.transactionReference,
          amount: data?.total_payable_amount,
          action: 'wallet',
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
      console.log(response,isVisibleMtnGateway, 'reseserserseeseers');
      if (response?.data?.status ==  "SUCCESSFUL") {
        setIsVisibleMtnGateway(false)
        showSuccess(response?.data?.message)
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
  useEffect(()=>{
    if(!isVisibleMtnGateway && mtnGatewayResponse) {
      showError('Request TimeOut')
      navigation.goBack()
    }
  },[isVisibleMtnGateway])

  useInterval(
    () => {
     if(!!isVisibleMtnGateway) 
     {  paymentReponse(mtnGatewayResponse);}
    },
    !!isVisibleMtnGateway ? 3000 : null,
  );

  const mtnGateway = () => {
    updateState({ btnLoader: true })
    let data = {}

    data['amount'] = amount
    data['currency'] = currencies?.primary_currency?.iso_code
    data['order_no'] = ''
    data['subscription_id'] = ''
    data['from'] = 'wallet'
    actions.mtnGateway(data, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    })
      .then((res) => {
        console.log(res, 'rsrseereeseresre')
        updateState({ btnLoader: false })
        if (res?.status == 'Success') {
          setIsVisibleMtnGateway(true)
          setMtnGatewayResponse(res)
          paymentReponse(res)
          // navigation.goBack()
        }
      })
      .catch((err) => {
        console.log(err, 'ererrerererere')
        updateState({ btnLoader: false })
        showError(err?.message)
      })
  }

  const _addMoneyToWallet = () => {
    console.log(
      selectedPaymentMethod,
      'selectedPaymentMethodselectedPaymentMethod',
    );
 
    if (amount == '') {
      showError(strings.PLEASE_ENTER_OR_SELECT_AMOUNT);
      return;
    }
    // if (!selectedPaymentMethod) {
    //   showError(strings.PLEASE_SELECT_PAYMENT_METHOD);
    //   return;
    // }
    if (
      selectedPaymentMethod?.off_site == 0 &&
      selectedPaymentMethod?.id == 10
    ) {
      renderRazorPay();
      return;
    }

    if (selectedPaymentMethod?.id == 27) {
      let paymentData = {
        payment_option_id: selectedPaymentMethod?.id,
        total_payable_amount: amount,
      };
      openPayTabs(paymentData);
      return;
    }
    if (selectedPaymentMethod?.id == 30) {
      let paymentData = {
        payment_option_id: selectedPaymentMethod?.id,
        total_payable_amount: amount,
        selectedPayment: selectedPaymentMethod,
      };
      updateState({
        isModalVisibleForPayFlutterWave: true,
        paymentDataFlutterWave: paymentData,
      });
      return;
    }
    if (selectedPaymentMethod?.id == 48) {
      mtnGateway()
      return;
    }
    if (selectedPaymentMethod?.off_site == 1 && (selectedPaymentMethod?.id !== 49 && selectedPaymentMethod?.id !== 50 && selectedPaymentMethod?.id != 53)) {
      _webPayment();
      return;
    }
    if (selectedPaymentMethod?.id == 49 || selectedPaymentMethod?.id == 50 || selectedPaymentMethod?.id === 53) {
      _paymentWithPlugnPayMethods()
      return;
    }

    _offineLinePayment();
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
          action: 'wallet',
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



  const _paymentWithPlugnPayMethods = () => {

    updateState({ btnLoader: true })
    let selectedMethod = selectedPaymentMethod.code;
    let CardNumber = cardNumber.split(" ").join("") || " "
    let expirydate
    if (selectedPaymentMethod?.id == 50) {

      expirydate = year.concat(date) || " "
      console.log(expirydate, 'expirydate')
    }
    else {
      expirydate = expiryDate || " "
    }
    let savedCardId = selectedSavedListCardNumber && selectedSavedListCardNumber.id || ''
    let saveCard = !!accept ? 1 : 0
    let queryData = `/${selectedMethod}?amount=${amount}&cv=${cvc}&dt=${expirydate}&cno=${CardNumber}&card_id=${savedCardId}&action=wallet&come_from=app`;
    if (selectedPaymentMethod?.id == 50 && !!CardNumber) { queryData = queryData + `&save_card=${saveCard}` }
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
          updateState({ btnLoader: false })
          navigation.navigate(navigationStrings.WALLET);
        }
      })
      .catch((err) => {
        updateState({ btnLoader: false })
        console.log('Error>>>>>>>>>>>', err)
        showError(err?.msg)
      })
  }
  const _checkoutPayment = (token) => {
    if (amount == '') {
      updateState({ isLoadingB: false });
      showError(strings.PLEASE_ENTER_OR_SELECT_AMOUNT);
    } else {
      let selectedMethod = selectedPaymentMethod.title.toLowerCase();
      actions
        .openPaymentWebUrl(
          `/${selectedMethod}?amount=${amount}&payment_option_id=${selectedPaymentMethod?.id}&token=${token}&action=wallet`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          console.log(res, 'resresresresres');
          updateState({ isLoadingB: false, isRefreshing: false });
          if (res && res?.status == 'Success' && res?.data) {
            Alert.alert('', strings.PAYMENT_SUCCESS, [
              {
                text: strings.OK,
                onPress: () => console.log('Cancel Pressed'),
                // style: 'destructive',
              },
            ]);
            navigation.navigate(navigationStrings.WALLET);
          }
        })
        .catch(errorMethod);
    }
  };

  const _webPayment = () => {
    let queryData
    let selectedMethod = selectedPaymentMethod.code;
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/wallet`;
    queryData = `/${selectedMethod}?amount=${amount}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&payment_option_id=${selectedPaymentMethod?.id}&action=wallet`
    if (selectedPaymentMethod?.id == 57) { queryData = queryData + `&come_from=app` }
    updateState({ isLoadingB: true });
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
        updateState({ isLoadingB: false, isRefreshing: false });
        // const URL = queryString.parseUrl(res.data);
        console.log('res==>>>>', res);
        if (
          res &&
          (res?.status == 'Success' || res?.status == '200') &&
          (res?.data || res?.payment_link || res?.redirect_url)
        ) {
          let sendingData = {
            id: selectedPaymentMethod.id,
            title: selectedPaymentMethod.title,
            screenName: navigationStrings.WALLET,
            paymentUrl: res?.data || res?.payment_link || res?.redirect_url,
            action: 'wallet',
          };

          navigation.navigate(navigationStrings.ALL_IN_ONE_PAYMENTS, {
            data: sendingData,
          });
        }
        else if (res?.status == '201') {
          showError(res?.message || '')
        }
      })
      .catch(errorMethod);
  };
  const _createPaymentMethod = async (cardInfo, res2) => {
    console.log(cardInfo, res2, 'hgreutiergtry')
    if (res2) {
      await createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardInfo,
        token: res2,
      })
        .then((res) => {
          // updateState({isLoadingB: false});
          console.log('_createPaymentMethod res', res);
          if (res && res?.error && res?.error?.message) {
            showError(res?.error?.message);
          } else {
            console.log(res, 'success_createPaymentMethod');
            actions
              .getStripePaymentIntent(
                // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
                {
                  payment_option_id: selectedPaymentMethod?.id,
                  action: 'wallet',
                  amount: amount,
                  payment_method_id: res?.paymentMethod?.id,
                },
                {
                  code: appData?.profile?.code,
                  currency: currencies?.primary_currency?.id,
                  language: languages?.primary_language?.id,
                },
              )
              .then(async (res) => {
                console.log(res?.client_secret, 'getStripePaymentIntent response');
                if (res && res?.client_secret) {
                  const { paymentIntent, error } = await handleNextAction(
                    res?.client_secret,
                  );
                  if (paymentIntent) {
                    console.log(paymentIntent, 'paymentIntent');
                    if (paymentIntent) {
                      actions
                        .confirmPaymentIntentStripe(
                          {
                            payment_option_id: selectedPaymentMethod?.id,
                            action: 'wallet',
                            amount: amount,
                            payment_intent_id: paymentIntent?.id,
                          },
                          {
                            code: appData?.profile?.code,
                            currency: currencies?.primary_currency?.id,
                            language: languages?.primary_language?.id,
                          },
                        )
                        .then((res) => {
                          if (res) {
                            Alert.alert('', strings.PAYMENT_SUCCESS, [
                              {
                                text: strings.OK,
                                onPress: () => console.log('Cancel Pressed'),
                                // style: 'destructive',
                              },
                            ]);
                            updateState({ isLoadingB: false });
                            navigation.navigate(navigationStrings.WALLET);
                          }
                        })
                        .catch(errorMethod);
                    }
                  } else {
                    updateState({ isLoadingB: false });
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

  //Offline payments
  const _offineLinePayment = async () => {
    if (cardInfo) {
      console.log(cardInfo, 'cardInfo>cardInfo>cardInfo');
      updateState({ isLoadingB: true });
      await createToken({ ...cardInfo, type: 'Card' })
        .then((res) => {
          console.log(res, 'z');
          if (!!res?.error && !!res?.error?.localizedMessage) {
            showError(res?.error?.localizedMessage);
            updateState({ isLoadingB: false });
            return;
          }

          if (res && res?.token && res.token?.id) {
            _createPaymentMethod(cardInfo, res.token?.id);
          }

        })
        .catch(errorMethod);
    }
  };

  const listFooterComp = () => {
    return (
      <View>
        {selectedPaymentMethod == null || selectedPaymentMethod.id != 17 ? (
          <View style={{}}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={styles.textStyle}
              onPress={_addMoneyToWallet}
              marginTop={moderateScaleVertical(50)}
              marginBottom={moderateScaleVertical(50)}
              btnText={strings.ADD}
              indicator={btnLoader}
            />
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  };

  const mainView = () => {
    return (
      <>
        <View style={{ ...commonStyles.headerTopLine }} />
        <View
          style={
            isDarkMode
              ? [
                styles.addMoneyTopCon,
                { backgroundColor: MyDarkTheme.colors.background },
              ]
              : styles.addMoneyTopCon
          }>
          <View
            style={
              isDarkMode
                ? [
                  styles.inputAmountCon,
                  { backgroundColor: MyDarkTheme.colors.background },
                ]
                : styles.inputAmountCon
            }>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={
                  isDarkMode
                    ? [styles.inputAmountText, { color: MyDarkTheme.colors.text }]
                    : styles.inputAmountText
                }>
                {strings.INPUT_AMOUNT}
              </Text>
            </View>

            <View
              style={{
                height: moderateScaleVertical(35),
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: moderateScale(3),
                borderBottomWidth: 0.5,
                borderBottomColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyJ,
              }}>
              <Text
                style={{
                  ...styles.currencySymble,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {currencies?.primary_currency?.symbol}
              </Text>
              <TextInput
                style={
                  isDarkMode
                    ? [
                      styles.addMoneyInputField,
                      {
                        marginLeft: moderateScale(10),
                        width: width - 50,
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                    : styles.addMoneyInputField
                }
                value={`${state.amount}`}
                onChangeText={_onChangeText('amount')}
                keyboardType={'numeric'}
                placeholder={strings.ENTER_AMOUNT}
                placeholderTextColor={
                  isDarkMode ? MyDarkTheme.colors.text : colors.textGreyJ
                }
              />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <FlatList
              data={state.data}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              horizontal
              ItemSeparatorComponent={(data, index) =>
                index == data.length ? null : (
                  <View style={styles.cartItemLine}></View>
                )
              }
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderItem}
            />
          </View>
        </View>
        <View style={{ ...commonStyles.headerTopLine }} />

        <View style={{ flex: 1 }}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              marginHorizontal: moderateScale(20),
            }}>
            {!!(
              allAvailAblePaymentMethods && allAvailAblePaymentMethods.length
            ) && (
                <Text
                  style={
                    isDarkMode
                      ? [styles.debitFrom, { color: MyDarkTheme.colors.text }]
                      : styles.debitFrom
                  }>
                  {strings.DEBIT_FROM}
                </Text>
              )}

            <FlatList
              data={allAvailAblePaymentMethods}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              // horizontal
              style={{ marginTop: moderateScaleVertical(10) }}
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderItemPayments}
              ListFooterComponent={listFooterComp}
              ListEmptyComponent={() => (
                <Text
                  style={{
                    textAlign: 'center',
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.NO_PAYMENT_METHOD}
                </Text>
              )}
              contentContainerStyle={{
                paddingBottom: moderateScaleVertical(100),
              }}
            />
          </View>
        </View>
      </>
    );
  };


  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      isLoading={isLoadingB}
    >
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={strings.ADD_MONEY}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: Colors.white }
        }
      />
      {preferences?.stripe_publishable_key ? (
        <StripeProvider
          publishableKey={preferences?.stripe_publishable_key}
          merchantIdentifier="merchant.identifier">
          {mainView()}
        </StripeProvider>
      ) : (
        mainView()
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
          {!!appData?.profile?.preferences?.flutterwave_public_key &&
            <PayWithFlutterwave
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
          <Text style={{ 
            color: isDarkMode ? 'white' : themeColors?.primary_color,
             fontSize: textScale(15),
              padding: moderateScale(10) }}>Waiting for response ....</Text>
          <View style={{ justifyContent: "center", alignItems: "center", padding: moderateScale(25) }}>

            <CountdownCircleTimer
              isPlaying
              duration={Number(responseTimer)}
              colors={[themeColors?.primary_color]}
              size={60}
              strokeWidth={5}
            >
              {({ remainingTime }) => {

                remainingTime == 1 && responseTimer !=null && setIsVisibleMtnGateway(false)
               var seconds = parseInt(remainingTime) //because moment js dont know to handle number in string format
                var format =  moment.duration(seconds,'seconds').minutes() + ':' + moment.duration(seconds,'seconds').seconds();
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
