import React from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import {Image} from 'react-native-elements';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';

import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {getImageUrl} from '../utils/helperFunctions';
import {useDarkMode} from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
const ThreeColumnCard2 = ({
  data = {},
  cardIndex,
  withTextBG = false,
  onPress = () => {},
}) => {
  //MarginHorizontal is 16 which is total 32
  //marginHorizontal for center item is 8 which is toal 16
  //total spcaing required is width-32+16 or 48
  // width - 48 will be the width of each card and
  const {themeColors, appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const cardWidth = width / 3 - moderateScale(16);
  const scaleInAnimated = new Animated.Value(0);
  const commonStyles = commonStylesFunc({fontFamily});
  let celebDimension = width / 3;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  // alert("312")
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      // onPressIn={() => pressInAnimation(scaleInAnimated)}
      // onPressOut={() => pressOutAnimation(scaleInAnimated)}

      style={{
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.lightDark
          : colors.white,
        borderRadius: moderateScale(10),
        elevation: 5,
        borderWidth: 0.5,
        borderColor: colors.borderColorD,
        marginHorizontal: moderateScale(7.5),
      }}>
      <View
        style={{
          width: (width - moderateScale(65)) / 3,
          height: moderateScaleVertical(100),
          borderTopLeftRadius: moderateScale(10),
          borderTopRightRadius: moderateScale(10),
          overflow: 'hidden',
        }}>
        <FastImage
          source={{
            uri: getImageUrl(
              data?.avatar?.proxy_url || data?.image?.proxy_url,
              data?.avatar?.image_path || data?.image?.image_path,
              `130/140`,
            ),
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>

      <Text
        numberOfLines={1}
        style={{
          width: moderateScale(100),
          fontFamily: fontFamily.medium,
          fontSize: textScale(15),
          color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
          marginVertical: 10,
          textAlign: 'center',
        }}>
        {data?.name}
      </Text>
    </TouchableOpacity>
  );
};
export default React.memo(ThreeColumnCard2);
