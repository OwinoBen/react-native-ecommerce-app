import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import {
  getImageUrl,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';
const BrandCard2 = ({ data = {}, onPress = () => { }, showName = true }) => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const theme = useSelector((state) => state?.initBoot?.themeColor);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const scaleInAnimated = new Animated.Value(0);
  const { appStyle, themeColors } = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({ fontFamily });

  // console.log("svg data",data)

  const imageURI = data?.icon
    ? getImageUrl(data.icon.image_fit, data.icon.image_path, '400/400')
    : getImageUrl(data.image.image_fit, data.image.image_path, '400/400');

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <View style={styles.imgContainer}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={() => pressInAnimation(scaleInAnimated)}
        onPressOut={() => pressOutAnimation(scaleInAnimated)}
        style={{
          height: moderateScale(80),
          // paddingVertical: moderateScaleVertical(30),
          borderRadius: moderateScale(10),
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'red'
        }}>
        {isSVG ? (
          <SvgUri
            height={moderateScale(80)}
            width={moderateScale(96)}
            uri={imageURI}
            style={
              {
                // ...styles.imgStyle,
                // backgroundColor: isDarkMode
                //   ? colors.whiteOpacity15
                //   : colors.greyColor,
              }
            }
          />
        ) : (
          <FastImage
            source={{
              uri: imageURI,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={{
              marginRight: moderateScale(14),
              ...styles.imgStyle,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyColor,
            }}
          />
        )}
      </TouchableOpacity>
      {showName ? <View style={{ paddingHorizontal: moderateScale(4), justifyContent: 'center', }} >
        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
            fontFamily: fontFamily.regular,
            fontSize: textScale(10),
            textAlign: 'center',
            marginTop: moderateScaleVertical(2),
            marginRight: moderateScale(2)
          }}>
          {data?.name || (data?.translation && data?.translation[0]?.title) || ''}
        </Text>
      </View>: null}
    </View>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    // flex: 1,
    marginHorizontal: moderateScale(8),
    width: width / 3 - moderateScale(16),
  },
  imgStyle: {
    height: moderateScale(80),
    width: '100%',
    borderRadius: moderateScale(10),
  },
});
export default React.memo(BrandCard2);
