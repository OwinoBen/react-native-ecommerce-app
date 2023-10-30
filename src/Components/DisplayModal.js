import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';

const DisplayModal = ({
  bottomButtonClick,
  closeModal,
  ShowModal,
  showBottomButton,
  dataArray,
  updateStatus,
  isSortEnabled,
  headerTitle = '',
}) => {
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  return (
    <Modal animationType={'none'} visible={ShowModal} transparent>
      <View style={styles.modalMainView}>
        <View
          style={[
            styles.optionModalBgView,
            {
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
            },
          ]}>
          <View style={styles.modalHeaderView}>
            <Text
              style={[
                styles.modalHeaderText,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
              ]}>
              {headerTitle}
            </Text>
            <TouchableOpacity
              onPress={() => closeModal()}
              style={styles.closeButtonView}>
              {/* <Text>Close</Text> */}
              <Image
                style={{tintColor: themeColors.primary_color}}
                source={imagePath.crossBlue}
              />
            </TouchableOpacity>
          </View>
          <View style={{height: 1, backgroundColor: colors.borderLight}} />
          {/* {this.renderRow(isSortEnabled ? sortRowData : optionRowData)} */}
          {dataArray.length
            ? dataArray.map((item, idx) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      // isSortEnabled ? updateStatus(idx) : closeModal(idx)
                      // alert(idx)
                      isSortEnabled ? updateStatus(item) : closeModal(item, idx)
                    }
                    style={styles.optionMainRow}>
                    {isSortEnabled && (
                      <Image
                        source={
                          item?.value?.selected
                            ? imagePath.radioActive
                            : imagePath.radioInActive
                        }
                      />
                    )}
                    {/* {item?.isIcon && <Image source={item.iconName} />} */}
                    <Text
                      style={[
                        styles.optionRowText,
                        {
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGrey,
                        },
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })
            : null}
          {showBottomButton && (
            // <Button
            //   onPress={bottomButtonClick ? () => bottomButtonClick() : () => closeModal()}
            //   style={styles.buttonStyle}
            //   title={strings.SORT_MODAL_APPLY_BTN}
            // />
            <View style={{alignItems: 'center'}}>
              <ButtonComponent
                btnText={strings.APPLY}
                borderRadius={moderateScale(13)}
                marginTop={moderateScaleVertical(8)}
                containerStyle={{
                  backgroundColor: themeColors.primary_color,
                  width: width / 1.1,
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

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    modalMainView: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    noPackageText: {
      // color: colors.LIGHT_BLACK,
      // ...fontFamily.largeBold,
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
  });
  return styles;
}
export default React.memo(DisplayModal);
