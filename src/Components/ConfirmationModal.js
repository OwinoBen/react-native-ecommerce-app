import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import ButtonComponent from '../Components/ButtonComponent';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
// import { Button } from "../../components";
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
const ConfirmationModal = ({
  bottomButtonClick,
  closeModal,
  ShowModal,
  showBottomButton,
  dataArray = [],
  updateStatus,
  isSortEnabled,
  headerTitle,
  mainText = null,
}) => {
  const {appStyle} = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = styleData({fontFamily});
  return (
    <Modal animationType={'slide'} visible={ShowModal} transparent>
      <View style={styles.modalMainView}>
        <View style={styles.optionModalBgView}>
          <View style={styles.modalHeaderView}>
            <Text style={styles.modalHeaderText}>{headerTitle}</Text>
            <TouchableOpacity
              onPress={() => closeModal()}
              style={styles.closeButtonView}>
              {/* <Text>Close</Text> */}
              <Image source={imagePath.crossBlue} />
            </TouchableOpacity>
          </View>
          <View style={{height: 1, backgroundColor: colors.borderLight}} />
          {/* {this.renderRow(isSortEnabled ? sortRowData : optionRowData)} */}
          {!!mainText && (
            <View style={{padding: moderateScale(20)}}>
              <Text style={styles.mainText}>{mainText}</Text>
            </View>
          )}
          {showBottomButton && (
            // <Button
            //   onPress={bottomButtonClick ? () => bottomButtonClick() : () => closeModal()}
            //   style={styles.buttonStyle}
            //   title={strings.SORT_MODAL_APPLY_BTN}
            // />

            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: moderateScale(20),
              }}>
              <ButtonComponent
                btnText={strings.CANCEL}
                borderRadius={moderateScale(13)}
                marginTop={moderateScaleVertical(8)}
                containerStyle={{
                  backgroundColor: colors.textGrey,
                  width: width / 3,
                  height: 35,
                }}
                onPress={closeModal}
              />
              <ButtonComponent
                btnText={strings.APPLY}
                borderRadius={moderateScale(13)}
                marginTop={moderateScaleVertical(8)}
                containerStyle={{
                  backgroundColor: colors.themeColor,
                  width: width / 3,
                  height: 35,
                }}
                onPress={bottomButtonClick}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export function stylesData({fontFamily}) {
  const styles = StyleSheet.create({
    modalMainView: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    noPackageText: {
      // color: colors.LIGHT_BLACK,
      // ...fontFamily.bold,
      // marginTop: 16,
    },
    optionModalBgView: {
      backgroundColor: '#FFF',
      width: '100%',
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      position: 'absolute',
      bottom: 0,
      paddingBottom: moderateScaleVertical(30),
    },
    modalHeaderView: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      // paddingHorizontal: 16,
      // paddingVertical: 16,
      marginVertical: moderateScaleVertical(16),
      marginHorizontal: moderateScaleVertical(16),
    },
    modalHeaderText: {
      color: colors.black,
      fontSize: textScale(16),
      // lineHeight: moderateScaleVertical(15),
      fontFamily: fontFamily.bold,
      opacity: 0.9,
      marginLeft: moderateScaleVertical(5),
    },
    closeButtonView: {
      alignSelf: 'flex-end',
    },
    optionMainRow: {
      margin: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: moderateScaleVertical(20),
    },
    optionRowText: {
      color: colors.textGrey,
      fontSize: textScale(14),
      // lineHeight: moderateScaleVertical(15),
      fontFamily: fontFamily.medium,
      opacity: 0.7,
      marginLeft: moderateScaleVertical(10),
    },
    mainText: {
      color: colors.textGrey,
      fontSize: textScale(14),
      // lineHeight: moderateScaleVertical(15),
      fontFamily: fontFamily.bold,
      opacity: 0.9,
      textAlign: 'center',
    },
  });
  return styles;
}
export default React.memo(ConfirmationModal);
