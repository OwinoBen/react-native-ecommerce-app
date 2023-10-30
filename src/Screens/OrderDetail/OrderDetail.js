import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { cloneDeep, isEmpty } from "lodash";
import LottieView from "lottie-react-native";
import moment from "moment";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import * as Animatable from "react-native-animatable";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Linking,
  Alert,
  RefreshControl,
} from "react-native";

import Communications from "react-native-communications";
import { useDarkMode } from "react-native-dynamic";
import { getBundleId } from "react-native-device-info";
import FastImage from "react-native-fast-image";
// import { showMessage } from 'react-native-flash-message';

import * as RNLocalize from "react-native-localize";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Modal from "react-native-modal";
import StarRating from "react-native-star-rating";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import GradientButton from "../../Components/GradientButton";
import Header from "../../Components/Header";
import LeftRightText from "../../Components/LeftRightText";
import {
  loaderFive,
  loaderOne,
} from "../../Components/Loaders/AnimatedLoaderFiles";
import CircularProfileLoader from "../../Components/Loaders/CircularProfileLoader";
import HeaderLoader from "../../Components/Loaders/HeaderLoader";
import RatingModal from "../../Components/RatingModal";
import SpecificInstruction from "../../Components/SpecificInstruction";
import StepIndicators from "../../Components/StepIndicator";
import UserDetail from "../../Components/UserDetail";
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
  currencyNumberFormatter,
  getHourAndMinutes,
  tokenConverterPlusCurrencyNumberFormater,
} from "../../utils/commonFunction";
import { appIds } from "../../utils/constants/DynamicAppKeys";
import {
  getImageUrl,
  showError,
  showSuccess,
} from "../../utils/helperFunctions";
import useInterval from "../../utils/useInterval";
import ListEmptyCart from "./ListEmptyCart";
import stylesFunc from "./styles";
import stylesFun from "./stylesCart";
import { Calendar } from "react-native-calendars";
import CustomAnimatedLoader from "../../Components/CustomAnimatedLoader";

import BannerLoader from "../../Components/Loaders/BannerLoader";
import ButtonWithLoader from "../../Components/ButtonWithLoader";

const { height, width } = Dimensions.get("window");
import { enableFreeze } from "react-native-screens";
import ScreenLoader from "./ScreenLoader";
import BrowseMenuButton from "../../Components/BrowseMenuButton";
import HorizontalLine from "../../Components/HorizontalLine";

enableFreeze(true);


export default function OrderDetail({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  const dineInType = useSelector((state) => state?.home?.dineInType);
  const [lalaMoveUrl, setLalaMoveUrl] = useState(null);
  const [modalType, setModalType] = useState("");
  const [isRefreshing, setRefreshing] = useState(false)

  const [laundrySelectedPickupDate, setLaundrySelectedPickupDate] = useState(
    null
  );
  const [laundrySelectedPickupSlot, setLaundrySelectedPickupSlot] = useState(
    ""
  );
  const [laundrySelectedDropOffDate, setLaundrySelectedDropOffDate] = useState(
    null
  );
  const [laundrySelectedDropOffSlot, setLaundrySelectedDropOffSlot] = useState(
    ""
  );
  const [
    laundryAvailableDropOffSlot,
    setLaundryAvailableDropOffSlot,
  ] = useState([]);
  const [laundryAvailablePickupSlot, setLaundryAvailablePickupSlot] = useState(
    []
  );
  const [minimumDelayVendorDate, setMinimumDelayVendorDate] = useState(null);

  const [orderDetailLoader, setOrderDetailLoader] = useState(true);

  const [arrowUp, setArrowDown] = useState(false)

  const [state, setState] = useState({
    isLoading: true,
    cartItems: [],
    cartData: {},
    dispatcherStatus: null,
    selectedPayment: null,
    labels: [
      strings.ACCEPTED,
      strings.PROCESSING,
      strings.OUT_FOR_DELIVERY,
      strings.DELIVERED,
    ],
    updatedcartItems: [],
    updatedcartData: {},

    // labels: [
    //   {lable: 'Accepted', orderDate: '12/12/1233'},
    //   {lable: 'Processing', orderDate: ''},
    //   {lable: 'Out For Delivery', orderDate: ''},
    //   {lable: 'Delivered', orderDate: ''},
    // ],
    currentPosition: null,
    orderStatus: null,
    selectedTipvalue: null,
    selectedTipAmount: null,
    headingAngle: 0,
    curLoc: {
      latitude: 30.7173,
      longitude: 76.8035,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.032,
    },
    coordinate: {
      latitude: 30.7173,
      longitude: 76.8035,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.032,
    },
    animateDriver: new AnimatedRegion({
      latitude: 30.7173,
      longitude: 76.8035,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.032,
    }),
    driverStatus: null,
    swipeKey: "randomStrings",
    showTaxFeeArea: false,
    trackingUrl: paramData?.orderDetail?.dispatch_traking_url || null,
    ratingData: null,
    isDriverRateModal: false,
    isVisibleTimeModal: false,
    currentPickupDate: paramData?.orderDetail?.schedule_pickup,
    currentDropOffDate: paramData?.orderDetail?.schedule_dropoff,
    isLoadingA: false,
    submitedRatingToDriver: null,
    driverRatingData: null,
  });
  const {
    showTaxFeeArea,
    updatedcartItems,
    updatedcartData,
    isLoading,
    cartItems,
    cartData,
    labels,
    currentPosition,
    orderStatus,
    selectedTipvalue,
    selectedTipAmount,
    coordinate,
    curLoc,
    driverStatus,
    swipeKey,
    dispatcherStatus,
    trackingUrl,
    ratingData,
    isDriverRateModal,
    isVisibleTimeModal,
    currentPickupDate,
    currentDropOffDate,
    isLoadingA,
    submitedRatingToDriver,
    driverRatingData,
  } = state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const { appData, themeColors, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot
  );
  // console.log(cartItems,cartData,appData,paramData,'cartItem++++++')
  const { preferences } = appData?.profile;
  let businessType = preferences?.business_type;
  const { additional_preferences, digit_after_decimal } = preferences;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily });
  const styles2 = stylesFun({
    fontFamily,
    themeColors,
    isDarkMode,
    MyDarkTheme,
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);


  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const dialCall = (number, type = "phone") => {
    type === "phone"
      ? Communications.phonecall(number.toString(), true)
      : Communications.text(number.toString());
  };
  const isFocused = useIsFocused();

  useInterval(
    () => {
      if (paramData?.fromActive) {
        getOrders();
      }
    },
    isFocused ? 5000 : null
  );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (paramData?.fromActive) {
  //       return;
  //     } else {
  //       getOrders();
  //     }
  //   }, [])
  // );

  useLayoutEffect(() => {
    getOrders();
  }, [])

  const getOrders = () => {
    if (!!userData?.auth_token) {
      _getOrderDetailScreen();
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const createRoom = async (item, type) => {
    console.log('driverStatus?.agent_location', driverStatus);

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
        apiData.agent_id = driverStatus?.agent_location?.agent_id;
        apiData.agent_db = driverStatus?.agent_dbname;
      }

      // agent_id: String(item?.order?.driver_id),
      // agent_db: clientInfo?.database_name,

      updateState({ isLoading: true });

      console.log('sending create room data', apiData);
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

  const new_dispatch_traking_url = trackingUrl
    ? trackingUrl.replace("/order/", "/order-details/")
    : null;

  /*********Get order detail screen********* */
  const _getOrderDetailScreen = () => {
    let data = {};
    data["order_id"] = paramData?.orderId;
    if (paramData?.selectedVendor) {
      data["vendor_id"] = paramData?.selectedVendor.id;
    }
    if (!!new_dispatch_traking_url) {
      data["new_dispatch_traking_url"] = new_dispatch_traking_url;
    }
    // console.log("sending api data", data);

    actions.getOrderDetail(data, {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      timezone: RNLocalize.getTimeZone(),
      // systemuser: DeviceInfo.getUniqueId(),
    })
      .then((res) => {
        setOrderDetailLoader(false);
        console.log(res.data, "order detail res===>>>>");

        if (
          !!res?.data &&
          !!res?.data?.vendors[0] &&
          res?.data?.vendors[0].lalamove_tracking_url &&
          res?.data?.vendors[0].shipping_delivery_type == "L"
        ) {
          setLalaMoveUrl(res?.data?.vendors[0].lalamove_tracking_url);
        }

        if (
          !!res?.data?.vendors[0] &&
          res?.data?.vendors[0].order_status.current_status.title ==
          "Delivered" &&
          !res?.data?.vendors[0]?.products[0]?.product_rating &&
          !ratingData
        ) {
          updateState({ ratingData: res?.data?.vendors[0].products[0] });
        }
        updateState({ isLoading: false });
        setMinimumDelayVendorDate(res?.data?.vendors[0]?.delaySlot);

        if (res?.data) {
          if (res?.data?.vendors[0]?.tempCart) {
            updateState({
              updatedcartData: res?.data?.vendors[0]?.tempCart,
              updatedcartItems: res?.data?.vendors[0]?.tempCart?.products,
            });
          } else {
            updateState({
              updatedcartData: null,
              updatedcartItems: [],
            });
          }
          if (res?.data?.luxury_option_name !== strings.DELIVERY) {
            updateState({
              labels: [
                strings.ACCEPTED,
                strings.PROCESSING,
                strings.ORDER_PREPARED,
                strings.DELIVERED,
              ],
            });
          }
          let checkDriver =
            !!res?.data?.order_data && !!res?.data?.order_data
              ? res?.data?.order_data
              : null;
          if (
            !!checkDriver?.agent_location?.lat &&
            !!checkDriver?.agent_location?.lat
          ) {
            let lat = Number(driverStatus?.agent_location?.lat);
            let lng = Number(driverStatus?.agent_location?.long);
            if (!!lat && !!lng) {
              animate(lat, lng);
            }
          }

          if (!trackingUrl) {
            updateState({
              trackingUrl: res.data.vendors[0].dispatch_traking_url,
            });
          }



          updateState({
            dispatcherStatus: res.data.vendors[0],
            cartItems: res.data.vendors,
            cartData: res.data,
            isLoading: false,
            driverStatus:
              !!res?.data?.order_data && !!res?.data?.order_data
                ? res?.data?.order_data
                : null,
            // driverDetail:
            selectedTipvalue:
              res.data.payable_amount == "0.00" ? "custom" : null,
            currentPosition: res.data.vendors[0].order_status
              ? res?.data?.luxury_option_name !== strings.DELIVERY
                ? res.data.vendors[0].order_status?.current_status?.title ==
                  strings.OUT_FOR_DELIVERY
                  ? 2
                  : labels.indexOf(
                    res.data.vendors[0].order_status?.current_status?.title
                      .charAt(0)
                      .toUpperCase() +
                    res.data.vendors[0].order_status?.current_status?.title.slice(
                      1
                    )
                  )
                : labels.indexOf(
                  res.data.vendors[0].order_status?.current_status?.title
                    .charAt(0)
                    .toUpperCase() +
                  res.data.vendors[0].order_status?.current_status?.title.slice(
                    1
                  )
                )
              : null,
            orderStatus: res?.data?.vendors[0]?.order_status,
          });
        }
        setRefreshing(false)
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, "Error>>>>>>");
    updateState({ isLoading: false, isLoadingA: false, isLoadingC: false });
    setRefreshing(false)
    // showError(error?.message || error?.error);
  };

  const onStarRatingPress = (i, rating) => {
    // updateState({isLoading: true});

    _giveRatingToProduct(i, rating);
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
    // data['vendor_id'] = productDetail.vendor_id; =

    actions
      .giveRating(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res, "ressssssssr");
        let cloned_cartItems = cloneDeep(cartItems);
        updateState({
          isLoading: false,
          cartItems: (cloned_cartItems = cloned_cartItems.map((itm, inx) => {
            itm.products.map((j, jnx) => {
              if (j?.product_id == productDetail?.product_id) {
                j.product_rating = res.data;
                return j;
              } else {
                return j;
              }
            });
            return itm;
          })),
        });
      })
      .catch(errorMethod);
  };

  //give review and update the rate
  const rateYourOrder = (item) => {
    navigation.navigate(navigationStrings.RATEORDER, { item });
  };

  const onSuccessRating = () => {
    getOrders();
  };
  const generateInvoice = useCallback(() => {
    updateState({
      isLoadingA: true,
    });
    actions
      .genrateInvoice(
        { order_number: cartData?.order_number },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          timezone: RNLocalize.getTimeZone(),
          // systemuser: DeviceInfo.getUniqueId(),
        }
      )
      .then((res) => {
        updateState({
          isLoadingA: false,
        });
        Alert.alert("", res?.message, [
          {
            text: strings.OK,
            onPress: () => console.log("Okay pressed"),
          },
        ]);
      })
      .catch(errorMethod);
  });
  const _renderItem2 = ({ item, index }) => {
    return (
      <View key={index}>
        <View
          // key={swipeKey + Math.random()}
          style={{
            ...styles2.mainViewRednderItem,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}
        >
          <View
            style={{
              ...styles2.vendorView,
              paddingHorizontal: moderateScale(8),
              flexDirection: "column",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                ...styles2.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontFamily: fontFamily.medium,
              }}
            >
              {item?.vendor?.name}
            </Text>
          </View>
          {/************ start  render cart items *************/}
          {item?.vendor_products.length > 0
            ? item?.vendor_products.map((i, inx) => {
              return (
                <Animated.View
                  style={{
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.transactionHistoryBg,
                    marginBottom: moderateScaleVertical(12),
                    marginRight: moderateScale(8),
                    borderRadius: moderateScale(10),
                    transform: [],
                    minHeight: height * 0.125,
                  }}
                  key={inx}
                >
                  <View style={[styles2.cartItemMainContainer]}>
                    <View
                      style={[
                        styles2.cartItemImage,
                        {
                          backgroundColor: isDarkMode
                            ? MyDarkTheme.colors.lightDark
                            : colors.white,
                        },
                      ]}
                    >
                      <FastImage
                        source={
                          i?.cartImg != "" && i?.cartImg != null
                            ? {
                              uri: getImageUrl(
                                i?.cartImg?.path?.proxy_url,
                                i?.cartImg?.path?.image_path,
                                "300/300"
                              ),
                              priority: FastImage.priority.high,
                              cache: FastImage.cacheControl.immutable,
                            }
                            : imagePath.patternOne
                        }
                        style={styles2.imageStyle}
                      />
                    </View>

                    <View style={styles2.cartItemDetailsCon}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              flex: 1,
                            }}
                          >
                            <Text
                              numberOfLines={1}
                              style={{
                                ...styles2.priceItemLabel2,
                                color: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : colors.blackOpacity86,
                                fontSize: textScale(12),
                                fontFamily: fontFamily.medium,
                                flex: 0.7,
                              }}
                            >
                              {i?.product?.translation[0]?.title},
                            </Text>
                          </View>
                          <Text
                            style={{
                              ...styles2.priceItemLabel2,
                              fontSize: textScale(12),
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : "#B3B3B3",
                              marginTop: moderateScaleVertical(4),
                              fontFamily: fontFamily.regular,
                            }}
                          >
                            <Text style={{}}>
                              {tokenConverterPlusCurrencyNumberFormater(
                                Number(i?.variants?.price),
                                digit_after_decimal,
                                additional_preferences,
                                currencies?.primary_currency?.symbol
                              )}
                            </Text>{" "}
                            X {i?.quantity} ={" "}
                            <Text
                              style={{
                                color: isDarkMode
                                  ? MyDarkTheme.colors.text
                                  : colors.black,
                              }}
                            >
                              <Text style={{}}>
                                {tokenConverterPlusCurrencyNumberFormater(
                                  Number(i?.variants?.price),
                                  digit_after_decimal,
                                  additional_preferences,
                                  currencies?.primary_currency?.symbol
                                )}
                              </Text>
                            </Text>
                          </Text>

                          {i?.variant_options.length > 0
                            ? i?.variant_options.map((j, jnx) => {
                              return (
                                <View style={{ flexDirection: "row" }}>
                                  <Text
                                    style={
                                      isDarkMode
                                        ? [
                                          styles2.cartItemWeight2,
                                          {
                                            color:
                                              MyDarkTheme.colors.text,
                                          },
                                        ]
                                        : styles2.cartItemWeight2
                                    }
                                    numberOfLines={1}
                                  >
                                    {j.title}{" "}
                                  </Text>
                                  <Text
                                    style={
                                      isDarkMode
                                        ? [
                                          styles2.cartItemWeight2,
                                          {
                                            color:
                                              MyDarkTheme.colors.text,
                                          },
                                        ]
                                        : styles2.cartItemWeight2
                                    }
                                    numberOfLines={1}
                                  >{`(${j.option})`}</Text>
                                </View>
                              );
                            })
                            : null}
                        </View>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                          }}
                        >
                          {!!i?.product_addons.length > 0 && (
                            <View>
                              <Text
                                style={{
                                  ...styles2.cartItemWeight2,
                                  color: isDarkMode
                                    ? MyDarkTheme.colors.text
                                    : colors.textGreyB,
                                  marginVertical: moderateScale(2),
                                }}
                              >
                                {tokenConverterPlusCurrencyNumberFormater(
                                  Number(i?.variants?.quantity_price),
                                  digit_after_decimal,
                                  additional_preferences,
                                  currencies?.primary_currency?.symbol
                                )}
                              </Text>
                            </View>
                          )}
                          <View>
                            {i?.product_addons.length > 0
                              ? i?.product_addons.map((j, jnx) => {
                                return (
                                  <View
                                    style={{
                                      marginBottom: moderateScaleVertical(
                                        4
                                      ),
                                    }}
                                  >
                                    <View
                                      style={{
                                        marginRight: moderateScale(10),
                                      }}
                                    >
                                      <Text
                                        style={
                                          isDarkMode
                                            ? [
                                              styles2.cartItemWeight2,
                                              {
                                                color:
                                                  MyDarkTheme.colors.text,
                                              },
                                            ]
                                            : styles2.cartItemWeight2
                                        }
                                        numberOfLines={1}
                                      >
                                        {j.addon_title}:
                                      </Text>

                                      <View
                                        style={{ flexDirection: "row" }}
                                      >
                                        <Text
                                          style={
                                            isDarkMode
                                              ? [
                                                styles2.cartItemWeight2,
                                                {
                                                  color:
                                                    MyDarkTheme.colors
                                                      .text,
                                                },
                                              ]
                                              : styles2.cartItemWeight2
                                          }
                                          numberOfLines={1}
                                        >{`(${j.option_title})`}</Text>
                                        <Text
                                          style={
                                            isDarkMode
                                              ? [
                                                styles2.cartItemWeight2,
                                                {
                                                  color:
                                                    MyDarkTheme.colors
                                                      .text,
                                                },
                                              ]
                                              : styles2.cartItemWeight2
                                          }
                                          numberOfLines={1}
                                        >
                                          {tokenConverterPlusCurrencyNumberFormater(
                                            Number(j?.quantity_price),
                                            digit_after_decimal,
                                            additional_preferences,
                                            currencies?.primary_currency
                                              ?.symbol
                                          )}
                                        </Text>
                                      </View>
                                    </View>
                                  </View>
                                );
                              })
                              : null}
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                            }}
                          >
                            {!!i?.product_addons.length > 0 && (
                              <View>
                                <Text
                                  style={{
                                    ...styles2.cartItemWeight2,
                                    color: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : colors.textGreyB,
                                    marginVertical: moderateScale(2),
                                  }}
                                >
                                  {strings.EXTRA}
                                </Text>
                              </View>
                            )}
                            <View>
                              {i?.product_addons.length > 0
                                ? i?.product_addons.map((j, jnx) => {
                                  return (
                                    <View
                                      style={{
                                        marginBottom: moderateScaleVertical(
                                          4
                                        ),
                                      }}
                                    >
                                      <View
                                        style={{
                                          marginRight: moderateScale(10),
                                        }}
                                      >
                                        <Text
                                          style={
                                            isDarkMode
                                              ? [
                                                styles2.cartItemWeight2,
                                                {
                                                  color:
                                                    MyDarkTheme.colors
                                                      .text,
                                                },
                                              ]
                                              : styles2.cartItemWeight2
                                          }
                                          numberOfLines={1}
                                        >
                                          {j.addon_title}:
                                        </Text>

                                        <View
                                          style={{ flexDirection: "row" }}
                                        >
                                          <Text
                                            style={
                                              isDarkMode
                                                ? [
                                                  styles2.cartItemWeight2,
                                                  {
                                                    color:
                                                      MyDarkTheme.colors
                                                        .text,
                                                  },
                                                ]
                                                : styles2.cartItemWeight2
                                            }
                                            numberOfLines={1}
                                          >{`(${j.option_title})`}</Text>
                                          <Text
                                            style={
                                              isDarkMode
                                                ? [
                                                  styles2.cartItemWeight2,
                                                  {
                                                    color:
                                                      MyDarkTheme.colors
                                                        .text,
                                                  },
                                                ]
                                                : styles2.cartItemWeight2
                                            }
                                            numberOfLines={1}
                                          >
                                            {tokenConverterPlusCurrencyNumberFormater(
                                              Number(j?.quantity_price),
                                              digit_after_decimal,
                                              additional_preferences,
                                              currencies?.primary_currency
                                                ?.symbol
                                            )}
                                          </Text>
                                        </View>
                                      </View>
                                    </View>
                                  );
                                })
                                : null}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {!!cartData?.delay_date && (
                    <Text
                      style={{
                        fontSize: moderateScale(12),
                        fontFamily: fontFamily.medium,
                        color: colors.redFireBrick,
                        marginBottom: moderateScale(3),
                      }}
                    >{`${i?.product.delay_order_hrs > 0 ||
                      i?.product.delay_order_min > 0
                      ? strings.PREPARATION_TIME_IS
                      : ""
                      }${i?.product.delay_order_hrs > 0
                        ? ` ${i?.product.delay_order_hrs} hrs`
                        : ""
                      }${i?.product.delay_order_min > 0
                        ? ` ${i?.product.delay_order_min} mins`
                        : ""
                      }`}</Text>
                  )}

                  {/* <View style={styles2.dashedLine} /> */}
                </Animated.View>
              );
            })
            : null}
          {/************ end render cart items *************/}

          {/* start amount view       */}
          <View
            style={{
              marginHorizontal: moderateScale(4),
              marginTop: moderateScaleVertical(8),
            }}
          >
            {!!item?.discount_amount && (
              <View style={styles2.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles2.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles2.priceItemLabel
                  }
                >
                  {strings.COUPON_DISCOUNT}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles2.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles2.priceItemLabel
                  }
                >{`- ${tokenConverterPlusCurrencyNumberFormater(
                  Number(item?.discount_amount ? item?.discount_amount : 0),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol
                )}`}</Text>
              </View>
            )}
            {!!item?.deliver_charge && (
              <View style={styles2.itemPriceDiscountTaxView}>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles2.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }
                >
                  {strings.DELIVERY_CHARGES}
                </Text>

                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.priceItemLabel,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                      : styles.priceItemLabel
                  }
                >
                  {tokenConverterPlusCurrencyNumberFormater(
                    Number(item?.deliver_charge ? item?.deliver_charge : 0),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol
                  )}
                </Text>
              </View>
            )}
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.priceItemLabel,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.priceItemLabel
                }
              >
                {strings.AMOUNT}
              </Text>

              <Text
                style={
                  isDarkMode
                    ? [
                      styles.priceItemLabel2,
                      {
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                    : styles.priceItemLabel2
                }
              >
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(item?.payable_amount ? item?.payable_amount : 0),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol
                )}
              </Text>

              {/* <NumberFormat
                thousandsGroupStyle="thousand"
                value={2456981}
                prefix="$"
                decimalSeparator="."
                displayType="input"
                type="text"
                thousandSeparator={true}
                allowNegative={true}
              /> */}
              {/* <Text
                style={
                  isDarkMode
                    ? [
                        styles.priceItemLabel2,
                        {
                          color: MyDarkTheme.colors.text,
                        },
                      ]
                    : styles.priceItemLabel2
                }>{`${currencies?.primary_currency?.symbol}${Number(
                item?.payable_amount ? item?.payable_amount : 0,
              ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}</Text> */}
            </View>
          </View>
        </View>
      </View>
    );
  };

  //Select Time Laundry
  const _selectTimeLaundry = (item) => {
    if (item == "dropoff") {
      setModalType("dropoff");
      updateState({
        isVisibleTimeModal: true,
      });
    } else {
      setModalType("pickup");
      updateState({
        isVisibleTimeModal: true,
      });
    }
  };

  const _renderItem = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
          // marginVertical: moderateScale(10),
        }}
      >
        {/* show ETA Time */}
        <View style={{ paddingHorizontal: moderateScale(0) }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <UserDetail
              data={item}
              type={strings.VENDER}
              containerStyle={{
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity22
                  : colors.white,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
                paddingHorizontal: moderateScale(8),
                flex: 1
              }}
              textStyle={{
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            />
          </View>


          {!userData?.is_superadmin ? (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: moderateScaleVertical(8),
              paddingHorizontal: moderateScale(8),
            }}
            >
              {!!appData?.profile?.socket_url ? (
                <TouchableOpacity
                  onPress={() => createRoom(item, "vendor_to_user")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                    marginRight: moderateScale(16)
                  }}
                >
                  <Text style={{
                    ...styles.startChatText,
                    color: isDarkMode ? colors.white : colors.black
                  }}>{strings.VENDOR}</Text>
                  <Image
                    resizeMode="contain"
                    style={{ ...styles.agentUserIcon, tintColor: themeColors?.primary_color }}
                    source={imagePath.ecomChat}
                  />
                </TouchableOpacity>
              ) : null}

              {!!appData?.profile?.socket_url &&
                !!(driverStatus?.order && driverStatus?.agent_location?.lat) ? (
                <TouchableOpacity
                  onPress={() => createRoom(item, "agent_to_user")}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{
                    ...styles.startChatText,
                    color: isDarkMode ? colors.white : colors.black
                  }}>{strings.DRIVER}</Text>
                  <Image
                    resizeMode="contain"
                    style={{ ...styles.agentUserIcon, tintColor: themeColors?.primary_color }}
                    source={imagePath.ecomChat}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          {!userData?.is_superadmin && appData?.profile?.socket_url ? <HorizontalLine /> : null}

          {item?.products.length
            ? item?.products.map((i, inx) => {
              if (item?.vendor_id == i?.vendor_id) {
                return (
                  <View
                    style={{
                      marginBottom: moderateScaleVertical(6),
                      paddingHorizontal: moderateScale(8),
                      marginTop: moderateScaleVertical(16)
                    }}
                    key={inx}
                  >
                    <View
                      style={{
                        ...styles.cartItemMainContainer,
                        backgroundColor: isDarkMode
                          ? MyDarkTheme.colors.background
                          : "#F8F8F8",
                        flexDirection: "column",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <FastImage
                          source={
                            i?.image_path
                              ? {
                                uri: getImageUrl(
                                  i?.image_path?.image_fit,
                                  i?.image_path?.image_path,
                                  "300/300"
                                ),
                                priority: FastImage.priority.high,
                              }
                              : ""
                          }
                          style={styles.imageStyle}
                        />

                        <View style={styles.cartItemDetailsCon}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginRight: moderateScaleVertical(10),
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <View
                                style={{
                                  justifyContent: 'center',
                                }}>
                                <Text
                                  style={{
                                    flexDirection: 'row',
                                    // alignItems: 'center',
                                    // backgroundColor: 'yellow',
                                    justifyContent: 'space-between',
                                    color: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : colors.black,
                                  }}>
                                  {i?.product_name}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <View>
                                    {i?.quantity && (
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                        }}
                                      >
                                        <Text
                                          style={{
                                            ...styles.quantityStyles,
                                            color: isDarkMode
                                              ? MyDarkTheme.colors.text
                                              : colors.textGrey,
                                          }}
                                        >
                                          <Text
                                            style={{
                                              ...styles.quantityStyles,
                                              color: isDarkMode
                                                ? MyDarkTheme.colors.text
                                                : colors.textGrey,
                                            }}
                                          >
                                            <Text
                                              style={{
                                                ...styles.quantityStyles,
                                                color: isDarkMode
                                                  ? MyDarkTheme.colors.text
                                                  : colors.textGrey,
                                              }}
                                            >
                                              {strings.QTY}
                                            </Text>
                                            <Text style={styles.cartItemWeight}>
                                              {i?.quantity} {'x'} {tokenConverterPlusCurrencyNumberFormater(
                                                Number(i?.price),
                                                digit_after_decimal,
                                                additional_preferences,
                                                currencies?.primary_currency?.symbol
                                              )}
                                            </Text>
                                            {' = '}
                                          </Text>
                                        </Text>
                                      </View>
                                    )}
                                  </View>

                                  <View
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <Text
                                      numberOfLines={1}
                                      style={{
                                        ...styles.priceItemLabel2,
                                        color: isDarkMode
                                          ? MyDarkTheme.colors.text
                                          : colors.blackOpacity86,
                                        fontSize: textScale(12),
                                        fontFamily: fontFamily.medium,
                                      }}
                                    >
                                      <Text style={styles.cartItemPrice}>
                                        {tokenConverterPlusCurrencyNumberFormater(
                                          Number(i?.price) * Number(i?.quantity),
                                          digit_after_decimal,
                                          additional_preferences,
                                          currencies?.primary_currency?.symbol
                                        )}
                                      </Text>
                                    </Text>
                                  </View>
                                </View>
                                {!!(dineInType == 'appointment') && <View style={{ marginVertical: moderateScaleVertical(5), flexDirection: 'row' }}>
                                  <Text style={{
                                    color: isDarkMode
                                      ? MyDarkTheme.colors.text
                                      : colors.black,
                                  }}> Appointment : </Text>
                                  <Text
                                    style={{
                                      ...styles.quantityStyles,
                                      color: isDarkMode
                                        ? MyDarkTheme.colors.text
                                        : colors.textGrey,
                                    }}
                                  >
                                    {moment(i.scheduled_date_time).format('YYYY-MM-DD')} ({i?.schedule_slot})
                                  </Text>
                                </View>

                                }

                                {!!i?.product_addons.length && (
                                  <View>
                                    <Text style={styles.cartItemWeight2}>
                                      {strings.EXTRA}
                                    </Text>
                                  </View>
                                )}
                                {i?.product_addons.length
                                  ? i?.product_addons.map((j, jnx) => {
                                    return (
                                      <View>
                                        <Text
                                          style={styles.cartItemWeight2}
                                          numberOfLines={1}
                                        >
                                          {j.addon_title}{" "}
                                        </Text>
                                        <View
                                          style={{ flexDirection: "row" }}
                                        >
                                          <Text
                                            style={styles.cartItemWeight2}
                                            numberOfLines={1}
                                          >{`(${j.option_title})`}</Text>
                                          <Text
                                            style={styles.cartItemWeight2}
                                            numberOfLines={1}
                                          >
                                            {tokenConverterPlusCurrencyNumberFormater(
                                              Number(j?.price),
                                              digit_after_decimal,
                                              additional_preferences,
                                              currencies?.primary_currency
                                                ?.symbol
                                            )}
                                          </Text>
                                        </View>
                                      </View>
                                    );
                                  })
                                  : null}

                                {!!(
                                  !!i?.pvariant &&
                                  Number(i?.pvariant?.container_charges)
                                ) && (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: moderateScale(2),
                                      }}
                                    >
                                      <View>
                                        <Text
                                          style={{
                                            ...styles.cartItemWeight2,
                                            color: isDarkMode
                                              ? MyDarkTheme.colors.text
                                              : colors.textGreyB,
                                            marginBottom: moderateScale(2),
                                            // marginTop: moderateScaleVertical(6),
                                          }}
                                        >
                                          {`${strings.CONTAINERCHARGES} : `}
                                        </Text>
                                      </View>
                                      {!!(
                                        !!i?.container_charges &&
                                        Number(i?.container_charges)
                                      ) && (
                                          <View
                                            style={{
                                              marginBottom: moderateScaleVertical(
                                                2
                                              ),
                                            }}
                                          >
                                            <View
                                              style={{
                                                marginRight: moderateScale(10),
                                              }}
                                            >
                                              <Text
                                                style={
                                                  isDarkMode
                                                    ? [
                                                      styles.cartItemWeight2,
                                                      {
                                                        color:
                                                          MyDarkTheme.colors
                                                            .text,
                                                      },
                                                    ]
                                                    : styles.cartItemWeight2
                                                }
                                              // numberOfLines={1}
                                              >
                                                {tokenConverterPlusCurrencyNumberFormater(
                                                  Number(
                                                    i?.pvariant?.container_charges
                                                  ) * Number(i?.quantity),
                                                  digit_after_decimal,
                                                  additional_preferences,
                                                  currencies?.primary_currency
                                                    ?.symbol
                                                )}
                                              </Text>
                                            </View>
                                          </View>
                                        )}
                                    </View>
                                  )}
                                {!!(
                                  !!i?.container_charges &&
                                  Number(i?.container_charges)
                                ) && (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: moderateScale(2),
                                      }}
                                    >
                                      <View>
                                        <Text
                                          style={{
                                            ...styles.cartItemWeight2,
                                            color: isDarkMode
                                              ? MyDarkTheme.colors.text
                                              : colors.textGreyB,
                                            marginBottom: moderateScale(2),
                                            // marginTop: moderateScaleVertical(6),
                                          }}
                                        >
                                          {`${strings.CONTAINERCHARGES} : `}
                                        </Text>
                                      </View>
                                      {!!(
                                        !!i?.container_charges &&
                                        Number(i?.container_charges)
                                      ) && (
                                          <View
                                            style={{
                                              marginBottom:
                                                moderateScaleVertical(2),
                                            }}>
                                            <View
                                              style={{
                                                marginRight: moderateScale(10),
                                              }}>
                                              <Text
                                                style={
                                                  isDarkMode
                                                    ? [
                                                      styles.cartItemWeight2,
                                                      {
                                                        color:
                                                          MyDarkTheme.colors
                                                            .text,
                                                      },
                                                    ]
                                                    : styles.cartItemWeight2
                                                }
                                              // numberOfLines={1}
                                              >
                                                {tokenConverterPlusCurrencyNumberFormater(
                                                  Number(i?.container_charges),
                                                  digit_after_decimal,
                                                  additional_preferences,
                                                  currencies?.primary_currency?.symbol,
                                                )}
                                              </Text>
                                            </View>
                                          </View>
                                        )}
                                    </View>
                                  )}
                              </View>
                            </View>
                          </View>
                        </View>
                        {cartData?.luxury_option_name == 'rental' ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginVertical: moderateScaleVertical(10),
                            }}>
                            <View>
                              <Text style={styles.startEndDateTitle}>
                                Start Date
                              </Text>
                              <Text style={styles.startEndDateValueTxt}>
                                {i?.start_date_time}
                              </Text>
                            </View>
                            <View>
                              <Text style={styles.startEndDateTitle}>
                                End Date
                              </Text>
                              <Text style={styles.startEndDateValueTxt}>
                                {i?.end_date_time}
                              </Text>
                            </View>
                            <View>
                              <Text style={styles.startEndDateTitle}>
                                Duration
                              </Text>
                              <Text style={styles.startEndDateValueTxt}>
                                {getHourAndMinutes(
                                  Number(i?.total_booking_time),
                                )}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                      </View>

                      {!!driverStatus?.order &&
                        driverStatus?.order?.status === 'completed' || paramData?.orderStatus?.current_status?.title === 'Delivered' ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingBottom: moderateScaleVertical(5),
                            paddingHorizontal: moderateScale(10),
                            marginVertical: moderateScaleVertical(16),
                          }}>
                          <StarRating
                            maxStars={5}
                            rating={Number(i?.product_rating?.rating)}
                            selectedStar={(rating) =>
                              onStarRatingPress(i, rating)
                            }
                            fullStarColor={colors.ORANGE}
                            starSize={15}
                          />
                          {Number(i?.product_rating?.rating) ? (
                            <TouchableOpacity
                              onPress={() => _onRateOrderOrDriver(i)}>
                              <Text
                                style={[
                                  styles.writeAReview,
                                  { color: themeColors.primary_color },
                                ]}>
                                {strings.WRITE_REVIEW}
                              </Text>
                            </TouchableOpacity>
                          ) : null}

                          {/* {i?.product_rating?.rating ? (
                          <View>
                            <Text
                              onPress={() => rateYourOrder(i)}
                              style={[
                                styles.writeAReview,
                                { color: themeColors.primary_color },
                              ]}>
                              {strings.WRITE_REVIEW}
                            </Text>
                          </View>
                        ) : null} */}
                        </View>
                      ) : null}
                      {!!i?.is_processor_enable && (
                        <View>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              fontFamily: fontFamily.regular,
                              color: colors.black,
                            }}>
                            {'Processor Name : '} {i?.processor_name}{' '}
                          </Text>
                          <Text
                            style={{
                              fontSize: moderateScale(14),
                              fontFamily: fontFamily.regular,
                              color: colors.black,
                            }}>
                            {'Date : '} {i?.processor_date}{' '}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              } else {
                null;
              }
            })
            : null}

          {businessType == "laundry" && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: moderateScale(20),
                paddingHorizontal: moderateScale(5),
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => _selectTimeLaundry("pickup")}
              >
                <Image source={imagePath.pickUpSchedule} />
                <View>
                  <Text
                    style={{
                      ...styles.laundryApppriceItemLabel2,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : themeColors?.primary_color,
                    }}
                  >
                    {" "}
                    {strings.RE_SCEDULE_PICKUP}
                  </Text>
                  {laundrySelectedPickupDate && (
                    <Text
                      numberOfLines={2}
                      style={{
                        ...styles.laundryApppriceItemLabel2,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginLeft: 0,
                      }}
                    >
                      {laundrySelectedPickupDate}
                      {", "}
                      {laundrySelectedPickupSlot}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => _selectTimeLaundry("dropoff")}
              >
                <Image source={imagePath.dropOffSchedule} />
                <View>
                  <Text
                    style={{
                      ...styles.laundryApppriceItemLabel2,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : themeColors?.primary_color,
                    }}
                  >
                    {" "}
                    {strings.RE_SCEDULE_DROP}
                  </Text>
                  {laundrySelectedDropOffDate && (
                    <Text
                      numberOfLines={2}
                      style={{
                        ...styles.laundryApppriceItemLabel2,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginLeft: 0,
                      }}
                    >
                      {laundrySelectedDropOffDate}
                      {", "}
                      {laundrySelectedDropOffSlot}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {!!Number(item?.discount_amount) && (
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                    : styles.priceItemLabel
                }
              >
                {strings.DISCOUNT}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                    : styles.priceItemLabel
                }
              >{`- ${tokenConverterPlusCurrencyNumberFormater(
                Number(item?.discount_amount ? item?.discount_amount : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}`}</Text>
            </View>
          )}

          {!!cartData?.comment_for_vendor && (
            <View style={{ marginHorizontal: moderateScale(10) }}>
              <LeftRightText
                leftText={strings.SPECIAL_INSTRUCTION}
                rightText={cartData?.comment_for_vendor}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                }}
                rightTextStyle={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity86,
                }}
              />
            </View>
          )}
          {!!Number(item?.delivery_fee) && (
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                    : styles.priceItemLabel
                }
              >
                {strings.DELIVERY_CHARGES}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                    : styles.priceItemLabel
                }
              >
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(item?.delivery_fee ? item?.delivery_fee : 0),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol
                )}
              </Text>
            </View>
          )}


          {!!Number(item?.total_container_charges) && (index == cartItems.length - 1) && (
            <View style={styles.itemPriceDiscountTaxView}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                    : styles.priceItemLabel
                }
              >
                {strings.CONTAINER_CHARGES}
              </Text>

              <Text
                style={
                  isDarkMode
                    ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                    : styles.priceItemLabel
                }>
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(
                    cartData?.total_container_charges
                      ? cartData?.total_container_charges
                      : 0,
                  ),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
            </View>
          )}
          <View style={styles.itemPriceDiscountTaxView}>
            <Text
              style={{
                ...styles.summaryText,
                fontSize: textScale(14),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            >
              {strings.AMOUNT}
            </Text>
            <Text
              style={{
                ...styles.summaryText,
                fontSize: textScale(14),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            >
              {tokenConverterPlusCurrencyNumberFormater(
                Number(item?.payable_amount ? item?.payable_amount : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const orderAmountDetail = () => {
    return (
      <View style={styles.priceSection}>
        {/* <Text style={styles.price}>{strings.PRICE}</Text> */}
        <View
          style={[
            styles.bottomTabLableValue,
            // {marginTop: moderateScaleVertical(10)},
          ]}
        >
          <Text
            style={
              isDarkMode
                ? [
                  styles.priceItemLabel,
                  {
                    color: MyDarkTheme.colors.text,
                    fontSize: textScale(14),
                  },
                ]
                : styles.priceItemLabel
            }
          >
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                  styles.priceItemLabel,
                  {
                    color: MyDarkTheme.colors.text,
                    fontSize: textScale(14),
                  },
                ]
                : styles.priceItemLabel
            }
          >
            {tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.total_amount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}
          </Text>
        </View>

        {!!cartData?.wallet_amount_used && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }
            >
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }
            >{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(
                cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}`}</Text>
          </View>
        )}
        {!!cartData?.loyalty_amount_saved && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }
            >
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }
            >{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(
                cartData?.loyalty_amount_saved
                  ? cartData?.loyalty_amount_saved
                  : 0
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}`}</Text>
          </View>
        )}

        {!!cartData?.total_discount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }
            >
              {strings.TOTAL_DISCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                  : styles.priceItemLabel
              }
            >{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.total_discount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}`}</Text>
          </View>
        )}

        <View style={styles.amountPayable}>
          <Text
            style={
              isDarkMode
                ? [
                  styles.priceItemLabel2,
                  {
                    color: MyDarkTheme.colors.text,
                    fontSize: textScale(14),
                  },
                ]
                : styles.priceItemLabel2
            }
          >
            {strings.AMOUNT_PAYABLE}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                  styles.priceItemLabel2,
                  {
                    color: MyDarkTheme.colors.text,
                    fontSize: textScale(14),
                  },
                ]
                : styles.priceItemLabel2
            }
          >
            {tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.payable_amount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}
          </Text>
        </View>
      </View>
    );
  };



  const getFooter = () => {
    return (
      <View
        style={{
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}
      >
        <View
          style={{
            padding: moderateScale(16),
          }}
        >
          {!!cartData?.address_id ? ( // delivery address will visible only if dine_in_type==delivery
            <View>
              <Text
                style={{
                  ...styles.summaryText,
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                }}
              >
                {/* {console.log(preferences?.business_type, "preferences?.business_type")}
            { (preferences?.business_type == 'home_service') ? strings.DELIEVERY_ADDRESS: 'Service Address' } */}
                {getBundleId() == appIds.quickLube &&
                  preferences?.business_type == "home_service"
                  ? strings.SERVICE_ADDRESS
                  : strings.DELIEVERY_ADDRESS}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: moderateScaleVertical(16),
                }}
              >
                {!!cartData?.address?.latitude ? (
                  <View
                    style={{
                      height: moderateScale(60),
                      width: moderateScale(60),
                      borderRadius: 10,
                    }}
                  >
                    <MapView
                      scrollEnabled={false}
                      zoomEnabled={false}
                      zoomTapEnabled={false}
                      zoomControlEnabled={false}
                      pitchEnabled={false}
                      toolbarEnabled={false}
                      scrollDuringRotateOrZoomEnabled={false}
                      style={{
                        height: moderateScale(60),
                        width: moderateScale(60),
                        borderRadius: 10,
                      }}
                      region={{
                        latitude: Number(cartData?.address?.latitude),
                        longitude: Number(cartData?.address?.longitude),
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0922,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: Number(cartData?.address?.latitude),
                          longitude: Number(cartData?.address?.longitude),
                          latitudeDelta: 0.0922,
                          longitudeDelta: 0.0922,
                        }}
                        image={imagePath.markerPin}
                      />
                    </MapView>
                  </View>
                ) : (
                  <Image source={imagePath.mapIcon} />
                )}
                {/* Service Address */}

                <View style={{ marginLeft: moderateScale(12), flex: 1 }}>
                  {cartData?.luxury_option_id == 3 ? (
                    <Text
                      style={{
                        ...styles.summaryText,
                        fontSize: textScale(12),
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity43,
                        flex: 1,
                      }}
                    >
                      {cartData?.vendors[0]?.vendor?.address}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        ...styles.summaryText,
                        fontSize: textScale(12),
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity43,
                        flex: 1,
                      }}
                    >
                      {`${cartData?.address?.house_number === null
                        ? ""
                        : `${cartData?.address?.house_number}, `
                        }`}
                      {cartData?.address?.address} {""}
                      {cartData?.address?.pincode}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ) : null}
          <LeftRightText
            leftText={strings.ORDER_NUMBER}
            rightText={`#${cartData?.order_number || ""}`}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />

          <LeftRightText
            leftText={strings.PAYMENT_METHOD}
            rightText={
              cartData?.payment_option?.title_lng
                ? cartData?.payment_option?.title_lng
                : cartData?.payment_option?.title || ""
            }
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />
          <LeftRightText
            leftText={strings.PLACED_ON}
            rightText={cartData?.created_date}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity43,
            }}
            rightTextStyle={{
              fontSize: textScale(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />

          {!!cartData && !!cartData?.specific_instructions && (
            <SpecificInstruction
              leftText={strings.SPECIFIC_INSTRUCTIONS}
              rightText={cartData?.specific_instructions}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
              leftTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity43,
              }}
              rightTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            />
          )}



          {!!cartData?.scheduled_date_time && !dineInType == 'appointment' && (
            <LeftRightText
              leftText={strings.SEHEDLEDFOR}
              rightText={cartData?.scheduled_date_time}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
              leftTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity43,
              }}
              rightTextStyle={{
                fontSize: textScale(12),
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
              }}
            />
          )}

          {!!cartItems[0]?.vendor_dinein_table_id && (
            <View>
              <View
                style={{
                  height: 0.8,
                  backgroundColor: "grey",
                  marginBottom: moderateScale(10),
                  opacity: 0.5,
                }}
              />
              <LeftRightText
                leftText={"Table info"}
                rightText={""}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
                leftTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                }}
                rightTextStyle={{
                  fontSize: textScale(12),
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity86,
                }}
              />
              {cartItems[0]?.dineInTableCategory && (
                <LeftRightText
                  leftText={"Category Name"}
                  rightText={cartItems[0]?.dineInTableCategory}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              )}
              {cartItems[0]?.dineInTableName && (
                <LeftRightText
                  leftText={"Table Number"}
                  rightText={cartItems[0]?.dineInTableName}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              )}
              {cartItems[0]?.dineInTableCapacity && (
                <LeftRightText
                  leftText={"Seat Capacity"}
                  rightText={cartItems[0]?.dineInTableCapacity}
                  isDarkMode={isDarkMode}
                  MyDarkTheme={MyDarkTheme}
                  leftTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                  }}
                  rightTextStyle={{
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity86,
                  }}
                />
              )}
            </View>
          )}
        </View>
        <View
          style={{
            padding: moderateScale(16),
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.greyColor,
          }}
        >
          <Text
            style={{
              ...styles.summaryText,
              fontFamily: fontFamily.medium,
              fontSize: textScale(14),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          >
            {strings.PAYMENT_SUMMARY}
          </Text>

          {!!cartData?.total_amount && cartData?.total_amount !== "0.00" && (
            <LeftRightText
              leftText={strings.SUBTOTAL}
              rightText={tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.slot_based_Price &&
            cartData?.slot_based_Price !== '0.00' && (
              <LeftRightText
                leftText={strings.DELIVERY_SLOT_FEES}
                rightText={tokenConverterPlusCurrencyNumberFormater(
                  Number(cartData?.slot_based_Price),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}
          {Number(cartData?.additional_price) > 0 && (
            <LeftRightText
              leftText={strings.ADDITIONAL_CHARGES}
              rightText={tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.additional_price),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.total_delivery_fee &&
            cartData?.total_delivery_fee > 0 && (
              <LeftRightText
                leftText={strings.DELIVERY_FEE}
                rightText={tokenConverterPlusCurrencyNumberFormater(
                  Number(cartData?.total_delivery_fee),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol
                )}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}
          {!!(cartData?.total_waiting_price > 0) && (
            <LeftRightText
              leftText={`${strings.WAITING_TIME} (${cartData?.total_waiting_time} ${strings.MIN})`}
              rightText={tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_waiting_price),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.wallet_amount_used &&
            cartData?.wallet_amount_used > 0 && (
              <LeftRightText
                leftText={strings.WALLET}
                rightText={`- ${tokenConverterPlusCurrencyNumberFormater(
                  Number(cartData?.wallet_amount_used),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol
                )}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}

          {Number(cartData?.fixed_fee_amount) > 0 && (
            <LeftRightText
              leftText={
                preferences?.fixed_fee_nomenclature != "" &&
                  preferences?.fixed_fee_nomenclature != null
                  ? preferences?.fixed_fee_nomenclature
                  : strings.FIXED_FEE
              }
              rightText={tokenConverterPlusCurrencyNumberFormater(
                Number(
                  cartData?.fixed_fee_amount ? cartData?.fixed_fee_amount : 0
                ),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {/* {(cartData?.total_service_fee > 0) && (
            <LeftRightText
              leftText={'Service Fee'}
              rightText={tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_service_fee),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )} */}
          {(cartData?.total_other_taxes > 0 ||
            Number(cartData?.taxable_amount) > 0) && (
              <LeftRightText
                leftText={strings.TAXES_FEES}
                rightText={tokenConverterPlusCurrencyNumberFormater(
                  Number(cartData?.taxable_amount),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol
                )}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}
          {(cartData?.total_service_fee > 0) && (
            <LeftRightText
              leftText={'Service Fee'}
              rightText={tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_service_fee),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.loyalty_amount_saved &&
            cartData?.loyalty_amount_saved > 0 && (
              <LeftRightText
                leftText={strings.LOYALTY}
                rightText={`- ${tokenConverterPlusCurrencyNumberFormater(
                  Number(cartData?.loyalty_amount_saved),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol
                )}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}
          {/* {!!cartData?.vendors[0]?.total_container_charges &&
            Number(cartData?.total_container_charges) > 0 && (
              <LeftRightText
                leftText={strings.TOTALCONTAINERCHARGES}
                rightText={`- ${tokenConverterPlusCurrencyNumberFormater(
                  Number(cartData?.total_container_charges),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )} */}

          {!!cartData?.tip_amount && cartData?.tip_amount > 0 && (
            <LeftRightText
              leftText={strings.TIP_AMOUNT}
              rightText={tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.tip_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.total_discount && cartData?.total_discount > 0 && (
            <LeftRightText
              leftText={strings.DISCOUNT}
              rightText={`- ${tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_discount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          {!!cartData?.advance_paid_amount &&
            cartData?.advance_paid_amount > 0 && (
              <LeftRightText
                leftText={"Advance Paid Amount"}
                rightText={`${currencies?.primary_currency?.symbol
                  }${currencyNumberFormatter(
                    Number(cartData?.advance_paid_amount),
                    appData?.profile?.preferences?.digit_after_decimal
                  )}`}
                isDarkMode={isDarkMode}
                MyDarkTheme={MyDarkTheme}
              />
            )}
          {!!cartData?.pending_amount && cartData?.pending_amount > 0 && (
            <LeftRightText
              leftText={"Pending Amount"}
              rightText={` ${currencies?.primary_currency?.symbol
                }${currencyNumberFormatter(
                  Number(cartData?.pending_amount),
                  appData?.profile?.preferences?.digit_after_decimal
                )}`}
              isDarkMode={isDarkMode}
              MyDarkTheme={MyDarkTheme}
            />
          )}
          <View
            style={{
              ...styles.dottedLine,
              borderColor: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.lightGreyBgColor,
            }}
          />
          <LeftRightText
            leftText={strings.TOTAL}
            rightText={tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.payable_amount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}
            isDarkMode={isDarkMode}
            MyDarkTheme={MyDarkTheme}
            leftTextStyle={{
              fontSize: textScale(16),
              marginBottom: moderateScaleVertical(12),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
            rightTextStyle={{
              fontSize: textScale(16),
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
          />
          {console.log(appData, "tippppppppp")}
          {console.log(appData?.profile?.preferences?.tip_after_order, "tippppppppp2222")}
          {!!(
            paramData?.orderStatus?.current_status?.title ===
            strings.DELIVERED &&
            appData?.profile?.preferences?.tip_after_order &&
            (Number(cartData?.tip_amount) == 0 ||
              Number(cartData?.tip_amount) == null) &&
            !!cartData?.tip &&
            cartData?.tip.length
          ) && (
              <View
                style={{
                  flexDirection: "column",
                  marginTop: 20,
                  justifyContent: "space-between",
                  marginVertical: moderateScaleVertical(5),
                }}
              >
                <Text
                  style={{
                    color: colors.textGreyB,
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                  }}
                >
                  {strings.DOYOUWANTTOGIVEATIP}
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  {cartData?.payable_amount !== "0.00" &&
                    cartData?.tip.map((j, jnx) => {
                      return (
                        <TouchableOpacity
                          key={String(jnx)}
                          style={{
                            backgroundColor:
                              selectedTipvalue?.value == j?.value
                                ? themeColors.primary_color
                                : "transparent",
                            flex: 0.18,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 0.7,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            marginRight: 5,
                            marginVertical: 20,
                            borderRadius: moderateScale(5),
                            borderColor: themeColors.primary_color,
                          }}
                          onPress={() => selectedTip(j)}
                        >
                          <Text
                            style={
                              isDarkMode
                                ? {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : MyDarkTheme.colors.text,
                                }
                                : {
                                  color:
                                    selectedTipvalue?.value == j?.value
                                      ? colors.white
                                      : colors.black,
                                }
                            }
                          >
                            {tokenConverterPlusCurrencyNumberFormater(
                              j?.value,
                              digit_after_decimal,
                              additional_preferences,
                              currencies?.primary_currency?.symbol
                            )}
                          </Text>
                          <Text
                            style={{
                              color:
                                selectedTipvalue?.value == j?.value
                                  ? colors.white
                                  : colors.textGreyB,
                            }}
                          >
                            {j.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}

                  {cartData?.payable_amount !== "0.00" && (
                    <TouchableOpacity
                      style={{
                        backgroundColor:
                          selectedTipvalue == "custom"
                            ? themeColors.primary_color
                            : "transparent",
                        flex: cartData?.total_payable_amount !== 0 ? 0.45 : 0.2,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 0.7,
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        marginLeft: 2,
                        marginVertical: 20,
                        borderRadius: moderateScale(5),
                        borderColor: themeColors.primary_color,
                      }}
                      onPress={() => selectedTip("custom")}
                    >
                      <Text
                        style={
                          isDarkMode
                            ? {
                              color:
                                selectedTipvalue == "custom"
                                  ? colors.white
                                  : MyDarkTheme.colors.text,
                            }
                            : {
                              color:
                                selectedTipvalue == "custom"
                                  ? colors.white
                                  : colors.black,
                            }
                        }
                      >
                        {strings.CUSTOM}
                      </Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>

                {!!selectedTipvalue && selectedTipvalue == "custom" && (
                  <View
                    style={{
                      borderRadius: 5,
                      borderWidth: 0.5,
                      borderColor: colors.textGreyB,
                      height: 40,
                      marginTop: moderateScaleVertical(12),
                    }}
                  >
                    <TextInput
                      value={selectedTipAmount}
                      onChangeText={(text) =>
                        updateState({ selectedTipAmount: text })
                      }
                      style={{
                        height: 40,
                        alignItems: "center",
                        paddingHorizontal: 10,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGreyOpcaity7,
                      }}
                      maxLength={5}
                      returnKeyType={"done"}
                      keyboardType={"number-pad"}
                      placeholder={strings.ENTER_CUSTOM_AMOUNT}
                      placeholderTextColor={
                        isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGreyOpcaity7
                      }
                    />
                  </View>
                )}
                <TouchableOpacity
                  // onPress={onPressRateOrder}
                  onPress={_onAddTip}
                  // style={{flex:0.6}}
                  style={{
                    justifyContent: "center",
                    backgroundColor: themeColors.primary_color,
                    alignItems: "center",
                    borderRadius: moderateScale(10),
                    paddingVertical: moderateScaleVertical(10),
                    marginTop: moderateScaleVertical(10),
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontFamily: fontFamily.medium,
                      fontSize: textScale(10),
                    }}
                  >
                    {strings.ADD_TIP}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          <View
            style={{
              height: moderateScaleVertical(40),
            }}
          />
        </View>

        {dispatcherStatus?.order_status?.current_status?.title ==
          strings.DELIVERED &&
          !!appData?.profile?.preferences?.facturama_invoice && (
            <ButtonWithLoader
              color={themeColors?.primary_color}
              isLoading={isLoadingA}
              onPress={generateInvoice}
              btnStyle={{
                marginHorizontal: moderateScale(8),
                borderColor: themeColors.primary_color,
              }}
              btnText={"Generate Invoice"}
              btnTextStyle={{
                color: themeColors.primary_color,
              }}
            />
          )}

        {/* takeaway notification button */}
        {!!(preferences.is_enable_curb_side &&
          orderStatus?.current_status?.title == "Out For Delivery" &&
          dineInType == 'takeaway') &&
          <BrowseMenuButton
            fontFamily={fontFamily}
            onMenuTap={sendNotificationToVendor}
            btnText={strings.NOTIFY_VENDOR}
            btnImage={imagePath.ic_notification1}
            btnImageStyle={{ tintColor: colors.white }}
          // containerStyle={{ marginBottom: moderateScale(-58) }}
          />
        }
      </View>
    );
  };

  // send notification to vendor by customer ************************************>
  const sendNotificationToVendor = () => {
    const apiData = {
      order_id: cartData?.id,
      vendor_id: cartItems[0]?.vendor_id,
    }
    const apiHeader = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    }
    actions.sendNotification(apiData, apiHeader).then((res) => {
      showSuccess(res?.message);
    }).catch((error) => {
      showError(error?.error || error?.message || "");
    })
  }

  const selectedTip = (tip) => {
    if (selectedTipvalue == "custom") {
      updateState({ selectedTipvalue: tip, selectedTipAmount: null });
    } else {
      if (selectedTipvalue && selectedTipvalue?.value == tip?.value) {
        updateState({ selectedTipvalue: null, selectedTipAmount: null });
      } else {
        updateState({ selectedTipvalue: tip, selectedTipAmount: tip?.value });
      }
    }
  };

  const _onAddTip = () => {
    if (!selectedTipAmount) {
      showError(strings.PLEASE_SELECT_VALID_OPTION);
    } else if (!userData?.auth_token) {
      actions.setAppSessionData("on_login");
    } else {
      moveToNewScreen(navigationStrings.TIP_PAYMENT_OPTIONS, {
        selectedTipAmount: selectedTipAmount,
        order_number: cartData?.order_number,
      })();
    }
  };

  const onCenter = () => {
    // return
    mapRef.current.fitToCoordinates(
      [
        {
          latitude: Number(driverStatus?.tasks[driverStatus?.tasks.length - 2]?.latitude),
          longitude: Number(driverStatus?.tasks[driverStatus?.tasks.length - 2]?.longitude),
        },
        {
          latitude: Number(driverStatus?.tasks[driverStatus?.tasks.length - 1]?.latitude),
          longitude: Number(driverStatus?.tasks[driverStatus?.tasks.length - 1]?.longitude),
        },
        {
          latitude: Number(driverStatus?.agent_location?.lat),
          longitude: Number(driverStatus?.agent_location?.long),
        },
      ],
      {
        edgePadding: {
          right: width / 20,
          bottom: height / 20,
          left: width / 20,
          top: height / 20,
        },
      }
    );
  };

  const acceptRejectDriverUpdation = (status) => {
    if (
      status == 1 &&
      updatedcartData &&
      Number(updatedcartData?.user_wallet_balance) <
      Number(updatedcartData?.difference_to_be_paid) &&
      cartData?.payment_option?.id != 1
    ) {
      showError(strings.INSUFFICIENT_FUNDS_IN_WALLET_PLEASERECHARGE);
    } else {
      let data = {};
      data["cart_id"] = updatedcartData?.id;
      data["address_id"] = updatedcartData?.address_id;
      data["order_vendor_id"] = updatedcartData?.order_vendor_id;
      data["status"] = status;
      data["total_payable_amount"] = updatedcartData?.difference_to_be_paid;

      updateState({ isLoading: true });
      console.log(data, ">>>>>>data");
      actions
        .acceptRejectDriveUpdate(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          timezone: RNLocalize.getTimeZone(),
          // systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          showSuccess(res?.message);
          // updateState({isLoading: false});
          _getOrderDetailScreen();
        })
        .catch((error) => console.log(error, "errorororor"));
    }
  };

  //get footer start
  const getFooter2 = () => {
    return (
      <View style={{ marginHorizontal: moderateScale(5) }}>
        <View style={styles2.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles2.priceItemLabel
            }
          >
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles2.priceItemLabel
            }
          >
            {tokenConverterPlusCurrencyNumberFormater(
              Number(updatedcartData?.gross_paybale_amount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}
          </Text>
        </View>
        {!!updatedcartData?.wallet_amount && (
          <View style={styles2.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >
              {tokenConverterPlusCurrencyNumberFormater(
                Number(
                  updatedcartData?.wallet_amount
                    ? updatedcartData?.wallet_amount
                    : 0
                ),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
            </Text>
          </View>
        )}
        {!!updatedcartData?.loyalty_amount && (
          <View style={styles2.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(
                updatedcartData?.loyalty_amount
                  ? updatedcartData?.loyalty_amount
                  : 0
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}`}</Text>
          </View>
        )}

        {!!updatedcartData?.wallet_amount_used && (
          <View style={styles2.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(
                updatedcartData?.wallet_amount_used
                  ? updatedcartData?.wallet_amount_used
                  : 0
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}`}</Text>
          </View>
        )}
        {!!updatedcartData?.total_subscription_discount && (
          <View style={styles2.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >
              {strings.TOTALSUBSCRIPTION}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles2.priceItemLabel
              }
            >{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(updatedcartData?.total_subscription_discount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}`}</Text>
          </View>
        )}
        {(updatedcartData?.total_tax > 0 ||
          updatedcartData?.total_service_fee > 0) && (
            <Animatable.View
              style={{
                ...styles2.bottomTabLableValue,
                marginTop: moderateScale(8),
                marginBottom: moderateScale(2),
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                hitSlop={hitSlopProp}
                onPress={() => updateState({ showTaxFeeArea: !showTaxFeeArea })}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={{
                      ...styles2.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                    }}
                  >
                    {strings.TAXES_FEES}
                  </Text>

                  <Image
                    source={imagePath.dropDownNew}
                    style={{
                      transform: [{ scaleY: showTaxFeeArea ? -1 : 1 }],
                      marginHorizontal: moderateScale(2),
                    }}
                  />
                </View>
              </TouchableOpacity>

              <Text
                style={
                  isDarkMode
                    ? [styles2.priceItemLabel, { color: MyDarkTheme.colors.text }]
                    : styles2.priceItemLabel
                }
              >
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(
                    updatedcartData?.total_tax ? updatedcartData?.total_tax : 0
                  ) +
                  Number(
                    updatedcartData?.total_service_fee
                      ? updatedcartData?.total_service_fee
                      : 0
                  ),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol
                )}
              </Text>
            </Animatable.View>
          )}
        {showTaxFeeArea && (
          <View>
            <Animatable.View
              animation="fadeIn"
              style={{ marginLeft: moderateScale(15) }}
            >
              {updatedcartData?.total_service_fee > 0 && (
                <View
                  style={{ ...styles2.bottomTabLableValue, marginVertical: 1 }}
                >
                  <Text
                    style={{
                      ...styles2.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >
                    {strings.TOTAL_SERVICE_FEE}
                  </Text>

                  <Text
                    style={{
                      ...styles2.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >
                    {tokenConverterPlusCurrencyNumberFormater(
                      Number(
                        updatedcartData?.total_service_fee
                          ? updatedcartData?.total_service_fee
                          : 0
                      ),
                      digit_after_decimal,
                      additional_preferences,
                      currencies?.primary_currency?.symbol
                    )}
                  </Text>
                </View>
              )}
              {updatedcartData?.total_tax > 0 && (
                <View
                  style={{ ...styles2.bottomTabLableValue, marginVertical: 1 }}
                >
                  <Text
                    style={{
                      ...styles2.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >
                    {strings.TAX_AMOUNT}
                  </Text>

                  <Text
                    style={{
                      ...styles2.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}
                  >
                    {tokenConverterPlusCurrencyNumberFormater(
                      Number(
                        updatedcartData?.total_tax
                          ? updatedcartData?.total_tax
                          : 0
                      ),
                      digit_after_decimal,
                      additional_preferences,
                      currencies?.primary_currency?.symbol
                    )}
                  </Text>
                </View>
              )}
            </Animatable.View>
          </View>
        )}

        <View style={styles2.amountPayable}>
          <Text
            style={{
              ...styles2.priceItemLabel2,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}
          >
            {strings.TOTAL_AMOUNT}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles2.priceItemLabel2, { color: MyDarkTheme.colors.text }]
                : styles2.priceItemLabel2
            }
          >
            {tokenConverterPlusCurrencyNumberFormater(
              Number(updatedcartData?.total_payable_amount) +
              (selectedTipAmount != null && selectedTipAmount != ""
                ? Number(selectedTipAmount)
                : 0),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}
          </Text>
        </View>
        <View style={styles2.amountPayable}>
          <View>
            <Text
              style={{
                ...styles2.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {`${strings.AMOUNT_PAYABLE}`}
            </Text>
            <Text
              style={{
                ...styles2.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB,
                fontSize: textScale(10),
              }}
            >
              {`(${strings.DIFFERENCEAMOUNT})`}
            </Text>
          </View>
          <View>
            <Text
              style={
                isDarkMode
                  ? [
                    styles2.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                      textDecorationLine: "line-through",
                    },
                  ]
                  : [
                    styles2.priceItemLabel2,
                    { textDecorationLine: "line-through" },
                  ]
              }
            >
              {tokenConverterPlusCurrencyNumberFormater(
                Number(updatedcartData?.total_payable_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles2.priceItemLabel2,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles2.priceItemLabel2
              }
            >
              {tokenConverterPlusCurrencyNumberFormater(
                Number(updatedcartData?.difference_to_be_paid),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginVertical: moderateScale(10),
            marginHorizontal: moderateScale(10),
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => acceptRejectDriverUpdation(1)}
            style={{
              borderRadius: 50,
              alignItems: "center",
              backgroundColor: themeColors?.primary_color,
              width: width / 4,
              borderColor: themeColors?.primary_color,
              borderWidth: 1,
              padding: moderateScale(5),
            }}
          >
            <Text
              style={{
                color: colors?.white,
                fontFamily: fontFamily?.medium,
                fontSize: textScale(14),
              }}
            >
              {strings.APPROVE}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const onChat = (item) => {
    navigation.navigate(navigationStrings.CHAT_SCREEN, { data: { ...item } });
  };

  const _onRateOrderOrDriver = (item) => {
    navigation.navigate(navigationStrings.RATEORDER, { item });
  };

  // give Driver Rating




  console.log("driverStatus?.tasks", driverStatus?.tasks)

  const onStarRatingForDriverPress = (rating) => {
    const data = {
      order_id: cartData?.driver_rating?.order_id
        ? cartData?.driver_rating?.order_id
        : paramData?.orderId,
      rating: rating,
      review: "",
    };

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


  {/* 
  //1 assigned - pickup
  // 1 pending - drop
  //2 on the way
  // 3 ready for pickup - pickup
  // 3 ready for dipatrture - drop
  
*/}

  const orderStatusTitle = (val) => {
    if (val?.task_type_id == 1 && val?.task_status == '1') {
      return strings.ASSIGNED
    }
    if (val?.task_type_id == 2 && val?.task_status == '1') {
      return strings.PENDING
    }
    if (val?.task_status == '2') {
      return strings.ON_THE_WAY
    }
    if (val?.task_type_id == 1 && val?.task_status == '3') {
      return strings.READY_FOR_PICKUP
    }
    if (val?.task_type_id == 2 && val?.task_status == '3') {
      return strings.READY_FOR_DEPARTURE
    }
    if (val?.task_status == '4') {
      return strings.DELIVERED
    }
    return ''
  }

  const getHeader = () => {
    let showMapDriver = driverStatus?.tasks?.length == 2 ? true : driverStatus?.tasks[driverStatus?.tasks.length - 3]?.task_status == '4' ? true : false
    // let showMapDriver = false
    return (
      <View>
        {!!(driverStatus?.order && driverStatus?.agent_location?.lat) && showMapDriver ? (
          <UserDetail
            data={driverStatus}
            type={strings.DRIVER}
            containerStyle={{
              backgroundColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.white,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              paddingHorizontal: moderateScale(8),
              flex: 1
            }}
            textStyle={{
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
            }}
            isDriver={cartData?.order_data?.order?.driver_id}
            _onRateDriver={() =>
              _onRateOrderOrDriver({
                order_id: cartData?.driver_rating?.order_id
                  ? cartData?.driver_rating?.order_id
                  : paramData?.orderId,
                isDriverRate: true,
                driverRatingData: driverRatingData
                  ? driverRatingData
                  : cartData?.driver_rating,
              })
            }
            onStarRatingForDriverPress={onStarRatingForDriverPress}
            submitedRatingToDriver={submitedRatingToDriver}
            cartData={cartData}
          />
        ) : null}



        {!!driverStatus &&
          !!driverStatus?.agent_location?.lat && orderStatus?.current_status?.title != "Delivered" &&
          !lalaMoveUrl && showMapDriver ? (
          <View style={{ width: "100%", height: height / 2.2 }}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              initialRegion={{
                latitude: Number(driverStatus?.tasks[driverStatus?.tasks?.length - 2]?.latitude),
                longitude: Number(driverStatus?.tasks[driverStatus?.tasks?.length - 2]?.longitude),
                latitudeDelta: 0.0222,
                longitudeDelta: 0.032,
              }}
              rotateEnabled={true}
            >
              {!!driverStatus?.tasks[1]?.latitude && (!!driverStatus?.agent_location?.lat) ?
                <MapViewDirections
                  resetOnChange={false}

                  origin={
                    orderStatus?.current_status?.title !== "completed" && orderStatus?.current_status?.title !== "unassigned"
                      ? {
                        latitude: Number(driverStatus?.agent_location?.lat),
                        longitude: Number(
                          driverStatus?.agent_location?.long ||
                          driverStatus?.agent_location?.lng
                        ),
                      }
                      : driverStatus?.tasks[driverStatus?.tasks?.length - 2]
                  }
                  destination={{
                    latitude: Number(driverStatus?.tasks[driverStatus?.tasks?.length - 1]?.latitude),
                    longitude: Number(driverStatus?.tasks[driverStatus?.tasks?.length - 1]?.longitude),
                    latitudeDelta: 0.0222,
                    longitudeDelta: 0.032,
                  }}
                  apikey={appData.profile?.preferences?.map_key}
                  strokeWidth={3}
                  strokeColor={themeColors?.primary_color}
                  optimizeWaypoints={false}
                  onStart={(params) => { }}
                  precision={"high"}
                  timePrecision={"now"}
                  mode={"DRIVING"}
                  // maxZoomLevel={20}
                  onReady={(result) => {
                    // updateState({
                    //   totalDistance: result.distance.toFixed(appData?.profile?.preferences?.digit_after_decimal),v
                    //   totalDuration: result.duration.toFixed(appData?.profile?.preferences?.digit_after_decimal),
                    // });
                    mapRef.current.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: width / 20,
                        bottom: height / 20,
                        left: width / 20,
                        top: height / 20,
                      },
                    });
                  }}
                  onError={(errorMessage) => {
                    //
                  }}
                /> : null}
              <Marker
                coordinate={{
                  latitude: Number(driverStatus?.tasks[0]?.latitude),
                  longitude: Number(driverStatus?.tasks[0]?.longitude),
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.032,
                }}
                image={imagePath.icDestination}
              />
              <Marker
                coordinate={{
                  latitude: Number(driverStatus?.tasks[1]?.latitude),
                  longitude: Number(driverStatus?.tasks[1]?.longitude),
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.032,
                }}
                image={imagePath.icDestination}
              />
              {!!driverStatus?.agent_location?.lat &&
                orderStatus?.current_status?.title != "Delivered" ? (
                <Marker.Animated
                  ref={markerRef}
                  coordinate={state.animateDriver}
                >
                  <Image
                    source={
                      appIds?.sabroson
                        ? imagePath?.icBikeMarker
                        : imagePath.icScooter
                    }
                    style={{
                      transform: [
                        {
                          rotate: `${Number(driverStatus.agent_location?.heading_angle) +
                            180
                            }deg`,
                        },
                      ],
                    }}
                  />
                  {getBundleId() === appIds.onTheWheel ? (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        // left: 20,
                        borderRadius: moderateScale(2),
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 2,
                        backgroundColor: themeColors.primary_color,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          alignItems: 'center',
                          fontFamily: fontFamily.regular,
                          fontSize: textScale(12),
                          color: colors.white,
                          width: width / 2,
                        }}>
                        On The Wheels To On The Rocks In Minutes
                      </Text>
                    </View>
                  ) : null}
                </Marker.Animated>
              ) : null}
            </MapView>
            <TouchableOpacity
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
              }}
              onPress={onCenter}
            >
              <Image
                style={{
                  width: moderateScale(34),
                  height: moderateScale(34),
                  borderRadius: moderateScale(34 / 2),
                }}
                source={imagePath.mapNavigation}
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {!!lalaMoveUrl ? (
          <View style={{ height: moderateScale(height / 1.8) }}>
            <WebView source={{ uri: lalaMoveUrl }} />
          </View>
        ) : null}

        {!!orderStatus && orderStatus?.current_status?.title == "Placed" && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: moderateScaleVertical(10),
            }}
          >
            {/* <BallIndicator
              size={35}
              count={10}
              color={themeColors.primary_color}
            /> */}

            <LottieView
              source={loaderFive}
              autoPlay
              loop
              style={{
                height: moderateScaleVertical(100),
                width: moderateScale(100),
              }}
              colorFilters={[
                {
                  keypath: "right sand",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "left sand",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "right sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "left sand 2",
                  color: themeColors.primary_color,
                },

                {
                  keypath: "right top sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "left top sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "top left sand 1",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "top left sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "right fallin sand",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "bottom cyrcle 12",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "bottom cyrcle 11",
                  color: themeColors.primary_color,
                },

                {
                  keypath: "left fallin sand 2",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "top right sand 1",
                  color: themeColors.primary_color,
                },
                {
                  keypath: "top right sand 1",
                  color: themeColors.primary_color,
                },

                // top right sand 1
              ]}
            />
            <Text
              style={{
                ...styles.waitToAccept,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}
            >
              {strings.WAITINGTOACCEPT}
            </Text>
          </View>
        )}

        {!!orderStatus &&
          orderStatus?.current_status?.title != "Rejected" &&
          orderStatus?.current_status?.title != "Placed" &&
          !!dispatcherStatus?.dispatch_traking_url && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}
            >
              {!!dispatcherStatus && showMapDriver ? (
                <StepIndicators
                  labels={[]}
                  currentPosition={currentPosition}
                  themeColor={themeColors}
                  dispatcherStatus={dispatcherStatus}
                />
              ) : null}
              {!!dispatcherStatus && showMapDriver ? (
                <Text
                  style={{
                    marginTop: moderateScaleVertical(15),
                    marginVertical: moderateScaleVertical(10),
                    marginHorizontal: moderateScale(8),
                    color: themeColors?.primary_color,
                    fontFamily: fontFamily?.bold,
                  }}
                >
                  {
                    dispatcherStatus.vendor_dispatcher_status[
                      dispatcherStatus.vendor_dispatcher_status.length - 1
                    ]?.status_data.driver_status
                  }
                </Text>
              ) : null}

              {dispatcherStatus?.order_status?.current_status?.title !==
                strings.DELIVERED &&
                dispatcherStatus?.order_status?.current_status?.title !==
                strings.REJECTED &&
                (!!cartData.vendors[0]?.scheduled_date_time ||
                  !!cartData?.vendors[0].ETA) && showMapDriver && (
                  <View
                    style={{
                      ...styles.ariveView,
                      marginHorizontal: moderateScale(28),
                    }}
                  >
                    <Text
                      style={{
                        ...styles.ariveTextStyle,
                        color: isDarkMode ? colors.white : colors.blackC,
                      }}
                    >
                      {strings.YOUR_ORDER_WILL_ARRIVE_BY}{" "}
                      {cartData?.scheduled_date_time
                        ? cartData?.scheduled_date_time
                        : cartData?.vendors[0]?.ETA}
                    </Text>
                  </View>
                )}

              <View style={{
                padding: moderateScale(8),
                backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white
              }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setArrowDown(!arrowUp)}
                  style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{
                    ...styles.ariveTextStyle,
                    color: isDarkMode ? colors.white : colors.blackC,
                    fontSize: textScale(16)
                  }}>{strings.ORDER_STATUS}</Text>

                  <Image style={{
                    tintColor: isDarkMode ? colors.white : colors.black,
                    transform: [{
                      rotate: !arrowUp ? '180deg' : '0deg'
                    }]
                  }} source={imagePath.icUpArrow} />

                </TouchableOpacity>

                {arrowUp ? <View style={{ flex: 1, marginTop: moderateScaleVertical(16) }}>
                  {driverStatus?.tasks?.map((val, i) => {
                    return (
                      <Animatable.View
                        // animation={'slideInDown'}
                        delay={i}
                        key={String(i)}
                      >
                        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>

                          <View style={{ flex: 0.7, flexDirection: "row", alignItems: 'center' }}>
                            {/* {val?.task_status == '4' ? */}
                            {val?.task_status == '4' ?
                              <FastImage
                                tintColor={themeColors?.primary_color}
                                style={{
                                  width: 20,
                                  height: 20,
                                  resizeMode: 'contain'
                                }}
                                source={imagePath.ecomCheck}
                              />
                              :
                              <Image style={{
                                width: 20,
                                height: 20,
                                resizeMode: 'contain'
                              }} source={imagePath.ecomUnCheck} />}

                            <View style={{
                              marginLeft: moderateScale(4),
                            }}>
                              <Text style={{
                                color: isDarkMode ? colors.white : colors.blackC,
                                fontSize: textScale(12),
                                fontFamily: fontFamily.regular,

                              }} >{val?.address}</Text>
                              {!!orderStatusTitle(val) ? <Text style={{
                                color: isDarkMode ? colors.white : colors.blackC,
                                fontSize: textScale(12),
                                fontFamily: fontFamily.medium,
                              }}>{orderStatusTitle(val)}</Text> : null}
                            </View>
                          </View>

                          {(val?.task_status !== '0' &&
                            val?.task_type_id == 1 && val?.task_status == '1') || val?.task_status == '4'
                            ? <Text style={{
                              color: colors?.black,
                              fontSize: textScale(12),
                              fontFamily: fontFamily.regular,
                            }}>{moment(val?.updated_at).calendar()}</Text> : null}
                        </View>
                        {(driverStatus?.tasks?.length - 1) !== i ?
                          <View
                            style={{
                              minHeight: 20,
                              width: 2,
                              backgroundColor: val?.task_status == '4' ? themeColors?.primary_color : colors.blackOpacity10,
                              marginLeft: 8
                            }}
                          /> : null}
                      </Animatable.View>
                    )
                  })}
                </View> : null}
              </View>
            </View>
          )}

        {!!(updatedcartItems && updatedcartItems.length) && (
          <FlatList
            data={updatedcartItems}
            extraData={updatedcartItems}
            ListHeaderComponent={getHeader2()}
            ListFooterComponent={updatedcartItems?.length ? getFooter2() : null}
            showsVerticalScrollIndicator={false}
            // keyExtractor={(item, index) => String(index)}
            keyExtractor={(item) => item.id}
            renderItem={_renderItem2}
            style={{
              flex: 1,
              borderColor: themeColors?.primary_color,
              borderWidth: 2,
              marginHorizontal: moderateScale(10),
              backgroundColor: colors.backgroundGrey,
            }}
          />
        )}

      </View>
    );
  };

  const getHeader2 = () => {
    return (
      <View style={{ margin: moderateScale(15) }}>
        <Text
          style={{
            color: colors?.black,
            fontSize: textScale(14),
            fontFamily: fontFamily.medium,
          }}
        >
          {strings.YOURDRIVERHASMODIFIED}
        </Text>
      </View>
    );
  };
  // useEffect(() => {
  //   const _watchId = Geolocation.watchPosition(
  //     position => {
  //       console.log("watch position", position)
  //       updateState({ headingAngle: position.coords.heading })
  //       const { latitude, longitude } = position.coords;
  //       animate(latitude, longitude);
  //       updateState({
  //         coordinate: {
  //           latitude: latitude,
  //           longitude: longitude,
  //           latitudeDelta: 0.0222,
  //           longitudeDelta: 0.0320,
  //         }
  //       })
  //       // setLocation({latitude, longitude});
  //     },
  //     error => {
  //       console.log(error);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       distanceFilter: 20,
  //       interval: 8000,
  //       fastestInterval: 1000,
  //     },
  //   );
  //   return () => {
  //     if (_watchId) {
  //       Geolocation.clearWatch(_watchId);
  //     }
  //   };
  // }, []);

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 3000);
      }
    } else {
      state.animateDriver?.timing(newCoordinate).start();
    }
  };

  const customRight = () => {
    return (
      <TouchableOpacity
        onPress={() => Linking.openURL(cartData?.reports?.report?.original)}
        activeOpacity={0.7}
        style={{
          backgroundColor: themeColors.primary_color,
          paddingVertical: 3,
          width: moderateScale(92),
          alignItems: "center",
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.regular,
            color: colors.white,
          }}
        >
          Order Report
        </Text>
      </TouchableOpacity>
    );
  };

  const onSelectTime = (item) => {
    if (modalType == "pickup") {
      setLaundrySelectedPickupSlot(item?.value);
    } else {
      setLaundrySelectedDropOffSlot(item?.value);
    }
  };

  const isSlotSelected1 = (item) => {
    if (laundrySelectedPickupSlot == item.value) {
      return true;
    } else {
      return false;
    }
  };

  const isSlotSelected2 = (item) => {
    if (laundrySelectedDropOffSlot == item.value) {
      return true;
    } else {
      return false;
    }
  };

  const renderTimeSlots = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={String(index)}
        activeOpacity={0.8}
        onPress={() => onSelectTime(item)}
        style={{
          backgroundColor: isSlotSelected1(item)
            ? themeColors?.primary_color
            : colors.white,

          padding: 8,
          borderRadius: 8,
          borderWidth: isSlotSelected1(item) ? 0 : 1,
          borderColor: colors.borderColorGrey,
        }}
      >
        <Text
          style={{
            color: isSlotSelected1(item) ? colors.white : colors.black,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}
        >
          {item?.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderTimeSlots2 = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={String(index)}
        activeOpacity={0.8}
        onPress={() => onSelectTime(item)}
        style={{
          backgroundColor: isSlotSelected2(item)
            ? themeColors.primary_color
            : colors.white,
          padding: 8,
          borderRadius: 8,
          borderWidth: isSlotSelected2(item) ? 0 : 1,
          borderColor: colors.borderColorGrey,
        }}
      >
        <Text
          style={{
            color: isSlotSelected2(item) ? colors.white : colors.black,
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}
        >
          {item?.value}
        </Text>
      </TouchableOpacity>
    );
  };

  const onCloseModal = () => {
    setLaundrySelectedPickupDate(null);
    setLaundrySelectedDropOffDate(null);
    setLaundrySelectedPickupSlot("");
    setLaundrySelectedDropOffSlot("");
    updateState({
      isVisibleTimeModal: false,
    });
  };

  const laundrySlotSelection = (day) => {
    if (modalType == "pickup") {
      setLaundrySelectedPickupDate(day.dateString);
      setLaundrySelectedPickupSlot("");
    } else {
      setLaundrySelectedDropOffDate(day.dateString);
      setLaundrySelectedDropOffSlot("");
    }

    checkVendorSlots(day.dateString);
  };

  const checkVendorSlots = async (date) => {
    if (modalType !== "pickup") {
      try {
        let vendorId = cartItems[0].vendor.id;
        const res = await actions.getVendorDropoffSlots(
          `?vendor_id=${vendorId}&date=${date}&delivery=${dineInType}`,
          {},
          {
            code: appData?.profile?.code,
            timezone: RNLocalize.getTimeZone(),
          }
        );
        setLaundryAvailableDropOffSlot(res);
      } catch (error) {
        console.log("error riased", error);
        showError(error?.error || error?.message || '')
      }
    } else {
      try {
        let vendorId = cartItems[0].vendor.id;
        const res = await actions.checkVendorSlots(
          `?vendor_id=${vendorId}&date=${date}&delivery=${dineInType}`,
          {
            code: appData?.profile?.code,
            timezone: RNLocalize.getTimeZone(),
          }
        );

        setLaundryAvailablePickupSlot(res);
      } catch (error) {
        console.log("error riased", error);
        showError(error?.error || error?.message || '')
      }
    }
  };

  const selectOrderDate = () => {
    if (
      modalType == "pickup" &&
      (!laundrySelectedPickupDate || !laundrySelectedPickupSlot)
    ) {
      alert("Please select pickup date and time slots");
      return;
    }
    if (
      modalType !== "pickup" &&
      (!laundrySelectedDropOffDate || !laundrySelectedDropOffSlot)
    ) {
      alert("Please select drop-off date and time slots");
      return;
    } else {
      setDateAndTimeSchedule();
      return;
    }
  };

  const setDateAndTimeSchedule = () => {
    if (
      modalType == "pickup" &&
      !cartItems[0]?.same_day_orders_for_rescheduling &&
      moment(currentDropOffDate, "DD/MM/YYYY").format("DD/MM/YYYY") ==
      moment(laundrySelectedPickupDate).format("DD/MM/YYYY")
    ) {
      alert("You can not reschedule pickup & drop off on the same day");
      return;
    }
    if (
      modalType !== "pickup" &&
      !cartItems[0]?.same_day_orders_for_rescheduling &&
      moment(currentPickupDate, "DD/MM/YYYY").format("DD/MM/YYYY") ==
      moment(laundrySelectedDropOffDate).format("DD/MM/YYYY")
    ) {
      alert("You can not reschedule pickup & drop off on the same day");
      return;
    }

    if (
      modalType == "pickup" &&
      moment(currentDropOffDate, "DD/MM/YYYY").format("DD/MM/YYYY") <
      moment(laundrySelectedPickupDate).format("DD/MM/YYYY")
    ) {
      alert(`Selected date is invalid.`);
      return;
    }

    if (
      modalType !== "pickup" &&
      moment(currentPickupDate, "DD/MM/YYYY").format("DD/MM/YYYY") >
      moment(laundrySelectedDropOffDate).format("DD/MM/YYYY")
    ) {
      alert(`Selected date is invalid.`);
      return;
    }

    updateState({
      isVisibleTimeModal: false,
    });

    actions
      .rescheduleOrder(
        {
          order_id: cartData?.id,
          vendor_id: cartItems[0]?.vendor_id,
          pickup_reschdule_slot: laundrySelectedPickupSlot || "",
          pickup_reschdule_date: laundrySelectedPickupDate || "",
          drop_reschdule_slot: laundrySelectedDropOffSlot || "",
          drop_reschdule_date: laundrySelectedDropOffDate || "",
          reschdule_type: modalType == "pickup" ? "P" : "D",
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        }
      )
      .then((res) => {
        console.log(res, "res>>>>res");
        if (res?.status == "Success") {
          updateState({
            currentPickupDate: moment(laundrySelectedPickupDate).format(
              "DD/MM/YYYY"
            ),
            currentDropOffDate: moment(laundrySelectedDropOffDate).format(
              "DD/MM/YYYY"
            ),
          });
          showSuccess(res?.message);
        }
      })
      .catch((err) => {
        showError(err?.error || err?.message || "");
      });
  };

  const handleRefresh = () => {
    setRefreshing(true)
    _getOrderDetailScreen()
  }

  if (isLoading) {
    return (
      <ScreenLoader
        isDarkMode={isDarkMode}
        appStyle={appStyle}
        paramData={paramData}
      />
    );
  }

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
    >
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={
          strings.ORDER +
          ` ${isLoading ? "" : "#"}${isLoading ? "xxxxxxxx" : cartData?.order_number || ""
          }`
        }
        customRight={!!cartData?.reports?.report?.original ? customRight : ""}
        onPressLeft={
          !!paramData?.from
            ? () => navigation.popToTop()
            : () => navigation.goBack()
        }
      />
      <View
        style={{
          height: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.borderLight,
        }}
      />
      <View
        style={{
          ...styles.mainComponent,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.greyColor,
        }}
      >
        <FlatList
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems.length ? getHeader() : null}
          ListFooterComponent={cartItems.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={_renderItem}
          ListEmptyComponent={<ListEmptyCart isLoading={isLoading} />}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          refreshing={isRefreshing}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
        />
      </View>

      <Modal
        transparent={true}
        isVisible={isVisibleTimeModal}
        animationType={"none"}
        onBackdropPress={onCloseModal}
        style={{ margin: 0, justifyContent: "flex-end" }}
      >
        <TouchableOpacity style={styles.closeButton} onPress={onCloseModal}>
          <Image
            style={isDarkMode && { tintColor: MyDarkTheme.colors.white }}
            source={imagePath.crossB}
          />
        </TouchableOpacity>
        <View
          style={{
            ...styles.modalMainViewContainer,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.white,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={{
              ...styles.modalMainViewContainer,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
            }}
          >
            <View
              style={{
                // flex: 0.6,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  ...styles.carType,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.blackC,
                }}
              >
                {strings.SELECTDATEANDTIME}
              </Text>
            </View>
            {businessType == "laundry" && (
              <View>
                <Fragment>
                  <ScrollView>
                    {modalType == "pickup" ? (
                      <Calendar
                        current={new Date()}
                        minDate={
                          !!minimumDelayVendorDate
                            ? minimumDelayVendorDate
                            : new Date()
                        }
                        onDayPress={laundrySlotSelection}
                        markedDates={{
                          [laundrySelectedPickupDate]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: themeColors.primary_color,
                            selectedTextColor: colors.white,
                          },
                        }}
                        theme={{
                          arrowColor: themeColors.primary_color,
                          textDayFontFamily: fontFamily.medium,
                          textMonthFontFamily: fontFamily.medium,
                          textDayHeaderFontFamily: fontFamily.bold,
                        }}
                      />
                    ) : (
                      <Calendar
                        current={new Date()}
                        minDate={
                          !!minimumDelayVendorDate
                            ? minimumDelayVendorDate
                            : new Date()
                        }
                        onDayPress={laundrySlotSelection}
                        markedDates={{
                          [laundrySelectedDropOffDate]: {
                            selected: true,
                            disableTouchEvent: true,
                            selectedColor: themeColors.primary_color,
                            selectedTextColor: colors.white,
                          },
                        }}
                        theme={{
                          arrowColor: themeColors.primary_color,
                          textDayFontFamily: fontFamily.medium,
                          textMonthFontFamily: fontFamily.medium,
                          textDayHeaderFontFamily: fontFamily.bold,
                        }}
                      />
                    )}

                    {modalType == "pickup" ? (
                      <View>
                        <Text
                          style={{
                            marginHorizontal: moderateScale(24),
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                            marginBottom: moderateScaleVertical(8),
                          }}
                        >
                          {strings.TIME_SLOT}
                        </Text>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          data={laundryAvailablePickupSlot || []}
                          renderItem={renderTimeSlots}
                          keyExtractor={(item) => item.value || ""}
                          ItemSeparatorComponent={() => (
                            <View style={{ marginRight: moderateScale(12) }} />
                          )}
                          ListHeaderComponent={() => (
                            <View style={{ marginLeft: moderateScale(24) }} />
                          )}
                          ListFooterComponent={() => (
                            <View style={{ marginRight: moderateScale(24) }} />
                          )}
                          ListEmptyComponent={() => (
                            <View>
                              <Text
                                style={{
                                  fontFamily: fontFamily.medium,
                                  color: colors.blackOpacity66,
                                }}
                              >
                                {!laundrySelectedPickupDate
                                  ? strings.PLEASE_SELECT_DATE
                                  : strings.SLOTS_NOT_FOUND_FOR_DATE}
                              </Text>
                            </View>
                          )}
                        />
                      </View>
                    ) : (
                      <View>
                        <Text
                          style={{
                            marginHorizontal: moderateScale(24),
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                            marginBottom: moderateScaleVertical(8),
                          }}
                        >
                          {strings.TIME_SLOT}
                        </Text>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          data={laundryAvailableDropOffSlot || []}
                          renderItem={renderTimeSlots2}
                          keyExtractor={(item) => item.value || ""}
                          ItemSeparatorComponent={() => (
                            <View style={{ marginRight: moderateScale(12) }} />
                          )}
                          ListHeaderComponent={() => (
                            <View style={{ marginLeft: moderateScale(24) }} />
                          )}
                          ListFooterComponent={() => (
                            <View style={{ marginRight: moderateScale(24) }} />
                          )}
                          ListEmptyComponent={() => (
                            <View>
                              <Text
                                style={{
                                  fontFamily: fontFamily.medium,
                                  color: colors.blackOpacity66,
                                }}
                              >
                                {!laundrySelectedDropOffDate
                                  ? " Please select date."
                                  : " Slots are not found for selected date."}
                              </Text>
                            </View>
                          )}
                        />
                      </View>
                    )}
                  </ScrollView>
                </Fragment>
              </View>
            )}
            <View
              style={{
                marginHorizontal: moderateScale(24),
              }}
            >
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                // textStyle={styles.textStyle}
                onPress={selectOrderDate}
                marginTop={moderateScaleVertical(10)}
                marginBottom={moderateScaleVertical(30)}
                btnText={strings.SELECT}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </WrapperContainer>
  );
}
