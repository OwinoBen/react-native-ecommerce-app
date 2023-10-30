import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Image,
  Keyboard,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Platform
} from "react-native";
import { useSelector } from "react-redux";
import WrapperContainer from "../../../Components/WrapperContainer";
import imagePath from "../../../constants/imagePath";
import strings from "../../../constants/lang";
import actions from "../../../redux/actions";
import colors from "../../../styles/colors";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import DeviceInfo, { getBundleId } from "react-native-device-info";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps"; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from "react-native-maps-directions";
import {
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
  showSuccess,
} from "../../../utils/helperFunctions";
import stylesFunc from "./styles";
import { cloneDeep, isEmpty } from "lodash";
import Communications from "react-native-communications";
import { useDarkMode } from "react-native-dynamic";
import FastImage from "react-native-fast-image";
import Modal from "react-native-modal";
import navigationStrings from "../../../navigation/navigationStrings";
import { MyDarkTheme } from "../../../styles/theme";
import useInterval from "../../../utils/useInterval";
import moment from "moment";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import StarRating from "react-native-star-rating";
import ButtonWithLoader from "../../../Components/ButtonWithLoader";
import CustomCallouts from "../../../Components/CustomCallouts";
import LeftRightText from "../../../Components/LeftRightText";
import RoundImg from "../../../Components/RoundImg";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  height,
  width
} from "../../../styles/responsiveSize";
import { tokenConverterPlusCurrencyNumberFormater } from "../../../utils/commonFunction";
import { appIds } from "../../../utils/constants/DynamicAppKeys";
import { mapStyleGrey } from "../../../utils/constants/MapStyle";
import SearchDriver from "../ChooseCarTypeAndTime/SearchDriver";

import { enableFreeze } from "react-native-screens";
enableFreeze(true);


const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const CANCLE_TASK_TIME = 45000;
// import 'moment/locale/fr';
// import 'moment/locale/ar';
// import 'moment/locale/de';
// import 'moment/locale/es';
// import 'moment/locale/hi';
// import 'moment/locale/pt';
// import 'moment/locale/ru';
// import 'moment/locale/sv';
// import 'moment/locale/tr';
// import 'moment/locale/vi';
// import 'moment/locale/ar';
import 'moment-timezone';
import 'moment/min/locales'; // Import all moment-locales -- it's just 400kb
import GradientButton from '../../../Components/GradientButton';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import CircularProfileLoader from '../../../Components/Loaders/CircularProfileLoader';
import Header from '../../../Components/Header';
import BidAcceptRejectCard from "../../../Components/Loaders/BidAcceptRejectCard";

function PickupTaxiOrderDetail({ navigation, route }) {
  const { themeColor, themeToggle } = useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const paramData = route?.params;

  console.log(paramData, 'paramDataparamDataparamData');

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [state, setState] = useState({
    isLoading: true,
    region: {
      latitude: 30.7191,
      longitude: 76.8107,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    },
    coordinate: {},
    tasks: [],
    agent_location: null,
    agent_image: null,
    orderDetail: null,
    showOrderDetailView: false,
    driverStatus: null,
    productInfo: [],
    isShowRating: false,
    getDispatchId: null,
    isVisible: false,
    driverRating: 0,
    orderStatus: "",
    labels: [
      "Accepted",
      "Arrival",
      strings.OUT_FOR_DELIVERY,
      strings.DELIVERED,
    ],
    orderFullDetail: null,
    showModal: false,
    hideShowBack: 0,
    selectedImg: "",
    baseUrl: "",
    isCancleModal: false,
    reason: "",
    isBtnLoader: false,
    cancelError: null,
    isWaitingOver: false,
    submitedRatingToDriver: 0,
    driverRatingData: null,
    orderCancelMessage: "",
  });
  const {
    isLoading,
    region,
    coordinate,
    orderDetail,
    tasks,
    agent_location,
    agent_image,
    showOrderDetailView,
    driverStatus,
    order_vendor_product_id,
    order_id,
    orderRootId,
    productId,
    productInfo,
    isShowRating,
    getDispatchId,
    isVisible,
    driverRating,
    labels,
    orderStatus,
    orderFullDetail,
    showModal,
    hideShowBack,
    selectedImg,
    baseUrl,
    isCancleModal,
    reason,
    isBtnLoader,
    cancelError,
    isWaitingOver,
    submitedRatingToDriver,
    driverRatingData,
    orderCancelMessage,
  } = state;
  const [allDriversList, setAllDriversList] = useState([])
  const [bidExpiryDuration, setBidExpiryDuration] = useState(0)
  const [bidBookModalVisible, setBidBookModalVisible] = useState(false)

  const [
    finalCollectionOfLocationsForPickAndDrop,
    setFinalCollectionOfLocationsForPickAndDrop,
  ] = useState([]);
  const [
    allLocationsLatLongCollection,
    setAllLocationsLatLongCollection,
  ] = useState([]);
  const [showLocationUpdateButton, setShowLocationUpdateButton] = useState(
    true
  );
  const [
    allDropOffLocationCollection,
    setAllDropOffLocationCollection,
  ] = useState([]);



  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot || {}
  );
  const {
    additional_preferences,
    digit_after_decimal,
  } = appData?.profile?.preferences || {};
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef(null);
  const { profile } = appData || {};
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, isDarkMode, MyDarkTheme });
  const mapRef = useRef();

  useEffect(() => {
    if (paramData?.showLocationUpdateButton) {
      setShowLocationUpdateButton(paramData?.showLocationUpdateButton)
    }
  }, [paramData])

  const moveToNewScreen = (screenName, data = {}) => () => {
    navigation.navigate(screenName, { data });
  };

  const urlValue = `/pickup-delivery/order-tracking-details`;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      (event) => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  //dropLocationChangeFuncationality

  useEffect(() => {
    if (!isEmpty(paramData?.orderDropLocations)) {
      _onDropOffLocationChangeData();
    }
  }, [paramData, orderFullDetail?.tasks]);

  const _onDropOffLocationChangeData = () => {
    if (!isEmpty(paramData?.orderDropLocations)) {
      const userPickupLocation = orderFullDetail?.tasks?.filter(
        (item, index) => {
          return item?.task_type_id == 1;
        }
      );

      const userDropLocation = paramData?.orderDropLocations?.filter(
        (item, index) => {
          return item?.task_type_id != 1;
        }
      );

      const newFormatedPickupAddress = userPickupLocation.map((item, index) => {
        return {
          address: item?.address,
          latitude: Number(item?.latitude),
          longitude: Number(item?.longitude),
          pre_address: item?.address,
          task_type_id: item?.task_type_id,
          post_code: item?.post_code,
          short_name: item?.short_name,
          task_status: Number(item?.task_status),
        };
      });
      const newFormatedDropAddress = userDropLocation.map((item, index) => {
        return {
          address: item?.address,
          latitude: Number(item?.latitude),
          longitude: Number(item?.longitude),
          pre_address: item?.address,
          task_type_id: item?.task_type_id,
          post_code: item?.post_code,
          short_name: item?.short_name,
          task_status: Number(item?.task_status),
        };
      });

      const finalCollectionOfLocationsForPickAndDrop = [
        ...newFormatedPickupAddress,
        ...newFormatedDropAddress,
      ];

      const allLocationsLatLongCollection = finalCollectionOfLocationsForPickAndDrop.map(
        (item, index) => {
          return { latitude: item?.latitude, longitude: item?.longitude };
        }
      );

      setFinalCollectionOfLocationsForPickAndDrop(
        finalCollectionOfLocationsForPickAndDrop
      );

      const allDropOffLocationsBeforeProcessing = newFormatedDropAddress.filter(
        (item, index) => {
          return item?.task_status < 2;
        }
      );
      setAllLocationsLatLongCollection(allLocationsLatLongCollection);
      setAllDropOffLocationCollection(allDropOffLocationsBeforeProcessing);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     //   updateState({isLoading: true});
  //     if (!!userData?.auth_token) {
  //       // let url = paramData?.orderDetail?.dispatch_traking_url
  //       //   ? (paramData?.orderDetail?.dispatch_traking_url).replace(
  //       //       '/order/',
  //       //       '/order-details/',
  //       //     )
  //       //   : null;
  //       let url = `/pickup-delivery/order-tracking-details`;

  //       if (url) {
  //         _getOrderDetailScreen(url);
  //       } else {
  //         updateState({ isLoading: false });
  //       }
  //     } else {
  //       showError(strings.UNAUTHORIZED_MESSAGE);
  //     }
  //   }, [currencies, languages, paramData]),
  // );

  useEffect(() => {
    if (urlValue) {
      _updateDriverLocationLocation(urlValue);
    } else {
      updateState({ isLoading: false });
    }
  }, []);

  useInterval(
    () => {
      if (urlValue) {
        _updateDriverLocationLocation(urlValue);
        _onOrderBidRideDetails()

      } else {
        updateState({ isLoading: false });
      }
    },
    isFocused && orderStatus != "completed" ? 5000 : null
  );



  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);


  // *********************************** biding and instant booking funcationality implemented here ***************/


  const _onOrderBidRideDetails = () => {
    const data = {
      order_id: !!paramData?.orderId ? paramData?.orderId : null,
      task_type: 'instant_booking'
    }

    const headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }

    actions.orderRideBidDetails(data, headerData).then((res) => {
      console.log(res, "response for bid ride");
      setAllDriversList(res?.data?.biddata)
      setBidExpiryDuration(Number(res?.data?.bid_expire_time_limit_seconds))
      if (!isEmpty(res?.data?.biddata)) {
        setBidBookModalVisible(true)
      } else {
        setBidBookModalVisible(false)
      }
    }).catch((error) => {
      console.log(error, "error in this api orderRideBidDetails");
    })
  }






  const _onDeclineRideBid = (id) => {
    const apiData = {
      bid_id: id
    }
    const headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }

    console.log(id, headerData, "decline bif funcation called");
    actions.declineRideBid(apiData, headerData).then((res) => {
      console.log(res, "resposen bid decline");
      _onOrderBidRideDetails()
    }).catch((error) => {
      console.log(error, "errororororor for bide decline");
    })
  }



  const _onAcceptRideBid = (id) => {
    const apiData = {
      order_id: !!paramData?.orderId ? paramData?.orderId : null,
      bid_id: id,
      task_type: 'instant_booking'
    }
    const headerData = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }

    console.log(apiData, headerData, "accept bif funcation called");
    actions.acceptRideBid(apiData, headerData).then((res) => {
      console.log(res, "resposen bid Accepted");
      _onOrderBidRideDetails()
      setBidBookModalVisible(false)
      _updateDriverLocationLocation(urlValue);
    }).catch((error) => {
      console.log(error, "errororororor for bide accept");
    })
  }






  // *********************************** biding and instant booking funcationality Ends here ***************/






  useEffect(() => {
    // console.log('driverStatus', driverStatus);
    if (
      driverStatus != "" &&
      driverStatus != null &&
      driverStatus != undefined
    ) {
      // console.log(driverStatus, 'driverStatus');
      if (orderStatus === "completed") {
        showSuccess(driverStatus);
        updateState({
          isShowRating: true,
          isVisible: true,
        });
      }
      // showSuccess(driverStatus);
    }
  }, [driverStatus]);

  const new_dispatch_traking_url = !!paramData?.orderDetail
    ?.dispatch_traking_url
    ? (paramData?.orderDetail?.dispatch_traking_url).replace(
      "/order/",
      "/order-details/"
    )
    : null;
  /*********Update driver detail screen********* */
  const _updateDriverLocationLocation = async (url) => {
    let apiData = {
      order_id: !!paramData?.orderId ? paramData?.orderId : null,
      new_dispatch_traking_url: !!new_dispatch_traking_url
        ? new_dispatch_traking_url
        : null,
    };
    if (!!paramData?.orderId || !!new_dispatch_traking_url) {
      console.log(apiData, "apiData>?");
      try {
        const res = await actions.getOrderDetailPickUp(apiData, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        });
        console.log(res, "res---agent>>>>");

        if (!!res?.data) {

          updateState({
            agent_location: res?.data?.agent_location,
            orderDetail: res?.data?.order,
            agent_image: res?.data?.agent_image,
            driverStatus: res?.data?.order_details?.dispatcher_status,
            getDispatchId: res?.data?.order?.id,
            driverRating: res?.data?.avgrating,
            orderStatus: res?.data?.order?.status,
            baseUrl: res?.data?.base_url,
            isLoading: false,
            orderFullDetail: res?.data,
            region: {
              latitude: res?.data?.tasks[0]?.latitude
                ? Number(res?.data?.tasks[0].latitude)
                : 30.7191,
              longitude: res?.data?.tasks[0]?.longitude
                ? Number(res?.data?.tasks[0].longitude)
                : 76.8107,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            coordinate: {
              latitude: res?.data?.tasks[0]?.latitude
                ? Number(res?.data?.tasks[0].latitude)
                : 30.7191,
              longitude: res?.data?.tasks[0]?.longitude
                ? Number(res?.data?.tasks[0].longitude)
                : 76.8107,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            showOrderDetailView: true,
            isShowRating:
              res?.data?.order?.status == "completed" ? true : false,
            productInfo: res?.data?.order_details?.products,
            tasks: res?.data?.tasks,
          });




        }
      } catch (error) {
        updateState({
          isLoading: false,
          isLoading: false,
          isLoadingC: false,
          isCancleModal: false,
          isBtnLoader: false,
          cancelError: null,
        });
        console.log("error raised", error);
        // showError(error?.message || error?.error);
      }
    }
  };

  console.log(agent_location, "agent_location");

  useEffect(() => {
    if (!isLoading && orderStatus == "unassigned") {
      setTimeout(() => {
        updateState({
          isWaitingOver: true,
        });
      }, CANCLE_TASK_TIME);
    }
  }, [isLoading]);

  // /*********Get order detail screen********* */
  // const _getOrderDetailScreen = (url) => {
  //   actions
  //     .getOrderDetailPickUp(
  //       {
  //         order_id: paramData?.orderId,
  //         new_dispatch_traking_url: new_dispatch_traking_url,
  //       },
  //       {
  //         code: appData?.profile?.code,
  //         currency: currencies?.primary_currency?.id,
  //         language: languages?.primary_language?.id,
  //         // systemuser: DeviceInfo.getUniqueId(),
  //       }
  //     )
  //     .then((res) => {
  //       console.log(res, "ressssssss");
  //       // console.log(res, 'agent location2');
  //       // if (JSON.stringify(tasks) !== JSON.stringify(res?.data?.tasks)) {
  //       updateState({
  //         tasks: res?.data?.tasks,
  //       });
  //       // }

  //       updateState({
  //         isLoading: false,
  //         orderFullDetail: res?.data,
  //         baseUrl: res?.data?.base_url,
  //         region: {
  //           latitude: res?.data?.tasks[0]?.latitude
  //             ? Number(res?.data?.tasks[0].latitude)
  //             : 30.7191,
  //           longitude: res?.data?.tasks[0]?.longitude
  //             ? Number(res?.data?.tasks[0].longitude)
  //             : 76.8107,
  //           latitudeDelta: LATITUDE_DELTA,
  //           longitudeDelta: LONGITUDE_DELTA,
  //         },
  //         coordinate: {
  //           latitude: res?.data?.tasks[0]?.latitude
  //             ? Number(res?.data?.tasks[0].latitude)
  //             : 30.7191,
  //           longitude: res?.data?.tasks[0]?.longitude
  //             ? Number(res?.data?.tasks[0].longitude)
  //             : 76.8107,
  //           latitudeDelta: LATITUDE_DELTA,
  //           longitudeDelta: LONGITUDE_DELTA,
  //         },
  //         showOrderDetailView: true,
  //         agent_location: res?.data?.agent_location,
  //         orderDetail: res?.data?.order,
  //         agent_image: res?.data?.agent_image,
  //         driverStatus: res?.data?.order_details?.dispatcher_status,
  //         isShowRating: res?.data?.order?.status == "completed" ? true : false,
  //         productInfo: res?.data?.order_details?.products,
  //       });
  //     })
  //     .catch(errorMethod);
  // };

  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoading: false,
      isLoadingC: false,
      isCancleModal: false,
      isBtnLoader: false,
      cancelError: null,
    });
    console.log("error raised", error);
    // showError(error?.message || error?.error);
  };
  const _onRegionChange = (region) => {
    updateState({ region: region });
    // _getAddressBasedOnCoordinates(region);
    // animate(region);
  };

  //   on press call
  const _onPressCall = (orderDetail) => {
    // alert("123")
    Communications.phonecall(orderDetail?.phone_number, true);
  };

  const _giveRatingToProduct = (productDetail, rating) => {
    let data = {};
    data["order_vendor_product_id"] = productDetail?.id;
    data["order_id"] = productDetail?.order_id;
    data["product_id"] = productDetail?.product_id;
    data["rating"] = rating;
    data["review"] = productDetail?.product_rating?.review
      ? productDetail?.product_rating?.review
      : "";

    actions
      .giveRating(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        // console.log(res, 'resresresresres');
        let cloned_productInfo = cloneDeep(productInfo);
        // console.log(cloned_productInfo, 'cloned_productInfo');
        console.log(res.data, "res.data");
        updateState({
          isLoading: false,
          productInfo: cloned_productInfo.map((itm, inx) => {
            if (itm?.product_id == productDetail?.product_id) {
              itm.product_rating = res.data;
              return itm;
            } else {
              return itm;
            }
          }),
        });
      })
      .catch(errorMethod);
  };

  // on press chat
  const _onPressChat = (orderDetail) => {
    Communications.text(orderDetail?.phone_number);
  };

  const onStarRatingPress = (productData, rating) => {
    _giveRatingToProduct(productData, rating);
  };

  const onStarRatingForDriverPress = (rating) => {
    const data = {
      order_id: productInfo[0]?.order_id,
      rating: rating,
      review: "",
    };

    console.log(data, "dataaaaa for driver");
    actions
      .ratingToDriver(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        updateState({
          isLoading: false,
          submitedRatingToDriver: res?.data?.rating,
          driverRatingData: res?.data,
        });
        console.log("res++++++", res);
      })
      .catch(errorMethod);
  };

  const dialCall = (number, type = "phone") => {
    type === "phone"
      ? Communications.phonecall(number.toString(), true)
      : Communications.text(number.toString());
  };
  const _modalClose = () => {
    updateState({
      isVisible: false,
    });
  };
  const rateYourOrder = (item) => {
    updateState({
      isLoading: true,
    });
    _updateDriverLocationLocation()
      .then((res) => {
        updateState({
          isVisible: false,
          isLoading: false,
        });
        navigation.navigate(navigationStrings.RATEORDER, { item });
      })
      .catch((error) => {
        updateState({
          isVisible: false,
          isLoading: false,
        });
      });
  };

  const viewDriverStatus = () => {
    switch (orderFullDetail?.order.status) {
      case "completed":
        return strings.COMPLETE;
        break;
      case "assigned":
        return strings.ASSIGNED;
        break;
      case "unassigned":
        return strings.UNASSIGNED;
        break;
      case "arrived":
        return strings.ARRIVED;
        break;
      default:
        break;
    }
  };

  //dropLocationChangeAfterOrderPlace

  const _onDropLocationChangeAfterOrderPlace = () => {
    updateState({
      isLoading: true,
    });

    const apiData = {
      order_number: orderFullDetail?.order?.order_number,
      locations: allLocationsLatLongCollection,
      tasks: finalCollectionOfLocationsForPickAndDrop,
      task_type: orderFullDetail?.scheduled_date_time
        ? orderFullDetail?.scheduled_date_time
        : "now",
      tasks_dropoff: allDropOffLocationCollection,
    };

    const apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    };

    console.log(apiData, "apiData>>>>>>>>>>");
    actions
      .dropLocationChangeAfterOrderPlace(apiData, apiHeader)
      .then((res) => {
        showSuccess(res?.message);
        _updateDriverLocationLocation();
        setShowLocationUpdateButton(false);
      })
      .catch(errorMethod);
  };

  const _ModalMainView = () => {
    // console.log('checking isShowRating', !!isShowRating);
    return (
      <View
        style={{
          // height: height / 5,
          backgroundColor: colors.white,
          alignItems: "center",
          borderRadius: moderateScale(10),
        }}
      >
        <TouchableOpacity
          onPress={_modalClose}
          style={{ position: "absolute", right: 0, top: 0 }}
        >
          <Image source={imagePath.cross} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: textScale(16),
            fontFamily: fontFamily?.bold,
            marginTop: moderateScaleVertical(20),
          }}
        >
          Rate the product
        </Text>
        {!!isShowRating && (
          <ScrollView horizontal>
            {productInfo?.map((item, index) => {
              console.log(item, "itemtmetmetmet");
              return (
                <View style={{ marginVertical: moderateScaleVertical(20) }}>
                  <View
                    style={{
                      width: moderateScale(width - 50),
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: moderateScale(10),
                    }}
                  >
                    <Image
                      style={{
                        resizeMode: "contain",
                        height: moderateScale(60),
                        width: moderateScale(60),

                        borderRadius: moderateScale(30),
                      }}
                      source={{
                        uri: getImageUrl(
                          item.image.proxy_url,
                          item.image.image_path,
                          "150/150"
                        ),
                        priority: FastImage.priority.high,
                      }}
                    />

                    <View
                      style={{
                        // marginTop: moderateScaleVertical(-30),
                        marginHorizontal: moderateScale(10),
                      }}
                    >
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        rating={item?.product_rating?.rating}
                        selectedStar={(rating) =>
                          onStarRatingPress(item, rating)
                        }
                        fullStarColor={colors.ORANGE}
                        starSize={30}
                      />
                    </View>
                  </View>
                  <GradientButton
                    colorsArray={[
                      themeColors.primary_color,
                      themeColors.primary_color,
                    ]}
                    textStyle={{
                      textTransform: "none",
                      fontSize: textScale(16),
                    }}
                    onPress={() => rateYourOrder(item)}
                    marginTop={moderateScaleVertical(10)}
                    marginBottom={moderateScaleVertical(10)}
                    btnText={strings.WRITE_A_REVIEW}
                    btnStyle={{ width: "80%" }}
                  />
                </View>
              );
            })}
          </ScrollView>
        )}

        <View style={{ marginVertical: moderateScaleVertical(10) }}>
          <Text
            style={{
              fontSize: textScale(16),
              fontFamily: fontFamily?.bold,
              alignSelf: "center",
            }}
          >
            Rate the driver
          </Text>
          <View
            style={{
              width: moderateScale(width - 50),
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: moderateScale(20),
            }}
          >
            <Image
              style={{
                height: moderateScale(60),
                width: moderateScale(60),
                borderRadius: moderateScale(30),
              }}
              source={{
                uri: agent_image,
                priority: FastImage.priority.high,
              }}
            />

            <View
              style={{
                // marginTop: moderateScaleVertical(-30),
                marginHorizontal: moderateScale(10),
              }}
            >
              <StarRating
                disabled={false}
                maxStars={5}
                rating={1}
                selectedStar={(rating) => onStarRatingForDriverPress(rating)}
                fullStarColor={colors.ORANGE}
                starSize={30}
              />
            </View>
          </View>
          <View>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={{
                textTransform: "none",
                fontSize: textScale(16),
              }}
              onPress={() =>
                rateYourOrder({
                  order_id: productInfo[0]?.order_id,
                  isDriverRate: true,
                })
              }
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.WRITE_A_REVIEW}
              btnStyle={{ width: "80%" }}
            />
          </View>
        </View>
      </View>
    );
  };

  //order detail View
  // const _selectOrderDetailView = () => {
  //   return (
  //     <TaxiOrderDetailView
  //       // orderDetail={orderDetail}
  //       isLoading={isLoading}
  //       // agent_image={agent_image}
  //       // agent_location={agent_location}
  //       // productDetail={paramData?.orderDetail}
  //       onPressCall={(orderDetail) => _onPressCall(orderDetail)}
  //       onPressChat={(orderDetail) => _onPressChat(orderDetail)}
  //     />
  //   );
  // };

  // const _selectTexiOrderDetailView = () => {
  //   return (
  //     <SearchingForDriverView
  //       orderDetail={orderDetail}
  //       isLoading={isLoading}
  //       agent_image={agent_image}
  //       agent_location={agent_location}
  //       productDetail={paramData?.orderDetail}
  //       onPressCall={(orderDetail) => _onPressCall(orderDetail)}
  //       onPressChat={(orderDetail) => _onPressChat(orderDetail)}
  //       totalDuration={paramData?.totalDuration}
  //       selectedCarOption={paramData?.selectedCarOption}
  //       productRatings={productInfo}
  //       isShowRating={isShowRating}
  //       navigation={navigation}
  //       onStarRatingPress={onStarRatingPress}
  //       driverRating={driverRating}
  //     />
  //   );
  // };

  const offset = useRef(new Animated.Value(0)).current;

  const bottomSheetHeader = () => {
    if (!!orderFullDetail) {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: moderateScale(42),
            justifyContent: "space-between",
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                opacity: 0,
              }}
              source={imagePath.backArrowCourier}
            />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: isDarkMode
                ? colors.whiteOpacity77
                : colors.black,
              width: moderateScale(40),
              height: moderateScale(4),
              marginRight: moderateScale(34),
            }}
          />
          <Text />
        </View>
      );
    } else {
      return <View />;
    }
  };

  const onCenter = () => {
    let cords = orderFullDetail.tasks.map((val) => {
      return {
        latitude: Number(val?.latitude),
        longitude: Number(val?.longitude),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    }, []);
    mapRef.current.fitToCoordinates(cords, {
      edgePadding: {
        right: moderateScale(20),
        bottom: moderateScale(40),
        left: moderateScale(20),
        top: moderateScale(40),
      },
    });
  };


  const hideModal = () => {
    updateState({
      isCancleModal: false,
      cancelError: null,
      orderCancelMessage: "",
      reason: "",
    });
  };

  const onCancelOrder = (reasonForCancle) => {
    if (reason == "" && !reasonForCancle) {
      updateState({
        cancelError:
          strings.PLEASE_ENTER +
          strings.CANCELLATION_REASON.toLocaleLowerCase(),
      });
      // alert(
      //   `${
      //     strings.PLEASE_ENTER
      //   }${strings.CANCELLATION_REASON.toLocaleLowerCase()}`,
      // );
      return;
    }

    updateState({ isBtnLoader: true, cancelError: null });

    const apiData = {
      order_id: paramData?.orderId,
      vendor_id: paramData?.selectedVendor?.id,
      reject_reason: !!reasonForCancle ? reasonForCancle : reason,
    };
    console.log("sendingapi data", apiData);
    actions
      .cancelOrder(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((response) => {
        console.log(response, "responseFromServer");
        if (response?.status == 403) {
          updateState({
            orderCancelMessage: response?.message,
            isBtnLoader: false,
            cancelError: null,
          });
        } else {
          updateState({
            isBtnLoader: false,
            isCancleModal: false,
            cancelError: null,
          });
          showSuccess(response?.message);
          {
            paramData?.keyValue
              ? navigation.goBack()
              : navigation.navigate(navigationStrings.HOMESTACK);
          }
        }
      })
      .catch(errorMethod);
  };

  console.log(paramData, "paramData>>");

  let subscription_percent =
    (orderFullDetail?.order_details?.order_detail?.subscription_discount /
      orderFullDetail?.order_details?.order_detail?.total_amount) *
    100;

  const onWhatsapp = async () => {
    const link = `https://api.whatsapp.com/send?phone=${orderFullDetail?.order?.phone_number.replace(
      "+",
      ""
    )}`;
    if (link) {
      Linking.canOpenURL(link)
        .then((supported) => {
          if (!supported) {
            Alert.alert("Please install Whatsapp to send direct message.");
          } else {
            return Linking.openURL(link);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    } else {
      console.log("sendWhatsAppMessage -----> ", "message link is undefined");
    }
  };

  const onChat = (item) => {
    navigation.navigate(navigationStrings.CHAT_SCREEN, { data: { ...item } });
  };


  // Instan Booking and bid and ride 
  const renderDriverListCard = ({ item, index }) => {
    return (
      <BidAcceptRejectCard
        data={item}
        bidExpiryDuration={bidExpiryDuration}
        _onDeclineBid={_onDeclineRideBid}
        _onAcceptRideBid={_onAcceptRideBid}
      />
    )
  }


  const createRoom = async (item, type) => {
    try {
      const apiData = {
        sub_domain: "192.168.101.88", //this is static value
        client_id: String(appData?.profile.id),
        db_name: appData?.profile?.database_name,
        user_id: String(userData?.id),
        type: type,
        order_vendor_id: String(item?.id),
        vendor_id: String(item?.vendor_id),
        order_id: String(item?.order_id),
      };
      if (type == 'agent_to_user') {
        apiData.agent_id = orderFullDetail?.agent_location?.agent_id;
        apiData.agent_db = orderFullDetail?.agent_dbname;
      }
      updateState({ isLoading: true });

      console.log('sending api data room created', orderFullDetail);
      const res = await actions.onStartChat(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });
      console.log("start chat res", res);
      updateState({ isLoading: false });
      if (!!res?.roomData) {
        onChat(res.roomData);
      }
    } catch (error) {
      console.log("error raised in start chat api", error);
      showError(error?.message);
      updateState({ isLoading: false });
    }
  };

  if (isLoading) {
    return (
      <WrapperContainer
        bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
        statusBarColor={colors.white}
        isLoadingB={isLoading}
      >
        <View style={{ flex: 1, marginVertical: moderateScale(16), marginBottom: 0 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: moderateScaleVertical(16),
              marginHorizontal: moderateScale(16),
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.popToTop()
              }
              activeOpacity={0.8}
            >
              <Image
                style={{
                  tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}
                source={imagePath.backArrowCourier}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: moderateScale(16),
                fontFamily: fontFamily.medium,
                textAlign: "left",
                marginLeft: moderateScale(8),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {orderStatus == "unassigned"
                ? appIds.jiffex == getBundleId()
                  ? strings.YOUR_ORDER_WILL_START_SOON
                  : strings.YOUR_RIDE_WILL_START_SOON
                : strings.INVOICE}
            </Text>
          </View>
          <View>

            <View style={{ alignItems: 'center' }}>
              <HeaderLoader
                widthLeft={width}
                rectWidthLeft={width}
                heightLeft={height / 1.75}
                rectHeightLeft={height / 1.75}
                isRight={false}
              />
            </View>

            <View style={{ alignSelf: 'center' }}>
              <HeaderLoader
                widthLeft={moderateScale(60)}
                rectWidthLeft={moderateScale(60)}
                heightLeft={moderateScale(8)}
                rectHeightLeft={moderateScale(8)}
                isRight={false}
                viewStyles={{ marginTop: moderateScale(10) }}
                rx={0}
                ry={0}
              />
            </View>

            <HeaderLoader
              widthLeft={moderateScale(140)}
              rectWidthLeft={moderateScale(140)}
              heightLeft={moderateScale(10)}
              rectHeightLeft={moderateScale(10)}
              isRight={false}
              viewStyles={{ marginTop: moderateScaleVertical(24) }}
              rx={0}
              ry={0}
            />
            <HeaderLoader
              widthLeft={moderateScale(100)}
              rectWidthLeft={moderateScale(100)}
              heightLeft={moderateScale(10)}
              rectHeightLeft={moderateScale(10)}
              isRight={false}
              viewStyles={{ marginTop: 10 }}
              rx={0}
              ry={0}
            />

            <View style={styles.loaderStyle}>
              <View>
                <HeaderLoader
                  widthLeft={moderateScale(180)}
                  rectWidthLeft={moderateScale(140)}
                  heightLeft={moderateScale(10)}
                  rectHeightLeft={moderateScale(10)}
                  isRight={false}
                  rx={0}
                  ry={0}
                />
                <HeaderLoader
                  widthLeft={moderateScale(100)}
                  rectWidthLeft={moderateScale(100)}
                  heightLeft={moderateScale(10)}
                  rectHeightLeft={moderateScale(10)}
                  isRight={false}
                  viewStyles={{ marginTop: 10 }}
                  rx={0}
                  ry={0}
                />
              </View>

              <View>
                <HeaderLoader
                  widthLeft={moderateScale(140)}
                  rectWidthLeft={moderateScale(140)}
                  heightLeft={moderateScale(10)}
                  rectHeightLeft={moderateScale(10)}
                  isRight={false}

                  rx={0}
                  ry={0}
                />
                <HeaderLoader
                  widthLeft={moderateScale(100)}
                  rectWidthLeft={moderateScale(100)}
                  heightLeft={moderateScale(10)}
                  rectHeightLeft={moderateScale(10)}
                  isRight={false}
                  viewStyles={{ marginTop: 10 }}
                  rx={0}
                  ry={0}
                />
              </View>

            </View>

          </View>
        </View>
      </WrapperContainer>
    );
  }

  console.log("taskstaskstaskstaskstasks", tasks)


  const orderDetailStatus = () => {
    return (
      <View style={{ marginBottom: moderateScaleVertical(16) }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: moderateScale(16),
            alignItems: "center",
          }}
        >
          <Text
            style={
              isDarkMode
                ? [
                  styles.orderLableStyle,
                  { color: MyDarkTheme.colors.text },
                ]
                : styles.orderLableStyle
            }
          >
            {`${strings.ORDER_ID}: #${orderFullDetail?.order?.order_number
              ? orderFullDetail?.order?.order_number
              : paramData?.orderDetail?.order_number
              }`}
          </Text>

          {isWaitingOver && orderStatus == "unassigned" ? (
            <></>
          ) : !!(
            orderStatus !== "completed" ||
            orderStatus !== "started" ||
            orderStatus !== "arrived"
          ) ? (
            <TouchableOpacity
              disabled={orderStatus == "cancelled" || orderStatus == "failed"}
              activeOpacity={0.7}
              onPress={() => updateState({ isCancleModal: true })}
            >
              <Text
                style={{
                  textAlign: "right",
                  color: colors.redB,
                }}
              >
                {orderStatus == "cancelled" || orderStatus == "failed"
                  ? strings.ORDER_CANCELLED
                  : orderStatus == "completed"
                    ? null
                    : strings.CANCEL_ORDER}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScaleVertical(10),
          }}
        >
          {!userData?.is_superadmin ? (
            <View
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              {!!appData?.profile?.socket_url ? (
                <TouchableOpacity
                  onPress={() =>
                    createRoom(
                      orderFullDetail?.order_details,
                      "vendor_to_user"
                    )
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.startChatText}>
                    {strings.VENDOR}
                  </Text>
                  <Image
                    resizeMode="contain"
                    style={styles.agentUserIcon}
                    source={imagePath.icVendorChat}
                  />
                  <Text>{"  "}</Text>
                </TouchableOpacity>
              ) : null}
              {orderFullDetail?.order &&
                orderFullDetail?.agent_location?.lat &&
                appData?.profile?.socket_url && (
                  <TouchableOpacity
                    onPress={() =>
                      createRoom(
                        orderFullDetail?.order_details,
                        'agent_to_user',
                      )
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.startChatText}>
                      {strings.DRIVER}
                    </Text>
                    <Image
                      resizeMode="contain"
                      style={styles.agentUserIcon}
                      source={imagePath.icUserChat}
                    />
                  </TouchableOpacity>
                )}
            </View>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: moderateScaleVertical(16),
            marginBottom: moderateScaleVertical(8),
            marginHorizontal: moderateScale(16),
          }}
        >
          <View style={{ flex: 0.7 }}>
            <Text style={styles.datePriceText}>
              {moment(
                new Date(orderFullDetail?.order_details?.created_at)
              )
                .locale(languages?.primary_language?.sort_code || "en")
                .format("MMMM Do YYYY, h:mm a")}
            </Text>
            <Text
              style={{
                ...styles.statusText,
                marginTop: moderateScaleVertical(4),
                textTransform: "uppercase",
              }}
            >
              #{orderFullDetail.order.unique_id}
            </Text>
          </View>
          <View
            style={{
              flex: 0.3,
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.statusText}>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(orderFullDetail.order_details?.payable_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
            </Text>
            <Text
              style={{
                ...styles.statusText,
                color: themeColors.primary_color,
                marginTop: moderateScaleVertical(4),
                textTransform: "capitalize",
              }}
            >
              {" "}
              {viewDriverStatus()}
            </Text>
          </View>
        </View>

        {!!(orderFullDetail.order_details?.waiting_price > 0) && <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",

            marginBottom: moderateScaleVertical(8),
            marginHorizontal: moderateScale(16),

          }}
        >

          <Text
            style={{
              ...styles.statusText,
              color: colors.black,
              marginTop: moderateScaleVertical(4)
            }}
          >
            {`${strings.WAITING_TIME} (${orderFullDetail.order_details?.waiting_time} ${strings.MIN}) ${strings.FEE}`}
          </Text>
          <Text style={styles.statusText}>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(orderFullDetail.order_details?.waiting_price),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}
          </Text>


        </View>}

        {!!orderFullDetail?.order.task_description && (
          <View style={{ marginHorizontal: moderateScale(16) }}>
            <Text style={styles.datePriceText}>
              {strings.DRIVER_DETAILS}:
            </Text>
            <Text
              style={{
                ...styles.statusText,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity66,
                lineHeight: moderateScale(20),
              }}
            >
              {orderFullDetail?.order.task_description}{" "}
            </Text>
          </View>
        )}
        <View style={styles.horizontalLine} />

        {orderStatus == "unassigned" && (
          <SearchDriver
            isWaitingOver={isWaitingOver}
            cancleOrder={() => {
              onCancelOrder("No drivers available.");
            }}
            scheduleDate={orderDetail?.scheduled_date_time}
            isBtnLoader={isBtnLoader}
          />
        )}

        {(!isEmpty(paramData?.orderDropLocations)
          ? paramData?.orderDropLocations
          : orderFullDetail?.tasks
        ).map((val, i) => {
          return (
            <View key={String(i)} style={{ marginHorizontal: moderateScale(16) }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ marginRight: moderateScaleVertical(8) }}>
                  <View style={{ alignItems: "center" }}>
                    {i == 0 ? (
                      <View
                        style={{
                          height: moderateScale(8),
                          width: moderateScale(8),
                          borderRadius: moderateScale(8 / 2),
                          backgroundColor: themeColors.primary_color,
                        }}
                      />
                    ) : (
                      <Image
                        style={{
                          tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                          // height: moderateScale(5),
                          // width: moderateScale(5),
                          // borderRadius: orderFullDetail.tasks.length - 1 == i ? 0 : moderateScale(5 / 2),
                        }}
                        source={imagePath.location2}
                      />
                    )}
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Text
                    style={{
                      ...styles.statusText,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.blackOpacity66,
                      flex: 0.9,
                    }}
                  >
                    {val?.address || ""}
                  </Text>

                  {!!(
                    val?.task_type_id != 1 &&
                    profile?.preferences?.is_order_edit_enable &&
                    Number(val?.task_status) < 2 && orderStatus != "completed"
                  ) && (
                      <TouchableOpacity
                        style={{
                          borderColor: themeColors?.primary_color,
                          borderWidth: 0.5,
                          padding: moderateScale(5),
                          paddingHorizontal: moderateScale(10),
                          height: moderateScale(28),
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={moveToNewScreen(
                          navigationStrings.LOCATION,
                          {
                            ...paramData,
                            orderDropLocations: !isEmpty(
                              paramData?.orderDropLocations
                            )
                              ? paramData?.orderDropLocations
                              : orderFullDetail?.tasks,
                            editIndex: i,
                            showLocationUpdateButton: showLocationUpdateButton
                          }
                        )}
                      >
                        <Text
                          style={{
                            fontFamily: fontFamily.regular,
                            fontSize: textScale(11),
                          }}
                        >
                          {"Change"}
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              </View>
              {orderFullDetail.tasks.length - 1 !== i && (
                <View
                  style={{
                    borderBottomWidth: 0.8,
                    borderBottomColor: isDarkMode
                      ? colors.whiteOpacity22
                      : colors.lightGreyBg,
                    marginVertical: moderateScaleVertical(8),
                    marginHorizontal: 16,
                  }}
                />
              )}
            </View>
          );
        })}
        {!isEmpty(paramData?.orderDropLocations) &&
          showLocationUpdateButton && (
            <ButtonWithLoader
              isLoading={false}
              btnText={"Update Location"}
              btnTextStyle={{ color: colors.white }}
              btnStyle={{
                backgroundColor: themeColors?.primary_color,
                borderColor: themeColors?.primary_color,
                width: width / 2,
                alignSelf: "center",
                height: moderateScaleVertical(40),
              }}
              onPress={_onDropLocationChangeAfterOrderPlace}
            />
          )}


        {!!orderFullDetail?.agent_location ? (
          <View
            style={{
              backgroundColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.greyNew,
              marginVertical: moderateScaleVertical(24),
              padding: moderateScale(12),
              borderRadius: moderateScale(8),
              marginHorizontal: moderateScale(16),
            }}
          >
            <Text style={styles.deliveryProof}>
              {strings.DRIVER_DETAILS}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <RoundImg
                  img={orderFullDetail?.agent_image}
                  size={90}
                />
                <View style={{ flexDirection: "column" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        ...styles.statusText,
                        fontSize: moderateScale(20),
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.primary_color,
                        marginLeft: moderateScale(10),
                      }}
                    >
                      {orderFullDetail?.order?.name || ""}
                    </Text>
                    {!!orderDetail?.plate_number && (
                      <View
                        style={{
                          backgroundColor: colors.blackOpacity05,
                          marginLeft: moderateScale(10),
                          borderStyle: "dashed",
                          borderWidth: 1,
                        }}
                      >
                        <Text
                          style={{
                            ...styles.statusText,
                            fontSize: moderateScale(16),
                            color: isDarkMode
                              ? MyDarkTheme.colors.text
                              : themeColors.primary_color,
                            padding: moderateScale(4),
                          }}
                        >
                          {orderDetail?.plate_number}
                        </Text>
                      </View>
                    )}
                  </View>
                  {orderFullDetail?.avgrating > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: moderateScale(8),
                      }}
                    >
                      <Image
                        source={imagePath.star}
                        style={{ tintColor: colors.yellowB }}
                      />
                      <Text
                        style={{
                          ...styles.statusText,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                          marginLeft: moderateScale(5),
                        }}
                      >
                        {orderFullDetail?.avgrating.toFixed(2)} (
                        {orderFullDetail?.driver_rating_count})
                      </Text>
                    </View>
                  )}

                  <Text
                    style={{
                      ...styles.statusText,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      marginLeft: moderateScale(10),
                    }}
                  >
                    {`Driver ID: `}
                    {Array(
                      Math.max(
                        4 -
                        String(orderFullDetail?.order?.driver_id)
                          .length +
                        1,
                        0
                      )
                    ).join(0) + orderFullDetail?.order?.driver_id}
                  </Text>
                  {orderFullDetail?.order?.phone_number && (
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: moderateScale(12),
                        marginTop: moderateScale(12),
                      }}
                    >
                      <TouchableOpacity onPress={onWhatsapp}>
                        <Image
                          source={imagePath.whatsAppRoyo}
                          style={{
                            height: moderateScale(20),
                            width: moderateScale(20),
                            marginRight: moderateScale(20),
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          dialCall(
                            orderFullDetail?.order?.phone_number,
                            "phone"
                          )
                        }
                      >
                        <Image
                          source={imagePath.call2}
                          style={{
                            height: moderateScale(20),
                            width: moderateScale(20),
                            tintColor: themeColors.primary_color,
                            marginRight: moderateScale(20),
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          dialCall(
                            orderFullDetail?.order?.phone_number,
                            "text"
                          )
                        }
                      >
                        <Image
                          source={imagePath.msg}
                          style={{
                            height: moderateScale(20),
                            width: moderateScale(20),
                            tintColor: themeColors.primary_color,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {orderStatus == "completed" && (
              <View
                style={{
                  width: width / 3,
                  marginVertical: moderateScaleVertical(10),
                  alignSelf: "center",
                }}
              >
                <StarRating
                  maxStars={5}
                  rating={
                    submitedRatingToDriver
                      ? submitedRatingToDriver
                      : orderFullDetail?.order_driver_rating?.rating
                  }
                  selectedStar={(rating) =>
                    onStarRatingForDriverPress(rating)
                  }
                  fullStarColor={colors.ORANGE}
                  starSize={25}
                />
                {submitedRatingToDriver ||
                  orderFullDetail?.order_driver_rating?.rating ? (
                  <TouchableOpacity
                    onPress={() =>
                      rateYourOrder({
                        order_id: productInfo[0]?.order_id,
                        isDriverRate: true,
                        driverRatingData: driverRatingData
                          ? driverRatingData
                          : orderFullDetail?.order_driver_rating,
                        trackingUrl: paramData?.orderDetail?.dispatch_traking_url
                      })
                    }
                  >
                    <Text
                      style={{
                        alignSelf: "center",
                        marginVertical: moderateScaleVertical(10),
                        fontSize: textScale(13),
                        fontFamily: fontFamily?.bold,
                        color: themeColors?.primary_color,
                      }}
                    >
                      {strings.WRITE_A_REVIEW}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {!!orderFullDetail?.tasks[0]?.proof_image && (
              <View>
                <View style={styles.horizontalLine} />
                <Text style={styles.deliveryProof}>
                  {strings.DELIVERYPROOF}
                </Text>
                <FlatList
                  ItemSeparatorComponent={() => (
                    <View style={{ marginLeft: 8 }} />
                  )}
                  horizontal
                  data={orderFullDetail?.tasks.filter((val) => {
                    if (!!val?.proof_image) {
                      return val;
                    }
                  })}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() =>
                            updateState({
                              showModal: true,
                              selectedImg: item?.proof_image,
                            })
                          }
                        >
                          <Image
                            source={{
                              uri: `${baseUrl}/${item?.proof_image}`,
                            }}
                            style={{
                              height: moderateScale(40),
                              width: moderateScale(40),
                              borderRadius: moderateScale(4),
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => !!item?.id ? String(item?.id) : String(index)}
                />
              </View>
            )}
            <View
              style={{
                ...styles.horizontalLine,
                borderBottomColor: isDarkMode
                  ? colors.whiteOpacity22
                  : colors.greyA,
                borderBottomWidth: 0.6,
              }}
            />
            <Text style={styles.deliveryProof}>
              {strings.ORDER_DETAIL}
            </Text>
            <View
              style={{
                flexDirection: "row",
                // alignItems: 'center',
                justifyContent: "space-between",
              }}
            >
              {orderFullDetail.order_details.products.map(
                (val, index) => {
                  console.log(val, "valvalvalval");
                  return (
                    <View key={String(index)}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <FastImage
                            source={{
                              uri: getImageUrl(
                                val?.image.image_fit,
                                val?.image.image_path,
                                "100/100"
                              ),
                              priority: FastImage.priority.high,
                            }}
                            style={{
                              height: moderateScale(90),
                              width: moderateScale(90),
                              borderRadius: moderateScale(45),
                            }}
                          />
                          <View>
                            <Text
                              style={{
                                ...styles.statusText,
                                color: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : colors.black,
                                marginLeft: moderateScale(10),
                                width: moderateScale(200),
                                // backgroundColor: 'red',
                                fontFamily: fontFamily.medium,
                              }}
                            >
                              {val?.product_name || ""}
                            </Text>
                            {/* <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: moderateScale(5),
                }}
              >
                <Image
                  source={imagePath.star}
                  style={{ tintColor: colors.yellowB }}
                />
                <Text
                  style={{
                    ...styles.statusText,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    marginLeft: moderateScale(5),
                  }}
                >
                  {orderFullDetail?.avgrating} (
                  {orderFullDetail?.driver_rating_count})
                </Text>
              </View> */}
                          </View>
                        </View>

                        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={imagePath.startwo} />
            <TouchableOpacity>
              <Text style={{
                fontSize: textScale(10),
                fontFamily: fontFamily.medium,
                marginLeft: moderateScale(4)
              }}>Add Rating</Text>
            </TouchableOpacity>
          </View> */}
                      </View>

                      <View
                        style={{
                          // flexDirection: 'row',
                          // alignItems: 'center',
                          justifyContent: "space-between",
                          marginBottom: moderateScaleVertical(8),
                        }}
                      >
                        {orderFullDetail.order_details.products.length >
                          0 && (
                            <View
                              style={{
                                flexDirection: "row",
                                marginBottom: moderateScaleVertical(5),
                              }}
                            >
                              <Text
                                style={{
                                  ...styles.statusText,
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.black,
                                  // marginLeft: moderateScale(10),
                                }}
                              >
                                {"No. of items:"}
                              </Text>
                              <Text
                                style={{
                                  ...styles.statusText,
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.black,
                                  marginLeft: moderateScale(10),
                                  fontFamily: fontFamily.bold,
                                }}
                              >
                                {
                                  orderFullDetail.order_details.products
                                    .length
                                }
                              </Text>
                            </View >
                          )
                        }
                        {
                          orderStatus == "completed" ? (
                            <View
                              style={{
                                width: width / 3,
                                marginVertical: moderateScaleVertical(10),
                                alignSelf: "center",
                              }}
                            >
                              <StarRating
                                maxStars={5}
                                rating={
                                  productInfo[index]?.product_rating
                                    ?.rating
                                }
                                selectedStar={(rating) =>
                                  onStarRatingPress(val, rating)
                                }
                                fullStarColor={colors.ORANGE}
                                starSize={25}
                              />

                              {productInfo[index]?.product_rating && (
                                <TouchableOpacity
                                  onPress={() => rateYourOrder(val)}
                                >
                                  <Text
                                    style={{
                                      alignSelf: "center",
                                      marginVertical: moderateScaleVertical(
                                        10
                                      ),
                                      fontSize: textScale(13),
                                      fontFamily: fontFamily?.bold,
                                      color: themeColors?.primary_color,
                                    }}
                                  >
                                    {strings.WRITE_A_REVIEW}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          ) : null
                        }

                        {
                          val.user_product_order_form &&
                          JSON.parse(val.user_product_order_form)
                            .length > 0 &&
                          JSON.parse(val.user_product_order_form).map(
                            (el, index) => {
                              return (
                                <View
                                  key={String(index)}
                                  style={{
                                    flexDirection: "row",
                                  }}
                                >
                                  {!!el?.question ? (
                                    <Text
                                      style={{
                                        ...styles.statusText,
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.black,
                                        // marginLeft: moderateScale(10),
                                      }}
                                    >
                                      {el?.question}:
                                    </Text>
                                  ) : null}
                                  {!!el?.answer ? (
                                    <Text
                                      style={{
                                        ...styles.statusText,
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.black,
                                        marginLeft: moderateScale(10),
                                      }}
                                    >
                                      {el?.answer || "NA"}
                                    </Text>
                                  ) : null}
                                </View>
                              );
                            }
                          )
                        }
                      </View >
                    </View >
                  );
                }
              )}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: moderateScaleVertical(10),
                }}
              >
                <Text
                  style={{
                    ...styles.statusText,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    // marginLeft: moderateScale(10),
                  }}
                >
                  {`${orderDetail?.color || ""}`}
                </Text>
              </View>
            </View >
          </View >
        ) : (
          <View style={{ marginBottom: moderateScaleVertical(24) }} />
        )}
        {!!orderFullDetail?.noofCopassengers && !!is_cab_pooling ?
          <View style={{ marginHorizontal: moderateScale(16), paddingBottom: moderateScale(10) }}>
            <LeftRightText
              leftText={strings.NO_OF_COPASSENGERS}
              rightText={`${orderFullDetail?.noofCopassengers}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
              marginBottom={0}
            />
          </View> : null}
        <View style={{ marginHorizontal: moderateScale(16) }}>

          {!!orderFullDetail?.order_details?.delivery_fee &&
            Number(orderFullDetail?.order_details?.delivery_fee) !==
            0 && (
              <View>
                <LeftRightText
                  leftText={strings.DELIVERYFEE}
                  rightText={` ${tokenConverterPlusCurrencyNumberFormater(
                    Number(
                      orderFullDetail?.order_details?.delivery_fee
                    ),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol
                  )}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>
            )}
          {!!orderFullDetail?.order_details?.subtotal_amount &&
            Number(orderFullDetail?.order_details?.subtotal_amount) !==
            0 && (
              <View>
                <LeftRightText
                  leftText={strings.SUBTOTAL}
                  rightText={` ${tokenConverterPlusCurrencyNumberFormater(
                    Number(
                      orderFullDetail?.order_details?.subtotal_amount
                    ),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol
                  )}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>
            )}
          {
            Number(orderFullDetail?.order_details?.toll_amount) > 0
            && (
              <View>
                <LeftRightText
                  leftText={strings.TOLL_FEE}
                  rightText={` ${tokenConverterPlusCurrencyNumberFormater(
                    Number(orderFullDetail?.order_details?.toll_amount),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol
                  )}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />

                <View style={styles.horizontalLine} />
              </View>
            )}

          {console.log(orderFullDetail, 'orderFullDetail')}
          {!!orderFullDetail?.order_details
            ?.service_fee_percentage_amount &&
            Number(
              orderFullDetail?.order_details
                ?.service_fee_percentage_amount
            ) !== 0 && (
              <View>
                <LeftRightText
                  leftText={strings.SERVICE_CHARGES}
                  rightText={`${tokenConverterPlusCurrencyNumberFormater(
                    Number(
                      orderFullDetail?.order_details
                        ?.service_fee_percentage_amount
                    ),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol
                  )}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>
            )}

          {!!orderFullDetail?.order_details?.discount_amount &&
            Number(orderFullDetail?.order_details?.discount_amount) !==
            0 && (
              <View>
                <LeftRightText
                  leftText={strings.DISCOUNT}
                  rightText={` ${tokenConverterPlusCurrencyNumberFormater(
                    Number(
                      orderFullDetail?.order_details?.discount_amount
                    ),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol
                  )}`}
                  leftTextStyle={{ color: themeColors.primary_color }}
                  rightTextStyle={{ color: themeColors.primary_color }}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>
            )}
          {!!orderFullDetail?.order_details?.order_detail
            ?.subscription_discount &&
            Number(
              orderFullDetail?.order_details?.order_detail
                ?.subscription_discount
            ) !== 0 && (
              <View>
                <LeftRightText
                  leftText={`${strings.SUBSCRIPTION_DISCOUNT
                    } ${"("} ${tokenConverterPlusCurrencyNumberFormater(
                      Number(subscription_percent),
                      digit_after_decimal,
                      additional_preferences,
                      currencies?.primary_currency?.symbol
                    )} ${"%)"}`}
                  rightText={` ${"-"} ${currencies?.primary_currency?.symbol
                    } ${tokenConverterPlusCurrencyNumberFormater(
                      Number(
                        orderFullDetail?.order_details?.order_detail
                          ?.subscription_discount
                      ),
                      digit_after_decimal,
                      additional_preferences,
                      currencies?.primary_currency?.symbol
                    )} `}
                  leftTextStyle={{ color: themeColors.primary_color }}
                  rightTextStyle={{ color: themeColors.primary_color }}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>
            )}
          {!!orderFullDetail?.order_details?.taxable_amount &&
            Number(orderFullDetail?.order_details?.taxable_amount) !==
            0 && (
              <View>
                <LeftRightText
                  leftText={strings.TAX_AMOUNT}
                  rightText={` ${tokenConverterPlusCurrencyNumberFormater(
                    Number(
                      orderFullDetail?.order_details?.taxable_amount
                    ),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol
                  )}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
                <View style={styles.horizontalLine} />
              </View>
            )}

          {!!orderFullDetail?.order_details?.payable_amount &&
            Number(orderFullDetail?.order_details?.payable_amount) !==
            0 && (
              <View>
                <LeftRightText
                  leftText={strings.TOTAL}
                  rightText={` ${tokenConverterPlusCurrencyNumberFormater(
                    Number(
                      orderFullDetail?.order_details?.order_detail
                        ?.payable_amount
                    ),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol
                  )}`}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  marginBottom={0}
                />
              </View>
            )}
        </View>
      </View >
    )
  }

  const showMapOrNot = () => {
    switch (orderStatus) {
      case "completed": return false
      case "failed": return false
      case "cancelled": return false
      default: return true
    }
  }

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      isLoadingB={isLoading}
    >
      <View
        style={{ flex: 1, marginVertical: moderateScale(16), marginBottom: 0 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: moderateScaleVertical(16),
            marginHorizontal: moderateScale(16),
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.popToTop()
            }
            activeOpacity={0.8}
          >
            <Image
              style={{
                tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
              source={imagePath.backArrowCourier}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: moderateScale(16),
              fontFamily: fontFamily.medium,
              textAlign: "left",
              marginLeft: moderateScale(8),
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
          >
            {orderStatus == "unassigned"
              ? appIds.jiffex == getBundleId()
                ? strings.YOUR_ORDER_WILL_START_SOON
                : strings.YOUR_RIDE_WILL_START_SOON
              : strings.INVOICE}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          {showMapOrNot() ? <View style={{ flex: 1 }}>
            {!isLoading && !!tasks?.length > 0 && orderStatus !== "cancelled" && (
              <View>
                {orderStatus !== "failed" ? <MapView
                  provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                  style={{ height: '100%', width: "100%" }}
                  initialRegion={region}
                  ref={mapRef}
                  // cacheEnabled={true}
                  customMapStyle={
                    appIds.cabway == DeviceInfo.getBundleId() ? null : mapStyleGrey
                  }
                >
                  {!!tasks && tasks.length > 0 && <CustomCallouts data={tasks} />}

                  {!!agent_location &&
                    !!agent_location?.lat &&
                    orderStatus != "completed" && (
                      <Marker.Animated
                        // tracksViewChanges={agent_location == null}
                        coordinate={{
                          latitude: Number(agent_location?.lat),
                          longitude: Number(
                            agent_location?.long || agent_location?.lng
                          ),
                        }}
                      >
                        <Image
                          style={{
                            zIndex: 99,
                            // height:46,
                            // width: 32,
                            transform: [
                              {
                                rotate: `${Number(
                                  agent_location?.heading_angle
                                )}deg`,
                              },
                            ],
                          }}
                          source={imagePath.icCar}
                        />
                      </Marker.Animated>
                    )}

                  {!!tasks && tasks.length > 0 ? <MapViewDirections
                    resetOnChange={false}
                    origin={
                      orderStatus !== "completed" && orderStatus !== "unassigned"
                        ? {
                          latitude: Number(agent_location?.lat),
                          longitude: Number(
                            agent_location?.long || agent_location?.lng
                          ),
                        }
                        : tasks[0]
                    }
                    waypoints={tasks.length > 2 ? tasks.slice(1, -1) : []}
                    destination={
                      orderFullDetail?.order_details.dispatcher_status_type == 1
                        ? orderStatus == "unassigned"
                          ? tasks[tasks.length - 1]
                          : tasks[0]
                        : tasks[tasks.length - 1]
                    }
                    // destination={tasks[tasks.length - 1]}
                    apikey={profile?.preferences?.map_key}
                    strokeWidth={4}
                    strokeColor={colors.black}
                    optimizeWaypoints={true}
                    onStart={(params) => { }}
                    precision={"high"}
                    timePrecision={"now"}
                    mode={"DRIVING"}
                    // maxZoomLevel={20}
                    onReady={(result) => {
                      updateState({
                        totalDistance: result.distance.toFixed(2),
                        totalDuration: result.duration.toFixed(2),
                      });
                      mapRef.current.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: moderateScale(20),
                          bottom: moderateScale(40),
                          left: moderateScale(20),
                          top: moderateScale(40),
                        },
                      });
                    }}
                    onError={(errorMessage) => {
                      //
                    }}
                  /> : null}
                </MapView> : null}
              </View>
            )}
          </View> : null}

          {showMapOrNot() ? <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={[height / 3.4, height]}
            animateOnMount={true}
            onChange={() => playHapticEffect(hapticEffects.impactMedium)}
            handleComponent={bottomSheetHeader}

          >
            <BottomSheetScrollView
              style={{
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.white,

              }}
              showsVerticalScrollIndicator={false}
            >
              {!!orderFullDetail && (
                orderDetailStatus()
              )}
            </BottomSheetScrollView >
          </BottomSheet> :
            <ScrollView>
              {orderDetailStatus()}
            </ScrollView>
          }

        </View >


      </View >

      <Modal
        isVisible={false}
        onBackdropPress={_modalClose}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        {_ModalMainView()}
      </Modal>
      <Modal
        isVisible={showModal}
        onBackdropPress={() => updateState({ showModal: false })}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View
          style={{
            backgroundColor: isDarkMode ? colors.whiteOpacity50 : colors.white,
            borderRadius: moderateScale(8),
            overflow: "hidden",
            // paddingVertical: moderateScale(12)
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: moderateScale(6),
            }}
          >
            <Text />
            <Text
              style={{
                fontSize: textScale(16),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                alignSelf: "center",
                fontFamily: fontFamily.medium,
              }}
            >
              {strings.PROOF}
            </Text>
            <TouchableOpacity onPress={() => updateState({ showModal: false })}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: `${baseUrl}/${selectedImg}` }}
            style={{
              width: "100%",
              height: height / 3,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.blackOpacity10,
              // borderRadius: 8,
            }}
          />
        </View>
      </Modal>
      <Modal
        isVisible={isCancleModal}
        onBackdropPress={hideModal}
        // animationIn="zoomIn"
        // animationOut="zoomOut"
        style={{
          margin: 0,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
            borderRadius: moderateScale(8),
            overflow: "hidden",
            paddingHorizontal: moderateScale(16),
            paddingVertical: moderateScale(12),
            marginBottom:
              Platform.OS == "ios" ? moderateScale(keyboardHeight) : 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text />
            <Text
              style={{
                fontSize: textScale(16),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                alignSelf: "center",
                fontFamily: fontFamily.medium,
              }}
            >
              {strings.CANCELLATION_REASON}
            </Text>
            <TouchableOpacity onPress={hideModal}>
              <Image
                style={isDarkMode && { tintColor: colors.white }}
                source={imagePath.closeButton}
              />
            </TouchableOpacity>
          </View>
          {!!orderCancelMessage && (
            <Text style={{ alignSelf: "center", color: colors.redB }}>
              {orderCancelMessage}
            </Text>
          )}
          {/* {!!reasonError && (
            <Text
              style={{
                fontSize: textScale(12),
                color: colors.redB,
                fontFamily: fontFamily.medium,
                marginTop: moderateScaleVertical(8),
              }}>
              {strings.REQUIRED}*{' '}
            </Text>
          )} */}

          {!!cancelError ? (
            <Text
              style={{
                fontSize: textScale(11),
                fontFamily: fontFamily.medium,
                color: colors.redB,
                marginTop: !!cancelError ? moderateScaleVertical(16) : 0,
                marginBottom: moderateScaleVertical(4),
              }}
            >
              {cancelError}*
            </Text>
          ) : null}
          <View
            style={{
              // marginVertical: moderateScaleVertical(16),
              backgroundColor: isDarkMode
                ? colors.whiteOpacity15
                : colors.greyNew,
              height: moderateScale(82),
              borderRadius: moderateScale(4),
              paddingHorizontal: moderateScale(8),
              marginTop: !!cancelError ? 0 : moderateScaleVertical(16),
            }}
          >
            <TextInput
              multiline
              value={reason}
              placeholder={strings.WRITE_YOUR_REASON_HERE}
              onChangeText={(val) => updateState({ reason: val })}
              style={{
                ...styles.reasonText,
                color: isDarkMode ? colors.textGreyB : colors.black,
                textAlignVertical: "top",
                flex: 1,
              }}
              onSubmitEditing={Keyboard.dismiss}
              placeholderTextColor={
                isDarkMode ? colors.textGreyB : colors.blackOpacity40
              }
            />
          </View>
          <ButtonWithLoader
            isLoading={isBtnLoader}
            btnText={strings.CANCEL}
            btnStyle={{
              backgroundColor: themeColors.primary_color,
              borderWidth: 0,
            }}
            onPress={() => onCancelOrder(false)}
          />
        </View>
      </Modal>
      <Modal isVisible={bidBookModalVisible} style={{ justifyContent: 'flex-start', paddingTop: moderateScaleVertical(20) }}>
        <View style={{ width: width, alignSelf: 'center' }}>
          <FlatList
            data={allDriversList}
            renderItem={renderDriverListCard}
            keyExtractor={(item, index) => !!item?.id ? String(item?.id) : String(index)}
          /></View>
      </Modal>
    </WrapperContainer >
  );
}


export default gestureHandlerRootHOC(PickupTaxiOrderDetail)