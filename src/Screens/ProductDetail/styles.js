import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({ themeColors, fontFamily, productTotalQuantity }) =>
  StyleSheet.create({
    cardViewStyle: {
      alignItems: 'center',
      height: moderateScale(180),
      width: '100%',

      // marginRight: 20
    },
    dotStyle: { height: 12, width: 12, borderRadius: 12 / 2 },
    ratingColor: {
      // color: colors.backgroundGrey,
      paddingLeft: 5,
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
    },
    productName: {
      color: colors.textGrey,
      fontSize: textScale(16),
      fontFamily: fontFamily.medium,
    },
    productTypeAndBrand: {
      color: colors.textGrey,
      fontSize: textScale(14),
      lineHeight: 20,
      fontFamily: fontFamily.bold,
    },
    productTypeAndBrandValue: {
      color:
        productTotalQuantity && productTotalQuantity != 0
          ? colors.green
          : colors.orangeB,
      fontSize: textScale(10),
      lineHeight: 20,
      fontFamily: fontFamily.medium,
    },
    boxOne: {
      borderWidth: 1,
      borderRadius: 5,
      borderColor: colors.lightGreyBgColor,
      padding: 10,
    },
    boxTwo: {
      backgroundColor: themeColors.primary_color,
      borderWidth: 1,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      borderColor: themeColors.primary_color,
      borderRightColor: colors.themeColor,
      padding: 10,
    },
    productPrice: {
      color: colors.orangeB,
      fontSize: textScale(14),
      fontFamily: fontFamily.bold,
      textAlign: 'left',
    },
    productPrice2: {
      color: colors.black,
      fontSize: textScale(18),
      lineHeight: 28,
      fontFamily: fontFamily.bold,
      textAlign: 'center',
      textAlign: 'left',
    },
    descriptiontitle: {
      color: colors.textGrey,
      fontSize: textScale(16),
      fontFamily: fontFamily.medium,
      // marginVertical: moderateScaleVertical(10),
      textAlign: 'left',
      marginBottom: moderateScaleVertical(4),
    },
    description: {
      color: colors.textGreyB,
      fontSize: textScale(14),
      lineHeight: 22,
      fontFamily: fontFamily.medium,
      textAlign: 'left',
    },
    relatedProducts: {
      color: colors.textGrey,
      fontSize: textScale(18),
      lineHeight: 28,
      fontFamily: fontFamily.bold,
      marginVertical: moderateScaleVertical(10),
      textAlign: 'left',
    },

    addonLable: {
      color: colors.textGrey,
      fontSize: textScale(16),
      lineHeight: 22,
      fontFamily: fontFamily.bold,
      textAlign: 'left',
    },

    variantLable: {
      color: colors.textGrey,
      fontSize: textScale(14),
      lineHeight: 22,
      fontFamily: fontFamily.bold,
      textAlign: 'left',
    },
    variantSizeViewOne: {
      height: moderateScale(23),
      width: moderateScale(23),
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    variantSizeViewTwo: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'left',
    },

    modalMainViewContainer: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      textAlign: 'left',
      // overflow: 'hidden',
      // paddingHorizontal: moderateScale(24),
    },
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: moderateScaleVertical(height / 10),
      overflow: 'hidden',
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    imageStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    cardView: {
      height: height / 4.5,
      width: width,
      overflow: 'hidden',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    // productName: {
    //   color: colors.textGrey,
    //   fontSize: textScale(16),
    //   lineHeight: 28,
    //   fontFamily: fontFamily.bold,
    // },
    mainView: {
      marginVertical: moderateScaleVertical(15),
      paddingHorizontal: moderateScale(15),
    },
    description: {
      color: colors.textGreyB,
      fontSize: textScale(14),
      lineHeight: 22,
      fontFamily: fontFamily.regular,
      textAlign: 'left',
    },
    variantValue: {
      color: colors.black,
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
      textAlign: 'left',
    },

    chooseOption: {
      marginBottom: moderateScale(2),
      color: colors.textGreyF,
      fontWeight: '600',
      fontSize: textScale(10),
      lineHeight: 22,
      fontFamily: fontFamily.regular,
    },
    bottomAddToCartView: {
      marginHorizontal: moderateScale(20),
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
    incDecBtnContainer: {
      backgroundColor: themeColors.primary_color,
      borderRadius: moderateScale(5),
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      paddingVertical: moderateScaleVertical(3),
    },
    incDecBtnContainer2: {
      borderRadius: moderateScale(5),
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      borderWidth: 0.5,
      borderColor: themeColors.primary_color,
      paddingVertical: moderateScale(5),
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
    cartItemValue2: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
      color: themeColors.primary_color,
      marginTop: moderateScaleVertical(5),
    },
    cartItemValueBtn2: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(20),
      color: themeColors.primary_color,
    },
    descriptionStyle: {
      color: colors.textGreyE,
      fontSize: textScale(10),
      fontFamily: fontFamily.regular,
      textAlign: 'left',

      // lineHeight: moderateScale(22),
    },
    flexView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: moderateScaleVertical(4),
    },
    incDecBtnStyle: {
      borderWidth: 0.4,
      borderRadius: moderateScale(4),
      height: moderateScale(38),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(12),
    },
    boxView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: moderateScale(5),
      marginBottom: moderateScaleVertical(10),
      // width: 24,
      // height: 24,
      borderRadius: 2,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    dropDownStyle: {
      paddingHorizontal: moderateScale(8),
      borderRadius: moderateScale(4),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: moderateScaleVertical(2),
    },
    modalView: {
      paddingHorizontal: moderateScale(16),
      paddingTop: moderateScaleVertical(16),
      paddingBottom: moderateScaleVertical(56),
      borderTopLeftRadius: moderateScale(12),
      borderTopRightRadius: moderateScale(12),
    },
    horizontalLine: {
      width: '100%',
      borderBottomWidth: 0.5,
      marginVertical: moderateScaleVertical(8),
    },
    colorContainer: {
      marginVertical: moderateScaleVertical(8),
      height: moderateScale(80),
      width: moderateScaleVertical(60),
      marginRight: moderateScale(8),
      borderRadius: moderateScale(8),
      justifyContent: 'center',
      borderWidth: 1,
    },
    colorView: {
      height: moderateScale(40),
      width: moderateScale(40),
      borderRadius: moderateScale(20),
      borderColor: colors.greyA,
      borderWidth: 1,
      alignSelf: 'center'
    },
    sizeContainer: {
      justifyContent: 'center',
       marginRight: moderateScale(6), 
       height: moderateScale(30), 
       minWidth: moderateScaleVertical(70), 
       alignItems: 'center', 
       borderRadius: moderateScale(8), 
       paddingHorizontal:moderateScale(8),
       borderWidth: 1, 
       borderColor: colors.greyA, 
       marginVertical: moderateScaleVertical(12)
    }
 
  });
