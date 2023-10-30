import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import WrapperContainer from '../../../Components/WrapperContainer';
import stylesFun from './styles';
import {useSelector} from 'react-redux';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT
} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeightSecond,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import colors from '../../../styles/colors';
import AutoUpLabelTxtInput from '../../../Components/AutoUpLabelTxtInput';
import {BlurView} from '@react-native-community/blur';
import {mapStyleGrey} from '../../../utils/constants/MapStyle';
import navigationStrings from '../../../navigation/navigationStrings';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';
import Geolocation from 'react-native-geolocation-service';
import {chekLocationPermission} from '../../../utils/permissions';
import {getCurrentLocation} from '../../../utils/helperFunctions';
import BottomViewModal from '../../../Components/BottomViewModal';
import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
import GradientButton from '../../../Components/GradientButton';
import {appIds} from '../../../utils/constants/DynamicAppKeys';
import DeviceInfo from 'react-native-device-info';

export default function HomeScreenTaxi({navigation, route}) {
  const mapRef = React.createRef();
  const paramData = route?.params;

  console.log('param data+++', paramData.pickUpLocationLatLng);

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    region: {
      latitude:
        parseFloat(paramData?.pickUpLocationLatLng?.latitude) || 30.7333,
      longitude:
        parseFloat(paramData?.pickUpLocationLatLng?.longitude) || 76.7794,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    coordinate: {
      latitude:
        parseFloat(paramData?.pickUpLocationLatLng?.latitude) || 30.7333,
      longitude:
        parseFloat(paramData?.pickUpLocationLatLng?.longitude) || 76.7794,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    },
    isLoading: false,
    details: {},
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',

    userCurrentLongitude: null,
    userCurrentLatitude: null,
    isVisible: false,
    task_type_id: null,
  });

  const {
    isLoading,
    addressLabel,

    formattedAddress,
    region,
    coordinate,
    userCurrentLongitude,
    userCurrentLatitude,
    isVisible,
    task_type_id,
    details,
  } = state;

  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const businessType = appStyle?.homePageLayout;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const userData = useSelector((state) => state.auth.userData);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const _onRegionChange = (region) => {
    updateState({region: region});
    _getAddressBasedOnCoordinates(region);
    // animate(region);
  };

  const _getAddressBasedOnCoordinates = (region) => {
    Geocoder.from({
      latitude: region.latitude,
      longitude: region.longitude,
    })
      .then((json) => {
        // console.log(json, 'json');
        updateState({
          formattedAddress: json.results[0].formatted_address,
        });
        let detail = {};
        detail = {
          formatted_address: json.results[0].formatted_address,
          geometry: {
            location: {
              lat: region.latitude,
              lng: region.longitude,
            },
          },
          address_components: json.results[0].address_components,
          place_id: json.results[0].place_id,
        };
        updateState({
          details: detail,
        });
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };

  console.log(details, 'detaildetaildetail');

  useEffect(() => {
    chekLocationPermission()
      .then((result) => {
        if (result !== 'goback') {
          getCurrentLocation('home')
            .then((res) => {
              Geolocation.getCurrentPosition(
                //Will give you the current location
                (position) => {
                  //getting the Longitude from the location json
                  const currentLongitude = JSON.stringify(
                    position.coords.longitude,
                  );

                  //getting the Latitude from the location json
                  const currentLatitude = JSON.stringify(
                    position.coords.latitude,
                  );
                  updateState({
                    userCurrentLongitude: currentLongitude,
                    userCurrentLatitude: currentLatitude,
                  });
                },
                (error) => alert(error.message),
                {
                  enableHighAccuracy: true,
                  timeout: 20000,
                  maximumAge: 1000,
                },
              );
            })
            .catch((err) => {});
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);

  //Animating the marker
  const animate = (region) => {
    const {coordinate} = state;
    const newCoordinate = {
      ...region,
    };
    if (Platform.OS === 'android') {
      if (markerRef.current) {
        markerRef.current._component.animateMarkerToCoordinate(
          newCoordinate,
          500,
        );
      }
      updateState({region: new AnimatedRegion(region)});
      _getAddressBasedOnCoordinates(region);
    } else {
      coordinate.timing(newCoordinate).start();
      updateState({region: new AnimatedRegion(region)});
      _getAddressBasedOnCoordinates(region);
    }
  };

  //On Dragging the marker
  const _onDragEnd = (e) => {
    console.log('onDragEnd', e.nativeEvent);
    updateState({
      coordinate: new AnimatedRegion({
        ...e.nativeEvent.coordinate,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }),
      region: {
        ...region,
        ...e.nativeEvent.coordinate,
      },
    });
    _getAddressBasedOnCoordinates({
      ...e.nativeEvent.coordinate,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    });
  };

  const _modeToNextScreen = () => {
    const {params} = route;
    const pickuplocationAllData = {
      longitude: details?.geometry?.location?.lng,
      latitude: details?.geometry?.location?.lat,
      address: details?.formatted_address,
      task_type_id: paramData?.task_id,
      pre_address: details?.formatted_address,
      place_id: details?.place_id,
    };

    console.log(pickuplocationAllData, 'pickuplocationAllData');
    if (params?.prevRoute === 'cart') {
      params?.onGoBack(pickuplocationAllData);
      navigation.goBack();
    } else {
      navigation.navigate(navigationStrings.ADDADDRESS, {
        prefillAdress: pickuplocationAllData,
      });
    }

    //   }
  };

  const markerRef = useRef();

  const currentLocationOnMap = () => {
    mapRef.current.animateToRegion({
      latitude: userCurrentLatitude,
      longitude: userCurrentLongitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <>
      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={styles.map}
        // region={region}
        initialRegion={region}
        // pointerEvents={'none'}
        onRegionChangeComplete={_onRegionChange}
      />
      {/* <Marker
          ref={markerRef}
          // pointerEvents={'none'}
          coordinate={coordinate}
          image={imagePath.mapPin2}
          // onDrag={(e) => _onDrag(e)}
          // onDragEnd={(e) => _onDragEnd(e)}
          // onPress={(e) => console.log('onPress', e)}
          // draggable
        /> */}

      <View style={[styles.backbutton, {marginHorizontal: moderateScale(15)}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              paddingHorizontal: moderateScale(15),
              paddingVertical: moderateScaleVertical(15),
            }}>
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
              source={imagePath.backArrow}
            />
          </View>
        </TouchableOpacity>
      </View>
      {/* {businessType === 4 ? null : (
        <View style={styles.userAccountImageStyle}>
          <Image source={imagePath.taxiUserAccount} />
        </View>
      )} */}
      <View
        style={{
          position: 'absolute',
          top: height / 2 - StatusBarHeightSecond,
          right: width / 2,
          left: width / 2,
          bottom: height / 2,
          alignItems: 'center',
          justifyContent: 'center',
          // marginTop: height / 2,
        }}>
        <Image
          source={imagePath.icLocationPin_}
          style={{tintColor: themeColors.primary_color}}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 30,
          width: width - 40,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            marginBottom: 40,
            textAlign: 'center',
            color: colors.black,
            fontFamily: fontFamily.medium,
          }}>
          {strings.PLACE_PIN_ON_MAP}
        </Text>
        <GradientButton
          btnText={strings.DONE}
          onPress={() => _modeToNextScreen()}
        />
      </View>
    </>
  );
}
