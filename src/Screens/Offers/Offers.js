import React, { useEffect, useState } from 'react';
import { FlatList, Image, TouchableOpacity, View, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import OffersCard from '../../Components/OffersCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { shortCodes } from '../../utils/constants/DynamicAppKeys';
import { showError, showSuccess } from '../../utils/helperFunctions';
import ListEmptyOffers from './ListEmptyOffers';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import OffersCard2 from '../../Components/OffersCard2';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import fontFamily from '../../styles/fontFamily';
import BorderTextInput from '../../Components/BorderTextInput';
import validator from '../../utils/validations';

export default function Offer({ route, navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const paramsData = route?.params?.data;

  console.log(paramsData, "paramsDataparamsDataparamsData");
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    allAvailableCoupons: [],
    isLoadingB: false,
    promocode: '',
  });





  const { isTaxi } = paramsData;
  const { appData, appStyle, themeColors, themeLayouts, currencies, languages } =
    useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  useEffect(() => {
    if (paramsData?.cabOrder) {
      _getAllPromoCodesForCabs();
    } else {
      _getAllPromoCodes();
    }
  }, []);

  console.log("appStyle", appStyle)
  //Get all promo codes for cab booking
  const _getAllPromoCodesForCabs = () => {
    let data = {};
    data['vendor_id'] = paramsData?.vendor?.vendor_id;
    data['product_id'] = paramsData?.vendor?.id;
    data['amount'] = paramsData?.vendor?.tags_price;

    actions
      .getAllPromoCodesForCaB(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res');
        updateState({ isLoading: false });

        if (res && res.data) {
          updateState({ allAvailableCoupons: res.data });
        }
      })
      .catch(errorMethod);
  };
  //Get all promo codes
  const _getAllPromoCodes = () => {
    let data = {};
    data['vendor_id'] = paramsData.vendor.id;
    data['cart_id'] = paramsData.cartId;
    console.log(data, 'vendor_id');
    actions
      .getAllPromoCodes(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res');
        updateState({ isLoading: false });

        if (res && res?.data) {
          updateState({ allAvailableCoupons: res.data });
        }
      })
      .catch(errorMethod);
  };

  //Verify your promo code
  const _verifyPromoCode = (item) => {
    let data = {};
    data['vendor_id'] = paramsData.vendor.id;
    data['cart_id'] = paramsData.cartId;
    data['coupon_id'] = item.id;
    updateState({ isLoadingB: true });
    actions
      .verifyPromocode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res');
        updateState({ isLoadingB: false });
        if (res) {
          showSuccess(res?.message || res?.error);


          navigation.navigate(navigationStrings.CART, {
            promocodeDetail: {
              couponInfo: item,
              vendorInfo: paramsData,

            },
          });
        }
      })
      .catch(errorMethod);
  };


  //Verify your promo code
  const _verifyPromoCodeForCab = (item) => {
    updateState({ isLoadingB: true, isLoading: true });
    let data = {};
    data['vendor_id'] = paramsData?.vendor?.vendor_id;
    data['product_id'] = paramsData?.vendor?.id;
    data['coupon_id'] = item.id;
    data['amount'] = paramsData?.vendor?.tags_price;
    console.log(data, 'data-verify-promo');
    actions
      .verifyPromocodeForCabOrders(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res');
        updateState({ isLoadingB: false, isLoading: false });
        if (res) {
          showSuccess(res?.message || res?.error);

          if (paramsData?.pickUp) {
            navigation.navigate(navigationStrings.SHIPPING_DETAILS, {
              promocodeDetail: {
                couponInfo: res?.data,
                vendorInfo: paramsData,
              },
            });
          } else {
            navigation.navigate(
              !!isTaxi
                ? navigationStrings.CHOOSECARTYPEANDTIMETAXI
                : navigationStrings.CHOOSECARTYPEANDTIME,
              {
                ...paramsData?.paramsData, couponInfo: res?.data
              },
            );
          }
        }
      })
      .catch(errorMethod);
  };



  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({ isLoading: false, isLoadingB: false, isLoadingC: false });
    showError(error?.message || error?.error);
  };

  const rightHeader = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity>
          <Image source={imagePath.search} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image style={{ marginLeft: 10 }} source={imagePath.cartShop} />
        </TouchableOpacity>
      </View>
    );
  };

  const _renderItem = ({ item, index }) => {
    {
      return appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? (
        <OffersCard2
          data={item}
          onPress={() =>
            paramsData?.cabOrder
              ? _verifyPromoCodeForCab(item)
              : _verifyPromoCode(item)
          }
        />
      ) : (
        <OffersCard
          data={item}
          onPress={() =>
            paramsData?.cabOrder
              ? _verifyPromoCodeForCab(item)
              : _verifyPromoCode(item)
          }
        />
      );
    }
  };
  const _headerComponent = () => {
    if (!!allAvailableCoupons.length) {
      return appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? (
        <View
          style={{
            marginVertical: moderateScaleVertical(16),
          }}>
          <Text
            style={{
              fontSize: textScale(14),
              fontFamily: fontFamily.medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {strings.AVAILABLE_PROMO_CODE}
          </Text>
        </View>
      ) : (
        <View style={{ height: 20 }} />
      );
    } else {
      return <View></View>;
    }
  };

  const isValidPromoCode = () => {
    const error = validator({ promocode: promocode });

    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const _validatePromoCode = () => {
    const checkValid = isValidPromoCode();
    if (!checkValid) {
      return;
    }

    const data = {};
    data['vendor_id'] = paramsData.vendor.id;
    data['cart_id'] = paramsData.cartId;
    data['promocode'] = promocode;

    updateState({ isLoadingB: true });

    actions
      .validatePromocode(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        updateState({ isLoadingB: false });
        if (res) {
          console.log(res, 'res==>');
          showSuccess(res?.message || res?.error);
          navigation.navigate(navigationStrings.CART, {
            promocodeDetail: {
              couponInfo: res?.data,
              vendorInfo: paramsData,
            },
          });
        }
      })
      .catch(errorMethod);
  };

  const { isLoading, allAvailableCoupons, isLoadingB, promocode } = state;

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoadingB}>
      <Header
        centerTitle={strings.OFFERS}
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout == 5
              ? imagePath.icBackb
              : imagePath.back
        }
      />
      <View style={{ height: 1, backgroundColor: colors.borderLight }} />
      {!isLoading && (
        <View
          style={{
            marginHorizontal: moderateScale(16),
            marginTop: moderateScaleVertical(16),
            flexDirection: 'row',
          }}>
          <BorderTextInput
            marginBottom={0}
            placeholder={strings.ENTER_PROMOCODE}
            onChangeText={(txt) => updateState({ promocode: txt })}
            containerStyle={{
              height: moderateScaleVertical(40),
              flex: 1,
              borderRadius: moderateScale(13),
            }}></BorderTextInput>
          <TouchableOpacity
            style={{
              backgroundColor: themeColors.primary_color,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: moderateScale(10),
              borderRadius: moderateScale(13),
              paddingHorizontal: moderateScale(15),
            }}
            onPress={_validatePromoCode}>
            <Text
              style={{
                color: colors.white,
                fontFamily: fontFamily.regular,
                fontSize: textScale(11),
              }}>
              {strings.APPLY}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          flex: 1,
          marginHorizontal: moderateScale(16),
        }}>
        <FlatList
          data={isLoading ? [] : allAvailableCoupons}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={_headerComponent}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          keyExtractor={(item, index) => String(index)}
          ListEmptyComponent={<ListEmptyOffers isLoading={isLoading} />}
          ListFooterComponent={() => <View style={{ height: appStyle?.tabBarLayout == 4 ? moderateScale(80) : moderateScale(20) }} />}
          renderItem={_renderItem}
        />
      </View>
    </WrapperContainer>
  );
}