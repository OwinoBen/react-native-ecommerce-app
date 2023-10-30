import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { View } from 'react-native-animatable';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import CustomBottomTabBarP2p from '../Components/CustomBottomTabBarP2p';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import { textScale } from '../styles/responsiveSize';
import AccountStack from './AccountStack';
import ChatStack from './ChatStack';
import HomeStackP2pOnDemand from './HomeStackP2pOnDemand';
import P2pOrderStack from './P2pOrderStack';
import PostStack from './PostStack';
import navigationStrings from './navigationStrings';
import P2pChatStack from './P2pChatStack';
import P2pPostStack from './P2pPostStack';

const Tab = createBottomTabNavigator();

let showBottomBar_ = true;

export default function TabRoutesOnDemandP2p(props) {
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
                component={HomeStackP2pOnDemand}
                name={navigationStrings.HOMESTACK}
                options={({ route, navigation }) => ({
                    tabBarVisible: getTabBarVisibility(route, navigation, [
                        navigationStrings.PRODUCT_LIST,
                        navigationStrings.PRODUCTDETAIL,
                        navigationStrings.ADDADDRESS,
                        navigationStrings.CHOOSECARTYPEANDTIMETAXI,
                        navigationStrings.P2P_PRODUCTS,
                        navigationStrings.P2P_PRODUCT_DETAIL,
                    ]),
                    tabBarLabel: strings.HOME,
                    tabBarIcon: ({ focused, tintColor }) => (
                        <Image
                            style={[
                                {
                                    tintColor: focused
                                        ? themeColors?.primary_color
                                        : undefined,
                                },
                            ]}
                            source={
                                imagePath.icHome
                            }
                        />
                    ),
                })}
            />

            <Tab.Screen
                component={P2pOrderStack}
                name={navigationStrings.P2P_ORDER_STACK}
                options={({ route, navigation }) => ({
                    tabBarVisible: getTabBarVisibility(route, navigation, [
                        navigationStrings.CHAT_SCREEN,
                    ]),
                    tabBarLabel: strings.ORDER,
                    tabBarIcon: ({ focused, tintColor }) => (
                        <Image
                            resizeMode="contain"
                            style={{
                                tintColor: focused
                                    ? themeColors?.primary_color
                                    : isDarkMode ? colors.grey1 : undefined,
                            }}
                            source={
                                focused ? imagePath.icOrdersActive : imagePath.icOrders
                            }
                        />
                    ),
                })}
            />

            <Tab.Screen
                component={P2pPostStack}
                name={navigationStrings.POST}
                options={({ route, navigation }) => ({
                    tabBarVisible: getTabBarVisibility(route, navigation, []),
                    tabBarLabel: "",
                    tabBarIcon: ({ focused, tintColor }) => (
                        <View style={{}}>
                            <Image
                                style={{
                                    position: 'absolute',
                                    top: -40,
                                    left: -29,
                                    height: 85,
                                    width: 85,
                                }}
                                source={imagePath.icAddPost}
                            />
                            <View
                                style={{
                                    height: 25,
                                    width: 25,
                                }} />
                        </View>
                    ),
                })}
            />

            <Tab.Screen
                component={P2pChatStack}
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
                                        : undefined,
                            }}
                            source={
                                focused ? imagePath.icChatActive : imagePath.ic_chat
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
                                        : undefined,
                            }}
                            source={imagePath.ic_account}
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
