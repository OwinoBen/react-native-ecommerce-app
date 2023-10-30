import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import CalanderStrip from 'react-native-calendar-strip';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import Modal from 'react-native-modal';
import RenderHTML from 'react-native-render-html';
import Toast from 'react-native-simple-toast';
import {Pagination} from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import commonStylesFun from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../utils/commonFunction';
import {timeforMarkedQuestion} from '../utils/constants/ConstantValues';
import {showError, showSuccess} from '../utils/helperFunctions';
import Banner from './Banner';
import GradientButton from './GradientButton';
import HtmlViewComp from './HtmlViewComp';
import CardLoader from './Loaders/CardLoader';

const HomeServiceVariantAddons = ({
  productdetail = {},
  isVisible = false,
  onClose,
  showShimmer,
  shimmerClose = () => {},
  updateCartItems = () => {},
}) => {
  console.log(productdetail, 'productdetailproductdetailproductdetail');
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);

  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    productId: productdetail?.id,
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
    showErrorMessageTitle: false,
    btnLoader: false,
    totalItemsPrice: null,
    inputInstructionText: '',
    cleaningmaterialArray: [
      {id: 1, name: strings.NOIHAVETHEM},
      {id: 2, name: 'yes please'},
    ],
    selectedCleaningmaterial: {id: 1, name: strings.NOIHAVETHEM},
    totalPriceArray: [],
    selectedDate: null,
    calendarMarkedDates: null,
    selectedTime: null,
    timeModalVisable:
      productdetail?.mode_of_service == 'schedule' &&
      productdetail?.add_on?.length === 0
        ? true
        : false,
    mode_of_service: productdetail?.mode_of_service,
    scheduleItemDateList: [],
    userSelectedTimeForSchedule: null,
    timeMarkedQuestion: [],
    verticalTimeListIndex: null,
    horizonatalTimelistIndex: null,
    calanderMinumamDate: new Date(),
  });

  const {
    timeMarkedQuestion,
    totalItemsPrice,
    variantSet,
    addonSet,
    productDetailData,
    showErrorMessageTitle,
    productPriceData,
    productTotalQuantity,
    productSku,
    productVariantId,
    productQuantityForCart,
    btnLoader,
    totalSelectedItemPrice,
    inputInstructionText,
    cleaningmaterialArray,
    selectedCleaningmaterial,
    totalPriceArray,
    selectedDate,
    calendarMarkedDates,
    selectedTime,
    timeModalVisable,
    mode_of_service,
    scheduleItemDateList,
    userSelectedTimeForSchedule,
    verticalTimeListIndex,
    horizonatalTimelistIndex,
    calanderMinumamDate,
  } = state;

  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const isDarkMode = theme;
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} = appData?.profile?.preferences || {};

  const fontFamily = appStyle?.fontSizeData;
  const buttonTextColor = themeColors;
  const commonStyles = commonStylesFun({fontFamily, buttonTextColor});
  const dineInType = useSelector((state) => state?.home?.dineInType);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  console.log(timeforMarkedQuestion, 'timeforMarkedQuestion');
  // useFocusEffect(
  //   React.useCallback(() => {
  //     getCartDetail();
  //     if (variantSet.length) {
  //       let variantSetData = variantSet
  //         .map((i, inx) => {
  //           let find = i.options.filter((x) => x.value);
  //           if (find.length) {
  //             return {
  //               variant_id: find[0].variant_id,
  //               optionId: find[0].id,
  //             };
  //           }
  //         })
  //         .filter((x) => x != undefined);
  //       console.log(variantSetData, 'variantSetData callback');
  //       if (variantSetData.length) {
  //         getProductDetailBasedOnFilter(variantSetData);
  //       } else {
  //         getProductDetail();
  //       }
  //     }
  //   }, [variantSet, productdetail, isVisible]),
  // );

  console.log('product detail', productDetailData);

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
        console.log(res.data, 'res.data by vendor id ');
        updateState({
          productDetailData: res.data,
          productPriceData: {
            multiplier: res.data.multiplier,
            price: res.data.price,
          },
          productSku: res.data.sku,
          productVariantId: res.data.id,
          showErrorMessageTitle: false,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, 'Error>>>>>');

    if (error?.message?.alert == 1) {
      updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: 'Clear Cart', onPress: () => clearCart()},
      ]);
    } else {
      if (error?.data?.variant_empty) {
        updateState({
          isLoading: false,
          showErrorMessageTitle: true,
          isLoadingB: false,
          isLoadingC: false,
        });
      } else {
        updateState({isLoading: false, isLoadingB: false, isLoadingC: false});
        showError(error?.message || error?.error);
      }
    }
  };

  console.log('showErrorMessageTitle', showErrorMessageTitle);

  const clearCart = (addonSet) => {
    // actions
    //   .clearCart(
    //     {},
    //     {
    //       code: appData?.profile?.code,
    //       currency: currencies?.primary_currency?.id,
    //       language: languages?.primary_language?.id,
    //       systemuser: DeviceInfo.getUniqueId(),
    //     },
    //   )
    //   .then((res) => {
    //     actions.cartItemQty(res);
    //     // updateState({
    //     //   cartItems: [],
    //     //   cartData: {},
    //     //   isLoadingB: false,
    //     // });
    //     // addToCart();
    //     if (addonSet) {
    //       // _finalAddToCart(addonSet);
    //     } else {
    //       addToCart();
    //     }
    //     // _finalAddToCart(addonSet);
    //     showSuccess(res?.message);
    //   })
    //   .catch(errorMethod);
  };

  //get the entire cart detail
  const getCartDetail = () => {
    // alert("cart detail hit")
    actions
      .getCartDetail(
        `/?type=${dineInType}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
          timezone: RNLocalize.getTimeZone(),
        },
      )
      .then((res) => {
        console.log(res, 'res?.data?.products[0]');

        let myTimeArray = res?.data?.products[0]?.vendor_products.map(
          (i, inx) => {
            return {
              ...i,
              horizontalindex: null,
              selectedTime: res?.data?.products[0]?.vendor_products[inx]
                .scheduled_date_time
                ? res?.data?.products[0]?.vendor_products[
                    inx
                  ]?.scheduled_date_time
                    ?.split(' ')[1]
                    .slice(0, 5)
                : null,
              selectedDate: res?.data?.products[0]?.vendor_products[inx]
                .scheduled_date_time
                ? res?.data?.products[0]?.vendor_products[
                    inx
                  ]?.scheduled_date_time.split(' ')[0]
                : null,
            };
          },
        );

        updateState({
          scheduleItemDateList: myTimeArray,
          timeMarkedQuestion: res?.data?.products[0]?.vendor_products.map(
            (i, inx) => {
              return timeforMarkedQuestion;
            },
          ),
        });
      })
      .catch(errorMethod);
  };
  useEffect(() => {
    console.log(timeMarkedQuestion, 'timeMarkedQuestion>timeMarkedQuestion');
  }, [timeMarkedQuestion]);

  console.log(
    scheduleItemDateList,
    'scheduleItemDateListscheduleItemDateListscheduleItemDateList',
  );

  useEffect(() => {
    getProductDetail();
  }, [productdetail, isVisible]);

  const getProductDetail = () => {
    actions
      .getProductDetailByProductId(
        `/${productdetail?.id}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res.data, 'res.data++ prodcut detail');
        updateState({
          productDetailData: res.data.products,
          relatedProducts: res.data.relatedProducts,
          productPriceData: res.data.products.variant[0],
          addonSet: res.data.products.add_on,
          venderDetail: res.data.products.vendor,
          productTotalQuantity: res.data.products.variant[0].quantity,
          productVariantId: res.data.products.variant[0].id,
          productSku: res.data.products.sku,
          variantSet: res.data.products.variant_set,
        });
        shimmerClose(false);
      })
      .catch((error) => {
        console.log('error raised', error);
      });
  };

  let productImage = productdetail?.media[0];

  const selectSpecificOptionsForAddions = (options, i, inx) => {
    let newArray = cloneDeep(options);

    let find = addonSet.find((x) => x?.addon_id == i?.addon_id);

    updateState({
      addonSet: addonSet.map((vi, vnx) => {
        if (vi.addon_id == i.addon_id) {
          return {
            ...vi,
            setoptions: newArray.map((j, jnx) => {
              if (vi?.max_select > 1) {
                let incrementedValue = 0;
                newArray.forEach((e) => {
                  if (e.value) {
                    incrementedValue = incrementedValue + 1;
                  }
                });
                console.log(incrementedValue, 'incrementedValue');
                if (incrementedValue == vi?.max_select && !j.value) {
                  return {
                    ...j,
                  };
                } else {
                  if (j?.id == i?.id) {
                    return {
                      ...j,
                      value: i?.value ? false : true,
                    };
                  }

                  return {
                    ...j,
                  };
                }
              } else {
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
              }
            }),
          };
        } else {
          return vi;
        }
      }),
    });
  };
  /// cart Product Schedule

  const productShedule = (userSelectedDateTime, ProductId) => {
    let data = {
      task_type: 'later',
      schedule_dt: userSelectedDateTime,
      cart_product_id: ProductId,
    };
    actions
      .cartProductSchedule(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'responseeeeeeeeee');
      })
      .catch(console.log());
  };

  const checkBoxButtonViewAddons = ({setoptions}) => {
    return (
      <View>
        {setoptions.map((i, inx) => {
          console.log(i?.value, 'i?.value');
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                selectSpecificOptionsForAddions(setoptions, i, inx);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: moderateScaleVertical(10),
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.variantValue,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {i?.title
                    ? i.title.charAt(0).toUpperCase() + i.title.slice(1)
                    : ''}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.variantValue,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {tokenConverterPlusCurrencyNumberFormater(
                    Number(i?.multiplier) * Number(i?.price),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}
                </Text>
                <View style={{paddingLeft: moderateScale(5)}}>
                  <Image
                    source={
                      i?.value
                        ? imagePath.icCheckBoxActive
                        : imagePath.icCheckBoxInactive
                    }
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const checkBoxHomeServiceButtonViewAddons = ({setoptions}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          // justifyContent: 'space-between',
        }}>
        {setoptions.map((i, inx) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                selectSpecificOptionsForAddions(setoptions, i, inx);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',

                marginBottom: moderateScaleVertical(10),
                marginHorizontal: moderateScale(10),
              }}>
              <View
                style={
                  i?.value
                    ? {
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderColor: themeColors.primary_color,
                        borderWidth: 0.5,
                        paddingHorizontal: moderateScale(20),
                        paddingVertical: moderateScaleVertical(6),
                        borderRadius: 6,
                      }
                    : {
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderColor: colors.textGreyLight,
                        borderWidth: 0.5,
                        paddingHorizontal: moderateScale(20),
                        paddingVertical: moderateScaleVertical(6),
                        borderRadius: 6,
                      }
                }>
                <Text
                  style={[
                    styles.variantValue,
                    {
                      color: i?.value
                        ? themeColors.primary_color
                        : colors.textGreyLight,
                    },
                  ]}>
                  {i?.title
                    ? i.title.charAt(0).toUpperCase() + i.title.slice(1)
                    : ''}
                </Text>
              </View>

              {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={[
                    styles.variantValue,
                    {
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    },
                  ]}>
                  {`${currencies?.primary_currency?.symbol}${(
                    Number(i?.multiplier) * Number(i?.price)
                  ).toFixed(appData?.profile?.preferences?.digit_after_decimal)}`}
                </Text>
                <View style={{paddingLeft: moderateScale(5)}}>
                  <Image
                    source={
                      i?.value
                        ? imagePath.icCheckBoxActive
                        : imagePath.icCheckBoxInactive
                    }
                  />
                </View>
              </View> */}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const showAllAddons = () => {
    let variantSetData = cloneDeep(addonSet);
    return (
      <>
        <View
          style={{
            marginTop: moderateScaleVertical(5),
          }}>
          {variantSetData.map((i, inx) => {
            return (
              <View
                key={inx}
                style={{
                  marginVertical: moderateScaleVertical(5),
                }}>
                <Text
                  style={{
                    ...styles.variantLable,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  }}>{`Choice of ${i?.title}`}</Text>
                <Text
                  style={{
                    ...styles.chooseOption,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.grayOpacity51,
                  }}>
                  {strings.PLS_SELECT_ONE}
                </Text>
                {i?.setoptions ? checkBoxButtonViewAddons(i) : null}
                <View
                  style={{
                    ...commonStyles.headerTopLine,
                    marginVertical: moderateScaleVertical(10),
                  }}
                />
              </View>
            );
          })}
        </View>
      </>
    );
  };

  const showhomeServiceAddons = () => {
    let variantSetData = cloneDeep(addonSet);
    return (
      <>
        <View
          style={{
            marginTop: moderateScaleVertical(5),
          }}>
          {variantSetData.map((i, inx) => {
            return (
              <View
                key={inx}
                style={{
                  marginVertical: moderateScaleVertical(5),
                }}>
                <Text
                  style={{
                    ...styles.variantLable,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGrey,
                  }}>{`Choice of ${i?.title}`}</Text>
                <Text
                  style={{
                    ...styles.chooseOption,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.grayOpacity51,
                  }}>
                  {strings.PLS_SELECT_ONE}
                </Text>
                {i?.setoptions ? checkBoxHomeServiceButtonViewAddons(i) : null}
                <View
                  style={{
                    ...commonStyles.headerTopLine,
                    marginVertical: moderateScaleVertical(10),
                  }}
                />
              </View>
            );
          })}
        </View>
      </>
    );
  };

  const selectSpecificOptions = (options, i, inx) => {
    // console.log("im allVariants", allVariants)
    console.log('im iiiiii+++', i);
    // console.log("im options iiiiii", options)

    // return;
    let newArray = cloneDeep(options);

    let modifyVariants = variantSet.map((vi, vnx) => {
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
    });

    updateState({variantSet: modifyVariants});

    // console.log(modifyVariants, 'im newArray>>>>>');
  };

  const variantSetValue = ({options, type}) => {
    if (type == 1) {
      return <>{radioButtonView(options)}</>;
    }
    return <>{circularView(options)}</>;
  };

  const radioButtonView = (options) => {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {options.map((i, inx) => {
          return (
            <TouchableOpacity
              // disabled={options && options.length == 1 ? true : false}
              onPress={() => selectSpecificOptions(options, i, inx)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: moderateScale(16),
                marginBottom: moderateScaleVertical(10),
              }}>
              <Text
                style={{
                  ...styles.variantValue,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {i?.title}
              </Text>
              <Image
                source={
                  i?.value ? imagePath.icActiveRadio : imagePath.icInActiveRadio
                }
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const circularView = (options) => {
    console.log('circular view', options);
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {options.map((i, inx) => {
          return (
            <TouchableNativeFeedback
              // disabled={options && options.length == 1 ? true : false}
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

  const {bannerRef} = useRef();

  const showAllVariants = () => {
    let variantSetData = cloneDeep(variantSet);
    return (
      <View style={{marginBottom: 10, paddingHorizontal: moderateScale(0)}}>
        {variantSetData.map((i, inx) => {
          return (
            <View
              key={inx}
              style={{
                marginVertical: moderateScaleVertical(5),
              }}>
              <Text
                style={{
                  ...styles.variantLable,
                  marginBottom: moderateScale(5),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>{`${i?.title}`}</Text>
              {i?.options ? variantSetValue(i) : null}
            </View>
          );
        })}
      </View>
    );
  };

  const addToCart = (addonSet) => {
    let updateQty =
      productdetail?.qty + 1 || //localy update cart quanity
      productdetail?.check_if_in_cart_app[0]?.quantity + 1 ||
      productQuantityForCart;
    console.log('update qty', updateQty);

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

    updateState({btnLoader: true});
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        showSuccess('Product successfully added');
        updateState({
          isLoadingC: false,
          btnLoader: false,
          isVisibleAddonModal: false,
        });
        updateCartItems(
          productdetail,
          res.data.product_total_qty_in_cart, ////localy update cart quanity
          res.data.cart_product_id,
          res.data.id,
        );
        getCartDetail();
        // onClose();
      })
      .catch((error) => errorMethodSecond(error, addonSet));
  };

  const errorMethodSecond = (error, addonSet) => {
    console.log(error.message.alert, 'Error>>>>>');

    if (error?.message?.alert == 1) {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        btnLoader,
      });
      // showError(error?.message?.error || error?.error);
      // Alert.alert('', error?.message?.error, [
      //   {
      //     text: 'Cancel',
      //     onPress: () => console.log('Cancel Pressed'),
      //     // style: 'destructive',
      //   },
      //   { text: 'Clear Cart', onPress: () => clearCart(addonSet) },
      // ]);
    } else {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        btnLoader: false,
      });
      showError(error?.message || error?.error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (
        productdetail?.mode_of_service == 'schedule' &&
        productdetail?.add_on?.length === 0
      ) {
        addItemCart(addonSet);
      }
    }, [addonSet]),
  );

  const addItemCart = (addonSet) => {
    console.log(mode_of_service, 'mode_of_servicemode_of_service');
    if (mode_of_service === 'schedule') {
      addToCart(addonSet);

      updateState({
        timeModalVisable: true,
      });
    } else {
      addToCart(addonSet);
      updateState({
        timeModalVisable: false,
      });
      onClose();
    }
  };

  console.log(
    productdetail,
    'productdetailproductdetailproductdetailproductdetail',
  );

  const addTimeDate = (selectedDate, selectedTime) => {
    // productShedule();
    onClose();

    updateState({
      timeModalVisable: false,
    });
  };

  const _renderScheduleDateList = ({item, index}) => {
    console.log(item, 'item?.iditem?.iditem?.iditem?.iditem?.id');
    return item?.product?.mode_of_service === 'schedule' ? (
      <>
        <Text
          style={{
            marginHorizontal: moderateScale(16),
            fontFamily: fontFamily.bold,
            marginTop: moderateScaleVertical(5),
          }}>
          {item?.product?.translation[0]?.title}
        </Text>
        <View>{showScheduleCalenderView(item, index)}</View>
        <View>{showScheduleTimeView(item, index)}</View>
      </>
    ) : null;
  };

  const shimmerShow = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
          borderTopLeftRadius: 0,
          borderTopStartRadius: 0,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          // onScroll={onScroll}
          style={{
            ...styles.modalMainViewContainer,
            borderTopLeftRadius: 0,
            borderTopStartRadius: 0,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : '#fff',
          }}>
          <CardLoader cardWidth={width} height={width * 0.6} />
          <View style={{marginHorizontal: moderateScale(12)}}>
            <View
              style={{
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CardLoader cardWidth={10} height={10} />
              <View style={{marginHorizontal: moderateScale(6)}} />
              <CardLoader cardWidth={10} height={10} />
              <View style={{marginHorizontal: moderateScale(6)}} />
              <CardLoader cardWidth={10} height={10} />
            </View>
            <CardLoader cardWidth={80} height={10} />
            <CardLoader cardWidth={60} height={10} />
            <View style={{marginTop: moderateScaleVertical(0)}} />
            <CardLoader cardWidth={'100%'} height={2} />
            <CardLoader cardWidth={40} height={8} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CardLoader cardWidth={60} height={10} />
              <View style={{marginHorizontal: 8}} />
              <CardLoader cardWidth={60} height={10} />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CardLoader cardWidth={60} height={10} />
              <View style={{marginHorizontal: 8}} />
              <CardLoader cardWidth={60} height={10} />
            </View>
            <CardLoader cardWidth={40} height={8} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CardLoader cardWidth={60} height={10} />
              <View style={{marginHorizontal: 8}} />
              <CardLoader cardWidth={60} height={10} />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CardLoader cardWidth={60} height={10} />
              <View style={{marginHorizontal: 8}} />
              <CardLoader cardWidth={60} height={10} />
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: moderateScale(16),
            paddingBottom: moderateScaleVertical(10),
          }}>
          <View style={{flex: 0.25}}>
            <CardLoader cardWidth={'100%'} height={38} />
          </View>
          <View style={{marginHorizontal: moderateScale(8)}} />
          <View style={{flex: 0.75}}>
            {/* <View style={{ marginHorizontal: 8 }} /> */}
            <CardLoader cardWidth={'100%'} height={38} />
          </View>
        </View>
      </View>
    );
  };

  const productIncrDecreamentForCart = (type) => {
    if (type == 2) {
      if (productQuantityForCart <= 1) {
        onClose();
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

  const _selectedCleaingmaterial = (item) => {
    updateState({
      selectedCleaningmaterial: item,
    });
  };

  const onDayPress = (date, item, index) => {
    console.log(date, item, index, 'date, item, index');

    const selectedCalendarDate = date;

    console.log(selectedCalendarDate.format('YYYY-MM-DD'), 'inxinxinxinx');

    let newInsrtedIndexItemArr = scheduleItemDateList;
    newInsrtedIndexItemArr[index].selectedDate =
      selectedCalendarDate.format('YYYY-MM-DD');

    updateState({
      scheduleItemDateList: newInsrtedIndexItemArr,
    });
    if (
      selectedDate &&
      selectedDate == selectedCalendarDate.format('MM/DD/YYYY')
    ) {
      updateState({
        selectedDate: null,
        calendarMarkedDates: {},
      });
    } else {
      updateState({selectedDate: selectedCalendarDate.format('MM/DD/YYYY')});

      const selectedCalendarDateString =
        selectedCalendarDate.format('YYYY-MM-DD');

      updateState(
        {
          calendarMarkedDates: {
            [date.dateString]: {
              selected: true,
            },
          },
          ratesInventoryDataArray: [], // reset inventory data
          selectedCalendarDateString,
          selectedCalendarMonthString: selectedCalendarDateString,
        },
        () => {
          console.log('calendarMarkedDates', calendarMarkedDates);
          console.log(
            'selectedCalendarMonthString',
            selectedCalendarMonthString,
          );
          console.log(
            'selectedCalendarMonthString',
            selectedCalendarMonthString,
          );
          // this.getMatchsForEvent()
        },
      );
    }
  };

  const showAddonsAndSehedule = () => {};
  const dateSelected = (item, index, i, inx) => {
    if (i?.selectedDate == null) {
      Toast.show(strings.PLEASE_SELECT_DATE_FIRST);
    } else {
      let newInsrtedIndexItemArr = scheduleItemDateList;
      newInsrtedIndexItemArr[inx].horizontalindex = index;
      newInsrtedIndexItemArr[inx].selectedTime = item?.selectedTime;

      const userSelectedDateTime = `${newInsrtedIndexItemArr[inx].selectedDate} ${newInsrtedIndexItemArr[inx].selectedTime}`;
      const ProductId = newInsrtedIndexItemArr[inx].id;

      updateState({
        scheduleItemDateList: newInsrtedIndexItemArr,
      });
      productShedule(userSelectedDateTime, ProductId);
    }
  };

  const renderCardComponentSecond = (item, index, i, inx) => {
    console.log(
      i?.selectedTime,
      item?.selectedTime,
      'i?.selectedTime == item?.selectedTime',
    );
    return (
      <TouchableOpacity
        onPress={() => dateSelected(item, index, i, inx)}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: moderateScale(15),
          paddingHorizontal: moderateScale(10),

          height: moderateScale(30),
          backgroundColor:
            i.horizontalindex === index || i?.selectedTime == item?.selectedTime
              ? themeColors.primary_color
              : colors.grey2,
        }}>
        <Text
          style={[
            styles.value,
            {
              color:
                i.horizontalindex === index ||
                i?.selectedTime == item?.selectedTime
                  ? colors.white
                  : colors.textGrey,
              fontSize: textScale(14),
            },
          ]}>
          {/* {this.formatDate(item)} */}
          {item.time}
        </Text>
      </TouchableOpacity>
    );
  };

  const showScheduleCalenderView = (item, index) => {
    return (
      <CalanderStrip
        scrollable
        highlightDateContainerStyle={{
          backgroundColor: themeColors.primary_color,
        }}
        highlightDateNameStyle={{
          color: colors.white,
        }}
        highlightDateNumberStyle={{
          color: colors.white,
        }}
        dateNameStyle={{
          color: colors.black,
        }}
        dateNumberStyle={{
          color: colors.black,
        }}
        useIsoWeekday={false}
        minDate={new Date()}
        onDateSelected={(date) => onDayPress(date, item, index)}
        style={{
          height: moderateScaleVertical(100),
          backgroundColor: colors.WHITE,
          paddingVertical: 12,
        }}
        selectedDate={item?.selectedDate || undefined}
      />
    );
  };

  const showScheduleTimeView = (i, inx) => {
    return (
      <View>
        {timeforMarkedQuestion && timeforMarkedQuestion.length ? (
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 10,
              borderRadius: 8,
              backgroundColor: colors.white,
              paddingVertical: moderateScale(10),
            }}>
            <View style={{marginBottom: moderateScale(12)}}>
              <Text style={{fontSize: textScale(14)}}>
                {strings.WHAT_TIME_WOULD_YOU_LIKE_US_TO_START}
              </Text>
            </View>
            <FlatList
              keyExtractor={(item, index) => String(index)}
              extraData={[timeMarkedQuestion, scheduleItemDateList]}
              data={timeMarkedQuestion[inx]}
              renderItem={({item, index}) =>
                renderCardComponentSecond(item, index, i, inx)
              }
              // ref={(ref) => (this.timingRef = ref)}
              removeClippedSubviews={false}
              enableEmptySections={false}
              initialNumToRender={5}
              // initialNumToRender={this.state?.timings?.length||10}
              ItemSeparatorComponent={() => {
                return <View style={{marginHorizontal: moderateScale(10)}} />;
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              // ListFooterComponent={() => { return <View style={{ height: 200 }} /> }}
            />
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <Modal
      transparent={false}
      isVisible={isVisible}
      animationType={'none'}
      style={styles.modalContainer}
      onLayout={(event) => {
        updateState({viewHeight: event.nativeEvent.layout.height});
      }}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Image source={imagePath.crossC} />
      </TouchableOpacity>
      {showShimmer ? (
        shimmerShow()
      ) : (
        <Animatable.View style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            // onScroll={onScroll}
            style={{
              ...styles.modalMainViewContainer,
              backgroundColor: isDarkMode
                ? MyDarkTheme?.colors?.background
                : '#fff',
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                // marginTop: moderateScaleVertical(-20),
              }}>
              <Banner
                bannerRef={bannerRef}
                bannerData={productDetailData?.product_media}
                sliderWidth={width}
                itemWidth={width}
                pagination={false}
                setActiveState={(index) =>
                  updateState({slider1ActiveSlide: index})
                }
                showLightbox={true}
                cardViewStyle={styles.cardViewStyle}
                resizeMode="contain"
              />
              <View style={{paddingTop: 5}}>
                <Pagination
                  dotsLength={productDetailData?.product_media?.length}
                  activeDotIndex={state.slider1ActiveSlide}
                  dotColor={'grey'}
                  dotStyle={[styles.dotStyle]}
                  inactiveDotColor={'black'}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.8}
                />
              </View>
            </View>
            <Animatable.View
              delay={1}
              animation="fadeInUp"
              style={styles.mainView}>
              <View>
                <Text
                  numberOfLines={1}
                  style={{
                    ...styles.productName,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    fontFamily: fontFamily.bold,
                  }}>
                  {productdetail?.translation[0]?.title}
                </Text>
                <Text
                  style={{
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.blackOpacity40,
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(9),
                    textAlign: 'left',
                    marginBottom: moderateScaleVertical(4),
                    marginTop: moderateScaleVertical(6),
                  }}>
                  {strings.IN}{' '}
                  {productdetail?.translation[0]?.title
                    ? productdetail?.translation[0]?.title
                    : productdetail?.category?.category_detail?.translation[0]
                        ?.name}
                </Text>

                {/* rating View */}
                {productDetailData?.averageRating !== null && (
                  <View
                    style={{
                      borderWidth: 0.5,
                      alignSelf: 'flex-start',
                      padding: 2,
                      borderRadius: 2,
                      marginVertical: moderateScaleVertical(4),
                      borderColor: colors.yellowB,
                      backgroundColor: colors.yellowOpacity10,
                    }}>
                    <StarRating
                      disabled={false}
                      maxStars={5}
                      rating={Number(productDetailData?.averageRating).toFixed(
                        1,
                      )}
                      fullStarColor={colors.yellowB}
                      starSize={8}
                      containerStyle={{width: width / 9}}
                    />
                  </View>
                )}
              </View>

              {productdetail?.translation[0]?.body_html != null && (
                <View>
                  <RenderHTML
                    contentWidth={width}
                    source={{html: productdetail?.translation[0]?.body_html}}
                    tagsStyles={{
                      p: {
                        color: isDarkMode ? colors.white : colors.textGreyB,
                      },
                    }}
                  />

                  <View style={{marginBottom: 10}} />
                </View>
              )}

              <View
                style={{
                  ...commonStyles.headerTopLine,
                }}
              />
              {timeModalVisable ? (
                <FlatList
                  extraData={[scheduleItemDateList]}
                  data={scheduleItemDateList}
                  renderItem={_renderScheduleDateList}
                  ItemSeparatorComponent={() => (
                    <View style={{height: moderateScaleVertical(20)}} />
                  )}
                />
              ) : (
                <View>
                  {(!!addonSet && addonSet?.length) ||
                  (mode_of_service == null && mode_of_service == undefined)
                    ? showhomeServiceAddons()
                    : null}

                  {!!variantSet && variantSet?.length
                    ? showAllVariants()
                    : null}
                </View>
              )}
            </Animatable.View>
            {showErrorMessageTitle ? (
              <Text
                style={{
                  fontSize: textScale(14),
                  marginHorizontal: moderateScale(20),
                  color: colors.redB,
                  fontFamily: fontFamily.medium,
                  marginBottom: moderateScaleVertical(20),
                }}>
                {strings.NOVARIANTPRODUCTAVAILABLE}
              </Text>
            ) : null}

            {/* <Text
              style={{
                fontSize: textScale(14),
                marginHorizontal: moderateScale(20),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                fontFamily: fontFamily.regular,
              }}>
              Do you have any cleaning instructions ?
            </Text>
            <TextInput
              placeholder={'enter instructions here'}
              multiline={true}
              value={inputInstructionText}
              textAlignVertical={'top'}
              style={[
                styles.textInputStyle,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
              ]}
              placeholderTextColor={colors.greyLight}
              onChangeText={(text) => updateState({inputInstructionText: text})}
            /> */}
          </ScrollView>

          {!showErrorMessageTitle && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',

                paddingBottom: moderateScaleVertical(16),
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : '#fff',
              }}>
              <View style={{flex: 0.75}}>
                <GradientButton
                  indicator={btnLoader}
                  indicatorColor={colors.white}
                  colorsArray={[
                    themeColors.primary_color,
                    themeColors.primary_color,
                  ]}
                  textStyle={{
                    fontFamily: fontFamily.medium,
                    textTransform: 'capitalize',
                  }}
                  onPress={() =>
                    timeModalVisable
                      ? addTimeDate(selectedTime, selectedDate)
                      : addItemCart(addonSet)
                  }
                  btnText={
                    timeModalVisable
                      ? strings.ADD_ITEM
                      : mode_of_service === 'schedule'
                      ? 'Countinue'
                      : strings.ADD_ITEM
                  }
                  btnStyle={{
                    borderRadius: moderateScale(4),
                    height: moderateScale(38),
                  }}
                />
              </View>
            </View>
          )}
        </Animatable.View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  productName: {
    color: colors.textGrey,
    fontSize: textScale(18),
    lineHeight: 28,
    fontFamily: fontFamily.medium,
  },
  description: {
    color: colors.textGreyB,
    fontSize: textScale(14),
    lineHeight: 22,
    fontFamily: fontFamily.medium,
  },
  relatedProducts: {
    color: colors.textGrey,
    fontSize: textScale(18),
    lineHeight: 28,
    fontFamily: fontFamily.medium,
    marginVertical: moderateScaleVertical(10),
  },

  variantLable: {
    color: colors.textGrey,
    fontSize: textScale(12),
    // lineHeight: 22,
    fontFamily: fontFamily.medium,
  },

  modalMainViewContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // overflow: 'hidden',
    // paddingHorizontal: moderateScale(24),
  },
  modalContainer: {
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: moderateScaleVertical(height / 10),
    overflow: 'hidden',
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: moderateScaleVertical(10),
  },
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  cardView: {
    height: height / 3.8,
    width: width,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  productName: {
    color: colors.textGrey,
    fontSize: textScale(14),
    // lineHeight: 28,
    fontFamily: fontFamily.regular,
  },
  mainView: {
    marginVertical: moderateScaleVertical(15),
    paddingHorizontal: moderateScale(12),
  },
  description: {
    color: colors.textGreyB,
    fontSize: textScale(14),
    lineHeight: 22,
    fontFamily: fontFamily.regular,
    textAlign: 'left',
  },
  variantValue: {
    color: colors.black,
    fontSize: textScale(10),
    lineHeight: 22,
    fontFamily: fontFamily.regular,
    paddingRight: moderateScale(4),
  },

  chooseOption: {
    marginBottom: moderateScale(2),
    color: colors.textGreyF,
    fontSize: textScale(9),
    lineHeight: 22,
    fontFamily: fontFamily.regular,
  },
  incDecBtnStyle: {
    borderWidth: 0.4,
    borderRadius: moderateScale(4),
    height: moderateScale(38),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(12),
  },
  variantSizeViewOne: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(30 / 2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantSizeViewTwo: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(40 / 2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardViewStyle: {
    alignItems: 'center',
    height: width * 0.7,
    width: width - 25,
  },
  dotStyle: {height: 12, width: 12, borderRadius: 12 / 2},
  ratingColor: {
    color: colors.backgroundGrey,
    paddingLeft: 5,
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
  },
  textInputStyle: {
    opacity: 0.7,
    color: colors.black,
    fontFamily: fontFamily.semiBold,
    fontSize: textScale(14),
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 0,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    marginHorizontal: moderateScale(20),
    borderColor: colors.textGreyLight,
    borderWidth: 0.5,
    height: moderateScaleVertical(width / 3.5),
    borderRadius: moderateScale(4),
    marginVertical: moderateScale(10),
  },
});
export default React.memo(HomeServiceVariantAddons);
