import {useFocusEffect} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, {AnimatedRegion} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeightSecond,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import stylesFun from './styles';

export default function SetLocationInMap({navigation, route}) {
  const paramData = route?.params;
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
    isLoading: false,
    details: {},
    addressLabel: 'Glenpark',
    formattedAddress: '8502 Preston Rd. Inglewood, Maine 98380',
  });
  const {
    isLoading,
    addressLabel,
    details,
    formattedAddress,
    region,
    coordinate,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
  }, []);

  useFocusEffect(React.useCallback(() => {}, []));

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
        };
        updateState({
          details: detail,
        });
      })
      .catch((error) => console.log(error, 'errro geocode'));
  };
  const markerRef = useRef();

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

  const _onDrag = (e) => {};

  const _confirmAddress = () => {
    // navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIME);
    navigation.navigate(navigationStrings.MULTISELECTCATEGORY, {
      details: details,
      type: paramData?.type,
      addressType: paramData?.addressType,
    });
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

        {/* Top View */}
        <View style={styles.topView}>
          <TouchableOpacity
            style={styles.backButtonView}
            onPress={() => navigation.goBack()}>
            <Image source={imagePath.backArrowCourier} />
          </TouchableOpacity>
          <View style={styles.searchbar}>
            <Image source={imagePath.searchIcon2} />
            <Text>{strings.SEARCH}</Text>
          </View>
        </View>

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

        {/* BottomView */}
        <View style={styles.bottomView}>
          <View style={{padding: moderateScale(20)}}>
            <View
              style={{
                height: moderateScaleVertical(60),
                // backgroundColor: 'red',
              }}>
              <Text style={styles.addressMain} numberOfLines={2}>
                {formattedAddress}
              </Text>
            </View>

            <View
              style={{
                // marginVertical: moderateScaleVertical(10),
                // marginHorizontal: moderateScale(20),
                justifyContent: 'flex-end',
                position: 'absolute',
                top: height / 4.5 / 2,
                left: moderateScale(20),
                right: moderateScale(20),

                // marginTop: (height / 4.5),
              }}>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={{textTransform: 'none', fontSize: textScale(16)}}
                onPress={_confirmAddress}
                marginTop={moderateScaleVertical(10)}
                marginBottom={moderateScaleVertical(10)}
                btnText={strings.CONFIRMADDRESS}
              />
            </View>
          </View>
        </View>
      </View>
    </WrapperContainer>
  );
}
