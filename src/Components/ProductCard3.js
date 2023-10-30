import { isArray, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import { UIActivityIndicator } from 'react-native-indicators';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import { getImageUrl } from '../utils/helperFunctions';

let numberOfHits = [];

const ProductCard3 = ({
  data = {},
  onPress = () => { },
  addToCart = () => { },
  index,
  onIncrement,
  onDecrement,
  selectedItemID,
  Servicetype,
  isVisibleModal,
  selectedItemIndx,
  btnLoader,
  categoryInfo = '',
  businessType,
  animateText = 0,
  section = {},
  CartItems = {},
}) => {
  // data['qty'] = 1
  const [isAdd, setAdd] = useState(false);
  const [state, setState] = useState({
    selectedIndex: -1,
    selectedIndexForCartIcon: -1,
    isVisibleTextSlideUp: false,
    qtyText: '1',
    isVisibleText: true,
    disabledBtn: false,
    isIncrement: true,
  });
  const {
    selectedIndex,
    selectedIndexForCartIcon,
    isVisibleText,
    qtyText,
    isVisibleTextSlideUp,
    disabledBtn,
    isIncrement,
  } = state;

  var totalProductQty = 0;
  if (data?.check_if_in_cart_app) {
    data?.check_if_in_cart_app.map((val) => {
      totalProductQty = totalProductQty + val.quantity;
    });
  }

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const isDarkMode = theme;
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const { appStyle, themeColors, appData } = useSelector(
    (state) => state?.initBoot,
  );
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};

  const fontFamily = appStyle?.fontSizeData;
  const styles = styleData({ themeColors, fontFamily });

  const commonStyles = commonStylesFunc({ fontFamily });

  const url1 = !isEmpty(data?.media) && data?.media[0]?.image?.path.image_fit;
  const url2 = !isEmpty(data?.media) && data?.media[0]?.image?.path.image_path;

  const getImage = (quality) => getImageUrl(url1, url2, quality);

  const getIconImage = (url1, url2, quality) =>
    getImageUrl(url1, url2, quality);


  useEffect(() => {
    updateState({ qtyText: data?.qty || totalProductQty });
  }, [totalProductQty]);

  useEffect(() => {
    updateState({ qtyText: data?.qty || totalProductQty });
  }, [data?.qty]);


  const initAnimation = async () => {
    updateState({ disabledBtn: true });
    console.log('checking text >>>>', numberOfHits[0]);
    updateState({ isVisibleTextSlideUp: true });
    updateState({ qtyText: Number(numberOfHits[0]) + 1 });

    await setTimeout(() => {
      updateState({ isVisibleText: false, isVisibleTextSlideUp: false });
      updateState({ isVisibleText: true });
    }, 250);
    await setTimeout(() => {
      numberOfHits.shift();
    }, 200);
    setTimeout(() => {
      if (numberOfHits.length > 0) {
        initAnimation();
      }
    }, 800);
    setTimeout(() => {
      updateState({ disabledBtn: false });
    }, 300);

    return;
    numberOfHits.forEach((el, index) => {
      console.log('checking text >>>>', el);
      updateState({ isVisibleTextSlideUp: true });
      updateState({ qtyText: el });

      setTimeout(() => {
        updateState({ isVisibleText: false });
        updateState({ isVisibleText: true });
        updateState({ isVisibleTextSlideUp: false });
      }, 500);
      if (numberOfHits.length === index + 1) {
        numberOfHits = [];
      }
    });
  };

  const onIncrementQty = () => {
    setAdd(true);
    if (
      !!categoryInfo?.is_vendor_closed &&
      categoryInfo?.closed_store_order_scheduled !== 1
    ) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    if (
      (!!data?.add_on_count && data?.add_on_count !== 0) ||
      (!!data?.variant_set_count && data?.variant_set_count !== 0)
    ) {
      onIncrement();
    } else {
      updateState({ ...state, isIncrement: true });
      // if (!disabledBtn) {
      //   const isEnabled = numberOfHits.length === 0;
      //   numberOfHits.push(data?.qty || totalProductQty);
      //   if (isEnabled) {
      //     initAnimation();
      //   }
      // }
      onIncrement();
    }
  };
  const onDecrementQty = () => {
    setAdd(false);
    if (
      (!!data?.add_on_count && data?.add_on_count !== 0) ||
      (!!data?.variant_set_count && data?.variant_set_count !== 0)
    ) {
      onDecrement();
    } else {
      updateState({ ...state, isIncrement: false });
      // if (!disabledBtn) {
      //   const isEnabled = numberOfHits.length === 0;
      //   numberOfHits.push(data?.qty || totalProductQty);
      //   if (isEnabled) {
      //     initAnimation();
      //   }
      // }
      onDecrement();
    }
  };

  let typeId = data?.category_id;
  return (

    <TouchableOpacity
      disabled={btnLoader}
      activeOpacity={0.6}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        paddingHorizontal: moderateScale(16),
        flex: 1
      }}>
      <View
        style={{
          flex: 0.7
        }}>

        <View style={{}}>
          {data && !!data?.tags && data?.tags.length > 0 ? (
            <View>
              {!!data.tags[0]?.tag?.icon ? (
                <Image
                  source={{
                    uri: getIconImage(
                      data.tags[0]?.tag?.icon?.image_fit,
                      data?.tags[0]?.tag?.icon?.image_path,
                      '50/50',
                    ),
                  }}
                  style={{
                    marginLeft: moderateScale(1),
                    marginBottom: moderateScale(5),
                    width: moderateScale(17),
                    height: moderateScale(17),
                  }}
                />
              ) : null}
            </View>
          ) : null}

          <Text
            style={{
              ...commonStyles.futuraBtHeavyFont14,
              color: isDarkMode ? colors.white : colors.black,
              fontFamily: fontFamily.regular,
              fontSize: textScale(12),
              width: width / 2.5,
            }}>
            {!isEmpty(data?.translation) ? data?.translation[0]?.title : data?.title || data?.sku}
          </Text>

          {data?.vendor?.name && (
            <Text
              style={{
                fontSize: textScale(9),
                color: isDarkMode ? colors.white : colors.grayOpacity51,
                marginVertical: moderateScaleVertical(4),
                textAlign: 'left',
              }}>
              {data?.vendor?.name}
            </Text>
          )}

          {!!section?.title ? (
            <Text
              numberOfLines={1}
              style={{
                ...styles.inTextStyle,
                color: isDarkMode
                  ? colors.white
                  : colors.blackOpacity40,
              }}>
              {strings.IN}
              {` ${data?.title}`}
            </Text>
          ) : null}
        </View>


        {!!appData?.profile?.preferences?.rating_check && !!data?.averageRating && (
          <View
            style={{
              borderWidth: 0.5,
              alignSelf: 'flex-start',
              padding: 2,
              borderRadius: 2,
              marginVertical: moderateScaleVertical(4),
              borderColor: colors.yellowB,
              backgroundColor: colors.yellowOpacity10,
            }}>
            <StarRating
              disabled={false}
              maxStars={5}
              rating={Number(parseInt(data?.averageRating).toFixed(1))}
              fullStarColor={colors.yellowB}
              starSize={8}
              containerStyle={{ width: width / 9 }}
            />
          </View>
        )}

        {/* Price view */}
        <View
          style={{
            paddingTop: moderateScale(5),
            paddingBottom: moderateScale(5),
            flexDirection: 'row',
          }}>
          <Text
            numberOfLines={1}
            style={{
              ...commonStyles.mediumFont14,
              color: isDarkMode ? colors.white : colors.black,
              fontSize: textScale(12),
              fontFamily: fontFamily.regular,
            }}>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(data?.variant[0]?.price) * Number(data?.variant[0]?.multiplier || 1),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
              currencies
            )}
          </Text>

          {Number(data?.variant[0]?.compare_at_price) >
            Number(data?.variant[0]?.price) && (
        
              <Text
                numberOfLines={1}
                style={{
                  ...commonStyles.mediumFont14,
                  color: isDarkMode ? colors.white : colors.redB,
                  fontSize: textScale(12),
                  fontFamily: fontFamily.regular,
                  textDecorationLine: 'line-through',
                  marginHorizontal: moderateScale(8),
           
        
                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(data?.variant[0]?.compare_at_price) * Number(data?.variant[0]?.multiplier || 1),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                  currencies
                )}
              </Text>
           
            )}

          {!!data?.is_recurring_booking &&
            <TouchableOpacity
              style={{
                color: isDarkMode ? MyDarkTheme.colors.text : colors.redB,
                marginHorizontal: moderateScale(8),
              }}
              onPress={onPress}
              activeOpacity={0.8}>
              <Image
                style={{
                  tintColor: isDarkMode
                    ? colors.white
                    : themeColors.primary_color,
                }}
                source={imagePath.ic_calendar}
              />
            </TouchableOpacity>
          }
        </View>

        <View style={{}}>
          {!!data?.translation_description ||
            !!data?.translation[0]?.translation_description ? (
            <View style={{}}>
              <Text
                numberOfLines={3}
                style={{
                  fontSize: textScale(10),
                  fontFamily: fontFamily.regular,
                  lineHeight: moderateScale(14),
                  color: isDarkMode
                    ? colors.white
                    : colors.blackOpacity66,
                  textAlign: 'left',
                }}>
                {!!data?.translation_description
                  ? data?.translation_description.toString()
                  : !!data?.translation[0]?.translation_description
                    ? data?.translation[0]?.translation_description
                    : ''}
              </Text>
            </View>
          ) : null}
        </View>

      </View>

      <View
        style={{
          marginRight: 0,
          flex: 0.3,
          alignItems: 'flex-end'
        }}>
        {!!url1 ? (
          <FastImage
            style={{
              ...styles.imgStyle,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
              borderRadius: moderateScale(7),
            }}
            source={{
              uri: getImage('240/240'),
              cache: FastImage.cacheControl.immutable,
              priority: FastImage.priority.high,
            }}
          />

        ) :

          <View
            style={{
              ...styles.imgStyle,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
              borderRadius: moderateScale(7),
            }}

          />
        }

        <View
          style={{
            // justifyContent: url1 ? 'flex-start' : 'center',
            // marginLeft: url1 ? 0 : moderateScale(100),
            // marginTop: url1
            //   ? 0
            //   : !!(
            //       data?.translation[0]?.translation_description ||
            //       data?.translation_description
            //     )
            //   ? moderateScale(30)
            //   : moderateScale(20),
          }}>
          {data?.has_inventory == 0 ||
            !!data?.variant[0]?.quantity ||
            (!!typeId && typeId == 8) ||
            (!!businessType && businessType == 'laundry') ? (
            <View
              style={{
                marginTop:
                  selectedIndex == index ? moderateScaleVertical(8) : moderateScaleVertical(8),
                alignItems: 'center',
              }}>
              {((!!data?.check_if_in_cart_app &&
                data?.check_if_in_cart_app.length > 0) ||
                !!data?.qty ||
                totalProductQty) &&
                CartItems.data !== null && dine_In_Type != 'appointment' ? (
                <View
                  // pointerEvents={!!categoryInfo?.is_vendor_closed && !!categoryInfo?.closed_store_order_scheduled !== 1 ? 'none' : 'auto'}
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
                            // key={String(animateText)}

                            // animation={isAdd ? 'slideInUp' : 'slideInDown'}
                            // easing={'ease-out-sine'}
                            // animation={
                            //   isIncrement
                            //     ? isVisibleTextSlideUp
                            //       ? textAnimateForIncrement
                            //       : textAnimateForIncrement_
                            //     : isVisibleTextSlideUp
                            //     ? textAnimateForDecrement
                            //     : textAnimateForDecrement_
                            // }
                            duration={200}
                            // delay={200}
                            numberOfLines={2}
                            style={{
                              fontFamily: fontFamily.medium,
                              fontSize: moderateScale(14),
                              color: isDarkMode
                                ? colors.white
                                : themeColors.primary_color,
                              // height: moderateScale(100),
                              marginHorizontal: moderateScale(8),
                            }}>
                            {/* {qtyText || data?.qty || totalProductQty} */}
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
                    // hitSlopProp={hitSlopProp}
                    disabled={selectedItemID == data?.id}
                    onPress={addToCart}
                    style={{
                      ...styles.addBtnStyle,
                      backgroundColor: isDarkMode
                        ? themeColors.primary_color
                        : colors.greyColor2,
                      width: moderateScale(100),
                      minHeight: moderateScaleVertical(35),
                      marginTop: moderateScaleVertical(5),
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
                          {!!data?.check_if_in_cart_app && data?.check_if_in_cart_app.length > 0 ? strings.ADDED : strings.ADD}{' '}
                          {data?.minimum_order_count > 1
                            ? `(${data?.minimum_order_count})`
                            : ''}
                        </Text>
                      </View>
                    )}

                    {/* <Image source={imagePath.greyRoundPlus} /> */}
                  </TouchableOpacity>
                </>
              )}
              {(!!data?.add_on_count && data?.add_on_count !== 0) ||
                (!!data?.variant_set_count && data?.variant_set_count !== 0) || (!!isArray(data?.add_on)  && data?.add_on?.length !== 0 )? (
                <Text
                  style={{
                    ...styles.customTextStyle,
                    textTransform: 'lowercase',
                    color: isDarkMode
                      ? colors.white
                      : colors.blackOpacity40,
                  }}>
                  {strings.CUSTOMISABLE}
                </Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.outOfStock}>{strings.OUT_OF_STOCK}</Text>
          )}
        </View>
      </View>

    </TouchableOpacity>

  );
};

function styleData({ themeColors, fontFamily }) {
  const styles = StyleSheet.create({
    outOfStock: {
      color: colors.orangeB,
      fontSize: textScale(10),
      lineHeight: 20,
      fontFamily: fontFamily.medium,
    },
    customTextStyle: {
      fontSize: textScale(8),
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(4),
      color: colors.yellowC,
    },
    addStyleText: {
      fontSize: textScale(10),
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
      marginHorizontal: moderateScale(16),
    },
    addBtnStyle: {
      borderWidth: 1,
      // paddingVertical: moderateScaleVertical(6),
      borderRadius: moderateScale(8),
      borderColor: themeColors.primary_color,
      justifyContent: 'center',
      alignItems: 'center',
      // width: moderateScale(100),
      // minHeight: moderateScaleVertical(35),
      // flexDirection:"row"
      // width: moderateScale(80),
    },
    inTextStyle: {
      width: moderateScaleVertical(220),
      fontFamily: fontFamily.regular,
      fontSize: textScale(9),
      width: width / 3,
      textAlign: 'left',
      marginTop: moderateScaleVertical(6),
      marginBottom: moderateScaleVertical(4),
    },
    imgStyle: {
      height: moderateScale(100),
      width: moderateScale(100),
      borderRadius: moderateScale(15),
    },
  });
  return styles;
}
export default React.memo(ProductCard3);
