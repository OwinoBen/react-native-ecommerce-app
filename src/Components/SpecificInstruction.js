import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {moderateScaleVertical, textScale} from '../styles/responsiveSize';
import colors from '../styles/colors';
import {useSelector} from 'react-redux';

const SpecificInstruction = ({
  leftText,
  rightText,
  isDarkMode,
  MyDarkTheme,
  leftTextStyle,
  rightTextStyle,
  marginBottom = 12,
}) => {
  const {appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  return (
    <View
      style={{
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        marginBottom: moderateScaleVertical(marginBottom),
        marginTop:moderateScaleVertical(10)
      }}>
      <Text
        style={{
          ...styles.textStyle,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity43,
          ...leftTextStyle,
          flex: 1,
          marginBottom:moderateScaleVertical(10)
        }}>
        {leftText}
      </Text>
      <Text
        style={{
          ...styles.textStyle,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.blackOpacity43,
          ...rightTextStyle,
        }}>
        {rightText}
      </Text>
    </View>
  );
};

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    textStyle: {
      fontFamily: fontFamily.medium,
      textAlign: 'left',
      fontSize: textScale(12),
    },
  });
  return styles;
}

export default React.memo(SpecificInstruction);
