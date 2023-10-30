import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import Geocoder from 'react-native-geocoding';
import { useSelector } from 'react-redux';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import {
    androidBackButtonHandler,
    getCurrentLocation,
    showError
} from '../../utils/helperFunctions';
import { chekLocationPermission } from '../../utils/permissions';
import socketServices from '../../utils/scoketService';
import TaxiDashboard from './Comps/TaxiDashboard';

export default function TaxiHome({ route, navigation }) {

    const paramData = route?.params;

    const { location, dineInType, appMainData } = useSelector(
        (state) => state?.home,
    );
    const { cartItemCount } = useSelector((state) => state?.cart);
    const {
        appData,
        currencies,
        languages,
        themeColor,
        themeToggle,
        redirectedFrom
    } = useSelector((state) => state?.initBoot);
    const { userData } = useSelector((state) => state?.auth);
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    const [state, setState] = useState({
        isLoading: true,
        isRefreshing: false,
        selectedTabType: '',
        updateTime: 0,
        locationObj: {},
    });

    const {
        updateTime,
        isLoading,
        isRefreshing,
        selectedTabType,
        locationObj,
    } = state;

    //update state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    //Naviagtion to specific screen
    const moveToNewScreen =
        (screenName, data = {}) =>
            () => {
                navigation.navigate(screenName, { data });
            };

    useFocusEffect(
        React.useCallback(() => {
            updateState({ isLoading: true });

            chekLocationPermission(true)
                .then((result) => {
                    if (result !== 'goback') {
                        getCurrentLocation('home')
                            .then((res) => {
                                if (
                                    appMainData &&
                                    typeof appMainData?.reqData == 'object' &&
                                    appMainData?.reqData?.latitude &&
                                    (location?.latitude == '' || location?.longitude == '')
                                ) {
                                    const data = {
                                        address: appMainData?.reqData?.address,
                                        latitude: appMainData?.reqData?.latitude,
                                        longitude: appMainData?.reqData?.longitude,
                                    };
                                    actions.locationData(res);
                                    updateState({ locationObj: res, isLoading: false });
                                } else {
                                    updateState({ locationObj: res });
                                    if (appData?.profile?.preferences?.is_hyperlocal) {
                                        if (!location?.address) {
                                            actions.locationData(res);
                                        }
                                    }
                                }
                            })
                            .catch((err) => {
                                updateState({ locationObj: location, isLoading: true }); // if user not gave location permission then we set pannel lat lng.
                            });
                    }
                })
                .catch((error) => console.log('error while accessing location', error));

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                androidBackButtonHandler,
            );
            return () => backHandler.remove();

        }, []),
    );

    useEffect(() => {
        Geocoder.init(appData?.profile?.preferences?.map_key, { language: 'en' }); // set the language
        initApiHit();
    }, []);

    useEffect(() => {
        if (!!userData?.auth_token && !!appData?.profile?.socket_url) {
            socketServices.initializeSocket(appData?.profile?.socket_url);
        }
    }, [appData]);

    useEffect(() => {
        if (updateTime) {
            homeData();
        }
    }, [updateTime]);

    useEffect(() => {
        if (
            paramData?.details &&
            paramData?.details?.formatted_address != location?.address
        ) {
            const address = paramData?.details?.formatted_address;
            const res = {
                address: address,
                latitude: paramData?.details?.geometry?.location.lat,
                longitude: paramData?.details?.geometry?.location.lng,
            };
            if (
                res?.latitude != location?.latitude &&
                res?.longitude != location?.longitude
            ) {
                if (cartItemCount?.data?.item_count) {
                    checkCartWithLatLang(res);
                } else {
                    updateLatLang(res);
                }
            } else {
                updateLatLang(res);
            }
        }
    }, [paramData?.details]);


    useEffect(() => {
        if (redirectedFrom == 'from_deepLinking') {
            navigation.navigate(navigationStrings.TRACKING)
        }

    }, [redirectedFrom])

    useEffect(() => {
        homeData();
    }, [selectedTabType, appData, dineInType]);

    const checkCartWithLatLang = (res) => {
        Alert.alert('', strings.THIS_WILL_REMOVE_CART, [
            {
                text: strings.CANCEL,
                onPress: () => console.log('Cancel Pressed'),
                // style: 'destructive',
            },
            { text: strings.CLEAR_CART2, onPress: () => clearCart(res) },
        ]);
    };

    const clearCart = (location) => {
        updateLatLang(location);
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
                actions.cartItemQty(res);
                homeData(location);
            })
            .catch(errorMethod);
    };

    const updateLatLang = (res) => {
        updateState({ updateTime: Math.random() });
        actions.locationData(res);
    };

    //Home data
    const homeData = () => {
        let latlongObj = {};
        if (appData?.profile?.preferences?.is_hyperlocal) {
            latlongObj = {
                address: locationObj?.address,
                latitude: locationObj?.latitude,
                longitude: locationObj?.longitude,
            };
        }

        var selectedVendorType = null;
        var defaultVendorType = null;

        if (!!appData?.profile && appData?.profile?.preferences?.vendorMode) {
            defaultVendorType = appData?.profile?.preferences?.vendorMode[0]?.type; //
            appData?.profile?.preferences?.vendorMode.forEach((val, i) => {
                if (val?.type == dineInType) {
                    selectedVendorType = val.type;
                }
            });
        }

        if (!selectedVendorType) {

            actions.dineInData(defaultVendorType);
        }
        actions
            .homeData(
                {
                    type: !!selectedVendorType ? selectedVendorType : defaultVendorType,
                    ...latlongObj,
                },
                {
                    code: appData?.profile?.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                    // ...latlongObj,
                },
            )
            .then((res) => {
                console.log(res, "<===res homeData");
                if (
                    appData?.profile?.preferences?.is_hyperlocal &&
                    location?.latitude == '' &&
                    location?.longitude == ''
                ) {
                    if (
                        typeof res?.data?.reqData == 'object' &&
                        res?.data?.reqData?.latitude &&
                        res?.data?.reqData?.longitude
                    ) {
                        const data = {
                            address: res?.data?.reqData?.address,
                            latitude: res?.data?.reqData?.latitude,
                            longitude: res?.data?.reqData?.longitude,
                        };
                        actions.locationData(data);
                    }
                } else {
                    if (
                        appData?.profile?.preferences?.is_hyperlocal &&
                        location?.latitude != '' &&
                        location?.longitude != ''
                    ) {
                    } else {
                        const data = {
                            address: '',
                            latitude: '',
                            longitude: '',
                        };
                        actions.locationData(data);
                    }
                }
                setTimeout(() => {
                    updateState({ isLoading: false, isRefreshing: false });
                }, 1000);
            })
            .catch(errorMethod);
    };

    //Error handling in screen
    const errorMethod = (error) => {
        console.log(error, '<===error inErrorMethod');
        updateState({ isLoading: false, isLoadingB: false, isRefreshing: false });
        showError(error?.message || error?.error);
    };

    //onPress Category
    const onPressCategory = (item) => {
        if (item.redirect_to == staticStrings.VENDOR) {
            moveToNewScreen(navigationStrings.VENDOR, item)();
        } else if (
            item.redirect_to == staticStrings.PRODUCT ||
            item.redirect_to == staticStrings.CATEGORY ||
            item.redirect_to == staticStrings.ONDEMANDSERVICE
        ) {
            moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
            if (!!userData?.auth_token) {
                actions.saveSchduleTime('now');
                moveToNewScreen(navigationStrings.ADDADDRESS, {
                    ...item,
                })();
            } else {
                actions.setAppSessionData('on_login');
            }
        } else if (item.redirect_to == staticStrings.DISPATCHER) {
        } else if (item.redirect_to == staticStrings.CELEBRITY) {
            moveToNewScreen(navigationStrings.CELEBRITY)();
        } else if (item.redirect_to == staticStrings.BRAND) {
            moveToNewScreen(navigationStrings.BRANDS)();
        } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
            moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
        } else if (!item.is_show_category || item.is_show_category) {
            item?.is_show_category
                ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
                    item,
                    rootProducts: true,
                    // categoryData: data,
                })()
                : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                    id: item?.id,
                    vendor: true,
                    name: item?.name,
                })();
        }
    };

    //On Press banner
    const bannerPress = (data) => {
        let item = {};
        if (data?.redirect_id) {
            if (data?.redirect_to == staticStrings.VENDOR) {
                item = {
                    ...data?.vendor,
                    redirect_to: data.redirect_to,
                };
            } else {
                item = {
                    id: data.redirect_id,
                    redirect_to: data.redirect_to,
                    name: data.redirect_name,
                };
            }

            if (data.redirect_to == staticStrings.VENDOR) {
                data?.is_show_category
                    ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
                        item,
                        rootProducts: true,
                        // categoryData: data,
                    })()
                    : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                        id: data.redirect_id,
                        vendor: true,
                        name: data.redirect_name,
                    })();
            } else if (data.redirect_to == staticStrings.CATEGORY) {
                moveToNewScreen(navigationStrings.PRODUCT_LIST, {
                    id: data.redirect_id,
                    // vendor: true,
                    name: data.redirect_name,
                })();
            }
        }
    };

    //Reloads the screen
    const initApiHit = () => {
        let header = {};
        if (languages?.primary_language?.id) {
            header = {
                code: appData?.profile?.code,
                language: languages?.primary_language?.id,
            };
        } else {
            header = {
                code: appData?.profile?.code,
            };
        }

        actions
            .initApp(
                {},
                header,
                true,
                currencies?.primary_currency,
                languages?.primary_language,
            )
            .then((res) => {
                console.log(res, 'initApp');
            })
            .catch((error) => {
                updateState({ isRefreshing: false });
            });
    };

    //Pull to refresh
    const handleRefresh = () => {
        updateState({ isRefreshing: true });
        initApiHit();
    };


    const selectedToggle = (type) => {
        actions.dineInData(type);
        updateState({
            selectedTabType: type,
        });
    };


    return (
        <View style={{
            flex: 1,
            backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
        }}>
            <TaxiDashboard
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                selectedToggle={selectedToggle}
                toggleData={appData}
                location={locationObj}
                currentLocation={locationObj}
            />
        </View>
    );
}