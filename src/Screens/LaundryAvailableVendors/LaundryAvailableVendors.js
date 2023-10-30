import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import actions from '../../redux/actions';
import {useSelector} from 'react-redux';
import {getImageUrl, showError, showSuccess} from '../../utils/helperFunctions';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang';
import Header from '../../Components/Header';
import imagePath from '../../constants/imagePath';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import colors from '../../styles/colors';
import DeviceInfo from 'react-native-device-info';
import {isEmpty} from 'lodash';
import navigationStrings from '../../navigation/navigationStrings';
import {tokenConverterPlusCurrencyNumberFormater} from '../../utils/commonFunction';

export default function LaundryAvailableVendors({navigation, route}) {
  const paramData = route?.params?.data;
  const {
    appData,
    currencies,
    languages,
    appStyle,

    themeColors,
  } = useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};

  const {dineInType} = useSelector((state) => state?.home);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});
  const [isLoading, setLoading] = useState(false);
  const [allVendors, setAllVendors] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pressedItem, setPressedItem] = useState({});

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };
  useEffect(() => {
    getEstimatedProducts();
  }, []);

  const getEstimatedProducts = () => {
    let newSelectedAddonSet = [
      {
        estimate_product_id:
          paramData?.selectedAddonSet[0]?.estimate_product_id,
        estimate_products: paramData?.selectedAddonSet,
      },
    ];
    actions
      .productEstimation(
        {product: newSelectedAddonSet},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'res>>>>>>res');
        setLoading(false);
        setIsRefreshing(false);
        setAllVendors(res?.data);
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, 'errorinErrorMethod....');
    setIsRefreshing(false);
    setLoading(false);
    showError(error?.error || error?.message);
  };

  const onSelectVendorAddToCart = (item) => {
    if (!isEmpty(item?.product)) {
      setPressedItem(item);
      setLoading(true);
      let data = {};
      data['sku'] = item?.product[0]?.product_sku;
      data['quantity'] = 1;
      data['product_variant_id'] = item?.product[0]?.product_variant_id;
      data['type'] = dineInType;
      data['addon_ids'] = item?.product[0]?.addonIds;
      data['addon_options'] = item?.product[0]?.optionIds;

      console.log(data, 'item>>>item');

      actions
        .addProductsToCart(data, {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          setLoading(false);
          actions.cartItemQty(res);
          showSuccess(strings.PRODUCT_ADDED_SUCCESS);
          moveToNewScreen(navigationStrings.CART)();
        })
        .catch(errorMethod);
    } else {
      showError('No products found at vendor.');
    }
  };

  //Pull to refresh
  const handleRefresh = () => {
    setIsRefreshing(true);

    getEstimatedProducts();
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{...styles.mainRowStyle}}>
        <View style={{flex: 0.2}}>
          <FastImage
            source={{
              uri: getImageUrl(
                item?.logo?.image_fit,
                item?.logo?.image_path,
                '600/6000',
              ),
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={styles.vendorImgStyle}
          />
        </View>

        <View
          style={{
            paddingHorizontal: moderateScale(20),
            flex: 0.8,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                ...styles.vendorTitle,
                flex: 0.95,
              }}>
              {item?.name}
            </Text>
            {!isEmpty(item?.product) && (
              <View
                style={{
                  ...styles.completePartialMatchView,
                  backgroundColor:
                    item?.product[0]?.match == 'C'
                      ? colors.greenC
                      : colors.redF,
                }}>
                <Text
                  style={{
                    ...styles.completePartialMatchTxt,
                    color:
                      item?.product[0]?.match == 'C'
                        ? colors.greenD
                        : colors.redG,
                  }}>
                  {item?.product[0]?.match == 'C'
                    ? strings.COMPLETE_MATCH
                    : strings.PARTIAL_MATCH}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.locationImgView}>
            <Image
              source={imagePath.icLocationBlue}
              style={{
                tintColor: themeColors.primary_color,
              }}
            />
            <Text style={styles.addressTxt}>{item?.address}</Text>
          </View>
          {!isEmpty(item?.product) && (
            <Text style={styles.priceText}>
              {tokenConverterPlusCurrencyNumberFormater(
                item?.product[0]?.price,
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          )}
          <ButtonWithLoader
            onPress={() => onSelectVendorAddToCart(item)}
            btnText={strings.SELECT_VENDOR}
            btnTextStyle={styles.selectVendorBtnTxt}
            btnStyle={styles.selectVendorBtnStyle}
            color={themeColors.primary_color}
            isLoading={pressedItem?.id == item?.id ? isLoading : false}
          />
        </View>
      </View>
    );
  };

  return (
    <WrapperContainer>
      <Header
        centerTitle={strings.AVAILABLE_VENDORS}
        leftIcon={imagePath.icBackb}
      />

      <FlatList
        data={allVendors}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingHorizontal: moderateScaleVertical(16),
          marginTop: moderateScaleVertical(15),
        }}
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        ItemSeparatorComponent={() => (
          <View style={{height: moderateScaleVertical(16)}} />
        )}
      />
    </WrapperContainer>
  );
}

export function stylesFunc({fontFamily, themeColors, isDarkMode}) {
  const styles = StyleSheet.create({
    mainRowStyle: {
      backgroundColor: colors.seaGreen1,
      flexDirection: 'row',
      paddingLeft: moderateScale(15),
      paddingVertical: moderateScaleVertical(10),
      borderRadius: moderateScale(5),
    },
    vendorImgStyle: {
      height: moderateScale(70),
      width: moderateScale(70),
      borderRadius: moderateScale(35),
    },
    completePartialMatchView: {
      backgroundColor: colors.greenC,
      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: moderateScale(2),
      height: moderateScaleVertical(20),
    },
    completePartialMatchTxt: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(8),
      color: colors.greenD,
      textTransform: 'uppercase',
      paddingHorizontal: 4,
    },
    vendorTitle: {
      fontFamily: fontFamily?.bold,
      fontSize: textScale(14),
      color: colors.black,
    },
    locationImgView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScaleVertical(6),
    },
    addressTxt: {
      marginLeft: 5,
      fontFamily: fontFamily?.regular,
      fontSize: textScale(12),
      color: colors.blackOpacity43,
    },
    priceText: {
      marginTop: moderateScaleVertical(6),
      fontFamily: fontFamily?.bold,
      fontSize: textScale(14),
      color: colors.black,
    },
    selectVendorBtnTxt: {
      color: themeColors.primary_color,
      textTransform: 'none',
      fontSize: textScale(14),
    },
    selectVendorBtnStyle: {
      marginTop: moderateScaleVertical(20),
      height: moderateScaleVertical(40),
      borderRadius: moderateScale(5),
      borderColor: themeColors.primary_color,
      borderWidth: 1,
    },
  });
  return styles;
}
