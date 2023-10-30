import { Alert, Keyboard, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps'
import { StatusBarHeightSecond, height, moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize'
import { Image } from 'react-native'
import imagePath from '../constants/imagePath'
import { useSelector } from 'react-redux'
import Geocoder from 'react-native-geocoding';
import GradientButton from './GradientButton'
import strings from '../constants/lang'
import colors from '../styles/colors'
import { TouchableOpacity } from 'react-native'
import SearchBar from './SearchBar'
import SearchPlaces from './SearchPlaces'
import { isEmpty } from 'lodash'
import { getPlaceDetails } from '../utils/googlePlaceApi'
import { chekLocationPermission, onlyCheckLocationPermission } from '../utils/permissions'
import { getCurrentLocation } from '../utils/helperFunctions'
import actions from '../redux/actions'
import { openAppSetting } from '../utils/openNativeApp'



export default function SelectSearchFromMap({
  addressDone = () => { },

}) {
  const mapRef = useRef(null)

  const { themeColors, appStyle, appData } = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });
  const { profile } = appData;


  const [initialRegion, setInitialRegion] = useState({
    latitude: 30.7333,
    longitude: 76.7794,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  })

  const [address, setAddress] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [placeDetails, setPlaceDetails] = useState({})





  const _onRegionChange = (region) => {
    setInitialRegion(region)
    _getAddressBasedOnCoordinates(region);
  }

  const _getAddressBasedOnCoordinates = (region) => {
    Geocoder.from({
      latitude: region.latitude,
      longitude: region.longitude,
    })
      .then((json) => {

        let finalResult = {};
        if (json?.results?.length > 0) {
          json.results.every((val, i) => {
            if (
              val.types.includes('plus_code') ||
              val.types.includes('street_address') ||
              val.types.includes('route') ||
              val.types.includes('postal_code') ||
              val.types.includes('administrative_area_level_1')
            ) {
              finalResult = val;
              return false;
            } else {
              finalResult = val;
              return true;
            }
          });
        }

        if (Object.keys(finalResult).length > 0) {
          let detail = {
            formatted_address: finalResult?.formatted_address,
            geometry: {
              location: {
                lat: region.latitude,
                lng: region.longitude,
              },
            },
            address_components: finalResult?.address_components,
            place_id: finalResult?.place_id,
          };

          setPlaceDetails(detail)
          setAddress(detail?.formatted_address)


        } else {
          alert('location not found');
        }
      })
      .catch((error) => console.log(error, 'errro geocode'));
  }


  const _modeToNextScreen = () => {
    const pickuplocationAllData = {
      longitude: placeDetails?.geometry?.location?.lng,
      latitude: placeDetails?.geometry?.location?.lat,
      address: placeDetails?.formatted_address,
      task_type_id: 1,
      pre_address: placeDetails?.formatted_address,
      place_id: placeDetails?.place_id,
    };
    addressDone(pickuplocationAllData);
  }



  const onPressAddress = async (place) => {
    Keyboard.dismiss();
    if (!!place.place_id && !!place?.name) {
      try {
        let res = await getPlaceDetails(
          place.place_id,
          profile?.preferences?.map_key
        );
        const { result } = res;

        let details = {
          address: result.formatted_address,
          latitude: result?.geometry.location.lat,
          longitude: result?.geometry.location.lng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,

        };
        onPickSelectedLoc(details)
      } catch (error) {
        console.log("something went wrong");
      }
    } else {
      let details = {
        address: place?.address,
        latitude: place?.latitude,
        longitude: place?.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,

      };
      onPickSelectedLoc(details)
    }
  };

  const onPickSelectedLoc = (regionData) => {
    setInitialRegion(regionData)
    setAddress(regionData?.address)
    setSearchResult([])

    mapRef.current.animateToRegion(regionData, 1000);
  }


  const checkAndGetLocation = (isOpen = false) => {
    chekLocationPermission(true)
      .then(result => {
        console.log(result, "result>>>>>>result")
        if (result !== 'goback' && result == 'granted') {
          getLocationPermissionStatus()
          onGetCurrentLoc()
        } else if (result === "blocked") {
          Alert.alert("", "Location Permission disabled, allow it from settings", [
            {
              text: strings.CANCEL,
              onPress: () => console.log("Cancel Pressed"),
            },
            {
              text: strings.CONFIRM,
              onPress: openAppSetting,
            },
          ]);
        } else {

        }
      })
      .catch(error => {
        console.log('error while accessing location', error);

        return;
      });

  }

  const onGetCurrentLoc = () => {
    getCurrentLocation('home')
      .then(curLoc => {
        onPickSelectedLoc({
          address: curLoc?.address,
          latitude: curLoc?.latitude,
          longitude: curLoc?.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        })
        return;
      })
      .catch(err => {

      });

  }

  const getLocationPermissionStatus = () => {
    onlyCheckLocationPermission().then((res) => {

    }).catch((err) => {
      setisLocationModal(true)

    })

  }




  const renderSearchItem = (item) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.addressViewStyle,
          borderBottomColor: colors.lightGreyBg,
        }}
        onPress={() => onPressAddress(item)}
      >
        <View style={{ flex: 0.15 }}>
          <Image source={imagePath.RecentLocationImage} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Text
            style={{
              fontSize: textScale(12),
              color: colors.black,
              fontFamily: fontFamily?.regular,
            }}
          >
            {item?.name || item?.city}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              fontSize: textScale(10),
              color: colors.textGreyJ,
              fontFamily: fontFamily.regular,
              lineHeight: moderateScaleVertical(20),
            }}
          >
            {item?.formatted_address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };



  return (
    <View style={{
      flex: 1
    }}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={{
          ...StyleSheet.absoluteFillObject,
          height: height,
        }}
        initialRegion={initialRegion}
        // onMapReady={handleMapReady}
        onRegionChangeComplete={_onRegionChange}>
      </MapView>

      <View
        style={styles.mapCont}>
        <Image
          source={imagePath.icLocationPin_}
          style={{ tintColor: themeColors.primary_color }}
        />
      </View>
      <View style={styles.absoluteTopCont}>
        <TouchableOpacity onPress={checkAndGetLocation} activeOpacity={0.7} style={{ ...styles.allowLoc, marginBottom: moderateScaleVertical(10) }}>
          <Image source={imagePath.icLocationOrders} />
          <Text style={styles.allowLocTxt}>Allow to track Current Location</Text>
        </TouchableOpacity>
        <View style={styles.topViewMap}>
          <Image source={imagePath.icSearchNew} />
          <SearchPlaces
            containerStyle={{
              backgroundColor: colors.transparent,
              flex: 1,
              height: moderateScale(50)
            }}
            autoFocus={true}
            placeHolder={strings.SEARCH_LOCATION}
            value={address} // instant update search value
            mapKey={profile?.preferences?.map_key} //send here google Key
            fetchArrayResult={(data) => setSearchResult(data)}
            setValue={(text) => setAddress(text)} //return & update on change text value
            placeHolderColor={colors.blackOpacity66}
            textStyle={{
              fontFamily: fontFamily?.medium,
              fontSize: textScale(12)
            }}
            onClear={() => {
              setAddress('')
              setSearchResult([])
            }}
            addressDone={(value) => {
              console.log(value, "<===value addressDone")
            }}

            showRightImg={false}
          />
        </View>
        {!isEmpty(searchResult) &&

          <View style={{ marginTop: moderateScaleVertical(6), backgroundColor: colors.white, paddingVertical: moderateScaleVertical(8) }}>
            <View style={{ ...styles.savedAddressView }}>
              <Image
                style={{ marginHorizontal: moderateScale(12) }}
                source={imagePath.starRoundedBackground}
              />
              <Text
                numberOfLines={1}
                style={{
                  ...styles.addresssLableName,
                  color: colors.black,
                }}
              >
                {strings.SEARCHED_RESULTS}
              </Text>
            </View>
            <ScrollView style={{
              height: moderateScaleVertical(250)
            }}>
              {searchResult?.map((item, i) => {
                return renderSearchItem(item);
              })}
            </ScrollView>
          </View>}
      </View>

      {isEmpty(searchResult) && <View
        style={styles.absoluteCont}>
        <GradientButton
          btnText={strings.DONE}
          onPress={_modeToNextScreen}
        />
      </View>}

    </View>
  )
}
function stylesFun({ fontFamily }) {

  const styles = StyleSheet.create({
    allowLoc: {
      backgroundColor: colors.white,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: moderateScale(4),
      height: moderateScaleVertical(50),
      elevation: 2,
      paddingHorizontal: moderateScale(12),
      marginBottom: moderateScaleVertical(20)
    },
    allowLocTxt: {
      fontFamily: fontFamily?.medium,
      fontSize: textScale(12),
      color: colors.blackOpacity66,
      marginLeft: moderateScale(12)
    },
    absoluteCont: {
      position: 'absolute',
      bottom: moderateScaleVertical(40),
      width: width - moderateScale(40),
      alignSelf: 'center',

    },
    absoluteTopCont: {
      position: 'absolute',
      top: moderateScaleVertical(10),
      width: width - moderateScale(40),
      alignSelf: 'center',

    },
    mapCont: {
      position: 'absolute',
      top: height / 2 - StatusBarHeightSecond,
      right: width / 2,
      left: width / 2,
      bottom: height / 2,
      alignItems: 'center',
      justifyContent: 'center',
      // marginTop: height / 2,
    },
    addressViewStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: moderateScale(10),
      borderBottomWidth: 0.5,
      marginBottom: moderateScaleVertical(4),
    },
    addresssLableName: {
      fontSize: textScale(12),
      color: colors.black,
      fontFamily: fontFamily?.medium,
      marginLeft: moderateScale(6),
    },
    savedAddressView: {
      flexDirection: 'row',
      marginBottom: moderateScaleVertical(8),
      alignItems: 'center',
      backgroundColor: colors.wh
    },
    topViewMap: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      backgroundColor: colors.white,
      paddingLeft: moderateScale(moderateScale(10)),
      borderRadius: moderateScale(4),
    }
  })

  return styles
}