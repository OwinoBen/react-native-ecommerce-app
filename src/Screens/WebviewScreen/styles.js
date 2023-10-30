import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFunc({fontFamily, themeColors});
  const styles = StyleSheet.create({
    addMoneyTopCon: {
      paddingHorizontal: moderateScaleVertical(15),
      paddingVertical: moderateScaleVertical(20),
      backgroundColor: colors.white,
    },
    addMoneyInputField: {
      borderBottomWidth: 0.5,
      paddingLeft: moderateScaleVertical(14),
      paddingVertical: moderateScaleVertical(8),
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    inputAmountText: {
      fontFamily: fontFamily.bold,
      color: colors.walletTextD,
    },
    currencySymble: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(17),
    },
    selectAmountCon: {
      borderWidth: 0.5,
      width: 105,
      padding: moderateScale(10),
      marginHorizontal: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(8),
      borderRadius: 3,
      justifyContent: 'center',
      flexDirection: 'row',
      borderColor: colors.walletTimeG,
    },
    chooseAddMoney: {
      // fontFamily:fontFamily.regular
    },
    title: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(16),
      color: colors.textGreyJ,
      paddingLeft: moderateScale(10),
    },
    debitFrom: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(16),
      color: colors.blackC,
    },
    bottomButtonStyle: {
      position: 'absolute',
      bottom: 10,
      left: 20,
      right: 20,
    },

    input: {
      fontSize: 16,
      color: 'black',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      height: height,
    },
    topView: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 25,
      flexDirection: 'row',
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScaleVertical(20),
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backButtonView: {
      height: moderateScale(40),
      width: moderateScale(40),
      borderRadius: moderateScale(16),
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    absolute: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      height: height / 2,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: moderateScaleVertical(30),
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.9,
      elevation: 2,
    },
    dots: {
      width: 2,
      height: 5,
      backgroundColor: colors.black,
      borderRadius: 50,
      marginVertical: 2,
      // marginLeft: 4,
    },
  });
  return styles;
};
