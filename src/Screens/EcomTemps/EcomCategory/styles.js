import { StyleSheet } from 'react-native';
import {
    moderateScale,
    moderateScaleVertical
} from '../../../styles/responsiveSize';

export default ({themeColors, fontFamily}) =>
  StyleSheet.create({
    loaderHeader: {
      marginTop: moderateScaleVertical(16),
      marginHorizontal: moderateScale(12),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: moderateScale(42),
    },
    hitSlopProp: {
      top: 50,
      right: 50,
      left: 50,
      bottom: 50,
    },
  });
