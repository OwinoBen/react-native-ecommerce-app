import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  I18nManager,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHtml, { HTML } from 'react-native-render-html';
import ActionSheet from 'react-native-actionsheet';
import { useDarkMode } from 'react-native-dynamic';
import DeviceInfo from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import BorderTextInput from '../../Components/BorderTextInput';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { cameraHandler } from '../../utils/commonFunction';
import { showError, showSuccess } from '../../utils/helperFunctions';
import { androidCameraPermission } from '../../utils/permissions';
import validator from '../../utils/validations';
import stylesFun from './styles';
import Accordion from 'react-native-collapsible/Accordion';
import { MenuProvider } from 'react-native-popup-menu';
import DropDownPicker from 'react-native-dropdown-picker';

let clickedIndx = null;
let clickedItem = null;
let isVendorLogo = false;

let vendorTypes = [
  { label: 'Shopper', value: 'vendor' },
  { label: 'ClickOKartPartner', value: 'seller' },
];

export default function WebLinks(props) {
  const { navigation, route } = props

  console.log("propsprops", props)
  let actionSheet = useRef();

  const {
    appData,
    themeColors,
    appStyle,
    currencies,
    languages,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot || {});
  console.log(appData, 'appData>>>>>>>');
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const paramData = route?.params;
  // const [VendorLocation, setVendorLocation] = useState(address)
  // setVendorLocation(paramData?.formatted_address)
  console.log(paramData, "paramDataparamData")
  const [state, setState] = useState({
    isLoading: false,
    htmlContent: null,
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
    phoneNumber: '',
    fullname: '',
    email: '',
    title: '',
    password: '',
    confirm_password: '',
    description: '',
    vendor_name: '',
    address: '',
    website: '',
    isDineIn: false,
    isTakeaway: false,
    isDelivery: false,
    vendorRegDocs: [],
    vendorRegisterationDocs: [],
    pageData: [],
    driverPic: '',
    driverName: '',
    driverPhoneNumber: '',
    driverTypes: [
      { id: 1, name: strings.EMPLOYEE },
      { id: 2, name: strings.FREELANCER },
    ],
    driverTransportDetails: '',
    driverUID: '',
    driverLicencePlate: '',
    driverColor: '',
    driverTransportType: '',
    driverRegistrationDocs: [],
    driverTransportTypeIndx: null,
    isDriverType: false,
    selectedDriverType: '',
    isTeams: false,
    selectedTeam: '',
    isTagsShow: false,
    selectedTags: [],
    tagsViewHeight: moderateScale(44),
    vendorLogo: '',
    vendorBanner: '',
    isTermsConditions: false,
    dialCode: appData?.profile.country?.phonecode
      ? appData?.profile.country?.phonecode
      : '91',
    driverTagsAry: [],
    activeSections: [],
    isProfilePhoto: false,
  });
  //update your state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Redux Store Data

  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily });
  const commonStyles = commonStylesFun({ fontFamily });
  const { location, appMainData, dineInType } = useSelector(
    (state) => state?.home,
  );

  const {
    cca2,
    phoneNumber,
    isDineIn,
    isDelivery,
    isTakeaway,
    fullname,
    email,
    password,
    confirm_password,
    vendor_name,
    address,
    vendorRegDocs,
    isLoading,
    htmlContent,
    vendorRegisterationDocs,
    pageData,
    driverPic,
    driverName,
    driverPhoneNumber,
    driverTypes,
    driverTransportDetails,
    driverUID,
    driverLicencePlate,
    driverColor,
    driverTransportType,
    driverRegistrationDocs,
    driverTransportTypeIndx,
    isDriverType,
    selectedDriverType,
    isTeams,
    selectedTeam,
    isTagsShow,
    selectedTags,
    tagsViewHeight,
    title,
    description,
    website,
    vendorLogo,
    vendorBanner,
    isTermsConditions,
    callingCode,
    driverTagsAry,
    activeSections,
    isProfilePhoto,
  } = state;

  const [selectedVendorType, setVendorType] = useState({});
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  useEffect(() => {
    _getLocationFromParams();
  }, [paramData?.details]);

  useEffect(() => {
    updateState({ isLoading: true });
    getCmsPageDetail();
  }, [paramData?.id]);

  // //Get list of all payment method
  const getCmsPageDetail = () => {
    let data = {};
    data['page_id'] = paramData && paramData?.id;
    actions
      .getCmsPageDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log('Cms page detail', res);
        updateState({ isLoading: false });
        updateState({
          htmlContent: res?.data?.page_detail?.primary?.description,
          vendorRegDocs: res?.data?.vendor_registration_documents,
          pageData: res?.data,
          driverTagsAry: res?.data?.tags,
        });
      })
      .catch((err) => {
        console.log(err, 'err......3');
        showError(err?.message || "Something went wrong")
        updateState({ isLoading: false });
      });
  };

  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({ isLoading: false });
    showError(error?.message || error?.error);
  };
  const _onChangeText = (key) => (val) => {
    updateState({ [key]: val });
  };
  const _onCountryChange = (data) => {
    updateState({ cca2: data.cca2, callingCode: data.callingCode[0] });
    return;
  };
  console.log(pageData, 'pageData');
  const isValidData = () => {
    if (pageData?.page_detail?.primary?.type_of_form == 2) {
      const error = validator({
        name: driverName,
        phoneNumber: driverPhoneNumber,
        driverType: selectedDriverType,
        driverTeam: selectedTeam,
        driverTransportDetails: driverTransportDetails,
        driverUID: driverUID,
        driverLicencePlate: driverLicencePlate,
        driverColor: driverColor,
        driverTransportType: driverTransportType,
      });

      if (error) {
        showError(error);
        return;
      }
      return true;
    } else {
      const error = validator({
        name: fullname,
        email: email,
        phoneNumber: phoneNumber,
        vendorTitle: title,
        newPassword: password,
        confirmPassword: confirm_password,
        vendorLogo: vendorLogo,
        vendorName: vendor_name,
        vendorDesc: description,
        vendorAddress: address,
      });

      if (error) {
        showError(error);
        return;
      }
      return true;
    }
  };

  const _onSubmit = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }

    if (pageData?.page_detail?.primary?.type_of_form == 2) {
      // var isRequired = true;

      // pageData?.driver_registration_documents.map((itm, indx) => {
      //   if (itm.is_required) {
      //     if (isRequired) {
      //       if (isEmpty(driverRegistrationDocs)) {
      //         showError(`Please upload ${itm?.name}`);
      //         isRequired = false;
      //         return;
      //       } else {
      //         driverRegistrationDocs.map((item, index) => {
      //           if (item.id !== itm.id) {
      //             showError(`Please upload ${item?.name}`);
      //             isRequired = false;
      //             return;
      //           }
      //         });
      //       }
      //     }
      //   }
      // });

      // return;

      var formData = new FormData();
      formData.append('name', driverName);
      formData.append('phone_number', driverPhoneNumber);
      formData.append(
        'type',
        !!selectedDriverType ? selectedDriverType.name : '',
      );
      formData.append('dialCode', callingCode);
      formData.append('team', !!selectedTeam ? selectedTeam?.id : '');
      formData.append('make_model', driverTransportDetails);
      formData.append('uid', driverUID);
      formData.append('plate_number', driverLicencePlate);
      formData.append('color', driverColor);
      formData.append(
        'vehicle_type_id',
        !!driverTransportType ? driverTransportType?.value : '',
      );

      formData.append('upload_photo', {
        uri: driverPic.path,
        name: driverPic.filename,
        filename: driverPic.filename,
        type: driverPic.mime,
      });
      selectedTags.map((item) => {
        formData.append('tags[]', item.name);
      });
      driverRegistrationDocs.map((item, indx) => {
        formData.append(
          item?.item?.slug,
          item?.item?.file_type === 'Image'
            ? {
              uri: item.fileData.path,
              name: item.fileData.filename || item?.item?.name,
              filename: item.fileData.filename || item?.item?.name,
              type: item.fileData.mime,
            }
            : item?.fileData,
        );
      });
      console.log(formData, 'formDataaaaaa');

      updateState({ isLoading: true });
      actions
        .driverRegisteration(formData, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
          'Content-type': 'multipart/form-data',
        })
        .then((res) => {
          console.log(res, 'serverResponse');
          updateState({
            isLoading: false,
          });
          showSuccess(res.message);
          navigation.goBack();
        })
        // err => console.log(err ,"formDataaaaaaererrr")
        .catch((err) => {
          console.log(err, 'err......2');
        });
    } else {
      var formData = new FormData();
      var isRequired = true;
      formData.append('full_name', fullname);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber);
      formData.append('title', title);
      formData.append('dialCode', callingCode);
      formData.append('password', password);
      formData.append('confirm_password', confirm_password);
      formData.append('name', vendor_name);
      formData.append('vendor_description', description);
      formData.append('address', address);
      formData.append('website', website);
      formData.append('delivery', isDelivery ? 1 : 0);
      formData.append('dine_in', isDineIn ? 1 : 0);
      formData.append('takeaway', isTakeaway ? 1 : 0);
      formData.append('countryData', cca2);
      formData.append('check_conditions', isTermsConditions ? 1 : 0);
      formData.append(
        'vendor_type',
        selectedVendorType?.value == 'vendor' ? 0 : 1,
      );
      formData.append('company_name', companyName);
      formData.append('gst_number', gstNumber);
      formData.append('account_name', accountName);
      formData.append('bank_name', bankName);
      formData.append('account_number', accountNumber);
      formData.append('ifsc_code', ifscCode);
      formData.append('upload_logo', {
        uri: vendorLogo.path,
        name: vendorLogo.filename,
        filename: vendorLogo.filename,
        type: vendorLogo.mime,
      });
      formData.append('upload_banner', {
        uri: vendorBanner.path,
        name: vendorBanner.filename,
        filename: vendorBanner.filename,
        type: vendorBanner.mime,
      });

      // console.log(vendorRegisterationDocs, 'vendorRegDocs');
      // vendorRegDocs?.map((itm) => {
      //   if (itm?.is_required) {
      //     if (isEmpty(vendorRegisterationDocs)) {
      //       if (isRequired) {
      //         isRequired = false;
      //         showError(`${itm.primary?.name} is required`);
      //         return;
      //       }
      //     } else {
      //       var itemReplacement = {};
      //       vendorRegisterationDocs.map((item) => {
      //         if (item?.item?.primary?.id != itm?.id) {
      //           if (isRequired) {
      //             itemReplacement = itm?.primary?.name;
      //             isRequired = false;
      //             showError(`${itemReplacement} is required`);
      //             return;
      //           }
      //         }
      //       });
      //       // console.log(itemReplacement, 'itemReplacement');
      //       // if (!isEmpty(itemReplacement)) {
      //       //   showError(`${itemReplacement} is required`);
      //       //   return;
      //       // }
      //     }
      //   }
      // });

      // return;
      // if (isRequired) {
      updateState({ isLoading: true });

      vendorRegisterationDocs.map((item, indx) => {
        formData.append(
          item?.item?.primary?.slug,
          item?.item?.file_type == 'Image'
            ? {
              uri: item.fileData.path,
              name: item.fileData.filename,
              filename: item.fileData.filename,
              type: item.fileData.mime,
            }
            : item?.fileData,
        );
      });

      console.log(JSON.stringify(formData), 'formDatastringfy');
      actions
        .vendorRegisteration(formData, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
          'Content-Type': 'multipart/form-data',
        })
        .then((res) => {
          console.log(res, 'serverResponse');
          updateState({
            isLoading: false,
          });
          showSuccess(res.message);
          navigation.goBack();
        })
        .catch(errorMethod);
    }
  };

  const _dynamicTextInputChange = (item, indx, mainItem) => {
    if (pageData?.page_detail?.primary?.type_of_form == 2) {
      const driverRegistrationDocsAry = [...driverRegistrationDocs];
      driverRegistrationDocsAry[indx] = {
        item: mainItem,
        fileData: item,
      };
      updateState({
        driverRegistrationDocs: driverRegistrationDocsAry,
      });
    } else {
      const vendorRegisterationDocsAry = [...vendorRegisterationDocs];
      vendorRegisterationDocsAry[indx] = {
        item: mainItem,
        fileData: item,
      };
      updateState({
        vendorRegisterationDocs: vendorRegisterationDocsAry,
      });
    }
  };

  const uploadDocs = async (type, item, indx) => {
    console.log(type, 'type');
    console.log(item, 'item');
    console.log(indx, 'indx');
    if (type == 'Pdf') {
      try {
        const res = await DocumentPicker.pick({
          type: DocumentPicker.types.pdf,
        });

        if (pageData?.page_detail?.primary?.type_of_form == 2) {
          const driverRegistrationDocsAry = [...driverRegistrationDocs];
          driverRegistrationDocsAry[indx] = {
            item: item,
            fileData: res[0],
          };
          updateState({
            driverRegistrationDocs: driverRegistrationDocsAry,
          });
        } else {
          const vendorRegPdfImgAry = [...vendorRegisterationDocs];
          vendorRegPdfImgAry[indx] = {
            item: item,
            fileData: res[0],
          };
          updateState({
            vendorRegisterationDocs: vendorRegPdfImgAry,
          });
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('cancel');
        } else {
          throw err;
        }
      }
    } else {
      clickedIndx = indx;
      clickedItem = item;
      actionSheet.current.show();
    }
  };

  useEffect(() => {
    console.log(vendorRegisterationDocs, 'vendorRegisterationDocs');
  }, [vendorRegisterationDocs]);

  console.log(clickedIndx, 'clickedIndx');
  const cameraHandle = async (index) => {
    console.log('calloing....1');
    const permissionStatus = await androidCameraPermission();
    console.log(index, 'indxxxxxx');
    if (permissionStatus) {
      console.log('calloing....');
      if (index == 0 || index == 1) {
        cameraHandler(index, {
          width: 300,
          height: 400,
          cropping: true,
          cropperCircleOverlay: true,
          mediaType: 'photo',
        })
          .then((res) => {
            console.log(res, 'ressifIndx');
            if (res && res.data) {
              if (pageData?.page_detail?.primary?.type_of_form == 2) {
                // console.log(clickedIndx,"clickedIndx")
                if (clickedIndx != null && isProfilePhoto) {
                  {
                    const driverRegistrationDocsAry = [
                      ...driverRegistrationDocs,
                    ];
                    driverRegistrationDocsAry[clickedIndx] = {
                      item: clickedItem,
                      fileData: res,
                    };

                    updateState({
                      driverRegistrationDocs: driverRegistrationDocsAry,
                    });
                  }
                  console.log(driverRegistrationDocs, 'driverRegistrationDocs');
                  clickedIndx = null;
                } else {
                  updateState({
                    driverPic: res,
                    isProfilePhoto: true,
                  });
                  console.log(res, 'resElse');
                }
              } else {
                console.log(res, 'regis doc');
                console.log(clickedItem, 'clickedItem doc');
                if (!!clickedItem) {
                  const vendorRegPdfImgAry = [...vendorRegisterationDocs];
                  vendorRegPdfImgAry[clickedIndx] = {
                    item: clickedItem,
                    fileData: res,
                  };

                  updateState({
                    vendorRegisterationDocs: vendorRegPdfImgAry,
                  });
                  // clickedIndx = null;
                  clickedItem = null;
                } else {
                  if (isVendorLogo) {
                    updateState({
                      vendorLogo: res,
                    });
                  } else {
                    updateState({
                      vendorBanner: res,
                    });
                  }
                }
              }
            }
          })
          .catch((err) => console.log(err, 'errerrerr'));
      } else {
        console.log('Cancle pressed');
      }
    }
  };

  const _renderFields = ({ item, index }) => {
    return (
      <View
        style={{
          marginTop: moderateScale(15),
        }}>
        <Text
          style={{
            color: colors.blackOpacity43,
            fontFamily: fontFamily.bold,
            fontSize: textScale(13),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.borderLight,
          }}>
          {item.primary?.name || item?.name}
          {item?.is_required ? '*' : ''}
        </Text>

        <View>
          {item?.file_type == 'Pdf' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: moderateScaleVertical(8),
              }}>
              <TouchableOpacity
                onPress={() => uploadDocs(item?.file_type, item, index)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.greyMedium,
                  borderRadius: moderateScale(5),
                }}>
                <Text
                  style={{
                    marginHorizontal: moderateScale(8),
                    marginVertical: moderateScaleVertical(8),
                  }}>
                  {strings.CHOOSE_FILE}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  marginLeft: 6,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.borderLight,
                }}>
                {pageData?.page_detail?.primary?.type_of_form == 2
                  ? driverRegistrationDocs[index]?.fileData
                    ? driverRegistrationDocs[index]?.fileData?.name
                    : strings.NO_FILE_CHOSEN
                  : vendorRegisterationDocs[index]?.fileData
                    ? vendorRegisterationDocs[index]?.fileData?.name
                    : strings.NO_FILE_CHOSEN}
              </Text>
            </View>
          )}
          {item?.file_type == 'Image' && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => uploadDocs(item?.file_type, item, index)}
              style={{
                ...styles.imageView,
                marginVertical: moderateScale(5),
                marginHorizontal: 0,
              }}>
              <Image
                source={
                  pageData?.page_detail?.primary?.type_of_form == 2
                    ? driverRegistrationDocs[index]?.fileData?.path
                      ? {
                        uri: driverRegistrationDocs[index]?.fileData?.path,
                      }
                      : imagePath.icCamIcon
                    : vendorRegisterationDocs[index]?.fileData?.path
                      ? {
                        uri: vendorRegisterationDocs[index]?.fileData?.path,
                      }
                      : imagePath.icCamIcon
                }
                style={{
                  // tintColor:
                  //   pageData?.page_detail?.primary?.type_of_form == 2
                  //     ? !driverRegistrationDocs[index]?.fileData?.path
                  //       ? themeColors.primary_color
                  //       : null
                  //     : !vendorRegisterationDocs[index]?.fileData?.path
                  //     ? themeColors.primary_color
                  //     : null,
                  height:
                    pageData?.page_detail?.primary?.type_of_form == 2
                      ? driverRegistrationDocs[index]?.fileData?.path
                        ? height / 6 - moderateScale(15)
                        : 30
                      : vendorRegisterationDocs[index]?.fileData?.path
                        ? height / 6 - moderateScale(15)
                        : 30,
                  width:
                    pageData?.page_detail?.primary?.type_of_form == 2
                      ? driverRegistrationDocs[index]?.fileData?.path
                        ? width - moderateScale(80)
                        : 30
                      : vendorRegisterationDocs[index]?.fileData?.path
                        ? width - moderateScale(80)
                        : 30,
                }}
                resizeMode={'cover'}
              />
            </TouchableOpacity>
          )}
          {item?.file_type == 'Text' && (
            <BorderTextInput
              // secureTextEntry={true}
              placeholder={`Enter ${item?.primary?.name || item?.name}`}
              onChangeText={(itm) => _dynamicTextInputChange(itm, index, item)}
              containerStyle={{
                ...styles.containerStyle,
                marginBottom: 0,
                marginTop: moderateScale(3),
              }}
            />
          )}
        </View>
      </View>
    );
  };

  const _transportTypeSelect = (itm, indx) => {
    updateState({
      driverTransportType: itm,
      driverTransportTypeIndx: indx,
    });
  };

  const _renderTransportTypes = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => _transportTypeSelect(item, index)}
        style={{
          borderColor:
            driverTransportTypeIndx === index
              ? themeColors.primary_color
              : colors.borderColorB,
          borderWidth: 1,
          borderRadius: moderateScale(5),
        }}>
        <Image
          source={{ uri: item?.image }}
          style={{
            height: moderateScale(50),
            width: moderateScale(57),
            tintColor: isDarkMode ? colors.white : colors.black,
          }}
        />
      </TouchableOpacity>
    );
  };

  const _onTagSelect = (itm, indx) => {
    if (!selectedTags.includes(itm)) {
      updateState({
        selectedTags: [...selectedTags, itm],
      });
    } else {
      const selectedTagsAry = [...selectedTags];
      const ind = selectedTagsAry.findIndex((item) => item.id === itm.id);
      var result = selectedTagsAry.filter((item, idx) => idx !== ind);
      updateState({
        selectedTags: result,
      });
    }
  };

  const removeTag = (itm, indx) => {
    const selectedTagsAry = [...selectedTags];

    const ind = selectedTagsAry.findIndex((item) => item.id == itm.id);
    var result = selectedTagsAry.filter((item, idx) => idx !== ind);

    updateState({
      selectedTags: result,
    });
  };

  const _onLinkPress = (route) => {
    if (route == 'terms') {
      navigation.navigate(navigationStrings.WEBVIEWSCREEN, {
        url: pageData?.terms_and_conditions,
      });
    } else {
      navigation.navigate(navigationStrings.WEBVIEWSCREEN, {
        url: pageData?.privacy_policy,
      });
    }
  };

  const onSearchTags = (text) => {
    const driverTagsNewAry = [...pageData?.tags];
    let searchedAry;
    if (text) {
      searchedAry = driverTagsNewAry.filter((item) => {
        return item?.name.toLowerCase().includes(text.toLowerCase());
      });
      updateState({ driverTagsAry: searchedAry });
    } else {
      updateState({ driverTagsAry: pageData?.tags });
    }
  };

  const _renderSectionTitle = (section) => {
    return (
      <View
        style={{
          height: moderateScaleVertical(15),
        }}></View>
    );
  };

  const _renderHeader = (section) => {
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.backGroundGrey,
          height: moderateScaleVertical(50),
          justifyContent: 'center',
          borderLeftWidth: 4,
          borderLeftColor: themeColors.primary_color,
        }}>
        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackC,
            marginLeft: moderateScale(15),
            fontFamily: fontFamily.bold,
            fontSize: textScale(13),
          }}>
          {section.question}
        </Text>
      </View>
    );
  };

  const _renderContent = (section) => {
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.backGroundGreyD,
          paddingHorizontal: moderateScale(20),
          paddingBottom: moderateScaleVertical(15),
        }}>
        <Text
          style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.blackC,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}>
          {section.answer}
        </Text>
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    updateState({
      activeSections: activeSections,
    });
  };

  if (pageData?.page_detail?.primary?.type_of_form == 3) {
    return (
      <WrapperContainer
        bgColor={colors.backGroundGreyD}
        statusBarColor={colors.backGroundGreyD}>
        <Header
          leftIcon={
            appStyle?.homePageLayout === 2
              ? imagePath.backArrow
              : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.back
          }
          centerTitle={(paramData && paramData?.title) || ''}
          headerStyle={
            isDarkMode
              ? { backgroundColor: MyDarkTheme.colors.background }
              : { backgroundColor: colors.backGroundGreyD }
          }
          onPressLeft={onPressGoBack}
        />
        <ScrollView
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.backGroundGreyD,
          }}
          showsVerticalScrollIndicator={false}>
          <Accordion
            sections={pageData?.faq_data}
            activeSections={activeSections}
            renderSectionTitle={_renderSectionTitle}
            renderHeader={_renderHeader}
            renderContent={_renderContent}
            onChange={_updateSections}
            containerStyle={{
              paddingHorizontal: moderateScale(15),
            }}
          />
          <View style={{ height: 50 }} />
        </ScrollView>
      </WrapperContainer>
    );
  }

  const _getLocationFromParams = () => {
    console.log(
      paramData?.details?.formatted_address,
      location?.address,
      'paramData?.details?.formatted_address',
    );
    if (
      paramData?.details &&
      paramData?.details?.formatted_address != location?.address
    ) {
      const address = paramData?.details?.formatted_address;
      const res = {
        address: address,
        latitude: paramData?.details?.geometry?.location.lat,
        longitude: paramData?.details?.geometry?.location.lng,
      };
      updateState({
        address: address,
      });
    } else {
      updateState({
        address: location?.address,
      });
    }
  };

  console.log(address, ' adressNdParam');

  console.log(htmlContent, 'htmlContenthtmlContent');

  const onPressGoBack = () => {
    if (!!paramData?.isComeFromDrawer) {
      navigation.openDrawer()
    } else {
      navigation.goBack()
    }
  }

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      isLoading={isLoading}


    >
      <MenuProvider>
        <Header
          leftIcon={
            appStyle?.homePageLayout === 2
              ? imagePath.backArrow
              : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.back
          }
          centerTitle={(paramData && paramData?.title) || ''}
          headerStyle={
            isDarkMode
              ? { backgroundColor: MyDarkTheme.colors.background }
              : { backgroundColor: Colors.white }
          }
          onPressLeft={onPressGoBack}
        />
        <View style={{ ...commonStyles.headerTopLine }} />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,

          }}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              marginBottom: moderateScaleVertical(25),
              marginHorizontal: moderateScale(16),
              justifyContent: I18nManager.isRTL ? 'flex-end' : 'flex-start',
              flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
            }}>
            {htmlContent && (
              //  <View style={{flexDirection: I18nManager.isRTL ? 'row-reverse': 'row' }} >
              <RenderHtml
                contentWidth={width}
                source={{ html: htmlContent }}
                tagsStyles={{
                  p: {
                    color: isDarkMode ? colors.white : colors.black,
                    width: '100%',
                    textAlign: 'justify',
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    fontFamily: fontFamily.medium,
                    fontSize: textScale(14),
                  },
                  ul: {
                    color: isDarkMode ? colors.white : colors.black,
                    width: '100%',
                    textAlign: 'justify',
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                    fontFamily: fontFamily.medium,
                    fontSize: textScale(14),
                  },
                  h2: {
                    width: height / 2,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                  },
                  td: {
                    width: height / 2,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                  },
                  tr: {
                    width: height / 2,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                  },
                }}
              />
              //  </View>
              // <HTMLView
              //   stylesheet={isDarkMode ? htmlStyle : null}
              //   value={`<p>${htmlContent}</p>`}
              // />
            )}
          </View>

          {pageData?.page_detail?.primary?.type_of_form == 1 && (
            <View style={styles.mainView}>
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    marginBottom: moderateScaleVertical(12),
                    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                    alignSelf: 'flex-start',
                  }}>
                  <Text style={styles.detailStyle}>
                    {strings.PERSONAL_DETAILS}
                  </Text>
                </View>
                <BorderTextInput
                  placeholder={`${strings.YOUR_NAME}*`}
                  onChangeText={_onChangeText('fullname')}
                  containerStyle={styles.containerStyle}
                />

                <BorderTextInput
                  placeholder={`${strings.YOUR_EMAIL}*`}
                  onChangeText={_onChangeText('email')}
                  containerStyle={styles.containerStyle}
                  keyboardType={'email-address'}
                />
                <PhoneNumberInput
                  onCountryChange={_onCountryChange}
                  onChangePhone={(phoneNumber) =>
                    updateState({
                      phoneNumber: phoneNumber.replace(/[^0-9]/g, '')
                    })
                  }
                  cca2={cca2}
                  phoneNumber={phoneNumber}
                  callingCode={state.callingCode}
                  placeholder={`${strings.YOUR_PHONE_NUMBER}*`}
                  keyboardType={'phone-pad'}
                  containerStyle={styles.containerStyle}
                />

                <BorderTextInput
                  placeholder={strings.ENTER_TITLE}
                  label={'Title'}
                  onChangeText={_onChangeText('title')}
                  containerStyle={styles.containerStyle}
                />

                <BorderTextInput
                  secureTextEntry={true}
                  placeholder={`${strings.ENTER_PASSWORD}*`}
                  onChangeText={_onChangeText('password')}
                  containerStyle={styles.containerStyle}
                />
                <BorderTextInput
                  secureTextEntry={true}
                  placeholder={`${strings.CONFIRM_PASSWORD}*`}
                  onChangeText={_onChangeText('confirm_password')}
                  containerStyle={styles.containerStyle}
                />
                <View style={{ marginVertical: moderateScaleVertical(10) }}>
                  <View
                    style={{
                      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                      alignSelf: 'flex-start',
                    }}>
                    <Text style={styles.detailStyle}>
                      {strings.STORE_DETAILS}
                    </Text>
                  </View>
                  <View style={{ marginVertical: moderateScaleVertical(20) }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          width: width / 2 - moderateScale(22),
                        }}>
                        <Text style={styles.uploadText}>
                          {strings.UPLOAD_LOGO}*
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            isVendorLogo = true;
                            actionSheet.current.show();
                          }}>
                          <View style={styles.imageView}>
                            <View
                              style={[
                                styles.viewOverImage2,
                                { borderStyle: 'dashed' },
                              ]}>
                              <Image
                                source={
                                  vendorLogo?.path
                                    ? { uri: vendorLogo.path }
                                    : imagePath.icCamIcon
                                }
                                // source={{uri:'file:///storage/emulated/0/Android/data/com.donepacked/files/Pictures/111fa92e-6b97-46e9-a459-a50b57c91641.jpg'}}
                                style={{
                                  // tintColor: vendorLogo.path
                                  //   ? null
                                  //   : themeColors.primary_color,
                                  height: vendorLogo.path
                                    ? height / 6 - 10
                                    : 30,
                                  width: vendorLogo.path
                                    ? width / 2 - moderateScale(62)
                                    : moderateScale(30),
                                }}
                                resizeMode="cover"
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          width: width / 2 - moderateScale(22),
                        }}>
                        <Text style={styles.uploadText}>
                          {strings.UPLOAD_BANNER}
                        </Text>

                        <View style={styles.imageView}>
                          <TouchableOpacity
                            onPress={() => {
                              isVendorLogo = false;

                              actionSheet.current.show();
                            }}
                            style={[
                              styles.viewOverImage2,
                              { borderStyle: 'dashed' },
                            ]}>
                            <Image
                              source={
                                vendorBanner.path
                                  ? { uri: vendorBanner.path }
                                  : imagePath.icCamIcon
                              }
                              style={{
                                // tintColor: vendorBanner.path
                                //   ? null
                                //   : themeColors.primary_color,
                                height: vendorBanner.path
                                  ? height / 6 - 10
                                  : moderateScale(30),
                                width: vendorBanner.path
                                  ? width / 2 - moderateScale(62)
                                  : moderateScale(30),
                              }}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <BorderTextInput
                  placeholder={`${strings.VENDOR_NAME}*`}
                  onChangeText={_onChangeText('vendor_name')}
                  containerStyle={styles.containerStyle}
                />
                <BorderTextInput
                  placeholder={`${strings.DESCRIPTION}*`}
                  onChangeText={_onChangeText('description')}
                  containerStyle={styles.containerStyle}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    navigation.navigate(navigationStrings.LOCATION, {
                      type: 'vendorRegistration',
                    })
                  }
                  style={{
                    flexDirection: 'row',
                    height: moderateScaleVertical(49),
                    color: colors.white,
                    borderWidth: 1,
                    borderRadius: 13,
                    borderColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.borderLight,
                    marginBottom: 20,
                    overflow: 'hidden',
                    alignItems: 'center',
                    ...styles.containerStyle,
                  }}>
                  <Text
                    style={{
                      flex: 1,
                      opacity: 0.7,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(14),
                      paddingHorizontal: 8,
                      paddingTop: 0,
                      paddingBottom: 0,
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}>
                    {address != '' && address != null
                      ? `${address}`
                      : `${strings.ADDRESS}*`}

                  </Text>
                </TouchableOpacity>

                <BorderTextInput
                  placeholder={strings.WEBSITE}
                  onChangeText={_onChangeText('website')}
                  containerStyle={styles.containerStyle}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: moderateScale(10),
                    marginVertical: moderateScaleVertical(16),
                  }}>
                  {!!appData?.profile?.preferences?.dinein_check && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          marginBottom: moderateScaleVertical(8),
                          fontFamily: fontFamily.medium,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGreyOpcaity7,
                        }}>
                        {strings.DINE_IN}
                      </Text>
                      <ToggleSwitch
                        isOn={isDineIn}
                        onColor={themeColors.primary_color}
                        offColor={
                          isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.borderLight
                        }
                        size="small"
                        onToggle={() => updateState({ isDineIn: !isDineIn })}
                      />
                    </View>
                  )}
                  {!!appData?.profile?.preferences?.takeaway_check && (
                    <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text
                        style={{
                          marginBottom: moderateScaleVertical(8),
                          fontFamily: fontFamily.medium,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGreyOpcaity7,
                        }}>
                        {strings.TAKEAWAY}
                      </Text>
                      <ToggleSwitch
                        isOn={isTakeaway}
                        onColor={themeColors.primary_color}
                        offColor={
                          isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.borderLight
                        }
                        size="small"
                        onToggle={() => updateState({ isTakeaway: !isTakeaway })}
                      />
                    </View>
                  )}
                  {!!appData?.profile?.preferences?.delivery_check && (
                    <View
                      style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text
                        style={{
                          marginBottom: moderateScaleVertical(8),
                          fontFamily: fontFamily.medium,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.textGreyOpcaity7,
                        }}>
                        {strings.DELIVERY}
                      </Text>
                      <ToggleSwitch
                        isOn={isDelivery}
                        onColor={themeColors.primary_color}
                        offColor={
                          isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.borderLight
                        }
                        size="small"
                        onToggle={() => updateState({ isDelivery: !isDelivery })}
                      />
                    </View>
                  )}
                </View>

                {!!pageData?.is_seller_module && (
                  <View
                    style={{
                      marginVertical: moderateScaleVertical(15),
                      zIndex: 5000,
                    }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.bold,
                        fontSize: textScale(14),
                      }}>
                      Vendor Type
                    </Text>

                    <DropDownPicker
                      items={vendorTypes}
                      // defaultValue={vendorTypes[0].label}
                      containerStyle={{
                        height: 40,
                        marginTop: moderateScaleVertical(5),
                      }}
                      style={{
                        backgroundColor: isDarkMode
                          ? MyDarkTheme.colors.lightDark
                          : '#fafafa',
                        flexDirection: I18nManager.isRTL
                          ? 'row-reverse'
                          : 'row',

                      }}
                      itemStyle={{
                        justifyContent: 'flex-start',
                        flexDirection: I18nManager.isRTL
                          ? 'row-reverse'
                          : 'row',
                      }}
                      labelStyle={
                        isDarkMode && { color: MyDarkTheme.colors.text }
                      }
                      zIndex={5000}
                      dropDownStyle={{
                        backgroundColor: isDarkMode
                          ? MyDarkTheme.colors.lightDark
                          : '#fafafa',

                        width: width - moderateScale(40),
                        alignSelf: 'center',
                      }}
                      onChangeItem={(item) => setVendorType(item)}
                    />
                  </View>
                )}

                {!!pageData?.is_gst_required_for_vendor_registration && (
                  <View>
                    <Text
                      style={{
                        ...styles.detailStyle,
                        marginTop: moderateScale(5),
                      }}>
                      GST Details
                    </Text>
                    <BorderTextInput
                      // secureTextEntry={true}
                      placeholder={`Company Name`}
                      value={companyName}
                      onChangeText={(txt) => setCompanyName(txt)}
                      containerStyle={{
                        ...styles.containerStyle,
                        marginBottom: 0,
                        marginTop: moderateScale(10),
                      }}
                    />
                    <BorderTextInput
                      // secureTextEntry={true}
                      placeholder={`GST Number`}
                      value={gstNumber}
                      onChangeText={(txt) => setGstNumber(txt)}
                      // onChangeText={(itm) => _dynamicTextInputChange(itm, index, item)}
                      containerStyle={{
                        ...styles.containerStyle,
                        marginBottom: moderateScaleVertical(15),
                        marginTop: moderateScale(10),
                      }}
                    />
                  </View>
                )}
                {!!pageData?.is_baking_required_for_vendor_registration && (
                  <View>
                    <Text
                      style={{
                        ...styles.detailStyle,
                        marginTop: moderateScale(5),
                      }}>
                      Banking Details
                    </Text>
                    <BorderTextInput
                      // secureTextEntry={true}
                      placeholder={`Account Name`}
                      value={accountName}
                      onChangeText={(txt) => setAccountName(txt)}
                      containerStyle={{
                        ...styles.containerStyle,
                        marginBottom: 0,
                        marginTop: moderateScale(10),
                      }}
                    />
                    <BorderTextInput
                      // secureTextEntry={true}
                      placeholder={`Bank Name`}
                      value={bankName}
                      onChangeText={(txt) => setBankName(txt)}
                      containerStyle={{
                        ...styles.containerStyle,
                        marginBottom: 0,
                        marginTop: moderateScale(10),
                      }}
                    />
                    <BorderTextInput
                      // secureTextEntry={true}
                      placeholder={`Account Number`}
                      keyboardType={'number-pad'}
                      value={accountNumber}
                      onChangeText={(txt) => setAccountNumber(txt)}
                      containerStyle={{
                        ...styles.containerStyle,
                        marginBottom: 0,
                        marginTop: moderateScale(10),
                      }}
                    />
                    <BorderTextInput
                      // secureTextEntry={true}
                      placeholder={`IFSC Code`}
                      value={ifscCode}
                      onChangeText={(txt) => setIfscCode(txt)}
                      containerStyle={{
                        ...styles.containerStyle,
                        marginBottom: moderateScaleVertical(10),
                        marginTop: moderateScale(10),
                      }}
                    />
                  </View>
                )}

                {!isEmpty(vendorRegDocs) && (
                  <Text
                    style={{
                      ...styles.detailStyle,
                      marginTop: moderateScale(10),
                    }}>
                    Additional Details
                  </Text>
                )}

                <View
                  style={{
                    marginHorizontal: moderateScale(5),
                  }}>
                  <FlatList
                    keyExtractor={(itm, indx) => indx.toString()}
                    data={vendorRegDocs}
                    renderItem={_renderFields}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginVertical: moderateScale(10),
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      updateState({ isTermsConditions: !isTermsConditions })
                    }>
                    <Image
                      source={
                        isTermsConditions ? imagePath.check : imagePath.unCheck
                      }
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      marginLeft: moderateScale(3),
                      color: isDarkMode ? colors.white : colors.black,
                    }}>
                    {strings.I_ACCEPT}{' '}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => _onLinkPress('terms')}>
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        color: colors.blueColor,
                      }}>
                      {/* {strings.TERMS_CONDITIONS} */}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      color: isDarkMode ? colors.white : colors.black,
                    }}>
                    {' '}
                    {strings.HAVE_READ}{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={() => _onLinkPress('privacy')}
                    activeOpacity={0.7}>
                    <Text
                      style={{
                        fontFamily: fontFamily.regular,
                        color: colors.blueColor,
                      }}>
                      {strings.PRIVACY_POLICY}
                    </Text>
                  </TouchableOpacity>
                </View>

                <GradientButton
                  textStyle={{
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.white,
                  }}
                  onPress={_onSubmit}
                  marginTop={moderateScaleVertical(5)}
                  btnText={strings.SUBMIT}
                />
                <View
                  style={{
                    height: moderateScaleVertical(24),
                    marginBottom: moderateScaleVertical(44),
                  }}
                />
              </KeyboardAwareScrollView>
            </View>
          )}

          {pageData?.page_detail?.primary?.type_of_form == 2 && (
            <View style={styles.mainView}>
              <View
                style={{
                  marginBottom: moderateScaleVertical(12),
                  flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                  alignSelf: 'flex-start',
                }}>
                <Text style={styles.detailStyle}>
                  {strings.PERSONAL_DETAILS}
                </Text>
              </View>

              <Text
                style={{
                  ...styles.labelTxt,
                  color: isDarkMode ? colors.white : colors.blackOpacity43,
                }}>
                {strings.UPLOAD_PHOTO}
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  actionSheet.current.show();
                }}
                style={{
                  ...styles.imageView,
                  // marginVertical: moderateScale(5),
                  marginHorizontal: 0,
                  marginBottom: moderateScaleVertical(14),
                }}>
                <Image
                  source={
                    !!driverPic ? { uri: driverPic.path } : imagePath.icCamIcon
                  }
                  style={{
                    // tintColor: !driverPic ? themeColors.primary_color : null,
                    height: driverPic ? height / 6 - moderateScale(15) : 30,
                    width: driverPic ? width - moderateScale(80) : 30,
                  }}
                  resizeMode={'cover'}
                />
              </TouchableOpacity>

              <Text style={styles.labelTxt}>{strings.YOUR_NAME}</Text>

              <BorderTextInput
                placeholder={''}
                onChangeText={_onChangeText('driverName')}
                containerStyle={styles.containerStyle}
              />

              <Text style={styles.labelTxt}>{strings.YOUR_PHONE_NUMBER}</Text>

              <PhoneNumberInput
                onCountryChange={_onCountryChange}
                onChangePhone={(phoneNumber) =>
                  updateState({
                    driverPhoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
                  })
                }
                cca2={cca2}
                phoneNumber={driverPhoneNumber}
                callingCode={state.callingCode}
                placeholder={''}
                keyboardType={'phone-pad'}
                containerStyle={styles.containerStyle}
              />
              {/* type ================================== */}
              <View style={{ zIndex: 10 }}>
                <TouchableOpacity
                  style={{
                    borderRadius: 8,
                    height: moderateScaleVertical(44),
                    marginBottom: moderateScaleVertical(14),
                    paddingHorizontal: moderateScale(5),
                    borderWidth: 1,
                    borderColor: isDarkMode ? colors.white : colors.borderLight,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  activeOpacity={0.7}
                  onPress={() =>
                    updateState({
                      isDriverType: !isDriverType,
                      isTeams: false,
                      isTagsShow: false,
                    })
                  }>
                  <Text style={{ ...styles.labelTxt, marginBottom: 0 }}>
                    {!!selectedDriverType
                      ? selectedDriverType.name
                      : strings.TYPE}
                  </Text>
                  <Image
                    source={imagePath.dropDownNew}
                    style={{
                      tintColor: isDarkMode ? colors.white : colors.black,
                    }}
                  />
                </TouchableOpacity>
                {isDriverType && (
                  <View
                    style={{
                      // top: moderateScaleVertical(40),
                      top: moderateScaleVertical(-12),
                      borderWidth: 1,
                      borderColor: colors.borderColorB,
                      backgroundColor: colors.white,
                      width: '100%',
                      position: 'relative',
                      paddingHorizontal: moderateScale(10),
                      paddingVertical: moderateScale(5),
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                    }}>
                    {driverTypes.map((itm, indx) => {
                      return (
                        <TouchableOpacity
                          key={indx}
                          onPress={() =>
                            updateState({
                              selectedDriverType: itm,
                              isDriverType: false,
                            })
                          }
                          style={{
                            marginVertical: moderateScale(5),
                            zIndex: 12,
                          }}>
                          <Text>{itm.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* <View style={{
                borderRadius: 8,
                height: moderateScaleVertical(44),
                marginBottom: moderateScaleVertical(14),
                paddingHorizontal: moderateScale(5),
                borderWidth: 1,
                borderColor: isDarkMode ? colors.white : colors.borderLight,
              }} >


                <Menu >
                  <MenuTrigger
                    // children={}
                    style={{
                      paddingTop: 8,
                    }}    
                    text={!!selectedDriverType
                      ? selectedDriverType.name
                      : strings.TYPE} />
                  <MenuOptions
                    optionsContainerStyle={{
                      width: moderateScale(width / 1.2),
                      // alignItems: "center",
                      zIndex: 1,
                      // minWidth: moderateScale(width - 40),
                      marginTop: Platform.OS == 'android' ? moderateScaleVertical(45) : 0
                    }}
                  >
                    {driverTypes.map((itm, indx) => {
                      console.log(itm, driverTypes, "itmitmitmitm")

                      return (
                        <>
                          <MenuOption
                            onSelect={() => updateState({ selectedDriverType: itm, isDriverType: false })}>
                            <Text
                              style={{
                                color:
                                  itm?.id == selectedDriverType?.id
                                    ? colors.redB
                                    : colors.black,
                              }}
                            >
                              {itm.name}
                            </Text>
                          </MenuOption>
                        </>
                      );
                    })}
                  </MenuOptions>
                </Menu>
              </View> */}

              <View style={{ zIndex: 5 }}>
                <TouchableOpacity
                  style={{
                    borderRadius: 8,
                    height: moderateScaleVertical(44),
                    marginBottom: moderateScaleVertical(14),
                    paddingHorizontal: moderateScale(5),
                    borderWidth: 1,
                    borderColor: isDarkMode ? colors.white : colors.borderLight,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  activeOpacity={0.7}
                  onPress={() =>
                    updateState({
                      isTeams: !isTeams,
                      isDriverType: false,
                      isTagsShow: false,
                    })
                  }>
                  <Text style={{ ...styles.labelTxt, marginBottom: 0 }}>
                    {!!selectedTeam ? selectedTeam?.name : strings.TEAMS}
                  </Text>
                  <Image
                    source={imagePath.dropDownNew}
                    style={{
                      tintColor: isDarkMode ? colors.white : colors.black,
                    }}
                  />
                </TouchableOpacity>

                {isTeams && (
                  <View
                    style={{
                      top: moderateScaleVertical(-12),
                      position: 'relative',
                      borderWidth: 1,
                      borderColor: colors.borderColorB,
                      backgroundColor: colors.white,
                      width: '100%',
                      paddingHorizontal: moderateScale(10),
                      paddingVertical: moderateScale(5),
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                    }}>
                    {pageData?.teams.length > 0 ? (
                      <View>
                        {pageData?.teams.map((itm, indx) => {
                          return (
                            <TouchableOpacity
                              key={indx}
                              onPress={() =>
                                updateState({
                                  selectedTeam: itm,
                                  isTeams: false,
                                })
                              }
                              style={{
                                marginVertical: moderateScale(5),
                              }}>
                              <Text>{itm.name}</Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          height: moderateScale(30),
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.white,
                        }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.medium,
                            fontSize: moderateScale(13),
                          }}>
                          {strings.NODATAFOUND}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Teamsss ======= */}

              {/* <View style={{
                borderRadius: 8,
                height: moderateScaleVertical(44),
                marginBottom: moderateScaleVertical(14),
                paddingHorizontal: moderateScale(5),
                borderWidth: 1,
                borderColor: isDarkMode ? colors.white : colors.borderLight,
              }} >
                <Menu >
                  <MenuTrigger
                    // children={}
                    style={{
                      paddingTop: 8,
                    }}
                    text= {!!selectedTeam ? selectedTeam?.name : strings.TEAMS} />
                  <MenuOptions
                    optionsContainerStyle={{
                      width: moderateScale(width / 1.2),
                      // alignItems: "center",
                      zIndex: 1,
                      // minWidth: moderateScale(width - 40),
                      marginTop: Platform.OS == 'android' ? moderateScaleVertical(45) : 0
                    }}
                  >
                  {pageData?.teams.map((itm, indx) => {
                      console.log(itm, driverTypes, "itmitmitmitm")

                      return (
                        <>
                          <MenuOption
                            onSelect={() =>  updateState({selectedTeam: itm, isTeams: false})}>
                            <Text
                              style={{
                                color:
                                  itm?.id == selectedTeam?.id
                                    ? colors.redB
                                    : colors.black,
                              }}
                            >
                              {itm.name}
                            </Text>
                          </MenuOption>
                        </>
                      );
                    })}
                  </MenuOptions>
                </Menu>
              </View> */}

              <View
                style={{ marginBottom: moderateScaleVertical(14), zIndex: 2 }}>
                <View
                  onLayout={(event) => {
                    updateState({
                      tagsViewHeight: event.nativeEvent.layout.height,
                    });
                  }}
                  style={{
                    minHeight: moderateScaleVertical(44),
                    color: colors.white,
                    borderWidth: 1,
                    borderColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.borderLight,
                    borderRadius: 8,
                    paddingVertical: 3,
                    paddingHorizontal: 3,
                    justifyContent: 'center',
                  }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {selectedTags.length > 0 && (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <FlatList
                          numColumns={3}
                          data={selectedTags}
                          renderItem={({ item, index }) => (
                            <TouchableOpacity
                              onPress={() => removeTag(item, index)}
                              activeOpacity={0.7}
                              style={{
                                borderWidth: 1,
                                borderColor: colors.borderColorB,
                                alignItems: 'center',
                                backgroundColor: colors.borderColorB,
                                marginHorizontal: moderateScale(2),
                                flexDirection: 'row',
                                marginVertical: 3,
                                width: (width - moderateScale(52)) / 3,
                                justifyContent: 'space-around',
                                borderRadius: moderateScale(5),
                                paddingVertical: moderateScale(3),
                              }}>
                              <Image
                                source={imagePath.ic_cross}
                                style={{
                                  height: 15,
                                  width: 15,
                                  tintColor: colors.blackOpacity70,
                                }}
                              />
                              <Text
                                style={{
                                  fontFamily: fontFamily.regular,
                                  marginRight: 3,
                                }}>
                                {item?.name}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    )}
                    <TextInput
                      placeholderTextColor={
                        isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.borderLight
                      }
                      placeholder={strings.TAGS}
                      onFocus={() => updateState({ isTagsShow: true })}
                      onBlur={() => updateState({ isTagsShow: false })}
                      onChangeText={onSearchTags}
                      style={{
                        opacity: 0.7,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGreyOpcaity7,
                        fontFamily: fontFamily.medium,
                        fontSize: textScale(14),
                        paddingHorizontal: 8,
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                        marginVertical: 3,
                        marginHorizontal: 3,
                      }}
                    />
                  </View>
                </View>
                {isTagsShow && (
                  <View
                    style={{
                      backgroundColor: colors.white,
                      position: 'relative',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      width: '100%',
                      // zIndex: 15,
                      // elevation: (Platform.OS === 'android') ? 50 : 0,
                      // top: tagsViewHeight,
                    }}>
                    {driverTagsAry.length > 0 ? (
                      <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                        {driverTagsAry.map((item, index) => {
                          return (
                            <TouchableOpacity
                              onPress={() => _onTagSelect(item, index)}
                              activeOpacity={0.7}
                              style={{
                                borderWidth: 1,
                                borderColor: selectedTags.includes(item)
                                  ? themeColors.primary_color
                                  : colors.borderColorB,
                                width: (width - moderateScale(70)) / 3,
                                alignItems: 'center',
                                marginVertical: moderateScale(5),
                                paddingVertical: moderateScale(5),
                                marginHorizontal: moderateScale(5),
                                // zIndex: 1,
                                backgroundColor: selectedTags.includes(item)
                                  ? themeColors.primary_color
                                  : colors.borderColorB,
                                borderRadius: moderateScale(5),
                                zIndex: 15,
                                elevation: Platform.OS === 'android' ? 50 : 0,
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color: selectedTags.includes(item)
                                    ? colors.white
                                    : colors.black,
                                }}>
                                {item?.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          height: moderateScale(30),
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.medium,
                            fontSize: moderateScale(13),
                          }}>
                          {strings.NODATAFOUND}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
              <Text style={styles.labelTxt}>{strings.TRANSPORT_DETAILS}</Text>

              <BorderTextInput
                placeholder={strings.EXAMPLE_TEXT}
                onChangeText={_onChangeText('driverTransportDetails')}
                containerStyle={styles.containerStyle}
              />
              <Text style={styles.labelTxt}>{strings.UID}</Text>

              <BorderTextInput
                placeholder={''}
                onChangeText={_onChangeText('driverUID')}
                containerStyle={styles.containerStyle}
              />
              <Text style={styles.labelTxt}>{strings.LICENCE_PLATE}</Text>

              <BorderTextInput
                placeholder={''}
                onChangeText={_onChangeText('driverLicencePlate')}
                containerStyle={styles.containerStyle}
              />
              <Text style={styles.labelTxt}>{strings.COLOR}</Text>

              <BorderTextInput
                placeholder={''}
                onChangeText={_onChangeText('driverColor')}
                containerStyle={styles.containerStyle}
              />
              {!!pageData && (
                <Text
                  style={{
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.borderLight,
                    fontFamily: fontFamily.bold,
                    fontSize: textScale(13),
                    marginVertical: moderateScaleVertical(5),
                  }}>
                  {strings.TRANSPORT_TYPE}
                </Text>
              )}
              <FlatList
                keyExtractor={(itm, indx) => indx.toString()}
                data={pageData?.transport_types}
                horizontal={true}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                renderItem={_renderTransportTypes}
              />

              {console.log(pageData?.driver_registration_documents, 'pageData')}
              <FlatList
                keyExtractor={(itm, indx) => indx.toString()}
                data={pageData?.driver_registration_documents}
                renderItem={_renderFields}
              />

              <GradientButton
                textStyle={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.white,
                }}
                onPress={_onSubmit}
                marginTop={moderateScaleVertical(10)}
                btnText={strings.SUBMIT}
              />
              <View
                style={{
                  height: moderateScaleVertical(24),
                  marginBottom: moderateScaleVertical(44),
                }}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
      </MenuProvider>
      <ActionSheet
        ref={actionSheet}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => cameraHandle(index)}
      />
    </WrapperContainer>
  );
}

const htmlStyle = StyleSheet.create({
  p: {
    color: '#e5e5e7', // make links coloured pink
    justifyContent: 'center',
  },
});

const htmlStyle1 = StyleSheet.create({
  p: {
    color: colors.black, // make links coloured pink
    alignItems: 'flex-start',
  },
});
