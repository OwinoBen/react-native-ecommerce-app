import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
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
  });
