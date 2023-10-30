import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, {Callout} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
import {useSelector} from 'react-redux';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {height, width} from '../../../styles/responsiveSize';
import {showError} from '../../../utils/helperFunctions';
import PaymentProcessingModal from '../PaymentProcessingModal';
import SelectCarModalView from './SelectCarModalView';
import SelectPaymentModalView from './SelectPaymentModalView';
import SelectTimeModalView from './SelectTimeModalView';
import SelectVendorModalView from './SelectVendorModalView';
import stylesFun from './styles';
import * as RNLocalize from 'react-native-localize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';
import strings from '../../../constants/lang';
import {isEmpty} from 'lodash';

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function ChooseCarTypeAndTime({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  console.log(paramData?.cabVendors[0], 'paramData>>>>>');
  const {appData, currencies, languages, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const {pickUpTimeType} = useSelector((state) => state?.home);

  const userData = useSelector((state) => state?.auth?.userData);

  const fontFamily = appStyle?.fontSizeData;
  const [state, setState] = useState({
    region: {
      latitude: paramData?.location[0]?.latitude
        ? Number(paramData?.location[0].latitude)
        : 30.7191,
      longitude: paramData?.location[0]?.longitude
        ? Number(paramData?.location[0].longitude)
        : 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    coordinate: {
      latitude: paramData?.location[0]?.latitude
        ? Number(paramData?.location[0].latitude)
        : 30.7191,
      longitude: paramData?.location[0]?.longitude
        ? Number(paramData?.location[0].longitude)
        : 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    isLoading: false,
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
    availableVendors: !isEmpty(paramData?.cabVendors)
      ? paramData?.cabVendors
      : [],
    availableCarList: [],
    availAbleTimes: [
      {
        id: 1,
        label: 'in 20 min.',
      },
      {
        id: 2,
        label: 'in 50 min.',
      },
      {
        id: 3,
        label: 'in 80 min.',
      },
    ],
    selectedCarOption: null,
    selectedAvailableTimeOption: null,
    showVendorModal: false,
    showCarModal: true,
    showTimeModal: false,
    showPaymentModal: false,
    redirectFromNow: false,
    date: new Date(),

    slectedDate: moment(date).format('YYYY-MM-DD'),
    selectedTime: moment(date).format('LT'),

    isModalVisible: false,
    selectedDateAndTime: `${moment().format('YYYY-MM-DD')} ${moment().format(
      'H:MM',
    )}`,
    selectedVendorOption: !isEmpty(paramData?.cabVendors)
      ? paramData?.cabVendors[0]
      : null,
    pageNo: 1,
    limit: 12,
    isLoadingB: false,
    totalDistance: 0,
    totalDuration: 0,
    updatedAmount: null,
    couponInfo: null,
    loyalityAmount: null,
  });
  const {
    couponInfo,
    updatedAmount,
    totalDistance,
    totalDuration,
    showVendorModal,
    selectedDateAndTime,
    isModalVisible,
    isLoading,
    addressLabel,
    formattedAddress,
    region,
    coordinate,
    availableCarList,
    selectedCarOption,
    selectedAvailableTimeOption,
    showCarModal,
    showTimeModal,
    availAbleTimes,
    showPaymentModal,
    redirectFromNow,
    slectedDate,
    selectedTime,
    selectedVendorOption,
    date,
    availableVendors,
    pageNo,
    limit,
    isLoadingB,
    loyalityAmount,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
  }, []);

  const _confirmAddress = (addressType) => {};
  const _onRegionChange = (region) => {
    updateState({region: region});
    _getAddressBasedOnCoordinates(region);
    // animate(region);
  };
  const mapRef = useRef();
  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useEffect(() => {
    !!selectedVendorOption && _getAllCarAndPrices();
  }, [selectedVendorOption]);

  useEffect(() => {
    updateState({
      updatedAmount: paramData?.promocodeDetail?.couponInfo?.new_amount,
      couponInfo: paramData?.promocodeDetail?.couponInfo,
    });
  }, [
    paramData?.promocodeDetail?.couponInfo,
    paramData?.promocodeDetail?.new_amount,
  ]);

  //Get list of all orders api
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
        console.log(res, 'res>>>>>>>>>>>>>>>>>>>>>>');
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

  //error handling of api
  const errorMethod = (error) => {
    console.log(error, 'error>>>');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  const _getAddressBasedOnCoordinates = (region) => {
    Geocoder.from({
      latitude: region.latitude,
      longitude: region.longitude,
    })
      .then((json) => {
        // console.log(json, 'json');
        var addressComponent = json.results[0].formatted_address;
        updateState({
          formattedAddress: addressComponent,
        });
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };

  const _selectTime = () => {
    console.log('here');
    updateState({showTimeModal: false, showPaymentModal: true});
  };

  const _finalPayment = (data) => {
    updateState({
      isLoading: true,
    });
    actions
      .placeDelievryOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, '_confirmAndPay res>>>');
        if (res && res?.status == 200) {
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
          });
          // navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL, {
          //   orderDetail: res?.data,
          //   selectedCarOption: selectedCarOption,
          // });
          navigation.navigate(navigationStrings.PICKUPORDERDETAIL, {
            orderId: res?.data?.id,
            fromVendorApp: true,
            selectedVendor: {id: selectedCarOption?.vendor_id},
            orderDetail: res?.data,
            fromCab: true,
          });
        } else {
          updateState({
            isModalVisible: false,
            isLoading: false,
            isRefreshing: false,
          });
          showError(res?.message || res?.error);
        }
      })
      .catch(errorMethod);
  };
  //Modal to select time

  const _confirmAndPay = () => {
    console.log(selectedCarOption, 'selectedCarOption');
    let data = {};

    data['task_type'] = pickUpTimeType ? pickUpTimeType : '';
    data['schedule_time'] = pickUpTimeType == 'now' ? '' : selectedDateAndTime;
    data['recipient_phone'] = '';
    data['recipient_email'] = '';
    data['task_description'] = '';
    // data['amount'] =
    //   couponInfo && updatedAmount
    //     ? updatedAmount
    //     : selectedCarOption?.tags_price;
    data['amount'] = selectedCarOption?.tags_price;
    data['payment_method'] = 1;
    data['vendor_id'] = selectedCarOption?.vendor_id;
    data['product_id'] = selectedCarOption?.id;
    data['currency_id'] = currencies?.primary_currency?.id;
    data['tasks'] = paramData?.tasks;
    if (couponInfo) {
      data['coupon_id'] = couponInfo?.id;
    }
    data['order_time_zone'] = RNLocalize.getTimeZone();
    console.log(data, 'data>>>');

    if (
      !!(
        !!userData?.client_preference?.verify_email &&
        !userData?.verify_details?.is_email_verified
      ) ||
      !!(
        !!userData?.client_preference?.verify_phone &&
        !userData?.verify_details?.is_phone_verified
      )
    ) {
      moveToNewScreen(navigationStrings.VERIFY_ACCOUNT_COURIER, {
        ...userData,
        fromCart: true,
      })();
    } else {
      _finalPayment(data);
    }
  };

  const _selectTimeView = () => {
    return (
      <SelectTimeModalView
        date={date}
        onPressBack={() =>
          updateState({showTimeModal: false, showCarModal: true})
        }
        _onDateChange={(date) => _onDateChange(date)}
        availAbleTimes={availAbleTimes}
        selectedAvailableTimeOption={selectedAvailableTimeOption}
        selectAvailAbleTime={(i) =>
          updateState({selectedAvailableTimeOption: i})
        }
        _selectTime={_selectTime}
        navigation={navigation}
      />
    );
  };

  //Select Car vendor
  const _selectVendorModalView = () => {
    return (
      <SelectVendorModalView
        onPressAvailableVendor={(item) =>
          updateState({selectedVendorOption: item})
        }
        selectedVendorOption={selectedVendorOption}
        _select={() => {
          selectedVendorOption
            ? _getAllCarAndPrices()
            : showError(strings.PLEASE_SELECT_OPTION);
        }}
        // isLoading={isLoading}
        availableVendors={availableVendors}
        navigation={navigation}
      />
    );
  };

  const onPressAvailableVendor = (item) => {
    updateState({
      isLoading: true,
      availableCarList: [],
      pageNo: 1,
      selectedVendorOption: item,
    });
  };
  //Modal to select car
  const _selectCarModalView = () => {
    return (
      <SelectCarModalView
        onPressAvailableCar={(item) => updateState({selectedCarOption: item})}
        selectedCarOption={selectedCarOption}
        onPressPickUpNow={() => {
          actions.saveSchduleTime('now');
          selectedCarOption
            ? updateState({
                showPaymentModal: true,
                redirectFromNow: true,
                showCarModal: false,
              })
            : showError(strings.PLEASE_SELECT_CAR);
        }}
        isLoading={isLoading}
        onPressPickUplater={() => {
          actions.saveSchduleTime('schedule');
          selectedCarOption
            ? updateState({
                showTimeModal: true,
                redirectFromNow: false,
                showCarModal: false,
              })
            : showError(strings.PLEASE_SELECT_CAR);
        }}
        availableCarList={availableCarList}
        onPressAvailableVendor={(item) => onPressAvailableVendor(item)}
        selectedVendorOption={selectedVendorOption}
        _select={() => {
          selectedVendorOption
            ? _getAllCarAndPrices()
            : showError(strings.PLEASE_SELECT_OPTION);
        }}
        // isLoading={isLoading}
        availableVendors={availableVendors}
        navigation={navigation}
      />
    );
  };

  const _selectPaymentView = () => {
    return (
      <SelectPaymentModalView
        _confirmAndPay={_confirmAndPay}
        slectedDate={slectedDate}
        isModalVisible={isModalVisible}
        selectedTime={selectedTime}
        date={date}
        onPressBack={() =>
          redirectFromNow
            ? updateState({showCarModal: true, showPaymentModal: false})
            : updateState({showTimeModal: true, showPaymentModal: false})
        }
        totalDistance={totalDistance}
        totalDuration={totalDuration}
        selectedCarOption={selectedCarOption}
        navigation={navigation}
        couponInfo={couponInfo}
        updatedPrice={updatedAmount}
        loyalityAmount={loyalityAmount}
        removeCoupon={() => removeCoupon()}
      />
    );
  };

  const removeCoupon = () => {
    updateState({
      updatedAmount: null,
      couponInfo: null,
    });
  };

  const _onDateChange = (date) => {
    // alert(213);
    console.log(date, 'date');
    let time = moment(date).format('HH:mm');
    let dateSelectd = moment(date).format('YYYY-MM-DD');

    console.log(time, 'time');
    console.log(dateSelectd, 'dateSelectd');
    updateState({
      selectedDateAndTime: `${dateSelectd} ${time}`,
      slectedDate: dateSelectd,
      selectedTime: moment(date).format('LT'),
      date: date,
    });
  };

  const _updateState = () => {
    // navigationStrings.CABDRIVERLOCATIONANDDETAIL
    updateState({isModalVisible: false});
    navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL, {});
  };

  const onMapPress = (e) => {
    updateState({
      locations: [...locations, e.nativeEvent.coordinate],
    });
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <View style={styles.container}>
        <MapView
          //   provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={region}
          initialRegion={region}
          //   customMapStyle={mapStyle}
          ref={mapRef}
          // liteMode={true}
          tracksViewChanges={false}
          // onPress={onMapPress}
          onRegionChangeComplete={_onRegionChange}>
          {/* <Marker
            coordinate={paramData?.location[0]}
            image={imagePath.radioLocation}>
            <Callout style={styles.plainView}>
              <View>
                <Text style={styles.pickupDropOff}>{'Pick up'}</Text>
                <Text numberOfLines={1} style={styles.pickupDropOffAddress}>{paramData?.tasks[0]?.address}</Text>
              </View>
            </Callout>
          </Marker>
          <Marker
            coordinate={paramData?.location[paramData?.location.length - 1]}
            image={imagePath.radioLocation}>
            <Callout  style={styles.plainView}>
              <View>
              <Text style={styles.pickupDropOff}>{'Drop off'}</Text>
              <Text numberOfLines={1} style={styles.pickupDropOffAddress}>{paramData?.tasks[paramData?.tasks.length-1]?.address}</Text>
              </View>
            </Callout>
          </Marker> */}

          {paramData?.tasks.map((coordinate, index) => (
            <MapView.Marker
              tracksViewChanges={false}
              zIndex={index}
              key={`coordinate_${index}`}
              image={imagePath.radioLocation}
              coordinate={{
                latitude: Number(coordinate?.latitude),
                longitude: Number(coordinate?.longitude),
              }}>
              <Callout style={styles.plainView}>
                <View>
                  <Text style={styles.pickupDropOff}>
                    {index == 0 ? 'Pick up' : 'Drop off'}
                  </Text>
                  <Text numberOfLines={1} style={styles.pickupDropOffAddress}>
                    {coordinate?.address}
                  </Text>
                </View>
              </Callout>
            </MapView.Marker>
          ))}

          <MapViewDirections
            origin={paramData?.location[0]}
            waypoints={
              paramData?.location.length > 2
                ? paramData?.location.slice(1, -1)
                : []
            }
            destination={paramData?.location[paramData?.location.length - 1]}
            apikey={profile?.preferences?.map_key}
            strokeWidth={3}
            strokeColor={themeColors.primary_color}
            optimizeWaypoints={true}
            onStart={(params) => {
              // console.log(Started routing between "${params.origin}" and "${params.destination}");
            }}
            precision={'high'}
            timePrecision={'now'}
            mode={'DRIVING'}
            // maxZoomLevel={20}
            onReady={(result) => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
              updateState({
                totalDistance: result.distance.toFixed(2),
                totalDuration: result.duration.toFixed(2),
              });
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: width / 20,
                  bottom: height / 20,
                  left: width / 20,
                  top: height / 20,
                },
              });
            }}
            onError={(errorMessage) => {
              // console.log('GOT AN ERROR');
            }}
          />
        </MapView>

        {/* Top View */}
        <View style={styles.topView}>
          <TouchableOpacity
            style={styles.backButtonView}
            onPress={() =>
              // navigation.navigate(navigationStrings.PICKUPLOCATION)
              navigation.goBack()
            }>
            <Image source={imagePath.backArrowCourier} />
          </TouchableOpacity>
        </View>

        {/* BottomView */}
        {/* {!!showVendorModal && _selectVendorModalView()} */}
        {!!showCarModal && _selectCarModalView()}
        {!!showTimeModal && _selectTimeView()}
        {!!showPaymentModal && _selectPaymentView()}
      </View>
      <PaymentProcessingModal
        isModalVisible={isModalVisible}
        updateModalState={_updateState}
      />
    </WrapperContainer>
  );
}
