import React from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../styles/responsiveSize';

import { appIds } from '../utils/constants/DynamicAppKeys';
import {tokenConverterPlusCurrencyNumberFormater} from '../utils/commonFunction';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';

const ProductCard = ({
  data = {},
  onPress = () => { },
  cardWidth,
  cardStyle = {},
  onAddtoWishlist,
  addToCart = () => { },
  activeOpacity = 1,
  bottomText = strings.BUY_NOW,
  nameTextStyle = {},
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const currentTheme = useSelector((state) => state?.appTheme);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const {appStyle, appData} = useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} = appData?.profile?.preferences || {};

  const fontFamily = appStyle?.fontSizeData;
  const { themeColors, themeLayouts } = currentTheme;
  const commonStyles = commonStylesFunc({ fontFamily });
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
      activeOpacity={activeOpacity}
      onPress={onPress}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      style={[
        { width: cardWidthNew },
        { ...commonStyles.shadowStyle },
        { ...cardStyle },
        { ...getScaleTransformationStyle(scaleInAnimated) },
        { borderRadius: 10 },
      ]}>
      <Animated.View>
        <FastImage
          source={{
            uri: url1 && url2 ? getImage : '',
            priority: FastImage.priority.high,
          }}
          style={{
            height: cardWidthNew,
            width: cardWidthNew,
            borderRadius: 10,
            // marginHorizontal: ,
            alignSelf: 'center',
          }}
          resizeMode="cover"
        />

        <View
          style={{
            // height: 30,
            paddingTop: moderateScale(5),
            paddingHorizontal: moderateScale(5),
          }}>
          <Text
            numberOfLines={1}
            style={{
              ...commonStyles.futuraBtHeavyFont16,
              textAlign: 'center',
              ...nameTextStyle,
              // marginTop: moderateScaleVertical(10),
            }}>
            {data?.translation[0]?.title}
          </Text>
        </View>

      

        {getBundleId() !== appIds.danielleBejjani || Number(data?.variant[0]?.price) !==0? <View
          style={{
            // height: 30,
            paddingTop: moderateScale(5),
            paddingBottom: moderateScale(5),
          }}>
          <Text
            numberOfLines={1}
            style={{
              ...commonStyles.futuraBtHeavyFont14,
              textAlign: 'center',
              // marginTop: 3,
              color: themeColors.currencyRed,
            }}>
            {`${tokenConverterPlusCurrencyNumberFormater(
              Number(data?.variant[0]?.multiplier) *
                Number(data?.variant[0]?.price),
              digit_after_decimal,
              Number(additional_preferences),
              currencies?.primary_currency?.symbol,
              currencies
            )}`}
          </Text>
        </View>
          :null}

        {data?.is_wishlist ? (
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
                numberOfLines={1}
                style={{
                  ...commonStyles.mediumFont14,
                  opacity: 1,
                  color: colors.white,
                  fontFamily: fontFamily?.regular,
                }}>
                {strings.BUY_NOW}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 0.3, alignItems: 'flex-end' }}
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
              }}>
              <Text
                style={{
                  ...commonStyles.mediumFont14,
                  opacity: 1,
                  color: colors.white,
                  fontFamily: fontFamily?.regular,
                }}>
                {bottomText}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};
export default React.memo(ProductCard);
