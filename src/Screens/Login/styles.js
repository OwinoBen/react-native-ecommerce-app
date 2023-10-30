import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({themeColors, fontFamily}) => {
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = StyleSheet.create({
    header: {
      color: colors.black,
      fontSize: textScale(20),
      fontFamily: fontFamily.bold,

      // textAlign: 'center',
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      // fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(15),
    },
    socialRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    socialRowBtn: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: moderateScaleVertical(40),
      alignSelf: 'center',
    },
    hyphen: {
      width: 20,
      height: 1,
      backgroundColor: colors.textGrey,
      opacity: 0.6,
    },
    bottomContainer: {
      marginTop: moderateScaleVertical(27),
      marginBottom: moderateScaleVertical(43),
    },
    bottomContainer2: {
      position: 'absolute',
      bottom: moderateScale(20),
      alignItems: 'center',
      width: '100%',
      alignSelf: 'center',
    },
    guestBtn: {
      marginTop: moderateScaleVertical(20),
      backgroundColor: colors.lightSky,
      borderWidth: 0,
    },
    orText: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      opacity: 0.6,
      marginTop: 0,
      marginHorizontal: moderateScale(16),
    },
    orText2: {
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.bold,
      marginTop: 0,
      marginHorizontal: moderateScale(16),
      color: colors.black,
      fontSize: textScale(14),
    },
    forgotContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(8),
    },
    headerContainer: {
      // height: moderateScaleVertical(60),
      paddingHorizontal: moderateScale(16),
      justifyContent: 'center',
    },
    picker: {
      flex: 0.25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      // paddingBottom: (height * 1) / 100,
    },
    modalText: {
      fontFamily: fontFamily.reguler,
      fontSize: textScale(16),
      color: colors.black,
    },
    textInputText: {
      flex: 0.7,

      fontFamily: fontFamily.reguler,
      fontSize: textScale(16),
      color: colors.grayOpacity51,
      borderBottomColor: colors.gray,
    },
    mainCont: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: moderateScale(18),
      borderWidth: 0.2,
      borderColor: colors.gray,
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(8),
    },
    lefticon: {
      height: moderateScaleVertical(37),
      width: moderateScale(37),
      backgroundColor: colors.grey1,
      borderRadius: moderateScale(12),
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: moderateScaleVertical(27),
    },
  });
  return styles;
};
