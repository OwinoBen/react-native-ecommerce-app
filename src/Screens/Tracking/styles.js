import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

import commonStylesFun from '../../styles/commonStyles';
export default ({fontFamily}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      borderBottomColor: colors.lightGreyBorder,
      borderBottomWidth: 0.7,
    },
    userProfileView: {
      alignSelf: 'center',
      borderColor: colors.white,
      marginTop: moderateScale(30),
    },
    cameraView: {
      position: 'absolute',
      right: -20,
    },
    userName: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
    },
    userEmail: {
      marginTop: moderateScaleVertical(5),
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      opacity: 0.5,
    },
    borderRoundBotton: {
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      height: moderateScaleVertical(30),
    },
    topSection: {},
    bottomSection: {
      marginVertical: moderateScaleVertical(40),
      marginHorizontal: moderateScaleVertical(20),
    },

    address: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      opacity: 0.7,
    },
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      // opacity: 0.6,
    },
    labelStyle: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
  });
  return styles;
};
