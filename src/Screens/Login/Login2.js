import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import AutoUpLabelTxtInput from '../../Components/AutoUpLabelTxtInput';
import GradientButton from '../../Components/GradientButton';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { showError } from '../../utils/helperFunctions';
import {
  fbLogin,
  googleLogin,
  handleAppleLogin,
  _twitterSignIn,
} from '../../utils/socialLogin';
import validator from '../../utils/validations';
import stylesFunc from './styles';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import TransparentButtonWithTxtAndIcon from '../../Components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserData } from '../../utils/utils';
import { useNavigation } from '@react-navigation/native';

import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function Login2({ navigation }) {
  const navigation_ = useNavigation();
  var clonedState = {};
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const [state, setState] = useState({
    email: '',
    password: '',
    isLoading: false,
  });

  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const { apple_login, fb_login, twitter_login, google_login } = useSelector(
    (state) => state?.initBoot?.appData?.profile?.preferences || {},
  );

  const fontFamily = appStyle?.fontSizeData;
  //CLone deep all the states
  useEffect(() => {
    clonedState = cloneDeep(state);
  }, []);

  //Update states
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  //Styles in app
  const styles = stylesFunc({ themeColors, fontFamily });

  //all states used in this screen
  const { email, password, isLoading } = state;

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };
  //On change textinput
  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  //Validate form
  const isValidData = () => {
    const error = validator({ email, password });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };


  //Login api fucntion
  const _onLogin = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    let data = {
      email: email,
      password: password,
      device_type: Platform.OS,
      device_token: DeviceInfo.getUniqueId(),
      fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
    };
    updateState({ isLoading: true });
    actions
      .login(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {


        checkIfEmailVerification(res.data);


        updateState({ isLoading: false });
        getCartDetail();
      })
      .catch(errorMethod);
  };

  const checkIfEmailVerification = (_data) => {
    if (
      !!_data?.client_preference?.verify_email &&
      !_data?.verify_details?.is_email_verified
    ) {
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, _data)();
    } else {
      successLogin(_data);
    }
  };

  const checkEmailPhoneVerified = (data) => {
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
      .then((res) => {
        actions.cartItemQty(res);
      })
      .catch((error) => { });
  };
  //Error handling in api
  const errorMethod = (error) => {
    updateState({ isLoading: false });
    showError(error?.message || error?.error);
  };

  //Saving login user to backend
  const _saveSocailLogin = async (socialLoginData, type) => {
    console.log(socialLoginData, 'socialLoginData>>>');
    let data = {};
    data['name'] = socialLoginData?.name || socialLoginData?.userName;
    data['auth_id'] = socialLoginData?.id || socialLoginData?.userID;
    data['phone_number'] = '';
    data['email'] = socialLoginData?.email;
    data['device_type'] = Platform.OS;
    data['device_token'] = 'sadassa';
    data['fcm_token'] = !!fcmToken ? fcmToken : DeviceInfo.getUniqueId();
    let query = '';
    if (type == 'facebook' || type == 'twitter' || type == 'google') {
      query = type;
    }
    actions
      .socailLogin(`/${query}`, data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res>>>SOCIAL');
        updateState({ isLoading: false });

        if (!!res.data) {
          checkEmailPhoneVerified(res?.data);
          getCartDetail();
        }
      })
      .catch(errorMethod);
  };

  const successLogin = (data) => {
    if (!!data) {
      setUserData(data).then((suc) => {
        actions.saveUserData(data);
      });
    }
  };
  //Apple Login Support
  const openAppleLogin = () => {
    updateState({ isLoading: false });
    handleAppleLogin()
      .then((res) => {
        updateState({ isLoading: false });
      })
      .catch((err) => {
        updateState({ isLoading: false });
      });
  };

  //Gmail Login Support
  const openGmailLogin = () => {
    updateState({ isLoading: true });
    googleLogin()
      .then((res) => {
        console.log(res, 'google');
        if (res?.user) {
          _saveSocailLogin(res.user, 'google');
        } else {
          updateState({ isLoading: false });
        }
      })
      .catch((err) => {
        updateState({ isLoading: false });
      });
  };
  const _responseInfoCallback = (error, result) => {
    updateState({ isLoading: true });
    if (error) {
      updateState({ isLoading: false });
    } else {
      if (result && result?.id) {
        _saveSocailLogin(result, 'facebook');
      } else {
        updateState({ isLoading: false });
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
      .then((res) => {
        if (res) {
          _saveSocailLogin(res, 'twitter');
        }
      })
      .catch((err) => { });
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <View
        style={{
          height: moderateScaleVertical(80),
          flexDirection: 'column',
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: moderateScaleVertical(78),
            alignItems: 'center',
            paddingHorizontal: moderateScale(24),
          }}>
          <TouchableOpacity onPress={() => navigation.goBack(null)}>
            <Image
              source={imagePath.backArrow}
              style={
                isDarkMode
                  ? {
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    tintColor: MyDarkTheme.colors.text,
                  }
                  : { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }
              }
            />
          </TouchableOpacity>
          <Text
            style={{
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontSize: textScale(16),
              fontFamily: fontFamily.bold,
              flex: 1,
              textAlign: 'center',
            }}>
            {strings.LOGIN_YOUR_ACCOUNT}
          </Text>
        </View>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: colors.grey2,
            elevation: 2,
          }}></View>
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
          marginHorizontal: moderateScale(24),
        }}
        enableOnAndroid={true}>
        <View style={{ height: moderateScaleVertical(10) }} />
        <Text
          style={
            isDarkMode
              ? [styles.txtSmall, { color: MyDarkTheme.colors.text }]
              : styles.txtSmall
          }>
          {strings.ENTE_REGISTERED_EMAIL}
        </Text>
        <View style={{ height: moderateScaleVertical(25) }} />

        <AutoUpLabelTxtInput
          value={email}
          label={strings.YOUR_EMAIL}
          onChangeText={_onChangeText('email')}
          keyboardType={'email-address'}
          autoCapitalize={'none'}
        />

        <AutoUpLabelTxtInput
          value={password}
          label={strings.ENTER_PASSWORD}
          onChangeText={_onChangeText('password')}
          containerStyle={{ marginTop: moderateScale(15) }}
          secureTextEntry={true}
        />

        <View style={styles.forgotContainer}>
          <Text
            onPress={moveToNewScreen(navigationStrings.FORGOT_PASSWORD)}
            style={{
              fontFamily: fontFamily.bold,
              color: themeColors.primary_color,
              marginTop: moderateScaleVertical(10),
            }}>
            {strings.FORGOT}
          </Text>
        </View>
        <GradientButton
          containerStyle={{
            marginTop: moderateScaleVertical(10),
            height: moderateScale(55),
          }}
          onPress={_onLogin}
          borderRadius={moderateScale(15)}
          btnText={strings.LOGIN_ACCOUNT}
        />
        <View
          style={{
            marginTop: moderateScaleVertical(20),
            marginBottom: 10,
          }}>
          {!!google_login || !!fb_login || !!twitter_login || !!apple_login ? (
            <View style={styles.socialRow}>
              <Text
                style={
                  isDarkMode
                    ? [styles.orText2, { color: MyDarkTheme.colors.text }]
                    : styles.orText2
                }>
                {'or'}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'column',
            }}>
            {!!google_login && (
              <View style={{ marginTop: moderateScaleVertical(15) }}>
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
                  onPress={() => openGmailLogin()}
                />
              </View>
            )}
            {!!fb_login && (
              <View style={{ marginVertical: moderateScaleVertical(15) }}>
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
            )}

            {!!apple_login && Platform.OS == 'ios' && (
              <View style={{ marginVertical: moderateScaleVertical(15) }}>
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
        </View>

        <View style={styles.bottomContainer}>
          <Text
            style={{
              ...styles.txtSmall,
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.textGreyLight,
            }}>
            {strings.ALREADY_HAVE_AN_ACCOUNT}
            <Text
              onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
              style={{
                fontFamily: fontFamily.bold,
                color: themeColors.primary_color,
              }}>
              {' '}
              {strings.SIGN_UP}
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
