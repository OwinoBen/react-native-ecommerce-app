import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity,} from 'react-native';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import {height, moderateScale, moderateScaleVertical, textScale} from '../styles/responsiveSize';
import strings from '../constants/lang';

import GradientButton from './GradientButton';
import colors from '../styles/colors';

const SubscriptionModal = ({
  isVisible = false,
  onClose = () => {},
  onPressSubscribe=()=>{},
 
 
}) => {
  const {themeColors, appStyle} = useSelector((state) => state?.initBoot || {});
  const fontFamily = appStyle?.fontSizeData;

  return (
    <Modal
      onBackdropPress={onClose}
      isVisible={isVisible}
      style={{
        flex:1
      }}
     >
      <View
        style={{
          height: '30%',
          justifyContent: 'center',
          backgroundColor: colors.white,
          width: '80%',
          alignSelf: 'center',
         
        }}>
        <Image
          source={imagePath.subscribe}
          style={{
            height: moderateScale(120),
            width: moderateScale(150),
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
        <Text
          style={{
            alignSelf: 'center',
            fontSize: textScale(14),
            fontFamily: fontFamily.bold,
            color: colors.redB,
            marginVertical:moderateScaleVertical(6)
          }}>
          For more offers!
        </Text>
        <TouchableOpacity
          style={{
            marginHorizontal: moderateScale(38),
            backgroundColor: themeColors.primary_color,
            borderRadius: moderateScale(6),
          }}
          onPress={onPressSubscribe}>
          <Text
            style={{
              padding: moderateScale(12),
              alignSelf: 'center',
              color: colors.white,
              fontSize: textScale(14),
              fontFamily: fontFamily.bold,
            }}>
            Subscribe Now
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
          }}
          onPress={onClose}>
          <Image
            source={imagePath.cross}
            style={{tintColor: themeColors.primary_color}}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default React.memo(SubscriptionModal);

const styles = StyleSheet.create({});
