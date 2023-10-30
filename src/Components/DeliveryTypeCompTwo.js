import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { moderateScale, textScale, width } from '../styles/responsiveSize';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import actions from '../redux/actions';
import deviceInfoModule from 'react-native-device-info';
import { showError, showSuccess } from '../utils/helperFunctions';
import { MyDarkTheme } from '../styles/theme';
import colors from '../styles/colors';
import imagePath from '../constants/imagePath';
import { useDarkMode } from 'react-native-dynamic';
import { isEmpty } from 'lodash';

function DeliveryTypeCompTwo({ selectedToggle = () => { } }) {
  const { cartItemCount } = useSelector((state) => state?.cart);
  const {
    appData,
    themeColors,
    appStyle,
    currencies,
    languages,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const { dineInType } = useSelector((state) => state?.home);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({ fontFamily, themeColors, isDarkMode });

  const [state, setState] = useState({
    tabs: [],
  });

  const { tabs } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    addAllTabs();
  }, []);

  const addAllTabs = () => {
    if (!!appData?.profile && appData?.profile?.preferences?.vendorMode) {
      updateState({ tabs: appData?.profile?.preferences?.vendorMode });
    }
    return;
  };

  const _onTableItm = (value, indx) => {
    const newTabs = [...tabs];
    newTabs.forEach((item, index) => {
      if (index === indx) {
        selectedToggle(item?.type);
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

  const dineInFunction = (item, indx) => {
    Alert.alert('', strings.REMOVE_CART_MSG, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart(item, indx) },
    ]);
  };

  const clearCart = (item, indx) => {
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
        _onTableItm(item, indx);
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    showError(error?.message || error?.error);
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          activeOpacity={1}
          disabled={item?.isActive}
          onPress={() =>
            !(
              cartItemCount?.message == null &&
              cartItemCount?.data?.item_count > 0
            )
              ? _onTableItm(item, index)
              : dineInFunction(item, index)
          }
          key={index}
          style={{
            ...styles.tabItemView,
            borderBottomWidth: 0,
            //   borderBottomColor:
            //     dineInType == item?.type && isDarkMode
            //       ? MyDarkTheme.colors.white
            //       : dineInType == item?.type && !isDarkMode
            //       ? themeColors.primary_color
            //       : isDarkMode
            //       ? colors.blackOpacity0
            //       : colors.greyColor1,

            backgroundColor: dineInType == item?.type && isDarkMode
              ? MyDarkTheme.colors.white
              : dineInType == item?.type && !isDarkMode
                ? themeColors.primary_color
                : isDarkMode
                  ? colors.blackOpacity0
                  : colors.lightGray,
            borderRadius: moderateScale(10),
            width:
              tabs.length == 2
                ? (width - moderateScale(16)) / 2
                : (width - moderateScale(16)) / 3,
          }}>
          <Text
            style={{
              ...styles.tabItemTxt,
              // color:
              //   item.isActive && isDarkMode
              //     ? MyDarkTheme.colors.white
              //     : item.isActive && !isDarkMode
              //     ? themeColors.primary_color
              //     : colors.greyLight,
              color:
                item.isActive && isDarkMode
                  ? MyDarkTheme.colors.white
                  : item.isActive && !isDarkMode
                    ? colors.white
                    : colors.blackC,
            }}>
            {item?.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [tabs, appData, cartItemCount],
  );

  const awesomeChildListKeyExtractor = useCallback(
    (item) => `awesome-child-key-${item?.type}`,
    [tabs],
  );

  if (tabs.length <= 1) {
    return <></>;
  }

  return (
    <View
      style={{
        ...styles.tabMainStyle,
        backgroundColor: colors.lightGray,
        borderBottomColor: isDarkMode
          ? colors.whiteOpacity22
          : colors.borderColorD,
      }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tabs}
        renderItem={renderItem}
        keyExtractor={awesomeChildListKeyExtractor}
      //   ListFooterComponent={() => (
      //     <View style={{marginLeft: moderateScale(16)}} />
      //   )}
      //   ListHeaderComponent={() => (
      //     <View style={{marginRight: moderateScale(16)}} />
      //   )}
      />
    </View>
  );
}

export function stylesFunc({ fontFamily, themeColors, isDarkMode }) {
  const styles = StyleSheet.create({
    tabMainStyle: {
      borderRadius: moderateScale(10),
      flexDirection: 'row',
      marginTop: moderateScale(10),
      borderBottomWidth: 0.8,
      width: width - moderateScale(16),
      justifyContent: 'center',
      alignSelf: 'center'
    },
    tabItemView: {
      borderBottomWidth: 2,
      height: moderateScale(40),
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabItemImg: {
      height: moderateScale(16),
      width: moderateScale(16),
      marginRight: moderateScale(3),
    },
    tabItemTxt: {
      marginLeft: moderateScale(3),
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      textTransform: 'capitalize',
    },
  });
  return styles;
}

export default React.memo(DeliveryTypeCompTwo);
