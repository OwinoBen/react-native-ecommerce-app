import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Keyboard,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {useSelector} from 'react-redux';
import GooglePlaceInput from '../../../Components/GooglePlaceInput';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang/index';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {getAddressComponent, showError} from '../../../utils/helperFunctions';
import {chekLocationPermission} from '../../../utils/permissions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';

export default function MultipleDropOffSelection({navigation, route}) {
  const paramData = route?.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  console.log(paramData, 'paramData');
  const {appData, allAddresss, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  console.log(allAddresss, 'allAddresss');
  const fontFamily = appStyle?.fontSizeData;
  const [state, setState] = useState({
    pickUpLocation: '',
    pickUpLocationLatLng: null,
    pickUpLocationAddressData: null,
    dropOffLocation: '',
    dropOffLocationLatLng: null,
    dropOffLocationAddressData: null,
    dropOffLocationTwo: '',
    dropOffLocationTwoLatLng: null,
    dropOffLocationTwoAddressData: null,
    dropOffLocationThree: '',
    dropOffLocationThreeLatLng: null,
    dropOffLocationThreeAddressData: null,
    pickUpLocationFocus: true,
    dropOffLocationFocus: false,
    dropOffLocationTwoFocus: false,
    dropOffLocationThreeFocus: false,
    dot: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    suggestions: [],
    viewHeight: null,
    showDropOfTwo: false,
    showDropOfThree: false,
    pageNo: 1,
    limit: 5,
    pickUpVendors: [],
    allSavedAddress: [],
    selectedAddress: null,
    savedAddressViewHeight: 0,
    avalibleValueInTextInput: false,
  });
  const {
    pickUpLocationAddressData,
    dropOffLocationAddressData,
    dropOffLocationTwoAddressData,
    dropOffLocationThreeAddressData,
    viewHeight,
    pickUpLocation,
    pickUpLocationLatLng,
    dropOffLocation,
    dropOffLocationTwo,
    dropOffLocationThree,
    pickUpLocationFocus,
    dropOffLocationFocus,
    dropOffLocationTwoFocus,
    dropOffLocationThreeFocus,
    dropOffLocationLatLng,
    dropOffLocationTwoLatLng,
    dropOffLocationThreeLatLng,
    dot,
    showDropOfTwo,
    showDropOfThree,
    suggestions,
    pageNo,
    limit,
    pickUpVendors,
    allSavedAddress,
    selectedAddress,
    savedAddressViewHeight,
    avalibleValueInTextInput,
  } = state;

  useFocusEffect(
    React.useCallback(() => {
      
      if (!!userData?.auth_token) {
        getAllAddress();
      }
      // console.log(height*.25,"sadasdasdasd")
    }, []),
  );

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
        console.log(res, 'all address');
        // actions.saveAllUserAddress(res.data);
        updateState({allSavedAddress: res.data, isLoading: false});
      })
      .catch((error) => {
        updateState({isLoading: false});
        showError(error?.message || error?.error);
      });
  };

  useEffect(() => {
    chekLocationPermission()
      .then((result) => {
        if (result === 'goback') {
          navigation.goBack();
        }
        Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({
    fontFamily,
    themeColors,
    savedAddressViewHeight,
    avalibleValueInTextInput,
  });
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;

  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  useFocusEffect(
    React.useCallback(() => {
      getAllPickUpVendors();
    }, [pageNo]),
  );
  console.log(avalibleValueInTextInput, 'avalibleValueInTextInput');
  const getAllPickUpVendors = () => {
    actions
      .getDataByCategoryId(
        `/${paramData?.data?.id}?limit=${limit}&page=${pageNo}`,
        {},
        {code: appData?.profile?.code},
      )
      .then((res) => {
        console.log(res, 'res>>>>>');
        updateState({
          isLoading: false,
          isRefreshing: false,
          pickUpVendors:
            pageNo == 1
              ? res.data.listData.data
              : [...pickUpVendors, ...res.data.listData.data],
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const _onFocus = (type) => {
    updateState({[type]: true});
  };
  /*************************** On Text Change
   */ const addressHelper = (results) => {
    let clonedArrayData = {...state};
    clonedArrayData = {...clonedArrayData, ...results, showDialogBox: false};
    updateState(clonedArrayData);
  };

  const handleAddressOnKeyUp = (text, type) => {
    if (text == '') {
      updateState({[type]: '', avalibleValueInTextInput: false});
    } else {
      updateState({[type]: text, avalibleValueInTextInput: true});
    }
  };

  const showListOutside = (results, type, dataSource) => {
    //
    //
    // setTimeout(() => {
    //   updateState({suggestions:dataSource})
    // }, 100);
  };

  const _renderBottomComponent = (type, addressType) => {
    return (
      <View
        style={{
          padding: moderateScale(15),
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: -1000,
        }}>
        <View style={{flex: 0.09}}>
          <Image source={imagePath.locationCourier} />
        </View>
        <TouchableOpacity
          onPress={() => _redirectToMapScreen(type, addressType)}
          style={{flex: 0.75}}>
          <Text style={styles.addresssLableName}>
            {strings.SETLOCATIONONMAP}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const _rendorCustomRow = (itm) => {
    return (
      <View
        style={{
          padding: moderateScale(2),
          flexDirection: 'row',
        }}>
        <View style={{flex: 0.2, marginRight: 10}}>
          <Image source={imagePath.locationCourier} />
        </View>
        <View style={{flex: 0.7}}>
          <Text style={styles.address}>{itm.description}</Text>
        </View>
      </View>
    );
  };

  const updateTheAddress = (details, addressType, type) => {
    const address = details?.formatted_address || details?.address;
    let latlng = {
      latitude: details?.geometry?.location?.lat
        ? JSON.stringify(details?.geometry?.location?.lat)
        : details?.latitude,
      longitude: details?.geometry?.location?.lng
        ? JSON.stringify(details?.geometry?.location?.lng)
        : details?.longitude,
    };

    let addressData = details?.user_id ? details : getAddressComponent(details);

    let updatedAddress = {
      task_type_id: addressType == 'pickup' ? 1 : 2,
      post_code: addressData?.pincode,
      short_name: addressData?.states || addressData?.state,
      address: addressData?.address,
      latitude: details?.user_id
        ? addressData?.latitude
        : JSON.stringify(addressData?.latitude),
      longitude: details?.user_id
        ? addressData?.longitude
        : JSON.stringify(addressData?.longitude),
    };

    if (addressType == 'pickup') {
      updateState({
        pickUpLocation: address,
        pickUpLocationAddressData: updatedAddress,
        pickUpLocationLatLng: latlng,
        pickUpLocationFocus: false,
      });
      Keyboard.dismiss();
    }
    if (addressType == 'dropoff') {
      if (type == 'dropOffLocation') {
        updateState({
          dropOffLocation: address,
          dropOffLocationAddressData: updatedAddress,
          dropOffLocationLatLng: latlng,
          dropOffLocationFocus: false,
        });
        Keyboard.dismiss();
      }
      if (type == 'dropOffLocationTwo') {
        updateState({
          dropOffLocationTwo: address,
          dropOffLocationTwoAddressData: updatedAddress,
          dropOffLocationTwoLatLng: latlng,
          dropOffLocationTwoFocus: false,
          // showDropOfThree: true,
        });
        Keyboard.dismiss();
      }
      if (type == 'dropOffLocationThree') {
        updateState({
          dropOffLocationThree: address,
          dropOffLocationThreeAddressData: updatedAddress,
          dropOffLocationThreeLatLng: latlng,
          dropOffLocationThreeFocus: false,
        });
        Keyboard.dismiss();
      }
    }
  };

  useEffect(() => {
    updateTheAddress(
      paramData?.details,
      paramData?.addressType,
      paramData?.type,
    );
  }, [paramData?.type]);

  const renderDotContainer = () => {
    return (
      <>
        <View style={{height: 40, overflow: 'hidden', alignItems: 'center'}}>
          {dot.map((item, index) => {
            return <View style={styles.dots}></View>;
          })}
        </View>
        <Image source={imagePath.radioLocation} />
      </>
    );
  };
  const getHeight = () => {
    if (showDropOfTwo && showDropOfThree) {
      return 160;
    } else if (showDropOfTwo || showDropOfThree) {
      return 110;
    } else {
      return 60;
    }
  };

  const addRemoveAddress = (type) => {
    Keyboard.dismiss();
    if (type == 'dropOffLocation') {
      updateState({
        // dropOffLocation: '',
        // dropOffLocationLatLng: false,
        // dropOffLocationFocus: false,
        showDropOfTwo: true,
        savedAddressViewHeight: savedAddressViewHeight + 1,
      });
    }
    if (type == 'dropOffLocationTwo') {
      updateState({
        dropOffLocationTwo: '',
        dropOffLocationTwoLatLng: false,
        dropOffLocationTwoFocus: false,
        showDropOfTwo: false,
        savedAddressViewHeight: savedAddressViewHeight - 1,
      });
    }
    if (type == 'dropOffLocationThree') {
      updateState({
        dropOffLocationThree: '',
        dropOffLocationThreeLatLng: false,
        dropOffLocationThreeFocus: false,
        savedAddressViewHeight: savedAddressViewHeight - 1,
      });
    }
  };

  const getImageAndFunctionality = (type) => {
    if (
      type == 'dropOffLocation' &&
      dropOffLocation != '' &&
      dropOffLocationLatLng
    ) {
      if (showDropOfTwo) {
      } else {
        return imagePath.ic_add;
      }
    } else if (
      type == 'dropOffLocationTwo' &&
      dropOffLocationTwo != '' &&
      dropOffLocationTwoLatLng
    ) {
      return imagePath.ic_cross;
    } else if (
      type == 'dropOffLocationThree' &&
      dropOffLocationThree != '' &&
      dropOffLocationThreeLatLng
    ) {
      return imagePath.ic_cross;
    } else if (type == 'dropOffLocation') {
      // return imagePath.plus;
      if (showDropOfTwo) {
      } else {
        return imagePath.ic_add;
      }
    } else if (type == 'dropOffLocationTwo') {
      return imagePath.ic_cross;
    }
    // else if (type == 'dropOffLocationThree') {
    //   return imagePath.crossB;
    // }
  };

  const renderCross = (type) => {
    return (
      <>
        <View style={{height: moderateScale(5)}} />
        <TouchableOpacity
          onPress={() => addRemoveAddress(type)}
          style={{
            height: moderateScale(48),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={
              isDarkMode
                ? {
                    height: 25,
                    width: 25,
                    tintColor: MyDarkTheme.colors.text,
                  }
                : {height: 25, width: 25, tintColor: colors.blackB}
            }
            source={getImageAndFunctionality(type)}
          />
        </TouchableOpacity>
      </>
    );
  };

  const saveAddressAndRedirect = () => {
    if (!pickUpLocationLatLng) {
      showError(strings.PLEASE_SELECT_PICKUP_LOCATION);
    } else if (!dropOffLocationLatLng && !dropOffLocationTwoLatLng) {
      showError(strings.PLEASE_SELECT_DROP_OFF_LOCATION);
    } else {
      let location = [];
      let addressData = [];
      location.push(pickUpLocationLatLng);
      addressData.push(pickUpLocationAddressData);
      if (dropOffLocationLatLng) {
        location.push(dropOffLocationLatLng);
        addressData.push(dropOffLocationAddressData);
      }
      if (dropOffLocationTwoLatLng) {
        location.push(dropOffLocationTwoLatLng);
        addressData.push(dropOffLocationTwoAddressData);
      }

      navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIME, {
        location: location,
        id: paramData?.data?.id,
        tasks: addressData,
        cabVendors: pickUpVendors,
      });
    }
  };

  const _redirectToMapScreen = (type, addressType) => {
    navigation.navigate(navigationStrings.SETLOACTIONMAP, {
      type: type,
      addressType: addressType,
    });
  };

  //All Saved address

  const selectAddress = (address) => {
    if (pickUpLocationFocus) {
      updateTheAddress(address, 'pickup', 'pickUpLocation');
    }
    if (dropOffLocationFocus) {
      updateTheAddress(address, 'dropoff', 'dropOffLocation');
    }
    if (dropOffLocationTwoFocus) {
      updateTheAddress(address, 'dropoff', 'dropOffLocationTwo');
    }
  };

  //address view tab
  const addressView = () => {
    return (
      allSavedAddress &&
      allSavedAddress.map((itm, inx) => {
        return (
          <ScrollView
            horizontal
            keyboardShouldPersistTaps={'handled'}
            showsHorizontalScrollIndicator={false}
            style={{width: width}}>
            <TouchableOpacity
              key={inx}
              style={{
                marginTop: moderateScaleVertical(10),
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                marginHorizontal: moderateScale(10),
              }}
              onPress={() => selectAddress(itm)}>
              <View>
                <Image source={imagePath.locationCourier} />
              </View>
              <View style={{marginHorizontal: moderateScale(10)}}>
                <Text numberOfLines={2} style={[styles.address]}>
                  {itm?.address}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        );
      })
    );
  };
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}>
      {/* <Header
        leftIcon={imagePath.backArrowCourier}
        // centerTitle={strings.WHERETOPICKUP}
        // rightIcon={imagePath.cartShop}
        headerStyle={{
          backgroundColor: colors.white,
          marginVertical: moderateScaleVertical(-10),
        }}
      /> */}

      <Header
        leftIcon={imagePath.backArrowCourier}
        centerTitle={strings.WHERETOPICKUP}
        // rightIcon={imagePath.cartShop}
        headerStyle={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          marginVertical: moderateScaleVertical(10),
        }}
      />

      <View style={{flex: 1}}>
        <View
          onLayout={(event) => {
            updateState({viewHeight: event.nativeEvent.layout.height});
          }}
          style={{
            flex: 1,
            flexDirection: 'row',
            // backgroundColor:'red'
            // alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0.15,

              alignItems: 'center',
              marginVertical: moderateScaleVertical(30),
              // justifyContent: 'center',
            }}>
            <View
              style={{
                flex: 0.3,
                zIndex: -1000,
                // height: getHeight(),
              }}>
              <Image source={imagePath.radioLocation} />
              {renderDotContainer()}
              {showDropOfTwo ? renderDotContainer() : null}
              {/* {showDropOfThree ? renderDotContainer() : null} */}
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
              zIndex: -1000,
              paddingVertical: 10,
            }}>
            <View
              style={{
                height: 48,
                alignItems: 'center',
              }}>
              <GooglePlaceInput
                autoFocus={pickUpLocationFocus}
                getDefaultValue={pickUpLocation}
                type={'Pickup'}
                navigation={navigation}
                addressType={'pickup'}
                placeholder={strings.PICKUPADDRESS}
                googleApiKey={profile?.preferences?.map_key}
                textInputContainer={styles.textGoogleInputContainerAddress}
                listView={
                  stylesFun({
                    fontFamily,
                    themeColors,
                    viewHeight: viewHeight,
                    type: 'pickup',
                  }).listView
                }
                onFocus={() => updateState({pickUpLocationFocus: true})}
                textInput={styles.textInput2}
                addressHelper={(results) => addressHelper(results)}
                handleAddressOnKeyUp={(text) =>
                  handleAddressOnKeyUp(text, 'pickUpLocation')
                }
                onBlur={() => {
                  if (pickUpLocation == '') {
                    updateState({
                      pickUpLocation: '',
                      pickUpLocationLatLng: false,
                      pickUpLocationFocus: false,
                    });
                  } else {
                    updateState({
                      pickUpLocationFocus: false,
                    });
                  }
                }}
                showList={true}
                showListOutside={(results, dataSource) =>
                  showListOutside(results, 'pickUpLocation', dataSource)
                }
                rowStyle={styles.address}
                renderCustomRow={(itm) => _rendorCustomRow(itm)}
                updateTheAddress={(details, addressType) =>
                  updateTheAddress(details, addressType, 'pickUpLocation')
                }
                ListHeaderComponent={() =>
                  _renderBottomComponent('pickUpLocation', 'pickup')
                }
              />
            </View>
            <View style={{height: 5}}></View>
            <View style={{height: 48, alignItems: 'center'}}>
              <GooglePlaceInput
                autoFocus={dropOffLocationFocus}
                getDefaultValue={dropOffLocation}
                type={'Pickup'}
                navigation={navigation}
                addressType={'dropoff'}
                placeholder={strings.DROPOFFADDRESS}
                googleApiKey={profile?.preferences?.map_key}
                textInputContainer={styles.textGoogleInputContainerAddress}
                listView={styles.listView}
                listView={
                  stylesFun({
                    fontFamily,
                    themeColors,
                    viewHeight: viewHeight,
                    type: 'dropOffLocation',
                  }).listView
                }
                onFocus={() => updateState({dropOffLocationFocus: true})}
                onBlur={() => {
                  if (dropOffLocation == '') {
                    updateState({
                      dropOffLocation: '',
                      dropOffLocationLatLng: false,
                      dropOffLocationFocus: false,
                    });
                  }
                }}
                textInput={styles.textInput2}
                addressHelper={(results) => addressHelper(results)}
                handleAddressOnKeyUp={(text) =>
                  handleAddressOnKeyUp(text, 'dropOffLocation')
                }
                showList={true}
                showListOutside={(results, dataSource) =>
                  showListOutside(results, 'dropOffLocation', dataSource)
                }
                rowStyle={styles.address}
                renderCustomRow={(itm) => _rendorCustomRow(itm)}
                updateTheAddress={(details, addressType) =>
                  updateTheAddress(details, addressType, 'dropOffLocation')
                }
                ListHeaderComponent={() =>
                  _renderBottomComponent('dropOffLocation', 'dropoff')
                }
              />
            </View>

            {showDropOfTwo ? (
              <>
                <View style={{height: 5}}></View>
                <View style={{height: 48, alignItems: 'center'}}>
                  <GooglePlaceInput
                    autoFocus={dropOffLocationTwoFocus}
                    getDefaultValue={dropOffLocationTwo}
                    type={'Pickup'}
                    navigation={navigation}
                    addressType={'dropoff'}
                    placeholder={strings.DROPOFFADDRESS}
                    googleApiKey={profile?.preferences?.map_key}
                    textInputContainer={styles.textGoogleInputContainerAddress}
                    listView={
                      stylesFun({
                        fontFamily,
                        themeColors,
                        viewHeight: viewHeight,
                        type: 'dropOffLocationTwo',
                      }).listView
                    }
                    onFocus={() => updateState({dropOffLocationTwoFocus: true})}
                    onBlur={() => {
                      if (dropOffLocationTwo == '') {
                        updateState({
                          dropOffLocationTwo: '',
                          dropOffLocationTwoLatLng: false,
                          dropOffLocationTwoFocus: false,
                        });
                      }
                    }}
                    textInput={styles.textInput2}
                    addressHelper={(results) => addressHelper(results)}
                    handleAddressOnKeyUp={(text) =>
                      handleAddressOnKeyUp(text, 'dropOffLocationTwo')
                    }
                    showList={true}
                    showListOutside={(results, dataSource) =>
                      showListOutside(results, 'dropOffLocationTwo', dataSource)
                    }
                    rowStyle={styles.address}
                    renderCustomRow={(itm) => _rendorCustomRow(itm)}
                    updateTheAddress={(details, addressType) =>
                      updateTheAddress(
                        details,
                        addressType,
                        'dropOffLocationTwo',
                      )
                    }
                    ListHeaderComponent={() =>
                      _renderBottomComponent('dropOffLocationTwo', 'dropoff')
                    }
                  />
                </View>
              </>
            ) : null}
          </View>
          <View style={{flex: 0.1, zIndex: -1000, paddingVertical: 10}}>
            <View style={{height: moderateScale(48)}} />
            {renderCross('dropOffLocation')}
            {showDropOfTwo ? renderCross('dropOffLocationTwo') : null}
            {/* {showDropOfThree ? renderCross('dropOffLocationThree') : null} */}
          </View>
        </View>

        {/* <View style={{flex: 0.7, zIndex: -1000}}> */}
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          bounces={true}
          horizontal={false}
          scrollEnabled={false}
          style={[styles.modalMainViewContainer]}>
          <View
            style={
              Platform.OS === 'ios'
                ? [
                    styles.shadowStyle,
                    {
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                    },
                  ]
                : [
                    styles.shadowStyleAndroid,
                    {
                      backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                    },
                  ]
            }
          />
          {!!(allSavedAddress && allSavedAddress.length) ? (
            <>
              <View style={styles.savedAddressView}>
                <Text
                  numberOfLines={1}
                  style={
                    isDarkMode
                      ? [
                          styles.addresssLableName,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.addresssLableName
                  }>
                  {strings.SAVED_ADDRESS}
                </Text>
              </View>

              {addressView()}
            </>
          ) : (
            <View style={styles.savedAddressView}>
              <Text
                numberOfLines={1}
                style={
                  isDarkMode
                    ? [
                        styles.addresssLableName,
                        {color: MyDarkTheme.colors.text},
                      ]
                    : styles.addresssLableName
                }>
                {/* {strings.SAVED_ADDRESS} */}
              </Text>
            </View>
          )}
        </ScrollView>
        {/* </View> */}
      </View>

      <View
        style={{
          marginVertical: moderateScaleVertical(10),
          marginHorizontal: moderateScale(20),
          justifyContent: 'flex-end',
        }}>
        <GradientButton
          colorsArray={[themeColors.primary_color, themeColors.primary_color]}
          textStyle={{textTransform: 'none', fontSize: textScale(16)}}
          onPress={saveAddressAndRedirect}
          marginTop={moderateScaleVertical(10)}
          marginBottom={moderateScaleVertical(10)}
          btnText={strings.DONE}
        />
      </View>
    </WrapperContainer>
  );
}
