import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
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
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  textScale,
  width,
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
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import TransparentButtonWithTxtAndIcon from '../../Components/ButtonComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BannerWithText from '../../Components/BannerWithText';
import ScaledImage from 'react-native-scalable-image';
import {getImageUrl} from '../../utils/helperFunctions';
import LanguageModal from '../../Components/LanguageModal';
import {setItem, setUserData} from '../../utils/utils';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function OuterScreen3({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    getLanguage: '',
    isLoading: false,
    slider1ActiveSlide: 0,
    isSelectLanguageModal: false,
    isLangSelected: false,
    allLangs: [],
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

  const {
    getLanguage,
    isLoading,
    slider1ActiveSlide,
    isSelectLanguageModal,
    isLangSelected,
    allLangs,
  } = state;
  const {apple_login, fb_login, twitter_login, google_login} =
    appData?.profile?.preferences || {};

  const {bannerRef} = useRef();

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const profileInfo = appData?.profile;

  //console.log(  userStaticName.split('.'),"userStaticNameuserStaticNameuserStaticName");

  //Saving login user to backend
  const _saveSocailLogin = async (socialLoginData, type) => {
    let userStaticName = DeviceInfo.getBundleId();
    userStaticName = userStaticName.split('.');

    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let data = {};
    data['name'] =
      socialLoginData?.name ||
      socialLoginData?.userName ||
      socialLoginData?.fullName?.givenName ||
      `${userStaticName[userStaticName.length - 1]} user`;
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
        _saveSocailLogin(res, 'apple');
        // updateState({isLoading: false});

        console.log(res, 'appleappleappleappleappleapple');
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

  const _selectLang = () => {
    updateState({isSelectLanguageModal: true});
  };

  const _onBackdropPress = () => {
    updateState({isSelectLanguageModal: false});
  };

  useEffect(() => {
    const all_languages = [...languages.all_languages];
    all_languages.forEach((itm, indx) => {
      if (languages?.primary_language?.id === itm?.id) {
        all_languages[indx].isActive = true;
        updateState({
          allLangs: [...all_languages],
        });
      } else {
        all_languages[indx].isActive = false;
        updateState({
          allLangs: [...all_languages],
        });
      }
    });
  }, []);

  const _onLangSelect = (item, indx) => {
    const langs = [...allLangs];
    langs.forEach((item, index) => {
      if (index === indx) {
        langs[index].isActive = true;
        updateState({
          allLangs: [...langs],
        });
      } else {
        langs[index].isActive = false;
        updateState({
          allLangs: [...langs],
        });
      }
    });
  };

  const selectedLangTitle = allLangs?.find((itm) => itm.isActive === true);

  //Update language
  const updateLanguage = (item) => {
    const data = languages.all_languages.filter((x) => x.id == item.id)[0];

    if (data.sort_code !== languages.primary_language.sort_code) {
      let languagesData = {
        ...languages,
        primary_language: data,
      };

      // updateState({isLoading: true});
      setItem('setPrimaryLanguage', languagesData);
      setTimeout(() => {
        updateState({isSelectLanguageModal: false});
        actions.updateLanguage(data);
        onSubmitLang(data.sort_code, languagesData);
      }, 1000);
    }
  };

  //update language all over the app
  const onSubmitLang = async (lang, languagesData) => {
    if (lang == '') {
      showAlertMessageError(strings.SELECT);
      return;
    } else {
      if (lang === 'ar' || lang === 'he') {
        I18nManager.forceRTL(true);
        setItem('language', lang);
        changeLaguage(lang);
        RNRestart.Restart();
      } else {
        I18nManager.forceRTL(false);
        setItem('language', lang);
        changeLaguage(lang);
        RNRestart.Restart();
      }
    }
  };

  const _updateLang = (selectedLangTitle) => {
    updateLanguage(selectedLangTitle);
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      //   isLoadingB={isLoading}
      //   source={loaderOne}
    >
      <View
        style={{
          ...styles.headerContainer,
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {!!(profileInfo && profileInfo?.logo) ? (
            <ScaledImage
              width={width / 4.2}
              height={moderateScaleVertical(80)}
              resizeMode="contain"
              source={{
                uri: getImageUrl(
                  isDarkMode
                    ? profileInfo.dark_logo.image_fit
                    : profileInfo.logo.image_fit,
                  isDarkMode
                    ? profileInfo.dark_logo.image_path
                    : profileInfo.logo.image_path,
                  '1000/1000',
                ),
              }}
            />
          ) : null}

          <TouchableOpacity
            style={styles.languageContainer}
            onPress={_selectLang}>
            <Text style={styles.selectedLanguageText}>
              {!!selectedLangTitle
                ? selectedLangTitle.sort_code
                : languages?.primary_language?.sort_code}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flex: 0.94}}>
        <View style={{flex: 0.7}}>
          <BannerWithText
            bannerRef={bannerRef}
            slider1ActiveSlide={slider1ActiveSlide}
            bannerData={appData?.banners}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={(index) => updateState({slider1ActiveSlide: index})}
            // onPress={(item) => bannerPress(item)}
            isDarkMode={isDarkMode}
            tagline={
              appData?.profile?.preferences?.home_tag_line
                ? appData?.profile?.preferences?.home_tag_line
                : ''
            }
          />
        </View>
        <View
          style={{
            flex: 0.3,
            paddingHorizontal: moderateScale(10),
          }}>
          <View style={{marginVertical: moderateScaleVertical(20)}}>
            <GradientButton
              btnStyle={{borderRadius: 30}}
              btnText={strings.LOGIN}
              onPress={moveToNewScreen(navigationStrings.LOGIN)}
            />
          </View>
          <TransparentButtonWithTxtAndIcon
            btnStyle={{
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              borderRadius: 30,
              flexDirection: 'row',
              backgroundColor: colors.white,
              borderWidth: 2,
              borderColor: themeColors?.primary_color,
            }}
            containerStyle={{
              backgroundColor: colors.white,
            }}
            textStyle={{color: themeColors?.primary_color}}
            btnText={strings.IM_NEW_SIGNUP}
            onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
          />

          <View
            style={[
              styles.bottomContainer,
              {paddingTop: moderateScaleVertical(20)},
            ]}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  ...styles.txtSmall,
                  color: colors.textGreyLight,
                  marginTop: 0,
                  fontSize: textScale(12),
                }}>
                {strings.BY_LOGGING}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  hitSlop={hitSlopProp}
                  onPress={() =>
                    navigation.navigate(navigationStrings.WEBLINKS, {
                      id: 2,
                      slug: 'terms-conditions',
                      title: 'Terms of Conditions',
                    })
                  }>
                  <Text
                    style={{
                      color: themeColors.primary_color,
                      // lineHeight:24,
                      fontFamily: fontFamily.bold,

                      fontSize: textScale(12),
                    }}>
                    {strings.TERMS_OF_SERVICE}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: colors.textGreyLight,
                    // lineHeight:24,
                    fontFamily: fontFamily.bold,
                    marginHorizontal: moderateScale(10),
                    fontSize: textScale(12),
                  }}>
                  {strings.AND}
                </Text>
                <TouchableOpacity
                  hitSlop={hitSlopProp}
                  onPress={() =>
                    navigation.navigate(navigationStrings.WEBLINKS, {
                      id: 1,
                      slug: 'privacy-policy',
                      title: 'Privacy Policy',
                    })
                  }>
                  <Text
                    style={{
                      color: themeColors.primary_color,
                      // lineHeight:24,
                      fontFamily: fontFamily.bold,

                      fontSize: textScale(12),
                    }}>
                    {strings.PRICACY_POLICY}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
      {isSelectLanguageModal && (
        <LanguageModal
          isSelectLanguageModal={isSelectLanguageModal}
          onBackdropPress={_onBackdropPress}
          _onLangSelect={_onLangSelect}
          isLangSelected={isLangSelected}
          allLangs={allLangs}
          _updateLang={_updateLang}
        />
      )}
    </WrapperContainer>
  );
}
