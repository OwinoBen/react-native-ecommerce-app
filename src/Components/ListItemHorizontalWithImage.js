import React from 'react';
import { I18nManager, Image, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../styles/theme';
import { countryJSON } from '../constants/constants';
import FastImage from 'react-native-fast-image';

const ListItemHorizontal = ({
  leftIconStyle,
  iconLeft,
  iconRight,
  centerHeading,
  centerText,
  onPress = () => { },
  onRightIconPress = () => { },
  containerStyle = {},
  centerContainerStyle = {},
  centerHeadingStyle = {},
  rightIconStyle = {},
  rightText = '',
  showCountry = false
}) => {
  const { appStyle, primary_country } = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        marginHorizontal: moderateScale(23),
        flexDirection: 'row',
        paddingVertical: moderateScaleVertical(28),
        borderBottomColor: colors.borderLight,
        borderBottomWidth: 1,
        alignItems: 'center',
        ...containerStyle,
        // justifyContent:'space-between'
      }}>
      {iconLeft ? (
        <TouchableOpacity style={{ ...leftIconStyle }}>

          <Image
            source={iconLeft}
            style={{
              transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
              tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              height: moderateScale(20),
              width: moderateScale(20),
            }}
            resizeMode='contain'
          />
        </TouchableOpacity>
      ) : (
        <View />
      )}
      <View
        style={{
          marginHorizontal: moderateScale(20),
          flex: 1,
          ...centerContainerStyle,
        }}>
        <Text
          style={{
            fontSize: textScale(18),
            fontFamily: fontFamily?.regular,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            ...centerHeadingStyle,
          }}>
          {centerHeading}
        </Text>
        {!!centerText && (
          <Text
            style={{
              ...commonStyles.mediumFont14,
              color: colors.grey,
              lineHeight: textScale(20),
              opacity: 0.7,
              fontSize: textScale(13),
              marginTop: moderateScaleVertical(5),
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}>
            {centerText}
          </Text>
        )}
      </View>
      {showCountry ?
        <>
          {!!primary_country?.primary_country && !!primary_country?.primary_country?.flag ? <FastImage
            source={{ uri: primary_country?.primary_country.flag }}
            style={{
              width: moderateScale(36),
              height: moderateScale(24),
              marginRight: moderateScale(8)
            }}
            resizeMode={FastImage.resizeMode.contain}
          /> : null}
        </>
        : null
      }
      {!!rightText && (
        <Text
          style={{
            ...commonStyles.mediumFont14,
            color: colors.grey,
            lineHeight: textScale(20),
            opacity: 0.7,
            fontSize: textScale(13),
            marginTop: moderateScaleVertical(5),
            textAlign: I18nManager.isRTL ? 'right' : 'left',
          }}>
          {rightText}
        </Text>
      )}
      {iconRight && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Image
            style={[
              rightIconStyle,
              { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] },
            ]}
            source={iconRight}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(ListItemHorizontal);
