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
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';
import {useSelector} from 'react-redux';

export default ({
  fontFamily,
  themeColors,
  viewHeight,
  type,
  savedAddressViewHeight,
  avalibleValueInTextInput,
}) => {
  //   const theme = useSelector((state) => state?.initBoot?.themeColor);
  //   const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  //   const darkthemeusingDevice = useDarkMode();
  //   const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
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
      fontSize: textScale(12),
      color: colors.black,
      fontFamily: fontFamily.medium,

      marginLeft: moderateScale(6),
    },
    saveAddressLabel: {
      fontSize: textScale(14),
      color: colors.black,
      fontFamily: fontFamily.semiBold,
      lineHeight: moderateScaleVertical(20),
    },
    address: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      lineHeight: moderateScaleVertical(20),
      marginLeft: moderateScale(10),
      width: width - 20,
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

      justifyContent: 'center',
      alignItems: 'center',
    },
    listView: {
      position: 'absolute',
      backgroundColor: colors.white,
      zIndex: 1000, //Forcing it to front
      // marginTop: moderateScaleVertical(-20),
      marginHorizontal: moderateScale(0),
      paddingHorizontal: moderateScale(10),
      width: width,
      alignSelf: 'center',
      // borderWidth: 1,
      // viewHeight,
      top:
        type == 'pickup'
          ? moderateScaleVertical(40) * 2
          : type == 'dropOffLocation'
          ? moderateScaleVertical(28)
          : -100,
      // height: height / 3,
    },

    // textInput2: {

    //   //   backgroundColor: isDarkMode
    //   //     ? MyDarkTheme.colors.background
    //   //     : colors.textGreyK,
    //   //   color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
    // },
    selectAndAddesssView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: moderateScaleVertical(24),
      marginTop: moderateScaleVertical(40),
      paddingHorizontal: moderateScale(24),
    },
    savedAddressText: {
      ...commonStyles.mediumFont16,
      color: themeColors.primary_color,
      fontSize: textScale(12),
    },
    modalMainViewContainer: {
      position: 'absolute',
      marginVertical: 10,

      padding: moderateScale(10),
      marginTop: 48 + 5,
      zIndex: type || avalibleValueInTextInput ? -1000 : 1000,
      top: 80,

      bottom: 0,
      left: 0,
      right: 0,
    },
    savedAddressView: {
      flexDirection: 'row',
      // width: width - 30,
      marginBottom: moderateScaleVertical(8),
      alignItems: 'center',
      // shadowColor: '#000',
      // shadowOffset: {
      //   width: 0,
      //   height: 7,
      // },
      // elevation: 3,
    },
    addressViewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: moderateScale(10),
      borderBottomWidth: 0.5,
      marginBottom: moderateScaleVertical(4),
    },
    modalHeaderMainContainer: {
      paddingHorizontal: moderateScale(20),
    },
    bookFriendText: {
      fontSize: textScale(18.8),
      marginTop: moderateScaleVertical(-10),
      fontFamily: fontFamily?.bold,
    },
    modalMainContainer: {
      paddingVertical: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(20),
      paddingHorizontal: moderateScale(20),
    },
    textInputContainer: {
      marginVertical: moderateScaleVertical(10),
      borderColor: colors.textGreyB,
      borderWidth: 1,
    },
    textInputStyle: {
      height: moderateScaleVertical(30),
      paddingTop: moderateScaleVertical(10),
    },
    phoneNumberTextInputLabel: {
      color: colors.textGreyLight,
    },
    phoneNumberInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    countryPickerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: moderateScale(88),
    },
    countryPickerInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    callingCodeText: {
      fontFamily: fontFamily.medium,
      color: colors.textGreyOpcaity7,
    },
    phoneNumberInnput: {
      borderColor: colors.textGreyB,
      borderWidth: 1,
      width: moderateScale(width / 1.6),
    },
    textInputStyle: {
      height: moderateScaleVertical(30),
      paddingTop: moderateScaleVertical(10),
    },
    friendListModalInnerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // height: moderateScale(40),
      marginHorizontal: moderateScale(16),
      marginTop: moderateScaleVertical(-10),
    },
    hitSlop: {
      top: 30,
      right: 30,
      left: 30,
      bottom: 30,
    },
    switchRiderText: {
      fontSize: textScale(12),
      fontFamily: fontFamily.medium,
      marginHorizontal: moderateScale(10),
    },
    showFriendListModalHeaderContainer: {
      marginHorizontal: moderateScale(7),
      flexDirection: 'row',
      alignItems: 'center',
    },

    forMeText: {
      color: colors.black,
      marginHorizontal: moderateScale(10),
      fontSize: textScale(14),
    },
    lineViewStyle: {
      borderWidth: 0.5,
      height: 1,
      borderColor: colors.blackOpacity10,
      marginBottom: moderateScaleVertical(20),
      marginVertical: moderateScaleVertical(14),
    },
    friendListStyle: {
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(18),
    },
    friendListFooter: {
      marginHorizontal: moderateScale(7),
      marginBottom: moderateScaleVertical(13),
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: moderateScaleVertical(5),
    },
    addFriendText: {
      color: themeColors?.primary_color,
      marginHorizontal: moderateScale(10),
      fontSize: textScale(14),
    },
    addAddressScreenTitle: {
      fontSize: textScale(16),
      fontFamily: fontFamily.medium,
      marginHorizontal: moderateScale(10),
    },
    textInput: {
      backgroundColor:colors.greyNew,
      borderWidth:0,
      color: colors.black,
      height: moderateScaleVertical(34),
      paddingHorizontal: moderateScale(12),
      fontSize: 14,
      marginBottom: 0,
      marginTop: 4,
   
    },
  });
  return styles;
};
