import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import React, { createRef, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import CheckoutPaymentView from '../../Components/CheckoutPaymentView';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import ModalView from '../../Components/Modal';
import SubscriptionComponent2 from '../../Components/SubscriptionComponent2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import { generateTransactionRef, payWithCard } from '../../utils/paystackMethod';
// import SubscriptionComponent from '../../Components/SubscriptionComponent';
import {
  CardField,
  createPaymentMethod,
  createToken,
  initStripe,
  StripeProvider,
  handleNextAction
} from '@stripe/stripe-react-native';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { getImageUrl, showError, showSuccess } from '../../utils/helperFunctions';
import ListEmptySubscriptions from './ListEmptySubscriptions';
import stylesFun from './styles';
import { tokenConverterPlusCurrencyNumberFormater } from '../../utils/commonFunction';
import PaymentGateways from '../../Components/PaymentGateways';
import RazorpayCheckout from 'react-native-razorpay';
import TextTabBar from '../../Components/TextTabBar';
import { isEmpty } from 'lodash';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';
import useInterval from '../../utils/useInterval';
import axios from 'axios';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import moment from 'moment';

export default function Subscriptions2({ navigation, route }) {
  //   console.log(route, 'route>>>');
  const paramData = route?.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const [isVisibleMtnGateway, setIsVisibleMtnGateway] = useState(false)
  const [mtnGatewayResponse, setMtnGatewayResponse] = useState('')
  const [responseTimer, setResponseTimer] = useState(420)
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [isReloadPage, setIsReloadPage] = useState(false);
  const [state, setState] = useState({
    isLoading: false,
    isLoadingB: false,
    allSubscriptions: [],
    isRefreshing: false,
    limit: 12,
    currentSubscription: null,
    clientCurrency,
    isModalVisibleForPayment: false,
    selectedPlan: null,
    paymentOptions: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    planPrice: 0,
    paymentDataFlutterWave: null,
    isModalVisibleForPayFlutterWave: false,
    cardFill: true,
    savedCardData: [],
    selectedSavedListCardNumber: null,
  });

  const {
    isModalVisibleForPayFlutterWave,
    paymentDataFlutterWave,
    allSubscriptions,
    isRefreshing,
    isLoading,
    isLoadingB,
    clientCurrency,
    currentSubscription,
    isModalVisibleForPayment,
    selectedPlan,
    paymentOptions,
    selectedPaymentMethod,
    cardInfo,
    planPrice,
    cardFill,
    savedCardData,
    selectedSavedListCardNumber
  } = state;
  //update your state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  console.log(selectedPlan, selectedPaymentMethod, currentSubscription, 'selectedPlanselectedPlan')
  //Redux Store Data
  const { appData, themeColors, appStyle, currencies, languages } = useSelector(
    (state) => state?.initBoot || {},
  );
  const [year, setYear] = useState()
  const [date, setDate] = useState()
  const [accept, isAccept] = useState(false);
  const [cardNumber, setCardNUmber] = useState()
  const [cvc, setCvc] = useState()
  const [expiryDate, setExpiryDate] = useState()
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  const { preferences } = appData?.profile;
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily });
  const commonStyles = commonStylesFun({ fontFamily });

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  const explosion = createRef();

  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      updateState({ isLoadingB: true });
      getAllSubscriptions();
      console.log(explosion, 'explosion');
      console.log(isFocused, 'isFocusedisFocused');
      // console.log(isLoading, isLoadingB , "ldng , ldngb")
      console.log('getAllSubscriptionsEffect');
    }, [isFocused]),
  );

  // useEffect(() => {
  //   updateState({isLoadingB: true});
  //   getAllSubscriptions();
  //   console.log(explosion, 'explosion');
  // }, [ isReloadPage,]);

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
        showSuccess(response?.data?.message)
        getAllSubscriptions(true);
        updateState({ isLoading: false })
      }
    })
      .catch((error) => {
        console.log(error, 'error');
        // setIsVisibleMtnGateway(false)
        setMtnGatewayResponse('')
        setIsVisibleMtnGateway(false)
        showError(error?.response?.data?.message)
      })
  }
  useEffect(() => {
    if (!isVisibleMtnGateway && mtnGatewayResponse) {
      showError('Request TimeOut')
      // navigation.goBack()
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
  //Get list of all payment method
  const getAllSubscriptions = (showSuccess) => {
    actions
      .getAllSubscriptions(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('getAllSubscriptionsFunction');
        console.log('getAllSubscriptionsFunction', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
          allSubscriptions: res?.data?.all_plans,
          currentSubscription: res?.data?.subscription,
        });
      })
      .catch(errorMethod);
  };

  //Subscribe for specific plan
  const selectSpecificSubscriptionPlan = (item) => {
    console.log(item, '>>>>>>>>>>>>>selectSpecificSubscriptionPlan');
    updateState({ isLoading: true, planPrice: item?.price });
    actions
      .selectSpecificSubscriptionPlan(
        `/${item?.slug}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        if (res && res.status == 'Success') {
          updateState({
            isLoadingB: false,
            isLoading: false,
            isModalVisibleForPayment: true,
            selectedPlan: res?.data?.sub_plan,
            paymentOptions: res?.data?.payment_options
              ? res?.data?.payment_options
              : [],
            selectedPaymentMethod: null,
            selectedSavedListCardNumber: null
          });
          {
            !isEmpty(res?.data?.payment_options) && res?.data?.payment_options.map((item, inx) => {
              item?.id == 50 && getSavedCardList()
            })
          }
          setYear("")
          setDate("")
          setCardNUmber("")
          setCvc('')
          setExpiryDate("")
        } else {
          showError(res?.message);
          updateState({
            isLoadingB: false,
            isLoading: false,
          });
        }
      })
      .catch(errorMethod);
  };

  //cancel subscription
  const cancelSubscription = (item) => {
    console.log(item, 'item>>selectSpecificSubscriptionPlan');
    updateState({ isLoading: true });
    actions
      .cancelSubscriptionPlan(
        `/${item?.slug}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
        });
        showSuccess(res?.message);
        getAllSubscriptions();
      })
      .catch(errorMethod);
  };
  //Error handling in screen
  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };

  const selectSavedCard = (data, inx) => {
    {
      selectedSavedListCardNumber && selectedSavedListCardNumber?.id == data?.id
        ? (updateState({ selectedSavedListCardNumber: null }))
        : updateState({ selectedSavedListCardNumber: data });
    }
  };

  const renderProduct = ({ item, index }) => {
    // const {isSelectItem} = state;
    // if (item?.id == currentSubscription?.subscription_id) {
    //   return null;
    // }

    return (
      <View>
        {!!(index == 0) && (
          <View
            style={{
              marginTop: currentSubscription ? moderateScale(40) : null,
              marginBottom: moderateScale(20),
            }}>
            <Text style={styles.subscriptionTitle}>
              {currentSubscription
                ? strings.OTHERSUBSCRIPTION
                : strings.ALLSUBSCRIPTION}
            </Text>
          </View>
        )}
        <SubscriptionComponent2
          data={item}
          clientCurrency={clientCurrency}
          onPress={(item) => selectSpecificSubscriptionPlan(item)}
          payNowUpcoming={() =>
            selectSpecificSubscriptionPlan(currentSubscription?.plan)
          }
          subscriptionData={currentSubscription}
          currentSubscription={item?.id == currentSubscription?.subscription_id}
          cancelSubscription={() => cancelSubscription(item)}
        />
      </View>
    );
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width * 0.5 - 21.5,
    offset: (width * 0.5 - 21.5) * index,
    index,
  });

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ isRefreshing: true });
    getAllSubscriptions();
  };

  const topCustomComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: moderateScale(20),
        }}>
        <Text style={styles.subscription2}>{strings.SUBSCRIPTION2}</Text>
        <TouchableOpacity
          onPress={() => updateState({ isModalVisibleForPayment: false, selectedPaymentMethod: null, selectedSavedListCardNumber: null })}>
          <Image source={imagePath.cross} />
        </TouchableOpacity>
      </View>
    );
  };

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

  const _onChangeStripeData = (cardDetails) => {
    console.log(cardDetails, '_onChangeStripeData>');
    if (cardDetails?.complete) {
      updateState({
        cardInfo: cardDetails,
      });
    } else {
      updateState({ cardInfo: null });
    }
  };

  const _checkoutPayment = (token) => {
    console.log(token, 'tokentokentokentoken');
    let selectedMethod = selectedPaymentMethod.code.toLowerCase();


    actions
      .openPaymentWebUrl(
        `/${selectedMethod}?amount=${planPrice}&token=${token}&subscription_id=${selectedPlan?.slug}&payment_option_id=${selectedPaymentMethod?.id}&action=subscription`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'responseFromServer');
        getAllSubscriptions(true);
        if (res && res?.status == 'Success' && res?.data) {
          updateState({
            isLoadingB: false,
            isLoading: false,
            isModalVisibleForPayment: false,
            isRefreshing: false,
            selectedPaymentMethod: null,
            selectedSavedListCardNumber: null
          });
        }
      })
      .catch(errorMethod);
  };
  const _isCheck = () => {
    isAccept(!accept)
  }


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


  //render pyaments icons
  const _renderItemPayments = ({ item, index }) => {
    console.log(item, selectedPaymentMethod, 'itemmmmmmmmmmmmm')
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
                      ? colors.blackC
                      : colors.textGreyJ,
                  marginLeft: moderateScale(5),
                },
              ]}>
              {/* {item.title} */}
              {appIds?.qdelo === getBundleId() ? (item?.id == 10 ? ` Online / ${item?.title}` : (item?.title)) : (item?.title)}</Text>
          </View>
        </TouchableOpacity>

        {selectedPaymentMethod &&
          selectedPaymentMethod?.id == item?.id &&
          selectedPaymentMethod?.id == 4 && (
            <View>
              <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: '4242 4242 ',
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
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              />
            </View>
          )}

        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          // selectedPaymentMethod?.off_site == 1 &&
          (selectedPaymentMethod?.id === 49 || selectedPaymentMethod?.id === 50 || selectedPaymentMethod?.id === 53)
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
                  isModalVisibleForPayment: false,
                  selectedPaymentMethod: null,
                  selectedSavedListCardNumber: null
                });
                setTimeout(() => {
                  updateState({
                    isLoading: true,
                  });
                }, 500);
              }}
              isSubmitBtn={selectedPaymentMethod?.id == 17 ? true : false}
              btnTitle={strings.PAY}
              submitBtnStyle={{
                width: width / 3,
                marginTop: 0,
                height: moderateScale(45),
                borderRadius: 5,
              }}
              renderCustomLeft={renderCustomLeft}
              btnsMainView={{
                marginTop: moderateScale(10),
              }}
              mainContainer={{
                paddingHorizontal: 0,
              }}
            />
          )}
      </>
    );
  };

  const renderCustomLeft = () => {
    return (
      <GradientButton
        colorsArray={[themeColors.primary_color, themeColors.primary_color]}
        textStyle={styles.textStyle}
        onPress={() => updateState({ isModalVisibleForPayment: false, selectedSavedListCardNumber: null, selectedPaymentMethod: null })}
        borderRadius={moderateScale(5)}
        containerStyle={{
          marginHorizontal: moderateScale(10),
          width: paymentOptions.length ? width / 3 : width - 60,
        }}
        btnText={strings.CANCEL}
      />
    );
  };

  //Modal main component
  const modalMainContent = () => {
    return (
      <>
        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(20),
          }}>
          <Text style={styles.title}>{selectedPlan?.title}</Text>
          <Text style={[styles.title2, { marginTop: moderateScale(10) }]}>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(selectedPlan?.price) || Number(selectedPlan?.frequency),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(10),
          }}>
          <Text style={styles.title}>{strings.FEATURED_INCLUDED}</Text>

          <View
            style={{
              flexDirection: 'row',
              //   marginHorizontal: moderateScale(10),
              marginTop: moderateScale(10),
              alignItems: 'center',
            }}>
            <Image source={imagePath.tick2} />
            <Text
              style={[
                styles.title2,
                { marginLeft: moderateScale(10) },
              ]}>{`${selectedPlan?.features[0]}`}</Text>
          </View>
        </View>

        <View
          style={{
            height: 0.5,
            backgroundColor: colors.textGreyJ,
            marginTop: moderateScale(10),
          }}
        />

        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(10),
          }}>
          <View>
            <Text style={styles.title}>{strings.DEBIT_FROM}</Text>
          </View>
          <View>

            <FlatList
              data={paymentOptions}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              // horizontal
              style={{ marginTop: moderateScaleVertical(10) }}
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderItemPayments}
              ListEmptyComponent={() => (
                <Text style={{ textAlign: 'center' }}>
                  {strings.NO_PAYMENT_METHOD}
                </Text>
              )}
            />
          </View>
        </View>
      </>
    );
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
          action: 'subscription',
          subscription_id: selectedPlan?.slug,
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
              // navigation.goBack()
              getAllSubscriptions(true);
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
          action: 'subscription',
          subscription_id: selectedPlan?.slug,
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
              getAllSubscriptions(true);
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
  const mtnGateway = () => {
    updateState({ isLoading: true })
    let data = {}

    data['amount'] = planPrice
    data['currency'] = currencies?.primary_currency?.iso_code
    data['order_no'] = ''
    data['subscription_id'] = selectedPlan?.slug
    data['from'] = 'subscription'
    actions.mtnGateway(data, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    })
      .then((res) => {
        console.log(res, 'rsrseereeseresre')
        updateState({ btnLoader: false })
        if (res?.status == 'Success') {
          updateState({ isLoading: false })
          setIsVisibleMtnGateway(true)
          setMtnGatewayResponse(res)
          paymentReponse(res)
          // navigation.goBack()

        }
      })
      .catch((err) => {
        console.log(err, 'ererrerererere')
        updateState({ isLoading: false })
        showError(err?.message)
      })
  }
  const payAmount = () => {
    updateState({ isModalVisibleForPayment: false });
    if (!!selectedPaymentMethod) {
      if (selectedPaymentMethod?.id == 4) {
        console.log(selectedPaymentMethod?.id, 'selectedPaymentMethod?.id>>');
        _offineLinePayment();
        setIsReloadPage(true);
        return;
      } else if (selectedPaymentMethod?.id == 27) {
        let paymentData = {
          payment_option_id: selectedPaymentMethod?.id,
          total_payable_amount: planPrice,
        };
        setTimeout(() => {
          openPayTabs(paymentData);
        }, 500);
      } else if (selectedPaymentMethod?.id == 30) {
        let paymentData = {
          payment_option_id: selectedPaymentMethod?.id,
          total_payable_amount: planPrice,
          selectedPayment: selectedPaymentMethod,
        };
        setTimeout(() => {
          updateState({
            isModalVisibleForPayFlutterWave: true,
            paymentDataFlutterWave: paymentData,
          });
        }, 1000);

      }
      else if (selectedPaymentMethod?.id == 48) {
        mtnGateway()
        return;
      } else if (selectedPaymentMethod?.id == 49 || selectedPaymentMethod?.id == 50 || selectedPaymentMethod?.id == 53) {
        _paymentWithPlugnPayMethods()
      } else if (
        selectedPaymentMethod?.id == 10) {
        _renderRazor(planPrice);
        return;
      }
      else {
        _webPayment();
      }
    } else {
      alert(strings.PLEASE_SELECT_PAYMENT_METHOD);
    }
  };
  const _paymentWithPlugnPayMethods = () => {
    updateState({ isLoading: true })
    let selectedMethod = selectedPaymentMethod.code;
    let CardNumber = cardNumber.split(" ").join("") || " "
    let subscrtiptionPlanPrice = Number(planPrice).toFixed(2)
    console.log(subscrtiptionPlanPrice, 'subscrtiptionPlanPrice')
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
    let queryData = `/${selectedMethod}?amount=${subscrtiptionPlanPrice}&cv=${cvc}&dt=${expirydate}&subscription_id=${selectedPlan?.slug}&cno=${CardNumber}&card_id=${savedCardId}&action=subscription`;
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
          getAllSubscriptions(true);
          getSavedCardList()
          setCardNUmber('')
          setCvc('')
          setExpiryDate('')
          showSuccess(res?.msg)
          updateState({ isLoading: false })
        }
        else {
          showError(res?.msg)
          updateState({ isLoading: false })
        }
      })
      .catch((err) => {
        console.log('Error>>>>>>>>>>>', err)
        setCardNUmber('')
        setCvc('')
        setExpiryDate('')
        showError(err?.msg)
        updateState({ isLoading: false })
      })
  }
  const _webPayment = () => {
    let selectedMethod = selectedPaymentMethod?.code?.toLowerCase();
    let returnUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/`;
    let cancelUrl = `payment/${selectedMethod}/completeCheckout/${userData?.auth_token}/subscription`;
    let queryData = `/${selectedMethod}?amount=${planPrice}&returnUrl=${returnUrl}&cancelUrl=${cancelUrl}&subscription_id=${selectedPlan?.slug}&payment_option_id=${selectedPaymentMethod?.id}&action=subscription`;
    if (selectedPaymentMethod?.id == 57) { queryData = queryData + `&come_from=app` }
    updateState({ isLoading: true });
    console.log('query data', queryData);
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
        console.log(res, "ressss?>>");
        updateState({ isLoading: false });
        if (
          res &&
          (res?.status == 'Success' || res?.status == '200') &&
          (res?.data || res?.payment_link || res?.redirect_url)
        ) {
          console.log('generate payment url', res.data);
          let sendingData = {
            id: selectedPaymentMethod.id,
            title: selectedPaymentMethod.title,
            screenName: navigationStrings.SUBSCRIPTION,
            paymentUrl: res.data || res?.payment_link || res?.redirect_url,
            action: 'subscription',
            selectedPlanSlug: selectedPlan?.slug,
          };
          navigation.navigate(navigationStrings.ALL_IN_ONE_PAYMENTS, {
            data: sendingData,
          });
          // navigation.navigate(navigationStrings.WEBPAYMENTS, {
          //   paymentUrl: res?.data,
          //   paymentTitle: selectedPaymentMethod?.title,
          //   redirectFrom: 'subscription',
          //   selectedPaymentMethod: selectedPaymentMethod,
          // selectedPlanSlug: selectedPlan?.slug
          // });
        }
        else if (res?.status == '201') {
          showError(res?.message || '')
        }
      })
      .catch(errorMethod);
  };

  const _createPaymentMethod = async (cardInfo, res2) => {
    console.log(cardInfo, res2, 'cardInfo');
    if (res2) {
      await createPaymentMethod({
        paymentMethodType: 'Card',
        token: res2,
        card: cardInfo,
        billing_details: {
          name: 'Jenny Rosen',
        },
      })
        .then((res) => {
          // updateState({isLoadingB: false});
          console.log('_createPaymentMethod res', res);
          if (res && res?.error && res?.error?.message) {
            showError(res?.error?.message);
            updateState({ isLoading: false });
          } else {
            console.log(res, 'success_createPaymentMethod ');
            actions
              .getStripePaymentIntent(
                // `?amount=${amount}&payment_method_id=${res?.paymentMethod?.id}`,
                {
                  payment_option_id: selectedPaymentMethod?.id,
                  amount: selectedPlan?.price,
                  payment_method_id: res?.paymentMethod?.id,
                  action: 'subscription',
                  subscription_slug: selectedPlan?.slug,
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

                  console.log(paymentIntent, 'paymentIntent');
                  if (paymentIntent) {
                    actions
                      .confirmPaymentIntentStripe(
                        {
                          payment_option_id: selectedPaymentMethod?.id,
                          action: 'subscription',
                          amount: selectedPlan?.price,
                          payment_intent_id: paymentIntent?.id,
                          subscription_slug: selectedPlan?.slug,
                        },
                        {
                          code: appData?.profile?.code,
                          currency: currencies?.primary_currency?.id,
                          language: languages?.primary_language?.id,
                        },
                      )
                      .then((res) => {
                        console.log(
                          res,
                          'confirmPaymentIntentStripe api reponse',
                        );
                        if (res) {
                          getAllSubscriptions(true);
                          updateState({
                            isLoadingB: false,
                            isLoading: false,
                            isRefreshing: false,
                          });
                          // navigation.navigate(navigationStrings.WALLET);
                        }
                      })
                      .catch(errorMethod);
                  } else {
                    console.log(error, 'error');
                    showError(error?.message || 'payment failed');
                  }
                } else {
                  updateState({ isLoadingB: false, isLoading: false });
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
    console.log(cardInfo, 'cardInfocardInfocardInfo+++++++');

    if (cardInfo) {
      //  updateState({isModalVisibleForPayment: false});

      await createToken({ ...cardInfo, type: 'Card' })
        .then((res) => {
          console.log(res, 'res>');
          console.log(selectedPlan, 'selectedPlan>');
          updateState({ isLoading: true });
          if (res && res?.token && res.token?.id) {
            console.log(res.token, 'i am here');
            _createPaymentMethod(cardInfo, res.token?.id);
          }

          // if (res && res?.token && res.token?.id) {
          //   updateState({isLoading: true});
          //   let selectedMethod = selectedPaymentMethod.title.toLowerCase();
          //   actions
          //     .purchaseSubscriptionPlan(
          //       `/${selectedPlan?.slug}`,
          //       {
          //         payment_option_id: selectedPaymentMethod?.id,
          //         transaction_id: res?.token?.id,
          //         // amount: selectedPlan?.id,
          //       },
          //       {
          //         code: appData?.profile?.code,
          //         currency: currencies?.primary_currency?.id,
          //         language: languages?.primary_language?.id,
          //       },
          //     )
          //     .then((res) => {
          //       getAllSubscriptions(true);
          //       updateState({
          //         isLoadingB: false,
          //         isLoading: false,
          //         isRefreshing: false,
          //       });
          //     })
          //     .catch(errorMethod);
          // } else {
          //   if (res && res?.error) {
          //     updateState({
          //       isLoadingB: false,
          //       isLoading: false,
          //       isRefreshing: false,
          //     });
          //     showError(res?.error?.message);
          //   }
          // }
        })
        .catch((err) => {
          console.log(err, 'errerrerr');
          updateState({ isLoadingB: false });
        });
    } else {
      updateState({ isLoading: false });
    }
  };

  const _renderRazor = (planPrice) => {
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
        (Number(planPrice)
          ? Number(planPrice)
          : 0) *
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
        console.log(res, "resresres for razorepay");
        getAllSubscriptions(true);
        updateState({
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch((error) => { console.log(error, "errorororoor>>>") });
  };

  const modalBottomContent = () => {
    return (
      <>
        {selectedPaymentMethod?.id != 17 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: moderateScale(10),
            }}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={styles.textStyle}
              onPress={() => updateState({ isModalVisibleForPayment: false, selectedSavedListCardNumber: null, selectedPaymentMethod: null })}
              borderRadius={moderateScale(5)}
              containerStyle={{
                marginHorizontal: moderateScale(10),
                width: paymentOptions.length
                  ? width / 3
                  : width - moderateScale(100),
              }}
              btnText={strings.CANCEL}
            />
            {paymentOptions.length ? (
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={styles.textStyle}
                onPress={payAmount}
                borderRadius={moderateScale(5)}
                containerStyle={{
                  marginHorizontal: moderateScale(10),
                  width: width / 3,
                }}
                btnText={strings.PAY}
              />
            ) : null}
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };

  const _payNowUpcoming = () => {
    console.log(currentSubscription, 'currentSubscription');
    updateState({ isLoading: true });
    actions
      .cancelSubscriptionPlan(
        `/${currentSubscription?.slug}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
        });
        showSuccess(res?.message);
        getAllSubscriptions();
      })
      .catch(errorMethod);
  };

  const listHeaderComponent = useCallback(() => {
    return (
      <>
        {!!currentSubscription && (
          <>
            <View style={{ marginVertical: moderateScale(10) }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.subscriptionTitle,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.subscriptionTitle
                }>
                {strings.MYSUBSCRIPTION}
              </Text>
            </View>
            <SubscriptionComponent2
              data={currentSubscription?.plan}
              subscriptionData={currentSubscription}
              clientCurrency={clientCurrency}
              allSubscriptions={allSubscriptions}
              currentSubscription={true}
              payNowUpcoming={() =>
                selectSpecificSubscriptionPlan(currentSubscription?.plan)
              }
              cancelSubscription={() => cancelSubscription(currentSubscription)}
            />
          </>
        )}
      </>
    );
  }, [isReloadPage, currentSubscription]);

  // const listHeaderComponent = () => {
  //   return (
  //     <>
  //       {!!currentSubscription && (
  //         <>
  //           <View style={{marginVertical: moderateScale(10)}}>
  //             <Text
  //               style={
  //                 isDarkMode
  //                   ? [
  //                       styles.subscriptionTitle,
  //                       {color: MyDarkTheme.colors.text},
  //                     ]
  //                   : styles.subscriptionTitle
  //               }>
  //               {strings.MYSUBSCRIPTION}
  //             </Text>
  //           </View>
  //           <SubscriptionComponent2
  //             data={currentSubscription?.plan}
  //             subscriptionData={currentSubscription}
  //             clientCurrency={clientCurrency}
  //             allSubscriptions={allSubscriptions}
  //             currentSubscription={true}
  //             payNowUpcoming={() =>
  //               selectSpecificSubscriptionPlan(currentSubscription?.plan)
  //             }
  //             cancelSubscription={() => cancelSubscription(currentSubscription)}
  //           />
  //         </>
  //       )}
  //     </>
  //   );
  // };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      isLoading={isLoading}
    // source={loaderOne}
    >
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={strings.SUBSCRIPTION}
        textStyle={{ fontSize: textScale(14) }}
      />
      <StripeProvider
        publishableKey={preferences?.stripe_publishable_key}
        merchantIdentifier="merchant.identifier">
        <View
          style={{
            flex: 1,
            marginHorizontal: moderateScale(10),
          }}>
          <FlatList
            data={(!isLoadingB && allSubscriptions) || []}
            renderItem={renderProduct}
            ListHeaderComponent={listHeaderComponent()}
            keyExtractor={(item, index) => String(index)}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 7 }} />}
            refreshing={isRefreshing}
            //   getItemLayout={getItemLayout}
            // style={{flex:1}}
            contentContainerStyle={{ flexGrow: 1 }}
            initialNumToRender={12}
            maxToRenderPerBatch={10}
            windowSize={10}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
              />
            }
            ListFooterComponent={() => (
              <View style={{ height: moderateScaleVertical(90) }} />
            )}
            ListEmptyComponent={
              <ListEmptySubscriptions isLoading={isLoadingB} />
            }
          />
        </View>

        <ModalView
          data={selectedPlan}
          isVisible={isModalVisibleForPayment}
          // onClose={() => updateState({isModalVisibleForPayment: false})}

          leftIcon={imagePath.cross}
          topCustomComponent={topCustomComponent}
          modalMainContent={modalMainContent}
          modalBottomContent={modalBottomContent}
          avoidKeyboard={Platform.OS == 'ios' ? true : false}
        />

        <Modal
          onBackdropPress={() =>
            updateState({ isModalVisibleForPayFlutterWave: false })
          }
          isVisible={isModalVisibleForPayFlutterWave}
          style={{
            margin: 0,
            justifyContent: 'flex-end',
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
      </StripeProvider>
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
          }}>
            Waiting for response ....
          </Text>
          <View style={{
            justifyContent: "center",
            alignItems: "center",
            padding: moderateScale(25)
          }}>

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
