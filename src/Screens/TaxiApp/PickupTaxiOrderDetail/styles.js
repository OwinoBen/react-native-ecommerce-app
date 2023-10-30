import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import commonStylesFunc from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';

export default ({ fontFamily, isDarkMode, MyDarkTheme }) => {
  const commonStyles = commonStylesFunc({ fontFamily });
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
    container: {
      flex: 1,
      justifyContent: 'flex-end',
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
      marginTop:moderateScaleVertical(8)
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
      backgroundColor: colors.white,
      alignItems: 'center',
      paddingHorizontal: moderateScale(10),
      borderBottomWidth: moderateScaleVertical(0.5),
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
    map: {
      ...StyleSheet.absoluteFillObject,
      height: height - height / 4,
    },
    plainView: {
      alignItems: 'center',
      justifyContent: 'center',
      // left: 20,
      borderRadius: moderateScale(2),
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    pickupDropOff: {
      textAlign: 'center',
      alignItems: 'center',
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
      // padding:
    },
    pickupDropOffAddress: {
      textAlign: 'left',
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
    topView: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 10,
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
    bottomView: {
      backgroundColor: colors.white,
      borderTopLeftRadius: moderateScale(18),
      borderTopRightRadius: moderateScale(18),
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      width: width,
    },
    //   cart item design start from here
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
      // opacity:0.
      opacity: 0.8,
    },
    cartItemDetailsCon: {
      // backgroundColor: 'red',
      // height: width / 4.5,
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
      fontSize: textScale(14),
    },
    cartItemWeight2: {
      color: colors.textGreyB,
      fontSize: moderateScaleVertical(11),
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
    imageStyle: { height: width / 4.5, width: width / 4.5 },
    writeAReview: {
      fontFamily: fontFamily.bold,
      color: colors.lightGreyBgColor,
      fontSize: textScale(10),
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
    },
    lable1: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.medium,
      marginHorizontal: moderateScale(20),
    },
    lable2: {
      fontSize: textScale(14),
      color: colors.textGreyJ,
      fontFamily: fontFamily.medium,
      // textAlign: 'center',
    },
    distanceDurationDeliveryLable: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
    },
    distanceDurationDeliveryValue: {
      fontSize: textScale(16),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
    datePriceText: {
      fontSize: textScale(14),
      fontFamily: fontFamily.medium,
      color: isDarkMode
        ? MyDarkTheme.colors.text
        : colors.black,
      textAlign: 'left'
    },
    statusText: {
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
      color: isDarkMode
        ? MyDarkTheme.colors.text
        : colors.blackOpacity40,
      textAlign: 'left'
    },
    deliveryProof: {
      fontSize: textScale(16),
      fontFamily: fontFamily.medium,
      marginBottom: moderateScaleVertical(4),
      color: isDarkMode
        ? MyDarkTheme.colors.text
        : colors.blackOpacity86,
    },
    horizontalLine: {
      borderBottomWidth:0.8,
      borderBottomColor: isDarkMode ? colors.whiteOpacity22 : colors.lightGreyBg,
      marginVertical: moderateScaleVertical(10)
    },startChatText: {
      // margin: moderateScale(15),
      color: colors.redB,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      marginRight:moderateScale(6)
    },
    agentUserIcon: {
      tintColor: colors?.redB,
      width: moderateScale(15),
      height:moderateScale(15)

    },  textInputStyle: {
       height:moderateScaleVertical(60),
      padding: 10,
      borderRadius: 5,
      textAlignVertical: 'top',
      width:'90%',
      marginHorizontal:moderateScale(10),
      borderWidth:moderateScale(0.5),
      alignSelf:'center',
      marginVertical:moderateScaleVertical(10)
    },
    loaderStyle: {
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      marginTop:moderateScaleVertical(24)
    }
  });
  return styles;
};
