import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';

export default ({fontFamily, isDarkMode, MyDarkTheme}) => {
  const styles = StyleSheet.create({
    subscriptionTitle: {
      fontFamily: fontFamily.medium,
      fontSize: moderateScale(16),
      color: colors.blackC,
      opacity: 0.5,
      textAlign: 'left',
    },
    subscription2: {
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(16),
      color: colors.blackC,
      textAlign: 'left',
      // opacity: 0.5,
    },
    title: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      textAlign: 'left',
    },
    title2: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      opacity: 0.5,
      textAlign: 'left',
    },
    youareat: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      opacity: 0.8,
      textAlign: 'left',
    },
    currentLoyaltyColor: {
      color: isDarkMode ? MyDarkTheme.colors.text : colors.grayOpacity51,
      fontFamily: fontFamily.medium,
      fontSize: textScale(32),
      textAlign: 'left',
      // opacity: 0.9,
    },
    imageStyle: {
      height: height / 7,
      width: width / 2,
      borderRadius: 8,
      textAlign: 'left',
    },
    loyaltyPointsEarned: {
      color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(24),
      textAlign: 'left',
    },
    loyaltyPointsUsed: {
      color: isDarkMode ? MyDarkTheme.colors.text : colors.grayOpacity51,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      textAlign: 'left',
    },
    upcoming: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      opacity: 0.5,
      textAlign: 'left',
    },
    descriptionLoyalty: {
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      opacity: 0.8,
      textAlign: 'left',
    },
    commTextStyle: {
      color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      marginTop: moderateScaleVertical(8),
      textAlign: 'left',
    },
    rowStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
  return styles;
};
