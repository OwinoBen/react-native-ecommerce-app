import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {BlurView} from '@react-native-community/blur';
import Clipboard from '@react-native-community/clipboard';
import _, {cloneDeep, debounce} from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import Toast from 'react-native-simple-toast';
import SectionList from 'react-native-tabs-section-list';
import {useSelector} from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import BottomSlideModal from '../../Components/BottomSlideModal';
import CustomAnimatedLoader from '../../Components/CustomAnimatedLoader';
import DifferentAddOns from '../../Components/DifferentAddOns ';
import FilterComp from '../../Components/FilterComp';
import GradientCartView from '../../Components/GradientCartView';
import HomeServiceVariantAddons from '../../Components/HomeServiceVariantAddons';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import HomeLoader from '../../Components/Loaders/HomeLoader';
import ProductListLoader3 from '../../Components/Loaders/ProductListLoader3';
import NoDataFound from '../../Components/NoDataFound';
import ProductCard3 from '../../Components/ProductCard3';
import RepeatModal from '../../Components/RepeatModal';
import RoundImg from '../../Components/RoundImg';
import SearchBar from '../../Components/SearchBar';
import VariantAddons from '../../Components/VariantAddons';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc, {hitSlopProp} from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../../utils/commonFunction';
import {
  checkEvenOdd,
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import {removeItem} from '../../utils/utils';
import stylesFunc from './styles';

import { enableFreeze } from "react-native-screens";
enableFreeze(true);


let timeOut = undefined;

var tempQty = 0;
var loadMore = true;

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

export default function ProductWithCategory({route, navigation}) {
  const bottomSheetRef = useRef(null);
  let selectedFilters = useRef(null);
  // console.log(route.params, 'route.params');
  const {data} = route.params;
  const routeData = data?.fetchOffers;
  const {blurRef} = useRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const dine_In_Type = useSelector((state) => state?.home?.dineInType);
  const dineInType = useSelector((state) => state?.home?.dineInType);
  const CartItems = useSelector((state) => state?.cart?.cartItemCount);
  const reloadData = useSelector((state) => state?.reloadData?.reloadData);

  const [activeIdx, setActiveIdx] = useState(0);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;

  let sectionListRef = useRef(null);
  const [state, setState] = useState({
    sortFilters: filtersData,
    searchInput: '',
    pageNo: 1,
    limit: 200,
    selectedItemID: -1,
    selectedDiffAdsOnId: 0,
    minimumPrice: 0,
    maximumPrice: 50000,
    typeId: null,
    cartId: null,
    selectedItemIndx: null,
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
  });

  const {
    appData,
    themeColors,
    themeLayouts,
    currencies,
    languages,
    internetConnection,
    appStyle,
  } = useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  let businessType = appData?.profile?.preferences?.business_type || null;

  const {
    isLoadingC,
    pageNo,
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
  } = state;
  const [showShimmer, setShowShimmer] = useState(true);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [productListData, setProductListData] = useState([]);
  const [sectionListData, setSectionListData] = useState([]);
  const [cloneSectionList, setCloneSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [repeatItems, setRepeatItems] = useState(null);
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

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = stylesFunc({themeColors, fontFamily, isDarkMode, MyDarkTheme});

  //Saving the initial state
  const initialState = cloneDeep(state);
  //Logged in user data
  const userData = useSelector((state) => state?.auth?.userData);
  //app Main Data
  const appMainData = useSelector((state) => state?.home?.appMainData);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const updateState = (data) => setState((state) => ({...state, ...data}));

  //usecallback functions

  const renderSectionItem = useCallback(
    ({item, index, section}) => {
      // const url1 = item?.media[0]?.image?.path.image_fit;
      return (
        <View
          key={String(index)}
          style={{
            height: 200,
            // minHeight: url1
            //   ? moderateScaleVertical(200)
            //   : 0,
            // overflow: 'visible',
            // backgroundColor: 'red',
            // marginBottom: moderateScaleVertical(5),
          }}>
          <ProductCard3
            data={item}
            index={index}
            onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
            onAddtoWishlist={() => _onAddtoWishlist(item)}
            addToCart={() => addSingleItem(item, section, index)}
            onIncrement={() => checkIsCustomize(item, section, index, 1)}
            onDecrement={() => checkIsCustomize(item, section, index, 2)}
            selectedItemID={selectedItemID}
            btnLoader={btnLoader}
            selectedItemIndx={selectedItemIndx}
            businessType={businessType}
            categoryInfo={categoryInfo}
            animateText={animateText}
            section={section}
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
    ],
  );

  const getItemLayout = useCallback((data, index) => {
    return {length: 200, offset: 200 * index, index};
  }, []);

  const renderSectionHeader = useCallback(
    (props) => {
      const {section} = props;
      return (
        <View
          style={{
            marginHorizontal: moderateScale(16),
            marginVertical: moderateScaleVertical(8),
          }}>
          <Text
            style={{
              ...styles.hdrTitleTxt,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {section?.title}
          </Text>
        </View>
      );
    },
    [cloneSectionList],
  );

  const renderSectionTab = useCallback(
    (props) => {
      const {title, isActive, index} = props;
      if (isActive) {
        // activeIdx = props.index;
      }
      if (!AnimatedHeaderValue) {
        return <TouchableOpacity style={{width: 40}} />;
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
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {title}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [AnimatedHeaderValue],
  );

  const awesomeChildListKeyExtractor = useCallback(
    (item) => `awesome-child-key-${item?.id}`,
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

  const listFooterComponent = useCallback(() => {
    return <View style={{height: moderateScale(60)}} />;
  }, [isLoading]);

  const renderProduct = useCallback(
    ({item, index}) => {
      return (
        <View key={String(index)} style={{flex: 1}}>
          <ProductCard3
            data={item}
            index={index}
            onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
            onAddtoWishlist={() => _onAddtoWishlist(item)}
            addToCart={() => addSingleItem(item, null, index)}
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
          <View style={styles.horizontalLine} />
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
    ],
  );

  const listHeaderComponent2 = useCallback(() => {
    return (
      <View>
        {data?.categoryExist ? (
          <View
            // key={AnimatedHeaderValue}
            // duration={10}

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
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                  source={imagePath.icBackb}
                />
              </TouchableOpacity>

              <View style={{marginLeft: moderateScale(8), flex: 0.7}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  <View style={{marginLeft: moderateScale(8)}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                    source={!!data?.showAddToCart ? false : imagePath.icSearchb}
                  />
                </TouchableOpacity>
                <View style={{marginHorizontal: moderateScale(8)}} />
                <TouchableOpacity
                  onPress={onShare}
                  hitSlop={hitSlopProp}
                  activeOpacity={0.8}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                    source={imagePath.icShareb}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={{marginBottom: moderateScaleVertical(16)}}>
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
                          transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
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
                          transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                        }}
                      />
                    </TouchableOpacity>
                  </View>

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
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.white,
                        }}>
                        {data?.name || categoryInfo?.name || ''}
                      </Text>

                      {(!!appData?.profile?.preferences?.rating_check && !!categoryInfo &&
                        !!categoryInfo?.product_avg_average_rating) && (
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
                                {fontSize: textScale(9.5)},
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
                        )}
                    </View>
                    <View
                      style={{
                        marginTop: moderateScale(5),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        // numberOfLines={2}
                        style={{
                          ...styles.hdrTitleTxt,
                          flex: 0,
                          fontSize: textScale(12.5),
                          fontFamily: fontFamily.regular,
                          textAlign: 'left',
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.white,
                          width: width / 1.5,
                        }}>
                        {categoryInfo?.address || ''}
                      </Text>

                      {!!categoryInfo &&
                      !categoryInfo?.closed_store_order_scheduled ? (
                        <View
                          style={[
                            styles.hdrRatingTxtView,
                            {
                              justifyContent: 'center',
                              height: moderateScale(20),
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
                          {strings.MINIMUM_ORDER_VALUE}{' '}
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
              </LinearGradient>

              {/* ****************************************/}
              <View
                style={{
                  // backgroundColor: 'pink'
                  ...styles.hdrAbsoluteView,
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.white,
                  // // minHeight: moderateScale(80),
                }}>
                {true ? (
                  <View>
                    <Text
                      style={{
                        ...styles.milesTxt,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        marginLeft: 0,
                      }}
                      numberOfLines={1}>
                      {sectionListData.map((val) => {
                        return <Text>{val.title} </Text>;
                      })}
                    </Text>

                    {!!desc && (
                      <Text
                        numberOfLines={2}
                        style={{
                          ...styles.milesTxt,
                          marginLeft: 0,
                          color: isDarkMode
                            ? MyDarkTheme.colors.text
                            : colors.black,
                          marginVertical: moderateScaleVertical(4),
                          fontSize: textScale(10.5),
                          opacity: 0.6,
                        }}>
                        {desc}
                      </Text>
                    )}
                  </View>
                ) : null}
                {!!categoryInfo?.closed_store_order_scheduled ? (
                  <Text
                    style={{
                      ...commonStyles.mediumFont14Normal,
                      fontSize: textScale(10),
                      textAlign: 'left',
                      color: colors.redB,
                      // marginTop: moderateScaleVertical(4)
                    }}>
                    {strings.WE_ARE_NOT_ACCEPTING} {categoryInfo?.delaySlot}
                  </Text>
                ) : null}
              </View>
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
            categoryInfo.lineOfSightDistance != null ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    opacity: 1,
                    fontSize: textScale(10),
                  }}>
                  {categoryInfo.lineOfSightDistance}
                </Text>
              </View>
            ) : null}

            {categoryInfo?.timeofLineOfSightDistance != undefined &&
              categoryInfo.timeofLineOfSightDistance != null && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
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
                  updateState({offersModalVisible: !offersModalVisible})
                }
                activeOpacity={0.7}
                style={{flexDirection: 'row', alignItems: 'center'}}>
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
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    opacity: 1,
                    fontSize: textScale(10),
                  }}>
                  {strings.OFFERS}
                </Text>
                <Image
                  source={imagePath.icBackb}
                  style={{
                    transform: [{rotate: '-90deg'}],
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
            marginBottom: moderateScale(15),
          }}
          contentContainerStyle={{alignItems: 'center'}}>
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
                    offColor={
                      isDarkMode ? MyDarkTheme.colors.text : colors.borderLight
                    }
                    size="small"
                    onToggle={() => {
                      // playHapticEffect(hapticEffects.impactLight);
                      const updatedArr = ProductTags.map((el, idx) => {
                        console.log(el);
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
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGrey,
                    }}>
                    {!!el?.translations?.length > 0
                      ? el.translations[0].name
                      : ''}
                  </Text>
                  <View style={{width: moderateScale(20)}} />
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
              }}
              searchValue={searchInput}
              placeholder={strings.SEARCH_WITHIN_MENU}
              onChangeText={(value) => onSearchWithinMenu(value)}
              showRightIcon={searchInput ? true : false}
              rightIconStyle={{
                tintColor: isDarkMode ? colors.white : colors.black,
              }}
              rightIconPress={() => onSearchWithinMenu('')}
              showVoiceRecord={false}
            />
          ) : null}

          <TouchableOpacity
            onPress={onShowHideFilter}
            style={{
              marginLeft: moderateScale(12),
            }}>
            <Image source={imagePath.filter} />
          </TouchableOpacity>
        </View>

        {!!categoryInfo && categoryInfo?.childs?.length > 0 && (
          <View style={{marginHorizontal: moderateScale(20)}}>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                // marginHorizontal: moderateScale(0),
                marginTop: moderateScaleVertical(5),
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
  }, [productListId, categoryInfo, ProductTags, isShowFilter]);

  //useCallback end

  useEffect(() => {
    // setLoading(true)
    updateState({pageNo: 1});
    loadMore = true;
    getAllListItems(1);
    if (productListId?.vendor && routeData) {
      fetchOffers();
    }
    if (isLoadingC) {
      getAllProductsByCategoryId(true);
    }
  }, [navigation, languages, currencies, reloadData]);

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
      .then((res) => {
        const productTagsArr = res?.data?.map((el) => {
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
      .catch((error) => {
        console.log('tags api error >>>>>', error);
      });
  };

  const getAllListItems = (pageNo = 1) => {
    if (data?.vendor) {
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
  };

  useEffect(() => {
    getAllVendorFilters();
  }, []);

  const getAllVendorFilters = () => {
    actions
      .getVendorFilters(
        `/${productListId?.id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
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
        `/${data?.vendorData.slug}/${data?.categoryInfo?.slug}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
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
    selectedFilters.current = filterData;
    updateState({pageNo: 1});
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
    getAllListItems(1);
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendor = (pageNo) => {
    console.log('api hit getAllProductsByVendor', data);
    let vendorId = !!data?.vendorData ? data?.vendorData.id : productListId.id;

    let apiData = `/${vendorId}?limit=${limit}&page=${pageNo}`;
    if (!!data?.categoryExist) {
      //sent category id if user comes from category>>vendor>>productList
      apiData = apiData + `&category_id=${data?.categoryExist}`;
    }
    actions
      .getProductByVendorIdOptamize(
        apiData,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          latitude: appMainData?.reqData?.latitude,
          longitude: appMainData?.reqData?.longitude,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log('get all products by vendor res', res);
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
          res.data.categories.map((item) => {
            item?.category.products.map((val) => {
              if (val?.media?.length > 0) {
                const url1 = val?.media[0]?.image?.path?.image_fit;
                const url2 = val?.media[0]?.image?.path?.image_path;
                FastImage.preload([{uri: getImageUrl(url1, url2, '200/200')}]);
              }
            });
          });

          // var totalProduct = 1;
          let filterArray = res?.data?.categories?.map((val) => {
            let newKey = {
              ...val,
              // ['data']: val?.products && val.products,
              ['data']: val?.category?.products && val?.category?.products,
              title:
                (val?.category && val?.category?.translation[0]?.name) ||
                val?.category?.translation[1]?.name,
            };
            delete newKey['products'];
            return newKey;
          });
          setSectionListData(filterArray);
          setCloneSectionList(filterArray);
          // setFilterData(res?.data?.filterData)
          setCategoryInfo(res?.data?.vendor);
          // checkSingleVendor(res?.data?.vendor)
          fetchTags(filterArray);
          setLoading(false);
        } else {
          // console.log('get product list by vendor id >>>> ', res);
          if (res?.data) {
            if (res.data.products.data.length == 0) {
              loadMore = false;
            }
            setCategoryInfo(res?.data?.vendor);
            // checkSingleVendor(res?.data?.vendor)
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
      })
      .catch(errorMethod);
  };

  //***************get products by vendor filter**************
  const newVendorFilter = (pageNo) => {
    console.log('api hit new vendorFilter', selectedFilters);
    let data = {};
    data['variants'] = selectedFilters?.current?.selectedVariants || [];
    data['options'] = selectedFilters?.current?.selectedOptions || [];
    data['brands'] = selectedFilters?.current?.sleectdBrands || [];
    data['order_type'] = selectedFilters?.current?.selectedSorting || 0;
    data['range'] = `${minimumPrice};${maximumPrice}`;
    data['vendor_id'] = productListId.id;
    data['limit'] = limit;
    data['page'] = pageNo;
    console.log('sending data', data);
    setLoading(true);
    actions
      .newVendorFilters(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log('filter vendor res', res);
        if (!!res?.data?.vendor?.is_show_products_with_category) {
          var totalProduct = 1;
          let filterArray = res?.data?.categories?.map((val) => {
            let newKey = {
              ...val,
              ['data']: val?.products && val.products,
              title: val?.category && val.category?.translation[0]?.name,
              totalProduct: totalProduct + val.products.length,
            };
            delete newKey['products'];
            return newKey;
          });
          setSectionListData(filterArray);
          setCloneSectionList(filterArray);
          setCategoryInfo(res?.data?.vendor);
          // checkSingleVendor(res?.data?.vendor)
          // setFilterData(res?.data?.filterData)
          console.log(filterArray, 'filterArrayfilterArray');
          fetchTags(filterArray);
          setLoading(false);
        } else {
          // console.log('get product list by vendor id >>>> ', res);
          if (!!res?.data?.products?.data) {
            // setFilterData(res?.data?.filterData)
            setCategoryInfo(res?.data?.vendor);
            // checkSingleVendor(res?.data?.vendor)
            setProductListData(
              !!res?.data?.vendor?.is_show_products_with_category
                ? res?.data?.categories[0]?.products
                : pageNo == 1
                ? res.data.products.data
                : [...productListData, ...res.data.products.data],
            );
            setLoading(false);
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

  /**********Get all list items by category id */
  const getAllProductsByCategoryId = (pageNo) => {
    console.log('api hit getProductByCategoryId', data,productListId);
    actions
      .getProductByCategoryIdOptamize(
        `/${data?.item?.data?.category_detail?.id}?limit=${limit}&page=${pageNo}&product_list=${
          data?.rootProducts ? true : false
        }`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        if (!!res?.data) {
          console.log(res.data, 'res getProductByCategoryId');
          setCategoryInfo(categoryInfo ? categoryInfo : res.data.category);
          // checkSingleVendor(categoryInfo ? categoryInfo : res.data.category)
          // setCategoryInfo(res.data.category);
          setLoading(false);
          if (res.data.listData.data.length == 0) {
            loadMore = false;
          }
          setProductListData(
            pageNo == 1
              ? res.data.listData.data
              : [...productListData, ...res.data.listData.data],
          );
          updateState({isLoadingC: false});
          if (
            pageNo == 1 &&
            res?.data?.listData?.data.length == 0 &&
            res?.data?.category &&
            res?.data?.category?.childs.length
          ) {
            setSelectedCategory(res.data.category.childs[0]);
            setProductListId(res.data.category.childs[0]);
            updateState({
              pageNo: 1,
              limit: 10,
              isLoadingC: true,
            });
          }
          setLoading(false);
        }
        setLoading(false);
        // getAllVendorFilters()
        // updateBrandAndCategoryFilter(res.data.filterData, appMainData?.brands);
      })

      .catch(errorMethod);
    // }
  };

  /**********Get all list items category filters */
  const getAllProductsCategoryFilter = (pageNo) => {
    setLoading(true);
    let data = {};
    data['variants'] = selectedFilters?.current?.selectedVariants || [];
    data['options'] = selectedFilters?.current?.selectedOptions || [];
    data['brands'] = selectedFilters?.current?.sleectdBrands || [];
    data['order_type'] = selectedFilters?.current?.selectedSorting || 0;
    data['range'] = `${minimumPrice};${maximumPrice}`;
    console.log('api hit getAllProductsCategoryFilter', data);

    actions
      .getProductByCategoryFiltersOptamize(
        `/${productListId.id}?limit=${limit}&page=${pageNo}&product_list=${
          data?.rootProducts ? true : false
        }`,
        data,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log(res, 'getAllProductsCategoryFilter  res ++++++');
        setLoading(false);
        setProductListData(
          pageNo == 1 ? res.data.data : [...productListData, ...res.data.data],
        );
        setLoading(false);
      })
      .catch(errorMethod);
    // }
  };

  const fetchTags = (filterArray) => {
    if (filterArray && filterArray.length > 0) {
      let tagsArr = [];
      filterArray.forEach((el) => {
        // console.log('checking data for tags >>>', el);
        el.data.forEach((data_) => {
          if (data_ && data_.tags) {
            tagsArr.push(...data_.tags);
          }
        });
      });
      tagsArr = _.uniqBy(tagsArr, 'tag_id');
      let productTagsArr = tagsArr.map((el) => {
        return {
          ...el.tag,
          isSelected: false,
        };
      });
      setProductTags(productTagsArr);
    }
  };

  /*********Add product to wish list******* */
  const _onAddtoWishlist = (item) => {
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
        .then((res) => {
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
  const updateProductList = (item) => {
    let newArray = cloneDeep(productListData);
    newArray = newArray.map((i, inx) => {
      if (i.id == item.id) {
        if (item.inwishlist) {
          i.inwishlist = null;
          return {...i, inwishlist: null};
        } else {
          return {...i, inwishlist: {product_id: i.id}};
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

  const errorMethod = (error) => {
    console.log('checking error', error);
    updateState({
      updateQtyLoader: false,
      selectedItemID: -1,
      btnLoader: false,
    });
    setLoading(false);
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1});
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    if (loadMore) {
      updateState({pageNo: pageNo + 1});
      getAllListItems(pageNo + 1);
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const checkSingleVendor = async (vendor) => {
    let vendorData = {vendor_id: vendor.id};
    return new Promise((resolve, reject) => {
      actions
        .checkSingleVendor(vendorData, {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
          systemuser: DeviceInfo.getUniqueId(),
        })
        .then((res) => {
          // console.log('res check singel vendro==>>>>>>', res);
          setIsSingleVendor(res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
          updateState({selectedItemID: -1});
        });
    });
  };
  const clearCartAndAddProduct = async (item, section = null) => {
    updateState({updateQtyLoader: true});
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
        console.log('clear cart and add product res', res);
        // alert("add single item")
        addSingleItem(item, section);
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const hideDifferentAddOns = () => {
    updateState({differentAddsOnsModal: false});
    setDifferentAddsOns([]);
  };

  const addSingleItem = async (item, section = null, inx) => {
    if (
      !!categoryInfo?.is_vendor_closed &&
      !categoryInfo?.show_slot &&
      !categoryInfo?.closed_store_order_scheduled
    ) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    // playHapticEffect(hapticEffects.impactLight);
    let getTypeId = !!item?.category && item?.category.category_detail?.type_id;
    updateState({selectedItemID: item?.id, btnLoader: true});

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
    if (item?.add_on_count === 0 && item?.mode_of_service === 'schedule') {
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

    let data = {};
    data['sku'] = item.sku;
    data['quantity'] = !!item?.minimum_order_count
      ? Number(item?.minimum_order_count)
      : 1;
    data['product_variant_id'] = item?.variant[0].id;
    data['type'] = dine_In_Type;

    console.log('Sending api data', data);
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res.data, 'add single item addProductsToCart');
        actions.cartItemQty(res);
        updateState({cartId: res.data.id});
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
      .catch((error) => errorMethodSecond(error, [], item, section, inx));
  };

  const onCloseModal = () => {
    setIsVisibleModal(false);
    setShowShimmer(true);
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
      console.log(isExistqty, item?.minimum_order_count, 'kdhgkjdfkjgh');
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
            .then((res) => {
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
      updateState({selectedItemID: -1});
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
      updateLocallyAddOns = cloneArr.filter((val) => {
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
    console.log('item', itemToUpdate);

    data['cart_id'] = isExistCartId;
    data['cart_product_id'] = isExistproductId;
    data['type'] = dineInType;
    updateState({btnLoader: true});
    actions
      .removeProductFromCart(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
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
    console.log('item+++++', item);
    console.log('sectin++++', section);
    updateState({updateQtyLoader: false});
    if (error?.message?.alert == 1) {
      updateState({
        isLoadingC: false,
        selectedItemID: -1,
        btnLoader: false,
      });
      setLoading(false);
      // showError(error?.message?.error || error?.error);
      Alert.alert('', error?.message?.error, [
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
      });
      showError(error?.message || error?.error);
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
      .then((res) => {
        actions.cartItemQty(res);
        addSingleItem(item, section, inx);
        if (addonSet) {
        } else {
          // addToCart();
        }
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
  };

  const onRepeat = async () => {
    console.log('repeate items', repeatItems);
    const {item, isExistqty, productId, parentCartId, updateLocalQty} =
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
    setRepeatItems(null);
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
    setRepeatItems(null);
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

  const checkIsCustomize = async (item, section = null, index, type) => {
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
      itemToUpdate?.check_if_in_cart_app.map((val) => {
        totalProductQty = totalProductQty + val?.quantity;
      });
    }
    console.log('totalProductQty', totalProductQty);

    // return;

    var isExistqty = itemToUpdate?.qty ? itemToUpdate?.qty : totalProductQty; //this variable contain only local product quantity
    var tempQty = 0; //this variable contain latest updated quantity of products

    if (
      (type == 2 && itemToUpdate?.add_on_count !== 0) ||
      (type == 2 && itemToUpdate?.variant_set_count !== 0)
    ) {
      //hit in case of subtruction
      let apiData = {cart_id: parentCartId, product_id: item.id};
      let checkIsAvailable = await getDiffAddsOn(apiData, section, item); //check products with different addOns is exist or not.
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
      let apiData = {cart_id: parentCartId, product_id: item.id};
      let header = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        systemuser: DeviceInfo.getUniqueId(),
      };
      console.log('api data checkLastAdded', apiData);
      try {
        setRepeatItems(true);
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
        }
      } catch (error) {
        console.log('error riased++++', error);
        showError(error?.message || error?.error);
      }
      return;
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
      if (res?.data.length > 1) {
        setDifferentAddsOns(res?.data || []);
        setSelectedDiffAdsOnItem(item);
        setSelectedDiffAdsOnSection(section);
        updateState({differentAddsOnsModal: true});
        return {data: res?.data, goNext: true};
      }
      return {data: res?.data, goNext: false};
    } catch (error) {
      console.log('error raised,error');
      return {data: null, goNext: false};
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
    let updateLocallyAddOns = cloneArr.map((val) => {
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
    if (isLoadingC) {
      getAllProductsByCategoryId(1);
      if (productListId?.vendor && routeData) {
        fetchOffers();
      }
      getAllProductTags();
    }
  }, [isLoadingC]);

  const checkIfItemExist = (item, tags) => {
    let result = false;
    tags.forEach((el) => {
      if (el.id === item.tag_id) {
        result = true;
      }
    });
    return result;
  };

  useEffect(() => {
    let EnabledTags = ProductTags.filter((el) => el.isSelected);
    if (EnabledTags.length > 0) {
      const newArr = sectionListData.map((el) => {
        const records =
          el.data &&
          el.data.filter((item) => {
            if (
              item.tags.length > 0 &&
              checkIfItemExist(item.tags[0], EnabledTags)
            )
              return item;
          });
        const newObj = {
          ...el,
        };
        newObj.data = records;
        return newObj;
      });

      console.log(newArr, 'sectionListData>>>>AFTER');
      setCloneSectionList(newArr);
    } else {
      // getAllProductsByVendor();
    }
  }, [ProductTags]);

  useEffect(() => {
    let EnabledTags = ProductTags.filter((el) => el.isSelected);
    if (EnabledTags.length > 0) {
      setApiHitAgain(true);
      const newArr = sectionListData.map((el) => {
        const records =
          el.data &&
          el.data.filter((item) => {
            if (
              item.tags.length > 0 &&
              checkIfItemExist(item.tags[0], EnabledTags)
            )
              return item;
          });
        const newObj = {
          ...el,
        };
        newObj.data = records;
        return newObj;
      });
      updateState({cloneSectionList: newArr});
    } else {
      updateState({cloneSectionList: sectionListData});
      if (apiHitAgain) {
        setApiHitAgain(false);
        setLoading(true);
        getAllProductsByVendor();
      }
    }
  }, [updateTagFilter]);

  const onPressChildCards = (item) => {
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

  const onSearchWithinMenu = (text) => {
    updateState({searchInput: text});
    if (text) {
      const newArr = sectionListData.map((el) => {
        const records =
          el.data &&
          el.data.filter((item) => {
            return item?.translation[0]?.title
              .toLowerCase()
              .includes(text.toLowerCase());
          });
        const newObj = {
          ...el,
        };

        newObj.data = records;
        return newObj;
        // console.log('checking products >>>>>', records)
        // Arr.push(...records)
      });
      setCloneSectionList(newArr);
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
      .then((res) => {
        // console.log('res >>>>>>> offers >>>', res);
        if (res && res.data) {
          setOfferList(res.data);
        }
      });
    // .catch(errorMethod);
  };

  const onPressMenuOption = (index) => {
    setActiveIdx(index);
    updateState({MenuModalVisible: !MenuModalVisible});
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

  const RenderMenuView = () => {
    return (
      <View style={{marginBottom: moderateScaleVertical(16)}}>
        <ScrollView style={{width: '100%'}}>
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
                  {el.title}
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
                  {el.data.length}
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
        <ScrollView style={{width: '100%'}}>
          {offerList?.length > 0 &&
            offerList.map((el, indx) => {
              // console.log(el);
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
                    {el.title ? el.title : ''}
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
                    <View style={{marginRight: moderateScale(8)}} />
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
                    <View style={{marginRight: moderateScale(16)}} />
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
                  <View style={{marginRight: moderateScale(16)}} />
                  <HomeLoader
                    height={20}
                    rectHeight={20}
                    rectWidth={60}
                    width={60}
                  />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader3 />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader3 />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader3 />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
            <ProductListLoader3 />
            <View style={{marginBottom: moderateScaleVertical(12)}} />
          </View>
          {!data?.isVerndorList && (
            <View style={{marginHorizontal: moderateScale(16)}}>
              <ProductListLoader3 />
              <View style={{marginBottom: moderateScaleVertical(12)}} />
              <ProductListLoader3 />
              <View style={{marginBottom: moderateScaleVertical(12)}} />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  const updateMinMax = (min, max) => {
    updateState({minimumPrice: min, maximumPrice: max});
  };

  const onShowHideFilter = () => {
    updateState({isShowFilter: !isShowFilter});
  };

  const bottomSheetHeader = () => {
    return (
      <TouchableOpacity
        onPress={() => setIsVisibleModal(false)}
        style={{alignSelf: 'center', marginBottom: moderateScaleVertical(16)}}>
        <Image source={imagePath.icClose4} />
      </TouchableOpacity>
    );
  };

  const onShare = () => {
    console.log('onShare', appData);
    if (!!categoryInfo.share_link) {
      let hyperLink = categoryInfo.share_link;
      let options = {url: hyperLink};
      Share.open(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
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

  const scrollHeader = (index) => {
    setActiveIdx(index);
    sectionListRef.current.sectionList.current.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewPosition: 0,
      viewOffset: 1,
    });
  };

  const onScroll = (props) => {
    const {nativeEvent} = props;
    if (
      productListData &&
      productListData.length &&
      productListData.length < 6
    ) {
      return;
    }

    let offset = nativeEvent.contentOffset.y;
    let index = parseInt(offset / 8); // your cell height
    if (index > moderateScale(36)) {
      if (!AnimatedHeaderValue) {
        updateState({AnimatedHeaderValue: true});
      }
      return;
    }
    if (index < moderateScale(36)) {
      if (AnimatedHeaderValue) {
        updateState({AnimatedHeaderValue: false});
        return;
      }
      return;
    }
  };

  const onMenuTap = () => {
    // playHapticEffect(hapticEffects.impactLight);
    updateState({MenuModalVisible: !MenuModalVisible});
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

  console.log('productListDataproductListData', productListData);

  return (
    <View
      style={{
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
        flex: 1,
        // paddingVertical: moderateScale(16),
      }}>
      <View style={{flex: 1}}>
        {((AnimatedHeaderValue && productListData.length > 6) ||
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
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                  }}
                  source={imagePath.icBackb}
                />
              </TouchableOpacity>

              <View style={{marginLeft: moderateScale(8), flex: 0.7}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  <View style={{marginLeft: moderateScale(8)}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                        fontSize: moderateScale(14),
                        fontFamily: fontFamily.medium,
                      }}>
                      {name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                    source={!!data?.showAddToCart ? false : imagePath.icSearchb}
                  />
                </TouchableOpacity>
                <View style={{marginHorizontal: moderateScale(8)}} />
                <TouchableOpacity
                  onPress={onShare}
                  hitSlop={hitSlopProp}
                  activeOpacity={0.8}>
                  <Image
                    style={{
                      tintColor: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                    }}
                    source={imagePath.icShareb}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {/* <View style={{height: moderateScale(10)}} /> */}
        {!!categoryInfo?.is_show_products_with_category ? (
          <SectionList
            onScroll={onScroll}
            ref={sectionListRef}
            showsVerticalScrollIndicator={false}
            sections={cloneSectionList}
            ListHeaderComponent={listHeaderComponent2}
            stickySectionHeadersEnabled={false}
            keyExtractor={awesomeChildListKeyExtractor}
            removeClippedSubviews={true}
            // tabBarStyle={styles.tabBar}
            // ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderTab={renderSectionTab}
            renderItem={renderSectionItem}
            ListFooterComponent={() => (
              <View style={{height: moderateScale(80)}} />
            )}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={listEmptyComponent}
            updateCellsBatchingPeriod={100}
            initialNumToRender={100}
            windowSize={40}
            onScrollToIndexFailed={(val) => console.log('indexed failed')}
            extraData={cloneSectionList}
            getItemLayout={getItemLayout}
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
            contentContainerStyle={{flexGrow: 1}}
            extraData={productListData}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            //  getItemLayout={getItemLayout}
            // refreshing={isRefreshing}
            // initialNumToRender={12}
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

        {isVisibleModal ? (
          <TouchableWithoutFeedback onPress={() => setIsVisibleModal(false)}>
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
              shimmerClose={(val) => setShowShimmer(val)}
              updateCartItems={updateCartItems}
              // modeOfService={selectedCartItem?.mode_of_service}
            />
          )}
        </View>
      ) : (
        <>
          {isVisibleModal ? (
            <BottomSheet
              ref={bottomSheetRef}
              index={1}
              snapPoints={[height / 1.5, height / 1.25]}
              activeOffsetY={[-1, 1]}
              failOffsetX={[-5, 5]}
              animateOnMount={true}
              handleComponent={bottomSheetHeader}
              onChange={(index) => {
                if (index == -1) {
                  onCloseModal();
                }
              }}
              backdropComponent={() => <View style={{height: 0}} />}
              backgroundComponent={() => <></>}>
              <BottomSheetScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{flexGrow: 1}}
                style={{
                  flex: 1,
                  backgroundColor: isDarkMode
                    ? MyDarkTheme.colors.lightDark
                    : colors.white,
                }}>
                <VariantAddons
                  addonSet={selectedCartItem?.add_on}
                  isVisible={isVisibleModal}
                  productdetail={selectedCartItem}
                  onClose={onCloseModal}
                  typeId={typeId}
                  showShimmer={showShimmer}
                  shimmerClose={(val) => setShowShimmer(val)}
                  updateCartItems={updateCartItems}
                />
              </BottomSheetScrollView>
            </BottomSheet>
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

      {!searchInput && !isVisibleModal && (
        <GradientCartView
          onPress={() => {
            playHapticEffect(hapticEffects.notificationSuccess);
            navigation.navigate(navigationStrings.CART);
          }}
          btnText={
            CartItems && CartItems.data && CartItems.data.item_count
              ? `${CartItems.data.item_count} ${
                  CartItems.data.item_count == 1 ? strings.ITEM : strings.ITEMS
                } | ${
                  currencies.primary_currency.symbol
                } ${tokenConverterPlusCurrencyNumberFormater(
                  Number(CartItems.data.total_payable_amount),
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
          updateState({offersModalVisible: !offersModalVisible})
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
          updateState({MenuModalVisible: !MenuModalVisible});
        }}
      />

      {/* Add new addons and repeat item view */}
      {!!repeatItems ? (
        <RepeatModal
          data={repeatItems?.item}
          modalHide={() => setRepeatItems(null)}
          onRepeat={onRepeat}
          onAddNew={onAddNew}
        />
      ) : null}

      {!!differentAddsOns && differentAddsOns.length > 1 ? (
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
          onSelectedSortFilter={(val) => updateState({selectedSortFilter: val})}
          maximumPrice={maximumPrice}
          minimumPrice={minimumPrice}
          updateMinMax={updateMinMax}
          filterData={allFilters}
        />
      ) : null}
    </View>
  );
}
