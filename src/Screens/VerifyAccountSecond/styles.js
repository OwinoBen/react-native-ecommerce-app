import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
// import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({userData, fontFamily, themeColors}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    inputContainer:{
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: colors.borderLight,
      height: moderateScale(49),
      borderRadius: 49 / 2,
    },
    textInputContainer:{
      flex: 0.75,
      flexDirection: 'row',
      paddingHorizontal: 15,
      height: moderateScale(47),
      borderTopLeftRadius: 47 / 2,
      borderBottomLeftRadius: 47 / 2,
      alignItems: 'center',
    },
    textInputField:{
      flex: 1,
      opacity: 0.7,
      color: colors.textGreyOpcaity7,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      paddingHorizontal: 10,
      paddingTop: 0,
      paddingBottom: 0,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    editAndSendView:{
   
      justifyContent: 'center',
      alignItems: 'center',
      borderLeftWidth: 1,
      borderColor: colors.borderLight,
    },
    didintRecieveCode:{
      textAlign: 'center',
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      color: colors.textGrey,
      opacity: 0.7,
    },
    resend:{
      textAlign: 'center',
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
      color: themeColors.primary_color,
      // opacity: 0.7,
    },
    verifyView:{
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: moderateScaleVertical(15),
      flexDirection: 'row',
    },
    header: {
      color: colors.black,
      fontSize: moderateScale(24),
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    txtSmall: {
      ...commonStyles.mediumFont14,
      // lineHeight: 24,
      textAlign: 'center',
      fontFamily: fontFamily.medium,
      // marginVertical: moderateScaleVertical(15),
    },

    bottomContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(30),
    },
    titwo: {
      marginHorizontal: moderateScale(100),
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
    verifyTextInput: {width: moderateScale(200), fontSize: 18},
    verifyNowBtn: {
      backgroundColor: colors.themeColor,
      paddingVertical: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(10),
      borderRadius: 10,
      height: 40,
    },
    verifyNowBtnText: {
      color: colors.white,
      fontFamily: fontFamily.bold,
    },
    emailAndPhone: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(18),
    },
    headerContainer: {
      flexDirection: 'row',
      marginVertical: moderateScaleVertical(20),
      paddingHorizontal: moderateScale(24),
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    skipText: {
      fontFamily: fontFamily.bold,
      color: themeColors.primary_color,
      fontSize: textScale(16),
    },
    card: {
      marginHorizontal: moderateScale(10),
      padding: moderateScale(10),
      marginVertical: moderateScaleVertical(2),
    },
    headingbtnContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // marginVertical: moderateScaleVertical(5),
    },
    btnEmail: {
      alignSelf: 'flex-end',
      backgroundColor: !userData?.verify_details?.is_email_verified
        ? themeColors.primary_color
        : themeColors.secondary_color,
      // backgroundColor:'red',
      paddingVertical: moderateScaleVertical(5),
      paddingHorizontal: moderateScale(8),
      borderRadius: 10,
    },
    btnPhone: {
      alignSelf: 'flex-end',
      backgroundColor: !userData?.verify_details?.is_phone_verified
        ? themeColors.primary_color
        : themeColors.secondary_color,
      paddingVertical: moderateScaleVertical(5),
      paddingHorizontal: moderateScale(8),
      borderRadius: 10,
    },
    btnPhoneSecond: {
      // alignSelf: 'center',
      width: width / 4,
     
      paddingVertical: moderateScaleVertical(6),
      paddingHorizontal: moderateScale(8),
      borderRadius: 10,
    },
    emailbtnText: {
      color: !userData?.verify_details?.is_email_verified
        ? themeColors.secondary_color
        : colors.green,
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
    },
    phonebtnText: {
     
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      textAlign:'center'
    },
  });
  return styles;
};
