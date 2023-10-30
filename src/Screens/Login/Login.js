import AsyncStorage from '@react-native-async-storage/async-storage';
import codes from 'country-calling-code';
import {cloneDeep} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import DeviceCountry from 'react-native-device-country';
import DeviceInfo, {getBundleId} from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import TransparentButtonWithTxtAndIcon from '../../Components/ButtonComponent';
import GradientButton from '../../Components/GradientButton';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {showError} from '../../utils/helperFunctions';
import {
  fbLogin,
  googleLogin,
  handleAppleLogin,
  _twitterSignIn,
} from '../../utils/socialLogin';
import validator from '../../utils/validations';
import stylesFunc from './styles';
import {isEmpty} from 'lodash';

import {enableFreeze} from 'react-native-screens';
enableFreeze(true);

var getPhonesCallingCodeAndCountryData = null;
DeviceCountry.getCountryCode()
  .then(result => {
    // {"code": "BY", "type": "telephony"}
    getPhonesCallingCodeAndCountryData = codes.filter(
      x => x.isoCode2 == result.code.toUpperCase(),
    );
  })
  .catch(e => {
    console.log(e);
  });

import RNOtpVerify from 'react-native-otp-verify';
import {setUserData} from '../../utils/utils';
import {getValuebyKeyInArray} from '../../utils/commonFunction';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import Header from '../../Components/Header';
import { log } from 'react-native-reanimated';



export default function Login({navigation}) {
  const {appData, themeColors, currencies, languages, appStyle, deeplinkUrl} =
    useSelector(state => state?.initBoot || {});
  const {
    apple_login,
    fb_login,
    twitter_login,
    google_login,
    additional_preferences,
  } = useSelector(
    state => state?.initBoot?.appData?.profile?.preferences || {},
  );
  const theme = useSelector(state => state?.initBoot?.themeColor);
  const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const [state, setState] = useState({
    // email: '',
    password: '',
    isLoading: false,
    phoneInput: false,
    phoneNoVisibility: false,
    phoneNumber: '',
    email: {
      value: '',
      focus: true,
    },
    mobilNo: {
      phoneNo: '',
      callingCode:
        !isEmpty(getPhonesCallingCodeAndCountryData) &&
        getBundleId() !== appIds.sxm2go &&
        getBundleId() !== appIds.speedyDelivery
          ? getPhonesCallingCodeAndCountryData[0]?.countryCodes[0]?.replace(
              '-',
              '',
            )
          : getBundleId() == appIds.speedyDelivery
          ? '1'
          : appData?.profile.country?.phonecode
          ? appData?.profile?.country?.phonecode
          : '91',
      cca2:
        !isEmpty(getPhonesCallingCodeAndCountryData) &&
        getBundleId() !== appIds.sxm2go &&
        getBundleId() !== appIds.speedyDelivery
          ? getPhonesCallingCodeAndCountryData[0].isoCode2
          : getBundleId() == appIds.speedyDelivery
          ? 'DO'
          : appData?.profile?.country?.code
          ? appData?.profile?.country?.code
          : 'IN',
      focus: false,
      countryName: '',
      isShowPassword: false,
      appHashKey: '',
    },
    phoneNumberOnly: '',
    calllingCodePhoneOnly: appData?.profile.country?.phonecode
        ? appData?.profile?.country?.phonecode
        : '91',
    cca2PhoneOnly:appData?.profile?.country?.code
        ? appData?.profile?.country?.code
        : 'IN',
  });

  const fontFamily = appStyle?.fontSizeData;
  //CLone deep all the states
  useEffect(() => {
    if (Platform.OS == 'android') {
      RNOtpVerify.getHash()
        .then(res => {
          updateState({
            appHashKey: res[0],
          });
        })
        .catch();
    }
    clonedState = cloneDeep(state);
  }, []);
  //Update states
  const updateState = data => setState(state => ({...state, ...data}));
  //Styles in app
  const styles = stylesFunc({themeColors, fontFamily});

  //all states used in this screen
  const {
    password,
    isLoading,
    phoneInput,
    phoneNoVisibility,
    mobilNo,
    email,
    number,
    isShowPassword,
    appHashKey,
    phoneNumberOnly,
    cca2PhoneOnly,
    calllingCodePhoneOnly,
  } = state;
  console.log(calllingCodePhoneOnly, 'mobilNomobilNo',phoneNumberOnly);

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };
  //On change textinput
  const _onChangeText = key => val => {
    updateState({[key]: val});
  };

  const [loginType, setloginType] = useState('email');

  //Validate form
  console.log(loginType,'loginTypeloginType');
  // const isValidData = () => {
  //   const loginType, setloginType] = useState('email');
  //   const error = getValuebyKeyInArray(
  //     'is_phone_signup',
  //     additional_preferences,
  //   )
  //     ? validator({phoneNumber: phoneNumberOnly})
  //     : email.focus
  //     ? validator({email: email.value, password})
  //     : validator({
  //         phoneNumber: mobilNo.phoneNo,
  //         callingCode: mobilNo.callingCode,
  //       });
  //   if (error) {
  //     showError(error);
  //     return;
  //   }
  //   return true;
  // };
  const isValidData = () => {
    const error = loginType === 'email'
      ?  validator({email: email.value, password})
      : validator({
        phoneNumber: mobilNo.phoneNo,
        callingCode: mobilNo.callingCode,
        });
    if (error) {
      showError(error);
      return;
    }
    return true;
  }

  const checkIfEmailVerification = _data => {
    if (
      !!_data?.client_preference?.verify_email &&
      !_data?.verify_details?.is_email_verified
    ) {
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, _data)();
    } else {
      successLogin(_data);
    }
  };

  //Login api fucntion
  const _onLogin = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
 
    let data = {
      
      username:  loginType === 'email' ? email.value
        : mobilNo.phoneNo,
      password: password,
      device_type: Platform.OS,
      device_token: DeviceInfo.getUniqueId(),
      fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
      dialCode:'+1',
      countryData:'US',
      // dialCode: getValuebyKeyInArray('is_phone_signup', additional_preferences)
      //   ? calllingCodePhoneOnly
      //   : mobilNo.focus
      //   ? mobilNo.callingCode
      //   : '',
      // countryData: getValuebyKeyInArray(
      //   'is_phone_signup',
      //   additional_preferences,
      // )
      //   ? cca2PhoneOnly
      //   : mobilNo.focus
      //   ? mobilNo.cca2
      //   : '',
      app_hash_key: appHashKey,
    };
    if (Platform.OS === 'android' && !!appHashKey) {
      data['app_hash_key'] = appHashKey;
    }
    updateState({isLoading: true});
    console.log(data, 'datadata');
    actions
      .loginUsername(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        console.log('login via user name', res);
        if (!!res.data) {
          if (res?.data?.is_phone) {
            navigation.navigate(navigationStrings.OTP_VERIFICATION, {
              username: mobilNo?.phoneNo,
              dialCode: res?.data?.dialCode,
              countryData: res?.data?.countryData,
              data: res?.data,
            });
          } else {
            checkIfEmailVerification(res.data);
          }
        }
        updateState({isLoading: false});
        getCartDetail();
      })
      .catch(errorMethod);
  };

  //Get your cart detail
  const getCartDetail = () => {
    actions
      .getCartDetail(
        '',
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
      })
      .catch(error => {});
  };
  //Error handling in api
  const errorMethod = error => {
    console.log(error, 'errorrrrr');
    updateState({isLoading: false});
    setTimeout(() => {
      showError(error?.message || error?.error);
    }, 500);
  };

  //Saving login user to backend
  const _saveSocailLogin = async (socialLoginData, type) => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let data = {};
    data['name'] =
      socialLoginData?.name ||
      socialLoginData?.userName ||
      socialLoginData?.fullName?.givenName;
    data['auth_id'] =
      socialLoginData?.id ||
      socialLoginData?.userID ||
      socialLoginData?.identityToken;
    data['phone_number'] = '';
    data['email'] = socialLoginData?.email;
    data['device_type'] = Platform.OS;
    data['device_token'] = DeviceInfo.getUniqueId();
    data['fcm_token'] = !!fcmToken ? fcmToken : DeviceInfo.getUniqueId();

    let query = '';
    if (
      type == 'facebook' ||
      type == 'twitter' ||
      type == 'google' ||
      type == 'apple'
    ) {
      query = type;
    }
    actions
      .socailLogin(`/${query}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        console.log(res, 'res>>>SOCIAL');
        updateState({isLoading: false});

        if (!!res.data) {
          checkEmailPhoneVerified(res?.data);
          getCartDetail();
        }
      })
      .catch(errorMethod);
  };

  const checkEmailPhoneVerified = data => {
    if (
      !!(
        !!data?.client_preference?.verify_email &&
        !data?.verify_details?.is_email_verified
      ) ||
      !!(
        !!data?.client_preference?.verify_phone &&
        !data?.verify_details?.is_phone_verified
      )
    ) {
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, data)();
    } else {
      successLogin(data);
    }
  };

  const successLogin = data => {
    if (!!data) {
      setUserData(data).then(suc => {
        actions.saveUserData(data);
        if (deeplinkUrl) {
          actions.setRedirection('from_deepLinking');
        }
      });
    }
  };

  //Apple Login Support
  const openAppleLogin = () => {
    updateState({isLoading: false});
    handleAppleLogin()
      .then(res => {
        _saveSocailLogin(res, 'apple');
        // updateState({isLoading: false});
      })
      .catch(err => {
        updateState({isLoading: false});
      });
  };

  //Gmail Login Support
  const openGmailLogin = () => {
    updateState({isLoading: true});
    googleLogin()
      .then(res => {
        if (res?.user) {
          console.log(res, 'googlegooogle');
          _saveSocailLogin(res.user, 'google');
        } else {
          updateState({isLoading: false});
        }
      })
      .catch(err => {
        updateState({isLoading: false});
      });
  };

  const _responseInfoCallback = (error, result) => {
    updateState({isLoading: true});
    if (error) {
      updateState({isLoading: false});
    } else {
      if (result && result?.id) {
        console.log(result, 'fbresult');
        _saveSocailLogin(result, 'facebook');
      } else {
        updateState({isLoading: false});
      }
    }
  };
  //FacebookLogin
  const openFacebookLogin = () => {
    fbLogin(_responseInfoCallback);
  };

  //twitter login
  const openTwitterLogin = () => {
    _twitterSignIn()
      .then(res => {
        if (res) {
          _saveSocailLogin(res, 'twitter');
        }
      })
      .catch(err => {});
  };

  const _onCountryChange = (data) => {
    console.log(data,'datadata');
updateState({
          mobilNo: {
            phoneNo: mobilNo.phoneNo,
            cca2: data.cca2,
            callingCode: data.callingCode.toString(),
            focus: true,
          },
          // cca2: data.cca2,
          // callingCode: data.mobilNo.callingCode[0],
        });

    return;
  };

  /*************************** Check Input Handler */
  const checkInputHandler = (data = '') => {
    let re = /^[0-9]{1,45}$/;
    let c = re.test(data);

    // if (c) {
    //   updateState({
    //     phoneInput: true,
    //     mobilNo: {
    //       ...mobilNo,
    //       phoneNo: data,
    //       focus: true,
    //     },
    //     email: {
    //       ...email,
    //       focus: false,
    //     },
    //   });
    // } else {
      updateState({
        phoneInput: false,
        email: {
          value: data,
          focus: true,
        },
      });
    // }
  };

  const showHidePassword = () => {
    updateState({isShowPassword: !isShowPassword});
  };

  return (
    <WrapperContainer
      isLoading={isLoading}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      {/* <HeaderHelloValet
        leftIcon={imagePath.backArrow}
        leftIconBgcolor={colors.whiteSmokeColor}
        headerStyle={{marginTop: moderateScaleVertical(10)}}
      /> */}
      <Header
      leftIcon={imagePath.left_arrow}
      lefticonview={styles.lefticon}
      />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
          marginHorizontal: moderateScale(16),
        }}
        enableOnAndroid={true}>
        <View style={{height: moderateScaleVertical(33)}} />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={
              isDarkMode
                ? [styles.header, {color: MyDarkTheme.colors.text}]
                : styles.header
            }>
            {strings.ENTER_YOUR}
          </Text>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              loginType === 'email'
                ? setloginType('phone')
                : setloginType('email');
            }}>
            <Text
              style={ 
                isDarkMode
                  ? [styles.header, {color: MyDarkTheme.colors.text}]
                  : {...styles.header,textDecorationLine:'underline'}
              }>
              {loginType == 'email'
                ? strings.email
                : strings.PHONE_NUMBER}
            </Text>

            <Image
              source={imagePath.ic_down_arrow}
              style={{marginLeft: moderateScale(8), tintColor: isDarkMode? MyDarkTheme.colors.text : colors.black}}
            />
          </TouchableOpacity>
        </View>

        {/* {getValuebyKeyInArray('is_phone_signup', additional_preferences) ? (
          <Text
            style={
              isDarkMode
                ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                : styles.txtSmall
            }>
            Enter phone number to login your account.
          </Text>
        ) : (
          <Text
            style={
              isDarkMode
                ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                : styles.txtSmall
            }>
            {strings.ENTE_REGISTERED_EMAIL}
          </Text>
        )} */}
        <View style={{height: moderateScaleVertical(22)}} />

        {loginType == 'phone' ? (
          // <PhoneNumberInput
          //   onCountryChange={_onCountryChange}
          //   onChangePhone={data => updateState({
          //     phoneNumberOnly: data,
          //     phoneInput: true,
          //     mobilNo: {
          //       ...mobilNo,
          //       phoneNo: data,
          //       focus: true,
          //     },
          //   })}
          //   onChangeText={data => checkInputHandler(data)}
            
          //   cca2={cca2PhoneOnly}
          //   phoneNumber={phoneNumberOnly}
          //   callingCode={calllingCodePhoneOnly}
          //   placeholder={strings.ENTER_YOUR_PHONE_NUMBER_HERE}
          //   keyboardType={'phone-pad'}
          //   color={isDarkMode ? MyDarkTheme.colors.text : null}
          //   autoFocus={true}
          //   containerStyle={{
          //     backgroundColor: isDarkMode? MyDarkTheme.colors.border : colors.greyColor2,
          //     borderWidth: 0,
          //     paddingLeft: moderateScale(8),
          //     height: moderateScaleVertical(48),
          //     marginBottom:moderateScaleVertical(30)
          //   }}
          // />
          <PhoneNumberInput
          onCountryChange={_onCountryChange}
          onChangePhone={data => updateState({
                phoneNumberOnly: data,
                phoneInput: true,
                mobilNo: {
                  ...mobilNo,
                  phoneNo: data,
                  focus: true,
                },
              })}
              // onChangeText={data => checkInputHandler(data)}
          cca2={cca2PhoneOnly}
          phoneNumber={phoneNumberOnly}
          callingCode={calllingCodePhoneOnly}
          placeholder={strings.ENTER_YOUR_PHONE_NUMBER}
          keyboardType={'phone-pad'}
          color={isDarkMode ? MyDarkTheme.colors.text : null}
          autoFocus={true}
          containerStyle={{
            marginBottom: 20,
            backgroundColor:isDarkMode? MyDarkTheme.colors.border : colors.greyNew,
            borderWidth:0,
            height: moderateScaleVertical(48),

          }}
        />
        ) : (
          <View>
            {
              <>
                <BorderTextInput
                  onChangeText={data => checkInputHandler(data)}
                  placeholder={strings.ENTER_YOUR_EMAIL}
                  keyboardType="email-address"
                  value={email.value}
                  autoCapitalize={'none'}
                  autoFocus={true}
                  returnKeyType={'next'}
                  containerStyle={{
                    backgroundColor: isDarkMode? MyDarkTheme.colors.border : colors.greyNew,
                    borderWidth: 0,
                    paddingLeft: moderateScale(8),
                    height: moderateScaleVertical(48),
                    marginBottom:moderateScaleVertical(30)
                  }}
                />
                {!!email.value && (
                  <BorderTextInput
                    onChangeText={_onChangeText('password')}
                    placeholder={strings.ENTER_PASSWORD}
                    value={password}
                    secureTextEntry={isShowPassword ? false : true}
                    containerStyle={{
                      backgroundColor: isDarkMode? MyDarkTheme.colors.border : colors.greyNew,
                      borderWidth: 0,
                      paddingLeft: moderateScale(8),
                      height: moderateScaleVertical(48),
                    }}
                    rightIcon={
                      password.length > 0
                        ? !isShowPassword
                          ? imagePath.icShowPassword
                          : imagePath.icHidePassword
                        : false
                    }
                    onPressRight={showHidePassword}
                    isShowPassword={isShowPassword}
                    rightIconStyle={{}}
                    // returnKeyType={'next'}
                  />
                )}
              </>
            }
            {/* {phoneInput && (
              <View style={{marginBottom: moderateScale(18)}}>
                <PhoneNumberInput
                  onCountryChange={_onCountryChange}
                  onChangePhone={data => checkInputHandler(data)}
                  cca2={mobilNo.cca2}
                  phoneNumber={mobilNo.phoneNo}
                  callingCode={mobilNo.callingCode}
                  placeholder={strings.YOUR_PHONE_NUMBER}
                  keyboardType={'phone-pad'}
                  color={isDarkMode ? MyDarkTheme.colors.text : null}
                  autoFocus={true}
                />
              </View>
            )} */}
          </View>
        )}
        {/* {getValuebyKeyInArray(
          'is_phone_signup',
          additional_preferences,
        ) ? null : (
          <View style={styles.forgotContainer}>
            <Text
              onPress={moveToNewScreen(navigationStrings.FORGOT_PASSWORD)}
              style={{
                fontFamily: fontFamily.bold,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {' '}
              {strings.FORGOT}
            </Text>
          </View>
        )} */}

        {/* <ButtonWithLoader
          btnText={strings.LOGIN_ACCOUNT}
          btnStyle={{ marginTop: moderateScaleVertical(10) }}
          onPress={_onLogin}
        /> */}
        <View>
          <GradientButton
            // colorsArray={['#1249A2', '#0051D3']}
            textStyle={{fontSize:textScale(15)}}
            onPress={_onLogin}
            btnText={strings.CONTINUE}
            containerStyle={{backgroundColor:themeColors.primary_color,marginTop:height/2.4}}
          />
          {/* <View style={{marginTop: moderateScaleVertical(30)}}>
          {(!!google_login ||
            !!fb_login ||
            !!twitter_login ||
            !!apple_login) && (
            <View style={styles.socialRow}>
              <View style={styles.hyphen} />
              <Text
                style={
                  isDarkMode
                    ? [styles.orText, {color: MyDarkTheme.colors.text}]
                    : styles.orText
                }>
                {strings.OR_LOGIN_WITH}
              </Text>
              <View style={styles.hyphen} />
            </View>
          )} */}
          {/* <View style={styles.socialRowBtn}>
            {!!google_login && (
              <TouchableOpacity
                onPress={() => openGmailLogin()}
                style={{marginHorizontal: moderateScale(20)}}>
                <Image source={imagePath.google} />
              </TouchableOpacity>
            )}
            {!!fb_login && (
              <TouchableOpacity
                onPress={() => openFacebookLogin()}
                style={{marginHorizontal: moderateScale(20)}}>
                <Image source={imagePath.fb} />
              </TouchableOpacity>
            )}
            {!!twitter_login && (
              <TouchableOpacity
                onPress={() => openTwitterLogin()}
                style={{marginHorizontal: moderateScale(20)}}>
                <Image source={imagePath.twitterIcon} />
              </TouchableOpacity>
            )}

            {!!apple_login && Platform.OS == 'ios' && (
              <TouchableOpacity
                onPress={() => openAppleLogin()}
                style={{marginHorizontal: moderateScale(20)}}>
                <Image source={imagePath.apple} />
              </TouchableOpacity>
            )}
          </View> */}
          {/* <View
            style={{
              flexDirection: 'column',
            }}>
            {!!google_login && (
              <View style={{marginTop: moderateScaleVertical(15)}}>
                <TransparentButtonWithTxtAndIcon
                  icon={imagePath.ic_google2}
                  btnText={strings.CONTINUE_GOOGLE}
                  containerStyle={{
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                    borderColor: colors.borderColorD,
                    borderWidth: 1,
                  }}
                  textStyle={{
                    color: isDarkMode ? colors.white : colors.textGreyB,
                    marginHorizontal: moderateScale(15),
                  }}
                  onPress={openGmailLogin}
                />
              </View>
            )}
            {!!fb_login && (
              <View style={{marginTop: moderateScaleVertical(15)}}>
                <TransparentButtonWithTxtAndIcon
                  icon={imagePath.ic_fb2}
                  btnText={strings.CONTINUE_FACEBOOK}
                  containerStyle={{
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                    borderColor: colors.borderColorD,
                    borderWidth: 1,
                  }}
                  textStyle={{
                    color: isDarkMode ? colors.white : colors.textGreyB,
                    marginHorizontal: moderateScale(5),
                  }}
                  onPress={() => openFacebookLogin()}
                />
              </View>
            )}
            {!!twitter_login && (
              <View style={{marginTop: moderateScaleVertical(15)}}>
                <TransparentButtonWithTxtAndIcon
                  icon={imagePath.ic_twitter2}
                  btnText={strings.CONTINUE_TWITTER}
                  containerStyle={{
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                    borderColor: colors.borderColorD,
                    borderWidth: 1,
                  }}
                  textStyle={{
                    color: isDarkMode ? colors.white : colors.textGreyB,
                    marginHorizontal: moderateScale(10),
                  }}
                  nPress={() => openTwitterLogin()}
                />
              </View>
            )}

            {!!apple_login && Platform.OS == 'ios' && (
              <View style={{marginVertical: moderateScaleVertical(15)}}>
                <TransparentButtonWithTxtAndIcon
                  icon={isDarkMode ? imagePath.ic_apple : imagePath.ic_apple2}
                  btnText={strings.CONTINUE_APPLE}
                  containerStyle={{
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                    borderColor: colors.borderColorD,
                    borderWidth: 1,
                  }}
                  textStyle={{
                    color: isDarkMode ? colors.white : colors.textGreyB,
                    marginHorizontal: moderateScale(17),
                  }}
                  onPress={() => openAppleLogin()}
                />
              </View>
            )}
          </View>
        </View> */}
          {getValuebyKeyInArray(
            'is_phone_signup',
            additional_preferences,
          ) ? null : (
            <View style={styles.bottomContainer}>
              <Text
                style={
                  isDarkMode
                    ? {...styles.txtSmall, color: MyDarkTheme.colors.text}
                    : {...styles.txtSmall, color: colors.blackOpacity86}
                }>
                {strings.DONT_HAVE_ACCOUNT}
                <Text
                  onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
                  style={{
                    color:colors.redpata,
                  }}>
                  {' '}
                  {strings.REGISTER}
                </Text>
              </Text>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
