import {Platform, StyleSheet} from 'react-native';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {moderateScaleVertical} from '../../../styles/responsiveSize';

export default ({fontFamily, themeColors}) => {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      borderBottomColor: colors.lightGreyBorder,
      borderBottomWidth: 0.7,
      // flexDirection:'row'
    },
    containerStyle2: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      borderBottomColor: colors.transparent,
      borderBottomWidth: 0.7,
      // flexDirection:'row'
    },
    loginView: {
      marginTop: moderateScaleVertical(30),
      marginBottom:
        Platform.OS === 'ios'
          ? moderateScaleVertical(10)
          : moderateScaleVertical(100),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchAbleLoginVIew: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginLogoutText: {
      ...commonStyles.futuraHeavyBt,
      color: themeColors?.primary_color,
      marginRight: 8,
    },
  });
  return styles;
};
