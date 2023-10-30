import {StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';

export default ({fontFamily}) => {
  const commonStyles = commonStylesFunc({fontFamily});
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
    //   cart item design start from here

    requestSubmitText: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(18),
    },
    successfully: {
      flexDirection: 'row',
      fontFamily: fontFamily.bold,
      marginVertical: moderateScaleVertical(10),
      fontSize: textScale(22),
    },

    yourAWBText: {
      flexDirection: 'row',
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
    },
    doneIconView: {
      alignItems: 'center',
      marginTop: moderateScaleVertical(180),
    },
  });
  return styles;
};
