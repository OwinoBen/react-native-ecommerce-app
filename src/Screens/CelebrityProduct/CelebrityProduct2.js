import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep, debounce} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import DifferentAddOns from '../../Components/DifferentAddOns ';
import DisplayModal from '../../Components/DisplayModal';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import ProductCard3 from '../../Components/ProductCard3';
import RepeatModal from '../../Components/RepeatModal';
import VariantAddons from '../../Components/VariantAddons';
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
import {MyDarkTheme} from '../../styles/theme';
import {
  getImageUrl,
  hapticEffects,
  playHapticEffect,
  showError,
  showSuccess,
} from '../../utils/helperFunctions';
import {removeItem} from '../../utils/utils';
import ListEmptyProduct from './ListEmptyProduct';
import stylesFunc from './styles';

let timeOut = undefined;

var tempQty = 0;

let activeIdx = 0;

export default function CelebrityProduct2({route, navigation}) {
  //Route data / params coming from some screen
  const {data} = route.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const dineInType = useSelector((state) => state?.home?.dineInType);
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
    btnLoader: false,
    selectedItemID: -1,
    selectedItemIndx: null,
    categoryInfo: null,
    updateQtyLoader: false,
    isVisibleModal: false,
    typeId: null,
    selectedCartItem: null,
    cartId: null,
    showShimmer: true,
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
    sortFilterMap,
    isSelected,
    btnLoader,
    selectedItemID,
    selectedItemIndx,
    categoryInfo,
    updateQtyLoader,
    isVisibleModal,
    typeId,
    selectedCartItem,
    cartId,
    showShimmer,
    repeatItems,
    differentAddsOns,
    selectedDiffAdsOnItem,
    selectedDiffAdsOnSection,
    diffAddOnCartIdProductId,
    storeLocalQty,
    differentAddsOnsModal,
    selectedDiffAdsOnId,
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
    getListOfCelebrityProducts(pageNo);
  }, [state.celebrity, state.isLoadingB]);

  //List of celebrity products based on language and currency
  useEffect(() => {
    updateState({pageNo: 1});
    getListOfCelebrityProducts(pageNo);
  }, [languages, currencies]);

  //on focus screen fucntions
  useFocusEffect(
    React.useCallback(() => {
      updateState({pageNo: 1});
      getListOfCelebrityProducts(pageNo);
    }, [
      sleectdBrands,
      selectedOptions,
      slectedSortBy,
      minimumPrice,
      maximumPrice,
    ]),
  );

  //List of celebrity products based on page number change  and pull to refress
  // useEffect(() => {
  //   getListOfCelebrityProducts();
  // }, [state.pageNo]);

  const getListOfCelebrityProducts = (pageNo) => {
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
        ? getCelebrityProductsFilterBased(pageNo)
        : getCelebrityProducts(pageNo);
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
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log('res+++', res);
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
  const getCelebrityProducts = (pageNo) => {
    actions
      .getCelebrityProductsByCelebrityId(
        `/${celebrity.id}?limit=${limit}&page=${pageNo}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          systemuser: DeviceInfo.getUniqueId(),
        },
      )
      .then((res) => {
        console.log('get celebrity producst', res);
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
      <ProductCard3
        data={item}
        index={index}
        onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
        onAddtoWishlist={() => _onAddtoWishlist(item)}
        addToCart={() => addSingleItem(item, index)}
        onIncrement={() => checkIsCustomize(item, index, 1)}
        onDecrement={() => checkIsCustomize(item, index, 2)}
        // onIncrement={() => addDeleteCartItems(item, null, index, 1)}
        // onDecrement={() => addDeleteCartItems(item, null, index, 2)}
        selectedItemID={selectedItemID}
        btnLoader={btnLoader}
        selectedItemIndx={selectedItemIndx}
        categoryInfo={categoryInfo}
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
        return {data: res?.data, goNext: true};
      }
      return {data: res?.data, goNext: false};
    } catch (error) {
      console.log('error raised,error');
      return {data: null, goNext: false};
    }
  };

  const checkIsCustomize = async (item, index, type) => {
    // return;
    let itemToUpdate = cloneDeep(item);
    console.log('check item to update', itemToUpdate);
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
      let apiData = {cart_id: parentCartId, product_id: item.id};
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
      let apiData = {cart_id: parentCartId, product_id: item.id};
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

          updateState({repeatItems: addData});
        }
      } catch (error) {
        console.log('error riased++++', error);
        showError(error?.message || error?.error);
      }
      return;
    }
  };

  const addSingleItem = async (item) => {
    // return;
    if (categoryInfo?.is_vendor_closed && !categoryInfo?.show_slot) {
      alert(strings.VENDOR_NOT_ACCEPTING_ORDERS);
      return;
    }
    playHapticEffect(hapticEffects.impactLight);
    let getTypeId = !!item?.category && item?.category.category_detail?.type_id;
    updateState({selectedItemID: item?.id, btnLoader: true});
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
          onPress: () => {},
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
        isVisibleModal: true,
        selectedCartItem: item,
        selectedItemID: -1,
        btnLoader: false,
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
    actions
      .addProductsToCart(data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
        systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        actions.cartItemQty(res);
        updateState({cartId: res.data.id});
        let updateArray = celebrityData.map((val, i) => {
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
          celebrityData: updateArray,
        });
      })
      .catch((error) => errorMethodSecond(error, [], item));
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

    console.log(item?.batch_count, 'item?.batch_count');
    tempQty = tempQty + 1;
    let quantityToIncreaseDecrease = !!item?.batch_count
      ? Number(item?.batch_count)
      : 1;

    if (type == 1) {
      quanitity = Number(isExistqty) + quantityToIncreaseDecrease;
    } else {
      if (
        Number(isExistqty - tem?.batch_count) <
        Number(item?.minimum_order_count)
      ) {
        quanitity = 0;
      } else {
        quanitity = Number(isExistqty) - quantityToIncreaseDecrease;
      }
    }

    timeOut = setTimeout(
      () => {
        // return;
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
    let vendorData = {vendor_id: categoryInfo?.id};
    updateState({selectedItemID: id});
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
          updateState({selectedItemID: -1});
        });
    });
  };

  const errorMethodSecond = (error, addonSet = [], item) => {
    console.log(error.message.alert, 'Error>>>>>');
    updateState({updateQtyLoader: false});
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
          text: strings.CANCEL,
          onPress: () => console.log('Cancel Pressed'),
          // style: 'destructive',
        },
        {text: strings.CLEARCART, onPress: () => clearCart(addonSet, item)},
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

  const clearCart = async (addonSet = [], item) => {
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
        updateState({pageNo: 1});
        getListOfCelebrityProducts(pageNo);
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

    let updateArray = celebrityData.map((val, i) => {
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
      celebrityData: updateArray,
      selectedItemID: -1,
      storeLocalQty: differentAddsOnsQty,
    });
  };

  const clearCartAndAddProduct = async (item) => {
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
        addSingleItem(item);
        // showSuccess(res?.message);
      })
      .catch(errorMethod);
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
      updateState({differentAddsOns: updateLocallyAddOns});
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
        let updateArray = celebrityData.map((val, i) => {
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
          celebrityData: updateArray,
          updateQtyLoader: false,
          selectedItemID: -1,
          btnLoader: false,
        });
      })
      .catch(errorMethod);
  };

  const updateCartItems = (item, quanitity, productId, cartID) => {
    playHapticEffect(hapticEffects.impactLight);

    let updateArray = celebrityData.map((val, i) => {
      if (val.id == item.id) {
        return {
          ...val,
          qty: quanitity,
          cart_product_id: productId,
          isRemove: false,
        };
      }
      updateState({storeLocalQty: quanitity});
      return val;
    });
    updateState({
      cartId: cartID,
      celebrityData: updateArray,
      isVisibleModal: false,
    });
  };

  const hideDifferentAddOns = () => {
    updateState({differentAddsOnsModal: false, differentAddsOns: []});
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
        return {...val, quantity: type == 1 ? qty + 1 : qty - 1};
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
    updateState({differentAddsOns: updateLocallyAddOns});
  };

  const onRepeat = async () => {
    // console.log("repeate items", repeatItems)
    const {item, isExistqty, productId, parentCartId, updateLocalQty} =
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
    updateState({repeatItems: null});
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
        rightIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icSearchb
            : imagePath.search
        }
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
                marginHorizontal: moderateScale(16),
                alignItems: 'center',
                backgroundColor: colors.greySearchBackground,
                borderRadius: moderateScale(8),
              }}>
              {celebrityDetail?.avatar && (
                <Image
                  style={{
                    width: width - moderateScale(24),
                    height: moderateScaleVertical(width / 2.3),
                  }}
                  resizeMode="contain"
                  source={{
                    uri: getImageUrl(
                      celebrityDetail?.avatar?.image_fit,
                      celebrityDetail?.avatar?.image_path,
                      '1000/1000',
                    ),
                  }}
                />
              )}
            </View>
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
              <View
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
                        : null,
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
              </View>
            </View>

            <FlatList
              bounces={false}
              data={(!state.isLoading && celebrityData) || []}
              renderItem={renderProduct}
              extraData={celebrityData}
              keyExtractor={(item, index) => String(index)}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              ItemSeparatorComponent={() => <View style={{height: 16}} />}
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
              ListFooterComponent={() => (
                <View style={{height: moderateScale(80)}} />
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
                  bottomButtonClick={bottomButtonClick}
                  updateStatus={(item) => updateStatus(item)}
                />
              )}
            </View>
          </>
        )}

        <View>
          {isVisibleModal && (
            <VariantAddons
              addonSet={selectedCartItem?.add_on}
              variantData={selectedCartItem?.variantSet}
              isVisible={isVisibleModal}
              productdetail={selectedCartItem}
              onClose={() =>
                updateState({isVisibleModal: false, showShimmer: true})
              }
              typeId={typeId}
              showShimmer={showShimmer}
              shimmerClose={(val) => updateState({showShimmer: val})}
              updateCartItems={updateCartItems}
            />
          )}
        </View>

        {/* Add new addons and repeat item view */}
        {!!repeatItems && (
          <RepeatModal
            data={repeatItems?.item}
            modalHide={() => updateState({repeatItems: null})}
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
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
