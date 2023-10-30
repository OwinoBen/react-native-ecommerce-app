import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';

import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({
  fontFamily,
  themeColors,
  viewHeight,
  type,
  savedAddressViewHeight,
  avalibleValueInTextInput,
}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    productInfo: {
      fontSize: textScale(15),
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(10),
      textAlign: 'center',
    },
    productInfoTwo: {
      fontSize: textScale(14),
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(10),
      textAlign: 'center',
    },
    lineStyle: {
      backgroundColor: colors.lightGreyBgColor,
      width: moderateScale(22),
      height: moderateScaleVertical(1),
      justifyContent: 'center',
    },
    productInfoView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      // opacity: 0.6,
    },
    packingBoxStyle: {
      width: width / 3 - 25,
      height: moderateScaleVertical(109),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 5,
      margin: 5,
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
    addAnotherPackage: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    textGoogleInputContainerAddress: {
      // flexDirection: 'row',
      // flexWrap:'wrap',
      // overflow:'hidden',
      height: moderateScaleVertical(49),
      borderWidth: 1,
      borderRadius: 13,
      borderColor: colors.borderLight,
      marginBottom: 20,
      justifyContent: 'center',
      marginHorizontal: moderateScale(0),
      marginVertical: moderateScaleVertical(0),
      alignItems: 'center',
      // backgroundColor:'red'
    },
    // listView: {
    //   borderWidth: moderateScale(0),
    //   borderColor: colors.borderLight,
    //   marginHorizontal: moderateScale(0),
    //   zIndex: 20000,
    //   // backgroundColor: 'red',
    // },

    listView: {
      position: 'absolute',
      backgroundColor: 'transparent',
      zIndex: 1000, //Forcing it to front
      // marginTop: moderateScaleVertical(-20),
      // marginHorizontal: moderateScale(0),
      marginHorizontal: moderateScale(20),
      width: width - 40,
      alignSelf: 'center',
      // borderWidth: 1,
      // viewHeight,
      // zIndex: type || avalibleValueInTextInput ? 2000 : -2000,
      top:
        type == 'pickup'
          ? moderateScaleVertical(10)
          : type == 'dropOffLocation'
          ? moderateScaleVertical(10)
          : type == 'dropOffLocationTwo'
          ? moderateScaleVertical(44)
          : -100,
      height: height / 3,
    },
    modalMainViewContainer: {
      // zIndex: -2000,
      // backgroundColor:'red',
      marginHorizontal: moderateScale(10),
      width: width - 20,
      position: 'absolute',
      marginVertical: 10,
      padding: moderateScale(10),

      top:
        type == 'pickup'
          ? moderateScaleVertical(220)
          : type == 'dropOffLocation'
          ? moderateScaleVertical(220)
          : type == 'dropOffLocationTwo'
          ? moderateScaleVertical(44)
          : 220,
    },
    textInput: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
      opacity: 1,
      backgroundColor: 'transparent',
      // color: colors.textGreyOpcaity7,
    },
    textInput2: {
      height: moderateScaleVertical(35),
      borderRadius: 13,
      backgroundColor: 'transparent',
    },
    labelStyle: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: moderateScaleVertical(height / 10),
      overflow: 'hidden',
      justifyContent: 'flex-end',
    },
  });
  return styles;
};
