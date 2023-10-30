import notifee, {
  AndroidColor,
  AndroidStyle,
  EventType,
  AndroidImportance
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import actions from '../redux/actions';
import { StartPrinting } from '../Screens/PrinterConnection/PrinteFunc';
import { redirectFromNotification } from './helperFunctions';


const ForegroundHandler = (props) => {
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail);
          let clickActionUrl = detail?.notification?.data?.click_action || null;
          redirectFromNotification(clickActionUrl);
          break;
      }
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('remote message foreground', remoteMessage);

      const { data, messageId, notification } = remoteMessage;

      /// Create a channel (required for Android)

      const channelId = await notifee.createChannel({
        id: notification?.android?.channelId || 'default',
        name: 'Default Channel',
        vibration: true,
        lightColor: AndroidColor.YELLOW,
        sound: notification?.android?.sound || 'customnotii',
        importance: AndroidImportance.HIGH,

      });

      let displayNotificationData = {};

      if (!!data?.fcm_options?.image || !!notification?.android?.imageUrl) {
        if (Platform.OS == 'ios') {
          console.log('hello');
          displayNotificationData = {
            title: data?.title || notification?.title || '',
            body: data?.body || notification?.body || '',
            ios: {
              attachments: [
                {
                  // Remote image
                  url: data?.fcm_options?.image,
                },
              ],
            },
            data: { ...data },
          };
        } else {

          displayNotificationData = {
            title: data?.title || notification?.title || '',
            body: data?.body || notification?.body || '',
            android: {
              sound: notification?.android?.sound || 'customnotii',
              channelId,
              pressAction: {
                id: 'default',
              },
              importance: AndroidImportance.HIGH,
              style: {
                type: AndroidStyle.BIGPICTURE,
                picture: notification?.android?.imageUrl,
              },
            },

            data: { ...data },
          };
        }
      } else {

        displayNotificationData = {
          title: data?.title || notification?.title || '',
          body: data?.body || notification?.body || '',
          android: {
            sound: notification?.android?.sound || 'customnotii',
            channelId,
            pressAction: {
              id: 'default',
            },
            importance: AndroidImportance.HIGH
          },

          data: { ...data },
        };
      }

      await notifee.displayNotification(displayNotificationData);

      if (data?.title == 'bid_ride_request') {
        actions.notificationDataForBid(data)
      }

      if (
        Platform.OS == 'android' &&
        notification.android.sound == 'notification' &&
        data.type != 'reached_location'
      ) {
        actions.isVendorNotification(true);
        actions.refreshNotification(messageId);
        const { data } = remoteMessage.data;
        let _data = JSON.parse(data);
        if (_data.vendors[0].vendor.auto_accept_order == 1) {
          StartPrinting(_data);
        }
      }

      // // function for custion notii beloww
      // if (Platform.OS == 'android' && notification.android.sound == 'customnotii.mp3') {
      //   actions.isVendorNotification(true)
      //   actions.refreshNotification(messageId);
      //   const { data } = remoteMessage.data
      //   let _data = JSON.parse(data)
      //   console.log('foreground notification listener checking data >>>>',_data)
      //   console.log('foreground notification listener checking data >>>>',_data.vendors[0].vendor.auto_accept_order == 1)
      //   if(_data.vendors[0].vendor.auto_accept_order == 1){
      //     StartPrinting(_data)
      //   }
      // }

      if (Platform.OS == 'ios' && notification.sound == 'notification.wav' && data.type != 'reached_location') {
        actions.isVendorNotification(true);
        actions.refreshNotification(messageId);
      }
    });
    return unsubscribe;
  }, []);

  return null;
};

export default ForegroundHandler;
