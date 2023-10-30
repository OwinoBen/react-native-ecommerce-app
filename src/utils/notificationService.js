import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

import navigationStrings from '../navigation/navigationStrings';
import actions from '../redux/actions';
import { getItem } from './utils';
import { PERMISSIONS } from 'react-native-permissions';
import { redirectFromNotification } from './helperFunctions';
import * as NavigationService from '../navigation/NavigationService';

export async function requestUserPermission(callback = () => { }) {

  if (Platform.OS === 'ios') {
    await messaging().registerDeviceForRemoteMessages();
    // await messaging().registerForRemoteNotifications()
  }
  if (Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message: 'Allow this app to post notifications?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getFcmToken();
        callback(false);
      } else {
        callback(true)
      }
    } catch (err) {
      console.warn(err);
    }

  } else {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken();
      callback(false);
    } else callback(true);
  }
}



const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log(fcmToken, 'the old token');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'the new genrated token');
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error, 'error in fcmToken');
      // showError(error.message)
    }
  }
};

const _getOrderDetail = async (id) => {
  const getAppData = await getItem('appData');
  const { appData } = getAppData;
  console.log('manage Redirections', appData);
  let data = {};
  data['order_id'] = id;

  actions
    .getOrderDetail(data, {
      code: appData?.profile?.code,
      currency: appData.currencies[0].currency_id,
      language: appData.languages[0].language_id,
      // systemuser: DeviceInfo.getUniqueId(),
    })
    .then((res) => {
      console.log(res, 'resorder detail on redirection >>>');
      // navigation.navigate(navigationStrings.ORDER_DETAIL, {
      //   orderId: item?.order_id,
      //   fromVendorApp: true,
      //   orderDetail: item,
      //   orderStatus: item?.order_status,
      //   selectedVendor: { id: item?.vendor_id },
      //   showRating: item?.order_status?.current_status?.id != 6 ? false : true,
      // });
    })
    .catch(errorMethod);
};

const manageRedirections = async (data) => {
  console.log('manage Redirections +++++ ', data);
  if (data.type == 'order_status_change') {
    // _getOrderDetail(4);
  }
};

// export const notificationListener = async () => {
//   // _openApp()

//   // PushNotification.configure({
//   //   permissions: {
//   //     alert: true,
//   //     badge: true,
//   //     sound: true,
//   //   },
//   //   requestPermissions: true,
//   //   popInitialNotification: true,
//   // });





//   messaging().onNotificationOpenedApp((remoteMessage) => {
//     console.log('tap on notification', remoteMessage);
//     const {data} = remoteMessage;

//     if (!!data?.room_id) {
//       navigate(navigationStrings.CHAT_SCREEN, {
//         data: {_id: data?.room_id, room_id: data?.room_id_text},
//       });
//     }
//     let clickActionUrl = data?.click_action || null;

//     clickActionUrl && redirectFromNotification(clickActionUrl);
//   });

//   // createDefaultChannels();

//   // function createDefaultChannels() {
//   //   PushNotification.createChannel(
//   //     {
//   //       channelId: 'default-channel-id', // (required)
//   //       channelName: `Default channel`, // (required)
//   //       channelDescription: 'A default channel', // (optional) default: undefined.
//   //       soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
//   //       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//   //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//   //     },
//   //     (created) =>
//   //       console.log(`createChannel 'default-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
//   //   );
//   //   PushNotification.createChannel(
//   //     {
//   //       channelId: 'sound-channel-id', // (required)
//   //       channelName: `Sound channel 2`, // (required)
//   //       channelDescription: 'A sound channel 2', // (optional) default: undefined.
//   //       soundName: 'notification.wav', // (optional) See `soundName` parameter of `localNotification` function
//   //       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//   //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//   //     },
//   //     (created) =>
//   //       console.log(`createChannel 'sound-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
//   //   );
//   //   PushNotification.createChannel(
//   //     {
//   //       channelId: 'sound-channel-id', // (required)
//   //       channelName: `Sound channel 2`, // (required)
//   //       channelDescription: 'A sound channel 2', // (optional) default: undefined.
//   //       soundName: 'notification.wav', // (optional) See `soundName` parameter of `localNotification` function
//   //       importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//   //       vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//   //     },
//   //     (created) =>
//   //       console.log(`createChannel 'sound-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
//   //   );

//   //   // // created channel for custom notii
//   //   // PushNotification.createChannel(
//   //   //   {
//   //   //     channelId: 'sound-channel-id', // (required)
//   //   //     channelName: `Sound channel 2`, // (required)
//   //   //     channelDescription: 'A sound channel 2', // (optional) default: undefined.
//   //   //     soundName: 'customnotii.mp3', // (optional) See `soundName` parameter of `localNotification` function
//   //   //     importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//   //   //     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//   //   //   },
//   //   //   (created) =>
//   //   //     console.log(`createChannel 'sound-channel-id' returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
//   //   // );
//   // }

//   messaging()
//     .getInitialNotification()
//     .then((remoteMessage) => {
//       if (remoteMessage) {
//         console.log('remote message inital notification', remoteMessage);
//         const {data, messageId, notification} = remoteMessage;
//         if (
//           Platform.OS == 'android' &&
//           notification.android.sound == 'notification'
//         ) {
//           actions.isVendorNotification(true);
//         }
//         if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
//           actions.isVendorNotification(true);
//         }

//         let clickActionUrl = 'https://qdelo.rostaging.com/user/orders';

//         clickActionUrl &&
//           setTimeout(() => {
//             redirectFromNotification(clickActionUrl);
//           }, 1000);

//         // // added check for customnotii
//         // if (
//         //   Platform.OS == 'android' &&
//         //   notification.android.sound == 'customnotii.mp3'
//         // ) {
//         //   actions.isVendorNotification(true);
//         // }
//       }
//     });

//   return null;
// };




export const notificationListener = async () => {
  //Backgorund
  messaging().onNotificationOpenedApp(remoteMessage => {

    const { notification } = remoteMessage;
    console.log(remoteMessage, 'remoteMessageremoteMessage')
    if (!!remoteMessage?.data && remoteMessage?.data?.redirect_type == "2") {
      if (remoteMessage?.data?.redirect_type_value == 'Subcategory') {
        setTimeout(() => {
          NavigationService.navigate(navigationStrings.VENDOR_DETAIL, {data: remoteMessage?.data?.redirect_data, fromNotification: true})
       
        }, 1200);
      }
      else if (remoteMessage?.data?.redirect_type_value == 'Product') {
        setTimeout(() => {
          NavigationService.navigate(navigationStrings.PRODUCT_LIST,
          {data: remoteMessage?.data?.redirect_data,}
        )
        
        }, 1200);
      }
      else if (remoteMessage?.data?.redirect_type_value == 'Vendor') {
        setTimeout(() => {
          NavigationService.navigate(navigationStrings.VENDOR,{data: remoteMessage?.data?.redirect_data,},)
        }, 1200);
      }
    }

    else if (!!remoteMessage?.data && remoteMessage?.data?.redirect_type == "3") {

      setTimeout(() => {
        NavigationService.navigate( navigationStrings.PRODUCT_LIST,
        {
              data: remoteMessage?.data?.redirect_data, fromNotification: true,
            },
          )
     
      }, 1200);

    }
    // if (
    //   notification?.sound == 'notification.mp3' ||
    //   notification?.android?.sound == 'notification'
    // ) {
    //   if (
    //     notification?.data?.callback_url != '' &&
    //     notification?.data?.callback_url != null
    //   ) {
    //     navigate(navigationStrings.ORDERDETAIL, {
    //       data: {
    //         item: notification?.data?.callback_url,
    //         fromNotification: true,
    //       },
    //     });
    //   } else {
    //     console.log('here>>1');
    //     actions.isModalVisibleForAcceptReject({
    //       isModalVisibleForAcceptReject: true,
    //       notificationData: remoteMessage,
    //     });
    //   }
    // }
  }
  );

  //Kill or inactive
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'remote message inital notification',
          JSON.stringify(remoteMessage),
        );
        const { notification } = remoteMessage;
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );


        if (!!remoteMessage?.data && remoteMessage?.data?.redirect_type == "2") {
          if (remoteMessage?.data?.redirect_type_value == 'Subcategory') {
            setTimeout(() => {
              NavigationService.navigate(navigationStrings.TAB_ROUTES, {
                screen: navigationStrings.HOMESTACK,
                params: {
                  screen: navigationStrings.VENDOR_DETAIL,
                  params: {
                    data: remoteMessage?.data?.redirect_data, fromNotification: true
                  },
                },
              })
             
            }, 1200);
          }
          else if (remoteMessage?.data?.redirect_type_value == 'Product') {
            setTimeout(() => {
              NavigationService.navigate(navigationStrings.TAB_ROUTES, {
                screen: navigationStrings.HOMESTACK,
                params: {
                  screen: navigationStrings.PRODUCT_LIST,
                  params: {
                    data: remoteMessage?.data?.redirect_data,
                  },
                },
              })
          
            }, 1200);
          }
          else if (remoteMessage?.data?.redirect_type_value == 'Vendor') {
            setTimeout(() => {
              NavigationService.navigate(navigationStrings.TAB_ROUTES, {
                screen: navigationStrings.HOMESTACK,
                params: {
                  screen: navigationStrings.VENDOR,
                  params: {
                    data: remoteMessage?.data?.redirect_data,
                  },
                },
              })
            
            }, 1200);
          }
        }

        else if (!!remoteMessage?.data && remoteMessage?.data?.redirect_type == "3") {

          setTimeout(() => {
            NavigationService.navigate(navigationStrings.TAB_ROUTES, {
              screen: navigationStrings.HOMESTACK,
              params: {
                screen: navigationStrings.PRODUCT_LIST,
                params: {
                  data: remoteMessage?.data?.redirect_data, fromNotification: true,
                },
              },
            })
           
          }, 1200);

        }
        // if (
        //   notification?.sound == 'notification.mp3' ||
        //   notification?.android?.sound == 'notification'
        // ) {
        //   if (
        //     notification?.data?.callback_url != '' &&
        //     notification?.data?.callback_url != null
        //   ) {
        //     navigate(navigationStrings.ORDERDETAIL, {
        //       data: {
        //         item: notification?.data?.callback_url,
        //         fromNotification: true,
        //       },
        //     });
        //   } else {
        //     console.log('here>>2');
        //     actions.isModalVisibleForAcceptReject({
        //       isModalVisibleForAcceptReject: true,
        //       notificationData: remoteMessage,
        //     });
        //   }
        // }
      }
    });

  return null;
};


const _openApp = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'Notification caused app to open from background state bla bla:',
      remoteMessage,
    );
    const { data, messageId, notification } = remoteMessage;

    manageRedirections(data);

    if (
      Platform.OS == 'android' &&
      notification.android.sound == 'notification' && data.type != 'reached_location'
    ) {
      actions.isVendorNotification(true);
    }
    if (Platform.OS == 'ios' && notification.sound == 'notification.wav') {
      actions.isVendorNotification(true);
    }
  });
  console.log('i am here>>>>>');

};

const _onRedirectOrderScreen = (id) => {
  if (id) {
    navigate(navigationStrings.ORDER_DETAIL, {
      orderId: id,
      fromActive: true, // this value use for useInterval
    });
  }
};
