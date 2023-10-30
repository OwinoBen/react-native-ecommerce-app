import {
  BottomSheetModal,
  BottomSheetModalProvider
} from '@gorhom/bottom-sheet';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import _, { cloneDeep, concat, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import OoryksHeader from '../../../Components/OoryksHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  StatusBarHeight,
  height,
  moderateScale,
  moderateScaleVertical,
  scale,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import {
  getImageUrl,
  showError
} from '../../../utils/helperFunctions';
import styleFun from './styles';
import moment from 'moment';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { getDistance } from 'geolib';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import HTMLView from 'react-native-htmlview';
import RenderHTML from 'react-native-render-html';

let calendarTheme = {
  selectedDayBackgroundColor: colors.black,
  selectedDayTextColor: colors.white,
}

const P2pOndemandProductDetail = ({ navigation, route, item }) => {
  const carouselRef = useRef(null);
  const mapRef = useRef(null)
  const snapPoints = useMemo(() => [height], []);
  const bottomSheetModalRef = useRef(null);
  const paramData = route?.params;

  const {
    appData,
    currencies,
    languages,
    themeColor,
    themeToggle,
    appStyle,
    themeColors,
  } = useSelector(state => state?.initBoot);
  const { userData } = useSelector(state => state?.auth);
  const { dineInType, location } = useSelector((state) => state?.home);
  const reloadData = useSelector((state) => state?.reloadData?.reloadData);

  const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = styleFun({ themeColor, themeToggle, fontFamily });
  const [indexSelected, setIndexSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [productInfo, setProductInfo] = useState({});
  const [selectedPanoImg, setSelectedPanoImg] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [pickUpTime, setPickUpTime] = useState("1:00 AM")
  const [dropOffTime, setDropOffTime] = useState("12:00 PM")
  const [selectedDates, setSelectedDates] = useState({});
  const [isLoadingAddToCart, setisLoadingAddToCart] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)



  const moveToNewScreen = (screenName, data = {}) => () => { navigation.navigate(screenName, { data }) };
  useEffect(() => {
    getP2pProductDetail();
  }, []);

  const renderReview = ({ item, index }) => {
    const imageUrl = getImageUrl(item.userimage?.image.image_fit, item.userimage?.image.image_path, '400/400');
    return (
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: moderateScale(16),
          marginTop: moderateScaleVertical(18),
          justifyContent: 'space-between',
        }}>
        <Image
          resizeMode='contain'
          style={{ height: moderateScale(40), width: moderateScale(40), borderRadius: moderateScale(50) }}
          source={{ uri: imageUrl }} />
        <View style={{ marginLeft: moderateScale(16) }}>
          <Text style={{
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            fontFamily: fontFamily?.regular,

          }}>{item?.userimage?.name}</Text>
          <StarRating
            starStyle={{
              width: moderateScale(19),
              height: moderateScaleVertical(15),
              marginTop: moderateScaleVertical(5),
            }}
            disabled={false}
            maxStars={5}
            emptyStar={imagePath.ic_star}
            rating={Number(item?.rating)}
            // selectedStar={(rating) => onStarRatingPress(rating)}
            fullStarColor={colors.ORANGE}
            containerStyle={{ width: width / 9 }}
            starSize={15}
          />
        </View>
        <Text
          style={{
            marginLeft: moderateScaleVertical(24),
            width: moderateScale(195),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            fontFamily: fontFamily?.regular,
          }}>
          {item?.review}
        </Text>
      </View>
    );
  };


  const getP2pProductDetail = () => {
    actions
      .getProductDetailByProductId(
        `/${paramData?.product_id}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then(res => {
        console.log(res, '<===response getProductDetailByProductId');
        setIsLoading(false);
        setProductInfo(res?.data?.products);
        if (!isEmpty(res?.data?.products?.product_availability)) {
          let dateObj = {}
          res?.data?.products?.product_availability?.map((item, index) => {
            if (moment(item?.date_time).format("YYYY-MM-DD") >= moment(new Date()).format("YYYY-MM-DD"))
              dateObj[moment(item?.date_time).format("YYYY-MM-DD")] = { selected: true, customStyles: { container: { backgroundColor: !!item?.not_available ? colors.grey1 : colors.black }, text: { color: colors.white } }, is_blocked: !!item?.not_available }
          })
          setSelectedDates({ ...selectedDates, ...dateObj })
        }
        setRegion({
          latitude: Number(res?.data?.products?.latitude),
          longitude: Number(res?.data?.products?.longitude),
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        })
      })
      .catch(errorMethod);
  };

  const onSelect = indexSelected => {
    setIndexSelected(indexSelected);
  };

  const errorMethod = error => {
    console.log(error, '<===error getProductDetailByProductId');
    setIsLoading(false);
    showError(error?.message || error?.error);
  };

  const createRoom = async () => {
    if (!userData?.auth_token) {
      actions.setAppSessionData('on_login');
      return;
    }
    setLoadingChat(true);
    try {
      const apiData = {
        sub_domain: '192.168.101.88', //this is static value
        client_id: String(appData?.profile.id),
        db_name: appData?.profile?.database_name,
        user_id: String(userData?.id),
        type: 'user_to_user',
        product_id: String(productInfo?.id),
        vendor_id: String(productInfo?.vendor?.id),
      };

      console.log('sending api data', apiData);
      const res = await actions.onStartChat(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });

      if (!!res?.roomData) {
        onChat(res.roomData);
      }
      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
      console.log('error raised in start chat api', error);
      showError(error?.message);
    }
  };

  const onChat = item => {
    navigation.navigate(navigationStrings.CHAT_SCREEN, { data: { ...item } });
  };


  const renderItem = useCallback(({ item, index }) => {
    return (
      <View style={styles.item}>
        <FastImage
          source={{
            uri: getImageUrl(
              item?.image?.path?.image_fit,
              item?.image?.path?.image_path,
              '400/400',
            ),
          }}
          style={{
            height: moderateScale(290),
            width: width,
            borderBottomLeftRadius: moderateScale(12),
            borderBottomRightRadius: moderateScale(12)
          }}
        />
      </View>
    );
  }, []);

  const toggleModal = () => {

    let firstSelectedDate = null;
    let lastSelectedDate = null;

    let markedDates = cloneDeep(selectedDates)

    Object.keys(markedDates).forEach(date => {
      if (markedDates[date].is_selected) {
        if (!firstSelectedDate) {
          firstSelectedDate = date;
        }
        lastSelectedDate = date;
      }
    });

    setStartDate(firstSelectedDate)
    setEndDate(lastSelectedDate)



    setModalVisible(!isModalVisible);
  };


  const modalContent = () => {
    return (
      <View
        style={{
          height: height,
          backgroundColor: colors.green,
        }}>
        <WrapperContainer>
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              zIndex: 1,
            }}
            onPress={() => {
              bottomSheetModalRef.current.close();
              setSelectedPanoImg(null);
            }}>
            <Image source={imagePath.back1} />
          </TouchableOpacity>

          <FastImage
            source={{
              uri: getImageUrl(
                selectedPanoImg?.image?.path?.image_fit,
                selectedPanoImg?.image?.path?.image_path,
                '400/400',
              ),
            }}
            style={{
              height: height - moderateScaleVertical(40),
              width: width,
            }}
          />
        </WrapperContainer>
      </View>
    );
  };



  const handleDayPress = (day) => {
    let markedDates = cloneDeep(selectedDates)

    if (isEmpty(markedDates[day?.dateString]) || markedDates[day?.dateString]?.is_blocked) {
      alert("Please select available date only")
      return
    }
    // return
    let is_selected_count = 0;
    for (const date in markedDates) {
      if (markedDates[date].is_selected) {
        is_selected_count++;
      }
    }
    if (is_selected_count > 1) {
      for (const property in markedDates) {
        if (!!markedDates[property]?.is_selected) {
          delete markedDates[property]?.is_selected
          markedDates[property] = { selected: true, customStyles: { container: { backgroundColor: colors.black }, text: { color: colors.white } } }
        }
      }
      markedDates[day?.dateString] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
      setSelectedDates(markedDates)
    } else {

      if (markedDates[day?.dateString] && markedDates[day?.dateString].is_selected) {
        markedDates[day?.dateString] = { selected: true, customStyles: { container: { backgroundColor: colors.black }, text: { color: colors.white } } }
        setSelectedDates(markedDates)
      }
      else {
        console.log(markedDates, "<===markedDates")
        const keys = Object.keys(markedDates);
        const selectedIndex = keys.findIndex(key => markedDates[key].is_selected === true);
        if (selectedIndex !== -1) {
          const start = Object.keys(markedDates)[selectedIndex];
          const end = day.dateString;

          let isSelectedInRange = false;

          for (let date = start; date <= end; date = new Date(Date.parse(date) + 86400000).toISOString().slice(0, 10)) {
            if (markedDates[date] && markedDates[date].is_blocked) {
              isSelectedInRange = true;
              break;
            }
          }

          if (!isSelectedInRange) {
            const range = {};
            for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
              const date = moment(d).format('YYYY-MM-DD');
              if (date === start) {
                range[date] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
              } else if (date === end) {
                range[date] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
              } else {
                range[date] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
              }
            }
            setSelectedDates({ ...markedDates, ...range });
          }
          else {
            alert("You can not select blocked dates")
          }

        }
        else {
          markedDates[day?.dateString] = { selected: true, customStyles: { container: { backgroundColor: themeColors?.primary_color }, text: { color: colors.white } }, is_selected: true }
          setSelectedDates(markedDates)
        }
      }
    }

    return
  };


  const onTimeSlider = (value, key) => {
    let val = value[0]

    if (val === 24 || val === 12) {
      key == "P" ? setPickUpTime(val === 24 ? "12:00 AM" : "12:00 PM") : setDropOffTime(val === 24 ? "12:00 AM" : "12:00 PM")
    }
    else if (val >= 13) {
      key == "P" ? setPickUpTime(`${val - 12}:00 PM`) : setDropOffTime(`${val - 12}:00 PM`)

    }
    else {
      key == "P" ? setPickUpTime(`${val}:00 AM`) : setDropOffTime(`${val}:00 AM`)
    }

  }
  const _finalAddToCart = () => {





    const data = {};
    data['sku'] = productInfo?.sku;
    data['quantity'] = 1;
    data['product_variant_id'] = productInfo?.variant[0]?.id;
    data['type'] = dineInType;
    if (productInfo?.category?.category_detail?.type_id !== 13) {


      data['start_date_time'] = `${startDate} ${String(moment(pickUpTime, "hh:mm:ss").format("hh:mm:ss"))}`;
      data['end_date_time'] = `${endDate} ${String(moment(dropOffTime, "hh:mm:ss").format("hh:mm:ss"))}`;
    }
    console.log(data, 'data for cart');

    actions.addProductsToCart(data, {
      code: appData.profile.code,
      currency: currencies.primary_currency.id,
      language: languages.primary_language.id,
      systemuser: DeviceInfo.getUniqueId(),
    })
      .then((res) => {
        setisLoadingAddToCart(false)
        actions.cartItemQty(res);
        actions.reloadData(!reloadData);
        // showSuccess(strings.PRODUCT_ADDED_SUCCESS);
        moveToNewScreen(navigationStrings.PRODUCT_PRICE_DETAILS, {})()
      })
      .catch((error) => {
        setisLoadingAddToCart(false)
        showError(error?.message || error?.error)
      });
  }

  const clearEntireCart = () => {


    if (!userData?.auth_token) {
      actions.setAppSessionData('on_login');
      return;
    }

    if ((!startDate || !endDate) && productInfo?.category?.category_detail?.type_id !== 13) {
      showError("Please select rental date range")
      return
    }


    if (productInfo?.vendor?.id === userData?.vendor_id) {
      showError("Product is added by you!")
      return;
    }
    setisLoadingAddToCart(true)
    actions.clearCart({},
      {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      },
    )
      .then(res => {
        actions.cartItemQty({});
        if (res?.message) {
          _finalAddToCart()
        }
      })
      .catch((error) => showError('something went wrong'));
  };

  const distance = () => {
    return getDistance(
      {
        latitude: productInfo?.latitude,
        longitude: productInfo?.longitude,
      },
      { latitude: location?.latitude, longitude: location?.longitude },
    );

  }
  if (isLoading) {
    return <WrapperContainer isLoading={isLoading} />;
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.statusbarColor,
      }}>
      {!isEmpty(productInfo) && (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 2 }}>
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: colors.white }}>
              {!isEmpty(productInfo?.product_media) ? (
                <Carousel
                  ref={carouselRef}
                  sliderWidth={width}
                  sliderHeight={height}
                  itemWidth={width}
                  data={productInfo?.product_media}
                  renderItem={renderItem}
                  onSnapToItem={index => onSelect(index)}
                />
              ) : (

                <FastImage
                  source={imagePath.icDefaultImg}
                  style={{
                    height: moderateScale(250),
                    width: width,

                  }}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.back}
              onPress={() => navigation.goBack()}>
              <Image source={imagePath.icBckBtn} />
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.heart}>
            <Image source={imagePath.heart2} />
          </TouchableOpacity> */}

            {!isEmpty(productInfo?.product_media) &&
              productInfo?.product_media.length >= 2 && (
                <View
                  style={{
                    position: 'absolute',
                    top: moderateScaleVertical(140),
                    zIndex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: width,
                  }}>
                  <TouchableOpacity
                    onPress={() => carouselRef.current.snapToPrev()}
                    style={{ ...styles.leftRightBtn, left: moderateScale(15) }}>
                    <Image
                      source={imagePath.backRoyo}
                      style={{
                        tintColor: themeColors.primary_color,
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => carouselRef.current.snapToNext()}
                    style={{ ...styles.leftRightBtn, right: moderateScale(15) }}>
                    <Image
                      source={imagePath.backRoyo}
                      style={{
                        tintColor: themeColors.primary_color,
                        transform: [{ rotate: '180deg' }],
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}

            <View style={styles.pagination}>
              {
                !isEmpty(productInfo?.product_media)
                &&
                productInfo?.product_media?.length >= 2
                &&
                productInfo?.product_media?.map((item, index) => {
                  return (
                    <View
                      key={String(index)}
                      style={[
                        styles.dotStyle,
                        {
                          backgroundColor:
                            index === indexSelected
                              ? colors.orange1
                              : colors.white,
                          // width: index === indexSelected ? 20 : 8,
                        },
                      ]}
                    />
                  );
                })
              }
            </View>
            <View style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: moderateScale(16),
              marginTop: moderateScale(11),

            }}>

              <Text
                style={{

                  fontFamily: fontFamily?.medium,
                  fontSize: textScale(20),

                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>
                {productInfo?.translation[0]?.title}
              </Text>


              {productInfo?.category?.category_detail?.type_id == 13 && <Text
                style={{
                  marginTop: moderateScale(11),
                  fontFamily: fontFamily?.medium,
                  fontSize: textScale(16),
                  marginHorizontal: moderateScale(16),
                  color: isDarkMode ? MyDarkTheme.colors.text : themeColors?.primary_color
                }}>
                {tokenConverterPlusCurrencyNumberFormater(productInfo?.price || productInfo?.variant[0]?.price || 0, digit_after_decimal, additional_preferences, currencies?.primary_currency?.symbol) || ''}
              </Text>}
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginLeft: moderateScale(16),
                marginTop: moderateScaleVertical(18),
              }}>
              <Image source={imagePath.ooryks_Profile} />
              <View style={{ marginLeft: moderateScale(16) }}>
                <Text style={{
                  fontFamily: fontFamily?.regular,
                  fontSize: textScale(13),
                  color: colors.textGreyL
                }}>{strings.LENT_BY} <Text style={{
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>{productInfo?.vendor?.name}</Text></Text>
                <StarRating
                  starStyle={{
                    width: moderateScale(19),
                    height: moderateScaleVertical(15),
                    marginTop: moderateScaleVertical(5),
                  }}
                  disabled={false}
                  maxStars={5}
                  emptyStar={imagePath.ic_star}
                  rating={Number(productInfo?.averageRating)}
                  // selectedStar={(rating) => onStarRatingPress(rating)}
                  fullStarColor={colors.ORANGE}
                  containerStyle={{ width: width / 9 }}
                  starSize={15}
                />
              </View>
            </View>
            {!isEmpty(productInfo) && !!productInfo?.address &&
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: moderateScale(20),
                    marginHorizontal: moderateScale(16),
                  }}>
                  <Image
                    source={imagePath.location1}
                    style={{ tintColor: isDarkMode ? MyDarkTheme.colors.white : colors.grayOpacity51 }}
                  />
                  <Text
                    style={{
                      fontFamily: fontFamily?.regular,
                      fontSize: textScale(14),
                      marginHorizontal: moderateScale(16),
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    }}>
                    {strings.PICKUP_LOCATION}- <Text style={{
                      color: colors.textGreyN,
                    }}>{productInfo?.address}</Text>
                  </Text>
                </View>
                {(!!productInfo?.latitude && !!productInfo?.longitude) && <View
                  style={{
                    flexDirection: 'row',
                    marginTop: moderateScale(20),
                    marginHorizontal: moderateScale(16),
                  }}>
                  <Image
                    source={imagePath.distance}
                    style={{ tintColor: isDarkMode ? MyDarkTheme.colors.white : colors.black }}
                  />
                  <Text
                    style={{
                      fontFamily: fontFamily?.regular,
                      fontSize: scale(14),
                      marginHorizontal: moderateScale(16),
                      color: colors.textGreyN,
                    }}>
                    <Text style={{
                      color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                    }}>{Number(distance() / 1000).toFixed(2)}km</Text> from {productInfo?.address}
                  </Text>
                </View>}
              </View>
            }


            {productInfo?.category?.category_detail?.type_id !== 13 &&

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: moderateScale(16),
                    marginTop: moderateScale(20),
                    width: width - moderateScale(30),
                  }}>
                  <Text style={{
                    fontFamily: fontFamily?.regular,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    fontSize: textScale(13)
                  }}>Offers for a:</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginHorizontal: moderateScale(6),
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <Text style={{
                      fontFamily: fontFamily?.medium, color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      fontSize: textScale(14)
                    }}>Day {tokenConverterPlusCurrencyNumberFormater(productInfo?.price || productInfo?.variant[0]?.price || 0, digit_after_decimal, additional_preferences, currencies?.primary_currency?.symbol) || ''}</Text>
                    <Text style={{
                      fontFamily: fontFamily?.medium, color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      fontSize: textScale(14)
                    }}>Week {tokenConverterPlusCurrencyNumberFormater(productInfo?.week_price || productInfo?.variant[0]?.week_price || 0, digit_after_decimal, additional_preferences, currencies?.primary_currency?.symbol,) || ''}</Text>
                    <Text style={{
                      fontFamily: fontFamily?.medium, color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                      fontSize: textScale(14)
                    }}>Month {tokenConverterPlusCurrencyNumberFormater(productInfo?.month_price || productInfo?.variant[0]?.month_price || 0, digit_after_decimal, additional_preferences, currencies?.primary_currency?.symbol,) || ''}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={toggleModal}
                  style={styles.dateBox}>
                  <Text style={{ ...styles.dateTxt, color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyM }}>
                    {moment(startDate || new Date()).format("dddd DD MMMM'YY")} {'\n'}
                    {pickUpTime}{' '}
                  </Text>
                  <Image style={{ margin: moderateScale(10) }} source={imagePath.ic_right_arrow} />
                  <Text style={{ ...styles.dateTxt, color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyM }}>
                    {moment(endDate || new Date()).format("dddd DD MMMM'YY")} {'\n'}
                    {dropOffTime}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            }
            {!!productInfo?.translation[0]?.body_html && <View>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                  marginHorizontal: moderateScale(16),
                  marginTop: moderateScale(20),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>
                {strings.DESCRIPTION}
              </Text>
              <View style={{
                marginHorizontal: moderateScale(16),
                marginTop: moderateScale(4)
              }}>

                <RenderHTML
                  contentWidth={width}
                  source={{
                    html: productInfo?.translation[0]?.body_html
                      ? productInfo?.translation[0]?.body_html
                      : ''
                  }}
                  tagsStyles={{
                    p: {
                      color: isDarkMode ? colors.white : colors.black,
                      textAlign: 'left',
                    },

                  }}
                />

              </View>
            </View>}




            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: moderateScaleVertical(8),
                marginHorizontal: moderateScale(12),
              }}>
              <Text
                style={{ fontFamily: fontFamily?.bold, fontSize: textScale(14) }}>
                Type
              </Text>
              <Text style={{ width: moderateScale(186), fontSize: textScale(14) }}>
                Digital camera with support for interchangeable lenses
              </Text>
            </View> */}
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: moderateScaleVertical(8),
                marginHorizontal: moderateScale(12),
              }}>
              <Text
                style={{ fontFamily: fontFamily?.bold, fontSize: textScale(14) }}>
                LENS MOUNT
              </Text>
              <Text style={{ width: moderateScale(186), fontSize: textScale(14) }}>
                Nikon Z mount
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: moderateScaleVertical(8),
                marginHorizontal: moderateScale(12),
              }}>
              <Text
                style={{ fontFamily: fontFamily?.bold, fontSize: textScale(14) }}>
                PICTURE ANGLE
              </Text>
              <Text style={{ width: moderateScale(186), fontSize: textScale(14) }}>
                APS-C Size / DX-Format
              </Text>
            </View> */}
            {!!region?.latitude && <View
              style={{
                marginTop: moderateScaleVertical(40),
                marginHorizontal: moderateScale(12),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                  fontSize: textScale(14),
                  marginBottom: moderateScale(10),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>
                {strings.LOCATION_ON_MAP}
              </Text>
              <View
                style={{
                  height: height / 6,
                  width: width - 20,
                  alignSelf: 'center',
                }}>
                <MapView
                  ref={mapRef}
                  provider={
                    Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                  }
                  style={{
                    borderRadius: moderateScale(12),
                    ...StyleSheet.absoluteFillObject,
                  }}
                  region={region}
                  initialRegion={region}
                >
                  <MapView.Marker
                    tracksViewChanges={false}
                    key={`coordinate_${region?.latitude}`}
                    image={imagePath.icLocation1}
                    coordinate={{
                      latitude: Number(region?.latitude),
                      longitude: Number(region?.longitude),
                    }}
                  ></MapView.Marker></MapView>
              </View>
            </View>}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: moderateScale(12),
                marginTop: moderateScaleVertical(24)
              }}>
              <Text
                style={{ fontFamily: fontFamily?.bold, fontSize: textScale(14), color: isDarkMode ? MyDarkTheme.colors.text : colors.black }}>
                Reviews
              </Text>
              {/* <Text
                style={{ color: colors.safety_orange, fontSize: textScale(14) }}>
                View All
              </Text> */}
            </View>

            <FlatList data={productInfo?.product_reviews || []}
              ListFooterComponent={() => <View style={{
                height: moderateScale(50)
              }} />}
              renderItem={renderReview} ListEmptyComponent={() => <View style={{
                alignItems: "center",
                justifyContent: "center",
                marginVertical: moderateScaleVertical(8),

              }}
              >
                <Text style={{
                  fontFamily: fontFamily?.medium,
                  fontSize: textScale(14),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                }}>No Reviews Yet !</Text>

              </View>
              } />
          </View>
        </ScrollView>
      )}

      {<View
        style={{
          position: "absolute",
          bottom: moderateScaleVertical(10),
          width: width - moderateScale(30),
          alignSelf: "center",
        }}>
        <ButtonWithLoader
          isLoading={isLoadingAddToCart}
          btnText={productInfo?.category?.category_detail?.type_id == 13 ? strings.ADD : strings.CHECK_FINAL_PRICE}
          onPress={clearEntireCart}
          btnStyle={{
            backgroundColor: isDarkMode ? themeColors?.primary_color : colors.black,
            borderWidth: 0,
            borderRadius: moderateScale(4),

          }} />

      </View>}

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          handleComponent={() => <></>}>
          {modalContent()}
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <Modal isVisible={isModalVisible} style={{
        margin: 0
      }}>
        <View style={{ backgroundColor: colors.white, flex: 1, paddingTop: Platform.OS == "ios" ? StatusBarHeight : 0 }}>
          <OoryksHeader
            leftTitle={strings.DATE_AND_TIME}
            onPressLeft={() => setModalVisible(false)}
            isCustomLeftPress
            titleStyle={{
              color: colors.black
            }}
          />
          <View
            style={styles.dateBox}>
            <Text style={styles.dateTxt}>
              {moment(startDate || new Date()).format("dddd DD MMMM'YY")} {'\n'}{pickUpTime}</Text>
            <Image source={imagePath.icArrw} />
            <Text style={styles.dateTxt}>
              {"   "}{moment(endDate || new Date()).format("dddd DD MMMM'YY")} {'\n'}
              {"   "}{dropOffTime}{' '}
            </Text>

          </View>

          <Calendar markingType={'custom'} markedDates={selectedDates} onDayPress={handleDayPress} minDate={String(new Date())} />
          <View
            style={{
              backgroundColor: colors.grey1,
              marginTop: moderateScaleVertical(43),
            }}>

            <View
              style={styles.sliderContainer}>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                }}>
                {strings.PICK_UP}
              </Text>
              <MultiSlider
                min={1}
                max={24}
                step={1}
                sliderLength={moderateScale(250)}
                allowOverlap={false}
                onValuesChange={(val) => onTimeSlider(val, "P")}
                selectedStyle={{
                  backgroundColor: colors.greyNew1,
                }}
                unselectedStyle={{
                  backgroundColor: colors.black,
                }}
                customMarker={() => (
                  <View
                    style={styles.customMarker}>
                    <Text>{pickUpTime}</Text>
                  </View>
                )}
              />

            </View>

            <View
              style={styles.sliderContainer}>
              <Text
                style={{
                  fontFamily: fontFamily?.bold,
                }}>
                {strings.DROP_OFF}
              </Text>

              <MultiSlider
                onValuesChange={(val) => onTimeSlider(val, "D")}
                values={[12]}
                sliderLength={moderateScale(250)}
                min={1}
                max={24}
                step={1}
                allowOverlap={false}
                unselectedStyle={{
                  backgroundColor: colors.black,
                }}
                selectedStyle={{
                  backgroundColor: colors.greyNew1,
                }}
                customMarker={() => (
                  <View
                    style={styles.customMarker}>
                    <Text>{dropOffTime}</Text>
                  </View>
                )}
              />
            </View>


            <GradientButton
              onPress={toggleModal}
              containerStyle={{
                marginHorizontal: moderateScale(16),
                marginTop: moderateScaleVertical(12),
              }}
              colorsArray={['#000000', '#000000']}

              btnText={strings.CONTINUE}
            />
          </View>

        </View>
      </Modal >

    </View >
  );
};

export function stylesFunc({ fontFamily }) {
  const styles = StyleSheet.create({
    headerStyle: {
      // padding: moderateScaleVertical(16),
      paddingHorizontal: moderateScale(16),
      height: StatusBarHeight,
    },

    textStyle: {
      color: colors.black2Color,
      fontSize: textScale(16),
      lineHeight: textScale(28),
      textAlign: 'center',
      fontFamily: fontFamily?.medium,
    },
  });
  return styles;
}

export default P2pOndemandProductDetail;
