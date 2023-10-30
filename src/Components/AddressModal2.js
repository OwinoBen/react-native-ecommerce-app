import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import RNGooglePlaces from 'react-native-google-places';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {getAddressComponent} from '../utils/helperFunctions';
import {chekLocationPermission} from '../utils/permissions';
import validations from '../utils/validations';
import BorderTextInput from './BorderTextInput';
import GooglePlaceInput from './GooglePlaceInput';
import GradientButton from './GradientButton';
import {TextInput} from 'react-native-paper';
import AutoUpLabelTxtInput from './AutoUpLabelTxtInput';

// navigator.geolocation = require('@react-native-community/geolocation');
navigator.geolocation = require('react-native-geolocation-service');

const AddressModal2 = ({
  updateData,
  isVisible = false,
  onClose,
  type,
  passLocation,
  toggleModal,
  onPress,
  indicator,
  navigation,
}) => {
  const appData = useSelector((state) => state?.initBoot?.appData);
  const currentTheme = useSelector((state) => state.initBoot);
  const {themeColors, themeLayouts, appStyle} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const {profile} = appData;
  const [state, setState] = useState({
    dropDownData: [],
    address: updateData?.address ? updateData?.address : '',
    showDialogBox: false,
    isLoading: false,
    street: '',
    city: '',
    pincode: '',
    states: '',
    country: '',
    latitude: '',
    longitude: '',
    phonecode: '',
    is_primary: '',
    country_key: '',
    addressTypeArray: [
      {
        id: 1,
        lable: strings.HOME_1,
        icon: imagePath.home,
      },
      {id: 2, lable: 'Work', icon: imagePath.workInActive},
    ],
    address_type: 1,
    country_code: '',
    viewHeight: 0,
  });

  const styles = stylesData({fontFamily, themeColors});

  //To update the states
  useEffect(() => {
    updateState({
      address: updateData?.address ? updateData?.address : '',
      showDialogBox: false,
      isLoading: false,
      street: updateData?.street ? updateData?.street : '',
      city: updateData?.city ? updateData?.city : '',
      pincode: updateData?.pincode ? updateData?.pincode : '',
      states: updateData?.state ? updateData?.state : '',
      country: updateData?.country ? updateData?.country : '',
      latitude: updateData?.latitude ? updateData?.latitude : '',
      longitude: updateData?.longitude ? updateData?.longitude : '',
      phonecode: updateData?.phonecode ? updateData?.phonecode : '',
      country_code: updateData?.country_code ? updateData?.country_code : '',
      is_primary: updateData?.is_primary ? updateData?.is_primary : '',
    });
  }, [updateData]);

  const {
    address,
    dropDownData,
    showDialogBox,
    street,
    city,
    pincode,
    states,
    country,
    latitude,
    longitude,
    addressTypeArray,
    address_type,
    phonecode,
    country_code,
    is_primary,
    viewHeight,
  } = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    Geocoder.init(profile.preferences.map_key, {language: 'en'}); // set the language
  }, []);

  const _onChangeText = (key) => (val) => {
    if (key == 'address') {
      getPlacesPrediction(val);
    }

    updateState({[key]: val});
  };

  //Cleaer all state
  const clearState = () => {
    setTimeout(() => {
      setState({
        dropDownData: [],
        address: '',
        showDialogBox: false,
        isLoading: false,
        street: '',
        city: '',
        pincode: '',
        states: '',
        country: '',
        latitude: '',
        longitude: '',
        phonecode: '',
        country_code: '',
        is_primary: 1,
        addressTypeArray: [
          {
            id: 1,
            lable: 'Home',
            icon: imagePath.home,
          },
          {id: 2, lable: 'Work', icon: imagePath.workInActive},
        ],
        address_type: 1,
      });
    }, 1000);
  };

  /*************************** On Text Change
   */
  const getPlacesPrediction = (data) => {
    // console.log(data, 'data>>>>');
    RNGooglePlaces.getAutocompletePredictions(data)
      .then((results) => {
        updateState({dropDownData: results});
      })
      .catch((error) => {});
  };

  /*************************** On Text Change
   */ const addressHelper = (results) => {
    let clonedArrayData = {...state};
    clonedArrayData = {...clonedArrayData, ...results, showDialogBox: false};
    updateState(clonedArrayData);
  };

  const handleAddressOnKeyUp = (text) => {
    updateState({address: text});
  };

  /*************************** Place Id look Up
   */ const placeIdLookUp = (data) => {
    if (data?.placeID) {
      RNGooglePlaces.lookUpPlaceByID(data.placeID)
        .then((results) =>
          addressHelper({...results, address: data.fullText || data.address}),
        )
        .catch((error) => {});
    } else {
    }
  };

  /*************************** On Text Change
   */ const placeSelectionHandler = (data) => {
    updateState({showDialogBox: false});
    placeIdLookUp(data);
    Keyboard.dismiss();
  };

  /*************************** On Text Change
   */ const renderDropDown = () => {
    if (dropDownData && dropDownData.length > 0 && showDialogBox) {
      return (
        <View>
          {dropDownData.map((x, i) => (
            <TouchableOpacity onPress={() => placeSelectionHandler(x)} key={i}>
              <Text style={styles.textInput}>{x.fullText}</Text>
              <View style={{paddingVertical: (height * 1.2) / 100}}></View>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else {
      return null;
    }
  };

  //this function use for save user info
  const isValidDataOfAddressSave = () => {
    const error = validations({
      address: address ? address : '',
      street: street ? street : '',
      city: city ? city : '',
      states: states ? states : '',
      country: country ? country : '',
      // pincode: pincode ? pincode : '',
    });
    if (error) {
      // showError(error);
      alert(error);
      return;
    }
    return true;
  };

  //Save your current address
  const saveAddress = () => {
    const checkValid = isValidDataOfAddressSave();
    if (!checkValid) {
      return;
    }
    let data = {
      address: address,
      street: street,
      city: city,
      pincode: pincode,
      state: states,
      country: country,
      latitude: latitude,
      longitude: longitude,
      phonecode: phonecode,
      country_code: country_code,
      is_primary: type == 'addAddress' ? 1 : is_primary,
      address_type: address_type,
    };
    if (type == 'Home1') {
      navigation.navigate(navigationStrings.HOME, {
        details,
      });
    } else if (type == 'addAddress') {
      onClose();
      clearState();
      passLocation(data);
      // clearState();
    } else if (type == 'updateAddress') {
      let update = 'update';
      onClose();
      clearState();
      passLocation(data);
      // clearState();
    }
  };
  const currentLocation = () => {
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          getCurrentPosition();
        }
      })
      .catch((error) => console.log('error while accessing location ', error));
  };

  const getCurrentPosition = () => {
    return navigator.geolocation.default.getCurrentPosition(
      (position) => {
        // const location = JSON.stringify(position);
        Geocoder.from({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
          .then((json) => {
            let addressData = getAddressComponent(json?.results[0]);
            console.log(addressData, 'addressData?>>>>>>>');
            addressHelper(addressData);
          })
          .catch((error) => console.log(error, 'errro geocode'));
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000},
    );
  };

  //close your modal
  const closeModal = () => {
    clearState();
    onClose();
  };

  //Get Dyamic textinput style
  const getTextInputStyle = (input, type) => {
    return input != '' && input != undefined
      ? styles.textInput
      : {fontSize: textScale(12)};
  };

  return (
    <Modal
      transparent={true}
      isVisible={isVisible}
      animationType={'none'}
      style={styles.modalContainer}
      onLayout={(event) => {
        updateState({viewHeight: event.nativeEvent.layout.height});
      }}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Image
          source={imagePath.crossB}
          style={{tintColor: themeColors.secondary_color}}
        />
      </TouchableOpacity>

      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={[
          styles.modalMainViewContainer,
          {paddingHorizontal: moderateScale(24)},
        ]}>
        <View style={styles.addAddessView}>
          <Text numberOfLines={1} style={styles.addNewAddeessText}>
            {strings.ADD_NEW_ADDRESS}
          </Text>
        </View>

        <GooglePlaceInput
          getDefaultValue={address}
          type={type}
          navigation={navigation}
          googleApiKey={profile?.preferences?.map_key}
          textInputContainer={styles.textGoogleInputContainerAddress}
          listView={styles.listView}
          textInput={styles.textInput2}
          addressHelper={(results) => addressHelper(results)}
          handleAddressOnKeyUp={(text) => handleAddressOnKeyUp(text)}
        />

        <View
          style={{
            zIndex: -1000,
          }}>
          <View style={styles.useCurrentLocationView}>
            <Image
              style={{tintColor: themeColors.primary_color}}
              source={imagePath.locationGreen}
            />
            <TouchableOpacity onPress={currentLocation}>
              <Text style={styles.useCurrentLocationText}>
                {strings.USECURRENTLOACTION}
              </Text>
            </TouchableOpacity>
          </View>

          <AutoUpLabelTxtInput
            value={street}
            label={strings.ENTER_STREET}
            onChangeText={_onChangeText('street')}
          />

          <AutoUpLabelTxtInput
            value={city}
            label={strings.CITY}
            onChangeText={_onChangeText('city')}
            containerStyle={{marginTop: moderateScale(15)}}
          />

          <AutoUpLabelTxtInput
            value={states}
            label={strings.STATE}
            onChangeText={_onChangeText('states')}
            containerStyle={{marginTop: moderateScale(15)}}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: moderateScale(15),
            }}>
            <AutoUpLabelTxtInput
              value={country}
              label={strings.COUNTRY}
              onChangeText={_onChangeText('country')}
              containerStyle={{
                flex: 0.48,
                height: moderateScaleVertical(55),
                justifyContent: 'center',
              }}
            />
            <AutoUpLabelTxtInput
              value={pincode}
              label={strings.PINCODE}
              onChangeText={_onChangeText('pincode')}
              containerStyle={{
                flex: 0.48,
                height: moderateScaleVertical(55),
                justifyContent: 'center',
              }}
              keyboardType={'numeric'}
            />
          </View>
          <Text
            style={{fontFamily: fontFamily.bold, marginTop: moderateScale(15)}}>
            {strings.SAVE_AS}
          </Text>
          <View style={styles.addressTypeView}>
            {addressTypeArray.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => updateState({address_type: item.id})}
                  style={styles.addressHomeOrOfficeView}>
                  <Image
                    source={item.icon}
                    style={{
                      tintColor:
                        address_type == item.id
                          ? themeColors.primary_color
                          : colors.textGreyG,
                    }}
                  />
                  <Text
                    style={[
                      {
                        color: colors.textGreyB,
                        fontFamily: fontFamily.bold,
                        paddingLeft: moderateScale(10),
                      },
                    ]}>
                    {item.lable}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View
          style={{
            marginTop: moderateScaleVertical(10),
          }}>
          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={styles.textStyle}
            onPress={saveAddress}
            marginTop={moderateScaleVertical(10)}
            // marginBottom={moderateScaleVertical(10)}
            btnText={strings.SAVE_ADDRESS}
            indicator={indicator}
          />
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export function stylesData({fontFamily, themeColors}) {
  const commonStyles = commonStylesFun({fontFamily});

  const styles = StyleSheet.create({
    addressTypeView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScaleVertical(10),
      //backgroundColor: 'red',
    },
    closeButton: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: moderateScaleVertical(10),
    },
    useCurrentLocationText: {
      marginHorizontal: 5,
      ...commonStyles.mediumFont12,
      color: themeColors.primary_color,
    },
    addNewAddeessText: {
      ...commonStyles.futuraHeavyBt,
      color: colors.textGreyD,
    },
    useCurrentLocationView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: moderateScaleVertical(15),
    },
    addressDropDownView: {
      backgroundColor: 'white',
      zIndex: 99999999,
      width: '100%',
      position: 'absolute',
      top: moderateScaleVertical(120),

      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: colors.borderLight,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(10),
    },
    addAddessView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: moderateScaleVertical(24),
      marginTop: moderateScaleVertical(40),
    },
    closeModalView: {
      alignSelf: 'center',
      height: 6,
      width: 50,
      backgroundColor: colors.backgroundGreyB,
      borderRadius: 20,
      marginTop: 10,
    },
    modalContainer: {
      marginHorizontal: 0,
      marginBottom: 0,
      marginTop: moderateScaleVertical(height / 10),
      overflow: 'hidden',
    },
    modalMainViewContainer: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      // overflow: 'hidden',
    },
    textInputContainer: {
      flexDirection: 'row',
      height: moderateScaleVertical(49),
      borderWidth: 1,
      // borderRadius: 13,
      // paddingVertical:moderateScaleVertical(5),

      borderColor: colors.borderLight,
    },
    textInputContainerAddress: {
      // flexDirection: 'row',
      // flexWrap:'wrap',
      // overflow:'hidden',
      height: moderateScaleVertical(49),
      borderWidth: 1,
      borderRadius: 13,
      borderColor: colors.borderLight,
      marginBottom: 20,
      justifyContent: 'center',
    },
    textGoogleInputContainerAddress: {
      // flexDirection: 'row',
      // flexWrap:'wrap',
      // overflow:'hidden',
      height: moderateScaleVertical(49),
      borderWidth: 1,
      borderRadius: 13,
      borderColor: colors.borderLight,
      marginBottom: 20,
      justifyContent: 'center',
      marginHorizontal: moderateScale(0),
      marginVertical: moderateScaleVertical(0),
      alignItems: 'center',
      // backgroundColor:'red'
    },
    listView: {
      borderWidth: moderateScale(1),
      borderColor: colors.borderLight,
      marginHorizontal: moderateScale(0),
    },

    textInput: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),

      opacity: 1,
      minWidth: width / 2,
      maxWidth: width * 2,

      // color: colors.textGreyOpcaity7,
    },

    textInput3: {
      color: colors.textGrey,
      fontFamily: fontFamily.bold,
      fontSize: textScale(12),
    },
    textInput2: {
      height: moderateScaleVertical(35),
      borderRadius: 13,
    },
    addressHomeOrOfficeView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: moderateScale(40),
    },
    addressTextStyle: {
      // flex: 1,
      // height:49,
      opacity: 0.7,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      paddingHorizontal: 10,
      paddingTop: 0,
      paddingBottom: 0,
    },
    bottomAddToCartView: {
      marginHorizontal: moderateScale(20),
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
    },
  });
  return styles;
}
export default React.memo(AddressModal2);
