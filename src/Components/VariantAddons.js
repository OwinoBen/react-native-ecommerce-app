import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep, isEmpty} from 'lodash';
import moment from 'moment';
import React, {useEffect, useRef, useState, Fragment} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DatePicker from 'react-native-date-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import {Pagination} from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import Banner from '../Components/Banner';
import GradientButton from '../Components/GradientButton';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import commonStylesFun, {hitSlopProp} from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {
  addRemoveMinutes,
  getHourAndMinutes,
  tokenConverterPlusCurrencyNumberFormater,
} from '../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  hapticEffects,
  playHapticEffect,
} from '../utils/helperFunctions';
import BannerLoader from './Loaders/BannerLoader';
import HeaderLoader from './Loaders/HeaderLoader';
import { Calendar, CalendarList } from 'react-native-calendars';
import { ScrollView } from 'react-native-gesture-handler';
import BorderTextInputWithLable from './BorderTextInputWithLable';
import Reccuring from './Reccuring';

const VariantAddons = ({
  productdetail = null,
  isVisible = false,
  showShimmer,
  shimmerClose = () => {},
  slider1ActiveSlide = 0,
  productDetailData = null,
  variantSet = [],
  addonSet = [],
  productTotalQuantity = 0,
  showErrorMessageTitle = false,
  typeId = null,
  selectedVariant = null,
  isProductImageLargeViewVisible = false,
  isLoadingC = false,
  updateState = () => {},
  startDateRental = new Date(),
  endDateRental = new Date(),
  isRentalStartDatePicker = false,
  isRentalEndDatePicker = false,
  rentalProductDuration = null,
  isVarientSelectLoading = false,
  productDetailNew = {},
  isProductAvailable = false,

  planValues = ["Daily", "Weekly", "Custom", "Alternate Days"],
  weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  quickSelection = ["Weekdays", "Weekends"],
  showCalendar = false,
  reccuringCheckBox = false,
  selectedPlanValues = '',
  selectedWeekDaysValues = [],
  selectedQuickSelectionValue = '',
  minimumDate = moment(new Date()).add('days', 2).format("YYYY-MM-DD"),
  initDate = new Date(),
  start = {},
  end = {},
  period = {},
  disabledDaysIndexes = [],
  selectedDaysIndexes = [],
  date = new Date(),
  showDateTimeModal = false,
  slectedDate = new Date(),
  updateAddonState = () => { },
}) => {
  console.log("productDetailNew =>", productDetailNew,"\n productDetailData =>", productDetailData, "\n endDateRental =>",endDateRental);
  const {appData, themeColors, currencies, languages, appStyle, themeColor} =
    useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;
  const isDarkMode = themeColor;
  const buttonTextColor = themeColors;
  const commonStyles = commonStylesFun({fontFamily, buttonTextColor});
  console.log(productdetail,"productdetailproductdetailproductdetailproductdetail");
  const resetVariantState = () => {
    updateAddonState({
      planValues: ["Daily", "Weekly","Alternate Days", "Custom"],
      weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      quickSelection: ["Weekdays", "Weekends"],
      showCalendar: false,
      selectedPlanValues: '',
      selectedWeekDaysValues: [],
      selectedQuickSelectionValue: '',
      minimumDate: moment(new Date()).add(2, 'days').format("YYYY-MM-DD"),
      initDate: new Date(),
      start: {},
      end: {},
      period: {},
      disabledDaysIndexes: [],
      selectedDaysIndexes: [],
      date: new Date(),
      showDateTimeModal: false,
      slectedDate: new Date(),
    })
  }

  useFocusEffect(
    React.useCallback(() => {
      if (variantSet.length) {
        let variantSetData = variantSet
          .map((i, inx) => {
            let find = i.options.filter((x) => x.value);
            if (find.length) {
              return {
                variant_id: find[0]?.variant_id,
                optionId: find[0]?.id,
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

  const getProductDetailBasedOnFilter = (variantSetData) => {
    console.log('api hit getProductDetailBasedOnFilter', variantSetData);
    let data = {};
    data['variants'] = variantSetData?.map((i) => i.variant_id);
    data['options'] = variantSetData?.map((i) => i.optionId);
    actions
      .getProductDetailByVariants(`/${productDetailData.sku}`, data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        console.log(res.data, 'res.data by vendor id ');
        updateState({
          productDetailNew: res?.data,
          productPriceData: {
            multiplier: res?.data?.multiplier,
            price: res?.data?.price,
          },
          productSku: res?.data?.sku,
          productVariantId: res?.data?.id,
          showErrorMessageTitle: false,
          selectedVariant: null,
          isVarientSelectLoading: false,
        });
      })
      .catch((error) => console.log(error, 'errrorrrr'));
  };

  useEffect(() => {
    getProductDetail();
  }, []);
  useEffect(() => {
    if (!isEmpty(productDetailNew)) {
      checkProductAvailibility();
    }
  }, [productDetailNew]);

  const getProductDetail = () => {
    console.log('api hit getProductDetail');
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
        console.log(res?.data, 'res.data++ prodcut detail');
        updateState({
          productDetailData: res?.data?.products,
          relatedProducts: res?.data?.relatedProducts,
          productPriceData: res?.data?.products?.variant[0],
          addonSet: res?.data?.products?.add_on,
          venderDetail: res?.data?.products?.vendor,
          productTotalQuantity: res?.data?.products?.variant[0]?.quantity,
          productVariantId: res?.data?.products?.variant[0]?.id,
          productSku: res?.data?.products?.sku,
          variantSet: res?.data?.products?.variant_set,
          typeId: res?.data?.products?.category?.category_detail?.type_id,
          isLoadingC: false,
          selectedVariant: null,
          productQuantityForCart: !!res.data.products?.minimum_order_count
            ? Number(res.data.products?.minimum_order_count)
            : 1,
          rentalProductDuration:
            Number(res?.data?.products?.minimum_duration) * 60 +
            Number(res?.data?.products?.minimum_duration_min),
          endDateRental: addRemoveMinutes(
            Number(res?.data?.products?.minimum_duration) * 60 +
              Number(res?.data?.products?.minimum_duration_min),
          ),
          startDateRental: new Date(),
        });
        shimmerClose(false);
      })
      .catch((error) => {
        console.log('error raised', error);
        updateState({
          selectedVariant: null,
          isLoadingC: false,
        });
      });
  };

  const checkProductAvailibility = () => {
    actions
      .checkProductAvailibility(
        {
          selectedStartDate: String(
            moment(startDateRental).format('YYYY-MM-DD hh:mm:ss'),
          ),
          selectEndDate: String(
            moment(endDateRental).format('YYYY-MM-DD hh:mm:ss'),
          ),
          variant_option_id: productDetailNew && productDetailNew?.set?.length && productDetailNew?.set[0]?.variant_option_id,
          product_id: productDetailNew?.product?.id,
        },
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        updateState({
          isProductAvailable: true,
        });
      })
      .catch((err) => {
        updateState({
          isProductAvailable: false,
        });
      });
  };

  const selectSpecificOptionsForAddions = (options, i, inx) => {
    let newArray = cloneDeep(options);
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

  const checkBoxButtonViewAddons = ({setoptions}) => {
    return (
      <View>
        {setoptions.map((i, inx) => {
          return (
            <TouchableOpacity
              hitSlop={hitSlopProp}
              key={inx}
              activeOpacity={1}
              onPress={() => {
                playHapticEffect(hapticEffects.rigid);
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
                  style={{
                    ...styles.variantValue,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
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
                    Number(i?.price),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}
                </Text>
                <View style={{paddingLeft: moderateScale(5)}}>
                  <Image
                    style={{tintColor: themeColors.primary_color}}
                    source={
                      i?.value
                        ? imagePath.checkBox2Active
                        : imagePath.checkBox2InActive
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
                  }}>
                  {i?.title}
                </Text>

                <Text
                  style={{
                    ...styles.chooseOption,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.grayOpacity51,
                    fontSize: textScale(10),
                  }}>
                  {`${strings.MIN} ${i?.min_select} ${strings.AND_MAX} ${i?.max_select} ${strings.SELECTION_ALLOWED}`}
                </Text>

                {!!i.errorShow && (
                  <Text
                    style={{
                      color: colors.redColor,
                      fontSize: textScale(8),
                      fontFamily: fontFamily.medium,
                      textAlign: 'left',
                    }}>
                    {`${strings.MIN} ${i?.min_select} ${strings.REQUIRED}`}
                  </Text>
                )}

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

  const selectSpecificOptions = (options, i) => {
    let newArray = cloneDeep(options);
    let modifyVariants = variantSet.map((vi, vnx) => {
      if (vi.variant_type_id == i.variant_id) {
        return {
          ...vi,
          options: newArray.map((j, jnx) => {
            if (j.id == i.id) {
              return {
                ...j,
                value: true,
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
    updateState({
      variantSet: modifyVariants,
      selectedOption: i,
    });
  };

  const onSelect = () => {
    if (variantSet.length) {
      let variantSetData = variantSet
        .map((i, inx) => {
          let find = i.options.filter((x) => x.value);
          if (find.length) {
            return {
              variant_id: find[0]?.variant_id,
              optionId: find[0]?.id,
            };
          }
        })
        .filter((x) => x != undefined);
      if (variantSetData.length) {
        updateState({isVarientSelectLoading: true});
        getProductDetailBasedOnFilter(variantSetData);
      } else {
        getProductDetail();
      }
    }
  };

  const onDateChange = (val) => {
    isRentalEndDatePicker
      ? updateState({
          endDateRental: val,
        })
      : updateState({
          startDateRental: val,
          endDateRental: addRemoveMinutes(
            Number(productDetailData?.minimum_duration) * 60 +
              Number(productDetailData?.minimum_duration_min),
            val,
          ),
          rentalProductDuration:
            Number(productDetailData?.minimum_duration * 60) +
            Number(productDetailData?.minimum_duration_min),
        });
  };

  const addRemoveDuration = (key) => {
    if (key == 1) {
      updateState({
        rentalProductDuration:
          rentalProductDuration +
          Number(productDetailData?.additional_increments) * 60 +
          Number(productDetailData?.additional_increments_min),
        endDateRental: addRemoveMinutes(
          Number(productDetailData?.additional_increments) * 60 +
            Number(productDetailData?.additional_increments_min),
          endDateRental,
        ),
      });
      checkProductAvailibility();
    } else {
      if (
        Number(rentalProductDuration) !=
        Number(productDetailData.minimum_duration) * 60 +
          Number(productDetailData.minimum_duration_min)
      ) {
        updateState({
          rentalProductDuration:
            rentalProductDuration -
            (Number(productDetailData?.additional_increments) * 60 +
              Number(productDetailData?.additional_increments_min)),
          endDateRental: addRemoveMinutes(
            Number(productDetailData?.additional_increments) * 60 +
              Number(productDetailData?.additional_increments_min),
            endDateRental,
            '-',
          ),
        });
      }
    }
  };

  const variantSetValue = (item) => {
    const {options, type, variant_type_id} = item;
    if (type == 1) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => updateState({selectedVariant: item})}
            style={{
              ...styles.dropDownStyle,
              backgroundColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.blackOpacity05,
            }}>
            <Text
              style={{
                fontSize: moderateScale(12),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {options.filter((val) => {
                if (val?.value) {
                  return val;
                }
              })[0]?.title || strings.SELECT + ' ' + item?.title}
            </Text>

            <Image source={imagePath.dropDownSingle} />
          </TouchableOpacity>
          {selectedVariant?.variant_type_id == variant_type_id
            ? radioButtonView(options)
            : null}

          {!isEmpty(
            options.filter((val) => {
              if (val?.value) {
                return val;
              }
            }),
          ) && typeId == 10 ? (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: moderateScaleVertical(10),
                }}>
                <TouchableOpacity
                  onPress={() => updateState({isRentalStartDatePicker: true})}>
                  <Text
                    style={{
                      fontSize: moderateScale(13),
                      fontFamily: fontFamily.bold,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {strings.START_DATE}
                  </Text>
                  <Text
                    style={{
                      fontSize: moderateScale(12),
                      fontFamily: fontFamily.regular,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {!!startDateRental
                      ? moment(startDateRental).format('MM/DD/YY hh:mm A')
                      : ''}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateState({isRentalEndDatePicker: true})}>
                  <Text
                    style={{
                      fontSize: moderateScale(13),
                      fontFamily: fontFamily.bold,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {strings.END_DATE}
                  </Text>
                  <Text
                    style={{
                      fontSize: moderateScale(12),
                      fontFamily: fontFamily.regular,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                    }}>
                    {!!endDateRental
                      ? moment(endDateRental).format('MM/DD/YY hh:mm A')
                      : ''}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: moderateScale(13),
                  fontFamily: fontFamily.bold,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.DURATION}:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  marginVertical: 5,
                }}>
                <TouchableOpacity
                  onPress={() => addRemoveDuration(2)}
                  style={{
                    borderRightWidth: 1,
                    flex: 0.3,
                    alignItems: 'center',
                    padding: 5,
                  }}>
                  <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 0.4,
                    textAlign: 'center',
                    fontSize: moderateScale(13),
                    fontFamily: fontFamily.regular,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {getHourAndMinutes(rentalProductDuration)}
                </Text>
                <TouchableOpacity
                  onPress={() => addRemoveDuration(1)}
                  style={{
                    borderLeftWidth: 1,
                    flex: 0.3,
                    alignItems: 'center',
                    padding: 5,
                  }}>
                  <Text> {'>'} </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: moderateScale(13),
                  fontFamily: fontFamily.regular,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {' '}
                  {tokenConverterPlusCurrencyNumberFormater(
                    productDetailNew?.actual_price,
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}
                </Text>{' '}
                {strings.FOR_FIRST}{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {productDetailNew?.product?.minimum_duration}
                </Text>{' '}
                {strings.HOUR}{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {productDetailNew?.product?.minimum_duration_min}
                </Text>{' '}
                {strings.MIN}
              </Text>
              <Text
                style={{
                  fontSize: moderateScale(13),
                  fontFamily: fontFamily.regular,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {strings.EXTRA_DURATION_CHARGES}{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {tokenConverterPlusCurrencyNumberFormater(
                    productDetailNew?.incremental_price,
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}
                </Text>{' '}
                {strings.PER}{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {productDetailNew?.product?.additional_increments}
                </Text>{' '}
                {strings.HOUR}{' '}
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                  }}>
                  {' '}
                  {productDetailNew?.product?.additional_increments_min}
                </Text>{' '}
                {strings.MIN}
              </Text>
            </View>
          ) : null}
          <Modal
            key={'4'}
            isVisible={isRentalStartDatePicker || isRentalEndDatePicker}
            style={{
              margin: 0,
              justifyContent: 'flex-end',
            }}
            onBackdropPress={() =>
              updateState({
                isRentalStartDatePicker: false,
                isRentalEndDatePicker: false,
              })
            }>
            <View
              style={{
                ...styles.modalView,
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.background
                  : colors.white,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    updateState({
                      isRentalStartDatePicker: false,
                      isRentalEndDatePicker: false,
                    })
                  }>
                  <Image source={imagePath.closeButton} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  ...styles.horizontalLine,
                  borderBottomColor: isDarkMode
                    ? colors.whiteOpacity22
                    : colors.lightGreyBg,
                }}
              />

              <DatePicker
                locale={languages?.primary_language?.sort_code}
                date={isRentalStartDatePicker ? startDateRental : endDateRental}
                textColor={isDarkMode ? colors.white : colors.blackB}
                mode="datetime"
                minimumDate={new Date()}
                onDateChange={(value) => onDateChange(value)}
              />
            </View>
          </Modal>
        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => updateState({selectedVariant: item})}
          style={{
            ...styles.dropDownStyle,
            backgroundColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.blackOpacity05,
          }}>
          <Text
            style={{
              fontSize: moderateScale(12),
              fontFamily: fontFamily.medium,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {options.filter((val) => {
              if (val?.value) {
                return val;
              }
            })[0]?.title || strings.SELECT + ' ' + item?.title}
          </Text>
          <Image source={imagePath.dropDownSingle} />
        </TouchableOpacity>

        {selectedVariant?.variant_type_id == variant_type_id
          ? circularView(options)
          : null}
      </View>
    );
  };

  const radioButtonView = (options) => {
    return (
      <Modal
        key={'1'}
        isVisible
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({selectedVariant: null})}>
        <View
          style={{
            ...styles.modalView,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: moderateScale(18),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.SELECT} {selectedVariant?.title}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => updateState({selectedVariant: null})}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.horizontalLine,
              borderBottomColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((i, inx) => {
              return (
                <TouchableOpacity
                  hitSlop={hitSlopProp}
                  key={inx}
                  // disabled={options && options.length == 1 ? true : false}
                  onPress={() => selectSpecificOptions(options, i, inx)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // marginRight: moderateScale(16),
                    marginBottom: moderateScaleVertical(10),
                  }}>
                  <Image
                    source={
                      i?.value
                        ? imagePath.icActiveRadio
                        : imagePath.icInActiveRadio
                    }
                    style={{
                      tintColor: themeColors.primary_color,
                      marginRight: moderateScale(16),
                    }}
                  />
                  <Text
                    style={{
                      ...styles.variantValue,
                      color: i?.value
                        ? themeColors.primary_color
                        : isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.blackOpacity43,
                      fontSize: textScale(14),
                      fontFamily: i.value
                        ? fontFamily.bold
                        : fontFamily.regular,
                    }}>
                    {i?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <GradientButton
            indicator={isVarientSelectLoading}
            indicatorColor={colors.white}
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{
              fontFamily: fontFamily.medium,
              textTransform: 'capitalize',
              color: colors.white,
            }}
            onPress={onSelect}
            btnText={strings.SELECT}
            btnStyle={{
              borderRadius: moderateScale(4),
              height: moderateScale(38),
            }}
          />
        </View>
      </Modal>
    );
  };

  const circularView = (options) => {
    return (
      <Modal
        key={'2'}
        isVisible
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({selectedVariant: null})}>
        <View
          style={{
            ...styles.modalView,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: moderateScale(18),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.SELECT} {selectedVariant?.title}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => updateState({selectedVariant: null})}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...styles.horizontalLine,
              borderBottomColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.lightGreyBg,
            }}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((i, inx) => {
              return (
                <TouchableOpacity
                  hitSlop={hitSlopProp}
                  key={inx}
                  // disabled={options && options.length == 1 ? true : false}
                  onPress={() => selectSpecificOptions(options, i, inx)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: moderateScale(5),
                    marginBottom: moderateScaleVertical(10),
                  }}
                  activeOpacity={0.8}>
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
                  <Text
                    style={{
                      ...styles.variantValue,
                      color: i?.value
                        ? themeColors.primary_color
                        : isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.blackOpacity43,
                      fontSize: textScale(14),
                      fontFamily: i.value
                        ? fontFamily.bold
                        : fontFamily.regular,
                      marginLeft: moderateScale(8),
                    }}>
                    {i?.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <GradientButton
            indicator={isLoadingC}
            indicatorColor={colors.white}
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{
              fontFamily: fontFamily.medium,
              textTransform: 'capitalize',
              color: colors.white,
            }}
            onPress={onSelect}
            btnText={strings.SELECT}
            btnStyle={{
              borderRadius: moderateScale(4),
              height: moderateScale(38),
            }}
          />
        </View>
      </Modal>
    );
  };

  const {bannerRef} = useRef();

  const renderVariantSet = ({item, index}) => {
    return (
      <View
        key={String(index)}
        style={{
          flex: 1,
          marginRight: moderateScale(8),
        }}>
        <Text
          style={{
            ...styles.variantLable,
            marginBottom: moderateScale(5),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>{`${item?.title}`}</Text>
        {item?.options ? variantSetValue(item) : null}
      </View>
    );
  };

  const showAllVariants = () => {
    let variantSetData = cloneDeep(variantSet);
    return (
      <View
        style={{
          marginVertical: moderateScaleVertical(12),
          paddingHorizontal: moderateScale(0),
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          numColumns={2}
          data={!!variantSetData ? variantSetData : []}
          renderItem={renderVariantSet}
          keyExtractor={(item) => item?.variant_type_id.toString()}
        />
      </View>
    );
  };

  var totalProductQty = 0;
  if (!!productdetail?.check_if_in_cart_app) {
    productdetail?.check_if_in_cart_app.map((val) => {
      totalProductQty = totalProductQty + val.quantity;
    });
  }

  const shimmerShow = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
          borderTopLeftRadius: 0,
          borderTopStartRadius: 0,
        }}>
        <BannerLoader
          isBannerDots
          homeLoaderWidth={width}
          homeLoaderHeight={moderateScaleVertical(190)}
          viewStyles={{
            marginHorizontal: 0,
          }}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(80)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(80)}
          rectHeightLeft={moderateScaleVertical(10)}
          rx={5}
          ry={5}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(60)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(60)}
          rectHeightLeft={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width - moderateScale(30)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={width - moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(12)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={width}
          heightLeft={moderateScaleVertical(2)}
          rectWidthLeft={width}
          rectHeightLeft={moderateScaleVertical(2)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(12)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          heightLeft={moderateScaleVertical(7)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(7)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          widthLeft={moderateScale(60)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(60)}
          rectHeightLeft={moderateScaleVertical(10)}
          widthRight={moderateScale(60)}
          heightRight={moderateScaleVertical(10)}
          rectWidthRight={moderateScale(60)}
          rectHeightRight={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          widthLeft={moderateScale(60)}
          heightLeft={moderateScaleVertical(10)}
          rectWidthLeft={moderateScale(60)}
          rectHeightLeft={moderateScaleVertical(10)}
          widthRight={moderateScale(60)}
          heightRight={moderateScaleVertical(10)}
          rectWidthRight={moderateScale(60)}
          rectHeightRight={moderateScaleVertical(10)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          heightLeft={moderateScaleVertical(7)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(7)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />
        <HeaderLoader
          isRight={false}
          widthLeft={moderateScale(30)}
          heightLeft={moderateScaleVertical(7)}
          rectWidthLeft={moderateScale(30)}
          rectHeightLeft={moderateScaleVertical(7)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(8)}}
        />

        <HeaderLoader
          isRight={false}
          widthLeft={width}
          heightLeft={moderateScaleVertical(2)}
          rectWidthLeft={width}
          rectHeightLeft={moderateScaleVertical(2)}
          rx={5}
          ry={5}
          viewStyles={{marginTop: moderateScaleVertical(15)}}
        />
        <HeaderLoader
          widthLeft={moderateScale(80)}
          heightLeft={moderateScaleVertical(30)}
          rectWidthLeft={moderateScale(80)}
          rectHeightLeft={moderateScaleVertical(30)}
          widthRight={width - moderateScale(130)}
          heightRight={moderateScaleVertical(30)}
          rectWidthRight={width - moderateScale(130)}
          rectHeightRight={moderateScaleVertical(30)}
          rx={5}
          ry={5}
          viewStyles={{
            marginTop: 'auto',
            marginBottom: moderateScaleVertical(25),
          }}
        />
      </View>
    );
  };

  const allImagesArrayForZoom = [];
  productDetailData?.product_media
    ? productDetailData?.product_media?.map((item, index) => {
        return (allImagesArrayForZoom[index] = {
          url: getImageUrl(
            item?.image.path.image_fit,
            item?.image.path.image_path,
            '1000/1000',
          ),
        });
      })
    : getImageUrl(
        productDetailData?.product_media[0]?.image?.path?.image_fit,
        productDetailData?.product_media[0]?.image?.path?.image_path,
        '1000/1000',
      );

  const renderImageZoomingView = () => {
    return (
      <View
        style={{
          height: moderateScaleVertical(height),
          width: moderateScale(width),
        }}>
        <ImageViewer
          renderHeader={() => <View style={{backgroundColor: 'red'}}></View>}
          renderIndicator={(currentIndex, allSize) => (
            <View
              style={{
                position: 'absolute',
                top: 100,
                width: width / 2,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() =>
                  updateState({
                    isProductImageLargeViewVisible: false,
                  })
                }>
                <Image
                  style={{
                    tintColor: colors.white,
                    marginHorizontal: moderateScale(20),
                  }}
                  source={imagePath.backArrow}
                />
              </TouchableOpacity>
              <Text style={{color: colors.white}}>
                {currentIndex + '/' + allSize}
              </Text>
            </View>
          )}
          imageUrls={allImagesArrayForZoom}
        />
      </View>
    );
  };
 

  return (
    <View>
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
                ? MyDarkTheme.colors.background
                : '#fff',
              marginHorizontal: moderateScale(10),
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: moderateScale(10),
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
                onPressImage={() =>
                  updateState({
                    isProductImageLargeViewVisible: true,
                  })
                }
              />
              {!isEmpty(productDetailData) ? (
                <View style={{paddingTop: 5}}>
                  <Pagination
                    dotsLength={productDetailData?.product_media?.length}
                    activeDotIndex={slider1ActiveSlide}
                    dotColor={'grey'}
                    dotStyle={[styles.dotStyle]}
                    inactiveDotColor={'black'}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.8}
                  />
                </View>
              ) : null}
            </View>

            <Animatable.View
              delay={1}
              animation="fadeInUp"
              style={styles.mainView}>
              <View>
                {!isEmpty(productdetail) ? (
                  <Text
                    numberOfLines={1}
                    style={{
                      ...styles.productName,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      fontFamily: fontFamily.bold,
                    }}>
                    {productdetail?.translation[0]?.title || ''}
                  </Text>
                ) : null}

                {/* rating View */}
                {!!appData?.profile?.preferences?.rating_check && productDetailData?.averageRating !== null && (
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
                      // disabled={false}
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
              <View style={{justifyContent: 'center'}}>
                {!!typeId && typeId !== 8 && (
                  <Text
                    style={{
                      color:
                        (productTotalQuantity && productTotalQuantity != 0) ||
                        !!productDetailData?.sell_when_out_of_stock
                          ? colors.green
                          : colors.orangeB,
                      fontSize: textScale(10),
                      fontFamily: fontFamily.medium,
                    }}>
                    {(productTotalQuantity && productTotalQuantity != 0) ||
                    !!productDetailData?.sell_when_out_of_stock ||
                    productDetailData?.has_inventory == 0
                      ? ''
                      : strings.OUT_OF_STOCK}
                  </Text>
                )}
              </View>

              {!isEmpty(productdetail) &&
              productdetail?.translation[0]?.body_html != null ? (
                <View>
                  <Text
                    style={{
                      fontSize: textScale(10),
                      fontFamily: fontFamily.regular,
                      lineHeight: moderateScale(14),
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyE,
                      textAlign: 'left',
                    }}>
                    {productdetail?.translation_description}
                  </Text>
                  <View style={{marginBottom: 10}} />
                </View>
              ) : null}

              <View
                style={{
                  ...commonStyles.headerTopLine,
                  marginTop: moderateScaleVertical(8),
                  // marginVertical: moderateScaleVertical(10),
                }}
              />
              {/* ********Addon set View*******  */}
              {!!addonSet && addonSet?.length ? showAllAddons() : null}

              {!!variantSet && variantSet?.length ? showAllVariants() : null}
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
              {!!productdetail?.is_recurring_booking &&
                <View style={[{paddingHorizontal: moderateScale(12), flexDirection: 'row', alignItems: 'center' }]}>
                  <Text
                    style={[
                      styles.variantValue,
                      {
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        fontSize: textScale(12),
                      },
                    ]}>
                    Reccuring
                  </Text>
                  <TouchableOpacity
                    style={{ paddingLeft: moderateScale(5) }}
                    onPress={() => {
                      updateAddonState({ reccuringCheckBox: !reccuringCheckBox })
                      resetVariantState()
                    }}>
                    <Image
                      style={{ tintColor: themeColors.primary_color, height: moderateScale(14), width: moderateScale(14) }}
                      source={
                        reccuringCheckBox
                          ? imagePath.checkBox2Active
                          : imagePath.checkBox2InActive
                      }
                    />
                  </TouchableOpacity>
                </View>
              }
              {reccuringCheckBox &&
                <Reccuring
                  planValues={planValues}
                  weekDays={weekDays}
                  quickSelection={quickSelection}
                  showCalendar={showCalendar}
                  reccuringCheckBox={reccuringCheckBox}
                  selectedPlanValues={selectedPlanValues}
                  selectedWeekDaysValues={selectedWeekDaysValues}
                  selectedQuickSelectionValue={selectedQuickSelectionValue}
                  minimumDate={minimumDate}
                  initDate={initDate}
                  start={start}
                  end={end}
                  period={period}
                  disabledDaysIndexes={disabledDaysIndexes}
                  selectedDaysIndexes={selectedDaysIndexes}
                  date={date}
                  showDateTimeModal={showDateTimeModal}
                  slectedDate={slectedDate}
                  updateAddonState={updateAddonState}
                />}
          </ScrollView>

          <View style={{height: moderateScale(100)}} />
        </Animatable.View>
      )}
      <Modal
        isVisible={isProductImageLargeViewVisible}
        style={{
          height: height,
          width: width,
          margin: 0,
        }}
        animationInTiming={600}>
        {renderImageZoomingView()}
      </Modal>
      {/* <DatePicker
        date={date}
        mode={'date'}
        minimumDate={new Date()}
        style={{ width: width - 20, height: height / 3.5 }}
        modal={true}
        open={showDateTimeModal}
        onConfirm={(date) => _onDateChange(date)}
        onCancel={_selectTime}
        androidVariant={'iosClone'}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  productName: {
    color: colors.textGrey,
    fontSize: textScale(18),
    lineHeight: 28,
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
    fontFamily: fontFamily.medium,
  },

  modalMainViewContainer: {
    backgroundColor: colors.white,
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
    fontFamily: fontFamily.regular,
  },
  mainView: {
    marginVertical: moderateScaleVertical(12),
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
    height: width * 0.6,
    width: width,
    alignItems: 'center',
    height: width * 0.6,
    borderRadius: moderateScale(15),
    width: '100%',
    overflow: 'hidden',
    // marginRight: 20
  },
  dotStyle: {height: 12, width: 12, borderRadius: 12 / 2},

  dropDownStyle: {
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScaleVertical(2),
  },
  modalView: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScaleVertical(16),
    paddingBottom: moderateScaleVertical(16),
    borderTopLeftRadius: moderateScale(12),
    borderTopRightRadius: moderateScale(12),
  },
  horizontalLine: {
    width: '100%',
    borderBottomWidth: 1.5,
    marginVertical: moderateScaleVertical(8),
  },
  dateText: {
    color: colors.textGrey,
    textAlign: 'left',
    fontFamily: fontFamily.bold,
    fontSize: textScale(12),
    marginVertical: moderateScaleVertical(4),
  },
  elementInRows: {
    flexDirection: 'row',
    marginVertical: moderateScaleVertical(8),
    flexWrap: 'wrap'
  }
});
export default VariantAddons;