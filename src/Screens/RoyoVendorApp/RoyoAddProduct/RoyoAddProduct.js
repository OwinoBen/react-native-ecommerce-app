import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform, RefreshControl, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalDropdown from 'react-native-modal-dropdown';
import { useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import { loaderOne } from '../../../Components/Loaders/AnimatedLoaderFiles';
import ModalView from '../../../Components/Modal';
import ModalDropDownComp from '../../../Components/ModalDropDown';
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import { hitSlopProp } from '../../../styles/commonStyles';
import fontFamily from '../../../styles/fontFamily';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import {
  cameraHandler, getValuebyKeyInArray
} from '../../../utils/commonFunction';
import {
  getImageUrl,
  showError,
  showSuccess
} from '../../../utils/helperFunctions';

const RoyoAddProduct = ({route, navigation}) => {
  const paramData = route.params;
  const productDetailParam = paramData?.productDetail;
  const {appData, themeColors, currencies, languages} = useSelector(
    (state) => state?.initBoot || {},
  );
  const {additional_preferences} = appData?.profile?.preferences || {};
  const [state, setState] = useState({
    isLoading: true,
    isLoadingB: false,
    stepPoints: [
      {
        id: 1,
        name: 'General  >',
      },
      {
        id: 2,
        name: 'Pricing   >',
      },
      {
        id: 3,
        name: 'Other Information',
      },
    ],
    productStatus: [
      {
        id: 0,
        title: 'Draft',
      },
      {
        id: 1,
        title: 'Published',
      },
    ],
    currentStepIndex: 0,
    isOn: false,
    productName: productDetailParam?.title || '',
    productSKU: productDetailParam?.sku || '',
    productSlug: productDetailParam?.url_slug || '',
    addons: [],
    brands: [],
    celebrities: [],
    clientLanguages: [],
    configData: {},
    productVariants: [],
    taxCategory: [],
    productImages: [],
    isLangugaeDropDown: false,
    selectedLang: {},
    selectedAddons: [],
    childVariant: [],
    variantSet: [],
    optionsSet: [],
    createdVariantSets: [],
    exisitingVariants: [],
    productDescription: '',
    metaTitle: '',
    metaKeyword: '',
    metaDescription: '',
    price: '',
    compareAtPrice: '',
    isTrackInventory: false,
    isNew: false,
    isFeatured: false,
    isInquiryOnly: false,
    isRequiresPrescription: false,
    isRequiresLastMileDelivery: false,
    selectedLiveType: {},
    selectedBrand: {},
    delayHrs: '',
    delayMinutes: '',
    selectedProductStatus: {},
    selectedUpSellProducts: [],
    selectedCrossSellProducts: [],
    selectedRelatedProducts: [],
    isImagePickerModal: false,
    quantity: null,
    isSellWhenOutOfStock: false,
    minimumOrderCount: '',
    batchCount: '',
    otherProducts: [],
    selectedTaxCategory: {},
    variantIds: [],
    variantName: [],
    variantQuantity: [],
    variantPrice: [],
    variantCostPrice: [],
    variantCompareAtPrice: [],
    selectedVariant: {},
    variantImages: [],
    isVarientImageDeleted: false,
    tempImg: '',
    isRefreshing: false,
    costPrice: '',
    vendorInfo: {},
  });
  const {
    isLoading,
    isLoadingB,
    stepPoints,
    currentStepIndex,
    isOn,
    productName,
    productSKU,
    productSlug,
    addons,
    brands,
    celebrities,
    clientLanguages,
    configData,
    productVariants,
    taxCategory,
    productImages,
    isLangugaeDropDown,
    selectedLang,
    selectedAddons,
    childVariant,
    variantSet,
    optionsSet,
    createdVariantSets,
    exisitingVariants,
    productDescription,
    metaTitle,
    metaKeyword,
    metaDescription,
    price,
    compareAtPrice,
    isNew,
    isFeatured,
    isInquiryOnly,
    isRequiresPrescription,
    isRequiresLastMileDelivery,
    isTrackInventory,
    selectedLiveType,
    selectedBrand,
    delayHrs,
    delayMinutes,
    productStatus,
    selectedProductStatus,
    selectedUpSellProducts,
    selectedCrossSellProducts,
    selectedRelatedProducts,
    isImagePickerModal,
    quantity,
    isSellWhenOutOfStock,
    minimumOrderCount,
    batchCount,
    otherProducts,
    selectedTaxCategory,
    variantIds,
    variantName,
    variantQuantity,
    variantPrice,
    variantCostPrice,
    variantCompareAtPrice,
    selectedVariant,
    variantImages,
    isVarientImageDeleted,
    tempImg,
    isRefreshing,
    costPrice,
    vendorInfo,
  } = state;

  useEffect(() => {
    if (isLoading || isVarientImageDeleted) {
      getVendorProductDetailByID();
    }
  }, [isLoading, isVarientImageDeleted]);

  const getVendorProductDetailByID = () => {
    actions
      .getVendorProductDetail(
        {
          product_id: productDetailParam?.id || '',
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, '<===response');
        const productInfo = res?.data?.product_detail;
        updateState({
          isRefreshing: false,
          isLoading: false,
          isLoadingB: false,
          addons: res?.data?.addons,
          brands: res?.data?.brands,
          celebrities: res?.data?.celebrities,
          clientLanguages: res?.data?.client_languages,
          configData: res?.data?.config_data,
          productVariants: res?.data?.product_variants,
          taxCategory: res?.data?.tax_category,
          exisitingVariants: productInfo?.variant,
          otherProducts: res?.data?.other_products,
          productName: productInfo?.primary.title || productInfo?.title,
          productDescription:
            productInfo?.primary.body_html != null
              ? productInfo?.primary.body_html
              : productDetailParam?.translation
              ? productDetailParam?.translation[0]?.body_html
              : '',
          price:
            productInfo?.variant &&
            productInfo?.variant.length > 0 &&
            productInfo?.variant[0].price
              ? getValuebyKeyInArray(
                  'is_token_currency_enable',
                  additional_preferences,
                )
                ? String(
                    Number(productInfo?.variant[0].price) *
                      getValuebyKeyInArray(
                        'token_currency',
                        additional_preferences,
                      ),
                  )
                : Number(productInfo?.variant[0].price).toFixed(2).toString()
              : '',
          // compareAtPrice: productInfo?.variant[0].cost_price
          //   ? productInfo?.variant[0].cost_price
          //   : '',
          compareAtPrice:
            productInfo?.variant &&
            productInfo?.variant.length > 0 &&
            productInfo?.variant[0].compare_at_price
              ? getValuebyKeyInArray(
                  'is_token_currency_enable',
                  additional_preferences,
                )
                ? String(
                    Number(productInfo?.variant[0].compare_at_price) *
                      getValuebyKeyInArray(
                        'token_currency',
                        additional_preferences,
                      ),
                  )
                : Number(productInfo?.variant[0].compare_at_price)
                    .toFixed(2)
                    .toString()
              : '',
          batchCount:
            productInfo?.batch_count > 0
              ? productInfo?.batch_count.toString()
              : '',
          isTrackInventory: productInfo?.has_inventory,
          minimumOrderCount:
            productInfo?.minimum_order_count > 0
              ? productInfo?.minimum_order_count.toString()
              : '',
          isSellWhenOutOfStock: productInfo?.sell_when_out_of_stock,
          quantity:
            productInfo?.variant[0] && productInfo?.variant[0].quantity > 0
              ? productInfo?.variant[0].quantity.toString()
              : 0,
          isNew: productInfo.is_new ? true : false,
          isFeatured: productInfo.is_featured ? true : false,
          isInquiryOnly: productInfo.inquiry_only ? true : false,
          isRequiresPrescription: productInfo.pharmacy_check ? true : false,
          isRequiresLastMileDelivery: productInfo.Requires_last_mile
            ? true
            : false,
          delayHrs:
            productInfo?.pickup_delay_order_hrs > 0
              ? productInfo?.pickup_delay_order_hrs.toString()
              : '',
          delayMinutes:
            productInfo?.pickup_delay_order_min > 0
              ? productInfo?.pickup_delay_order_min.toString()
              : '',
          selectedProductStatus:
            productInfo?.is_live == 0 ? productStatus[0] : productStatus[1],
          vendorInfo: productInfo?.vendor,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, 'error>>>Server');
    updateState({
      isLoading: false,
      isLoadingB: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };

  const updateState = (data) => {
    setState((state) => {
      return {...state, ...data};
    });
  };

  const onUpdateProduct = () => {
    updateState({isLoadingB: true});
    let formData = new FormData();
    formData.append('product_id', productDetailParam?.id || '');
    formData.append('sku', productDetailParam?.sku);
    formData.append('url_slug', productDetailParam?.url_slug);
    formData.append('product_name', productName);
    formData.append('body_html', productDescription);
    formData.append('language_id', selectedLang?.id || 1);
    formData.append('meta_title', metaTitle);
    formData.append('meta_keyword', metaKeyword);
    formData.append('meta_description', metaDescription);
    formData.append(
      'price',
      getValuebyKeyInArray('is_token_currency_enable', additional_preferences)
        ? price / getValuebyKeyInArray('token_currency', additional_preferences)
        : price,
    );
    formData.append('compare_at_price', compareAtPrice);
    formData.append('has_inventory', isTrackInventory ? 1 : 0);
    formData.append('quantity', quantity);
    formData.append('sell_stock_out', isSellWhenOutOfStock);
    formData.append('minimum_order_count', minimumOrderCount);
    formData.append('batch_count', batchCount);
    variantIds.map((item) => {
      formData.append('variant_ids[]', item);
    });
    variantName.map((item) => {
      formData.append('variant_titles[]', item);
    });
    variantQuantity.map((item) => {
      formData.append('variant_quantity[]', item);
    });
    variantPrice.map((item) => {
      formData.append('variant_price[]', item);
    });
    variantCostPrice.map((item) => {
      formData.append('variant_cost_price[]', item);
    });
    variantCompareAtPrice.map((item) => {
      formData.append('variant_compare_price[]', item);
    });
    selectedAddons.map((item) => {
      formData.append('addon_sets[]', item?.id);
    });
    selectedUpSellProducts.map((item) => {
      formData.append('up_cell[]', item?.id);
    });
    selectedCrossSellProducts.map((item) => {
      formData.append('cross_cell[]', item?.id);
    });
    selectedRelatedProducts.map((item) => {
      formData.append('releted_product[]', item?.id);
    });
    formData.append('is_new', isNew ? 1 : 0);
    formData.append('is_featured', isFeatured ? 1 : 0);
    formData.append('inquiry_only', isInquiryOnly ? 1 : 0);
    formData.append('pharmacy_check', isRequiresPrescription ? 1 : 0);
    formData.append('last_mile', isRequiresLastMileDelivery ? 1 : 0);
    formData.append('is_live', selectedProductStatus.id);
    formData.append('brand_id', selectedBrand?.id || '');
    formData.append('tax_category', selectedTaxCategory?.id || '');
    formData.append('delay_order_hrs', delayHrs);
    formData.append('delay_order_min', delayMinutes);
    formData.append('category_id', productDetailParam?.category_id);
    console.log(formData, 'formData....formData');
    formData.append('cost_price', costPrice);

    // formData.append('country_origin_id', itm);
    // formData.append('weight', itm);
    // formData.append('weight_unit', itm);
    // formData.append('tags', itm);
    // formData.append('is_physical', itm);
    // formData.append('require_ship', itm);
    // formData.append('need_price_from_dispatcher', itm);
    // formData.append('mode_of_service', itm);
    // formData.append('pickup_delay_order_hrs', itm);
    // formData.append('pickup_delay_order_min', itm);
    // formData.append('dropoff_delay_order_hrs', itm);
    // formData.append('dropoff_delay_order_min', itm);
    // formData.append('tag_sets[]', itm);
    // formData.append('celebrities[]', itm);
    // formData.append('cost_price', itm);

    actions
      .updateVendorProduct(formData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        'Content-Type': 'multipart/form-data',
      })
      .then(async (res) => {
        showSuccess(res?.message);
        updateState({
          isLoadingB: false,
        });

        await paramData?.onCallBack();
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
        setTimeout(() => {
          paramData?.onCallBack();
        }, 5000);
      })
      .catch(errorMethod);
  };

  const customRight = () => {
    return (
      <GradientButton
        colorsArray={[themeColors.primary_color, themeColors.primary_color]}
        textStyle={styles.addProductBtn}
        marginTop={moderateScaleVertical(20)}
        marginBottom={moderateScaleVertical(20)}
        btnText={strings.SAVE}
        onPress={onUpdateProduct}
        containerStyle={{height: moderateScale(30), width: moderateScale(60)}}
        btnStyle={{borderRadius: 5}}
      />
    );
  };

  const onStepChange = (itm, indx) => {
    updateState({
      currentStepIndex: indx,
    });
  };

  const renderStepIndicator = (item, index) => {
    return (
      <TouchableOpacity
        onPress={() => onStepChange(item, index)}
        style={{marginRight: moderateScale(12)}}>
        <Text
          style={{
            color:
              currentStepIndex >= index
                ? themeColors.primary_color
                : colors.black,
            fontSize: textScale(14),
            fontFamily: fontFamily.bold,
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const cameraHandle = (index) => {
    if (index == 0 || index == 1) {
      cameraHandler(index, {
        width: 300,
        height: 400,
        cropping: false,
        cropperCircleOverlay: false,
        compressImageQuality: 0.5,
        mediaType: 'photo',
      })
        .then((res) => {
          if (res && (res?.sourceURL || res?.path)) {
            let file = {
              image_id: Math.random(),
              name:
                Platform.OS == 'ios'
                  ? res?.filename
                  : res?.path.substring(res?.path.lastIndexOf('/') + 1),
              // mime: res?.mime,
              type: res?.mime,
              uri: res?.sourceURL || res?.path,
            };

            if (isImagePickerModal) {
              updateState({
                variantImages: [...variantImages, file],
              });
              return;
            }
            let formData = new FormData();
            formData.append('product_id', productDetailParam?.id || '');
            formData.append('file[]', file);
            addProductImages(formData);
          }
        })
        .catch((err) => {});
    }
  };

  /***********Remove product images */
  const _removeImageFromList = (selectdImage) => {
    updateState({
      isLoadingB: true,
    });
    let formData = new FormData();
    formData.append('product_id', productDetailParam?.id || '');
    formData.append('media_id', selectdImage?.media_id);
    actions
      .deleteProductImage(formData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        showSuccess(res?.message);
        updateState({
          isLoadingB: false,
          productImages: res?.data,
          isVarientImageDeleted: true,
        });
      })
      .catch(errorMethod);
  };

  const onProductVariant = (parent_variant, child_variant) => {
    const childVariantAry = [...childVariant];
    const variantSetAry = [...variantSet];
    const optionsSetAry = [...optionsSet];
    let variantSetString = `${parent_variant?.id};${parent_variant?.title}`;
    const optionsSetString = `${child_variant?.id};${child_variant?.title}`;

    if (
      childVariantAry.includes(child_variant) ||
      optionsSetAry.includes(optionsSetString)
    ) {
      const filteredChildVariant = childVariantAry.filter(
        (item) => item.id !== child_variant?.id,
      );
      const filteredOptionsSet = optionsSetAry.filter(
        (item) => item !== optionsSetString,
      );

      let idx = variantSetAry.indexOf(variantSetString);
      if (idx >= 0) {
        variantSetAry.splice(idx, 1);
      }

      updateState({
        childVariant: filteredChildVariant,
        variantSet: variantSetAry,
        optionsSet: filteredOptionsSet,
      });
    } else {
      updateState({
        childVariant: [...childVariantAry, child_variant],
        variantSet: [...variantSetAry, variantSetString],
        optionsSet: [...optionsSetAry, optionsSetString],
      });
    }
  };

  const isChecked = (itm, aryToCheck) => {
    const newAryToCheck = [...aryToCheck];
    return newAryToCheck.some((item) => item.id === itm.id);
  };

  const renderProductVariants = (item, index) => {
    return (
      <View style={{marginBottom: moderateScale(15)}}>
        <Text style={styles.variantName}>{item?.title}</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {item?.option.map((itm, indx) => {
            return (
              <TouchableOpacity
                onPress={() => onProductVariant(item, itm)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: moderateScale(5),
                  marginRight: moderateScale(20),
                }}>
                <Image
                  source={
                    isChecked(itm, childVariant)
                      ? imagePath.icCheck1
                      : imagePath.icCheck2
                  }
                />
                <Text style={styles.variantTypeTxt}>{itm?.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const onMakeVariantSet = () => {
    updateState({
      isLoadingB: true,
    });
    let formData = new FormData();
    formData.append('product_id', productDetailParam?.id || '');
    formData.append('sku', productDetailParam?.sku || '');
    variantSet.map((itm) => {
      formData.append('variantIds[]', itm);
    });
    optionsSet.map((itm) => {
      formData.append('optionIds[]', itm);
    });
    actions
      .createProductVariant(formData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        updateState({isLoadingB: false, createdVariantSets: res?.data});
      })
      .catch(errorMethod);
  };

  const onDeleteProductVariant = (item) => {
    updateState({
      isLoadingB: true,
    });
    actions
      .deleteProductVariant(
        {
          product_id: item?.product_id,
          variant_id: item?.id,
        },
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        showSuccess(res?.message);
        setTimeout(() => {
          updateState({
            isLoading: true,
            isLoadingB: false,
            createdVariantSets: [],
          });
        }, 500);
      })
      .catch(errorMethod);
  };

  const onMultipleItemSelect = (item, ary, key) => {
    const availableAry = state[key];
    if (availableAry.includes(item)) {
      const filteredAddons = availableAry.filter((itm) => itm?.id !== item?.id);
      updateState({
        [key]: filteredAddons,
      });
    } else {
      updateState({[key]: [...ary, item]});
    }
  };

  const onVariantFieldChange = (value, item, key) => {
    let stateOfKey = state[key];
    if (variantIds.includes(item?.id)) {
      let indx = variantIds.findIndex((itm) => itm == item?.id);
      stateOfKey[indx] = value;
      updateState({
        [key]: [...stateOfKey],
      });
    } else {
      updateState({
        variantIds: [...variantIds, item?.id],
        [key]: [...stateOfKey, value],
      });
    }
  };

  const renderCreatedVariants = ({item, indx}) => {
    return (
      <View
        style={{
          ...styles.seoViewStyle,
          backgroundColor: colors.lightGreen,
          borderWidth: 0,
          marginTop: moderateScale(10),
        }}>
        <View
          style={{
            ...styles.flexRowStyle,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{alignItems: 'center'}}
            onPress={() =>
              updateState({
                isImagePickerModal: true,
                selectedVariant: item,
              })
            }>
            <Text style={styles.labelStyle}>{strings.IMAGE}</Text>
            {!!item?.vimage ? (
              <Image
                style={{
                  height: moderateScale(35),
                  width: moderateScale(35),
                  borderRadius: moderateScale(3),
                }}
                source={{
                  uri: getImageUrl(
                    item?.vimage?.pimage?.image?.path?.image_fit,
                    item?.vimage?.pimage?.image?.path?.image_path,
                    '400/400',
                  ),
                }}
              />
            ) : (
              <Image source={imagePath.icImagePlaceholder} />
            )}
          </TouchableOpacity>
          <TextInputWithUnderlineAndLabel
            label={strings.NAME}
            labelStyle={styles.labelStyle}
            onChangeText={(value) =>
              onVariantFieldChange(value, item, 'variantName')
            }
            mainStyle={{flex: 0.55}}
            placeholderTextColor={colors.textGreyB}
            txtInputStyle={styles.textInputStyle}
            defaultValue={item?.title || item?.sku}
          />
          <TextInputWithUnderlineAndLabel
            label={strings.QUANTITY}
            placeholder={'0'}
            mainStyle={{flex: 0.25}}
            onChangeText={(value) =>
              onVariantFieldChange(value, item, 'variantQuantity')
            }
            labelStyle={styles.labelStyle}
            placeholderTextColor={colors.textGreyB}
            txtInputStyle={styles.textInputStyle}
          />
          <TouchableOpacity
            hitSlop={hitSlopProp}
            onPress={() => onDeleteProductVariant(item)}>
            <Image source={imagePath.icDelete} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...styles.flexRowStyle,
          }}>
          <TextInputWithUnderlineAndLabel
            label={strings.PRICE}
            labelStyle={styles.labelStyle}
            placeholder={'0'}
            onChangeText={(value) =>
              onVariantFieldChange(value, item, 'variantPrice')
            }
            mainStyle={{flex: 0.2}}
            placeholderTextColor={colors.textGreyB}
            txtInputStyle={styles.textInputStyle}
            value={item.price ? Number(item.price).toFixed(2).toString() : ''}
          />
          <TextInputWithUnderlineAndLabel
            label={strings.COST_PRICE}
            labelStyle={styles.labelStyle}
            placeholder={'0'}
            mainStyle={{flex: 0.25}}
            onChangeText={(value) =>
              onVariantFieldChange(value, item, 'variantCostPrice')
            }
            placeholderTextColor={colors.textGreyB}
            txtInputStyle={styles.textInputStyle}
            value={item.cost_price ? item.cost_price : ''}
          />
          <TextInputWithUnderlineAndLabel
            label={strings.COMPARE_AT_PRICE}
            placeholder={'0'}
            mainStyle={{flex: 0.45}}
            labelStyle={styles.labelStyle}
            onChangeText={(value) =>
              onVariantFieldChange(value, item, 'variantCompareAtPrice')
            }
            placeholderTextColor={colors.textGreyB}
            txtInputStyle={styles.textInputStyle}
            value={
              item.compare_at_price
                ? Number(item.compare_at_price).toFixed(2).toString()
                : ''
            }
          />
        </View>
      </View>
    );
  };

  const renderDropDownTitle = (item, index) => {
    return <Text>{`${item?.primary?.title || item?.title}, `}</Text>;
  };

  const onCloseModal = () => {
    updateState({
      isImagePickerModal: false,
    });
  };

  const topCustomComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: colors.textGreyB,
          paddingHorizontal: moderateScale(20),
          paddingBottom: moderateScale(10),
        }}>
        <Text style={{fontFamily: fontFamily.bold, fontSize: textScale(13)}}>
          {strings.ADD_PRODUCT_IMAGE}
        </Text>
        <TouchableOpacity activeOpacity={0.7} onPress={onCloseModal}>
          <Image source={imagePath.icCross2} />
        </TouchableOpacity>
      </View>
    );
  };

  const _onVariantImageUpload = () => {
    updateState({
      isImagePickerModal: false,
    });
    let formData = new FormData();
    formData.append('product_id', productDetailParam?.id || '');
    formData.append('variant_id', selectedVariant?.id);
    variantImages.map((item) => {
      formData.append('file[]', item);
    });

    updateState({tempImg: tempImg.uri});

    setTimeout(() => {
      addProductImages(formData);
    }, 500);
  };

  const addProductImages = (formData) => {
    updateState({isLoadingB: true});
    actions
      .addProductImage(formData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        'Content-Type': 'multipart/form-data',
      })
      .then((res) => {
        showSuccess(res?.message);
        updateState({
          isLoadingB: false,
          productImages: res?.data,
        });
      })
      .catch(errorMethod);
  };

  const _removeImageFromLocalList = (localImage) => {
    const variantImagesAry = [...variantImages];
    const filteredVariantImages = variantImagesAry.filter(
      (itm) => itm?.image_id != localImage?.image_id,
    );
    updateState({
      variantImages: filteredVariantImages,
      isVarientImageDeleted: false,
    });
  };

  const mainViewModal = () => {
    return (
      <View
        style={{
          paddingVertical: moderateScale(10),
          paddingHorizontal: moderateScale(20),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          {!!selectedVariant.vimage && (
            <ImageBackground
              style={{
                height: moderateScaleVertical(70),
                width: moderateScale(80),
                marginRight: moderateScale(10),
              }}
              source={{
                uri: getImageUrl(
                  selectedVariant.vimage?.pimage?.image?.path?.image_fit,
                  selectedVariant.vimage?.pimage?.image?.path?.image_path,
                  '400/400',
                ),
              }}>
              <TouchableOpacity
                hitSlop={hitSlopProp}
                onPress={() => {
                  updateState({isImagePickerModal: false});
                  setTimeout(() => {
                    _removeImageFromList(selectedVariant.vimage?.pimage);
                  }, 500);
                }}
                style={{position: 'absolute', right: -5, top: -5}}>
                <Image source={imagePath.icRemoveIcon} />
              </TouchableOpacity>
            </ImageBackground>
          )}
          {variantImages.map((item) => (
            <ImageBackground
              style={{
                height: moderateScaleVertical(70),
                width: moderateScale(80),
                marginRight: moderateScale(10),
                marginBottom: moderateScale(10),
              }}
              source={{uri: item?.uri}}>
              <TouchableOpacity
                hitSlop={hitSlopProp}
                onPress={() => _removeImageFromLocalList(item)}
                style={{position: 'absolute', right: -5, top: -5}}>
                <Image source={imagePath.icRemoveIcon} />
              </TouchableOpacity>
            </ImageBackground>
          ))}
          <TouchableOpacity onPress={showActionSheet} activeOpacity={0.7}>
            <Image
              source={imagePath.icImagePlaceholder}
              style={{
                height: moderateScaleVertical(70),
                width: moderateScale(80),
                marginRight: moderateScale(10),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={_onVariantImageUpload}
          style={{
            backgroundColor: themeColors.primary_color,
            width: '100%',
            alignItems: 'center',
            paddingVertical: moderateScale(10),
            borderRadius: moderateScale(5),
            marginTop: moderateScaleVertical(20),
          }}>
          <Text style={{fontFamily: fontFamily.bold, color: colors.white}}>
            {strings.SELECT}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleRefresh = () => {
    updateState({isRefreshing: true});
    getVendorProductDetailByID();
  };

  return (
    <WrapperContainer source={loaderOne} isLoadingB={isLoading || isLoadingB}>
      <Header
        leftIcon={imagePath.backRoyo}
        centerTitle={productDetailParam?.title || ''}
        customRight={customRight}
      />

      <View style={{...styles.stepBarView, marginTop: moderateScale(10)}}>
        {stepPoints.map(renderStepIndicator)}
      </View>

      <KeyboardAwareScrollView
        // scrollEnabled={!isLangugaeDropDown}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }>
        {currentStepIndex == 0 ? (
          <View>
            <View style={styles.mainViewStyle}>
              <View
                style={{
                  ...styles.flexRowStyle,
                  marginTop: moderateScale(20),
                  marginHorizontal: moderateScale(15),
                }}>
                <TextInputWithUnderlineAndLabel
                  label={strings.SKU}
                  labelStyle={styles.labelStyle}
                  placeholder={'xyz.LocalMarket.Tshirt'}
                  value={productSKU}
                  mainStyle={{flex: 0.6}}
                  placeholderTextColor={colors.textGreyB}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={strings.URL_SLUG}
                  placeholder={'tshirt'}
                  mainStyle={{flex: 0.35}}
                  value={productSlug}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.textGreyB}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>
            <View
              style={{
                ...styles.stepBarView,
                marginTop: moderateScale(40),
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                }}>
                {strings.PRODUCT_INFORMATION}
              </Text>
              <ModalDropDownComp
                options={clientLanguages}
                defaultValue={
                  isEmpty(clientLanguages) ? '' : clientLanguages[0].langTitle
                }
                _onSelect={(idx, value) => {
                  updateState({
                    selectedLang: value,
                    productName:
                      value?.langId == 1 ? productDetailParam?.title : '',
                    productDescription: '',
                    metaTitle: '',
                    metaDescription: '',
                    metaDescription: '',
                  });
                }}
                _renderButtonText={(rowData) => (
                  <Text>{rowData?.langTitle}</Text>
                )}
                _renderRow={(rowData) => (
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="cornflowerblue"
                    style={{backgroundColor: colors.white}}>
                    <Text
                      style={{
                        paddingVertical: 10,
                        marginHorizontal: 10,
                      }}>{`${rowData.langTitle}`}</Text>
                  </TouchableHighlight>
                )}
                _renderRightComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                    }}>
                    <Image source={imagePath.icDropdown} />
                  </View>
                )}
              />
            </View>
            <View
              style={{
                ...styles.mainViewStyle,
                paddingHorizontal: moderateScale(15),
                zIndex: -5,
              }}>
              <TextInputWithUnderlineAndLabel
                label={strings.PRODUCT_NAME}
                placeholder={strings.TSHIRT}
                labelStyle={styles.labelStyle}
                value={productName}
                onChangeText={(value) => updateState({productName: value})}
                placeholderTextColor={colors.textGreyB}
                txtInputStyle={styles.textInputStyle}
                mainStyle={{
                  marginTop: moderateScale(20),
                }}
              />
              <TextInputWithUnderlineAndLabel
                label={strings.PRODUCT_DESC}
                placeholder={strings.PRODUCT_DESC}
                onChangeText={(value) =>
                  updateState({productDescription: value})
                }
                value={productDescription}
                labelStyle={styles.labelStyle}
                placeholderTextColor={colors.textGreyB}
                txtInputStyle={styles.textInputStyle}
              />
              <View style={styles.seoViewStyle}>
                <View
                  style={{
                    ...styles.flexRowStyle,
                    alignItems: 'center',
                  }}>
                  <Text>{strings.SEO}</Text>
                  <Image source={imagePath.icUpArrow} />
                </View>
                <View
                  style={{
                    ...styles.flexRowStyle,
                    marginTop: moderateScale(20),
                  }}>
                  <TextInputWithUnderlineAndLabel
                    label={strings.META_TITLE}
                    labelStyle={styles.labelStyle}
                    placeholder={strings.META_TITLE}
                    value={metaTitle}
                    onChangeText={(value) => updateState({metaTitle: value})}
                    mainStyle={{flex: 0.48}}
                    placeholderTextColor={colors.textGreyB}
                    txtInputStyle={styles.textInputStyle}
                  />
                  <TextInputWithUnderlineAndLabel
                    label={strings.META_KEYWORD}
                    placeholder={strings.META_KEYWORD}
                    onChangeText={(value) => updateState({metaKeyword: value})}
                    value={metaKeyword}
                    mainStyle={{flex: 0.48}}
                    labelStyle={styles.labelStyle}
                    placeholderTextColor={colors.textGreyB}
                    txtInputStyle={styles.textInputStyle}
                  />
                </View>
                <TextInputWithUnderlineAndLabel
                  label={strings.META_DESC}
                  placeholder={strings.META_DESC}
                  onChangeText={(value) =>
                    updateState({metaDescription: value})
                  }
                  value={metaDescription}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.textGreyB}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>
            {/* <Image
              source={tempImg ? {uri: 'file:///storage/emulated/0/Android/data/com.codebrew.royoorder/files/Pictures/abb5aa92-05c3-45bb-aaa6-667da4395aed.jpg'} : imagePath.allProducts}
              // source={{uri: 'file:///storage/emulated/0/Android/data/com.codebrew.royoorder/files/Pictures/abb5aa92-05c3-45bb-aaa6-667da4395aed.jpg'}}
              style={{width: 100, height: 100}}
            /> */}
            <View
              style={{
                ...styles.stepBarView,
                marginTop: moderateScale(40),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                }}>
                {strings.PRODUCT_IMAGE}
              </Text>
            </View>
            <View
              style={{
                ...styles.mainViewStyle,
                paddingHorizontal: moderateScale(15),
                paddingVertical: moderateScale(10),
                alignItems: 'center',
              }}>
              {!!(productImages && productImages.length)
                ? productImages.map((i, inx) => {
                    return (
                      <ImageBackground
                        key={String(inx)}
                        source={{
                          uri: getImageUrl(
                            i.image?.path?.image_fit,
                            i.image?.path?.image_path,
                            '1000/1000',
                          ),
                        }}
                        style={styles.imageOrderStyle}
                        imageStyle={styles.imageOrderStyle}>
                        <View style={styles.viewOverImage}>
                          <View
                            style={{
                              position: 'absolute',
                              top: -10,
                              right: -10,
                            }}>
                            <TouchableOpacity
                              onPress={() => _removeImageFromList(i)}>
                              <Image source={imagePath.icRemoveIcon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </ImageBackground>
                    );
                  })
                : null}
              <TouchableOpacity onPress={showActionSheet} activeOpacity={0.7}>
                <Image source={imagePath.icPlaceholder} />
              </TouchableOpacity>
            </View>
          </View>
        ) : currentStepIndex == 1 ? (
          <View
            style={{
              ...styles.mainViewStyle,
              paddingHorizontal: moderateScale(15),
            }}>
            <View
              style={{
                ...styles.flexRowStyle,
                marginTop: moderateScale(20),
              }}>
              {vendorInfo?.is_seller == 1 ? (
                <TextInputWithUnderlineAndLabel
                  label={strings.COST_PRICE}
                  placeholder={'200'}
                  onChangeText={(value) =>
                    updateState({
                      costPrice: value,
                    })
                  }
                  value={costPrice}
                  mainStyle={{flex: 0.4}}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.textGreyB}
                  txtInputStyle={styles.textInputStyle}
                />
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                  }}>
                  <TextInputWithUnderlineAndLabel
                    label={strings.PRICE}
                    labelStyle={styles.labelStyle}
                    placeholder={'200'}
                    onChangeText={(value) =>
                      updateState({
                        price: value,
                      })
                    }
                    value={price}
                    mainStyle={{flex: 0.3}}
                    placeholderTextColor={colors.textGreyB}
                    txtInputStyle={styles.textInputStyle}
                  />
                  <TextInputWithUnderlineAndLabel
                    label={strings.COMPARE_AT_PRICE}
                    placeholder={'200'}
                    onChangeText={(value) =>
                      updateState({
                        compareAtPrice: value,
                      })
                    }
                    value={compareAtPrice}
                    mainStyle={{flex: 0.65, marginLeft: moderateScale(10)}}
                    labelStyle={styles.labelStyle}
                    placeholderTextColor={colors.textGreyB}
                    txtInputStyle={styles.textInputStyle}
                  />
                </View>
              )}
              <View style={{flex: 0.31}}>
                <Text style={styles.labelStyle}>{strings.TRACK_INVENTORY}</Text>
                <ToggleSwitch
                  isOn={isTrackInventory}
                  onColor={themeColors.primary_color}
                  offColor={colors.textGreyB}
                  size="medium"
                  onToggle={(isOn) =>
                    updateState({
                      isTrackInventory: isOn ? true : false,
                    })
                  }
                  animationSpeed={400}
                />
              </View>
            </View>
            {!!isTrackInventory && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <TextInputWithUnderlineAndLabel
                    label={strings.QUANTITY}
                    placeholder={'0'}
                    onChangeText={(value) =>
                      updateState({
                        quantity: value,
                      })
                    }
                    keyboardType="number-pad"
                    value={quantity}
                    mainStyle={{flex: 0.3}}
                    labelStyle={styles.labelStyle}
                    placeholderTextColor={colors.textGreyB}
                    txtInputStyle={styles.textInputStyle}
                  />
                  <View style={{flex: 0.48}}>
                    <Text numberOfLines={1} style={styles.labelStyle}>
                      {strings.SELL_WHEN_OUT_STOCK}
                    </Text>
                    <ToggleSwitch
                      isOn={isSellWhenOutOfStock}
                      onColor={themeColors.primary_color}
                      offColor={colors.textGreyB}
                      size="medium"
                      onToggle={(isOn) =>
                        updateState({
                          isSellWhenOutOfStock: isOn ? true : false,
                        })
                      }
                      animationSpeed={400}
                    />
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: 1,
                  }}>
                  <TextInputWithUnderlineAndLabel
                    label={strings.MINIMUM_ORDER_COUNT}
                    placeholder={'1'}
                    keyboardType="number-pad"
                    onChangeText={(value) =>
                      updateState({
                        minimumOrderCount: value,
                      })
                    }
                    value={minimumOrderCount}
                    mainStyle={{flex: 0.48}}
                    labelStyle={styles.labelStyle}
                    placeholderTextColor={colors.textGreyB}
                    txtInputStyle={styles.textInputStyle}
                  />
                  <TextInputWithUnderlineAndLabel
                    label={strings.BATCH_COUNT}
                    placeholder={'1'}
                    onChangeText={(value) =>
                      updateState({
                        batchCount: value,
                      })
                    }
                    keyboardType="number-pad"
                    value={batchCount}
                    mainStyle={{flex: 0.28}}
                    labelStyle={styles.labelStyle}
                    placeholderTextColor={colors.textGreyB}
                    txtInputStyle={styles.textInputStyle}
                  />
                </View>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.labelStyle}>{strings.VARIANT_INFO}</Text>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                onPress={onMakeVariantSet}
                textStyle={styles.addProductBtn}
                marginTop={moderateScaleVertical(20)}
                marginBottom={moderateScaleVertical(20)}
                btnText={strings.MAKE_VARIENT_SET}
                containerStyle={{
                  height: moderateScale(30),
                  width: moderateScale(130),
                }}
                btnStyle={{borderRadius: 5}}
              />
            </View>
            {productVariants.map(renderProductVariants)}
            <View style={{height: 1, backgroundColor: colors.blackOpacity10}} />
            {!isEmpty(exisitingVariants) && (
              <View>
                <Text
                  style={{
                    ...styles.labelStyle,
                    marginTop: moderateScale(20),
                    color: colors.black,
                  }}>
                  {strings.APPLIED_VARIENT_SET}
                </Text>
                <FlatList
                  data={exisitingVariants}
                  renderItem={renderCreatedVariants}
                />
              </View>
            )}
            {!isEmpty(createdVariantSets) && (
              <View>
                <Text
                  style={{
                    ...styles.labelStyle,
                    marginTop: moderateScale(20),
                    color: colors.black,
                  }}>
                  {strings.NEW_VARIENT_SET}
                </Text>
                <FlatList
                  data={createdVariantSets}
                  renderItem={renderCreatedVariants}
                />
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              ...styles.mainViewStyle,
              paddingHorizontal: moderateScale(15),
            }}>
            <View
              style={{
                ...styles.flexRowStyle,
                marginTop: moderateScale(20),
              }}>
              <View
                style={{
                  flex: 0.45,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.textGreyB,
                  paddingBottom: 5,
                }}>
                <Text style={{...styles.labelStyle}}>
                  {strings.SELECT_ADDON_SET}
                </Text>
                <ModalDropdown
                  options={addons}
                  multipleSelect={true}
                  textStyle={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                  }}
                  defaultValue={isEmpty(addons) ? '' : addons[0].title}
                  onSelect={(idx, value) =>
                    onMultipleItemSelect(
                      value,
                      selectedAddons,
                      'selectedAddons',
                    )
                  }
                  renderRow={(rowData) => (
                    <TouchableHighlight
                      activeOpacity={0.6}
                      underlayColor="cornflowerblue"
                      style={{backgroundColor: colors.white}}>
                      {isEmpty(addons) ? (
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
                      ) : (
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Text
                            style={{
                              paddingVertical: 10,
                              marginHorizontal: 10,
                            }}>
                            {`${rowData.title}`}
                          </Text>
                          {isChecked(rowData, selectedAddons) && (
                            <Image source={imagePath.tick2} />
                          )}
                        </View>
                      )}
                    </TouchableHighlight>
                  )}
                  dropdownStyle={{
                    minWidth: moderateScale(100),
                    marginTop: moderateScale(10),
                    height: moderateScaleVertical(100),
                  }}
                  dropdownTextStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.regular,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    {isEmpty(selectedAddons) ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text>{strings.SELECT}</Text>
                        <Image
                          source={imagePath.icDropdown}
                          style={{marginLeft: moderateScale(65)}}
                        />
                      </View>
                    ) : (
                      <View style={{}}>
                        {selectedAddons.map(renderDropDownTitle)}
                      </View>
                    )}
                  </View>
                </ModalDropdown>
              </View>

              <View
                style={{
                  flex: 0.45,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.textGreyB,
                  overflow: 'hidden',
                }}>
                <Text style={{...styles.labelStyle}}>
                  {strings.UP_SELL_PRODUCTS}
                </Text>
                <ModalDropdown
                  options={otherProducts}
                  multipleSelect={true}
                  textStyle={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                  }}
                  defaultValue={
                    isEmpty(selectedUpSellProducts)
                      ? ''
                      : selectedUpSellProducts[0].title
                  }
                  onSelect={(idx, value) =>
                    onMultipleItemSelect(
                      value,
                      selectedUpSellProducts,
                      'selectedUpSellProducts',
                    )
                  }
                  renderRow={(rowData) => (
                    <TouchableHighlight
                      activeOpacity={0.6}
                      underlayColor="cornflowerblue"
                      style={{backgroundColor: colors.white}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            paddingVertical: 10,
                            marginHorizontal: 10,
                          }}>
                          {`${rowData?.primary?.title}`}
                        </Text>
                        {isChecked(rowData, selectedUpSellProducts) && (
                          <Image source={imagePath.tick2} />
                        )}
                      </View>
                    </TouchableHighlight>
                  )}
                  dropdownStyle={{
                    minWidth: moderateScale(100),
                    marginTop: moderateScale(10),
                    height: moderateScaleVertical(100),
                  }}
                  dropdownTextStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.regular,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    {isEmpty(selectedUpSellProducts) ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text>{strings.SELECT}</Text>
                        <Image
                          source={imagePath.icDropdown}
                          style={{marginLeft: moderateScale(65)}}
                        />
                      </View>
                    ) : (
                      <View>
                        {selectedUpSellProducts.map(renderDropDownTitle)}
                      </View>
                    )}
                  </View>
                </ModalDropdown>
              </View>
            </View>
            <View
              style={{
                ...styles.flexRowStyle,
                marginTop: moderateScale(10),
              }}>
              <View
                style={{
                  flex: 0.45,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.textGreyB,
                  overflow: 'hidden',
                }}>
                <Text style={{...styles.labelStyle}}>
                  {strings.CROSS_SELL_PRODUCTS}
                </Text>
                <ModalDropdown
                  options={otherProducts}
                  multipleSelect={true}
                  textStyle={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                  }}
                  defaultValue={
                    isEmpty(selectedCrossSellProducts)
                      ? ''
                      : selectedCrossSellProducts[0].title
                  }
                  onSelect={(idx, value) =>
                    onMultipleItemSelect(
                      value,
                      selectedCrossSellProducts,
                      'selectedCrossSellProducts',
                    )
                  }
                  renderRow={(rowData) => (
                    <TouchableHighlight
                      activeOpacity={0.6}
                      underlayColor="cornflowerblue"
                      style={{backgroundColor: colors.white}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            paddingVertical: 10,
                            marginHorizontal: 10,
                          }}>
                          {`${rowData?.primary?.title}`}
                        </Text>
                        {isChecked(rowData, selectedCrossSellProducts) && (
                          <Image source={imagePath.tick2} />
                        )}
                      </View>
                    </TouchableHighlight>
                  )}
                  dropdownStyle={{
                    minWidth: moderateScale(100),
                    marginTop: moderateScale(10),
                    height: moderateScaleVertical(100),
                  }}
                  dropdownTextStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.regular,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    {isEmpty(selectedCrossSellProducts) ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text>{strings.SELECT}</Text>
                        <Image
                          source={imagePath.icDropdown}
                          style={{marginLeft: moderateScale(65)}}
                        />
                      </View>
                    ) : (
                      <View style={{}}>
                        {selectedCrossSellProducts.map(renderDropDownTitle)}
                      </View>
                    )}
                  </View>
                </ModalDropdown>
              </View>

              <View
                style={{
                  flex: 0.45,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.textGreyB,
                  overflow: 'hidden',
                  paddingBottom: 5,
                }}>
                <Text style={{...styles.labelStyle}}>
                  {strings.RELATED_PRODUCTS}
                </Text>
                <ModalDropdown
                  options={otherProducts}
                  multipleSelect={true}
                  textStyle={{
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(12),
                  }}
                  defaultValue={
                    isEmpty(selectedRelatedProducts)
                      ? ''
                      : selectedRelatedProducts[0].title
                  }
                  onSelect={(idx, value) =>
                    onMultipleItemSelect(
                      value,
                      selectedRelatedProducts,
                      'selectedRelatedProducts',
                    )
                  }
                  renderRow={(rowData) => (
                    <TouchableHighlight
                      activeOpacity={0.6}
                      underlayColor="cornflowerblue"
                      style={{backgroundColor: colors.white}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={{
                            paddingVertical: 10,
                            marginHorizontal: 10,
                          }}>
                          {`${rowData?.primary?.title}`}
                        </Text>
                        {isChecked(rowData, selectedRelatedProducts) && (
                          <Image source={imagePath.tick2} />
                        )}
                      </View>
                    </TouchableHighlight>
                  )}
                  dropdownStyle={{
                    minWidth: moderateScale(100),
                    marginTop: moderateScale(10),
                    height: moderateScaleVertical(100),
                  }}
                  dropdownTextStyle={{
                    fontSize: textScale(12),
                    fontFamily: fontFamily.regular,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    {isEmpty(selectedRelatedProducts) ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text>{strings.SELECT}</Text>
                        <Image
                          source={imagePath.icDropdown}
                          style={{marginLeft: moderateScale(65)}}
                        />
                      </View>
                    ) : (
                      <View style={{}}>
                        {selectedRelatedProducts.map(renderDropDownTitle)}
                      </View>
                    )}
                  </View>
                </ModalDropdown>
              </View>
            </View>

            <View
              style={{
                ...styles.seoViewStyle,
                borderWidth: 0,
                marginTop: moderateScale(10),
              }}>
              <View
                style={{
                  ...styles.flexRowStyle,
                  alignItems: 'center',
                  marginTop: moderateScale(20),
                }}>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>{strings.NEW}</Text>
                  <ToggleSwitch
                    isOn={isNew}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) =>
                      updateState({
                        isNew: isOn ? true : false,
                      })
                    }
                    animationSpeed={400}
                  />
                </View>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>{strings.FEATURED}</Text>
                  <ToggleSwitch
                    isOn={isFeatured}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) =>
                      updateState({
                        isFeatured: isOn ? true : false,
                      })
                    }
                    animationSpeed={400}
                  />
                </View>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>{strings.INQUIRY_ONLY}</Text>
                  <ToggleSwitch
                    isOn={isInquiryOnly}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) =>
                      updateState({
                        isInquiryOnly: isOn ? true : false,
                      })
                    }
                    nimationSpeed={400}
                  />
                </View>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  marginTop: moderateScale(15),
                  marginBottom: moderateScale(35),
                  flexDirection: 'row',
                }}>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>
                    {strings.REQUIRES_PRESCRIPTION}
                  </Text>
                  <ToggleSwitch
                    isOn={isRequiresPrescription}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) =>
                      updateState({
                        isRequiresPrescription: isOn ? true : false,
                      })
                    }
                    animationSpeed={400}
                  />
                </View>
                <View style={{width: '32.50%'}}>
                  <Text style={styles.labelStyle}>
                    {strings.REQUIRES_LAST_MILE}
                  </Text>
                  <ToggleSwitch
                    isOn={isRequiresLastMileDelivery}
                    onColor={themeColors.primary_color}
                    offColor={colors.textGreyB}
                    size="medium"
                    onToggle={(isOn) =>
                      updateState({
                        isRequiresLastMileDelivery: isOn ? true : false,
                      })
                    }
                    animationSpeed={400}
                  />
                </View>
              </View>

              <View
                style={{
                  ...styles.flexRowStyle,
                  marginBottom: moderateScaleVertical(25),
                }}>
                <View
                  style={{
                    flex: 0.2,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.textGreyB,
                    paddingBottom: moderateScale(10),
                  }}>
                  <Text style={{...styles.labelStyle}}>{strings.LIVE}</Text>
                  <ModalDropDownComp
                    options={productStatus}
                    defaultValue={
                      isEmpty(selectedProductStatus)
                        ? 'Select'
                        : selectedProductStatus.title
                    }
                    _onSelect={(idx, value) =>
                      updateState({selectedProductStatus: value})
                    }
                    _renderButtonText={(rowData) => (
                      <Text>{rowData?.title}</Text>
                    )}
                    _renderRow={(rowData) => (
                      <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="cornflowerblue"
                        style={{backgroundColor: colors.white}}>
                        <Text
                          style={{
                            paddingVertical: 10,
                            marginHorizontal: 10,
                          }}>{`${rowData.title}`}</Text>
                      </TouchableHighlight>
                    )}
                    _renderRightComponent={() => (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                        }}>
                        <Image source={imagePath.icDropdown} />
                      </View>
                    )}
                    dropdownStyle={{
                      minWidth: moderateScale(100),
                      marginTop: moderateScale(10),
                      height: moderateScaleVertical(100),
                    }}
                  />
                </View>

                <View
                  style={{
                    flex: 0.25,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.textGreyB,
                  }}>
                  <Text style={{...styles.labelStyle}}>{strings.BRANDS}</Text>
                  <ModalDropDownComp
                    options={brands}
                    defaultValue={
                      isEmpty(selectedBrand) ? 'Select' : selectedBrand.title
                    }
                    _onSelect={(idx, value) =>
                      updateState({selectedBrand: value})
                    }
                    _renderButtonText={(rowData) => (
                      <Text>{rowData?.title}</Text>
                    )}
                    _renderRow={(rowData) => (
                      <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="cornflowerblue"
                        style={{backgroundColor: colors.white}}>
                        <Text
                          style={{
                            paddingVertical: 10,
                            marginHorizontal: 30,
                          }}>{`${rowData.title}`}</Text>
                      </TouchableHighlight>
                    )}
                    _renderRightComponent={() => (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                        }}>
                        <Image source={imagePath.icDropdown} />
                      </View>
                    )}
                    dropdownStyle={{
                      minWidth: moderateScale(100),
                      marginTop: moderateScale(10),
                      height: moderateScaleVertical(100),
                    }}
                  />
                </View>

                <View
                  style={{
                    flex: 0.3,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: colors.textGreyB,
                  }}>
                  <Text style={{...styles.labelStyle}}>
                    {strings.TAX_CATEGORY}
                  </Text>
                  <ModalDropdown
                    options={taxCategory}
                    textStyle={{
                      fontFamily: fontFamily.regular,
                      fontSize: textScale(12),
                    }}
                    defaultValue={'Select'}
                    onSelect={(idx, value) =>
                      updateState({selectedTaxCategory: value})
                    }
                    renderButtonText={(rowData) => (
                      <Text>{rowData?.title}</Text>
                    )}
                    renderRow={(rowData) => (
                      <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="cornflowerblue"
                        style={{backgroundColor: colors.white}}>
                        <Text
                          style={{
                            paddingVertical: 10,
                            marginHorizontal: 10,
                          }}>{`${rowData.title}`}</Text>
                      </TouchableHighlight>
                    )}
                    dropdownStyle={{
                      minWidth: moderateScale(100),
                      marginTop: moderateScale(10),
                      height: moderateScaleVertical(80),
                    }}
                    dropdownTextStyle={{
                      fontSize: textScale(12),
                      fontFamily: fontFamily.regular,
                    }}
                    renderRightComponent={() => (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                        }}>
                        <Image source={imagePath.icDropdown} style={{}} />
                      </View>
                    )}
                  />
                </View>
              </View>
              <View
                style={{
                  ...styles.flexRowStyle,
                }}>
                <TextInputWithUnderlineAndLabel
                  label={strings.DELAY_HOURS}
                  labelStyle={styles.labelStyle}
                  placeholder={strings.HRS}
                  onChangeText={(value) => updateState({delayHrs: value})}
                  value={delayHrs}
                  mainStyle={{flex: 0.45}}
                  placeholderTextColor={colors.textGreyB}
                  txtInputStyle={styles.textInputStyle}
                />
                <TextInputWithUnderlineAndLabel
                  label={strings.DELAY_MINUTES}
                  placeholder={strings.MINUTES}
                  onChangeText={(value) => updateState({delayMinutes: value})}
                  value={delayMinutes}
                  mainStyle={{flex: 0.45}}
                  labelStyle={styles.labelStyle}
                  placeholderTextColor={colors.textGreyB}
                  txtInputStyle={styles.textInputStyle}
                />
              </View>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
      <ModalView
        isVisible={isImagePickerModal}
        onClose={onCloseModal}
        mainViewStyle={{
          backgroundColor: colors.white,
          paddingTop: moderateScaleVertical(10),
          maxHeight: moderateScale(height),
        }}
        modalMainContent={mainViewModal}
        topCustomComponent={topCustomComponent}
        leftIcon={false}
        rightIcon={imagePath.ic_cross}
        rightIconStyle={{tintColor: colors.black}}
      />
      <ActionSheet
        ref={actionSheet}
        // title={'Choose one option'}
        options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
        cancelButtonIndex={2}
        destructiveButtonIndex={2}
        onPress={(index) => cameraHandle(index)}
      />
    </WrapperContainer>
  );
};

export default RoyoAddProduct;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  mainViewStyle: {
    backgroundColor: colors.blackOpacity05,
    paddingBottom: moderateScale(20),
  },
  stepBarView: {
    height: moderateScale(45),
    backgroundColor: colors.blackOpacity10,
    paddingHorizontal: moderateScale(15),
    flexDirection: 'row',
    alignItems: 'center',
  },

  labelStyle: {
    fontFamily: fontFamily.bold,
    color: colors.blackOpacity43,
    fontSize: textScale(12),
    marginBottom: moderateScale(10),
  },
  textInputStyle: {
    fontFamily: fontFamily.medium,
    color: colors.black,
    fontSize: textScale(12),
  },
  seoViewStyle: {
    borderWidth: 0.7,
    borderColor: colors.blackOpacity20,
    borderRadius: moderateScale(5),
    backgroundColor: colors.white,
    padding: moderateScale(10),
  },
  flexRowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addProductBtn: {
    textTransform: 'none',
  },
  variantTypeTxt: {
    fontSize: textScale(11),
    fontFamily: fontFamily.regular,
    marginLeft: moderateScale(5),
  },
  variantName: {
    fontSize: textScale(12),
    fontFamily: fontFamily.bold,
  },
  imageOrderStyle: {
    height: width / 4,
    width: '94%',
    borderRadius: 5,
    marginBottom: moderateScaleVertical(10),
    marginLeft: moderateScale(6),
  },
  viewOverImage: {
    height: width / 5,
    width: '95%',
    borderRadius: 5,
  },
  noDataFound: {
    width: '100%',
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
