import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
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
import { showError, showSuccess } from '../utils/helperFunctions';
import { hitSlopProp } from '../styles/commonStyles';

function DeliveryTypeComp({ selectedToggle = () => { }, tabMainStyle = {} }) {
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

  const flatRef = useRef(null)

  const [myTabs, setTabs] = useState([])

  const tabs = useMemo(() => myTabs);

  useEffect(() => {
    addAllTabs();
  }, []);



  const addAllTabs = () => {
    if (!!appData?.profile && appData?.profile?.preferences?.vendorMode) {
      setTabs(appData?.profile?.preferences?.vendorMode || [])
    }
    return;
  };

  const _onTableItm = (value, indx) => {
    const newTabs = [...tabs];
    newTabs.forEach((item, index) => {
      if (index === indx) {
        selectedToggle(item?.type);
        newTabs[index].isActive = true;
        setTabs([...newTabs])

      } else {
        newTabs[index].isActive = false;
        setTabs([...newTabs])
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


  const onPressItem = (item, index) => {
    if (!!flatRef?.current) {
      flatRef.current.scrollToIndex({
        animated: true,
        index: index,

        viewPosition: 0.5
      })
    }
    !(
      cartItemCount?.message == null &&
      cartItemCount?.data?.item_count > 0
    )
      ? _onTableItm(item, index)
      : dineInFunction(item, index)
  }


  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        activeOpacity={1}
        disabled={item?.isActive}
        onPress={() => onPressItem(item, index)}
        key={index}
        hitSlop={hitSlopProp}
      >
        <View
          style={{
            ...styles.tabItemView,
            borderBottomColor:
              dineInType == item?.type && isDarkMode
                ? MyDarkTheme.colors.white
                : dineInType == item?.type && !isDarkMode
                  ? themeColors.primary_color
                  : isDarkMode
                    ? colors.blackOpacity0
                    : colors.greyColor1,

            // width:
            //   tabs.length == 2
            //     ? width / 2
            //     : width / 4,
            marginRight: moderateScale(16),
          }}
        >
          <Text
            onPress={() => onPressItem(item, index)}
            style={{
              ...styles.tabItemTxt,
              color:
                item.isActive && isDarkMode
                  ? MyDarkTheme.colors.white
                  : item.isActive && !isDarkMode
                    ? themeColors.primary_color
                    : colors.greyLight,
            }}>
            {item?.name}
          </Text>
        </View>
      </Pressable>
    )
  }


  const awesomeChildListKeyExtractor = useCallback(
    (item) => `awesome-child-key-${item?.type}`,
    [tabs],
  );

  if (tabs.length <= 1) {
    return <></>;
  }

  return (
    <View>
      <View
        style={{
          ...styles.tabMainStyle,
          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.borderColorD,
          marginBottom: moderateScaleVertical(12),
          ...tabMainStyle,
        }}>

        {/* <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled

        >
          {tabs.map((val, i) => renderItem(val, i))}

        </ScrollView> */}
        <FlatList
          ref={flatRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          initialScrollIndex={tabs.findIndex((item) => item?.type == dineInType)}
          onScrollToIndexFailed={(val) => console.log('indexed failed')}
          renderItem={renderItem}
          keyExtractor={awesomeChildListKeyExtractor}
          ListFooterComponent={() => (
            <View style={{ marginLeft: moderateScale(16) }} />
          )}
          ListHeaderComponent={() => (
            <View style={{ marginRight: moderateScale(16) }} />
          )}
        />
      </View>
    </View>
  );
}

export function stylesFunc({ fontFamily, themeColors, isDarkMode }) {
  const styles = StyleSheet.create({
    tabMainStyle: {
      borderRadius: moderateScale(10),
      flexDirection: 'row',
      // marginTop: moderateScale(10),
      borderBottomWidth: 0.8,
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
      fontSize: textScale(14),
      fontFamily: fontFamily.regular,
      textTransform: 'capitalize',
    },
  });
  return styles;
}

export default React.memo(DeliveryTypeComp);
