import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import navigationStrings from '../navigation/navigationStrings';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import colors from '../styles/colors';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import SearchBar from 'react-native-elements/dist/searchbar/SearchBar-ios';

const SearchBar2 = ({
  navigation,
  placeHolderTxt = strings.SEARCH_HERE,
  containerStyle,
}) => {
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        ...styles.mainContainer,
        backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.greyNew,
        ...containerStyle,
      }}
      onPress={() =>
        navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
      }>
      <View style={{flex: 1}}>
        <Text style={styles.placeHolderTxt}>{placeHolderTxt}</Text>
      </View>
      <Image source={imagePath.search1} />
    </TouchableOpacity>
  );
};

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      backgroundColor: colors.grey2,
      borderRadius: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      marginHorizontal: moderateScale(15),
      marginBottom: moderateScale(13),
      paddingVertical: moderateScaleVertical(15),
    },
    placeHolderTxt: {
      fontFamily: fontFamily.regular,
      color: colors.textGreyB,
      textAlign: 'left',
    },
  });
  return styles;
}
export default React.memo(SearchBar2);
