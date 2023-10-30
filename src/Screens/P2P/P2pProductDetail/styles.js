import { StyleSheet } from 'react-native';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import { width, height } from '../../../styles/responsiveSize';

export default ({ themeColor, toggleTheme, fontFamily }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: !!themeColor ? colors.black : colors.whiteOpacity22,
    },
    btn: {
      width: 100,
      height: moderateScale(30),
      borderRadius: 6,
    },
    view: {
      backgroundColor: colors.white,
      paddingHorizontal: moderateScale(18),
      paddingVertical: moderateScale(6),
      paddingBottom: moderateScale(10),
      backgroundColor: !!themeColor ? colors.blackOpacity10 : colors.white,
    },
    view1: {
      backgroundColor: !!themeColor ? colors.blackOpacity10 : colors.white,
      paddingHorizontal: moderateScale(18),
      paddingVertical: moderateScale(18),
      marginVertical: moderateScale(12),
    },
    view2: {
      flexDirection: 'row',
      marginVertical: moderateScaleVertical(18),
      alignItems: 'center',
      backgroundColor: !!themeColor ? colors.blackOpacity10 : colors.white,
    },
    txt1: {
      color: !!themeColor ? colors.white : colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(18),
      letterSpacing: 0.5,
    },
    txt2: {
      color: !!themeColor ? colors.white : colors.blackOpacity70,
      fontFamily: fontFamily.regular,
      marginVertical: moderateScale(2),
      fontSize: textScale(12),
    },
    btn1: {
      width: width / 2.5,
      height: moderateScale(48),
      borderRadius: moderateScale(12),
      backgroundColor: colors.white,
      borderWidth: 1,
    },
    btn2: {
      width: width / 2.5,
      height: moderateScale(48),
      borderRadius: 12,
    },
    view3: {
      flexDirection: 'row',
      marginBottom: 18,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    chatBtn: {
      fontFamily: fontFamily.regular,
      marginLeft: moderateScale(8),
    },
    imageContainer: {
      // flex: 1,
      // marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
      backgroundColor: 'white',
      borderRadius: 8,
    },
    item: {
      width: width,
      height: height / 3,
      flex: 1,
      backgroundColor: 'white',
    },
    pagination: {
      // backgroundColor: colors.white,
      flexDirection: 'row',
      position: 'relative',
      bottom: 18,
      justifyContent: 'center',
    },
    dotStyle: {
      backgroundColor: colors.blackOpacity43,
      height: 10,
      width: 8,
      borderRadius: 6,
      marginHorizontal: 8,
    },
    back: { position: 'absolute', left: 18, top: 38 },
    heart: { position: 'absolute', right: 18, top: 42 },
    leftRightBtn: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  // export default styles;
  return styles;
};
