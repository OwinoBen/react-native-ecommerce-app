import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@gorhom/bottom-sheet';
import Voice from '@react-native-voice/voice';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AppLink from 'react-native-app-link';
import DeviceInfo from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import Geocoder from 'react-native-geocoding';
import { enableFreeze } from 'react-native-screens';
import { useSelector } from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import IconTextRow from '../../Components/IconTextRow';
import LaundryAddonModal from '../../Components/LaundryAddonModal';
import OoryksHeader from '../../Components/OoryksHeader';
import SelectSearchFromMap from '../../Components/SelectSearchFromMap';
import StopAcceptingOrderModal from '../../Components/StopAcceptingOrderModal';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { shortCodes } from '../../utils/constants/DynamicAppKeys';
import { getPlaceDetails } from '../../utils/googlePlaceApi';
import {
  androidBackButtonHandler,
  getAddressComponent,
  getCurrentLocation,
  showError
} from '../../utils/helperFunctions';
import { openAppSetting } from '../../utils/openNativeApp';
import { chekLocationPermission, onlyCheckLocationPermission } from '../../utils/permissions';
import socketServices from '../../utils/scoketService';
import DashBoardFiveV2ApiLoader from './DashBoardParts/DashBoardFiveV2ApiLoader';
import DashBoardHeaderFive from './DashBoardParts/DashBoardHeaderFive';
import DashBoardFiveV2Api from './DashBoardParts/DashBoardFiveV2Api';
import { isEmpty } from 'lodash';

enableFreeze(true);

export default function P2pOndemandHome({ route, navigation }) {
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
    userCurrentLocation
  } = useSelector(state => state?.initBoot);
  const { location, appMainData, dineInType, isLocationSearched } = useSelector(
    state => state?.home,
  );
  const fontFamily = appStyle?.fontSizeData;
  const { width, height } = Dimensions.get('window');


  const isFocused = useIsFocused();
  const { cartItemCount } = useSelector(state => state?.cart);
  const [selected, setSelected] = useState('');
  const [region, setRegion] = useState({
    latitude: 30.7333,
    longitude: 76.7794,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const { userData } = useSelector(state => state?.auth);
  const { pendingNotifications } = useSelector(
    state => state?.pendingNotifications,
  );

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const [isLaundryAddonModal, setLaundryAddonModal] = useState(false);
  const [isLoadingAddons, setLoadingAddons] = useState(true);
  const [selectedLaundryCategory, setSelectedLaundryCategory] = useState({});
  const [esitmatedLaundryProducts, setEsitmatedLaundryProducts] = useState([]);
  const [minMaxError, setMinMaxError] = useState([]);
  const [isOnPressed, setIsOnPressed] = useState(false);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState({});
  const [isLocationModal, setisLocationModal] = useState(false)
  const [isSelectViaMap, setisSelectViaMap] = useState(false)

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
    getLocationPermissionStatus()
  }, []);



  const getLocationPermissionStatus = () => {
    if (location?.address == "") {
      onlyCheckLocationPermission().then((res) => {
        setisLocationModal(false)
        onGetCurrentLoc()
      }).catch((err) => {
        setisLocationModal(true)
        homeData()
      })
    }
    else {

      homeData()
    }
  }



  const checkAndGetLocation = (isOpen = false) => {

    chekLocationPermission(true)
      .then(result => {
        console.log(result, "faskdjfkjashdf")
        if (result !== 'goback' && result == 'granted') {
          onGetCurrentLoc()
        } else if (result === "blocked") {
          Alert.alert("", "Location Permission disabled, allow it from settings", [
            {
              text: strings.CANCEL,
              onPress: () => console.log("Cancel Pressed"),
            },
            {
              text: strings.CONFIRM,
              onPress: openAppSetting,
            },
          ]);
        } else {
          homeData(null)
        }
      })
      .catch(error => {
        console.log('error while accessing location', error);
        console.log('api hit without lat lng');
        homeData();
        return;
      });

  }

  const onGetCurrentLoc = () => {
    getCurrentLocation('home')
      .then(curLoc => {
        console.log(curLoc, "fadsjhfds")
        setisLocationModal(false)
        updateState({
          curLatLong: curLoc,
        });
        actions.locationData(curLoc);
        homeData(curLoc);
        return;
      })
      .catch(err => {
        homeData();
        return;
      });

  }


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

  const checkCartWithLatLang = res => {
    Alert.alert('', strings.THIS_WILL_REMOVE_CART, [
      {
        text: strings.CANCEL,
        onPress: () => console.log('Cancel Pressed'),
        // style: 'destructive',
      },
      { text: strings.CLEAR_CART2, onPress: () => clearCart(res) },
    ]);
  };

  const clearCart = location => {
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
      .then(res => {
        actions.cartItemQty(res);
        homeData(location);
      })
      .catch(errorMethod);
  };

  const updateLatLang = res => {
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
      .then(res => {
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
        address: locationData?.address || location?.address || '',
        latitude: locationData?.latitude || location?.latitude || '',
        longitude: locationData?.longitude || location?.longitude || '',
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
        category_limit: 4
      };

      let apiHeader = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      console.log('sending api data header', apiData, apiHeader);

      actions
        .homeDataV2({ ...apiData, action: 2 }, apiHeader)
        .then(async res => {
          console.log('Home data++++++', res);
          updateState({ searchDataLoader: false });
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
          }, 1500);
        })
        .catch(errorMethod);
    }
  };

  //Error handling in screen
  const errorMethod = error => {
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

  let stater = {
    isVisible: false, //state of modal default false
  };
  //update state
  const updateState = data => setState(state => ({ ...state, ...data }));

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
      .then(res => { })
      .catch(err => {
        Linking.openURL('https://www.uber.com/in/en/');
        console.log('errro raised', err);
        // handle error
      });
  };

  const onPressVendor = item => {
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
  const onPressCategory = item => {
    if (item?.redirect_to == staticStrings.P2P || item?.redirect_to == staticStrings.RENTAL_SERVICE) {
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
  const bannerPress = data => {
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
      .then(res => {
        console.log(res, 'initApp');
        updateState({ isRefreshing: false });
      })
      .catch(error => {
        updateState({ isRefreshing: false });
      });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ isRefreshing: true });
    initApiHit();
  };

  const selcetedToggle = type => {
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

  const onVendorFilterSeletion = selectedFilter => {
    updateState({
      isLoadingB: true,
      openVendor: selectedFilter?.id == 1 ? 1 : 0,
      closeVendor: selectedFilter?.id == 2 ? 1 : 0,
      bestSeller: selectedFilter?.id == 3 ? 1 : 0,
      selectedFilterType: selectedFilter,
    });
    homeData(location, selectedFilter);
  };

  const onSpeechStartHandler = e => { };
  const onSpeechEndHandler = e => {
    updateState({
      isVoiceRecord: false,
    });
  };

  const onSpeechResultsHandler = e => {
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

  const onPressAddLaundryItem = item => {
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
      .then(res => {
        setLoadingAddons(false);
        setEsitmatedLaundryProducts(res?.data);
        setSelectedLaundryCategory(res?.data[0]);
        setLaundryAddonModal(true);
      })
      .catch(errorMethod);
  };

  const onPressLaundryCategory = item => {
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
    newSelectedAddonSet.map(item => {
      if (item?.estimate_addon_id == categoryDetails.estimate_addon_set?.id) {
        counter++;
      }
    });

    let selectedSetIndex = newSelectedAddonSet.findIndex(
      x => x?.id === item?.id,
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
    newAry.map(itm => {
      if (
        !selectedAddonSet.some(item => item?.estimate_addon_id == itm?.addon_id)
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

  const showAllProducts = item => {
    moveToNewScreen(navigationStrings.PRODUCT_LIST, {
      id: item?.data?.category_detail?.id,
      vendor: false,
      name:
        item?.data?.category_detail?.title || item?.data?.category_detail?.slug,
      isVendorList: false,
      fetchOffers: false,
      productWithSingleCategory: true,
    })();
  };

  const showAllSpotDealAndSelectedProducts = item => {
    console.log(item, 'selected product for spoatdeals');
    moveToNewScreen(
      navigationStrings.SPOTDEALPRODUCTSANDSELECTEDPRODUCTS,
      item,
    )();
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


  const addressDone = async (data_) => {
    setisLocationModal(false)

    let res = await getPlaceDetails(
      data_.place_id,
      profile?.preferences?.map_key,
    );
    const { result } = res;
    let addressData = getAddressComponent(result);
    let locData = {
      address: addressData?.address,
      latitude: addressData?.latitude,
      longitude: addressData?.longitude
    }

    setisSelectViaMap(false)
    actions.locationData(locData);
    homeData(locData)
  }




  const renderHomeScreen = () => {
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

        />
        <DashBoardFiveV2Api
          handleRefresh={() => handleRefresh()}
          bannerPress={item => bannerPress(item)}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          appMainData={appMainData}
          onPressCategory={item => {
            onPressCategory(item);
          }}
          onPressVendor={item => {
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
          showAllProducts={showAllProducts}
          showAllSpotDealAndSelectedProducts={
            showAllSpotDealAndSelectedProducts
          }
        />
      </>
    );
    // switch (appStyle?.homePageLayout) {
    // switch (5) {
    //   // switch (case_) {
    //   case 1:
    //     return (
    //       <>
    //         <DashBoardHeaderOne navigation={navigation} location={location} />
    //         {dineInType == 'pick_drop' ? (
    //           <TaxiHomeDashbord
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => onPressCategory(item)}
    //             toggleData={appData}
    //             location={location}
    //             curLatLong={curLatLong}
    //           />
    //         ) : (
    //           <DashBoardOne
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             tempCartData={tempCartData}
    //             onPressCategory={(item) => onPressCategory(item)}
    //             onPressVendor={(item) => {
    //               onPressVendor(item);
    //             }}
    //             selcetedToggle={selcetedToggle}
    //             toggleData={appData}
    //             navigation={navigation}
    //             onClose={_closeModal}
    //             onPressSubscribe={_onPressSubscribe}
    //             isSubscription={isSubscription}
    //           />
    //         )}
    //       </>
    //     );

    //   case 2:
    //     return (
    //       <>
    //         <DashBoardHeaderOne navigation={navigation} location={location} />
    //         {dineInType == 'pick_drop' ? (
    //           <TaxiHomeDashbord
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => onPressCategory(item)}
    //             toggleData={appData}
    //             location={location}
    //             curLatLong={curLatLong}
    //           />
    //         ) : (
    //           <DashBoardFour
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => {
    //               onPressCategory(item);
    //             }}
    //             onPressVendor={(item) => {
    //               onPressVendor(item);
    //             }}
    //             tempCartData={tempCartData}
    //             selcetedToggle={selcetedToggle}
    //             toggleData={appData}
    //             navigation={navigation}
    //             onClose={_closeModal}
    //             onPressSubscribe={_onPressSubscribe}
    //             isSubscription={isSubscription}
    //           />
    //         )}
    //       </>
    //     );
    //   case 3:
    //     if (getBundleId() === appIds.onTheWheel) {
    //       return (
    //         <>
    //           <DashBoardHeaderSix
    //             showToggles={false}
    //             navigation={navigation}
    //             location={location}
    //             selcetedToggle={selcetedToggle}
    //             toggleData={appData}
    //             isLoading={isLoading}
    //             currentLocation={currentLocation}
    //             isLoadingB={isLoadingB}
    //             _onVoiceListen={_onVoiceListen}
    //             isVoiceRecord={isVoiceRecord}
    //             _onVoiceStop={_onVoiceStop}
    //           />

    //           {dineInType == 'pick_drop' ? (
    //             <TaxiHomeDashbord
    //               handleRefresh={() => handleRefresh()}
    //               bannerPress={(item) => bannerPress(item)}
    //               isLoading={isLoading}
    //               isRefreshing={isRefreshing}
    //               appMainData={appMainData}
    //               onPressCategory={(item) => onPressCategory(item)}
    //               toggleData={appData}
    //               location={location}
    //               curLatLong={curLatLong}
    //             />
    //           ) : (
    //             <DashBoardNine
    //               handleRefresh={() => handleRefresh()}
    //               bannerPress={(item) => bannerPress(item)}
    //               isLoading={isLoading}
    //               isRefreshing={isRefreshing}
    //               appMainData={appMainData}
    //               onPressCategory={(item) => {
    //                 onPressCategory(item);
    //               }}
    //               onPressVendor={(item) => {
    //                 onPressVendor(item);
    //               }}
    //               isDineInSelected={isDineInSelected}
    //               selcetedToggle={selcetedToggle}
    //               tempCartData={tempCartData}
    //               toggleData={appData}
    //               navigation={navigation}
    //               onVendorFilterSeletion={onVendorFilterSeletion}
    //               singleVendor={singleVendor}
    //               onPressAddLaundryItem={onPressAddLaundryItem}
    //               isLoadingAddons={isLoadingAddons}
    //               selectedHomeCategory={selectedHomeCategory}
    //             />
    //           )}
    //         </>
    //       );
    //     } else {
    //       return (
    //         <>
    //           <DashBoardHeaderFive
    //             showToggles={false}
    //             navigation={navigation}
    //             location={location}
    //             selcetedToggle={selcetedToggle}
    //             toggleData={appData}
    //             isLoading={isLoading}
    //             currentLocation={currentLocation}
    //             isLoadingB={isLoadingB}
    //             _onVoiceListen={_onVoiceListen}
    //             isVoiceRecord={isVoiceRecord}
    //             _onVoiceStop={_onVoiceStop}
    //           />

    //           {dineInType == 'pick_drop' ? (
    //             <TaxiHomeDashbord
    //               handleRefresh={() => handleRefresh()}
    //               bannerPress={(item) => bannerPress(item)}
    //               isLoading={isLoading}
    //               isRefreshing={isRefreshing}
    //               appMainData={appMainData}
    //               onPressCategory={(item) => onPressCategory(item)}
    //               toggleData={appData}
    //               location={location}
    //               curLatLong={curLatLong}
    //             />
    //           ) : (
    //             <DashBoardFive
    //               handleRefresh={() => handleRefresh()}
    //               bannerPress={(item) => bannerPress(item)}
    //               isLoading={isLoading}
    //               isRefreshing={isRefreshing}
    //               appMainData={appMainData}
    //               onPressCategory={(item) => {
    //                 onPressCategory(item);
    //               }}
    //               onPressVendor={(item) => {
    //                 onPressVendor(item);
    //               }}
    //               isDineInSelected={isDineInSelected}
    //               selcetedToggle={selcetedToggle}
    //               tempCartData={tempCartData}
    //               toggleData={appData}
    //               navigation={navigation}
    //               onVendorFilterSeletion={onVendorFilterSeletion}
    //               singleVendor={singleVendor}
    //               onPressAddLaundryItem={onPressAddLaundryItem}
    //               isLoadingAddons={isLoadingAddons}
    //               selectedHomeCategory={selectedHomeCategory}
    //               selectedFilterType={selectedFilterType}
    //             />
    //             // <DashBoardFive2
    //             //   handleRefresh={() => handleRefresh()}
    //             //   bannerPress={(item) => bannerPress(item)}
    //             //   isLoading={isLoading}
    //             //   isRefreshing={isRefreshing}
    //             //   appMainData={appMainData}
    //             //   onPressCategory={(item) => {
    //             //     onPressCategory(item);
    //             //   }}
    //             //   onPressVendor={(item) => {
    //             //     onPressVendor(item);
    //             //   }}
    //             //   isDineInSelected={isDineInSelected}
    //             //   selcetedToggle={selcetedToggle}
    //             //   tempCartData={tempCartData}
    //             //   toggleData={appData}
    //             //   navigation={navigation}
    //             //   onVendorFilterSeletion={onVendorFilterSeletion}
    //             //   singleVendor={singleVendor}
    //             //   onPressAddLaundryItem={onPressAddLaundryItem}
    //             //   isLoadingAddons={isLoadingAddons}
    //             //   selectedHomeCategory={selectedHomeCategory}
    //             //   selectedFilterType={selectedFilterType}
    //             // />
    //           )}
    //         </>
    //       );
    //     }

    //   case 4:
    //     return (
    //       <>
    //         <DashBoardHeaderFour
    //           showToggles={false}
    //           navigation={navigation}
    //           location={location}
    //           selcetedToggle={selcetedToggle}
    //           toggleData={appData}
    //           isLoading={isLoading}
    //         />
    //         {dineInType == 'pick_drop' ? (
    //           <TaxiHomeDashbord
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => onPressCategory(item)}
    //             toggleData={appData}
    //             location={location}
    //             curLatLong={curLatLong}
    //           />
    //         ) : (
    //           <DashBoardSix
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => {
    //               onPressCategory(item);
    //             }}
    //             onPressVendor={(item) => {
    //               onPressVendor(item);
    //             }}
    //             tempCartData={tempCartData}
    //             isDineInSelected={isDineInSelected}
    //             selcetedToggle={selcetedToggle}
    //             toggleData={appData}
    //             navigation={navigation}
    //             onClose={_closeModal}
    //             onPressSubscribe={_onPressSubscribe}
    //             isSubscription={isSubscription}
    //           />
    //         )}
    //       </>
    //     );

    //   case 5:
    //     return (
    //       <>
    //         <DashBoardHeaderFive
    //           showToggles={false}
    //           navigation={navigation}
    //           location={location}
    //           selcetedToggle={selcetedToggle}
    //           toggleData={appData}
    //           isLoading={isLoading}
    //           currentLocation={currentLocation}
    //           isLoadingB={isLoadingB}
    //           _onVoiceListen={_onVoiceListen}
    //           isVoiceRecord={isVoiceRecord}
    //           _onVoiceStop={_onVoiceStop}
    //         />
    //         {dineInType == 'pick_drop' ? (
    //           <TaxiHomeDashbord
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => onPressCategory(item)}
    //             toggleData={appData}
    //             location={location}
    //             curLatLong={curLatLong}
    //           />
    //         ) : (
    //           <DashBoardFive
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => {
    //               onPressCategory(item);
    //             }}
    //             onPressVendor={(item) => {
    //               onPressVendor(item);
    //             }}
    //             isDineInSelected={isDineInSelected}
    //             selcetedToggle={selcetedToggle}
    //             tempCartData={tempCartData}
    //             toggleData={appData}
    //             navigation={navigation}
    //             onVendorFilterSeletion={onVendorFilterSeletion}
    //             singleVendor={singleVendor}
    //             onPressAddLaundryItem={onPressAddLaundryItem}
    //             isLoadingAddons={isLoadingAddons}
    //             selectedHomeCategory={selectedHomeCategory}
    //             onClose={_closeModal}
    //             onPressSubscribe={_onPressSubscribe}
    //             isSubscription={isSubscription}
    //             selectedFilterType={selectedFilterType}
    //           />
    //           // <DashBoardFive2
    //           //   handleRefresh={() => handleRefresh()}
    //           //   bannerPress={(item) => bannerPress(item)}
    //           //   isLoading={isLoading}
    //           //   isRefreshing={isRefreshing}
    //           //   appMainData={appMainData}
    //           //   onPressCategory={(item) => {
    //           //     onPressCategory(item);
    //           //   }}
    //           //   onPressVendor={(item) => {
    //           //     onPressVendor(item);
    //           //   }}
    //           //   isDineInSelected={isDineInSelected}
    //           //   selcetedToggle={selcetedToggle}
    //           //   tempCartData={tempCartData}
    //           //   toggleData={appData}
    //           //   navigation={navigation}
    //           //   onVendorFilterSeletion={onVendorFilterSeletion}
    //           //   singleVendor={singleVendor}
    //           //   onPressAddLaundryItem={onPressAddLaundryItem}
    //           //   isLoadingAddons={isLoadingAddons}
    //           //   selectedHomeCategory={selectedHomeCategory}
    //           //   onClose={_closeModal}
    //           //   onPressSubscribe={_onPressSubscribe}
    //           //   isSubscription={isSubscription}
    //           //   selectedFilterType={selectedFilterType}
    //           // />
    //         )}
    //       </>
    //     );
    //   case 6:
    //     return (
    //       <>
    //         <DashBoardHeaderFive
    //           showToggles={false}
    //           navigation={navigation}
    //           location={location}
    //           selcetedToggle={selcetedToggle}
    //           toggleData={appData}
    //           isLoading={isLoading}
    //           currentLocation={currentLocation}
    //           isLoadingB={isLoadingB}
    //           _onVoiceListen={_onVoiceListen}
    //           isVoiceRecord={isVoiceRecord}
    //           _onVoiceStop={_onVoiceStop}
    //         />
    //         {dineInType == 'pick_drop' ? (
    //           <TaxiHomeDashbord
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => onPressCategory(item)}
    //             toggleData={appData}
    //             location={location}
    //             curLatLong={curLatLong}
    //           />
    //         ) : (
    //           <DashBoardEight
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => {
    //               onPressCategory(item);
    //             }}
    //             onPressVendor={(item) => {
    //               onPressVendor(item);
    //             }}
    //             isDineInSelected={isDineInSelected}
    //             selcetedToggle={selcetedToggle}
    //             tempCartData={tempCartData}
    //             toggleData={appData}
    //             navigation={navigation}
    //             onVendorFilterSeletion={onVendorFilterSeletion}
    //             singleVendor={singleVendor}
    //             onClose={_closeModal}
    //             onPressSubscribe={_onPressSubscribe}
    //             isSubscription={isSubscription}
    //             selectedFilterType={selectedFilterType}
    //           />
    //         )}
    //       </>
    //     );

    //   case 7:
    //     return (
    //       <>
    //         <DashBoardHeaderSix
    //           showToggles={false}
    //           navigation={navigation}
    //           location={location}
    //           selcetedToggle={selcetedToggle}
    //           toggleData={appData}
    //           isLoading={isLoading}
    //           currentLocation={currentLocation}
    //           isLoadingB={isLoadingB}
    //           _onVoiceListen={_onVoiceListen}
    //           isVoiceRecord={isVoiceRecord}
    //           _onVoiceStop={_onVoiceStop}
    //         />

    //         {dineInType == 'pick_drop' ? (
    //           <TaxiHomeDashbord
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => onPressCategory(item)}
    //             toggleData={appData}
    //             location={location}
    //             curLatLong={curLatLong}
    //           />
    //         ) : (
    //           <DashBoardNine
    //             handleRefresh={() => handleRefresh()}
    //             bannerPress={(item) => bannerPress(item)}
    //             isLoading={isLoading}
    //             isRefreshing={isRefreshing}
    //             appMainData={appMainData}
    //             onPressCategory={(item) => {
    //               onPressCategory(item);
    //             }}
    //             onPressVendor={(item) => {
    //               onPressVendor(item);
    //             }}
    //             isDineInSelected={isDineInSelected}
    //             selcetedToggle={selcetedToggle}
    //             tempCartData={tempCartData}
    //             toggleData={appData}
    //             navigation={navigation}
    //             onVendorFilterSeletion={onVendorFilterSeletion}
    //             singleVendor={singleVendor}
    //             onPressAddLaundryItem={onPressAddLaundryItem}
    //             isLoadingAddons={isLoadingAddons}
    //             selectedHomeCategory={selectedHomeCategory}
    //           />
    //         )}
    //       </>
    //     );
    //   case 8:
    //     return (
    //       <>
    //         <DashBoardHeaderSeven
    //           showToggles={false}
    //           navigation={navigation}
    //           location={location}
    //           selcetedToggle={selcetedToggle}
    //           toggleData={appData}
    //           isLoading={isLoading}
    //           currentLocation={currentLocation}
    //           isLoadingB={isLoadingB}
    //           _onVoiceListen={_onVoiceListen}
    //           isVoiceRecord={isVoiceRecord}
    //           _onVoiceStop={_onVoiceStop}
    //           curLatLong={curLatLong}
    //         />

    //         <DashBoardTen
    //           handleRefresh={() => handleRefresh()}
    //           bannerPress={(item) => bannerPress(item)}
    //           isLoading={isLoading}
    //           isRefreshing={isRefreshing}
    //           appMainData={appMainData}
    //           onPressCategory={(item) => {
    //             onPressCategory(item);
    //           }}
    //           onPressVendor={(item) => {
    //             onPressVendor(item);
    //           }}
    //           isDineInSelected={isDineInSelected}
    //           selcetedToggle={selcetedToggle}
    //           tempCartData={tempCartData}
    //           toggleData={appData}
    //           navigation={navigation}
    //           onVendorFilterSeletion={onVendorFilterSeletion}
    //           singleVendor={singleVendor}
    //           onPressAddLaundryItem={onPressAddLaundryItem}
    //           isLoadingAddons={isLoadingAddons}
    //           selectedHomeCategory={selectedHomeCategory}
    //           onClose={_closeModal}
    //           onPressSubscribe={_onPressSubscribe}
    //           isSubscription={isSubscription}
    //           selectedFilterType={selectedFilterType}
    //         />
    //       </>
    //     );
    // }
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
      statusBarColor={colors.white}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.white
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
      <Modal visible={isLocationModal} onDismiss={() => setisSelectViaMap(false)} transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            width: WINDOW_WIDTH,
            height: WINDOW_HEIGHT,
          }}>
          <View
            style={{
              alignSelf: 'center',
              marginTop: moderateScaleVertical(106),
              height: moderateScaleVertical(167),
              backgroundColor: colors.white,
              width: moderateScale(312),
            }}>
            <View style={{ marginHorizontal: moderateScale(21) }}>
              <IconTextRow
                icon={imagePath.ic_map}
                containerStyle={{ marginTop: moderateScaleVertical(26) }}
                textStyle={{
                  color: colors.black,
                  marginLeft: moderateScale(12),
                }}
                text="Please provide your location."
              />
              <GradientButton
                onPress={checkAndGetLocation}
                leftImgSrc={imagePath.ic_map}
                leftImgStyle={{
                  resizeMode: 'contain',
                  height: moderateScaleVertical(20),
                  width: moderateScale(20),
                }}
                btnText="Allow to track Current Location"
                textStyle={{ color: colors.white, fontSize: textScale(12) }}
                containerStyle={{
                  backgroundColor: colors.orangeBtn,
                  marginTop: moderateScaleVertical(14),
                  borderRadius: 4,
                  height: moderateScaleVertical(36),
                }}
              />
              <TouchableOpacity
                style={{
                  marginTop: moderateScaleVertical(11),
                  height: moderateScaleVertical(36),
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: colors.profileInputborder,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: moderateScaleVertical(12)
                }}
                onPress={() => {
                  setisSelectViaMap(true)
                }}>
                <Image source={imagePath.icoSearch} />
                <Text style={{
                  marginLeft: moderateScale(8),
                  color: colors.blackOpacity66,
                  fontSize: textScale(12),
                  fontFamily: fontFamily?.medium

                }}>Add Location Manually</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <Modal visible={isSelectViaMap}>
        <WrapperContainer>
          <OoryksHeader onPressLeft={() => setisSelectViaMap(false)} leftTitle='Add Your Location' isCustomLeftPress />

          <View style={{
            flex: 1,
            marginHorizontal: moderateScale(12),
            overflow: "hidden",
            borderRadius: moderateScale(12)
          }}>
            <SelectSearchFromMap
              addressDone={addressDone}
            />

          </View>
        </WrapperContainer>

      </Modal>
    </WrapperContainer>
  );
}
