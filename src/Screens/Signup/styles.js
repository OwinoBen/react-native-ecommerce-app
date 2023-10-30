import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import commonStylesFun from '../../styles/commonStyles';

export default ({ fontFamily }) => {
  const commonStyles = commonStylesFun({ fontFamily });
  const styles = StyleSheet.create({
    header: {
      color: colors.black,
      fontSize: moderateScale(20),
      fontFamily: fontFamily.bold,
      // textAlign: 'center',
    },
    header2: {
      color: colors.black,
      fontSize: moderateScale(24),
      fontFamily: fontFamily.bold,
    },
    txtSmall: {
      fontSize: textScale(13),
      color: colors.black,
      // opacity: 0.5,
      // lineHeight: 24,
      // textAlign: 'center',
      // fontFamily: fontFamily.medium,
      marginTop: moderateScaleVertical(4),
    },

    bottomContainer: { 
      marginTop:height/5,
      justifyContent: 'flex-end',
      alignItems:'center'
      // marginBottom: moderateScaleVertical(30),
    },
    bottomContainer2: {
      position: 'absolute',
      bottom: moderateScale(80),
      alignItems: 'center',
      width: '100%',
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
    viewStyleForUploadImage: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      // justifyContent: 'space-between',
    },
    imageUpload: {
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: moderateScaleVertical(10),
    },
    imageStyle2: {
      height: 100,
      width: 100,
      borderRadius: moderateScale(4),
    },
    label3: {
      marginBottom: moderateScaleVertical(10),
      textAlign: 'center',
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      color: colors.greyLight,
    },
    uploadStyle: {
      color: colors.blue,
      fontFamily: fontFamily.medium,
    },
    boxStyle: {
      backgroundColor: colors.blackOpacity05,
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: moderateScale(4),
      backgroundColor: colors.white
    },
    placeholderTxt: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(16),
      paddingHorizontal: moderateScale(18),
    },
    workModeContainer: {
      borderWidth: 2,
      borderRadius: moderateScale(8),

      padding: moderateScale(16),
      marginTop: moderateScaleVertical(24)
    },
    radioBtn: {
      height: moderateScale(25),
      width: moderateScale(25),

    }
  });
  return styles;
};
