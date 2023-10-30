import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import staticStrings from '../constants/staticStrings';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import AccountStack from './AccountStack';
import BrandStack from './BrandStack';
import CartStack from './CartStack';
import CelebrityStack from './CelebrityStack';
import HomeStack from './HomeStack';
import CategoryStack from './CategoryStack';


import navigationStrings from './navigationStrings';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../styles/theme';
import { MyOrders, MyProfile } from '../Screens';
import MyOrdersStack from './MyOrdersStack';

const Tab = createBottomTabNavigator();


export default function TabRoutesEcommerce(props) {

  const { appMainData } = useSelector((state) => state?.home) || {};
  const { appStyle, appData, redirectedFrom, themeColors } = useSelector((state) => state?.initBoot || {});
  const { cartItemCount } = useSelector((state) => state?.cart || {});


  const { themeColor, themeToggle } = useSelector((state) => state?.initBoot || {});

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const styles = stylesData();

  const allCategory = appMainData?.categories;
  const checkForCeleb = appData?.profile?.preferences?.celebrity_check;

  const checkLayout = appMainData?.homePageLabels || []
  const isEnableCategory = checkLayout.find(layout => layout?.slug == 'nav_categories')

  const checkForBrand = allCategory && allCategory.find((x) => x?.redirect_to == staticStrings.BRAND);


  var celebTab = null;
  var brandTab = null;

  const getTabBarVisibility = (route, navigation, screens = []) => {
    if (navigation && navigation.isFocused && navigation.isFocused()) {
      const route_name = getFocusedRouteNameFromRoute(route);
      if (screens.includes(route_name)) {
        showBottomBar_ = false;
        return false;
      }
      showBottomBar_ = true;
      return true;
    }
  };

  if (checkForCeleb) {
    celebTab = (
      <Tab.Screen
        component={CelebrityStack}
        name={navigationStrings.CELEBRITY}
        options={() => ({
          tabBarLabel: ({ focused }) => <Text style={getTextStyle(focused)}>{strings.CELEBRITY}</Text>,
          tabBarIcon: ({ focused, tintColor }) => {
            return <FastImage
              style={styles.iconStyle}
              tintColor={!!focused ? themeColors?.primary_color : colors.inactiveText}
              source={!!focused
                ? imagePath.icEcomCeleb
                : imagePath.icEcomCelebInactive}
            />
          },
        })}
      />
    );
  }


  if (checkForBrand) {
    brandTab = (
      <Tab.Screen
        component={BrandStack}
        name={navigationStrings.BRANDS}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) => <Text style={getTextStyle(focused)}>{strings.BRANDS}</Text>,
          tabBarIcon: ({ focused, tintColor }) => {
            return (
              <FastImage
                style={styles.iconStyle}
                tintColor={!!focused ? themeColors?.primary_color : colors.inactiveText}
                source={!!focused
                  ? imagePath.icEcomBrand
                  : imagePath.icEcomBrandInactive}
              />
            )
          },
        })}
      />
    );
  }



  const insets = useSafeAreaInsets();

  const getTextStyle = (focused) => {
    return { ...styles.tabBarLabelStyle, color: !!focused ? colors.white : colors.white }
  }


  return (
    <Tab.Navigator
      backBehavior={navigationStrings.HOMESTACK}
      screenOptions={{
        headerShown: false,
      
        tabBarStyle: {
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : themeColors.primary_color,
          height:moderateScaleVertical(100),
          borderTopRightRadius:moderateScale(14),
          borderTopLeftRadius:moderateScale(14)
        },
      }}

      // tabBar={getCustomTabBar}
      initialRouteName={
        // redirectedFrom == 'cart'
        //   ? navigationStrings.CART
        //   :
           navigationStrings.HOMESTACK
      }
    >
      <Tab.Screen
        component={HomeStack}
        name={navigationStrings.HOMESTACK}
        options={({ route, navigation }) => ({
          tabBarVisible: getTabBarVisibility(route, navigation, [
            navigationStrings.PRODUCT_LIST,
            navigationStrings.PRODUCTDETAIL,
            navigationStrings.ADDADDRESS,
            navigationStrings.CHOOSECARTYPEANDTIMETAXI,
          ]),
          tabBarLabel: ({ focused }) => <Text style={getTextStyle(focused)}>{strings.HOME}</Text>,
          tabBarIcon: ({ focused, tintColor }) => {
            return (
              <FastImage
              resizeMode='contain'
                style={{height:moderateScaleVertical(28),width:moderateScale(28),...styles.iconStyle}}
                tintColor={!!focused ? colors.white : colors.inactiveText}
                source={!!focused
                  ? imagePath.activehome
                  : imagePath.activehome}
              />
            )
          },
        })}
      />
       <Tab.Screen
        component={MyOrdersStack}
        name={navigationStrings.MY_ORDERS}
        options={() => ({
          tabBarLabel: ({ focused }) => <Text style={getTextStyle(focused)}>{strings.MY_ORDERS}</Text>,
          tabBarIcon: ({ focused, tintColor }) => (
            <FastImage
              style={{height:moderateScaleVertical(20),width:moderateScale(20),...styles.iconStyle}}
              tintColor={!!focused ? colors.white : colors.inactiveText}
              source={!!focused
                ? imagePath.myorder
                : imagePath.myorder}
            />
          ),
        })}
      />
      {/* <Tab.Screen
        component={CartStack}
        name={navigationStrings.CART}
        options={({ route, navigation }) => ({
          tabBarVisible: getTabBarVisibility(route, navigation, [
            navigationStrings.PRODUCT_LIST,
            navigationStrings.PRODUCTDETAIL,
          ]),
          tabBarLabel: ({ focused }) => <Text style={getTextStyle(focused)}>{strings.CART}</Text>,
          tabBarIcon: ({ focused, tintColor }) => (
            <View>
              {cartItemCount?.data?.item_count ? (
                <View
                  style={{
                    ...styles.cartItemCountView,
                    width:
                      cartItemCount?.data?.item_count > 999
                        ? moderateScale(12)
                        : moderateScale(12),
                    height:
                      cartItemCount?.data?.item_count > 999
                        ? moderateScale(12)
                        : moderateScale(12),
                    top: cartItemCount?.data?.item_count > 999 ? -10 : 6,
                    right: cartItemCount?.data?.item_count > 999 ? -13 : -8,
                  }}>
                  <Text style={styles.cartItemCountNumber}>
                    {cartItemCount?.data?.item_count > 999
                      ? '999+'
                      : cartItemCount?.data?.item_count}
                  </Text>
                </View>
              ) : null}
              <Image
                tintColor={!!focused ? themeColors?.primary_color : colors.inactiveText}
                style={styles.iconStyle}
                source={!!focused
                  ? imagePath.icEcomCart
                  : imagePath.icEcomCartInactive}
              />
            </View>
          ),
          unmountOnBlur: true,
          gestureEnabled: true,
        })}
      /> */}

      {brandTab}
      {celebTab}


      {/* {!!isEnableCategory ? <Tab.Screen
        component={CategoryStack}
        name={navigationStrings.CATEGORY}
        options={({ route }) => ({
          tabBarLabel: ({ focused }) => <Text style={getTextStyle(focused)}>{strings.CATEGORY}</Text>,
          tabBarIcon: ({ focused, tintColor }) => {
            return (
              <FastImage
                style={styles.iconStyle}
                tintColor={!!focused ? themeColors?.primary_color : colors.inactiveText}
                source={!!focused
                  ? imagePath.icCatActive
                  : imagePath.icCat}
              />
            )
          },
        })}
      /> : null} */}

      <Tab.Screen
        component={MyProfile}
        name={navigationStrings.MY_PROFILE}
        options={() => ({
          tabBarLabel: ({ focused }) => <Text style={getTextStyle(focused)}>{strings.MY_PROFILE}</Text>,
          tabBarIcon: ({ focused, tintColor }) => (
            <FastImage
            resizeMode='contain'
              style={{height:moderateScaleVertical(20),width:moderateScale(20),...styles.iconStyle}}
              tintColor={!!focused ? colors.white : colors.inactiveText}
              source={!!focused
                ? imagePath.myprofile
                : imagePath.myprofile}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
}

export function stylesData(params) {
  const { themeColors, appStyle } = useSelector((state) => state.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const styles = StyleSheet.create({
    cartItemCountView: {
      position: 'absolute',
      zIndex: 100,
      backgroundColor: colors.cartItemPrice,
      borderRadius: moderateScale(6),
      alignItems: 'center',
      justifyContent: 'center'
    },
    cartItemCountNumber: {
      fontFamily: fontFamily?.bold,
      color: colors.white,
      fontSize: textScale(8),
    },
    tabBarLabelStyle: {
      textTransform: 'capitalize',
      // fontFamily: fontFamily?.medium,
      fontSize: textScale(12),
      color: colors.black,
      // marginVertical: moderateScaleVertical(4),
      marginBottom:moderateScaleVertical(16)
    },
    iconStyle: {
      // height: moderateScale(24),
      // width: moderateScale(24),
      marginTop: moderateScaleVertical(10),
    }
  });
  return styles;
}
