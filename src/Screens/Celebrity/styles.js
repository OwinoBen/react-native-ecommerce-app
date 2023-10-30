import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    scrollviewHorizontal: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.lightGreyBorder,
    },
    scrollviewHorizontal2: {
      borderBottomWidth: 1,
      height: moderateScaleVertical(50),
      flex: undefined,
      borderColor: colors.lightGreyBorder,
      marginHorizontal: moderateScale(16),
    },
    headerText: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScaleVertical(25),
      color: colors.textGreyB,
      alignSelf: 'center',
    },
    headerText2: {
      ...commonStyles.mediumFont14,
      marginRight: moderateScaleVertical(25),
      color: colors.textGreyB,
      alignSelf: 'center',
      fontSize: moderateScale(14),
    },
    headerTextAll: {
      ...commonStyles.mediumFont14,
      color: colors.themeColor,
      alignSelf: 'center',
    },
  });
  return styles;
};
