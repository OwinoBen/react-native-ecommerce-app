import React from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';

const CartModal = ({isVisible = false, onClose}) => {
  const {appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({fontFamily});

  return (
    <Modal
      isVisible={isVisible}
      style={{
        marginHorizontal: 0,
        marginBottom: 0,
        marginTop: moderateScaleVertical(50),
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            alignSelf: 'center',
            height: 6,
            width: 50,
            backgroundColor: colors.backgroundGreyB,
            borderRadius: 20,
            marginTop: 10,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: moderateScale(16),
          }}>
          <Image
            style={{tintColor: colors.black}}
            source={imagePath.locationGreen}
          />
          <View style={{flexDirection: 'row'}}>
            <Text
              numberOfLines={1}
              style={{
                ...commonStyles.mediumFont14,
                color: colors.textGreyB,
                marginHorizontal: 10,
              }}>
              Delivery at:
            </Text>
            <Text
              numberOfLines={1}
              style={{...commonStyles.mediumFont14, color: colors.black}}>
              Delivery at:
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default React.memo(CartModal);
