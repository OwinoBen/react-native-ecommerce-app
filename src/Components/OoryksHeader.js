import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import ButtonImage from './ImageComp';
const OoryksHeader = ({
  leftIcon = imagePath.ic_backarrow,
  headerContainerStyle = {},
  leftIconStyle = {},
  leftTitle = "Header",
  onPressLeft = () => { },
  rightIcon = imagePath.icSearchNew,
  isRight = false,
  onPressRight = () => { },
  titleStyle = {},
  isCustomLeftPress = false
}) => {
  const { appStyle, themeToggle, themeColor } = useSelector((state) => state?.initBoot || {});
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });
  const navigation = useNavigation();
  return (
    <View style={{ ...styles.headerContainerStyle, ...headerContainerStyle }}>
      <View style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
        <ButtonImage onPress={isCustomLeftPress ? onPressLeft : () => navigation.goBack()} image={leftIcon} btnStyle={{
          ...styles.leftIcon, backgroundColor: colors.white,
          ...leftIconStyle
        }} />
        <Text style={{ ...styles.titleStyle, color: isDarkMode ? MyDarkTheme.colors.text : colors.black, ...titleStyle }}>{leftTitle}</Text>
      </View>
      {isRight ? <View >
        <ButtonImage image={rightIcon} onPress={onPressRight} />
      </View>
        : <React.Fragment />}
    </View>
  );
};

export function stylesFunc({ fontFamily }) {
  const styles = StyleSheet.create({
    leftIcon: {
      height: moderateScale(36),
      width: moderateScale(36),
      borderRadius: moderateScale(4),
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,

      alignItems: "center",
      justifyContent: "center"
    },
    headerContainerStyle: {
      paddingVertical: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(16),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    titleStyle: {
      fontFamily: fontFamily?.regular,
      fontSize: textScale(16),
      color: colors.black,
      marginLeft: moderateScale(16)
    }
  });
  return styles;
}
export default React.memo(OoryksHeader);
