import { useFocusEffect } from '@react-navigation/native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { cloneDeep, debounce, isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  Vibration,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import DeviceInfo from 'react-native-device-info';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSelector } from 'react-redux';
import CustomAnimatedLoader from '../../Components/CustomAnimatedLoader';
import DisplayModal from '../../Components/DisplayModal';
import Header from '../../Components/Header';
import HomeServiceVariantAddons from '../../Components/HomeServiceVariantAddons';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import NoDataFound from '../../Components/NoDataFound';
import ProductCard3 from '../../Components/ProductCard3';
import VariantAddons from '../../Components/VariantAddons';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { removeItem } from '../../utils/utils';

import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  playVibration,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import ListEmptyProduct from './ListEmptyProduct';
import stylesFunc from './styles';
import RepeatModal from '../../Components/RepeatModal';
import DifferentAddOns from '../../Components/DifferentAddOns ';
import { log } from 'console';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import commonStyles, { hitSlopProp } from '../../styles/commonStyles';
import GradientButton from '../../Components/GradientButton';
import { tokenConverterPlusCurrencyNumberFormater } from '../../utils/commonFunction';

let timeOut = undefined;

var tempQty = 0;

let activeIdx = 0;



export default function BrandProducts2({ route, navigation }) {
  const { data } = route.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const { additional_preferences, digit_after_decimal } =
  appData?.profile?.preferences || {};
let businessType = appData?.profile?.preferences?.business_type || null;
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const dineInType = useSelector((state) => state?.home?.dineInType);
  const CartItems = useSelector((state) => state?.cart?.cartItemCount);

  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [appointmentSelectedDate, setAppointmentSelectedDate] = useState(null)
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    isLoading: true,
    isLoadingB: false,
    brand: data,
    brandData: [],
    pageNo: 1,
    limit: 12,
    brandDetail: null,
    allFilters: [],
    sleectdBrands: [],
    selectedVariants: [],
    selectedOptions: [],
    slectedSortBy: [],
    minimumPrice: 0,
    maximumPrice: 50000,
    checkForMinimumPriceChange: false,
    checkForMaximumPriceChange: false,
    isSortEnabled: false,
    showFilterSlectedIcon: false,
    showSortSelectedicon: false,
    isSelected: false,
    sortFilters: [
      {
        id: -2,
        label: strings.SORT_BY,
        value: [
          {
            id: 1,
            label: strings.LOW_TO_HIGH,
            labelValue: 'low_to_high',
            parent: strings.SORT_BY,
          },
          {
            id: 2,
            label: strings.HIGH_TO_LOW,
            labelValue: 'high_to_low',
            parent: strings.SORT_BY,
          },
          {
            id: 3,
            label: strings.POPULARITY,
            labelValue: 'popularity',
            parent: strings.SORT_BY,
          },
          {
            id: 4,
            label: strings.MOST_PURCHASED,
            labelValue: 'most_purchased',
            parent: strings.SORT_BY,
          },
        ],
      },
    ],
    sortFilterMap: [],
    btnLoader: false,
    selectedItemID: -1,
    selectedItemIndx: null,
    categoryInfo: null,
    updateQtyLoader: false,
    isVisibleModal: false,
    typeId: null,
    selectedCartItem: null,
    cartId: null,
    differentAddsOns: [],
    selectedDiffAdsOnItem: null,
    selectedDiffAdsOnSection: null,
    diffAddOnCartIdProductId: null,
    storeLocalQty: null,
    repeatItems: null,
    differentAddsOns: [],
    selectedDiffAdsOnSection: null,
    diffAddOnCartIdProductId: null,
    differentAddsOnsModal: false,
    selectedDiffAdsOnId: 0,
    productDetailData: null,
    showErrorMessageTitle: false,
    productTotalQuantity: 0,
    productPriceData: null,
    productSku: null,
    productVariantId: null,
    productQuantityForCart: 1,
    isProductImageLargeViewVisible: false,
    isLoadingC: false,
    productDetailNew: {},
    isProductAvailable: false,
    selectedVariant: null,
    startDateRental: new Date(),
    endDateRental: new Date(),
    isRentalStartDatePicker: false,
    isRentalEndDatePicker: false,
    rentalProductDuration: null,
    isVarientSelectLoading: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const {
    brand,
    brandData,
    isLoadingB,
    startDateRental,
    endDateRental,
    isRentalStartDatePicker,
    isRentalEndDatePicker,
    rentalProductDuration,
    isVarientSelectLoading,
    limit,
    pageNo,
    brandDetail,
    allFilters,
    sleectdBrands,
    selectedVariants,
    selectedOptions,
    slectedSortBy,
    minimumPrice,
    maximumPrice,
    checkForMinimumPriceChange,
    checkForMaximumPriceChange,
    isSortEnabled,
    showFilterSlectedIcon,
    showSortSelectedicon,
    sortFilters,
    isSelected,
    sortFilterMap,
    btnLoader,
    selectedItemID,
    selectedItemIndx,
    categoryInfo,
    updateQtyLoader,
    isVisibleModal,
    typeId,
    selectedCartItem,
    cartId,
    repeatItems,
    differentAddsOns,
    selectedDiffAdsOnItem,
    selectedDiffAdsOnSection,
    diffAddOnCartIdProductId,
    storeLocalQty,
    differentAddsOnsModal,
    selectedDiffAdsOnId,
    productDetailData,
    showErrorMessageTitle,
    productTotalQuantity,
    productPriceData,
    productSku,
    productVariantId,
    productQuantityForCart,
    isProductImageLargeViewVisible,
    isLoadingC,
    productDetailNew,
    isProductAvailable,
    selectedVariant,
    variantSet,
    addonSet,
    selectedOption
  } = state;
  const [showShimmer, setShowShimmer] = useState(true);
  const bottomSheetRef = useRef(null);
  //Redux Store data
  const { appData, themeColors, themeLayouts, currencies, languages, appStyle } =
    useSelector((state) => state?.initBoot);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const userData = useSelector((state) => state?.auth?.userData);
  const fontFamily = appStyle?.fontSizeData;
  //Screen styling
  const styles = stylesFunc({ themeColors, fontFamily });

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  const [variantState, setVariantState] = useState({
    planValues: ["Daily", "Weekly", "Custom", "Alternate Days"],
    weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    quickSelection: ["Weekdays", "Weekends"],
    showCalendar: false,
    reccuringCheckBox: false,
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

  const { planValues, reccuringCheckBox, showCalendar, selectedPlanValues, minimumDate,
    weekDays, quickSelection, start, end, period, selectedWeekDaysValues, selectedQuickSelectionValue, initDate,
    disabledDaysIndexes, selectedDaysIndexes, date, showDateTimeModal, slectedDate } = variantState
  const updateAddonState = (data) => { setVariantState((state) => ({ ...state, ...data })) };

  const resetVariantState = () => {
    updateAddonState({
      planValues: ["Daily", "Weekly", "Alternate Days", "Custom"],
      weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      quickSelection: ["Weekdays", "Weekends"],
      reccuringCheckBox: false,
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
  console.log(showShimmer, "selectedCartItemselectedCartItemselectedCartItemselectedCartItem");
  useEffect(() => {
    updateState({
      sortFilterMap: sortFilters[0].value,
    });
  }, []);

  //Get brand Products data based on change with brand
  useEffect(() => {
    getListOfBrandProducts();
  }, [state.brand, state.isLoadingB]);

  //Get brand Products based on change with language and currencies
  useEffect(() => {
    updateState({ pageNo: 1 });
    getListOfBrandProducts();
  }, [languages, currencies]);

  //On focus changes
  useFocusEffect(
    React.useCallback(() => {
      updateState({ pageNo: 1 });
      getListOfBrandProducts();
    }, [
      sleectdBrands,
      selectedOptions,
      slectedSortBy,
      minimumPrice,
      maximumPrice,
    ]),
  );

  //Get brand Products data based on change with page number and pull to refresh
  useEffect(() => {
    getListOfBrandProducts();
  }, [state.pageNo, state.isRefreshing]);

  const getListOfBrandProducts = () => {
    let filterExist =
      sleectdBrands.length ||
      selectedVariants.length ||
      selectedOptions.length ||
      minimumPrice != 0 ||
      maximumPrice != 50000 ||
      checkForMaximumPriceChange ||
      checkForMinimumPriceChange;

    let sortExist = slectedSortBy.length;
    {
      filterExist
        ? updateState({ showFilterSlectedIcon: true })
        : updateState({ showFilterSlectedIcon: false });
    }
    {
      sortExist
        ? updateState({ showSortSelectedicon: true })
        : updateState({ showSortSelectedicon: false });
    }
    {
      !!filterExist || !!sortExist
        ? getBrandProductsFilterBased()
        : getBrandProducts();
    }
  };

  //Get Brand products based on filter
  const getBrandProductsFilterBased = () => {
    let data = {};
    data['variants'] = selectedVariants;
    data['options'] = selectedOptions;
    data['brands'] = sleectdBrands;
    data['order_type'] = slectedSortBy.length ? slectedSortBy[0] : '';
    data['range'] = `${minimumPrice};${maximumPrice}`;
    actions
      .getBrandProductsByFilters(
        `/${brand.id}?limit=${limit}&page=${pageNo}`,
        data,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        updateState({
          isLoading: false,
          isLoadingB: false,
          brandData:
            pageNo == 1 ? res.data.data : [...brandData, ...res.data.data],
        });
      })
      .catch(errorMethod);
  };

  //Get Brand products based on brand id
  const getBrandProducts = () => {
    actions
      .getBrandProductsByBrandId(
        `/${brand.id}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, '===>res');
        updateState({
          isLoading: false,
          isLoadingB: false,
          isRefreshing: false,
          brandDetail: res.data.brand,
          brandData:
            pageNo == 1
              ? res.data.products.data
              : [...brandData, ...res.data.products.data],
        });
        updateBrandAndCategoryFilter(res.data.filterVariant);
      })
      .catch(errorMethod);
  };

  //Handing error coming from API
  const errorMethod = (error) => {
    updateState({
      btnLoader,
      isLoading: false,
      isRefreshing: false,
      isLoadingB: false,
    });
    showError(error?.message || error?.error);
  };

  // Update the brand and category filter
  const updateBrandAndCategoryFilter = (filterData) => {
    var filterDataNew = [];

    // Price filter
    if (filterData.length) {
      filterDataNew = filterData.map((i, inx) => {
        return {
          id: i.variant_type_id,
          label: i?.title,
          value: i?.options.map((j, jnx) => {
            return {
              id: j?.id,
              parent: i?.title,
              label: j?.title,
              variant_type_id: i.variant_type_id,
            };
          }),
        };
      });
    }
    updateState({
      allFilters: [...filterDataNew],
    });
  };

  //Update State based on filter coming from filter screen
  const getProductBasedOnFilter = (
    minimumPrice,
    maximumPrice,
    checkForMinimumPriceChange,
    checkForMaximumPriceChange,
    slectedSortBy,
    sleectdBrands,
    selectedVariants,
    selectedOptions,
    allSelectdFilters,
  ) => {
    updateState({
      minimumPrice: minimumPrice,
      maximumPrice: maximumPrice,
      checkForMinimumPriceChange: checkForMinimumPriceChange,
      checkForMaximumPriceChange: checkForMaximumPriceChange,
      allFilters: allSelectdFilters,
      sleectdBrands: sleectdBrands,
      selectedVariants: selectedVariants,
      selectedOptions: selectedOptions,
    });
  };

  const addProductsWithoutCustomize = (item, index, type) => {
    console.log('very nice', item);
    let itemToUpdate = cloneDeep(item);
    let quanitity = !!itemToUpdate?.qty
      ? itemToUpdate?.qty
      : itemToUpdate?.check_if_in_cart_app[0].quantity;
    let productId = !!itemToUpdate?.cart_product_id
      ? itemToUpdate?.cart_product_id
      : itemToUpdate?.check_if_in_cart_app[0].id;
    let parentCartId = !!cartId
      ? cartId
      : itemToUpdate?.check_if_in_cart_app[0].cart_id;

    if (type == 1) {
      addDeleteCartItems(item, quanitity, productId, parentCartId, index, 1);
    } else {
      addDeleteCartItems(item, quanitity, productId, parentCartId, index, 2);
    }
  };

  const getDiffAddsOn = async (apiData, item) => {
    console.log('get diffadds on data', apiData);
    let header = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
      systemuser: DeviceInfo.getUniqueId(),
    };
    try {
      const res = await actions.differentAddOns(apiData, header);
      console.log('res+++++++', res);
      if (res?.data.length > 1) {
        updateState({
          differentAddsOns: res?.data || [],
          selectedDiffAdsOnItem: item,
          diffAddOnCartIdProductId: {
            cart_id: apiData?.cart_id,
            product_id: apiData?.product_id,
          },
          differentAddsOnsModal: true,
        });
        return { data: res?.data, goNext: true };
      }
      return { data: res?.data, goNext: false };
    } catch (error) {
      console.log('error raised,error');
      return { data: null, goNext: false };
    }
  };

  const checkIsCustomize = async (item, index, type) => {
    let itemToUpdate = cloneDeep(item);
    console.log('check item to update', itemToUpdate, item);
    // return;
    if (item.add_on.length == 0 && item.variantSet.length == 0) {
      // hit in case of simple products withou any customization
      addProductsWithoutCustomize(item, index, type);
      return;
    }

    let productId = !!itemToUpdate?.cart_product_id
      ? itemToUpdate?.cart_product_id
      : itemToUpdate?.check_if_in_cart_app[0]?.id;
    let parentCartId = !!cartId
      ? cartId
      : itemToUpdate.check_if_in_cart_app[0]?.cart_id;

    var totalProductQty = 0;
    if (itemToUpdate?.variant && itemToUpdate?.check_if_in_cart_app) {
      itemToUpdate?.check_if_in_cart_app.map((val) => {
        totalProductQty = totalProductQty + val?.quantity;
      });
    }

    var isExistqty = itemToUpdate?.qty ? itemToUpdate?.qty : totalProductQty; //this variable contain only local product quantity
    var tempQty = 0; //this variable contain latest updated quantity of products

    if (
      (type == 2 && item?.add_on?.length > 0) ||
      item?.variantSet?.length > 0
    ) {
      //hit in case of subtruction
      let apiData = { cart_id: parentCartId, product_id: item.id };
      let checkIsAvailable = await getDiffAddsOn(apiData, item); //check products with different addOns is exist or not.
      // console.log("check available", checkIsAvailable)

      !!checkIsAvailable?.data &&
        checkIsAvailable?.data.map((val) => {
          console.log('check available', val);
          tempQty = tempQty + val?.quantity; //store updated total quantity of products
        });

      if (!!checkIsAvailable?.goNext) {
        //if different adOns is exist then open DifferentAddOns Modal.
        return;
      }
    }
    if (type == 2) {
      // direct subtract customize items if products added with same addons
      addDeleteCartItems(
        item,
        tempQty == 0 ? isExistqty : tempQty,
        productId,
        parentCartId,
        index,
        2,
      );
      return;
    }

    if (type == 1) {
      //hit in case of add new products
      let apiData = { cart_id: parentCartId, product_id: item.id };
      let header = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      };
      console.log('api data checkLastAdded', apiData);
      try {
        const res = await actions.checkLastAdded(apiData, header);
        console.log('res++++++', res);
        if (!!res.data) {
          //open RepeatModal
          const addData = {
            item: item,
            index: index,
            type: type,
            isExistqty: tempQty == 0 ? isExistqty : tempQty,
            updateLocalQty: res.data?.quantity,
            productId: res?.data?.id,
            parentCartId: res.data.cart_id,
          };
          console.log('is++ exist qty', tempQty == 0 ? isExistqty : tempQty);
          console.log('is++ update local qty', res.data?.quantity);

          updateState({ repeatItems: addData });
        }
      } catch (error) {
        console.log('error riased++++', error);
        showError(error?.message || error?.error);
      }
      return;
    }
  };
  const addSingleItem = async (item) => {
    if (categoryInfo?.is_vendor_closed && !categoryInfo?.show_slot) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    playHapticEffect(hapticEffects.impactLight);
    let getTypeId = !!item?.category && item?.category.category_detail?.type_id;
    updateState({ selectedItemID: item?.id, btnLoader: true });
    let isSingleVendor = await checkSingleVendor(item.id);
    console.log('is singel vendor', isSingleVendor);

    if (
      isSingleVendor.isSingleVendorEnabled == 1 &&
      isSingleVendor.otherVendorExists == 1
    ) {

      updateState({
        updateQtyLoader: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      Alert.alert('', strings.ALREADY_EXIST, [
        {
          text: strings.CANCEL,
          onPress: () => { },
          // style: 'destructive',
        },
        {
          text: strings.CONFIRM,
          onPress: () => clearCartAndAddProduct(item),
        },
      ]);
      return;
    }

    if (item?.add_on?.length !== 0 || item?.variantSet?.length !== 0) {

      updateState({
        updateQtyLoader: false,
        typeId: getTypeId,
        btnLoader: false,
        isVisibleModal: true,
        selectedCartItem: item,
        selectedItemID: -1,
      });
      return;
    }
    if (item?.add_on?.length === 0 && item?.mode_of_service === 'schedule') {

      updateState({
        updateQtyLoader: false,
        typeId: getTypeId,
        isVisibleModal: true,
        selectedCartItem: item,
        selectedItemID: -1,
        btnLoader: false,
      });
      return;
    }
    let data = {};
    data['sku'] = item.sku;
    data['quantity'] = !!item?.minimum_order_count
      ? Number(item?.minimum_order_count)
      : 1;
    data['product_variant_id'] = item?.variant[0]?.id;
    data['type'] = dineInType;
    console.log(data, "hsjfghdd>>>>>>>>>>>>>>");
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })

      .then((res) => {
        console.log(res, "shgcfhjdgjdhvjvjcvcjhvg")
        actions.cartItemQty(res);
        updateState({ cartId: res.data.id });
        let updateArray = brandData.map((val, i) => {
          if (val.id == item.id) {
            return {
              ...val,
              qty: !!item?.minimum_order_count
                ? Number(item?.minimum_order_count)
                : 1,
              cart_product_id: res.data.cart_product_id,
              isRemove: false,
            };
          }
          return val;
        });
        updateState({
          selectedCartItem: item,
          updateQtyLoader: false,
          selectedItemID: -1,
          btnLoader: false,
          brandData: updateArray,
        });
      })
      .catch((error) => errorMethodSecond(error));
  };

  const addDeleteCartItems = async (
    item,
    isExistqty,
    isExistproductId,
    isExistCartId,
    index,
    type,
    updateLocalQty = null,
    differentAddsOnsQty = null,
  ) => {
    if (categoryInfo?.is_vendor_closed && !categoryInfo?.show_slot) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }

    playHapticEffect(hapticEffects.impactLight);

    let quanitity = null;
    let itemToUpdate = cloneDeep(item);

    console.log('exist qty', isExistqty);
    /** This will restring unneccessary api call , only hit api once user wait for 1.5 seconds ***/

    if (timeOut) {
      clearTimeout(timeOut);
    }

    tempQty = tempQty + 1;

    let quantityToIncreaseDecrease = !!item?.batch_count
      ? Number(item?.batch_count)
      : 1;

    if (type == 1) {
      quanitity = Number(isExistqty) + quantityToIncreaseDecrease;
    } else {
      let quantityToDecreaseOnMinimum = !!item?.minimum_order_count
        ? Number(item?.minimum_order_count)
        : 1;

      if (
        Number(isExistqty - item?.batch_count) <
        Number(item?.minimum_order_count)
      ) {
        quanitity = 0;
      } else {
        quanitity = Number(isExistqty) - quantityToIncreaseDecrease;
      }
    }

    updateLocally(quanitity, item, isExistproductId, differentAddsOnsQty);

    timeOut = setTimeout(
      () => {
        console.log('hit set time out functions');
        // return;
        if (quanitity) {
          console.log(
            'differentAddsOnsQtydifferentAddsOnsQty',
            differentAddsOnsQty,
          );
          updateState({
            selectedItemID: itemToUpdate.id,
            btnLoader: true,
            selectedItemIndx: index,
          });
          let data = {};
          data['cart_id'] = isExistCartId;
          data['quantity'] = !!updateLocalQty
            ? type == 1
              ? updateLocalQty + 1
              : updateLocalQty - 1
            : quanitity;
          data['cart_product_id'] = isExistproductId;
          data['type'] = dineInType;
          console.log('sending api data', data);

          actions
            .increaseDecreaseItemQty(data, {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              systemuser: DeviceInfo.getUniqueId(),
            })
            .then((res) => {
              console.log('update qty res', res);
              tempQty = 0;
              actions.cartItemQty(res);
              updateState({
                cartItems: res.data.products,
                cartData: res.data,
                updateQtyLoader: false,
                selectedItemID: -1,
                btnLoader: false,
              });
            })
            .catch(async () => {
              errorMethod();
              if (type == 1) {
                quanitity = quanitity - tempQty;
              } else {
                quanitity = quanitity + tempQty;
              }
              await updateLocally(quanitity, item, isExistproductId);
              tempQty = 0;
            });
        } else {
          updateState({
            selectedItemID: itemToUpdate?.id,
            btnLoader: false,
          });
          removeItem('selectedTable');
          removeProductFromCart(itemToUpdate, isExistproductId);
        }
      },
      quanitity === 1 ? 0 : 700,
    );
  };

  const checkSingleVendor = async (id) => {
    let vendorData = { vendor_id: categoryInfo?.id };
    updateState({ selectedItemID: id });
    return new Promise((resolve, reject) => {
      actions
        .checkSingleVendor(vendorData, {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          console.log('res check singel vendro==>>>>>>', res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
          updateState({ selectedItemID: -1 });
        });
    });
  };

  const errorMethodSecond = (error, addonSet = []) => {
    console.log(error.message.alert, 'Error>>>>>');
    updateState({ updateQtyLoader: false });
    if (error?.message?.alert == 1) {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        { text: 'Clear Cart', onPress: () => clearCart(addonSet) },
      ]);
    } else {
      updateState({
        isLoading: false,
        isLoadingB: false,
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      showError(error?.message || error?.error);
    }
  };

  const clearCart = async (addonSet = []) => {
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
        if (addonSet) {
        } else {
          // addToCart();
        }
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const updateLocally = (
    quanitity,
    item,
    isExistproductId,
    differentAddsOnsQty,
  ) => {
    console.log('quanitity', quanitity);
    console.log('quanitity localy', differentAddsOnsQty);

    let updateArray = brandData.map((val, i) => {
      if (val.id == item.id) {
        return {
          ...val,
          qty: !!differentAddsOnsQty ? differentAddsOnsQty : quanitity,
          cart_product_id: isExistproductId,
          isRemove: false,
        };
      }
      return val;
    });
    updateState({
      brandData: updateArray,
      selectedItemID: -1,
      storeLocalQty: differentAddsOnsQty,
    });
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (itemToUpdate, diffAdOnId = 0) => {
    // console.log("item to update remove item", itemToUpdate)

    let updateLocallyAddOns = [];
    if (differentAddsOnsModal) {
      let cloneArr = differentAddsOns;
      updateLocallyAddOns = cloneArr.filter((val) => {
        if (diffAdOnId !== val.id) {
          return val;
        }
      });
      updateState({ differentAddsOns: updateLocallyAddOns });
    }

    let data = {};
    let isExistproductId = diffAdOnId;
    let isExistCartId =
      !!itemToUpdate?.check_if_in_cart_app &&
        !!itemToUpdate?.check_if_in_cart_app.length > 0
        ? itemToUpdate?.check_if_in_cart_app[0]?.cart_id
        : cartId;

    data['cart_id'] = isExistCartId;
    data['cart_product_id'] = isExistproductId;
    data['type'] = dineInType;

    console.log('itemToUpdate', itemToUpdate);
    console.log('sending data', data);

    updateState({ btnLoader: true });
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        let updateArray = brandData.map((val, i) => {
          if (val.id == itemToUpdate.id) {
            return {
              ...val,
              qty: null,
              cart_product_id: res.data.cart_product_id,
              check_if_in_cart_app: differentAddsOnsModal
                ? updateLocallyAddOns
                : [],
              // variant: itemToUpdate?.variant.map((val, i) => {
              //   return { ...val, check_if_in_cart_app: differentAddsOnsModal ? updateLocallyAddOns : [] };
              // }),
            };
          }
          return val;
        });
        updateState({
          brandData: updateArray,
          updateQtyLoader: false,
          selectedItemID: -1,
          btnLoader: false,
        });
      })
      .catch(errorMethod);
  };

  //render Products list based on brand ID
  const renderProduct = ({ item, index }) => {
    return (
      <ProductCard3
        data={item}
        index={index}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        addToCart={() => addSingleItem(item, index)}
        onIncrement={() => checkIsCustomize(item, index, 1)}
        onDecrement={() => checkIsCustomize(item, index, 2)}
        selectedItemID={selectedItemID}
        btnLoader={btnLoader}
        selectedItemIndx={selectedItemIndx}
        categoryInfo={categoryInfo}
      />
    );
  };

  const _onAddtoWishlist = (item) => {
    playHapticEffect(hapticEffects.rigid);
    if (!!userData?.auth_token) {
      updateState({ isLoadingB: true });
      actions
        .updateProductWishListData(
          `/${item.id}`,
          {},
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
          },
        )
        .then((res) => {
          console.log(res, 'updateProductWishListData');
          showSuccess(res.message);
          updateProductList(item);
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
      updateState({ isLoadingB: false });
    }
  };

  const clearCartAndAddProduct = async (item) => {
    updateState({ updateQtyLoader: true });
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
        addSingleItem(item);
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };
  const getAdditionalPriceOfAddons = () => {
    // console.log(
    //   'productPriceDataproductPriceDataproductPriceData>>>',
    //   productQuantityForCart,
    // );
    let addOnsAdditionalPrice = 0;
    if (addonSet && addonSet[0]) {
      for (let i = 0; i < addonSet?.length; i++) {
        addonSet[i].setoptions.forEach((el) => {
          if (el.value) {
            addOnsAdditionalPrice = addOnsAdditionalPrice + Number(el.price);
          }
        });
      }
    }

    addOnsAdditionalPrice = tokenConverterPlusCurrencyNumberFormater(
      Number(productPriceData?.multiplier) *
      Number(productPriceData?.price) *
      productQuantityForCart +
      addOnsAdditionalPrice,
      digit_after_decimal,
      additional_preferences,
      currencies?.primary_currency?.symbol,
    );
    return addOnsAdditionalPrice;
  };
  /*******Upadte products in wishlist>*********/
  const updateProductList = (item) => {
    let newArray = cloneDeep(brandData);
    newArray = newArray.map((i, inx) => {
      if (i.id == item.id) {
        if (item.inwishlist) {
          i.inwishlist = null;
          return { ...i, inwishlist: null };
        } else {
          return { ...i, inwishlist: { product_id: i.id } };
        }
      } else {
        return i;
      }
    });
    updateState({ brandData: newArray });
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    updateState({ pageNo: pageNo + 1 });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1, isRefreshing: true });
  };
  const productIncrDecreamentForCart = (type) => {
    playHapticEffect(hapticEffects.rigid);
    let quantityToIncreaseDecrease = !!productDetailData?.batch_count
      ? Number(productDetailData?.batch_count)
      : 1;

    if (type == 2) {
      let limitOfMinimumQuantity = !!productDetailData?.minimum_order_count
        ? Number(productDetailData?.minimum_order_count)
        : 1;
      if (productQuantityForCart <= limitOfMinimumQuantity) {
        onCloseModal();
      } else {
        updateState({
          productQuantityForCart:
            productQuantityForCart - quantityToIncreaseDecrease,
        });
      }
    } else if (type == 1) {
      if (productQuantityForCart == productTotalQuantity) {
        showError(strings.MAXIMUM_LIMIT_REACHED);
      } else {
        updateState({
          productQuantityForCart:
            productQuantityForCart + quantityToIncreaseDecrease,
        });
      }
    }
  };
  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });
  const checkIfMaxReached = (minVal, Arr) => {
    const SelectedItems = Arr.filter((el) => el.value);
    if (SelectedItems?.length >= minVal) {
      return true;
    }
    return false;
  };
  const addToCart = (addonSet) => {
    if (dine_In_Type == 'appointment' && selectedAllProductDataForAppointment?.mode_of_service == 'schedule' && isEmpty(selectedAppointmentSlot)) {
      setAppointmentPicker(true)
      setSelectedProductForAppointment(selectedAllProductDataForAppointment?.id)
      setSelectedAllProductDataForAppointment(selectedAllProductDataForAppointment)
      return
    }
    if (!isProductAvailable && typeId == 10) {
      showError('Product varient is not availabel!');
      return;
    }
    if (!!productDetailData.is_recurring_bookin) {
      if (isEmpty(selectedPlanValues)) {
        showError('Plan type should not be empty!');
        return;
      }
      if (isEmpty(selectedWeekDaysValues) && selectedPlanValues == "Weekly") {
        showError('Weekdays should not be empty!');
        return;
      }
      if (selectedPlanValues == "Daily" || selectedPlanValues == "Weekly" || selectedPlanValues == "Alternate Days") {
        if (isEmpty(start) || isEmpty(end)) {
          showError('Start date and End date should not be empty!');
          return;
        }
      } else {
        if (isEmpty(period)) {
          showError('Select dates in custom plan!');
          return;
        }
      }
    }



    playHapticEffect(hapticEffects.rigid);
    console.log('add on set', addonSet);
    const addon_ids = [];
    const addon_options = [];

    addonSet.map((i, inx) => {
      const temp = checkIfMaxReached(i.min_select, i.setoptions);

      if (temp) {
        i.setoptions.map((j, jnx) => {
          if (j?.value == true) {
            addon_ids.push(j?.addon_id);
            addon_options.push(j?.id);
          }
        });
        let CloneArr = addonSet;
        CloneArr[inx] = { ...CloneArr[inx], errorShow: false };
        updateState({ addonSet: CloneArr });
      } else {
        let CloneArr = addonSet;
        CloneArr[inx] = { ...CloneArr[inx], errorShow: true };
        updateState({ addonSet: CloneArr });
      }
    });

    const checkIsError = addonSet.findIndex((el) => el.errorShow);

    const weeDays = []
    const selectedCustomDates = []

    if (selectedWeekDaysValues.length) {
      selectedWeekDaysValues.map((itm, inx) => {
        const value = itm === "Mo" ? 1 :
          itm === "Tu" ? 2 :
            itm === "We" ? 3 :
              itm === "Th" ? 4 :
                itm === "Fr" ? 5 :
                  itm === "Sa" ? 6 :
                    itm === "Su" && 0
        weeDays.push(value)
      })
    }
    if (!isEmpty(period) && selectedPlanValues == "Custom") {
      Object.entries(period).map(([key, value]) => (selectedCustomDates.push(key)));
    }
    if (!isEmpty(period) && selectedPlanValues == "Weekly") {
      Object.entries(period).map(([key, value]) => {
        console.log("=>", JSON.stringify(value));
        ((value['startingDay'] == true || value['startingDay'] == false) || value['endingDay']) && selectedCustomDates.push(key)
      });
    }


    const recurringformPost = {}

    recurringformPost['action'] = selectedPlanValues == "Daily" ? 1 : selectedPlanValues == "Weekly" ? 2 : selectedPlanValues == "Monthly" ? 3 :
      selectedPlanValues == "Alternate Days" ? 6 : selectedPlanValues == "Custom" ? 4 : 5
    recurringformPost['startDate'] = start.dateString ? start.dateString : ''
    recurringformPost['endDate'] = end.dateString ? end.dateString : ''
    recurringformPost['weekDay'] = weeDays
    recurringformPost['selected_custom_dates'] = selectedCustomDates


    let data = {};

    if (checkIsError == -1) {
      data['sku'] = productSku;
      data['quantity'] = productQuantityForCart;
      data['product_variant_id'] = productVariantId;
      data['type'] = dineInType;
      if (addonSet && addonSet?.length) {
        // console.log(addonSetData, 'addonSetData');
        data['addon_ids'] = addon_ids;
        data['addon_options'] = addon_options;
      }
      if (typeId == 10) {
        data['start_date_time'] = String(
          moment(startDateRental).format('YYYY-MM-DD hh:mm:ss'),
        );
        data['end_date_time'] = String(
          moment(endDateRental).format('YYYY-MM-DD hh:mm:ss'),
        );
        data['total_booking_time'] = rentalProductDuration;
        data['additional_increments_hrs_min'] =
          rentalProductDuration -
          Number(productDetailNew?.product?.minimum_duration) * 60 +
          Number(productDetailNew?.product?.minimum_duration_min);
      }

      console.log(appointmentSelectedDate, "appointmentSelectedDate");

      if (dine_In_Type == 'appointment') {
        data['schedule_slot'] = selectedAppointmentSlot?.value,
          data['scheduled_date_time'] = String(
            moment(appointmentSelectedDate).format('YYYY-MM-DD hh:mm:ss'),
          );
        data['dispatch_agent_id'] = selectedAgent?.id
        data['schedule_type'] = selectedAllProductDataForAppointment?.mode_of_service == 'schedule' ? 'schedule' : ''

      }

      console.log(data, 'data for cart>>>>>>');
      data['recurringformPost'] = recurringformPost

      console.log(JSON.stringify(data), 'data for cart');
      updateState({ btnLoader: true });
      actions
        .addProductsToCart(data, {
          code: appData.profile.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then(async (res) => {
          actions.cartItemQty(res);
          showSuccess(strings.PRODUCT_ADDED_SUCCESS);
          // setSelectedAppointmentSlot({})
          updateCartItems(
            selectedCartItem,
            res.data.product_total_qty_in_cart, ////localy update cart quanity
            res.data.cart_product_id,
            res.data.id,
          );
          updateState({ isLoadingC: false, btnLoader: false });
          // onClose();
        })
        .catch((error) => {
          errorMethodSecond(error, addonSet);
        });
      return;
    }
  };
  const shortModalFun = () => {
    updateState({ isSortEnabled: true });
  };
  const closeOptionModal = () => {
    updateState({ isSortEnabled: false });
  };

  //Update short filter status
  const updateStatus = (item) => {
    let allFilterData = cloneDeep(sortFilters);

    updateState({
      sortFilters: [
        ...allFilterData.map((i) => {
          if (i.label == item?.parent) {
            let checkArray = i.value.map((j) => {
              if (j.label == item.label) {
                if (i.id == -2) {
                  return {
                    ...j,
                    value: { selected: j?.value?.selected ? false : true },
                  };
                } else {
                  return {
                    ...j,
                    value: { selected: j?.value?.selected ? false : true },
                  };
                }
              } else {
                if (i.id == -2) {
                  return {
                    ...j,
                    value: { selected: false },
                  };
                } else {
                  return j;
                }
              }
            });

            updateState({ sortFilterMap: checkArray });
            return {
              ...i,
              value: checkArray,
            };
          } else {
            return i;
          }
        }),
      ],
    });
  };
  const onCloseModal = () => {
    updateState({ isVisibleModal: false });
    setShowShimmer(true);
    resetVariantState()
  };
  //Submit shot button
  const _sortingSubmitButton = () => {
    var sortbyIds = [];
    sortbyIds = sortFilters
      .filter((i) => i?.id == -2)[0]
      .value.filter((itm) => itm?.value?.selected == true)
      .map((j) => {
        return j.labelValue;
      });

    updateState({
      slectedSortBy: sortbyIds,
      isSortEnabled: false,
      isLoadingB: true,
    });
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width * 0.5 - 21.5,
    offset: (width * 0.5 - 21.5) * index,
    index,
  });

  const updateCartItems = (item, quanitity, productId, cartID) => {
    playHapticEffect(hapticEffects.impactLight);

    let updateArray = brandData.map((val, i) => {
      if (val.id == item.id) {
        return {
          ...val,
          qty: quanitity,
          cart_product_id: productId,
          isRemove: false,
        };
      }
      updateState({ storeLocalQty: quanitity });
      return val;
    });
    updateState({
      cartId: cartID,
      brandData: updateArray,
      isVisibleModal: false,
    });
  };

  const hideDifferentAddOns = () => {
    updateState({ differentAddsOnsModal: false, differentAddsOns: [] });
  };
  const bottomSheetHeader = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          updateState({
            isVisibleModal: false,
          });
          resetVariantState()
        }}
        style={{ alignSelf: 'center', marginBottom: moderateScaleVertical(16) }}>
        <Image source={imagePath.icClose4} />
      </TouchableOpacity>
    );
  };
  const difAddOnsAdded = async (
    item,
    qty,
    productId,
    cartId,
    section,
    index,
    type,
  ) => {
    let differentAddsOnsQty = 0;
    let cloneArr = differentAddsOns;
    let updateLocallyAddOns = cloneArr.map((val) => {
      differentAddsOnsQty = differentAddsOnsQty + val.quantity;
      if (cartId == val.id) {
        return { ...val, quantity: type == 1 ? qty + 1 : qty - 1 };
      }
      return val;
    });
    await addDeleteCartItems(
      item,
      qty,
      cartId,
      productId,
      index,
      type,
      null,
      type == 1 ? differentAddsOnsQty + 1 : differentAddsOnsQty - 1, //send updated total quantity
    );
    updateState({ differentAddsOns: updateLocallyAddOns });
  };

  const onRepeat = async () => {
    // console.log("repeate items", repeatItems)
    const { item, isExistqty, productId, parentCartId, updateLocalQty } =
      repeatItems;
    await addDeleteCartItems(
      item,
      isExistqty,
      productId,
      parentCartId,
      repeatItems?.index,
      1,
      updateLocalQty,
    );
    updateState({ repeatItems: null });
  };

  const onAddNew = () => {
    let getTypeId =
      !!repeatItems?.item?.category &&
      repeatItems?.item?.category.category_detail?.type_id;
    updateState({
      repeatItems: null,
      updateQtyLoader: false,
      typeId: getTypeId,
      isVisibleModal: true,
      selectedCartItem: repeatItems?.item,
      selectedItemID: -1,
      btnLoader: false,
    });
  };

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      isLoadingB={isLoadingB}
      source={loaderOne}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={brand?.title || brand?.translation_title}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
        rightIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icSearchb
            : imagePath.search
        }
        onPressRight={() =>
          moveToNewScreen(navigationStrings.SEARCHPRODUCTOVENDOR, {
            type: staticStrings.BRAND,
            id: brand?.id,
          })()
        }
      />
      <View style={{ height: 1, backgroundColor: colors.borderLight }} />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {state.isLoading && <ListEmptyProduct isLoading={state.isLoading} />}
        {!state.isLoading && (
          <>
            {/* //Top section slider */}
            <View style={{ marginTop: 20 }} />
            {/* Brand Banner View */}

            <View
              style={{
                marginHorizontal: moderateScale(16),
                alignItems: 'center',
                backgroundColor: colors.greySearchBackground,
                borderRadius: moderateScale(8),
              }}>
              {brandDetail?.image && (
                <Image
                  style={{
                    width: width - moderateScale(24),
                    height: moderateScaleVertical(width / 2.3),
                  }}
                  resizeMode="contain"
                  source={{
                    uri: getImageUrl(
                      brandDetail?.image_banner?.image_fit ||
                      brandDetail.image.image_fit,
                      brandDetail?.image_banner?.image_path ||
                      brandDetail.image.image_path,
                      '1000/1000',
                    ),
                  }}
                />
              )}
              {/* <Text style={styles.addProduct}>{strings.ALLPRODUCT}</Text> */}
            </View>
            {/* {!!brandData && !!brandData.length && ( */}
            <View style={styles.sortFilterTabView2}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: moderateScale(16),
                    fontFamily: fontFamily.medium,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    textAlign: 'left',
                  }}>
                  {strings.PRODUCTS}
                </Text>
              </View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={shortModalFun}
                  style={[styles.tabLable2]}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : showSortSelectedicon
                        ? themeColors.primary_color
                        : colors.black,
                    }}
                    source={imagePath.newsort}
                  />
                  <Text
                    style={[
                      styles.sortFilter2,
                      {
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGrey,
                      },
                    ]}>
                    {strings.SORT}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    borderRightWidth: 1,
                    borderColor: '#979797',
                    height: moderateScale(16),
                  }}
                />

                <TouchableOpacity
                  onPress={moveToNewScreen(navigationStrings.FILTER, {
                    // brandData: brandData,
                    // filterData: filterData,
                    showSortBy: false,
                    showBrands: false,
                    allFilters: allFilters,
                    minPrice: minimumPrice,
                    maxPrice: maximumPrice,
                    checkForMinimumPriceChange: checkForMinimumPriceChange,
                    checkForMaximumPriceChange: checkForMaximumPriceChange,
                    getProductBasedOnFilter: (
                      minPrice,
                      maxPrice,
                      checkForMinimumPriceChange,
                      checkForMaximumPriceChange,
                      sortByIds,
                      brandIds,
                      variants,
                      options,
                      allSelectdFilters,
                    ) =>
                      getProductBasedOnFilter(
                        minPrice,
                        maxPrice,
                        checkForMinimumPriceChange,
                        checkForMaximumPriceChange,
                        sortByIds,
                        brandIds,
                        variants,
                        options,
                        allSelectdFilters,
                      ),
                  })}
                  style={styles.tabLable2}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : showFilterSlectedIcon
                        ? themeColors.primary_color
                        : colors.black,
                    }}
                    source={imagePath.newfilter}
                  />
                  <Text
                    style={[
                      styles.sortFilter2,
                      {
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGrey,
                      },
                    ]}>
                    {strings.FILTER}
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
            {/* )} */}

            <FlatList
              data={(!state.isLoading && brandData) || []}
              renderItem={renderProduct}
              extraData={brandData}
              keyExtractor={(item, index) => String(index)}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, marginTop: moderateScale(10) }}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
              getItemLayout={getItemLayout}
              onScrollToIndexFailed={() => console.log("")}
              initialNumToRender={12}
              maxToRenderPerBatch={10}
              windowSize={10}
              refreshing={state.isRefreshing}
              refreshControl={
                <RefreshControl
                  refreshing={state.isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={themeColors.primary_color}
                />
              }
              onEndReached={onEndReachedDelayed}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={
                <NoDataFound
                  isLoading={state.isLoading}
                  containerStyle={{ marginTop: moderateScaleVertical(width / 8) }}
                />
              }
              ListFooterComponent={() => (
                <View style={{ height: moderateScale(80) }} />
              )}
            />
            <View>
              {isSortEnabled && (
                <DisplayModal
                  closeModal={() => closeOptionModal()}
                  ShowModal={isSortEnabled}
                  showBottomButton={true}
                  dataArray={sortFilterMap}
                  isSortEnabled={isSortEnabled}
                  headerTitle={strings.SORT_MODAL_TITLE}
                  bottomButtonClick={_sortingSubmitButton}
                  updateStatus={(item) => updateStatus(item)}
                />
              )}
            </View>
          </>
        )}
      </KeyboardAwareScrollView>

      {!!typeId && typeId == 8 ? (
        <View>
          {isVisibleModal && (
            <HomeServiceVariantAddons
              addonSet={selectedCartItem?.add_on}
              variantData={selectedCartItem?.variantSet}
              isVisible={isVisibleModal}
              productdetail={selectedCartItem}
              onClose={() =>
                updateState({ isVisibleModal: false, showShimmer: true })
              }
              showShimmer={showShimmer}
              shimmerClose={(val) => setShowShimmer(val)}
              updateCartItems={updateCartItems}
            // modeOfService={selectedCartItem?.mode_of_service}
            />
          )}
        </View>
      ) : (
        <>
          {console.log(isVisibleModal, 'isVisibleModalisVisibleModal', typeId)}
          {isVisibleModal && (
            <>
             <BottomSheet
                    ref={bottomSheetRef}
                    index={1}
                    snapPoints={[height / 1.5, height / 1.25]}
                    enablePanDownToClose
                    activeOffsetY={[-1, 1]}
                    failOffsetX={[-5, 5]}
                    animateOnMount={true}
                    handleComponent={bottomSheetHeader}
                    onChange={(index) => {
                      if (index == -1) {
                        onCloseModal();
                      }
                      // playHapticEffect(hapticEffects.impactMedium);
                    }}
                    backdropComponent={() => <View style={{ height: 0 }} />}
                    backgroundComponent={() => <></>}>
                    <BottomSheetScrollView
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{ flexGrow: 1 }}
                      style={{
                        flex: 1,
                        backgroundColor: isDarkMode
                          ? MyDarkTheme.colors.lightDark
                          : colors.white,
                        borderTopLeftRadius: moderateScale(15),
                        borderTopRightRadius: moderateScale(15),
                      }}>
                      <VariantAddons
                        addonSet={addonSet}
                        isVisible={isVisibleModal}
                        productdetail={selectedCartItem}
                        onClose={onCloseModal}
                        typeId={typeId}
                        showShimmer={showShimmer}
                        shimmerClose={(val) => setShowShimmer(val)}
                        updateCartItems={updateCartItems}
                        filterData={allFilters}
                        variantSet={variantSet}
                        productDetailData={productDetailData}
                        showErrorMessageTitle={showErrorMessageTitle}
                        productTotalQuantity={productTotalQuantity}
                        productPriceData={productPriceData}
                        productSku={productSku}
                        productVariantId={productVariantId}
                        productQuantityForCart={productQuantityForCart}
                        selectedVariant={selectedVariant}
                        selectedOption={selectedOption}
                        isProductImageLargeViewVisible={
                          isProductImageLargeViewVisible
                        }
                        isLoadingC={isLoadingC}
                        btnLoader={btnLoader}
                        updateState={updateState}
                        startDateRental={startDateRental}
                        endDateRental={endDateRental}
                        isRentalStartDatePicker={isRentalStartDatePicker}
                        isRentalEndDatePicker={isRentalEndDatePicker}
                        rentalProductDuration={rentalProductDuration}
                        isVarientSelectLoading={isVarientSelectLoading}
                        productDetailNew={productDetailNew}
                        isProductAvailable={isProductAvailable}

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
                      />
                    </BottomSheetScrollView>
                  </BottomSheet>
              {!!(
                productDetailData?.has_inventory == 0 ||
                (!showErrorMessageTitle && productTotalQuantity > 0) ||
                (!!typeId && typeId == 8) ||
                !!productDetailData?.sell_when_out_of_stock
              ) ? (
                <View>
                  {true ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: moderateScale(16),
                        paddingBottom: moderateScaleVertical(16),
                        backgroundColor: isDarkMode
                          ? MyDarkTheme.colors.background
                          : '#fff',
                      }}>
                      {typeId !== 10 && !showErrorMessageTitle && dine_In_Type != 'appointment' && (
                        <View
                          style={{
                            flex: 0.35,
                            marginRight: moderateScale(8),
                            justifyContent:'center'
                          }}>
                          <View
                            style={{
                              ...commonStyles.buttonRect,
                              borderWidth: 0.4,
                              borderRadius: moderateScale(4),
                              height: moderateScale(38),
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              paddingHorizontal: moderateScale(12),
                              backgroundColor:
                                getColorCodeWithOpactiyNumber(
                                  themeColors.primary_color.substr(1),
                                  15,
                                ),
                              borderColor: themeColors?.primary_color,
                              height: moderateScale(38),
                              alignItems:'center'
                            }}
                          // onPress={onPress}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                productIncrDecreamentForCart(2)
                              }
                              hitSlop={hitSlopProp}>
                              <Text
                                style={{
                                  ...commonStyles.mediumFont14,
                                  color: themeColors?.primary_color,
                                  fontFamily: fontFamily.bold,
                                }}>
                                -
                              </Text>
                            </TouchableOpacity>
                            <Text
                              style={{
                                ...commonStyles.mediumFont14,
                                color: isDarkMode
                                  ? colors.white
                                  : colors.black,
                              }}>
                              {productQuantityForCart}
                            </Text>
                            <TouchableOpacity
                              onPress={() =>
                                productIncrDecreamentForCart(1)
                              }
                              hitSlop={hitSlopProp}>
                              <Text
                                style={{
                                  ...commonStyles.mediumFont14,
                                  color: themeColors?.primary_color,
                                  fontFamily: fontFamily.bold,
                                }}>
                                +
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}

                      <View />
                      {!showErrorMessageTitle && (
                        <View
                          pointerEvents={btnLoader ? 'none' : 'auto'}
                          style={{ flex: 1 }}>
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
                              color: colors.white,
                            }}
                            onPress={() => addToCart(addonSet)}
                            btnText={`${strings.ADD_ITEM
                              } ${getAdditionalPriceOfAddons()}`}
                            btnStyle={{
                              borderRadius: moderateScale(4),
                              height: moderateScale(38),
                            }}
                          />
                        </View>
                      )}
                    </View>
                  ) : null}
                </View>
              ) : null}
            </>
          )}
        </>
      )}

      <CustomAnimatedLoader
        source={loaderOne}
        loaderTitle="Loading"
        containerColor={colors.white}
        loadercolor={themeColors.primary_color}
        animationStyle={[
          {
            height: moderateScaleVertical(40),
            width: moderateScale(40),
          },
        ]}
        visible={updateQtyLoader}
      />

      {/* Add new addons and repeat item view */}
      {!!repeatItems && (
        <RepeatModal
          data={repeatItems?.item}
          modalHide={() => updateState({ repeatItems: null })}
          onRepeat={onRepeat}
          onAddNew={onAddNew}
        />
      )}

      {!!differentAddsOns && differentAddsOns.length > 1 && (
        <DifferentAddOns
          differentAddsOnsModal={differentAddsOnsModal}
          data={differentAddsOns}
          selectedDiffAdsOnItem={selectedDiffAdsOnItem}
          hideDifferentAddOns={hideDifferentAddOns}
          difAddOnsAdded={difAddOnsAdded}
          selectedDiffAdsOnSection={selectedDiffAdsOnSection}
          storeLocalQty={storeLocalQty}
          btnLoader={btnLoader}
          selectedDiffAdsOnId={selectedDiffAdsOnId}
        />
      )}
    </WrapperContainer>
  );
}
