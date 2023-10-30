import codes from 'country-calling-code';
import {isEmpty} from 'lodash';
import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import DeviceCountry from 'react-native-device-country';
import { getBundleId } from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { showError, showSuccess } from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFun from './styles';

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
export default function ContactUs({ navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const { appData, currencies, languages, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const currentTheme = useSelector((state) => state.appTheme);
  const userData = useSelector((state) => state?.auth?.userData);
  console.log(appData, 'appDataa');


  
  const [state, setState] = useState({
    callingCode: userData?.dial_code
    ? userData?.dial_code
    : appData?.profile?.country?.phonecode
    ? appData?.profile?.country?.phonecode
    : '91',
  cca2: userData?.cca2
    ? userData?.cca2
    : appData?.profile?.country?.code
    ? appData?.profile?.country?.code
    : 'IN',
    // callingCode:
    //   !isEmpty(getPhonesCallingCodeAndCountryData) &&
    //   getBundleId() !== appIds.sxm2go
    //     ? getPhonesCallingCodeAndCountryData[0]?.countryCodes[0]?.replace(
    //         '-',
    //         '',
    //       )
    //     : appData?.profile.country?.phonecode
    //     ? appData?.profile?.country?.phonecode
    //     : '91',
    // cca2:
    //   !isEmpty(getPhonesCallingCodeAndCountryData) &&
    //   getBundleId() !== appIds.sxm2go
    //     ? getPhonesCallingCodeAndCountryData[0].isoCode2
    //     : appData?.profile?.country?.code
    //     ? appData?.profile?.country?.code
    //     : 'IN',
    name: userData && userData?.name ? userData?.name : '',
    email: userData && userData?.email ? userData?.email : '',
    phoneNumber:
      userData && userData?.phone_number ? userData?.phone_number : '',
    message: '',
    isLoading: false,
  });

  const { message, phoneNumber, cca2, name, email, isLoading, callingCode } =
    state;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily });
  const commonStyles = commonStylesFun({ fontFamily });
  //Update states
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  
  // useEffect(() => {
  //   updateState({
  //     cca2:
  //       getPhonesCallingCodeAndCountryData &&
  //       !!getPhonesCallingCodeAndCountryData?.length
  //         ? getPhonesCallingCodeAndCountryData[0].isoCode2
  //         : appData?.profile?.country?.code
  //         ? appData?.profile?.country?.code
  //         : 'IN',
  //     callingCode:
  //       getPhonesCallingCodeAndCountryData &&
  //       !!getPhonesCallingCodeAndCountryData?.length
  //         ? getPhonesCallingCodeAndCountryData[0].countryCodes[0]
  //         : appData?.profile.country?.phonecode
  //         ? appData?.profile?.country?.phonecode
  //         : '91',
  //   });
  // }, [appData]);

  //select the country
  const _onCountryChange = (data) => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;
  };



  useEffect(() => {
    getUserProfileData()
  }, [])
  
  const getUserProfileData = () => {
    actions
      .getUserProfile(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then(res => {
        console.log("get user profile",res)
        actions.updateProfile({...userData, ...res?.data});
      })
      .catch(errorMethod);
  };



  const errorMethod = error => {
    console.log(error, 'in error method...');
    updateState({
      isLoading: false,

    });
    showError(error?.message || error?.error);
  };

  // on change text
  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  //validate form
  const isValidData = () => {
    const error = validations({
      email: email,
      name: name,
      phoneNumber: phoneNumber,
      message: message,
      callingCode: callingCode,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };
  //Save user info
  const saveUserInfo = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    // else if(message==''){
    //   return showError('Enter message')
    // }
    let data = {
      name: name,
      email: email,
      phone_number: '+' + callingCode + phoneNumber,
      message: message,
      callingCode: callingCode,
    };

    updateState({
      isLoading: true,
    });
    actions
      .contactUs(data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        console.log(res, 'res>>>');
        updateState({
          isLoading: false,
        });
        showSuccess(res?.message);
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err, 'err>>>');
        updateState({
          isLoading: false,
        });
        showError(err?.message || err?.error);
      });
  };

  // Basic information tab
  const basicInfoView = () => {
    return (
      <View
        style={{
          marginTop: moderateScaleVertical(40),
          marginHorizontal: moderateScale(24),
        }}>
        <BorderTextInput
          onChangeText={_onChangeText('name')}
          placeholder={strings.YOUR_NAME}
          value={name}
        />
        <BorderTextInput
          onChangeText={_onChangeText('email')}
          placeholder={strings.YOUR_EMAIL}
          value={email}
          keyboardType={'email-address'}
        />
        <PhoneNumberInput
          onCountryChange={_onCountryChange}
          placeholder={strings.YOUR_PHONE_NUMBER}
          onChangePhone={(phoneNumber) =>
            updateState({ phoneNumber: phoneNumber.replace(/[^0-9]/g, '') })
          }
          cca2={cca2}
          phoneNumber={phoneNumber}
          callingCode={callingCode}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          color={isDarkMode ? MyDarkTheme.colors.text : null}
        />
        <View style={{ height: moderateScaleVertical(20) }} />
        <BorderTextInput
          onChangeText={_onChangeText('message')}
          placeholder={strings.MESSSAGE_FOR_US}
          value={message}
          containerStyle={{ height: moderateScaleVertical(108), padding: 5 }}
          // textInputStyle={{height:moderateScaleVertical(108)}}
          textAlignVertical={'top'}
          multiline={true}
        />
        <GradientButton
          textStyle={styles.textStyle}
          onPress={saveUserInfo}
          marginTop={moderateScaleVertical(50)}
          marginBottom={moderateScaleVertical(50)}
          btnText={strings.SUBMIT}
        />
      </View>
    );
  };

  // Basic information tab
  const basicInfoViewTemplateTwo = () => {
    return (
      <View
        style={{
          marginTop: moderateScaleVertical(40),
          marginHorizontal: moderateScale(24),
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: textScale(13), color: colors.textGreyLight }}>
            Call Us:{' '}
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: textScale(15),
                color: themeColors?.primary_color,
                fontFamily: fontFamily.medium,
              }}>
              {'+1 6535489657'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: moderateScale(10),
          }}>
          <Text
            style={{
              fontSize: textScale(13),
              color: themeColors?.primary_color,
            }}>
            Email:{' '}
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: textScale(15),
                color: themeColors?.primary_color,
                fontFamily: fontFamily.medium,
              }}>
              {'towfinder@example.com'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: moderateScaleVertical(20) }} />

        <BorderTextInput
          onChangeText={_onChangeText('message')}
          placeholder={'Write something here'}
          value={message}
          containerStyle={{
            height: moderateScaleVertical(108),
            padding: 10,
            borderRadius: 5,
            borderWidth: 0,
            backgroundColor: colors.greyColor1,
          }}
          // textInputStyle={{height:moderateScaleVertical(108)}}
          textAlignVertical={'top'}
          multiline={true}
          textInputStyle={{ fontFamily: fontFamily.regular }}
        />
        <GradientButton
          textStyle={styles.textStyle}
          onPress={saveUserInfo}
          marginTop={moderateScaleVertical(50)}
          marginBottom={moderateScaleVertical(50)}
          btnText={strings.SUBMIT}
        />
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
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
        centerTitle={strings.CONTACT_USS}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      {/* top section user general info */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <View style={styles.userProfileView}>
            <Image source={imagePath.contactIllustration} />
          </View>
        </View>
        <View style={styles.bottomSection}>{basicInfoView()}</View>
        {/* <View style={styles.bottomSection}>{basicInfoViewTemplateTwo()}</View> */}
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
