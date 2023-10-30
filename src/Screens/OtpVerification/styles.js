import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = StyleSheet.create({
    header: {
      color: colors.black,
      fontSize: moderateScale(20),
      fontFamily: fontFamily.bold,
      // textAlign: 'center',
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      // textAlign: 'center',
      // fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(4),
      opacity:0.5,
      width:moderateScale(250)
    },
    skipText: {
      fontFamily: fontFamily.bold,
      color: themeColors.primary_color,
      fontSize: textScale(16),
    },

    bottomContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(30),
    },
    guestBtn: {
      marginTop: moderateScaleVertical(20),
      backgroundColor: themeColors.primary_color,
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
  });
  return styles;
};
