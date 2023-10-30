import React, { useEffect, useRef } from 'react';
import {
  I18nManager,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { hitSlopProp } from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../styles/theme';
// import styles from '../Screens/Tracking/styles';

const BorderTextInputWithLable = ({
  label,
  labelStyle,
  lableViewStyle,
  containerStyle,
  textInputStyle,
  leftIcon,
  color = colors.textGreyOpcaity7,
  rightIcon,
  onChangeText,
  value,
  placeholder,
  marginBottom = 20,
  onPressRight = () => { },
  withRef = false,
  secureTextEntry = false,
  disabled = true,
  textViewOnly = false,
  tintColor,
  subLabel = null,
  sublabelStyle,
  mainStyle,
  onPress = () => { },
  borderWidth = 1,
  marginBottomTxt = 10,
  ...props
}) => {
  const inputRef = useRef();
  const { appStyle } = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const theme = useSelector((state) => state?.initBoot?.themeColor);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const styles = stylesData({ fontFamily });

  useEffect(() => {
    if (withRef && Platform.OS === 'android') {
      if (inputRef.current) {
        inputRef.current.setNativeProps({
          style: { fontFamily: fontFamily.regular },
        });
      }
    }
  }, [secureTextEntry]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      disabled={disabled}
      onPress={onPress}
      style={mainStyle}>
      {!!label && (
        <View
          style={{
            marginBottom: marginBottomTxt,
            flexDirection: 'row',
            ...lableViewStyle,
          }}>
          <Text
            style={
              isDarkMode
                ? [
                  styles.labelStyle,
                  labelStyle,
                  { color: MyDarkTheme.colors.text },
                ]
                : [styles.labelStyle, labelStyle]
            }>
            {label}
          </Text>
          {subLabel && (
            <Text style={[styles.sublabelStyle, sublabelStyle]}>
              {subLabel}
            </Text>
          )}
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          height: moderateScaleVertical(49),
          color: colors.white,
          borderWidth: borderWidth,
          borderRadius: 13,
          borderColor: colors.borderLight,
          marginBottom,
          ...containerStyle,
          borderBottomColor: isDarkMode
            ? MyDarkTheme.colors.text
            : colors.lightGreyBorder,
        }}>
        {leftIcon && (
          <View style={{ justifyContent: 'center', marginLeft: 10 }}>
            <Image source={leftIcon} />
          </View>
        )}
        {textViewOnly ? (
          <Text
            style={{
              flex: 1,
              opacity: 0.7,
              color,
              fontFamily: fontFamily.medium,
              fontSize: textScale(14),
              paddingVertical: moderateScaleVertical(49 / 4),
              paddingHorizontal: moderateScaleVertical(49 / 4),
              ...textInputStyle,
            }}>
            {value}
          </Text>
        ) : (
          <TextInput
            selectionColor={isDarkMode ? MyDarkTheme.colors.text : colors.black}
            placeholder={placeholder}
            placeholderTextColor={isDarkMode ? MyDarkTheme.colors.text : color}
            style={{
              flex: 1,
              opacity: 0.7,
              color: isDarkMode ? MyDarkTheme.colors.text : color,
              fontFamily: fontFamily.medium,
              fontSize: textScale(14),
              paddingHorizontal: 10,
              paddingTop: 0,
              paddingBottom: 0,
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              ...textInputStyle,
            }}
            ref={inputRef}
            blurOnSubmit
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={secureTextEntry}
            {...props}
          />
        )}

        {rightIcon && (
          <TouchableOpacity
            style={{ justifyContent: 'center', marginRight: 10 }}
            hitSlop={hitSlopProp}
            onPress={onPressRight}>
            <Image
              style={{ tintColor: tintColor ? tintColor : colors.white }}
              source={rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export function stylesData({ fontFamily }) {
  const styles = StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
      borderBottomColor: colors.lightGreyBorder,
      borderBottomWidth: 0.7,
    },
    userProfileView: {
      alignSelf: 'center',
      borderColor: colors.white,
      marginTop: moderateScale(30),
    },
    cameraView: {
      position: 'absolute',
      right: -20,
    },
    userName: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
    },
    userEmail: {
      marginTop: moderateScaleVertical(5),
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      opacity: 0.5,
    },
    borderRoundBotton: {
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      height: moderateScaleVertical(30),
    },
    topSection: {},
    bottomSection: {
      marginVertical: moderateScaleVertical(40),
      marginHorizontal: moderateScaleVertical(20),
    },

    address: {
      fontSize: textScale(14),
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      opacity: 0.7,
    },
    textStyle: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      // opacity: 0.6,
    },
    labelStyle: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    sublabelStyle: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
  });
  return styles;
}
export default React.memo(BorderTextInputWithLable);
