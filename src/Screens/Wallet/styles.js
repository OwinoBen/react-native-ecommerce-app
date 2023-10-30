import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import commonStylesFun from '../../styles/commonStyles';

export default ({fontFamily, themeColors, isDarkMode, MyDarkTheme}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    availableBalanceCon: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingBottom: moderateScale(10),
      backgroundColor: colors.white,
    },
    balanceCon: {
      // flexDirection:'row',
      flex: 0.6,
      paddingLeft: moderateScale(10),
      paddingTop: moderateScale(10),
    },
    availableBalanceText: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(12),
    },
    availableBalanceValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(17),
      marginVertical: moderateScaleVertical(7),
    },
    addMoneyCon: {
      flex: 0.4,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    addMoneybtn: {
      // width: moderateScale(100),
      backgroundColor: themeColors?.primary_color,
      padding: moderateScaleVertical(8),
      marginHorizontal: moderateScaleVertical(8),
      borderRadius: moderateScale(5),
      marginTop: moderateScale(18),
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    addMoneyText: {
      fontSize: moderateScale(11),
      fontFamily: fontFamily.medium,
      color: themeColors?.secondary_color,
    },
    cartItemLine: {
      height: 0.5,
      backgroundColor: colors.borderLight,
      marginBottom: moderateScaleVertical(2),
      // marginVertical:moderateScaleVertical(10)
    },
    transactionHistoryCon: {
      flexDirection: 'row',
      paddingVertical: moderateScaleVertical(10),
      backgroundColor: colors.transactionHistoryBg,
      // justifyContent: 'center',
      paddingLeft: moderateScale(10),
      marginTop: moderateScaleVertical(15),
    },
    transactionHistoryText: {
      fontFamily: fontFamily.medium,
    },
    addMoneyListDesc: {
      // height: 60,
      flex: 0.7,
      paddingTop: moderateScale(2),
      paddingLeft: moderateScale(10),
    },
    addedText: {
      fontFamily: fontFamily.medium,
      color: colors.walletTextD,
      fontSize: moderateScale(13),
      marginLeft: moderateScaleVertical(15),
    },
    addedMoneyValue: {
      fontFamily: fontFamily.medium,
    },
    addedMoneyValueCon: {
      // height: 60,
      flex: 0.2,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingRight: moderateScale(10),
      paddingVertical: moderateScaleVertical(8),
    },
    addedMoneyTime: {
      textAlign: 'right',
      fontSize: moderateScale(12),
      fontFamily: fontFamily.medium,
      color: colors.walletTimeG,
      marginTop: moderateScale(5),
    },
    addedMoneyMonth: {
      textAlign: 'right',
      fontSize: moderateScale(13),
      fontFamily: fontFamily.medium,
      color: colors.walletTextD,
    },
    addedMoneyTimeCon: {
      // height: 60,
      flex: 0.2,
      justifyContent: 'center',
    },
    nameTextStyle: {
      fontSize: textScale(12),
      marginLeft: moderateScale(14),
      fontFamily: fontFamily.medium,
    },
    textInputStyle: {
      flex: 1,
      opacity: 0.7,
      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(13),
      paddingHorizontal: 10,
      paddingTop: 0,
      paddingBottom: 0,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    textInputView: {
      flexDirection: 'row',
      height: moderateScaleVertical(49),
      color: colors.white,
      borderWidth: 1,
      borderRadius: 13,
      borderColor: isDarkMode
        ? MyDarkTheme.colors.text
        : colors.lightGreyBorder,
      paddingHorizontal: moderateScale(12),
    },
    headingStyle: {
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      marginBottom: moderateScaleVertical(6),
    },
  });
  return styles;
};
