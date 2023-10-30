import React, { useEffect, useState } from "react";
import {
  I18nManager,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDarkMode } from "react-native-dynamic";
import Geocoder from "react-native-geocoding";
import { useSelector } from "react-redux";
import SearchPlaces from "../../Components/SearchPlaces";
import WrapperContainer from "../../Components/WrapperContainer";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import { hitSlopProp } from "../../styles/commonStyles";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../../styles/responsiveSize";
import { MyDarkTheme } from "../../styles/theme";
import {
  getCurrentLocationFromApi,
  getPlaceDetails,
  nearbySearch,
} from "../../utils/googlePlaceApi";
import { getCurrentLocation } from "../../utils/helperFunctions";
import {
  chekLocationPermission,
  locationPermission,
} from "../../utils/permissions";
import stylesFun from "./styles";

import { enableFreeze } from "react-native-screens";
enableFreeze(true);


navigator.geolocation = require("react-native-geolocation-service");

export default function Location({ route, navigation }) {
  //get param data from specific screen
  const { type, data } = route.params;
  const addressType = route?.params?.addressType;

  const paramsDataForEditDropLocation = data;

  const { location } = useSelector((state) => state?.home);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const userData = useSelector((state) => state?.auth?.userData);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
    address: "",
    curLatLng: {
      latitude: location?.latitude || 30.7333,
      longitude:location?.longitude||  76.7794,
    },
    nearByAddressess: [],
    searchResult: [],
    savedAddress: [],
    isMapSelectLocation: false,
  });

  const {
    isLoading,
    address,
    curLatLng,
    nearByAddressess,
    searchResult,
    savedAddress,
    isMapSelectLocation,
  } = state;

  //Reduc store data
  const { appData, appStyle, themeColors } = useSelector(
    (state) => state?.initBoot
  );
  const { profile } = appData;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily });
  useEffect(() => {
    Geocoder.init(profile.preferences.map_key, { language: "en" }); // set the language
  }, []);

  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Naviagtion to specific screen
  const moveToNewScreen = (screenName, data = {}) => () => {
    navigation.navigate(screenName, { data });
  };

  useEffect(() => {
    getLiveLocation();
    if (!!userData?.auth_token) {
      getAllAddress();
    }
  }, []);

  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const { latitude, longitude } = await getCurrentLocationFromApi();
      // console.log("get live location after 4 second")
      updateState({ curLatLng: { latitude, longitude } });
      getNearByAddress(`${latitude}, ${longitude}`);
    }
  };

  const getNearByAddress = async (latlng) => {
    try {
      const res = await nearbySearch(latlng, profile?.preferences?.map_key);
      updateState({ nearByAddressess: res.results });
    } catch (error) {
      console.log("error raised", error);
    }
  };

  //Get Your current location
  const getCurrentLocate = () => {
    updateState({
      isMapSelectLocation: true,
    });
    chekLocationPermission()
      .then((result) => {
        if (result !== "goback") {
          getCurrentPosition();
        }
      })
      .catch((error) => console.log("error while accessing location", error));
  };

  const getCurrentPosition = () => {
    getCurrentLocation("home")
      .then((res) => {
     
        let details = {};
        updateState({ address: res.address });
        details = {
          formatted_address: res?.address,
          geometry: {
            location: {
              lat: res?.latitude,
              lng: res?.longitude,
            },
          },
        };
        console.log(details, 'details>>>>>');
        console.log(type, 'type>>>>>');
        // setTimeout(() => {
        //   if (type == 'Home1') {
        //     navigation.navigate(navigationStrings.HOME, {
        //       details,
        //     });
        //   }
        //   if (type == 'Pickup') {
        //     navigation.navigate(navigationStrings.PICKUPLOCATION, {
        //       details,
        //       addressType,
        //     });
        //   }
        //   if (type == 'vendorRegistration') {
        //     navigation.navigate(navigationStrings.WEBLINKS, {
        //       details,
        //     });
        //   }
        // }, 20000);
      })
      .catch((err) => console.log(err, "errorOccured"));
  };

  const updateCurValues = (text) => {
    updateState({ address: text });
  };

  const onPressAddress = async (place) => {
    Keyboard.dismiss();
    console.log("selected item", place?.name);
    // return;

    if (!!place.place_id && !!place?.name) {
      try {
        let res = await getPlaceDetails(
          place.place_id,
          profile?.preferences?.map_key
        );
        const { result } = res;
        console.log("res===", result);

        let details = {};
        details = {
          formatted_address: result.formatted_address,
          geometry: {
            location: {
              lat: result?.geometry.location.lat,
              lng: result?.geometry.location.lng,
            },
          },
        };

        if (type == "Home1") {
          navigation.navigate(navigationStrings.HOME, {
            details,
          });
        }
        if (type == "Pickup") {
          navigation.navigate(navigationStrings.PICKUPLOCATION, {
            details,
            addressType,
          });
        }
        if (type == "vendorRegistration") {
          navigation.navigate(navigationStrings.WEBLINKS, {
            details,
          });
        }
        if (paramsDataForEditDropLocation) {
          const allDropOffLocationsCollection = [
            ...paramsDataForEditDropLocation?.orderDropLocations,
          ];
          allDropOffLocationsCollection[
            paramsDataForEditDropLocation?.editIndex
          ] = {
            ...allDropOffLocationsCollection[
            paramsDataForEditDropLocation?.editIndex
            ],
            address: details?.formatted_address,
            latitude: details?.geometry?.location?.lat,
            longitude: details?.geometry?.location?.lng,
          };

          navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
            ...paramsDataForEditDropLocation,
            orderDropLocations: allDropOffLocationsCollection,
            showLocationUpdateButton: true
          });
        }
      } catch (error) {
        console.log("something wen't wrong");
      }
    } else {
      let details = {
        formatted_address: place?.address,
        geometry: {
          location: {
            lat: place?.latitude,
            lng: place?.longitude,
          },
        },
      };
      if (type == "Home1") {
        navigation.navigate(navigationStrings.HOME, {
          details,
        });
      }
      if (type == "Pickup") {
        navigation.navigate(navigationStrings.PICKUPLOCATION, {
          details,
          addressType,
        });
      }
      if (type == "vendorRegistration") {
        navigation.navigate(navigationStrings.WEBLINKS, {
          details,
        });
      }
      if (paramsDataForEditDropLocation) {
        const allDropOffLocationsCollection = [
          ...paramsDataForEditDropLocation?.orderDropLocations,
        ];
        allDropOffLocationsCollection[
          paramsDataForEditDropLocation?.editIndex
        ] = {
          ...allDropOffLocationsCollection[
          paramsDataForEditDropLocation?.editIndex
          ],
          address: details?.formatted_address,
          latitude: details?.geometry?.location?.lat,
          longitude: details?.geometry?.location?.lng,
        };

        navigation.navigate(navigationStrings.PICKUPTAXIORDERDETAILS, {
          ...paramsDataForEditDropLocation,
          orderDropLocations: allDropOffLocationsCollection,
          showLocationUpdateButton: true
        });
      }
    }
  };

  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        }
      )
      .then((res) => {
        console.log(res, "res address>>>>");
        if (res?.data?.length > 0) {
          let modifyArray = res.data.filter((val, i) => {
            if (!!val?.latitude && !!val?.longitude) {
              return val;
            }
          });
          updateState({ savedAddress: modifyArray });
        }
      })
      .catch((error) => {
        updateState({ isLoading: false });
        // showError(error?.message || error?.error);
      });
  };

  const renderAddressess = (item) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.addressViewStyle,
          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.lightGreyBg,
        }}
        onPress={() => onPressAddress(item)}
      >
        <View style={{ flex: 0.12 }}>
          <Image
            style={{
              height: moderateScale(24),
              width: moderateScale(24),
              borderRadius: moderateScale(12),
            }}
            source={imagePath.RecentLocationImage}
          />
        </View>
        <View style={{ flex: 0.9 }}>
          <Text
            style={{
              fontSize: textScale(12),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily.regular,
            }}
          >
            {item?.name || item?.city || item?.country}
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
            {item?.vicinity || item?.address}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchItem = (item) => {
    return (
      <TouchableOpacity
        style={{
          ...styles.addressViewStyle,
          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.lightGreyBg,
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
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              fontFamily: fontFamily.regular,
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

  const mapClose = () => {
    updateState({
      isMapSelectLocation: false,
    });
  };

  const addressDone = (value) => {
    let details = {};
    updateState({ address: value.address });
    details = {
      formatted_address: value?.address,
      geometry: {
        location: {
          lat: value?.latitude,
          lng: value?.longitude,
        },
      },
    };

    setTimeout(() => {
      if (type == "Home1") {
        navigation.navigate(navigationStrings.HOME, {
          details,
        });
      }
      if (type == "Pickup") {
        navigation.navigate(navigationStrings.PICKUPLOCATION, {
          details,
          addressType,
        });
      }
      if (type == "vendorRegistration") {
        navigation.navigate(navigationStrings.WEBLINKS, {
          details,
        });
      }
    }, 200);
  };

  return (
    <WrapperContainer
      statusBarColor={colors.white}
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: moderateScale(12),
            marginTop: moderateScale(5),
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={{
              flex: 0.1,
            }}
            hitSlop={hitSlopProp}
          >
            <Image
              source={
                appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                  ? imagePath.icBackb
                  : imagePath.back
              }
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
              }}
            />
          </TouchableOpacity>

          <View style={{ flex: 0.88 }}>
            <SearchPlaces
              curLatLng={`${curLatLng.latitude}-${curLatLng.longitude}`}
              autoFocus={true}
              placeHolder={strings.SEARCH_LOCATION}
              value={address} // instant update search value
              mapKey={profile?.preferences?.map_key} //send here google Key
              fetchArrayResult={(data) => updateState({ searchResult: data })}
              setValue={(text) => updateCurValues(text)} //return & update on change text value
              _moveToNextScreen={getCurrentLocate}
              placeHolderColor={colors.textGreyB}
              onClear={() => updateState({ address: "", searchResult: [] })}
              mapClose={mapClose}
              addressDone={addressDone}
              isMapSelectLocation={isMapSelectLocation}
              currentLatLong={curLatLng}
            />
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onMomentumScrollBegin={() => Keyboard.dismiss()}
        >
          {!!searchResult && searchResult.length > 0 ? (
            <View style={{ marginTop: moderateScaleVertical(16) }}>
              <View style={{ ...styles.savedAddressView }}>
                <Image
                  style={{ marginHorizontal: moderateScale(12) }}
                  source={imagePath.starRoundedBackground}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.addresssLableName,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}
                >
                  {strings.SEARCHED_RESULTS}
                </Text>
              </View>
              {searchResult?.map((item, i) => {
                return renderSearchItem(item);
              })}
            </View>
          ) : (
            <View style={{ marginTop: moderateScaleVertical(16) }}>
              <View style={{ ...styles.savedAddressView }}>
                <Image
                  style={{ marginHorizontal: moderateScale(12) }}
                  source={imagePath.starRoundedBackground}
                />
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.addresssLableName,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}
                >
                  {strings.NEARBY_LOCATION}
                </Text>
              </View>
              {nearByAddressess.slice(0, 5).map((val) => {
                return renderAddressess(val);
              })}

              {savedAddress.length > 0 ? (
                <View
                  style={{
                    marginBottom: moderateScaleVertical(92),
                  }}
                >
                  <View
                    style={{
                      ...styles.savedAddressView,
                      marginTop: moderateScaleVertical(12),
                    }}
                  >
                    <Image
                      style={{ marginHorizontal: moderateScale(12) }}
                      source={imagePath.starRoundedBackground}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        ...styles.addresssLableName,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      }}
                    >
                      {strings.SAVED_ADDRESS}
                    </Text>
                  </View>
                  {savedAddress.length > 0 ? (
                    <View>
                      {savedAddress.map((val) => {
                        return renderAddressess(val);
                      })}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>
      </View>
    </WrapperContainer>
  );
}
