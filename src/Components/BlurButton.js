import React from 'react';
import {Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';

const BlurButton = ({con}) => {
  const {appStyle, themeColors} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  return (
    <View
      style={{
        position: 'absolute',
        left: moderateScale(24),
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        right: moderateScale(24),
        backgroundColor: colors.whiteOpacity4,
        borderRadius: 40,
        height: moderateScaleVertical(30),
      }}>
      <Text
        style={{
          color: colors.white,
          fontFamily: fontFamily.bold,
        }}>
        {strings.DELIVERY}
      </Text>
    </View>
  );
};
export default React.memo(BlurButton);
