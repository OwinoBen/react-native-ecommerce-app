import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({fontFamily, themeColors}) => {
  const styles = StyleSheet.create({
    textStyle: {
      color: colors.black2Color,
      fontSize: textScale(17),
      lineHeight: moderateScaleVertical(28),
      textAlign: 'center',
      fontFamily: fontFamily.bold,
    },
    categoryText: {
      color: colors.textGrey,
      fontSize: textScale(14),
      lineHeight: moderateScaleVertical(20),
      textAlign: 'center',
      fontFamily: fontFamily.medium,
    },
    lableStyle: {
      color: colors.textGrey,
      fontSize: textScale(14),
      lineHeight: moderateScaleVertical(28),
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      opacity: 0.5,
      alignSelf: 'flex-start',
    },
    cancel: {
      color: colors.textGrey,
      fontSize: textScale(14),
      lineHeight: moderateScaleVertical(20),
      textAlign: 'center',
      fontFamily: fontFamily.futuraHeavyBt,
    },
    apply: {
      color: colors.white,
      fontSize: textScale(14),
      lineHeight: moderateScaleVertical(20),
      textAlign: 'center',
      fontFamily: fontFamily.futuraHeavyBt,
    },
    bottomViewButtonStyle: {
      alignItems: 'center',
      position: 'absolute',
      bottom: 30,
      left: 0,
      right: 0,
    },
    buttonMainView: {
      width: width / 2 - 40,
      height: moderateScaleVertical(48),
      borderRadius: moderateScale(13),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: moderateScaleVertical(40),
    },
    priceMinrange: {
      color: colors.textGrey,
      fontSize: textScale(14),
      lineHeight: moderateScaleVertical(20),
      textAlign: 'center',
      fontFamily: fontFamily.futuraHeavyBt,
    },
    selectedStyle: {
      backgroundColor: themeColors.primary_color,
      alignItems: 'center',
      justifyContent: 'center',
      height: 3,
    },
    customMarker: {
      alignItems: 'center',
      height: 15,
      backgroundColor: themeColors.primary_color,
      width: 15,
      borderRadius: 15 / 2,
    },
  });
  return styles;
};
