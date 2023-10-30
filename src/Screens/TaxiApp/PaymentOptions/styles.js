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
    containerStyle: {
      flex: 1,
    },
    renderItemStyle: {
      borderBottomWidth: 1,
      borderColor: colors.borderColorB,

      marginHorizontal: moderateScale(3),
      paddingVertical: moderateScaleVertical(10),
    },
    textStyle: {
      alignSelf: 'center',
      marginStart: moderateScale(12),
      fontFamily: fontFamily.reguler,
    },
    imageStyle: {
      alignSelf: 'center',
    },
  });
  return styles;
};
