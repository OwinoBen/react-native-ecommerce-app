import React, {useEffect, useState} from 'react';
import {I18nManager, Image, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {
  otpTimerCounter,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFunc from './styles';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import TextInputWithUnderlineAndLabel from '../../Components/TextInputWithUnderlineAndLabel';
import { useDarkMode } from 'react-native-dynamic';
import { getCartDetail } from '../../redux/actions/cart';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function OtpVerificationTemplateFour({navigation, route}) {
  const paramData = route?.params;

  const [state, setState] = useState({
    timer: 30,
    phoneOTP: '',
    emailOTP: '',
    isLoading: false,
  });
  const {timer, phoneOTP, emailOTP, isLoading} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {currencies, languages} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  useEffect(() => {
    let timerId;
    if (timer > 0) {
      timerId = setTimeout(() => {
        updateState({timer: timer - 1});
      }, 1000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [state.timer]);

  const _onResend = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let data = {
      username: paramData?.username,
      dialCode: paramData?.dialCode,
      device_type: Platform.OS,
      device_token: DeviceInfo.getUniqueId(),
      fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
      countryData: paramData?.countryData,
    };
    updateState({isLoading: true});

    actions
      .loginUsername(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(() => {
        updateState({isLoading: false});
      })
      .catch(errorMethod);

    updateState({timer: 30});
  };

  const userData = useSelector((state) => state?.auth?.userData);
  const {appData, appStyle, themeColors} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const moveToNewScreen = (screenName, data) => () => {
    return navigation.navigate(screenName, {});
  };

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const isValidData = (otp) => {
    const error = validations({
      otp,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const onVerify = async (type, otp) => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    const checkValid = isValidData(otp);
    if (!checkValid) {
      return;
    }

    let data = {
      username: paramData?.username,
      dialCode: paramData?.dialCode,
      verifyToken: otp,
      device_type: Platform.OS,
      device_token: DeviceInfo.getUniqueId(),
      fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
    };
    updateState({isLoading: true});
    actions
      .phoneloginOtp(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        navigation.push(navigationStrings.TAB_ROUTES);
        // if (userData) {
        //   userData?.client_preference?.verify_email ||
        //   userData?.client_preference?.verify_phone
        //     ? userData?.verify_details?.is_email_verified ||
        //       userData?.verify_details?.is_phone_verified
        //       ? navigation.push(navigationStrings.TAB_ROUTES)
        //       : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})()
        //     : navigation.push(navigationStrings.TAB_ROUTES);
        // }
        updateState({isLoading: false});
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false});
    setTimeout(() => {
      showError(error?.message || error?.error);
    }, 500);
  };

    //Login api fucntion
    const _onLogin = async () => {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
  
      const checkValid = isValidData();
      if (!checkValid) {
        return;
      }
  
      let data = {
        username: 'infra@code-brew.com',
        password: '',
        device_type: Platform.OS,
        device_token: DeviceInfo.getUniqueId(),
        fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
        dialCode: '',
        countryData: '',
      };
  
      // let data = {
      //   username: email.focus ? email.value : mobilNo.phoneNo,
      //   password: password,
      //   device_type: Platform.OS,
      //   device_token: DeviceInfo.getUniqueId(),
      //   fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
      //   dialCode: mobilNo.focus ? mobilNo.callingCode : '',
      //   countryData: mobilNo.focus ? mobilNo.cca2 : '',
      // };
      updateState({isLoading: true});
      actions
        .loginUsername(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          if (!!res.data) {
            res.data.is_phone
              ? navigation.navigate(navigationStrings.OTP_VERIFICATION, {
                  username: mobilNo?.phoneNo,
                  dialCode: mobilNo?.callingCode,
                  countryData: mobilNo?.cca2,
                })
              : !!res.data?.client_preference?.verify_email ||
                !!res.data?.client_preference?.verify_phone
              ? !!res.data?.verify_details?.is_email_verified &&
                !!res.data?.verify_details?.is_phone_verified
                ? navigation.push(navigationStrings.TAB_ROUTES)
                : moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})()
              : navigation.push(navigationStrings.TAB_ROUTES);
          }
          updateState({isLoading: false});
          getCartDetail();
        })
        .catch(errorMethod);
    };

  return (
    <WrapperContainer isLoadingB={isLoading} source={loaderOne}>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: moderateScaleVertical(20),
          paddingHorizontal: moderateScale(24),
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{alignSelf: 'flex-start'}}>
          {/* <Image
            source={
              appStyle?.homePageLayout === 3
                ? imagePath.icBackb
                : imagePath.back
            } */}
            <Image
            source={ imagePath.backArrow }
            style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => navigation.push(navigationStrings.TAB_ROUTES)}>
          <Text style={styles.skipText}>{strings.SKIP}</Text>
        </TouchableOpacity> */}
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            marginTop: moderateScaleVertical(20),
            marginHorizontal: moderateScale(24),
          }}>
          <Text style={[styles.header,{ textAlign: 'left' }]}>{'OTP code sent'+ strings.OTP_SENT}</Text>
          <Text style={[styles.txtSmall,{ textAlign: 'left', marginTop: moderateScaleVertical(5), fontFamily: fontFamily.regular, paddingRight: moderateScale(40), fontSize: textScale(13) }]}>{'Enter the OTP code we sent via SMS to your registered phone number *******'}</Text>
          <View style={{height: moderateScaleVertical(20)}} />
          {/* {!!userData?.client_preference?.verify_phone ? (
            !userData?.verify_details?.is_phone_verified && ( */}
        
            <TextInputWithUnderlineAndLabel
                onChangeText={(text) => updateState({phoneOTP: text})}
                value={phoneOTP}
                label={`${strings.OTP} *`}
                autoCapitalize={'none'}
                containerStyle={{marginVertical: moderateScaleVertical(10), width: '100%'}}
                txtInputStyle={{
                  fontFamily: fontFamily.regular,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}
                undnerlinecolor={colors.textGreyB}
                labelStyle={{
                  color: colors.black,
                  textTransform: 'uppercase',
                  fontSize: textScale(12),
                }}
              />
           
          {/* <TouchableOpacity
              onPress={() => onVerify('phone', phoneOTP)}
              style={{
                flex: 0.27,
                backgroundColor: !userData?.verify_details?.is_phone_verified
                  ? themeColors.primary_color
                  : colors.white,
                paddingVertical: moderateScaleVertical(17),
                paddingHorizontal: moderateScale(8),
                borderRadius: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: !userData?.verify_details?.is_phone_verified
                    ? colors.white
                    : colors.green,
                  fontFamily: fontFamily.bold,
                  fontSize: textScale(12),
                }}>
                {!userData?.verify_details?.is_phone_verified
                  ? strings.VERIFY_PHONE
                  : strings.VERIFIED}
              </Text>
            </TouchableOpacity> */}
          {/* ) : (
            <View></View> */}
          {/* )} */}
          {/* {!!userData?.client_preference?.verify_email ? (
            !userData?.verify_details?.is_email_verified && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: moderateScaleVertical(20),
                }}>
                <BorderTextInput
                  placeholder={strings.ENTER_OTP}
                  containerStyle={{flex: 0.7}}
                  marginBottom={0}
                  onChangeText={_onChangeText('emailOTP')}
                  value={emailOTP}
                />
                <TouchableOpacity
                  onPress={() => onVerify('email', emailOTP)}
                  style={{
                    flex: 0.27,
                    backgroundColor: !userData?.verify_details
                      ?.is_email_verified
                      ? themeColors.primary_color
                      : colors.white,
                    paddingVertical: moderateScaleVertical(8),
                    paddingHorizontal: moderateScale(8),
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: !userData?.verify_details?.is_email_verified
                        ? colors.white
                        : colors.green,
                      fontFamily: fontFamily.bold,
                      fontSize: textScale(12),
                    }}>
                    {!userData?.verify_details?.is_email_verified
                      ? strings.VERIFY_EMAIL
                      : strings.VERIFIED}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <View></View>
          )} */}
          {/* <GradientButton
            onPress={() => navigation.navigate(navigationStrings.TAB_ROUTES)}
            containerStyle={{marginTop: moderateScaleVertical(10)}}
            btnText={strings.VERIFY_ACCOUNT}
          /> */}
          {/* {timer > 0 ? (
            <View style={styles.bottomContainer}>
              <Text style={{...styles.txtSmall, color: colors.textGreyLight}}>
                {strings.RESEND_CODE_IN}
                <Text
                  style={{
                    color: themeColors.primary_color,
                    fontFamily: fontFamily.bold,
                  }}>
                  {`${otpTimerCounter(timer)} sec`}
                </Text>
              </Text>
            </View>
          ) : (
            <View style={styles.bottomContainer}>
              <Text style={{...styles.txtSmall, color: colors.textGreyLight}}>
                {strings.DIDNT_GET_OTP}
                <Text
                  onPress={_onResend}
                  style={{
                    color: colors.themeColor,
                    fontFamily: fontFamily.bold,
                  }}>
                  {` ${strings.RESEND_CODE}`}
                </Text>
              </Text>
            </View>
          )} */}
          <View
            style={{
              width: moderateScale(width - 40),
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingHorizontal: moderateScale(20),
              position: 'absolute',
              bottom: moderateScale(60),
            }}>
            <TouchableOpacity
              style={{
                width: moderateScale(54),
                height: moderateScaleVertical(54),
                borderRadius: 27,
                backgroundColor: themeColors?.primary_color,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={_onLogin}>
              {/* onPress={() => {}}> */}
              <Image
                style={{
                  tintColor: colors.white,
                  transform: [{rotate: '180deg'}],
                }}
                source={imagePath?.backArrow}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
