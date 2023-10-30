import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Keyboard, Image} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useSelector} from 'react-redux';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {getAddressComponent} from '../utils/helperFunctions';
navigator.geolocation = require('react-native-geolocation-service');
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import strings from '../constants/lang';
import imagePath from '../constants/imagePath';

const GooglePlaceInput = ({
  type,
  navigation,
  googleApiKey = '',
  textInputContainer = {},
  listView = {},
  addressType,
  textInput = {},
  addressHelper = () => {},
  getDefaultValue = '',
  placeholder = null,
  showListOutside = () => {},
  showList = false,
  container = {},
  rowStyle = {},
  handleAddressOnKeyUp = () => {},
  renderBottomComponent,
  renderCustomRow,
  updateTheAddress = () => {},
  autoFocus = false,
  onBlur = () => {},
  onFocus = () => {},
  ListHeaderComponent = () => {},
  placeholderTextColor = useDarkMode()
    ? colors.textGreyOpcaity7
    : colors.textGreyB,
  getResults = () => {},
  selectionColor = colors.textGreyB,
  style = {},
}) => {
  const [state, setState] = useState({
    isLoading: true,
    currentLat: '',
    currentLang: '',
    // getDefaultText: getDefaultValue,
  });
  // console.log(addressType, 'addressType>>>');
  const {isLoading, getDefaultText, currentLang, currentLat} = state;
  const {appData, appStyle} = useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  // const theme = useSelector((state) => state?.initBoot?.themeColor);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {profile} = appData;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  useEffect(() => {
    Geocoder.init(profile?.preferences?.map_key, {language: 'en'}); // set the language
  }, []);

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));
  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useEffect(() => {
    getCurrentLatLong();
  }, []);

  const getCurrentLatLong = () => {
    return navigator.geolocation.default.getCurrentPosition(
      (position) => {
        updateState({
          currentLat: position.coords.latitude,
          currentLang: position.coords.longitude,
        });
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000},
    );
  };

  //Get Your current location
  const getCurrentLocation = () => {
    return navigator.geolocation.default.getCurrentPosition(
      (position) => {
        // const location = JSON.stringify(position);
        Geocoder.from({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
          .then((json) => {
            var addressComponent = json.results[0].formatted_address;
            let details = {};
            details = {
              formatted_address: addressComponent,
              geometry: {
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
              },
              address_components: json.results[0].address_components,
            };

            if (type == 'Home1') {
              navigation.navigate(navigationStrings.HOME, {
                details,
              });
            }
            if (type == 'Pickup') {
              // navigation.navigate(navigationStrings.PICKUPLOCATION, {
              //   details,
              //   addressType,
              // });
              updateTheAddress(details, addressType);
            }
          })
          .catch((error) => console.log(error, 'errro geocode'));
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000},
    );
  };
  // console.log(getDefaultValue, 'getDefaultValue');

  return (
    <View>
      <GooglePlacesAutocomplete
        placeholder={placeholder ? placeholder : strings.SEARCH_LOCATION}
        textInputProps={{
          placeholderTextColor,
          autoFocus: autoFocus,
          value: getDefaultValue,
          selectionColor: selectionColor,
          onChangeText: (text) => {
            handleAddressOnKeyUp(text);
          },
          onBlur: onBlur,
          onFocus: onFocus,
          ...style,
        }}
        enableHighAccuracyLocation={true}
        fetchDetails={true}
        onPress={(data, details = null) => {
          console.log(details, 'details');
          if (type == 'Home1') {
            navigation.navigate(navigationStrings.HOME, {
              details,
            });
          } else if (type == 'Pickup') {
            // navigation.navigate(navigationStrings.PICKUPLOCATION, {
            //   details,
            //   addressType,
            // });
            updateTheAddress(details, addressType);
          } else if (type == 'addAddress') {
            console.log(type, 'type-addAddress');
            let addressData = getAddressComponent(details);
            addressHelper(addressData);
          } else if (type == 'updateAddress') {
            let update = 'update';
            let addressData = getAddressComponent(details, update);
            addressHelper(addressData);
          }
        }}
        query={{
          key: googleApiKey,
          language: 'en',
          // components:'country:in|country:us',
          // types: 'es',
          radius: 50000,
          // strictbounds: false,
          location: `${currentLat},${currentLang}`,
        }}
        renderRow={(results) => {
          console.log(results, 'results>results');
          if (getResults) {
            getResults(results);
          }
          // if(showList){
          //   return showListOutside(results)
          // }else{
          //   return (
          //     <Text style={styles.detectLocation}>{results.description}</Text>
          //   );
          // }

          return renderCustomRow ? (
            renderCustomRow(results)
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: width - moderateScale(60),
              }}>
              <View
                style={{
                  height: 23,
                  width: 23,
                  borderRadius: 13,
                  backgroundColor: '#D9D9D9',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: moderateScale(5),
                }}>
                <Image
                  source={imagePath.icLocation1}
                  style={{tintColor: colors.white, height: '65%', width: '65%'}}
                  resizeMode="contain"
                />
              </View>

              <Text style={rowStyle ? rowStyle : {...styles.detectLocation}}>
                {results.description}
              </Text>
            </View>
          );
          // return <Text style={rowStyle ? rowStyle : styles.detectLocation}>
          //     {results.description}
          //   </Text>
        }}
        renderDescription={(row) => row.description || row.vicinity}
        isPredefinedPlace={true}
        predefinedPlacesAlwaysVisible={true}
        enablePoweredByContainer={false}
        nearbyPlacesAPI="GooglePlacesSearch"
        GoogleReverseGeocodingQuery={{}}
        GooglePlacesSearchQuery={{
          rankby: 'distance',
          type: 'address',
        }}
        // predefinedPlaces={[currentPlace]}
        GooglePlacesDetailsQuery={{
          fields: ['name', 'geometry', 'formatted_address'],
        }}
        keyboardShouldPersistTaps="handled"
        filterReverseGeocodingByTypes={[
          'locality',
          'administrative_area_level_3',
        ]}
        //textInputProps={{...textInselectionColor: selectionColor}}
        styles={{
          listView: {...styles.listView, ...listView},
          textInputContainer: {
            ...styles.textInputContainer,
            ...textInputContainer,
          },
          predefinedPlacesDescription: styles.predefinedPlacesDescription,
          textInput: [{...styles.textInput}, {...textInput}],
        }}
        ListFooterComponent={() => <View style={{height: height / 6}} />}
        renderHeaderComponent={ListHeaderComponent}
      />
      {renderBottomComponent}
    </View>
  );
};

export function stylesFunc({fontFamily}) {
  const styles = StyleSheet.create({
    detectLocation: {
      color: colors.black,
      fontFamily: fontFamily.bold,
      fontSize: moderateScale(14),
      opacity: 0.8,
    },
    listView: {
      position: 'absolute',
      backgroundColor: '#FFF',
      zIndex: 1000, //Forcing it to front
      marginTop: moderateScaleVertical(40),
      marginHorizontal: moderateScale(10),
    },
    textInputContainer: {
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScaleVertical(10),
      height: moderateScaleVertical(40),
      // backgroundColor: colors.red,
    },
    predefinedPlacesDescription: {
      color: colors.themeColor,
    },
    textInput: {
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      color: colors.black,
    },
    useCurrentLocationView: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: moderateScale(15),
      marginTop: moderateScaleVertical(60),
    },
  });
  return styles;
}
export default React.memo(GooglePlaceInput);
