import {Platform, StyleSheet} from 'react-native';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../../../utils/helperFunctions';

export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    scrollviewHorizontal: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.borderLight,
    },
    headerText: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      alignSelf: 'center',
    },
    mainComponent: {
      flex: 1,
      backgroundColor: colors.backgroundGrey,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    topLable: {
      flexDirection: 'row',
      paddingHorizontal: moderateScale(10),
    },
    deliveryLocationAndTime: {
      ...commonStyles.mediumFont14,
      color: colors.textGreyB,
    },
    clearCartView: {
      height: moderateScaleVertical(30),
      backgroundColor: getColorCodeWithOpactiyNumber(
        themeColors.primary_color.substr(1),
        20,
      ),
      marginTop: moderateScaleVertical(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    vendorView: {
      flexDirection: 'row',
      height: moderateScaleVertical(35),
      backgroundColor: colors.white,
      alignItems: 'center',
      paddingHorizontal: moderateScale(10),
      borderBottomWidth: moderateScaleVertical(0.5),
      borderBottomColor: colors.borderLight,
    },
    clearCart: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      color: themeColors.primary_color,
      opacity: 1,
      alignSelf: 'center',
    },
    vendorText: {
      ...commonStyles.futuraHeavyBt,
      marginRight: moderateScale(20),
      color: colors.blackB,
      opacity: 1,
    },
    offersView: {
      backgroundColor: colors.lightGreyBgB,
      padding: moderateScale(20),
      marginTop: moderateScaleVertical(10),
    },
    offerText: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    selectPromoCode: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      paddingLeft: moderateScale(5),
    },
    viewOffers: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },
    removeCoupon: {
      color: colors.themeColor,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      paddingRight: moderateScale(5),
    },
    priceSection: {
      paddingHorizontal: moderateScale(20),
      marginTop: moderateScaleVertical(10),
    },
    price: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    priceTipLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
    priceItemLabelVat: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
    },
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    addInstruction: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      textDecorationLine: 'underline',
    },
    selectedMethod: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      marginLeft: moderateScale(10),
    },
    paymentMainView: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: moderateScaleVertical(20),
      paddingVertical: moderateScaleVertical(10),
      backgroundColor: colors.lightGreyBgB,
    },

    // cart item design start from here
    cartItemMainContainer: {
      flexDirection: 'row',
      paddingVertical: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(10),
      backgroundColor: colors.white,
    },
    cartItemImage: {
      height: width / 4.5,
      width: width / 4.5,
      backgroundColor: colors.white,
    },
    cartItemName: {
      fontSize: textScale(15),
      fontFamily: fontFamily.bold,
      marginTop: moderateScaleVertical(5),
      color: colors.black,
      opacity: 0.8,
    },
    cartItemDetailsCon: {
      width: width - width / 4 - 20,
      paddingHorizontal: moderateScale(10),
    },
    cartItemPrice: {
      fontFamily: fontFamily.bold,
      color: colors.cartItemPrice,
      fontSize: textScale(14),
      marginVertical: moderateScaleVertical(8),
    },
    cartItemWeight: {
      color: colors.textGreyB,
    },
    cartItemWeight2: {
      color: colors.textGreyB,
      fontSize: moderateScaleVertical(11),
    },
    rattingContainer: {
      paddingRight: moderateScale(16),
      width: moderateScaleVertical(100),
    },
    incDecBtnContainer: {
      backgroundColor: themeColors.primary_color,
      borderRadius: moderateScale(5),
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingVertical: moderateScaleVertical(3),
    },
    cartItemRatting: {
      tintColor: colors.orange,
      marginTop: moderateScaleVertical(2),
      marginTop: moderateScaleVertical(8),
    },
    cartItemRattingNum: {
      marginLeft: moderateScaleVertical(5),
      fontFamily: fontFamily.bold,
      color: colors.orange,
      marginTop: moderateScaleVertical(8),
    },
    cartItemValueBtn: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(20),
      color: colors.white,
    },
    cartItemValue: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
      color: colors.white,
      marginTop: moderateScaleVertical(5),
    },
    cartItemLine: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginBottom: moderateScaleVertical(10),
    },

    itemPriceDiscountTaxView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(5),
      marginHorizontal: moderateScale(10),
    },
    offersViewB: {
      marginHorizontal: moderateScale(10),
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
    bottomTabLableValue: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(5),
    },
    amountPayable: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(10),
    },
    paymentView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginVertical:
        Platform.OS === 'ios'
          ? moderateScaleVertical(40)
          : moderateScaleVertical(85),
    },
    placeOrderButtonStyle: {
      backgroundColor: themeColors.primary_color,
      width: width / 2.4,
    },
    sceduleOrderStyle: {
      backgroundColor: getColorCodeWithOpactiyNumber(
        themeColors.primary_color.substr(1),
        20,
      ),
      width: width / 2,
    },
    dashedLine: {
      height: 1,
      borderRadius: 1,
      borderWidth: 0.5,
      borderColor: colors.borderLight,
      borderStyle: 'dashed',
    },
    address: {
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBgColor,
      fontSize: textScale(10),
      marginHorizontal: moderateScale(10),
    },
    imageStyle: {height: width / 4.5, width: width / 4.5},

    containerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      ...commonStyles.mediumFont16,
      fontSize: textScale(18),
    },
    tipArrayStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderColor: colors.textGreyB,
      marginRight: 5,
      marginVertical: 20,
      borderRadius: moderateScale(5),
      borderColor: themeColors.primary_color,
    },
    tipArrayStyle2: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderColor: colors.textGreyB,
      marginRight: 5,
      marginVertical: 20,
      borderRadius: moderateScale(5),
      borderColor: themeColors.primary_color,
    },
    bottomAddToCartView: {
      marginHorizontal: moderateScale(20),
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    modalContainer: {
      marginHorizontal: 20,
      marginVertical: 20,
      //   marginTop: moderateScaleVertical(height / 2),
      overflow: 'hidden',
      justifyContent: 'center',
    },
    closeButton: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginVertical: moderateScaleVertical(-25),
      marginHorizontal: moderateScale(5),
      zIndex: 1000,
      backgroundColor: 'white',
      // width: 20,
      // height: 20,
      alignSelf: 'flex-end',
      borderRadius: 50,
    },
    modalMainViewContainer: {
      //   flex: 1,
      backgroundColor: colors.white,
      //   borderTopLeftRadius: 20,
      //   borderTopRightRadius: 20,
      borderRadius: 20,
      maxHeight: height - width / 2,
      minHeight: height / 3,
      marginHorizontal: moderateScale(20),

      // overflow: 'hidden',
      // paddingHorizontal: moderateScale(24),
    },
    carType: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
      paddingRight: moderateScale(30),
    },
    selectItemToReturn: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.medium,
    },
    cartItemImage: {
      height: width / 7,
      width: width / 7,
      backgroundColor: colors.white,
      marginLeft: 5,
    },
    imageStyle: {height: width / 7, width: width / 7},
  });
  return styles;
};
