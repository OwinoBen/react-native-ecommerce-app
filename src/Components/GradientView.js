import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import commonStylesFun from '../styles/commonStyles';
import { isEmpty } from 'lodash';
import { moderateScale } from '../styles/responsiveSize';

export default function GradientView({
  colorsArray = [],
  title = '',
  textStyle = {},
  btnStyle = {},
}) {
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const commonStyles = commonStylesFun({ fontFamily, themeColors });


  const themePrimaryColor = !!themeColors?.primary_color ? themeColors?.primary_color : '	#00FFFF'



  return (
    <LinearGradient
      start={{ x: 0.0, y: -1.5 }}
      end={{ x: 0.5, y: 1.0 }}
      style={{
        borderRadius: moderateScale(8),
        padding: moderateScale(6),
        alignSelf: 'flex-start',
        minWidth: moderateScale(100),
        ...btnStyle,
      }}
      colors={
        !isEmpty(colorsArray)
          ? colorsArray
          : [themePrimaryColor, themePrimaryColor]
      }>
      <Text
        numberOfLines={1}
        style={{ ...commonStyles.buttonTextWhite, ...textStyle }}>
        {title}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({});
