
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-community/clipboard';
import NetInfo from '@react-native-community/netinfo';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useEffect, useRef, useState } from 'react';
// import { Linking, Platform } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FlashMessage from 'react-native-flash-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import NoInternetModal from './src/Components/NoInternetModal';
import NotificationModal from './src/Components/NotificationModal';
import strings from './src/constants/lang';
import Routes from './src/navigation/Routes';
import { updateInternetConnection } from './src/redux/actions/auth';
import store from './src/redux/store';
import types from './src/redux/types';
import PrinterScreen from './src/Screens/PrinterConnection/PrinterScreen';
import { getBundleId } from 'react-native-device-info';
import { MenuProvider } from 'react-native-popup-menu';
import actions from './src/redux/actions';

import { appIds } from './src/utils/constants/DynamicAppKeys';
import ForegroundHandler from './src/utils/ForegroundHandler';
// import { getUrlRoutes } from './src/utils/helperFunctions';
import {
  notificationListener,
  requestUserPermission,
} from './src/utils/notificationService';
import { getItem, getUserData, setItem, getLastBidInfo } from './src/utils/utils';




import { View, Text } from 'react-native';

import codePush from 'react-native-code-push';
import * as Progress from 'react-native-progress';
import Modal from 'react-native-modal';
import colors from './src/styles/colors';
import { moderateScale, moderateScaleVertical, textScale, width } from './src/styles/responsiveSize';
import { clearLastBidData } from './src/redux/actions/home';
import { setCountry } from './src/redux/actions/init';

let CodePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

const App = () => {
  const isDarkMode = useDarkMode();
  const [internetConnection, setInternet] = useState(true);
  const [progress, setProgress] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('red');

  const ConnectBTFunction = async () => {
    await AsyncStorage.removeItem('autoConnectEnabled');

    const temp = new PrinterScreen();

    AsyncStorage.getItem('BleDevice2').then((res) => {
      const tt = JSON.parse(res);
      temp.connectBTFunc({
        address: tt.boundAddress,
        name: tt.name,
      });
    });
    AsyncStorage.removeItem('BleDevice2');
  };


  if (!__DEV__) {
    console.log = () => null
  }


  // async function handleDynamicLink(deepLinkUrl) {
  //   console.log(deepLinkUrl, 'deepLinkUrldeepLinkUrsssl');
  //   if (deepLinkUrl != null) {
  //     setItem('deepLinkUrl', deepLinkUrl)
  //       .then((res) => {
  //         actions.setDeeplinkUrl(deepLinkUrl);
  //       })
  //       .catch((error) => {
  //         console.log(error, 'erroror');
  //       });

  //     let routeName = getUrlRoutes(deepLinkUrl, 2);
  //     console.log(routeName, 'routeName');
  //     if (routeName === 'vendor') {
  //       return;
  //     } else if (routeName === 'track') {
  //       openSpecificScreenByDeeplink(deepLinkUrl);
  //     }
  //   }
  // }

  //open screens based on deep link url
  const openSpecificScreenByDeeplink = async (deepLinkUrl) => {
    const userData = await getUserData();
    if (userData?.auth_token && deepLinkUrl) {

      actions.setRedirection('from_deepLinking');
      actions.setAppSessionData('shortcode');

    } else {
      setTimeout(() => {
        actions.setAppSessionData('on_login');
      }, 1000);
    }
  };




  useEffect(() => {
    //stop splashs screen from loading
    if (
      getBundleId() == appIds.masa ||
      getBundleId() == appIds.muvpod ||
      getBundleId() == appIds.hezniTaxi ||
      getBundleId() == appIds.flank ||
      getBundleId() == appIds.parcelworks ||
      getBundleId() == appIds.stabex
    ) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 200);
    } else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
    }
    if (Platform.OS == 'android') {
      AsyncStorage.getItem('autoConnectEnabled').then((res) => {
        if (res !== null) {
          ConnectBTFunction();
        }
      });
    }
  }, []);

  const notificationConfig = () => {
    requestUserPermission();
    notificationListener();
  };

  useEffect(() => {
    (async () => {
      const userData = await getUserData();
      notificationConfig();
      const { dispatch } = store;
      if (userData && !!userData?.auth_token) {
        let lastBidData = await getLastBidInfo()
        if (!!lastBidData && !!lastBidData?.expiryTime) {
          let expiryDate = new Date(lastBidData?.expiryTime)
          let currentDate = new Date()
          if (currentDate >= expiryDate) {
            clearLastBidData()
          }
          else {
            dispatch({
              type: types.LAST_BID_INFO,
              payload: lastBidData,
            });
          }

        }

        dispatch({
          type: types.LOGIN,
          payload: userData,
        });

      }
      const getAppData = await getItem('appData');



      if (!!getAppData) {
        dispatch({
          type: types.APP_INIT,
          payload: getAppData,
        });
      }

      const locationData = await getItem('location');
      if (!!locationData) {
        dispatch({
          type: types.LOCATION_DATA,
          payload: locationData,
        });
      }

      const profileAddress = await getItem('profileAddress');

      if (!!profileAddress) {
        dispatch({
          type: types.PROFILE_ADDRESS,
          payload: profileAddress,
        });
      }

      const cartItemCount = await getItem('cartItemCount');

      if (!!cartItemCount) {
        dispatch({
          type: types.CART_ITEM_COUNT,
          payload: cartItemCount,
        });
      }

      const allUserAddress = await getItem('saveUserAddress');

      if (!!allUserAddress) {
        dispatch({
          type: types.SAVE_ALL_ADDRESS,
          payload: allUserAddress,
        });
      }

      const walletData = await getItem('walletData');
      if (!!walletData) {
        dispatch({
          type: types.WALLET_DATA,
          payload: walletData,
        });
      }

      const selectedAddress = await getItem('saveSelectedAddress');
      if (!!selectedAddress) {
        dispatch({
          type: types.SELECTED_ADDRESS,
          payload: selectedAddress,
        });
      }

      const dine_in_type = await getItem('dine_in_type');
      if (!!dine_in_type) {
        dispatch({
          type: types.DINE_IN_DATA,
          payload: dine_in_type,
        });
      }
      const theme = await getItem('theme');
      const themeToggle = await getItem('istoggle');
      if (JSON.parse(themeToggle)) {
        dispatch({
          type: types.THEME,
          payload: false,
        });
        dispatch({
          type: types.THEME_TOGGLE,
          payload: !!themeToggle ? JSON.parse(themeToggle) : false,
        });
      } else {
        dispatch({
          type: types.THEME_TOGGLE,
          payload: !!themeToggle ? JSON.parse(themeToggle) : false,
        });
        if (JSON.parse(theme)) {
          dispatch({
            type: types.THEME,
            payload: true,
          });
        } else {
          dispatch({
            type: types.THEME,
            payload: false,
          });
        }
      }

      const searchResult = await getItem('searchResult');

      if (!!searchResult) {
        dispatch({
          type: types.ALL_RECENT_SEARCH,
          payload: searchResult,
        });
      }

      //Language
      const getLanguage = await getItem('language');

      if (!!getLanguage) {
        console.log(getLanguage, "getLanguagegetLanguagegetLanguagegetLanguage");
        strings.setLanguage(getLanguage);
      }
      const getCountry = await getItem('setPrimaryCountry');
      
      if(!!getCountry){
        setCountry(getCountry)
      }

      //saveShortCode
      const saveShortCode = await getItem('saveShortCode');
      if (!!saveShortCode) {
        dispatch({
          type: types.SAVE_SHORT_CODE,
          payload: saveShortCode,
        });
      }
      //Gamil configure
      GoogleSignin.configure();

      // clip copy issue
      if (__DEV__) {
        Clipboard.setString('');
      }
    })();
    return () => { };
  }, []);

  // Check internet connection
  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const netStatus = state.isConnected;
      setInternet(netStatus);
      updateInternetConnection(netStatus);
    });
    return () => removeNetInfoSubscription();
  }, []);

  const { blurRef } = useRef();



  useEffect(() => {
    codePush.sync(
      {
        installMode: codePush.InstallMode.IMMEDIATE,
        updateDialog: true,
      },
      codePushStatusDidChange,
      codePushDownloadDidProgress,
    );
  }, []);

  function codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case codePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('codepush status Checking for update');
        break;
      case codePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('codepush status Downloading package');
        break;
      case codePush.SyncStatus.AWAITING_USER_ACTION:
        console.log('codepush status Awaiting user action');
        break;
      case codePush.SyncStatus.INSTALLING_UPDATE:
        console.log('codepush status Installing update');
        setProgress(false);
        break;
      case codePush.SyncStatus.UP_TO_DATE:
        console.log('codepush status App up to date+++');
        setProgress(false);
        break;
      case codePush.SyncStatus.UPDATE_IGNORED:
        console.log('codepush status Update cancelled by user');
        setProgress(false);
        break;
      case codePush.SyncStatus.UPDATE_INSTALLED:
        console.log(
          'codepush status Update installed and will be applied on restart',
        );
        setProgress(false);
        break;
      case codePush.SyncStatus.UNKNOWN_ERROR:
        console.log('codepush status An unknown error occurred.');
        setProgress(false);
        break;
    }
  }

  function codePushDownloadDidProgress(progress) {
    console.log('codepush status progress status', progress);
    setProgress(progress);
  }

  const progressView = () => {
    return (
      <View>
        <Modal isVisible={true}>
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: moderateScale(8),
              padding: moderateScale(16),
            }}>
            <Text
              style={{
                alignSelf: 'center',

                color: colors.blackOpacity70,
                fontSize: textScale(14),
              }}>
              In Progress...
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: moderateScaleVertical(12),
                marginBottom: moderateScaleVertical(4),
              }}>
              <Text
                style={{
                  color: colors.blackOpacity70,
                  fontSize: textScale(12),
                }}>{`${(Number(progress?.receivedBytes) / 1048576).toFixed(
                  2,
                )}MB/${(Number(progress.totalBytes) / 1048576).toFixed(
                  2,
                )}MB`}</Text>

              <Text
                style={{
                  color: primaryColor,

                  fontSize: textScale(12),
                }}>
                {(
                  (Number(progress?.receivedBytes) /
                    Number(progress.totalBytes)) *
                  100
                ).toFixed(0)}
                %
              </Text>
            </View>

            <Progress.Bar
              progress={
                (
                  (Number(progress?.receivedBytes) /
                    Number(progress.totalBytes)) *
                  100
                ).toFixed(0) / 100
              }
              width={width / 1.2}
              color={'red'}
            />
          </View>
        </Modal>
      </View>
    );
  };


  return (
    <SafeAreaProvider>
      <MenuProvider>
        <Provider ref={blurRef} store={store}>
          <ForegroundHandler />
          {progress ? progressView() : null}
          <Routes />
          <NotificationModal />
        </Provider>
      </MenuProvider>
      <FlashMessage position="top" />
      <NoInternetModal show={!internetConnection} />
    </SafeAreaProvider>
  );
};


export default codePush(CodePushOptions)(App);