import React, {useState} from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import GradientButton from '../../Components/GradientButton';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {hitSlopProp} from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';

import {
  fbLogin,
  googleLogin,
  handleAppleLogin,
  _twitterSignIn,
} from '../../utils/socialLogin';
import DeviceInfo from 'react-native-device-info';

import stylesFunc from './styles';
import Header from '../../Components/Header';
import Header2 from '../../Components/Header2';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import TransparentButtonWithTxtAndIcon from '../../Components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUserData } from '../../utils/utils';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function OuterScreen2({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    getLanguage: '',
    isLoading: false,
  });
  const {
    appData,
    currencies,
    themeColors,
    languages,
    shortCodeStatus,
    appStyle,
  } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const {getLanguage, isLoading} = state;
  const {apple_login, fb_login, twitter_login, google_login} =
    appData?.profile?.preferences || {};

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  //Saving login user to backend
  const _saveSocailLogin = async (socialLoginData, type) => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let data = {};
    data['name'] = socialLoginData?.name || socialLoginData?.userName;
    data['auth_id'] = socialLoginData?.id || socialLoginData?.userID;
    data['phone_number'] = '';
    data['email'] = socialLoginData?.email;
    data['device_type'] = Platform.OS;
    data['device_token'] = DeviceInfo.getUniqueId();
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
        updateState({isLoading: false});

        if (!!res.data) {
          checkEmailPhoneVerified(res?.data);
          getCartDetail();
        }
      })
      .catch(errorMethod);
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

  const successLogin = (data) => {
    if (!!data) {
      setUserData(data).then((suc) => {
        actions.saveUserData(data);
      });
    }
  };

  //error handling
  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.error || error?.message);
  };

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
      .catch((error) => {});
  };

  //Apple Login Support
  const openAppleLogin = () => {
    updateState({isLoading: false});
    handleAppleLogin()
      .then((res) => {
        updateState({isLoading: false});
        console.log(res, 'responseresponseresponseresponse');
      })
      .catch((err) => {
        updateState({isLoading: false});
      });
  };

  //Gmail Login Support
  const openGmailLogin = () => {
    updateState({isLoading: true});
    googleLogin()
      .then((res) => {
        if (res?.user) {
          _saveSocailLogin(res.user, 'google');
        } else {
          updateState({isLoading: false});
        }
      })
      .catch((err) => {
        updateState({isLoading: false});
      });
  };

  const _responseInfoCallback = (error, result) => {
    updateState({isLoading: true});
    if (error) {
      updateState({isLoading: false});
    } else {
      if (result && result?.id) {
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
    // updateState({isLoading: true});
    _twitterSignIn()
      .then((res) => {
        if (res) {
          _saveSocailLogin(res, 'twitter');
        } else {
          updateState({isLoading: false});
        }
      })
      .catch((err) => {
        updateState({isLoading: false});
      });
  };

  const onGuestLogin = () => {
    actions.userLogout();
    getCartDetail();
    actions.setAppSessionData('guest_login');
  };
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      {shortCodeStatus && (
        <Header
          leftIcon={imagePath.backArrow}
          centerTitle={strings.CREATE_YOUR_ACCOUNT}
          onPressLeft={() => navigation.goBack()}
          // rightIcon={imagePath.cartShop}
          headerStyle={
            isDarkMode
              ? {backgroundColor: MyDarkTheme.colors.background}
              : {backgroundColor: colors.white}
          }
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {!shortCodeStatus && (
          <Text
            style={
              isDarkMode
                ? [styles.header, {color: MyDarkTheme.colors.text}]
                : styles.header
            }>
            {strings.CREATE_YOUR_ACCOUNT}
          </Text>
        )}

        <View style={{marginHorizontal: moderateScale(24)}}>
          <View style={{marginHorizontal: moderateScaleVertical(30)}}>
            <Text
              numberOfLines={2}
              style={
                isDarkMode
                  ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                  : styles.txtSmall
              }>
              {appData?.profile?.preferences?.home_tag_line
                ? appData?.profile?.preferences?.home_tag_line
                : ''}
            </Text>
          </View>
          <GradientButton
            containerStyle={{marginTop: moderateScaleVertical(30)}}
            btnText={strings.CREATE_AN_ACCOUNT}
            onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
          />
          <ButtonWithLoader
            btnStyle={styles.guestBtn}
            btnTextStyle={{color: themeColors.primary_color}}
            onPress={() => onGuestLogin()}
            btnText={strings.GUEST_LOGIN}
          />
          <View style={{marginTop: moderateScaleVertical(50)}}>
            {!!google_login ||
            !!fb_login ||
            !!twitter_login ||
            !!apple_login ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: isDarkMode
                      ? MyDarkTheme.colors.white
                      : colors.textGrey,
                    textAlign: 'center',
                    fontFamily: fontFamily.bold,
                    fontSize: textScale(16),
                  }}>
                  {'Connect social'}
                </Text>
              </View>
            ) : null}

            <View
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
                    onPress={() => openGmailLogin()}
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
                <View style={{marginTop: moderateScaleVertical(15)}}>
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
        </View>
        <View style={styles.bottomContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                ...styles.txtSmall,
                color: colors.textGreyLight,
                marginTop: 0,
              }}>
              {strings.ALREADY_HAVE_AN_ACCOUNT}
            </Text>
            <TouchableOpacity
              hitSlop={hitSlopProp}
              onPress={moveToNewScreen(navigationStrings.LOGIN)}>
              <Text
                style={{
                  color: themeColors.primary_color,
                  // lineHeight:24,
                  fontFamily: fontFamily.bold,
                }}>
                {' '}
                {strings.LOGIN}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
}
