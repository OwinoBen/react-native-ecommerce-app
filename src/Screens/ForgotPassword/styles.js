import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    header: {
      color: colors.black,
      fontSize: moderateScale(24),
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      lineHeight: 24,
      fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(15),
      textAlign: 'center',
    },

    bottomContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(30),
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
    mainView: {
      height: moderateScaleVertical(60),
      paddingHorizontal: moderateScale(24),
      justifyContent: 'center',
    },
    forgetDesc: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginHorizontal: moderateScale(16),
    },
  });
  return styles;
};
