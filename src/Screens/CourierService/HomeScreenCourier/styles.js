import {StyleSheet} from 'react-native';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    mainComponent: {
      flex: 1,
      backgroundColor: colors.backgroundGrey,
    },
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
      fontSize: textScale(15),
      color: colors.textGrey,
      fontFamily: fontFamily.regular,
      marginVertical: moderateScaleVertical(3),
    },
    pickUpAndDrop: {
      fontSize: textScale(32),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
      marginTop: moderateScaleVertical(15),
      marginHorizontal: moderateScale(20),
    },
    pickUpAndDropContent: {
      fontSize: textScale(16),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
      marginVertical: moderateScaleVertical(15),
      marginHorizontal: moderateScale(20),
    },
    boxStyle: {
      borderRadius: moderateScale(16),
      borderWidth: moderateScale(1),
      borderColor: colors.borderColorD,
      width: width - width / 3,
      padding: moderateScale(10),
      marginRight: moderateScale(10),
    },
    title: {
      fontSize: textScale(18),
      color: colors.blackC,
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(5),
    },
    subTitle: {
      fontSize: textScale(14),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      marginTop: moderateScaleVertical(5),
    },
    bottomAcceptanceText: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      textAlign: 'center',
      // marginTop: moderateScaleVertical(5),
    },
  });
  return styles;
};
