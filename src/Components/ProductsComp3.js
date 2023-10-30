import React from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation
} from '../utils/helperFunctions';
let imageHeight = parseInt(moderateScale(146))
let imageWidth = parseInt(moderateScale(152))

const ProductsComp = ({ containerStyle = {}, isDiscount, item, imageStyle, onPress = () => { }, numberOfLines = 1 }) => {
  const { themeColors, appStyle, currencies, themeColor, themeToggle, appData } =
    useSelector((state) => state?.initBoot);
  const { additional_preferences, digit_after_decimal } = useSelector(
    (state) => state?.initBoot?.appData?.profile?.preferences,
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const scaleInAnimated = new Animated.Value(0);

  const {
    translation = [],
    category = {},
    media = [],
    vendor = {},
    variant = [],
  } = item;


  const imageUrl = getImageUrl(
    media[0]?.image?.path?.proxy_url,
    media[0]?.image?.path?.image_path,
    `${500}/${500}`,
  );



  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white,
        // elevation: 1,
        // marginVertical: 2,
        // width: imageWidth,
        // borderRadius: moderateScale(5),
        // borderColor: colors.borderStroke,
        // padding: moderateScale(6),
        // width: imageWidth,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 4,
        margin: 1,
        borderTopLeftRadius:moderateScale(12),
        borderTopRightRadius:moderateScale(12),
        ...containerStyle,
        ...getScaleTransformationStyle(scaleInAnimated),

      }}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}>
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={{
          uri: imageUrl,
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.high,
        }}

        style={{
          height: imageHeight,
          width: imageWidth,
          backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.grey1,
          // borderTopLeftRadius: moderateScale(5),
          // borderTopRightRadius: moderateScale(5),
          alignSelf: 'center',
          borderRadius:moderateScale(12),
          ...imageStyle,
        }}
        imageStyle={{
          borderRadius: moderateScale(10),
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyColor,
        }}>
        {!!appData?.profile?.preferences?.rating_check && !!item?.averageRating && item?.averageRating !== '0.0' && (
          <View style={styles.hdrRatingTxtView}>
            <Text
              style={{
                ...styles.ratingTxt,
                fontFamily: fontFamily.medium,
              }}>
              {Number(item?.averageRating).toFixed(1)}
            </Text>
            <Image
              style={styles.starImg}
              source={imagePath.star}
              resizeMode="contain"
            />
          </View>
        )}
      </FastImage>
      <View style={{ marginVertical: moderateScaleVertical(8) }}>
        <Text
          numberOfLines={numberOfLines}
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            textAlign: 'left',
            marginLeft: moderateScale(8),
          }}>
          {translation[0]?.title || item?.title || item?.sku}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: textScale(11),
            fontFamily: fontFamily.regular,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity66,
            textAlign: 'left',
            marginLeft: moderateScale(8),
            marginBottom: moderateScaleVertical(4)
          }}>
          {vendor?.name}
        </Text>
        {!isDiscount ? (
          <View style={{ flexDirection: 'row', flex: 1, marginHorizontal: moderateScale(8) }}>
            <View style={{
              //   flex: 1,
            }}>
              <Text
                style={{
                  fontSize: textScale(10),
                  fontFamily: fontFamily.bold,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,

                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  variant[0].price,
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,

                )}
              </Text>
            </View>
            {!!category?.category_detail?.translation[0]?.name && (
              <View style={{
                // flex: 0.4,
                alignItems: "flex-end",
                marginLeft: moderateScale(8)
              }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: textScale(9),
                    fontFamily: fontFamily.regular,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity66,

                  }}>
                  {category?.category_detail?.translation[0]?.name || category}
                </Text>
              </View>
            )}



          </View>
        ) : (
          <View>
            <Text
              style={{
                ...styles.inTextStyle,
                fontFamily: fontFamily.regular,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity66,
                marginLeft: moderateScale(5),
              }}>
              {strings.IN} {category?.category_detail?.translation[0]?.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: moderateScale(5),
                flexWrap: 'wrap',
              }}>
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.green,
                  marginVertical: moderateScaleVertical(8),
                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  variant[0]?.price,
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  textDecorationLine: 'line-through',
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity40,
                  marginLeft: moderateScale(12),
                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  variant[0]?.price,
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}

              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  hdrRatingTxtView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    paddingVertical: moderateScale(2),
    paddingHorizontal: moderateScale(4),
    alignSelf: 'flex-start',
    borderRadius: moderateScale(2),
    marginTop: moderateScaleVertical(16),
  },
  ratingTxt: {
    textAlign: 'left',
    color: colors.white,
    fontSize: textScale(9),
    textAlign: 'left',
  },
  starImg: {
    tintColor: colors.white,
    marginLeft: 2,
    width: 9,
    height: 9,
  },
  inTextStyle: {
    fontSize: textScale(9),
    width: width / 3,
    textAlign: 'left',
  },
});

export default React.memo(ProductsComp);