import React from 'react';
import {Text, TouchableOpacity, View, Animated} from 'react-native';
import {useSelector} from 'react-redux';
import {rectImage} from '../constants/constants';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {
  getImageUrl,
  getScaleTransformationStyle,
  pressInAnimation,
  pressOutAnimation,
} from '../utils/helperFunctions';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import FastImage from 'react-native-fast-image';
import BlurImages from './BlurImages';

const ThreeColumnCard = ({
  data = {},
  cardIndex,
  withTextBG = false,
  onPress = () => {},
}) => {
  //MarginHorizontal is 16 which is total 32
  //marginHorizontal for center item is 8 which is toal 16
  //total spcaing required is width-32+16 or 48
  // width - 48 will be the width of each card and
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {themeColors, appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const cardWidth = width / 3 - moderateScale(16);
  const scaleInAnimated = new Animated.Value(0);
  const commonStyles = commonStylesFunc({fontFamily});
  let celebDimension = width / 3;
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => pressInAnimation(scaleInAnimated)}
      onPressOut={() => pressOutAnimation(scaleInAnimated)}
      style={[
        {width: cardWidth},
        cardIndex % 3 == 1 && {marginHorizontal: moderateScale(8)},
        {...getScaleTransformationStyle(scaleInAnimated)},
      ]}>
      <View>
        <BlurImages
          isDarkMode={isDarkMode}
          themeColor={themeColors.primary_color}
          style={{
            backgroundColor: isDarkMode
              ? colors.whiteOpacity15
              : colors.greyColor,
            height: moderateScale(100),
            width: '100%',
            borderRadius: moderateScale(10),
          }}
          containerStyle={{borderRadius: moderateScale(15)}}
          thumnailUrl={{
            uri: getImageUrl(
              data?.avatar?.proxy_url || data?.image?.proxy_url,
              data?.avatar?.image_path || data?.image?.image_path,
              `30/40`,
            ),
          }}
          originalUrl={{
            uri: getImageUrl(
              data?.avatar?.proxy_url || data?.image?.proxy_url,
              data?.avatar?.image_path || data?.image?.image_path,
              `130/140`,
            ),
          }}
          containerStyle={{borderRadius: moderateScale(10), width: '100%'}}
        />

        <View
          style={[
            withTextBG && {
              paddingVertical: 3,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Text
            numberOfLines={1}
            style={[
              {
                ...commonStyles.mediumFont14,
                opacity: 1,
                textAlign: 'center',
                marginTop: moderateScale(8),
                lineHeight: moderateScaleVertical(20),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
              },
              withTextBG && {fontSize: textScale(12)},
            ]}>
            {data?.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(ThreeColumnCard);
