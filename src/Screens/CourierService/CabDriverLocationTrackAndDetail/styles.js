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
   flex:1,
      justifyContent: 'flex-end',
      // alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      height:height/1.4
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
      // position: 'absolute',
      // left: 0,
      // right: 0,
      // bottom: 0,
      // top: height - height / 3,
      borderRadius: moderateScale(25),
      overflow: 'hidden',
      
      // paddingBottom: moderateScaleVertical(30),
      height: height / 2.3,
      // maxHeight: height / 2,
      width:width
    },
    bottomView3: {
      backgroundColor: colors.white,
      borderRadius: moderateScale(25),
      overflow: 'hidden',
      height: height / 2.5,
      maxHeight: height / 2.5,
      width:width
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
    chooseSuitable: {
      fontSize: textScale(18),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
    },
    carType: {
      fontSize: textScale(16),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
    },
    packageSize: {
      fontSize: textScale(12),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
    deliveryPrice: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
    },
    priceStyle:{
      fontSize: textScale(16),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
    distanceDurationDeliveryLable:{
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
    },
    distanceDurationDeliveryValue:{
      fontSize: textScale(14),
      color: colors.blackC,
      fontFamily: fontFamily.regular,
    },
    bottomAcceptanceText: {
      fontSize: textScale(12),
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      textAlign: 'center',
      // marginTop: moderateScaleVertical(5),
    },
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: moderateScaleVertical(height / 10),
      overflow: 'hidden',
      backgroundColor:'white'
    },
    lable1:{
      fontSize: textScale(18),
      color: colors.blackC,
      fontFamily: fontFamily.bold,
    },
    lable2:{
      fontSize: textScale(14),
      color: colors.textGreyJ,
      fontFamily: fontFamily.medium,
      // textAlign: 'center',
    }
  });
  return styles;
};
