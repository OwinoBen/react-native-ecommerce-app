import React, {Component} from 'react';
import Modal from 'react-native-modal';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import imagePath from '../constants/imagePath';
import {useSelector} from 'react-redux';
import ButtonWithLoader from './ButtonWithLoader';
import strings from '../constants/lang';
import {UIActivityIndicator} from 'react-native-indicators';

import BannerLoader from './Loaders/BannerLoader';
import HeaderLoader from './Loaders/HeaderLoader';
import CardLoader from './Loaders/CardLoader';

const RepeatModal = ({
  data = {},
  modalHide = () => {},
  onRepeat = () => {},
  onAddNew = () => {},
  isAddonLoading = false,
}) => {
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const userData = useSelector((state) => state?.auth?.userData);
  const fontFamily = appStyle?.fontSizeData;
  console.log('RepeatModal data', data);
  return (
    <Modal
      isVisible={!!data ? true : false}
      animationIn="slideInUp"
      style={{
        margin: 0,
        justifyContent: 'flex-end',
      }}
      onBackdropPress={modalHide}>
      <View
        style={{
          backgroundColor: 'white',
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12,
          padding: moderateScale(12),
          height: moderateScale(130),
        }}>
        <View>
          <Text
            style={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
            }}>
            {strings.REPEAT_LAST_CUSTOMIZATION}
          </Text>

          <Text
            style={{
              fontSize: textScale(14),
              fontFamily: fontFamily.regular,
              // marginLeft: moderateScale(8)
            }}>
            {data?.translation_title}
          </Text>

          {!isAddonLoading ? (
            <View style={{flexDirection: 'row', marginBottom: 16}}>
              <ButtonWithLoader
                btnText={strings.ADD_NEW}
                btnTextStyle={{
                  color: 'blue',
                  textTransform: 'none',
                  fontFamily: fontFamily.regular,
                }}
                btnStyle={{
                  flex: 1,
                  borderColor: 'blue',
                  borderRadius: moderateScale(6),
                  borderWidth: 0.5,
                }}
                onPress={onAddNew}
              />
              <View style={{marginHorizontal: moderateScale(6)}} />
              <ButtonWithLoader
                btnText={strings.REPEAT_LAST}
                btnTextStyle={{
                  color: 'red',
                  textTransform: 'none',
                  fontFamily: fontFamily.regular,
                }}
                onPress={onRepeat}
                btnStyle={{
                  flex: 1,
                  borderColor: 'red',
                  borderRadius: moderateScale(6),
                  borderWidth: 0.5,
                }}
              />
            </View>
          ) : (
            <View style={{flexDirection: 'row', marginTop: 16}}>
              <View style={{flex: 1}}>
                <CardLoader height={moderateScale(46)} />
              </View>
              <View style={{marginHorizontal: moderateScale(6)}} />
              <View style={{flex: 1}}>
                <CardLoader height={moderateScale(46)} />
              </View>
              {/* <UIActivityIndicator size={36} color={themeColors.primary_color} /> */}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default React.memo(RepeatModal);
