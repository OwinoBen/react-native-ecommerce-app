import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {
  moderateScale,
  moderateScaleVertical,
  moderateVerticalScale,
  textScale,
} from '../styles/responsiveSize';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import {useSelector} from 'react-redux';

export default function GallaryCameraImgPicker({
  isVisible = false,
  onClose = () => {},
  onGallary = () => {},
  onCamera = () => {},
  onCancel = () => {},
  isVisbleCamera = true,
}) {
  const modalContent = () => {
    const {appData, currencies, languages, appStyle, themeColors} = useSelector(
      (state) => state?.initBoot,
    );
    const fontFamily = appStyle?.fontSizeData;
    return (
      <View style={styles.mainViewStyle}>
        {isVisbleCamera && (
          <TouchableOpacity
            onPress={onCamera}
            style={styles.cameraGallaryCancelBtn}>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: textScale(14),
              }}>
              Camera
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onGallary}
          style={styles.cameraGallaryCancelBtn}>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(14),
            }}>
            Gallary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          style={styles.cameraGallaryCancelBtn}>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(14),
              color: colors.redB,
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modalStyle}>
      {modalContent()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  cameraGallaryCancelBtn: {
    borderTopWidth: 1,
    borderTopColor: colors.grey1,
    alignItems: 'center',
    justifyContent: 'center',
    height: moderateScaleVertical(40),
  },
  mainViewStyle: {
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
    backgroundColor: colors.white,
  },
});
