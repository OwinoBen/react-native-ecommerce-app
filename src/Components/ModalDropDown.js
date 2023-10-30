import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import {moderateScale, textScale} from '../styles/responsiveSize';
import fontFamily from '../styles/fontFamily';

export default function ModalDropDown({
  options = [],
  defaultValue = '',
  _onSelect = () => {},
  _renderButtonText = () => {},
  _renderRow = () => {},
  _renderRightComponent = () => {},
  dropdownStyle = {},
  dropdownTextStyle = {},
  modalMainStyle = {},
  modalTextStyle,
}) {
  return (
    <ModalDropdown
      options={options}
      style={{
        alignSelf: 'center',
        width: moderateScale(65),
        ...modalMainStyle,
      }}
      textStyle={{
        fontFamily: fontFamily.regular,
        fontSize: textScale(12),
        ...modalTextStyle,
      }}
      defaultValue={defaultValue}
      onSelect={_onSelect}
      renderButtonText={_renderButtonText}
      renderRow={_renderRow}
      dropdownStyle={{
        width: moderateScale(100),
        marginTop: moderateScale(10),
        ...dropdownStyle,
      }}
      dropdownTextStyle={{
        fontSize: textScale(12),
        fontFamily: fontFamily.regular,
        ...dropdownTextStyle,
      }}
      renderRightComponent={_renderRightComponent}
    />
  );
}

const styles = StyleSheet.create({});
