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
import { useDarkMode } from 'react-native-dynamic';
import DeviceCountry from 'react-native-device-country';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import FastImage from 'react-native-fast-image';
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
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { cameraHandler } from '../../utils/commonFunction';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import { showError } from '../../utils/helperFunctions';
import { androidCameraPermission } from '../../utils/permissions';
import { setUserData } from '../../utils/utils';
import validations from '../../utils/validations';
import stylesFun from './styles';
import { v4 as uuidv4 } from 'uuid';
// import { enableFreeze } from "react-native-screens";
import ButtonWithLoader from '../../Components/ButtonWithLoader';
// enableFreeze(true);


var getPhonesCallingCodeAndCountryData = null;
DeviceCountry.getCountryCode()
  .then((result) => {
    getPhonesCallingCodeAndCountryData = codes.filter(
      (x) => x.isoCode2 == result.code.toUpperCase(),
    );
  })
  .catch((e) => {
    console.log(e);
  });

let addtionSelectedImageIndex = null;

export default function Signup({ navigation }) {
  const [accept, isAccept] = useState(false);
  const {
    appStyle,
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    themeColor,
    themeToggle,
    redirectedFrom,
  } = useSelector((state) => state?.initBoot || {});
  const { dineInType } = useSelector((state) => state?.home);


  const {
    is_user_kyc_for_registration,
    concise_signup,
    referral_code,
    aadhaar_back,
    aadhaar_front,
    aadhaar_number,
    account_name,
    account_number,
    bank_name,
    upi_id,
    ifsc_code,
  } = appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFun({ fontFamily });

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const [state, setState] = useState({
    isLoading: false,
    callingCode:
      !isEmpty(getPhonesCallingCodeAndCountryData) &&
        (getBundleId() !== appIds.sxm2go && getBundleId() !== appIds.speedyDelivery)
        ? getPhonesCallingCodeAndCountryData[0]?.countryCodes[0]?.replace(
          '-',
          '',
        )
        : getBundleId() == appIds.speedyDelivery ? "1" : appData?.profile?.country?.code
          ? appData?.profile?.country?.phonecode
          : '91',
    cca2:
      !isEmpty(getPhonesCallingCodeAndCountryData) &&
        (getBundleId() !== appIds.sxm2go && getBundleId() !== appIds.speedyDelivery)
        ? getPhonesCallingCodeAndCountryData[0]?.isoCode2
        : getBundleId() == appIds.speedyDelivery ? "DO" : appData?.profile?.country?.code
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
    appHashKey: '',
    subscriptionPopup: false,
    aadharFront: {},
    aadharBack: {},
    aadharNumber: '',
    upiId: '',
    bankName: '',
    beneficiaryName: '',
    accountNumber: '',
    ifscCode: '',
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
    aadharFront,
    aadharBack,
    aadharNumber,
    upiId,
    bankName,
    beneficiaryName,
    accountNumber,
    ifscCode,
  } = state;
  const [pickerType, setPickerType] = useState(0);
  const [workType, setWorkType] = useState('client')
  const [isClinetType, setisClinetType] = useState(false)

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const _onCountryChange = (data) => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;
  };
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  const emailValidation = () => {
    let EmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (!EmailRegex.test(email)) {
      showError('email is not coprrect')
      return true
    }
    return false
  }
  const isValidData = () => {
    const error = validations({
// email:email,
      password: password,
      name: name,
      phoneNumber: phoneNumber,
      callingCode: callingCode,
    });
    let emailValidate = emailValidation()
    if (error || !!emailValidate) {
      console.log(error, emailValidate, 'errrororor')
      showError(error || 'Email is not in valid format');
      return;
    }
    return true;
  };

  const isKycValidData = () => {
    const error = validations({
      aadharFrontImg: aadharFront,
      aadharBackImg: aadharBack,
      aadharNumber: aadharNumber,
      upiId: upiId,
      bankName: bankName,
      beneficiaryName: beneficiaryName,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
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
        console.log(res, '<==res userRegistrationDocumentres');
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
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let formdata = new FormData();

    const checkValid = isValidData();
    if (!checkValid) {

      return;
    }

    if (!!is_user_kyc_for_registration) {
      const checkValidKyc = isKycValidData();
      if (!checkValidKyc) {
        return;
      }
      formdata.append('kyc', 1);
      formdata.append('account_name', beneficiaryName);
      formdata.append('bank_name', bankName);
      formdata.append('account_number', accountNumber);
      formdata.append('ifsc_code', ifscCode);

      if (!isEmpty(aadharFront)) {
        formdata.append('adhar_front', {
          name: aadharFront.name,
          type: aadharFront.type,
          uri: aadharFront.uri,
        });
      }
      if (!isEmpty(aadharBack)) {
        formdata.append('adhar_back', {
          name: aadharBack.name,
          type: aadharBack.type,
          uri: aadharBack.uri,
        });
      }
      formdata.append('adhar_number', aadharNumber);
      formdata.append('upi_id', upiId);
    }

    if (!email && !phoneNumber) {
      showError(strings.ENTER_EMAIL_OR_PHONE_NUMBER_WITH_COUNTRY_CODE);
      return;
    }

    {
      !!concise_signup
        ? formdata.append('name', phoneNumber)
        : formdata.append('name', name);
    }

    formdata.append('phone_number', phoneNumber);
    formdata.append('dial_code', callingCode.toString());
    formdata.append('country_code', cca2);
    {
      !!concise_signup
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
    if (Platform.OS === 'android' && !!appHashKey) {
      formdata.append('app_hash_key', appHashKey);
    }

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
    // if (!accept) {
    //   showError(strings.ACCEPT_TERMS_AND_CONDITIONS);
    //   return;
    // }
    console.log(formdata, 'formdata>><');
    updateState({ isLoading: true });

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
        key={String(index)}
        placeholder={type?.translations[0]?.name || ''}
        onChangeText={(text) => handleDynamicTxtInput(text, index, type)}
      />
    );
  };

  //Update Images
  const updateImages = (type, index) => {
    setPickerType(2)
    addtionSelectedImageIndex = index;
    showActionSheet(false);
  };

  const getImageFieldView = (type, index) => {
    return (
      <View
        key={String(index)}
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
        key={String(index)}
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
            if (pickerType == 0) {
              let file = {
                id: uuidv4(),
                name: res?.path.substring(res?.path.lastIndexOf('/') + 1),
                type: res?.mime,
                uri: res?.path,
              };
              updateState({
                aadharFront: file,
              });
              return;
            }
            if (pickerType == 1) {
              let file = {
                id: uuidv4(),
                name: res?.path.substring(res?.path.lastIndexOf('/') + 1),
                type: res?.mime,
                uri: res?.path,
              };
              updateState({
                aadharBack: file,
              });
              return;
            }

            let data = cloneDeep(addtionalImages);
            data[addtionSelectedImageIndex].value = res?.sourceURL || res?.path;
            data[addtionSelectedImageIndex].fileData = res;
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

  const onJoinAs = () => {
    workType == "freelancer" ? navigation.navigate(navigationStrings.WEBLINKS, { id: 3, slug: 'freelancer', title: strings.FREELANCER }) : workType == "client" ? setisClinetType(true) : navigation.navigate(navigationStrings.WEBLINKS, { id: 1, slug: 'vendor', title: strings.VENDER })
  }

  const _isCheck = () => {
    isAccept(!accept);
  };

  const WorkMode = ({ type = '', title = '' }) => <TouchableOpacity onPress={() => setWorkType(type)}
    style={{ ...styles.workModeContainer, borderColor: workType == type ? themeColors?.primary_color : colors.borderColorB, }}>
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
    }}>
      <Text style={{
        fontFamily: fontFamily?.medium,
        fontSize: textScale(14),
      }}>{title}</Text>
      <Image source={workType == type ? imagePath.radioNewActive : imagePath.radioNewInActive} style={{ ...styles.radioBtn, tintColor: workType == type ? themeColors?.primary_color : colors.borderColorB }} />
    </View>
  </TouchableOpacity>

  return (
    <WrapperContainer
      isLoadingB={isLoading}
      // source={loaderOne}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
      <View
        style={{
          
          // height: moderateScaleVertical(60),
          paddingHorizontal: moderateScale(16),
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack(null)}
          style={{ alignSelf: 'flex-start',height: moderateScaleVertical(37),
          width: moderateScale(37),
          backgroundColor: colors.grey1,
          borderRadius: moderateScale(12),
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: moderateScaleVertical(27), }}>
          <Image
            source={
              appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.left_arrow
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
        <View style={{ flex: 1 ,}}>
          {!!appData?.profile?.preferences?.is_service_product_price_from_dispatch && (dineInType === "on_demand") && !!appData?.profile?.preferences?.is_service_price_selection && !isClinetType ? <View style={{
            marginHorizontal: moderateScale(24),
          }}>
            <Text style={{
              fontFamily: fontFamily?.bold,
              fontSize: textScale(18)
            }}>{strings.JOIN_AS} {strings.CLIENT_FREELANCER_VENDOR}</Text>

            <WorkMode type={"client"} title={strings.I_AM_CLIENT} />
            <WorkMode type={"freelancer"} title={strings.I_AM_FREELANCER} />
            <WorkMode type={"vendor"} title={strings.I_AM_VENDOR} />

            <GradientButton
              onPress={onJoinAs}
              marginTop={moderateScaleVertical(40)}
              btnText={`${strings.JOIN_AS} ${workType}`}
              textStyle={{
                textTransform: "none"
              }}
            />
          </View> : <View>
            <View style={{ marginTop: moderateScaleVertical(41) ,marginHorizontal:moderateScale(16)}}>
              <Text
                style={
                  isDarkMode
                    ? [styles.header, { color: MyDarkTheme.colors.text }]
                    : styles.header
                }>
                {strings.CREATE_YOUR_ACCOUNT}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.txtSmall, { color: MyDarkTheme.colors.text }]
                    : styles.txtSmall
                }>
                {strings.ENTER_DETAILS_BELOW}
              </Text>
            </View>

            <View
              style={{
                marginTop: moderateScaleVertical(33),
                marginHorizontal: moderateScale(16),
              }}>
              {!concise_signup && (
                <BorderTextInput
                  onChangeText={_onChangeText('name')}
                  placeholder={strings.NAME}
                  value={name}
                  returnKeyType={'next'}
                  containerStyle={{marginBottom:moderateScaleVertical(16)}}
                />
              )}
              {!concise_signup && (
                <BorderTextInput
                  // autoCapitalize={'none'}
                  onChangeText={_onChangeText('email')}
                  placeholder={strings.EMAIL}
                  value={email}
                  require={true}
                  keyboardType={'email-address'}
                  returnKeyType={'next'}
                  containerStyle={{marginBottom:moderateScaleVertical(16)}}
                />
              )}
              <PhoneNumberInput
                onCountryChange={_onCountryChange}
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
                containerStyle={{backgroundColor:colors.greyNew ,marginBottom:moderateScaleVertical(16)}}
              />
              {/* <View style={{ height: moderateScaleVertical(16) }} /> */}
              <BorderTextInput
                secureTextEntry={isShowPassword ? false : true}
                onChangeText={_onChangeText('password')}
                placeholder={strings.PASSWORD}
                value={password}
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
                require
                returnKeyType={'next'}
              />
              {/* {!appData?.profile?.preferences?.concise_signup && appIds.sxm2go != getBundleId() && (
                <BorderTextInput
                  onChangeText={_onChangeText('referralCode')}
                  placeholder={
                    !!referral_code ? referral_code : strings.ENTERREFERALCODE
                  }
                  value={referralCode}
                  returnKeyType={'next'}
                />
              )} */}

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
              {!!is_user_kyc_for_registration ? (
                <View>
                  <View
                    style={{
                      marginTop: moderateScale(10),
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginHorizontal: 20,
                    }}>
                    <View>
                      {!isEmpty(aadharFront) ? (
                        <View>
                          <Image
                            source={{ uri: aadharFront?.uri }}
                            style={{
                              height: 115,
                              width: 115,
                              borderRadius: moderateScale(5),
                            }}
                          />
                          <TouchableOpacity
                            onPress={() =>
                              updateState({
                                aadharFront: {},
                              })
                            }
                            style={{
                              position: 'absolute',
                              right: -10,
                              top: -10,
                            }}>
                            <Image
                              source={imagePath.crossB}
                              style={{
                                height: 20,
                                width: 20,
                                tintColor: colors.black,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            showActionSheet();
                            setPickerType(0);
                          }}
                          style={styles.imageUpload}>
                          <Image source={imagePath?.icPhoto} />
                        </TouchableOpacity>
                      )}

                      <Text
                        numberOfLines={2}
                        style={{ ...styles.label3, minHeight: moderateScale(25) }}>
                        {!!aadhaar_front ? aadhaar_front : strings.AADHAR_FRONT}*
                      </Text>
                    </View>
                    <View>
                      {!isEmpty(aadharBack) ? (
                        <View>
                          <Image
                            source={{ uri: aadharBack?.uri }}
                            style={{
                              height: 115,
                              width: 115,
                              borderRadius: moderateScale(5),
                            }}
                          />
                          <TouchableOpacity
                            onPress={() =>
                              updateState({
                                aadharBack: {},
                              })
                            }
                            style={{
                              position: 'absolute',
                              right: -10,
                              top: -10,
                            }}>
                            <Image
                              source={imagePath.crossB}
                              style={{
                                height: 20,
                                width: 20,
                                tintColor: colors.black,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            showActionSheet();
                            setPickerType(1);
                          }}
                          style={styles.imageUpload}>
                          <Image source={imagePath?.icPhoto} />
                        </TouchableOpacity>
                      )}

                      <Text
                        numberOfLines={2}
                        style={{ ...styles.label3, minHeight: moderateScale(25) }}>
                        {!!aadhaar_back ? aadhaar_back : strings.AADHAR_BACK}*
                      </Text>
                    </View>
                  </View>
                  <BorderTextInput
                    placeholder={`${!!aadhaar_number ? aadhaar_number : strings.AADHAR_NUMBER}*`}
                    onChangeText={_onChangeText('aadharNumber')}
                    value={aadharNumber}
                    keyboardType={'number-pad'}
                    maxLength={12}
                  />
                  <BorderTextInput
                    placeholder={`${!!!upi_id ? upi_id : strings.UPI_ID}*`}
                    onChangeText={_onChangeText('upiId')}
                    value={upiId}
                  />
                  <BorderTextInput
                    value={bankName}
                    placeholder={`${!!bank_name ? bank_name : strings.BANK_NAME}*`}
                    onChangeText={_onChangeText('bankName')}
                  />
                  <BorderTextInput
                    value={beneficiaryName}
                    placeholder={`${!!account_name ? account_name : strings.BENEFICIARY_NAME}*`}
                    onChangeText={_onChangeText('beneficiaryName')}
                  />
                  <BorderTextInput
                    value={accountNumber}
                    placeholder={`${!!account_number ? account_number : strings.ACCOUNT_NUMBER}*`}
                    onChangeText={_onChangeText('accountNumber')}
                    keyboardType={'number-pad'}
                  />
                  <BorderTextInput
                    value={ifscCode}
                    placeholder={`${!!ifsc_code ? ifsc_code : strings.IFSC_CODE}*`}
                    onChangeText={_onChangeText('ifscCode')}
                    maxLength={12}
                  />
                </View>
              ) : null}
              {/* <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={_isCheck}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}>
                  <FastImage
                    style={{
                      width: moderateScale(15),
                      height: moderateScale(15),
                    }}
                    tintColor={
                      isDarkMode ? MyDarkTheme.colors.text : colors.black
                    }
                    source={
                      accept
                        ? imagePath.checkBox2Active
                        : imagePath.checkBox2InActive
                    }
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text
                    style={{
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    }}>
                    {strings.I_ACCEPT}
                  </Text>
                  <Text
                    onPress={() =>
                      navigation.navigate(navigationStrings.WEBLINKS, { id: 2 })
                    }
                    style={{ color: colors.themeColor }}>
                    {' '}
                    {`${strings.TERMS_CONDITIONS} `}
                  </Text>
                  <Text
                    style={{
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    }}>
                    {strings.HAVE_READ}
                  </Text>
                  <Text
                    onPress={() =>
                      navigation.navigate(navigationStrings.WEBLINKS, { id: 1 })
                    }
                    style={{ color: colors.themeColor }}>
                    {`${strings.PRICACY_POLICY}`}.
                  </Text>
                </View>
              </View> */}

              {/* <ButtonWithLoader
              btnText={strings.SIGNUP_AN_ACCOUNT}
              btnStyle={{marginTop: moderateScaleVertical(10)}}
              onPress={onSignup}
            /> */}
              <GradientButton
                onPress={onSignup}
                marginTop={moderateScaleVertical(10)}
                btnText={strings.REGISTER}
                textStyle={{fontSize:textScale(15)}}
              />
            </View>
          </View>}
          <View style={styles.bottomContainer}>
            <Text
              style={
                isDarkMode
                  ? { ...styles.txtSmall, color: MyDarkTheme.colors.text }
                  : { ...styles.txtSmall, }
              }>
              {strings.ALREADY_HAVE_AN_ACCOUNT}
              <Text
                onPress={moveToNewScreen(navigationStrings.LOGIN)}
                style={{
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    :colors.lightSkyB,
                  // fontFamily: fontFamily.bold,
                }}>
                {strings.LOGIN}
              </Text>
            </Text>
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
    </WrapperContainer>
  );
}
