import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import { moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';



export default ({
  fontFamily,
  themeColors,

}) => {


  const styles = StyleSheet.create({
    textInputContainer: {
      marginVertical: moderateScaleVertical(10),
      borderColor: colors.textGreyB,
      borderWidth: 0.5,
      borderBottomWidth: 0.5
    }, textInputStyle: {
      height: moderateScaleVertical(30),
      paddingTop: moderateScaleVertical(10)
    }, phoneNumberTextInputLabel: {
      color: colors.black
    }, phoneNumberInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    }, countryPickerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: moderateScale(88),
    }, countryPickerInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    }, callingCodeText: {
      fontFamily: fontFamily.medium,
      color: colors.textGreyOpcaity7,
    }, phoneNumberInnput: {
      borderColor: colors.textGreyB,
      borderWidth: 0.5,
      width: moderateScale(width - 50),
      borderBottomWidth: 0.5
    }, textInputStyle: {
      height: moderateScaleVertical(30),
      paddingTop: moderateScaleVertical(10)
    }, messageMainContainer: {
      paddingVertical: moderateScaleVertical(14),
      alignItems: 'center',
      marginVertical: moderateScaleVertical(25),
      borderRadius: 4,
      paddingHorizontal: moderateScale(12)
    }, messageText: {
      letterSpacing: 0.5,
      fontFamily: fontFamily.medium,
      color: colors.black,
      fontSize: textScale(14)
    }
  });
  return styles;
};
