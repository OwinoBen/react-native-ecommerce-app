//import liraries
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from "react-native";
import Communications from "react-native-communications";
import { useSelector } from "react-redux";
import colors from "../styles/colors";
import imagePath from "../constants/imagePath";
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from "../styles/responsiveSize";
import { MyDarkTheme } from "../styles/theme";
import { useDarkMode } from "react-native-dynamic";
import { getImageUrl } from "../utils/helperFunctions";
import { appIds } from "../utils/constants/DynamicAppKeys";
import { getBundleId } from "react-native-device-info";
import Share from "react-native-share";
import StarRating from "react-native-star-rating";
import strings from "../constants/lang";
import { dialCall } from "../utils/openNativeApp";

// create a component
const UserDetail = ({
  data,
  type,
  containerStyle,
  imgStyle,
  isDriver = false,
  submitedRatingToDriver = null,
  cartData = null,
  textStyle,
  _onRateDriver = () => { },
  startChatWithAgent = () => { },
  onStarRatingForDriverPress = () => { },
}) => {
  const { toggleTheme, themeColors, theme, appStyle, appData } = useSelector(
    (state) => state.initBoot
  );
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;

  const userData = useSelector((state) => state?.auth?.userData);

  const onWhatsapp = async () => {
    const vendorPhoneNumber = data?.vendor?.phone_no.replace(/\s/g, "") || data?.order?.phone_number.replace(/\s/g, "")
    let url = `whatsapp://send?phone=${data?.vendor?.dial_code}${vendorPhoneNumber}`;
    Linking.openURL(url)
      .then((data) => {
        console.log("WhatsApp Opened successfully " + data); //<---Success
      })
      .catch(() => {
        alert("Make sure WhatsApp installed on your device"); //<---Error
      });
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

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
        alignItems: "center",
        ...containerStyle,
        // backgroundColor: 'red'
        // width: '100%'
      }}
    >
      <Image
        source={{
          uri: !!data?.agent_image
            ? data?.agent_image
            : getImageUrl(
              data?.vendor?.banner?.image_fit,
              data?.vendor?.banner?.image_path,
              "600/600"
            ),
        }}
        style={{
          height: moderateScale(40),
          width: moderateScale(40),
          borderRadius: moderateScale(20),
          backgroundColor: colors.blackOpacity10,
          ...imgStyle,
        }}
      // resizeMode="cover"
      />

      <View
        style={{
          flexDirection: "row",
          marginLeft: moderateScale(18),
          justifyContent: "space-between",
          flex: 1,
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              color: isDarkMode
                ? MyDarkTheme.colors.text
                : colors.blackOpacity86,
              fontSize: textScale(13),
              fontFamily: fontFamily.bold,
              ...textStyle,
            }}
          >
            {data?.vendor_name || data?.order?.name}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity43,
                fontSize: textScale(10),
                fontFamily: fontFamily.regular,
                ...textStyle,
              }}
            >
              {type}
            </Text>
            {isDriver && cartData?.order_data?.avgrating > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: moderateScale(10),
                }}
              >
                <Image
                  source={imagePath.star}
                  style={{ tintColor: colors.yellowB }}
                />

                <Text
                  style={{
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity43,
                    fontSize: textScale(10),
                    fontFamily: fontFamily.regular,
                    marginHorizontal: moderateScale(3),
                    ...textStyle,
                  }}
                >
                  {cartData?.order_data?.avgrating?.toFixed(2)} (
                  {cartData?.order_data?.driver_rating_count})
                </Text>
              </View>
            )}
          </View>

          {isDriver && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: moderateScaleVertical(5),
              }}
            >
              <StarRating
                maxStars={5}
                rating={
                  submitedRatingToDriver
                    ? submitedRatingToDriver
                    : cartData?.driver_rating?.rating
                }
                selectedStar={(rating) => onStarRatingForDriverPress(rating)}
                fullStarColor={colors.ORANGE}
                starSize={20}
              />
              {submitedRatingToDriver || cartData?.driver_rating?.rating ? (
                <TouchableOpacity
                  onPress={_onRateDriver}
                  style={{
                    justifyContent: "center",
                    backgroundColor: themeColors.primary_color,
                    alignItems: "center",
                    borderRadius: moderateScale(3),
                    paddingVertical: moderateScaleVertical(2),
                    marginHorizontal: moderateScale(8),
                    paddingHorizontal: 2,
                  }}
                >
                  <Text style={{ color: colors.white }}>
                    {strings.WRITE_A_REVIEW}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        </View>

        {getBundleId() == (appIds.masa || appIds.hokitch)
          ? null
          : (data?.vendor?.phone_no || data?.order?.phone_number) && (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={onWhatsapp}>
                <Image
                  style={{
                    height: moderateScale(20),
                    width: moderateScale(20),
                    marginRight: moderateScale(20),
                  }}
                  source={imagePath.whatsAppRoyo}
                />
              </TouchableOpacity>
              <TouchableOpacity
              onPress={() =>
             
                dialCall(
               `+${data?.vendor?.dial_code}${data?.vendor?.phone_no}`
                  // (type = "phone")
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
                    data?.order?.phone_number || data?.vendor?.phone_no,
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
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // paddingHorizontal: moderateScale(4),
    paddingVertical: moderateScaleVertical(8),
    borderBottomRightRadius: moderateScale(16),
    borderBottomLeftRadius: moderateScale(16),
    alignItems: "center",
  },
});

export default React.memo(UserDetail);
