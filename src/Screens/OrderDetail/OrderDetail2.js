import {useFocusEffect} from '@react-navigation/native';
import {cloneDeep} from 'lodash';
import LottieView from 'lottie-react-native';
import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import HeaderWithFilters from '../../Components/HeaderWithFilters';
import {
  loaderFive,
  loaderOne,
} from '../../Components/Loaders/AnimatedLoaderFiles';
import StepIndicators from '../../Components/StepIndicator';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../../utils/commonFunction';
import {getImageUrl, showError} from '../../utils/helperFunctions';
import ListEmptyCart from './ListEmptyCart';
import stylesFunc from './styles';

const {height, width} = Dimensions.get('window');

export default function OrderDetail({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  console.log(paramData, 'paramData==>');

  const [state, setState] = useState({
    isLoading: true,
    cartItems: [],
    cartData: {},
    selectedPayment: null,
    labels: [
      strings.ACCEPTED,
      strings.PROCESSING,
      strings.OUT_FOR_DELIVERY,
      strings.DELIVERED,
    ],
    // labels: [
    //   {lable: 'Accepted', orderDate: '12/12/1233'},
    //   {lable: 'Processing', orderDate: ''},
    //   {lable: 'Out For Delivery', orderDate: ''},
    //   {lable: 'Delivered', orderDate: ''},
    // ],
    currentPosition: null,
  });
  const {isLoading, cartItems, cartData, labels, currentPosition} = state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state.initBoot,
  );

  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};

  console.log(languages, 'i am here>>>>>>');

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  useFocusEffect(
    React.useCallback(() => {
      updateState({isLoading: true});
      if (!!userData?.auth_token) {
        _getOrderDetailScreen();
      } else {
        showError(strings.UNAUTHORIZED_MESSAGE);
      }
    }, [currencies, languages, paramData]),
  );

  /*********Get order detail screen********* */
  const _getOrderDetailScreen = () => {
    let data = {};
    data['order_id'] = paramData?.orderId;
    if (paramData?.selectedVendor) {
      data['vendor_id'] = paramData?.selectedVendor.id;
    }

    //
    updateState({isLoading: true});
    actions
      .getOrderDetail(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'resorder detail');
        updateState({isLoading: false});
        if (res?.data) {
          updateState({
            cartItems: res.data.vendors,
            cartData: res.data,
            isLoading: false,
            currentPosition: paramData?.orderStatus
              ? labels.indexOf(paramData?.orderStatus?.current_status?.title)
              : null,
          });
        }
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const onStarRatingPress = (i, rating) => {
    // updateState({isLoading: true});
    _giveRatingToProduct(i, rating);
  };

  const _giveRatingToProduct = (productDetail, rating) => {
    let data = {};
    data['order_vendor_product_id'] = productDetail?.id;
    data['order_id'] = productDetail?.order_id;
    data['product_id'] = productDetail?.product_id;
    data['rating'] = rating;
    data['review'] = productDetail?.product_rating?.review
      ? productDetail?.product_rating?.review
      : '';
    // data['vendor_id'] = productDetail.vendor_id;

    actions
      .giveRating(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      })
      .then((res) => {
        let cloned_cartItems = cloneDeep(cartItems);
        updateState({
          isLoading: false,
          cartItems: (cloned_cartItems = cloned_cartItems.map((itm, inx) => {
            itm.products.map((j, jnx) => {
              if (j?.product_id == productDetail?.product_id) {
                j.product_rating = res.data;
                return j;
              } else {
                return j;
              }
            });
            return itm;
          })),
        });
      })
      .catch(errorMethod);
  };

  //give review and update the rate
  const rateYourOrder = (item) => {
    navigation.navigate(navigationStrings.RATEORDER, {item});
  };

  const _renderItem = ({item, index}) => {
    // return <OffersCard />;
    let {itemCount} = state;
    return (
      <View
        style={{
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
          marginHorizontal: moderateScale(10),
          marginVertical: moderateScale(10),
        }}>
        <View
          style={
            isDarkMode
              ? [
                  styles.vendorView,
                  {backgroundColor: MyDarkTheme.colors.background},
                ]
              : styles.vendorView
          }>
          <Text
            style={
              isDarkMode
                ? [styles.vendorText, {color: MyDarkTheme.colors.text}]
                : styles.vendorText
            }>
            {item?.vendor_name}
          </Text>
        </View>
        {item?.products.length
          ? item?.products.map((i, inx) => {
              if (item?.vendor_id == i?.vendor_id) {
                return (
                  <View key={inx}>
                    <View
                      style={
                        isDarkMode
                          ? [
                              styles.cartItemMainContainer,
                              {backgroundColor: MyDarkTheme.colors.background},
                            ]
                          : [styles.cartItemMainContainer]
                      }>
                      <View
                        style={
                          isDarkMode
                            ? [
                                styles.cartItemImage,
                                {
                                  backgroundColor:
                                    MyDarkTheme.colors.background,
                                },
                              ]
                            : styles.cartItemImage
                        }>
                        <FastImage
                          source={
                            i?.image_path
                              ? {
                                  uri: getImageUrl(
                                    i?.image_path?.image_fit,
                                    i?.image_path?.image_path,
                                    '300/300',
                                  ),
                                  priority: FastImage.priority.high,
                                }
                              : ''
                          }
                          style={styles.imageStyle}
                        />
                      </View>

                      <View style={styles.cartItemDetailsCon}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              flex: 0.7,
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                            }}>
                            <Text
                              numberOfLines={2}
                              style={
                                isDarkMode
                                  ? [
                                      styles.priceItemLabel2,
                                      {
                                        opacity: 0.8,
                                        color: MyDarkTheme.colors.text,
                                      },
                                    ]
                                  : [styles.priceItemLabel2, {opacity: 0.8}]
                              }>
                              {i?.translation?.title}
                            </Text>
                            {i?.variant_options.length
                              ? i?.variant_options.map((j, jnx) => {
                                  return (
                                    <View style={{flexDirection: 'row'}}>
                                      <Text
                                        style={
                                          isDarkMode
                                            ? [
                                                styles.cartItemWeight2,
                                                {
                                                  color:
                                                    MyDarkTheme.colors.text,
                                                },
                                              ]
                                            : styles.cartItemWeight2
                                        }
                                        numberOfLines={1}>
                                        {j.title}{' '}
                                      </Text>
                                      <Text
                                        style={
                                          isDarkMode
                                            ? [
                                                styles.cartItemWeight2,
                                                {
                                                  color:
                                                    MyDarkTheme.colors.text,
                                                },
                                              ]
                                            : styles.cartItemWeight2
                                        }
                                        numberOfLines={
                                          1
                                        }>{`(${j.option})`}</Text>
                                    </View>
                                  );
                                })
                              : null}
                          </View>

                          <View
                            style={{
                              flex: 0.5,
                              justifyContent: 'center',
                              alignItems: 'flex-end',
                            }}>
                            <Text style={styles.cartItemPrice}>
                              {tokenConverterPlusCurrencyNumberFormater(
                                Number(i?.price),
                                digit_after_decimal,
                                additional_preferences,
                                currencies?.primary_currency?.symbol,
                              )}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View style={{flex: 0.5, justifyContent: 'center'}}>
                            {i?.quantity && (
                              <View style={{flexDirection: 'row'}}>
                                <Text
                                  style={
                                    isDarkMode
                                      ? {
                                          color: MyDarkTheme.colors.text,
                                          fontSize: textScale(14),
                                        }
                                      : {
                                          color: colors.textGrey,
                                          fontSize: textScale(14),
                                        }
                                  }>
                                  {strings.QTY}
                                </Text>
                                <Text style={styles.cartItemWeight}>
                                  {i?.quantity}
                                </Text>
                              </View>
                            )}
                            {!!i?.product_addons.length && (
                              <View>
                                <Text style={styles.cartItemWeight2}>
                                  {strings.EXTRA}
                                </Text>
                              </View>
                            )}
                            {i?.product_addons.length
                              ? i?.product_addons.map((j, jnx) => {
                                  return (
                                    <View>
                                      <Text
                                        style={styles.cartItemWeight2}
                                        numberOfLines={1}>
                                        {j.addon_title}{' '}
                                      </Text>
                                      <View style={{flexDirection: 'row'}}>
                                        <Text
                                          style={styles.cartItemWeight2}
                                          numberOfLines={
                                            1
                                          }>{`(${j.option_title})`}</Text>
                                        <Text
                                          style={styles.cartItemWeight2}
                                          numberOfLines={1}>
                                          {tokenConverterPlusCurrencyNumberFormater(
                                            Number(j?.price),
                                            digit_after_decimal,
                                            additional_preferences,
                                            currencies?.primary_currency
                                              ?.symbol,
                                          )}
                                        </Text>
                                      </View>
                                    </View>
                                  );
                                })
                              : null}
                          </View>
                        </View>
                      </View>
                    </View>

                    {!!paramData?.showRating ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingBottom: moderateScaleVertical(5),
                          paddingHorizontal: moderateScale(10),
                        }}>
                        <StarRating
                          disabled={false}
                          maxStars={5}
                          rating={Number(i?.product_rating?.rating)}
                          // selectedStar={(rating) =>
                          //   onStarRatingPress(i, rating)
                          // }
                          fullStarColor={colors.ORANGE}
                          starSize={15}
                        />
                        {i?.product_rating?.rating ? (
                          <View>
                            <Text
                              onPress={() => rateYourOrder(i)}
                              style={[
                                styles.writeAReview,
                                {color: themeColors.primary_color},
                              ]}>
                              {strings.WRITE_A_REVIEW}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    ) : null}

                    <View style={styles.dashedLine} />
                  </View>
                );
              } else {
                null;
              }
            })
          : null}

        {/* offerview */}
        {/* <TouchableOpacity
          disabled={item?.couponData ? true : false}
          onPress={() => _getAllOffers(item.vendor, cartData)}
          style={styles.offersViewB}>
          {item?.couponData ? (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{flex: 0.7, flexDirection: 'row', alignItems: 'center'}}>
                <Image source={imagePath.percent} />
                <Text
                  numberOfLines={1}
                  style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                  {`${strings.CODE} ${item?.couponData?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{flex: 0.3, alignItems: 'flex-end'}}>
                <Text
                  onPress={() => _removeCoupon(item, cartData)}
                  style={[styles.removeCoupon, {color: colors.cartItemPrice}]}>
                  {strings.REMOVE}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={imagePath.percent} />
              <Text
                style={[styles.viewOffers, {marginLeft: moderateScale(10)}]}>
                {strings.APPLY_PROMO_CODE}
              </Text>
            </View>
          )}
        </TouchableOpacity> */}
        {!!Number(item?.discount_amount) && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.DISCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`- ${tokenConverterPlusCurrencyNumberFormater(
              Number(item?.discount_amount ? item?.discount_amount : 0),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
          </View>
        )}
        {!!Number(item?.delivery_fee) && (
          <View style={styles.itemPriceDiscountTaxView}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.DELIVERY_CHARGES}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`${tokenConverterPlusCurrencyNumberFormater(
              Number(item?.delivery_fee ? item?.delivery_fee : 0),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
          </View>
        )}
        <View style={styles.itemPriceDiscountTaxView}>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel2
            }>
            {strings.AMOUNT}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel2
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(item?.payable_amount ? item?.payable_amount : 0),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      </View>
    );
  };
  const orderAmountDetail = () => {
    return (
      <View style={styles.priceSection}>
        {/* <Text style={styles.price}>{strings.PRICE}</Text> */}
        <View
          style={[
            styles.bottomTabLableValue,
            // {marginTop: moderateScaleVertical(10)},
          ]}>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel
            }>
            {strings.SUBTOTAL}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.total_amount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
        {!!cartData?.wallet_amount_used && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.WALLET}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(
                cartData?.wallet_amount_used ? cartData?.wallet_amount_used : 0,
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
          </View>
        )}
        {!!cartData?.loyalty_amount_saved && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.LOYALTY}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(
                cartData?.loyalty_amount_saved
                  ? cartData?.loyalty_amount_saved
                  : 0,
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
          </View>
        )}

        {!!cartData?.total_discount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.TOTAL_DISCOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.total_discount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
          </View>
        )}
        {!!cartData?.taxable_amount && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {strings.TAX_AMOUNT}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                      styles.priceItemLabel,
                      {
                        color: MyDarkTheme.colors.text,
                        fontSize: textScale(14),
                      },
                    ]
                  : styles.priceItemLabel
              }>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.taxable_amount ? cartData?.taxable_amount : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </View>
        )}

        <View style={styles.amountPayable}>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel2
            }>
            {strings.AMOUNT_PAYABLE}
          </Text>
          <Text
            style={
              isDarkMode
                ? [
                    styles.priceItemLabel2,
                    {
                      color: MyDarkTheme.colors.text,
                      fontSize: textScale(14),
                    },
                  ]
                : styles.priceItemLabel2
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.payable_amount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      </View>
    );
  };

  const getFooter = () => {
    return (
      <>
        {/* Price section */}
        {!!paramData?.fromVendorApp ? null : orderAmountDetail()}
        {!!cartData?.address ? null : orderAmountDetail()}
        {/* Add instruction */}

        <View style={{height: moderateScaleVertical(20)}} />

        <View style={{height: 2}} />
        {/* select payment method */}
        <TouchableOpacity
          disabled={true}
          style={
            isDarkMode
              ? [
                  styles.paymentMainView,
                  {
                    justifyContent: 'space-between',
                    backgroundColor: MyDarkTheme.colors.lightDark,
                  },
                ]
              : [styles.paymentMainView, {justifyContent: 'space-between'}]
          }>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={isDarkMode && {tintColor: MyDarkTheme.colors.text}}
              source={imagePath.paymentMethod}
            />
            <Text
              style={
                isDarkMode
                  ? [
                      styles.selectedMethod,
                      {
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                  : styles.selectedMethod
              }>
              {cartData?.payment_option?.title || ''}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{height: moderateScaleVertical(40)}}></View>
      </>
    );
  };

  const getHeader = () => {
    let getUserImage = getImageUrl(
      cartData?.user_image?.image_fit,
      cartData?.user_image?.image_path,
      '500/500',
    );

    return (
      <>
        {paramData?.orderStatus?.current_status?.title == 'Placed' && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: moderateScaleVertical(10),
            }}>
            {/* <BallIndicator
              size={35}
              count={10}
              color={themeColors.primary_color}
            /> */}

            <LottieView
              source={loaderFive}
              autoPlay
              loop
              style={{
                height: moderateScaleVertical(100),
                width: moderateScale(100),
              }}
              colorFilters={[
                {
                  keypath: 'right sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'right sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left sand 2',
                  color: themeColors.primary_color,
                },

                {
                  keypath: 'right top sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'left top sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top left sand 1',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top left sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'right fallin sand',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'bottom cyrcle 12',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'bottom cyrcle 11',
                  color: themeColors.primary_color,
                },

                {
                  keypath: 'left fallin sand 2',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top right sand 1',
                  color: themeColors.primary_color,
                },
                {
                  keypath: 'top right sand 1',
                  color: themeColors.primary_color,
                },

                // top right sand 1
              ]}
            />
            <Text style={styles.waitToAccept}>{strings.WAITINGTOACCEPT}</Text>
          </View>
        )}
        {paramData?.orderStatus &&
          paramData?.orderStatus?.current_status?.title != 'Rejected' &&
          paramData?.orderStatus?.current_status?.title != 'Placed' && (
            <View
              style={{
                marginVertical: moderateScaleVertical(20),
              }}>
              <StepIndicators
                labels={labels}
                currentPosition={currentPosition}
                themeColor={themeColors}
              />
            </View>
          )}

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: moderateScale(10),
            }}>
            {/* {!!paramData?.fromVendorApp && (
              <Image
                source={{
                  uri: cartData?.user_image ? getUserImage : getdummyUser,
                }}
                style={{
                  height: moderateScale(48),
                  width: moderateScale(48),
                  borderRadius: moderateScale(48 / 2),
                }}
              />
            )} */}
            <View style={{marginLeft: moderateScale(10)}}>
              {!!paramData?.fromVendorApp && (
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.userName,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.userName
                  }>
                  {cartData?.user_name}
                </Text>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: moderateScaleVertical(10),
                }}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.orderLableStyle,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.orderLableStyle
                  }>{`#${cartData?.order_number}  |  `}</Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.orderLableStyle,
                          {
                            color: MyDarkTheme.colors.text,
                          },
                        ]
                      : styles.orderLableStyle
                  }>
                  {cartData?.created_date}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delivery Location */}
        <View style={[styles.topLable, {marginTop: moderateScale(10)}]}>
          <View
            style={{flex: 0.35, flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{tintColor: colors.black}}
              source={imagePath.locationGreen}
            />
            <Text numberOfLines={1} style={styles.deliveryLocationAndTime}>
              {strings.DELIVERYAT}
            </Text>
          </View>
          <View
            style={{
              flex: 0.7,
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View>
              <Text numberOfLines={1} style={styles.address}>
                {cartData?.address?.address}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoading}>
      <HeaderWithFilters
        leftIcon={
          appStyle?.homePageLayout === 2 ? imagePath.backArrow : imagePath.back
        }
        centerTitle={`Order #${
          cartData?.order_number ? cartData?.order_number : ''
        }`}
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <View
        style={
          isDarkMode
            ? [
                styles.mainComponent,
                {backgroundColor: MyDarkTheme.colors.background},
              ]
            : styles.mainComponent
        }>
        <FlatList
          data={cartItems}
          extraData={cartItems}
          ListHeaderComponent={cartItems.length ? getHeader() : null}
          ListFooterComponent={cartItems.length ? getFooter() : null}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItem}
          ListEmptyComponent={<ListEmptyCart isLoading={isLoading} />}
          style={{flex: 1}}
          contentContainerStyle={{
            flexGrow: 1,
          }}
        />
      </View>
    </WrapperContainer>
  );
}
