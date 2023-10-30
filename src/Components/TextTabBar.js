import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {moderateScale, width} from '../styles/responsiveSize';
const TextTabBar = ({
  text,
  icon,
  onPress,
  containerStyle = {},
  textStyle = {},
  isActive = false,
  activeStyle = {},
  textTabWidth = null,
  textTabBarView = {},
}) => {
  const currentTheme = useSelector((state) => state.initBoot);
  const {themeColors, themeLayouts, appStyle} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          {
            paddingVertical: 15,
            ...containerStyle,
          },
        ]}>
        <Text
          numberOfLines={1}
          style={[
            {
              ...commonStyles.mediumFont14,
              color: colors.textGreyB,

              opacity: 1,
              marginTop: 4,
              textAlign: 'center',
              ...textStyle,
            },
            isActive && {color: themeColors.primary_color, ...activeStyle},
          ]}>
          {text}
        </Text>
      </View>
      {isActive && (
        <View style={{justifyContent: 'flex-end', alignItems: 'center'}}>
          <View
            style={{
              width: textTabWidth ? textTabWidth : moderateScale(width / 2),
              borderBottomWidth: 2,
              borderBottomColor: themeColors.primary_color,
              ...textTabBarView,
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};
export default React.memo(TextTabBar);
