import React from 'react';
import {Image, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {textScale} from '../styles/responsiveSize';

const IconTextRow = ({text, icon, containerStyle = {}, textStyle = {}}) => {
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', ...containerStyle}}>
      <Image source={icon} />
      <Text
        style={{
          ...commonStyles.mediumFont14,
          fontSize: textScale(12),
          color: colors.white,
          marginLeft: 2,
          opacity: 1,
          ...textStyle,
        }}>
        {text}
      </Text>
    </View>
  );
};
export default React.memo(IconTextRow);
