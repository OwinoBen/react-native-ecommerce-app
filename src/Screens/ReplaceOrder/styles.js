import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({themeColors, fontFamily}) =>
  StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      borderBottomColor: colors.lightGreyBorder,
      borderBottomWidth: 0.7,
    },
    starViewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'center',
    },
    uploadImage: {
      fontSize: textScale(12),
      fontFamily: fontFamily.bold,
      color: colors.textGreyD,
    },
    imageOrderStyle: {
      height: width / 5,
      width: width / 5,
      borderRadius: 5,
      marginRight: 10,
      marginBottom: moderateScaleVertical(10),
    },
    viewOverImage: {
      height: width / 5,
      width: width / 5,
      borderRadius: 5,

      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    viewOverImage2: {
      borderWidth: 1,
      height: width / 5,
      width: width / 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'rgba(0,0,0,0.2)',
    },
    textInputContainer: {
      marginTop: moderateScaleVertical(10),
      borderRadius: 5,
      borderWidth: 1,
      height: width / 4,
      borderColor: colors.textGreyLight,
    },
    textInputStyle: {
      height: width / 2,
      padding: 10,
      borderRadius: 5,
      textAlignVertical: 'top',
    },
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      // opacity: 0.6,
    },
    cartItemImage: {
      height: width / 4.5,
      width: width / 4.5,
      backgroundColor: colors.white,
    },
    imageStyle: {height: width / 4.5, width: width / 4.5},
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    cartItemWeight: {
      color: colors.textGreyB,
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
    variantSizeViewTwo: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: 2,
      alignItems: 'center',
      justifyContent: 'center',
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
    variantValue: {
      color: colors.black,
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
      textAlign: 'left',
    },
  });
