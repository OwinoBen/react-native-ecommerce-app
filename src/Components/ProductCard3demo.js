import React, {useState} from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc, {hitSlopProp} from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../utils/commonFunction';
import {
  getImageUrl,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';
import HtmlViewComp from './HtmlViewComp';

const ProductCard3demo = ({
  data = {},
  onPress = () => {},
  cardWidth,
  cardStyle = {},
  onAddtoWishlist,
  addToCart = () => {},
  activeOpacity = 1,
  bottomText = strings.BUY_NOW,
  index,
  onIncrement,
  onDecrement,
  selectedCartItem,
}) => {
  // data['qty'] = 1
  const [state, setState] = useState({
    selectedIndex: -1,
    selectedIndexForCartIcon: -1,
  });
  const {selectedIndex, selectedIndexForCartIcon} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const isDarkMode = theme;
  const currentTheme = useSelector((state) => state?.appTheme);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const {appStyle, themeColors, appData} = useSelector(
    (state) => state?.initBoot,
  );
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;

  const {themeLayouts} = currentTheme;
  const commonStyles = commonStylesFunc({fontFamily});
  const cardWidthNew = cardWidth ? cardWidth : width * 0.5 - 21.5;
  const url1 = data?.media[0]?.image?.path.image_fit;
  const url2 = data?.media[0]?.image?.path.image_path;
  const getImage = getImageUrl(
    url1,
    url2,
    selectedIndex == index ? '300/300' : '300/300',
  );

  const scaleInAnimated = new Animated.Value(0);

  const changePosition = () => {
    let i = selectedIndex == -1 ? index : -1;
    updateState({selectedIndex: i});
  };

  const changePositionForCartIcon = () => {
    let i = selectedIndexForCartIcon == -1 ? index : -1;
    updateState({selectedIndexForCartIcon: i});
  };

  let htmlText = data?.translation[0]?.body_html || null;

  return (
    <Animatable.View
      animation={index > 8 ? '' : 'fadeInUp'}
      delay={index > 8 ? 1 * 100 : index * 10}>
      <TouchableOpacity
        // disabled
        activeOpacity={0.6}
        onPress={onPress}
        onPressIn={() => pressInAnimation(scaleInAnimated)}
        onPressOut={() => pressOutAnimation(scaleInAnimated)}
        style={{
          borderRadius: 10,
          flexDirection: selectedIndex == index ? 'column' : 'row',
          justifyContent: 'space-between',
          marginVertical: moderateScaleVertical(10),
          paddingHorizontal: 16,
        }}>
        <Animatable.View
          key={selectedIndex}
          animation={selectedIndex == index ? 'slideInLeft' : 'slideInRight'}
          duration={100}>
          <TouchableOpacity disabled onPress={changePosition} activeOpacity={1}>
            <FastImage
              source={{
                uri: url1 && url2 ? getImage : '',
                priority: FastImage.priority.high,
              }}
              style={{
                height:
                  selectedIndex == index
                    ? moderateScale(200)
                    : moderateScale(100),
                width: selectedIndex == index ? '100%' : moderateScale(100),
                borderRadius: moderateScale(15),
              }}
              resizeMode={selectedIndex == index ? 'contain' : 'contain'}
            />
          </TouchableOpacity>
        </Animatable.View>

        <View
          style={{
            marginLeft: moderateScale(10),
            overflow: 'hidden',
            justifyContent: 'space-between',
            flexDirection: 'row',
            flex: 1,
            // alignItems: 'center',
          }}>
          <Animatable.View
            key={selectedIndex}
            style={{
              flex: 1,
              marginTop: selectedIndex == index ? moderateScaleVertical(8) : 0,
            }}
            // animation={selectedIndex == index ? 'fadeInDown' : 'fadeInLeft'}
          >
            {/* Title View */}
            <View>
              <Text
                numberOfLines={1}
                style={
                  isDarkMode
                    ? {
                        ...commonStyles.futuraBtHeavyFont14,
                        width: moderateScaleVertical(220),
                        // fontFamily: 'Eina02-SemiBold',
                        color: MyDarkTheme.colors.text,
                        fontFamily: fontFamily.regular,
                        fontSize: textScale(12),
                        width: width / 3,
                      }
                    : {
                        ...commonStyles.futuraBtHeavyFont14,
                        width: moderateScaleVertical(220),
                        fontFamily: fontFamily.regular,
                        fontSize: textScale(12),
                        width: width / 3,
                        // fontFamily: 'Eina02-SemiBold',
                      }
                }>
                {data?.translation[0]?.title}
              </Text>
            </View>

            {/* Price view */}
            <View
              style={{
                paddingTop: moderateScale(5),
                paddingBottom: moderateScale(5),
              }}>
              <Text
                numberOfLines={1}
                style={{
                  ...commonStyles.mediumFont14,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  fontSize: textScale(12),
                  fontFamily: fontFamily.regular,
                }}>
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(data?.variant[0]?.multiplier) *
                    Number(data?.variant[0]?.price),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                  
                )}
              </Text>
            </View>

            {/* rating View */}
            {!!appData?.profile?.preferences?.rating_check && !!data?.averageRating && (
              <View
                style={{
                  borderWidth: 0.5,
                  alignSelf: 'flex-start',
                  padding: 2,
                  borderRadius: 2,
                  marginBottom: moderateScaleVertical(12),
                  borderColor: colors.yellowB,
                  backgroundColor: colors.yellowOpacity10,
                }}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={Number(data?.averageRating).toFixed(1)}
                  fullStarColor={colors.yellowB}
                  starSize={8}
                  containerStyle={{width: width / 9}}
                />
              </View>
            )}
            <View style={{width: width / 2}}>
              {!!htmlText && (
                <HtmlViewComp
                  plainHtml={htmlText}
                  nodeComponentProps={{
                    numberOfLines: 2,
                  }}
                />
              )}
            </View>
          </Animatable.View>

          {!!data?.variant[0]?.quantity ? (
            <View
              style={{
                marginTop:
                  selectedIndex == index ? moderateScaleVertical(8) : 0,
                alignItems: 'center',
              }}>
              {(!!data?.variant[0]?.check_if_in_cart_app &&
                data?.variant[0]?.check_if_in_cart_app.length > 0) ||
              !!data?.qty ? (
                <View
                  style={{
                    borderRadius: moderateScale(5),
                    backgroundColor: themeColors.primary_color,
                    paddingHorizontal: moderateScale(6),
                    paddingVertical: moderateScaleVertical(2),
                    borderRadius: moderateScale(4),
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    style={{alignItems: 'center'}}
                    onPress={onDecrement}
                    activeOpacity={0.8}
                    hitSlop={hitSlopProp}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: moderateScale(20),
                        color: colors.white,
                      }}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: moderateScale(16),
                        color: colors.white,
                        marginHorizontal: 16,
                      }}>
                      {data?.qty ||
                        data?.variant[0].check_if_in_cart_app[0].quantity}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{alignItems: 'center'}}
                    activeOpacity={0.8}
                    hitSlop={hitSlopProp}
                    onPress={onIncrement}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: moderateScale(20),
                        color: colors.white,
                      }}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={addToCart}
                  style={{
                    borderWidth: 1,
                    padding: 6,
                    borderRadius: 8,
                    borderColor: themeColors.primary_color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                  }}
                  // onPress={onPress}
                >
                  <Text
                    style={{
                      fontSize: textScale(10),
                      color: themeColors.primary_color,
                      fontFamily: fontFamily.bold,
                    }}>
                    ADD
                  </Text>
                  {/* <Image source={imagePath.greyRoundPlus} /> */}
                </TouchableOpacity>
              )}
              {(!!data?.add_on && data?.add_on.length !== 0) ||
              (!!data?.variantSet && data?.variantSet.length !== 0) ? (
                <Text
                  style={{
                    fontSize: textScale(8),
                    color: themeColors.primary_color,
                    fontFamily: fontFamily.medium,
                    marginTop: moderateScaleVertical(4),
                    color: colors.yellowC,
                  }}>
                  Customisable
                </Text>
              ) : null}
            </View>
          ) : (
            <Text
              style={{
                color: colors.orangeB,
                fontSize: textScale(10),
                lineHeight: 20,
                fontFamily: fontFamily.medium,
              }}>
              {strings.OUT_OF_STOCK}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};
export default React.memo(ProductCard3demo);
