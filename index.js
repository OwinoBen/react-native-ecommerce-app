import 'react-native-gesture-handler';
import 'react-native-screens'

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
console.disableYellowBox = true;
import messaging from '@react-native-firebase/messaging';
import { StartPrinting } from './src/Screens/PrinterConnection/PrinteFunc';
import actions from './src/redux/actions';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';



// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const { data, notification } = remoteMessage;
  console.log("received in background messages", remoteMessage)

  if (
    Platform.OS == 'android' &&
    notification.android.sound == 'notification'
  ) {
    let _data = JSON.parse(data.data);
    if (_data.vendors[0].vendor.auto_accept_order == 1) {
      StartPrinting(_data);
    } else {
      actions.isVendorNotification(true);
    }
  }
});


AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
