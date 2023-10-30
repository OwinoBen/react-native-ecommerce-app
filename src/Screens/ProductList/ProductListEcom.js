import Clipboard from '@react-native-community/clipboard';
import _, { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { UIActivityIndicator } from 'react-native-indicators';
import * as RNLocalize from 'react-native-localize';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import Share from 'react-native-share';
import Toast from 'react-native-simple-toast';
// import SectionList from 'react-native-tabs-section-list';
import { useSelector } from 'react-redux';
import BottomSlideModal from '../../Components/BottomSlideModal';
import NoDataFound from '../../Components/NoDataFound';
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
  scale,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../../utils/commonFunction';
import {
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
  showInfo,
  showSuccess,
} from '../../utils/helperFunctions';
import { removeItem } from '../../utils/utils';
import stylesFunc from './styles';

let timeOut = undefined;

var tempQty = 0;
var noMoreData = false;

const filtersData = [
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
        labelValue: 'most_purcahsed',
        parent: strings.SORT_BY,
      },
    ],
  },
];

import { enableFreeze } from 'react-native-screens';
import EcomHeader from '../../Components/EcomHeader';
import FilterCompEcom from '../../Components/FilterCompEcom';
import ProductCardEcom from '../../Components/ProductCardEcom';
import SortCompEcom from '../../Components/SortCompEcom';
import staticStrings from '../../constants/staticStrings';
import { shortCodes } from '../../utils/constants/DynamicAppKeys';
enableFreeze(true);

export default function Products({ route, navigation }) {
  const bottomSheetRef = useRef(null);
  let selectedFilters = useRef(null);
  let selectedSorts = useRef(null);
  const { data } = route.params;



  const routeData = data?.fetchOffers;
  const { blurRef } = useRef();
  const theme = useSelector(state => state?.initBoot?.themeColor);
  const dine_In_Type = useSelector(state => state?.home?.dineInType);
  const dineInType = useSelector(state => state?.home?.dineInType);
  const CartItems = useSelector(state => state?.cart?.cartItemCount);
  const reloadData = useSelector(state => state?.reloadData?.reloadData);

  const [activeIdx, setActiveIdx] = useState(0);

  const toggleTheme = useSelector(state => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  const sectionListRef = useRef(null);
  const flatRef = useRef(null);

  const [currentActivePage, setCurrentActivePage] = useState({
    current_page: 1,
    last_page: 1,
  });

  const [state, setState] = useState({
    sortFilters: filtersData,
    searchInput: '',
    pageNo: 1,
    lastPage: null,
    limit: 10,
    selectedItemID: -1,
    selectedDiffAdsOnId: 0,
    minimumPrice: 0,
    maximumPrice: 50000,
    typeId: null,
    cartId: null,
    selectedItemIndx: null,
    // selectedSortFilter: {id: 1,
    //   label: "A to Z",
    //   labelValue: "a_to_z",
    //   parent: "Sort by",},
    selectedSortFilter: null,
    updateQtyLoader: false,
    isSearch: false,
    isLoadingC: false,
    AnimatedHeaderValue: false,
    btnLoader: false,
    offersModalVisible: false,
    MenuModalVisible: false,
    updateTagFilter: false,
    differentAddsOnsModal: false,
    isShowFilter: false,
    isShowSort: false,
    showListEndLoader: false,

    slider1ActiveSlide: 0,
    productId: null,
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
    selectedVariant: null,
    selectedOption: null,
    isProductImageLargeViewVisible: false,
    startDateRental: new Date(),
    endDateRental: new Date(),
    isRentalStartDatePicker: false,
    isRentalEndDatePicker: false,
    rentalProductDuration: null,
    isVarientSelectLoading: false,
    productDetailNew: {},
    isProductAvailable: false,
    wrapperListLoader: false,
    totalProducts: 0,
  });
  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    internetConnection,
    appStyle,
  } = useSelector(state => state?.initBoot);
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  let businessType = appData?.profile?.preferences?.business_type || null;

  const {
    isLoadingC,
    pageNo,
    lastPage,
    limit,
    minimumPrice,
    maximumPrice,
    AnimatedHeaderValue,
    updateQtyLoader,
    cartId,
    isSearch,
    searchInput,
    btnLoader,
    selectedItemID,
    selectedItemIndx,
    typeId,
    offersModalVisible,
    MenuModalVisible,
    updateTagFilter,
    differentAddsOnsModal,
    selectedDiffAdsOnId,
    isShowFilter,
    isShowSort,
    selectedSortFilter,
    showListEndLoader,
    variantSet,
    addonSet,
    productDetailData,
    showErrorMessageTitle,
    productTotalQuantity,
    productPriceData,
    productSku,
    productVariantId,
    productQuantityForCart,
    selectedVariant,
    selectedOption,
    isProductImageLargeViewVisible,
    startDateRental,
    endDateRental,
    isRentalStartDatePicker,
    isRentalEndDatePicker,
    rentalProductDuration,
    isVarientSelectLoading,
    productDetailNew,
    isProductAvailable,
    wrapperListLoader,
    totalProducts,
  } = state;
  const [showShimmer, setShowShimmer] = useState(true);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [productListData, setProductListData] = useState([]);
  const [sectionListData, setSectionListData] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [listendLoad, stListendLoader] = useState(false);
  const [repeatItems, setRepeatItems] = useState(null);
  const [isAddonLoading, setIsAddonLoading] = useState(false);
  const [isRepeastModal, setIsRepeatModal] = useState(false);
  const [selectedCartItem, setSelectedCarItems] = useState(null);
  const [differentAddsOns, setDifferentAddsOns] = useState([]);
  const [selectedDiffAdsOnItem, setSelectedDiffAdsOnItem] = useState(null);
  const [selectedDiffAdsOnSection, setSelectedDiffAdsOnSection] =
    useState(null);
  const [allFilters, setAllFilter] = useState([]);
  const [ProductTags, setProductTags] = useState([]);
  const [offerList, setOfferList] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [storeLocalQty, setStoreLocalQty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productListId, setProductListId] = useState(data);
  const [isLoading, setLoading] = useState(true);
  const [apiHitAgain, setApiHitAgain] = useState(false);
  const [animateText, setAnimateText] = useState(0);
  const [isSingleVendor, setIsSingleVendor] = useState({});
  const [filteredAtoZData, setFilteredAtoZData] = useState([]);
  const [
    productDataLengthAfterViewMoreSearch,
    setProductDataLengthAfterViewMoreSearch,
  ] = useState([1]);
  const [currentPage, setCurrentPage] = useState({
    current_page: 1,
    id: 0,
  });
  const [tagFilteredData, setTagFilteredData] = useState([]);
  const [isFilteredData, setIsFilteredData] = useState(false);
  const [isSocialMediaModal, setIsSocialMediaModal] = useState(false);
  const [isLoadMoreData, setIsLoadMoreData] = useState(false);
  const [hideViewMore, setHideViewMore] = useState(true);

  const [isTimeIntervals, setIsTimeIntervals] = useState(false);
  const [productAvailableIntervals, setProductAvailableIntervals] = useState(
    [],
  );
  const [selectedProductInterval, setSelectedProductInterval] = useState({});
  const [isLoadingProductSlotIntervals, setIsLoadingProductSlotIntervals] =
    useState(false);
  const [isLoadingGetSlots, setLoadingGetSlots] = useState(false);
  const [isAppointmentPicker, setAppointmentPicker] = useState(false);
  const [appointmentSelectedDate, setAppointmentSelectedDate] = useState(null);
  const [appointmentAvailableSlots, setAppointmentAvailableSlots] = useState(
    [],
  );
  const [selectedAppointmentSlot, setSelectedAppointmentSlot] = useState({});
  const [isAppointmentSlotsModal, setAppointmentSlotsModal] = useState(false);
  const [selectedAppointmentIndx, setSelectedAppointmentIndx] = useState(null);
  const [isDatePicker, setIsDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableVendorSlots, setAvailableVendorSlots] = useState([]);
  const [isAvailableSlotsModal, setAvailableSlotsModal] = useState(false);
  const [selectedProductForAppointment, setSelectedProductForAppointment] =
    useState(null);
  const [appointmentDispatcherAgentSlots, setAppointmentDispatcherAgentSlots] =
    useState([]);
  const [allDispatcherAgents, setAllDispatcherAgents] = useState([]);
  const [availableDriversForSlot, setAvailableDriversForSlot] = useState([]);
  const [
    selectedAllProductDataForAppointment,
    setSelectedAllProductDataForAppointment,
  ] = useState({});
  const [selectedAgent, setSelectedAgent] = useState({});
  const [pressedItemInx, setPressedItemInx] = useState(0);

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });
  const styles = stylesFunc({ themeColors, fontFamily, isDarkMode, MyDarkTheme });

  //Saving the initial state
  const initialState = cloneDeep(state);
  //Logged in user data
  const userData = useSelector(state => state?.auth?.userData);
  //app Main Data
  const { appMainData, location } = useSelector(state => state?.home);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}, isPush = false) =>
      () => {
        if (isPush) {
          navigation.push(screenName, { data });
        } else {
          navigation.navigate(screenName, { data });
        }
      };

  const updateState = data => {
    setState(state => ({ ...state, ...data }));
  };

  const [variantState, setVariantState] = useState({
    planValues: ['Daily', 'Weekly', 'Custom', 'Alternate Days'],
    weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    quickSelection: ['Weekdays', 'Weekends'],
    showCalendar: false,
    reccuringCheckBox: false,
    selectedPlanValues: '',
    selectedWeekDaysValues: [],
    selectedQuickSelectionValue: '',
    minimumDate: moment(new Date()).add(2, 'days').format('YYYY-MM-DD'),
    initDate: new Date(),
    start: {},
    end: {},
    period: {},
    disabledDaysIndexes: [],
    selectedDaysIndexes: [],
    date: new Date(),
    showDateTimeModal: false,
    slectedDate: new Date(),
  });

  const {
    planValues,
    reccuringCheckBox,
    showCalendar,
    selectedPlanValues,
    minimumDate,
    weekDays,
    quickSelection,
    start,
    end,
    period,
    selectedWeekDaysValues,
    selectedQuickSelectionValue,
    initDate,
    disabledDaysIndexes,
    selectedDaysIndexes,
    date,
    showDateTimeModal,
    slectedDate,
  } = variantState;
  const updateAddonState = data => {
    setVariantState(state => ({ ...state, ...data }));
  };

  const resetVariantState = () => {
    updateAddonState({
      planValues: ['Daily', 'Weekly', 'Alternate Days', 'Custom'],
      weekDays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      quickSelection: ['Weekdays', 'Weekends'],
      reccuringCheckBox: false,
      showCalendar: false,
      selectedPlanValues: '',
      selectedWeekDaysValues: [],
      selectedQuickSelectionValue: '',
      minimumDate: moment(new Date()).add(2, 'days').format('YYYY-MM-DD'),
      initDate: new Date(),
      start: {},
      end: {},
      period: {},
      disabledDaysIndexes: [],
      selectedDaysIndexes: [],
      date: new Date(),
      showDateTimeModal: false,
      slectedDate: new Date(),
    });
  };

  //usecallback functions

  const goToProductDetail = data => {
    navigation.navigate(navigationStrings.PRODUCTDETAIL, {
      data,
      isProductList: true,
    });
  };

  const onPressCategory = useCallback((item) => {
    if (item?.redirect_to == staticStrings.P2P) {
      moveToNewScreen(navigationStrings.P2P_PRODUCTS, item)();
      return;
    }
    if (item?.redirect_to == staticStrings.FOOD_TEMPLATE) {
      moveToNewScreen(navigationStrings.SUBCATEGORY_VENDORS, item)();

      return;
    }
    if (item.redirect_to == staticStrings.VENDOR) {

      moveToNewScreen(navigationStrings.VENDOR, item)();
    } else if (
      item.redirect_to == staticStrings.PRODUCT ||
      item.redirect_to == staticStrings.CATEGORY ||
      item.redirect_to == staticStrings.ONDEMANDSERVICE ||
      item?.redirect_to == staticStrings.LAUNDRY ||
      item?.redirect_to == staticStrings.APPOINTMENT ||
      item?.redirect_to == staticStrings.RENTAL
    ) {
      moveToNewScreen(navigationStrings.PRODUCT_LIST, {
        fetchOffers: true,
        id: item.id,
        vendor:
          item.redirect_to == staticStrings.ONDEMANDSERVICE ||
            item.redirect_to == staticStrings.PRODUCT ||
            item?.redirect_to == staticStrings.LAUNDRY ||
            item?.redirect_to == staticStrings.APPOINTMENT ||
            item?.redirect_to == staticStrings.RENTAL
            ? false
            : true,
        name: item.name,
        isVendorList: false,
      }, true)();
    } else if (item.redirect_to == staticStrings.PICKUPANDDELIEVRY) {
      if (!!userData?.auth_token) {
        if (shortCodes.arenagrub == appData?.profile?.code) {
          //   openUber();
        } else {
          item['pickup_taxi'] = true;
          moveToNewScreen(navigationStrings.ADDADDRESS, item)();
        }
      } else {
        actions.setAppSessionData('on_login');
      }
    } else if (item.redirect_to == staticStrings.DISPATCHER) {
      // moveToNewScreen(navigationStrings.DELIVERY, item)();
    } else if (item.redirect_to == staticStrings.CELEBRITY) {
      moveToNewScreen(navigationStrings.CELEBRITY)();
    } else if (item.redirect_to == staticStrings.BRAND) {
      moveToNewScreen(navigationStrings.CATEGORY_BRANDS, item)();
    } else if (item.redirect_to == staticStrings.SUBCATEGORY) {
      // moveToNewScreen(navigationStrings.PRODUCT_LIST, item)();
      moveToNewScreen(navigationStrings.VENDOR_DETAIL, { item })();
    } else if (!item.is_show_category || item.is_show_category) {
      item?.is_show_category
        ? moveToNewScreen(navigationStrings.VENDOR_DETAIL, {
          item,
          rootProducts: true,
          // categoryData: data,
        })()
        : moveToNewScreen(navigationStrings.PRODUCT_LIST, {
          id: item?.id,
          vendor: true,
          name: item?.name,
          isVendorList: true,
          fetchOffers: true,
        })();
    }
  }, [])


  const seeAllCategory = useCallback(item => {

    console.log("item", item)
    onPressCategory(item)

    return
    let data = {
      id: item.id,
      vendor: false,
      name: item.translation[0].name,
      fetchOffers: true,
    }
    navigation.push(navigationStrings.PRODUCT_LIST, { data });
  }, []);




  const renderSectionItem = useCallback(
    ({ item, index, section }) => {
      return (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: moderateScale(12),
            }}>
            <Text
              style={{
                paddingVertical: moderateScale(8),
                fontSize: scale(21),
                fontWeight: 'bold',
              }}>
              {item?.translation[0]?.name}
            </Text>
            <TouchableOpacity onPress={() => seeAllCategory(item)}>
              <Text>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={item?.data}
            ItemSeparatorComponent={() => (
              <View style={{ height: moderateScaleVertical(10) }} />
            )}
            renderItem={props => (
              <ProductCardEcom
                data={props.item}
                index={props.index}
                onPress={() => goToProductDetail(props.item)}
                onAddtoWishlist={() =>
                  _onAddtoWishlist(props.item, props.index, index)
                }
                addToCart={() => () => { }}
                onIncrement={() => () => { }}
                onDecrement={() => () => { }}
                selectedItemID={selectedItemID}
                btnLoader={false}
                selectedItemIndx={selectedItemIndx}
                differentAddsOns={differentAddsOns}
                businessType={businessType}
                categoryInfo={categoryInfo}
                animateText={animateText}
                section={section}
                CartItems={CartItems}
                wrapperListLoader={wrapperListLoader}
              />
            )}
          />
        </View>
      );
    },
    [
      btnLoader,
      productListId,
      repeatItems,
      cartId,
      categoryInfo,
      CartItems,
      selectedAppointmentSlot,
      appointmentSelectedDate,
      wrapperListLoader,
    ],
  );

  const getItemLayoutFlat = (data, index) => ({
    length: height / 2.2,
    offset: (height / 2.2) * Math.floor(index / 2),
    index,
  });

  const getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) =>
      sectionIndex === 0 ? moderateScale(200) : moderateScale(200),
    // These three properties are optional

    getSectionHeaderHeight: () => moderateScale(50), // The height of your section headers
    getSectionFooterHeight: () => moderateScale(50),
    getSeparatorHeight: () => moderateScale(8),
  });

  const renderSectionHeader = useCallback(
    props => {
      const { section } = props;

      console.log('propspropsprops', sectionListData[0].id);
      return (
        <View
          style={{
            ...commonStyles.shadowStyle,
            // marginHorizontal: moderateScale(16),
            // marginVertical: moderateScaleVertical(8),
            // height: moderateScale(50),
            // paddingTop: moderateScaleVertical(8),
            // backgroundColor: colors.white,
            paddingHorizontal: moderateScale(16),
            paddingVertical: moderateScaleVertical(4),
            flexDirection: 'row',
          }}>
          <Text
            style={{
              ...styles.hdrTitleTxt,
              color: isDarkMode ? colors.white : colors.black,
            }}>
            {section?.translation[0]?.name}
          </Text>

          {sectionListData[0].id == section.id ? filterView() : null}
        </View>
      );
    },
    [sectionListData],
  );

  const renderSectionTab = useCallback(
    props => {
      const { translation, isActive, index } = props;

      if (isActive) {
        // activeIdx = props.index;
      }
      if (!AnimatedHeaderValue) {
        return <TouchableOpacity style={{ width: 40 }} />;
      }
      return (
        <View
          // animation={'fadeInUp'}
          style={{
            marginTop: moderateScaleVertical(4),
            marginLeft: moderateScale(12),
            marginBottom: moderateScaleVertical(16),
            padding: 4,
            borderBottomWidth: 3,
            borderColor: props.isActive
              ? themeColors.primary_color
              : colors.transparent,
          }}>
          <TouchableOpacity onPress={() => scrollHeader(index)}>
            <Text
              style={{
                fontFamily: fontFamily.medium,
                color: isDarkMode ? colors.white : colors.black,
              }}>
              {translation[0]?.name}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [AnimatedHeaderValue],
  );

  const awesomeChildListKeyExtractor = useCallback(
    item => `awesome - child - key - ${item?.id} `,
    [productListData, sectionListData],
  );

  const listEmptyComponent = useCallback(() => {
    return (
      <NoDataFound
        isLoading={isLoading}
        containerStyle={{}}
        text={strings.NOPRODUCTFOUND}
      />
    );
  }, [isLoading, productListData, sectionListData]);

  const listFooterComponent = () => {
    return (
      <>
        {totalProducts.length !== productListData.length && (
          <View style={{ height: moderateScale(60) }}>
            <UIActivityIndicator color={themeColors?.primary_color} />
          </View>
        )}
      </>
    );
  };

  const renderProduct = useCallback(
    ({ item, index }) => {
      return (
        <View key={String(index)} style={{ width: width / 2 }}>
          <ProductCardEcom
            data={item}
            index={index}
            onPress={() => goToProductDetail(item)}
            onAddtoWishlist={() => _onAddtoWishlist(item, index)}
            addToCart={() => () => { }}
            onIncrement={() => () => { }}
            onDecrement={() => () => { }}
            selectedItemID={selectedItemID}
            btnLoader={false}
            selectedItemIndx={selectedItemIndx}
            differentAddsOns={differentAddsOns}
            businessType={businessType}
            categoryInfo={categoryInfo}
            animateText={animateText}
          // section={section}
          />
          {/* <View style={{ ...styles.horizontalLine, marginVertical: moderateScaleVertical(6) }} /> */}
        </View>
      );
    },
    [
      productListData,
      btnLoader,
      productListId,
      repeatItems,
      cartId,
      categoryInfo,
      selectedAppointmentSlot,
      appointmentSelectedDate,
      isDarkMode,
    ],
  );

  const preLoadImages = async data => {
    data.map(item => {
      item?.data.map(val => {
        if (val?.media?.length > 0) {
          const url1 = val?.media[0]?.image?.path?.image_fit;
          const url2 = val?.media[0]?.image?.path?.image_path;
          FastImage.preload([{ uri: getImageUrl(url1, url2, '200/200') }]);
        }
      });
    });
  };

  const horizontalLine = useCallback(
    (style = {}) => {
      return (
        <View
          style={{
            height: 2,
            backgroundColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.blackOpacity10,
            marginVertical: moderateScaleVertical(8),
            ...style,
          }}
        />
      );
    },
    [isDarkMode],
  );

  const SortView = () => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={onShowHideSort}
        activeOpacity={0.7}
        style={{
          borderLeftWidth: 1,
          padding: moderateScale(6),
          borderLeftColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.blackOpacity10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...styles.filterText,
            color: themeColors?.primary_color,
          }}>
          Sort
        </Text>
        <Image
          source={imagePath.filter}
          style={{
            tintColor: isDarkMode ? colors.white : themeColors.primary_color,
            height: moderateScale(14),
            width: moderateScale(14),
          }}
        />
      </TouchableOpacity>
    </View>
  );

  const filterView = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {offersModalVisible && (
          <TouchableOpacity
            onPress={() =>
              updateState({ offersModalVisible: !offersModalVisible })
            }
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: moderateScale(8),
            }}>
            <View
              style={{
                backgroundColor: colors.greyColor,
                width: moderateScale(30),
                height: moderateScale(30),
                borderRadius: moderateScale(30),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image source={imagePath.ic_offersIcon} />
            </View>
            <Text
              style={{
                ...styles.milesTxt,
                color: isDarkMode ? colors.white : colors.black,
                opacity: 1,
                fontSize: textScale(10),
              }}>
              {strings.OFFERS}
            </Text>
            <Image
              source={imagePath.icBackb}
              style={{
                transform: [{ rotate: '-90deg' }],
                width: moderateScale(11),
                height: moderateScale(11),
                resizeMode: 'contain',
                marginLeft: moderateScale(6),
              }}
            />
          </TouchableOpacity>
        )}
        {
          <TouchableOpacity
            onPress={onShowHideFilter}
            activeOpacity={0.7}
            style={{
              borderLeftWidth: 1,
              padding: moderateScale(6),
              borderLeftColor: isDarkMode
                ? colors.whiteOpacity22
                : colors.blackOpacity10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                ...styles.filterText,
                color: themeColors?.primary_color,
              }}>
              Filters
            </Text>
            <Image
              source={imagePath.filter}
              style={{
                tintColor: isDarkMode
                  ? colors.white
                  : themeColors.primary_color,
                height: moderateScale(14),
                width: moderateScale(14),
              }}
            />
          </TouchableOpacity>
        }
      </View>
    );
  };

  const listHeaderComponent2 = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: moderateScaleVertical(8),
          }}>
          {!!categoryInfo?.is_show_products_with_category ? (
            <View />
          ) : (
            <View style={{ marginHorizontal: moderateScale(4) }}>
              <Text
                style={{
                  ...styles.filterText,
                  marginVertical: moderateScaleVertical(8),
                  color: isDarkMode ? colors.white : colors.black,
                }}>{`Results (${totalProducts})`}</Text>
            </View>
          )}
          <View style={{ flexDirection: 'row' }}>
            {allFilters.length > 0 ? filterView() : null}
            {SortView()}
          </View>
        </View>
        {horizontalLine({
          marginVertical: 0,
          marginBottom: moderateScaleVertical(8),
        })}
      </View>
    );
  };

  //useCallback end

  useLayoutEffect(() => {
    // setLoading(true)
    updateState({ pageNo: 1 });
    setSelectedAppointmentSlot({});
    getAllListItems(1);
    if (productListId?.vendor && routeData) {
      fetchOffers();
    }
    return () => noMoreData = false
  }, []);

  const getAllProductTags = () => {
    actions
      .getAllProductTags(
        '',
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        const productTagsArr = res?.data?.map(el => {
          return {
            ...el,
            isSelected: false,
          };
        });
        setProductTags(productTagsArr);

        // if (res && res.data) {
        //   updateState({allAvailableCoupons: res.data});
        // }
      })
      // .catch(errorMethod);
      .catch(error => {
        console.log('tags api error >>>>>', error);
      });
  };

  const getAllListItems = (pageNo = 1) => {
    if (data?.vendor) {
      {
        !!selectedFilters.current || !!selectedSorts.current
          ? newVendorFilter(pageNo)
          : getAllProductsByVendor(pageNo);
      }
    } else {
      {
        !!selectedFilters.current || !!selectedSorts.current
          ? getAllProductsCategoryFilter(pageNo)
          : getAllProductsByCategoryId(pageNo);
      }
    }
  };

  useLayoutEffect(() => {
    getAllVendorFilters();
  }, []);

  const getAllVendorFilters = () => {
    actions
      .getVendorFilters(
        `/ ${productListId?.id} `,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        console.log('getAllVendorFiltersgetAllVendorFilters', res);
        if (!!res.data.filterData?.length) {
          let filterDataNew = res.data.filterData.map((i, inx) => {
            return {
              id: i.variant_type_id,
              label: i.title,
              value: i.options.map((j, jnx) => {
                return {
                  id: j.id,
                  parent: i.title,
                  label: j.title,
                  variant_type_id: i.variant_type_id,
                };
              }),
            };
          });
          setAllFilter(filterDataNew);
        }
        // getAllVendorFilters()
      })
      .catch(errorMethod);
    // }
  };

  const updateBrandAndCategoryFilter = (filterData, allBrands) => {
    var brandDatas = [];
    var filterDataNew = [];
    if (!!filterData?.length) {
      filterDataNew = filterData.map((i, inx) => {
        return {
          id: i.variant_type_id,
          label: i.title,
          value: i.options.map((j, jnx) => {
            return {
              id: j.id,
              parent: i.title,
              label: j.title,
              variant_type_id: i.variant_type_id,
            };
          }),
        };
      });
      console.log('filterDataNewfilterDataNewfilterDataNew', filterDataNew);
      setAllFilter(filterDataNew);
    }
  };


  const onFilterApply = (
    filterData = {},
    currentVariants = allFilters,
    type = '',
  ) => {
    if (type == 'sort') {
      selectedSorts.current = filterData;
    } else {
      selectedFilters.current = filterData;
    }
    setAllFilter(currentVariants);
    updateState({ pageNo: 1 });
    noMoreData = false;
    getAllListItems(1);
  };
  const allClearFilters = () => {
    selectedFilters.current = null;
    updateState({
      pageNo: 1,
      selectedSortFilter: null,
      minimumPrice: 0,
      maximumPrice: 50000,
    });
    getAllVendorFilters();
    getAllListItems(1);
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendor = pageNo => {
    setLoading(true);

    updateState({ wrapperListLoader: true });
    let vendorId = !!data?.vendorData ? data?.vendorData.id : productListId.id;

    let apiData = `/${vendorId}?page=${pageNo ? pageNo : 1
      }&type=${dineInType}&limit=${limit}`;

    if (!!data?.categoryExist) {
      //sent category id if user comes from category>>vendor>>productList
      apiData = apiData + `&category_id=${data?.categoryExist}`;
    }
    actions.getProductByVendorIdOptamizeV2(
        apiData,
        {},
        {
          code: appData.profile.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          latitude: appMainData?.reqData?.latitude,
          longitude: appMainData?.reqData?.longitude,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(async res => {
        console.log('get all products by vendor res without filter', res?.data);
        setLoading(false);
        updateState({ wrapperListLoader: false });

        if (res?.data?.vendor?.is_show_products_with_category) {
          let resData = res?.data?.categories || [];
          console.log('resDataresDataresData', resData);
          setSectionListData(resData);
          // setFilterData(res?.data?.filterData)
          setCategoryInfo(res?.data?.vendor);
          fetchTags(resData);
          setLoading(false);
        } else {
          if (!!res?.data) {
            if (res?.data?.products.data.length == 0) {
              noMoreData = true;
            } else {
              noMoreData = false;
            }
            updateState({ lastPage: res?.data?.products?.last_page });
            setCategoryInfo(res?.data?.vendor);
            setLoading(false);
            setProductListData(
              pageNo == 1
                ? res?.data?.products.data
                : [...productListData, ...res?.data?.products.data],
            );
            updateState({
              totalProducts: res?.data?.products?.total || 0,
            });
          } else {
            setLoading(false);
            noMoreData = false;
          }
        }
        if (!!res?.data) {
          updateBrandAndCategoryFilter(
            res?.data?.filterData,
            appMainData?.brands,
          );
        }
      })
      .catch(errorMethod);
  };

  //***************get products by vendor filter**************
  const newVendorFilter = async (pageNo, loading = false) => {
    let data = {};
    data['variants'] = selectedFilters?.current?.selectedVariants || [];
    data['options'] = selectedFilters?.current?.selectedOptions || [];
    data['brands'] = selectedFilters?.current?.sleectdBrands || [];
    data['order_type'] = selectedSorts?.current?.selectedSorting || 0;
    data['range'] = `${minimumPrice};${maximumPrice}`;
    data['vendor_id'] = productListId.id;
    data['limit'] = limit;
    data['page'] = pageNo;
    data['type'] = dineInType;
    data['tag_products'] =
      ProductTags && ProductTags?.length
        ? ProductTags.map(i => {
          return i?.isSelected ? i?.id : null;
        }).filter(x => x != null)
        : [];
    console.log('sending data filters', data);
    setLoading(loading ? false : true);
    actions
      .newVendorFilters(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(async res => {
        console.log(
          'get all products by vendor res with filter',
          res?.data?.products.data,
        );

        if (res?.data?.vendor?.is_show_products_with_category) {
          let resData = res?.data?.categories || [];
          // await preLoadImages(resData);
          setSectionListData(resData);
          // setFilterData(res?.data?.filterData)
          setCategoryInfo(res?.data?.vendor);
          // fetchTags(resData);
          setLoading(false);
        } else {
          // console.log('get product list by vendor id >>>> ', res);
          if (res?.data) {
            if (res?.data?.products?.data?.length == 0) {
              noMoreData = true;
            } else {
              noMoreData = false;
            }
            setCategoryInfo(res?.data?.vendor);
            setLoading(false);
            setProductListData(
              pageNo == 1
                ? res.data.products.data
                : [...productListData, ...res.data.products.data],
            );
            updateState({ totalProducts: res?.data?.products?.total || 0 });
          } else {
            setLoading(false);
          }
        }
        if (res?.data) {
          updateBrandAndCategoryFilter(
            res.data.filterData,
            appMainData?.brands,
          );
        }
      })
      .catch(errorMethod);
    // }
  };
  /**********Get all list items by category id productListData*/


  const getAllProductsByCategoryId = pageNo => {
    const productWithCategoryId = data?.productWithSingleCategory
      ? data?.id
      : productListId?.id;
    const rootproduct =
      data?.rootProducts || data?.productWithSingleCategory ? true : false;
    console.log('<==api hit getProductByCategoryIdOptamize');
    actions
      .getProductByCategoryIdOptamize(
        `/${productWithCategoryId}?page=${pageNo}&product_list=${data?.rootProducts ? true : false
        }&type=${dineInType} `,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        // console.log(res, 'resres');
        if (!!res?.data) {
          console.log(res, 'res getProductByCategoryId');
          setCategoryInfo(categoryInfo ? categoryInfo : res.data.category);
          setLoading(false);

          if (res?.data?.listData?.to == res?.data?.listData?.total) {
            noMoreData = true
          }
          setProductListData(
            pageNo == 1
              ? res.data.listData.data
              : [...productListData, ...res.data.listData.data],
          );
          updateState({
            totalProducts: res?.data?.listData?.total,
          });
          if (
            pageNo == 1 &&
            res?.data?.listData?.data?.length == 0 &&
            res?.data?.category &&
            res?.data?.category?.childs?.length
          ) {
            setSelectedCategory(res.data.category.childs[0]);
            setProductListId(res.data.category.childs[0]);
            updateState({
              pageNo: 1,
              limit: 10,
              isLoadingC: true,
              lastPage: res?.data?.listData?.last_page,
              totalProducts: res?.data?.listData?.total,
            });
          }
        }
        setLoading(false);
        updateState({
          lastPage: res.data.listData?.last_page,
        });
      })

      .catch(errorMethod);
    // }
  };



  /**********Get all list items category filters */
  const getAllProductsCategoryFilter = useCallback(
    pageNo => {
      let data = {};
      data['variants'] = selectedFilters?.current?.selectedVariants || [];
      data['options'] = selectedFilters?.current?.selectedOptions || [];
      data['brands'] = selectedFilters?.current?.sleectdBrands || [];
      data['order_type'] = selectedSorts?.current?.selectedSorting || 0;
      data['range'] = `${minimumPrice};${maximumPrice}`;
      console.log('api hit getAllProductsCategoryFilter', data);

      actions
        .getProductByCategoryFiltersOptamize(
          `/${productListId.id}?page=${pageNo}&product_list=${data?.rootProducts ? true : false
          }&type=${dineInType}`,
          data,
          {
            code: appData?.profile?.code,
            currency: currencies?.primary_currency?.id,
            language: languages?.primary_language?.id,
            systemuser: DeviceInfo.getUniqueId(),
          },
        )
        .then(res => {
          setLoading(false);
        })
        .catch(errorMethod);
      // }
    },
    [productListData],
  );

  const fetchTags = filterArray => {
    if (filterArray && filterArray?.length > 0) {
      let tagsArr = [];
      filterArray.forEach(el => {
        // console.log('checking data for tags >>>', el);
        el.data.forEach(data_ => {
          if (data_ && data_.tags) {
            tagsArr.push(...data_.tags);
          }
        });
      });
      tagsArr = _.uniqBy(tagsArr, 'tag_id');
      let productTagsArr = tagsArr.map(el => {
        return {
          ...el.tag,
          isSelected: false,
        };
      });

      setProductTags(productTagsArr);
    }
  };

  /*********Add product to wish list******* */
  const _onAddtoWishlist = (item, index, parentIndex = null) => {
    playHapticEffect(hapticEffects.impactLight);
    if (!!userData?.auth_token) {
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
        .then(res => {
          console.log(res, 'updateProductWishListData');
          showSuccess(res.message);
          if (parentIndex !== null) {
            let cloneArr = [...sectionListData];
            let cloneArrInner = cloneArr[parentIndex];
            cloneArrInner.data[index].inwishlist = !item?.inwishlist;
            setSectionListData(cloneArr);
          } else {
            let cloneArr = [...productListData];
            cloneArr[index].inwishlist = !item?.inwishlist;
            setProductListData(cloneArr);
          }
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  const errorMethod = error => {
    console.log('checking error', error);
    updateState({
      updateQtyLoader: false,
      selectedItemID: -1,
      btnLoader: false,
      wrapperListLoader: false,
    });
    noMoreData = false;
    setLoading(false);
    if (error?.message == 'Recurring booking type not be empty.') {
      showSuccess('Schedule the product in product detail page');
    } else {
      showError(error?.message || error?.error);
    }
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1 });
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    if (!noMoreData) {
      updateState({ pageNo: pageNo + 1 });
      getAllListItems(pageNo + 1);
      setLoading(false);
    }
  };

  // const onEndReachedDelayed = debounce(onEndReached, 1000, {
  //   leading: true,
  //   trailing: false,
  // });

  const hideDifferentAddOns = () => {
    updateState({ differentAddsOnsModal: false });
    setDifferentAddsOns([]);
  };

  const onCloseModal = () => {
    setIsVisibleModal(false);
    setShowShimmer(true);
    resetVariantState();
  };

  const addDeleteCartItems = async (
    item,
    isExistqty,
    isExistproductId,
    isExistCartId,
    section = null,
    index,
    type,
    updateLocalQty = null,
    differentAddsOnsQty = null,
  ) => {
    console.log('categoryInfocategoryInfo', index);
    if (
      !!categoryInfo?.is_vendor_closed &&
      !categoryInfo?.show_slot &&
      !categoryInfo?.closed_store_order_scheduled
    ) {
      if (type == 1) {
        //user can remove item if vendor closed
        alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
        return;
      }
    }
    let quantityToIncreaseDecrease = !!item?.batch_count
      ? Number(item?.batch_count)
      : 1;
    // playHapticEffect(hapticEffects.impactLight);

    let quanitity = null;
    let itemToUpdate = cloneDeep(item);

    console.log('exist qty', isExistqty);
    /** This will restring unneccessary api call , only hit api once user wait for 1.5 seconds ***/

    if (timeOut) {
      clearTimeout(timeOut);
    }

    tempQty = tempQty + 1;

    if (type == 1) {
      quanitity = Number(isExistqty) + quantityToIncreaseDecrease;
    } else {
      if (
        Number(isExistqty - item?.batch_count) <
        Number(item?.minimum_order_count)
      ) {
        quanitity = 0;
      } else {
        quanitity = Number(isExistqty) - quantityToIncreaseDecrease;
      }
    }

    updateLocally(
      section,
      quanitity,
      item,
      isExistproductId,
      differentAddsOnsQty,
      index,
    );

    timeOut = setTimeout(
      () => {
        if (quanitity) {
          updateState({
            selectedItemID: itemToUpdate.id,
            btnLoader: true,
            selectedItemIndx: index,
            wrapperListLoader: true,
          });
          let data = {};
          data['cart_id'] = isExistCartId;
          data['quantity'] = !!updateLocalQty
            ? type == 1
              ? updateLocalQty + quantityToIncreaseDecrease
              : updateLocalQty - quantityToIncreaseDecrease
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
            .then(res => {
              console.log('update qty res', res);
              tempQty = 0;
              actions.cartItemQty(res);
              setAnimateText(res.data.total_payable_amount);
              updateState({
                cartItems: res.data.products,
                cartData: res.data,
                updateQtyLoader: false,
                selectedItemID: -1,
                btnLoader: false,
                wrapperListLoader: false,
              });
            })
            .catch(async () => {
              errorMethod();
              if (type == 1) {
                quanitity = quanitity - tempQty;
              } else {
                quanitity = quanitity + tempQty;
              }
              updateLocally(section, quanitity, item, isExistproductId);
              tempQty = 0;
            });
        } else {
          updateState({
            selectedItemID: itemToUpdate?.id,
            btnLoader: false,
            wrapperListLoader: false,
          });
          removeItem('selectedTable');
          removeProductFromCart(itemToUpdate, section, isExistproductId);
        }
      },
      quanitity === 1 ? 0 : 900,
    );
  };

  const updateLocally = (
    section,
    quanitity,
    item,
    isExistproductId,
    differentAddsOnsQty,
    index,
  ) => {
    console.log('quanitity', quanitity);
    console.log('quanitity localy', differentAddsOnsQty);

    // return;
    if (!!section) {
      let itemSectionUpdate = cloneDeep(section);
      itemSectionUpdate.data[index].qty = !!differentAddsOnsQty
        ? differentAddsOnsQty
        : quanitity;
      itemSectionUpdate.data[index].cart_product_id = isExistproductId;

      let sectionItem = cloneDeep(sectionListData);
      sectionItem[section.index] = itemSectionUpdate;
      setSectionListData(sectionItem);
      fetchTags(sectionItem);
    } else {
      let updateArray = productListData.map((val, i) => {
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
      setStoreLocalQty(differentAddsOnsQty);
      setProductListData(updateArray);
      updateState({ selectedItemID: -1 });
    }
  };

  //decrementing/removeing products from cart
  const removeProductFromCart = (
    itemToUpdate,
    section = null,
    diffAdOnId = 0,
  ) => {
    // console.log("item to update remove item", itemToUpdate)

    let updateLocallyAddOns = [];
    if (differentAddsOnsModal) {
      let cloneArr = differentAddsOns;
      updateLocallyAddOns = cloneArr.filter(val => {
        if (diffAdOnId !== val.id) {
          return val;
        }
      });
      setDifferentAddsOns(updateLocallyAddOns);
    }

    let data = {};
    let isExistproductId = diffAdOnId;
    let isExistCartId =
      !!itemToUpdate?.check_if_in_cart_app &&
        !!itemToUpdate?.check_if_in_cart_app.length > 0
        ? itemToUpdate?.check_if_in_cart_app[0]?.cart_id
        : cartId;
    console.log('removeProductFromCart =>', itemToUpdate, 'cartId', cartId);

    data['cart_id'] = isExistCartId;
    data['cart_product_id'] = isExistproductId;
    data['type'] = dineInType;
    updateState({ btnLoader: true });
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        actions.cartItemQty(res);
        if (!!section) {
          let updatedSection = section.data.map((x, xnx) => {
            if (x?.id == itemToUpdate?.id) {
              return {
                ...x,
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
            return x;
          });
          section['data'] = updatedSection;

          const filterArr = sectionListData.map((f, fnx) => {
            if (f?.id == section?.id) {
              return section;
            }
            return f;
          });
          const filterArryClone = sectionListData.map((f, fnx) => {
            if (f?.id == section?.id) {
              return section;
            }
            return f;
          });
          setSectionListData(filterArr);

          updateState({
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        } else {
          let updateArray = productListData.map((val, i) => {
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
          setProductListData(updateArray);
          updateState({
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        }
      })
      .catch(errorMethod);
  };

  const errorMethodSecond = (error, addonSet = [], item, section, inx) => {
    console.log(error, 'Error>>>>>');
    console.log('sectin++++', section);
    updateState({ updateQtyLoader: false });
    if (error?.message?.alert == 1) {
      updateState({
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
        wrapperListLoader: false,
      });
      setLoading(false);
      // showError(error?.message?.error || error?.error);
      Alert.alert('', strings.ALREADY_EXIST, [
        {
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {
          text: strings.CLEARCART,
          onPress: () => clearCart(addonSet, item, section, inx),
        },
      ]);
    } else {
      setLoading(false);
      updateState({
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
        wrapperListLoader: false,
      });
      if (error?.message == 'Recurring booking type not be empty.') {
        showInfo('Schedule the product in product detail page');
      } else {
        showError(error?.message || error?.error);
      }
    }
  };

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
      .then(res => {
        actions.cartItemQty({});
        setIsVisibleModal(false);
      })
      .catch(error => {
        console.log(error, 'erorrrrrr');
      });
  };

  const onRepeat = async () => {
    console.log('repeate items', repeatItems);
    const { item, isExistqty, productId, parentCartId, updateLocalQty } =
      repeatItems;
    await addDeleteCartItems(
      item,
      isExistqty,
      productId,
      parentCartId,
      repeatItems?.section,
      repeatItems?.index,
      1,
      updateLocalQty,
    );
    setIsRepeatModal(false);
  };

  const onAddNew = () => {
    if (
      !!categoryInfo?.is_vendor_closed &&
      !categoryInfo?.show_slot &&
      !categoryInfo?.closed_store_order_scheduled
    ) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    let getTypeId =
      !!repeatItems?.item?.category &&
      repeatItems?.item?.category.category_detail?.type_id;
    setIsRepeatModal(false);
    setSelectedCarItems(repeatItems?.item);
    setIsVisibleModal(true);
    updateState({
      updateQtyLoader: false,
      typeId: getTypeId,
      selectedItemID: -1,
      btnLoader: false,
    });
  };

  const addProductsWithoutCustomize = (item, section, index, type) => {
    console.log('very nice', item);
    // return;
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
      addDeleteCartItems(
        item,
        quanitity,
        productId,
        parentCartId,
        section,
        index,
        1,
      );
    } else {
      addDeleteCartItems(
        item,
        quanitity,
        productId,
        parentCartId,
        section,
        index,
        2,
      );
    }
  };

  const getDiffAddsOn = async (apiData, section, item) => {
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
      if (res?.data?.length > 1) {
        setDifferentAddsOns(res?.data || []);
        setSelectedDiffAdsOnItem(item);
        setSelectedDiffAdsOnSection(section);
        updateState({ differentAddsOnsModal: true });
        return { data: res?.data, goNext: true };
      }
      return { data: res?.data, goNext: false };
    } catch (error) {
      console.log('error raised,error');
      return { data: null, goNext: false };
    }
  };

  const updateCartItems = (item, quanitity, productId, cartID) => {
    playHapticEffect(hapticEffects.impactLight);
    console.log('selcted section', selectedSection);
    console.log(
      'updateCartItems =============',
      item,
      quanitity,
      productId,
      cartID,
    );

    if (!!selectedSection) {
      let updatedSection = selectedSection.data.map((x, xnx) => {
        if (x?.id == item?.id) {
          return {
            ...x,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        return x;
      });
      selectedSection['data'] = updatedSection;
      const filterArr = sectionListData.map((f, fnx) => {
        if (f?.id == selectedSection?.id) {
          return selectedSection;
        }
        return f;
      });
      const filterArryClone = sectionListData.map((f, fnx) => {
        if (f?.id == selectedSection?.id) {
          return selectedSection;
        }
        return f;
      });
      setSectionListData(filterArr);
      setStoreLocalQty(quanitity);
      setIsVisibleModal(false);
      updateState({
        cartId: cartID,
      });
    } else {
      console.log('else');
      let updateArray = productListData.map((val, i) => {
        if (val.id == item.id) {
          return {
            ...val,
            qty: quanitity,
            cart_product_id: productId,
            isRemove: false,
          };
        }
        setStoreLocalQty(quanitity);
        return val;
      });
      setProductListData(updateArray);
      setIsVisibleModal(false);
      updateState({
        cartId: cartID,
      });
    }
  };

  const checkIfItemExist = (item, tags) => {
    let result = false;
    tags.forEach(el => {
      if (el.id === item.tag_id) {
        result = true;
      }
    });
    return result;
  };

  const onPressChildCards = item => {
    console.log(item, 'item upload');
    setSelectedCategory(item);
    setProductListId(item);
    updateState({
      pageNo: 1,
      limit: 10,
      isLoadingC: true,
    });
    // navigation.push(navigationStrings.PRODUCT_LIST, {data: item});
  };

  const fetchOffers = () => {
    let data = {};
    // data['vendor_id'] = 2;
    data['vendor_id'] = productListId?.id;
    // data['cart_id'] = vendorInfo.cartId;
    // console.log(data, 'vendor_id');
    actions
      .getAllPromoCodesForProductList(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(res => {
        console.log('res >>>>>>> offers >>>', res);
        if (res && res.data) {
          setOfferList(res.data);
        }
      });
    // .catch(errorMethod);
  };

  const onPressMenuOption = index => {
    setActiveIdx(index);
    updateState({ MenuModalVisible: !MenuModalVisible });
    sectionListRef.current.sectionList.current.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewPosition: 0,
      viewOffset: 1,
    });
  };

  const rightIconPress = () => {
    updateState({
      searchInput: '',
      isSearch: false,
    });
    setLoading(false);
  };

  const _onEndList = data => {
    console.log(data, 'data');
    !categoryInfo?.is_show_products_with_category && onEndReachedDelayed(data);
  };

  // renders

  const RenderMenuView = () => {
    return (
      <View style={{ marginBottom: moderateScaleVertical(16) }}>
        <ScrollView style={{ width: '100%' }}>
          <Text
            style={{
              paddingHorizontal: moderateScale(16),
              fontSize: textScale(14),
              fontFamily: fontFamily.medium,
            }}>
            {strings.MENU}
          </Text>
          <View
            style={{
              width: '100%',
              height: 1,
              marginVertical: moderateScaleVertical(10),
            }}
          />
          {sectionListData.map((el, index) => {
            console.log(el);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onPressMenuOption(index)}
                style={styles.menuView}>
                <Text
                  style={{
                    fontSize:
                      activeIdx === index ? textScale(13.5) : textScale(13),
                    marginBottom: moderateScale(5),
                    fontFamily:
                      activeIdx === index
                        ? fontFamily.medium
                        : fontFamily.regular,
                  }}>
                  {el?.translation[0]?.name}
                </Text>
                <Text
                  style={{
                    fontSize:
                      activeIdx === index ? textScale(13.5) : textScale(13),
                    marginBottom: moderateScale(5),
                    fontFamily:
                      activeIdx === index
                        ? fontFamily.medium
                        : fontFamily.regular,
                  }}>
                  {el.data?.length}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const RenderOfferView = () => {
    return (
      <View>
        <Text
          style={{
            fontSize: textScale(14),
            paddingHorizontal: moderateScale(15),
            fontFamily: fontFamily.regular,
          }}>
          {strings.AVAILABLE_OFFERS}
        </Text>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: colors.greyMedium,
            marginVertical: moderateScaleVertical(10),
          }}
        />
        <ScrollView style={{ width: '100%' }}>
          {offerList?.length > 0 &&
            offerList.map((el, indx) => {
              console.log(el, 'el');
              return (
                <View
                  key={indx}
                  style={{
                    borderBottomWidth: 1,
                    paddingHorizontal: moderateScale(15),
                    width: '100%',
                    borderBottomColor: colors.greyMedium,
                    marginBottom: moderateScale(10),
                  }}>
                  <Text
                    style={{
                      fontSize: textScale(13),
                      marginBottom: moderateScale(5),
                      fontFamily: fontFamily.regular,
                    }}>
                    {el.title ? el.title : ''}
                  </Text>
                  <Text
                    style={{
                      fontSize: textScale(11),
                      marginBottom: moderateScale(5),
                      color: colors.textGreyOpcaity7,
                      fontFamily: fontFamily.regular,
                    }}>
                    {el.short_desc ? el.short_desc : ''}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      borderTopWidth: 1,
                      borderTopColor: colors.greyMedium,
                      alignItems: 'center',
                      paddingTop: moderateScaleVertical(15),
                      marginTop: moderateScale(8),
                      paddingBottom: moderateScale(15),
                    }}>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: themeColors.primary_color,
                        borderRadius: moderateScale(3),
                        paddingHorizontal: moderateScale(7),
                        paddingVertical: moderateScale(4),
                        borderStyle: 'dashed',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: textScale(11),
                          fontFamily: fontFamily.regular,
                          textTransform: 'uppercase',
                        }}>
                        {el.name ? el.name : ''}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(`${el.name ? el.name : ''}`);
                        Toast.show(strings.COPIED);
                      }}>
                      <Text
                        style={{
                          fontSize: textScale(11),
                          color: themeColors.primary_color,
                          fontFamily: fontFamily.regular,
                        }}>
                        {strings.TAP_TO_COPY}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  };

  const updateMinMax = (min, max) => {
    updateState({ minimumPrice: min, maximumPrice: max });
  };

  const onShowHideFilter = () => {
    updateState({ isShowFilter: !isShowFilter });
  };
  const onShowHideSort = () => {
    updateState({ isShowSort: !isShowSort });
  };

  const bottomSheetHeader = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setIsVisibleModal(false);
          resetVariantState();
        }}
        style={{ alignSelf: 'center', marginBottom: moderateScaleVertical(16) }}>
        <Image source={imagePath.icClose4} />
      </TouchableOpacity>
    );
  };

  const onShare = () => {
    console.log('onShare', categoryInfo);
    if (!!categoryInfo.share_link) {
      let hyperLink = categoryInfo.share_link;
      let options = { url: hyperLink };
      Share.open(options)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
      return;
    }
    alert('link not found');
  };

  // const onShare = async () => {
  //   let convertJson = JSON.stringify(data);
  //   let shareLink = `${categoryInfo.share_link + `?data=${convertJson}`}`;
  //   try {
  //     const result = await Share.share({
  //       url: shareLink,
  //     });

  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //       } else {
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  const scrollHeader = index => {
    console.log('scrollHeader=>', index);
    setActiveIdx(index);
    sectionListRef.current.sectionList.current.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewPosition: 0,
      viewOffset: 1,
    });
  };

  const onScroll = props => {
    const { nativeEvent } = props;
    if (
      productListData &&
      productListData?.length &&
      productListData?.length < 6
    ) {
      return;
    }

    let offset = nativeEvent.contentOffset.y;
    let index = parseInt(offset / 8); // your cell height
    if (index > moderateScale(36)) {
      if (!AnimatedHeaderValue) {
        updateState({ AnimatedHeaderValue: true });
      }
      return;
    }
    if (index < moderateScale(36)) {
      if (AnimatedHeaderValue) {
        updateState({ AnimatedHeaderValue: false });
        return;
      }
      return;
    }
  };

  let uri1 = categoryInfo?.banner?.image_fit || categoryInfo?.icon?.image_fit;
  let uri2 = categoryInfo?.banner?.image_path || categoryInfo?.icon?.image_path;
  let imageURI = getImageUrl(uri1, uri2, '200/200');
  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  let name =
    data?.name ||
    data?.categoryInfo?.name ||
    (!!categoryInfo?.translation && categoryInfo?.translation[0]?.name);
  let desc =
    categoryInfo?.desc ||
    (!!categoryInfo?.translation &&
      categoryInfo?.translation[0]?.meta_description);

  const appendData = async section => {
    console.log('section', section);

    console.log('currentPagecurrentPage', currentPage);
    console.log('dataaa>>>', selectedFilters);

    setIsLoadMoreData(true);

    try {
      let vendorId = !!data?.vendorData
        ? data?.vendorData.id
        : productListId.id;
      let currPage =
        section?.id == currentPage?.id
          ? `&page=${currentPage.current_page + 1}`
          : `&page=2`;
      let totalLimit = `&limit=${limit}`;

      let apiData =
        `/${vendorId}?category_id=${section?.id}` + totalLimit + currPage;
      console.log(apiData, 'apidata');
      let data = {};
      data['variants'] = selectedFilters?.current?.selectedVariants || [];
      data['options'] = selectedFilters?.current?.selectedOptions || [];
      data['brands'] = selectedFilters?.current?.sleectdBrands || [];
      data['order_type'] = selectedFilters?.current?.selectedSorting || 0;
      data['range'] = `${minimumPrice};${maximumPrice}`;
      data['vendor_id'] = productListId.id;
      data['type'] = dineInType;
      data['tag_products'] =
        ProductTags && ProductTags?.length
          ? ProductTags.map(i => {
            return i?.isSelected ? i?.id : null;
          }).filter(x => x != null)
          : [];
      console.log(data, '>data>data');
      console.log(ProductTags, 'ProductTags?ProductTags');
      let headers = {
        code: appData.profile.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      };

      if (!!appMainData?.reqData?.latitude) {
        headers['latitude'] = appMainData?.reqData?.latitude;
        headers['longitude'] = appMainData?.reqData?.longitude;
      }
      console.log('sending header', headers);
      const res = await actions.getMoreCategories(apiData, data, headers);
      console.log('get more cat res', res.data.products);
      if (res.data.products.data.length == 0) {
        setHideViewMore(false);
      }

      console.log('res++++', res);
      let cloneArry = sectionListData[section.index];
      console.log('append clonearry', cloneArry.data);
      let arry = [...cloneArry?.data, ...res?.data.products.data];

      let uniqueProductsArray = [
        ...new Map(arry.map(item => [item['id'], item])).values(),
      ];
      console.log('append item', uniqueProductsArray, arry);
      let dummyData = sectionListData;
      dummyData[section.index].data = uniqueProductsArray;
      console.log('append last data', dummyData);

      if (res?.data) {
        setIsLoadMoreData(false);
      }

      setSectionListData(dummyData);
      setCurrentPage({
        ...section,
        current_page:
          section?.id == currentPage?.id ? currentPage.current_page + 1 : 2,
        total: res?.data?.products?.total,
      });
    } catch (error) {
      console.log('error riased', error);
      showError(error?.message);
      setIsLoadMoreData(false);
    }
  };

  const getAdditionalPriceOfAddons = () => {
    // console.log(
    //   'productPriceDataproductPriceDataproductPriceData>>>',
    //   productQuantityForCart,
    // );
    let addOnsAdditionalPrice = 0;
    if (addonSet && addonSet[0]) {
      for (let i = 0; i < addonSet?.length; i++) {
        addonSet[i].setoptions.forEach(el => {
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

  const productIncrDecreamentForCart = type => {
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

  const checkIfMaxReached = (minVal, Arr) => {
    const SelectedItems = Arr.filter(el => el.value);
    if (SelectedItems?.length >= minVal) {
      return true;
    }
    return false;
  };

  const addToCart = addonSet => {
    if (
      dine_In_Type == 'appointment' &&
      selectedAllProductDataForAppointment?.mode_of_service == 'schedule' &&
      isEmpty(selectedAppointmentSlot)
    ) {
      setAppointmentPicker(true);
      setSelectedProductForAppointment(
        selectedAllProductDataForAppointment?.id,
      );
      setSelectedAllProductDataForAppointment(
        selectedAllProductDataForAppointment,
      );
      return;
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
      if (isEmpty(selectedWeekDaysValues) && selectedPlanValues == 'Weekly') {
        showError('Weekdays should not be empty!');
        return;
      }
      if (
        selectedPlanValues == 'Daily' ||
        selectedPlanValues == 'Weekly' ||
        selectedPlanValues == 'Alternate Days'
      ) {
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

    const checkIsError = addonSet.findIndex(el => el.errorShow);

    const weeDays = [];
    const selectedCustomDates = [];

    if (selectedWeekDaysValues.length) {
      selectedWeekDaysValues.map((itm, inx) => {
        const value =
          itm === 'Mo'
            ? 1
            : itm === 'Tu'
              ? 2
              : itm === 'We'
                ? 3
                : itm === 'Th'
                  ? 4
                  : itm === 'Fr'
                    ? 5
                    : itm === 'Sa'
                      ? 6
                      : itm === 'Su' && 0;
        weeDays.push(value);
      });
    }
    if (!isEmpty(period) && selectedPlanValues == 'Custom') {
      Object.entries(period).map(([key, value]) =>
        selectedCustomDates.push(key),
      );
    }
    if (!isEmpty(period) && selectedPlanValues == 'Weekly') {
      Object.entries(period).map(([key, value]) => {
        console.log('=>', JSON.stringify(value));
        (value['startingDay'] == true ||
          value['startingDay'] == false ||
          value['endingDay']) &&
          selectedCustomDates.push(key);
      });
    }

    const recurringformPost = {};

    recurringformPost['action'] =
      selectedPlanValues == 'Daily'
        ? 1
        : selectedPlanValues == 'Weekly'
          ? 2
          : selectedPlanValues == 'Monthly'
            ? 3
            : selectedPlanValues == 'Alternate Days'
              ? 6
              : selectedPlanValues == 'Custom'
                ? 4
                : 5;
    recurringformPost['startDate'] = start.dateString ? start.dateString : '';
    recurringformPost['endDate'] = end.dateString ? end.dateString : '';
    recurringformPost['weekDay'] = weeDays;
    recurringformPost['selected_custom_dates'] = selectedCustomDates;

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

      console.log(appointmentSelectedDate, 'appointmentSelectedDate');

      if (dine_In_Type == 'appointment') {
        (data['schedule_slot'] = selectedAppointmentSlot?.value),
          (data['scheduled_date_time'] = String(
            moment(appointmentSelectedDate).format('YYYY-MM-DD hh:mm:ss'),
          ));
        data['dispatch_agent_id'] = selectedAgent?.id;
        data['schedule_type'] =
          selectedAllProductDataForAppointment?.mode_of_service == 'schedule'
            ? 'schedule'
            : '';
      }

      console.log(data, 'data for cart>>>>>>');
      data['recurringformPost'] = recurringformPost;

      console.log(JSON.stringify(data), 'data for cart');
      updateState({ btnLoader: true });
      actions
        .addProductsToCart(data, {
          code: appData.profile.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then(async res => {
          actions.cartItemQty(res);
          showSuccess(strings.PRODUCT_ADDED_SUCCESS);
          setSelectedAppointmentSlot({});
          updateCartItems(
            selectedCartItem,
            res.data.product_total_qty_in_cart, ////localy update cart quanity
            res.data.cart_product_id,
            res.data.id,
          );
          updateState({ isLoadingC: false, btnLoader: false });
          // onClose();
        })
        .catch(error => {
          errorMethodSecond(error, addonSet);
        });
      return;
    }
  };

  const onPressSocialMediaItem = item => {
    Linking.openURL(item?.url);
  };

  const onDateSelected = async date => {
    setLoadingGetSlots(true);
    setAppointmentSelectedDate(date);
    const apiData = {
      cur_date: moment(date).format('YYYY-MM-DD'),
      product_id: productDetailData?.id || selectedProductForAppointment,
    };
    const apiHeader = {
      code: appData.profile.code,
      currency: currencies.primary_currency.id,
      language: languages.primary_language.id,
    };

    if (isAppointmentPicker) {
      if (selectedAllProductDataForAppointment?.is_slot_from_dispatch) {
        actions
          .getAppointmentSlots(apiData, apiHeader)
          .then(res => {
            console.log(res, '<===res getAppointmentSlots');
            if (res?.dispatchAgents) {
              if (!isEmpty(res?.dispatchAgents?.slots)) {
                const slots = res?.dispatchAgents?.slots;
                setAppointmentDispatcherAgentSlots(slots);
                let allSlots = [];
                for (var propName in slots) {
                  if (slots.hasOwnProperty(propName)) {
                    var propValue = slots[propName];
                    allSlots.push(propValue);
                  }
                }

                setAllDispatcherAgents(res?.dispatchAgents?.agents);
                setAppointmentDispatcherAgentSlots(allSlots);
              }
            } else {
              setAppointmentAvailableSlots(res?.data?.time_slots);
            }

            setLoadingGetSlots(false);
            setAppointmentPicker(false);
            setSelectedAppointmentIndx(null);
            setSelectedAppointmentSlot({});
            setTimeout(() => {
              setAppointmentSlotsModal(true);
            }, 500);
          })
          .catch(err => {
            console.log(err, '<==err getAppointmentSlots');
            setLoadingGetSlots(false);
            setAppointmentPicker(false);
            errorMethod(err);
          });
      } else {
        try {
          let vendorId = selectedAllProductDataForAppointment?.vendor_id;
          // vendor_id,date,delivery
          const res = await actions.checkVendorSlots(
            `?vendor_id=${vendorId}&date=${moment(date).format(
              'YYYY-MM-DD',
            )}&delivery=${dineInType}`,
            {
              code: appData?.profile?.code,
              timezone: RNLocalize.getTimeZone(),
            },
          );

          console.log(res, 'res for slots vendor');
          if (res) {
            setAppointmentAvailableSlots(res);
            setLoadingGetSlots(false);
            setAppointmentPicker(false);
            setSelectedAppointmentIndx(null);
            setSelectedAppointmentSlot({});
            setTimeout(() => {
              setAppointmentSlotsModal(true);
            }, 500);
          }
        } catch (error) {
          setCheckSloatLoading(false);

          console.log('error riased', error);
        }
      }

      return;
    }

    setSelectedDate(date);
    actions
      .getVendorShippingSlots(
        {
          delivery_date: moment(date).format('YYYY-MM-DD'),
          product_id: productDetailData?.id,
          vendor_cutoff_time: moment(date).format('hh:mm A'),
        },
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then(res => {
        console.log(res, '<===res');
        setIsDatePicker(false);
        setLoadingGetSlots(false);
        if (!isEmpty(res?.data)) {
          setAvailableVendorSlots(res?.data);
          setTimeout(() => {
            setAvailableSlotsModal(true);
          }, 700);
        } else {
          setTimeout(() => {
            showError('No available slots found!');
          }, 700);
        }
      })
      .catch(err => {
        setLoadingGetSlots(false);
        setIsDatePicker(false);
        errorMethod(err);
      });
  };

  const onSlotSelect = (item, index) => {
    const result = allDispatcherAgents.filter(a1 =>
      item?.agent_id.find(a2 => a1.id == a2),
    );
    setAvailableDriversForSlot(result);
    setSelectedAppointmentSlot(item);
    setSelectedAppointmentIndx(index);
    setSelectedAgent({});
  };

  const _onSelecteAgent = item => {
    setSelectedAgent(item);
  };

  const _onDonePressAfterSlotSelect = () => {
    if (
      isEmpty(selectedAgent) &&
      selectedAllProductDataForAppointment?.is_show_dispatcher_agent
    ) {
      alert('please select agent');
      return;
    }
    setAppointmentSlotsModal(false);
    setAppointmentPicker(false);
    setSelectedAgent({});
  };

  const AppointmentSlotModal = () => {
    return (
      <View
        style={{
          backgroundColor: colors.white,
          height: moderateScaleVertical(350),
          borderTopRightRadius: moderateScale(10),
          borderTopLeftRadius: moderateScale(10),
          padding: moderateScale(12),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: moderateScale(10),
          }}>
          <Text
            style={{
              fontFamily: fontFamily?.bold,
              fontSize: textScale(14),
            }}>
            Select slot
          </Text>
          <TouchableOpacity onPress={_onDonePressAfterSlotSelect}>
            <Text
              style={{
                fontFamily: fontFamily.bold,
                color: themeColors?.primary_color,
              }}>
              {strings.DONE}
            </Text>
          </TouchableOpacity>
        </View>

        {!isEmpty(appointmentDispatcherAgentSlots) ? (
          <FlatList
            data={appointmentDispatcherAgentSlots}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: moderateScaleVertical(10),
                }}
              />
            )}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => onSlotSelect(item, index)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 8,
                  borderWidth: 1,
                  borderColor: colors.borderColorB,
                  borderRadius: moderateScale(4),
                }}>
                <Image
                  source={
                    selectedAppointmentIndx == index
                      ? imagePath.radioActive
                      : imagePath.radioInActive
                  }
                />
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(13),
                    marginLeft: moderateScale(10),
                  }}>
                  {item?.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList
            data={appointmentAvailableSlots}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: moderateScaleVertical(10),
                }}
              />
            )}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedAppointmentSlot(item);
                  setSelectedAppointmentIndx(index);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 8,
                  borderWidth: 1,
                  borderColor: colors.borderColorB,
                  borderRadius: moderateScale(4),
                }}>
                <Image
                  source={
                    selectedAppointmentIndx == index
                      ? imagePath.radioActive
                      : imagePath.radioInActive
                  }
                />
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(13),
                    marginLeft: moderateScale(10),
                  }}>
                  {item?.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        <View
          style={{
            flexDirection: 'row',
            paddingVertical: moderateScaleVertical(10),
          }}>
          {!!(
            !isEmpty(selectedAllProductDataForAppointment) &&
            selectedAllProductDataForAppointment?.is_slot_from_dispatch &&
            selectedAllProductDataForAppointment?.is_show_dispatcher_agent &&
            !isEmpty(availableDriversForSlot)
          ) &&
            availableDriversForSlot.map((item, index) => {
              return (
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    marginHorizontal: moderateScale(10),
                  }}
                  onPress={() => _onSelecteAgent(item)}>
                  <View
                    style={{
                      borderWidth: moderateScale(1),
                      borderColor:
                        item?.id == selectedAgent?.id
                          ? themeColors?.primary_color
                          : colors.textGreyLight,
                      height: moderateScaleVertical(42),
                      width: moderateScale(42),
                      borderRadius: moderateScale(20),
                    }}>
                    <Image
                      style={{
                        height: moderateScaleVertical(40),
                        width: moderateScale(40),
                        borderRadius: moderateScale(20),
                      }}
                      source={{ uri: item?.image_url }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: textScale(9),
                      fontFamily: fontFamily?.bold,
                      color:
                        item?.id == selectedAgent?.id
                          ? themeColors?.primary_color
                          : colors.textGreyLight,
                    }}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    );
  };

  const renderSectionFooter = props => {
    const { section } = props;
    return (
      //   section?.data.length >= 15 && searchInput =='' && section?.data.length !== section?.data_count  ?
      //   <View style={{height: moderateScale(50)}}>
      //   <TouchableOpacity
      //     onPress={() => appendData(section)}
      //     style={{
      //       // alignSelf: 'center',
      //       padding: moderateScale(6),
      //       borderRadius: moderateScale(5),
      //       marginHorizontal: moderateScale(20),
      //       borderWidth: 1,
      //       borderColor: themeColors?.primary_color,
      //       // backgroundColor: colors?.greyColor3,
      //       justifyContent: 'center',
      //       flexDirection:'row',
      //       alignItems:'center'
      //     }}>
      //      {!!isLoadMoreData &&<ActivityIndicator size={20} color={themeColors?.primary_color} />}
      //       <Text
      //         style={{
      //           textAlign: 'center',
      //           color: themeColors?.primary_color,
      //           fontSize: textScale(12),
      //           fontFamily: fontFamily?.medium,
      //           marginHorizontal:moderateScale(10)
      //         }}>
      //         View More
      //       </Text>
      //   </TouchableOpacity>
      // </View>:
      section?.data.length !== section?.data_count &&
        section?.data.length >= 15 &&
        hideViewMore ? (
        <View style={{ height: moderateScale(50) }}>
          <TouchableOpacity
            onPress={() => appendData(section)}
            style={{
              // alignSelf: 'center',
              padding: moderateScale(6),
              borderRadius: moderateScale(5),
              marginHorizontal: moderateScale(20),
              borderWidth: 1,
              borderColor: themeColors?.primary_color,
              // backgroundColor: colors?.greyColor3,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {!!isLoadMoreData && (
              <UIActivityIndicator
                size={20}
                color={themeColors?.primary_color}
              />
            )}
            {section?.data.length !== section?.data_count ? (
              <Text
                style={{
                  textAlign: 'center',
                  color: themeColors?.primary_color,
                  fontSize: textScale(12),
                  fontFamily: fontFamily?.medium,
                  marginHorizontal: moderateScale(10),
                }}>
                View More
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ height: moderateScale(50) }} />
      )
    );
  };

  const goToTop = () => {
    console.log(sectionListRef.current);
    if (
      !!categoryInfo?.is_show_products_with_category &&
      !!sectionListRef?.current
    ) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        itemIndex: 0,
        sectionIndex: 0,
      });
    } else if (!!flatRef?.current) {
      flatRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };

  return (
    <View
      isLoading={wrapperListLoader}
      style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
        flex: 1,
      }}>
      <EcomHeader
        isDarkMode={isDarkMode}
        navigation={navigation}
        style={{ marginVertical: moderateScaleVertical(16) }}
        themeColors={themeColors}
        appStyle={appStyle}
      />

      {!!categoryInfo?.is_show_products_with_category ? (
        <>
          <FlatList
            data={isFilteredData ? tagFilteredData : sectionListData}
            renderItem={renderSectionItem}
            key={'1'}
            keyExtractor={(item, index) => String(item?.id || index)}
          />
        </>
      ) : (
        <>
          <FlatList
            // onScroll={onScroll}
            numColumns={2}
            ref={flatRef}
            key={'2'}
            disableScrollViewPanResponder
            showsVerticalScrollIndicator={false}
            data={productListData}
            extraData={productListData}
            renderItem={renderProduct}
            ListHeaderComponent={listHeaderComponent2()}
            keyExtractor={awesomeChildListKeyExtractor}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            //  getItemLayout={getItemLayoutFlat}
            // refreshing={isRefreshing}
            initialNumToRender={10}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              !noMoreData && listFooterComponent
            }
            ListEmptyComponent={listEmptyComponent}
          // style={{marginHorizontal: moderateScale(8)}}
          />
        </>
      )}

      {/* <TouchableOpacity
        onPress={goToTop}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: themeColors?.primary_color,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}

      >
        <Text>Go To Top</Text>
      </TouchableOpacity> */}
      {isShowSort ? (
        <SortCompEcom
          isDarkMode={isDarkMode}
          themeColors={themeColors}
          onFilterApply={(filterData, currentVariants) =>
            onFilterApply(filterData, currentVariants, 'sort')
          }
          onShowHideFilter={onShowHideSort}
          allClearFilters={allClearFilters}
          selectedSortFilter={selectedSortFilter}
          onSelectedSortFilter={val => updateState({ selectedSortFilter: val })}
          maximumPrice={maximumPrice}
          minimumPrice={minimumPrice}
          updateMinMax={updateMinMax}
        />
      ) : null}

      {isShowFilter ? (
        <FilterCompEcom
          isDarkMode={isDarkMode}
          themeColors={themeColors}
          onFilterApply={(filterData, currentVariants) =>
            onFilterApply(filterData, currentVariants, 'variants')
          }
          onShowHideFilter={onShowHideFilter}
          allClearFilters={allClearFilters}
          selectedSortFilter={selectedSortFilter}
          onSelectedSortFilter={val => updateState({ selectedSortFilter: val })}
          maximumPrice={maximumPrice}
          minimumPrice={minimumPrice}
          updateMinMax={updateMinMax}
          filterData={allFilters}
        />
      ) : null}

      {!!offersModalVisible ? (
        <BottomSlideModal
          mainContainView={RenderOfferView}
          isModalVisible={offersModalVisible}
          mainContainerStyle={{
            width: '100%',
            paddingHorizontal: 0,
            marginHorizontal: 0,
            maxHeight: moderateScale(450),
          }}
          innerViewContainerStyle={{
            width: '100%',
            paddingHorizontal: 0,
            marginHorizontal: 0,
          }}
          onBackdropPress={() =>
            updateState({ offersModalVisible: !offersModalVisible })
          }
        />
      ) : null}
    </View>
  );
}
