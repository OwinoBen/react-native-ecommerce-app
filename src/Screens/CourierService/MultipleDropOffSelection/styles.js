import {StyleSheet} from 'react-native';
import store from '../../../redux/store';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';

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
    titleAbout: {
      ...commonStyles.futuraBtHeavyFont14,
      color: colors.textGrey,
      textAlign: 'justify',
    },
    contentAbout: {
      fontSize: textScale(14),
      color: colors.textGreyB,
      fontFamily: fontFamily.medium,
      lineHeight: moderateScaleVertical(20),
      textAlign: 'justify',
    },
    dots: {
      width: 3,
      height: 3,
      backgroundColor: themeColors.primary_color,
      borderRadius: 50,
      marginVertical: 3,
      // marginLeft: 4,
    },
    shadowStyle: {
      height: 10,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 7,
      },
      shadowOpacity: 0.1,
    },
    shadowStyleAndroid: {
      height: 10,
      backgroundColor: '#fff',
      elevation: 7,
    },
    addresssLableName: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
    },
    address: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
    },
    suggestions: {
      padding: moderateScale(10),
      borderBottomColor: colors.borderColorD,
      borderBottomWidth: 1,
      marginHorizontal: moderateScale(10),
    },
    textGoogleInputContainerAddress: {
      // flexDirection: 'row',
      // flexWrap:'wrap',
      // overflow:'hidden',
      flexDirection: 'row',
      width: width - moderateScale(width / 3.5),
      height: moderateScaleVertical(40),
      color: colors.white,
      // borderWidth: isFocus ? 1.5 : 0,
      borderWidth: 0,
      borderRadius: 13,
      // borderColor: isFocus ? colors.blackC : colors.borderLight,
      // backgroundColor: isFocus ? colors.white : colors.textGreyK,
      borderColor: colors.borderLight,
      backgroundColor: colors.textGreyK,

      // marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listView: {
      position: 'absolute',
      backgroundColor: colors.white,
      zIndex: 1000, //Forcing it to front
      // marginTop: moderateScaleVertical(-20),
      marginHorizontal: moderateScale(0),

      width: width,
      alignSelf: 'center',
      // borderWidth: 1,
      // viewHeight,
      top:
        type == 'pickup'
          ? moderateScaleVertical(48) * 2 + 20
          : type == 'dropOffLocation'
          ? moderateScaleVertical(48) + 20
          : type == 'dropOffLocationTwo'
          ? moderateScaleVertical(44)
          : -100,
      // height: height / 3,
    },

    textInput2: {
      height: moderateScaleVertical(30),
      borderRadius: 13,
      // backgroundColor: isFocus ? colors.white : colors.textGreyK,
      backgroundColor: colors.textGreyK,
    },
    selectAndAddesssView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: moderateScaleVertical(24),
      marginTop: moderateScaleVertical(40),
      paddingHorizontal: moderateScale(24),
    },
    savedAddressText: {
      ...commonStyles.mediumFont16,
      color: colors.textGreyD,
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
    },
    modalMainViewContainer: {
      position: 'absolute',
      // backgroundColor:'red',
      // marginHorizontal: 10,
      marginVertical: 10,
      padding: moderateScale(10),
      marginTop: savedAddressViewHeight == 1 ? 48 * 2 : 48 + 5,
      flexDirection: 'row',
      zIndex: type || avalibleValueInTextInput ? -1000 : 1000,
      top:
        type == 'pickup'
          ? 48 * 2 + 50
          : type == 'dropOffLocation'
          ? 48 * 2
          : type == 'dropOffLocationTwo'
          ? 48
          : 80,
    },
    savedAddressView: {
      flexDirection: 'row',
      marginTop: moderateScaleVertical(20),
      paddingHorizontal: moderateScale(10),
      width: width,
      // shadowColor: '#000',
      // shadowOffset: {
      //   width: 0,
      //   height: 7,
      // },
      // elevation: 3,
    },
  });
  return styles;
};
