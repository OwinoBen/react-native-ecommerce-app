import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const styles = StyleSheet.create({
    subscriptionTitle: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(16),
      color: colors.blackC,
      opacity: 0.5,
    },
    subscription2:{
        fontFamily: fontFamily.bold,
        fontSize: moderateScale(16),
        color: colors.blackC,
        // opacity: 0.5,
    },
    title: {
        color: colors.black,
        fontFamily: fontFamily.medium,
        fontSize: textScale(12),
      },
      title2: {
        color: colors.black,
        fontFamily: fontFamily.medium,
        fontSize: textScale(12),
        opacity:0.5
      },
  });
  return styles;
};
