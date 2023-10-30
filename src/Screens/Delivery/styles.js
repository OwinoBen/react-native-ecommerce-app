import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {moderateScaleVertical, textScale} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      // opacity: 0.6,
    },
    topTextStyle: {
      fontSize: textScale(15),
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(20),
    },
    bottomTextStyle: {
      fontSize: textScale(12),
      color: colors.textGrey,
      fontFamily: fontFamily.regular,
      lineHeight:moderateScaleVertical(20),
      // marginVertical: moderateScaleVertical(3),
    },
  });
  return styles;
};
