import { useFocusEffect } from '@react-navigation/native';
import { cloneDeep, debounce } from 'lodash';
import React, { Fragment, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import EmptyListLoader from '../../Components/EmptyListLoader';
import Header from '../../Components/Header';
import Header2 from '../../Components/Header2';

import IconTextColumn from '../../Components/IconTextColumn';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import CardLoader from '../../Components/Loaders/CardLoader';
import ProductLoader from '../../Components/Loaders/ProductLoader';
import ProductCard from '../../Components/ProductCard';
import ProductCard2 from '../../Components/ProductCard2';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import staticStrings from '../../constants/staticStrings';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  playVibration,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import ListEmptyProduct from './ListEmptyProduct';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


import GradientCartView from '../../Components/GradientCartView';
export default function ProductList({ route, navigation }) {
  const { data } = route.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isVisibleModal: false,
    isOffline: false,
    isLoading: true,
    isLoadingB: false,
    pageNo: 1,
    limit: 12,
    isRefreshing: false,
    selectedSbCategoryID: -1,
    productListId: data,
    productListData: [],
    categoryInfo: null,
    click: false,
    filterData: [],
    brandData: [],
    allFilters: [],
    categories: [],
    sortFilters: [
      {
        id: -2,
        label: strings.SORT_BY,
        value: [
          {
            id: 1,
            label: 'A - Z',
            labelValue: 'a_to_z',
            parent: strings.SORT_BY,
          },
          {
            id: 2,
            label: 'Z - A',
            labelValue: 'z_to_a',
            parent: strings.SORT_BY,
          },
          {
            id: 3,
            label: strings.LOW_TO_HIGH,
            labelValue: 'low_to_high',
            parent: strings.SORT_BY,
          },
          {
            id: 4,
            label: strings.HIGH_TO_LOW,
            labelValue: 'high_to_low',
            parent: strings.SORT_BY,
          },
          {
            id: 5,
            label: strings.POPULARITY,
            labelValue: 'popularity',
            parent: strings.SORT_BY,
          },
          {
            id: 6,
            label: strings.NEWLY_ADDED,
            labelValue: 'newly_added',
            parent: strings.SORT_BY,
          },
        ],
      },
    ],
    sleectdBrands: [],
    selectedVariants: [],
    selectedOptions: [],
    slectedSortBy: [],
    minimumPrice: 0,
    maximumPrice: 50000,
    checkForMinimumPriceChange: false,
    checkForMaximumPriceChange: false,
    showFilterSlectedIcon: false,
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
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  const {
    isLoading,
    isOffline,
    pageNo,
    limit,
    isRefreshing,
    selectedSbCategoryID,
    productListId,
    categoryInfo,
    productListData,
    isLoadingB,
    filterData,
    brandData,
    allFilters,
    sortFilters,
    sleectdBrands,
    selectedVariants,
    selectedOptions,
    slectedSortBy,
    minimumPrice,
    maximumPrice,
    checkForMinimumPriceChange,
    checkForMaximumPriceChange,
    showFilterSlectedIcon,
    categories,
  } = state;

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });

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
        navigation.navigate(screenName, { data });
      };

  const updateState = (data) => setState((state) => ({ ...state, ...data }));



  useFocusEffect(
    React.useCallback(() => {

      getAllListItems();
    }, [
      pageNo,
      isRefreshing,
      languages,
      currencies,
      sleectdBrands,
      selectedOptions,
      slectedSortBy,
      minimumPrice,
      maximumPrice,
    ]),
  );



  const getAllListItems = () => {
    let filterExist =
      sleectdBrands.length ||
      selectedVariants.length ||
      selectedOptions.length ||
      slectedSortBy.length ||
      minimumPrice != 0 ||
      maximumPrice != 50000 ||
      checkForMaximumPriceChange ||
      checkForMinimumPriceChange;



    {
      filterExist
        ? updateState({ showFilterSlectedIcon: true })
        : updateState({ showFilterSlectedIcon: false });
    }

    if (data?.vendor) {
      {
        filterExist
          ? getAllProductsVendorFilter()
          : data?.vendorData
            ? getAllProductsByVendorCategory()
            : getAllProductsByVendor();
      }
    } else {
      {
        console.log(filterExist, 'filterExistfilterExist +++ for category');
        filterExist ? getAllProductsCategoryFilter() : getAllProducts();
      }
    }
  };

  const updateBrandAndCategoryFilter = (filterData, allBrands) => {
    var brandDatas = [];
    var filterDataNew = [];

    if (allBrands?.length) {
      brandDatas = [
        {
          id: -1,
          label: strings.BRANDS,
          value: allBrands.map((i, inx) => {
            return {
              id: i?.translation[0]?.brand_id,
              label: i?.translation[0]?.title,
              parent: strings.BRANDS,
            };
          }),
        },
      ];


    }

    // Price filter
    if (filterData?.length) {
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
      // updateState({allFilters: [...allFilters,...filterDataNew]});
    }
    console.log(sortFilters, 'sortFilters');
    updateState({
      allFilters: [...brandDatas, ...sortFilters, ...filterDataNew],
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
      slectedSortBy: slectedSortBy,
    });
  };
  /**********Get all list items by category filters */
  const getAllProductsVendorFilter = () => {
    console.log('api hit getAllProductsVendorFilter++++++');
    let data = {};
    data['variants'] = selectedVariants;
    data['options'] = selectedOptions;
    data['brands'] = sleectdBrands;
    data['order_type'] = slectedSortBy.length ? slectedSortBy[0] : '';
    data['range'] = `${minimumPrice};${maximumPrice}`;
    console.log('sending filter data', data);
    actions
      .getProductByVendorFilters(
        `/${productListId.id}?limit=${limit}&page=${pageNo}`,
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
          isRefreshing: false,
          productListData:
            pageNo == 1
              ? res.data.data
              : [...productListData, ...res.data.data],
        });
      })
      .catch(errorMethod);
    // }
  };

  console.log(languages?.primary_language?.id, 'data in category product');
  /**********Get all list items by category filters */
  const getAllProductsCategoryFilter = () => {
    console.log('api hit getAllProductsCategoryFilter');

    let data = {};
    data['variants'] = selectedVariants;
    data['options'] = selectedOptions;
    data['brands'] = sleectdBrands;
    data['order_type'] = slectedSortBy.length ? slectedSortBy[0] : '';
    data['range'] = `${minimumPrice};${maximumPrice}`;
    console.log('sending filter data', data);
    actions
      .getProductByCategoryFilters(
        `/${productListId.id}?limit=${limit}&page=${pageNo}`,
        data,
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'getAllProductsCategoryFilter ++++++');
        updateState({
          isLoading: false,
          isRefreshing: false,
          productListData:
            pageNo == 1
              ? res.data.data
              : [...productListData, ...res.data.data],
        });
      })
      .catch(errorMethod);
    // }
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendorCategory = () => {
    // alert("21312")

    console.log('api hit getAllProductsByVendorCategory vendor ++++', data);
    actions
      .getProductByVendorCategoryId(
        `/${data?.vendorData.slug}/${data?.categoryInfo?.slug}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(
          res.data.filterData,
          'getAllProductsByVendorCategory vendor +++',
        );
        updateState({
          isLoading: false,
          isRefreshing: false,
          categoryInfo: res?.data?.vendor,
          filterData: res?.data?.filterData,
          productListData:
            pageNo == 1
              ? res.data.products.data
              : [...productListData, ...res?.data?.products?.data],
        });
        console.log(res.data.filterData, 'res.data.filterData vendor +++');
        updateBrandAndCategoryFilter(res.data.filterData, appMainData?.brands);
      })
      .catch(errorMethod);
  };

  /****Get all list items by vendor id */
  const getAllProductsByVendor = () => {
    console.log('api hit getAllProductsByVendor');
    actions
      .getProductByVendorId(
        `/${productListId.id}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log('getAllProductsByVendor res', res);
        if (res?.data?.vendor?.vendor_templete_id == 5) {
          //showing products with category
          updateState({
            selectedSbCategoryID: res.data.categories[0].id,
            categories: res.data.categories,
            productListData: res.data.categories[0].products,
          });
        } else {
          updateState({
            productListData:
              pageNo == 1
                ? res?.data?.products?.data
                : [...productListData, ...res?.data?.products?.data],
          });
        }
        updateState({
          isLoading: false,
          isRefreshing: false,
          categoryInfo: res?.data?.vendor,
          filterData: res?.data?.filterData,
        });
        updateBrandAndCategoryFilter(
          res?.data?.filterData,
          appMainData?.brands,
        );
      })
      .catch(errorMethod);
  };

  /**********Get all list items by category id */
  const getAllProducts = () => {
    console.log('api hit getAllProducts');
    actions
      .getProductByCategoryId(
        `/${productListId.id}?limit=${limit}&page=${pageNo}&product_list=${data?.rootProducts ? true : false
        }`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, 'getAllProducts');
        updateState({
          isLoading: false,
          isRefreshing: false,
          categoryInfo: res.data.category,
          filterData: res.data.filterData,
          productListData:
            pageNo == 1
              ? res.data.listData.data
              : [...productListData, ...res.data.listData.data],
        });

        updateBrandAndCategoryFilter(res.data.filterData, appMainData?.brands);
      })
      .catch(errorMethod);
    // }
  };

  /*********Add product to wish list******* */
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
          showSuccess(res.message);
          updateProductList(item);
        })
        .catch(errorMethod);
    } else {
      showError(strings.UNAUTHORIZED_MESSAGE);
      updateState({ isLoadingB: false });
    }
  };

  /*******Upadte products in wishlist>*********/
  const updateProductList = (item) => {
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
    updateState({ productListData: newArray, isLoadingB: false });
  };

  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({ isLoading: false, isRefreshing: false, isLoadingB: false });
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1, isRefreshing: true });
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    if (categoryInfo.vendor_templete_id !== 5) {
      updateState({ pageNo: pageNo + 1 });
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  //Add product to cart
  const _addToCart = (item) => {
    playHapticEffect(hapticEffects.rigid);
    moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)();
  };

  const renderProduct = ({ item, index }) => {
    const { isSelectItem } = state;
    return (
      <ProductCard
        data={item}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        addToCart={() => _addToCart(item)}
      />
    );
  };

  const openModal = () => {
    updateState({ isVisibleModal: true });
  };
  const closeModal = () => {
    updateState({ isVisibleModal: false });
  };

  const onPressChildCards = (item) => {
    console.log('item++++', item);
    updateState({
      productListData: item.products,
      selectedSbCategoryID: item.id,
    });
    return;
    updateState({ selectedSbCategoryID: item.id });
    navigation.push(navigationStrings.PRODUCT_LIST, { data: item });
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width * 0.5 - 21.5,
    offset: (width * 0.5 - 21.5) * index,
    index,
  });

  //To remove flickering of icon and image we are creating the header child seperately
  const listHeaderComponent = () => {
    return (
      <Fragment>
        {categories.length > 0 ? (
          <View>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                marginHorizontal: moderateScale(16),
                marginTop: moderateScaleVertical(10),
              }}>
              {/* <IconTextColumn
                isActive={selectedSbCategoryID == -1 ? true : false}
                icon={imagePath.allProducts}
                text={strings.ALLPRODUCT}
                onPress={() => updateState({ selectedSbCategoryID: -1 })}
              /> */}
              {categories.map((item, inx) => {
                return (
                  <View key={inx}>
                    <IconTextColumn
                      isActive={selectedSbCategoryID == item.id ? true : false}
                      icon={{
                        uri: getImageUrl(
                          item.category.icon.proxy_url,
                          item.category.icon.image_path,
                          '200/200',
                        ),
                      }}
                      imageStyle={{ height: 40, width: 40, borderRadius: 40 / 2 }}
                      // url={getImageUrl(item.icon.proxy_url, item.icon.image_path, '200/200') }
                      onPress={() => onPressChildCards(item)}
                      text={item?.category.translation[0]?.name}
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ) : null}
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: moderateScale(16),
            alignItems: 'center',
          }}>
          {/* <Text style={{ ...commonStyles.futuraBtHeavyFont16 }}>
      All Products
    </Text> */}
          <View style={{ flex: 0.4 }} />
          <View
            style={{
              flex: 0.6,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            {categories?.length == 0 && (
              <TouchableOpacity
                // onPress={() => navigation.navigate(navigationStrings.FILTER)}
                onPress={moveToNewScreen(navigationStrings.FILTER, {
                  // brandData: brandData,
                  // filterData: filterData,
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
                })}>
                <Image
                  style={{
                    tintColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                  }}
                  source={
                    showFilterSlectedIcon
                      ? imagePath.filterSelected
                      : imagePath.filter
                  }
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={moveToNewScreen(navigationStrings.SEARCHPRODUCTOVENDOR, {
                type: data?.vendor
                  ? staticStrings.VENDOR
                  : staticStrings.CATEGORY,
                id: data?.vendor ? data?.id : productListId?.id,
              })}
              style={{ marginLeft: 10 }}>
              <Image
                style={{
                  tintColor: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.black,
                }}
                source={imagePath.search}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: moderateScaleVertical(20) }} />
      </Fragment>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoadingB}>
      {/* {<Loader isLoading={isLoadingB} withModal={true} />} */}

      <Header
        centerTitle={
          data?.name || (data?.translation ? data?.translation[0]?.name : '')
        }
        hideRight={true}
        rightIcon={imagePath.search}
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />
      <View style={{ ...commonStyles.headerTopLine }} />

      <View
        style={{
          height: 10,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.backgroundGreyB,
          marginBottom: 2,
        }}
      />

      {isLoading && <ProductLoader isLoading={isLoading} listSize={4} isRow />}
      <FlatList
        data={productListData}
        renderItem={renderProduct}
        ListHeaderComponent={listHeaderComponent()}
        keyExtractor={(item, index) => String(index)}
        keyboardShouldPersistTaps="always"
        numColumns={2}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginHorizontal: moderateScale(14),
        }}
        refreshing={isRefreshing}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={() => console.log("")}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={10}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
        onEndReached={onEndReachedDelayed}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View style={{ height: moderateScaleVertical(65) }} />
        )}
        ListEmptyComponent={<EmptyListLoader />}
      />
      {data?.isLoading &&


        <GradientCartView
          onPress={() => {
            playHapticEffect(hapticEffects.notificationSuccess);
            navigation.navigate(navigationStrings.CART);
          }}
          btnText={
            data && data.data && data.data.item_count
              ? `${data.data.item_count} ${data.data.item_count == 1
                ? strings.ITEM
                : strings.ITEMS
              } | ${tokenConverterPlusCurrencyNumberFormater(
                Number(data?.data?.gross_paybale_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}`
              : ''
          }
          ifCartShow={true}
          isMenuBtnShow={categoryInfo?.is_show_products_with_category}
          // onMenuTap={onMenuTap}
          // isLoading={btnLoader}
          // sectionListData={sectionListData}
          // isCategoryExist={!!data?.categoryExist}
          btnStyle={
            appStyle?.tabBarLayout == 4 && {
              marginBottom: moderateScale(160),
              backgroundColor: 'red'
            }
          }
        />
      }
    </WrapperContainer>
  );
}
