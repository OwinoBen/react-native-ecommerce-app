import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image, Platform, RefreshControl, SafeAreaView, ScrollView,
  StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import * as RNLocalize from 'react-native-localize';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE
} from 'react-native-maps';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import AddressModal3 from '../../../Components/AddressModal3';
import GradientButton from '../../../Components/GradientButton';
import Loader from '../../../Components/Loader';
import TaxiBannerHome from '../../../Components/TaxiBannerHome';
import TaxiHomeCategoryCard2 from '../../../Components/TaxiHomeCategoryCard2';
import WrapperContainer from '../../../Components/WrapperContainer';
import { google_map_key } from '../../../constants/constants';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  height,
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { mapStyleGrey } from '../../../utils/constants/MapStyle';
import { nearbySearch } from '../../../utils/googlePlaceApi';
import {
  showError,
  showSuccess
} from '../../../utils/helperFunctions';
import useInterval from '../../../utils/useInterval';
import stylesFunc from '../styles';

export default function TaxiDashboard({
  handleRefresh = () => { },
  isRefreshing = false,
  onPressCategory = () => { },
  location = {},
  curLatLong = {},
  currentLocation = {}
}) {
  const { bannerRef } = useRef();
  const mapRef = useRef();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { appData, currencies, themeColors, appStyle, languages, themeColor, themeToggle } = useSelector((state) => state?.initBoot || {});
  const { userData } = useSelector((state) => state?.auth || {});
  const { appMainData } = useSelector((state) => state?.home || {});

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });



  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    date: new Date(),
    allSavedAddress: [],
    isVisible: false,
    isVisible1: false,
    updateData: {},
    indicator: false,
    type: 'addAddress',
    newAddressAdded: null,
    isLoadingModal: false,
    fullMapShow: false,
    isVisibleAddressModal: false,
    pickupAddress: {},
    allListedDrivers: [],
  });

  const {
    slider1ActiveSlide,
    allSavedAddress,
    isVisible,
    date,
    isVisible1,
    updateData,
    indicator,
    type,
    del,
    isLoadingModal,
    fullMapShow,
    selectViaMap,
    allListedDrivers,
  } = state;
  const [searchType, setSearchType] = useState('')
  const [nearByPlacesByType, setNearByPlacesByType] = useState([])

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  useFocusEffect(
    React.useCallback(() => {
      if (!!userData?.auth_token) {
        getAllAddress();
      }
    }, []),
  );


  useEffect(() => {
    if (allListedDrivers && allListedDrivers?.length) {
      let arr = [];
      allListedDrivers?.map((i, inx) => {
        if (
          i &&
          i?.agentlog?.lat &&
          i?.agentlog?.lat != NaN &&
          i?.agentlog?.long != NaN
        ) {
          arr = [
            ...arr,
            {
              latitude: Number(i?.agentlog?.lat),
              longitude: Number(i?.agentlog?.long),
            },
          ];
        }
      });
      console.log('i am calling');
      // animate(region);
      fitPadding(arr);
    }
  }, []);

  useEffect(() => {
    if (!!userData?.auth_token) {
      getAllAddress();
    }
  }, [del]);


  useInterval(
    () => {
      if (location?.latitude && location?.longitude && userData?.auth_token) {
        getAllDrivers();
      }
    },
    isFocused ? 5000 : null,
  );



  const fitPadding = (newArray) => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([...newArray], {
        edgePadding: { top: 100, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  };

  const getAllDrivers = () => {
    actions
      .getAllNearByDrivers(
        {
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          allListedDrivers: res?.data,
        });
      })
      .catch((error) => {
        console.log(error, 'error>>>>>>>>>>>>>.drivers');
      });
  };

  //render marker on map with driver type

  const renderDriverTypeMarkes = (type) => {
    switch (type?.vehicle_type_id) {
      case 1:
        return imagePath.icmanMarker;
        break;
      case 2:
        return imagePath.iccycleMarker;
        break;
      case 3:
        return imagePath.icBikeMarker;
        break;
      case 4:
        return imagePath.icCar;
        break;
      case 5:
        return imagePath.ictruckMarker;
        break;
    }
  };

  const getAllAddress = () => {
    actions
      .getAddress(
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        if (res.data) {
          actions.saveAllUserAddress(res.data);
        }
        updateState({
          allSavedAddress: res.data,
          isLoading: false,
          indicator: false,
        });
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  const continueWithNaxtScreen = (item) => {
    onPressCategory(item);
  };


  const addUpdateLocation = (childData) => {
    //setModalVisible(false);
    updateState({ isLoading: true });

    actions
      .addAddress(childData, {
        code: appData?.profile?.code,
      })
      .then((res) => {
        console.log(res, 'res>res>res');
        updateState({ del: del ? false : true });
        showSuccess(res.message);
        setModalVisible(false);
      })
      .catch((error) => {
        updateState({ isLoading: false });
        showError(error?.message || error?.error);
      });
  };

  const openCloseMapAddress = (type) => {
    updateState({ selectViaMap: type == 1 ? true : false });
  };

  const setModalVisible = (visible, type, id, data) => {
    updateState({ selectViaMap: false });
    if (!!userData?.auth_token) {
      updateState({
        updateData: data,
        isVisible1: visible,
        type: type,
        selectedId: id,
      });
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };


  /********************************** instant booking funcationality module code starts here *****************************/



  /********************************** get list of vichales based on the vendor and category *********************/




  /********************** instunt order place api code written here ************************/


  const _onInstuntOrderPlace = () => {

    const vendorIdForInstuntBooking = appData?.profile?.preferences?.pick_drop_instant_booking_vendor?.id;
    const productIdForIstuntBooking = appData?.profile?.preferences?.pick_drop_instant_booking_vendor?.products[0]?.id
    const locationForOrder = [{ ...currentLocation, pre_address: currentLocation?.address, task_type_id: 1 }]
    const productSKu = appData?.profile?.preferences?.pick_drop_instant_booking_vendor?.products[0]?.sku

    let data = {};
    data['task_type'] = 'now';
    data['schedule_time'] = ''
    data['is_one_push_booking'] = 1;
    data['recipient_phone'] = '';
    data['recipient_email'] = '';
    data['task_description'] = '';
    data['amount'] = 0
    data['tags_amount'] = 0;
    data['tollamount'] = 0;
    data['servicechargeamount'] = 0;
    data['payment_option_id'] = 1;
    data['vendor_id'] = vendorIdForInstuntBooking;
    data['product_id'] = productIdForIstuntBooking;
    data['currency_id'] = currencies?.primary_currency?.id;
    data['tasks'] = locationForOrder;
    data['images_array'] = [];
    data['user_product_order_form'] = [];
    data["is_postpay"] = ''
    data["order_time_zone"] = RNLocalize.getTimeZone();
    data["bookingType"] = '';
    (data["friendName"] = '')


    actions
      .placeDelievryOrder(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {

        console.log("res+++++++", res)
        if (res && res?.status == 200) {
          let extraData = {
            orderId: res?.data?.id,
            fromVendorApp: true,
            selectedVendor: { id: vendorIdForInstuntBooking },
            orderDetail: res?.data,
            fromCab: true,
            pickup_taxi: navigationStrings.HOME,
            totalDuration: 0,
            selectedCarOption: productSKu,
          };
          navigation.navigate(
            navigationStrings.PICKUPTAXIORDERDETAILS,
            extraData
          );
        }
        showSuccess(res?.message)
      })
      .catch(errorMethod);

  }

  const errorMethod = (error) => {
    console.log(error, "<===error inErrorMethod");
    showError(error?.message || error?.error || error?.description);
  };

  const _renderItem = useCallback(({ item }) => {
    return (
      <TaxiHomeCategoryCard2 data={item} onPress={() => continueWithNaxtScreen(item)} />
    );
  }, [appMainData?.categories || []])


  const moveToScreen = (details, isFromSavedAddress = false) => {
    updateState({ fullMapShow: false });
    setTimeout(() => {
      if (!!userData?.auth_token) {
        let prefillAdress = null;
        if (!!details) {
          prefillAdress = {
            longitude: Number(details?.longitude),
            latitude: Number(details?.latitude),
            address: details?.address,
            task_type_id: 1,
            pre_address: details?.address,
            isFromSavedAddress: isFromSavedAddress
          };
        }
        actions.saveSchduleTime('now');
        goToAddress({ prefillAdress })
      } else {
        actions.setAppSessionData('on_login');
      }
    }, 800);
  };

  const addressView = (image) => {
    return (
      allSavedAddress &&
      allSavedAddress.map((itm, inx) => {
        return (
          <ScrollView
            key={String(inx)}
            keyboardShouldPersistTaps={'handled'}
            style={{ width: width }}>
            <TouchableOpacity
              key={inx}
              style={{ ...styles.savedPlaceTouc, paddingBottom: 0 }}
              onPress={() => moveToScreen(itm, true)}>
              <View
                style={styles.addressView}>
                <View>
                  <Image source={image} />
                </View>
                <View
                  style={{
                    marginHorizontal: moderateScale(10),
                  }}>
                  {!!itm?.street ? <Text
                    numberOfLines={2}
                    style={{
                      ...styles.addressTitle,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {itm?.street}
                  </Text> : null}
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.address,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {itm?.address}
                  </Text>
                </View>
              </View>
              <Image
                style={{
                  tintColor: colors.textGreyLight,

                }}
                source={imagePath.goRight}
              />
            </TouchableOpacity>
          </ScrollView>
        );
      })
    );
  };

  const savedPlaceView1 = (image) => {
    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} style={{ width: width }}>
        <TouchableOpacity
          style={styles.savedPlaceTouc}
          onPress={() => {
            actions.saveSchduleTime('now');
            userData?.auth_token
              ? navigation.navigate(navigationStrings.ADDADDRESS, {
                data: appMainData?.categories[0],
              })
              : actions.setAppSessionData('on_login');
          }}>
          <View
            style={styles.addressTxtBox}>
            <View>
              <Image source={image} />
            </View>
            <View style={{ marginHorizontal: moderateScale(10) }}>
              <Text
                numberOfLines={2}
                style={{
                  ...styles.address,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.CHOOSESAVEDPLACE}
              </Text>
            </View>
          </View>
          <Image
            style={{
              tintColor: colors.textGreyLight,
            }}
            source={imagePath.goRight}
          />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const onSearchType = (type) => {
    setSearchType(type)
    let locations = !!curLatLong?.latitude
      ? `${curLatLong.latitude},${curLatLong.longitude}`
      : `${location.latitude},${location.longitude}`

    nearbySearch(
      locations,
      appData?.profile?.preferences?.map_key || google_map_key,
      type,
    ).then((res) => {
      if (!isEmpty(res?.results)) {
        setNearByPlacesByType(res?.results)
      }
      else {
        showError("No near by places found!")
      }
    }).catch((err) => {
      console.log(err, "err>>>>>>err>")
    })
  }
  const goToAddress = ({
    fromMap = false,
    scheduleDate = null,
    prefillAdress = null
  }) => {
    let item = !!appMainData?.categories ? appMainData?.categories[0] : null
    actions.saveSchduleTime(!!scheduleDate ? scheduleDate : 'now');
    if (fromMap) {
      updateState({ fullMapShow: false })
      setTimeout(() => {
        userData?.auth_token
          ? navigation.navigate(navigationStrings.ADDADDRESS, {
            item,
            prefillAdress: !!prefillAdress ? prefillAdress : null,
          })
          : actions.setAppSessionData('on_login');
      }, 800);
    } else {
      userData?.auth_token
        ? navigation.navigate(navigationStrings.ADDADDRESS, {
          item,
          prefillAdress: !!prefillAdress ? prefillAdress : null,
        })
        : actions.setAppSessionData('on_login');
    }
  }

  const onDateSet = (date) => {
    updateState({
      isVisible: false,
      isLoadingModal: true,
    });
    setTimeout(() => {
      updateState({ isLoadingModal: false });
      goToAddress({ scheduleDate: date })
    }, 2000);
  }

  return (
    <WrapperContainer
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>

      <ScrollView
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1, zIndex: 1000, backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>

        <>
          <View
            style={styles.whereToBox}>
            <TouchableOpacity
              style={{
                ...styles.whereToTouch, color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
              onPress={() => goToAddress({ fromMap: false })}
            >
              <Text
                style={styles.whereToTxt}>
                {strings.WHERETO}
              </Text>
            </TouchableOpacity>
            {getBundleId() === appIds.appi ? null :
              <TouchableOpacity
                onPress={() => {
                  userData?.auth_token
                    ? updateState({
                      isVisible: true,
                    })
                    : actions.setAppSessionData('on_login');
                }}
                style={{
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image source={imagePath.clock} />
                  <Text style={{ marginHorizontal: moderateScale(5) }}>
                    {strings.NOW}
                  </Text>
                  <Image
                    source={imagePath.ic_down_arrow}
                  />
                </View>
              </TouchableOpacity>}
          </View>

          {!isEmpty(allSavedAddress) && userData?.auth_token ? (
            <></>
          ) : (
            <TouchableOpacity
              style={styles.addNewAddressTouch}
              onPress={() => {
                userData?.auth_token
                  ? setModalVisible(true, 'addAddress')
                  : actions.setAppSessionData('on_login');
              }}>
              <View
                style={styles.addressTxtBox}>
                <Image source={imagePath.plushRoundedBackground} />
                <View style={{ marginLeft: moderateScale(10) }}>
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.addressTitle,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {strings.ADD_NEW_ADDRESS}
                  </Text>
                </View>
              </View>
              <Image
                style={{
                  tintColor: colors.textGreyLight,
                }}
                source={imagePath.goRight}
              />
            </TouchableOpacity>
          )}
          <View
            style={styles.savedAddressView}>
            {addressView(imagePath.locationRoundedBackground)}
            {/* {savedPlaceView1(imagePath.starRoundedBackground)} */}
          </View>
          <Text style={styles.suggestionTxt}>{strings.SUGGESTIONS}</Text>
          <FlatList
            horizontal={getBundleId() == appIds.hezniTaxi ? false : true}
            data={appMainData?.categories || []}
            numColumns={getBundleId() == appIds.hezniTaxi ? 3 : null}
            style={{
              marginVertical: moderateScaleVertical(10),
            }}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => !!item?.id ? String(item.id) : String(index)}
            renderItem={_renderItem}
            ItemSeparatorComponent={() => (
              <View style={{ marginRight: moderateScale(20) }} />
            )}
            ListHeaderComponent={() => (
              <View style={{ marginLeft: moderateScale(12) }} />
            )}
            ListFooterComponent={() => (
              <View style={{ marginRight: moderateScale(12) }} />
            )}
          />
          <TaxiBannerHome
            appStyle={appStyle}
            bannerRef={bannerRef}
            slider1ActiveSlide={slider1ActiveSlide}
            bannerData={[...appData?.mobile_banners]}
            sliderWidth={sliderWidth + 20}
            itemWidth={itemWidth + 20}
            onSnapToItem={(index) => updateState({ slider1ActiveSlide: index })}
            cardViewStyle={{
              width: width - moderateScale(32)
            }}
          // onPress={(item) => bannerPress(item)}
          />



          <View style={{ marginHorizontal: moderateScale(12), marginTop: moderateScaleVertical(20) }}>
            <Text
              style={{
                fontSize: textScale(14),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.AROUNDYOU}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: height / 4.5,
                borderRadius: moderateScale(6),
                marginTop: moderateScaleVertical(20),
                alignItems: 'center',
                overflow: "hidden"
              }}
              onPress={() => updateState({ fullMapShow: true })}>
              {
                <MapView
                  pointerEvents='none'
                  scrollEnabled={false}
                  ref={mapRef}
                  provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                  // customMapStyle={mapStyleGrey}
                  style={{
                    ...StyleSheet.absoluteFillObject,

                  }}
                  // provider={MapView.PROVIDER_GOOGLE}

                  region={{
                    latitude: !!curLatLong?.latitude
                      ? parseFloat(curLatLong?.latitude)
                      : !!location?.latitude
                        ? parseFloat(location?.latitude)
                        : 30.733315,
                    longitude: !!curLatLong?.longitude
                      ? parseFloat(curLatLong?.longitude)
                      : !!location?.longitude
                        ? parseFloat(location?.longitude)
                        : 76.779419,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                  // initialRegion={region}
                  showsUserLocation={true}
                //showsMyLocationButton={true}
                // pointerEvents={'none'}
                >

                  {!isEmpty(nearByPlacesByType) && searchType !== '' ? nearByPlacesByType?.map((item, index) => {
                    return (
                      <Marker
                        key={String(index)}
                        coordinate={{
                          latitude: item?.geometry?.location?.lat,
                          longitude: item?.geometry?.location?.lng,
                          latitudeDelta: 0.015,
                          longitudeDelta: 0.0121,
                        }}

                      />
                    )
                  }) : <Marker
                    coordinate={{
                      latitude: !!curLatLong?.latitude
                        ? parseFloat(curLatLong?.latitude)
                        : !!location?.latitude
                          ? parseFloat(location?.latitude)
                          : 30.733315,
                      longitude: !!curLatLong?.longitude
                        ? parseFloat(curLatLong?.longitude)
                        : !!location?.longitude
                          ? parseFloat(location?.longitude)
                          : 76.779419,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}
                  />}

                </MapView>
              }
            </TouchableOpacity>

            {!!userData?.auth_token && !!appData?.profile?.preferences?.is_one_push_book_enable &&
              !!appData?.profile?.preferences?.pick_drop_instant_booking_vendor?.id &&
              <GradientButton containerStyle={{
                marginHorizontal: moderateScale(10),
                marginTop: moderateScaleVertical(20)
              }} btnText={'Instant Now'}
                onPress={_onInstuntOrderPlace} />
            }

          </View>
        </>

        <Loader isLoading={isLoadingModal} />

        {getBundleId() == appIds.hezniTaxi && <View style={{
          marginTop: moderateScaleVertical(10),
          marginHorizontal: moderateScale(15),
          flexDirection: "row",
          alignItems: "center",
        }}>
          <TouchableOpacity onPress={() => onSearchType("hotel")} style={{
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Image source={searchType == "hotel" ? imagePath.radioActive : imagePath.radioInActive} />
            <Text style={{
              fontFamily: fontFamily?.bold,
              marginLeft: moderateScale(4),
              fontSize: textScale(17)
            }}>Hotel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onSearchType("airport")} style={{
            marginLeft: moderateScale(40),
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Image source={searchType == "airport" ? imagePath.radioActive : imagePath.radioInActive} />
            <Text style={{
              fontFamily: fontFamily?.bold,
              marginLeft: moderateScale(4),
              fontSize: textScale(17)
            }}>Airport</Text>
          </TouchableOpacity>
        </View>}

        <View>
          <DatePicker
            modal
            open={isVisible}
            date={date}
            locale={
              languages?.primary_language?.sort_code
                ? languages?.primary_language?.sort_code
                : "en"
            }
            mode="datetime"
            textColor={isDarkMode ? colors.black : colors.blackB}
            minimumDate={new Date()}
            style={{
              width: width - 20,
              height: height / 4.4,
            }}
            onConfirm={date => onDateSet(date)}
            onCancel={() => updateState({ isVisible: false })}
          />
        </View>
        <View style={{ height: moderateScaleVertical(95) }} />
      </ScrollView>
      <AddressModal3
        navigation={navigation}
        updateData={updateData}
        isVisible={isVisible1}
        indicator={indicator}
        onClose={() => setModalVisible(!isVisible1)}
        type={type}
        passLocation={(data) => addUpdateLocation(data)}
        selectViaMap={selectViaMap}
        openCloseMapAddress={openCloseMapAddress}
        constCurrLoc={location}
      />


      <Modal
        isVisible={fullMapShow}
        style={{
          margin: 0,
        }}
        animationInTiming={600}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <MapView
              ref={mapRef}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
              // customMapStyle={mapStyleGrey}
              customMapStyle={
                appIds.cabway == DeviceInfo.getBundleId() ? null : mapStyleGrey
              }
              style={{ ...StyleSheet.absoluteFillObject }}
              region={{
                latitude: !!curLatLong?.latitude
                  ? parseFloat(curLatLong?.latitude)
                  : !!location?.latitude
                    ? parseFloat(location?.latitude)
                    : 30.7333,
                longitude: !!curLatLong?.longitude
                  ? parseFloat(curLatLong?.longitude)
                  : !!location?.longitude
                    ? parseFloat(location?.longitude)
                    : 76.7794,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
              // initialRegion={region}
              showsUserLocation={true}
            // onRegionChangeComplete={_onRegionChange}
            // showsMyLocationButton={true}
            // pointerEvents={'none'}
            >
              {allListedDrivers?.map((coordinate, index) => {
                return (
                  <Marker.Animated
                    // tracksViewChanges={agent_location == null}
                    coordinate={{
                      latitude: Number(coordinate?.agentlog?.lat),
                      longitude: Number(coordinate?.agentlog?.long),
                    }}>
                    <Image
                      style={{
                        zIndex: 99,
                        // height:46,
                        // width: 32,
                        transform: [
                          {
                            rotate: `${Number(
                              coordinate?.agentlog?.heading_angle
                                ? coordinate?.agentlog?.heading_angle
                                : 0,
                            )}deg`,
                          },
                        ],
                      }}
                      source={renderDriverTypeMarkes(coordinate)}
                    />
                  </Marker.Animated>
                );
              })}
            </MapView>
            <SafeAreaView>
              <TouchableOpacity
                onPress={() => updateState({ fullMapShow: false })}
                style={{
                  marginTop: moderateScaleVertical(24),
                  height: moderateScale(40),
                  width: moderateScale(40),
                  borderRadius: moderateScale(16),
                  backgroundColor: colors.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: moderateScale(24),
                }}>
                <Image
                  style={{
                    tintColor: colors.black,
                  }}
                  source={imagePath.backArrowCourier}
                />
              </TouchableOpacity>
            </SafeAreaView>
          </View>
          <View
            style={{
              height: moderateScale(100),
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.background
                : colors.white,
            }}>
            <SafeAreaView>
              <TouchableOpacity
                onPress={() => goToAddress({ fromMap: true })}
                style={{
                  height: moderateScale(48),
                  backgroundColor: isDarkMode
                    ? colors.whiteOpacity15
                    : colors.greyNew,
                  justifyContent: 'center',
                  paddingHorizontal: moderateScale(16),
                  margin: moderateScale(16),
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(16),
                    textAlign: 'left',
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {strings.WHERETO}
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
}
