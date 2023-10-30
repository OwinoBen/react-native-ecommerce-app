import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import deviceInfoModule from 'react-native-device-info';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { getColorCodeWithOpactiyNumber, showError, showSuccess } from '../utils/helperFunctions';

function DeliveryTypeComp({
  selectedToggle = () => { }, 
  tabMainStyle = {},
  themeColors =  {
    primary_color: colors.themeColor
  }
 }) {
  const { cartItemCount } = useSelector((state) => state?.cart);
  const {
    appData,
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
            borderColor: dineInType == item?.type ? themeColors?.primary_color : colors.borderStroke,
            borderRadius: moderateScale(60),
            borderWidth: 1,
            paddingHorizontal: moderateScale(16),
            backgroundColor: dineInType == item?.type ? getColorCodeWithOpactiyNumber(
              themeColors?.primary_color.substring(1),
              10,
            ) : colors.white

          }}>
          <Text
            style={{
              ...styles.tabItemTxt,
              color:
                dineInType == item?.type ? themeColors.primary_color
                  : colors.black,
            }}>
            {item?.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [tabs, appData, cartItemCount, dineInType],
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
        ...tabMainStyle,
      }}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={tabs}
        initialScrollIndex={tabs.findIndex(
          (item) => item?.type == dineInType,
        )}
        onScrollToIndexFailed={(val) => console.log('indexed failed')}
        renderItem={renderItem}
        keyExtractor={awesomeChildListKeyExtractor}
        ListFooterComponent={() => (
          <View style={{ marginLeft: moderateScale(16) }} />
        )}
        ItemSeparatorComponent={() => <View style={{ width: moderateScale(20) }} />}
        ListHeaderComponent={() => (
          <View style={{ marginRight: moderateScale(16) }} />
        )}
      />
    </View>

  );
}

export function stylesFunc({ fontFamily, themeColors, isDarkMode }) {
  const styles = StyleSheet.create({
    tabMainStyle: {

    },
    tabItemView: {
      height: moderateScale(35),
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

export default React.memo(DeliveryTypeComp);
