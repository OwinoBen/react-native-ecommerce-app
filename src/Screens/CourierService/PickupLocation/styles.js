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

export default ({fontFamily, themeColors, type}) => {
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
      elevation: 7,
      zIndex: -1000,
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
      marginTop: moderateScaleVertical(40),
      marginHorizontal: moderateScale(0),
      width: width,
      alignSelf: 'center',
      // borderWidth:1,
      top: type == 'pickup' ? 140 : 80,
      height: height / 3,
    },

    textInput2: {
      height: moderateScaleVertical(30),
      borderRadius: 13,
      // backgroundColor: isFocus ? colors.white : colors.textGreyK,
      backgroundColor: colors.textGreyK,
    },
  });
  return styles;
};
