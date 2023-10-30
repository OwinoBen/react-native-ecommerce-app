import { cloneDeep, debounce, isEmpty, update } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useSelector } from 'react-redux';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import Header from '../../../Components/Header';
import MultiScreen from '../../../Components/MultiScreen';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import staticStrings from '../../../constants/staticStrings';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import fontFamily from '../../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {
  getImageUrl,
  showError,
  showSuccess,
} from '../../../utils/helperFunctions';
import ModalView from '../../../Components/Modal';
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import GradientButton from '../../../Components/GradientButton';
import strings from '../../../constants/lang';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import Modal from 'react-native-modal';
import SelectVendorListModal from '../../../Components/SelectVendorListModal';
import FastImage from 'react-native-fast-image';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';

let dataLimit = 20;
let vendorLimit = 50;

const RoyoProducts = (props) => {
  const { navigation } = props;

  const {storeSelectedVendor} = useSelector((state) => state?.order);
 
  const { appData, themeColors, currencies, languages } = useSelector(
    (state) => state?.initBoot || {},
  );

  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};

  console.log('store selected vendor', storeSelectedVendor);

  const [availVendor, setAvailVendor] = useState([]);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [availCategory, setAvailCategory] = useState({});

  const [state, setState] = useState({
    activeIndex: 0,
    headerText: strings.PRODUCTS,
    selectedVendor: {},
    isVisibleModal: false,
    isLoading: true,
    isRefreshing: false,
    topTabs: [strings.PRODUCTS, strings.CATEGORIES],
    isAddProductModal: false,
    productName: '',
    productSKU: '',
    productSlug: '',
    isVendorCategory: false,
    vendorCategories: [],
    selectedVendorCategory: {},
    isAddProductLoading: false,
    skuDefault: '',
    isLoadingB: false,
    isVendorSelectModal: false,
  });

  const {
    selectedVendor,
    isLoading,
    isRefreshing,
    activeIndex,
    headerText,
    topTabs,
    isAddProductModal,
    productName,
    productSKU,
    productSlug,
    isVendorCategory,
    vendorCategories,
    selectedVendorCategory,
    isAddProductLoading,
    skuDefault,
    isLoadingB,
    isVendorSelectModal,
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //all these ref.. using for pagination

  //using in getAllVendorData method
  const dataPage = useRef(1);
  const dataLoadMore = useRef(true);
  //using in fetchAllVendors method
  const vendorPage = useRef(1);
  const vendorLoadMore = useRef(true);

  //all ref.. value reset
  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      dataPage.current = 1;
      vendorPage.current = 1;
      vendorLoadMore.current = true;
      dataLoadMore.current = true;
    });
    const blur = navigation.addListener('blur', () => {
      dataPage.current = 1;
      vendorPage.current = 1;
      vendorLoadMore.current = true;
      dataLoadMore.current = true;
    });
    return focus, blur;
  }, []);

  useEffect(() => {
    fetchAllVendors(); //fetch all vendors bydefault
    getAllVendorData(storeSelectedVendor); //fetch only selected vendor products
    getAllvendorCategories();
  }, []);

  const fetchAllVendors = async () => {
    console.log('api hit fetchAllVendors');
    let query = `?limit=${vendorLimit}&page=${vendorPage.current}`;
    let headers = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    };
    console.log('fetchAllVendors query', query);
    try {
      const res = await actions.storeVendors(query, headers);
      console.log('available vendors res', res);
      if (res.data.data.length == 0) {
        //if data empty then we stop pagination
        vendorLoadMore.current = false;
      }
      if (!!res?.data && res.data.data.length > 0) {
        let meregeData =
          vendorPage.current == 1
            ? res?.data?.data
            : [...availVendor, ...res?.data?.data];
        setAvailVendor(meregeData);
      }
    } catch (error) {
      console.log('error riased', error);
      showError(error?.message);
    }
  };

  const getAllVendorData = async (vendor) => {
    console.log('api hit getAllVendorData');
    try {
      let query = `/${vendor?.id}?limit=${dataLimit}&page=${dataPage.current}type=all`;
      let header = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      console.log('sending query get allvendor data', query);
      const res = await actions.allVendorData(query, header);
      console.log('res data+++++', res);
      if (res.data.data.length == 0) {
        // if data empty then we stop pagination
        dataLoadMore.current = false;
      }
      let meregeData =
        dataPage.current == 1 ? res.data.data : [...data, ...res.data.data];
      setData(meregeData);
      updateState({ isLoading: false, isRefreshing: false });
    } catch (error) {
      console.log('error riased', error);
      updateState({ isLoading: false, isRefreshing: false });
    }
  };

  const getAllvendorCategories = async () => {
    console.log('api hit getAllvendorCategories');
    try {
      let query = `/${storeSelectedVendor?.id}?limit=1000&page=1`;
      let header = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      const res = await actions.allVendorCategories(query, header);
      console.log('res categories+++++', res);
      setCategories(res.data.data);
    } catch (error) {
      console.log('error riased', error);
    }
  };

  const selectedCategory = async (item) => {
    dataPage.current = 1;
    vendorPage.current = 1;
    vendorLoadMore.current = true;
    dataLoadMore.current = true;
    setAvailCategory(item);
    updateState({ isLoading: true });
    await getCategoryProducts(storeSelectedVendor, item);
    updateState({ activeIndex: 0, headerText: 'Products' });
    updateState({ isLoading: false });
  };

  const getCategoryProducts = async (vendor, category) => {
    try {
      let query = `/${vendor?.id}?limit=${dataLimit}&page=${dataPage.current}&selected_category_id=${category.id}`;
      let header = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      console.log('sending query get allvendor data', query);
      const res = await actions.allVendorData(query, header);
      console.log('res data+++++', res);
      updateState({ isLoading: false, isRefreshing: false });
      if (res.data.data.length == 0) {
        // if data empty then we stop pagination
        dataLoadMore.current = false;
      }
      let meregeData =
        dataPage.current == 1 ? res.data.data : [...data, ...res.data.data];
      setData(meregeData);
      updateState({ isLoading: false, isRefreshing: false });
    } catch (error) {
      console.log('error riased', error);
      updateState({ isLoading: false, isRefreshing: false });
    }
  };

  const updateIsLiveStatus = (id, status) => {
    console.log('statusstatus', status);
    console.log('statusstatus', status == 1 ? 0 : 1);
    actions
      .postVendorProductStatusUpdate(
        {
          is_live: status == 1 ? 0 : 1,
          product_id: id,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        let temp = cloneDeep(data);
        temp = temp.map((el) => {
          if (el.id == id) {
            el.is_live = status == 1 ? 0 : 1;
            return el;
          } else {
            return el;
          }
        });
        setData(temp);
      })
      .catch(errorMethod);
  };

  const renderItem = (data, rowMap) => {
    const { item } = data;
    return (
      <TouchableOpacity style={styles.itemBox}  onPress={() =>
        navigation.navigate(navigationStrings.PRODUCTDETAIL, {
          data: item,
          isVendor: true,
        })
      }>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(navigationStrings.PRODUCTDETAIL, {
              data: item,
              isVendor: true,
            })
          }
          style={{ alignSelf: 'center' }}>
          {!isEmpty(item?.media) && (
            <FastImage
              style={styles.imageStyle}
              source={{
                uri: getImageUrl(
                  item?.media[0].image?.path?.image_fit,
                  item?.media[0].image?.path?.image_path,
                  '500/500',
                ),
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
            />
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* <View style={{flex: 1, }}> */}
            <Text
              numberOfLines={1}
              style={[styles.font16medium, { textTransform: 'capitalize' }]}>
              {item.translation[0]?.title}
            </Text>

            {/* </View> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.font16Semibold}>{strings.IN_STOCK}</Text>
              <TouchableOpacity
                onPress={() => updateIsLiveStatus(item?.id, item?.is_live)}>
                <Image
                  source={
                    item.is_live
                      ? imagePath.inStockRoyo
                      : imagePath.outStockRoyo
                  }
                />
              </TouchableOpacity>
            </View>
            {/* <Image style={{alignSelf: 'flex-end'}} source={imagePath.share} /> */}
          </View>
          {item?.category_name?.name ? (
            <Text style={styles.font13Regular}>
              in {item.category_name.name}
            </Text>
          ) : null}

          <View style={{ marginTop: 10 }}>
            <HTMLView
              value={
                item?.translation[0]?.body_html
                  ? item?.translation[0]?.body_html
                  : ''
              }
            />
            <View />
          </View>
          <Text
            style={{
              fontFamily: fontFamily.bold,
              fontSize: 14,
              color: colors.black,
              marginTop: moderateScaleVertical(4),
            }}>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(item?.variant[0]?.price),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const selectedOrder = (index) => {
    if (index == 0) {
      updateState({ activeIndex: index, headerText: 'Products' });
    } else {
      updateState({ activeIndex: index, headerText: 'Categories' });
      getAllvendorCategories();
    }
  };

  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isRefreshing: false,
      isAddProductLoading: false,
      isAddProductModal: false,
    });
    showError(error?.message || error?.error);
  };

  //Pull to refresh
  const handleRefresh = () => {
    dataPage.current = 1;
    vendorPage.current = 1;
    vendorLoadMore.current = true;
    dataLoadMore.current = true;
    getAllVendorData(storeSelectedVendor);
    updateState({ isRefreshing: true });
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    if (dataLoadMore.current) {
      dataPage.current = dataPage.current + 1;
      getAllVendorData(storeSelectedVendor);
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const renderCatogry = ({ item, index }) => (
    <View
      key={index}
      style={{
        marginBottom: moderateScaleVertical(16),
        marginLeft:
          width > 600
            ? index % 5
              ? moderateScale(10)
              : 0
            : index % 3
              ? moderateScale(10)
              : 0,
      }}>
      <TouchableOpacity
        // disabled
        onPress={() => selectedCategory(item)}
        style={styles.categoryItem}>
        <FastImage
          style={{
            resizeMode: 'center',
            width:
              width > 600
                ? (width - moderateScale(173)) / 5
                : (width - moderateScale(112)) / 3,
            height:
              width > 600
                ? (width - moderateScale(203)) / 5
                : (width - moderateScale(152)) / 3,
            borderRadius: moderateScale(7),
          }}
          source={
            item.cat_image && item.cat_image.proxy_url
              ? {
                uri: `${item.cat_image.proxy_url}200/200${item.cat_image.image_path}`,
                cache: FastImage.cacheControl.immutable,
                priority: FastImage.priority.high,
              }
              : imagePath.testingImageRoyo
          }
        />
      </TouchableOpacity>
      <Text
        style={{
          textAlign: 'center',
          width:
            width > 600
              ? (width - moderateScale(173)) / 5
              : (width - moderateScale(112)) / 3,
          textTransform: 'capitalize',
        }}>
        {item.name}
      </Text>
    </View>
  );

  const _reDirectToVendorList = () => {
    vendorPage.current = 1;
    updateState({ isVendorSelectModal: true });
  };

  const onCloseModal = () => {
    updateState({
      isAddProductModal: false,
      isVendorSelectModal: false,
      productName: '',
      productSKU: '',
      productSlug: '',
    });
  };

  const checkValidations = () => {
    if (productName == '') {
      alert(strings.PLEASE_ENTER_PRODUCT_NAME);
      return false;
    } else if (isEmpty(selectedVendorCategory)) {
      alert('Please select category');
      return false;
    } else if (productSKU == '') {
      alert('Please enter SKU');
      return false;
    } else if (productSlug == '') {
      alert('Please enter url slug');
      return false;
    } else return true;
  };

  const onAddProduct = () => {
    const isValid = checkValidations();
    if (!isValid) {
      return;
    }
    updateState({
      isAddProductLoading: true,
      isVendorCategory: false,
    });

    const data = {};
    data['product_name'] = productName;
    data['category_id'] = selectedVendorCategory?.id;
    data['sku'] = productSKU;
    data['url_slug'] = productSlug;
    data['vendor_id'] = storeSelectedVendor?.id;

    console.log('check add product api data >>', data);
    actions
      .addVendorProduct(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        updateState({
          isAddProductLoading: false,
          isAddProductModal: false,
        });
        showSuccess(res?.message);
        setTimeout(() => {
          navigation.navigate(navigationStrings.ROYO_VENDOR_ADD_PRODUCT, {
            productDetail: res?.data?.product_detail,
            onCallBack: () => {
              getAllVendorData(storeSelectedVendor);
            },
          });
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        errorMethod(err);
      });
  };

  const mainViewModal = () => {
    return (
      <View
        style={{
          minHeight: moderateScale(120),
          borderTopWidth: 0.7,
          borderTopColor: colors.blackOpacity43,
          paddingHorizontal: moderateScale(15),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: moderateScale(20),
          }}>
          <TextInputWithUnderlineAndLabel
            label={strings.PRODUCT_NAME}
            labelStyle={styles.labelStyle}
            placeholder={''}
            value={productName}
            onChangeText={(text) => {
              updateState({
                productName: text,
                productSKU: !!skuDefault
                  ? skuDefault.concat(text).replace(/ /g, '')
                  : '',
                productSlug: text.replace(/ /g, ''),
              });
            }}
            mainStyle={{ flex: 1 }}
            placeholderTextColor={colors.textGreyB}
            txtInputStyle={styles.textInputStyle}
            autoFocus
          />
        </View>
        <View style={{ marginBottom: moderateScale(12) }}>
          <Text style={styles.labelStyle}>{strings.CATEGORY}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              updateState({
                isVendorCategory: !isVendorCategory,
              });
            }}
            style={styles.selectedCategory}>
            <Text style={styles.labelStyle}>
              {!isEmpty(selectedVendorCategory)
                ? selectedVendorCategory.name
                : strings.SELECT_CATEGORY}
            </Text>
            <Image source={imagePath.icDropdown} />
          </TouchableOpacity>

          {!!isVendorCategory && (
            <View style={styles.categorySelectDropDownView}>
              <ScrollView>
                {!isEmpty(categories) ? (
                  categories.map((itm, indx) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          updateState({
                            selectedVendorCategory: itm,
                            isVendorCategory: false,
                          })
                        }
                        style={styles.categoryItm}
                        key={String(indx)}>
                        <Text style={{ flex: 0.95 }}>{itm?.hierarchy}</Text>
                        {selectedVendorCategory.id == itm.id && (
                          <Image
                            source={imagePath.tick2}
                            style={{ tintColor: themeColors.primary_color }}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View
                    style={{
                      ...styles.noDataFound,
                      backgroundColor: colors.white,
                    }}>
                    <Text
                      style={{
                        fontFamily: fontFamily.medium,
                        fontSize: moderateScale(13),
                      }}>
                      {strings.NODATAFOUND}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        <TextInputWithUnderlineAndLabel
          label={strings.SKU}
          labelStyle={styles.labelStyle}
          placeholder={'LocalMarket.Tshirt'}
          value={productSKU}
          onChangeText={(text) => {
            updateState({
              productSKU: text,
            });
          }}
          placeholderTextColor={colors.textGreyB}
          txtInputStyle={styles.textInputStyle}
          mainStyle={{ marginTop: moderateScale(5) }}
        />
        <TextInputWithUnderlineAndLabel
          label={strings.URL_SLUG}
          labelStyle={styles.labelStyle}
          placeholder={strings.SLUG}
          value={productSlug}
          onChangeText={(text) => {
            updateState({
              productSlug: text,
            });
          }}
          placeholderTextColor={colors.textGreyB}
          txtInputStyle={styles.textInputStyle}
          mainStyle={{ marginTop: moderateScale(5) }}
        />
        <ButtonWithLoader
          isLoading={isAddProductLoading}
          onPress={onAddProduct}
          btnStyle={{
            marginBottom: 10,
            borderWidth: 0,
            backgroundColor: themeColors.primary_color,
          }}
          btnTextStyle={{
            color: colors.white,
          }}
          btnText={'Add Product'}
        />
      </View>
    );
  };

  const onProductDelete = ({ item }) => {
    updateState({
      isLoading: true,
    });

    actions
      .deleteVendorProduct(
        { product_id: item?.id },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        showSuccess(res?.message);
        let temp = cloneDeep(data);
        temp = temp.filter((el) => el.id != item?.id);
        updateState({
          isLoadingB: true,
          isLoading: false,
        });
        setData(temp);
      })
      .catch(errorMethod);
  };

  const onVendorSelect = (item) => {
    //reset all pageNo and load more values
    dataPage.current = 1;
    dataLoadMore.current = true;
    // vendorPage.current = 1
    // vendorLoadMore.current = true

    updateState({ isVendorSelectModal: false });
    if (activeIndex == 0) {
      getAllVendorData(item);
    } else {
      getAllvendorCategories();
    }
    setTimeout(() => {
      actions.savedSelectedVendor(item);
    }, 300);
  };

  const onEndReachedVendor = () => {
    if (vendorLoadMore.current) {
      vendorPage.current = vendorPage.current + 1;
      fetchAllVendors();
    }
    console.log('end reached');
  };

  return (
    <WrapperContainer isLoadingB={isLoading} source={loaderOne}>
      <Header
        centerTitle={`${headerText} ${!isEmpty(storeSelectedVendor) ? `| ${storeSelectedVendor?.name}` : ''
          } `}
        noLeftIcon
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
      />

      <View style={styles.container}>
        <MultiScreen
          tabTextStyle={{ marginTop: moderateScaleVertical(0) }}
          screenName={topTabs}
          selectedScreen={(index) => selectedOrder(index)}
          selectedScreenIndex={activeIndex}
          scrollEnabled={topTabs.length > 4 ? true : false}
          mainViewStyle={{
            paddingRight: topTabs.length > 4 ? 0 : moderateScale(20),
          }}
          scrollViewStyle={{
            justifyContent:
              topTabs.length > 2 ? 'space-between' : 'space-evenly',
          }}
        />
        {activeIndex == 0 ? (
          <View
            style={{
              flex: 1,
              paddingBottom:
                Platform.OS === 'ios' ? moderateScaleVertical(70) : 0,
            }}>
            <SwipeListView
              refreshControl={
                <RefreshControl
                  onRefresh={handleRefresh}
                  refreshing={isRefreshing}
                />
              }
              onEndReached={onEndReachedDelayed}
              ListEmptyComponent={() => {
                return (
                  <View style={styles.emptyCartBody}>
                    <Image source={imagePath.emptyCartRoyo} />
                  </View>
                );
              }}
              data={data}
              extraData={data}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              renderHiddenItem={(data, rowMap) => (
                <View style={styles.rowReverse}>
                  <TouchableOpacity
                    onPress={() => onProductDelete(data)}
                    style={{
                      ...styles.hiddenButton,
                      backgroundColor: '#FFC8C8',
                    }}>
                    <Image source={imagePath.deleteRoyo} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('check product data', data);
                      // return;
                      navigation.navigate(
                        navigationStrings.ROYO_VENDOR_ADD_PRODUCT,
                        {
                          productDetail: data.item,
                          onCallBack: () =>
                            getAllVendorData(storeSelectedVendor),
                        },
                      );
                    }}
                    style={{
                      ...styles.hiddenButton,
                      backgroundColor: '#C8F3FF',
                    }}>
                    <Image source={imagePath.editRoyo} />
                  </TouchableOpacity>
                </View>
              )}
              disableRightSwipe
              rightOpenValue={-moderateScale(100)}
            />
            {!!storeSelectedVendor?.name &&
              <ButtonWithLoader
                onPress={() =>
                  updateState({
                    isAddProductModal: true,
                    skuDefault: `${storeSelectedVendor?.name ? storeSelectedVendor?.name.replace(/ /g, '') : ''}.`,
                  })
                }
                btnStyle={styles.productBtn}
                btnTextStyle={{ color: colors.black }}
                btnText={`+ ${strings.PRODUCT}`}
              />
            }

          </View>
        ) : null}
        {activeIndex == 1 ? (
          <View
            style={{
              flex: 0.9,
              // alignItems: 'center',
              paddingBottom:
                Platform.OS === 'ios' ? moderateScaleVertical(0) : 0,
            }}>
            <FlatList
              data={categories}
              keyExtractor={(item, index) => index}
              bounces={false}
              showsVerticalScrollIndicator={false}
              numColumns={width > 600 ? 5 : 3}
              renderItem={renderCatogry}
              style={{
                alignSelf: categories.length > 2 ? 'center' : 'flex-start',
                marginLeft: categories.length > 2 ? 0 : moderateScale(20),
              }}
            />
          </View>
        ) : null}
      </View>
      <ModalView
        isVisible={isAddProductModal}
        onClose={onCloseModal}
        mainViewStyle={{
          minHeight: moderateScale(350),
          backgroundColor: colors.white,
          paddingTop: moderateScaleVertical(10),
        }}
        modalMainContent={mainViewModal}
        centerTitle={strings.ADD_PRODUCT}
        topCustomComponent={false}
        leftIcon={false}
        rightIcon={imagePath.ic_cross}
        rightIconStyle={{ tintColor: colors.black }}
      />

      <Modal
        isVisible={isVendorSelectModal}
        style={{
          margin: 0,
        }}>
        <View style={{ flex: 1, backgroundColor: colors.white }}>
          <SelectVendorListModal
            vendorList={availVendor}
            onCloseModal={() => updateState({ isVendorSelectModal: false })}
            onVendorSelect={(item) => onVendorSelect(item)}
            selectedVendor={storeSelectedVendor}
            onEndReachedVendor={onEndReachedVendor}
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default RoyoProducts;

const styles = StyleSheet.create({
  font16Semibold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: '#4CB549',
    marginRight: moderateScale(10),
  },
  container: {
    flex: 1,
  },
  font16medium: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.black,
  },
  textStyle: {
    color: colors.black,
    fontSize: 24,
    fontFamily: fontFamily.bold,
  },
  imageStyle: {
    width: moderateScale(60),
    height: moderateScaleVertical(60),
    borderRadius: 6,
    marginRight: moderateScale(18),
  },
  rowReverse: {
    flexDirection: 'row-reverse',
    height: '100%',
  },
  itemBox: {
    padding: moderateScale(18),
    borderRadius: moderateScale(6),
    backgroundColor: colors.whiteSmokeColor,
    flexDirection: 'row',
    marginBottom: moderateScaleVertical(16),
  },
  font13Regular: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.blackOpacity40,
  },
  hiddenButton: {
    paddingHorizontal: moderateScale(14),
    marginBottom: moderateScale(16),
    borderRadius: moderateScaleVertical(8),
    justifyContent: 'center',
    marginLeft: moderateScale(8),
  },
  categoryItem: {
    alignSelf: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScaleVertical(16),
    marginBottom: moderateScaleVertical(8),
    borderRadius: moderateScaleVertical(6),
  },
  productBtn: {
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? moderateScale(75) : moderateScale(5),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
    right: 10,
    backgroundColor: colors.white,
  },
  categoryBtn: {
    position: 'absolute',
    padding: moderateScale(10),
    bottom: moderateScaleVertical(20),
    right: moderateScale(10),
    borderRadius: moderateScale(100),
    paddingHorizontal: moderateScale(15),
  },
  emptyCartBody: {
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(600),
  },
  labelStyle: {
    fontFamily: fontFamily.bold,
    color: colors.blackOpacity43,
    fontSize: textScale(13),
    marginBottom: moderateScale(5),
  },
  addProductBtn: {
    color: colors.white,
    fontSize: textScale(14),
  },
  textInputStyle: {
    fontFamily: fontFamily.bold,
    color: colors.black,
    fontSize: textScale(13),
  },
  noDataFound: {
    width: '100%',
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  categorySelectDropDownView: {
    borderWidth: 1,
    borderColor: colors.blackOpacity20,
    borderRadius: 5,
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(5),
    maxHeight: moderateScale(100),
  },
  categoryItm: {
    marginBottom: moderateScale(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.textGreyB,
    paddingBottom: 8,
  },
});
