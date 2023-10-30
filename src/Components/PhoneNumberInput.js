import React, {useState} from 'react';
import {
  I18nManager,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import CountryPicker, {Flag} from 'react-native-country-picker-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {moderateScale, textScale, width} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import {getBundleId} from 'react-native-device-info';
import {appIds} from '../utils/constants/DynamicAppKeys';

const PhoneNumberInput = ({
  cca2 = '',
  callingCode = '',
  onChangePhone,
  onCountryChange,
  phoneNumber,
  placeholder,
  containerStyle,
  color,
  autoFocus = false,
  showCountryCode = true,
  TxtInputStyle,
  flagSize,
  downArrowStyle,
  require= false,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    countryPickerModalVisible: false,
  });

  const {appStyle} = useSelector((state) => state?.initBoot || {});

  const fontFamily = appStyle?.fontSizeData;

  const _onCountryChange = (data) => {
    setState({countryPickerModalVisible: false});
    onCountryChange(data);
  };
  const _openCountryPicker = () => {
    if (getBundleId() !== appIds.baytukom) {
      setState({countryPickerModalVisible: true});
    }
  };
  const _onCountryPickerModalClose = () => {
    setState({countryPickerModalVisible: false});
  };
  const {countryPickerModalVisible} = state;
  return (
    <View
      style={{
        flexDirection: 'row',
        // borderWidth: 1,
        borderRadius: 12,
        borderColor: isDarkMode ? MyDarkTheme.colors.text : colors.borderLight,
        height: moderateScale(49),
        ...containerStyle,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: moderateScale(88),
        }}
        onPress={_openCountryPicker}>
        {showCountryCode && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
               <Text style={{ color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyOpcaity7}}>+ </Text>
            <Text
              style={{
                fontFamily: fontFamily.medium,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyOpcaity7,
              }}>
              {callingCode}
            </Text>
          </View>
        )}

        <View style={{marginRight: moderateScale(-10)}}>
          <Flag countryCode={cca2} flagSize={flagSize} />
        </View>

        <Image
          source={imagePath.dropdownTriangle}
          style={{
            ...downArrowStyle,
            tintColor: isDarkMode
            ? MyDarkTheme.colors.text
            : colors.black,
          }}
        />
      </TouchableOpacity>
      <TextInput
        selectionColor={colors.black}
        placeholder={placeholder.concat(!!require?'*':'')}
        keyboardType="numeric"
        value={phoneNumber}
        placeholderTextColor={
          isDarkMode ? MyDarkTheme.colors.text : colors.textGreyOpcaity7
        }
        onChangeText={onChangePhone}
        style={{
          // flex: 1,
          width: width / 1.57,
          borderLeftWidth: 1,
          // fontFamily: fontFamily.medium,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
          fontSize: textScale(14),
          borderLeftColor: colors.borderLight,
          opacity: 0.7,
          paddingTop: 0,
          paddingBottom: 0,
          marginVertical: 8,
          paddingHorizontal: 10,
          textAlign: I18nManager.isRTL ? 'right' : 'left',
          ...TxtInputStyle,
        }}
        autoFocus={autoFocus}
      />
      {countryPickerModalVisible && (
        <CountryPicker
          withCallingCode={true}
          // cca2={cca2}
          visible={countryPickerModalVisible}
          withFlagButton={false}
          withFilter
          countryCode={callingCode}
          onClose={_onCountryPickerModalClose}
          onSelect={_onCountryChange}
          closeButtonImage={imagePath.closeButton}
        />
      )}
    </View>
  );
};
export default React.memo(PhoneNumberInput);
