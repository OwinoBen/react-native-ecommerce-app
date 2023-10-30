import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import AutoUpLabelTxtInput from '../../Components/AutoUpLabelTxtInput';
import GradientButton from '../../Components/GradientButton';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput2 from '../../Components/PhoneNumberInput2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {showError} from '../../utils/helperFunctions';
import {setUserData} from '../../utils/utils';
import validations from '../../utils/validations';
import stylesFun from './styles';

// import { enableFreeze } from "react-native-screens";
// enableFreeze(true);


export default function Signup2({navigation}) {
  const {appData, themeColors, currencies, languages} = useSelector((state) => state?.initBoot || {});
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: false,
    callingCode: appData?.profile.country?.phonecode
      ? appData?.profile.country?.phonecode
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
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const userData = useSelector((state) => state.auth.userData);

  const {appStyle} = useSelector((state) => state?.initBoot || {});
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const isValidData = () => {
    const error = validations({
      email: email,
      password: password,
      name: name,
      phoneNumber: phoneNumber,
      callingCode: callingCode,
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
      phone_number: phoneNumber,
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
    console.log(data, 'signup--data');
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
          checkEmailPhoneVerified(res.data);
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
      successSignUp(data);
    }
  };

  const successSignUp = (data) => {
    setUserData(data).then((suc) => {
      actions.saveUserData(data);
    });
    updateState({
      subscriptionPopup:
        data?.client_preference?.show_subscription_plan_popup_signup,
    });
  };
  const errorMethod = (error) => {
    updateState({isLoading: false});
    showError(error?.message || error?.error);
    console.log(error);
  };

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
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
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                      tintColor: MyDarkTheme.colors.text,
                    }
                  : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
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
            {strings.CREATE_YOUR_ACCOUNT}{' '}
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
        }}>
        <View style={{flex: 1}}>
          <View style={{marginTop: moderateScaleVertical(25)}}>
            <Text
              style={
                isDarkMode
                  ? [styles.txtSmall, {color: MyDarkTheme.colors.text}]
                  : styles.txtSmall
              }>
              {strings.ENTER_DETAILS_BELOW}
            </Text>
          </View>

          <View
            style={{
              marginTop: moderateScaleVertical(30),
              marginHorizontal: moderateScale(24),
            }}>
            <AutoUpLabelTxtInput
              value={name}
              label={strings.YOUR_NAME}
              onChangeText={_onChangeText('name')}
            />

            <AutoUpLabelTxtInput
              value={email}
              label={strings.YOUR_EMAIL}
              keyboardType={'email-address'}
              onChangeText={_onChangeText('email')}
              containerStyle={{marginTop: moderateScale(15)}}
            />

            <PhoneNumberInput2
              onCountryChange={_onCountryChange}
              onChangePhone={(phoneNumber) =>
                updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
              }
              cca2={cca2}
              phoneNumber={phoneNumber}
              callingCode={state.callingCode}
              placeholder={strings.YOUR_PHONE_NUMBER}
              keyboardType={'phone-pad'}
            />

            <AutoUpLabelTxtInput
              value={password}
              label={strings.ENTER_PASSWORD}
              onChangeText={_onChangeText('password')}
              containerStyle={{marginTop: moderateScale(15)}}
              secureTextEntry={true}
            />

            <AutoUpLabelTxtInput
              value={referralCode}
              label={strings.ENTERREFERALCODE}
              onChangeText={_onChangeText('referralCode')}
              containerStyle={{marginTop: moderateScale(15)}}
            />

            <GradientButton
              onPress={onSignup}
              marginTop={moderateScaleVertical(35)}
              btnText={strings.SIGNUP_AN_ACCOUNT}
              containerStyle={{
                borderRadius: moderateScale(15),
                height: moderateScale(55),
              }}
            />
          </View>
          <View style={styles.bottomContainer}>
            <Text style={{...styles.txtSmall, color: colors.textGreyLight}}>
              {strings.ALREADY_HAVE_AN_ACCOUNT}
              <Text
                onPress={moveToNewScreen(navigationStrings.LOGIN)}
                style={{
                  color: themeColors.primary_color,
                  fontFamily: fontFamily.futuraBtHeavy,
                }}>
                {' '}
                {strings.LOGIN}
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
