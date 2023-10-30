import React, { createRef, useEffect, useRef, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { getImageUrl, showSuccess } from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import { RadioButton } from 'react-native-paper';

import ListEmptyVendors from '../../Vendors/ListEmptyVendors';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../../styles/theme';
import strings from '../../../constants/lang';
import { string } from 'prop-types';
import { BlurView } from '@react-native-community/blur';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import ScaledImage from 'react-native-scalable-image';
import { useNavigation } from '@react-navigation/native';

export default function DashBoardHeaderFive({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
}) {
  const navigation = useNavigation();
  const pickerRef = createRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const { appData, themeColors, appStyle, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  const [state, setState] = useState({
    isModalVisible: false,
    checked: '',
    tabs: [],
    setSelectedTab: 0,
  });

  const { isModalVisible, checked, tabs } = state;

  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const imageURI = getImageUrl(
    isDarkMode
      ? profileInfo?.dark_logo?.image_fit
      : profileInfo?.logo?.image_fit,
    isDarkMode
      ? profileInfo?.dark_logo?.image_path
      : profileInfo?.logo?.image_path,
    '1000/1000',
  );

  useEffect(() => {
    addAllTabs();
    userSelectedtab();
  }, [appData]);

  const checkSelectedTab = () => {
    const newTabs = [...tabs];
    newTabs.forEach((item, index) => {
      if (item.label === dine_In_Type) {
        newTabs[index].isActive = true;
        updateState({
          tabs: [...newTabs],
        });
      } else {
        newTabs[index].isActive = false;
        updateState({
          tabs: [...newTabs],
        });
      }
    });
  };

  const addAllTabs = () => {
    const localTabsArray = [];

    if (toggleData?.profile?.preferences?.delivery_check == 1) {
      localTabsArray.push({
        value: strings.DELIVERY,
        label: 'delivery',
        icon: imagePath.delivery,
        iconInActive: imagePath.deliveryInActive,
        isActive: true,
      });
      if (
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
      }
    }
    if (toggleData?.profile?.preferences?.dinein_check == 1) {
      localTabsArray.push({
        value: strings.DINE_IN,
        label: 'dine_in',
        icon: imagePath.dineIn,
        isActive: false,
      });
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('dine_in');
      }
    }
    if (toggleData?.profile?.preferences?.takeaway_check == 1) {
      localTabsArray.push({
        value:
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
          strings.TAKEAWAY,
        label: 'takeaway',
        icon: imagePath.takeaway,
        isActive: false,
      });
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0
      ) {
        selcetedToggle('takeaway');
      }
    }
    updateState({
      tabs: localTabsArray,
      checked: localTabsArray[0],
    });
  };

  const setUserSelectedTab = (label, value) => {
    selcetedToggle(value);
    updateState({
      checked: label,
    });
  };

  const userSelectedtab = () => {
    if (dine_In_Type === 'delivery') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(strings.DINE_IN, 'dine_in');
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
          strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(strings.DINE_IN, 'dine_in');
      } else {
        setUserSelectedTab(strings.DELIVERY, 'delivery');
      }
    } else if (dine_In_Type === 'dine_in') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(strings.DINE_IN, 'dine_in');
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
          strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(strings.DINE_IN, 'dine_in');
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(strings.DELIVERY, 'delivery');
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(strings.DELIVERY, 'delivery');
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(strings.DELIVERY, 'delivery');
      } else {
        setUserSelectedTab(strings.DINE_IN, 'dine_in');
      }
    } else {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
          strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
          strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
          strings.TAKEAWAY,
          'takeaway',
        );
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(strings.DINE_IN, 'dine_in');
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(strings.DELIVERY, 'delivery');
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setUserSelectedTab(strings.DELIVERY, 'delivery');
      } else {
        setUserSelectedTab(
          toggleData?.profile?.preferences?.takeaway_nomenclature ||
          strings.TAKEAWAY,
          'takeaway',
        );
      }
    }
  };

  const dineInFunction = () => {
    Alert.alert('', strings.REMOVE_CART_MSG, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
      },
      { text: strings.CLEAR_CART2, onPress: clearCart },
    ]);
  };

  const clearCart = () => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: deviceInfoModule.getUniqueId(),
        },
      )
      .then((res) => {
        showSuccess(res?.message);
        actions.cartItemQty(res);
        updateState({ isModalVisible: false });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };

  const _onTableItm = (item, indx) => {
    const newTabs = [...tabs];
    newTabs.forEach((item, index) => {
      if (index === indx) {
        selcetedToggle(item.label);
        newTabs[index].isActive = true;
        updateState({
          tabs: [...newTabs],
          checked: item.value,
          isModalVisible: false,
        });
      } else {
        newTabs[index].isActive = false;
        updateState({
          tabs: [...newTabs],
        });
      }
    });
  };

  const _onTableLabel = () => {
    checkSelectedTab();
    updateState({ isModalVisible: true });
  };

  const viewRef2 = useRef();

  if (isLoading) {
    return (
      <HeaderLoader
        rectHeightLeft={moderateScaleVertical(20)}
        heightLeft={moderateScaleVertical(20)}
        heightRight={moderateScaleVertical(20)}
        rectHeightRight={moderateScaleVertical(20)}
        isRight
        viewStyles={{ marginVertical: moderateScaleVertical(10) }}
      />
    );
  }

  return (
    <>
      <View
        style={{
          ...styles.headerContainer,
          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.borderColorD,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>

        {appStyle?.homePageLayout == 10 ? <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.openDrawer()}
          style={{ alignItems: 'center', }}>
          <Image
            style={{
              tintColor: themeColors.primary_color,
              marginRight: moderateScale(16),
              height: moderateScale(34),
              width: moderateScale(34),
            }}
            source={imagePath.icHamburger}
            resizeMode="contain"
          />
        </TouchableOpacity> : null}

        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            // style={styles.crossIcon}
            onPress={() => updateState({isModalVisible: false})}>
            <Image
              source={imagePath.ic_cross}
              resizeMode="contain"
              style={{
                tintColor: 'black',
                width: moderateScale(30),
                height: moderateScale(30),
              }}
            />
          </TouchableOpacity>
          <View style={styles.locationView}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.locationTitleTxt}>Your location</Text>
              <Image source={imagePath.chev_down} />
            </View>
            <Text style={styles.locationTxt}>Unnamed Road</Text>
          </View>
        </View> */}

        <View
          style={{
            flexDirection: 'row',
            // flex: 1,
            alignItems: 'center',
          }}>
          {!!(profileInfo && profileInfo?.logo) ? (
            <ScaledImage
              width={width / 6}
              height={moderateScaleVertical(50)}
              resizeMode="contain"
              source={{
                uri: imageURI,
              }}
            />
          ) : null}
          {!!appData?.profile?.preferences?.is_hyperlocal && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigation.navigate(navigationStrings.LOCATION, {
                  type: 'Home1',
                })
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 0.85,
                marginLeft: moderateScale(8),
              }}>
              <Image
                style={styles.locationIcon}
                source={imagePath.redLocation}
                resizeMode="contain"
              />

              <Text
                numberOfLines={1}
                style={[
                  styles.locationTxt,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  },
                ]}>
                {location?.address}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* <TouchableOpacity
          style={{marginHorizontal: moderateScale(8)}}
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }>
          <Image
            style={{tintColor: themeColors.primary_color}}
            source={imagePath.search1}
          />
        </TouchableOpacity> */}
        {/* {tabs.length > 1 && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              paddingVertical: moderateScaleVertical(5),
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={_onTableLabel}>
            <Image
              source={
                checked === strings.DELIVERY
                  ? imagePath.delivery
                  : checked === strings.DINE_IN
                  ? imagePath.dineIn
                  : imagePath.takeaway
              }
              style={styles.deliveryIcon}
              resizeMode="contain"
            />

            <Text style={styles.checkedTxt}>{checked}</Text>

            <Image
              source={imagePath.dropDownNew}
              style={styles.customDropDownIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )} */}
        {/* {        <Modal
          isVisible={isModalVisible}
          style={{
            justifyContent: 'flex-end',
            margin: 0,
          }}
          onBackdropPress={() => updateState({isModalVisible: false})}>
          <View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => updateState({isModalVisible: false})}>
              <Image source={imagePath.crossC} resizeMode="contain" />
            </TouchableOpacity>

            <View
              style={[
                styles.modalMainViewContainer,
                {
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.background
                    : colors.white,
                },
              ]}>
              {/* <BlurView
                blurType="light"
                style={styles.blurView}
                blurAmount={32}
              /> */}

        {/* <View style={{padding: moderateScale(10)}}>
                {tabs.map((item, indx) => {
                  return (
                    <TouchableOpacity
                      key={indx}
                      style={{
                        borderColor: item.isActive
                          ? themeColors.primary_color
                          : colors.transparent,
                        borderWidth: 0.7,
                        flexDirection: 'row',
                        paddingVertical: moderateScaleVertical(15),
                        margin: moderateScale(5),
                        borderRadius: moderateScale(10),
                        alignItems: 'center',
                        paddingHorizontal: moderateScale(20),
                        justifyContent: 'space-between',
                      }}
                      onPress={() =>
                        !(
                          cartItemCount?.message == null &&
                          cartItemCount?.data?.item_count > 0
                        )
                          ? _onTableItm(item, indx)
                          : dineInFunction()
                      }>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={
                            item.isActive
                              ? imagePath.radioNewActive
                              : imagePath.radioNewInActive
                          }
                          style={{
                            height: moderateScale(20),
                            width: moderateScale(20),
                            tintColor: item.isActive
                              ? themeColors.primary_color
                              : colors.blackOpacity43,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: fontFamily.medium,
                            color: item.isActive
                              ? themeColors.primary_color
                              : isDarkMode
                              ? MyDarkTheme.colors.text
                              : colors.blackOpacity43,
                            fontSize: textScale(12),
                            marginHorizontal: moderateScale(10),
                          }}>
                          {item.value}
                        </Text>
                      </View>
                      <Image
                        source={item.icon}
                        style={{
                          height: moderateScale(22),
                          width: moderateScale(22),
                          tintColor: item.isActive
                            ? themeColors.primary_color
                            : isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.blackOpacity66,
                          alignSelf: 'flex-end',
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>} */}
      </View>
    </>
  );
}
