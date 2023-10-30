import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BlurView } from '@react-native-community/blur';
import Clipboard from '@react-native-community/clipboard';
import _, { cloneDeep, debounce, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { UIActivityIndicator } from 'react-native-indicators';
import LinearGradient from 'react-native-linear-gradient';
import * as RNLocalize from 'react-native-localize';
import Modal, { ReactNativeModal } from 'react-native-modal';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import Share from 'react-native-share';
import Toast from 'react-native-simple-toast';
import { SvgUri } from 'react-native-svg';
import SectionList from 'react-native-tabs-section-list';
import { useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import BottomSlideModal from '../../Components/BottomSlideModal';
import CustomAnimatedLoader from '../../Components/CustomAnimatedLoader';
import DifferentAddOns from '../../Components/DifferentAddOns ';
import FilterComp from '../../Components/FilterComp';
import GradientButton from '../../Components/GradientButton';
import GradientCartView from '../../Components/GradientCartView';
import HomeServiceVariantAddons from '../../Components/HomeServiceVariantAddons';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import HomeLoader from '../../Components/Loaders/HomeLoader';
import ProductListLoader3 from '../../Components/Loaders/ProductListLoader3';
import NoDataFound from '../../Components/NoDataFound';
import ProductCard3 from '../../Components/ProductCard3';
import RepeatModal from '../../Components/RepeatModal';
import RoundImg from '../../Components/RoundImg';
import SearchBar from '../../Components/SearchBar';
import VariantAddons from '../../Components/VariantAddons';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, { hitSlopProp } from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../../utils/commonFunction';
import { appIds } from '../../utils/constants/DynamicAppKeys';
import {
  checkEvenOdd,
  getColorCodeWithOpactiyNumber,
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

var loadMoreProduct = true;

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

import DatePicker from 'react-native-date-picker';
import { enableFreeze } from 'react-native-screens';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
enableFreeze(true);

export default function Products({ route, navigation }) {
  const bottomSheetRef = useRef(null);
  let selectedFilters = useRef(null);

  const notificationData = route.params.fromNotification || false;
  const { data, previousScreenData } = route.params;

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

  let sectionListRef = useRef(null);

  const [listHeight, setListHeight] = useState(height / 3.2);

  const [checkSloatLoading, setCheckSloatLoading] = useState(false);
  const [apiPageNo, setApiPageNo] = useState(1)
  const [state, setState] = useState({
    sortFilters: filtersData,
    searchInput: '',
    pageNo: 1,
    lastPage: null,
    limit: 200,
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
    loadMore: false,
    wrapperListLoader: false,
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
    loadMore,
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
  } = state;
  const [showShimmer, setShowShimmer] = useState(true);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [productListData, setProductListData] = useState([]);
  const [sectionListData, setSectionListData] = useState([]);
  const [cloneSectionList, setCloneSectionList] = useState([]);
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
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
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

  const goToProductDetail = productDetail => {
    navigation.navigate(navigationStrings.PRODUCTDETAIL, {
      data: productDetail,
      previousScreenData: data,
      isProductList: true,
    });
  };
  const renderSectionItem = useCallback(
    ({ item, index, section }) => {
      return (
        <View
          key={String(index)}
          style={{
            height: moderateScale(180),
          }}>
          <ProductCard3
            data={item}
            index={index}
            onPress={() => goToProductDetail(item)}
            onAddtoWishlist={() => _onAddtoWishlist(item)}
            addToCart={() =>
              addSingleItem(item, section, index, selectedAppointmentSlot)
            }
            onIncrement={() => checkIsCustomize(item, section, index, 1)}
            onDecrement={() => checkIsCustomize(item, section, index, 2)}
            selectedItemID={selectedItemID}
            btnLoader={btnLoader}
            selectedItemIndx={selectedItemIndx}
            businessType={businessType}
            categoryInfo={categoryInfo}
            animateText={animateText}
            section={section}
            CartItems={CartItems}
            wrapperListLoader={wrapperListLoader}
          />
        </View>
      );
    },
    [
      cloneSectionList,
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

  const getItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) =>
      sectionIndex === 0 ? moderateScale(180) : moderateScale(180),
    // These three properties are optional

    getSectionHeaderHeight: () => moderateScale(50), // The height of your section headers
    getSectionFooterHeight: () => moderateScale(50),
    listHeaderHeight: listHeight,
    getSeparatorHeight: () => moderateScale(8),
  });

  const renderSectionHeader = useCallback(
    props => {
      const { section } = props;
      return (
        <View
          style={{
            marginHorizontal: moderateScale(16),
            // marginVertical: moderateScaleVertical(8),
            height: moderateScale(50),
          }}>
          <Text
            style={{
              ...styles.hdrTitleTxt,
              color: isDarkMode ? colors.white : colors.black,
            }}>
            {section?.translation[0]?.name}
          </Text>
        </View>
      );
    },
    [cloneSectionList],
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
    [productListData, cloneSectionList],
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
        {!!loadMore && (
          <View style={{ height: moderateScale(60) }}>
            <UIActivityIndicator />
          </View>
        )}
      </>
    );
  };

  const renderProduct = useCallback(
    ({ item, index }) => {
      return (
        <View key={String(index)} style={{ flex: 1 }}>
          <ProductCard3
            data={item}
            index={index}
            onPress={() => goToProductDetail(item)}
            onAddtoWishlist={() => _onAddtoWishlist(item)}
            addToCart={() =>
              addSingleItem(item, null, index, selectedAppointmentSlot)
            }
            onIncrement={() => checkIsCustomize(item, null, index, 1)}
            onDecrement={() => checkIsCustomize(item, null, index, 2)}
            selectedItemID={selectedItemID}
            btnLoader={false}
            selectedItemIndx={selectedItemIndx}
            differentAddsOns={differentAddsOns}
            businessType={businessType}
            categoryInfo={categoryInfo}
            animateText={animateText}
          // section={section}
          />
          <View
            style={{
              ...styles.horizontalLine,
              marginVertical: moderateScaleVertical(6),
            }}
          />
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

  const listHeaderComponent2 = () => {

    return (
      <View
        style={{
          height: !!categoryInfo?.is_show_products_with_category
            ? listHeight
            : 'auto',
          marginBottom: moderateScaleVertical(8),
        }}>
        {false ? (
          <View
            style={{
              ...styles.headerStyle,
              marginBottom: moderateScale(12),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
                hitSlop={styles.hitSlopProp}>
                <Image
                  style={{
                    tintColor: isDarkMode ? colors.white : colors.black,
                    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                  }}
                  source={imagePath.icBackb}
                />
              </TouchableOpacity>

              <View style={{ marginLeft: moderateScale(8) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {isSVG ? (
                    <SvgUri
                      height={moderateScale(40)}
                      width={moderateScale(40)}
                      uri={imageURI}
                    />
                  ) : (
                    <RoundImg
                      img={imageURI}
                      size={30}
                      isDarkMode={isDarkMode}
                      MyDarkTheme={MyDarkTheme}
                    />
                  )}
                  <View
                    style={{
                      marginLeft: moderateScale(8),
                      width: moderateScale(width / 1.5),
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isDarkMode ? colors.white : colors.black,
                        fontSize: moderateScale(14),
                        fontFamily: fontFamily.medium,
                      }}>
                      {name}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {isSearch ? (
              <View>
                <SearchBar
                  containerStyle={{
                    marginHorizontal: moderateScale(18),
                    borderRadius: 8,
                    width: width / 1.15,
                    backgroundColor: isDarkMode
                      ? colors.whiteOpacity15
                      : colors.greyColor,
                    height: moderateScaleVertical(37),
                  }}
                  searchValue={searchInput}
                  placeholder={strings.SEARCH_ITEM}
                  // onChangeText={(value) => onChangeText(value)}
                  showRightIcon
                  rightIconPress={rightIconPress}
                />
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  // onPress={() => updateState({isSearch: true})}
                  onPress={moveToNewScreen(
                    navigationStrings.SEARCHPRODUCTOVENDOR,
                    {
                      type: data?.vendor
                        ? staticStrings.VENDOR
                        : staticStrings.CATEGORY,
                      id: data?.vendor ? data?.id : productListId?.id,
                    },
                  )}>
                  <Image
                    style={{
                      tintColor: isDarkMode ? colors.white : colors.black,
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    }}
                    source={!!data?.showAddToCart ? false : imagePath.icSearchb}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    marginHorizontal: moderateScale(8),
                    marginRight: moderateScale(3),
                  }}
                />
                <TouchableOpacity
                  onPress={onShare}
                  hitSlop={hitSlopProp}
                  activeOpacity={0.8}>
                  <Image
                    style={{
                      tintColor: isDarkMode ? colors.white : colors.black,
                      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    }}
                    source={imagePath.icShareb}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={{ marginBottom: moderateScaleVertical(16) }}>
            <ImageBackground
              source={{
                uri: getImageUrl(
                  // data?.item?.banner.image_fit ||
                  categoryInfo?.banner?.image_fit ||
                  categoryInfo?.image?.image_fit,
                  // data?.item?.banner.image_path ||
                  categoryInfo?.banner?.image_path ||
                  categoryInfo?.image?.image_path,
                  '400/400',
                ),
              }}
              style={{
                // ...styles.imageBackgroundHdr,
                backgroundColor: isDarkMode
                  ? colors.whiteOpacity15
                  : colors.greyColor,
              }}
              resizeMode="cover">
              <LinearGradient
                style={{}}
                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.7)']}>
                <SafeAreaView>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginHorizontal: moderateScale(16),
                      marginTop: moderateScaleVertical(16),
                      marginBottom: moderateScaleVertical(8),
                    }}>
                    <TouchableOpacity
                      hitSlop={styles.hitSlopProp}
                      activeOpacity={0.7}
                      style={{}}
                      onPress={() => navigation.goBack()}>
                      <Image
                        source={imagePath.icBackb}
                        style={{
                          tintColor: colors.white,
                          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      hitSlop={styles.hitSlopProp}
                      activeOpacity={0.7}
                      style={{}}
                      onPress={onShare}>
                      <Image
                        source={imagePath.icShareb}
                        style={{
                          tintColor: colors.white,
                          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {!isEmpty(categoryInfo?.social_media_links) ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{
                        alignSelf: 'flex-end',
                        marginHorizontal: moderateScale(16),
                      }}
                      onPress={() => setIsSocialMediaModal(true)}>
                      <Image
                        source={imagePath.icSocialShare}
                        style={{
                          tintColor: colors.white,
                          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                        }}
                      />
                    </TouchableOpacity>
                  ) : null}
                  <View
                    style={{
                      width: width,
                      paddingLeft: moderateScale(13),
                      marginBottom: moderateScaleVertical(8),
                    }}>
                    <View
                      style={{
                        marginTop: moderateScale(10),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          ...styles.hdrTitleTxt,
                          flex: 0,
                          textAlign: 'left',
                          fontSize: textScale(15),
                          color: isDarkMode ? colors.white : colors.white,
                        }}>
                        {data?.name || categoryInfo?.name || ''}
                      </Text>

                      {/* {!!categoryInfo &&
                        !!categoryInfo?.product_avg_average_rating && (
                          <View
                            style={[
                              styles.hdrRatingTxtView,
                              {
                                backgroundColor: colors.yellowC,
                                width: moderateScale(50),
                                justifyContent: 'center',
                                height: moderateScale(20),
                              },
                            ]}>
                            <Text
                              style={[
                                styles.ratingTxt,
                                { fontSize: textScale(9.5) },
                              ]}>
                              {Number(
                                categoryInfo?.product_avg_average_rating,
                              ).toFixed(1)}
                            </Text>
                            <Image
                              style={styles.starImg}
                              source={imagePath.star}
                              resizeMode="contain"
                            />
                          </View>
                        )} */}
                    </View>
                    <View
                      style={{
                        marginTop:
                          !DeviceInfo.getBundleId() === appIds.hokitch
                            ? moderateScaleVertical(5)
                            : 0,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignSelf:

                          !DeviceInfo.getBundleId() === appIds.hokitch || DeviceInfo.getBundleId() === appIds.bumprkar
                            ? 'auto'
                            : 'flex-end',
                      }}>
                      {!DeviceInfo.getBundleId() === appIds.hokitch ? (
                        <Text
                          // numberOfLines={2}
                          style={{
                            ...styles.hdrTitleTxt,
                            flex: 0,
                            fontSize: textScale(12.5),
                            fontFamily: fontFamily.regular,
                            textAlign: 'left',
                            color: isDarkMode ? colors.white : colors.white,
                            width: width / 1.5,
                          }}>
                          {categoryInfo?.address || ''}
                        </Text>
                      ) : true ? (
                        <Text
                          // numberOfLines={2}
                          style={{
                            ...styles.hdrTitleTxt,
                            flex: 0,
                            fontSize: textScale(12.5),
                            fontFamily: fontFamily.regular,
                            textAlign: 'left',
                            color: isDarkMode ? colors.white : colors.white,
                            width: width / 1.5,
                          }}>
                          {categoryInfo?.address || ''}
                        </Text>
                      ) : null}

                      {!!categoryInfo &&
                        !categoryInfo?.closed_store_order_scheduled ? (
                        <View
                          style={[
                            styles.hdrRatingTxtView,
                            {
                              justifyContent: 'center',
                              height: moderateScale(20),
                              width: moderateScale(60),
                              backgroundColor: categoryInfo?.show_slot
                                ? colors.green
                                : categoryInfo?.is_vendor_closed
                                  ? colors.redB
                                  : colors.green,
                            },
                          ]}>
                          <Text
                            style={{
                              ...styles.ratingTxt,
                              color: colors.white,
                              fontSize: textScale(9.5),
                            }}>
                            {categoryInfo?.show_slot
                              ? strings.OPEN
                              : categoryInfo?.is_vendor_closed
                                ? strings.CLOSE
                                : strings.OPEN}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {Number(categoryInfo?.order_min_amount) > 0 ? (
                      <View
                        style={{
                          backgroundColor: colors.redB,
                          width: moderateScale(230),
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: moderateScaleVertical(30),
                          // paddingHorizontal: moderateScale(10),
                          // paddingVertical: moderateScaleVertical(10),
                          borderRadius: moderateScale(6),
                          marginTop: moderateScale(10),
                        }}>
                        <Text
                          style={{
                            fontSize: textScale(12),
                            fontFamily: fontFamily.medium,
                            color: colors.white,
                          }}>
                          Minimum order value{' '}
                          {tokenConverterPlusCurrencyNumberFormater(
                            categoryInfo?.order_min_amount,
                            digit_after_decimal,
                            additional_preferences,
                            currencies?.primary_currency?.symbol,
                          )}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </SafeAreaView>

                <View
                  style={{
                    // backgroundColor: 'pink'
                    // ...styles.hdrAbsoluteView,
                    backgroundColor: isDarkMode
                      ? MyDarkTheme.colors.lightDark
                      : colors.white,
                    // minHeight: moderateScale(80),
                    paddingHorizontal: moderateScale(16),
                  }}>
                  <View>
                    {/* { !isEmpty(sectionListData) ?  <Text
                      style={{
                        ...styles.milesTxt,
                        color: isDarkMode
                          ? colors.white
                          : colors.black,
                        marginLeft: 0,
                      }}
                      numberOfLines={1}>
                      {sectionListData.map((val) => {
                        return <Text>{ val?.translation[0]?.name || val.title} </Text>;
                      })}
                    </Text> : null} */}

                    {!!desc && (
                      <Text
                        numberOfLines={2}
                        style={{
                          ...styles.milesTxt,
                          marginLeft: 0,
                          color: isDarkMode ? colors.white : colors.black,
                          marginVertical: moderateScaleVertical(4),
                          fontSize: textScale(10.5),
                          opacity: 0.6,
                        }}>
                        {desc}
                      </Text>
                    )}
                  </View>

                  {!!categoryInfo?.closed_store_order_scheduled ? (
                    <Text
                      style={{
                        ...commonStyles.mediumFont14Normal,
                        fontSize: textScale(10),
                        textAlign: 'left',
                        color: colors.redB,
                        // marginTop: moderateScaleVertical(4)
                      }}>
                      {getBundleId() == appIds.masa
                        ? `${strings.WE_ACCEPT_ONLY_SCHEDULE_ORDER} ${categoryInfo?.delaySlot} `
                        : ` ${strings.WE_ARE_NOT_ACCEPTING} ${categoryInfo?.delaySlot} `}
                    </Text>
                  ) : null}
                </View>
              </LinearGradient>

              {/* ****************************************/}
            </ImageBackground>
          </View>
        )}

        {!(
          categoryInfo &&
          categoryInfo?.lineOfSightDistance == undefined &&
          categoryInfo.lineOfSightDistance == null &&
          categoryInfo?.timeofLineOfSightDistance == undefined &&
          categoryInfo.timeofLineOfSightDistance == null &&
          offerList?.length === 0
        ) && (
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
                alignSelf: 'center',
                borderBottomWidth: 1,
                borderBottomColor: colors.greyMedium,
                marginBottom: moderateScale(16),
                paddingBottom: moderateScaleVertical(10),
                paddingHorizontal: moderateScale(12),
              }}>
              {categoryInfo?.lineOfSightDistance != undefined &&
                categoryInfo.lineOfSightDistance != null &&
                getBundleId() !== appIds.sxm2go ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      backgroundColor: colors.greyColor,
                      width: moderateScale(30),
                      height: moderateScale(30),
                      borderRadius: moderateScale(30),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image source={imagePath.ic_pinIcon} />
                  </View>

                  <Text
                    style={{
                      ...styles.milesTxt,
                      color: isDarkMode ? colors.white : colors.black,
                      opacity: 1,
                      fontSize: textScale(10),
                    }}>
                    {categoryInfo.lineOfSightDistance}
                  </Text>
                </View>
              ) : null}

              {categoryInfo?.timeofLineOfSightDistance != undefined &&
                categoryInfo.timeofLineOfSightDistance != null && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        backgroundColor: colors.greyColor,
                        width: moderateScale(30),
                        height: moderateScale(30),
                        borderRadius: moderateScale(30),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image source={imagePath.ic_timeIcon} />
                    </View>
                    {categoryInfo?.timeofLineOfSightDistance != undefined &&
                      categoryInfo.timeofLineOfSightDistance != null ? (
                      <Text
                        style={{
                          ...styles.milesTxt,
                          color: isDarkMode ? colors.white : colors.black,
                          opacity: 1,
                          fontSize: textScale(10),
                        }}>
                        {checkEvenOdd(categoryInfo.timeofLineOfSightDistance)}-
                        {checkEvenOdd(categoryInfo.timeofLineOfSightDistance + 5)}
                      </Text>
                    ) : null}
                  </View>
                )}

              {offerList?.length > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    updateState({ offersModalVisible: !offersModalVisible })
                  }
                  activeOpacity={0.7}
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            </View>
          )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: moderateScale(12),
            marginBottom: ProductTags.length > 0 ? moderateScale(15) : 0,
          }}
          contentContainerStyle={{ alignItems: 'center' }}>
          {ProductTags &&
            ProductTags.map((el, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // marginTop: moderateScale(20)
                  }}>
                  <ToggleSwitch
                    isOn={el.isSelected}
                    onColor={colors.green}
                    offColor={isDarkMode ? colors.white : colors.borderLight}
                    size="small"
                    onToggle={() => {
                      // playHapticEffect(hapticEffects.impactLight);
                      const updatedArr = ProductTags.map((el, idx) => {
                        console.log(el, 'ellll');
                        if (idx === index) {
                          let newObj = el;
                          newObj.isSelected = !newObj.isSelected;
                          return newObj;
                        } else {
                          return el;
                        }
                      });
                      setProductTags(updatedArr);
                      updateState({
                        updateTagFilter: !updateTagFilter,
                      });
                    }}
                  />
                  <Text
                    style={{
                      fontSize: textScale(11),
                      fontFamily: fontFamily.regular,
                      marginLeft: moderateScale(7),
                      color: isDarkMode ? colors.white : colors.textGrey,
                    }}>
                    {!!el?.translations?.length > 0
                      ? el.translations[0].name
                      : ''}
                  </Text>
                  <View style={{ width: moderateScale(20) }} />
                </View>
              );
            })}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: moderateScaleVertical(8),
            marginHorizontal: moderateScale(12),
          }}>
          {categoryInfo?.is_show_products_with_category ? (
            getBundleId() == appIds.muvpod ? null : (
              <SearchBar
                autoFocus={false}
                containerStyle={{
                  flex: 1,
                  // marginHorizontal: moderateScale(18),
                  borderRadius: moderateScale(8),
                  backgroundColor: isDarkMode
                    ? colors.whiteOpacity15
                    : colors.greyColor,
                  height: moderateScaleVertical(37),
                  marginRight: moderateScale(8),
                }}
                searchValue={searchInput}
                placeholder={strings.SEARCH_WITHIN_MENU}
                onChangeText={value => onSearchWithinMenu(value)}
                showRightIcon={searchInput ? true : false}
                rightIconStyle={{
                  tintColor: isDarkMode ? colors.white : colors.black,
                }}
                rightIconPress={() => onSearchWithinMenu('')}
                showVoiceRecord={false}
              />
            )
          ) : null}

          {/* 
          <TouchableOpacity
            onPress={onShowHideFilter}
            style={{
              marginLeft: moderateScale(12),
            }}>
            <Image source={imagePath.filter} />
          </TouchableOpacity> */}
          <View>
            {getBundleId() == appIds.muvpod ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: width / 1.1,
                  alignItems: 'center',
                }}>
                <View />
                <TouchableOpacity
                  onPress={onShowHideFilter}
                  style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={imagePath.filter}
                    style={{
                      tintColor: isDarkMode ? colors.white : colors.black,
                    }}
                  />
                  <Text
                    style={{
                      color: isDarkMode ? colors.white : colors.black,
                      fontSize: moderateScale(16),
                      fontFamily: fontFamily.regular,
                      // marginRight: moderateScale(),
                    }}>
                    {' '}
                    {strings.SORT_BY}{' '}
                    {selectedSortFilter == null
                      ? 'A TO Z'
                      : selectedSortFilter?.label}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={onShowHideFilter}>
                <Image
                  source={imagePath.filter}
                  style={{
                    tintColor: isDarkMode ? colors.white : colors.black,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {!!categoryInfo && categoryInfo?.childs?.length > 0 && (
          <View style={{ marginHorizontal: moderateScale(20) }}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                // marginHorizontal: moderateScale(0),
                marginVertical: moderateScaleVertical(8),
              }}>
              {/* <View><Image source={imagePath.}/></View> */}
              {categoryInfo.childs.map((item, inx) => {
                return (
                  <View key={inx}>
                    <TouchableOpacity
                      style={{
                        padding: moderateScale(10),
                        // backgroundColor: colors.lightGreyBg,
                        marginRight: moderateScale(10),
                        borderRadius: moderateScale(12),
                        backgroundColor:
                          selectedCategory && selectedCategory?.id == item?.id
                            ? themeColors.primary_color
                            : colors.lightGreyBg,
                      }}
                      onPress={() => onPressChildCards(item)}>
                      <Text
                        style={{
                          color:
                            selectedCategory && selectedCategory?.id == item?.id
                              ? colors.white
                              : colors.black,
                          opacity:
                            selectedCategory && selectedCategory?.id == item?.id
                              ? 1
                              : 0.61,
                          fontSize: textScale(12),
                          fontFamily: fontFamily.medium,
                        }}>
                        {item?.translation[0]?.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const addSingleItem = useCallback(
    async (item, section = null, inx) => {
      if (
        dine_In_Type == 'appointment' &&
        item?.mode_of_service == 'schedule' &&
        isEmpty(selectedAppointmentSlot)
      ) {
        setAppointmentPicker(true);
        setSelectedProductForAppointment(item?.id || item?.variant[0].id);
        setSelectedAllProductDataForAppointment(item);
        setSelectedSection(section);
        setPressedItemInx(inx);
        return;
      }

      if (!!item.is_recurring_booking) {
        if (isEmpty(selectedPlanValues)) {
          showInfo('Click on Calendar icon to schedule the item!');
          // showError('Plan type should not be empty!');
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
      if (
        !!categoryInfo?.is_vendor_closed &&
        !categoryInfo?.show_slot &&
        !categoryInfo?.closed_store_order_scheduled
      ) {
        alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
        return;
      }
      // playHapticEffect(hapticEffects.impactLight);
      let getTypeId =
        !!item?.category && item?.category.category_detail?.type_id;
      updateState({ selectedItemID: item?.id, btnLoader: true });
      if (item?.add_on_count !== 0 || item?.variant_set_count !== 0) {
        setSelectedSection(section);
        setSelectedCarItems(item);
        setIsVisibleModal(true);
        updateState({
          updateQtyLoader: false,
          typeId: getTypeId,
          selectedItemID: -1,
          btnLoader: false,
        });
        return;
      }
      if (item?.add_on_count !== 0 && item?.mode_of_service === 'schedule') {
        setSelectedSection(section);
        setSelectedCarItems(item);
        setIsVisibleModal(true);
        updateState({
          updateQtyLoader: false,
          typeId: getTypeId,
          selectedItemID: -1,
          btnLoader: false,
        });
        return;
      }

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
      data['sku'] = item.sku;
      data['quantity'] = !!item?.minimum_order_count
        ? Number(item?.minimum_order_count)
        : 1;
      data['product_variant_id'] = item?.variant[0].id;
      data['type'] = dineInType;
      console.log('Sending api data', data);
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

      console.log(data, 'data for cart in single item');

      data['type'] = dine_In_Type;

      data['recurringformPost'] = recurringformPost;

      console.log('Sending api data', data, 'data for cart');
      actions
        .addProductsToCart(data, {
          code: appData.profile.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then(res => {
          console.log(res, 'add single item addProductsToCart');
          actions.cartItemQty(res);
          updateState({ cartId: res.data.id });
          setSelectedAppointmentSlot({});
          setAppointmentSelectedDate(null);
          // showSuccess('Product successfully added');
          if (!!section) {
            console.log('itemSectionUpdateitemSectionUpdate', section);
            //here we updated particular item of array with the help of item index and section index.
            let itemSectionUpdate = cloneDeep(section);
            itemSectionUpdate.data[inx].qty = !!itemSectionUpdate?.data[inx]
              ?.minimum_order_count //here we added new key name as qty
              ? Number(itemSectionUpdate?.data[inx]?.minimum_order_count)
              : 1;
            itemSectionUpdate.data[inx].cart_product_id =
              res.data.cart_product_id;
            let sectionItem = cloneDeep(sectionListData);
            sectionItem[section.index] = itemSectionUpdate;
            setSectionListData(sectionItem);
            setCloneSectionList(sectionItem);
            fetchTags(sectionItem);
          } else {
            let updateArray = productListData.map((val, i) => {
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
            setProductListData(updateArray);
          }
          setSelectedSection(section);
          setSelectedCarItems(item);
          updateState({
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
          });
        })
        .catch(error => {
          errorMethodSecond(error, [], item, section, inx);
        });
    },
    [
      cloneSectionList,
      productListData,
      selectedCartItem,
      categoryInfo,
      selectedAppointmentSlot,
      appointmentSelectedDate,
      isAppointmentPicker,
      isAppointmentSlotsModal,
    ],
  );

  const checkIsCustomize = useCallback(
    async (item, section = null, index, type) => {
      if (item?.category?.category_detail?.type_id == 10 && type == 1) {
        showError('Rental product already added in cart!');
        return;
      }
      let itemToUpdate = cloneDeep(item);
      // console.log('check item to update', itemToUpdate);
      // return;

      if (
        itemToUpdate?.add_on_count == 0 &&
        itemToUpdate?.variant_set_count == 0
      ) {
        // hit in case of simple products withou any customization
        addProductsWithoutCustomize(item, section, index, type);
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
        itemToUpdate?.check_if_in_cart_app.map(val => {
          totalProductQty = totalProductQty + val?.quantity;
        });
      }
      console.log('totalProductQty', totalProductQty);
      console.log('parentCartId', parentCartId);
      console.log('cartId', cartId);

      // return;

      var isExistqty = itemToUpdate?.qty ? itemToUpdate?.qty : totalProductQty; //this variable contain only local product quantity
      var tempQty = 0; //this variable contain latest updated quantity of products

      if (
        (type == 2 && itemToUpdate?.add_on_count !== 0) ||
        (type == 2 && itemToUpdate?.variant_set_count !== 0)
      ) {
        //hit in case of subtruction
        let apiData = { cart_id: parentCartId, product_id: item.id };
        let checkIsAvailable = await getDiffAddsOn(apiData, section, item); //check products with different addOns is exist or not.
        // console.log("check available", checkIsAvailable)
        !!checkIsAvailable?.data &&
          checkIsAvailable?.data.map(val => {
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
          itemToUpdate,
          tempQty == 0 ? isExistqty : tempQty,
          productId,
          parentCartId,
          section,
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
          setIsAddonLoading(true);
          setIsRepeatModal(true);
          const res = await actions.checkLastAdded(apiData, header);
          console.log('check last addedres++++++', res);
          if (!!res.data) {
            //open RepeatModal
            const addData = {
              item: itemToUpdate,
              index: index,
              type: type,
              section: section,
              isExistqty: tempQty == 0 ? isExistqty : tempQty,
              updateLocalQty: res.data?.quantity,
              productId: res?.data?.id,
              parentCartId: res.data.cart_id,
            };
            setSelectedSection(section);
            setRepeatItems(addData);
            setIsAddonLoading(false);
          }
        } catch (error) {
          console.log('error riased++++', error);
          showError(error?.message || error?.error);
          setIsAddonLoading(false);
        }
        return;
      }
    },
    [cloneSectionList, productListData, selectedCartItem, cartId],
  );

  //useCallback end

  useEffect(() => {
    // setLoading(true)
    updateState({ pageNo: 1, loadMore: true });
    setSelectedAppointmentSlot({});
    getAllListItems(1);
    if (productListId?.vendor && routeData) {
      fetchOffers();
    }
    if (isLoadingC && !data?.vendor) {
      getAllProductsByCategoryId(true);
    }
  }, [
    navigation,
    languages,
    currencies,
    reloadData,
    CartItems,
    selectedCategory,
  ]);

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
    if (
      (data?.vendor || (data && notificationData)) &&
      data?.screenName != 'category'
    ) {
      {
        !!selectedFilters.current
          ? newVendorFilter(pageNo)
          : getAllProductsByVendor(pageNo);
      }
    } else {
      {
        !!selectedFilters.current
          ? getAllProductsCategoryFilter(pageNo)
          : getAllProductsByCategoryId(pageNo);
      }
    }
    // setTimeout(() => {
    //   updateState({ loadMore: false });
    // }, 500);
  };

  useEffect(() => {
    getAllVendorFilters();
  }, []);

  const getAllVendorFilters = () => {
    actions
      .getVendorFilters(
        `/ ${!!productListId?.id ? productListId?.id : data} `,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
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

  /****Get all list items by vendor id */
  const getAllProductsByVendorCategory = () => {
    console.log('api hit getAllProductsByVendorCategory', data);
    actions
      .getProductByVendorCategoryId(
        `/ ${data?.vendorData?.slug} /${data?.categoryInfo?.slug}?page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        console.log(res, 'getProductByVendorCategoryId');
        // setFilterData(res?.data?.filterData)
        setCategoryInfo(res?.data?.vendor);
        setLoading(false);
        setProductListData(
          pageNo == 1
            ? res.data.products.data
            : [...productListData, ...res?.data?.products?.data],
        );
        updateBrandAndCategoryFilter(res.data.filterData, appMainData?.brands);
      })
      .catch(errorMethod);
  };

  const updateBrandAndCategoryFilter = (filterData, allBrands) => {
    var brandDatas = [];
    var filterDataNew = [];
    // if (allBrands.length) {
    //   brandDatas = [
    //     {
    //       id: -1,
    //       label: strings.BRANDS,
    //       value: allBrands.map((i, inx) => {
    //         return {
    //           id: i?.translation[0]?.brand_id,
    //           label: i?.translation[0]?.title,
    //           parent: strings.BRANDS,
    //         };
    //       }),
    //     },
    //   ];

    //   updateState({allFilters: [...allFilters,...brandDatas]});
    // }

    // Price filter
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
      setAllFilter(filterDataNew);
    }
  };

  const onFilterApply = (filterData = {}) => {
    console.log(filterData, 'filterDatafilterData');
    selectedFilters.current = filterData;
    // setFilteredAtoZData(filterData)
    updateState({ loadMore: true });
    updateState({ pageNo: 1 });
    getAllListItems(1);
  };
  const allClearFilters = () => {
    updateState({ loadMore: true });
    selectedFilters.current = null;
    updateState({
      pageNo: 1,
      selectedSortFilter: null,
      minimumPrice: 0,
      maximumPrice: 50000,
    });
    getAllListItems(1);
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendor = pageNo => {
    console.log(data, 'api hit getAllProductsByVendor');
    updateState({ wrapperListLoader: true });
    let vendorId = !!data?.vendorData
      ? data?.vendorData.id
      : !!productListId.id
        ? productListId.id
        : data;

    let apiData = `/${vendorId}?page=${pageNo ? pageNo : 1
      }&type=${dineInType}&limit=40`;

    if (!!data?.categoryExist) {
      //sent category id if user comes from category>>vendor>>productList
      apiData = apiData + `&category_id=${data?.categoryExist}`;
    }
    actions
      .getProductByVendorIdOptamizeV2(
        apiData,
        {},
        {
          code: appData.profile.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          latitude: location?.latitude,
          longitude: location?.longitude,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(async res => {
        console.log('get all products by vendor res', res?.data, pageNo);
        setLoading(false);
        // return;
        updateState({ wrapperListLoader: false });
        if (!!res?.data?.vendor) {
          //set static height due to auto scroll category
          let detail = res?.data?.vendor;
          if (!!detail?.desc) {
            setListHeight(height / 2.8);
          }
        }

        if (res?.data?.vendor) {
          FastImage.preload([
            {
              uri: getImageUrl(
                res?.data?.vendor?.banner?.image_fit ||
                res?.data?.vendor?.image?.image_fit,
                res?.data?.vendor?.banner?.image_path ||
                res?.data?.vendor?.image?.image_path,
                '400/400',
              ),
            },
          ]); //category banner preload
        }

        if (res?.data?.vendor?.is_show_products_with_category) {
          let resData = res?.data?.categories || [];

          console.log('resDataresDataresData', resData);
          await preLoadImages(resData);
          setSectionListData(resData);
          setCloneSectionList(resData);
          // setFilterData(res?.data?.filterData)

          setCategoryInfo(res?.data?.vendor);
          fetchTags(resData);
          setLoading(false);
        } else {
          if (res?.data) {
            if (
              !!res?.data &&
              !!res?.data?.products &&
              res?.data?.products?.data?.length == 0
            ) {
              updateState({ loadMore: false });
              loadMoreProduct = false;
            }
            if (res?.data?.products?.last_page == pageNo) {
              updateState({ loadMore: false });
            } else {
              updateState({
                loadMore: true,
                lastPage: res?.data?.products?.last_page,
              });
            }
            setCategoryInfo(res?.data?.vendor);
            setLoading(false);
            setProductListData(
              pageNo == 1
                ? res?.data?.products.data
                : [...productListData, ...res?.data?.products.data],
            );

            if (pageNo == lastPage) {
              updateState({
                loadMore: false,
              });
            }
          } else {
            setLoading(false);
          }
        }
        if (res?.data) {
          updateBrandAndCategoryFilter(
            res?.data?.filterData,
            appMainData?.brands,
          );
        }
        // updateState({ loadMore: false });
      })
      .catch(errorMethod);
  };

  //***************get products by vendor filter**************
  const newVendorFilter = async (pageNo, loading = false) => {
    console.log('api hit new vendorFilter', selectedFilters);
    let data = {};
    data['variants'] = selectedFilters?.current?.selectedVariants || [];
    data['options'] = selectedFilters?.current?.selectedOptions || [];
    data['brands'] = selectedFilters?.current?.sleectdBrands || [];
    data['order_type'] = selectedFilters?.current?.selectedSorting || 0;
    data['range'] = `${minimumPrice};${maximumPrice}`;
    data['vendor_id'] = productListId.id;
    // data['limit'] = limit;
    data['page'] = pageNo;
    data['type'] = dineInType;
    data['tag_products'] =
      ProductTags && ProductTags?.length
        ? ProductTags.map(i => {
          return i?.isSelected ? i?.id : null;
        }).filter(x => x != null)
        : [];
    console.log(data, '>data>data');
    console.log('sending data', data);
    setLoading(loading ? false : true);
    actions
      .newVendorFilters(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then(async res => {
        console.log('filter vendor res', res);

        if (res?.data?.vendor?.is_show_products_with_category) {
          let resData = res?.data?.categories || [];
          // await preLoadImages(resData);
          setSectionListData(resData);
          setCloneSectionList(resData);
          // setFilterData(res?.data?.filterData)
          setCategoryInfo(res?.data?.vendor);
          // fetchTags(resData);
          setLoading(false);
        } else {
          // console.log('get product list by vendor id >>>> ', res);
          if (res?.data) {
            if (res.data.products.data?.length == 0) {
              updateState({ loadMore: false });
            }
            setCategoryInfo(res?.data?.vendor);
            setLoading(false);
            setProductListData(
              pageNo == 1
                ? res.data.products.data
                : [...productListData, ...res.data.products.data],
            );
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
        updateState({ loadMore: false });
      })
      .catch(errorMethod);
    // }
  };
  /**********Get all list items by category id productListData*/
  const getAllProductsByCategoryId = pageNo => {
    const productWithCategoryId = data?.productWithSingleCategory
      ? data?.id
      : !!productListId.id
        ? productListId.id
        : data;
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
          latitude: location?.latitude,
          longitude: location?.longitude,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then(res => {
        // console.log(res, 'resres');
        if (!!res?.data) {
          console.log(res, 'res getProductByCategoryId');
          setCategoryInfo(categoryInfo ? categoryInfo : res.data.category);
          // checkSingleVendor(categoryInfo ? categoryInfo : res.data.category)
          // setCategoryInfo(res.data.category);
          setLoading(false);
          // onAtoZFilter()
          setProductListData(
            pageNo == 1
              ? res.data.listData.data
              : [...productListData, ...res.data.listData.data],
          );
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
            });
          }
        }
        setLoading(false);
        updateState({
          lastPage: res.data.listData?.last_page,
        });
        setApiPageNo(res?.data?.listData?.current_page)
        // getAllVendorFilters()
        // updateBrandAndCategoryFilter(res.data.filterData, appMainData.brands);
        if (res?.data?.listData?.current_page < res.data?.listData?.last_page) {
          updateState({ loadMore: true });
        } else {
          updateState({ loadMore: false });
        }
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
      data['order_type'] = selectedFilters?.current?.selectedSorting || 0;
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
            latitude: location?.latitude,
            longitude: location?.longitude,
            systemuser: DeviceInfo.getUniqueId(),
          },
        )
        .then(res => {
          console.log(res, "<==res getProductByCategoryFiltersOptamize")
          setLoading(false);
          setProductListData(
            pageNo == 1
              ? res?.data?.data
              : [...productListData, ...res?.data?.data],
          );
          updateState({
            lastPage: res.data?.last_page,
          });
          setApiPageNo(res?.data?.current_page)
          if (res?.data?.current_page < res.data?.last_page) {
            updateState({ loadMore: true });
          } else {
            updateState({ loadMore: false });
          }
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
      if (productTagsArr.length > 0) {
        setListHeight(height / 2.32);
      }
      setProductTags(productTagsArr);
    }
  };

  /*********Add product to wish list******* */
  const _onAddtoWishlist = item => {
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
          updateProductList(item);
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
    }
  };

  /*******Upadte products in wishlist>*********/
  const updateProductList = item => {
    let newArray = cloneDeep(productListData);
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
    setProductListData(newArray);
    updateState({
      updateQtyLoader: false,
      selectedItemID: -1,
    });
  };

  const errorMethod = error => {
    console.log('checking error', error);
    updateState({
      updateQtyLoader: false,
      selectedItemID: -1,
      btnLoader: false,
      wrapperListLoader: false,
    });
    setLoading(false);
    if (error?.message == 'Recurring booking type not be empty.') {
      showSuccess('Schedule the product in product detail page');
    } else {
      showError(error?.message || error?.error);
    }
    updateState({ loadMore: false });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1 });
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    if (loadMore) {
      if (pageNo < lastPage && pageNo === apiPageNo) {
        updateState({ pageNo: pageNo + 1 });
        getAllListItems(pageNo + 1);
        setLoading(false);
      }
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

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
      setCloneSectionList(sectionItem);
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
          const filterArryClone = cloneSectionList.map((f, fnx) => {
            if (f?.id == section?.id) {
              return section;
            }
            return f;
          });
          setSectionListData(filterArr);
          setCloneSectionList(filterArryClone);

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

  const difAddOnsAdded = async (
    item,
    qty,
    productId,
    cartId,
    section,
    index,
    type,
  ) => {
    let batchCount = !!item?.batch_count ? item?.batch_count : 1;
    let differentAddsOnsQty = 0;
    let cloneArr = differentAddsOns;
    let updateLocallyAddOns = cloneArr.map(val => {
      differentAddsOnsQty = differentAddsOnsQty + val.quantity;
      if (cartId == val.id) {
        return {
          ...val,
          quantity: type == 1 ? qty + batchCount : qty - batchCount,
        };
      }
      return val;
    });
    await addDeleteCartItems(
      item,
      qty,
      cartId,
      productId,
      section,
      index,
      type,
      null,
      type == 1
        ? differentAddsOnsQty + batchCount
        : differentAddsOnsQty - batchCount, //send updated total quantity
    );
    setDifferentAddsOns(updateLocallyAddOns);
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
      const filterArryClone = cloneSectionList.map((f, fnx) => {
        if (f?.id == selectedSection?.id) {
          return selectedSection;
        }
        return f;
      });
      setSectionListData(filterArr);
      setCloneSectionList(filterArryClone);
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
  useEffect(() => {
    if (isLoadingC && !data?.vendor) {
      getAllProductsByCategoryId(1);

      if (productListId?.vendor && routeData) {
        fetchOffers();
      }
      getAllProductTags();
    }
  }, [isLoadingC]);

  const checkIfItemExist = (item, tags) => {
    let result = false;
    tags.forEach(el => {
      if (el.id === item.tag_id) {
        result = true;
      }
    });
    return result;
  };

  // useEffect(() => {
  //   let EnabledTags = ProductTags.filter((el) => el.isSelected);
  //   console.log(EnabledTags, 'EnabledTags');
  //   if (EnabledTags.length > 0) {
  //     console.log(sectionListData, 'sectionListData>>>>BEFORE');
  //     const newArr = sectionListData.map((el) => {
  //       const records =
  //         el.data &&
  //         el.data.filter((item) => {
  //           if (
  //             item.tags.length > 0 &&
  //             checkIfItemExist(item.tags[0], EnabledTags)
  //           )
  //             return item;
  //         });
  //       const newObj = {
  //         ...el,
  //       };
  //       newObj.data = records;
  //       return newObj;
  //     });

  //     console.log(newArr, 'sectionListData>>>>AFTER');
  //     setCloneSectionList(newArr);
  //   } else {
  //     // getAllProductsByVendor();
  //   }
  // }, [ProductTags]);

  useEffect(() => {
    let EnabledTags = ProductTags.filter(el => el.isSelected);
    if (EnabledTags?.length > 0) {
      setApiHitAgain(true);
      // appendData(null,1)
      newVendorFilter(1, true);
      const newArr = sectionListData
        .map(el => {
          const records =
            el.data &&
            el.data.filter(item => {
              if (
                item.tags?.length > 0 &&
                checkIfItemExist(item.tags[0], EnabledTags)
              )
                return item;
            });
          const newObj = {
            ...el,
          };
          if (records && records?.length) {
            newObj.data = records;
            return newObj;
          } else {
            return null;
          }
        })
        .filter(x => x != null);
      setCloneSectionList(newArr);
      setTagFilteredData(newArr);
      setIsFilteredData(true);
      console.log(newArr, 'newArrnewArr');
    } else {
      setCloneSectionList(sectionListData);
      if (apiHitAgain) {
        setIsFilteredData(false);
        setApiHitAgain(false);
        setLoading(true);
        getAllProductsByVendor();
      }
    }
  }, [updateTagFilter, ProductTags]);

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

  // Search with more
  const onSearchWithinMenu = (text, data = [], withApiSearch = false) => {
    updateState({ searchInput: text });
    if (text) {
      let searchItems = withApiSearch ? data : sectionListData;
      const searchData = [];
      const newArr = searchItems?.map(el => {
        const records =
          el?.data &&
          el?.data.filter(item => {
            return item?.translation[0]?.title
              .toLowerCase()
              .includes(text.toLowerCase());
          });
        const newObj = {
          ...el,
        };
        newObj.data = records;

        return newObj;
        console.log('checking products >>>>>', records);
        // Arr.push(...records)
      });

      newArr?.map(item => {
        if (item?.data?.length != 0) {
          searchData?.push(item);
        }
      });
      console.log('checking products >>>>>', searchData);

      setCloneSectionList(searchData);
    } else {
      getAllProductsByVendor();
    }
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
          {cloneSectionList.map((el, index) => {
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

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {!!data?.categoryExist && !data?.isVerndorList ? (
              <SafeAreaView>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: moderateScale(16),
                      marginBottom: moderateScaleVertical(16),
                    }}>
                    <HomeLoader
                      height={36}
                      rectHeight={36}
                      rectWidth={36}
                      width={36}
                      rx={20}
                      ry={20}
                    />
                    <View style={{ marginRight: moderateScale(8) }} />
                    <HomeLoader
                      height={12}
                      rectHeight={12}
                      rectWidth={80}
                      width={80}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: moderateScale(16),
                      marginBottom: moderateScaleVertical(16),
                    }}>
                    <HomeLoader
                      height={25}
                      rectHeight={25}
                      rectWidth={25}
                      width={25}
                    />
                    <View style={{ marginRight: moderateScale(16) }} />
                    <HomeLoader
                      height={25}
                      rectHeight={25}
                      rectWidth={25}
                      width={25}
                    />
                  </View>
                </View>
              </SafeAreaView>
            ) : (
              <View>
                <HeaderLoader
                  viewStyles={{
                    // marginHorizontal: moderateScale(20),
                    // marginBottom: moderateScale(10),
                    marginHorizontal: 0,
                  }}
                  widthLeft={width}
                  rectWidthLeft={width}
                  heightLeft={moderateScaleVertical(152)}
                  rectHeightLeft={moderateScaleVertical(152)}
                  isRight={false}
                  rx={4}
                  ry={4}
                />
                <HomeLoader
                  width={width / 1.1}
                  height={18}
                  rectHeight={18}
                  rectWidth={width / 1.1}
                  viewStyles={{
                    marginTop: moderateScaleVertical(8),
                    marginHorizontal: moderateScale(16),
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: moderateScale(16),
                    marginTop: moderateScaleVertical(16),
                  }}>
                  <HomeLoader
                    height={40}
                    rectHeight={40}
                    rectWidth={60}
                    width={60}
                  />
                  <HomeLoader
                    height={40}
                    rectHeight={40}
                    rectWidth={60}
                    width={60}
                  />
                </View>
                <View
                  style={{
                    ...styles.horizontalLine,
                    marginVertical: 16,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: moderateScale(16),
                    marginBottom: moderateScaleVertical(16),
                  }}>
                  <HomeLoader
                    height={20}
                    rectHeight={20}
                    rectWidth={60}
                    width={60}
                  />
                  <View style={{ marginRight: moderateScale(16) }} />
                  <HomeLoader
                    height={20}
                    rectHeight={20}
                    rectWidth={60}
                    width={60}
                  />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <HomeLoader
                    width={width / 1.2}
                    height={34}
                    rectHeight={34}
                    rectWidth={width / 1.2}
                    viewStyles={{
                      marginHorizontal: 16,
                    }}
                  />
                  {/* <View style={{ marginHorizontal: moderateScale(16) }} /> */}
                  <HomeLoader
                    height={25}
                    width={25}
                    rectHeight={25}
                    rectWidth={25}
                  />
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              marginHorizontal: moderateScale(16),
              marginTop: moderateScaleVertical(8),
            }}>
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
            <ProductListLoader3 />
            <View style={{ marginBottom: moderateScaleVertical(12) }} />
          </View>
          {!data?.isVerndorList && (
            <View style={{ marginHorizontal: moderateScale(16) }}>
              <ProductListLoader3 />
              <View style={{ marginBottom: moderateScaleVertical(12) }} />
              <ProductListLoader3 />
              <View style={{ marginBottom: moderateScaleVertical(12) }} />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  const updateMinMax = (min, max) => {
    updateState({ minimumPrice: min, maximumPrice: max });
  };

  const onShowHideFilter = () => {
    updateState({ isShowFilter: !isShowFilter });
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

  const onMenuTap = () => {
    // playHapticEffect(hapticEffects.impactLight);
    updateState({ MenuModalVisible: !MenuModalVisible });
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
      let totalLimit = `&limit=${15}`;

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
        latitude: location?.latitude,
        longitude: location?.longitude,
        systemuser: DeviceInfo.getUniqueId(),
      };
      console.log('sending header', headers);
      const res = await actions.getMoreCategories(apiData, data, headers);
      console.log('get more cat res', res.data.products);
      if (res.data.products.data.length == 0) {
        setHideViewMore(false);
      }

      console.log('res++++', res);
      let cloneArry = cloneSectionList[section.index];
      console.log('append clonearry', cloneArry.data);
      let arry = [...cloneArry?.data, ...res?.data.products.data];

      let uniqueProductsArray = [
        ...new Map(arry.map(item => [item['id'], item])).values(),
      ];
      console.log('append item', uniqueProductsArray, arry);
      let dummyData = cloneSectionList;
      dummyData[section.index].data = uniqueProductsArray;
      console.log('append last data', dummyData);

      if (res?.data) {
        setIsLoadMoreData(false);
      }

      if (!!searchInput) {
        onSearchWithinMenu(searchInput, dummyData, true);
        //  console.log(' i am here');
        setProductDataLengthAfterViewMoreSearch(res.data.products?.data);
      } else {
        updateState({
          cloneSectionList: dummyData,
        });
      }
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

  const onDateSelected = async (date) => {
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
          if (!!res && !!res?.data && isEmpty(res?.data)) {
            setLoadingGetSlots(false);
            setAppointmentPicker(false);
            setSelectedAppointmentIndx(null);
            setSelectedAppointmentSlot({});
            alert("Please choose a different date as the selected slots are not available at the moment.")
            return;
          }
          if (res) {
            setAppointmentAvailableSlots(res.data);
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
          showError(error?.message || error?.error || "something wen't wrong");
          setLoadingGetSlots(false);
          setAppointmentPicker(false);

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

    console.log("selectedAllProductDataForAppointment",selectedAppointmentSlot)
    // return;
    if(!!selectedAppointmentSlot?.value){
      if(!!typeId && typeId == 8){
        setAppointmentSlotsModal(false);
        setTimeout(() => {
          setIsVisibleModal(true)
        }, 500);
        return;
      }
      setAppointmentSlotsModal(false);
      setAppointmentPicker(false);
      setSelectedAgent({});
      addSingleItem(
        selectedAllProductDataForAppointment,
        selectedSection,
        selectedItemIndx,
      );
    }else{
      alert("Please select slot")
    }
   
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
              Done
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

  return (
    <WrapperContainer isLoading={wrapperListLoader}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
            flex: 1,
            // paddingVertical: moderateScale(16),
          }}>
          <View style={{ flex: 1 }}>
            {((AnimatedHeaderValue && productListData?.length > 6) ||
              (!!sectionListData?.length && AnimatedHeaderValue)) && (
                <View
                  style={{
                    ...styles.headerStyle,
                    marginBottom: moderateScale(12),
                    // height: 52
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => navigation.goBack()}
                      hitSlop={styles.hitSlopProp}>
                      <Image
                        style={{
                          tintColor: isDarkMode ? colors.white : colors.black,
                          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                        }}
                        source={imagePath.icBackb}
                      />
                    </TouchableOpacity>

                    <View style={{ marginLeft: moderateScale(8), flex: 0.7 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {isSVG ? (
                          <SvgUri
                            height={moderateScale(40)}
                            width={moderateScale(40)}
                            uri={imageURI}
                          />
                        ) : (
                          <RoundImg
                            img={imageURI}
                            size={30}
                            isDarkMode={isDarkMode}
                            MyDarkTheme={MyDarkTheme}
                          />
                        )}
                        <View style={{ marginLeft: moderateScale(8) }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: isDarkMode ? colors.white : colors.black,
                              fontSize: moderateScale(14),
                              fontFamily: fontFamily.medium,
                            }}>
                            {name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={{
                              color: isDarkMode
                                ? colors.white
                                : colors.blackOpacity43,
                              fontSize: moderateScale(12),
                              fontFamily: fontFamily.regular,
                              marginTop: moderateScaleVertical(2),
                            }}>
                            {categoryInfo?.categoriesList || ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {isSearch ? (
                    <View>
                      <SearchBar
                        containerStyle={{
                          marginHorizontal: moderateScale(18),
                          borderRadius: 8,
                          width: width / 1.15,
                          backgroundColor: isDarkMode
                            ? colors.whiteOpacity15
                            : colors.greyColor,
                          height: moderateScaleVertical(37),
                        }}
                        searchValue={searchInput}
                        placeholder={strings.SEARCH_ITEM}
                        // onChangeText={(value) => onChangeText(value)}
                        showRightIcon
                        rightIconPress={rightIconPress}
                      />
                    </View>
                  ) : (
                    <></>
                    // <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    //   <TouchableOpacity
                    //     activeOpacity={0.8}
                    //     // onPress={() => updateState({isSearch: true})}
                    //     onPress={moveToNewScreen(
                    //       navigationStrings.SEARCHPRODUCTOVENDOR,
                    //       {
                    //         type: data?.vendor
                    //           ? staticStrings.VENDOR
                    //           : staticStrings.CATEGORY,
                    //         id: data?.vendor ? data?.id : productListId?.id,
                    //       },
                    //     )}>
                    //     <Image
                    //       style={{
                    //         tintColor: isDarkMode
                    //           ? colors.white
                    //           : colors.black,
                    //         transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    //       }}
                    //       source={
                    //         !!data?.showAddToCart ? false : imagePath.icSearchb
                    //       }
                    //     />
                    //   </TouchableOpacity>
                    //   <View style={{ marginHorizontal: moderateScale(8) }} />
                    //   <TouchableOpacity
                    //     onPress={onShare}
                    //     hitSlop={hitSlopProp}
                    //     activeOpacity={0.8}>
                    //     <Image
                    //       style={{
                    //         tintColor: isDarkMode
                    //           ? colors.white
                    //           : colors.black,
                    //         transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                    //       }}
                    //       source={imagePath.icShareb}
                    //     />
                    //   </TouchableOpacity>
                    // </View>
                  )}

                  {isSearch ? (
                    <SearchBar
                      containerStyle={{
                        marginHorizontal: moderateScale(18),
                        borderRadius: 8,
                        width: width / 1.15,
                        backgroundColor: isDarkMode
                          ? colors.whiteOpacity15
                          : colors.greyColor,
                        height: moderateScaleVertical(37),
                      }}
                      searchValue={searchInput}
                      placeholder={strings.SEARCH_ITEM}
                      // onChangeText={(value) => onChangeText(value)}
                      showRightIcon
                      rightIconPress={rightIconPress}
                    />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity
                        activeOpacity={0.8}
                        // onPress={() => updateState({isSearch: true})}
                        onPress={moveToNewScreen(
                          navigationStrings.SEARCHPRODUCTOVENDOR,
                          {
                            type: data?.vendor
                              ? staticStrings.VENDOR
                              : staticStrings.CATEGORY,
                            id: data?.vendor ? data?.id : productListId?.id,
                          },
                        )}>
                        <Image
                          style={{
                            tintColor: isDarkMode ? colors.white : colors.black,
                            transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                          }}
                          source={
                            !!data?.showAddToCart ? false : imagePath.icSearchb
                          }
                        />
                      </TouchableOpacity>
                      <View style={{ marginHorizontal: moderateScale(8) }} />
                      <TouchableOpacity
                        onPress={onShare}
                        hitSlop={hitSlopProp}
                        activeOpacity={0.8}>
                        <Image
                          style={{
                            tintColor: isDarkMode ? colors.white : colors.black,
                            transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                          }}
                          source={imagePath.icShareb}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

            {!!categoryInfo?.is_show_products_with_category ? (
              <SectionList
                onScroll={onScroll}
                ref={sectionListRef}
                showsVerticalScrollIndicator={false}
                sections={isFilteredData ? tagFilteredData : cloneSectionList}
                ListHeaderComponent={listHeaderComponent2()}
                stickySectionHeadersEnabled={false}
                keyExtractor={awesomeChildListKeyExtractor}
                // tabBarStyle={styles.tabBar}
                // ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderTab={renderSectionTab}
                renderItem={renderSectionItem}
                renderSectionHeader={renderSectionHeader}
                renderSectionFooter={renderSectionFooter}
                getItemLayout={getItemLayout}
                onScrollToIndexFailed={val => console.log('indexed failed')}
                ItemSeparatorComponent={() => (
                  <View style={{ height: moderateScale(8) }} />
                )}
                // contentContainerStyle={{
                //   paddingBottom: moderateScale(60),
                // }}

                ListEmptyComponent={listEmptyComponent}
                extraData={cloneSectionList}
                // Performance settings
                removeClippedSubviews={true} // Unmount components when outside of window
                // initialNumToRender={2} // Reduce initial render amount
                // maxToRenderPerBatch={10} // Redu ce number in each render batch
                updateCellsBatchingPeriod={20} // Increase time between renders
              // windowSize={7} // Reduce the window size
              />
            ) : (
              <FlatList
                onScroll={onScroll}
                disableScrollViewPanResponder
                showsVerticalScrollIndicator={false}
                data={productListData}
                renderItem={renderProduct}
                ListHeaderComponent={listHeaderComponent2()}
                keyExtractor={awesomeChildListKeyExtractor}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ flexGrow: 1 }}
                extraData={productListData}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                //  getItemLayout={getItemLayout}
                // refreshing={isRefreshing}
                initialNumToRender={12}
                // maxToRenderPerBatch={10}
                // windowSize={10}
                // refreshControl={
                //   <RefreshControl
                //     refreshing={isRefreshing}
                //     onRefresh={handleRefresh}
                //     tintColor={themeColors.primary_color}
                //   />
                // }
                onEndReached={
                  !categoryInfo?.is_show_products_with_category &&
                  onEndReachedDelayed
                }
                onEndReachedThreshold={0.5}
                ListFooterComponent={listFooterComponent}
                ListEmptyComponent={listEmptyComponent}
              />
            )}
            {/* <View style={{height: moderateScaleVertical(60)}} /> */}

            {isVisibleModal ? (
              <TouchableWithoutFeedback
                onPress={() => setIsVisibleModal(false)}>
                <BlurView
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                  viewRef={blurRef}
                  blurType="dark"
                  blurAmount={10}
                  blurRadius={10}
                />
              </TouchableWithoutFeedback>
            ) : null}
          </View>

          {!!typeId && typeId == 8 ? (
            <View>
              {isVisibleModal && (
                <HomeServiceVariantAddons
                  addonSet={selectedCartItem?.add_on}
                  isVisible={isVisibleModal}
                  productdetail={selectedCartItem}
                  onClose={onCloseModal}
                  showShimmer={showShimmer}
                  shimmerClose={val => setShowShimmer(val)}
                  updateCartItems={updateCartItems}
                // modeOfService={selectedCartItem?.mode_of_service}
                />
              )}
            </View>
          ) : (
            <>
              {isVisibleModal ? (
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
                    onChange={index => {
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
                        shimmerClose={val => setShowShimmer(val)}
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
                        selectedQuickSelectionValue={
                          selectedQuickSelectionValue
                        }
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
                          {typeId !== 10 &&
                            !showErrorMessageTitle &&
                            dine_In_Type != 'appointment' && (
                              <View
                                style={{
                                  flex: 0.35,
                                  marginRight: moderateScale(8),
                                }}>
                                <View
                                  style={{
                                    ...commonStyles.buttonRect,
                                    ...styles.incDecBtnStyle,
                                    backgroundColor:
                                      getColorCodeWithOpactiyNumber(
                                        themeColors.primary_color.substr(1),
                                        15,
                                      ),
                                    borderColor: themeColors?.primary_color,
                                    height: moderateScale(38),
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
              ) : null}
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
          {!isVisibleModal && (
            <GradientCartView
              onPress={() => {
                playHapticEffect(hapticEffects.notificationSuccess);
                navigation.navigate(navigationStrings.CART);
              }}
              btnText={
                CartItems && CartItems.data && CartItems.data.item_count
                  ? `${CartItems.data.item_count} ${CartItems.data.item_count == 1
                    ? strings.ITEM
                    : strings.ITEMS
                  } | ${tokenConverterPlusCurrencyNumberFormater(
                    Number(CartItems?.data?.gross_paybale_amount),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}`
                  : ''
              }
              ifCartShow={
                CartItems && CartItems.data && CartItems.data.item_count > 0
                  ? true
                  : false
              }
              isMenuBtnShow={categoryInfo?.is_show_products_with_category}
              onMenuTap={onMenuTap}
              isLoading={btnLoader}
              sectionListData={sectionListData}
              isCategoryExist={!!data?.categoryExist}
            // btnStyle={
            //   appStyle?.tabBarLayout == 4 && {marginBottom: moderateScale(160)}
            // }
            />
          )}

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

          <BottomSlideModal
            mainContainView={RenderMenuView}
            isModalVisible={MenuModalVisible}
            mainContainerStyle={{
              width: '100%',
              paddingHorizontal: moderateScale(15),
              marginHorizontal: 0,
              height: moderateScale(250),
              backgroundColor: 'transparent',
              marginBottom: moderateScaleVertical(16),
            }}
            innerViewContainerStyle={{
              width: '100%',
              paddingHorizontal: 0,
              marginHorizontal: 0,
              backgroundColor: 'white',
              borderRadius: moderateScale(10),
              marginBottom: moderateScaleVertical(16),
            }}
            onBackdropPress={() => {
              updateState({ MenuModalVisible: !MenuModalVisible });
            }}
          />

          {/* Add new addons and repeat item view */}
          {!!isRepeastModal ? (
            <RepeatModal
              data={repeatItems?.item}
              modalHide={() => setIsRepeatModal(false)}
              onRepeat={onRepeat}
              onAddNew={onAddNew}
              isAddonLoading={isAddonLoading}
            />
          ) : null}

          {!!differentAddsOns && differentAddsOns?.length > 1 ? (
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
          ) : null}

          {isShowFilter ? (
            <FilterComp
              isDarkMode={isDarkMode}
              themeColors={themeColors}
              onFilterApply={onFilterApply}
              onShowHideFilter={onShowHideFilter}
              allClearFilters={allClearFilters}
              selectedSortFilter={selectedSortFilter}
              onSelectedSortFilter={val =>
                updateState({ selectedSortFilter: val })
              }
              maximumPrice={maximumPrice}
              minimumPrice={minimumPrice}
              updateMinMax={updateMinMax}
              filterData={allFilters}
              currencies={currencies}
            />
          ) : null}
        </View>
      </View>
      {isSocialMediaModal ? (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={[200]}
          // style={{minHeight: 100, maxHeight: 200}}
          enablePanDownToClose
          onChange={index => {
            if (index == -1) {
              setIsSocialMediaModal(false);
            }
            // playHapticEffect(hapticEffects.impactMedium);
          }}
          handleComponent={() => <></>}
          containerStyle={{
            backgroundColor: colors.blackOpacity66,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            {!isEmpty(categoryInfo?.social_media_links)
              ? categoryInfo?.social_media_links.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => onPressSocialMediaItem(item)}
                    style={{
                      width: '24%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingTop: 15,
                    }}>
                    <Image
                      source={{ uri: item?.icon_url }}
                      style={{
                        height: 40,
                        width: 40,
                      }}
                    />
                  </TouchableOpacity>
                );
              })
              : null}
          </View>
        </BottomSheet>
      ) : null}

      <Modal
        key={'5'}
        isVisible={isAppointmentPicker}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => {
          setIsDatePicker(false);
          setSelectedDate(null);
        }}>
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
              hitSlop={hitSlopProp}
              style={{
                padding: moderateScale(8),
              }}
              onPress={() => {
                if (isAppointmentPicker) {
                  setAppointmentPicker(false);
                  setAppointmentSelectedDate('');
                } else {
                  setIsDatePicker(false);
                  setSelectedDate(null);
                }
              }}>
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
            date={
              isAppointmentPicker
                ? appointmentSelectedDate || new Date()
                : selectedDate || new Date()
            }
            textColor={isDarkMode ? colors.white : colors.blackB}
            mode="date"
            minimumDate={new Date()}
            onDateChange={value =>
              isAppointmentPicker
                ? setAppointmentSelectedDate(value)
                : setSelectedDate(value)
            }
          />
          <ButtonWithLoader
            onPress={() =>
              onDateSelected(
                isAppointmentPicker
                  ? appointmentSelectedDate || new Date()
                  : selectedDate || new Date(),
              )
            }
            btnText="Done"
            isLoading={isLoadingGetSlots}
            btnStyle={{
              backgroundColor: themeColors?.primary_color,
              borderWidth: 0,
              marginBottom: moderateScaleVertical(35),
              width: moderateScale(width - 40),
              alignSelf: 'center',
            }}
          />
        </View>
      </Modal>

      <ReactNativeModal
        isVisible={isAppointmentSlotsModal}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
        onBackdropPress={() => setAppointmentSlotsModal(false)}
      >
        <AppointmentSlotModal />
      </ReactNativeModal>
    </WrapperContainer>
  );
}
