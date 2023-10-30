import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Image, Text, View, Platform, Keyboard} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInput from '../../Components/BorderTextInput';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {
  getAddressComponent,
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
} from '../../utils/helperFunctions';
import stylesFunc from './styles';
import commonStylesFunc from '../../styles/commonStyles';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import GooglePlaceInput from '../../Components/GooglePlaceInput';
import DatePicker from 'react-native-date-picker';
import DateAndTimeModal from './DateAndTimeModal';
import moment from 'moment';
export default function SendProduct({navigation, route}) {
  const paramData = route?.params;
  console.log(paramData, 'paramData');
  // const {themeColors, appStyle} = useSelector((state) => state?.initBoot);
  const {appData, allAddresss, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const {pickUpTimeType} = useSelector((state) => state?.home);

  const [state, setState] = useState({
    pickUpLocation: '',
    pickUpLocationFocus: false,
    pickUpLocationLatLng: null,
    pickUpLocationAddressData: null,
    dropOffLocation: '',
    dropOffLocationFocus: false,
    dropOffLocationLatLng: null,
    dropOffLocationAddressData: null,
    // slectedDate: 'Fri, 15 jan, 2021',
    // shipmentTime: '10 : 20 AM',
    slectedDate: moment(date).format('ll'),
    selectedTime: moment(date).format('LT'),
    slectedDateSave: moment(date).format('YYYY-MM-DD'),
    selectedTimeSave: moment(date).format('HH:mm'),
    message: '',
    packingSize: [
      {
        id: 1,
        size: '30 x 30 x 30 cm',
        packageName: 'Small',
        icon: imagePath.ic_package2,
      },
      {
        id: 2,
        size: '60 x 60 x 60 cm',
        packageName: 'Medium',
        icon: imagePath.ic_package3,
      },
      {
        id: 3,
        size: '90 x 90 x 90 cm',
        packageName: 'Large',
        icon: imagePath.ic_package4,
      },
    ],
    selectedPackage: null,
    pageNo: 1,
    limit: 5,
    availAblePackages: [],
    date: new Date(),
    showDateTimeModal: false,
    selectedAvailableTimeOption: null,
    openTimeAndDateOption: null,
    pickUpVendors: [],
  });
  const {
    pickUpLocation,
    pickUpLocationFocus,
    pickUpLocationLatLng,
    pickUpLocationAddressData,
    dropOffLocation,
    dropOffLocationFocus,
    dropOffLocationLatLng,
    dropOffLocationAddressData,
    slectedDate,
    selectedTime,
    slectedDateSave,
    selectedTimeSave,
    message,
    packingSize,
    selectedPackage,
    pageNo,
    limit,
    availAblePackages,
    date,
    showDateTimeModal,
    selectedAvailableTimeOption,
    openTimeAndDateOption,
    pickUpVendors,
  } = state;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});
  const {profile} = appData;
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  useFocusEffect(
    React.useCallback(() => {
      //get all pick up vendors
      getAllPickUpVendors();
    }, [pageNo]),
  );

  const getAllPickUpVendors = () => {
    actions
      .getDataByCategoryId(
        `/${paramData?.data?.id}?limit=${limit}&page=${pageNo}`,
        {},
        {code: appData?.profile?.code},
      )
      .then((res) => {
        console.log(res, 'availAblePackages res>>>>>');
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

  //Get list of all services api
  const _getAllCarAndPrices = () => {
    updateState({isLoading: true, showVendorModal: false, showCarModal: true});
    actions
      .getAllCarAndPrices(
        `/${selectedVendorOption?.id}?page=${pageNo}&limit=${limit}`,
        {locations: paramData?.location},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'res>>>');
        updateState({
          loyalityAmount: res?.data?.loyalty_amount_saved
            ? Number(res?.data?.loyalty_amount_saved).toFixed(
                appData?.profile?.preferences?.digit_after_decimal,
              )
            : 0,
          availableCarList:
            pageNo == 1
              ? res?.data?.products?.data
              : [...availableCarList, ...res?.data?.products?.data],
          selectedCarOption: selectedCarOption
            ? selectedCarOption
            : res?.data?.products?.data[0],
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };

  //Error method handling
  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  // on change text
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const openDateAndTimeModal = (key, type) => () => {
    // alert('In Progress');
    updateState({showDateTimeModal: true, openTimeAndDateOption: type});
  };

  const continuePress = () => {
    moveToNewScreen(navigationStrings.SHIPPING_DETAILS, {})();
  };

  const selectPackageHandler = (data) => {
    updateState({selectedPackage: data});
  };

  //upadte box style on click
  const getAndCheckStyle = (item) => {
    if (selectedPackage && selectedPackage.id == item.id) {
      return {
        backgroundColor: colors.white,
        borderColor: themeColors.primary_color,
      };
    } else {
      return {
        backgroundColor: 'transparent',
        borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      };
    }
  };

  /*************************** On Text Change
   */ const addressHelper = (results) => {
    let clonedArrayData = {...state};
    clonedArrayData = {...clonedArrayData, ...results, showDialogBox: false};
    updateState(clonedArrayData);
  };

  const handleAddressOnKeyUp = (text, type) => {
    console.log(text, type, 'dhuhgjdfghj');
    // updateState({address: text});
    updateState({[type]: text});
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

  const _onDateChange = (date) => {
    if (openTimeAndDateOption == 'date') {
      updateState({
        slectedDate: moment(date).format('ll'),
        slectedDateSave: moment(date).format('YYYY-MM-DD'),
        date: date,
      });
    }
    if (openTimeAndDateOption == 'time') {
      updateState({
        selectedTime: moment(date).format('LT'),
        selectedTimeSave: moment(date).format('HH:mm'),
        date: date,
      });
    }
  };

  const _selectTime = () => {
    console.log('here');
    updateState({showDateTimeModal: false});
  };

  const saveAddressAndRedirect = () => {
    if (!pickUpLocationLatLng) {
      showError(strings.PLEASE_SELECT_PICKUP_LOCATION);
    } else if (!dropOffLocationLatLng && !dropOffLocationTwoLatLng) {
      showError(strings.PLEASE_SELECT_DROP_LOCATION);
    } else {
      let location = [];
      let addressData = [];
      location.push(pickUpLocationLatLng);
      addressData.push(pickUpLocationAddressData);
      if (dropOffLocationLatLng) {
        location.push(dropOffLocationLatLng);
        addressData.push(dropOffLocationAddressData);
      }
      // if (dropOffLocationTwoLatLng) {
      //   location.push(dropOffLocationTwoLatLng);
      //   addressData.push(dropOffLocationTwoAddressData);
      // }

      navigation.navigate(navigationStrings.SHIPPING_DETAILS, {
        location: location,
        id: paramData?.data?.id,
        tasks: addressData,
        cabVendors: pickUpVendors,
        selectedDateAndTime: `${slectedDateSave} ${selectedTimeSave}`,
        pickUpTimeType: pickUpTimeType,
      });
    }
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}>
      <Header
        leftIcon={imagePath.back}
        centerTitle={strings.SENT_ITEMS}
        headerStyle={{backgroundColor: colors.backgroundGrey}}
      />

      <View style={{...commonStyles.headerTopLine}} />

      <View
        style={{
          marginHorizontal: moderateScaleVertical(20),
          marginTop: moderateScale(20),
          flex: 1,
        }}>
        {/* google input one */}
        <View
          style={
            Platform.OS == 'android'
              ? {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                }
              : {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                }
          }>
          <View style={{marginBottom: 5}}>
            <Text style={styles.labelStyle}>{strings.FROM}</Text>
          </View>
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
              stylesFunc({
                fontFamily,
                themeColors,
                viewHeight: 0,
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
            rowStyle={styles.address}
            updateTheAddress={(details, addressType) =>
              updateTheAddress(details, addressType, 'pickUpLocation')
            }
          />
        </View>

        {/* google input two */}
        <View
          style={{
            position: 'absolute',
            top: 100,
            left: 0,
            right: 0,
            // zIndex: 1000,
          }}>
          <View style={{marginBottom: 5}}>
            <Text style={styles.labelStyle}>{strings.TO}</Text>
          </View>
          <GooglePlaceInput
            autoFocus={dropOffLocationFocus}
            getDefaultValue={dropOffLocation}
            type={'Pickup'}
            navigation={navigation}
            addressType={'dropoff'}
            placeholder={strings.DROPOFFADDRESS}
            googleApiKey={profile?.preferences?.map_key}
            textInputContainer={styles.textGoogleInputContainerAddress}
            listView={
              stylesFunc({
                fontFamily,
                themeColors,
                viewHeight: 0,
                type: 'dropOffLocation',
              }).listView
            }
            onFocus={() => updateState({dropOffLocationFocus: true})}
            textInput={styles.textInput2}
            addressHelper={(results) => addressHelper(results)}
            handleAddressOnKeyUp={(text) =>
              handleAddressOnKeyUp(text, 'dropOffLocation')
            }
            onBlur={() => {
              if (dropOffLocation == '') {
                updateState({
                  dropOffLocation: '',
                  dropOffLocationLatLng: false,
                  dropOffLocationFocus: false,
                });
              } else {
                updateState({
                  dropOffLocationFocus: false,
                });
              }
            }}
            rowStyle={styles.address}
            updateTheAddress={(details, addressType) =>
              updateTheAddress(details, addressType, 'dropOffLocation')
            }
          />
        </View>
      </View>

      <View
        style={{
          marginTop: 200,
          // position: 'absolute',
          // top: 175,
          // left: 0,
          // right: 0,
          zIndex: -2000,
          marginHorizontal: moderateScale(20),
        }}>
        <View style={styles.productInfoView}>
          <View style={[styles.lineStyle, {marginRight: 10}]} />
          <View>
            <Text style={styles.productInfo}>
              {strings.PRODUCT_INFORMATION}
            </Text>
          </View>
          <View style={[styles.lineStyle, {marginLeft: 10}]} />
        </View>

        <View style={{flexDirection: 'row', zIndex: -1000}}>
          <TouchableOpacity
            onPress={() => updateState({pickUpTimeType: 'now'})}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={
                  pickUpTimeType == 'now'
                    ? imagePath.radioActive
                    : imagePath.radioInActive
                }
              />
              <Text style={[styles.productInfoTwo, {paddingLeft: 5}]}>
                {strings.PICKUPNOW}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateState({pickUpTimeType: 'schedule'})}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
              }}>
              <Image
                source={
                  pickUpTimeType == 'schedule'
                    ? imagePath.radioActive
                    : imagePath.radioInActive
                }
              />
              <Text style={[styles.productInfoTwo, {paddingLeft: 5}]}>
                {strings.PICKUPLATER}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {pickUpTimeType == 'schedule' ? (
          <>
            <BorderTextInputWithLable
              label={strings.SHIPMENT_DATE}
              textViewOnly={true}
              value={slectedDate}
              disabled={false}
              mainStyle={{zIndex: -1000}}
              onPress={openDateAndTimeModal('slectedDate', 'date')}
              onPressRight={openDateAndTimeModal('slectedDate', 'date')}
              rightIcon={imagePath.ic_calendar}
              tintColor={colors.blackB}
            />

            <BorderTextInputWithLable
              label={strings.SHIPMENT_TIME}
              textViewOnly={true}
              value={selectedTime}
              disabled={false}
              mainStyle={{zIndex: -1000}}
              onPress={openDateAndTimeModal('selectedTime', 'time')}
              onPressRight={openDateAndTimeModal('selectedTime', 'time')}
              rightIcon={imagePath.time}
              tintColor={colors.blackB}
            />
          </>
        ) : (
          <View style={{height: 220}} />
        )}

        {/* <BorderTextInput
            onChangeText={_onChangeText('message')}
            placeholder={strings.MESSSAGE_FOR_US}
            value={message}
            containerStyle={{
              // zindex: 1000,
              height: moderateScaleVertical(108),
              padding: 5,
            }}
            mainStyle={{zIndex:-1000}}
            // textInputStyle={{height:moderateScaleVertical(108)}}
            textAlignVertical={'top'}
            multiline={true}
          /> */}
      </View>

      <View
        style={{
          marginHorizontal: moderateScaleVertical(20),
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          justifyContent: 'flex-end',
          zIndex: 1000,
        }}>
        <GradientButton
          textStyle={styles.textStyle}
          onPress={saveAddressAndRedirect}
          btnText={strings.CONTINUE}
        />
      </View>
      <View style={{alignItems: 'center', height: height / 3.5}}>
        <DateAndTimeModal
          date={date}
          openTimeAndDateOption={openTimeAndDateOption}
          isVisible={showDateTimeModal}
          onPressBack={() => updateState({showDateTimeModal: false})}
          _onDateChange={(date) => _onDateChange(date)}
          selectedAvailableTimeOption={selectedAvailableTimeOption}
          selectAvailAbleTime={(i) =>
            updateState({selectedAvailableTimeOption: i})
          }
          _selectTime={_selectTime}
          navigation={navigation}
        />
      </View>
    </WrapperContainer>
  );
}
