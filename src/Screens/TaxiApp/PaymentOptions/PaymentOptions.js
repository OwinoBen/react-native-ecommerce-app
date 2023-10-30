import {
  CardField,
  StripeProvider,
  createToken,
} from "@stripe/stripe-react-native";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDarkMode } from "react-native-dynamic";
import FastImage from "react-native-fast-image";
import { enableFreeze } from "react-native-screens";
import { useSelector } from "react-redux";
import GradientButton from "../../../Components/GradientButton";
import Header from "../../../Components/Header";
import PaymentGateways from "../../../Components/PaymentGateways";
import TextTabBar from "../../../Components/TextTabBar";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import colors from "../../../styles/colors";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../../styles/responsiveSize";
import { MyDarkTheme } from "../../../styles/theme";
import { showError } from "../../../utils/helperFunctions";
import stylesFun from "./styles";
enableFreeze(true);


const PaymentOptions = ({ navigation, route }) => {
  const [state, setState] = useState({
    pageNo: 1,
    limit: 12,
    apiPaymentOptions: [],
    walletPayment: { id: 2, title: strings.WALLET, off_site: 0 },
    selectedPaymentMethod: null,
    cardInfo: null,
    btnLoader: false,
    cardFill: true,
    savedCardData: [],
    selectedSavedListCardNumber: null,
  });

  const { appData, appStyle, themeColors, currencies, languages } = useSelector(
    (state) => state.initBoot
  );
  const { profile } = appData;
  const [year, setYear] = useState()
  const [date, setDate] = useState()
  const [accept, isAccept] = useState(false);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params?.data?.paramData;

  const walletAmount = useSelector(
    (state) => state?.product?.walletData?.wallet_amount
  );
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });
  const [cardNumber, setCardNUmber] = useState()
  const [cvc, setCvc] = useState()
  const [expiryDate, setExpiryDate] = useState()
  const {
    pageNo,
    limit,
    apiPaymentOptions,
    walletPayment,
    selectedPaymentMethod,
    cardInfo,
    btnLoader,
    cardFill,
    savedCardData,
    selectedSavedListCardNumber
  } = state;

  useEffect(() => {
    getAllPaymentOptions();
  }, []);

  useEffect(() => {
    getWalletData();
  }, [pageNo]);

  // useEffect(() => {
  //   getSavedCardList()
  // }, [])

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

  const getAllPaymentOptions = () => {
    actions
      .getListOfPaymentMethod(
        `/pickup_delivery`,
        {},
        {
          code: appData?.profile?.code,
        }
      )
      .then((res) => {
        console.log(res, "responseFromServer");
        updateState({
          apiPaymentOptions: res?.data,
        });
        {
          !isEmpty(res?.data) && res?.data.map((item, index) => {
            item.id == 50 && getSavedCardList();
          })

        }

      })
      .catch(errorMethod);
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
  const getWalletData = () => {
    actions
      .walletHistory(
        `?page=${pageNo}&limit=${limit}`,
        {},
        {
          code: appData?.profile?.code,
        }
      )
      .then((res) => {
        console.log(res, "Wallet Responce");
        updateState({
          isRefreshing: false,
          isLoading: false,
          isLoadingB: false,
          wallet_amount: res?.data?.wallet_amount,
          walletHistory:
            pageNo == 1
              ? res.data.transactions.data
              : [...walletHistory, ...res.data.transactions.data],
        });
      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    console.log(error, "errorOccured");
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };

  const _onPressWallet = () => {
    if (walletAmount >= 0) {
      navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
        selectedMethod: walletPayment,
      });
    } else {
      showError(strings.PLEASE_RECHARGE_WALLET);
    }
  };

  const _onPressPaymentOption = (item) => {
    updateState({ selectedPaymentMethod: item });

    if (item?.id == 4) {
      return;
    }
    if (item?.id == 49 || item?.id == 50 || item?.id == 53) {
      return;
    }
    navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
      ...paramData,
      selectedMethod: item,
    });
  };

  const selectPaymentOption = async () => {
    if (
      selectedPaymentMethod?.id == 4 &&
      selectedPaymentMethod?.off_site == 0
    ) {
      updateState({ btnLoader: true });
      if (cardInfo) {
        console.log(cardInfo, "cardInfo>>>");
        await createToken({ ...cardInfo, type: "Card" })
          .then((res) => {
            updateState({ btnLoader: false });
            console.log(res, "res>>>>>");
            if (!!res?.error) {
              alert(res.error.localizedMessage);
              return;
            }
            navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
              ...paramData,
              cardInfo: cardInfo,
              tokenInfo: res.token?.id,
              selectedMethod: selectedPaymentMethod,
            });
          })
          .catch((err) => {
            updateState({ btnLoader: false });
            console.log(err, "err>>");
          });
      } else {
        updateState({ btnLoader: false });
        alert(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        //   showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
      }
    }
    else if ((selectedPaymentMethod?.id == 49 || selectedPaymentMethod?.id == 50 || selectedPaymentMethod?.id == 53) &&
      selectedPaymentMethod?.off_site == 1) {
      if (!isEmpty(selectedSavedListCardNumber)) {
        navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
          ...paramData,

          selectedMethod: selectedPaymentMethod,
          selectedSavedListCardNumber: selectedSavedListCardNumber
        });
      }
      if ((cardNumber && cvc) && (expiryDate || (year && date))) {
        navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
          ...paramData,
          Card_Number: cardNumber,
          cvc: cvc,
          expiryDate: expiryDate,
          selectedMethod: selectedPaymentMethod,
          year: year,
          date: date,
          saveCardDetails: accept
        });
      }

    }

  };

  const _onChangeStripeData = (cardDetails) => {
    console.log(cardDetails, "cardDetails>>>");
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

  const _renderItem = ({ item }) => {
    console.log(item, "item item");
    return (
      <View>
        <TouchableOpacity
          onPress={() => _onPressPaymentOption(item)}
          style={styles.renderItemStyle}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Image source={imagePath.radioInActive} style={styles.imageStyle} />
            <Text
              style={[
                styles.textStyle,
                { color: isDarkMode ? MyDarkTheme.colors.text : "#1C1C1C" },
              ]}
            >
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
        {!!(
          selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 4
        ) && (
            <StripeProvider
              publishableKey={
                appData?.profile?.preferences?.stripe_publishable_key
              }
              merchantIdentifier="merchant.identifier"
            >
              <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: "4242 4242 4242 4242",
                }}
                cardStyle={{
                  backgroundColor: colors.backgroundGrey,
                  textColor: colors.black,
                }}
                style={{
                  width: "100%",
                  height: 50,
                  marginVertical: 10,
                }}
                onCardChange={(cardDetails) => {
                  _onChangeStripeData(cardDetails);
                }}
                onFocus={(focusedField) => {
                  console.log("focusField", focusedField);
                }}
                onBlur={() => {
                  Keyboard.dismiss();
                }}
              />
            </StripeProvider>
          )}
        {!!(
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
          )}
      </View>
    );
  };



  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
    >
      <Header
        rightViewStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.backgroundGrey,
          alignItems: "center",
          paddingVertical: moderateScaleVertical(8),
          borderRadius: 14,
          flex: 0.15,
        }}
        leftIcon={imagePath.backArrowCourier}
        centerTitle={strings.PAYMENT_OPTIONS}
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          marginVertical: moderateScaleVertical(10),
          rightViewStyle: { backgroundColor: colors.greyColor },
        }}
      />
      <View style={styles.containerStyle}>
        <View style={{ marginHorizontal: moderateScale(18) }}>
          <Text
            style={{
              opacity: 0.7,
              fontFamily: fontFamily.bold,
              fontSize: textScale(14),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              marginTop: moderateScaleVertical(20),
              marginBottom: moderateScaleVertical(10),
            }}
          >
            {strings.PAYMENT_METHOD}
          </Text>
          {/* <TouchableOpacity
            onPress={_onPressWallet}
            style={{
              ...styles.renderItemStyle,
              flexDirection: 'row',
              marginBottom: moderateScale(20),
            }}>
            <Image source={imagePath.radioInActive} style={styles.imageStyle} />
            <Text
              style={[
                styles.textStyle,
                {color: isDarkMode ? MyDarkTheme.colors.text : '#1C1C1C'},
              ]}>
              {strings.WALLET}
            </Text>
          </TouchableOpacity> */}
          <FlatList
            data={apiPaymentOptions}
            renderItem={_renderItem}
            keyExtractor={(item, index) => String(index)}
          />
        </View>
        {(selectedPaymentMethod?.id == 4 || selectedPaymentMethod?.id == 49 || selectedPaymentMethod?.id == 50 || selectedPaymentMethod?.id == 53) && (
          <GradientButton
            onPress={selectPaymentOption}
            containerStyle={{
              position: "absolute",
              bottom: 0,
              width: width - moderateScale(40),
              alignSelf: "center",
            }}
            marginTop={moderateScaleVertical(10)}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.SELECT}
            indicator={btnLoader}
            indicatorColor={colors.white}
          />
        )}
      </View>
    </WrapperContainer>
  );
};

export default PaymentOptions;
