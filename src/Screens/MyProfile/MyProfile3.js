import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep, isEmpty} from 'lodash';
import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {useDarkMode} from 'react-native-dynamic';
import {getBundleId} from 'react-native-device-info';
import DocumentPicker from 'react-native-document-picker';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import AddressBottomSheet from '../../Components/AddressBottomSheet';
import CustomTopTabBar from '../../Components/CustomTopTabBar';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInputWithUnderline from '../../Components/PhoneNumberInputWithUnderline';
import TextInputWithUnderlineAndLabel from '../../Components/TextInputWithUnderlineAndLabel';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import validator from 'is_js';

import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {cameraHandler} from '../../utils/commonFunction';
import {appIds} from '../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import {androidCameraPermission} from '../../utils/permissions';
import validations from '../../utils/validations';
import stylesFunc from './styles';

var addtionSelectedImageIndex = null;

import {enableFreeze} from 'react-native-screens';
enableFreeze(true);

export default function MyProfile3({route, navigation}) {
  const darkthemeusingDevice = useDarkMode();
  const {
    languages,
    themeColors,
    appStyle,
    themeColor,
    themeToggle,
    appData,
    currencies,
  } = useSelector(state => state?.initBoot);
  const { userData } = useSelector(state => state?.auth);
  

  console.log("userDatauserDatauserData+++",userData)

  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});

  const [state, setState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    tabBarData: [
      {title: strings.BASIC_INFO, isActive: true},
      {title: strings.CHANGE_PASS, isActive: false},
      {title: strings.ADDRESS, isActive: false},
    ],
    selectedTab: strings.BASIC_INFO,
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
    name: userData?.name,
    email: userData?.email,
    password: '',
    phoneNumber: userData?.phone_number ? userData?.phone_number : '',
    currentpassword: '',
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    locationData: [],
    profileImage: {
      uri: 'https://www.hayalanka.com/wp-content/uploads/2017/07/avtar-image.jpg',
    },
    address: [],
    isVisible: false,
    newAddress: null,
    updatedAddress: null,
    type: '',
    selectedId: '',
    del: false,
    updateData: {},
    indicator: false,
    selectViaMap: false,
    addtionalTextInputs: [],
    addtionalImages: [],
    addtionalPdfs: [],
  });
  const {
    address,
    tabBarData,
    selectedTab,
    confirmPassword,
    phoneNumber,
    callingCode,
    cca2,
    name,
    email,
    password,
    currentpassword,
    newPassword,
    profileImage,
    isLoading,
    locationData,
    isVisible,
    newAddress,
    updatedAddress,
    type,
    selectedId,
    del,
    updateData,
    indicator,
    selectViaMap,
    addtionalTextInputs,
    addtionalImages,
    addtionalPdfs,
  } = state;

  const updateState = data => setState(state => ({...state, ...data}));

  const profileAddress = useSelector(state => state?.home?.profileAddress);
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const openCloseMapAddress = type => {
    updateState({selectViaMap: type == 1 ? true : false});
  };
  useFocusEffect(
    React.useCallback(() => {
      if (userData?.auth_token) {
        getAllAddress();
        getUserProfileData();
      }
      if (!isEmpty(userData?.user_document)) {
        getUserDocs();
      }
    }, []),
  );

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

  const getUserDocs = () => {
    let textInputs = cloneDeep(
      userData?.user_document?.filter(x => x?.file_type == 'Text'),
    );
    let images = cloneDeep(
      userData?.user_document?.filter(x => x?.file_type == 'Image'),
    );
    let pdfs = cloneDeep(
      userData?.user_document?.filter(x => x?.file_type == 'Pdf'),
    );
    textInputs.map((item, index) => {
      textInputs[index].contents = item?.user_document?.file_name;
    });

    images.map((item, index) => {
      images[index].value = item?.user_document?.image_file?.storage_url;
    });
    pdfs.map((item, index) => {
      pdfs[index].filename = item?.user_document?.file_original_name;
      pdfs[index].value = item?.user_document?.image_file?.storage_url;
    });
    updateState({
      addtionalTextInputs: textInputs,
      addtionalImages: images,
      addtionalPdfs: pdfs,
    });
  };

  // changeTab function
  const changeTab = tabData => {
    // if (tabData.title == strings.ADDRESS) {
    //   updateState({isLoading: true});
    // }
    let clonedArray = cloneDeep(tabBarData);
    clonedArray.map(item => {
      if (item.title == tabData.title) {
        item.isActive = true;
        return item;
      } else {
        item.isActive = false;
        return item;
      }
    });
    updateState({
      ['tabBarData']: clonedArray,
      ['selectedTab']: tabData.title,
    });
  };

  //select tje country
  const _onCountryChange = data => {
    console.log("_onCountryChange_onCountryChange",data)
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };

  // on change text
  const _onChangeText = key => val => {
    updateState({[key]: val});
  };

  //this function use for save user info
  const isValidDataOfBasicInfo = () => {
    const error = validations({
      email: email,
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

  const checkValidation = () => {
    if (name == '') {
      showError(strings.ENTER_YOUR_NAME);
      return false;
    }
    if (email == '') {
      showError(strings.ENTER_YOUR_EMAIL);
      return false;
    }
 
    if (!validator.email(email)) { 
      showError(strings.PLEASE_ENTER_VALID_EMAIL);
      return false;
    }

    if (phoneNumber == '') {
      showError(strings.ENTER_PHONE_NUMBER);
      return false;
    }
    return true;
  };
  const saveUserInfo = () => {
    let formdata = new FormData();
    let isValid = checkValidation();

    if (!isValid) {
      return;
    }
 

    if (!!userData?.auth_token) {
      // const checkValid = isValidDataOfBasicInfo();
      // if (!checkValid) {
      //   return;
      // }
      formdata.append('name', name);
      formdata.append('email', email);
      formdata.append('phone_number', phoneNumber);
      formdata.append('country_code', cca2);
      formdata.append('callingCode', callingCode);

      var isRequired = true;

      if (!isEmpty(addtionalTextInputs)) {
        addtionalTextInputs.map((i, inx) => {
          if (i?.contents != '' && !!i?.contents) {
            formdata.append(i?.primary?.slug, i?.contents);
          } else if (i?.is_required) {
            if (isRequired) {
              showError(
                `${strings.PLEASE_ENTER} ${i?.primary?.name.toLowerCase()}`,
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
              i?.primary?.slug,
              !!i.fileData
                ? i?.file_type == 'Image'
                  ? {
                      uri: i.fileData.path,
                      name: i.fileData.filename,
                      filename: i.fileData.filename,
                      type: i.fileData.mime,
                    }
                  : i?.fileData
                : i?.user_document?.file_name,
            );
          } else if (i?.is_required) {
            if (isRequired) {
              showError(
                `${strings.PLEASE_UPLOAD} ${i?.primary?.name.toLowerCase()}`,
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

      updateState({isLoading: true});
      actions
        .profileBasicInfo(formdata, {
          code: appData?.profile?.code,
          'Content-Type': 'multipart/form-data',
        })
        .then(res => {
          console.log(res, 'res>>>>>');
          let obj = {};
          obj['name'] = res.data.name;
          obj['email'] = res.data.email;
          obj['phone_number'] = res.data.phone_number;
          obj['cca2'] = res.data.cca2;
          obj['dial_code'] = res.data.callingCode || callingCode;
          obj['user_document'] = res.data.user_document || '';

          obj['verify_details'] = {
            ['is_email_verified']: res.data.is_email_verified,
            ['is_phone_verified']: res.data.is_phone_verified,
          };
          console.log("obj+++++++++",obj)
          actions.updateProfile({...userData, ...obj});
          updateState({isLoading: false});
          // navigation.goBack()
          showSuccess(res.message);
          // updateState({name: '', email: '', phoneNumber: ''});
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const errorMethod = error => {
    console.log(error, 'in error method...');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
      isVisible: false,
      selectViaMap: false,
    });
    showError(error?.message || error?.error);
  };

  const addUpdateLocation = childData => {
    console.log(childData, 'childDatachildDatachildDatachildData');
    updateState({
      selectViaMap: false,
      // isLoading: true,
      isVisible: false,
    });
    if (type == 'addAddress') {
      actions
        .addAddress(childData, {
          code: appData?.profile?.code,
          language: languages?.primary_language?.id,
        })
        .then(res => {
          const allAddresses = address;
          const previousPrimaryItem = allAddresses.find(
            itm => itm?.is_primary == 1,
          );

          if (!!previousPrimaryItem) {
            const indxToUpdatePrimary =
              allAddresses.indexOf(previousPrimaryItem);
            allAddresses[indxToUpdatePrimary].is_primary = 0;
          }
          updateState({
            del: del ? false : true,
            isLoading: false,
            address: [...allAddresses, res?.data],
          });
          showSuccess(res.message);
        })
        .catch(error => {
          updateState({isLoading: false});
          showError(error?.message || error?.error);
        });
    } else if (type == 'updateAddress') {
      let query = `/${selectedId}`;
      actions
        .updateAddress(query, childData, {
          code: appData?.profile?.code,
          language: languages?.primary_language?.id,
        })
        .then(res => {
          const allAddresses = address;
          const objForIndx = allAddresses.find(item => item?.id == selectedId);
          const indexToUpdateItem = allAddresses.indexOf(objForIndx);
          allAddresses[indexToUpdateItem] = res?.data;
          updateState({
            del: del ? false : true,
            isLoading: false,
            address: allAddresses,
          });
          showSuccess(res.message);
        })
        .catch(errorMethod);
    }
  };
  //this function use for chnage password
  const isValidDataOfChangePass = () => {
    const error = validations({
      password: currentpassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const changePassword = () => {
    if (!!userData?.auth_token) {
      const checkValid = isValidDataOfChangePass();
      if (!checkValid) {
        return;
      }
      let data = {
        current_password: currentpassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };
      updateState({isLoading: true});
      actions
        .changePassword(data, {
          code: appData?.profile?.code,
        })
        .then(res => {
          // showSuccess(res.message)
          updateState({isLoading: false});
          showSuccess(res.message);
          updateState({
            currentpassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        })
        .catch(err => {});
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  //Select Primary Address
  const setPrimaryLocation = item => {
    updateState({isLoading: true});
    let data = {};
    let query = `/${item?.id}`;
    actions
      .setPrimaryAddress(query, data, {
        code: appData?.profile?.code,
      })
      .then(res => {
        const allAddresses = address;
        const indxToUpdateItem = allAddresses.indexOf(item);
        const previousPrimaryItem = allAddresses.find(
          itm => itm.is_primary === 1,
        );
        if (!!previousPrimaryItem) {
          const indxToUpdatePrimary = allAddresses.indexOf(previousPrimaryItem);
          allAddresses[indxToUpdatePrimary].is_primary = 0;
        }
        allAddresses[indxToUpdateItem].is_primary = 1;
        updateState({
          isLoading: false,
          del: del ? false : true,
          address: allAddresses,
        });
        showSuccess(res.message);
      })
      .catch(error => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    addtionSelectedImageIndex = null;
    {
      !!userData?.auth_token ? actionSheet.current.show() : null;
    }
  };

  // this funtion use for camera handle
  const cameraHandle = async index => {
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
          .then(res => {
            if (addtionSelectedImageIndex !== null) {
              let data = cloneDeep(addtionalImages);

              data[addtionSelectedImageIndex].value =
                res?.sourceURL || res?.path;
              data[addtionSelectedImageIndex].fileData = res;
              updateState({addtionalImages: data});
            } else if (res?.data) {
              updateState({isLoading: true});
              let data = {
                type: 'jpg',
                avatar: res?.data,
              };
              actions
                .uploadProfileImage(data, {
                  code: appData?.profile?.code,
                })
                .then(res => {
                  console.log(res, 'resresres');
                  const source = {
                    uri: getImageUrl(
                      res.data.proxy_url,
                      res.data.image_path,
                      '200/200',
                    ),
                  };
                  const image = {
                    source,
                  };
                  actions.updateProfile({...userData, ...image});
                  updateState({isLoading: false});
                  showSuccess(res.message);
                })
                .catch(err => {
                  console.log(err, 'err>>.inAPI');
                  updateState({isLoading: false});
                });
            }
          })
          .catch(err => {
            console.log(err, 'err>>.cameraPicker');
            updateState({isLoading: false});
          });
      }
    }
  };

  //get All address
  const getAllAddress = () => {
    updateState({isLoading: true});
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then(res => {
        actions.saveAllUserAddress(res.data);
        updateState({address: res.data, isLoading: false, indicator: false});
      })
      .catch(errorMethod);
  };

  const setModalVisible = (visible = false, type = '', id = '', data = {}) => {
    console.log('for address modal....', visible, type, id, data);
    updateState({
      updateData: data,
      isVisible: visible,
      type: type,
      selectedId: id,
    });
  };

  //Delete address
  const delAddress = item => {
    Alert.alert('', strings.DELETE_ADDRESS_CONFIRM_MSG, [
      {
        text: strings.NO,
        onPress: () => console.log('Cancel Pressed'),
      },
      {text: strings.YES, onPress: () => onPressDelete(item)},
    ]);
  };

  const onPressDelete = item => {
    updateState({isLoading: true});
    let data = {};
    let query = `/${item?.id}`;

    actions
      .deleteAddress(query, data, {
        code: appData?.profile?.code,
        language: languages?.primary_language?.id,
      })
      .then(res => {
        const allAddresses = address;
        const indexToDeleteItem = allAddresses.indexOf(item);
        allAddresses.splice(indexToDeleteItem, 1);
        actions.saveAllUserAddress(allAddresses);
        updateState({
          del: del ? false : true,
          address: allAddresses,
          isLoading: false,
        });

        showSuccess(res.message);
      })
      .catch(error => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  const _sendRefferal = () => {
    moveToNewScreen(navigationStrings.SENDREFFERAL)();
  };

  const onModalClose = () => {
    setModalVisible(false);
    updateState({selectViaMap: false});
  };

  const handleDynamicTxtInput = (text, index, type) => {
    let data = cloneDeep(addtionalTextInputs);
    data[index].contents = text;
    data[index].id = type?.id;
    data[index].file_type = type?.file_type;
    data[index].label_name = type?.primary?.name;
    updateState({addtionalTextInputs: data});
  };
  const getTextInputField = (type, index) => {
    return (
      <TextInputWithUnderlineAndLabel
        onChangeText={text => handleDynamicTxtInput(text, index, type)}
        value={type?.contents}
        label={type?.primary?.name || ''}
        autoCapitalize={'none'}
        containerStyle={{marginVertical: moderateScaleVertical(10)}}
        txtInputStyle={{
          fontFamily: fontFamily.regular,
          color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
        }}
        undnerlinecolor={colors.textGreyB}
        labelStyle={{
          color: colors.textGreyB,
          textTransform: 'uppercase',
          fontSize: textScale(12),
        }}
      />
    );
  };

  const updateImages = (type, index) => {
    addtionSelectedImageIndex = index;
    addtionSelectedImage = type;
    actionSheet.current.show();
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
              source={{uri: addtionalImages[index].value}}
              style={styles.imageStyle2}
            />
          ) : (
            <Image source={imagePath?.icPhoto} />
          )}
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={{...styles.label3, minHeight: moderateScale(25)}}>
          {type?.primary?.name}
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
        updateState({addtionalPdfs: data});
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
        style={{marginRight: moderateScale(20), marginTop: moderateScale(20)}}>
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
          {type?.primary?.name}
          {type.is_required ? '*' : ''}
        </Text>
      </View>
    );
  };

  // Basic information tab
  const basicInfoView = () => {
    return (
      <View
        style={{
          marginVertical: moderateScaleVertical(30),
          marginHorizontal: moderateScale(24),
          height: height / 2,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {userData?.refferal_code &&
          userData?.refferal_code != '' &&
          appIds.sxm2go != getBundleId() ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: moderateScaleVertical(20),
              }}>
              <View
                style={{
                  flex: 0.6,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.referralCode, {color: MyDarkTheme.colors.text}]
                      : styles.referralCode
                  }>{`${strings.YOUR_REFFERAL_CODE} ${userData?.refferal_code}`}</Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}>
                <Text
                  onPress={() => _sendRefferal()}
                  style={[
                    styles.referralCode,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      fontFamily: fontFamily.bold,
                    },
                  ]}>
                  {strings.SEND_REFFERAL}
                </Text>
              </View>
            </View>
          ) : null}

          <TextInputWithUnderlineAndLabel
            onChangeText={_onChangeText('name')}
            value={name}
            label={strings.YOUR_NAME}
            autoCapitalize={'none'}
            containerStyle={{marginVertical: moderateScaleVertical(10)}}
            undnerlinecolor={colors.textGreyB}
            txtInputStyle={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
            labelStyle={{
              color: colors.textGreyB,
              textTransform: 'uppercase',
              fontSize: textScale(12),
            }}
            returnKeyType={'next'}
          />

          <TextInputWithUnderlineAndLabel
            onChangeText={_onChangeText('email')}
            value={email}
            label={strings.EMAIL}
            autoCapitalize={'none'}
            containerStyle={{marginVertical: moderateScaleVertical(10)}}
            txtInputStyle={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
            undnerlinecolor={colors.textGreyB}
            labelStyle={{
              color: colors.textGreyB,
              textTransform: 'uppercase',
              fontSize: textScale(12),
            }}
            returnKeyType={'next'}
          />

          <PhoneNumberInputWithUnderline
            onCountryChange={_onCountryChange}
            placeholder={strings.PHONE_NUMBER}
            onChangePhone={phoneNumber =>
              updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
            }
            cca2={cca2}
            phoneNumber={phoneNumber}
            callingCode={callingCode}
            undnerlineColor={colors.textGreyB}
            textInputStyle={{
              fontFamily: fontFamily.regular,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontSize: textScale(14),
            }}
            labelStyle={{
              color: colors.textGreyB,
              textTransform: 'uppercase',
              fontSize: textScale(12),
            }}
          />

          <View style={{height: moderateScaleVertical(20)}} />

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
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={styles.textStyle}
            onPress={saveUserInfo}
            // marginTop={moderateScaleVertical(20)}
            marginBottom={moderateScaleVertical(50)}
            btnText={strings.SAVE_CHANGES}
          />
        </ScrollView>
      </View>
    );
  };
  //Change password info tab
  const changePasswordView = () => {
    return (
      <View
        style={{
          height: height / 2,
          marginVertical: moderateScaleVertical(50),
          marginHorizontal: moderateScale(24),
        }}>
        <TextInputWithUnderlineAndLabel
          onChangeText={_onChangeText('currentpassword')}
          label={strings.ENTER_CURRENT_PASSWORD}
          value={currentpassword}
          secureTextEntry={true}
          containerStyle={{marginVertical: moderateScaleVertical(10)}}
          undnerlinecolor={colors.textGreyB}
          labelStyle={{
            color: colors.textGreyB,
            textTransform: 'uppercase',
            fontSize: textScale(12),
          }}
          returnKeyType={'next'}
        />

        <TextInputWithUnderlineAndLabel
          onChangeText={_onChangeText('newPassword')}
          value={newPassword}
          label={strings.ENTER_NEW_PASSWORD}
          undnerlinecolor={colors.textGreyB}
          labelStyle={{
            color: colors.textGreyB,
            textTransform: 'uppercase',
            fontSize: textScale(12),
          }}
          secureTextEntry={true}
          containerStyle={{marginVertical: moderateScaleVertical(10)}}
          returnKeyType={'next'}
        />
        <TextInputWithUnderlineAndLabel
          onChangeText={_onChangeText('confirmPassword')}
          value={confirmPassword}
          label={strings.ENTER_CONFIRM_PASSWORD}
          undnerlinecolor={colors.textGreyB}
          labelStyle={{
            color: colors.textGreyB,
            textTransform: 'uppercase',
            fontSize: textScale(12),
          }}
          secureTextEntry={true}
          containerStyle={{marginVertical: moderateScaleVertical(10)}}
          returnKeyType={'next'}
        />
        <GradientButton
          btnStyle={{marginTop: moderateScaleVertical(57)}}
          colorsArray={[themeColors.primary_color, themeColors.primary_color]}
          textStyle={styles.textStyle}
          onPress={changePassword}
          // marginTop={moderateScaleVertical(50)}
          marginBottom={moderateScaleVertical(50)}
          btnText={strings.CHANGE_PASS_CAPS}
        />
      </View>
    );
  };

  //address view tab
  const addressView = () => {
    return (
      <View
        style={{
          marginVertical: moderateScaleVertical(30),
          minHeight: height / 1.6,
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: moderateScale(20),
            justifyContent: 'space-between',
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: textScale(16),
              fontFamily: fontFamily.medium,
              width: moderateScale(180),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : getColorCodeWithOpactiyNumber(colors.black.substr(1), 60),
            }}>
            {strings.SAVED_LOCATIONS}
          </Text>
          <TouchableOpacity
            disabled={isLoading}
            onPress={() => setModalVisible(true, 'addAddress')}>
            <Text
              style={{
                fontSize: textScale(12),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.ADD_NEW_ADDRESS}
            </Text>
          </TouchableOpacity>
        </View>
        {address &&
          address.map((itm, inx) => {
            // if (profileAddress?.address && userData?.auth_token) {
            return (
              <View
                key={inx}
                style={{
                  borderBottomColor: colors.lightGreyBorder,
                  borderBottomWidth: moderateScaleVertical(1),
                }}>
                <TouchableOpacity onPress={() => setPrimaryLocation(itm)}>
                  <View
                    style={{
                      marginHorizontal: moderateScale(24),
                      marginTop: moderateScaleVertical(20),
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: moderateScaleVertical(12),
                    }}>
                    <View
                      style={{
                        flex: 0.1,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={
                          isDarkMode
                            ? {tintColor: MyDarkTheme.colors.text}
                            : null
                        }
                        source={
                          itm?.type == 1
                            ? imagePath.home
                            : itm?.type == 2
                            ? imagePath.workInActive
                            : imagePath.icOtherAddressType
                        }
                      />
                    </View>
                    <View style={{flex: 0.8}}>
                      <Text
                        numberOfLines={2}
                        style={
                          isDarkMode
                            ? [
                                styles.address,
                                {
                                  textAlign: 'left',
                                  color: MyDarkTheme.colors.text,
                                },
                              ]
                            : [styles.address, {textAlign: 'left'}]
                        }>
                        {!!itm?.house_number ? itm?.house_number + ',' : ''}{' '}
                        {itm?.address}
                      </Text>
                    </View>
                    {itm && !!itm.is_primary && (
                      <View
                        style={{
                          flex: 0.1,
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Image
                          style={{tintColor: themeColors.primary_color}}
                          source={imagePath.done}
                        />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: moderateScale(24),
                  }}>
                  <View style={{flex: 0.1}} />
                  <View
                    style={{
                      flex: 0.8,
                      flexDirection: 'row',
                      // justifyContent: 'flex-start',
                      paddingVertical: moderateScaleVertical(10),
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        setModalVisible(true, 'updateAddress', itm.id, itm)
                      }
                      style={{
                        width: width / 4.5,
                        backgroundColor: getColorCodeWithOpactiyNumber(
                          themeColors.primary_color.substr(1),
                          20,
                        ),
                        padding: moderateScaleVertical(6),
                        borderRadius: 20,
                        // alignItems:'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={{
                          tintColor: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}
                        source={imagePath.editBlue}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: fontFamily.bold,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                          fontSize: textScale(12),
                          paddingLeft: moderateScale(5),
                        }}>
                        {strings.EDIT}
                      </Text>
                    </TouchableOpacity>
                    <View style={{flex: 0.05}} />
                    <TouchableOpacity
                      onPress={() => delAddress(itm)}
                      style={{
                        width: width / 4.5,
                        backgroundColor: getColorCodeWithOpactiyNumber(
                          'F94444',
                          20,
                        ),
                        borderRadius: 20,
                        padding: moderateScaleVertical(6),
                        borderRadius: 20,
                        // alignItems:'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}>
                      <Image source={imagePath.deleteRed} />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: fontFamily.bold,
                          color: colors.redB,
                          fontSize: textScale(12),
                          paddingLeft: moderateScale(5),
                        }}>
                        {strings.DELETE}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 0.1}} />
                </View>
              </View>
            );
            // } else {
            //   return;
            // }
          })}
      </View>
    );
  };

  const sheetRef = useRef(null);

  const onPressGoBack = () => {
    if (!!route?.params && !!route?.params?.isComeFromDrawer) {
      navigation.openDrawer()
    } else {
      navigation.goBack()
    }
  }

  return (
    <WrapperContainer
      isLoadingB={isLoading}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGreyC}
      source={loaderOne}>
      <Header
        leftIcon={imagePath.icBackb}
        centerTitle={strings.MY_PROFILE}
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.backgroundGreyC,
        }}
        onPressLeft={onPressGoBack}
      />
      <View style={{...commonStyles.headerTopLine}} />
      {/* top section user general info */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: 25,
        }}>
        <View
          style={{
            ...styles.topSection,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.backgroundGreyC,
          }}>
          <TouchableWithoutFeedback onPress={showActionSheet}>
            <View
              style={{
                backgroundColor: colors.backgroundGrey,
                alignSelf: 'center',
                height: moderateScale(90),
                width: moderateScale(90),
                borderRadius: moderateScale(12),
                borderWidth: moderateScale(5),
                borderColor: colors.white,
                marginTop: moderateScale(20),
              }}>
              <FastImage
                source={
                  userData?.source?.image_path
                    ? {
                        uri: getImageUrl(
                          userData?.source?.proxy_url,
                          userData?.source?.image_path,
                          '200/200',
                        ),
                        priority: FastImage.priority.high,
                      }
                    : userData?.source
                }
                style={{
                  height: moderateScale(80),
                  width: moderateScale(80),
                  borderRadius: moderateScale(12),
                }}
              />
              <View style={styles.cameraView}>
                <View
                  style={styles.roundViewCamera}
                  resizeMode="contain"
                  source={imagePath?.camera}>
                  <Image
                    source={imagePath.ic_cameraColored}
                    resizeMode="contain"
                    style={{
                      height: moderateScale(20),
                      width: moderateScale(20),
                      tintColor: colors.white,
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: moderateScaleVertical(20),
            }}>
            <Text
              style={
                isDarkMode
                  ? [styles.userName, {color: MyDarkTheme.colors.text}]
                  : styles.userName
              }>
              {userData?.name}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.userEmail, {color: MyDarkTheme.colors.text}]
                  : styles.userEmail
              }>
              {userData?.email}
            </Text>
          </View>
        </View>

        <View
          style={
            isDarkMode
              ? [
                  styles.bottomSection,
                  {backgroundColor: MyDarkTheme.colors.background},
                ]
              : styles.bottomSection
          }>
          {/* scrolllablr tob bar */}
          <CustomTopTabBar
            scrollEnabled={true}
            activeStyle={{
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
            tabBarItems={tabBarData}
            onPress={tabData => changeTab(tabData)}
            numberOfLines={1}
            // containerStyle={{  width: width / 3}}
            textTabWidth={width / 2.8}
            customTextContainerStyle={{
              width: width / 2.8,
            }}
            textStyle={{
              fontSize: textScale(13),
            }}
          />

          {selectedTab && selectedTab == strings.BASIC_INFO && basicInfoView()}
          {selectedTab &&
            selectedTab == strings.CHANGE_PASS &&
            changePasswordView()}
          {selectedTab && selectedTab == strings.ADDRESS && addressView()}
        </View>

        <ActionSheet
          ref={actionSheet}
          // title={'Choose one option'}
          options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={index => cameraHandle(index)}
        />
      </KeyboardAwareScrollView>
      {isVisible ? (
        <AddressBottomSheet
          navigation={navigation}
          updateData={updateData}
          indicator={indicator}
          type={type}
          passLocation={data => addUpdateLocation(data)}
          openCloseMapAddress={openCloseMapAddress}
          selectViaMap={selectViaMap}
          onCloseSheet={onModalClose}
        />
      ) : null}
      <View style={{height: moderateScaleVertical(60)}} />
    </WrapperContainer>
  );
}
