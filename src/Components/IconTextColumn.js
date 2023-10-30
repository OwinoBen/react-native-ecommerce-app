import React from 'react';
import {Text, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';

const IconTextColumn = ({
  text,
  icon,
  containerStyle = {},
  textStyle = {},
  isActive = false,
  activeStyle = {},
  onPress = () => {},
  imageStyle = {},
}) => {
  const currentTheme = useSelector((state) => state?.initBoot);
  const {themeColors, themeLayouts, appStyle} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;

  const commonStyles = commonStylesFunc({fontFamily});
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: 10,
          padding: 10,
          paddingVertical: 10,
          borderRadius: 10,
          ...containerStyle,
        },
        isActive && {backgroundColor: themeColors.themeOpacity20},
      ]}>
      <Image style={{width: 30, height: 30, ...imageStyle}} source={icon} />
      <Text
        style={[
          {
            ...commonStyles.mediumFont14,
            color: colors.textGreyB,
            marginLeft: 2,
            opacity: 1,
            marginTop: 4,
            ...textStyle,
          },
          isActive && {color: colors.themeColor, ...activeStyle},
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
export default React.memo(IconTextColumn);
