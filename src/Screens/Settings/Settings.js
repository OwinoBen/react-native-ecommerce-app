import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  I18nManager,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import DropDownPicker from 'react-native-dropdown-picker';
import RNRestart from 'react-native-restart';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings, { changeLaguage } from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { setItem } from '../../utils/utils';
import stylesFunc from './styles';
import DeviceInfo, { getBuildId, getBundleId } from 'react-native-device-info';
import { API_BASE_URL } from '../../config/urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import BackgroundService from 'react-native-background-actions';
import {
  hapticEffects,
  playHapticEffect,
  playVibration,
  showError,
} from '../../utils/helperFunctions';
import navigationStrings from '../../navigation/navigationStrings';
import { appIds } from '../../utils/constants/DynamicAppKeys';

export default function Settings({ route, navigation }) {
  const {
    currencies,
    appData,
    languages,
    appStyle,
    themeColors,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);
  const { userData } = useSelector((state) => state?.auth);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;


  console.log(languages, "currenciescurrenciescurrencies", currencies)


const [count, setCount] = useState(0)

  const [state, setState] = useState({
    isLoading: false,
    country: 'uk',
    appCurrencies: currencies,
    appLanguages: languages,
    isOn: false,
    selectedThemeOptions: [
      {
        id: 1,
        image: imagePath.light,
        selectedImage: imagePath.checkbox,
        type: 'light',
        themeType: strings.LIGHT,
      },
      {
        id: 2,
        image: imagePath.dark,
        selectedImage: imagePath.checkbox,
        type: 'dark',
        themeType: strings.DARK,
      },
    ],
    selectedThemeOption: null,
  });

  const {
    isLoading,
    appCurrencies,
    appLanguages,
    isOn,
    selectedThemeOptions,
    selectedThemeOption,
  } = state;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors });
  const commonStyles = commonStylesFunc({ fontFamily });


  console.log(appLanguages, "appLanguagesappLanguagesappLanguages")

  useFocusEffect(
    React.useCallback(() => {
      updateState({
        appCurrencies: currencies,
        appLanguages: languages,
      });
    }, [currencies, languages]),
  );

  useEffect(() => {
    updateState({
      isOn: !!themeToggle,
      selectedThemeOption: themeColor
        ? {
          id: 2,
          image: imagePath.dark,
          selectedImage: imagePath.done,
          type: 'dark',
        }
        : {
          id: 1,
          image: imagePath.light,
          selectedImage: imagePath.done,
          type: 'light',
        },
    });
  }, [currencies, languages]);
  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  //Update currency
  const updateCurrency = (item) => {
    const data = currencies.all_currencies.filter((x) => x.id == item.id)[0];

    if (data.iso_code !== currencies.primary_currency.iso_code) {
      let currenciesData = {
        ...currencies,
        primary_currency: data,
      };
      setItem('setPrimaryCurrent', currenciesData);
      updateState({ isLoading: true });
      setTimeout(() => {
        updateState({ isLoading: false });
        actions.updateCurrency(data);
      }, 1000);
    }
  };

  //Update language
  const updateLanguage = (item) => {
    console.log(item, 'itemmmm');
    const data = languages.all_languages.filter((x) => x.id == item.id)[0];
    // console.log(data, "setLang")
    if (data.sort_code !== languages.primary_language.sort_code) {
      let languagesData = {
        ...languages,
        primary_language: data,
      };
      // updateState({isLoading: true});
      setItem('setPrimaryLanguage', languagesData);
      setTimeout(() => {
        updateState({ isLoading: false });
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
      let btData = {};
      AsyncStorage.getItem('BleDevice').then(async (res) => {
        if (res !== null) {
          btData = res;
          await AsyncStorage.setItem('autoConnectEnabled', 'true');
          await AsyncStorage.setItem('BleDevice2', btData);
          console.log('++++++22', btData);
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
          BluetoothManager.disconnect(JSON.parse(res).boundAddress).then(
            (s) => { },
          );
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
      });
      // await BackgroundService.removeAllListeners();
      // await BackgroundService.stop().then((res) => {});
      // await AsyncStorage.removeItem('BleDevice');
    }
  };

  const _toggleOnOff = (isOn) => {
    actions.setToggle(isOn);
    playHapticEffect(hapticEffects.rigid);
    updateState({
      isOn: isOn ? true : false,
    });
  };

  useEffect(() => {
    if (isOn) {
      if (darkthemeusingDevice) {
        let dark = {
          id: 2,
          image: imagePath.dark,
          selectedImage: imagePath.done,
          type: 'dark',
        };

        _setApperance(dark);
      } else {
        let light = {
          id: 1,
          image: imagePath.light,
          selectedImage: imagePath.done,
          type: 'light',
        };
        _setApperance(light);
      }
    }
  }, [isOn, darkthemeusingDevice]);

  const _setApperance = (item) => {
    actions.setAppTheme(item);

    if (item?.type == 'light') {
      actions.setAppTheme(false);
    } else if (item?.type == 'dark') {
      actions.setAppTheme(true);
    }

    {
      selectedThemeOption && selectedThemeOption?.id == item?.id
        ? null
        : updateState({
          selectedThemeOption: item,
        });
    }
  };

  // useEffect(()=>{
  //   API_BASE_URL
  //   console.log("API_BASE_URL")
  // },[])

  const userlogout = () => {
    if (!!userData?.auth_token) {
      Alert.alert('', strings.LOGOUT_SURE_MSG, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: () => {
            actions.userLogout();
            actions.cartItemQty('');
            actions.saveAddress('');
            actions.addSearchResults('clear');
            actions.setAppSessionData('on_login');
          },
        },
      ]);
    } else {
      actions.setAppSessionData('on_login');
    }
  };

  const logoutView = () => {
    return (
      <TouchableOpacity
        // onPress={()=>actions.isVendorNotification(true)}
        onPress={userlogout}
        style={styles.touchAbleLoginVIew}>
        <Text
          style={{
            ...styles.loginLogoutText,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {!!userData?.auth_token ? strings.LOGOUT : strings.LOGIN}
        </Text>
        <Image
          source={imagePath.rightBlue}
          style={{ transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] }}
        />
      </TouchableOpacity>
    );
  };

  const onDeleteAccount = () => {
    if (!!userData?.auth_token) {
      Alert.alert(strings.ARE_YOU_SURE_YOU_WANT_TO_DELETE, '', [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: deleleUserAccount,
        },
      ]);
    } else {
      actions.setAppSessionData('on_login');
    }
  };

  const deleleUserAccount = async () => {
    try {
      const res = await actions.deleteAccount(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      );
      console.log('delete user account res', res);
      actions.userLogout();
      actions.cartItemQty('');
      actions.saveAddress('');
      actions.addSearchResults('clear');
      actions.setAppSessionData('on_login');
    } catch (error) {
      console.log('erro raised', error);
      showError(error?.message);
    }
  };


  const onDeveloperMode = () =>{
    if(count == 5){
      navigation.navigate(navigationStrings.DEVELOPER_MODE)
      return
    }
    setCount(prev=> prev+1)
  }
  console.log("count incresase",count)

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={strings.SETTINGS}
        // rightIcon={imagePath.cartShop}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
        customRight={logoutView}
      />

      <View style={{ ...commonStyles.headerTopLine }} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {appIds.weTogether != getBundleId() &&
          <>
            <View
              style={{
                marginHorizontal: moderateScale(20),
                marginTop: moderateScaleVertical(20),
              }}>
              <Text
                style={{
                  ...styles.darkAppearanceTextStyle,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                  fontSize: textScale(12),
                }}>
                {strings.APPEARANCE}
              </Text>
            </View>
            <View style={{ height: 10 }} />

            <View
              style={{
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : colors.white,
                borderTopWidth: 0.7,
                borderBottomWidth: 0.7,
                borderColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: moderateScale(20),
                  marginTop: moderateScaleVertical(20),

                  justifyContent: 'space-around',
                  paddingVertical: moderateScaleVertical(10),
                  paddingHorizontal: moderateScale(20),
                  marginVertical: moderateScaleVertical(20),
                }}>
                {selectedThemeOptions.map((i, inx) => {
                  return (
                    <TouchableOpacity
                      key={String(inx)}
                      onPress={() => {
                        _setApperance(i);
                        playHapticEffect(hapticEffects.rigid);
                      }}>
                      <Image source={i.image} />
                      <Text
                        style={{
                          marginHorizontal: moderateScale(10),
                          marginVertical: moderateScaleVertical(5),
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}>
                        {i.themeType}
                      </Text>
                      <View
                        style={{
                          marginHorizontal: moderateScale(15),
                          marginVertical: moderateScaleVertical(5),
                        }}>
                        {selectedThemeOption && selectedThemeOption?.id == i.id ? (
                          <Image source={i.selectedImage} />
                        ) : (
                          <Image source={imagePath.inactive_checkbox} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: moderateScale(20),

                  justifyContent: 'space-between',
                  paddingTop: moderateScaleVertical(10),
                  paddingHorizontal: moderateScale(5),
                  borderTopWidth: 0.7,
                  borderColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity20,
                }}>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.darkAppearanceTextStyle,
                        { color: MyDarkTheme.colors.text },
                      ]
                      : styles.darkAppearanceTextStyle
                  }>
                  {strings.AUTOMATIC}
                </Text>

                <ToggleSwitch
                  isOn={isOn}
                  onColor={themeColors.primary_color}
                  offColor={colors.textGreyB}
                  size="medium"
                  onToggle={(isOn) => _toggleOnOff(isOn)}
                  animationSpeed={400}
                />
              </View>
              <View style={{ height: 10 }} />
            </View>
          </>
        }

        <View style={{ height: moderateScaleVertical(30) }} />

        {appStyle.homePageLayout !== 10 ? <View>
          {Platform.OS === 'android' ? (
            <LinearGradient
              style={{
                width: width,
                // borderTopWidth: 0.7,
                // borderBottomWidth: 0.7,
                // borderColor: isDarkMode
                //   ? MyDarkTheme.colors.text
                //   : colors.blackOpacity20,
              }}
              colors={
                isDarkMode
                  ? ['rgba(31,31,31, 0.8)', 'rgba(31,31,31, 0.8)']
                  : ['rgba(256,256,256,256)', 'rgba(256,256,256,256)']
              }>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity20,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: moderateScale(20),
                  marginTop: moderateScaleVertical(20),
                }}>
                <Text
                  style={{
                    ...styles.currency,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.blackB,
                  }}>
                  {strings.CURRENCIES}
                </Text>
              </View>
              <DropDownPicker
                items={appCurrencies?.all_currencies || []}
                defaultValue={
                  appCurrencies?.primary_currency?.name ||
                  appCurrencies?.primary_currency?.label ||
                  ''
                }
                containerStyle={{ height: 40, marginTop: moderateScaleVertical(5) }}
                style={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.greyColor1,
                  marginHorizontal: moderateScale(20),
                  flexDirection: 'row',
                }}
                labelStyle={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                  textAlign: 'left',
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.greyColor1,
                  height: 120,
                  width: width - moderateScale(40),
                  alignSelf: 'center',
                  zIndex: 5000,
                }}
                zIndex={5000}
                arrowColor={isDarkMode ? MyDarkTheme.colors.text : colors.black}
                onChangeItem={(item) => updateCurrency(item)}
              />

              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: moderateScale(20),
                  marginTop: moderateScaleVertical(10),
                }}>
                <Text
                  style={{
                    ...styles.currency,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.blackB,
                    marginTop: moderateScaleVertical(7),
                  }}>
                  {strings.LANGUAGES}
                </Text>
              </View>
              <DropDownPicker
                items={appLanguages?.all_languages || []}
                defaultValue={
                  appLanguages?.primary_language?.nativeName ||
                  appLanguages?.primary_language?.name ||
                  appLanguages?.primary_language?.label ||
                  ''
                }
                containerStyle={{
                  height: 40,
                  marginTop: moderateScaleVertical(5),
                }}
                zIndex={1000}
                style={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.greyColor1,
                  marginHorizontal: moderateScale(20),
                  flexDirection: 'row',
                  zIndex: 1000,
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                labelStyle={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                  textAlign: 'left',
                }}
                dropDownStyle={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.greyColor1,
                  minHeight: moderateScaleVertical(40),
                  maxHeight: moderateScaleVertical(145),

                  width: width - moderateScale(40),
                  alignSelf: 'center',
                }}
                arrowColor={isDarkMode ? MyDarkTheme.colors.text : colors.black}
                onChangeItem={(item) => updateLanguage(item)}
              />
              <View
                style={{
                  height: 0.5,
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity20,
                  marginTop: moderateScaleVertical(20),
                }}
              />
            </LinearGradient>
          ) : (
            <View
              style={{
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : colors.white,
                borderTopWidth: 0.7,
                borderBottomWidth: 0.7,
                borderColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity20,
                paddingVertical: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: moderateScale(20),
                }}>
                <Text
                  style={{
                    ...styles.currency,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.blackB,
                  }}>
                  {strings.CURRENCIES}
                </Text>
              </View>
              <DropDownPicker
                items={appCurrencies.all_currencies}
                defaultValue={
                  appCurrencies?.primary_currency?.name ||
                  appCurrencies?.primary_currency?.label ||
                  ''
                }
                containerStyle={{ height: 40, marginTop: moderateScaleVertical(5) }}
                style={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.greyColor1,
                  marginHorizontal: moderateScale(20),
                  flexDirection: 'row',
                }}
                labelStyle={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                  textAlign: 'left',
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                dropDownStyle={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.greyColor1,
                  height: 120,
                  width: width - moderateScale(40),
                  alignSelf: 'center',
                  zIndex: 5000,
                }}
                zIndex={5000}
                arrowColor={isDarkMode ? MyDarkTheme.colors.text : colors.black}
                onChangeItem={(item) => updateCurrency(item)}
              />

              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: moderateScale(20),
                  marginTop: moderateScaleVertical(10),
                }}>
                <Text
                  style={{
                    ...styles.currency,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.blackB,
                    marginTop: moderateScaleVertical(7),
                  }}>
                  {strings.LANGUAGES}
                </Text>
              </View>
              <DropDownPicker
                items={appLanguages.all_languages}
                defaultValue={
                  appLanguages?.primary_language?.nativeName ||
                  appLanguages?.primary_language?.name ||
                  appLanguages?.primary_language?.label ||
                  ''
                }
                containerStyle={{
                  height: 40,
                  marginTop: moderateScaleVertical(5),
                }}
                zIndex={1000}
                style={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.greyColor1,
                  marginHorizontal: moderateScale(20),
                  flexDirection: 'row',
                  zIndex: 1000,
                }}
                itemStyle={{
                  justifyContent: 'flex-start',
                }}
                labelStyle={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                  textAlign: 'left',
                }}
                dropDownStyle={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.greyColor1,
                  minHeight: moderateScaleVertical(40),
                  maxHeight: moderateScaleVertical(145),

                  width: width - moderateScale(40),
                  alignSelf: 'center',
                }}
                arrowColor={isDarkMode ? MyDarkTheme.colors.text : colors.black}
                onChangeItem={(item) => updateLanguage(item)}
              />
            </View>
          )}
        </View> : null}

        <View
          style={{
            zIndex: -1,
            alignSelf: 'center',
            marginBottom: moderateScaleVertical(90),
            marginTop: moderateScaleVertical(24),
            alignItems: 'center',
          }}>
          <Text
          onPress={onDeveloperMode}
            style={{
              ...commonStyles.regularFont11,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
            }}>
            App Version {`${DeviceInfo.getVersion()}`}{' '}
            {`(${DeviceInfo.getBuildNumber()})`}{' '}
            {API_BASE_URL == 'https://api.rostaging.com/api/v1' ? 'S' : ''}
          </Text>

          {/* <Text
            style={{
              ...commonStyles.regularFont11,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
            }}>
            Developer
          </Text> */}
          {/* actions.saveShortCode(appCode); */}
          { }

          {!!userData?.auth_token ? (
            <Text
              onPress={onDeleteAccount}
              style={{
                ...commonStyles.regularFont11,
                color: colors.redB,
                marginTop: moderateScaleVertical(4),
                opacity: 1,
                fontSize: textScale(13),
              }}>
              {strings.DELETE_ACCOUNT}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </WrapperContainer>
  );
}
