import { CardField, createToken, initStripe } from '@stripe/stripe-react-native';

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  Text, TouchableOpacity,
  View
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
  moderateScale,
  moderateScaleVertical
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  showError
} from '../../utils/helperFunctions';
import stylesFun from './styles';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { getBundleId } from 'react-native-device-info';

export default function AllPaymentMethods({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { appData, appStyle, themeColors, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });
  const selectedPaymentMethodHandler = route?.params?.data;

  // console.log(selectedPaymentMethodHandler, 'selectedPaymentMethod');

  const [state, setState] = useState({
    isLoading: false,
    // payementMethods: [
    //   {
    //     id: -1,
    //     title: 'Cash on Delivery',
    //     off_site: 2,
    //   },
    // ],
    payementMethods: [],
    selectedPaymentMethod: null,
    cardInfo: null,
    tokenInfo: null,
    keyboardHeight: 0,
  });
  const {
    payementMethods,
    cardInfo,
    tokenInfo,
    selectedPaymentMethod,
    isLoading,
    keyboardHeight,
  } = state;

  useEffect(() => {
    console.log(selectedPaymentMethod, 'selectedPaymentMethod>>');
  }, [selectedPaymentMethod]);
  //Update states in screen
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { preferences } = appData?.profile;

  console.log(
    preferences?.stripe_publishable_key,
    'preferences?.stripe_publishable_key',
  );

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
          console.log(
            preferences?.stripe_publishable_key,
            'preferences?.stripe_publishable_key',
          );
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
    actions
      .getListOfPaymentMethod(
        '/cart',
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
        if (res && res?.data) {
          updateState({ payementMethods: res?.data });
          // updateState({allAvailAblePaymentMethods: res?.data});
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };

  //Change Payment method/ Navigate to payment screen
  const selectPaymentOption = async () => {
    if (selectedPaymentMethod) {
      updateState({ isLoading: true });

      if (
        selectedPaymentMethod?.id == 4 &&
        selectedPaymentMethod?.off_site == 0
      ) {
        if (cardInfo) {
          await createToken({ ...cardInfo, type: 'Card' })
            .then((res) => {
              console.log('stripeTokenres>>');
              if (!!res?.error) {
                //alert(res.error.localizedMessage);
                updateState({ isLoading: false });
                alert('i am here++++');
                return;
              }
              if (res && res?.token && res.token?.id) {
                alert('i am here');
                updateState({ isLoading: false });
                navigation.navigate(navigationStrings.CART, {
                  selectedMethod: selectedPaymentMethod,
                  cardInfo: cardInfo,
                  tokenInfo: res.token?.id,
                });
              } else {
                updateState({ isLoading: false });
              }
            })
            .catch((err) => {
              updateState({ isLoading: false });
              console.log(err, 'err>>');
            });
        } else {
          updateState({ isLoading: false });
          showError(strings.NOT_ADDED_CART_DETAIL_FOR_PAYMENT_METHOD);
        }
      } else {
        setTimeout(() => {
          updateState({ isLoading: false });
          navigation.navigate(navigationStrings.CART, {
            selectedMethod: selectedPaymentMethod,
            cardInfo: cardInfo,
          });
        }, 1000);
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

  //upadte box style on click
  const getAndCheckStyle = (item) => {
    // return {}
    if (selectedPaymentMethod && selectedPaymentMethod.id == item.id) {
      return {
        borderColor: themeColors.primary_color,
      };
    } else {
      return {
        backgroundColor: 'transparent',
        borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      };
    }
  };

  const _renderItemPayments = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => selectPaymentMethod(item, index)}
          key={index}
          style={[
            styles.caseOnDeliveryView,
            //  {...getAndCheckStyle(item)}
          ]}>
          <Image
            source={
              selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                ? imagePath.radioActive
                : imagePath.radioInActive
            }
          />
          {/* {strings.CASE_ON_DELIVERY} */}
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
          selectedPaymentMethod?.off_site == 0 &&
          selectedPaymentMethod?.id === 17
        ) && (
            <CheckoutPaymentView
              cardTokenized={(e) => {
                updateState({ isLoading: false });
                if (e.token) {
                  navigation.navigate(navigationStrings.CART, {
                    selectedMethod: selectedPaymentMethod,
                    cardInfo: e.token,
                  });
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
    console.log(cardDetails, '_onChangeStripeData>');
    if (cardDetails?.complete) {
      updateState({
        cardInfo: {
          brand: cardDetails.brand,
          complete: true,
          expiryMonth: cardDetails?.expiryMonth,
          expiryYear: cardDetails?.expiryYear,
          last4: cardDetails?.last4,
          // postalCode: cardDetails?.postalCode,
        },
      });
      // updateState({
      //   cardInfo: cardDetails
      // });
    } else {
      updateState({ cardInfo: null });
    }
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
        style={{
          marginHorizontal: moderateScaleVertical(20),
        }}>
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

      <View
        style={{
          marginHorizontal: moderateScaleVertical(20),
          marginBottom:
            moderateScaleVertical(80) +
            (keyboardHeight == 0
              ? keyboardHeight
              : moderateScale(keyboardHeight - 80)),
        }}>
        {selectedPaymentMethod == null || selectedPaymentMethod.id != 17 ? (
          <GradientButton
            onPress={selectPaymentOption}
            marginTop={moderateScaleVertical(10)}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.SELECT}
          />
        ) : (
          <></>
        )}
      </View>
    </WrapperContainer>
  );
}
