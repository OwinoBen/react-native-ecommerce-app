import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { getColorCodeWithOpactiyNumber, getImageUrl } from '../../../utils/helperFunctions';
import stylesFunc from '../styles';

import { useNavigation } from '@react-navigation/native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import CustomAnimatedLoader from '../../../Components/CustomAnimatedLoader';
import DeliveryTypeEcommerceComp from '../../../Components/DeliveryTypeEcommerceComp';
import {
  loaderOne
} from '../../../Components/Loaders/AnimatedLoaderFiles';
import strings from '../../../constants/lang';
import { MyDarkTheme } from '../../../styles/theme';
import actions from '../../../redux/actions';
import { hitSlopProp } from '../../../styles/commonStyles';
import SearchBar3 from '../../../Components/SearchBar3';
import LinearGradient from 'react-native-linear-gradient';

import * as Animatable from 'react-native-animatable';
import DeviceCountry from 'react-native-device-country';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';

const  AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export default function DashBoardHeaderEcommerce({
  // navigation = {},
  location = [],
  selcetedToggle,
  toggleData,
  isLoading = false,
  isLoadingB = false,
  _onVoiceListen = () => { },
  isVoiceRecord = false,
  _onVoiceStop = () => { },
  currentLocation,
  nearestLoc,
  currentLoc,
  cartItemCountView = {
    position: 'absolute',
    zIndex: 100,

    // backgroundColor: colors.cartItemPrice,

    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartItemCountNumber = {
    fontSize: textScale(8),
  },
  animation
}) {
  const navigation = useNavigation();
  const { appData, themeColors, appStyle, themeColor, themeToggle, currencies, primary_country } = useSelector((state) => state?.initBoot || {});
  const { cartItemCount } = useSelector((state) => state?.cart || {});
  const { userData } = useSelector((state) => state?.auth);

  const { countryFlag } = useSelector((state) => state?.home || {});

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });

  const [countryCode, setCountryCode] = useState('IN')

  console.log("primary_countryprimary_country", primary_country)

  useLayoutEffect(() => {
    DeviceCountry.getCountryCode()
      .then((result) => {
        console.log("DeviceCountry", result);
        getItem('countryFlag').then((res) => {
          if (!!res) {
            console.log("resresres", res)
            setCountryCode(res)
            setCountryFlag(res)
          } else {
            setCountryCode(result.code)
            setCountryFlag(result.code)
          }
        }).catch(error => {
          console.log("error raised", error)
        })
      })
      .catch((e) => {
        console.log(e);
      });
  }, [countryFlag])



  const imageURI = getImageUrl(
    isDarkMode
      ? profileInfo?.dark_logo?.image_fit
      : profileInfo?.logo?.image_fit,
    isDarkMode
      ? profileInfo?.dark_logo?.image_path
      : profileInfo?.logo?.image_path,
    '200/400',
  );

  const onPressWishList = () => {
    if (!!userData?.auth_token) {
      navigation.navigate(navigationStrings.CART)
    } else {
      actions.setAppSessionData('on_login')
    }

  }

  const headerIconStyle = {
    height: moderateScale(34),
    width: moderateScale(34),
    // borderRadius: moderateScale(28 / 2)
  }

  const headerUperView = useAnimatedStyle(() => {
    const heightv = interpolate(animation.value,
      [0, 100, 0],
      [height / 8, 10, height / 8],
      Extrapolate.CLAMP
    )

    const opacity = interpolate(animation.value,
      [0, 100, 0],
      [1, 0, 1],
      Extrapolate.CLAMP
    )
    return {
      height: heightv,
      opacity, 
    }
  })
  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(animation.value,
      [0, 100, 0],
      [1 , 0,  1],
      Extrapolate.CLAMP
    )
    return {
transform:[{scale}]
    }
  })



  return (

    // <LinearGradient
    //   colors={[themeColors?.primary_color, themeColors?.primary_color, getColorCodeWithOpactiyNumber(
    //     themeColors.primary_color.substr(1),
    //     40)]}
    // >

      <SafeAreaView style={{backgroundColor:colors.white}}>

        <Animated.View
          style={[{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: moderateScale(16),
            alignItems: 'center',
            backgroundColor:themeColors?.primary_color,
            // marginTop: moderateScaleVertical(4),
            marginBottom:moderateScaleVertical(10)
          }, headerUperView]}>
          <AnimatedTouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.openDrawer()}
            style={[{ alignItems: 'center',marginTop:moderateScale(29) },iconStyle]}>
            <Image
              style={{
                ...headerIconStyle,
                tintColor: colors.white,
                marginRight: moderateScale(8),
                height: moderateScale(26),
                width: moderateScale(26),
              }}
              source={imagePath.icHamburger}
              resizeMode="contain"
            />
          </AnimatedTouchableOpacity>
         
          <View
            style={{
              // flexDirection: 'row',
              flex: 0.95,
              justifyContent: 'center',

            }}>

{!!appData?.profile?.preferences?.is_hyperlocal && (
              <Text style={{
                marginLeft: moderateScale(4),
                color:colors.white,
                opacity:0.7,
                fontSize:textScale(9)
                 }}>{strings.DELIVERY_TO}
                  </Text>
            )}
            {/* {!!(
              profileInfo &&
              (profileInfo?.logo || profileInfo?.dark_logo)
            ) ? (
              <FastImage
                style={{
                  width: moderateScale(width / 6),
                  height: moderateScale(60),
                }}
                resizeMode={FastImage.resizeMode.contain}
                source={{
                  uri: imageURI,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
              />
            ) : null} */}

            {!!appData?.profile?.preferences?.is_hyperlocal && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() =>
                  navigation.navigate(navigationStrings.LOCATION, {
                    type: 'Home1',
                  })
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                 marginTop:moderateScaleVertical(2),
                  marginLeft: moderateScale(4),

                }}>
                {/* <Image
                  style={{
                    height: moderateScale(20),
                    width: moderateScale(20),
                    tintColor: colors.white
                  }}
                  source={imagePath.icEcomHeaderLocation}
                  resizeMode="contain"
                /> */}
                <View>
                  {!!location?.type && (
                    <View style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}>
                      <Text numberOfLines={1} style={{ ...styles.locationTypeTxt, color: colors.black, fontSize: textScale(12) }}>
                        {location?.type === 3
                          ? !!(
                            location?.type_name != 0 &&
                            location?.type != '0' &&
                            location?.type_name !== null
                          )
                            ? location?.type_name
                            : strings.UNKNOWN
                          : location?.type === 2
                            ? strings.WORK
                            : strings.HOME}
                      </Text>
                      <Image style={{
                        marginLeft: moderateScale(3)
                      }} source={imagePath.icEcomDropArrow} />
                    </View>
                  )}

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.locationTxt,
                      {
                        color: colors.white,
                        fontFamily: fontFamily.medium,
                        fontSize:textScale(15)
                      },
                    ]}>
                    {location?.address}
                  </Text>
                </View>
                <Image
                  style={{
                    height: moderateScale(8),
                    width: moderateScale(8),
                    marginLeft:moderateScale(5),
                    marginTop:moderateScaleVertical(5),
                    tintColor: colors.white
                  }}
                  source={imagePath.dropDownNew}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>

          <Animated.View
            style={[{
              flexDirection: 'row',
              alignItems: 'center',

            },iconStyle]}>


            {/* wish list */}
            {cartItemCount?.data?.item_count ? (
                <View
                  style={{
                    ...styles.cartItemCountView,
                    backgroundColor:"white",
                    // width:
                    //  // cartItemCount?.data?.item_count > 999
                    //  1000 > 999
                    //     ? moderateScale(40)
                    //     : moderateScale(20),
                    // height:
                    //   //cartItemCount?.data?.item_count > 999
                    //   1000 > 999
                    //     ? moderateScale(21)
                    //     : moderateScale(20),
                    //top: cartItemCount?.data?.item_count > 999 ? -10 : -4,
                    //right: cartItemCount?.data?.item_count > 999 ? -13 : -50,
                    top: cartItemCount?.data?.item_count > 999 ? -10 : -4,
                    right: cartItemCount?.data?.item_count > 999 ? -50 : -50,
                    paddingHorizontal:moderateScale(6),
                    borderRadius:10,
                    alignItems:"center",
                    justifyContent:"center"
                  }}>
                  <Text style={{...styles.cartItemCountNumber,fontSize:textScale(12)}}>
                    {cartItemCount?.data?.item_count > 999
                      ? '999+'
                      : cartItemCount?.data?.item_count}
                  </Text>
                </View>
              ) : null}
            <TouchableOpacity
              hitSlop={hitSlopProp}
              style={{ marginHorizontal: moderateScale(8) }}
              onPress={onPressWishList}>
              <Image
                style={{
                  ...headerIconStyle,
                  tintColor: colors.white,
                  height:moderateScale(26),
                  width:moderateScale(26),marginTop:moderateScale(26)

                }}
                source={imagePath.cart2InActive}
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>


        <DeliveryTypeEcommerceComp
          selectedToggle={selcetedToggle}
          themeColors={{ primary_color: colors.black }}
        />
        <Animatable.View
          animation={'fadeIn'}
          delay={400}
        >
          <SearchBar3
            onPress={() => navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)}
            imagestyle={{height:moderateScaleVertical(15),width:moderateScale(15)}}
            
            containerStyle={{
              borderRadius:moderateScale(4),
              marginVertical: moderateScaleVertical(8),
              marginBottom: moderateScaleVertical(12),
              height: moderateScale(38),
              backgroundColor:colors.greyNew
            }}
            placeHolderTxt={strings.SEARCH_FOR_PRODUCT}
          />
        </Animatable.View>



        <CustomAnimatedLoader
          source={loaderOne}
          loaderTitle={strings.LOADING}
          containerColor={
            isDarkMode ? MyDarkTheme.colors.lightDark : colors.white
          }
          loadercolor={themeColors.primary_color}
          animationStyle={[
            {
              height: moderateScaleVertical(40),
              width: moderateScale(40),
            },
          ]}
          visible={isLoadingB}
        />
      </SafeAreaView>
   /* </LinearGradient> */


  );
}