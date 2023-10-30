import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker, {Flag} from 'react-native-country-picker-modal';
import {useDarkMode} from 'react-native-dynamic';
import {TextInput} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RNOtpVerify from 'react-native-otp-verify';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import {useSelector} from 'react-redux';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {
  otpTimerCounter,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import {setUserData} from '../../utils/utils';
import validations from '../../utils/validations';
import stylesFunc from './styles';

export default function VerifyAccount({navigation, route}) {
  const {themeColor, themeToggle, appData, appStyle, themeColors} = useSelector((state) => state?.initBoot || {});
  const fontFamily = appStyle?.fontSizeData;

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  let paramsData = route?.params?.data;
  console.log('paramsDataparamsData', paramsData);
  const [state, setState] = useState({
    timer2: 0,
    timer: 0,
    isLoading: false,
    callingCode: paramsData?.dial_code
      ? paramsData?.dial_code
      : appData?.profile?.country?.phonecode
      ? appData?.profile?.country?.phonecode
      : '91',
    cca2: paramsData?.cca2
      ? paramsData?.cca2
      : appData?.profile?.country?.code
      ? appData?.profile?.country?.code
      : 'IN',
    name: '',
    email: paramsData?.email || '',
    password: '',
    phoneNumber: paramsData?.phone_number || '',
    deviceToken: '',
    referralCode: '',
    editableEmail: false,
    editablePhone: false,
    emailOtp: '',
    phoneOtp: '',
    countryPickerModalVisible: false,
  });
  const styles = stylesFunc({paramsData, fontFamily, themeColors});
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {
    timer2,
    timer,
    phoneNumber,
    callingCode,
    cca2,
    name,
    email,
    isLoading,
    password,
    referralCode,
    editableEmail,
    editablePhone,
    emailOtp,
    phoneOtp,
    countryPickerModalVisible,
  } = state;



  const sendOTP = (type, resendType) => {
    let data = {};
    if (type == 'phone') {
      data['phone_number'] = phoneNumber;
      data['dial_code'] = callingCode;
      data['type'] = type;
    } else {
      data['email'] = email;
      data['type'] = type;
    }
    updateState({isLoading: true});
    console.log(data, 'data>>>Sending');
    actions
      .resendOTP(data, {
        code: appData?.profile?.code,
        authorization: paramsData?.auth_token,
      })
      .then((res) => {
        console.log(res, 'resend otp resresres');
        showSuccess(res?.message);
        if (type == 'phone') {
          updateState({
            editablePhone: false,
          });
        } else {
          updateState({editableEmail: false});
        }

        // moveToNewScreen(navigationStrings.OTP_VERIFICATION, {})();

        updateState({isLoading: false});
      })
      .catch(errorMethod);
  };

  //Resend code

  const resendOtpData = (type) => {
    let data = {};
    if (type == 'phone') {
      data['phone_number'] = phoneNumber;
      data['dial_code'] = callingCode;
      data['type'] = type;
    } else {
      data['email'] = email;
      data['type'] = type;
    }
    updateState({isLoading: true});
    actions
      .resendOTP(data, {
        code: appData?.profile?.code,
        authorization: paramsData?.auth_token,
      })
      .then((res) => {
        console.log(res, 'res>>>');
        showSuccess(res.message);
        if (type == 'phone') {
          updateState({timer2: 30});
        } else {
          updateState({timer: 30});
        }
        // moveToNewScreen(navigationStrings.OTP_VERIFICATION, {})();

        updateState({isLoading: false});
      })
      .catch(errorMethod);
  };

  const otpHandler = (message) => {
    console.log(message, 'complete msg>>>');
    if (!!message) {
      var OTP = message.replace(/[^0-9]/g, '');
      console.log(OTP, 'OTP without substring>>>');
      console.log(OTP.substring(0, 6), 'OTP without substring>>>');
      updateState({
        phoneOtp: OTP.substring(0, 6),
      });
    }
    RNOtpVerify.removeListener();
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (
      !!email &&
      !!paramsData?.client_preference?.verify_email &&
      !paramsData?.verify_details?.is_email_verified
    ) {
      updateState({editableEmail: false});
      sendOTP('email');
    }
    if (
      !!phoneNumber &&
      !!paramsData?.client_preference?.verify_phone &&
      !paramsData?.verify_details?.is_phone_verified
    ) {
      updateState({editablePhone: false});
      sendOTP('phone');
    }
  }, []);

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
  }, [timer]);

  useEffect(() => {
    let timerId2;
    if (timer2 > 0) {
      timerId2 = setTimeout(() => {
        updateState({timer2: timer2 - 1});
      }, 1000);
    }
    return () => {
      if (timerId2) clearTimeout(timerId2);
    };
  }, [timer2]);

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

  const onVerify = (type, otp) => {
    const checkValid = isValidData(otp);
    if (!checkValid) {
      return;
    }
    let data = {};
    data['type'] = type;
    data['otp'] = otp;
    if (type == 'phone') {
      data['phone_number'] = phoneNumber;
    }
    updateState({isLoading: true});
    actions
      .verifyAccount(data, {
        code: appData?.profile?.code,
        authorization: paramsData?.auth_token,
      })
      .then((res) => {
        console.log(res, 'res data to show');
        showSuccess(res.message);
        updateState({isLoading: false});
        if (res && res?.status == 'Success') {
          if (paramsData && paramsData?.fromCart) {
            navigation.goBack();
          }
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.message || error?.error);
  };

  //On change textinput
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const onclickSaveAndSend = (type, editable) => {
    // alert(type, 'email');
    // alert(editable, 'email');
    if (type == 'email') {
      // alert(email, 'email');
      if (editable) {
        updateState({editableEmail: false});
        sendOTP(type);
      } else {
        updateState({editableEmail: true});
      }
    }
    if (type == 'phone') {
      if (editable) {
        updateState({editablePhone: false});
        sendOTP(type);
      } else {
        updateState({editablePhone: true});
      }
    }
  };

  const otpView = (type, value) => {
    return (
      <SmoothPinCodeInput
        containerStyle={{
          alignSelf: 'center',
          marginTop: moderateScale(20),
        }}
        // password
        mask={
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 25,
              backgroundColor: 'blue',
            }}></View>
        }
        cellSize={width / 10}
        codeLength={6}
        cellSpacing={10}
        editable={true}
        cellStyle={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: 'gray',
        }}
        cellStyleFocused={{
          borderColor: 'black',
        }}
        textStyle={{
          fontSize: 24,
          color: colors.textBlue,
        }}
        textStyleFocused={{
          color: colors.textBlue,
        }}
        // autoCapitalize={'none'}
        inputProps={{
          autoCapitalize: 'none',
        }}
        value={type}
        autoFocus={false}
        keyboardType={'numeric'}
        onTextChange={(val) => updateState({[value]: val})}
        // onFulfill={(code) => onVerify(type, code)}
      />
    );
  };
  const _onCountryChange = (data) => {
    updateState({countryPickerModalVisible: false});
    onCountryChange(data);
  };
  const _openCountryPicker = () => {
    updateState({countryPickerModalVisible: true});
  };
  const _onCountryPickerModalClose = () => {
    updateState({countryPickerModalVisible: false});
  };

  const onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };

  return (
    <WrapperContainer
      isLoading={isLoading}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{alignSelf: 'flex-start'}}>
          <Image
            source={
              appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.back
            }
            style={
              isDarkMode
                ? {
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    tintColor: MyDarkTheme.colors.text,
                  }
                : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
            }
          />
        </TouchableOpacity>
        {!!(paramsData && paramsData?.fromCart) ? null : (
          <TouchableOpacity
            onPress={() => {
              console.log(paramsData, 'paramsData>>');
              setUserData(paramsData).then((suc) => {
                actions.saveUserData(paramsData);
              });
            }}>
            <Text style={styles.skipText}>{strings.SKIP}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!countryPickerModalVisible && (
        <CountryPicker
          cca2={cca2}
          visible={countryPickerModalVisible}
          withFlagButton={false}
          withFilter
          onClose={_onCountryPickerModalClose}
          onSelect={_onCountryChange}
          closeButtonImage={imagePath.closeButton}
          withCallingCode={callingCode}
        />
      )}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          {!!paramsData?.client_preference?.verify_email ? (
            !paramsData?.verify_details?.is_email_verified && (
              <>
                <View
                  style={{
                    marginVertical: moderateScaleVertical(20),
                    marginHorizontal: moderateScale(20),
                  }}>
                  <Text
                    style={
                      isDarkMode
                        ? [styles.header, {color: MyDarkTheme.colors.text}]
                        : styles.header
                    }>
                    {strings.VERIFY_EMAIL_ADDRESS}
                  </Text>
                  <Text
                    style={
                      isDarkMode
                        ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                        : styles.txtSmall
                    }>
                    {strings.ENTER_CODE_SENT_TO_EMAIL}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: moderateScale(20),
                    marginHorizontal: moderateScale(20),
                  }}>
                  <View style={styles.inputContainer}>
                    <View
                      style={
                        isDarkMode
                          ? [
                              styles.textInputContainer,
                              {
                                backgroundColor: editableEmail
                                  ? colors.white
                                  : '#EBEBEB',
                              },
                            ]
                          : [
                              styles.textInputContainer,
                              {
                                backgroundColor: editableEmail
                                  ? colors.white
                                  : '#EBEBEB',
                              },
                            ]
                      }>
                      <TextInput
                        editable={editableEmail}
                        selectionColor={colors.black}
                        placeholder={strings.YOUR_EMAIL}
                        placeholderTextColor={colors.textGreyOpcaity7}
                        style={styles.textInputField}
                        // ref={inputRef}
                        // numberOfLines
                        autoCapitalize={'none'}
                        keyboardType={'email-address'}
                        blurOnSubmit
                        onChangeText={_onChangeText('email')}
                        value={email}
                      />
                    </View>
                    <View
                      style={[
                        styles.editAndSendView,
                        {flex: editableEmail ? 0.35 : 0.2},
                      ]}>
                      <Text
                        onPress={() =>
                          onclickSaveAndSend('email', editableEmail)
                        }
                        style={{
                          textAlign: 'center',
                          fontFamily: fontFamily.medium,
                          fontSize: textScale(12),
                          color: themeColors.primary_color,
                        }}>
                        {editableEmail ? strings.SAVE_SEND : strings.EDIT}
                      </Text>
                    </View>
                  </View>
                  {otpView(emailOtp, 'emailOtp')}
                  <View style={{marginVertical: 10}}>
                    {timer > 0 ? (
                      <View style={styles.bottomContainer}>
                        <Text
                          style={{
                            ...styles.txtSmall,
                            color: colors.textGreyLight,
                          }}>
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
                      <Text
                        style={
                          isDarkMode
                            ? [
                                styles.didintRecieveCode,
                                {color: MyDarkTheme.colors.text},
                              ]
                            : styles.didintRecieveCode
                        }>
                        {strings.DONT_RECEIVE_CODE}{' '}
                        <Text
                          onPress={() => resendOtpData('email')}
                          style={styles.resend}>
                          {strings.RESEND}
                        </Text>
                      </Text>
                    )}

                    <View style={styles.verifyView}>
                      <TouchableOpacity
                        style={[
                          styles.btnPhoneSecond,
                          {
                            backgroundColor: !paramsData?.verify_details
                              ?.is_email_verified
                              ? themeColors.primary_color
                              : colors.white,
                          },
                        ]}
                        onPress={() => onVerify('email', emailOtp)}>
                        {/* onPress={() => sendOTP('email')}> */}
                        <Text
                          numberOfLines={2}
                          style={[
                            styles.phonebtnText,
                            {
                              color: !paramsData?.verify_details
                                ?.is_email_verified
                                ? colors.white
                                : colors.green,
                            },
                          ]}>
                          {!paramsData?.verify_details?.is_email_verified
                            ? strings.VERIFY_CAPITAL
                            : strings.VERIFIED}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            )
          ) : (
            <View />
          )}

          {!!paramsData?.client_preference?.verify_phone ? (
            !paramsData?.verify_details?.is_phone_verified && (
              <>
                <View
                  style={{
                    marginTop: moderateScaleVertical(40),
                    marginHorizontal: moderateScale(20),
                  }}>
                  <Text
                    style={
                      isDarkMode
                        ? [styles.header, {color: MyDarkTheme.colors.text}]
                        : styles.header
                    }>
                    {strings.VERIFY_PHONE_NUMBER}
                  </Text>
                  <Text
                    style={
                      isDarkMode
                        ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                        : styles.txtSmall
                    }>
                    {strings.ENTER_CODE_SENT_TO_MOBILE}
                  </Text>
                </View>
                <View
                  style={{
                    marginHorizontal: moderateScale(20),
                    marginTop: moderateScale(20),
                  }}>
                  <View style={styles.inputContainer}>
                    <View
                      style={[
                        styles.textInputContainer,
                        {
                          backgroundColor: editablePhone
                            ? colors.white
                            : '#EBEBEB',
                        },
                      ]}>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: moderateScale(60),
                        }}
                        onPress={() => _openCountryPicker()}>
                        <Text
                          style={{
                            fontFamily: fontFamily.medium,
                            color: colors.textGreyOpcaity7,
                            marginStart: 2,
                          }}>
                          +{callingCode}
                        </Text>

                        <View style={{marginRight: moderateScale(-10)}}>
                          <Flag countryCode={cca2} />
                        </View>

                        <Image source={imagePath.dropdownTriangle} />
                      </TouchableOpacity>
                      <TextInput
                        editable={editablePhone}
                        keyboardType="numeric"
                        selectionColor={colors.black}
                        placeholder={strings.PHONE_NUMBER}
                        placeholderTextColor={colors.textGreyOpcaity7}
                        style={styles.textInputField}
                        // ref={inputRef}
                        // numberOfLines
                        blurOnSubmit
                        onChangeText={_onChangeText('phoneNumber')}
                        value={phoneNumber}
                      />
                    </View>
                    <View
                      style={[
                        styles.editAndSendView,
                        {flex: editablePhone ? 0.35 : 0.2},
                      ]}>
                      <Text
                        onPress={() =>
                          onclickSaveAndSend('phone', editablePhone)
                        }
                        style={{
                          textAlign: 'center',
                          fontFamily: fontFamily.medium,
                          fontSize: textScale(12),
                          color: themeColors.primary_color,
                        }}>
                        {editablePhone ? 'Save & Send' : 'Edit'}
                      </Text>
                    </View>
                  </View>
                  {otpView(phoneOtp, 'phoneOtp')}
                  <View style={{marginVertical: 10}}>
                    {timer2 > 0 ? (
                      <Text
                        style={{
                          ...styles.txtSmall,
                          color: colors.textGreyLight,
                        }}>
                        {strings.RESEND_CODE_IN}
                        <Text
                          style={{
                            color: themeColors.primary_color,
                            fontFamily: fontFamily.bold,
                          }}>
                          {`${otpTimerCounter(timer2)} sec`}
                        </Text>
                      </Text>
                    ) : (
                      <Text
                        style={
                          isDarkMode
                            ? [
                                styles.didintRecieveCode,
                                {color: MyDarkTheme.colors.text},
                              ]
                            : styles.didintRecieveCode
                        }>
                        {strings.DONT_RECEIVE_CODE}{' '}
                        <Text
                          onPress={() => resendOtpData('phone')}
                          style={styles.resend}>
                          {strings.RESEND}
                        </Text>
                      </Text>
                    )}

                    <View style={styles.verifyView}>
                      <TouchableOpacity
                        style={[
                          styles.btnPhoneSecond,
                          {
                            backgroundColor: !paramsData?.verify_details
                              ?.is_phone_verified
                              ? themeColors.primary_color
                              : colors.white,
                          },
                        ]}
                        onPress={() => onVerify('phone', phoneOtp)}>
                        {/* onPress={() => sendOTP('phone')}> */}
                        <Text
                          numberOfLines={2}
                          style={[
                            styles.phonebtnText,
                            {
                              color: !paramsData?.verify_details
                                ?.is_phone_verified
                                ? colors.white
                                : colors.green,
                            },
                          ]}>
                          {!paramsData?.verify_details?.is_phone_verified
                            ? strings.VERIFY_CAPITAL
                            : strings.VERIFIED}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            )
          ) : (
            <View></View>
          )}

          <View style={{height: 50}} />
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
