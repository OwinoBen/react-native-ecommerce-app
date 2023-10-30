import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {useSelector} from 'react-redux';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import CabAndOrderDetail from './CabAndOrderDetail';
import CabAndOrderDetailModal from '../CabAndOrderDetailModal';

import stylesFun from './styles';
import navigationStrings from '../../../navigation/navigationStrings';

export default function CabDriverLocationTrackAndDetail({navigation, route}) {
  const paramData = route?.params;
  console.log(paramData, 'paramData');
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const [state, setState] = useState({
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    coordinate: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    isLoading: true,

    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',

    selectedCarOption: paramData?.selectedCarOption
      ? paramData?.selectedCarOption
      : null,
    selectedAvailableTimeOption: null,
    showCarModal: true,
    showTimeModal: false,
    showPaymentModal: false,
    redirectFromNow: false,
    date: new Date(),
    slectedDate: 'Tommorow',
    selectedTime: '12:05 hrs',
    isModalVisible: false,
  });
  const {
    isModalVisible,
    isLoading,
    addressLabel,
    formattedAddress,
    region,
    coordinate,
    selectedCarOption,
    selectedAvailableTimeOption,
    showCarModal,
    showTimeModal,

    showPaymentModal,
    redirectFromNow,
    slectedDate,
    selectedTime,
    date,
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

  useEffect(() => {
    setTimeout(() => {
      updateState({isLoading: false});
    }, 2000);
  }, []);

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

  //Modal to select time

  //   const _selectPaymentView = () => {
  //     return (
  //       <SelectPaymentModalView
  //         _confirmAndPay={_confirmAndPay}
  //         slectedDate={slectedDate}
  //         isModalVisible={isModalVisible}
  //         selectedTime={selectedTime}
  //         navigation={navigation}
  //         date={date}
  //         onPressBack={() =>
  //           redirectFromNow
  //             ? updateState({showCarModal: true, showPaymentModal: false})
  //             : updateState({showTimeModal: true, showPaymentModal: false})
  //         }
  //       />
  //     );
  //   };

  const _cabAndOrderDetail = () => {
    return (
      <CabAndOrderDetail
        onPressCall={() => alert('No driver assigned yet')}
        onPressChat={() => alert('No driver assigned yet')}
        //   onPressBack={}
        paramData={paramData}
        selectedCarOption={selectedCarOption}
        navigation={navigation}
        _oPressTooltip={() => updateState({isModalVisible: true})}
      />
    );
  };

  const _updateState = () => {
    // navigationStrings.CABDRIVERLOCATIONANDDETAIL
    updateState({isModalVisible: false});
    // navigation.navigate(navigationStrings.CABDRIVERLOCATIONANDDETAIL,{})
  };

  return (
    <WrapperContainer bgColor={colors.white} statusBarColor={colors.white}>
      <View style={styles.container}>
        <MapView
          //   provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={region}
          initialRegion={region}
          //   customMapStyle={mapStyle}
          onRegionChangeComplete={_onRegionChange}></MapView>

        {/* Top View */}
        <View style={styles.topView}>
          <TouchableOpacity
            style={styles.backButtonView}
            onPress={
              () => navigation.navigate(navigationStrings.HOME)
              // navigation.goBack()
            }>
            <Image source={imagePath.backArrowCourier} />
          </TouchableOpacity>
        </View>

        {/* BottomView */}
        {_cabAndOrderDetail()}
      </View>
      <CabAndOrderDetailModal
        isModalVisible={isModalVisible}
        updateModalState={_updateState}
        closeModal={() => updateState({isModalVisible: false})}
      />
    </WrapperContainer>
  );
}
