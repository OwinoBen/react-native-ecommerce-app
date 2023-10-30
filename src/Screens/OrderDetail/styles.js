import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const commonStyles = commonStylesFunc({fontFamily});
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
      // borderTopLeftRadius: 20,
      // borderTopRightRadius: 20,
      marginBottom: moderateScale(5),
      // justifyContent: 'flex-end',

      // marginBottom: moderateScaleVertical(20),
    },
    userName: {
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    orderLableStyle: {
      color: colors.textGreyI,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      opacity: 0.4,
    },
    topLable: {
      flexDirection: 'row',
      paddingHorizontal: moderateScale(16),
    },
    deliveryLocationAndTime: {
      ...commonStyles.mediumFont14,
      color: colors.textGreyB,
      // marginHorizontal: 10,
    },
    clearCartView: {
      height: moderateScaleVertical(30),
      backgroundColor: colors.blueBackGroudC,
      marginTop: moderateScaleVertical(10),
      justifyContent: 'center',
      alignItems: 'center',
    },
    vendorView: {
      flexDirection: 'row',
      height: moderateScaleVertical(35),
      // backgroundColor: colors.white,
      alignItems: 'center',
      paddingHorizontal: moderateScale(10),
      // borderBottomWidth: moderateScaleVertical(0.5),
      borderBottomColor: colors.borderLight,
    },
    clearCart: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      color: colors.blueColor,
      opacity: 1,
      alignSelf: 'center',
    },
    vendorText: {
      ...commonStyles.futuraHeavyBt,
      marginRight: moderateScale(20),
      color: colors.blackB,
      opacity: 1,
      // alignSelf: 'center',
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
      color: colors.themeColor,
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
      // backgroundColor: colors.lightGreyBgB,
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

    //   cart item design start from here
    cartItemMainContainer: {
      flexDirection: 'row',
      paddingVertical: moderateScaleVertical(10),
      // paddingHorizontal: moderateScale(10),
      backgroundColor: colors.white,
      borderRadius: moderateScale(10),
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
      // opacity:0.
      opacity: 0.8,
    },
    cartItemDetailsCon: {
      // height: width / 4.5,
      // backgroundColor: 'red',
      flexDirection: 'row',
      width: width,
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
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
    },
    cartItemWeight2: {
      color: colors.textGreyB,
      fontSize: moderateScaleVertical(11),
      fontFamily: fontFamily.regular,
    },
    rattingContainer: {
      // borderWidth: 0.5,
      paddingRight: moderateScale(16),
      width: moderateScaleVertical(100),
    },
    incDecBtnCobtainer: {
      // paddingHorizontal: moderateScale(20),
      backgroundColor: colors.cartItemAddRemoveBtn,
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
      backgroundColor: colors.blueBackGroudC,
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
      marginVertical: moderateScaleVertical(20),
    },
    placeOrderButtonStyle: {
      backgroundColor: colors.themeColor,
      width: width / 2.4,
    },
    sceduleOrderStyle: {
      backgroundColor: 'rgba(67,162,231,0.3)',
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
      // marginLeft:moderateScale(5),
      fontFamily: fontFamily.medium,
      color: colors.lightGreyBgColor,
      fontSize: textScale(10),
    },
    imageStyle: {
      height: width / 4.5,
      width: width / 4.5,
      borderRadius: moderateScale(8),
    },
    writeAReview: {
      fontFamily: fontFamily.bold,
      color: colors.lightGreyBgColor,
      fontSize: textScale(10),
      textAlign: 'left',
    },
    containerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // marginVertical: moderateScaleVertical(height / 4),
    },
    textStyle: {
      ...commonStyles.mediumFont16,
      fontSize: textScale(18),
      textAlign: 'left',
    },
    waitToAccept: {
      fontFamily: fontFamily.regular,
      color: colors.black,
      fontSize: textScale(14),
      lineHeight: 19,
      opacity: 0.7,
      paddingVertical: 10,
    },
    summaryText: {
      fontSize: textScale(16),
      fontFamily: fontFamily.medium,
      textAlign: 'left',
      marginBottom: moderateScaleVertical(12),
    },
    dottedLine: {
      borderWidth: 1,
      height: 1,
      borderStyle: 'dotted',
      borderColor: '#979797',
      marginBottom: moderateScaleVertical(12),
    },
    ariveTextStyle: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(11),
    },
    ariveView: {
      padding: moderateScale(6),
    },
    quantityStyles: {
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    modalMainViewContainer: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    carType: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
    },
    laundryApppriceItemLabel2: {
      marginLeft: moderateScale(5),
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      opacity: 0.6,
    },
    startChatText: {
      // margin: moderateScale(15),
      color: colors.redB,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      marginRight: moderateScale(6),
    },
    agentUserIcon: {
      tintColor: colors?.redB,
      width: moderateScale(15),
      height: moderateScale(15),
    },
    startEndDateTitle: {
      fontSize: moderateScale(12),
      fontFamily: fontFamily.bold,
      color: colors.black,
    },
    startEndDateValueTxt: {
      fontSize: moderateScale(11),
      fontFamily: fontFamily.regular,
      color: colors.blackOpacity66,
    },
  });
  return styles;
};
