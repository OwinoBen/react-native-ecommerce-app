import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import Header from "../../Components/Header";
import StepIndicators from "../../Components/StepIndicator";
import WrapperContainer from "../../Components/WrapperContainer";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang/index";
import navigationStrings from "../../navigation/navigationStrings";
import colors from "../../styles/colors";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../../styles/responsiveSize";
import stylesFun from "./styles";
import commonStylesFun from "../../styles/commonStyles";
import actions from "../../redux/actions";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import commonStyles from "../../styles/commonStyles";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { isEmpty } from "lodash";
import { locationPermission } from "../../utils/permissions";
import { getCurrentLocationFromApi } from "../../utils/googlePlaceApi";
import StepIndicator from "react-native-step-indicator";
import useInterval from "../../utils/useInterval";
import { showError } from "../../utils/helperFunctions";

import { enableFreeze } from "react-native-screens";
import { useDarkMode } from "react-native-dynamic";
import { MyDarkTheme } from "../../styles/theme";
enableFreeze(true);



export default function TrackiDetail({ navigation, route }) {
  const [state, setState] = useState({
    labels: [
      "Order\nSubmitted",
      "Start\nShipping",
      "On the\nWay",
      "Will be\nDelivered",
    ],
    orderPickupDropLocation: [],
    coordinate: {
      latitude: 30.7173,
      longitude: 76.8035,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.032,
    },
    animateDriver: {
      latitude: 30.7173,
      longitude: 76.8035,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.032,
    },
    driverMarkerlocation: {
      latitude: 30.7173,
      longitude: 76.8035,
      latitudeDelta: 0.0222,
      longitudeDelta: 0.032,
    },
    currentPosition: null,
    orderAllStatus: [],
    isLoading: true
  });

  const {
    orderPickupDropLocation,
    coordinate,
    driverMarkerlocation,
    currentPosition,
    orderAllStatus,
    isLoading
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const {
    appData,
    currencies,
    languages,
    themeColors,
    appStyle,
    themeColor,
    themeToggle,
    animateDriver,
  } = useSelector((state) => state?.initBoot);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const userData = useSelector((state) => state.auth.userData);

  const { labels } = state;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });
  const isFocused = useIsFocused();


  const moveToNewScreen = (screenName, data = {}) => () => {
    navigation.navigate(screenName, { data });
  };

  useFocusEffect(
    React.useCallback(() => {
      getLiveLocation();
    }, [])
  );

  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const { latitude, longitude } = await getCurrentLocationFromApi();
      // console.log("get live location after 4 second")
      console.log(latitude, longitude, "latitude, longitude");
      updateState({
        coordinate: {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.032,
        },
      });
      orderTrackingThroughDeepLinking();
    }
  };


  useInterval(
    () => {
      if (route?.params?.data && coordinate) {
        orderTrackingThroughDeepLinking();
      }
    },
    isFocused ? 5000 : null
  );


  const orderTrackingThroughDeepLinking = () => {
    const apiData = {
      order_number: route?.params?.data,
    };
    actions
      .orderTracingForDeepLinking(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        console.log(res?.data, "resresresresres>>>");
        updateState({
          orderPickupDropLocation: res?.data?.dispatch_order?.tasks,
          isLoading: false,
          animateDriver: {
            latitude: Number(res?.data?.agent_location?.lat),
            longitude: Number(res?.data?.agent_location?.lng),
            latitudeDelta: 0.0222,
            longitudeDelta: 0.032,
          },
          driverMarkerlocation: {
            latitude: Number(res?.data?.agent_location?.lat),
            longitude: Number(res?.data?.agent_location?.lng),
            latitudeDelta: 0.0222,
            longitudeDelta: 0.032,
          },
          currentPosition: res?.data?.ordervendor?.order_status_option_id,
          orderAllStatus: res?.data?.order_status_vendor,
        });
      })
      .catch((error) => {
        console.log(error);
        updateState({ isLoading: false })
        showError(error?.message || error?.msg)
      });
  };

  const fitToMap = () => {
    console.log(orderPickupDropLocation, "orderPickupDropLocation");
    if (orderPickupDropLocation && orderPickupDropLocation.length) {
      let newArray = orderPickupDropLocation.map((i, inx) => {
        console.log(i, "i+++++++++");
        return {
          latitude: Number(i?.latitude),
          longitude: Number(i?.longitude),
        };
      });
      console.log(newArray, "newArray");
      // animate(region);
      setTimeout(() => {
        // animate(region);
        fitPadding(newArray);
      }, 500);
    }
  };

  useEffect(() => {
    fitToMap();
  }, [orderPickupDropLocation]);

  const fitPadding = (newArray) => {
    if (mapRef.current) {
      mapRef.current.fitToCoordinates([coordinate, ...newArray], {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
    }
  };

  // const renderStepIndicator = ({position, stepStatus}) => {
  //   //console.log(position, 'position', stepStatus, 'stepStatus');
  //   return (
  //     <Image
  //       style={{
  //         width: moderateScale(30),
  //         height: moderateScale(30),
  //       }}
  //       source={{uri: dispatcherStatus?.dispatcher_status_icons[position]}}
  //     />
  //   );
  // };

  return (
    <WrapperContainer
    bgColor={
      isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
    }
      statusBarColor={colors.backgroundGrey}
      isLoading={isLoading}
    >
      <Header
        centerTitle={strings.TRACKDETAIL}
        headerStyle={{ backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey }}
      />

      <View style={{ ...commonStyles.headerTopLine }} />
      <View style={styles.topSection}>
        {/* {basicInfoView()} */}

        {!isEmpty(orderAllStatus) ? (
          <StepIndicator
            stepCount={orderAllStatus?.length} //showing step indicators dynamically

            currentPosition={currentPosition}

          />
        ) : null}
        {!isEmpty(orderAllStatus) ? (
          <Text
            style={{
              marginTop: moderateScaleVertical(15),
              marginVertical: moderateScaleVertical(10),
              marginHorizontal: moderateScale(31),
              color: themeColors?.primary_color,
              fontFamily: fontFamily?.bold,
              textAlign: "center",
            }}
          >
            {orderAllStatus[orderAllStatus?.length - 1].status?.title}
          </Text>
        ) : null}
      </View>
      {!isEmpty(orderPickupDropLocation) ? (
        <View style={styles.bottomSection}>
          <View style={{ width: "100%", height: "100%" }}>
            <MapView
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              // region={coordinate}
              rotateEnabled={true}
              provider={"google"}
            >
              <MapViewDirections
                resetOnChange={false}
                origin={{
                  latitude: Number(orderPickupDropLocation[0]?.latitude),
                  longitude: Number(orderPickupDropLocation[0]?.longitude),
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.032,
                }}
                destination={{
                  latitude: Number(orderPickupDropLocation[1]?.latitude),
                  longitude: Number(orderPickupDropLocation[1]?.longitude),
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.032,
                }}
                apikey={appData.profile?.preferences?.map_key}
                strokeWidth={3}
                strokeColor={themeColors?.primary_color}
                optimizeWaypoints={true}
                onStart={(params) => { }}
                precision={"high"}
                timePrecision={"now"}
                mode={"DRIVING"}
              />
              <Marker
                coordinate={{
                  latitude: Number(orderPickupDropLocation[0]?.latitude),
                  longitude: Number(orderPickupDropLocation[0]?.longitude),
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.032,
                }}
                image={imagePath.icDestination}
              />
              <Marker
                coordinate={{
                  latitude: Number(orderPickupDropLocation[1]?.latitude),
                  longitude: Number(orderPickupDropLocation[1]?.longitude),
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.032,
                }}
                image={imagePath.icDestination}
              />
              {driverMarkerlocation?.latitude ? (
                <Marker.Animated
                  ref={markerRef}
                  coordinate={driverMarkerlocation}
                >
                  <Image source={imagePath.icScooter} />
                </Marker.Animated>
              ) : null}
            </MapView>
          </View>
        </View>
      ) : null}
    </WrapperContainer>
  );
}
