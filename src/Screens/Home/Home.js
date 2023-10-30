import Voice from '@react-native-voice/voice';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Linking, Text, TouchableOpacity } from 'react-native';
import AppLink from 'react-native-app-link';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import Geocoder from 'react-native-geocoding';
import { useSelector } from 'react-redux';
import LaundryAddonModal from '../../Components/LaundryAddonModal';
import StopAcceptingOrderModal from '../../Components/StopAcceptingOrderModal';
import WrapperContainer from '../../Components/WrapperContainer';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { MyDarkTheme } from '../../styles/theme';
import { appIds, shortCodes } from '../../utils/constants/DynamicAppKeys';
import {
  androidBackButtonHandler,
  getCurrentLocation,
  getNearestLocation,
  showError
} from '../../utils/helperFunctions';
import { chekLocationPermission } from '../../utils/permissions';
import DashBoardEight from './DashboardViews/DashBoardEight';
import DashBoardHeaderSeven from './DashboardViews/DashBoardHeaderSeven';
import DashBoardHeaderSix from './DashboardViews/DashBoardHeaderSix';
import DashBoardNine from './DashboardViews/DashBoardNine';


import { openBrowser } from '../../utils/openNativeApp';
import {
  DashBoardFive,
  DashBoardFour,
  DashBoardHeaderFive,
  DashBoardHeaderFour,
  DashBoardHeaderOne,
  DashBoardOne,
  DashBoardSix,
  DashBoardTen,
  TaxiHomeDashbord
} from './DashboardViews/Index';

import { enableFreeze } from "react-native-screens";
import socketServices from '../../utils/scoketService';
import BottomSheetModal from '../../Components/BottomSheetModal';
import { height, moderateScale, moderateScaleVertical, textScale } from '../../styles/responsiveSize';
import { View } from 'react-native-animatable';
import imagePath from '../../constants/imagePath';
import { Image } from 'react-native';
import Modal from "react-native-modal";
import styles from './styles';
import ButtonWithLoader from '../../Components/ButtonWithLoader';

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
    redirectedFrom,
    themeColors
  } = useSelector((state) => state?.initBoot);
  const { location, appMainData, dineInType, isLocationSearched } = useSelector(
    (state) => state?.home,
  );

  const isFocused = useIsFocused();
  const { cartItemCount } = useSelector((state) => state?.cart);

  const { userData } = useSelector((state) => state?.auth);
  const { pendingNotifications } = useSelector(
    (state) => state?.pendingNotifications,
  );

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;


  const [isLaundryAddonModal, setLaundryAddonModal] = useState(false);
  const [isLoadingAddons, setLoadingAddons] = useState(true);
  const [selectedLaundryCategory, setSelectedLaundryCategory] = useState({});
  const [esitmatedLaundryProducts, setEsitmatedLaundryProducts] = useState([]);
  const [minMaxError, setMinMaxError] = useState([]);
  const [isOnPressed, setIsOnPressed] = useState(false);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState({});
  const [nearestLocDis, setNearestLocDis] = useState(null)
  const [ispriceTypeModal, setIsPriceTypeModal] = useState(false)
  const [priceType, setPriceType] = useState('vendor')
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
    curLatLong: {},
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

  const { profile } = appData;



  useEffect(() => {
    if (!!userData?.auth_token && !!appData?.profile?.socket_url) {
      socketServices.initializeSocket(appData?.profile?.socket_url);
    }
  }, [appData]);

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
    updateState({ updatedData: appMainData?.categories });
  }, [appMainData]);

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

  useEffect(() => {
    if (redirectedFrom == 'from_deepLinking') {
      navigation.navigate(navigationStrings.TRACKING)
    }
  }, [redirectedFrom])



  useEffect(() => {
    chekLocationPermission(true)
      .then((result) => {
        if (result !== 'goback' && result == 'granted') {
          getCurrentLocation('home')
            .then((curLoc) => {
              updateState({
                curLatLong: curLoc,
                currentLocation: curLoc,
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
                            // if NearestLocation dis. is greareter than 500m 
                            if (nearestLoc?.distance >= 500) {
                              setNearestLocDis(nearestLoc)
                              actions.locationData(curLoc);
                              homeData(curLoc);
                              // return
                            } else {
                              //ifTab selected
                              setNearestLocDis(null)
                              if (isLocationSearched || isRefreshing) {
                                actions.locationData(locData);
                                homeData(locData);
                              } else {
                                actions.locationData(nearestLoc);
                                homeData(nearestLoc);
                              }
                            }
                          }
                          )
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
                  console.log(locData, "locDatalocData");
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
          else {
            homeData();
          }
        }
      })
      .catch((error) => {
        console.log('error while accessing location', error);
        console.log('api hit without lat lng');
        homeData();
        return;
      });
  }, [selectedTabType, appData, allAddresss]);

  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, { language: 'en' }); // set the language
  }, []);

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

        latitude: locationData?.latitude || 30.7333,
        longitude: locationData?.longitude || 76.7794

      };
    }

    let vendorFilterData = {
      open_vendor: selectedFilter?.id == 1 ? 1 : 0,
      close_vendor: selectedFilter?.id == 2 ? 1 : 0,
      best_vendor: selectedFilter?.id == 3 ? 1 : 0,
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


      let apiData = {
        type: !!selectedVendorType ? selectedVendorType : defaultVendorType,
        ...latlongObj,
        ...vendorFilterData,

      };
      let apiHeader = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        freelancer: priceType === "freelancer" ? 1 : 0
      };

      actions
        .homeData(apiData, apiHeader)
        .then(async (res) => {
          console.log('Home data++++++', res);
          updateState({ searchDataLoader: false, isLoading: false });
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
          setTimeout(() => {
            updateState({
              isLoading: false,
              isLoadingB: false,
              searchDataLoader: false,
            });
          }, 500);
        })
        .catch(errorMethod);
    }
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log(error, 'erro>>>>>>errorerrorr');
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
    if (!!appData?.profile?.preferences?.is_service_product_price_from_dispatch && priceType == "freelancer" && dineInType === "on_demand" && appStyle?.homePageLayout == 9) {
      moveToNewScreen(navigationStrings.FREELANCER_SERVICE, {
        id: item?.id,
        vendor: true,
        name: item?.name,
        isVendorList: true,
        fetchOffers: true,
        screenName: 'vendor'
      })();
      return
    }

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
        screenName: 'vendor'
      })();
    }
  };

  //onPress Category
  const onPressCategory = (item) => {

    if (!!appData?.profile?.preferences?.is_service_product_price_from_dispatch && priceType == "vendor" && dineInType === "on_demand" && appStyle?.homePageLayout == 9 && !!appData?.profile?.preferences?.is_service_price_selection) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        fetchOffers: true,
        id: item.id,
        vendor:
          item.redirect_to == staticStrings.ONDEMANDSERVICE ||
            item.redirect_to == staticStrings.PRODUCT ||
            item?.redirect_to == staticStrings.LAUNDRY ||
            item?.redirect_to == staticStrings.APPOINTMENT ||
            item?.redirect_to == staticStrings.RENTAL
            ? false
            : true,
        name: item.name,
        isVendorList: false,
      })();
      return
    }

    if (dineInType === "on_demand" && appStyle?.homePageLayout == 9) {

      moveToNewScreen(navigationStrings.FREELANCER_SERVICE, {
        fetchOffers: true,
        id: item.id,
        vendor: false,
        name: item.name,
        isVendorList: false,
      })();
      return
    }

    if (item?.redirect_to == staticStrings.P2P) {
      moveToNewScreen(navigationStrings.P2P_PRODUCTS, item)();
      return;
    }
    if (item?.redirect_to == staticStrings.FOOD_TEMPLATE) {
      moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();

      return;
    }
    if (item.redirect_to == staticStrings.VENDOR) {

      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY ||
      item.redirect_to == staticStrings.ONDEMANDSERVICE ||
      item?.redirect_to == staticStrings.LAUNDRY ||
      item?.redirect_to == staticStrings.APPOINTMENT ||
      item?.redirect_to == staticStrings.RENTAL
    ) {

      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        fetchOffers: true,
        id: item.id,
        vendor:
          item.redirect_to == staticStrings.ONDEMANDSERVICE ||
            item.redirect_to == staticStrings.PRODUCT ||
            item?.redirect_to == staticStrings.LAUNDRY ||
            item?.redirect_to == staticStrings.APPOINTMENT ||
            item?.redirect_to == staticStrings.RENTAL
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
          // if (item?.warning_page_id) {
          //   if (item?.warning_page_id == 2) {
          //     moveToNewScreen(navigationStrings.DELIVERY, item)();
          //   } else {
          //     moveToNewScreen(navigationStrings.HOMESCREENCOURIER, item)();
          //   }
          // } else {
          //   if (item?.template_type_id == 1) {
          //     moveToNewScreen(navigationStrings.SEND_PRODUCT, item)();
          //   } else {
          //     item['pickup_taxi'] = true;

          //     // moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
          //     moveToNewScreen(navigationStrings.HOMESCREENTAXI, item)();
          //   }
          // }
          item['pickup_taxi'] = true;
          // moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, item)();
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
    if (data?.redirect_to == "Url") {
      openBrowser(data?.link_url)
      return
    }
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
    let header = {
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
        updateState({ isRefreshing: false });
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

  const renderHomeScreen = () => {
    switch (appStyle?.homePageLayout) {
      case 1:
        return (
          <>
            <DashBoardHeaderOne navigation={navigation} location={location} />
            {dineInType == 'pick_drop' ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                location={location}
                curLatLong={curLatLong}
              />
            ) : (
              <DashBoardOne
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                tempCartData={tempCartData}
                onPressCategory={(item) => onPressCategory(item)}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                selcetedToggle={selcetedToggle}
                toggleData={appData}
                navigation={navigation}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            )}
          </>
        );

      case 2:
        return (
          <>
            <DashBoardHeaderOne navigation={navigation} location={location} />
            {dineInType == 'pick_drop' ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                location={location}
                curLatLong={curLatLong}
              />
            ) : (
              <DashBoardFour
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                tempCartData={tempCartData}
                selcetedToggle={selcetedToggle}
                toggleData={appData}
                navigation={navigation}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            )}
          </>
        );
      case 3:
        if (getBundleId() === appIds.onTheWheel) {
          return (
            <>
              <DashBoardHeaderSix
                showToggles={false}
                navigation={navigation}
                location={location}
                selcetedToggle={selcetedToggle}
                toggleData={appData}
                isLoading={isLoading}
                currentLocation={currentLocation}
                isLoadingB={isLoadingB}
                _onVoiceListen={_onVoiceListen}
                isVoiceRecord={isVoiceRecord}
                _onVoiceStop={_onVoiceStop}
              />

              {dineInType == 'pick_drop' ? (
                <TaxiHomeDashbord
                  handleRefresh={() => handleRefresh()}
                  bannerPress={(item) => bannerPress(item)}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  appMainData={appMainData}
                  onPressCategory={(item) => onPressCategory(item)}
                  toggleData={appData}
                  location={location}
                  curLatLong={curLatLong}
                  currentLocation={currentLocation}
                />
              ) : (
                <DashBoardNine
                  handleRefresh={() => handleRefresh()}
                  bannerPress={(item) => bannerPress(item)}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  appMainData={appMainData}
                  onPressCategory={(item) => {
                    onPressCategory(item);
                  }}
                  onPressVendor={(item) => {
                    onPressVendor(item);
                  }}
                  isDineInSelected={isDineInSelected}
                  selcetedToggle={selcetedToggle}
                  tempCartData={tempCartData}
                  toggleData={appData}
                  navigation={navigation}
                  onVendorFilterSeletion={onVendorFilterSeletion}
                  singleVendor={singleVendor}
                  onPressAddLaundryItem={onPressAddLaundryItem}
                  isLoadingAddons={isLoadingAddons}
                  selectedHomeCategory={selectedHomeCategory}
                />
              )}
            </>
          );
        } else {
          return (
            <>

              <DashBoardHeaderFive
                showToggles={false}
                navigation={navigation}
                location={location}
                selcetedToggle={selcetedToggle}
                toggleData={appData}
                isLoading={isLoading}
                currentLocation={curLatLong}
                isLoadingB={isLoadingB}
                _onVoiceListen={_onVoiceListen}
                isVoiceRecord={isVoiceRecord}
                _onVoiceStop={_onVoiceStop}
                nearestLoc={nearestLocDis}
                currentLoc={currentLocation}
                onSeviceType={() => setIsPriceTypeModal(true)}
              />

              {dineInType == 'pick_drop' ? (
                <TaxiHomeDashbord
                  handleRefresh={() => handleRefresh()}
                  bannerPress={(item) => bannerPress(item)}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  appMainData={appMainData}
                  onPressCategory={(item) => onPressCategory(item)}
                  toggleData={appData}
                  location={location}
                  curLatLong={curLatLong}
                  currentLocation={currentLocation}
                />
              ) : (
                <DashBoardFive
                  handleRefresh={() => handleRefresh()}
                  bannerPress={(item) => bannerPress(item)}
                  isLoading={isLoading}
                  isRefreshing={isRefreshing}
                  appMainData={appMainData}
                  onPressCategory={(item) => {
                    onPressCategory(item);
                  }}
                  onPressVendor={(item) => {
                    onPressVendor(item);
                  }}
                  isDineInSelected={isDineInSelected}
                  selcetedToggle={selcetedToggle}
                  tempCartData={tempCartData}
                  toggleData={appData}
                  navigation={navigation}
                  onVendorFilterSeletion={onVendorFilterSeletion}
                  singleVendor={singleVendor}
                  onPressAddLaundryItem={onPressAddLaundryItem}
                  isLoadingAddons={isLoadingAddons}
                  selectedHomeCategory={selectedHomeCategory}
                  selectedFilterType={selectedFilterType}
                />

              )}
            </>
          );
        }

      case 4:
        return (
          <>
            <DashBoardHeaderFour
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
            />
            {dineInType == 'pick_drop' ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                location={location}
                curLatLong={curLatLong}
                currentLocation={currentLocation}
              />
            ) : (
              <DashBoardSix
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                tempCartData={tempCartData}
                isDineInSelected={isDineInSelected}
                selcetedToggle={selcetedToggle}
                toggleData={appData}
                navigation={navigation}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
              />
            )}
          </>
        );

      case 5: // 5
        return (
          <>
            <DashBoardHeaderFive
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
              nearestLoc={nearestLocDis}
              currentLoc={currentLocation}
            />
            {dineInType == 'pick_drop' ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                location={location}
                curLatLong={curLatLong}
                currentLocation={currentLocation}
              />
            ) : (
              <DashBoardFive
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                isDineInSelected={isDineInSelected}
                selcetedToggle={selcetedToggle}
                tempCartData={tempCartData}
                toggleData={appData}
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
              />

            )}
          </>
        );
      case 6:
        return (
          <>
            <DashBoardHeaderFive
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
              nearestLoc={nearestLocDis}
              currentLoc={currentLocation}
            />
            {dineInType == 'pick_drop' ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                location={location}
                curLatLong={curLatLong}
                currentLocation={currentLocation}
              />
            ) : (
              <DashBoardEight
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                isDineInSelected={isDineInSelected}
                selcetedToggle={selcetedToggle}
                tempCartData={tempCartData}
                toggleData={appData}
                navigation={navigation}
                onVendorFilterSeletion={onVendorFilterSeletion}
                singleVendor={singleVendor}
                onClose={_closeModal}
                onPressSubscribe={_onPressSubscribe}
                isSubscription={isSubscription}
                selectedFilterType={selectedFilterType}
              />
            )}
          </>
        );

      case 7:
        return (
          <>
            <DashBoardHeaderSix
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
            />

            {dineInType == 'pick_drop' ? (
              <TaxiHomeDashbord
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => onPressCategory(item)}
                toggleData={appData}
                location={location}
                curLatLong={curLatLong}
                currentLocation={currentLocation}
              />
            ) : (
              <DashBoardNine
                handleRefresh={() => handleRefresh()}
                bannerPress={(item) => bannerPress(item)}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                appMainData={appMainData}
                onPressCategory={(item) => {
                  onPressCategory(item);
                }}
                onPressVendor={(item) => {
                  onPressVendor(item);
                }}
                isDineInSelected={isDineInSelected}
                selcetedToggle={selcetedToggle}
                tempCartData={tempCartData}
                toggleData={appData}
                navigation={navigation}
                onVendorFilterSeletion={onVendorFilterSeletion}
                singleVendor={singleVendor}
                onPressAddLaundryItem={onPressAddLaundryItem}
                isLoadingAddons={isLoadingAddons}
                selectedHomeCategory={selectedHomeCategory}
              />
            )}
          </>
        );
      case 8:
        return (
          <>
            <DashBoardHeaderSeven
              showToggles={false}
              navigation={navigation}
              location={location}
              selcetedToggle={selcetedToggle}
              toggleData={appData}
              isLoading={isLoading}
              currentLocation={currentLocation}
              isLoadingB={isLoadingB}
              _onVoiceListen={_onVoiceListen}
              isVoiceRecord={isVoiceRecord}
              _onVoiceStop={_onVoiceStop}
              curLatLong={curLatLong}
            />

            <DashBoardTen
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => {
                onPressCategory(item);
              }}
              onPressVendor={(item) => {
                onPressVendor(item);
              }}
              isDineInSelected={isDineInSelected}
              selcetedToggle={selcetedToggle}
              tempCartData={tempCartData}
              toggleData={appData}
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
            />
          </>
        );

      default:
        return <>
          <DashBoardHeaderFive
            showToggles={false}
            navigation={navigation}
            location={location}
            selcetedToggle={selcetedToggle}
            toggleData={appData}
            isLoading={isLoading}
            currentLocation={currentLocation}
            isLoadingB={isLoadingB}
            _onVoiceListen={_onVoiceListen}
            isVoiceRecord={isVoiceRecord}
            _onVoiceStop={_onVoiceStop}
            nearestLoc={nearestLocDis}
            currentLoc={currentLocation}
            onSeviceType={() => setIsPriceTypeModal(true)}
          />
          {dineInType == 'pick_drop' ? (
            <TaxiHomeDashbord
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => onPressCategory(item)}
              toggleData={appData}
              location={location}
              curLatLong={curLatLong}
              currentLocation={currentLocation}
            />
          ) : (
            <DashBoardFive
              handleRefresh={() => handleRefresh()}
              bannerPress={(item) => bannerPress(item)}
              isLoading={isLoading}
              isRefreshing={isRefreshing}
              appMainData={appMainData}
              onPressCategory={(item) => {
                onPressCategory(item);
              }}
              onPressVendor={(item) => {
                onPressVendor(item);
              }}
              isDineInSelected={isDineInSelected}
              selcetedToggle={selcetedToggle}
              tempCartData={tempCartData}
              toggleData={appData}
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
            />

          )}
        </>
    }
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

  const { blurRef } = useRef();

  return (
    <WrapperContainer
      statusBarColor={colors.backgroundGrey}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.statusbarColor
      }
      isLoading={searchDataLoader}>
      {/* <View style={{flex: 1}}>{}</View> */}
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

      {!!appData?.stop_order_acceptance_for_users && (
        <StopAcceptingOrderModal
          isVisible={stopOrderModalVisible}
          onClose={_stopOrderModalClose}
        />
      )}
      <Modal onBackdropPress={() => setIsPriceTypeModal(false)} isVisible={ispriceTypeModal}>
        <View style={{ height: moderateScaleVertical(170), backgroundColor: colors.white, borderRadius: moderateScale(12), padding: moderateScale(12) }}>
          <Text style={{
            fontFamily: fontFamily?.bold,
            fontSize: textScale(16)
          }}>{strings.SELECT_PRICE_TYPE}</Text>
          <View style={{
            margin: moderateScale(12)
          }}>
            <TouchableOpacity
              onPress={() => setPriceType("vendor")}
              style={{
                flexDirection: "row",
                alignItems: "center"
              }}>
              <Image source={priceType == "vendor" ? imagePath.icoRadioSelected : imagePath.icoRadioNonSelected} />
              <Text style={{
                fontFamily: fontFamily?.regular,
                fontSize: textScale(14),
                marginLeft: moderateScale(8)
              }}>{strings.FROM_VENDOR}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPriceType("freelancer")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: moderateScaleVertical(12)
              }}>
              <Image source={priceType == "freelancer" ? imagePath.icoRadioSelected : imagePath.icoRadioNonSelected} />
              <Text style={{
                fontFamily: fontFamily?.regular,
                fontSize: textScale(14),
                marginLeft: moderateScale(8)
              }}>{strings.FROM_FREELANCER}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setIsPriceTypeModal(false)
              updateState({
                searchDataLoader: true
              })
              homeData()
            }} style={{
              borderWidth: 1,
              borderColor: themeColors?.primary_color,
              height: 35,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-end",
              marginTop: moderateScale(10),
              paddingHorizontal: moderateScale(10)
            }}>
              <Text style={{
                color: themeColors?.primary_color
              }}>{strings.DONE}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
}

