import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';

const TransparentButtonWithTxtAndIcon = ({
  containerStyle,
  icon,
  onPress,
  btnText,
  btnStyle,
  borderRadius,
  marginTop = 0,
  marginBottom = 0,
  textStyle = {},
}) => {
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});
  return (
    <TouchableOpacity
      style={{
        ...commonStyles.buttonRectTransparent,
        borderWidth: 0,
        marginTop,
        marginBottom,

        ...containerStyle,
      }}
      onPress={onPress}>
      <View
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          borderRadius,
          borderWidth: 1,
          flexDirection: 'row',
          borderColor: colors.lightGreyBorder,
          ...btnStyle,
        }}>
        {icon && <Image source={icon} />}
        <Text style={{...commonStyles.buttonTextBlack, ...textStyle}}>
          {btnText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TransparentButtonWithTxtAndIcon);
