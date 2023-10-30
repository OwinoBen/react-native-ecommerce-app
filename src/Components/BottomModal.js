import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import ReactNativeModal from 'react-native-modal';
import {height, moderateScale} from '../styles/responsiveSize';
import colors from '../styles/colors';

function BottomModal({
  renderModalContent = () => {},
  onBackdropPress = () => {},
  isVisible = false,
  mainViewStyle = {},
}) {
  return (
    <ReactNativeModal
      onBackdropPress={onBackdropPress}
      isVisible={isVisible}
      style={{
        margin: 0,
        justifyContent: 'flex-end',
        // marginBottom: keyboardHeight,
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View
          style={{
            height: height / 2,
            borderTopLeftRadius: moderateScale(16),
            borderTopRightRadius: moderateScale(16),
            backgroundColor: colors.white,
            padding: moderateScale(12),
            ...mainViewStyle,
          }}>
          {renderModalContent()}
        </View>
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
}

const styles = StyleSheet.create({});

export default React.memo(BottomModal);
