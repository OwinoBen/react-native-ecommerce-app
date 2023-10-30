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
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getImageUrl, getImageUrlNew, tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import {
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation
} from '../utils/helperFunctions';
let imageHeight = 160
let imageWidth = 160
let imageRadius = 8


const Cities = ({ isDiscount, item, imageStyle, onPress = () => { }, numberOfLines = 1, containerStyle = {} }) => {
  const { themeColors, appStyle, currencies, themeColor, themeToggle } =useSelector((state) => state?.initBoot || {});
  const { additional_preferences, digit_after_decimal } = useSelector((state) => state?.initBoot?.appData?.profile?.preferences || {});
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const scaleInAnimated = new Animated.Value(0);

  const appMainData = useSelector((state) => state?.home?.appMainData || {});

  const {category = {}} = item || {};


  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{

      }}
      >
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={{
          uri: getImageUrl(
            item.image.image_fit,
            item.image.image_path,
            '600/6000',
          ),
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.high,
        }}
        style={{
          height:width/4,
          width: width/4,
          borderRadius:width/2,
          // borderTopRightRadius: width/2,
          backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,
          ...imageStyle,
        }}
        imageStyle={{
          // borderRadius: width/2,
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyColor,
        }}>
       
      </FastImage>
      <View style={{ marginVertical: moderateScaleVertical(8) }}>
        <Text
          numberOfLines={numberOfLines}
          style={{
            fontSize: textScale(12),
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            textAlign: 'center',
            marginLeft: moderateScale(8),
          }}>
          {item?.title}
        </Text>
        
      
       
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

export default React.memo(Cities);




