import {StyleSheet} from 'react-native';
import {getColorCodeWithOpactiyNumber} from '../utils/helperFunctions';
import colors from './colors';
import {moderateScaleVertical, textScale} from './responsiveSize';

export const hitSlopProp = {
  top: 15,
  right: 15,
  left: 15,
  bottom: 15,
};

export default ({fontFamily, buttonTextColor}) => {
  const styles = StyleSheet.create({
    loader: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mediumFont12: {
      fontSize: textScale(12),
      color: colors.textGrey,
      fontFamily: fontFamily?.medium,
      opacity: 0.7,
      textAlign: 'left',
    },
    mediumFont14: {
      // fontSize:RFValue(14,height),
      fontSize: textScale(14),
      color: colors.textGrey,
      // fontFamily: fontFamily?.medium,
      // opacity: 0.,
      textAlign: 'left',
    },
    mediumFont14Normal: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily?.medium,
      opacity: 1,
      textAlign: 'left',
    },
    mediumFont16: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily?.medium,
      textAlign: 'left',
    },
    futuraBtHeavyFont16: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    futuraBtHeavyFont18: {
      fontSize: textScale(18),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    futuraBtHeavyFont20: {
      fontSize: textScale(20),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    futuraBtHeavyFont14: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    futuraHeavyBt: {
      fontSize: textScale(16),
      color: colors.black,
      fontFamily: fontFamily?.bold,
      textAlign: 'left',
    },
    buttonRect: {
      height: moderateScaleVertical(46),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.themeMain,
      borderWidth: 1,
      borderColor: colors.themeMain,
      borderRadius: 12,
    },
    buttonRectTransparent: {
      height: moderateScaleVertical(46),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.themeMain,
      borderWidth: 1,
      borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      borderRadius: 13,
    },

    buttonRectCommonButton: {
      height: moderateScaleVertical(46),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(67,162,231,0.3)',
      borderWidth: 0,
      borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      borderRadius: 13,
    },

    shadowStyle: {
      backgroundColor: colors.white,
      borderRadius: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      // borderColor: colors.lightWhiteGrayColor,
      // borderWidth: 0.7,
    },
    buttonTextWhite: {
      fontFamily: fontFamily?.bold ? fontFamily?.bold : 'SFProText-Bold',
      textTransform: 'uppercase',
      color: !!buttonTextColor?.secondary_color
        ? buttonTextColor?.secondary_color
        : colors.white,
      textAlign: 'center',
    },

    buttonTextBlue: {
      fontFamily: fontFamily?.bold,
      textTransform: 'uppercase',
      color: colors.textBlue,
      textAlign: 'center',
    },
    buttonTextBlack: {
      fontFamily: fontFamily?.medium,
      textTransform: 'uppercase',
      color: colors.textGrey,
      textAlign: 'center',
    },
    imgOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerTopLine: {
      height: 1,
      backgroundColor: colors.lightGreyBgColor,
      opacity: 0.26,
    },
    mediumTxtGreyD14: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      color: colors.textGreyD,
    },
    regularFont11: {
      fontSize: textScale(11),
      color: colors.textGrey,
      fontFamily: fontFamily?.regular,
      opacity: 0.7,
      textAlign: 'left',
    },
  });
  return styles;
};
