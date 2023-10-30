import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Linking, SafeAreaView, StatusBar } from 'react-native';
import AppLink from 'react-native-app-link';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import Geocoder from 'react-native-geocoding';
import { useSelector } from 'react-redux';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import { appIds, shortCodes } from '../../utils/constants/DynamicAppKeys';

import Voice from '@react-native-voice/voice';

import LaundryAddonModal from '../../Components/LaundryAddonModal';
import StopAcceptingOrderModal from '../../Components/StopAcceptingOrderModal';
import {
  androidBackButtonHandler,
  getCurrentLocation,
  getImageUrl,
  getNearestLocation,
  showError
} from '../../utils/helperFunctions';
import { chekLocationPermission } from '../../utils/permissions';
import { DashBoardFiveV2Api, DashBoardHeaderFive, TaxiHomeDashbord } from './DashboardViews/Index';
import DashBoardHeaderEcommerce from './DashboardViews/DashBoardHeaderEcommerce';
import DashBoardHeaderSix from './DashboardViews/DashBoardHeaderSix';
import DashBoardHeaderOne from './DashboardViews/DashBoardHeaderOne';
import { DashBoardHeaderFour } from './DashboardViews/Index';
import DashBoardHeaderSeven from './DashboardViews/DashBoardHeaderSeven';
import socketServices from '../../utils/scoketService';
import { enableFreeze } from "react-native-screens";
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';
enableFreeze(true);


export default function Home({ route, navigation }) {
  const paramData = route?.params;
  const {
    appData,
    currencies,
    languages,
    appStyle,
    isDineInSelected,
    themeColor,
    themeToggle,
    allAddresss,
    themeColors
  } = useSelector((state) => state?.initBoot);
  const { location, appMainData, dineInType, isLocationSearched } = useSelector((state) => state?.home || {});

  const isFocused = useIsFocused();
  const animation = useSharedValue(0)
  const { cartItemCount } = useSelector((state) => state?.cart);

  const { userData } = useSelector((state) => state?.auth);
  const [nearestLocDis, setNearestLocDis] = useState(null)
  const { pendingNotifications } = useSelector((state) => state?.pendingNotifications || {});

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [isLaundryAddonModal, setLaundryAddonModal] = useState(false);
  const [isLoadingAddons, setLoadingAddons] = useState(true);
  const [selectedLaundryCategory, setSelectedLaundryCategory] = useState({});
  const [esitmatedLaundryProducts, setEsitmatedLaundryProducts] = useState([]);
  const [minMaxError, setMinMaxError] = useState([]);
  const [isOnPressed, setIsOnPressed] = useState(false);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState({});

  const [state, setState] = useState({
    isLoading: true,
    isRefreshing: false,
    selectedTabType: '',
    updateTime: 0,
    isDineInSelected: false,
    pageActive: 1,
    currentLocation: '',
    saveAllUserAddress: null,
    isLoadingB: false,
    searchDataLoader: false,
    openVendor: 0,
    closeVendor: 0,
    bestSeller: 0,
    tempCartData: null,
    isVoiceRecord: false,
    singleVendor: false,
    selectedAddonSet: [],
    unPresentAry: [],
    isSubscription: true,
    stopOrderModalVisible: true,
    curLatLong: null,
    selectedFilterType: {},
  });

  const {
    tempCartData,
    updateTime,
    isLoading,
    isRefreshing,
    selectedTabType,
    pageActive,
    currentLocation,
    saveAllUserAddress,
    isLoadingB,
    searchDataLoader,
    openVendor,
    closeVendor,
    bestSeller,
    selectedFilterType,
    isVoiceRecord,
    singleVendor,
    selectedAddonSet,
    unPresentAry,
    isSubscription,
    stopOrderModalVisible,
    curLatLong,
  } = state;

  const memorizedAppData = useMemo(() => appData, [appData])
  const memorizsedAppMainData = useMemo(() => appMainData, [appMainData])
  const memorizsedLocation = useMemo(() => location, [location])
  const memorizedSelectedTabType = useMemo(() => selectedTabType, [selectedTabType])
  const memorizedAllAddresss = useMemo(() => allAddresss, [allAddresss])
  const memorizedTempCartData = useMemo(() => tempCartData, [tempCartData])

  const { profile } = memorizedAppData;

  useLayoutEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, { language: 'en' }); // set the language
  }, []);

  useEffect(() => {
    chekLocationPermission(true)
      .then((result) => {
        if (result !== 'goback' && result == 'granted') {
          getCurrentLocation('home')
            .then((curLoc) => {
              updateState({
                curLatLong: curLoc,
                isLoading: true
              });
              let locData = location?.latitude ? location : curLoc;
              if (!!userData?.auth_token) {
                //IS LOGIN USER YES
                if (!!appData?.profile?.preferences?.is_hyperlocal) {
                  //YES
                  getAllAddress()
                    .then((savedAddress) => {
                      if (savedAddress.length > 0) {
                        let filterAddress = savedAddress.filter(
                          (val) => !!val?.latitude,
                        );

                        getNearestLocation(curLoc, filterAddress)
                          .then((nearestLoc) => {
                            //ifTab selected
                            if (isLocationSearched || isRefreshing) {
                              actions.locationData(locData);
                              homeData(locData);
                            } else {
                              actions.locationData(nearestLoc);
                              homeData(nearestLoc);
                            }
                          })
                          .catch((error) => {
                            actions.locationData(locData);
                            homeData(locData);
                          });

                        return;
                      } else {
                        actions.locationData(locData);
                        homeData(locData);
                        return;
                      }
                    })
                    .catch((error) => {
                      homeData(locData);
                      return;
                    });
                } else {
                  //NO
                  homeData();
                  return;
                }
              } else {
                //In case of guest user
                if (!!appData?.profile?.preferences?.is_hyperlocal) {
                  //YES
                  actions.locationData(locData);
                  homeData(locData);
                  return;
                } else {
                  //NO
                  homeData();
                  return;
                }
              }
              return;
            })
            .catch((err) => {
              homeData();
              return;
            });
        } else {
          if (appData?.profile?.preferences?.is_hyperlocal) {
            const data = {
              address: appData?.profile?.preferences?.Default_location_name,
              latitude: appData?.profile?.preferences?.Default_latitude,
              longitude: appData?.profile?.preferences?.Default_longitude,
            };
            if (!!data?.latitude) {
              actions.locationData(data);
              homeData(data);
              return;
            } else {
              homeData();
              return;
            }
          }
        }
      })
      .catch((error) => {
        console.log('error while accessing location', error);
        console.log('api hit without lat lng');
        homeData();
        return;
      });
  }, [memorizedSelectedTabType, memorizedAppData, memorizedAllAddresss])


  useEffect(() => {
    if (!!userData?.auth_token && !!appData?.profile?.socket_url) {
      socketServices.initializeSocket(appData?.profile?.socket_url);
    }
  }, [memorizedAppData]);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        androidBackButtonHandler,
      );
      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    updateState({ updatedData: memorizsedAppMainData?.categories });
  }, [memorizsedAppMainData]);

  useEffect(() => {
    if (
      paramData?.details &&
      paramData?.details?.formatted_address != location?.address
    ) {
      _getLocationFromParams();
      updateState({
        selectedFilterType: {},
      });
    }
  }, [paramData?.details]);

  useFocusEffect(
    useCallback(() => {
      Voice.onSpeechStart = onSpeechStartHandler;
      Voice.onSpeechEnd = onSpeechEndHandler;
      Voice.onSpeechResults = onSpeechResultsHandler;
      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (!!userData?.auth_token) {
        getAllTempOrders();
      }
    }, []),
  );


  const _getLocationFromParams = () => {
    actions.isLocationSearched(true);
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
  };

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
    actions.locationData(res);
    homeData(res);
  };

  //get All address
  const getAllAddress = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let res = await actions.getAddress({}, { code: appData?.profile?.code });
        if (!!res?.data) {
          resolve(res.data);
        } else {
          resolve(res);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  const getAllTempOrders = () => {
    actions
      .getAllTempOrders(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        if (res && res?.data) {
          updateState({
            tempCartData: res?.data,
          });
        }
      })
      .catch(errorMethod);
  };

  //Home data
  const homeData = (locationData = null, selectedFilter = null) => {
    if (!isFocused) {
      return;
    }
    if (!!paramData) {
      updateState({ searchDataLoader: true });
    }
    let latlongObj = {};

    if (!!locationData) {
      latlongObj = {
        address: locationData?.address || '',
        latitude: locationData?.latitude || '',
        longitude: locationData?.longitude || '',
      };
    }


    console.log("selectedFilterselectedFilter", selectedFilter)
    let vendorFilterData = {
      open_close_vendor: selectedFilter?.id == 2 ? 1 : 0
    };
    if (closeVendor == 0 && openVendor == 0 && bestSeller == 0) {
      updateState({ singleVendor: true });
    } else {
      updateState({ singleVendor: false });
    }

    {
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

      let vendorType = appStyle?.homePageLayout == 6 ? 'delivery' : !!selectedVendorType ? selectedVendorType : defaultVendorType
      let apiData = {
        type: vendorType,
        ...latlongObj,
        ...vendorFilterData,
        action: '2'
      };

      let apiHeader = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      console.log('sending api data header', apiData);

      actions
        .homeDataV2(apiData, apiHeader)
        .then(async (res) => {
          console.log('Home data++++++', res);
          updateState({ searchDataLoader: false, isRefreshing: false });

          const checkLayout = res?.data?.homePageLabels || []
          const filterCat = checkLayout.find(layout => layout?.slug == 'nav_categories')

          preLoadImages(filterCat)

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
          }
          updateState({
            isLoading: false,
            isLoadingB: false,
            searchDataLoader: false,
          });
        })
        .catch(errorMethod);
    }
  };


  const preLoadImages = useCallback((data) => {
    if (!!data?.data) {
      data.data.map((data) => {
        const imageURI = data?.icon
          ? getImageUrl(data.icon.image_fit, data.icon.image_path, `${80 + 140}/${80 + 140}`)
          : getImageUrl(data.image.image_fit, data.image.image_path, `${80 + 140}/${80 + 140}`);
        FastImage.preload([{ uri: imageURI }])
      });
    }
  }, [])

  //Error handling in screen
  const errorMethod = (error) => {
    setLoadingAddons(false);
    updateState({
      isLoading: false,
      isRefreshing: false,
      acceptLoader: false,
      rejectLoader: false,
      selectedOrder: null,
      isLoadingB: false,
      searchDataLoader: false,
    });
    showError(error?.message || error?.error);
  };

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const openUber = () => {
    let appName = 'Uber - Easy affordable trips';
    let appStoreLocale = '';
    let playStoreId = 'com.ubercab';
    let appStoreId = '368677368';
    AppLink.maybeOpenURL('uber://', {
      appName: appName,
      appStoreId: appStoreId,
      appStoreLocale: appStoreLocale,
      playStoreId: playStoreId,
    })
      .then((res) => { })
      .catch((err) => {
        Linking.openURL('https://www.uber.com/in/en/');
        console.log('errro raised', err);
        // handle error
      });
  };

  const onPressVendor = (item) => {

    if (item?.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          item['pickup_taxi'] = true;
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (!!item?.is_show_category) {
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
        item,
        rootProducts: true,
        // categoryData: data,
      })();
    } else {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        id: item?.id,
        vendor: true,
        name: item?.name,
        isVendorList: true,
        fetchOffers: true,
      })();
    }
  };
  //onPress Category
  const onPressCategory = (item) => {

    if (item?.redirect_to == staticStrings.P2P) {
      moveToNewScreen(navigationStrings.P2P_PRODUCTS, item)();
      return;
    }
    if (item?.redirect_to == staticStrings.FOOD_TEMPLATE) {
      moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();
      return;
    }
    if (item?.redirect_to == staticStrings.SUBCATEGORY && appStyle?.homePageLayout == 10) {
      moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();
      return;
    }


    if (item.redirect_to == staticStrings.VENDOR) {
      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY ||
      item.redirect_to == staticStrings.ONDEMANDSERVICE ||
      item?.redirect_to == staticStrings.LAUNDRY
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        fetchOffers: true,
        id: item.id,
        vendor:
          item.redirect_to == staticStrings.ONDEMANDSERVICE ||
            item.redirect_to == staticStrings.PRODUCT ||
            item?.redirect_to == staticStrings.LAUNDRY
            ? false
            : true,
        name: item.name,
        isVendorList: false,
      })();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          openUber();
        } else {
          item['pickup_taxi'] = true;
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, item)();
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
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
          isVendorList: true,
          fetchOffers: true,
        })();
      // moveToNewScreen(navigationStrings.VENDOR_DETAIL, {item})();
    }
  };

  //On Press banner
  const bannerPress = (data) => {
    let item = {};
    if (data?.redirect_id) {
      if (data?.redirect_to == staticStrings.VENDOR && data?.is_show_category) {
        moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: data.redirect_id,
          vendor: true,
          name: data.redirect_name,
          fetchOffers: true,
        })();
        return;
      }
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
            fetchOffers: true,
          })();
      } else if (data.redirect_to == staticStrings.CATEGORY) {
        if (data?.category?.type?.title == staticStrings.VENDOR) {
          let dat2 = data;
          dat2['id'] = data?.redirect_id;
          moveToNewScreen(navigationStrings.VENDOR, dat2)();
          return;
        } else {
          if (data?.category?.type?.title == staticStrings.PRODUCT) {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
            return;
            // let dat2 = data;
            // dat2['id'] = data?.redirect_id;
            // moveToNewScreen(navigationStrings.VENDOR, dat2)();
          }
          if (data.redirect_to == staticStrings.CATEGORY) {
            moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
              item,
              rootProducts: true,
              // categoryData: data,
            })();
            return;
          } else {
            moveToNewScreen(navigationStrings.PRODUCT_LIST, {
              id: data.redirect_id,
              // vendor: true,
              name: data.redirect_name,
              fetchOffers: true,
            })();
          }
        }
        if (data.redirect_to == staticStrings.CATEGORY) {
          moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
            item,
            rootProducts: true,
            // categoryData: data,
          })();
          return;
        }
      }
    }
  };

  //Reloads the screen
  const initApiHit = () => {
    let header = {};
    header = {
      code: appData?.profile?.code,
      language: languages?.primary_language?.id,
    };

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

  const selcetedToggle = (type) => {
    if (appStyle?.homePageLayout == 6 && getBundleId() === appIds?.dropOff) {
      actions.dineInData(type);
      navigation.navigate(navigationStrings.HOME_TEMP_3, { type: type })
      return;
    }
    actions.dineInData(type);
    updateState({
      selectedFilterType: {},
    });

    if (dineInType != type) {
      {
        updateState({
          selectedTabType: type,
          isLoadingB: true,
        });
      }
    } else {
      updateState({
        selectedTabType: type,
      });
    }
  };

  const onVendorFilterSeletion = (selectedFilter) => {
    updateState({
      isLoadingB: true,
      openVendor: selectedFilter?.id == 1 ? 1 : 0,
      closeVendor: selectedFilter?.id == 2 ? 1 : 0,
      bestSeller: selectedFilter?.id == 3 ? 1 : 0,
      selectedFilterType: selectedFilter,
    });
    homeData(location, selectedFilter);
  };

  const onSpeechStartHandler = (e) => { };
  const onSpeechEndHandler = (e) => {
    updateState({
      isVoiceRecord: false,
    });
  };

  const onSpeechResultsHandler = (e) => {
    let text = e.value[0];
    moveToNewScreen(navigationStrings.SEARCHPRODUCTOVENDOR, {
      voiceInput: text,
    })();
    _onVoiceStop();
  };

  const _onVoiceListen = async () => {
    const langType = languages?.primary_language?.sort_code;
    updateState({
      isVoiceRecord: true,
    });
    try {
      await Voice.start(langType);
    } catch (error) { }
  };

  const _onVoiceStop = async () => {
    updateState({
      isVoiceRecord: false,
    });
    try {
      await Voice.stop();
    } catch (error) {
      console.log('error raised', error);
    }
  };

  const onPressAddLaundryItem = (item) => {
    setSelectedHomeCategory(item);
    setLoadingAddons(true);
    updateState({
      selectedAddonSet: [],
    });
    let url = `?category_id=${item?.id}`;
    actions
      .getProductEstimationWithAddons(
        url,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        setLoadingAddons(false);
        setEsitmatedLaundryProducts(res?.data);
        setSelectedLaundryCategory(res?.data[0]);
        setLaundryAddonModal(true);
      })
      .catch(errorMethod);
  };

  const onPressLaundryCategory = (item) => {
    setIsOnPressed(false);
    setSelectedLaundryCategory(item);
    updateState({
      selectedAddonSet: [],
    });
  };

  const onLaundryAddonSelect = (item, categoryDetails) => {
    let newSelectedAddonSet = [...selectedAddonSet];
    let counter = 0;
    let maxSelectLimit = categoryDetails.estimate_addon_set?.max_select;
    newSelectedAddonSet.map((item) => {
      if (item?.estimate_addon_id == categoryDetails.estimate_addon_set?.id) {
        counter++;
      }
    });

    let selectedSetIndex = newSelectedAddonSet.findIndex(
      (x) => x?.id === item?.id,
    );

    item.estimate_product_id = categoryDetails?.estimate_product_id;

    if (selectedSetIndex == -1 && counter !== maxSelectLimit) {
      updateState({
        selectedAddonSet: [...newSelectedAddonSet, item],
      });

      return;
    } else if (selectedSetIndex == -1 && counter == maxSelectLimit) {
      updateState({
        selectedAddonSet: [item],
      });
    } else {
      let filteredAddonSet = newSelectedAddonSet.filter(
        (item, index) => index !== selectedSetIndex,
      );
      updateState({
        selectedAddonSet: filteredAddonSet,
      });
    }
  };

  const onFindVendors = () => {
    let newAry = [];
    selectedLaundryCategory?.estimate_product_addons.map((item, index) => {
      let newObj = {
        addon_id: item?.estimate_addon_id,
        min_select_count: item?.estimate_addon_set?.min_select,
        max_select_count: item?.estimate_addon_set?.max_select,
      };
      newAry[index] = newObj;
    });
    let unPresentItems = [];
    newAry.map((itm) => {
      if (
        !selectedAddonSet.some(
          (item) => item?.estimate_addon_id == itm?.addon_id,
        )
      ) {
        if (itm?.min_select_count !== 0) {
          unPresentItems.push(itm);
        }
      }
    });
    updateState({
      unPresentAry: unPresentItems,
    });
    setIsOnPressed(true);
    if (unPresentItems.length == 0) {
      onHideModal();
      moveToNewScreen(navigationStrings.LAUNDRY_AVAILABLE_VENDORS, {
        selectedAddonSet: selectedAddonSet,
      })();
    }
  };



  const showAllProducts = (item) => {

    moveToNewScreen(navigationStrings.PRODUCT_LIST, {
      id: item?.data?.category_detail?.id,
      vendor: false,
      name: item?.data?.category_detail?.title || item?.data?.category_detail?.slug,
      isVendorList: false,
      fetchOffers: false,
      productWithSingleCategory: true
    })();
  }

  const showAllSpotDealAndSelectedProducts = (item) => {
    console.log(item, "selected product for spoatdeals");
    moveToNewScreen(navigationStrings.SPOTDEALPRODUCTSANDSELECTEDPRODUCTS, item)();
  }

  const onHideModal = () => {
    setIsOnPressed(false);
    setLaundryAddonModal(false);
  };

  const _closeModal = () => {
    updateState({
      isSubscription: false,
    });
  };

  const _stopOrderModalClose = () => {
    updateState({
      stopOrderModalVisible: false,
    });
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    if (event.contentOffset.y > 170) {
      animation.value = 170
      return
    }
    animation.value = event.contentOffset.y

  })




  const renderHeaders = useCallback(() => {
    console.log(appStyle?.homePageLayout,"homePageLayout")
    switch (appStyle?.homePageLayout) {
      case 1:
        return (
        
          <SafeAreaView>
           
            <DashBoardHeaderOne navigation={navigation} location={memorizsedLocation} />
          </SafeAreaView>
        );

      case 2:
        return (
          <SafeAreaView>
            <DashBoardHeaderOne navigation={navigation} location={memorizsedLocation} />
          </SafeAreaView>
        );
      case 3:
        if (getBundleId() === appIds.onTheWheel) {
          return (
            <SafeAreaView>
              <DashBoardHeaderSix
                showToggles={false}
                navigation={navigation}
                location={memorizsedLocation}
                selcetedToggle={selcetedToggle}
                toggleData={memorizedAppData}
                isLoading={isLoading}
                currentLocation={currentLocation}
                isLoadingB={isLoadingB}
                _onVoiceListen={_onVoiceListen}
                isVoiceRecord={isVoiceRecord}
                _onVoiceStop={_onVoiceStop}
              />
            </SafeAreaView>
          );
        } else {
          return (
            <SafeAreaView>
              {console.log('curLatLong=>', curLatLong)}
              <DashBoardHeaderFive
                showToggles={false}
                navigation={navigation}
                location={memorizsedLocation}
                selcetedToggle={selcetedToggle}
                toggleData={memorizedAppData}
                isLoading={isLoading}
                currentLocation={curLatLong}
                isLoadingB={isLoadingB}
                _onVoiceListen={_onVoiceListen}
                isVoiceRecord={isVoiceRecord}
                _onVoiceStop={_onVoiceStop}
                nearestLoc={nearestLocDis}
                currentLoc={currentLocation}
              />
            </SafeAreaView>
          );
        }

      case 4:
        return (
          <SafeAreaView>
            <DashBoardHeaderFour
              showToggles={false}
              navigation={navigation}
              location={memorizsedLocation}
              selcetedToggle={selcetedToggle}
              toggleData={memorizedAppData}
              isLoading={isLoading}
            />

          </SafeAreaView>
        );

      case 5: // 5
        return (
          <SafeAreaView>
            <DashBoardHeaderFive
              showToggles={false}
              navigation={navigation}
              location={memorizsedLocation}
              selcetedToggle={selcetedToggle}
              toggleData={memorizedAppData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
              nearestLoc={nearestLocDis}
              currentLoc={currentLocation}
            />
          </SafeAreaView>
        );
      case 6:
        return (
          <SafeAreaView>
            <DashBoardHeaderFive
              showToggles={false}
              navigation={navigation}
              location={memorizsedLocation}
              selcetedToggle={selcetedToggle}
              toggleData={memorizedAppData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
              nearestLoc={nearestLocDis}
              currentLoc={currentLocation}
            />
          </SafeAreaView>
        );

      case 7:
        return (
          <SafeAreaView>
            <DashBoardHeaderFive
              showToggles={false}
              navigation={navigation}
              location={memorizsedLocation}
              selcetedToggle={selcetedToggle}
              toggleData={memorizedAppData}
              isLoading={isLoading}
              currentLocation={curLatLong}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
              nearestLoc={nearestLocDis}
              currentLoc={currentLocation}
            />
          </SafeAreaView>
        );

      case 10:
        return (
          <DashBoardHeaderEcommerce
            showToggles={false}
            navigation={navigation}
            location={memorizsedLocation}
            selcetedToggle={selcetedToggle}
            toggleData={memorizedAppData}
            isLoading={isLoading}
            currentLocation={currentLocation}
            isLoadingB={isLoadingB}
            _onVoiceListen={_onVoiceListen}
            isVoiceRecord={isVoiceRecord}
            _onVoiceStop={_onVoiceStop}
            animation={animation}
          />
        )

      case 8:
        return (
          <SafeAreaView>
            <DashBoardHeaderSeven
              showToggles={false}
              navigation={navigation}
              location={memorizsedLocation}
              selcetedToggle={selcetedToggle}
              toggleData={memorizedAppData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
              curLatLong={curLatLong}
            />
          </SafeAreaView>
        );

      default:
        return <SafeAreaView>
          <DashBoardHeaderFive
            showToggles={false}
            navigation={navigation}
            location={memorizsedLocation}
            selcetedToggle={selcetedToggle}
            toggleData={memorizedAppData}
            isLoading={isLoading}
            currentLocation={currentLocation}
            isLoadingB={isLoadingB}
            _onVoiceListen={_onVoiceListen}
            isVoiceRecord={isVoiceRecord}
            _onVoiceStop={_onVoiceStop}
          />
        </SafeAreaView>
    }
  }, [
    appStyle?.homePageLayout,
    memorizsedLocation,
    memorizedAppData,
    isLoading,
    currentLocation,
    isLoadingB,
    isVoiceRecord
  ])



  const renderHomeScreen = () => {
    return (
      <>
        {renderHeaders()}
        {dineInType == 'pick_drop' && appStyle?.homePageLayout !== 6 ?
          <TaxiHomeDashbord
            handleRefresh={() => handleRefresh()}
            bannerPress={(item) => bannerPress(item)}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            onPressCategory={(item) => onPressCategory(item)}

            appMainData={memorizsedAppMainData}
            toggleData={memorizedAppData}
            location={memorizsedLocation}

            curLatLong={curLatLong}
            currentLocation={currentLocation}
          /> :
          <DashBoardFiveV2Api
            handleRefresh={() => handleRefresh()}
            bannerPress={(item) => bannerPress(item)}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            appMainData={memorizsedAppMainData}
            onPressCategory={(item) => { onPressCategory(item) }}
            onPressVendor={(item) => { onPressVendor(item) }}
            isDineInSelected={isDineInSelected}
            selcetedToggle={selcetedToggle}
            tempCartData={memorizedTempCartData}
            toggleData={memorizedAppData}
            navigation={navigation}
            onVendorFilterSeletion={onVendorFilterSeletion}
            singleVendor={singleVendor}
            onPressAddLaundryItem={onPressAddLaundryItem}
            isLoadingAddons={isLoadingAddons}
            selectedHomeCategory={selectedHomeCategory}
            onClose={_closeModal}
            onPressSubscribe={_onPressSubscribe}
            isSubscription={isSubscription}
            selectedFilterType={selectedFilterType}
            showAllProducts={showAllProducts}
            showAllSpotDealAndSelectedProducts={showAllSpotDealAndSelectedProducts}
            showVendorCategory={true}
            scrollHandler={scrollHandler}
          />
        }
      </>
    );
  };

  useEffect(() => {
    if (!!userData?.auth_token) {
      (async () => {
        try {
          const res = await actions.allPendingOrders(
            `?limit=${10}&page=${pageActive}`,
            {},
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              // systemuser: DeviceInfo.getUniqueId(),
            },
          );
          console.log('pending res==>>>', res.data.order_list);
          let orders =
            pageActive == 1
              ? res.data.order_list.data
              : [...pendingNotifications, ...res.data.order_list.data];
          actions.pendingNotifications(orders);
        } catch (error) {
          console.log('erro rirased', error);
        }
      })();
    }
  }, []);

  const _onPressSubscribe = () => {
    moveToNewScreen(navigationStrings.SUBSCRIPTION)();
    updateState({
      isSubscription: false,
    });
  };




  return (
    <WrapperContainer
      statusBarColor={colors.whiteSmokeColor}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.whiteSmokeColor
      }
      isLoading={searchDataLoader}
      isSafeArea={appStyle?.homePageLayout == 8 || appStyle?.homePageLayout == 10 ? false : true}
    >
      <>{renderHomeScreen()}</>
      <LaundryAddonModal
        isVisible={isLaundryAddonModal}
        hideModal={onHideModal}
        // isLoadingAddons={isLoadingAddons}
        selectedLaundryCategory={selectedLaundryCategory}
        onPressLaundryCategory={onPressLaundryCategory}
        flatlistData={esitmatedLaundryProducts}
        onLaundryAddonSelect={onLaundryAddonSelect}
        selectedAddonSet={selectedAddonSet}
        onFindVendors={onFindVendors}
        minMaxError={minMaxError}
        isOnPressed={isOnPressed}
        selectedHomeCategory={selectedHomeCategory}
        unPresentAry={unPresentAry}
      />

      {!!memorizedAppData?.stop_order_acceptance_for_users && (
        <StopAcceptingOrderModal
          isVisible={stopOrderModalVisible}
          onClose={_stopOrderModalClose}
        />
      )}
    </WrapperContainer>
  );
}
