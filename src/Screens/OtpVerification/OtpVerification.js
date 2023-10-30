import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  Image,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
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
} from '../../styles/responsiveSize';
import {
  otpTimerCounter,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFunc from './styles';
import RNOtpVerify from 'react-native-otp-verify';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function OtpVerification({ navigation, route }) {
  const paramData = route?.params;
  console.log(paramData, 'paramData...paramData');


  const [state, setState] = useState({
    timer: 30,
    phoneOTP: '',
    emailOTP: '',
    isLoading: false,
  });
  const { timer, phoneOTP, emailOTP, isLoading } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { currencies, languages } = useSelector((state) => state?.initBoot || {});
  useEffect(() => {
    let timerId;
    if (timer > 0) {
      timerId = setTimeout(() => {
        updateState({ timer: timer - 1 });
      }, 1000);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [state.timer]);

  const otpHandler = (message) => {
    console.log(message, 'complete msg>>>');
    if (!!message) {
      var OTP = message.replace(/[^0-9]/g, '');
      console.log(OTP, 'OTP without substring>>>');
      console.log(OTP.substring(0, 6), 'OTP without substring>>>');
      updateState({
        phoneOTP: OTP.substring(0, 6),
      });
    }
    RNOtpVerify.removeListener();
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNOtpVerify.getOtp()
        .then((res) => {
          RNOtpVerify.addListener(otpHandler);
        })
        .catch((error) => console.log(error, 'error>>>>'));
      return () => {
        RNOtpVerify.removeListener();
      };
    }
  }, []);

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
    updateState({ isLoading: true });

    actions
      .loginUsername(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(() => {
        updateState({ isLoading: false });
      })
      .catch(errorMethod);

    updateState({ timer: 30 });
  };

  const userData = useSelector((state) => state?.auth?.userData);
  const { appData, appStyle, themeColors } = useSelector(
    (state) => state?.initBoot,
  );
  console.log(appData, 'appDataappData')
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors });

  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {});
  };

  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
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
    updateState({ isLoading: true });
    console.log('sending data', data);
    actions
      .phoneloginOtp(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log('resssss.....ress...', res);
        updateState({ isLoading: false });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({ isLoading: false });
    setTimeout(() => {
      showError(error?.message || error?.error);
    }, 500);
  };

  return (
    <WrapperContainer isLoading={isLoading}>
       <View
        style={{
          
          // height: moderateScaleVertical(60),
          paddingHorizontal: moderateScale(16),
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{ alignSelf: 'flex-start',height: moderateScaleVertical(37),
          width: moderateScale(37),
          backgroundColor: colors.grey1,
          borderRadius: moderateScale(12),
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: moderateScaleVertical(27), }}>
          <Image
            source={
              appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.left_arrow
            }
          
          />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            marginTop: moderateScaleVertical(33),
            marginHorizontal: moderateScale(16),
          }}>
          <Text style={styles.header}>{strings.OTP_VERIFICATION}</Text>
          <Text style={styles.txtSmall}>{strings.ENTER_OTP_SENT}</Text>
          <View style={{ height: moderateScaleVertical(33) }} />
          {/* {!!userData?.client_preference?.verify_phone ? (
            !userData?.verify_details?.is_phone_verified && ( */}

          <View >
            {/* {(!!appData?.profile?.preferences?.static_otp) &&
              <View style={{}}>
                <Text style={{ ...styles.txtSmall, color: colors.blackB,fontSize:textScale(15) }}>
                  {strings.YOUR_OTP}
                </Text>
              </View>} */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // marginVertical: moderateScaleVertical(20),
              }}>

              <BorderTextInput
                placeholder={strings.ENTER_OTP}
                containerStyle={{ flex: 0.7 }}
                marginBottom={0}
                onChangeText={_onChangeText('phoneOTP')}
                value={phoneOTP}
                keyboardType="numeric"
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
            </View>
          </View>


          {/* {timer > 0 ? (
            <View style={styles.bottomContainer}>
              <Text style={{ ...styles.txtSmall, color: colors.textGreyLight }}>
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
              <Text style={{ ...styles.txtSmall, color: colors.textGreyLight }}>
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

        </View>
      </KeyboardAwareScrollView>

    </WrapperContainer>
  );
}
