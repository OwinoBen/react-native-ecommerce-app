import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {NativeModules} from 'react-native';
import {
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import {socialKeys} from './constants/DynamicAppKeys';
const {RNTwitterSignIn} = NativeModules;

const Constants = {
  TWITTER_COMSUMER_KEY: socialKeys.TWITTER_COMSUMER_KEY,
  TWITTER_CONSUMER_SECRET: socialKeys.TWITTER_CONSUMER_SECRET,
};

RNTwitterSignIn.init(
  Constants.TWITTER_COMSUMER_KEY,
  Constants.TWITTER_CONSUMER_SECRET,
);
//
export const googleLogin = async () => {
  GoogleSignin.configure();
  try {
    // await GoogleSignin.hasPlayServices();
    // await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn();
    console.log('google login in try block');
    return userInfo;
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('SIGN_IN_CANCELLED');
      return error;
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log('IN_PROGRESS');
      return error;
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      console.log('PLAY_SERVICES_NOT_AVAILABLE');
      return error;
    } else {
      console.log(error, 'error in gmail');
      return error;
    }
  }
};

export const fbLogin = (resCallback) => {
  LoginManager.logOut();
  return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
    (result) => {
      if (
        result.declinedPermissions &&
        result.declinedPermissions.includes('email')
      ) {
        resCallback({message: 'Email is required'});
      }
      if (result.isCancelled) {
      } else {
        const infoRequest = new GraphRequest(
          '/me?fields=email,name,picture,friends',
          null,
          resCallback,
        );
        new GraphRequestManager().addRequest(infoRequest).start();
      }
    },
    function (error) {},
  );
};

//Apple Login
export const handleAppleLogin = async () => {
  return await new Promise(async (resolve, reject) => {
    const checkAppleSupport = appleAuth.isSupported;
    if (checkAppleSupport) {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      //   /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log('checking apple login >>> ', appleAuthRequestResponse);
        // user is authenticated
        resolve(appleAuthRequestResponse);
      } else {
        reject(credentialState);
      }
    } else {
      reject('Apple login is not supproted to this device');
    }
  });
};

export const _twitterSignIn = async () => {
  // RNTwitterSignIn.logOut();
  let data;
  await new Promise((resolve, reject) => {
    RNTwitterSignIn.logIn()
      .then((loginData) => {
        data = loginData;
        resolve(loginData);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return data;
};
