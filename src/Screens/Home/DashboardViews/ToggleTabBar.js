import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import colors from '../../../styles/colors';
import {moderateScaleVertical,textScale,} from '../../../styles/responsiveSize';
import actions from '../../../redux/actions';
import { showError, showSuccess } from '../../../utils/helperFunctions';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../../styles/theme';
import strings from '../../../constants/lang';
import { appIds } from '../../../utils/constants/DynamicAppKeys';


export default function ToggleTabBar({
  selcetedToggle,
  toggleData,
  isDineInSelected = false,
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    selectedIndex: 0,
    tabs: [],
  });
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  const [selectedTab, setSelectedTab] = useState(0);
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { appData, themeColors, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const cartItemCount = useSelector((state) => state?.cart?.cartItemCount);
  // const cartItemType = useSelector((state) => state?.cart?.cartItemType);

  const { selectedIndex, tabs } = state;
  useEffect(() => {
    addAllTabs();
    getSelectedTab();
  }, [appData]);

  // console.log(toggleData,"toggleDatatoggleData")
  console.log(dine_In_Type, "toggleDatatoggleData")

  useEffect(() => {
    if (dine_In_Type == 'dine_in') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      }
    }
  }, [dine_In_Type]);

  const getSelectedTab = () => {
    if (dine_In_Type == 'delivery') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(0);
      } else {
        setSelectedTab(0);
      }
    }
    if (dine_In_Type == 'dine_in') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(0);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      }
    }
    if (dine_In_Type == 'takeaway') {
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 1
      ) {
        setSelectedTab(1);
      } else if (
        toggleData?.profile?.preferences?.delivery_check == 1 &&
        toggleData?.profile?.preferences?.dinein_check == 1 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        setSelectedTab(1);
      } else {
        setSelectedTab(2);
      }
    }
  };
  console.log(
    toggleData?.profile?.preferences,
    ' toggleData?.profile?.preferences?.dinein_check',
  );
  const addAllTabs = () => {
    const localTabsArray = [];
    userSelectedtab();
    if (toggleData?.profile?.preferences?.delivery_check == 1) {
      let tabname = toggleData?.profile?.preferences?.vendorMode[0]?.name;
      localTabsArray.push(
        getBundleId() == appIds.sorDelivery ? tabname : strings.DELIVERY,
      );
      // localTabsArray.push(strings.DELIVERY);
      if (
        toggleData?.profile?.preferences?.dinein_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('delivery');
      }
    }
    if (toggleData?.profile?.preferences?.dinein_check == 1) {
      let tabname = toggleData?.profile?.preferences?.vendorMode[1]?.name;
      localTabsArray.push(
        getBundleId() == appIds.sorDelivery ? tabname : strings.DINE_IN,
      );
      // localTabsArray.push(strings.DINE_IN);
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.takeaway_check == 0
      ) {
        selcetedToggle('dine_in');
      }
    }
    if (toggleData?.profile?.preferences?.takeaway_check == 1) {
      let tabname = toggleData?.profile?.preferences?.vendorMode[2]?.name;
      localTabsArray.push(
        getBundleId() == appIds.sorDelivery ? tabname : strings.TAKEAWAY,
      );
      if (
        toggleData?.profile?.preferences?.delivery_check == 0 &&
        toggleData?.profile?.preferences?.dinein_check == 0
      ) {
        selcetedToggle('takeaway');
      }
    }
    updateState({
      tabs: localTabsArray,
    });
  };

  useEffect(() => {
    userSelectedtab();
  }, [selectedTab]);

  const userSelectedtab = () => {
    if (
      toggleData?.profile?.preferences?.delivery_check == 1 &&
      toggleData?.profile?.preferences?.dinein_check == 1 &&
      toggleData?.profile?.preferences?.takeaway_check == 1
    ) {
      if (selectedTab == 0) {
        selcetedToggle('delivery');
      } else if (selectedTab == 1) {
        selcetedToggle('dine_in');
      } else if (selectedTab == 2) {
        selcetedToggle('takeaway');
      }
    } else if (
      toggleData?.profile?.preferences?.delivery_check == 1 &&
      toggleData?.profile?.preferences?.dinein_check == 1 &&
      toggleData?.profile?.preferences?.takeaway_check == 0
    ) {
      if (selectedTab == 0) {
        selcetedToggle('delivery');
      } else if (selectedTab == 1) {
        selcetedToggle('dine_in');
      }
    } else if (
      toggleData?.profile?.preferences?.delivery_check == 1 &&
      toggleData?.profile?.preferences?.dinein_check == 0 &&
      toggleData?.profile?.preferences?.takeaway_check == 1
    ) {
      if (selectedTab == 0) {
        selcetedToggle('delivery');
      } else if (selectedTab == 1) {
        selcetedToggle('takeaway');
      }
    } else if (
      toggleData?.profile?.preferences?.delivery_check == 0 &&
      toggleData?.profile?.preferences?.dinein_check == 1 &&
      toggleData?.profile?.preferences?.takeaway_check == 1
    ) {
      if (selectedTab == 0) {
        selcetedToggle('dine_in');
      } else if (selectedTab == 1) {
        selcetedToggle('takeaway');
      }
    }
  };
  const dineInFunction = () => {
    Alert.alert('', `${strings.THIS_CHANGE_WILL_REMOVE_YOUR_CART}`, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart2() },
    ]);
  };

  const clearCart2 = () => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        showSuccess(res?.message);
        actions.cartItemQty(res);
      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };


  console.log("tabs++++++++", tabs)


  const MaterialTabsClone = (item, index) => {
    return (
      <View key={String(index)}>
        <Text>{item}</Text>
      </View>
    )
  }


  return (
    <>
      {tabs.length > 1 ? (
        <View
          style={{
            marginVertical: moderateScaleVertical(10),
            borderRadius: 15,
            overflow: 'hidden',
          }}>

          <View style={{
            flexDirection: "row",
            height: moderateScaleVertical(42),
            backgroundColor: isDarkMode ? MyDarkTheme.colors.lightDark : colors.greyColor2,
            marginBottom: 16,
            justifyContent: 'space-around',
            // alignItems:'center'
          }}>
            {tabs.map((val, i) => {
              return (
                <TouchableOpacity
                  key={String(i)}
                  style={{ justifyContent: 'space-between' }}
                  activeOpacity={0.8}
                  onPress={!(
                    cartItemCount?.message == null &&
                    cartItemCount?.data?.item_count > 0
                  )
                    ? () => setSelectedTab(i)
                    : dineInFunction}
                >
                  <View />
                  <Text style={{
                    fontSize: textScale(10),
                    textTransform: 'uppercase',
                    color: selectedTab == i ? themeColors.primary_color : isDarkMode ? MyDarkTheme.colors.text : colors.textGreyF
                  }}>{val}</Text>
                  <View style={{
                    height: 3,
                    backgroundColor: selectedTab == i ? themeColors.primary_color : 'transparent'
                  }} />
                </TouchableOpacity>
              )
            })}

          </View>

          {/* <MaterialTabs
            items={tabs}
            selectedIndex={selectedTab}
            onChange={
              !(
                cartItemCount?.message == null &&
                cartItemCount?.data?.item_count > 0
              )
                ? setSelectedTab
                : dineInFunction
            }
            barHeight={moderateScaleVertical(42)}
            indicatorColor={themeColors.primary_color}
            activeTextColor={themeColors.primary_color}
            barColor={
              isDarkMode ? MyDarkTheme.colors.lightDark : colors.greyColor2
            }
            inactiveTextColor={
              isDarkMode ? MyDarkTheme.colors.text : colors.textGreyF
            }
            indicatorHeight={3}
            textStyle={{ fontSize: textScale(10) }}
          /> */}
        </View>
      ) : null}
    </>
  );
}
