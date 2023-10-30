import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import imagePath from '../../../constants/imagePath';
import GradientButton from '../../../Components/GradientButton';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import styleFun from './styles';
import { isEmpty } from 'lodash';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import RenderHTML from 'react-native-render-html';
import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import WrapperContainer from '../../../Components/WrapperContainer';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import { dialCall } from '../../../utils/openNativeApp';
import ReactNativeModal from 'react-native-modal';
import Header from '../../../Components/Header';
import GradientView from '../../../Components/GradientView';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import DeviceInfo from 'react-native-device-info';
import strings from '../../../constants/lang';

const P2pProductDetail = ({ navigation, route }) => {
  const carouselRef = useRef(null);
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
  } = useSelector((state) => state?.initBoot);
  const { userData } = useSelector((state) => state?.auth || {});
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};


  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = styleFun({ themeColor, themeToggle, fontFamily });
  const [indexSelected, setIndexSelected] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [productInfo, setProductInfo] = useState({});
  const [productAttributeInfo, setProductAttributeInfo] = useState([]);
  const [isLoadingChat, setLoadingChat] = useState(false);
  const [selectedPanoImg, setSelectedPanoImg] = useState(null);
  const [deliveryType, setDeliveryType] = useState([{ id: 1, title: 'Pickup' }, { id: 2, title: 'Delivery' }])
  const [deliveryIndex, setDeliveryIndex] = useState(0)
  useEffect(() => {
    getP2pProductDetail();
  }, []);

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
      .then((res) => {
        console.log(res, '<===response getProductDetailByProductId');
        setIsLoading(false);
        setProductInfo(res?.data?.products);
        var results = res?.data?.product_attribute.reduce(function (
          results,
          org,
        ) {
          (results[org.attribute_id] = results[org.attribute_id] || []).push(
            org,
          );
          return results;
        },
          {});

        setProductAttributeInfo(Object.values(results) || []);
      })
      .catch(errorMethod);
  };

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const errorMethod = (error) => {
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

  const onChat = (item) => {
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
            height: moderateScale(299),
            width: width,
          }}
        />
      </View>
    );
  }, []);

  const renderaAttributeItems = useCallback(
    ({ item, index }) => {
      return (
        <View
          style={{
            paddingLeft: moderateScale(10),
            marginTop: moderateScaleVertical(5),
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            {item?.map((item, index) => {
              return (
                <Text
                  style={{
                    fontFamily: fontFamily?.regular,
                    fontSize: textScale(12),
                    color: isDarkMode
                      ? MyDarkTheme?.colors?.text
                      : colors.black,
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily?.bold,
                      fontSize: textScale(12),
                      color: isDarkMode
                        ? MyDarkTheme?.colors?.text
                        : colors.black,
                    }}>
                    {index == 0 ? `${item?.title}: ` : ''}
                  </Text>
                  {index == 0 ? '' : ','} {item?.value}
                </Text>
              );
            })}
          </View>
        </View>
      );
    },
    [productInfo],
  );

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

  if (isLoading) {
    return <WrapperContainer isLoading={isLoading}
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      } />;
  }

  const clearCart = async (addonSet = [], item, section, inx) => {
    actions
      .clearCart(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'reeserseerserrser')
        showSuccess(res?.message)
        // actions.cartItemQty({});
        // setIsVisibleModal(false);
      })
      .catch((error) => {
        console.log(error, 'erorrrrrr');
      });
  };

  const addToCart = () => {
    
    let data = {};
    data['sku'] = productInfo?.sku;
    data['quantity'] = productInfo?.minimum_order_count;
    data['product_variant_id'] = productInfo?.variant[0]?.id;
    data['type'] = !!deliveryIndex ? 'delivery' : 'pickup';
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res.data');
        // actions.cartItemQty(res);
        // actions.reloadData(!reloadData);

        showSuccess(strings.PRODUCT_ADDED_SUCCESS);

        // updateState({ isLoadingC: false });
        // if (!!isProductList) {
        //   navigation.navigate(navigationStrings.PRODUCT_LIST, {
        //     data: {
        //       item: data,
        //       isLoading: true,
        //       data: res?.data
        //     }
        //   });
        // } else {
        navigation.goBack()
        // }
      }).catch((error) => {
        console.log('error---------', error)
        Alert.alert('', strings.ALREADY_EXIST, [
          {
            text: strings.CANCEL,
            onPress: () => console.log('Cancel Pressed'),
            // style: 'destructive',
          },
          {
            text: strings.CLEARCART,
            onPress: () => clearCart(),
          },
        ]);
      }
      );
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
        <ScrollView showsVerticalScrollIndicator={false} style={{ flexGrow: 1 }}>
          <View style={{ backgroundColor: colors.white }}>
            {!isEmpty(productInfo?.product_media) ? (
              <Carousel
                ref={carouselRef}
                sliderWidth={width}
                sliderHeight={height}
                itemWidth={width}
                data={productInfo?.product_media}
                renderItem={renderItem}
                onSnapToItem={(index) => onSelect(index)}
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
            <Image source={imagePath.back1} />
          </TouchableOpacity>


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
            {!isEmpty(productInfo?.product_media) &&
              productInfo?.product_media?.length >= 2 &&
              productInfo?.product_media?.map((item, index) => {
                return (
                  <View
                    style={[
                      styles.dotStyle,
                      {
                        backgroundColor:
                          index === indexSelected
                            ? colors.orange1
                            : colors.white,
                        width: index === indexSelected ? 20 : 8,
                      },
                    ]}
                  />
                );
              })}
          </View>
          <View style={styles.view}>
            <GradientView
              title={tokenConverterPlusCurrencyNumberFormater(
                Number(productInfo?.variant[0]?.price),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
              colorsArray={[
                getColorCodeWithOpactiyNumber(
                  themeColors?.primary_color.substr(1),
                  30,
                ),
                getColorCodeWithOpactiyNumber(
                  themeColors?.primary_color.substr(1),
                  60,
                ),
                themeColors?.primary_color,
              ]}
              btnStyle={{
                marginVertical: moderateScaleVertical(6),
              }}
            />

            <Text style={{ ...styles.txt1 }}>
              {!isEmpty(productInfo?.translation)
                ? productInfo?.translation[0]?.title
                : ''}
            </Text>

            {!isEmpty(productInfo?.translation) && (
              <RenderHTML
                contentWidth={width}
                source={{ html: productInfo?.translation[0]?.body_html }}
                tagsStyles={{
                  p: {
                    color: isDarkMode ? colors.white : colors.black,
                    textAlign: 'left',
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(13),
                    opacity: 0.7,
                  },
                }}
              />
            )}
          </View>
          <View style={styles.view1}>
            <Text style={{ ...styles.txt1, fontSize: textScale(13) }}>
              Posted By
            </Text>
            <View style={styles.view2}>
              <View
                style={{
                  height: moderateScale(70),
                  width: moderateScale(70),

                  alignItems: 'center',
                  justifyContent: 'center',

                  borderRadius: moderateScale(35),
                }}>
                <FastImage
                  source={
                    !!productInfo?.vendor?.logo?.image_fit
                      ? {
                        uri: getImageUrl(
                          productInfo?.vendor?.logo?.image_fit,
                          productInfo?.vendor?.logo?.image_path,
                          '400/400',
                        ),
                      }
                      : imagePath.icProfile
                  }
                  style={{
                    height: moderateScale(60),
                    width: moderateScale(60),
                    borderRadius: moderateScale(30),
                  }}
                />
              </View>
              <Text
                style={{
                  ...styles.txt2,
                  marginLeft: 8,
                  color: colors.orange1,
                }}>
                {productInfo?.vendor?.name}
              </Text>
            </View>
            {(appData?.profile?.preferences?.chat_button == 1 ||
              appData?.profile?.preferences?.call_button == 1) &&
              productInfo?.vendor?.id !== userData?.vendor_id && (
                <View style={styles.view3}>
                  {appData?.profile?.preferences?.chat_button == 1 && (
                    <GradientButton
                      onPress={() => createRoom()}
                      btnText={'Chat'}
                      isImgWithTxt
                      indicator={isLoadingChat}
                      indicatorColor={themeColors?.primary_color}
                      textImgViewStyle={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      leftImgSrc={imagePath.icChatP2p}
                      textStyle={{ ...styles.chatBtn, color: themeColors?.primary_color, }}
                      btnStyle={{ ...styles.btn1, borderColor: themeColors?.primary_color, }}
                      source={imagePath.message}
                      containerStyle={{ alignItems: 'flex-start' }}
                      colorsArray={
                        isDarkMode
                          ? [
                            MyDarkTheme?.colors?.lightDark,
                            MyDarkTheme?.colors?.lightDark,
                          ]
                          : [colors.white, colors.white]
                      }
                      leftImgStyle={{
                        tintColor: themeColors?.primary_color,
                      }}
                    />
                  )}
                  {appData?.profile?.preferences?.call_button == 1 && (
                    <GradientButton
                      btnText={'Call'}
                      isImgWithTxt
                      textImgViewStyle={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        if (!userData?.auth_token) {
                          actions.setAppSessionData('on_login');
                          return;
                        }
                        dialCall(productInfo?.vendor?.phone_no);
                      }}
                      leftImgSrc={imagePath.icCallP2p}
                      textStyle={styles.chatBtn}
                      colorsArray={[themeColors?.primary_color, themeColors?.primary_color, themeColors?.primary_color]}
                      btnStyle={styles.btn2}
                      source={imagePath.call}
                      containerStyle={{ alignItems: 'flex-start' }}
                    />
                  )}
                </View>
              )}
          </View>
          {!isEmpty(productAttributeInfo) && (
            <View style={{ ...styles.view1, marginTop: 0 }}>
              <Text
                style={{
                  ...styles.txt1,
                  color: isDarkMode ? colors.white : colors.black,
                  fontFamily: fontFamily.bold,
                  fontSize: textScale(13),
                }}>
                Description
              </Text>
              <FlatList
                data={productAttributeInfo}
                renderItem={renderaAttributeItems}
              />
            </View>
          )}

          <View style={{ marginHorizontal: moderateScale(25) }}>
            <View style={{ marginVertical: moderateScaleVertical(20) }}>

              {deliveryType.map((item, index) => {
                return (
                  <TouchableOpacity style={{ flexDirection: 'row', alignContent: "center", alignItems: 'center', paddingVertical: moderateScaleVertical(5) }} onPress={() => setDeliveryIndex(index)}>
                    <Image source={
                      index == deliveryIndex
                        ? imagePath.radioActive
                        : imagePath.radioInActive
                    } /><Text style={isDarkMode
                      ? [
                        {
                          marginHorizontal: moderateScaleVertical(10),
                          fontFamily: fontFamily.medium,
                          fontSize: textScale(14)
                        },
                        { color: MyDarkTheme.colors.text },
                      ]
                      : {
                        marginHorizontal: moderateScaleVertical(10),
                        fontFamily: fontFamily.medium,
                        fontSize: textScale(14),
                      }}>{item.title}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          
          </View>
        </ScrollView>
      )}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          index={0}
          handleComponent={() => <></>}>
          {modalContent()}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default P2pProductDetail;
