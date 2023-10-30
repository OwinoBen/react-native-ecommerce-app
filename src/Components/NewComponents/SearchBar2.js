import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import colors from '../../styles/colors';
import {useDarkMode} from 'react-native-dynamic';
const SearchBar2 = ({
  navigation,
  placeHolderTxt = strings.SEARCH_HERE,
  containerStyle,
  modalPress,
  mainContainer = {},
}) => {
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  return (
    <View style={{...styles.mainContainer, ...mainContainer}}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          ...styles.btn,
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
      {modalPress && (
        <TouchableOpacity
          onPress={modalPress}
          activeOpacity={0.7}
          style={styles.filterStyle}>
          <Image source={imagePath.filter1} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.grey2,
      borderRadius: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      marginHorizontal: moderateScale(15),
      marginBottom: moderateScale(13),
      paddingVertical: moderateScaleVertical(15),
      flex: 0.95,
    },
    placeHolderTxt: {
      fontFamily: fontFamily.regular,
      color: colors.textGreyB,
      textAlign: 'left',
      fontSize: 16,
    },
    filterStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: moderateScale(10),
    },
  });
  return styles;
}
export default React.memo(SearchBar2);
