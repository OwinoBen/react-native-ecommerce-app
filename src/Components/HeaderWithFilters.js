import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {hitSlopProp} from '../styles/commonStyles';
import {
  moderateScale,
  StatusBarHeight,
  textScale,
} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';

const HeaderWithFilters = ({
  leftIcon = imagePath.back,
  centerTitle,
  noLeftIcon = false,
  textStyle,
  horizontLine = true,
  rightIcon = '',
  onPressLeft,
  onPressRight,
  headerStyle,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const navigation = useNavigation();
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  return (
    <>
      <View
        style={{
          ...styles.headerStyle,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...headerStyle,
        }}>
        <View style={{width: moderateScale(70)}}>
          {!noLeftIcon && (
            <TouchableOpacity
              hitSlop={hitSlopProp}
              activeOpacity={0.7}
              onPress={
                !!onPressLeft
                  ? onPressLeft
                  : () => {
                      navigation.goBack();
                    }
              }>
              <Image
                resizeMode="contain"
                source={leftIcon}
                style={
                  isDarkMode
                    ? {
                        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                        tintColor: MyDarkTheme.colors.text,
                      }
                    : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
                }
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={{flex: 0.8, justifyContent: 'center'}}>
          <Text
            style={
              isDarkMode
                ? {
                    ...styles.textStyle,
                    ...textStyle,
                    marginLeft: moderateScale(12),
                    // width: moderateScale(150),
                    color: MyDarkTheme.colors.text,
                  }
                : {
                    ...styles.textStyle,
                    ...textStyle,
                    marginLeft: moderateScale(12),
                    // width: moderateScale(150),
                  }
            }>
            {centerTitle}
          </Text>
        </View>

        <View style={{flexDirection: 'row', flex: 0.2}}>
          {/* <TouchableOpacity>
            <Image source={imagePath.search} />
          </TouchableOpacity>
          <TouchableOpacity style={{marginHorizontal: moderateScale(12)}}>
            <Image source={imagePath.filter} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={imagePath.locationSmall} />
          </TouchableOpacity> */}
        </View>
      </View>
    </>
  );
};
export default React.memo(HeaderWithFilters);

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    headerStyle: {
      // padding: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(16),
      height: StatusBarHeight,
    },

    textStyle: {
      color: colors.black2Color,
      fontSize: textScale(17),
      lineHeight: textScale(28),
      textAlign: 'center',
      fontFamily: fontFamily.medium,
    },
  });
  return styles;
}
