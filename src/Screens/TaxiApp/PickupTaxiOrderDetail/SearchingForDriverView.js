import React from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import ScaledImage from 'react-native-scalable-image';
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import TransparentButtonWithTxtAndIcon from '../../../Components/TransparentButtonWithTxtAndIcon';
import {dummyUser} from '../../../constants/constants';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import StarRating from 'react-native-star-rating';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../../styles/theme';
import {
  BarIndicator,
  BallIndicator,
  UIActivityIndicator,
} from 'react-native-indicators';
import navigationStrings from '../../../navigation/navigationStrings';
import {searchingLoader} from '../../../Components/Loaders/AnimatedLoaderFiles';
import LottieView from 'lottie-react-native';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function ({
  isLoading = false,
  orderDetail = {},
  productDetail = {},
  onPressCall,
  onPressChat,
  agent_location,
  agent_image = null,
  totalDuration,
  selectedCarOption,
  productRatings,
  isShowRating,
  navigation,
  driverRating,
  onStarRatingPress = () => {},
}) {
  //   console.log(selectedCarOption, 'selectedCarOption');
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  // alert(isShowRating);
  const fontFamily = appStyle?.fontSizeData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;

  //give review and update the rate
  console.log(searchingLoader, 'searchingLoader');
  return (
    <>
      <View
        style={{
          marginBottom: -30,
          paddingHorizontal: 10,
          zIndex: 1000,
          borderTopLeftRadius: moderateScale(18),
          borderTopRightRadius: moderateScale(18),
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        {/* <ScaledImage
          width={width / 3}
          source={
            productDetail?.product_details &&
            productDetail?.product_details.length
              ? {
                  uri: getImageUrl(
                    productDetail?.product_details[0]?.image_path?.image_fit,
                    productDetail?.product_details[0]?.image_path?.image_path,
                    '500/500',
                  ),
                }
              : productDetail?.media && productDetail?.media.length
              ? {
                  uri: getImageUrl(
                    productDetail?.media[0]?.image?.path?.image_fit,
                    productDetail?.media[0]?.image?.path?.image_path,
                    '500/500',
                  ),
                }
              : imagePath.cabImage
          }
        /> */}
      </View>
      <View
        style={
          isDarkMode
            ? [
                styles.bottomView,
                {backgroundColor: MyDarkTheme.colors.background},
              ]
            : styles.bottomView
        }>
        {agent_location ? (
          <View
            style={{
              width: width - 40,
              justifyContent: 'space-between',
              paddingVertical: moderateScaleVertical(30),
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <FastImage
                  source={{
                    uri:
                      agent_image != null &&
                      agent_image != '' &&
                      agent_image != undefined
                        ? agent_image
                        : dummyUser,
                    priority: FastImage.priority.high,
                  }}
                  style={{
                    height: moderateScale(64),
                    width: moderateScale(64),
                    borderRadius: moderateScale(12),
                  }}
                />
                <View>
                  <Text
                    style={
                      isDarkMode
                        ? [styles.lable1, {color: MyDarkTheme.colors.text}]
                        : styles.lable1
                    }>
                    {!!agent_location ? orderDetail?.name || '' : ''}
                  </Text>
                  {driverRating > 0 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: moderateScaleVertical(10),
                        marginHorizontal: moderateScale(20),
                      }}>
                      <Image
                        style={{tintColor: colors.yellowB}}
                        source={imagePath.star}
                      />
                      <Text
                        style={{
                          marginHorizontal: moderateScale(5),
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.lightgray,
                        }}>
                        {driverRating}
                      </Text>
                    </View>
                  )}
                  {totalDuration ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: moderateScale(20),
                      }}>
                      <Image
                        // style={{}}
                        source={imagePath.location2}
                      />
                      <Text
                        style={{
                          marginHorizontal: moderateScale(5),
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.lightgray,
                        }}>
                        {totalDuration < 60
                          ? `${Number(totalDuration)} mins`
                          : `${(Number(totalDuration) / 60).toFixed(2)} hrs`}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
            {agent_location && (
              <View
                style={{
                  // marginVertical: moderateScaleVertical(5),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: moderateScaleVertical(5),
                }}>
                <GradientButton
                  colorsArray={[
                    themeColors.primary_color,
                    themeColors.primary_color,
                  ]}
                  textStyle={{textTransform: 'none', fontSize: textScale(16)}}
                  onPress={() => onPressChat(orderDetail)}
                  marginTop={moderateScaleVertical(20)}
                  //marginBottom={moderateScaleVertical(10)}
                  btnText={strings.MESSAGE}
                  containerStyle={{width: width / 2}}
                />
                <TransparentButtonWithTxtAndIcon
                  btnText={strings.CALL}
                  borderRadius={moderateScale(13)}
                  containerStyle={{
                    alignItems: 'center',
                    width: width / 3,
                  }}
                  onPress={() => onPressCall(orderDetail)}
                  //marginBottom={moderateScaleVertical(10)}
                  marginTop={moderateScaleVertical(20)}
                  textStyle={{
                    color: themeColors.primary_color,
                    textTransform: 'none',
                    fontSize: textScale(16),
                  }}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                height: moderateScaleVertical(100),
                width: moderateScale(100),
                marginVertical: moderateScaleVertical(40),
              }}>
              <LottieView
                source={searchingLoader}
                autoPlay
                loop
                style={{
                  height: moderateScaleVertical(100),
                  width: moderateScale(100),
                }}
                colorFilters={
                  // searchingLoader?.nm == 'Comp 1'
                  //   ? [
                  //       {
                  //         keypath: searchingLoader?.layers[0].nm,
                  //         color: themeColors?.primary_color,
                  //       },
                  //       {
                  //         keypath: searchingLoader?.layers[1].nm,
                  //         color: themeColors?.primary_color,
                  //       },
                  //     ]
                  //   : [
                  //       {
                  //         keypath: searchingLoader?.layers[0].nm,
                  //         color: themeColors?.primary_color,
                  //       },
                  //     ]
                  [
                    {
                      keypath: 'button',
                      color: 'red',
                    },
                    {
                      keypath: 'Sending Loader',
                      color: 'green',
                    },
                  ]
                }
              />
            </View>
            <Text
              style={{
                fontSize: textScale(12),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.CONNECTING_YOU_TO_NEARBY_DERIVER}
            </Text>
            <Text
              style={{
                fontSize: textScale(12),
                fontFamily: fontFamily.regular,
                marginVertical: moderateScaleVertical(20),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.YOUR_RIDE_WILL_START_SOON}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}
