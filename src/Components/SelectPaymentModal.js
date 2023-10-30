import { useNavigation } from '@react-navigation/native';
import {
  CardField,
  createPaymentMethod,
  createToken,
  initStripe,
  StripeProvider
} from '@stripe/stripe-react-native';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Alert, FlatList, Image,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import CheckoutPaymentView from '../Components/CheckoutPaymentView';
import GradientButton from '../Components/GradientButton';
import Header from '../Components/Header';
import { loaderOne } from '../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../Components/WrapperContainer';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang/index';
import navigationStrings from '../navigation/navigationStrings';
import actions from '../redux/actions';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
  width
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { showError } from '../utils/helperFunctions';
import HomeLoader from './Loaders/HomeLoader';
import PaymentGateways from './PaymentGateways';
import TextTabBar from './TextTabBar';
import { appIds } from '../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';

export default function SelectPaymentModal({
  onSelectPayment,
  paymentModalClose = () => { },
  dineInType,
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const navigation = useNavigation();
  const userData = useSelector((state) => state?.auth?.userData);
  console.log(userData, 'userData');
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, appStyle, themeColors, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const { preferences } = appData?.profile;
  let [cardNumber, setCardNUmber] = useState()
  let [cvc, setCvc] = useState()
  let [expiryDate, setExpiryDate] = useState()
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });
  const [year, setYear] = useState()
  const [date, setDate] = useState()
  const [accept, isAccept] = useState(false);
  const [state, setState] = useState({
    isLoading: false,
    payementMethods: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    tokenInfo: null,
    keyboardHeight: 0,
    btnLoader: false,
    cardFill: true,
    savedCardData: [],
    selectedSavedListCardNumber: null,
  });
  const {
    payementMethods,
    cardInfo,
    tokenInfo,
    selectedPaymentMethod,
    isLoading,
    keyboardHeight,
    btnLoader,
    cardFill,
    savedCardData,
    selectedSavedListCardNumber
  } = state;

  useEffect(() => {
    console.log(selectedPaymentMethod, 'selectedPaymentMethod>>');
  }, [selectedPaymentMethod]);
  //Update states in screen
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    if (
      preferences &&
      preferences?.stripe_publishable_key != '' &&
      preferences?.stripe_publishable_key != null
    ) {
      (async () => {
        try {
          let res = await initStripe({
            publishableKey: preferences?.stripe_publishable_key,
            merchantIdentifier: 'merchant.identifier',
          });
        } catch (error) {
          console.log('error raised');
        }
      })();
    }
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        updateState({ keyboardHeight: event.endCoordinates.height });
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (event) => {
        updateState({ keyboardHeight: 0 });
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    updateState({ isLoading: true });
    getListOfPaymentMethod();


  }, []);


  //Get list of all payment method
  const getListOfPaymentMethod = () => {
    let apiData = `/cart?service_type=${dineInType}`;
    let header = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,

    }
    console.log(apiData, "apiDataapiData");
    console.log(header, "headerr$");
    actions
      .getListOfPaymentMethod(
        apiData,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'allpayments gate');
        updateState({ isLoading: false, isRefreshing: false });
        if (res && res?.data && !isEmpty(res?.data)) {
          updateState({ payementMethods: res?.data });
          // updateState({allAvailAblePaymentMethods: res?.data});
          res?.data.map((item, inx) => {
            item?.id == 50 && getSavedCardList()
          })
        }
      })
      .catch(errorMethod);
  };

  // Get Saved card list of user
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
  //Error handling in screen
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      btnLoader: false,
    });
    // showError(error?.message || error?.error);
    console.log(error, 'error');
    alert(error?.message || error?.error);
  };

  const _createPaymentMethod = async (cardInfo, res2) => {
    console.log(cardInfo, '_createPaymentMethod>>>ardInfo');
    if (res2) {
      await createPaymentMethod({
        token: res2,
        card: cardInfo,
        paymentMethodType: 'Card',
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
            paymentModalClose();
          } else {
            console.log(res, 'success_createPaymentMethod ');
            updateState({ isLoading: false });
            onSelectPayment({
              selectedPaymentMethod,
              cardInfo,
              tokenInfo: res2,
              payment_method_id: res?.paymentMethod?.id,
            });
            paymentModalClose();
          }
        })
        .catch(errorMethod);
    }
  };

  //Change Payment method/ Navigate to payment screen
  const selectPaymentOption = async () => {
    if (selectedPaymentMethod) {
      updateState({ btnLoader: true });
      if (
        selectedPaymentMethod?.id == 4 &&
        selectedPaymentMethod?.off_site == 0
      ) {
        if (cardInfo) {
          await createToken({ ...cardInfo, type: 'Card' })
            .then((res) => {
              console.log(res, 'stripeTokenres>>');
              console.log(cardInfo, 'stripeTokencardInfo>>');
              if (!!res?.error) {
                alert(res.error.localizedMessage);
                updateState({ isLoading: false, btnLoader: false });
                return;
              }
              if (res && res?.token && res.token?.id) {
                _createPaymentMethod(cardInfo, res.token?.id);

                // updateState({isLoading: false});
                // onSelectPayment({
                //   selectedPaymentMethod,
                //   cardInfo,
                //   tokenInfo: res.token?.id,
                // });
                // paymentModalClose();
              } else {
                updateState({ btnLoader: false });
              }
            })
            .catch((err) => {
              updateState({ btnLoader: false });
              console.log(err, 'err>>');
            });
        } else {
          updateState({ btnLoader: false });
          alert(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
          //   showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
      } else {
        if ((selectedPaymentMethod?.id == 49 || selectedPaymentMethod?.id == 50 || selectedPaymentMethod?.id == 53) &&
          selectedPaymentMethod?.off_site == 1) {
          if (!isEmpty(selectedSavedListCardNumber)) {
            console.log("selectedSavedListCardNumber =>", selectedSavedListCardNumber);
            navigation.navigate(navigationStrings.CART, { selectedSavedListCardNumber: selectedSavedListCardNumber })
          }
          if ((cardNumber && cvc) && (expiryDate || (year && date))) {
            navigation.navigate(navigationStrings.CART, { CardNumber: cardNumber, cvc: cvc, expiryDate: expiryDate, date: date, year: year, saveCardDetails: accept })
          }
        }
        setTimeout(() => {
          updateState({ btnLoader: false });
          onSelectPayment({
            selectedPaymentMethod,
            cardInfo,
          });
          paymentModalClose();
        }, 1000);
      }
    } else {
      alert(strings.SELECTPAYEMNTMETHOD);
      //   showError(strings.SELECTPAYEMNTMETHOD);
    }
  };

  //Select/ Update payment method
  const selectPaymentMethod = (data, inx) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == data?.id
        ? (updateState({ selectedPaymentMethod: null }))
        : updateState({ selectedPaymentMethod: data });
      setCardNUmber(""),
        setCvc("")
      setYear("")
      setDate("")
      setExpiryDate("")
    }
  };

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
  const _isCheck = () => {
    isAccept(!accept)
  }

  const _onChangeStripeData = (cardDetails) => {
    console.log('_onChangeStripeData_onChangeStripeData', cardDetails);
    if (cardDetails?.complete) {
      // updateState({
      //   cardInfo: {
      //     brand: cardDetails.brand,
      //     complete: true,
      //     expiryMonth: cardDetails?.expiryMonth,
      //     expiryYear: cardDetails?.expiryYear,
      //     last4: cardDetails?.last4,
      //     // name:userData?.name
      //     // postalCode: cardDetails?.postalCode,
      //   },
      // });
      updateState({
        cardInfo: cardDetails,
      });
    } else {
      updateState({ cardInfo: null });
    }
  };

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
      }}>
        <Header
          leftIcon={
            appStyle?.homePageLayout === 2
              ? imagePath.backArrow
              : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.back
          }
          onPressLeft={paymentModalClose}
          centerTitle={strings.PAYMENT}
          headerStyle={
            isDarkMode
              ? { backgroundColor: MyDarkTheme.colors.background }
              : { backgroundColor: colors.backgroundGrey }
          }
        />
        <View
          style={{
            height: 1,
            backgroundColor: colors.borderLight,
          }}
        />

        <HomeLoader
          width={width / 1.1}
          height={24}
          rectHeight={24}
          rectWidth={width / 1.1}
          viewStyles={{
            marginHorizontal: moderateScale(16),
            marginVertical: moderateScaleVertical(16),
          }}
        />
        <HomeLoader
          width={width / 1.1}
          height={24}
          rectHeight={24}
          rectWidth={width / 1.1}
          viewStyles={{
            marginHorizontal: moderateScale(16),
            marginBottom: moderateScaleVertical(16),
          }}
        />
        <HomeLoader
          width={width / 1.1}
          height={24}
          rectHeight={24}
          rectWidth={width / 1.1}
          viewStyles={{
            marginBottom: moderateScaleVertical(16),
            marginHorizontal: moderateScale(16),
          }}
        />
        <HomeLoader
          width={width / 1.1}
          height={24}
          rectHeight={24}
          rectWidth={width / 1.1}
          viewStyles={{
            marginBottom: moderateScaleVertical(16),
            marginHorizontal: moderateScale(16),
          }}
        />
      </View>
    );
  }
  const selectSavedCard = (data, inx) => {

    selectedSavedListCardNumber && selectedSavedListCardNumber?.id == data?.id
      ? (updateState({ selectedSavedListCardNumber: null }))
      : updateState({ selectedSavedListCardNumber: data });
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
  const renderSavedCardList = ({ item, index }) => {
    const expDate = item?.expiration
    // const expDate = item?.expiration.slice(0, 4) + "/" + item?.expiration.slice(4)
    return (
      <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => selectSavedCard(item, index)}
          style={[styles.caseOnDeliveryView, { marginVertical: moderateScaleVertical(8) }]}>
          <Image
            source={
              selectedSavedListCardNumber &&
                selectedSavedListCardNumber?.id == item.id
                ? imagePath.radioActive
                : imagePath.radioInActive
            }
          />
          <View>
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
  const mainView = () => {
    return (
      <>
        <ScrollView
          style={{
            marginHorizontal: moderateScaleVertical(20),
            marginTop: moderateScaleVertical(10),
          }}>
          {!isEmpty(payementMethods)
            ? payementMethods.map((item, index) => {
              console.log(item, 'item>>>>');
              return (
                <>
                  <Animatable.View
                    // animation={'slideInUp'}
                    // duration={200}
                    key={String(index)}
                    style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={() => selectPaymentMethod(item, index)}
                      style={[
                        styles.caseOnDeliveryView,
                        //  {...getAndCheckStyle(item)}
                      ]}>
                      <Image
                        source={
                          selectedPaymentMethod &&
                            selectedPaymentMethod?.id == item.id
                            ? imagePath.radioActive
                            : imagePath.radioInActive
                        }
                      />
                      {/* {strings.CASE_ON_DELIVERY} */}
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.caseOnDeliveryText,
                              { color: MyDarkTheme.colors.text },
                            ]
                            : styles.caseOnDeliveryText
                        }>
                   
                        {appIds?.qdelo === getBundleId() ? item?.id == 10 ? `Online / ${(item?.title_lng ? item?.title_lng : item?.title)}` : (item?.title_lng ? item?.title_lng : item?.title) : item?.title_lng ? item?.title_lng : item?.title}
                      </Text>
                    </TouchableOpacity>
                    {!!(
                      selectedPaymentMethod &&
                      selectedPaymentMethod?.id == item.id &&
                      selectedPaymentMethod?.off_site == 0 &&
                      selectedPaymentMethod?.id === 4
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
                            onFocus={(focusedField) => {
                              console.log('focusField', focusedField);
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
                      selectedPaymentMethod?.off_site == 1 &&
                      (selectedPaymentMethod?.id === 49 || selectedPaymentMethod?.id == 50 || selectedPaymentMethod?.id == 53)
                    ) && (
                        selectedPaymentMethod?.id == 50 ?
                          <>
                            <View style={styles.switchView}>
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

                                  <TouchableOpacity
                                    onPress={_isCheck}
                                    style={{
                                      flexDirection: "row", alignItems: 'center'
                                      // marginRight: 10,
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
                                    <Text> Save Card</Text>
                                  </TouchableOpacity>




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
                            updateState({ isLoading: false });
                            if (e.token) {
                              onSelectPayment({
                                selectedPaymentMethod,
                                cardInfo: e.token,
                              });
                              paymentModalClose();
                            }
                          }}
                          cardTokenizationFailed={(e) => {
                            setTimeout(() => {
                              updateState({ isLoading: false });
                              alert(strings.INVALID_CARD_DETAILS);
                              // showError(strings.INVALID_CARD_DETAILS);
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
                  </Animatable.View>
                  <View style={{ marginBottom: moderateScaleVertical(16) }} />
                </>
              );
            })
            : !isLoading && (
              <Text style={{ textAlign: 'center' }}>
                {strings.NO_PAYMENT_METHOD}
              </Text>
            )}
        </ScrollView>

        <View
          style={{
            marginHorizontal: moderateScaleVertical(20),
            marginBottom:
              keyboardHeight == 0
                ? keyboardHeight
                : moderateScale(keyboardHeight - 80),
          }}>
          {(selectedPaymentMethod == null || selectedPaymentMethod.id != 17) ? (
            <GradientButton
              onPress={selectPaymentOption}
              marginTop={moderateScaleVertical(10)}
              marginBottom={height / 9}
              btnText={strings.SELECT}
              indicator={btnLoader}
              indicatorColor={colors.white}
            />
          ) : (
            <></>
          )}
        </View>
      </>
    );
  };

  return (
    <View style={{
      flex: 1,
    }}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        onPressLeft={paymentModalClose}
        centerTitle={strings.PAYMENT}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.backgroundGrey }
        }
      />
      <StripeProvider
        publishableKey={preferences?.stripe_publishable_key}
        merchantIdentifier="merchant.identifier">
        {mainView()}
      </StripeProvider>

    </View>
  );
}

const stylesFun = ({ fontFamily, themeColors }) => {
  const styles = StyleSheet.create({
    scrollviewHorizontal: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.borderLight,
    },
    headerText: {
      marginRight: moderateScale(20),
      alignSelf: 'center',
    },
    packingBoxStyle: {
      height: moderateScaleVertical(120),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 2,
      padding: 5,
      marginVertical: 5,
    },
    caseOnDeliveryView: {
      borderRadius: moderateScaleVertical(13),
      alignItems: 'center',
      flexDirection: 'row',
    },
    useNewCartView: {
      padding: moderateScaleVertical(10),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 2,
      borderColor: colors.borderLight,
      flexDirection: 'row',
      marginVertical: 5,
      marginHorizontal: moderateScaleVertical(20),
      marginTop: moderateScaleVertical(15),
    },
    useNewCartText: {
      fontFamily: fontFamily.bold,
      color: colors.walletTextD,
      marginLeft: moderateScaleVertical(100),
      fontSize: moderateScaleVertical(14),
    },
    caseOnDeliveryText: {
      marginHorizontal: moderateScaleVertical(10),
      fontFamily: fontFamily.medium,
      fontSize: textScale(16),
    },
    price: {
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.bold,
      fontSize: textScale(13),
      marginTop: moderateScaleVertical(10),
    },
    dropOff: {
      color: colors.textGreyB,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      marginTop: moderateScaleVertical(40),
    },
    dots: {
      width: 4,
      height: 4,
      backgroundColor: 'grey',
      borderRadius: 50,
      marginVertical: 3,
      marginLeft: 4,
    },
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    totalPayableView: {
      flexDirection: 'row',
      marginTop: moderateScaleVertical(20),
      paddingVertical: moderateScaleVertical(60),
      justifyContent: 'center',
    },
    totalPayableText: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
      marginLeft: moderateScale(5),
      marginVertical: moderateScaleVertical(2),
    },
    totalPayableValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(22),
      marginVertical: moderateScaleVertical(2),
    },
    allIncludedText: {
      color: colors.walletTextD,
      fontFamily: fontFamily.bold,
      marginVertical: moderateScaleVertical(2),
    },
    cardImageView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(5),
    },
    masterCardLogo: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
      marginRight: moderateScaleVertical(10),
    },
    switchView: {
      flexDirection: 'row',
      marginTop: moderateScale(10),
      justifyContent: 'space-around'
    },
    buttonSwitchStyle: {
      width: moderateScale(100),
      borderColor: colors.backgroundGreyB,
      borderWidth: moderateScale(2),
      borderRadius: moderateScale(5)
    }
  });
  return styles;
};
