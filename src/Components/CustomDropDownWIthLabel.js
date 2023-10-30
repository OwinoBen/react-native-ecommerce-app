import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';

export default function CustomDropDownWIthLabel({
  label = '',
  onPicker = () => {},
  placeHolderText = '',
  renderCustomView,
  customPlaceHolderStyle = {},
  isDropDown = false,
  isRenderCustomView = false,
  dropDownMainView = {},
  placeHolderTxtStyle = {},
  dropDownContainer = {},
}) {
  return (
    <View style={{...dropDownMainView}}>
      {!!label && (
        <Text
          style={{
            ...styles.labelTxt,
            marginTop: moderateScale(5),
            marginBottom: moderateScaleVertical(10),
          }}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={{...styles.placeHolderStyle, ...customPlaceHolderStyle}}
        activeOpacity={0.7}
        onPress={onPicker}>
        <Text
          style={{
            ...styles.labelTxt,
            marginBottom: 0,
            ...placeHolderTxtStyle,
          }}>
          {placeHolderText}
        </Text>
        <Image source={imagePath.icDropdown} />
      </TouchableOpacity>

      {isDropDown && (
        <View style={{...styles.dropDownContainer, height: 100}}>
          <ScrollView
            style={
              {
                // position: 'absolute',
                // right: 0,
                // borderWidth: 1,
                // borderColor: colors.borderColorB,
                // backgroundColor: colors.white,
                // width: 100,
                // paddingHorizontal: moderateScale(10),
                // paddingVertical: moderateScale(5),
                // // minHeight: moderateScale(50),
                // borderRadius: moderateScale(5),
                // maxHeight: moderateScale(100),
                // zIndex: 5,
              }
            }>
            {isRenderCustomView > 0 ? (
              renderCustomView()
            ) : (
              <View
                style={{
                  ...styles.noDataFound,
                  backgroundColor: colors.white,
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.medium,
                    fontSize: moderateScale(13),
                  }}>
                  {strings.NODATAFOUND}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  labelTxt: {
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
    color: colors.lightGreyBg2,
  },
  noDataFound: {
    width: '100%',
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeHolderStyle: {
    borderRadius: 8,
    height: moderateScaleVertical(44),
    paddingHorizontal: moderateScale(5),
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropDownContainer: {
    flex: 1,
    position: 'absolute',
    // bottom: -40,
  },
});
