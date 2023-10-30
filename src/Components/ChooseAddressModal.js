import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {Shadow} from 'react-native-shadow-2';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {
  hapticEffects,
  playHapticEffect,
  showError,
} from '../utils/helperFunctions';
import TransparentButtonWithTxtAndIcon from './TransparentButtonWithTxtAndIcon';

navigator.geolocation = require('react-native-geolocation-service');

const ChooseAddressModal = ({
  isVisible = false,
  onClose,
  selectAddress = () => {},
  openAddressModal,
  selectedAddress,
}) => {
  //close yout modal
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    allAddress: [],
    isLoading: true,
    viewHeight: 0,
  });
  const {allAddress, isLoading, viewHeight} = state;
  const userData = useSelector((state) => state?.auth?.userData);
  const {appData, appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesData({fontFamily});
  const updateState = (data) => setState((state) => ({...state, ...data}));

  useFocusEffect(
    React.useCallback(() => {
      if (!!userData?.auth_token && isVisible) {
        getAllAddress();
      }
    }, [isVisible]),
  );

  //get All address
  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        console.log(res, 'res>>>>');
        // actions.saveAllUserAddress(res.data);
        updateState({allAddress: res.data, isLoading: false});
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  const renderItem = useCallback(({item, index}) => {
    return (
      <TouchableOpacity onPress={() => selectAddress(item)}>
        <View
          style={{
            borderBottomColor: colors.lightGreyBorder,
            borderBottomWidth: moderateScaleVertical(1),
            borderTopWidth: moderateScaleVertical(1),
            borderTopColor: colors.lightGreyBorder,
          }}>
          <View
            style={{
              marginHorizontal: moderateScale(24),
              marginTop: moderateScaleVertical(20),
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: moderateScaleVertical(12),
            }}>
            <View
              style={{
                flex: 0.1,
                alignItems: 'flex-start',
                justifyContent: 'center',
              }}>
              <Image
                style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
                source={imagePath.home}
              />
            </View>
            <View style={{flex: 0.8}}>
              <Text
                numberOfLines={2}
                style={
                  isDarkMode
                    ? [
                        styles.address,
                        {
                          textAlign: 'left',
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                    : [styles.address, {textAlign: 'left'}]
                }>
                {!!item?.house_number ? item?.house_number + ', ' : ''}
                {item?.address}
              </Text>
            </View>
            {selectedAddress ? (
              selectedAddress.id == item.id ? (
                <View
                  style={{
                    flex: 0.1,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}>
                  <Image source={imagePath.done} />
                </View>
              ) : null
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const handleComponent = useCallback(() => {
    return (
      <Shadow
        sides={['top']}
        distance={2}
        style={{
          ...styles.handleShadowView,
          backgroundColor: isDarkMode ? '#6C6C6C' : colors.white,
        }}>
        <View
          style={{
            ...styles.handleView,
            backgroundColor: isDarkMode ? colors.white : colors.black,
          }}
        />
      </Shadow>
    );
  }, []);

  if (isVisible) {
    return (
      <BottomSheet
        key={isVisible}
        index={0}
        snapPoints={[height / 1.3]}
        // activeOffsetY={[-1, 1]}
        // failOffsetX={[-5, 5]}
        enablePanDownToClose={true}
        animateOnMount={true}
        // // handleIndicatorStyle={{
        // //   backgroundColor: isDarkMode ? colors.white : colors.black,
        // // }}
        // handleStyle={{
        //   backgroundColor: isDarkMode ? '#939393' : colors.white,
        //   borderTopLeftRadius: moderateScale(15),
        //   borderTopRightRadius: moderateScale(15),
        // }}
        handleComponent={handleComponent}
        onChange={(index) => {
          if (index === -1) {
            onClose();
          }
          playHapticEffect(hapticEffects.impactMedium);
        }}>
        <BottomSheetView
          style={{
            ...styles.modalMainViewContainer,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
          }}>
          <View style={styles.selectAndAddesssView}>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.selectAddressText, {color: MyDarkTheme.colors.text}]
                  : styles.selectAddressText
              }>
              {strings.SELECT_AN_ADDRESS}
            </Text>
          </View>
          <TransparentButtonWithTxtAndIcon
            btnText={strings.ADD_NEW_ADDRESS}
            icon={imagePath.add}
            onPress={openAddressModal}
            textStyle={
              isDarkMode
                ? {marginLeft: 10, color: MyDarkTheme.colors.text}
                : {marginLeft: 10}
            }
            borderRadius={moderateScale(13)}
            containerStyle={{
              marginHorizontal: 20,
              alignItems: 'flex-start',
            }}
            marginBottom={moderateScaleVertical(20)}
          />
          <View style={{height: 1, backgroundColor: colors.lightGreyBg}} />
          <View style={styles.savedAddressView}>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.savedAddressText, {color: MyDarkTheme.colors.text}]
                  : styles.savedAddressText
              }>
              {strings.SAVED_ADDRESS}
            </Text>
          </View>

          <BottomSheetFlatList
            data={allAddress}
            keyExtractor={(item, index) => String(index)}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
          />
          <View
            style={{
              height: moderateScaleVertical(60),
            }}></View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
  return null;
};

export function stylesData({fontFamily}) {
  const commonStyles = commonStylesFun({fontFamily});

  const styles = StyleSheet.create({
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: moderateScaleVertical(height / 10),
      overflow: 'hidden',
    },
    textInputContainer: {
      flexDirection: 'row',
      height: moderateScaleVertical(49),
      borderWidth: 1,
      // borderRadius: 13,
      // paddingVertical:moderateScaleVertical(5),
      borderColor: colors.borderLight,
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    textInput: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
      opacity: 1,
      // color: colors.textGreyOpcaity7,
    },
    address: {
      fontSize: textScale(10),
      color: colors.textGrey,
      fontFamily: fontFamily.medium,
      lineHeight: moderateScale(20),
      opacity: 0.7,
    },
    modalMainViewContainer: {
      flex: 1,
      // borderTopLeftRadius: 20,
      // borderTopRightRadius: 20,
      // overflow: 'hidden',
    },
    selectAndAddesssView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // marginBottom: moderateScaleVertical(24),
      marginVertical: moderateScaleVertical(20),
      paddingHorizontal: moderateScale(24),
    },
    selectAddressText: {
      ...commonStyles.mediumFont16,
      color: colors.textGreyD,
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
    },
    savedAddressView: {
      flexDirection: 'row',
      marginVertical: moderateScaleVertical(15),
      paddingHorizontal: moderateScale(24),
    },
    savedAddressText: {
      ...commonStyles.mediumFont16,
      color: colors.textGreyD,
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
    },
    handleView: {
      height: 6,
      width: moderateScale(35),

      borderRadius: moderateScale(8),
    },
    handleShadowView: {
      borderRadius: 0,
      borderTopLeftRadius: moderateScale(15),
      borderTopRightRadius: moderateScale(15),
      alignItems: 'center',
      justifyContent: 'center',
      height: moderateScaleVertical(25),
      width: width,
    },
  });
  return styles;
}
export default React.memo(ChooseAddressModal);
