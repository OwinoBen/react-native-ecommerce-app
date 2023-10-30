import React, {useState} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import fontFamily from '../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {showError} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFun from './styles';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextInputWithUnderlineAndLabel from '../../Components/TextInputWithUnderlineAndLabel';
import PhoneNumberInputWithUnderline from '../../Components/PhoneNumberInputWithUnderline';
import {checkIsAdmin} from '../../utils/utils';
import {useNavigation} from '@react-navigation/native';

// import { enableFreeze } from "react-native-screens";
// enableFreeze(true);


export default function SignupTemplateThree({navigation}) {
  const navigation_ = useNavigation();
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const userData = useSelector((state) => state.auth.userData);
  const {appStyle, appData, themeColors, currencies, languages} = useSelector((state) => state?.initBoot || {});
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});

  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  // console.log(appData, 'appDataSignup');

  const [state, setState] = useState({
    isLoading: false,
    callingCode: appData?.profile.country?.phonecode
      ? appData?.profile?.country?.phonecode
      : '91',
    cca2: appData?.profile?.country?.code
      ? appData?.profile?.country?.code
      : 'IN',
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    deviceToken: '',
    referralCode: '',
  });
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const isValidData = () => {
    const error = validations({
      email: appData?.profile?.preferences?.verify_email ? email : 'emptyValid',
      password: password,
      name: name,
      callingCode: callingCode,
      phoneNumber: appData?.profile?.preferences?.verify_phone
        ? phoneNumber
        : 'emptyValid',
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  /** SIGNUP API FUNCTION **/
  const onSignup = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    let {callingCode} = state;
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }

    let data = {
      name: name,
      // phone_number: '+' + callingCode + phoneNumber,
      phone_number: phoneNumber.phoneNumber,
      dial_code: callingCode.toString(),
      country_code: cca2,
      email: email,
      password: password,
      device_type: Platform.OS,
      device_token: DeviceInfo.getUniqueId(),
      refferal_code: referralCode,
      fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
      // country_id: '1',
    };
    updateState({isLoading: true});
    actions
      .signUpApi(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'THIS IS RESPONSE');
        console.log(userData, 'USERDATA AFTER THEN');
        updateState({isLoading: false});

        if (!!res.data) {
          if (
            !!res.data?.client_preference?.verify_email &&
            !!res.data?.client_preference?.verify_phone
          ) {
            if (
              !!res.data?.verify_details?.is_email_verified &&
              !!res.data?.verify_details?.is_phone_verified
            ) {
              checkIsAdmin(navigation_, navigation, res.data);
            } else {
              moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})();
            }
          } else if (
            !!res.data?.client_preference?.verify_email ||
            !!res.data?.client_preference?.verify_phone
          ) {
            if (
              !!res.data?.verify_details?.is_email_verified ||
              !!res.data?.verify_details?.is_phone_verified
            ) {
              checkIsAdmin(navigation_, navigation, res.data);
            } else {
              moveToNewScreen(navigationStrings.VERIFY_ACCOUNT, {})();
            }
          } else {
            checkIsAdmin(navigation_, navigation, res.data);
          }
        }
      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.message || error?.error);
    console.log(error);
  };

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const checkInputHandler = (data = '') => {
    let re = /^[0-9]{1,45}$/;
    let c = re.test(data);

    if (c) {
      updateState({
        phoneNumber: {
          ...phoneNumber,
          phoneNo: data,
          focus: true,
        },
        email: {
          ...email,
          focus: false,
        },
      });
    } else {
      updateState({
        email: {
          value: data,
          focus: true,
        },
        phoneNumber: {
          ...phoneNumber,
          focus: false,
        },
      });
    }
  };

  const {
    phoneNumber,
    callingCode,
    cca2,
    name,
    email,
    isLoading,
    password,
    referralCode,
  } = state;
  return (
    <WrapperContainer
      isLoadingB={isLoading}
      source={loaderOne}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <View
        style={{
          height: moderateScaleVertical(60),
          paddingHorizontal: moderateScale(24),
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{alignSelf: 'flex-start'}}>
          <Image
            // source={
            //   appStyle?.homePageLayout === 3
            //     ? imagePath.icBackb
            //     : imagePath.back
            // }
            source={imagePath.backArrow}
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
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{
          flex: 1,
        }}>
        <View style={{flex: 0.85, height: height - 70}}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              paddingHorizontal: moderateScale(24),
            }}>
            {/* <Text
              style={
                isDarkMode
                  ? [styles.header2, {color: MyDarkTheme.colors.text}]
                  : styles.header2
              }>
              {strings.CREATE_YOUR_ACCOUNT}
            </Text> */}
            <Text
              style={
                isDarkMode
                  ? [
                      styles.txtSmall,
                      {color: MyDarkTheme.colors.text, textAlign: 'left'},
                    ]
                  : [styles.txtSmall, {textAlign: 'left'}]
              }>
              {strings.ENTER_DETAILS_BELOW}
            </Text>
          </View>

          {true ? (
            <View
              style={{
                marginTop: moderateScaleVertical(50),
                marginHorizontal: moderateScale(24),
              }}>
              <TextInputWithUnderlineAndLabel
                onChangeText={_onChangeText('name')}
                //placeholder={strings.YOUR_NAME}
                label={strings.YOUR_NAME}
                value={name}
                autoCapitalize={'none'}
                containerStyle={{marginVertical: moderateScaleVertical(10)}}
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
              <TextInputWithUnderlineAndLabel
                onChangeText={(data) => updateState({email: data})}
                value={email}
                label={`${strings.EMAIL} *`}
                autoCapitalize={'none'}
                containerStyle={{marginVertical: moderateScaleVertical(10)}}
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

              <View style={{marginTop: moderateScaleVertical(-18)}}>
                <PhoneNumberInputWithUnderline
                  onCountryChange={_onCountryChange}
                  placeholder={`${strings.PHONE_NUMBER} *`}
                  onChangePhone={(data) => checkInputHandler(data)}
                  cca2={cca2}
                  phoneNumber={phoneNumber}
                  callingCode={state.callingCode}
                  undnerlineColor={colors.textGreyB}
                  textInputStyle={{
                    fontFamily: fontFamily.regular,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    fontSize: textScale(14),
                    backgroundColor: colors.white,
                  }}
                  labelStyle={{
                    color: colors.black,
                    textTransform: 'uppercase',
                    fontSize: textScale(12),
                  }}
                />
              </View>
              <View style={{marginVertical: moderateScaleVertical(25)}}>
                <TextInputWithUnderlineAndLabel
                  onChangeText={(data) => updateState({referralCode: data})}
                  value={referralCode}
                  label={strings.REFERRAL_CODE_OPTIONAL}
                  autoCapitalize={'none'}
                  containerStyle={{marginVertical: moderateScaleVertical(10)}}
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
              </View>
            </View>
          ) : (
            <View
              style={{
                marginTop: moderateScaleVertical(50),
                marginHorizontal: moderateScale(24),
              }}>
              <BorderTextInput
                containerStyle={{
                  backgroundColor: colors.greyColor,
                  borderWidth: 0,
                }}
                onChangeText={_onChangeText('name')}
                placeholder={strings.YOUR_NAME}
                value={name}
              />
              <BorderTextInput
                containerStyle={{
                  backgroundColor: colors.greyColor,
                  borderWidth: 0,
                }}
                // autoCapitalize={'none'}
                onChangeText={_onChangeText('email')}
                placeholder={strings.YOUR_EMAIL}
                value={email}
                keyboardType={'email-address'}
              />
              <PhoneNumberInput
                onCountryChange={_onCountryChange}
                onChangePhone={(phoneNumber) =>
                  updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
                }
                cca2={cca2}
                phoneNumber={phoneNumber}
                callingCode={state.callingCode}
                placeholder={strings.YOUR_PHONE_NUMBER}
                keyboardType={'phone-pad'}
                color={isDarkMode ? MyDarkTheme.colors.text : null}
                showCountryCode={false}
                containerStyle={{
                  borderWidth: 0,
                  backgroundColor: colors.greyColor,
                }}
                TxtInputStyle={{borderLeftWidth: 0}}
                flagSize={24}
                downArrowStyle={{opacity: 0.4}}
              />
              <View style={{height: moderateScaleVertical(20)}} />
              <BorderTextInput
                containerStyle={{
                  backgroundColor: colors.greyColor,
                  borderWidth: 0,
                }}
                secureTextEntry={true}
                onChangeText={_onChangeText('password')}
                placeholder={strings.ENTER_PASSWORD}
                value={password}
              />
              {/* <BorderTextInput
           containerStyle={{ backgroundColor: colors.greyColor, borderWidth: 0 }}
           onChangeText={_onChangeText('referralCode')}
           placeholder={strings.ENTERREFERALCODE}
           value={referralCode}
         /> */}
              <GradientButton
                onPress={onSignup}
                marginTop={moderateScaleVertical(10)}
                btnText={strings.REGISTER}
              />
            </View>
          )}
        </View>
        <View style={styles.bottomContainer2}>
          <View
            style={{
              width: moderateScale(width - 40),
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingHorizontal: moderateScale(10),
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
              onPress={onSignup}>
              <Image
                style={{
                  tintColor: colors.white,
                  transform: [{rotate: '180deg'}],
                }}
                source={imagePath?.backArrow}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={
              isDarkMode
                ? {
                    ...styles.txtSmall,
                    color: MyDarkTheme.colors.text,
                    marginVertical: moderateScaleVertical(10),
                  }
                : {
                    ...styles.txtSmall,
                    color: colors.textGreyLight,
                    marginVertical: moderateScaleVertical(10),
                  }
            }>
            {true ? '' : strings.ALREADY_HAVE_AN_ACCOUNT}
            <Text
              onPress={moveToNewScreen(navigationStrings.LOGIN)}
              style={{
                color: themeColors.primary_color,
                fontFamily: fontFamily.futuraBtHeavy,
              }}>
              {true ? '' : strings.LOGIN}
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
