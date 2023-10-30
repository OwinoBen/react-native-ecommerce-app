import { StyleSheet } from 'react-native';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';

export default ({ themeColors, fontFamily, productTotalQuantity }) =>
  StyleSheet.create({
    cardViewStyle: {
      alignItems: 'center',
      height: width * 0.7,
      width: width,
      // marginRight: 20
    },
    dotStyle: { height: 12, width: 12, borderRadius: 12 / 2 },
    ratingColor: {
      color: colors.backgroundGrey,
      paddingLeft: 5,
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
    },
    productName: {
      color: colors.textGrey,
      fontSize: textScale(18),
      lineHeight: 28,
      fontFamily: fontFamily.bold,
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
      fontSize: textScale(18),
      lineHeight: 28,
      fontFamily: fontFamily.bold,
    },
    productPrice2: {
      color: colors.orangeB,
      fontSize: textScale(18),
      lineHeight: 28,
      fontFamily: fontFamily.bold,
      textAlign: 'center',
    },
    descriptiontitle: {
      color: colors.textGrey,
      fontSize: textScale(16),
      lineHeight: 28,
      fontFamily: fontFamily.medium,
      marginVertical: moderateScaleVertical(10),
    },
    description: {
      color: colors.textGreyB,
      fontSize: textScale(14),
      lineHeight: 22,
      fontFamily: fontFamily.medium,
    },
    relatedProducts: {
      color: colors.textGrey,
      fontSize: textScale(18),
      lineHeight: 28,
      fontFamily: fontFamily.bold,
      marginVertical: moderateScaleVertical(10),
    },

    addonLable: {
      color: colors.textGrey,
      fontSize: textScale(16),
      lineHeight: 22,
      fontFamily: fontFamily.bold,
    },

    variantLable: {
      color: colors.textGrey,
      fontSize: textScale(14),
      lineHeight: 22,
      fontFamily: fontFamily.bold,
    },
    variantSizeViewOne: {
      height: moderateScale(30),
      width: moderateScale(30),
      borderRadius: moderateScale(30 / 2),

      // borderColor: i?.value ? 'red' : 'transparent',

      alignItems: 'center',
      justifyContent: 'center',
    },
    variantSizeViewTwo: {
      height: moderateScale(40),
      width: moderateScale(40),
      borderRadius: moderateScale(40 / 2),

      // borderColor: i?.value ? 'red' : 'transparent',

      alignItems: 'center',
      justifyContent: 'center',
    },

    modalMainViewContainer: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
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
      height: height / 3.8,
      width: width,
      overflow: 'hidden',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    productName: {
      color: colors.textGrey,
      fontSize: textScale(14),
      lineHeight: 28,
      fontFamily: fontFamily.medium,
    },
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
      fontSize: textScale(14),
      lineHeight: 22,
      fontFamily: fontFamily.medium,
      paddingLeft: moderateScale(5),
      paddingRight: moderateScale(20),
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
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      lineHeight: moderateScale(22),
    },
  });
