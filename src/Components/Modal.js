import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {height, moderateScaleVertical} from '../styles/responsiveSize';
import Header from './Header';

const ModalView = ({
  isVisible = false,
  onClose,
  modalStyle,
  transistionIn = 200,
  transistionOut = 200,
  leftIcon = imagePath.back,
  centerTitle,
  textStyle,
  horizontLine = true,
  rightIcon = '',
  onPressLeft,
  onPressRight,
  modalMainContent = () => {},
  modalBottomContent = () => {},
  mainViewStyle = {},
  topCustomComponent = () => {},
  rightIconStyle = {},
  hasBackdrop=true,
  ...props
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      
      backdropTransitionInTiming={transistionIn}
  
     hasBackdrop={hasBackdrop}
      style={{
        ...styles.modalStyle,
        ...modalStyle,
      }}
      {...props}
      >
      <View
        style={{
          // flex: 1,
          backgroundColor: colors.white,
          borderRadius: 15,
          paddingTop: moderateScaleVertical(30),
          ...mainViewStyle,
        }}>
        {/* //Header */}
        {topCustomComponent ? (
          topCustomComponent()
        ) : (
          <Header
            leftIcon={leftIcon}
            centerTitle={centerTitle}
            rightIcon={rightIcon}
            rightIconStyle={rightIconStyle}
            onPressLeft={onPressLeft}
            onPressRight={onClose}
          />
        )}

        {/* center content */}
        <>{modalMainContent()}</>

        {/* bottom content */}
        <>{modalBottomContent()}</>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    marginHorizontal: moderateScaleVertical(20),
    marginVertical: moderateScaleVertical(50),
    // backgroundColor: colors.white,
    borderRadius: 15,
  },
});
export default React.memo(ModalView);
