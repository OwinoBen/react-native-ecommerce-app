import AsyncStorage from '@react-native-async-storage/async-storage';
import codes from 'country-calling-code';
import { cloneDeep, isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  I18nManager,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import DeviceCountry from 'react-native-device-country';
import DeviceInfo from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import { useDarkMode } from 'react-native-dynamic';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RNOtpVerify from 'react-native-otp-verify';
import { useSelector } from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import SubscriptionModal from '../../Components/SubscriptionModal';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { cameraHandler } from '../../utils/commonFunction';
import { showError } from '../../utils/helperFunctions';
import { androidCameraPermission } from '../../utils/permissions';
import { setUserData } from '../../utils/utils';
import validations from '../../utils/validations';
import stylesFun from './styles';



// import { enableFreeze } from "react-native-screens";
// enableFreeze(true);


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

let addtionSelectedImageIndex = null;

// alert("SignUp")
let addtionSelectedImage = null;

export default function Signup4({ navigation }) {
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const [accept, isAccept] = useState(false);
  const {
    appStyle,
    appData,
    currencies,
    languages,
    themeColor,
    themeToggle,
    themeColors
  } = useSelector((state) => state?.initBoot || {});
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily });

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  // var getPhonesCallingCodeAndCountryData = codes.filter(x => x.isoCode2 == RNLocalize.getCountry())
  console.log(
    getPhonesCallingCodeAndCountryData,
    ' getPhonesCallingCodeAndCountryData[0].countryCodes[0]',
  );
  const [state, setState] = useState({
    isLoading: false,
    callingCode:
      getPhonesCallingCodeAndCountryData &&
        getPhonesCallingCodeAndCountryData.length
        ? getPhonesCallingCodeAndCountryData[0].countryCodes[0]
        : appData?.profile.country?.phonecode
          ? appData?.profile?.country?.phonecode
          : '91',
    cca2:
      getPhonesCallingCodeAndCountryData &&
        getPhonesCallingCodeAndCountryData.length
        ? getPhonesCallingCodeAndCountryData[0].isoCode2
        : appData?.profile?.country?.code
          ? appData?.profile?.country?.code
          : 'IN',
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    deviceToken: '',
    referralCode: '',
    isShowPassword: false,
    addtionalTextInputs: [],
    addtionalImages: [],
    addtionalPdfs: [],
    appHashKey: 'WpV3+5pgxIH',
    subscriptionPopup: false,
  });
  const {
    phoneNumber,
    callingCode,
    cca2,
    name,
    email,
    isLoading,
    password,
    referralCode,
    isShowPassword,
    addtionalTextInputs,
    addtionalImages,
    addtionalPdfs,
    appHashKey,
    subscriptionPopup,
  } = state;
  const _onCountryChange = (data) => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;
  };
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  const isValidData = () => {
    const error = validations({
      // email: email,
      password: password,
      callingCode: callingCode,
      phoneNumber: phoneNumber,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNOtpVerify.getHash()
        .then((res) => {
          updateState({
            appHashKey: res[0],
          });
        })
        .catch();
    }
    actions
      .userRegistrationDocument(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'userRegistrationDocumentres');
        updateState({
          addtionalTextInputs: res?.data.filter((x) => x?.file_type == 'Text'),
          addtionalImages: res?.data.filter((x) => x?.file_type == 'Image'),
          addtionalPdfs: res?.data.filter((x) => x?.file_type == 'Pdf'),
        });
      })
      .catch((err) => {
        console.log(err, 'err>>>>>');
      });
  }, []);

  /** SIGNUP API FUNCTION **/
  const onSignup = async () => {
    let formdata = new FormData();
    let fcmToken = await AsyncStorage.getItem('fcmToken');

    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }

    if (!email && !phoneNumber) {
      showError(strings.ENTER_EMAIL_OR_PHONE_NUMBER_WITH_COUNTRY_CODE);
      return;
    }
    {
      !!appData?.profile?.preferences?.concise_signup
        ? formdata.append('name', phoneNumber)
        : formdata.append('name', name);
    }
    formdata.append('app_hash_key', appHashKey);
    formdata.append('phone_number', phoneNumber);
    formdata.append('dial_code', callingCode.toString());
    formdata.append('country_code', cca2);
    {
      !!appData?.profile?.preferences?.concise_signup
        ? formdata.append('email', `${phoneNumber}${'@gmail.com'}`)
        : formdata.append('email', email);
    }
    formdata.append('password', password);
    formdata.append('device_type', Platform.OS);
    formdata.append('device_token', DeviceInfo.getUniqueId());
    formdata.append('refferal_code', referralCode);
    formdata.append(
      'fcm_token',
      !!fcmToken ? fcmToken : DeviceInfo.getUniqueId(),
    );

    var isRequired = true;
    if (!isEmpty(addtionalTextInputs)) {
      addtionalTextInputs.map((i, inx) => {
        if (i?.contents != '' && !!i?.contents) {
          formdata.append(i?.translations[0].slug, i?.contents);
        } else if (i?.is_required) {
          if (isRequired) {
            showError(
              `${strings.PLEASE_ENTER
              } ${i?.translations[0].name.toLowerCase()}`,
            );
            isRequired = false;
            return;
          }
        }
      });
    }

    let concatinatedArray = addtionalImages.concat(addtionalPdfs);
    if (!isEmpty(concatinatedArray)) {
      concatinatedArray.map((i, inx) => {
        if (i?.value) {
          formdata.append(
            i?.translations[0].slug,
            i?.file_type == 'Image'
              ? {
                uri: i.fileData.path,
                name: i.fileData.filename,
                filename: i.fileData.filename,
                type: i.fileData.mime,
              }
              : i?.fileData,
          );
        } else if (i?.is_required) {
          if (isRequired) {
            showError(
              `${strings.PLEASE_UPLOAD
              } ${i?.translations[0].name.toLowerCase()}`,
            );
            isRequired = false;
            return;
          }
        }
      });
    }

    if (!isRequired) {
      return;
    }
    console.log(formdata, 'formdata>><');
    updateState({ isLoading: true });

    // if (accept) {
    actions
      .signUpApi(formdata, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
        'Content-Type': 'multipart/form-data',
      })
      .then((res) => {
        console.log(res, 'THIS IS RESPONSE');
        updateState({ isLoading: false });
        navigation.navigate(navigationStrings.OTP_VERIFICATION, {
          username: phoneNumber,
          dialCode: callingCode,
          countryData: cca2,
        });

        // if (!!res.data) {
        //   checkEmailPhoneVerified(res.data);
        // }
      })
      .catch(errorMethod);
    // } else {
    //   showError("The term and condition must be accepted.");
    //   updateState({ isLoading: false });
    // }
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
    updateState({ isLoading: false });
    showError(error?.message || error?.error);
    console.log(error);
  };

  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };

  const showHidePassword = () => {
    updateState({ isShowPassword: !isShowPassword });
  };

  let actionSheet = useRef();
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const handleDynamicTxtInput = (text, index, type) => {
    let data = cloneDeep(addtionalTextInputs);
    data[index].contents = text;
    data[index].id = type?.id;
    data[index].file_type = type?.file_type;
    data[index].label_name = type?.translations[0]?.name;
    updateState({ addtionalTextInputs: data });
  };

  //Get TextInput
  const getTextInputField = (type, index) => {
    return (
      <BorderTextInput
        // secureTextEntry={true}
        placeholder={type?.translations[0]?.name || ''}
        onChangeText={(text) => handleDynamicTxtInput(text, index, type)}
      />
    );
  };

  //Update Images
  const updateImages = (type, index) => {
    addtionSelectedImageIndex = index;
    addtionSelectedImage = type;
    showActionSheet(false);
  };

  const getImageFieldView = (type, index) => {
    return (
      <View
        style={{
          marginRight: moderateScale(15),
          marginTop: moderateScale(10),
          width: moderateScale(95),
        }}>
        <TouchableOpacity
          onPress={() => updateImages(type, index)}
          style={styles.imageUpload}>
          {addtionalImages[index].value != undefined &&
            addtionalImages[index].value != null &&
            addtionalImages[index].value != '' ? (
            <Image
              source={{ uri: addtionalImages[index].value }}
              style={styles.imageStyle2}
            />
          ) : (
            <Image source={imagePath?.icPhoto} />
          )}
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={{ ...styles.label3, minHeight: moderateScale(25) }}>
          {type?.translations[0]?.name}
          {type.is_required ? '*' : ''}
        </Text>
      </View>
    );
  };

  const getDoc = async (value, index) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      let data = cloneDeep(addtionalPdfs);
      if (res) {
        data[index].value = res[0].uri;
        data[index].filename = res[0].name;
        data[index].fileData = res[0];
        updateState({ addtionalPdfs: data });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const getPdfView = (type, index) => {
    return (
      <View
        style={{ marginRight: moderateScale(20), marginTop: moderateScale(20) }}>
        <TouchableOpacity
          onPress={() => getDoc(type, index)}
          style={{
            ...styles.imageUpload,
            height: 100,
            width: 100,
            borderRadius: moderateScale(4),
            borderWidth: 1,
            borderColor: colors.blue,
          }}>
          <Text style={styles.uploadStyle}>
            {addtionalPdfs[index].value != undefined &&
              addtionalPdfs[index].value != null &&
              addtionalPdfs[index].value != ''
              ? `${addtionalPdfs[index].filename}`
              : `+ ${strings.UPLOAD}`}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.label3]}>
          {type?.translations[0]?.name}
          {type.is_required ? '*' : ''}
        </Text>
      </View>
    );
  };

  // this funtion use for camera handle
  const cameraHandle = async (index) => {
    const permissionStatus = await androidCameraPermission();
    if (permissionStatus) {
      if (index == 0 || index == 1) {
        cameraHandler(index, {
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
        })
          .then((res) => {
            console.log(res, 'res>>><>>>');
            let data = cloneDeep(addtionalImages);

            data[addtionSelectedImageIndex].value = res?.sourceURL || res?.path;
            data[addtionSelectedImageIndex].fileData = res;
            // data[addtionSelectedImageIndex].filename1 =
            //   addtionSelectedImage?.translations[0]?.name;
            // data[addtionSelectedImageIndex].file_type =
            //   addtionSelectedImage?.file_type;
            // data[addtionSelectedImageIndex].id = addtionSelectedImage?.id;
            // data[addtionSelectedImageIndex].mime = res?.mime;

            updateState({ addtionalImages: data });
          })
          .catch((err) => {
            console.log(err, 'err>>>>');
          });
      }
    }
  };
  const _closeModal = () => {
    updateState({
      subscriptionPopup: false,
    });
  };
  const _onPressSubscribe = () => {
    moveToNewScreen(navigationStrings.SUBSCRIPTION)();
    updateState({
      subscriptionPopup: false,
    });
  };

  const _isCheck = () => {
    isAccept(!accept);
  };
  return (
    <WrapperContainer
      isLoading={isLoading}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <View
        style={{
          height: moderateScaleVertical(60),
          paddingHorizontal: moderateScale(24),
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{
            alignSelf: 'flex-start',
          }}>
          <Image
            source={
              appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.back1
                : imagePath.back1
            }
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
      </View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        style={{
          flex: 1,
        }}>
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: moderateScaleVertical(20) }}>
            <Text
              style={
                isDarkMode
                  ? [
                    {
                      color: colors.black,
                      fontSize: moderateScale(24),
                      fontFamily: fontFamily.medium,
                      marginLeft: moderateScale(24),
                    },
                    { color: MyDarkTheme.colors.text },
                  ]
                  : {
                    color: colors.black,
                    fontSize: moderateScale(24),
                    fontFamily: fontFamily.medium,
                    marginLeft: moderateScale(24),
                  }
              }>
              {strings.CREATE_YOUR_ACCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    {
                      marginLeft: moderateScale(24),
                      fontFamily: fontFamily.regular,
                      marginTop: moderateScaleVertical(15),
                      color: colors.blackOpacity40,
                      letterSpacing: 0.5,
                      fontSize: 18,
                    },
                    { color: MyDarkTheme.colors.text },
                  ]
                  : {
                    marginLeft: moderateScale(24),
                    fontFamily: fontFamily.regular,
                    marginTop: moderateScaleVertical(15),
                    color: colors.blackOpacity40,
                    letterSpacing: 0.5,
                    fontSize: 18,
                  }
              }>
              {strings.ENTER_DETAILS_BELOW}
            </Text>
          </View>

          <View
            style={{
              marginTop: moderateScaleVertical(36),
              marginHorizontal: moderateScale(24),
            }}>
            {!appData?.profile?.preferences?.concise_signup && (
              <BorderTextInput
                onChangeText={_onChangeText('name')}
                placeholder={strings.NAME}
                value={name}
                returnKeyType={'next'}
                containerStyle={{
                  backgroundColor: colors.blackOpacity05,
                  borderWidth: 0,
                }}
                textInputStyle={{
                  fontFamily: fontFamily.regular,
                  fontSize: 18,
                  paddingHorizontal: 18,
                }}
              />
            )}
            {!appData?.profile?.preferences?.concise_signup && (
              <BorderTextInput
                // autoCapitalize={'none'}
                onChangeText={_onChangeText('email')}
                placeholder={strings.EMAIL}
                value={email}
                require={true}
                keyboardType={'email-address'}
                returnKeyType={'next'}
                containerStyle={{
                  backgroundColor: colors.blackOpacity05,
                  borderWidth: 0,
                }}
                textInputStyle={{
                  fontFamily: fontFamily.regular,
                  fontSize: 18,
                  paddingHorizontal: 18,
                }}
              />
            )}
            <PhoneNumberInput
              onCountryChange={_onCountryChange}
              containerStyle={{
                backgroundColor: colors.blackOpacity05,
                borderWidth: 0,
              }}
              TxtInputStyle={{
                fontFamily: fontFamily.regular,
                fontSize: 18,
                paddingHorizontal: 18,
              }}
              onChangePhone={(phoneNumber) =>
                updateState({ phoneNumber: phoneNumber.replace(/[^0-9]/g, '') })
              }
              cca2={cca2}
              phoneNumber={phoneNumber}
              callingCode={state.callingCode}
              placeholder={strings.YOUR_PHONE_NUMBER}
              require={true}
              keyboardType={'phone-pad'}
              color={isDarkMode ? MyDarkTheme.colors.text : null}
            />
            <View style={{ height: moderateScaleVertical(20) }} />
            <BorderTextInput
              secureTextEntry={isShowPassword ? false : true}
              onChangeText={_onChangeText('password')}
              placeholder={strings.PASSWORD}
              value={password}
              containerStyle={{
                backgroundColor: colors.blackOpacity05,
                borderWidth: 0,
              }}
              textInputStyle={{
                fontFamily: fontFamily.regular,
                fontSize: 18,
                paddingHorizontal: 18,
              }}
              rightIcon={
                // password.length > 0
                !isShowPassword
                  ? imagePath.icShowPassword
                  : imagePath.icHidePassword
                // : false
              }
              onPressRight={showHidePassword}
              isShowPassword={isShowPassword}
              rightIconStyle={{}}
              require
              returnKeyType={'next'}
            />

            {!isEmpty(addtionalTextInputs) &&
              addtionalTextInputs.map((item, index) => {
                return getTextInputField(item, index);
              })}

            {!isEmpty(addtionalImages) && (
              <View style={styles.viewStyleForUploadImage}>
                {addtionalImages.map((item, index) => {
                  return getImageFieldView(item, index);
                })}
              </View>
            )}

            {!isEmpty(addtionalPdfs) && (
              <View style={styles.viewStyleForUploadImage}>
                {addtionalPdfs.map((item, index) => {
                  return getPdfView(item, index);
                })}
              </View>
            )}
            <GradientButton
              onPress={onSignup}
              marginTop={moderateScaleVertical(10)}
              btnText={strings.CONTINUE}
              colorsArray={['#FC7049', '#FD312C']}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => cameraHandle(index)}
      />
      {!!subscriptionPopup && (
        <SubscriptionModal
          isVisible={subscriptionPopup}
          onClose={_closeModal}
          onPressSubscribe={_onPressSubscribe}
        />
      )}
      <View style={styles.bottomContainer}>
        <Text
          style={
            isDarkMode
              ? { ...styles.txtSmall, color: MyDarkTheme.colors.text }
              : { ...styles.txtSmall, color: colors.black }
          }>
          {strings.ALREADY_HAVE_AN_ACCOUNT}
          <Text
            onPress={moveToNewScreen(navigationStrings.LOGIN)}
            style={{
              color: isDarkMode ? MyDarkTheme.colors.text : colors.orange,
              fontFamily: fontFamily.medium,
              fontSize: 16,
            }}>
            {strings.LOGIN}
          </Text>
        </Text>
      </View>
    </WrapperContainer>
  );
}
