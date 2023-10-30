import AsyncStorage from '@react-native-async-storage/async-storage';
import codes from 'country-calling-code';
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
import { useDarkMode } from 'react-native-dynamic';
import DeviceCountry from 'react-native-device-country';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
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
    moderateScale,
    moderateScaleVertical,
    scale,
    textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { showError } from '../../utils/helperFunctions';
import {
    fbLogin,
    googleLogin,
    handleAppleLogin,
    _twitterSignIn,
} from '../../utils/socialLogin';
import validator from '../../utils/validations';
import stylesFunc from './styles';
import { isEmpty } from 'lodash';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


var getPhonesCallingCodeAndCountryData = null;
DeviceCountry.getCountryCode()
    .then((result) => {
        // {"code": "BY", "type": "telephony"}
        getPhonesCallingCodeAndCountryData = codes.filter(
            (x) => x.isoCode2 == result.code.toUpperCase(),
        );
    })
    .catch((e) => {
        console.log(e);
    });

import RNOtpVerify from 'react-native-otp-verify';
import { setUserData } from '../../utils/utils';
import { getValuebyKeyInArray } from '../../utils/commonFunction';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import Header from '../../Components/Header';


export default function Login3({ navigation }) {
    const {
        appData,
        themeColors,
        currencies,
        languages,
        appStyle,
        themeColor,
        themeToggle,
    } = useSelector((state) => state?.initBoot || {});



    const {
        apple_login,
        fb_login,
        twitter_login,
        google_login,
        additional_preferences,
    } = useSelector((state) => state?.initBoot?.appData?.profile?.preferences || {});
    const darkthemeusingDevice = useDarkMode();

    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ themeColors, fontFamily });

    const [withEmail, setwithEmail] = useState(true);
    const [state, setState] = useState({
        phoneNumber: '',
        email: '',
        password: '',
        isLoading: false,
        callingCode:
            !isEmpty(getPhonesCallingCodeAndCountryData) &&
                getBundleId() !== appIds.sxm2go
                ? getPhonesCallingCodeAndCountryData[0]?.countryCodes[0]?.replace(
                    '-',
                    '',
                )
                : appData?.profile.country?.phonecode
                    ? appData?.profile?.country?.phonecode
                    : '91',
        cca2:
            !isEmpty(getPhonesCallingCodeAndCountryData) &&
                getBundleId() !== appIds.sxm2go
                ? getPhonesCallingCodeAndCountryData[0].isoCode2
                : appData?.profile?.country?.code
                    ? appData?.profile?.country?.code
                    : 'IN',
    });

    useEffect(() => {
        if (Platform.OS == 'android') {
            RNOtpVerify.getHash()
                .then((res) => {
                    updateState({
                        appHashKey: res[0],
                    });
                })
                .catch();
        }
    }, []);



    //Update states
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    //all states used in this screen
    const {
        password,
        cca2,
        email,
        phoneNumber,
        isLoading,
        callingCode,
        isShowPassword,
        appHashKey,
    } = state;

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
        const error = !!withEmail
            ? validator({ email: email, password: password })
            : validator({
                phoneNumber: phoneNumber,
                callingCode: callingCode,
            });
        if (error) {
            showError(error);
            return;
        }
        return true;
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

    //Login api fucntion
    const _onLogin = async () => {
        let fcmToken = await AsyncStorage.getItem('fcmToken');

        const checkValid = isValidData();
        if (!checkValid) {
            return;
        }

        let data = {
            username: withEmail ? email : phoneNumber,
            password: withEmail ? password : '',
            device_type: Platform.OS,
            device_token: DeviceInfo.getUniqueId(),
            fcm_token: !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
            dialCode: !withEmail ? callingCode : '',
            countryData: !withEmail ? cca2 : '',
        };
        if (Platform.OS === 'android' && !!appHashKey) {
            data['app_hash_key'] = appHashKey;
        }
        updateState({ isLoading: true });

        console.log(data, 'postdata.....');

        actions
            .loginUsername(data, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                systemuser: DeviceInfo.getUniqueId(),
            })
            .then((res) => {
                console.log('login via user name', res);
                if (!!res.data) {
                    if (res?.data?.is_phone) {
                        navigation.navigate(navigationStrings.OTP_VERIFICATION, {
                            username: phoneNumber,
                            dialCode: callingCode,
                            countryData: cca2,
                            data: res.data,
                        });
                    } else {
                        checkIfEmailVerification(res.data);
                    }
                }
                updateState({ isLoading: false });
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
            .then((res) => {
                actions.cartItemQty(res);
            })
            .catch((error) => { });
    };
    //Error handling in api
    const errorMethod = (error) => {
        console.log(error, 'errorrrrr');
        updateState({ isLoading: false });
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

    //Apple Login Support
    const openAppleLogin = () => {
        updateState({ isLoading: false });
        handleAppleLogin()
            .then((res) => {
                _saveSocailLogin(res, 'apple');
                // updateState({isLoading: false});
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
                if (res?.user) {
                    console.log(res, 'googlegooogle');
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
                console.log(result, 'fbresult');
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

    const _onCountryChange = (data) => {
        updateState({
            cca2: data.cca2,
            callingCode: data.callingCode.toString(),
        });
    };

    const showHidePassword = () => {
        updateState({ isShowPassword: !isShowPassword });
    };


    return (
        <WrapperContainer
            isLoading={isLoading}
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
            <Header leftIcon={imagePath.ic_backarrow} />
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={imagePath.Ooryks_logo} />
            </View>
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{
                    flex: 1,
                    marginHorizontal: moderateScale(24),
                }}
                enableOnAndroid={true}>
                <View>
                    <View style={{ height: moderateScaleVertical(28) }} />

                    <View style={{ height: moderateScaleVertical(30) }} />

                    <View>
                        {!!withEmail && (
                            <>
                                <Text style={{ fontSize: scale(24), fontWeight: "500", marginBottom: moderateScaleVertical(20), color: isDarkMode ? colors.white : colors.black }}>Log In</Text>
                                <BorderTextInput
                                    onChangeText={(txt) =>
                                        updateState({
                                            email: txt,
                                        })
                                    }
                                    containerStyle={{
                                        backgroundColor: colors.blackOpacity05,
                                        borderWidth: 1,
                                        borderColor: colors.borderColor,
                                        borderRadius: 4,
                                        backgroundColor: 'white'
                                    }}
                                    textInputStyle={{
                                        paddingHorizontal: moderateScale(16),
                                        fontSize: textScale(16),
                                        fontFamily: fontFamily.regular,
                                    }}
                                    placeholder={'E-mail'}
                                    value={email}

                                    autoCapitalize={'none'}
                                    autoFocus={true}
                                    returnKeyType={'next'}
                                />
                                <BorderTextInput
                                    containerStyle={{
                                        backgroundColor: colors.blackOpacity05,
                                        borderWidth: 1,
                                        borderColor: colors.borderColor,
                                        borderRadius: 4,
                                        backgroundColor: 'white'
                                    }}
                                    textInputStyle={{
                                        paddingHorizontal: moderateScale(16),
                                        fontSize: textScale(16),
                                        fontFamily: fontFamily.regular,
                                    }}
                                    onChangeText={_onChangeText('password')}
                                    placeholder={strings.PASSWORD}
                                    value={password}
                                    secureTextEntry={isShowPassword ? false : true}
                                    rightIcon={
                                        !isShowPassword
                                            ? imagePath.icShowPassword
                                            : imagePath.icHidePassword

                                    }
                                    onPressRight={showHidePassword}
                                    isShowPassword={isShowPassword}
                                    rightIconStyle={{}}
                                    rightIcon2={imagePath.icInfoMark}
                                // returnKeyType={'next'}
                                />
                            </>
                        )}
                        {!withEmail && (
                            <View style={{ marginBottom: moderateScale(18) }}>
                                <PhoneNumberInput
                                    containerStyle={{
                                        backgroundColor: colors.blackOpacity05,
                                        borderWidth: 0,
                                    }}
                                    textInputStyle={{
                                        paddingHorizontal: moderateScale(16),
                                        fontSize: textScale(16),
                                        fontFamily: fontFamily.regular,
                                    }}
                                    onCountryChange={_onCountryChange}
                                    onChangePhone={(txt) =>
                                        updateState({
                                            phoneNumber: txt,
                                        })
                                    }
                                    cca2={cca2}
                                    phoneNumber={phoneNumber}
                                    callingCode={callingCode}
                                    placeholder={strings.YOUR_PHONE_NUMBER}
                                    keyboardType={'phone-pad'}
                                    color={isDarkMode ? MyDarkTheme.colors.text : null}
                                    autoFocus={true}
                                />
                            </View>
                        )}
                    </View>

                    {!withEmail ? null : (
                        <View style={styles.forgotContainer}>
                            <Text
                                onPress={moveToNewScreen(navigationStrings.FORGOT_PASSWORD)}
                                style={{
                                    fontFamily: fontFamily.regular,
                                    color: isDarkMode ? MyDarkTheme.colors.text : colors.safety_orange,
                                    fontSize: 16,
                                }}>
                                {' '}
                                {strings.FORGOT}
                            </Text>
                        </View>
                    )}
                    <GradientButton
                        containerStyle={{ marginTop: moderateScaleVertical(18), height: moderateScaleVertical(48), }}
                        colorsArray={[themeColors?.primary_color, themeColors?.primary_color]}
                        onPress={_onLogin}
                        btnText={strings.LOGIN}
                    />

                    <View style={{ marginTop: moderateScaleVertical(30) }}>
                        {
                            (!!google_login ||
                                !!fb_login ||
                                !!twitter_login ||
                                !!apple_login) &&
                            true &&
                            (
                                <View style={styles.socialRow}>
                                    <View style={styles.hyphen} />
                                    <Text
                                        style={
                                            isDarkMode
                                                ? [styles.orText, { color: MyDarkTheme.colors.text }]
                                                : styles.orText
                                        }>
                                        {strings.OR_LOGIN_WITH}
                                    </Text>
                                    <View style={styles.hyphen} />
                                </View>
                            )}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                marginTop: moderateScaleVertical(40),
                                alignSelf: 'center',
                            }}>
                            {
                                !!apple_login && Platform.OS == 'ios' &&
                                (
                                    <TouchableOpacity
                                        onPress={() => openAppleLogin()}
                                        style={{ marginHorizontal: moderateScale(20) }}>
                                        <Image source={imagePath.apple1} />
                                    </TouchableOpacity>
                                )}
                            {
                                !!google_login &&
                                (
                                    <TouchableOpacity
                                        onPress={() => openGmailLogin()}
                                        style={{ marginHorizontal: moderateScale(20), justifyContent: "center" }}>
                                        <Image source={imagePath.Ooryks_google} style={{ height: 35, width: 35 }} />
                                    </TouchableOpacity>
                                )}
                            {
                                !!fb_login &&
                                (
                                    <TouchableOpacity
                                        onPress={() => openFacebookLogin()}
                                        style={{ marginHorizontal: moderateScale(20) }}>
                                        <Image source={imagePath.facebook} />
                                    </TouchableOpacity>
                                )}
                        </View>
                    </View>
                </View>
                {getValuebyKeyInArray(
                    'is_phone_signup',
                    additional_preferences,
                ) ? null : (
                    <View style={{ marginTop: '20%' }}>
                        <Text
                            style={{
                                textAlign: 'center',
                                color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.textGreyLight,
                                fontSize: textScale(14),
                            }}>
                            {strings.DONT_HAVE_ACCOUNT}

                            <Text
                                onPress={moveToNewScreen(navigationStrings.SIGN_UP)}
                                style={{
                                    fontFamily: fontFamily.bold,
                                    fontSize: textScale(14),
                                    color: '#FC7049',
                                    textDecorationLine: 'underline',
                                }}>
                                {' '}
                                {strings.SIGN_UP}
                            </Text>
                        </Text>
                    </View>
                )}
            </KeyboardAwareScrollView>
        </WrapperContainer>
    );
}
