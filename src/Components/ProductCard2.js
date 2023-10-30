import React from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import DashedLine from 'react-native-dashed-line';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
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

const ProductCard2 = ({
  data = {},
  onPress = () => {},
  cardWidth,
  cardStyle = {},
  onAddtoWishlist,
  addToCart = () => {},
  activeOpacity = 1,
  bottomText = strings.BUY_NOW,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const currentTheme = useSelector((state) => state?.appTheme);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const {appStyle, themeColors, appData} = useSelector(
    (state) => state?.initBoot,
  );
  const {additional_preferences, digit_after_decimal} = appData?.profile?.preferences || {};

  const fontFamily = appStyle?.fontSizeData;

  const {themeLayouts} = currentTheme;
  const commonStyles = commonStylesFunc({fontFamily});
  const cardWidthNew = cardWidth ? cardWidth : width * 0.5 - 21.5;
  const url1 = data?.media[0]?.image?.path.proxy_url;
  const url2 = data?.media[0]?.image?.path.image_path;
  const getImage = getImageUrl(url1, url2, '500/500');
  const productPrice =
    data?.variant[0]?.price *
    (data?.variant[0]?.multiplier ? data?.variant[0]?.multiplier : 1);
  const scaleInAnimated = new Animated.Value(0);
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      style={[
        {
          borderRadius: 10,
          flexDirection: 'row',
          marginHorizontal: moderateScale(20),
          justifyContent: 'space-between',
          marginVertical: moderateScaleVertical(10),
        },
      ]}>
      <View style={{width: width - moderateScale(160), overflow: 'hidden'}}>
        <View
          style={{
            paddingTop: moderateScale(5),
          }}>
          <Text
            numberOfLines={1}
            style={{
              ...commonStyles.futuraBtHeavyFont14,
              width: moderateScaleVertical(220),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {data?.translation[0]?.title}
          </Text>
        </View>

        <View
          style={{
            // height: 30,
            paddingTop: moderateScale(5),
            paddingBottom: moderateScale(5),
          }}>
          <Text
            numberOfLines={1}
            style={{
              ...commonStyles.mediumFont14,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {`${tokenConverterPlusCurrencyNumberFormater(
              Number(data?.variant[0]?.multiplier) *
                Number(data?.variant[0]?.price),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}
          </Text>
        </View>
        {/* {data?.translation[0]?.body_html ? (
          <HTMLView
            value={`<p>${data?.translation[0]?.body_html} </p>`}
            nodeComponentProps={{
              numberOfLines: 1,
            }}
            stylesheet={{
              p: [
                {
                  color: colors.textGreyE,
                  fontSize: textScale(14),
                  fontFamily: fontFamily.regular,
                },
                {
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyE,
                },
              ],
            }}
          />
        ) : null} */}

        <Text
          style={[
            {
              color: colors.textGreyE,
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            },
            {
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyE,
            },
          ]}>
          {data?.translation_description}
        </Text>

        <DashedLine
          dashLength={5}
          dashThickness={1}
          dashGap={2}
          dashColor={colors.greyLight}
          style={{marginTop: moderateScale(7)}}
        />
      </View>
      <Animated.View
        style={{
          height: moderateScale(100),
          width: moderateScale(100),
        }}>
        <FastImage
          source={{
            uri: url1 && url2 ? getImage : '',
            priority: FastImage.priority.high,
          }}
          style={{
            height: moderateScale(100),
            width: moderateScale(100),
            borderRadius: moderateScale(15),
            // marginHorizontal: ,
            alignSelf: 'center',
          }}
          resizeMode="cover"
        />

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={addToCart}
          // onPress={()=>alert(123)}
          style={{
            backgroundColor: colors.white,
            position: 'absolute',
            paddingHorizontal: moderateScale(10),
            paddingVertical: moderateScaleVertical(5),
            borderRadius: moderateScale(10),
            bottom: 0,
            alignSelf: 'center',
            shadowOpacity: 0.5,
            elevation: 5,
          }}>
          <Text
            numberOfLines={1}
            onPress={addToCart}
            style={{
              ...commonStyles.mediumFont14,
              opacity: 1,
              color: themeColors.primary_color,
            }}>
            {strings.ADD}
          </Text>
        </TouchableOpacity>
        {/* {data?.is_wishlist ? (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.buyBgDark,
              paddingHorizontal: moderateScale(16),
              paddingVertical: moderateScaleVertical(10),
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={addToCart}
              // onPress={()=>alert(123)}
              style={{
                flex: 0.7,
                flexDirection: 'row',
                justifyContent: 'center',
                borderRightColor: colors.white,
                borderRightWidth: 1,
              }}>
              <Text
                onPress={addToCart}
                style={{
                  ...commonStyles.mediumFont14,
                  opacity: 1,
                  color: colors.white,
                }}>
                {strings.BUY_NOW}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 0.3, alignItems: 'flex-end'}}
              onPress={onAddtoWishlist}>
              {!!data?.inwishlist ? (
                <Image source={imagePath.whiteFilledHeart} />
              ) : (
                <Image source={imagePath.favWhite} />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.buyBgDark,
              paddingHorizontal: moderateScale(16),
              paddingVertical: moderateScaleVertical(10),
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={addToCart}
              style={{
                flex: 0.7,
                flexDirection: 'row',
                justifyContent: 'center',
                borderRightColor: colors.white,
                //  borderRightWidth: 1,
              }}>
              <Text
                style={{
                  ...commonStyles.mediumFont14,
                  opacity: 1,
                  color: colors.white,
                }}>
                {bottomText}
              </Text>
            </TouchableOpacity>
          </View>
        )} */}
      </Animated.View>
    </TouchableOpacity>
  );
};
export default React.memo(ProductCard2);
