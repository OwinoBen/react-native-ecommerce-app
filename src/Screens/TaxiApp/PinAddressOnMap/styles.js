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
    backbutton: {
      position: 'absolute',
      left: 0,
      marginHorizontal: moderateScale(30),
      marginVertical: moderateScaleVertical(50),
    },
  });
  return styles;
};
