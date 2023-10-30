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

export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    titleAbout: {
      ...commonStyles.futuraBtHeavyFont14,
      color: colors.textGrey,
      textAlign: 'justify',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    backButtonView: {
      height: moderateScale(40),
      width: moderateScale(40),
      borderRadius: moderateScale(16),
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchbar: {
      height: moderateScale(40),
      width: moderateScale(width / 3),
      borderRadius: moderateScale(16),
      backgroundColor: colors.white,
      alignItems: 'center',
      // justifyContent: 'center',
      flexDirection: 'row',
    },
    topView: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 10,
      flexDirection: 'row',
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScaleVertical(20),
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    bottomView: {
      backgroundColor: colors.white,
      borderRadius: moderateScale(25),
      // overflow: 'hidden',
      height: height / 4.5,
      // maxHeight: height / 2,
      borderBottomEndRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomWidth: 0,
      width: width,
    },

    addressMainTitle: {
      fontSize: textScale(16),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
    },
    addressMain: {
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
  });
  return styles;
};
