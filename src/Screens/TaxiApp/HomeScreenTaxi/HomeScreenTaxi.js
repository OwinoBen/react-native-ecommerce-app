import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import WrapperContainer from '../../../Components/WrapperContainer';
import stylesFun from './styles';
import { useSelector } from 'react-redux';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
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
import { BlurView } from '@react-native-community/blur';
import { mapStyleGrey } from '../../../utils/constants/MapStyle';
import navigationStrings from '../../../navigation/navigationStrings';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../../styles/theme';
import Geolocation from 'react-native-geolocation-service';
import { chekLocationPermission } from '../../../utils/permissions';
import { getCurrentLocation } from '../../../utils/helperFunctions';
import BottomViewModal from '../../../Components/BottomViewModal';
import HomeCategoryCard2 from '../../../Components/HomeCategoryCard2';
// import {appIds} from '../../../utils/constants/DynamicAppKeys';

import { enableFreeze } from "react-native-screens";
enableFreeze(true);

import DeviceInfo from 'react-native-device-info';
import { appIds } from '../../../utils/constants/DynamicAppKeys';

export default function HomeScreenTaxi({ navigation, route }) {
  const mapRef = React.createRef();
  const paramData = route?.params;

  console.log(paramData, 'paramData>paramData>paramData');
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
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
    isLoading: false,
    details: {},
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
    locationListData: [
      { id: 1, location: 'ISBT,Sector43' },
      { id: 1, location: 'Shukna Lake' },
      { id: 1, location: 'Green View Tower' },
      { id: 1, location: 'Sector 28' },
    ],
    userCurrentLongitude: null,
    userCurrentLatitude: null,
    isVisible: false,
  });

  const {
    isLoading,
    addressLabel,
    details,
    formattedAddress,
    region,
    coordinate,
    locationListData,
    userCurrentLongitude,
    userCurrentLatitude,
    isVisible,
  } = state;

  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const businessType = appStyle?.homePageLayout;
  const appMainData = useSelector((state) => state?.home?.appMainData);
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const userData = useSelector((state) => state.auth.userData);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });

  const _onRegionChange = (region) => {
    updateState({ region: region });
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
        };
        updateState({
          details: detail,
        });
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };

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
                    userCurrentLongitude: parseFloat(currentLongitude),
                    userCurrentLatitude: parseFloat(currentLatitude),
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
            .catch((err) => { });
        }
      })
      .catch((error) => console.log('error while accessing location', error));
  }, []);

  //Animating the marker
  const animate = (region) => {
    const { coordinate } = state;
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
      updateState({ region: new AnimatedRegion(region) });
      _getAddressBasedOnCoordinates(region);
    } else {
      coordinate.timing(newCoordinate).start();
      updateState({ region: new AnimatedRegion(region) });
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

  const _onDrag = (e) => { };

  //   const _confirmAddress = () => {
  //     // navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIME);
  //     navigation.navigate(navigationStrings.MULTISELECTCATEGORY, {
  //       details: details,
  //       type: paramData?.type,
  //       addressType: paramData?.addressType,
  //     });
  //   };

  const moveToNewScreen =
    (screenName, data = { paramData }) =>
      () => {
        {
          data;
        }
        {
          userData?.auth_token
            ? navigation.navigate(screenName, paramData)
            : actions.setAppSessionData('on_login');
        }
      };

  const _modalClose = () => {
    updateState({
      isVisible: false,
    });
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

  const renderDotContainer = () => {
    return (
      <>
        <View style={{ marginLeft: moderateScale(7) }}>
          {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
            return (
              <View
                style={[
                  styles.dots,
                  {
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                  },
                ]}></View>
            );
          })}
        </View>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: -5 }}>
          <Image
            style={{
              tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
            source={imagePath.icLocation1}
          />
          <View
            style={{
              flexDirection: 'column',
              marginLeft: moderateScale(15),
            }}></View>
        </View>
      </>
    );
  };

  const _renderBottomComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderTopStartRadius: 24,
          borderTopRightRadius: 24,
          flex: 1,
        }}>
        <View
          style={{
            height: height / 3.2,
            borderTopLeftRadius: moderateScale(30),
            borderTopRightRadius: moderateScale(30),
            width: width,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          {/* <BlurView
            reducedTransparencyFallbackColor="white"
            style={styles.absolute}
            blurType={Platform.OS === 'ios' ? 'xlight' : 'light'}
            blurAmount={80}
          /> */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom:
                Platform.OS === 'ios'
                  ? moderateScaleVertical(50)
                  : moderateScaleVertical(80),
            }}>
            <View
              style={{
                alignItems: 'flex-start',
                paddingHorizontal: moderateScale(35),
                flexDirection: 'column',
              }}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      marginVertical: moderateScaleVertical(40),
                    }}>
                    <View>
                      <Image source={imagePath.icRedOval} />
                    </View>
                    <View>{renderDotContainer()}</View>
                  </View>

                  <View
                    style={{
                      marginStart: moderateScale(15),
                      width: moderateScale(width / 1.5),
                      flexDirection: 'column',
                    }}>
                    <View
                      style={{
                        marginTop: moderateScaleVertical(40),
                        flexDirection: 'column',
                      }}>
                      <Text style={{ color: colors.textGreyLight }}>
                        {strings.PICKUP_LOCATION2}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          moveToNewScreen(navigationStrings.ADDADDRESS)()
                        }>
                        <Text
                          style={{
                            marginVertical: moderateScaleVertical(10),
                            color: isDarkMode
                              ? MyDarkTheme.colors.text
                              : colors.black,
                            fontFamily: fontFamily.semiBold,
                          }}>
                          {strings.PICKUP_LOCATION}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          height: 0.5,
                          backgroundColor: colors.textGreyLight,
                          marginTop: moderateScaleVertical(5),
                        }}
                      />
                    </View>
                    <View
                      style={{
                        marginTop: moderateScaleVertical(20),
                        flexDirection: 'column',
                      }}>
                      <Text style={{ color: colors.textGreyLight }}>
                        {strings.DROP_OFF}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          moveToNewScreen(navigationStrings.ADDADDRESS)()
                        }>
                        <Text
                          style={{
                            marginVertical: moderateScaleVertical(10),
                            color: isDarkMode
                              ? MyDarkTheme.colors.text
                              : colors.black,
                            fontFamily: fontFamily.semiBold,
                          }}>
                          {strings.DROPOFFLOCATION}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          height: 0.5,
                          backgroundColor: colors.textGreyLight,
                          marginTop: moderateScaleVertical(5),
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              {/* <BottomViewModal
                show={isVisible}
                mainContainView={_ModalMainView}
                closeModal={_modalClose}
              /> */}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };


  return (
    <>
      {userCurrentLatitude && (
        <MapView
          ref={mapRef}
          //provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: userCurrentLatitude,
            longitude: userCurrentLongitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          initialRegion={region}
          customMapStyle={
            appIds.cabway == DeviceInfo.getBundleId() ? null : mapStyleGrey
          }
          // pointerEvents={'none'}
          onRegionChangeComplete={_onRegionChange}>
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
        </MapView>
      )}

      <View style={[styles.backbutton, { marginHorizontal: moderateScale(15) }]}>
        {businessType === 4 ? null : (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                paddingHorizontal: moderateScale(15),
                paddingVertical: moderateScaleVertical(15),
                borderRadius: 15,
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : colors.greyColor,
              }}>
              <Image
                style={{
                  tintColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.black,
                }}
                source={imagePath.backArrow}
              />
            </View>
          </TouchableOpacity>
        )}
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
        <Image source={imagePath.mapPin2} />
      </View>

      <TouchableOpacity onPress={() => currentLocationOnMap()}>
        <View
          style={{
            position: 'absolute',
            top: height / 1.6 - StatusBarHeightSecond,
            right: 20,
            left: width / 2,
            alignItems: 'flex-end',

            // marginTop: height / 2,
          }}>
          <Image source={imagePath.mapNavigation} />
        </View>
      </TouchableOpacity>
      <View
        style={{
          flex: 0.3,
          position: 'absolute',
          height: height / 5,
          width: width,
          bottom: 0,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        {_renderBottomComponent()}
      </View>
    </>
  );
}
