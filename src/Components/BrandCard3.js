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

const BrandCard2 = ({
  data = {},
  onPress = () => { },
  applyRadius = false,
  imageHeight = 110,
  imageWidth = 110
}) => {
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


  let imgHeight = parseInt(moderateScale(imageHeight));
  let imgWidth = parseInt(moderateScale(imageWidth));

  const imageURI = data?.icon
    ? getImageUrl(data.icon.image_fit, data.icon.image_path, `${imgHeight + 140}/${imgWidth + 140}`)
    : getImageUrl(data.image.image_fit, data.image.image_path, `${imgHeight + 140}/${imgWidth + 140}`);

  const isSVG = imageURI ? imageURI.includes('.svg') : null;


  return (
    <View style={{
      width: (width / 3 - 10),
    }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={() => pressInAnimation(scaleInAnimated)}
        onPressOut={() => pressOutAnimation(scaleInAnimated)}
        style={{ alignItems: 'center' }}>
        {isSVG ? (
          <SvgUri
            height={imgHeight}
            width={imgWidth}
            uri={imageURI}
          />
        ) : (
          <FastImage
            source={{
              uri: imageURI,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.contain}
            style={{
              height: imgHeight,
              width: '100%',
              borderRadius: moderateScale(10),
            }}
          >

          </FastImage>
        )}
        <View style={{ paddingHorizontal: moderateScale(4), justifyContent: 'center', }} >
          <Text
            style={{
              color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity70,
              fontFamily: fontFamily.regular,
              fontSize: textScale(14),
              textAlign: 'center',
              marginTop: moderateScaleVertical(8),
              marginRight: moderateScale(2)
            }}>
            {data?.name || (data?.translation && data?.translation[0]?.title) || ''}
          </Text>
        </View>
      </TouchableOpacity>
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
