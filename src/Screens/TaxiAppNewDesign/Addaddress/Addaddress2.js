import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getBundleId } from "react-native-device-info";
import { useDarkMode } from "react-native-dynamic";
import Geocoder from "react-native-geocoding";
import { enableFreeze } from "react-native-screens";
import { useSelector } from "react-redux";
import DropDown from "../../../Components/DropDown";
import GradientButton from "../../../Components/GradientButton";
import Modal from "../../../Components/Modal";
import PinAddressOnMap from "../../../Components/PinAddressOnMap";
import SearchPlaces2 from "../../../Components/SearchPlaces2";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang/index";
import navigationStrings from "../../../navigation/navigationStrings";
import actions from "../../../redux/actions";
import colors from "../../../styles/colors";
import commonStylesFun from "../../../styles/commonStyles";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from "../../../styles/responsiveSize";
import { MyDarkTheme } from "../../../styles/theme";
import { appIds } from "../../../utils/constants/DynamicAppKeys";
import {
  getAddressFromLatLong,
  getCurrentLocationFromApi,
  getPlaceDetails,
  nearbySearch
} from "../../../utils/googlePlaceApi";
import {
  getAddressComponent,
  getPhoneNumberFromPhoneBook,
  getRandomColor,
  showError
} from "../../../utils/helperFunctions";
import {
  checkContactPermission,
  chekLocationPermission,
  locationPermission
} from "../../../utils/permissions";
import stylesFun from "./styles";
enableFreeze(true);


export default function Addaddress({ navigation, route }) {
  const paramData = route?.params;
  const { userData } = useSelector((state) => state?.auth || {});
  const { pickUpTimeType } = useSelector((state) => state?.home || {});
  const {
    appData,
    allAddresss,
    themeColors,
    appStyle,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot || {});
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const categoryId = !!paramData?.item ? paramData?.item?.id : paramData?.data?.id
  const { book_for_friend, is_bid_ride_enable, is_cab_pooling, is_particular_driver } = appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;

  const commonStyles = commonStylesFun({ fontFamily });
  const { profile } = appData || {};


  const [state, setState] = useState({
    pageNo: 1,
    limit: 5,
    pickUpVendors: [],

    savedAddressViewHeight: 0,
    avalibleValueInTextInput: false,
    vendorId: null,

    searchResult: {
      currentIndex: 0,
      data: [],
    },
    curLatLng: {
      latitude: 30.7333,
      longitude: 76.7794,
    },
    dropLocationData: [
      {
        pre_address: "",
        address: "",
        latitude: 0,
        longitude: 0,
      },
      {
        pre_address: "",
        address: "",
        latitude: 0,
        longitude: 0,
      },
    ],
    nearByAddressess: [],
    selectedTab: 1,
    showFriendListModal: false,
    allAddedFriends: [],
    isBookingType: "0",
    selectedFriendForRide: { id: 0 },
    staticLocation: [],
    selectedLoaction: [],
    isLoading: false,
  });
  const {
    pageNo,
    limit,
    pickUpVendors,
    savedAddressViewHeight,
    avalibleValueInTextInput,
    searchResult,
    dropLocationData,
    nearByAddressess,
    curLatLng,
    selectedTab,
    showFriendListModal,
    allAddedFriends,
    selectedFriendForRide,
    staticLocation,
    selectedLoaction,
    isBookingType,
    isLoading,
  } = state;

  const [isPinAddressOnMapModal, setIsPinAddressOnMapModal] = useState(false);
  const [pickDropData, setPickDropData] = useState({});


  useEffect(() => {
    if (!!(userData && userData?.auth_token)) {
      getAllAddress();
    }
  }, [paramData]);


  useEffect(() => {
    getStaticLocations();
  }, []);

  useEffect(() => {
    getLiveLocation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAllRiderList();
    }, [])
  );


  const getStaticLocations = () => {
    actions
      .getStaticLocations(
        "",
        {},
        {
          code: appData?.profile?.code,
        }
      )
      .then((res) => {
        console.log(res, "locationssssss");
        updateState({
          staticLocation: [...res?.data],
        });
      })
      .catch((error) => {
        console.log(error, "locationssssss");
      });
  };
  //get All address
  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        }
      )
      .then((res) => {
        console.log(res, "all address");
        // actions.saveAllUserAddress(res.data);
        updateState({

          isLoading: false,

        });
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };


  useLayoutEffect(() => {
    chekLocationPermission()
      .then((result) => {
        if (result === "goback") {
          navigation.goBack();
        }
        Geocoder.init(profile?.preferences?.map_key, { language: "en" }); // set the language
      })
      .catch((error) => {
        console.log("error while accessing location", error)
      });
  }, []);

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const styles = stylesFun({
    fontFamily,
    themeColors,
    savedAddressViewHeight,
    avalibleValueInTextInput,
  });

  const getAllPickUpVendors = (lat, lng) => {
    console.log(appData, "appDataappData......");
    const latlongData = appData?.profile?.preferences
      ?.pickup_delivery_service_area
      ? {
        code: appData?.profile?.code,
        latitude: lat,
        longitude: lng,
      }
      : { code: appData?.profile?.code };

    actions.getDataByCategoryId(
      `/${categoryId}?limit=${limit}&page=${pageNo}`,
      {},
      latlongData
    )
      .then((res) => {
        console.log(res, 'resss>>>>>>>>>');
        updateState({
          isLoading: false,
          isRefreshing: false,
          pickUpVendors:
            pageNo == 1
              ? res.data.listData.data
              : [...pickUpVendors, ...res.data.listData.data],
        });
      })
      .catch((err) => {
        console.log(err, "error in Api ");
        updateState({ isLoading: false, isRefreshing: false });
      });
  };

  const _moveToNextScreen = (updateIndex) => {
    let existLatLng = {
      latitude: dropLocationData[updateIndex]?.latitude || 0,
      longitude: dropLocationData[updateIndex]?.longitude || 0,
    };
    updateState({
      searchResult: { ...searchResult, currentIndex: updateIndex },
      // isLoading: true,
    });
    setIsPinAddressOnMapModal(true);
    setPickDropData({
      task_id: updateIndex == 0 ? 1 : 2,

      ...(existLatLng?.latitude !== 0 ? existLatLng : curLatLng),
    });
  };


  const renderbtn = () => {
    switch (getBundleId()) {
      case appIds.yoho:
        return (
          <View
            style={{
              marginVertical: moderateScaleVertical(10),
              marginHorizontal: moderateScale(20),
              justifyContent: "flex-end",
            }}
          >
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={{ textTransform: "none", fontSize: textScale(16) }}
              onPress={saveAddressAndRedirect}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.DONE}
            />
          </View>
        );
      default:
        return (
          <View
            style={{
              marginVertical: moderateScaleVertical(10),
              marginHorizontal: moderateScale(20),
              justifyContent: "flex-end",
            }}
          >
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={{ textTransform: "none", fontSize: textScale(16) }}
              onPress={saveAddressAndRedirect}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(30)}
              btnText={strings.DONE}
            />
          </View>
        );
    }
  };

  const checkBookingServiceType = (bookingType) => {
    switch (bookingType) {
      case 0: return ('Booking')
      case 1: return ('Pooling')
      case 2: return ('bidRide')
      case 3: return ('RequestForDriver')
      default: return ('Booking')
    }
  }

  const moveToNextScreenWithAddressData = () => {
    let location = [];
    if (
      dropLocationData[0].pre_address == "" ||
      dropLocationData[0].address == ""
    ) {
      if (selectedTab == 2) {
        alert(strings.PLEASE_SELECT_PICKUP_LOCATION);
      } else {
        showError(strings.PLEASE_SELECT_PICKUP_LOCATION);
      }

      return;
    }
    if (
      dropLocationData[1].pre_address == "" ||
      dropLocationData[1].address == ""
    ) {
      if (selectedTab == 2) {
        alert(strings.PLEASE_SELECT_DROP_OFF_LOCATION);
      } else {
        showError(strings.PLEASE_SELECT_DROP_OFF_LOCATION);
      }

      return;
    }
    dropLocationData.map((val) => {
      if (val.pre_address !== "") {
        location.push({
          latitude: val.latitude,
          longitude: val.longitude,
        });
      }
    });

    let checkEmptyTask = dropLocationData.filter(
      (item) => item.pre_address !== ""
    );



    navigation.navigate(navigationStrings.CHOOSECARTYPEANDTIMETAXI, {
      location: location,
      id: categoryId,
      pickup_taxi: paramData?.cat?.pickup_taxi,
      tasks: checkEmptyTask,
      cabVendors: pickUpVendors,
      datetime: paramData?.datetime,
      pickUpTimeType: pickUpTimeType,
      rideType: checkBookingServiceType(isBookingType),
      friendBookingDetails: {
        bookingType: selectedFriendForRide?.id != 0 ? 1 : 0,
        firstName: selectedFriendForRide?.first_name
          ? selectedFriendForRide?.first_name
          : "",
        lastName: selectedFriendForRide?.last_name
          ? selectedFriendForRide?.last_name
          : "",
        mobileNumber: selectedFriendForRide?.phone_number
          ? `${selectedFriendForRide?.phone_number}`
          : "",
      },
    });
  };

  const saveAddressAndRedirect = () => {
    moveToNextScreenWithAddressData();
  };

  const onShowHideFriendListModal = () => {
    updateState({
      showFriendListModal: !showFriendListModal,
    });
  };

  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const { latitude, longitude } = await getCurrentLocationFromApi();

      updateState({ curLatLng: { latitude, longitude } });
      getNearByAddress(`${latitude}, ${longitude}`);
      getAllPickUpVendors(latitude, longitude);

      const res = await getAddressFromLatLong(`${latitude}, ${longitude}`,
        appData.profile.preferences?.map_key
      );
      let cloneArr = [...dropLocationData];
      if (paramData?.prefillAdress?.isFromSavedAddress) {
        cloneArr[0].pre_address = res.address;
        cloneArr[0].address = res.address;
        cloneArr[0].latitude = latitude;
        cloneArr[0].longitude = longitude;
        cloneArr[1].pre_address = paramData?.prefillAdress?.address || '';
        cloneArr[1].address = paramData?.prefillAdress?.address || '';
        cloneArr[1].latitude = paramData?.prefillAdress?.latitude || '';
        cloneArr[1].longitude = paramData?.prefillAdress?.longitude || '';
        cloneArr[1].task_type_id = 1;
        updateState({ dropLocationData: cloneArr });
      }
      else {
        cloneArr[0].pre_address = res.address;
        cloneArr[0].address = res.address;
        cloneArr[0].latitude = latitude;
        cloneArr[0].longitude = longitude;
        cloneArr[0].task_type_id = 1;
        updateState({ dropLocationData: cloneArr });
      }
    }
  };


  const getNearByAddress = async (latlng) => {
    try {
      const res = await nearbySearch(latlng, profile?.preferences?.map_key, paramData?.type || 'city');
      updateState({
        nearByAddressess: res.results,
      });
    } catch (error) {
      console.log("error raised", error);
    }
  };
  const onBooking = (type) => {
    updateState({
      isBookingType: type,
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
        onPress={() =>
          onPressAddress({ place_id: item.place_id, name: item.name })
        }
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
            {item?.name}
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
            {item?.vicinity}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onPressAddress = async (place) => {
    Keyboard.dismiss();
    // return;
    if (!!place.place_id && !!place?.name) {
      // updateAddress(place.description)
      let cloneArr = [...dropLocationData];
      cloneArr[searchResult.currentIndex].pre_address = place?.name;
      updateState({ dropLocationData: cloneArr });
      try {
        let res = await getPlaceDetails(
          place.place_id,
          profile?.preferences?.map_key
        );
        const { result } = res;

        let addressData = getAddressComponent(result);
        cloneArr[searchResult.currentIndex].latitude =
          result.geometry.location.lat;
        cloneArr[searchResult.currentIndex].longitude =
          result.geometry.location.lng;
        cloneArr[searchResult.currentIndex].task_type_id =
          searchResult.currentIndex == 0 ? 1 : 2;
        cloneArr[searchResult.currentIndex].post_code = addressData?.pincode;
        cloneArr[searchResult.currentIndex].short_name =
          addressData?.states || addressData?.state;
        cloneArr[searchResult?.currentIndex].address =
          result?.formatted_address;
        updateState({
          dropLocationData: cloneArr,
          searchResult: { currentIndex: searchResult.currentIndex, data: [] },
        });
      } catch (error) {
        console.log("something wen't wrong");
      }
    } else {
      alert(strings.PLACE_ID_NOT_FOUND);
    }

    getAllPickUpVendors(
      dropLocationData[0].latitude,
      dropLocationData[0].longitude
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
            {item?.name}
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

  const addRemove = (isAddd, inx) => {
    if (!isAddd) {
      let cloneArr = dropLocationData;
      let removeItem = cloneArr.filter((item, i) => {
        if (i !== inx) {
          return item;
        }
      });
      updateState({ dropLocationData: removeItem });
      return;
    }

    let isFill = true;
    if (dropLocationData.length > 5) {
      return;
    }
    dropLocationData.map((val) => {
      if (val.latitude == 0) {
        isFill = false;
      }
    });
    if (isFill) {
      if (isAddd) {
        let x = [];
        x.push({
          pre_address: "",
          address: "",
          latitude: 0,
          longitude: 0,
        });
        isFill = true;
        updateState({ dropLocationData: [...dropLocationData, ...x] });
      }
    } else {
      alert(strings.PLEASE_FILL_ADDRESS);
    }
  };

  const updateCurValues = (text, i) => {
    const cloneArr = dropLocationData;
    cloneArr[i].pre_address = text;
    updateState({ dropLocationData: cloneArr });
  };

  const onClearAddress = (text, i) => {
    const cloneArr = dropLocationData;
    cloneArr[i].pre_address = text;
    updateState({ dropLocationData: cloneArr });
  };

  const onClose = () => {
    updateState({
      showFriendListModal: false,
    });
  };
  const onSelectFriend = (item) => {
    updateState({
      showFriendListModal: false,
      selectedFriendForRide: item,
    });
  };

  const getAllRiderList = () => {
    actions
      .getAllRiderList({}, { code: appData?.profile?.code })
      .then((res) => {
        updateState({
          allAddedFriends: res?.riders,
        });
      })
      .catch((error) => {
        console.log(error, "reosoeoseooseose");
      });
  };


  const renderBookFriendListFooter = () => (
    <>
      <TouchableOpacity
        onPress={() => _onAddRiderContact(1)}
        style={styles.friendListFooter}
      >
        <Image
          style={{ tintColor: themeColors?.primary_color }}
          source={imagePath.addRider}
        />
        <Text style={styles.addFriendText}>{strings.ADD_MANUALLY}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => _onAddRiderContact(2)}
        style={styles.friendListFooter}
      >
        <Image
          style={{ tintColor: themeColors?.primary_color }}
          source={imagePath.addFriend}
        />
        <Text style={styles.addFriendText}>{strings.ADD_FROM_PHONEBOOK}</Text>
      </TouchableOpacity>
    </>
  );

  const renderAllFriends = ({ item, index }) => {
    return (
      <View style={{ padding: 5 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            style={{ flexDirection: "row" }}
            onPress={() => onSelectFriend(item)}
          >
            <Image source={imagePath.riderImage} />
            <Text
              style={{
                fontFamily: fontFamily.regular,
                color: colors.black,
                fontSize: textScale(14),
                marginHorizontal: moderateScale(10),
              }}
            >
              {item?.first_name} {item?.last_name}
            </Text>
          </TouchableOpacity>
          {item?.id == selectedFriendForRide?.id ? (
            <Image
              style={{ tintColor: themeColors?.primary_color }}
              source={imagePath.tickBlack}
            />
          ) : null}
        </View>

        <View
          style={{
            borderWidth: 0.5,
            height: 1,
            borderColor: colors.blackOpacity10,
            marginVertical: moderateScaleVertical(14),
          }}
        />
      </View>
    );
  };

  const allListFriendModalContent = () => {
    return (
      <>
        <View

          style={{
            ...styles.modalMainContainer,
            paddingHorizontal: moderateScale(10),
            marginVertical: 1,
            paddingTop: moderateScale(12),
          }}
        >
          <View
            style={{
              ...styles.friendListModalInnerContainer,
              marginTop:
                Platform.OS == "android"
                  ? moderateScaleVertical(-10)
                  : moderateScaleVertical(0),
            }}
          >
            <TouchableOpacity
              style={{ flex: 0.5 }}
              onPress={onShowHideFriendListModal}
              hitSlop={styles.hitSlop}
            >
              <Image
                style={{
                  tintColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.black,
                }}
                source={imagePath.backArrowCourier}
              />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={imagePath.user} />
              <Text
                style={{
                  ...styles.switchRiderText,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}
              >
                {strings.SWITCH_RIDER}
              </Text>
              <Image source={imagePath.icDropdown4} />
            </View>
          </View>
        </View>
        <View
          style={
            allAddedFriends.length >= 10
              ? { height: moderateScaleVertical(height / 1.05) }
              : {}
          }
        >
          <FlatList
            showsVerticalScrollIndicator={false}
            data={allAddedFriends}
            contentContainerStyle={{ flexGrow: 1 }}
            ListHeaderComponent={() => (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => _onAddRiderContact(0)}
                    style={styles.showFriendListModalHeaderContainer}
                  >
                    <Image source={imagePath.riderImage} />
                    <Text style={styles.forMeText}>For Me</Text>
                  </TouchableOpacity>
                  {selectedFriendForRide?.id == 0 ? (
                    <Image
                      style={{ tintColor: themeColors?.primary_color }}
                      source={imagePath.tickBlack}
                    />
                  ) : null}
                </View>
                <View style={styles.lineViewStyle} />
              </View>
            )}
            renderItem={renderAllFriends}
            style={styles.friendListStyle}
            ListFooterComponent={renderBookFriendListFooter}
          />
        </View>
      </>
    );
  };

  const onSelectedLocation = (data) => {
    console.log(data);
    updateState({
      selectedLoaction: data?.address,
    });
  };
  const _onAddRiderContact = (type) => {
    switch (type) {
      case 0:
        updateState({
          showFriendListModal: false,
          selectedFriendForRide: { id: type },
        });
        break;
      case 1:
        updateState({
          showFriendListModal: false,
        });
        navigation.navigate(navigationStrings.ADD_NEW_RIDER, {
          addNewRiderContact: true,
        });
        break;
      case 2:
        _selectRiderContactFromPhoneBook();
        break;
    }
  };

  const _selectRiderContactFromPhoneBook = () => {
    checkContactPermission()
      .then((res) => {
        console.log(res, "res>>>>res");
        if (res == "granted") {
          getPhoneNumberFromPhoneBook()
            .then((res) => {
              if (res) {
                updateState({
                  showFriendListModal: false,
                });
                navigation.navigate(navigationStrings.ADD_NEW_RIDER, res);
              }
            })
            .catch((error) => {
              alert(error);
            });
        } else {
          alert("Contact permission blocked or not granted.");
        }
      })
      .catch((error) => {
        alert("Contact permission blocked or not granted.");
      });
  };

  const fetchValues = (item, i) => {
    updateState({
      // selectedLoaction[i]:item?.address
      selectedLoaction: [...selectedLoaction, item?.address],
    });
    let cloneArr = [...dropLocationData];
    cloneArr[i].pre_address = item.address;
    cloneArr[i].address = item.address;
    cloneArr[i].latitude = item?.latitude;
    cloneArr[i].longitude = item?.longitude;
    cloneArr[i].task_type_id = 2;
    updateState({ dropLocationData: cloneArr });
  };



  const onSelectAddressViaMap = (prefillAdress) => {
    getNearByAddress(`${prefillAdress?.latitude},${prefillAdress?.longitude}`)
    let cloneArr = [...dropLocationData];
    cloneArr[searchResult.currentIndex].pre_address =
      prefillAdress?.pre_address;
    cloneArr[searchResult.currentIndex].latitude = prefillAdress?.latitude;
    cloneArr[searchResult.currentIndex].longitude = prefillAdress?.longitude;
    cloneArr[searchResult.currentIndex].task_type_id =
      prefillAdress?.task_type_id;

    // cloneArr[searchResult.currentIndex].post_code = addressData?.pincode
    // cloneArr[searchResult.currentIndex].short_name = addressData?.states || addressData?.state
    cloneArr[searchResult?.currentIndex].address = prefillAdress?.address;

    updateState({
      dropLocationData: cloneArr,
      searchResult: { currentIndex: searchResult?.currentIndex, data: [] },
    });
    console.log("clone array result", cloneArr);
    setIsPinAddressOnMapModal(false);
  };

  const onMapLoaded = () => {
    updateState({
      isLoading: false,
    });
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      isLoading={isLoading}
      statusBarColor={colors.white}
    >
      {isPinAddressOnMapModal ? (
        <PinAddressOnMap
          onBackPress={() => setIsPinAddressOnMapModal(false)}
          onDone={onSelectAddressViaMap}
          pickUpLocationLatLng={pickDropData}
          onMapLoaded={onMapLoaded}
        />
      ) : (
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: moderateScale(40),
              marginHorizontal: moderateScale(16),
            }}
          >
            <TouchableOpacity
              style={{ flex: 0.5 }}
              onPress={() => navigation.goBack()}
              hitSlop={{
                top: 30,
                right: 30,
                left: 30,
                bottom: 30,
              }}
            >
              <Image
                style={{
                  tintColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.black,
                }}
                source={imagePath.backArrowCourier}
              />
            </TouchableOpacity>
            <View>
              {!!book_for_friend ? (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={onShowHideFriendListModal}
                >
                  {selectedFriendForRide?.first_name ? (
                    <View
                      style={{
                        backgroundColor: getRandomColor(),
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: moderateScale(20),
                        paddingVertical: moderateScaleVertical(3),
                        paddingHorizontal: moderateScale(9),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: textScale(16),
                          textTransform: "uppercase",
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.blackB,
                        }}
                      >
                        {selectedFriendForRide?.first_name?.charAt(0)}
                      </Text>
                    </View>
                  ) : (
                    <Image source={imagePath.riderImage} />
                  )}
                  {selectedFriendForRide?.first_name ? (
                    <Text
                      style={[
                        styles.addAddressScreenTitle,
                        {
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        },
                      ]}
                    >
                      {selectedFriendForRide?.first_name}{" "}
                      {selectedFriendForRide?.last_name}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.addAddressScreenTitle,
                        {
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        },
                      ]}
                    >
                      {strings.BOOK_FOR_ME}
                    </Text>
                  )}
                  <Image source={imagePath.icDropdown4} />
                </TouchableOpacity>
              ) : (
                <Text
                  style={[
                    styles.addAddressScreenTitle,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}
                >
                  {strings.ADD_ADDRESS}
                </Text>
              )}
            </View>
          </View>


          {/*   {!!is_particular_driver ? (
            <View
              style={{

                marginHorizontal: moderateScale(16),
                marginVertical: moderateScaleVertical(10),
                flexDirection: "row",

              }}
            >
               {!!(is_cab_pooling || is_bid_ride_enable) &&
                <GradientButton
                  colorsArray={
                    isBookingType == 0
                      ? [themeColors.primary_color, themeColors.primary_color]
                      : [colors.white, colors.white]
                  }
                  textStyle={{
                    textTransform: "none",
                    fontSize: textScale(14),
                    color:
                      isBookingType == 0 ? colors.white : themeColors?.primary_color,
                    marginHorizontal: moderateScale(5),
                    fontSize: textScale(10)
                  }}
                  onPress={() => onBooking(0)}
                  btnText={"BOOKING"}
                  containerStyle={{ flex: 1, marginHorizontal: moderateScale(5) }}
                  btnStyle={{
                    borderRadius: moderateScale(4),
                    borderColor: colors.textGreyLight,
                    borderWidth: moderateScale(0.5),

                  }}
                />
              }

              {!!is_cab_pooling &&
                <GradientButton
                  colorsArray={
                    isBookingType == 1
                      ? [themeColors.primary_color, themeColors.primary_color] : [colors.white, colors.white]
                  }
                  textStyle={{
                    textTransform: "none",
                    fontSize: textScale(14),
                    color:
                      isBookingType == 1 ? colors.white : themeColors?.primary_color,
                    marginHorizontal: moderateScale(5),
                    fontSize: textScale(10)
                  }}
                  onPress={() => onBooking(1)}
                  btnText={"POOLING"}
                  containerStyle={{ flex: 1, marginHorizontal: moderateScale(5) }}
                  btnStyle={{
                    borderRadius: moderateScale(4),
                    borderColor: colors.textGreyLight,
                    borderWidth: moderateScale(0.5),

                  }}
                />
              }

              {!!is_bid_ride_enable &&
                <GradientButton
                  colorsArray={
                    isBookingType == 2
                      ? [themeColors.primary_color, themeColors.primary_color]
                      : [colors.white, colors.white]
                  }
                  textStyle={{
                    textTransform: "none",
                    fontSize: textScale(14),
                    color:
                      isBookingType == 2 ? colors.white : themeColors?.primary_color,
                    marginHorizontal: moderateScale(5),
                    fontSize: textScale(10)
                  }}
                  onPress={() => onBooking(2)}
                  btnText={"BID & RIDE"}
                  containerStyle={{ flex: 1 }}
                  btnStyle={{
                    borderRadius: moderateScale(4),
                    borderColor: colors.textGreyLight,
                    borderWidth: moderateScale(0.5),

                  }}
                />
              }
           
                <GradientButton
                  colorsArray={
                    isBookingType == 3
                      ? [themeColors.primary_color, themeColors.primary_color]
                      : [colors.white, colors.white]
                  }
                  textStyle={{
                    textTransform: "none",
                    fontSize: textScale(14),
                    color:
                      isBookingType == 3 ? colors.white : themeColors?.primary_color,
                    marginHorizontal: moderateScale(5),
                    fontSize: textScale(10)
                  }}
                  onPress={() => onBooking(3)}
                  btnText={"REQUEST FOR DRIVER"}

                  containerStyle={{ flex: 1, marginHorizontal: moderateScale(5) }}
                  btnStyle={{
                    borderRadius: moderateScale(4),
                    borderColor: colors.textGreyLight,
                    borderWidth: moderateScale(0.5),


                  }}
                />
              
            </View>
            ) : null} 
             */}

          <View style={{ flex: 1 }}>
            <View>
              <View
                style={{
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.background
                    : colors.white,
                  paddingBottom: moderateScaleVertical(8),
                  borderRadius: 0,
                  marginTop: moderateScaleVertical(10)

                  // shadowOffset: { width: 0, height: moderateScale(6) },
                  // ...commonStyles.shadowStyle,

                }}
              >
                {dropLocationData.map((val, i) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: moderateScale(20),
                        alignItems: "center",
                        marginVertical: moderateScale(2),
                        justifyContent: "space-between",

                      }}
                    >
                      <View style={{ alignItems: "center", }}>
                        <View>
                          <Image
                            style={{
                              tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                              height: moderateScale(5),
                              width: moderateScale(5),
                              borderRadius:
                                dropLocationData.length - 1 == i ? 0 : moderateScale(5 / 2),
                            }}
                            source={imagePath.blackSquare}
                          />
                        </View>
                      </View>
                      {i > 0 &&
                        appData?.profile?.preferences?.is_static_dropoff ? (
                        <View
                          style={{ flex: 1, marginLeft: moderateScale(20) }}
                        >
                          <DropDown
                            value={dropLocationData[i].address}
                            inputStyle={styles.textInput}
                            selectedIndexByProps={-1}
                            placeholder={"select Drop Location"}
                            data={staticLocation}
                            fetchValues={(val) => fetchValues(val, i)}
                            marginBottom={0}
                          // onSelect={onPressAddress}
                          // inputStyle={{ borderColor: countryError !== '' ? colors.redColor : colors.lightGray }}
                          />
                        </View>
                      ) : (
                        <View
                          style={{ flex: 1, marginLeft: moderateScale(12), }}
                        >
                          <SearchPlaces2
                            curLatLng={`${curLatLng.latitude}-${curLatLng.longitude}`}
                            autoFocus={i == dropLocationData.length - 1 ? true :
                              false
                            }
                            placeHolder={
                              i == 0
                                ? strings.PICKUP_LOCATION
                                : i == 1
                                  ? strings.WHERETO
                                  : strings.ADD_A_STOP
                            }
                            value={val?.pre_address} // instant update search value
                            mapKey={profile?.preferences?.map_key} //send here google Key
                            fetchArrayResult={(data) =>
                              updateState({
                                searchResult: { data: data, currentIndex: i },
                              })
                            }
                            setValue={(text) => updateCurValues(text, i)} //return & update on change text value
                            onFocus={() =>
                              updateState({
                                searchResult: {
                                  ...searchResult,
                                  currentIndex: i,
                                },
                              })
                            }
                            _moveToNextScreen={() => _moveToNextScreen(i)}
                            onClear={() => onClearAddress("", i)}
                            index={i}
                          />
                        </View>
                      )}
                      <View style={{ marginHorizontal: moderateScale(8) }} />
                      <View style={{ flex: 0.1 }}>
                        {i >= 1 && (
                          <TouchableOpacity
                            hitSlop={{
                              top: 30,
                              right: 30,
                              left: 30,
                              bottom: 30,
                            }}
                            onPress={() =>
                              addRemove(
                                dropLocationData.length - 1 == i ? true : false,
                                i
                              )
                            }
                            activeOpacity={1}
                          >
                            <Animated.Image
                              style={{
                                tintColor: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : colors.black,
                                transform: [
                                  {
                                    rotate:
                                      dropLocationData.length - 1 == i
                                        ? "0deg"
                                        : "45deg",
                                  },
                                ],
                              }}
                              source={imagePath.icAdd}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onMomentumScrollBegin={() => Keyboard.dismiss()}
              >
                {!!searchResult?.data && searchResult?.data.length > 0 ? (
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
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}
                      >
                        {strings.SEARCHED_RESULTS}
                      </Text>
                    </View>
                    {searchResult?.data.map((item, i) => {
                      console.log(item, "itemm");
                      return renderSearchItem(item);
                    })}
                  </View>
                ) : appData?.profile?.preferences?.is_static_dropoff ? null : (
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
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                        }}
                      >
                        {strings.NEARBY_LOCATION}
                      </Text>
                    </View>
                    {nearByAddressess.slice(0, 5).map((val) => {
                      return renderAddressess(val);
                    })}
                  </View>
                )}
              </ScrollView>
            </View>

            <View
              style={{
                marginTop: "auto",
                marginBottom: moderateScaleVertical(50),
              }}
            >
              {renderbtn()}
            </View>
          </View>

          <Modal
            onClose={onClose}
            mainViewStyle={{
              position: "absolute",
              top: 0,
              width: width,
              borderTopStartRadius: 0,
              borderTopRightRadius: 0,
            }}
            isVisible={showFriendListModal}
            modalMainContent={allListFriendModalContent}
            modalStyle={{
              marginHorizontal: moderateScaleVertical(0),
              marginVertical: moderateScale(0),
            }}
            animationIn="slideInDown"
            animationOut="slideOutDown"
          />
        </View>
      )}
    </WrapperContainer>
  );
}
