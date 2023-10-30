import { cloneDeep, isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  I18nManager,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { useSelector } from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {
  cameraHandler,
  tokenConverterPlusCurrencyNumberFormater,
} from '../../utils/commonFunction';
import { getImageUrl, showError } from '../../utils/helperFunctions';
// import OrderCardComponent from './OrderCardComponent';
import { useDarkMode } from 'react-native-dynamic';
import DropDownPicker from 'react-native-dropdown-picker';
import FastImage from 'react-native-fast-image';
import { MyDarkTheme } from '../../styles/theme';
import stylesFunc from './styles';
import AddonModal from '../ProductDetail/AddonModal';
import Modal from 'react-native-modal';

export default function ReplaceOrder({ navigation, route }) {
  let actionSheet = useRef();
  const { selectProductForRetrun, reasons } = route?.params;
  // console.log(route, 'daskjfljkdsf');
  const {
    appData,
    currencies,
    languages,
    appStyle,
    themeColors,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
  const userData = useSelector((state) => state?.auth?.userData);
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const [state, setState] = useState({
    isLoading: false,
    returnText: '',
    imageArray: [],
    returnReasons: reasons ? reasons : [],
    selectedReason: null,
    addonSet: [],
    isVisibleAddonModal,
    productDetailData: null,
    addonSetData: [],
    variantSet: [],
    typeId: null,
    selectedVariant: null,
    btnLoader: false,
    productPriceData: null,
    productQuantityForCart: 1,
  });
  const {
    isLoading,
    imageArray,
    returnText,
    returnReasons,
    selectedReason,
    addonSet,
    isVisibleAddonModal,
    productDetailData,
    addonSetData,
    variantSet,
    selectedVariant,
    btnLoader,
    productPriceData,
    productQuantityForCart,
  } = state;

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  const commonStyles = commonStylesFun({ fontFamily });

  useEffect(() => {
    getProductDetailByProductId();
  }, []);

  const getProductDetailByProductId = () => {
    updateState({ isLoading: true });
    actions
      .getProductDetailByProductId(
        `/${selectProductForRetrun?.product_id}`,
        {},
        {
          code: appData.profile.code,
          currency: currencies.primary_currency.id,
          language: languages.primary_language.id,
        },
      )
      .then((res) => {
        console.log(res, 'response----> product detail');
        updateState({
          isLoading: false,
          productDetailData: res?.data?.products,
          addonSet: res?.data?.products?.add_on,
          variantSet: res?.data?.products?.variant_set,
          productDetailData: res?.data?.products,
          typeId: res.data.products.category.category_detail.type_id,
          productPriceData: res.data.products.variant[0],
          productQuantityForCart: !!res.data.products?.minimum_order_count
            ? Number(res.data.products?.minimum_order_count)
            : 1,
        });
      })
      .catch((error) => {
        updateState({
          isLoading: false,
        });
        console.log(error, 'error----> product detail');
      });
  };

  /***********Remove Image from rating */
  const _removeImageFromList = (selectdImage) => {
    if (selectdImage?.ids) {
      let copyArrayImages = cloneDeep(imageArray);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.ids !== selectdImage?.ids,
      );
      updateState({
        imageArray: copyArrayImages,
      });
    }
  };

  //this function use for open actionsheet
  const showActionSheet = () => {
    {
      !!userData?.auth_token
        ? imageArray.length == 5
          ? showError(strings.MAXIMUM_PHOTO_SELECTION_LIMIT_REACHED)
          : actionSheet.current.show()
        : null;
    }
  };

  // this funtion use for camera handle
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
          console.log(res, 'res?.data');
          updateState({ isLoading: true });
          if (res && (res?.sourceURL || res?.path)) {
            console.log(res, 'response');
            let file = {
              image_id: Math.random(),
              name: res?.filename ? res?.filename : 'unknown',
              type: res?.mime,
              uri:
                res?.sourceURL !== null && res?.sourceURL
                  ? res?.sourceURL
                  : `file://${res?.path}`,
            };
            console.log(file, 'filefilefilefilefile');
            let formdata = new FormData();
            formdata.append('images[]', file);
            actions
              .uploadReturnOrderImage(formdata, {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                'Content-Type': 'multipart/form-data',
              })
              .then((res) => {
                console.log(res, 'res>>>>>>uploadReturnOrderImage');
                if (res && res.status == 'Success') {
                  updateState({ isLoading: false });
                  updateState({
                    imageArray: imageArray.length
                      ? [...imageArray, ...res?.data]
                      : res?.data,
                  });
                } else {
                  updateState({ isLoading: false });
                  showError(res?.message);
                }
              })
              .catch(errorMethod);
          } else {
            updateState({ isLoading: false });
          }
        })
        .catch((err) => { });
    }
  };

  const _submitReplaceOrder = () => {
    let formdata = new FormData();
    formdata.append('order_vendor_product_id', selectProductForRetrun?.id);
    formdata.append('coments', returnText);
    formdata.append(
      'reason',
      selectedReason ? selectedReason.value : returnReasons[0]?.label,
    );

    formdata.append(
      'product_a_price',
      Number(productPriceData?.price) * Number(productQuantityForCart) +
      Number(getPriceOfSelectedAddons()),
    );

    if (imageArray.length) {
      imageArray.forEach((element) => {
        formdata.append('add_files[]', element?.name);
      });
    }

    if (!isEmpty(addonSetData)) {
      addonSetData.map((i, inx) => {
        i.setoptions.map((j, jnx) => {
          if (j?.value == true) {
            formdata.append('addon_ids[]', j?.addon_id);
            formdata.append('addon_options[]', j?.id);
          }
        });
      });
    }

    console.log(formdata, 'formdata....formdata');
    updateState({ isLoading: true });
    actions
      .submitProductForReplacement(formdata, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        'Content-Type': 'multipart/form-data',
      })
      .then((res) => {
        console.log(res, 'res....res...res');
        updateState({ isLoading: false });
        navigation.goBack();
        route?.params?.getOrderDetail();
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({ isLoading: false });
    showError(error?.message || error?.error);
  };

  const updateReason = (item) => {
    updateState({ selectedReason: item });
  };

  const onChangeAddons = () => {
    updateState({ isVisibleAddonModal: true });
  };

  const renderVariantSet = ({ item, index }) => {
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

  const variantSetValue = (item) => {
    const { options, type, variant_type_id } = item;
    if (type == 1) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => updateState({ selectedVariant: item })}
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
        </View>
      );
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() => updateState({ selectedVariant: item })}
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

  const onSelect = () => {
    if (variantSet.length) {
      let variantSetData = variantSet
        .map((i, inx) => {
          let find = i.options.filter((x) => x.value);
          if (find.length) {
            return {
              variant_id: find[0].variant_id,
              optionId: find[0].id,
            };
          }
        })
        .filter((x) => x != undefined);
      console.log(variantSetData, 'variantSetData callback');
      if (variantSetData.length) {
        updateState({ btnLoader: true });
        getProductDetailBasedOnFilter(variantSetData);
      } else {
        getProductDetailByProductId();
      }
    }
  };

  //Get Product detail based on varint selection
  const getProductDetailBasedOnFilter = (variantSetData) => {
    let data = {};
    data['variants'] = variantSetData.map((i) => i.variant_id);
    data['options'] = variantSetData.map((i) => i.optionId);
    actions
      .getProductDetailByVariants(`/${productDetailData.sku}`, data, {
        code: appData.profile.code,
        currency: currencies.primary_currency.id,
        language: languages.primary_language.id,
      })
      .then((res) => {
        console.log(res.data, 'res.data by vendor id ');
        updateState({
          isLoading: false,
          selectedVariant: null,
          btnLoader: false,
          productDetailData: res?.data,
          productPriceData: {
            multiplier: res.data.multiplier,
            price: res.data.price,
          },
        });
      })
      .catch(errorMethod);
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
        onBackdropPress={() => updateState({ selectedVariant: null })}>
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
              onPress={() => updateState({ selectedVariant: null })}>
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
            indicator={btnLoader}
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

  const radioButtonView = (options) => {
    return (
      <Modal
        key={'1'}
        isVisible
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}
        onBackdropPress={() => updateState({ selectedVariant: null })}>
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
              onPress={() => updateState({ selectedVariant: null })}>
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
            indicator={btnLoader}
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

  const showAllVariants = () => {
    return (
      <View style={{ marginBottom: moderateScaleVertical(16) }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          numColumns={2}
          data={variantSet || []}
          renderItem={renderVariantSet}
          keyExtractor={(item) => item?.variant_type_id.toString()}
        />
      </View>
    );
  };

  const selectSpecificOptions = (options, i, inx) => {
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

  const getPriceOfSelectedAddons = () => {
    let price = 0;

    addonSetData.map((i, inx) => {
      i.setoptions.map((j, jnx) => {
        if (j?.value == true) {
          price = Number(price) + Number(j?.price);
        }
      });
    });

    return price;
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={'Replace Product'}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      <ScrollView>
        <View
          style={{
            marginHorizontal: moderateScale(20),
            marginTop: moderateScaleVertical(20),
            marginBottom: moderateScaleVertical(20),
          }}>
          {/* star View */}
          <View style={[styles.starViewStyle]}>
            <Text
              style={{
                fontSize: moderateScale(14),
                fontFamily: fontFamily.medium,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyJ,
              }}>
              {strings.CHOOSE_REASON_TO_REPLACE_PRODUCT}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: moderateScaleVertical(20),
              marginTop: moderateScaleVertical(10),
            }}>
            <View style={styles.cartItemImage}>
              <FastImage
                source={
                  selectProductForRetrun?.image != '' &&
                    selectProductForRetrun?.image != null
                    ? {
                      uri: getImageUrl(
                        selectProductForRetrun?.image?.proxy_url,
                        selectProductForRetrun?.image?.image_path,
                        '300/300',
                      ),
                      priority: FastImage.priority.high,
                    }
                    : imagePath.patternOne
                }
                style={styles.imageStyle}
              />
            </View>
            <View style={{ marginLeft: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.priceItemLabel2,
                    {
                      opacity: 0.8,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGrey,
                    },
                  ]}>
                  {selectProductForRetrun?.product_name}
                </Text>

                <Text
                  style={{
                    ...styles.productPrice,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {'    '}
                  {tokenConverterPlusCurrencyNumberFormater(
                    Number(productPriceData?.price) *
                    Number(productQuantityForCart) +
                    Number(getPriceOfSelectedAddons()),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}
                </Text>
              </View>

              {selectProductForRetrun?.quantity && (
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGrey,
                    }}>
                    {strings.QTY}
                  </Text>
                  <Text style={styles.cartItemWeight}>
                    {selectProductForRetrun?.quantity}
                  </Text>
                </View>
              )}
              {!isEmpty(addonSet) && (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: moderateScaleVertical(6),
                  }}
                  onPress={onChangeAddons}>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      marginRight: moderateScale(6),
                      fontSize: textScale(12),
                    }}>
                    Edit Addons
                  </Text>
                  <Image source={imagePath.edit1Royo} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {!isEmpty(variantSet) ? showAllVariants() : null}

          {/* Upload image */}
          <View style={{ marginTop: moderateScaleVertical(10) }}>
            <Text
              style={{
                ...styles.uploadImage,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyD,
              }}>
              {strings.UPLOAD_IMAGE}
            </Text>
            <View
              style={{
                marginTop: moderateScaleVertical(10),
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <View
                style={{
                  marginRight: 5,
                  marginBottom: moderateScaleVertical(10),
                }}>
                <TouchableOpacity
                  onPress={showActionSheet}
                  style={[styles.viewOverImage2, { borderStyle: 'dashed' }]}>
                  <Image
                    source={imagePath.icCamIcon}
                    style={{ tintColor: colors.themeColor }}
                  />
                </TouchableOpacity>
              </View>

              {imageArray && imageArray.length
                ? imageArray.map((i, inx) => {
                  return (
                    <ImageBackground
                      key={inx}
                      source={{
                        uri: i.img_path,
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
            </View>

            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <Text
                style={{
                  fontSize: moderateScale(14),
                  fontFamily: fontFamily.medium,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyJ,
                }}>
                {strings.REASON_FOR_REPLACEMENT}
              </Text>
            </View>

            <DropDownPicker
              items={returnReasons}
              defaultValue={returnReasons[0]?.label || returnReasons[0]?.name}
              containerStyle={{ height: 40, marginTop: moderateScaleVertical(5) }}
              style={{
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : '#fafafa',
                zIndex: 5000,
                // marginHorizontal: moderateScale(20),
                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              }}
              itemStyle={{
                justifyContent: 'flex-start',
                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              }}
              labelStyle={isDarkMode && { color: MyDarkTheme.colors.text }}
              zIndex={5000}
              dropDownStyle={{
                backgroundColor: isDarkMode
                  ? MyDarkTheme.colors.lightDark
                  : '#fafafa',
                height: 150,
                width: width - moderateScale(40),
                alignSelf: 'center',
              }}
              onChangeItem={(item) => updateReason(item)}
            />

            {/* Message Container    */}
            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <Text
                style={{
                  ...styles.uploadImage,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyD,
                }}>
                {strings.COMMENTSOPTIONAL}
              </Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={{
                    ...styles.textInputStyle,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyJ,
                  }}
                  multiline={true}
                  value={returnText}
                  onChangeText={(text) => updateState({ returnText: text })}
                  placeholderTextColor={
                    isDarkMode ? MyDarkTheme.colors.text : colors.textGreyJ
                  }
                />
              </View>
            </View>

            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={styles.textStyle}
                onPress={_submitReplaceOrder}
                btnText={strings.REPLACE}
              />
            </View>
          </View>
        </View>
        <AddonModal
          productdetail={productDetailData}
          isVisible={isVisibleAddonModal}
          onClose={() => updateState({ isVisibleAddonModal: false })}
          // onPress={(data) => alert('123')}
          addonSet={addonSet}
          redirectedFrom={'replaceOrder'}
          updateAddonOnReplaceProduct={(data) =>
            updateState({
              addonSetData: data,
            })
          }
        />
        <ActionSheet
          ref={actionSheet}
          options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={(index) => cameraHandle(index)}
        />
      </ScrollView>
    </WrapperContainer>
  );
}
