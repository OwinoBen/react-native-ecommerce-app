import React from 'react';
import {I18nManager, Image, Text, View, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';

const ListItemHorizontalWithRightText = ({
  leftIconStyle,
  iconLeft,
  iconRight,
  centerHeading,
  centerText,
  onPress = () => {},
  onRightIconPress = () => {},
  containerStyle = {},
  centerContainerStyle = {},
  centerHeadingStyle = {},
  rightIconStyle = {},
  rightText,
}) => {
  const {appStyle} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        // width: '100%',
        paddingRight: moderateScale(23),
        flexDirection: 'row',
        // paddingVertical: moderateScaleVertical(28),
        // borderBottomColor: colors.borderLight,
        // borderBottomWidth: 1,
        alignItems: 'center',
        // ...containerStyle,
        // justifyContent:'space-between'
        // backgroundColor: 'red'
      }}>
      {iconLeft ? (
        <TouchableOpacity style={{...leftIconStyle}}>
          <Image
            source={iconLeft}
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
      ) : (
        <View />
      )}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{
          //
          flexDirection: 'row',
          paddingVertical: moderateScaleVertical(28),
          borderBottomColor: colors.borderLight,
          borderBottomWidth: 1,
          alignItems: 'center',
          ...containerStyle,
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            // marginHorizontal: moderateScale(20),
            // flex: 1,
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
        {iconRight && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {rightText && (
              <Text
                style={{
                  fontSize: textScale(9),
                  marginRight: moderateScale(10),
                  color: colors.textGreyOpcaity7,
                }}>
                {rightText}
              </Text>
            )}
            <Image
              style={[
                rightIconStyle,
                {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]},
              ]}
              source={iconRight}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(ListItemHorizontalWithRightText);
