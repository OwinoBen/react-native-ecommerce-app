import React from 'react';
import {
  ForgotPassword2,
  Login,
  Login3,
  OtpVerification, ResetPassword,
  Signup,
  Signup4,
  VerifyAccount,
  OuterScreen5,
  OuterScreen,
  WebLinks,
  Login4,
  Signup5
} from '../Screens';
import ForgotPassword from '../Screens/ForgotPassword/ForgotPassword';
import navigationStrings from './navigationStrings';
import PatazoneOuter from '../Screens/OuterScreen/PatazoneOuter';

export default function (Stack, appStyle, appData) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.OUTER_SCREEN}
        component={appStyle?.homePageLayout === 8 ? OuterScreen5 : PatazoneOuter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP}
        component={appStyle?.homePageLayout === 8 ? Signup4 : Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.LOGIN}
        component={appStyle?.homePageLayout === 8 ? Login3 : Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.OTP_VERIFICATION}
        component={OtpVerification}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.FORGOT_PASSWORD}
        component={
          appStyle?.homePageLayout === 2 ? ForgotPassword2 : ForgotPassword
        }
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.RESET_PASSWORD}
        component={ResetPassword}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={navigationStrings.WEBLINKS}
        component={WebLinks}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={navigationStrings.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{ headerShown: false }}
      />

    </>
  );
}
