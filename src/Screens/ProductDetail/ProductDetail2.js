import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import DeviceInfo from 'react-native-device-info';
import HTMLView from 'react-native-htmlview';
import {Pagination} from 'react-native-snap-carousel';
import {useSelector} from 'react-redux';
import Banner from '../../Components/Banner';
import CustomAnimatedLoader from '../../Components/CustomAnimatedLoader';
import GradientButton from '../../Components/GradientButton';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import ProductCard from '../../Components/ProductCard';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  StatusBarHeight,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {showError, showSuccess} from '../../utils/helperFunctions';
import AddonModal from './AddonModal';
import ListEmptyProduct from './ListEmptyProduct';
import stylesFunc from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';
import WrapperContainer from '../../Components/WrapperContainer';

import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function ProductDetail2({route, navigation}) {
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {productListData} = useSelector((state) => state?.product);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});
  const {data} = route.params;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    isLoading: true,
    isLoadingB: false,
    isLoadingC: false,
    productId: data.id,
    productDetailData: null,
    productPriceData: null,
    variantSet: [],
    addonSet: [],
    relatedProducts: [],
    showListOfAddons: false,
    venderDetail: null,
    productTotalQuantity: 0,
    productSku: null,
    productVariantId: null,
    isVisibleAddonModal: false,
    lightBox: false,
    productQuantityForCart: 1,
    typeId: null,
  });
  //Saving the initial state
  const initialState = cloneDeep(state);
  const userData = useSelector((state) => state?.auth?.userData);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {bannerRef} = useRef();
  const {
    productDetailData,
    productPriceData,
    isLoadingC,
    addonSet,
    variantSet,
    showListOfAddons,
    venderDetail,
    productTotalQuantity,
    productSku,
    productVariantId,
    relatedProducts,
    isVisibleAddonModal,
    lightBox,
    productQuantityForCart,
    isLoading,
    slider1ActiveSlide,
    typeId,
  } = state;

  const customRight = () => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image source={imagePath.search} />
      </View>
    );
  };

  let plainHtml = productDetailData?.translation[0]?.body_html || null;

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useFocusEffect(
    React.useCallback(() => {
      if (variantSet.length) {
        let variantSetData = variantSet
          .map((i, inx) => {
            let find = i.options.filter((x) => x.value);
            if (find.length) {
              return {
                variant_id: find[0].variant_id,
                optionId: find[0].id,
              };
            }
          })
          .filter((x) => x != undefined);
        if (variantSetData.length) {
          getProductDetailBasedOnFilter(variantSetData);
        } else {
          getProductDetail();
        }
      }
    }, [variantSet]),
  );

  useEffect(() => {
    getProductDetail();
  }, [state.productId, state.isLoadingB]);

  // useEffect(() => {
  //   if (variantSet.length) {
  //     let variantSetData = variantSet
  //       .map((i, inx) => {
  //         let find = i.options.filter((x) => x.value);
  //         if (find.length) {
  //           return {
  //             variant_id: find[0].variant_id,
  //             optionId: find[0].id,
  //           };
  //         }
  //       })
  //       .filter((x) => x != undefined);
  //     console.log(variantSetData, 'variantSetData');
  //     if (variantSetData.length) {
  //       getProductDetailBasedOnFilter(variantSetData);
  //     } else {
  //       getProductDetail();
  //     }
  //   }
  // }, [variantSet]);

  //Get Product detail

  const getProductDetail = () => {
    actions
      .getProductDetailByProductId(
        `/${state.productId}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          productDetailData: res.data.products,
          relatedProducts: res.data.relatedProducts,
          productPriceData: res.data.products.variant[0],
          addonSet: res.data.products.add_on,
          typeId: res.data.products.category.category_detail.type_id,
          venderDetail: res.data.products.vendor,
          productTotalQuantity: res.data.products.variant[0].quantity,
          productVariantId: res.data.products.variant[0].id,
          productSku: res.data.products.sku,
        });
        if (
          res.data.products.variant_set.length &&
          variantSet &&
          !variantSet.length
        ) {
          updateState({variantSet: res.data.products.variant_set});
        }
      })
      .catch(errorMethod);
  };

  //Get Product detail based on varint selection
  const getProductDetailBasedOnFilter = (variantSetData) => {
    updateState({isLoadingC: true});
    let data = {};
    data['variants'] = variantSetData.map((i) => i.variant_id);
    data['options'] = variantSetData.map((i) => i.optionId);
    actions
      .getProductDetailByVariants(`/${productDetailData.sku}`, data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          isLoadingC: false,
          productDetailData: res.data,
          productPriceData: {
            multiplier: res.data.multiplier,
            price: res.data.price,
          },
          productSku: res.data.sku,
          productVariantId: res.data.id,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    if (error?.message?.alert == 1) {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: strings.CLEAR_CART2, onPress: () => clearCart()},
      ]);
    } else {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      showError(error?.message || error?.error);
    }
  };

  const errorMethodSecond = (error, addonSet) => {
    if (error?.message?.alert == 1) {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: strings.CLEAR_CART2, onPress: () => clearCart(addonSet)},
      ]);
    } else {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      showError(error?.message || error?.error);
    }
  };

  const clearCart = (addonSet) => {
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
        actions.cartItemQty(res);
        // updateState({
        //   cartItems: [],
        //   cartData: {},
        //   isLoadingB: false,
        // });
        // addToCart();
        if (addonSet) {
          _finalAddToCart(addonSet);
        } else {
          addToCart();
        }
        // _finalAddToCart(addonSet);
        showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  //add Product to wishlist
  const _onAddtoWishlist = (item) => {
    if (!!userData?.auth_token) {
      actions
        .updateProductWishListData(
          `/${item.product_id || item.id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          showSuccess(res.message);

          if (item.inwishlist) {
            item.inwishlist = null;
            updateState({productDetailData: item});
          } else {
            item.inwishlist = {product_id: item.id};
            updateState({productDetailData: item});
          }
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  // useEffect(() => {
  //   myRef.current.scrollToPosition(1, 0, true);
  // }, [state.productId]);

  const selectSpecificOptions = (options, i, inx) => {
    let newArray = cloneDeep(options);
    updateState({
      variantSet: variantSet.map((vi, vnx) => {
        if (vi.variant_type_id == i.variant_id) {
          return {
            ...vi,
            options: newArray.map((j, jnx) => {
              if (j.id == i.id) {
                return {
                  ...j,
                  value: i?.value ? false : true,
                };
              }
              return {
                ...j,
                value: false,
              };
            }),
          };
        } else {
          return vi;
        }
      }),
    });
  };

  const radioButtonView = (options) => {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {options.map((i, inx) => {
          return (
            <TouchableNativeFeedback
              disabled={options && options.length == 1 ? true : false}
              onPress={() => selectSpecificOptions(options, i, inx)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: moderateScale(5),
                marginBottom: moderateScaleVertical(10),
              }}>
              <Image source={i?.value ? imagePath.check : imagePath.unCheck} />
              <Text style={styles.variantValue}>{i.title}</Text>
            </TouchableNativeFeedback>
          );
        })}
      </View>
    );
  };

  const circularView = (options) => {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {options.map((i, inx) => {
          return (
            <TouchableNativeFeedback
              disabled={options && options.length == 1 ? true : false}
              onPress={() => selectSpecificOptions(options, i, inx)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: moderateScale(5),
                marginBottom: moderateScaleVertical(10),
              }}>
              <View
                style={[
                  styles.variantSizeViewTwo,
                  {
                    backgroundColor: colors.white,
                    borderWidth: i?.value ? 1 : 0,

                    borderColor:
                      i?.value &&
                      (i.hexacode == '#FFFFFF' || i.hexacode == '#FFF')
                        ? colors.textGrey
                        : i.hexacode,
                  },
                ]}>
                <View
                  style={[
                    styles.variantSizeViewOne,
                    {
                      backgroundColor: i.hexacode,
                      borderWidth:
                        i.hexacode == '#FFFFFF' || i.hexacode == '#FFF'
                          ? StyleSheet.hairlineWidth
                          : 0,
                    },
                  ]}></View>
              </View>
            </TouchableNativeFeedback>
          );
        })}
      </View>
    );
  };
  const variantSetValue = ({options, type}) => {
    if (type == 1) {
      return <>{radioButtonView(options)}</>;
    }
    return <>{circularView(options)}</>;
  };

  const showAllVariants = () => {
    let variantSetData = cloneDeep(variantSet);
    return (
      <>
        {/* <View
          style={{
            marginHorizontal: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.addonLable,
              {marginBottom: moderateScale(5), marginVertical: 10},
            ]}>
            {'Product Variant'}
          </Text>
        </View> */}
        <View
          style={{marginVertical: 10, paddingHorizontal: moderateScale(15)}}>
          {variantSetData.map((i, inx) => {
            return (
              <View
                key={inx}
                style={{
                  marginVertical: moderateScaleVertical(5),
                }}>
                <Text
                  style={[
                    styles.variantLable,
                    {marginBottom: moderateScale(5)},
                  ]}>{`${i?.title}`}</Text>
                {i?.options ? variantSetValue(i) : null}
              </View>
            );
          })}
        </View>
      </>
    );
  };

  useEffect(() => {
    if (data?.addonSetData && data?.randomValue) {
      updateState({addonSet: data?.addonSetData});
      setTimeout(() => {
        _finalAddToCart(data?.addonSetData);
      }, 1000);
    }
  }, [data?.addonSetData, data?.randomValue]);

  const _finalAddToCart = (addonSet = addonSet) => {
    const addon_ids = [];
    const addon_options = [];

    addonSet.map((i, inx) => {
      i.setoptions.map((j, jnx) => {
        if (j?.value == true) {
          addon_ids.push(j?.addon_id);
          addon_options.push(j?.id);
        }
      });
    });

    let data = {};
    data['sku'] = productSku;
    data['quantity'] = productQuantityForCart;
    data['product_variant_id'] = productVariantId;
    data['type'] = dine_In_Type;

    if (addonSet && addonSet.length) {
      // console.log(addonSetData, 'addonSetData');
      data['addon_ids'] = addon_ids;
      data['addon_options'] = addon_options;
    }
    updateState({isLoadingC: true, isVisibleAddonModal: false});
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        showSuccess(strings.PRODUCT_ADDED_SUCCESS);

        updateState({isLoadingC: false});
        navigation.goBack();
      })
      .catch((error) => errorMethodSecond(error, addonSet));
  };

  const addToCart = () => {
    {
      addonSet && addonSet.length
        ? updateState({isVisibleAddonModal: true})
        : _finalAddToCart(addonSet);
    }
    // _finalAddToCart()
  };

  const myRef = useRef(null);

  const productIncrDecreamentForCart = (type) => {
    if (type == 2) {
      if (productQuantityForCart <= 1) {
      } else {
        updateState({
          productQuantityForCart: productQuantityForCart - 1,
        });
      }
    } else if (type == 1) {
      if (productQuantityForCart == productTotalQuantity) {
        showError(strings.MAXIMUM_LIMIT_REACHED);
      } else {
        updateState({
          productQuantityForCart: productQuantityForCart + 1,
        });
      }
    }
  };

  const renderProduct = ({item, index}) => {
    item.showAddToCart = true;
    return (
      <ProductCard
        onPress={() =>
          navigation.push(navigationStrings.PRODUCTDETAIL, {data: item})
        }
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        data={item}
        cardStyle={{marginHorizontal: moderateScale(10)}}
        addToCart={() =>
          navigation.push(navigationStrings.PRODUCTDETAIL, {data: item})
        }
        bottomText={strings.VIEW_DETAIL}
      />
    );
  };

  const setModalVisibleForAddonModal = (visible) => {
    updateState({isVisibleAddonModal: false});
  };

  const onclickBanner = () => {
    updateState({lightBox: true});
  };

  return (
    <WrapperContainer
    bgColor={
      isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
    }
    statusBarColor={colors.backgroundGrey}
    source={loaderOne}
    // isLoadingB={deliveryFeeLoader}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <CustomAnimatedLoader
        source={loaderOne}
        loaderTitle={strings.LOADING}
        containerColor={colors.white}
        loadercolor={themeColors.primary_color}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
          },
        ]}
        visible={isLoadingC}
      />
      {isLoading && (
        <View style={{marginTop: StatusBarHeight + moderateScale(40)}}>
          <ListEmptyProduct isLoading={isLoading} />
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          position: 'absolute',
          zIndex: 1000,
          width: width - moderateScale(20),
          top: height > 700 ? 50 : 30,
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          background={colors.green}
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: colors.white,
            height: 45,
            width: 45,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: moderateScale(11),
            elevation: 2,
          }}>
          <Image source={imagePath.backArrow} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }
          style={{
            backgroundColor: colors.white,
            height: 45,
            width: 45,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: moderateScale(11),
            elevation: 2,
          }}>
          <Image source={!!data?.showAddToCart ? false : imagePath.search} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          alignItems: 'center',
          height: Platform.OS === 'ios' ? height * 0.27 : height * 0.3,
          zIndex: Platform.OS === 'ios' ? 0 : -1000,
        }}>
        <Banner
          bannerRef={bannerRef}
          bannerData={productDetailData?.product_media}
          sliderWidth={width}
          itemWidth={width}
          pagination={false}
          setActiveState={(index) => updateState({slider1ActiveSlide: index})}
          showLightbox={true}
          cardViewStyle={{
            alignItems: 'center',
            height: width * 0.7,
            width: width,
          }}
          childView={
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  marginTop: 'auto',
                  marginBottom:
                    height > 700 ? moderateScale(20) : moderateScale(55),
                  alignItems: 'center',
                  marginHorizontal: moderateScale(10),
                }}>
                {(!!appData?.profile?.preferences?.rating_check && productDetailData?.averageRating !== null) && (
                  <View style={{alignItems: 'flex-end'}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderRadius: 18,
                        paddingHorizontal: 12,
                        backgroundColor: colors.orange,
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={imagePath.starWhite} />
                      <Text style={styles.ratingColor}>
                        {productDetailData?.averageRating !== null
                          ? Number(productDetailData?.averageRating).toFixed(1)
                          : ''}
                      </Text>
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => _onAddtoWishlist(productDetailData)}>
                  <View>
                    {!!productDetailData?.inwishlist ? (
                      <Image source={imagePath.blackFilledHeart} />
                    ) : (
                      <Image source={imagePath.fav} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </>
          }
        />
      </View>

      <View
        style={{
          height: height * 0.75,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.backgroundGrey,
          borderTopLeftRadius: moderateScale(20),
          borderTopRightRadius: moderateScale(20),
          marginTop: moderateScale(22),
        }}>
        <Pagination
          dotsLength={productDetailData?.product_media?.length}
          activeDotIndex={slider1ActiveSlide}
          dotColor={'grey'}
          dotStyle={[styles.dotStyle]}
          inactiveDotColor={'black'}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.8}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: moderateScale(10),
            paddingHorizontal: moderateScale(15),
            paddingTop: moderateScale(15),
          }}>
          <Text
            numberOfLines={2}
            style={
              isDarkMode
                ? [styles.productName, {color: MyDarkTheme.colors.text}]
                : styles.productName
            }>
            {productDetailData?.translation[0]?.title}
          </Text>
          {!!productTotalQuantity &&
            !!productTotalQuantity != 0 &&
            (!!data?.showAddToCart ? null : (
              <View style={{flex: 0.5, justifyContent: 'center'}}>
                <View style={styles.incDecBtnContainer2}>
                  <TouchableNativeFeedback
                    style={{flex: 0.3, alignItems: 'center'}}
                    onPress={() => productIncrDecreamentForCart(2)}>
                    <Text style={styles.cartItemValueBtn2}>-</Text>
                  </TouchableNativeFeedback>
                  <View style={{flex: 0.4, alignItems: 'center'}}>
                    <Text style={styles.cartItemValue2}>
                      {productQuantityForCart}
                    </Text>
                  </View>
                  <TouchableNativeFeedback
                    style={{flex: 0.3, alignItems: 'center'}}
                    onPress={() => productIncrDecreamentForCart(1)}>
                    <Text style={styles.cartItemValueBtn2}>+</Text>
                  </TouchableNativeFeedback>
                </View>
              </View>
            ))}
          {/* <TouchableNativeFeedback
                  onPress={() => _onAddtoWishlist(productDetailData)}>
                  {productDetailData?.is_wishlist ? (
                    <View>
                      {!!productDetailData?.inwishlist ? (
                        <Image source={imagePath.blackFilledHeart} />
                      ) : (
                        <Image source={imagePath.fav} />
                      )}
                    </View>
                  ) : null}
                </TouchableNativeFeedback> */}
        </View>
        <ScrollView
          style={{marginBottom: moderateScale(90)}}
          showsVerticalScrollIndicator={false}>
          {plainHtml != null ? (
            <View style={{paddingHorizontal: moderateScale(15)}}>
              <HTMLView
                value={
                  plainHtml.startsWith('<p>')
                    ? plainHtml
                    : '<p>' + plainHtml + '</p>'
                }
                stylesheet={{
                  p: [
                    styles.descriptionStyle,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyE,
                    },
                  ],
                }}
              />
              <View
                style={{
                  height: 2,
                  backgroundColor: colors.lightGreyBorder,
                  marginTop: moderateScale(7),
                }}
              />
            </View>
          ) : null}
          {variantSet && variantSet.length ? showAllVariants() : null}

          <View
            style={{
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
              borderRadius: moderateScale(15),
              paddingHorizontal: moderateScale(5),
              paddingVertical: moderateScaleVertical(5),
              marginVertical: moderateScale(10),
              marginHorizontal: moderateScale(15),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                  fontSize: textScale(15),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                Total:{' '}
              </Text>
              <Text style={styles.productPrice2}>{`${
                currencies?.primary_currency.symbol
              }${(
                Number(productPriceData?.multiplier) *
                Number(productPriceData?.price)
              ).toFixed(
                appData?.profile?.preferences?.digit_after_decimal,
              )}`}</Text>
            </View>

            {/* Out of stock view */}
            {/* {console.log(productTotalQuantity,"productTotalQuantity")} */}
            {console.log(productDetailData?.sell_when_out_of_stock,"productTotalQuantity")}

            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  color:
                    (!!productTotalQuantity && !!productTotalQuantity != 0) ||
                    (!!typeId && typeId == 8) ||
                    !!productDetailData?.sell_when_out_of_stock
                      ? colors.green
                      : colors.orangeB,
                  fontSize: textScale(10),
                  lineHeight: 20,
                  fontFamily: fontFamily.medium,
                  textAlign: 'center',
                }}>
                {(!!productTotalQuantity && !!productTotalQuantity != 0) ||
                (!!typeId && typeId == 8) ||
                !!productDetailData?.sell_when_out_of_stock
                  ? ''
                  : strings.OUT_OF_STOCK}
              </Text>
            </View>

            {((!!productTotalQuantity && !!productTotalQuantity != 0) ||
              (!!typeId && typeId == 8) ||
              !!productDetailData?.sell_when_out_of_stock) &&
              (!!data?.showAddToCart ? null : (
                <View
                  style={{
                    marginHorizontal: moderateScale(20),
                  }}>
                  <GradientButton
                    colorsArray={[
                      themeColors.primary_color,
                      themeColors.primary_color,
                    ]}
                    textStyle={styles.textStyle}
                    onPress={addToCart}
                    marginTop={moderateScaleVertical(10)}
                    marginBottom={moderateScaleVertical(10)}
                    btnText={strings.ADDTOCART}
                  />
                </View>
              ))}
          </View>
          {!!relatedProducts && !!relatedProducts.length && (
            <View
              style={{
                marginHorizontal: moderateScale(20),
                flexDirection: 'row',
              }}>
              <Text
                style={[
                  styles.relatedProducts,
                  {
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  },
                ]}>
                {strings.YOUMAYALSO}
              </Text>
            </View>
          )}

          <FlatList
            data={(!state.isLoading && relatedProducts) || []}
            renderItem={renderProduct}
            keyExtractor={(item, index) => String(index)}
            keyboardShouldPersistTaps="always"
            showsHorizontalScrollIndicator={false}
            style={{flex: 1, marginVertical: moderateScaleVertical(10)}}
            contentContainerStyle={{flexGrow: 1}}
            horizontal
            ItemSeparatorComponent={() => <View style={{height: 20}} />}
            ListFooterComponent={() => <View style={{height: 20}} />}
            // ListEmptyComponent={<ListEmptyProduct isLoading={state.isLoading}/>}
          />
          <AddonModal
            productdetail={productDetailData}
            isVisible={isVisibleAddonModal}
            onClose={() => setModalVisibleForAddonModal(false)}
            // onPress={(data) => alert('123')}
            addonSet={addonSet}
            // onPress={currentLocation}
          />
        </ScrollView>
      </View>
    </WrapperContainer>
  );
}
