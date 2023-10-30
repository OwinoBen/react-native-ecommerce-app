import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import CustomBottomTabBarP2p from '../Components/CustomBottomTabBarP2p';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import { moderateScale, textScale } from '../styles/responsiveSize';
import AccountStack from './AccountStack';
import ChatStack from './ChatStack';
import HomeStack from './HomeStack';
import navigationStrings from './navigationStrings';
import PostStack from './PostStack';



const Tab = createBottomTabNavigator();

let showBottomBar_ = true;

export default function TabRoutesP2p(props) {
  const { cartItemCount } = useSelector((state) => state?.cart);
  const {
    appStyle,
    appData,
    redirectedFrom,
    themeColors,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesData();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const getTabBarVisibility = (route, navigation, screen) => {
    if (navigation && navigation.isFocused && navigation.isFocused()) {
      const route_name = getFocusedRouteNameFromRoute(route);
      if (screen.includes(route_name)) {
        showBottomBar_ = false;
        return false;
      }
      showBottomBar_ = true;
      return true;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontFamily: fontFamily?.medium,
          fontSize: textScale(12),
          color: colors.white,
        }
      }}
      backBehavior={navigationStrings.HOMESTACK}
      tabBar={(props) => {
        if (showBottomBar_) {
          return <CustomBottomTabBarP2p {...props} />;
        }
      }}
      initialRouteName={
        redirectedFrom == 'cart'
          ? navigationStrings.CART
          : redirectedFrom == 'p2pPost'
            ? navigationStrings.POST
            : navigationStrings.HOMESTACK
      }>
      <Tab.Screen
        component={HomeStack}
        name={navigationStrings.HOMESTACK}
        options={({ route, navigation }) => ({
          tabBarVisible: getTabBarVisibility(route, navigation, [
            navigationStrings.PRODUCT_LIST,
            navigationStrings.PRODUCTDETAIL,
            navigationStrings.ADDADDRESS,
            navigationStrings.CHOOSECARTYPEANDTIMETAXI,
            // navigationStrings.P2P_PRODUCTS,
            navigationStrings.P2P_PRODUCT_DETAIL,
          ]),
          tabBarLabel: strings.HOME,
          tabBarIcon: ({ focused, tintColor }) => (
            <Image
              style={[
                {
                  tintColor: focused
                    ? themeColors?.primary_color
                    : isDarkMode
                      ? colors.whiteOpacity50
                      : colors.blackOpacity43,
                },
              ]}
              source={
                focused ? imagePath.icHomeP2p : imagePath.icHomeP2pInActive
              }
            />
          ),
        })}
      />

      <Tab.Screen
        component={ChatStack}
        name={navigationStrings.CHAT_STACK}
        options={({ route, navigation }) => ({
          tabBarVisible: getTabBarVisibility(route, navigation, [
            navigationStrings.CHAT_SCREEN,
          ]),
          tabBarLabel: strings.CHATS,
          tabBarIcon: ({ focused, tintColor }) => (
            <Image
              resizeMode="contain"
              style={{
                tintColor: focused
                  ? themeColors?.primary_color
                  : isDarkMode
                    ? colors.whiteOpacity50
                    : colors.blackOpacity43,
              }}
              source={
                focused ? imagePath.icChatP2p : imagePath.icChatP2pInActive
              }
            />
          ),
        })}
      />

      <Tab.Screen
        component={PostStack}
        name={navigationStrings.POST}
        options={({ route, navigation }) => ({
          tabBarVisible: getTabBarVisibility(route, navigation, []),
          tabBarLabel: strings.POST,
          tabBarIcon: ({ focused, tintColor }) => (
            <Image
              resizeMode="contain"
              style={{
                tintColor: focused
                  ? themeColors?.primary_color
                  : isDarkMode
                    ? colors.whiteOpacity50
                    : colors.blackOpacity43,
              }}
              source={
                focused ? imagePath.icAddPostInactive : imagePath.icAddPostActive
              }
            />
          ),
        })}
      />


      <Tab.Screen
        component={AccountStack}
        name={navigationStrings.ACCOUNTS}
        options={({ route }) => ({
          tabBarLabel: strings.ACCOUNTS,
          tabBarIcon: ({ focused, tintColor }) => (
            <Image
              resizeMode="contain"
              style={{
                tintColor: focused
                  ? themeColors?.primary_color
                  : isDarkMode
                    ? colors.whiteOpacity50
                    : colors.blackOpacity43,
              }}
              source={
                focused
                  ? imagePath.icAccountP2p
                  : imagePath.icAccountP2pInActive
              }
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
}

export function stylesData(params) {
  const { appStyle } = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const styles = StyleSheet.create({
    cartItemCountView: {
      position: 'absolute',
      zIndex: 100,

      backgroundColor: colors.cartItemPrice,

      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartItemCountNumber: {
      fontFamily: fontFamily?.bold,
      color: colors.white,
      fontSize: textScale(8),
    },
  });
  return styles;
}
