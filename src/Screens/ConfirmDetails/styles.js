import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    scrollviewHorizontal: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.borderLight,
    },
    headerText: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScale(20),
      alignSelf: 'center',
    },

    price: {
      // color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    priceItemLabel: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
    dropOff: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      marginTop: moderateScaleVertical(38),
    },
    dots: {
      width: 4,
      height: 4,
      backgroundColor: 'grey',
      borderRadius: 50,
      marginVertical: 3,
      marginLeft: 4,
    },
    priceItemLabel2: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    confirmDetailsText: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
    },
    desh: {
      width: 20,
      height: 2,
      backgroundColor: 'black',
      marginVertical: moderateScaleVertical(7),
      marginHorizontal: moderateScaleVertical(10),
    },
    dimentionView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(20),
    },
    weightView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(10),
    },
    pickupFromText: {
      marginTop: moderateScaleVertical(8),
      fontFamily: fontFamily.regular,
      fontSize: moderateScaleVertical(14),
    },
    packageDesc: {
      fontFamily: fontFamily.futura,
      fontSize: moderateScale(16),
      marginBottom: moderateScaleVertical(10),
    },
    packageDescText: {
      fontFamily: fontFamily.regular,
      fontSize: moderateScaleVertical(14),
      lineHeight: moderateScaleVertical(25),
      color: colors.textGreyB,
    },
    pickup_drop_view: {
      flexDirection: 'row',
      marginVertical: moderateScaleVertical(50),
    },
  });
  return styles;
};
