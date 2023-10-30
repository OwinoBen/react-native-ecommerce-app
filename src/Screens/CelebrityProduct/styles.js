import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';

export default ({themeColors, fontFamily}) =>
  StyleSheet.create({
    cardViewStyle: {
      alignItems: 'center',
      height: height / 4,
      width: width - 100,
    },
    dotStyle: {height: 12, width: 12, borderRadius: 12 / 2},
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
      fontFamily: fontFamily.regular,
    },
    productTypeAndBrandValue: {
      color: colors.backgroundGrey,
      fontSize: textScale(14),
      lineHeight: 20,
      fontFamily: fontFamily.medium,
    },
    boxOne: {
      borderWidth: 1,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderColor: colors.lightGreyBgColor,
      borderRightColor: themeColors.primary_color,
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
      fontFamily: fontFamily.regular,
    },
    relatedProducts: {
      color: colors.textGrey,
      fontSize: textScale(18),
      lineHeight: 28,
      fontFamily: fontFamily.bold,
      marginVertical: moderateScaleVertical(10),
    },
    addProduct: {
      color: colors.textGrey,
      fontSize: textScale(16),
      lineHeight: 20,
      fontFamily: fontFamily.bold,
      alignSelf: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    sortFilterTabView: {
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScaleVertical(10),
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: getColorCodeWithOpactiyNumber('C9CCD0', 50),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tabLable: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 0.5,
      flexDirection: 'row',
    },
    sortFilter: {
      color: colors.textGrey,
      fontSize: textScale(14),
      lineHeight: 20,
      fontFamily: fontFamily.regular,
      alignSelf: 'center',
      paddingLeft: moderateScale(10),
    },
    absolute: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    sortFilter2: {
      color: colors.textGrey,

      fontFamily: fontFamily.reguler,
      alignSelf: 'center',
      fontSize: moderateScale(14),
      marginStart: moderateScale(6),
    },
    tabLable2: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginHorizontal: moderateScale(6),
      marginRight: moderateScale(10),
    },
    sortFilterTabView2: {
      marginHorizontal: moderateScale(16),
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(18),
    },
  });
