import {StyleSheet} from 'react-native';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    userAccountImageStyle: {
      position: 'absolute',
      right: 0,
      marginHorizontal: moderateScale(30),
      marginVertical: moderateScaleVertical(50),
    },
    backbutton: {
      position: 'absolute',
      left: 0,
      marginHorizontal: moderateScale(30),
      marginVertical: moderateScaleVertical(50),
    },
    dots: {
      width: 2,
      height: 5,
      backgroundColor: colors.black,
      borderRadius: 50,
      marginVertical: 2,
      // marginLeft: 4,
    },
    absolute: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      height: height / 2,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: moderateScaleVertical(15),
      borderTopStartRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: colors.white,
    },
  });
  return styles;
};
