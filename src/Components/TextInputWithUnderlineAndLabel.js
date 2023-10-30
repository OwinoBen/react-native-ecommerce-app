import React, {useEffect, useRef} from 'react';
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
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {hitSlopProp} from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import imagePath from '../constants/imagePath';

// import styles from '../Screens/Tracking/styles';

const TextInputWithUnderlineAndLabel = ({
  label,
  labelStyle,
  lableViewStyle,
  containerStyle,
  txtInputStyle,
  leftIcon,
  color = colors.textGreyOpcaity7,
  rightIcon,
  onChangeText,
  value,
  placeholder,
  marginBottom = 20,
  onPressRight = () => {},
  withRef = false,
  secureTextEntry = false,
  disabled = true,
  textViewOnly = false,
  tintColor,
  subLabel = null,
  sublabelStyle,
  mainStyle,
  onPress = () => {},
  isLableIcon = true,
  labelIconPath = '',
  labelIconStyle = {},
  onPressLabel = () => {},
  underlineColor = colors.textGreyB,
  placeholderTextColor = colors.textGreyB,
  onRightPress = () => {},
  isEditable = true,
  keyboardType = '',
  defaultValue = '',
  autoFocus = false,
  ...props
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const inputRef = useRef();
  const {appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesData({fontFamily});

  useEffect(() => {
    if (withRef && Platform.OS === 'android') {
      if (inputRef.current) {
        inputRef.current.setNativeProps({
          style: {fontFamily: fontFamily.regular},
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
      <View style={{flexDirection: 'row', ...lableViewStyle}}>
        <Text
          numberOfLines={1}
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB,
            // backgroundColor: 'red',
            flex: 1,
            textAlign:'left',
            ...labelStyle,
          }}>
          {label}
        </Text>
        {isLableIcon && (
          <TouchableOpacity activeOpacity={0.8} onPress={onPressLabel}>
            <Image source={labelIconPath} style={labelIconStyle} />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          minHeight: moderateScaleVertical(30),
          color: colors.white,
          marginBottom,
           borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: underlineColor,
          paddingBottom: 11,
          alignItems: 'center',
          ...containerStyle,
        }}>
        {/* <TextInput
          selectionColor={colors.black}
          placeholder={placeholder}
          placeholderTextColor={color}
          ref={inputRef}
          blurOnSubmit
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={secureTextEntry}
          {...props}
          style={{
            fontSize: textScale(14),
            width: '100%',
            ...txtInputStyle,

            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}
        /> */}
        <TextInput
          autoFocus={autoFocus || false}
          selectionColor={isDarkMode ? MyDarkTheme.colors.text : colors.black}
          placeholder={placeholder}
          placeholderTextColor={
            isDarkMode ? MyDarkTheme.colors.text : placeholderTextColor
          }
          style={{
            flex: 1,
            opacity: 0.7,
            color: isDarkMode
              ? MyDarkTheme.colors.text
              : colors.textGreyOpcaity7,
            fontFamily: fontFamily.medium,
            fontSize: textScale(14),
            paddingHorizontal: 8,
            paddingTop: 0,
            paddingBottom: 0,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            ...txtInputStyle,
          }}
          ref={inputRef}
          // numberOfLines
          blurOnSubmit
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={'none'}
          editable={isEditable}
          defaultValue={defaultValue}
          {...props}
        />
        {!!rightIcon && (
          <TouchableOpacity hitSlop={hitSlopProp} onPress={onRightPress}>
            <Image source={rightIcon} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export function stylesData({fontFamily}) {
  const styles = StyleSheet.create({
    containerStyle: {
      paddingVertical: 0,
      height: moderateScaleVertical(58),
      alignItems: 'center',
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
      textAlign:'left'
    },
    sublabelStyle: {
      color: colors.textGreyB,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
    },
  });
  return styles;
}
export default React.memo(TextInputWithUnderlineAndLabel);
