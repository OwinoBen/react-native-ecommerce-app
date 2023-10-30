import {I18nManager, StyleSheet} from 'react-native';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import {useSelector} from 'react-redux';

export default ({fontFamily}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const styles = StyleSheet.create({
    containerStyle: {
      borderRadius: 8,
      height: moderateScaleVertical(44),
      marginBottom: moderateScaleVertical(14),
    },

    imageView: {
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      height: height / 6,
      marginHorizontal: moderateScale(12),

      borderColor: isDarkMode ? MyDarkTheme.colors.text : colors.borderLight,
    },

    detailStyle: {
      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      fontSize: textScale(18),
      fontFamily: fontFamily.medium,
      // alignSelf:  I18nManager.isRTL ?  'flex-end': 'flex-start',
      // textAlign: I18nManager.isRTL ? 'left' : 'right',
     
    },
    uploadText: {
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: moderateScaleVertical(12),
      fontFamily: fontFamily.medium,
      color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyOpcaity7,
    },

    mainView: {
      marginVertical: moderateScaleVertical(15),
      marginHorizontal: moderateScale(20),
    },
    labelTxt: {
      color: colors.blackOpacity43,
      fontFamily: fontFamily.medium,
      fontSize: textScale(13),
      marginBottom: moderateScale(5),
    },
  });
  return styles;
};
