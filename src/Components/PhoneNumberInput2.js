import React, {useState} from 'react';
import {I18nManager, Image, TouchableOpacity, View, Text} from 'react-native';
import CountryPicker, {Flag} from 'react-native-country-picker-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {TextInput} from 'react-native-paper';
import { getBundleId } from 'react-native-device-info';
import { appIds } from '../utils/constants/DynamicAppKeys';

const PhoneNumberInput2 = ({
  cca2 = '',
  callingCode = '',
  onChangePhone,
  onCountryChange,
  phoneNumber,
  placeholder,
  textInputStyle = {},
  textInputStyle1 = {},
}) => {
  const {themeColors, appStyle} = useSelector((state) => state?.initBoot);
  const [state, setState] = useState({
    countryPickerModalVisible: false,
  });

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
        borderRadius: moderateScale(15),
        backgroundColor: colors.textGreyK,
        marginTop: moderateScale(20),
        overflow: 'hidden',
        alignItems: 'center',
        ...textInputStyle,
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: moderateScale(88),
          backgroundColor: colors.textGreyK,
          marginTop: moderateScaleVertical(8),
          ...textInputStyle,
        }}
        onPress={_openCountryPicker}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text>+</Text>
          <Text
            style={{
              fontFamily: fontFamily.medium,
              color: colors.textGreyOpcaity7,
            }}>
            {callingCode}
          </Text>
        </View>

        <View style={{marginRight: moderateScale(-10)}}>
          <Flag countryCode={cca2} />
        </View>
        <Image source={imagePath.dropdownTriangle} />
      </TouchableOpacity>

      <TextInput
        label={placeholder}
        underlineColor={colors.transparent}
        selectionColor={colors.black}
        onChangeText={onChangePhone}
        value={phoneNumber}
        theme={{colors: {primary: themeColors.primary_color}}}
        keyboardType="numeric"
        style={{
          width: '75%',
          backgroundColor: colors.textGreyK,
          ...textInputStyle1,
          ...textInputStyle,
        }}
      />

      {/* <TextInput
        selectionColor={colors.black}
        placeholder={placeholder}
        keyboardType="numeric"
        value={phoneNumber}
        placeholderTextColor={colors.textGreyOpcaity7}
        onChangeText={onChangePhone}
        style={{
          // flex: 1,
          width: width / 1.57,
          borderLeftWidth: 1,
          fontFamily: fontFamily.medium,
          color: colors.textGrey,
          fontSize: textScale(14),
          borderLeftColor: colors.borderLight,
          opacity: 0.7,
          paddingTop: 0,
          paddingBottom: 0,
          marginVertical: 8,
          paddingHorizontal: 10,
          textAlign: I18nManager.isRTL ? 'right' : 'left',
        }}
      /> */}
      {countryPickerModalVisible && (
        <CountryPicker
          cca2={cca2}
          withCallingCode={true}
          visible={countryPickerModalVisible}
          withFlagButton={false}
          withFilter
          countryCode={callingCode}
          onClose={_onCountryPickerModalClose}
          onSelect={_onCountryChange}
        />
      )}
    </View>
  );
};
export default React.memo(PhoneNumberInput2);
