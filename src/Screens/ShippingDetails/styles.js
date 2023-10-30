import {StyleSheet, I18nManager} from 'react-native';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';

export default ({fontFamily, themeColors}) => {
  const styles = StyleSheet.create({
    bottomSection: {
      marginVertical: moderateScaleVertical(40),
      marginHorizontal: moderateScaleVertical(20),
    },
    labelStyle: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    bottomSection: {
      marginVertical: moderateScaleVertical(40),
      marginHorizontal: moderateScaleVertical(20),
    },
    labelStyle: {
      color: colors.textGreyD,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    listHeadingStyle: {
      color: colors.textGreyD,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    itemLabel: {
      flex: 0.4,
      textAlign: 'left',
      color: colors.textGreyE,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    itemValue: {
      flex: 0.6,

      textAlign: 'right',
      color: colors.textGreyE,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    skipText: {
      alignSelf: 'center',
      fontFamily: fontFamily.bold,
      color: colors.themeColor,
      fontSize: textScale(14),
    },
    listItemStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    bottomSection: {
      marginVertical: moderateScaleVertical(40),
      marginHorizontal: moderateScaleVertical(20),
    },
    labelStyle: {
      color: colors.textGreyD,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    contentsStyle: {
      color: colors.textGreyD,
      opacity: 0.7,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },

    skipText: {
      alignSelf: 'center',
      fontFamily: fontFamily.bold,
      color: themeColors.primary_color,
      fontSize: textScale(14),
    },
    dropdownStyle1: {
      backgroundColor: colors.backgroundGrey,
      borderWidth: 0,
      borderRadius: 18,
      zIndex: 5000,
      marginHorizontal: moderateScale(10),
      paddingVertical: moderateScaleVertical(10),
    },
    dropdownStyle2: {
      backgroundColor: colors.backgroundGrey,
      borderWidth: 0,
      borderRadius: 18,
      zIndex: 4000,

      marginHorizontal: moderateScale(10),
      paddingVertical: moderateScaleVertical(10),
    },
    dropdownStyle3: {
      backgroundColor: colors.backgroundGrey,
      borderWidth: 0,
      borderRadius: 18,
      zIndex: 3000,
      marginHorizontal: moderateScale(10),
      paddingVertical: moderateScaleVertical(10),
    },
    dropdownItemStyle: {
      justifyContent: 'flex-start',
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    },
    dropdownLabelStyleLeft: {
      textAlign: 'left',
    },
    dropdownContainerStyle1: {
      borderWidth: 1,
      borderRadius: 13,
      height: moderateScaleVertical(49),
      borderColor: colors.borderLight,
      marginBottom: moderateScaleVertical(20),
      zIndex: 5000,
    },
    dropdownContainerStyle2: {
      borderWidth: 1,
      borderRadius: 13,
      height: moderateScaleVertical(49),
      borderColor: colors.borderLight,
      marginBottom: moderateScaleVertical(20),
      zIndex: 4000,
    },
    dropdownContainerStyle3: {
      borderWidth: 1,
      borderRadius: 13,
      height: moderateScaleVertical(49),
      borderColor: colors.borderLight,
      marginBottom: moderateScaleVertical(10),
      zIndex: 3000,
    },

    dropdownPlaceholderStyle: {
      color: colors.textGreyD,
      opacity: 0.7,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    pickerStyle: {
      backgroundColor: '#fafafa',
      height: moderateScaleVertical(100),
      width: width - moderateScale(40),
      alignItems: 'center',
    },
    packingBoxStyle: {
      height: moderateScaleVertical(100),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 2,

      padding: 5,
      marginVertical: 5,
      marginRight: 5,
    },
    caseOnDeliveryView: {
      // padding: moderateScaleVertical(18),
      borderRadius: moderateScaleVertical(13),
      // borderWidth: 2,
      borderColor: colors.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
      marginTop: moderateScaleVertical(15),
    },
    boxTitle: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    boxTitle2: {
      color: colors.textGreyC,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      marginTop: moderateScaleVertical(5),
    },
    useNewCartView: {
      padding: moderateScaleVertical(15),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 2,
      borderColor: colors.borderLight,
      flexDirection: 'row',
      marginTop: moderateScaleVertical(8),
    },
    useNewCartText: {
      fontFamily: fontFamily.medium,
      color: colors.textGrey,
      marginLeft: moderateScaleVertical(100),
      fontSize: moderateScaleVertical(14),
      opacity: 0.7,
    },
    caseOnDeliveryText: {
      marginHorizontal: moderateScaleVertical(10),
      fontFamily: fontFamily.bold,
    },
    price: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: moderateScaleVertical(14),
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,

      fontSize: moderateScaleVertical(13),
    },
    dropOff: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: moderateScaleVertical(14),
      marginTop: moderateScaleVertical(40),
    },
    dots: {
      width: 4,
      height: 4,
      backgroundColor: 'grey',
      borderRadius: 50,
      marginVertical: 3,
      marginLeft: 4,
    },
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: moderateScaleVertical(14),
    },
    totalPayableView: {
      flexDirection: 'row',
      paddingVertical: moderateScaleVertical(16),

      justifyContent: 'center',
    },
    totalPayableText: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(14),
      marginLeft: moderateScale(5),
      marginVertical: moderateScaleVertical(2),
      // color:colors.black
    },
    totalPayableValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(20),
      marginVertical: moderateScaleVertical(2),
    },
    allIncludedText: {
      color: colors.walletTextD,
      fontFamily: fontFamily.regular,
      marginVertical: moderateScaleVertical(12),
    },
    cardImageView: {
      flex: 0.1,
      flexDirection: 'row',
      justifyContent: 'flex-start',

      marginTop: moderateScaleVertical(5),
    },
    masterCardLogo: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
    },
    enter_details_heading: {
      flexDirection: 'row',
      marginVertical: moderateScaleVertical(20),
    },
    content_options_view: {
      flex: 0.4,
      flexDirection: 'row',

      alignItems: 'center',
    },
    content_options_text: {
      color: colors.textGreyE,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    subheading: {
      flexDirection: 'row',
      marginVertical: moderateScaleVertical(10),
    },
    payment_option_view: {
      flex: 1,
      flexDirection: 'row',
      marginHorizontal: moderateScale(8),
    },
    payment_option_logo: {
      flex: 0.2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    payment_option_details: {
      flex: 0.7,
      marginTop: moderateScaleVertical(5),
    },
    payment_option_name_view: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: moderateScaleVertical(6),
      marginTop: moderateScaleVertical(20),
    },
    payment_option_name_text: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
    },
    carType2: {
      fontSize: textScale(14),
      color: colors.textGreyJ,
      fontFamily: fontFamily.medium,
    },
    offersViewB: {
      // marginHorizontal: moderateScale(20),
      backgroundColor: getColorCodeWithOpactiyNumber(
        themeColors.primary_color.substr(1),
        20,
      ),
      paddingVertical: moderateScaleVertical(15),
      paddingHorizontal: moderateScaleVertical(10),
      marginVertical: moderateScaleVertical(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewOffers: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },
    distanceDurationDeliveryLable: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
    },
    distanceDurationDeliveryValue: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
    paymentMainView: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: moderateScaleVertical(20),
      paddingVertical: moderateScaleVertical(10),
      backgroundColor: colors.lightGreyBgB,
    },
    selectedMethod: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      marginLeft: moderateScale(10),
    },
  });
  return styles;
};
