import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import AddressModal from '../../Components/AddressModal';
import BorderTextInput from '../../Components/BorderTextInput';
import CustomTopTabBar from '../../Components/CustomTopTabBar';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import PhoneNumberInput from '../../Components/PhoneNumberInput';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {cameraHandler} from '../../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import validations from '../../utils/validations';
import stylesFunc from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import {androidCameraPermission} from '../../utils/permissions';

import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function MyProfile({route, navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const currentTheme = useSelector((state) => state?.initBoot);

  const {themeColors, themeLayouts, appStyle} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});
  const paramData = route?.params;
  const appData = useSelector((state) => state?.initBoot?.appData);
  const userData = useSelector((state) => state?.auth?.userData);
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
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const profileAddress = useSelector((state) => state?.home?.profileAddress);
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!!userData?.auth_token) {
        getAllAddress();
      }
    }, []),
  );

  // changeTab function
  const changeTab = (tabData) => {
    let clonedArray = cloneDeep(tabBarData);
    clonedArray.map((item) => {
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
  const _onCountryChange = (data) => {
    updateState({cca2: data.cca2, callingCode: data.callingCode[0]});
    return;
  };

  // on change text
  const _onChangeText = (key) => (val) => {
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
  const saveUserInfo = () => {
    if (!!userData?.auth_token) {
      let {callingCode} = state;
      const checkValid = isValidDataOfBasicInfo();
      if (!checkValid) {
        return;
      }
      let data = {
        name: name,
        email: email,
        // phone_number: '+' + callingCode + phoneNumber,
        phone_number: phoneNumber,
        country_code: cca2,
        callingCode: callingCode,
      };
      updateState({isLoading: true});
      actions
        .profileBasicInfo(data, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          let obj = {};
          obj['name'] = res.data.name;
          obj['email'] = res.data.email;
          obj['phone_number'] = res.data.phone_number;
          obj['cca2'] = res.data.cca2;
          obj['dial_code'] = res.data.callingCode || callingCode;
          actions.updateProfile({...userData, ...obj});
          updateState({isLoading: false});
          // navigation.goBack()
          console.log(res, 'userInfo');
          showSuccess(res.message);
          // updateState({name: '', email: '', phoneNumber: ''});
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const addUpdateLocation = (childData) => {
    //setModalVisible(false);

    if (type == 'addAddress') {
      // updateState({isLoading: true});
      updateState({isLoading: true});

      actions
        .addAddress(childData, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          updateState({del: del ? false : true});
          showSuccess(res.message);
          // setTimeout(() => {
          //   getAllAddress();
          // }, 1000);
        })
        .catch((error) => {
          updateState({isLoading: false});
          showError(error?.message || error?.error);
        });
    } else if (type == 'updateAddress') {
      updateState({isLoading: true});
      let query = `/${selectedId}`;

      actions
        .updateAddress(query, childData, {
          code: appData?.profile?.code,
        })
        .then((res) => {
          updateState({del: del ? false : true});
          showSuccess(res.message);
        })
        .catch((error) => {
          updateState({isLoading: false});
          showError(error?.message || error?.error);
        });
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
        .then((res) => {
          // showSuccess(res.message)
          updateState({isLoading: false});
          showSuccess(res.message);
          updateState({
            currentpassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        })
        .catch((err) => {});
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  //Select Primary Address
  const setPrimaryLocation = (id) => {
    updateState({isLoading: true});
    let data = {};
    let query = `/${id}`;
    actions
      .setPrimaryAddress(query, data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({isLoading: false, del: del ? false : true});
        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    {
      !!userData?.auth_token ? actionSheet.current.show() : null;
    }
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
            if (res?.data) {
              updateState({isLoading: true});
            }
            let data = {
              type: 'jpg',
              avatar: res?.data,
            };

            actions
              .uploadProfileImage(data, {
                code: appData?.profile?.code,
              })
              .then((res) => {
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
              .catch((err) => {});
          })
          .catch((err) => {});
      }
    }
  };

  useEffect(() => {
    if (!!userData?.auth_token) {
      getAllAddress();
    }
  }, [del]);

  //get All address
  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        actions.saveAllUserAddress(res.data);
        updateState({address: res.data, isLoading: false, indicator: false});
        setModalVisible(false);
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
        setModalVisible(false);
      });
  };

  const setModalVisible = (visible, type, id, data) => {
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible: visible,
        type: type,
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  //Delete address
  const delAddress = (id) => {
    Alert.alert('', strings.DELETE_ADDRESS_CONFIRM_MSG, [
      {
        text: strings.NO,
        onPress: () => console.log('Cancel Pressed'),
      },
      {text: strings.YES, onPress: () => onPressDelete(id)},
    ]);
  };

  const onPressDelete = (id) => {
    updateState({isLoading: true});

    let data = {};
    let query = `/${id}`;

    actions
      .deleteAddress(query, data, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        updateState({del: del ? false : true});
        showSuccess(res.message);
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  const _sendRefferal = () => {
    moveToNewScreen(navigationStrings.SENDREFFERAL)();
  };

  // Basic information tab
  const basicInfoView = () => {
    return (
      <KeyboardAwareScrollView
        style={{height: height / 2}}
        enableAutomaticScroll={true}>
        <View
          style={{
            marginVertical: moderateScaleVertical(30),
            marginHorizontal: moderateScale(24),
            height: height / 1.5,
          }}>
          {userData?.refferal_code && userData?.refferal_code != '' ? (
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
                      color: themeColors.primary_color,
                      fontFamily: fontFamily.bold,
                    },
                  ]}>
                  {strings.SEND_REFFERAL}
                </Text>
              </View>
            </View>
          ) : null}

          <BorderTextInput
            onChangeText={_onChangeText('name')}
            placeholder={strings.YOUR_NAME}
            value={name}
          />
          <BorderTextInput
            onChangeText={_onChangeText('email')}
            placeholder={strings.YOUR_EMAIL}
            value={email}
          />

          <PhoneNumberInput
            onCountryChange={_onCountryChange}
            placeholder={strings.YOUR_PHONE_NUMBER}
            onChangePhone={(phoneNumber) =>
              updateState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
            }
            cca2={cca2}
            phoneNumber={phoneNumber}
            callingCode={state.callingCode}
            color={isDarkMode ? MyDarkTheme.colors.text : null}
          />

          <View style={{height: moderateScaleVertical(20)}} />

          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={styles.textStyle}
            onPress={saveUserInfo}
            // marginTop={moderateScaleVertical(20)}
            marginBottom={moderateScaleVertical(50)}
            btnText={strings.SAVE_CHANGES}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };
  //Change password info tab
  const changePasswordView = () => {
    return (
      <KeyboardAwareScrollView
        style={{height: height / 2}}
        enableAutomaticScroll={true}>
        <View
          style={{
            height: height / 1.7,
            marginVertical: moderateScaleVertical(50),
            marginHorizontal: moderateScale(24),
          }}>
          <BorderTextInput
            onChangeText={_onChangeText('currentpassword')}
            placeholder={strings.ENTER_CURRENT_PASS}
            value={currentpassword}
            secureTextEntry={true}
          />
          <BorderTextInput
            onChangeText={_onChangeText('newPassword')}
            placeholder={strings.ENTER_NEW_PASS}
            value={newPassword}
            secureTextEntry={true}
          />

          <BorderTextInput
            onChangeText={_onChangeText('confirmPassword')}
            placeholder={strings.ENTER_CONFIRM_PASS}
            value={confirmPassword}
            secureTextEntry={true}
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
      </KeyboardAwareScrollView>
    );
  };

  //address view tab
  const addressView = () => {
    return (
      <ScrollView
        style={{
          marginVertical: moderateScaleVertical(30),
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: moderateScale(20),
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: textScale(16),
              fontFamily: fontFamily.medium,
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : getColorCodeWithOpactiyNumber(colors.black.substr(1), 60),
            }}>
            {strings.SAVED_LOCATIONS}
          </Text>
          <TouchableOpacity onPress={() => setModalVisible(true, 'addAddress')}>
            <Text
              style={{
                fontSize: textScale(12),
                fontFamily: fontFamily.medium,
                color: themeColors.primary_color,
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
                <TouchableOpacity onPress={() => setPrimaryLocation(itm.id)}>
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
                            : imagePath.workInActive
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
                        style={{tintColor: themeColors.primary_color}}
                        source={imagePath.editBlue}
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontFamily: fontFamily.bold,
                          color: themeColors.primary_color,
                          fontSize: textScale(12),
                          paddingLeft: moderateScale(5),
                        }}>
                        {strings.EDIT}
                      </Text>
                    </TouchableOpacity>
                    <View style={{flex: 0.05}} />
                    <TouchableOpacity
                      onPress={() => delAddress(itm.id)}
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
      </ScrollView>
    );
  };

  //
  return (
    <WrapperContainer
      isLoadingB={isLoading}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGreyC}
      source={loaderOne}>
      <Header
        leftIcon={imagePath.back}
        centerTitle={strings.MY_PROFILE}
        textStyle={{color:isDarkMode?colors.white:colors.black}}
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.backgroundGreyC,
        }}
        customLeft={()=><></>}
      />
      <View style={{...commonStyles.headerTopLine}} />
      {/* top section user general info */}

      <View
        style={{
          ...styles.topSection,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.backgroundGreyC,
        }}>
        <TouchableWithoutFeedback onPress={showActionSheet}>
          <View style={styles.userProfileView}>
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
              style={styles.profileImage}
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
            style={{
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyI,
            }}>
            {userData?.name}
          </Text>
          <Text
            style={{
              ...styles.userEmail,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyI,
            }}>
            {userData?.email}
          </Text>
        </View>
      </View>

      <View
        style={{
          ...styles.bottomSection,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.backgroundGrey,
        }}>
        {/* scrolllablr tob bar */}
        <CustomTopTabBar
          scrollEnabled={true}
          tabBarItems={tabBarData}
          onPress={(tabData) => changeTab(tabData)}
          numberOfLines={1}
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
          selectedTab == strings.CHANGE_PASS && userData?.refferal_code &&
          changePasswordView()}
        {selectedTab && selectedTab == strings.ADDRESS && addressView()}
      </View>

      <ActionSheet
        ref={actionSheet}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => cameraHandle(index)}
      />

      <AddressModal
        navigation={navigation}
        updateData={updateData}
        isVisible={isVisible}
        indicator={indicator}
        onClose={() => setModalVisible(false)}
        type={type}
        passLocation={(data) => addUpdateLocation(data)}
      />
    </WrapperContainer>
  );
}
