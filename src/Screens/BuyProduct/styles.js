import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({fontFamily, themeColors}) => {
  const styles = StyleSheet.create({
    productInfo: {
      fontSize: textScale(15),
      color: colors.textGreyB,
      fontFamily: fontFamily.medium,
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
    },
    packingBoxStyle: {
      width: width - 45,
      height: moderateScaleVertical(49),
      borderRadius: moderateScaleVertical(13),
      borderWidth: 1,
      justifyContent: 'center',
      padding: 5,
      marginVertical: 5,
    },
    boxTitle: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    boxTitle2: {
      color: colors.textGreyC,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      marginTop: moderateScaleVertical(5),
    },
    addAnotherPackage: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    labelStyle: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    sublabelStyle: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
    },
    dimensions_view: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    length_width_view: {
      flex: 0.3,
      alignItems: 'center',
      borderRightWidth: 1,
      borderRightColor: colors.borderColorGrey,
    },
    height_view: {flex: 0.3, alignItems: 'center'},
    add_another_package: {
      flexDirection: 'row',
      marginVertical: moderateScaleVertical(20),
    },
  });
  return styles;
};
