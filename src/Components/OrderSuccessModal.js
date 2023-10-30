import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import {moderateScale, textScale} from '../styles/responsiveSize';
import strings from '../constants/lang';
import {colors} from 'react-native-elements';

const OrderSuccessModal = ({isVisible = true}) => {
  const {themeColors, appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle;

  return (
    <Modal
      isVisible={isVisible}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          height: '90%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: themeColors.primary_color,
        }}>
        <Image
          source={imagePath.ordersucess}
          style={{
            height: moderateScale(250),
            width: moderateScale(250),
            resizeMode: 'contain',
          }}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 35,
            bottom: 0,
            right: 25,
          }}>
          <Image source={imagePath.icCross1} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.white,
            fontFamily: fontFamily.medium,
            fontSize: textScale(20),
          }}>
          {strings.ORDER_DELIVERED_SUCESSFULLY}
        </Text>
      </View>
    </Modal>
  );
};

export default OrderSuccessModal;

const styles = StyleSheet.create({});
