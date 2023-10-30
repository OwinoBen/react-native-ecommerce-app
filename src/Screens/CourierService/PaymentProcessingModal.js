import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import {moderateScale} from '../../styles/responsiveSize';
import stylesFun from '../CourierService/ChooseCarTypeAndTime/styles';

function PaymentProcessingModal({
  isModalVisible = false,
  updateModalState,
}) {
  const {themeColors, appStyle} = useSelector((state) => state?.initBoot || {});
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFun({fontFamily, themeColors});

  useEffect(() => {
    if (isModalVisible) {
      setTimeout(() => {
        updateModalState();
      }, 2000);
    }
  }, [isModalVisible]);

  return (
    <Modal
      transparent={true}
      isVisible={isModalVisible}
      animationType={'slide'}
      style={styles.modalContainer}
      >
      <View style={{flex: 1}}>
        <View style={{flex:0.5,justifyContent: 'flex-end', alignItems: 'center'}}>
          <Image source={imagePath.cabLarge}/>
        </View>
        <View style={{flex:0.5,justifyContent: 'flex-end', alignItems: 'center',marginBottom:20}}>
          <Text style={[styles.bottomAcceptanceText,{fontSize:moderateScale(14)}]}>
            {strings.PROCESSINGPAYMENT}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
export default React.memo(PaymentProcessingModal)