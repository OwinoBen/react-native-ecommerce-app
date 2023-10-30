import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';

export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = StyleSheet.create({
    header: {
      color: colors.black,
      fontSize: textScale(24),
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(15),
      marginTop: moderateScale(5),
      alignItems: 'center',
      paddingBottom: moderateScale(5),
      flex: 0.06,
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
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
      alignSelf: 'center',
      marginTop: moderateScaleVertical(40),
    },
    hyphen: {
      width: 20,
      height: 1,
      backgroundColor: colors.textGrey,
      opacity: 0.6,
    },
    hyphen2: {
      width: 60,
      height: 1,
      backgroundColor: colors.textGrey,
      opacity: 0.6,
    },
    bottomContainer: {
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(30),
      marginTop: moderateScaleVertical(15),
    },
    guestBtn: {
      marginTop: moderateScaleVertical(20),
      // backgroundColor: getColorCodeWithOpactiyNumber(
      //   themeColors?.primary_color.substr(1),
      //   20,
      // ),
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
    welcomeTxt: {
      color: colors.black,
      fontSize: textScale(16),
      paddingHorizontal: moderateScale(24),
      paddingTop: moderateScale(30),
      width: '70%',
      // fontFamily: fontFamily.bold,
      // textAlign: 'center',
    },
    languageContainer: {
      backgroundColor: colors.DarkBlue,
      height: moderateScaleVertical(30),
      width: moderateScale(30),
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedLanguageText: {
      fontFamily: fontFamily.bold,
      color: colors.white,
      textTransform: 'uppercase',
    },
  });
  return styles;
};
