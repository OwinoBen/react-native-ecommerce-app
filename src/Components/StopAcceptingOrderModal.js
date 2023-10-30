import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import { moderateScale, moderateScaleVertical, textScale} from '../styles/responsiveSize';
import strings from '../constants/lang';
import LottieView from 'lottie-react-native';
import GradientButton from './GradientButton';
import colors from '../styles/colors';
import { noOrderAccept, speed } from './Loaders/AnimatedLoaderFiles';


const StopAcceptingOrderModal = ({
  isVisible = true,
  onClose = () => {},
  
}) => {
  const {themeColors, appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  return (
    <Modal
      isVisible={isVisible}
      style={{
        flex: 1,
      }}>
      <View
        style={{
          height: '35%',
          justifyContent: 'center',
          backgroundColor: colors.white,
          width: '80%',
          alignSelf: 'center',
          borderRadius:moderateScale(12)
        
        }}>
           <LottieView
        source={noOrderAccept}
        autoPlay
        loop
        style={{
         alignSelf:'center',
          height: moderateScaleVertical(140),
          width: moderateScale(140),
        }}
      />
          <Text 
           style={{
            fontFamily:fontFamily.bold,
            fontSize:textScale(14),
            alignSelf:'center',
            textAlign:'center',
            color: colors.textGreyB,
            marginHorizontal:moderateScale(8)
           }}
          >
           There is an extremely high demand right now. Please return later!
          </Text>
          <GradientButton
          containerStyle={{
            marginTop: moderateScaleVertical(20),
            height: moderateScale(40),
            marginHorizontal:moderateScale(16)
          }}
          onPress={onClose}
          borderRadius={moderateScale(15)}
          btnText={strings.OK}
        />
          <TouchableOpacity
          style={{
            position: 'absolute',
            top: 5,
            bottom: 0,
            right: 5,
          }}
          onPress={onClose}>
          <Image
            source={imagePath.cross}
            style={{tintColor: themeColors.primary_color,
            height:moderateScale(25),
            width:moderateScale(25)
            }}
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default StopAcceptingOrderModal;

const styles = StyleSheet.create({});
