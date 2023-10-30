import {StyleSheet} from 'react-native';
import commonStylesFun from '../../styles/commonStyles';
import {height, textScale} from '../../styles/responsiveSize';
export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      ...commonStyles.mediumFont16,
      fontSize: textScale(18),
    },
  });
  return styles;
};
