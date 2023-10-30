
import React from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { currencyNumberFormatter } from '../utils/commonFunction';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

const ProductsCompTwo = ({ isDiscount, item, imageStyle, onPress = () => { } }) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const { themeColors, appStyle, currencies, appData } = useSelector(
    (state) => state?.initBoot,
  );
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
    media[0]?.image?.path?.image_fit,
    media[0]?.image?.path?.image_path,
    '600/600',
  );
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        width: width / 2.5,
        ...getScaleTransformationStyle(scaleInAnimated),
      }}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}>
      <FastImage
        resizeMode={FastImage.resizeMode.contains}
        source={{
          uri: imageUrl,
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.high,

        }}
        style={{
          width: width / 2.5,
          // backgroundColor: isDarkMode
          //   ? colors.whiteOpacity22
          //   : colors.white,
          height: moderateScaleVertical(180),
          borderRadius: moderateScale(8),
          ...imageStyle,
          // resizeMode={FastImage.resizeMode.contains}

        }}
        imageStyle={{
          height: moderateScaleVertical(180),
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
          {/* here goes card add buttons */}
        {/* <View
          style={{
            flex: 1,
            justifyContent: url1 ? 'flex-start' : 'center',
            marginLeft: url1 ? 0 : moderateScale(100),
            marginTop: url1
              ? 0
              : !!(
                data?.translation[0]?.translation_description ||
                data?.translation_description
              )
                ? moderateScale(30)
                : moderateScale(20),
          }}>
          {data?.has_inventory == 0 ||
            !!data?.variant[0]?.quantity ||
            (!!typeId && typeId == 8) ||
            (!!businessType && businessType == 'laundry') ? (
            <View
              style={{
                marginTop:
                  selectedIndex == index ? moderateScaleVertical(8) : 0,
                alignItems: 'center',
              }}>
              {((!!data?.check_if_in_cart_app &&
                data?.check_if_in_cart_app.length > 0) ||
                !!data?.qty ||
                totalProductQty) &&
                CartItems.data !== null ? (
                <View
                  style={{
                    ...styles.addBtnStyle,
                    paddingVertical: 0,
                    height: moderateScale(38),

                    backgroundColor: isDarkMode
                      ? themeColors.primary_color
                      : colors.greyColor2,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderRadius: moderateScale(8),
                    paddingHorizontal: moderateScale(12),
                    width: moderateScale(100),
                  }}>
                  <TouchableOpacity
                    disabled={selectedItemID == data?.id}
                    onPress={onDecrementQty}
                    activeOpacity={0.8}
                    hitSlop={hitSlopProp}>
                    <Image
                      style={{
                        tintColor: isDarkMode
                          ? colors.white
                          : themeColors.primary_color,
                      }}
                      source={imagePath.icMinus2}
                    />
                  </TouchableOpacity>

                  <Animatable.View>
                    {selectedItemID == data?.id && btnLoader ? (
                      <UIActivityIndicator
                        size={moderateScale(16)}
                        color={themeColors.primary_color}
                        style={{
                          marginHorizontal: moderateScale(8),
                        }}
                      />
                    ) : (
                      <Animatable.View style={{ overflow: 'hidden' }}>
                        {isVisibleText ? (
                          <Animatable.Text
                           
                            duration={200}
                            numberOfLines={2}
                            style={{
                              fontFamily: fontFamily.medium,
                              fontSize: moderateScale(14),
                              color: isDarkMode
                                ? colors.white
                                : themeColors.primary_color,
                              marginHorizontal: moderateScale(8),
                            }}>
                            {qtyText}
                          </Animatable.Text>
                        ) : null}
                      </Animatable.View>
                    )}
                  </Animatable.View>
                  <TouchableOpacity
                    disabled={selectedItemID == data?.id}
                    activeOpacity={0.8}
                    hitSlop={hitSlopProp}
                    onPress={onIncrementQty}>
                    <Image
                      style={{
                        tintColor: isDarkMode
                          ? colors.white
                          : themeColors.primary_color,
                      }}
                      source={imagePath.icAdd4}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    disabled={selectedItemID == data?.id}
                    onPress={addToCart}
                    style={{
                      ...styles.addBtnStyle,
                      backgroundColor: isDarkMode
                        ? themeColors.primary_color
                        : colors.greyColor2,
                      width: moderateScale(100),
                      minHeight: moderateScaleVertical(35),
                    }}>
                    {selectedItemID == data?.id ? (
                      <UIActivityIndicator
                        size={moderateScale(18)}
                        color={themeColors.primary_color}
                      />
                    ) : (
                      <View>
                        <Text
                          style={{
                            ...styles.addStyleText,
                            color: isDarkMode
                              ? colors.white
                              : themeColors.primary_color,
                          }}>
                          {strings.ADD}{' '}
                          {data?.minimum_order_count > 1
                            ? `(${data?.minimum_order_count})`
                            : ''}
                        </Text>
                      </View>
                    )}

                  </TouchableOpacity>
                </>
              )}
              {(!!data?.add_on_count && data?.add_on_count !== 0) ||
                (!!data?.variant_set_count && data?.variant_set_count !== 0) ? (
                <Text
                  style={{
                    ...styles.customTextStyle,
                    textTransform: 'lowercase',
                    color: isDarkMode
                      ? colors.whiteOpacity77
                      : colors.blackOpacity40,
                  }}>
                  {strings.CUSTOMISABLE}
                </Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.outOfStock}>{strings.OUT_OF_STOCK}</Text>
          )}
        </View> */}

      </FastImage>
      <View style={{ marginVertical: moderateScaleVertical(6) }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            textAlign: 'left',
            lineHeight: moderateScale(16),
          }}>
          {translation[0]?.title}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: textScale(11),
            fontFamily: fontFamily.regular,
            marginVertical: moderateScaleVertical(4),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity66,
            textAlign: 'left',
          }}>
          {vendor?.name}
        </Text>
        {!isDiscount ? (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 0.5, alignItems: 'flex-start' }}>
              {category?.category_detail?.translation[0]?.name && (
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.inTextStyle,
                    fontFamily: fontFamily.regular,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity66,
                    width: width / 4,
                  }}>
                  {strings.IN} {category?.category_detail?.translation[0]?.name}
                </Text>
              )}
            </View>
            <View style={{ marginHorizontal: 10 }} />
            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: textScale(10),
                  fontFamily: fontFamily.medium,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                <Text>
                  {`${currencies?.primary_currency?.symbol
                    } ${currencyNumberFormatter(
                      Number(variant[0]?.price),
                      appData?.profile?.preferences?.digit_after_decimal,
                    )}`}
                </Text>
              </Text>
            </View>
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
              }}>
              {strings.IN} {category?.category_detail?.translation[0]?.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.medium,
                  color: colors.green,
                  marginVertical: moderateScaleVertical(8),
                }}>
                {currencies?.primary_currency.symbol} {variant[0]?.price}
              </Text>
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity40,
                  marginLeft: moderateScale(12),
                }}>
                {currencies?.primary_currency.symbol} {variant[0]?.price}
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
    // marginLeft:moderateScale(5),
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

export default React.memo(ProductsCompTwo);
