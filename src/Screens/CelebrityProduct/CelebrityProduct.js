import {BlurView} from '@react-native-community/blur';
import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep, debounce} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import DisplayModal from '../../Components/DisplayModal';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import ProductCard from '../../Components/ProductCard';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import ListEmptyProduct from './ListEmptyProduct';
import stylesFunc from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';

export default function CelebrityProduct({route, navigation}) {
  //Route data / params coming from some screen
  const {data} = route.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    slider1ActiveSlide: 0,
    isLoading: true,
    isLoadingB: false,
    celebrity: data,
    celebrityData: [],
    pageNo: 1,
    limit: 12,
    celebrityDetail: null,
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
  });

  const {
    celebrity,
    celebrityData,
    isLoadingB,
    limit,
    pageNo,
    celebrityDetail,
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
  } = state;

  //Upadte state in screen
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux store data
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const userData = useSelector((state) => state?.auth?.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useEffect(() => {
    updateState({
      sortFilterMap: sortFilters[0].value,
    });
  }, []);

  //List of celebrity products based on
  useEffect(() => {
    getListOfCelebrityProducts();
  }, [state.celebrity, state.isLoadingB]);

  //List of celebrity products based on language and currency
  useEffect(() => {
    updateState({pageNo: 1});
    getListOfCelebrityProducts();
  }, [languages, currencies]);

  //on focus screen fucntions
  useFocusEffect(
    React.useCallback(() => {
      updateState({pageNo: 1});
      getListOfCelebrityProducts();
    }, [
      sleectdBrands,
      selectedOptions,
      slectedSortBy,
      minimumPrice,
      maximumPrice,
    ]),
  );

  //List of celebrity products based on page number change  and pull to refress
  useEffect(() => {
    getListOfCelebrityProducts();
  }, [state.pageNo, state.isRefreshing]);

  const getListOfCelebrityProducts = () => {
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
        ? updateState({showFilterSlectedIcon: true})
        : updateState({showFilterSlectedIcon: false});
    }
    {
      sortExist
        ? updateState({showSortSelectedicon: true})
        : updateState({showSortSelectedicon: false});
    }
    {
      !!filterExist || !!sortExist
        ? getCelebrityProductsFilterBased()
        : getCelebrityProducts();
    }
  };

  //Get list of celebrity product based on celebrity filters
  const getCelebrityProductsFilterBased = () => {
    let data = {};
    data['variants'] = selectedVariants;
    data['options'] = selectedOptions;
    data['brands'] = sleectdBrands;
    data['order_type'] = slectedSortBy.length ? slectedSortBy[0] : '';
    data['range'] = `${minimumPrice};${maximumPrice}`;
    actions
      .getCelebrityProductsByFilters(
        `/${celebrity.id}?limit=${limit}&page=${pageNo}`,
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
          celebrityData:
            pageNo == 1 ? res.data.data : [...celebrityData, ...res.data.data],
        });
      })
      .catch(errorMethod);
  };

  //Get list of celebrity products based on celebrity id
  const getCelebrityProducts = () => {
    actions
      .getCelebrityProductsByCelebrityId(
        `/${celebrity.id}?limit=${limit}&page=${pageNo}`,
        {},
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
          isRefreshing: false,
          celebrityDetail: res.data.celebrity[0],
          celebrityData:
            pageNo == 1
              ? res.data.products.data
              : [...celebrityData, ...res.data.products.data],
        });
        updateBrandAndCategoryFilter(res.data.filterVariant);
      })
      .catch(errorMethod);
  };
  //Error handling of apis
  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false, isLoadingB: false});
    showError(error?.message || error?.error);
  };

  const updateBrandAndCategoryFilter = (filterData) => {
    var filterDataNew = [];

    // Price filter
    if (filterData.length) {
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
    }
    updateState({
      allFilters: [...filterDataNew],
    });
  };
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
      // slectedSortBy: slectedSortBy,
    });
  };

  //Add product to cart
  const _addToCart = (item) => {
    moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)();
  };
  //render product list view
  const renderProduct = ({item, index}) => {
    return (
      <ProductCard
        data={item}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        addToCart={() => _addToCart(item)}
      />
    );
  };

  /* ADD-REMOVE ITEM TO WISHLIST FUNCTION  */
  const _onAddtoWishlist = (item) => {
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
    let newArray = cloneDeep(celebrityData);
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
    updateState({celebrityData: newArray});
  };
  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageNo: pageNo + 1});
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({pageNo: 1, isRefreshing: true});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const shortModalFun = () => {
    updateState({isSortEnabled: true});
  };
  const closeOptionModal = () => {
    updateState({isSortEnabled: false});
  };
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
                    value: {selected: j?.value?.selected ? false : true},
                  };
                } else {
                  return {
                    ...j,
                    value: {selected: j?.value?.selected ? false : true},
                  };
                }
              } else {
                if (i.id == -2) {
                  return {
                    ...j,
                    value: {selected: false},
                  };
                } else {
                  return j;
                }
              }
            });

            updateState({sortFilterMap: checkArray});
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

  const bottomButtonClick = () => {
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

  const {imageRef} = useRef();

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
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
        centerTitle={celebrity.name || celebrity.translation[0].title}
        rightIcon={imagePath.search}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />

      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        {state.isLoading && <ListEmptyProduct isLoading={state.isLoading} />}
        {!state.isLoading && (
          <>
            {/* //Top section slider */}
            <View style={{marginTop: 20}} />
            {/* Brand Banner View */}
            <View
              style={{
                marginHorizontal: moderateScale(20),
                alignItems: 'center',
              }}>
              {celebrityDetail?.avatar && (
                <ImageBackground
                  style={{
                    width: width - moderateScale(20),
                    height: moderateScaleVertical(width / 2),
                  }}
                  // source={{uri: rectImage}}
                  source={{
                    uri: getImageUrl(
                      celebrityDetail?.avatar?.image_fit,
                      celebrityDetail?.avatar?.image_path,
                      '600/150',
                    ),
                  }}>
                  <View
                    ref={imageRef}
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      justifyContent: 'center',
                    }}>
                    <BlurView
                      style={styles.absolute}
                      viewRef={imageRef}
                      blurType="light"
                      blurAmount={20}
                      blurRadius={20}
                    />
                    <View style={{alignItems: 'center'}}>
                      <Image
                        source={{
                          uri: getImageUrl(
                            celebrityDetail?.avatar?.image_fit,
                            celebrityDetail?.avatar?.image_path,
                            '500/500',
                          ),
                        }}
                        style={{
                          width: moderateScaleVertical(width / 2.1),
                          height: moderateScaleVertical(width / 2.1),
                          borderRadius: moderateScaleVertical(width / 2.1 / 2),
                        }}
                      />
                    </View>
                  </View>
                </ImageBackground>
              )}
            </View>
            <View style={styles.sortFilterTabView}>
              <TouchableOpacity
                onPress={shortModalFun}
                style={[
                  styles.tabLable,
                  {
                    borderRightWidth: 1,
                    borderColor: getColorCodeWithOpactiyNumber('C9CCD0', 50),
                  },
                ]}>
                <Image
                  style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
                  source={
                    showSortSelectedicon
                      ? imagePath.sortSelected
                      : imagePath.sort
                  }
                />
                <Text
                  style={
                    isDarkMode
                      ? [styles.sortFilter, {color: MyDarkTheme.colors.text}]
                      : [styles.sortFilter]
                  }>
                  {strings.SORT}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => navigation.navigate(navigationStrings.FILTER)}
                onPress={moveToNewScreen(navigationStrings.FILTER, {
                  // celebrityData: celebrityData,
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
                style={styles.tabLable}>
                <Image
                  style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
                  source={
                    showFilterSlectedIcon
                      ? imagePath.filterSelected
                      : imagePath.filter
                  }
                />
                <Text
                  style={
                    isDarkMode
                      ? [styles.sortFilter, {color: MyDarkTheme.colors.text}]
                      : [styles.sortFilter]
                  }>
                  {strings.FILTER}
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              bounces={false}
              data={(!state.isLoading && celebrityData) || []}
              renderItem={renderProduct}
              extraData={celebrityData}
              keyExtractor={(item, index) => String(index)}
              keyboardShouldPersistTaps="always"
              numColumns={2}
              showsVerticalScrollIndicator={false}
              style={{flex: 1, marginTop: moderateScale(20)}}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              ItemSeparatorComponent={() => <View style={{height: 20}} />}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginHorizontal: moderateScale(14),
              }}
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
              ListFooterComponent={() => <View style={{height: 20}} />}
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
                  bottomButtonClick={bottomButtonClick}
                  updateStatus={(item) => updateStatus(item)}
                />
              )}
            </View>
          </>
        )}
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
