import React, { useEffect, useRef, useState } from 'react';
import {
  I18nManager,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Geocoder from 'react-native-geocoding';
import RNGooglePlaces from 'react-native-google-places';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import { MyDarkTheme } from '../styles/theme';
import { appIds } from '../utils/constants/DynamicAppKeys';
import { getPlaceDetails } from '../utils/googlePlaceApi';
import { getAddressComponent, showError } from '../utils/helperFunctions';
import { chekLocationPermission } from '../utils/permissions';
import validations from '../utils/validations';
import BorderTextInput from './BorderTextInput';
import BorderTextInputWithLable from './BorderTextInputWithLable';
import GradientButton from './GradientButton';
import SearchPlaces from './SearchPlaces';
import SelctFromMap from './SelctFromMap';

// navigator.geolocation = require('@react-native-community/geolocation');
navigator.geolocation = require('react-native-geolocation-service');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const AddressModal3 = ({
  updateData,
  isVisible = false,
  onClose = () => { },
  type,
  passLocation,
  toggleModal,
  onPress,
  indicator,
  navigation,
  selectViaMap = false,
  openCloseMapAddress = () => { },
  constCurrLoc,
}) => {
  const mapRef = useRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const { location } = useSelector((state) => state?.home);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const theme = useSelector((state) => state?.initBoot?.themeColor);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const appData = useSelector((state) => state?.initBoot?.appData);
  const currentTheme = useSelector((state) => state.initBoot);

  const { themeColors, themeLayouts, appStyle } = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const { profile } = appData;

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
    extra_instruction: '',
    addressTypeArray: [
      {
        id: 1,
        lable: strings.HOME,
        icon: imagePath.home,
      },
      { id: 2, lable: strings.WORK, icon: imagePath.workInActive },
      { id: 3, lable: strings.OTHERS, icon: imagePath.workInActive },
    ],
    address_type: updateData?.type ? updateData?.type : 1,
    country_code: '',
    viewHeight: 0,
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    customAddress: '',
    houseNo: '',
    searchResult: [],
    isStreet: false,
    isCity: false,
    isState: false,
    isCountry: false,
    isPincode: false,
    isAddress: false,
  });

  const styles = stylesData({ fontFamily, themeColors });

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
      address_type: updateData?.type,
      houseNo: updateData?.house_number ? updateData?.house_number : '',
      extra_instruction: updateData?.extra_instruction
        ? updateData?.extra_instruction
        : '',
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
    region,
    customAddress,
    houseNo,
    searchResult,
    extra_instruction,
    isStreet,
    isCity,
    isState,
    isCountry,
    isPincode,
    isAddress,
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useEffect(() => {
    Geocoder.init(profile.preferences.map_key, { language: 'en' }); // set the language
  }, []);

  const _onChangeText = (key) => (val) => {
    if (key == 'address') {
      getPlacesPrediction(val);
    }

    updateState({ [key]: val });
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
            lable: strings.HOME,
            icon: imagePath.home,
          },
          { id: 2, lable: strings.WORK, icon: imagePath.workInActive },
          { id: 3, lable: strings.OTHERS, icon: imagePath.workInActive },
        ],
        address_type: updateData?.type ? updateData?.type : 1,
        houseNo: '',
      });
    }, 1000);
  };

  /*************************** On Text Change
   */
  const getPlacesPrediction = (data) => {
    // console.log(data, 'data>>>>');
    RNGooglePlaces.getAutocompletePredictions(data)
      .then((results) => {
        updateState({ dropDownData: results });
      })
      .catch((error) => { });
  };

  /*************************** On Text Change
   */ const addressHelper = (results) => {
    let clonedArrayData = { ...state };
    clonedArrayData = { ...clonedArrayData, ...results, showDialogBox: false };
    updateState(clonedArrayData);
  };

  const handleAddressOnKeyUp = (text) => {
    updateState({ address: text });
  };

  /*************************** Place Id look Up
   */ const placeIdLookUp = (data) => {
    if (data?.placeID) {
      RNGooglePlaces.lookUpPlaceByID(data.placeID)
        .then((results) =>
          addressHelper({ ...results, address: data.fullText || data.address }),
        )
        .catch((error) => { });
    } else {
    }
  };

  /*************************** On Text Change
   */ const placeSelectionHandler = (data) => {
    updateState({ showDialogBox: false });
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
              <View style={{ paddingVertical: (height * 1.2) / 100 }}></View>
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
      address: address || '',
      // street: street || '',
      // city: city || '',
      // states: states || '',
      // country: country || '',
      // pincode: pincode || '',
    });
    if (error) {
      // showError(error);
      // alert(error);
      checkAddressError(error);
      return;
    }
    return true;
  };

  const checkAddressError = (error) => {
    if (
      error ==
      strings.PLEASE_ENTER +
      ' ' +
      strings.YOUR +
      ' ' +
      strings.ENTER_NEW_ADDRESS
    ) {
      updateState({
        isAddress: true,
        isStreet: false,
        isCity: false,
        isState: false,
        isCountry: false,
        isPincode: false,
      });
    }
    if (
      error ==
      strings.PLEASE_ENTER + ' ' + strings.YOUR + ' ' + strings.ENTER_STREET
    ) {
      updateState({
        isStreet: true,
        isCity: false,
        isState: false,
        isCountry: false,
        isPincode: false,
        isAddress: false,
      });
    }
    if (
      error ==
      strings.PLEASE_ENTER + ' ' + strings.YOUR + ' ' + strings.CITY
    ) {
      updateState({
        isCity: true,
        isStreet: false,
        isState: false,
        isCountry: false,
        isPincode: false,
        isAddress: false,
      });
    }
    if (
      error ==
      strings.PLEASE_ENTER + ' ' + strings.YOUR + ' ' + strings.STATE
    ) {
      updateState({
        isState: true,
        isStreet: false,
        isCity: false,
        isCountry: false,
        isPincode: false,
        isAddress: false,
      });
    }
    if (
      error ==
      strings.PLEASE_ENTER + ' ' + strings.YOUR + ' ' + strings.COUNTRY
    ) {
      updateState({
        isCountry: true,
        isStreet: false,
        isCity: false,
        isState: false,
        isPincode: false,
        isAddress: false,
      });
    }
    if (
      error ==
      strings.PLEASE_ENTER + ' ' + strings.YOUR + ' ' + strings.PINCODE
    ) {
      updateState({
        isPincode: true,
        isStreet: false,
        isCity: false,
        isState: false,
        isCountry: false,
        isAddress: false,
      });
    } else {
      return;
    }
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
      type_name: address_type === 3 && customAddress,
      house_number: houseNo,
      extra_instruction: extra_instruction,
    };
    if (type == 'Home1') {
      navigation.navigate(navigationStrings.HOME, {
        details,
      });
    } else if (type == 'addAddress') {
      if (getBundleId() == appIds.bumprkar) {
        // alert(`heyyy`)
        onClose();
        clearState();
        return passLocation(data, true);
      } else {
        onClose();
        clearState();
        passLocation(data);
      }
    } else if (type == 'updateAddress') {
      let update = 'update';
      onClose();
      clearState();
      passLocation(data);
      // clearState();
    } else {
      onClose();
      clearState();
      passLocation(data);
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
        // console.log(position.coords.longitude,'position.coords.latitude')
        Geocoder.from({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
          .then((json) => {
            console.log(json, 'json?>>>>>>>');
            let addressData = getAddressComponent(json?.results[0]);
            console.log(addressData, 'addressData?>>>>>>>');
            addressHelper(addressData);
          })
          .catch((error) => console.log(error, 'errro geocode'));
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000 },
    );
  };

  //close your modal
  const closeModal = () => {
    onClose();
    clearState();
  };

  //Get Dyamic textinput style
  const getTextInputStyle = (input, type) => {
    return input != '' && input != undefined
      ? [
        styles.textInput,
        { color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey },
      ]
      : { fontSize: textScale(12) };
  };

  const updateAddress_ = async (data_) => {
    let res = await getPlaceDetails(
      data_.place_id,
      profile?.preferences?.map_key,
    );
    const { result } = res;

    let addressData = getAddressComponent(result);

    let data = {};
    if (addressData.address) {
      data['address'] = addressData.address;
    }
    if (addressData.street) {
      data['street'] = addressData.street;
    }
    if (addressData.city) {
      data['city'] = addressData.city;
    }
    if (addressData.pincode) {
      data['pincode'] = addressData.pincode;
    }
    if (addressData.state) {
      data['state'] = addressData.state;
    }
    if (addressData.country) {
      data['country'] = addressData.country;
    }
    if (addressData.latitude) {
      data['latitude'] = addressData.latitude;
    }
    if (addressData.longitude) {
      data['longitude'] = addressData.longitude;
    }
    if (addressData.phonecode) {
      data['phonecode'] = addressData.phonecode;
    }
    if (addressData.country_code) {
      data['country_code'] = addressData.country_code;
    }

    data['is_primary'] = type == 'addAddress' ? 1 : is_primary;
    if (getBundleId() === appIds.bumprkar) {
      addressHelper(data)
    }
    passLocation(data);
  };

  const onPressAddress = async (place) => {
    Keyboard.dismiss();
    console.log('selected item', place?.name);
    // return;
    if (!!place.place_id && !!place?.name) {
      try {
        let res = await getPlaceDetails(
          place.place_id,
          profile?.preferences?.map_key,
        );
        const { result } = res;

        let addressData = getAddressComponent(result);

        let data = {};
        if (addressData.address) {
          data['address'] = addressData.address;
        }
        if (addressData.street) {
          data['street'] = addressData.street;
        }
        if (addressData.city) {
          data['city'] = addressData.city;
        }
        if (addressData.pincode) {
          data['pincode'] = addressData.pincode;
        }
        if (addressData.states) {
          data['state'] = addressData.states;
        }
        if (addressData.country) {
          data['country'] = addressData.country;
        }
        if (addressData.latitude) {
          data['latitude'] = addressData.latitude;
        }
        if (addressData.longitude) {
          data['longitude'] = addressData.longitude;
        }
        if (addressData.phonecode) {
          data['phonecode'] = addressData.phonecode;
        }
        if (addressData.country_code) {
          data['country_code'] = addressData.country_code;
        }
        updateState({
          ...state,
          ...data,
          searchResult: [],
        });
      } catch (error) {
        console.log("something wen't wrong");
      }
    } else {
      alert(strings.PLACE_ID_NOT_FOUND);
    }
  };

  const addressDone = (data) => {
    updateAddress_(data);
  };

  const renderSearchItem = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.addressViewStyle,
          borderBottomWidth: searchResult.length - 1 !== index ? 0.5 : 0,
          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.lightGreyBg,
        }}
        onPress={() => onPressAddress(item)}>
        <View style={{ flex: 0.15 }}>
          <Image source={imagePath.RecentLocationImage} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Text
            style={{
              fontSize: textScale(12),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily.regular,
            }}>
            {item?.name}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: textScale(10),
              color: colors.textGreyJ,
              fontFamily: fontFamily.regular,
              lineHeight: moderateScaleVertical(20),
            }}>
            {item?.formatted_address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      animationType={'none'}
      style={styles.modalContainer}
      onBackdropPress={closeModal}
      onLayout={(event) => {
        updateState({ viewHeight: event.nativeEvent.layout.height });
      }}>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Image
          style={
            isDarkMode ? { tintColor: colors.white } : { tintColor: colors.black }
          }
          source={imagePath.crossB}
        />
      </TouchableOpacity>

      <View
        style={
          isDarkMode
            ? [
              styles.modalMainViewContainer,
              {
                backgroundColor: MyDarkTheme.colors.lightDark,
              },
            ]
            : [
              styles.modalMainViewContainer,
              { paddingHorizontal: selectViaMap ? 0 : moderateScale(24) },
            ]
        }>
        {selectViaMap ? (
          <View style={{ flex: 1 }}>
            <SelctFromMap
              addressDone={addressDone}
              mapClose={() => openCloseMapAddress(2)} //address map close
              constCurrLoc={location}
            />
          </View>
        ) : (
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            <View style={styles.addAddessView}>
              <Text
                numberOfLines={1}
                style={
                  isDarkMode
                    ? [
                      styles.addNewAddeessText,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.addNewAddeessText
                }>
                {strings.ADD_ADDRESS1}
              </Text>
            </View>

            <Text
              style={{
                fontFamily: fontFamily.medium,
                fontSize: textScale(14),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyD,
                textAlign: 'left',
              }}>
              {strings.YOUR_LOCATION}
            </Text>

            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: moderateScale(7),
                  // marginHorizontal: moderateScale(7),
                  flex: 1,
                }}>
                <View style={{ flex: 1 }}>
                  <SearchPlaces
                    containerStyle={{ backgroundColor: 'transparent' }}
                    showRightImg={false}
                    curLatLng={`${constCurrLoc?.latitude}-${constCurrLoc?.longitude}`}
                    placeHolder={strings.SEARCH_LOCATION}
                    value={address} // instant update search value
                    mapKey={profile?.preferences?.map_key} //send here google Key
                    fetchArrayResult={(data) =>
                      updateState({ searchResult: data })
                    }
                    setValue={(text) => updateState({ address: text })} //return & update on change text value
                    _moveToNextScreen={() => { }}
                    placeHolderColor={colors.textGreyB}
                    onClear={() => updateState({ address: '', searchResult: [] })}
                    textStyle={{
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(14),
                    }}
                  />
                </View>

                <View style={{ marginHorizontal: moderateScale(6) }} />
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: moderateScale(6),
                    borderRadius: moderateScale(8),
                    // flex:1
                  }}
                  onPress={() => openCloseMapAddress(1)} //address map open
                >
                  <Image
                    source={imagePath.ic_pinIcon}
                    style={{
                      width: moderateScale(15),
                      height: moderateScaleVertical(15),
                      resizeMode: 'contain',
                      tintColor: themeColors.primary_color,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: textScale(11),
                      fontFamily: fontFamily.regular,
                      marginLeft: moderateScale(4),
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {strings.SELECT_VIA_MAP}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ width: '100%' }}>
                {searchResult?.map((item, i) => {
                  return renderSearchItem(item, i);
                })}
              </View>
            </View>

            <View
              style={{
                marginBottom: 5,
                borderBottomWidth: 1,
                borderColor: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.borderLight,
                marginTop: 4,
              }}></View>
            {isAddress && (
              <Text style={{ color: colors.redB }}>
                {strings.PLEASE_ENTER +
                  ' ' +
                  strings.YOUR +
                  ' ' +
                  strings.ENTER_NEW_ADDRESS}
              </Text>
            )}
            <TouchableOpacity
              onPress={currentLocation}
              style={{
                // alignItems: 'center',
                flexDirection: 'row',
                marginTop: moderateScaleVertical(8),
                zIndex: -2000,
              }}>
              <FastImage
                source={imagePath.currentLocation}
                resizeMode="contain"
                style={{
                  width: moderateScale(16),
                  height: moderateScale(16),
                }}
              />
              <View style={{}}>
                <Text
                  style={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.medium,
                    marginLeft: moderateScale(8),
                    color: colors.redB,
                  }}>
                  {strings.USECURRENTLOACTION}
                </Text>
                <Text
                  style={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.regular,
                    marginLeft: moderateScale(8),
                    color: colors.blackOpacity66,
                    marginTop: moderateScaleVertical(4),
                  }}>
                  {constCurrLoc?.address}
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                zIndex: -1000,
              }}>
              <BorderTextInputWithLable
                onChangeText={_onChangeText('houseNo')}
                placeholder={strings.HOUSE_NO}
                label={strings.COMPLETE_ADDRESS}
                textInputStyle={getTextInputStyle(houseNo)}
                value={houseNo}
                multiline={false}
                borderWidth={0}
                marginBottomTxt={0}
                containerStyle={{ borderBottomWidth: 1 }}
                mainStyle={{ marginTop: 10 }}
                labelStyle={styles.labelStyle}
                returnKeyType={'next'}
              />

              <BorderTextInputWithLable
                onChangeText={_onChangeText('street')}
                placeholder={strings.ENTER_STREET}
                textInputStyle={getTextInputStyle(city)}
                value={street}
                borderWidth={0}
                marginBottomTxt={0}
                containerStyle={{ borderBottomWidth: 1 }}
                returnKeyType={'next'}
              />
              {isStreet && (
                <Text
                  style={{
                    marginTop: moderateScale(-20),
                    marginLeft: moderateScale(6),
                    color: colors.redB,
                  }}>
                  {strings.PLEASE_ENTER +
                    ' ' +
                    strings.YOUR +
                    ' ' +
                    strings.ENTER_STREET}
                </Text>
              )}

              <BorderTextInputWithLable
                onChangeText={_onChangeText('city')}
                placeholder={strings.CITY}
                textInputStyle={getTextInputStyle(city)}
                value={city}
                borderWidth={0}
                marginBottomTxt={0}
                containerStyle={{ borderBottomWidth: 1 }}
                returnKeyType={'next'}
              />
              {isCity && (
                <Text
                  style={{
                    marginTop: moderateScale(-20),
                    marginLeft: moderateScale(6),
                    color: colors.redB,
                  }}>
                  {strings.PLEASE_ENTER +
                    ' ' +
                    strings.YOUR +
                    ' ' +
                    strings.CITY}
                </Text>
              )}

              <BorderTextInputWithLable
                onChangeText={_onChangeText('states')}
                placeholder={strings.STATE}
                textInputStyle={getTextInputStyle(states)}
                value={states}
                borderWidth={0}
                marginBottomTxt={0}
                containerStyle={{ borderBottomWidth: 1 }}
                returnKeyType={'next'}
              />
              {isState && (
                <Text
                  style={{
                    marginTop: moderateScale(-20),
                    marginLeft: moderateScale(6),
                    color: colors.redB,
                  }}>
                  {strings.PLEASE_ENTER +
                    ' ' +
                    strings.YOUR +
                    ' ' +
                    strings.STATE}
                </Text>
              )}

              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 0.48 }}>
                  <View
                    style={{
                      height: moderateScaleVertical(49),
                      borderBottomWidth: 1,
                      borderRadius: 13,
                      borderColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.borderLight,
                      marginBottom: 20,
                      justifyContent: 'center',
                      paddingHorizontal: 8,
                    }}>
                    <TextInput
                      selectionColor={
                        isDarkMode ? MyDarkTheme.colors.text : colors.black
                      }
                      placeholderTextColor={
                        isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGreyOpcaity7
                      }
                      onChangeText={_onChangeText('country')}
                      returnKeyType={'next'}
                      placeholder={strings.COUNTRY}
                      // textInputStyle={[getTextInputStyle(country)]}
                      value={country}
                      style={
                        isDarkMode
                          ? [styles.textInput3, { opacity: 0.7, color: '#fff' }]
                          : [
                            styles.textInput3,
                            { opacity: 0.7, color: colors.textGrey },
                          ]
                      }
                    />
                  </View>
                  {isCountry && (
                    <Text
                      style={{
                        marginTop: moderateScale(-20),
                        marginLeft: moderateScale(6),
                        color: colors.redB,
                      }}>
                      {strings.PLEASE_ENTER +
                        ' ' +
                        strings.YOUR +
                        ' ' +
                        strings.COUNTRY}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    flex: 0.48,
                  }}>
                  <BorderTextInput
                    containerStyle={{
                      flex: 0.48,
                      color: colors.textGrey,
                      fontFamily: fontFamily.bold,
                      fontSize: textScale(12),
                      opacity: 1,
                      borderBottomWidth: 1,
                    }}
                    onChangeText={_onChangeText('pincode')}
                    placeholder={strings.PINCODE}
                    textInputStyle={getTextInputStyle(pincode)}
                    value={pincode}
                    keyboardType={'numeric'}
                    borderWidth={0}
                    borderRadius={0}
                    returnKeyType={'next'}
                  />
                  {isPincode && (
                    <Text
                      style={{
                        marginTop: moderateScale(-20),
                        marginLeft: moderateScale(6),
                        color: colors.redB,
                      }}>
                      {strings.PLEASE_ENTER +
                        ' ' +
                        strings.YOUR +
                        ' ' +
                        strings.PINCODE}
                    </Text>
                  )}
                </View>
              </View>

              <BorderTextInputWithLable
                onChangeText={_onChangeText('extra_instruction')}
                placeholder={strings.EXTRA_INSTRUCTION}
                textInputStyle={getTextInputStyle(states)}
                value={extra_instruction}
                borderWidth={0}
                marginBottomTxt={0}
                containerStyle={{ borderBottomWidth: 1 }}
                returnKeyType={'next'}
              />

              <Text
                style={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(14),
                }}>
                {strings.SAVE_AS}
              </Text>

              <View style={styles.addressTypeView}>
                {addressTypeArray.map((item, index) => {
                  return (
                    <View key={index}>
                      <TouchableOpacity
                        onPress={() => updateState({ address_type: item.id })}
                        style={[
                          styles.addressHomeOrOfficeView,
                          {
                            backgroundColor: isDarkMode
                              ? MyDarkTheme.colors.background
                              : colors.white,
                          },
                        ]}>
                        <Text
                          style={[
                            {
                              color: isDarkMode
                                ? themeColors.primary_color
                                : colors.textGreyB,
                              fontFamily: fontFamily.bold,
                            },
                          ]}>
                          {item.lable}
                        </Text>
                        {address_type == item.id && (
                          <Image
                            source={imagePath.icRedChecked}
                            style={{ position: 'absolute', right: -8, top: -8 }}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
              {address_type === 3 && (
                <BorderTextInputWithLable
                  onChangeText={_onChangeText('customAddress')}
                  placeholder={strings.ENETER_YOUR_ADDRESS}
                  textInputStyle={getTextInputStyle(city)}
                  borderWidth={0}
                  marginBottomTxt={0}
                  returnKeyType={'next'}
                  containerStyle={{
                    borderBottomWidth: 1,
                    marginTop: moderateScale(5),
                  }}
                />
              )}
            </View>

            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={{
                color: isDarkMode ? MyDarkTheme.colors.text : colors.white,
              }}
              onPress={saveAddress}
              marginTop={moderateScaleVertical(10)}
              // marginBottom={moderateScaleVertical(10)}
              btnText={strings.SAVE_ADDRESS}
              indicator={indicator}
              containerStyle={{ marginTop: moderateScale(20) }}
            />
          </KeyboardAwareScrollView>
        )}
      </View>
    </Modal>
  );
};

export function stylesData({ fontFamily, themeColors }) {
  const commonStyles = commonStylesFun({ fontFamily });

  const styles = StyleSheet.create({
    addressTypeView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: moderateScaleVertical(10),
      paddingHorizontal: moderateScale(3),
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
      ...commonStyles.mediumTxtGreyD14,
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
      justifyContent: 'space-between',
      marginBottom: moderateScaleVertical(24),
      marginTop: moderateScaleVertical(40),
      alignItems: 'center',
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
      // zIndex: -1000,
    },
    modalMainViewContainer: {
      flex: 1,
      backgroundColor: colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      // overflow: 'hidden',
      paddingHorizontal: 20,
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
      height: moderateScaleVertical(35),
      width: width / 1.5,

      justifyContent: 'center',
      marginHorizontal: moderateScale(0),
      marginVertical: moderateScaleVertical(0),
      alignItems: 'center',
    },

    // textGoogleInputContainerAddress: {
    //   // flexDirection: 'row',
    //   // flexWrap:'wrap',
    //   // overflow:'hidden',
    //   height: moderateScaleVertical(49),
    //   borderWidth: 1,
    //   borderRadius: 13,
    //   borderColor: colors.borderLight,
    //   marginBottom: 20,
    //   justifyContent: 'center',
    //   marginHorizontal: moderateScale(0),
    //   marginVertical: moderateScaleVertical(0),
    //   alignItems: 'center',
    //   // backgroundColor:'red'
    // },

    listView: {
      borderWidth: moderateScale(1),
      borderColor: colors.borderLight,
      alignSelf: 'flex-start',
      marginLeft: -moderateScale(15),
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
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    textInput2: {
      height: moderateScaleVertical(35),
      borderRadius: 13,
    },
    addressHomeOrOfficeView: {
      flexDirection: 'row',
      marginRight: moderateScale(25),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      backgroundColor: colors.white,
      shadowOpacity: 0.2,
      justifyContent: 'center',
      shadowOffset: { width: 0, height: 0.1 },
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
    map: {
      ...StyleSheet.absoluteFillObject,
      height: height,
    },
    yourLocationTxt: {
      ...commonStyles.mediumTxtGreyD14,
    },
    labelStyle: {
      ...commonStyles.mediumTxtGreyD14,
    },
    useCurrentLocationView: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: moderateScale(15),
      marginTop: moderateScaleVertical(70),
    },
    savedAddressView: {
      flexDirection: 'row',
      marginBottom: moderateScaleVertical(8),
      alignItems: 'center',
    },
    addresssLableName: {
      fontSize: textScale(12),
      color: colors.black,
      fontFamily: fontFamily.medium,

      marginLeft: moderateScale(6),
    },
    addressViewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: moderateScale(10),
      borderBottomWidth: 0.5,
      marginBottom: moderateScaleVertical(4),
    },
  });
  return styles;
}
export default React.memo(AddressModal3);
