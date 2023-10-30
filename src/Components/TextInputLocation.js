import React, {useEffect, useRef} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import commonStylesFun, {hitSlopProp} from '../styles/commonStyles';
import {moderateScaleVertical, textScale} from '../styles/responsiveSize';
const TextInputLocation = ({
  containerStyle,
  textInputStyle,
  leftIcon,
  color = colors.textGreyOpcaity7,
  rightIcon,
  onChangeText,
  value,
  placeholder,
  numberOfLines = 1,
  marginBottom = 20,
  onPressRight = () => {},
  withRef = false,
  secureTextEntry = false,
  isFocus = false,
  label = '',
  ...props
}) => {
  const inputRef = useRef();
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const currentTheme = useSelector((state) => state?.initBoot);
  const {themeColors, themeLayouts} = currentTheme;
  useEffect(() => {
    if (withRef && Platform.OS === 'android') {
      if (inputRef.current) {
        inputRef.current.setNativeProps({
          style: {fontFamily: fontFamily.regular},
        });
      }
    }
  }, [secureTextEntry]);
  const styles = stylesData({fontFamily, themeColors});

  return (
    <View
      style={{
        flexDirection: 'row',
        height: moderateScaleVertical(49),
        color: colors.white,
        borderWidth: isFocus ? 1.5 : 0,
        borderRadius: 13,
        borderColor: isFocus ? colors.blackC : colors.borderLight,
        marginBottom,
        backgroundColor: isFocus ? colors.white : colors.textGreyK,
        ...containerStyle,
      }}>
      {leftIcon && (
        <View style={{justifyContent: 'center', marginLeft: 10}}>
          <Image source={leftIcon} />
        </View>
      )}
      <View style={{flex: 1, justifyContent: 'center', flexWrap: 'wrap'}}>
        {/* {value != '' && <Text style={styles.floatLable}>{label}</Text>} */}
        <TextInput
          selectionColor={colors.black}
          placeholder={placeholder}
          placeholderTextColor={color}
          style={{
            // flex: 1,
            // backgroundColor:'green',
            // opacity: 0.7,

            color,
            fontFamily: fontFamily.regular,
            fontSize: textScale(12),
            paddingHorizontal: 10,
            paddingTop: 0,
            paddingBottom: 0,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            ...textInputStyle,
          }}
          ref={inputRef}
          numberOfLines={numberOfLines}
          blurOnSubmit
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={secureTextEntry}
          {...props}
        />
      </View>

      {rightIcon && (
        <TouchableOpacity
          style={{justifyContent: 'center', marginRight: 10}}
          hitSlop={hitSlopProp}
          onPress={onPressRight}>
          <Image style={{tintColor: colors.white}} source={rightIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export function stylesData({fontFamily, themeColors}) {
  const commonStyles = commonStylesFun({fontFamily});
  const styles = StyleSheet.create({
    floatLable: {
      color: colors.textGreyJ,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      paddingHorizontal: 10,
      paddingTop: 5,
      paddingBottom: 0,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
  });
  return styles;
}
export default React.memo(TextInputLocation);
