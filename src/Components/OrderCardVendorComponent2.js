import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import {
  I18nManager,
  Image,
  Keyboard, Platform, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from "react-native-fast-image";
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { dummyUser } from '../constants/constants';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from "../styles/responsiveSize";
import { MyDarkTheme } from "../styles/theme";
import {
  dateParser,
  tokenConverterPlusCurrencyNumberFormater
} from "../utils/commonFunction";
import { getImageUrl } from "../utils/helperFunctions";
import ButtonWithLoader from "./ButtonWithLoader";
import BannerLoader from './Loaders/BannerLoader';
import { getBundleId } from "react-native-device-info";
import { appIds } from "../utils/constants/DynamicAppKeys";


const OrderCardVendorComponent2 = ({
  data = {},
  selectedTab,
  onPress,
  updateOrderStatus,
  onPressReturnOrder,
  etaTime = null,
  cardStyle,
  updateLocalItem,
  showRepeatOrderButton,
  onRepeatOrderPress,
  _onCustomerEditOrder = () => { },
  _onDiscardCustomerEditOrder = () => { },
  onReplaceOrder = () => { },
}) => {
  const [reason, setReason] = useState("");
  const [cancellationItem, setCancellationItem] = useState(null);
  const [reasonError, setReasonError] = useState(false);
  const [cancelLoader, setLoader] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [orderCancelMessage, setOrderCancelMessage] = useState(null)
  const [selectedCancelReason, setSelectedCancelReason] = useState({});
  const [cancelReasons, setCancelReasons] = useState([]);
  const [isCancelOrderContentLoader, setIsCancelOrderContentLoader] =
    useState(false);

  const {
    appData,
    themeColors,
    currencies,
    languages,
    appStyle,
    themeToggle,
    themeColor,
  } = useSelector((state) => state?.initBoot);

  const businessType = appData?.profile?.preferences?.business_type || null;
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const {
    additional_preferences,
    digit_after_decimal,
  } = appData?.profile?.preferences;

  const imageUrl =
    data && data.vendor
      ? getImageUrl(
        data.vendor.logo.image_fit,
        data.vendor.logo.image_path,
        "200/200"
      )
      : dummyUser;
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({ fontFamily, themeColors });

  const onCancel = async () => {
    if (selectedCancelReason?.id == 8 && reason == '') {
      setReasonError(true);
      return;
    }
    setLoader(true);

    const apiData = {
      order_id: cancellationItem?.order_id,
      vendor_id: cancellationItem?.vendor.id,
      reject_reason: reason,
      cancel_reason_id: selectedCancelReason?.id,
      status_option_id: cancellationItem?.order_status?.current_status?.id,
    };
    console.log("sendingapi data", apiData);
    try {
      const res = await actions.cancelOrder(apiData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      });
      setLoader(false);
      updateLocalItem(data);
      if (res?.status == 403) {
        setOrderCancelMessage(res?.message)
      } else {
        hideModal();
      }

      console.log('cancellation res+++++', res);
    } catch (error) {
      // showError(error?.message || error?.error)
      alert(error?.message || error?.error);
      console.log("error raised", error);
      setLoader(false);
    }
  };

  const hideModal = () => {
    setReason("");
    setCancellationItem(null);
    setReasonError(false);
    setOrderCancelMessage(null)
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height + 10);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      (event) => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  const onCancelOrder = (item) => {
    setIsCancelOrderContentLoader(true);
    setCancellationItem(item);
    actions
      .getCancellationReason(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        setCancelReasons(res?.data);
        setIsCancelOrderContentLoader(false);
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, 'error>error');
    setCancellationItem(null);
    showError(error?.message || error?.error);
  };


  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={{
          ...styles.cardStyle,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.white,
          ...cardStyle,
        }}
      >
        {showRepeatOrderButton ? (
          <View
            style={{
              marginTop: moderateScale(10),
              marginRight: moderateScale(10),
            }}
          >
            <TouchableOpacity
              onPress={onRepeatOrderPress}
              style={[
                styles.orderAcceptAndReadyStyleSecond,
                {
                  // backgroundColor: themeColor.primary_color,
                  paddingHorizontal: moderateScale(10),
                  paddingVertical: moderateScale(5),
                  borderRadius: moderateScale(3),
                  alignSelf: "flex-end",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: textScale(10),
                  color: colors.white,
                  fontFamily: fontFamily.bold,
                }}
              >
                {strings.REPEAT_ORDER}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {data?.order_status?.current_status?.title !== strings.DELIVERED &&
          data?.order_status?.current_status?.title !== strings.REJECTED &&
          (!!etaTime || !!dateParser(data?.scheduled_date_time)) && (
            <View
              style={{
                ...styles.ariveView,
                backgroundColor: themeColors?.primary_color,
              }}
            >
              <Text
                style={{
                  ...styles.ariveTextStyle,
                  color: colors.white,
                }}
              >
                {businessType == 'taxi' ? strings.YOUR_RIDE_WILL_ARRIVE_BY : (getBundleId() == appIds.mrVeloz && languages?.primary_language?.sort_code == 'es') ? strings.YOUR_ORDER_WILL_ARRIVE_BY_MRVELOZ : strings.YOUR_ORDER_WILL_ARRIVE_BY}{" "}
                {dateParser(data?.scheduled_date_time) || etaTime}
              </Text>
            </View>
          )}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            padding: moderateScale(8),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 0.5,
              alignItems: "flex-start",
            }}
          >
            <FastImage
              source={{ uri: imageUrl }}
              style={{
                height: moderateScale(50),
                width: moderateScale(50),
                borderRadius: moderateScale(50 / 2),
                marginRight: moderateScale(8),
              }}
            // resizeMode={FastImage.resizeMode.contain}
            />
            <Text
              numberOfLines={2}
              style={
                isDarkMode
                  ? [styles.userName, { color: MyDarkTheme.colors.text }]
                  : styles.userName
              }
            >
              {data?.vendor?.name || ""}
            </Text>
          </View>
          <View
            style={{
              flex: 0.5,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={
                isDarkMode
                  ? [styles.orderLableStyle, { color: MyDarkTheme.colors.text }]
                  : styles.orderLableStyle
              }
            >
              {`${(getBundleId() == appIds.mrVeloz && languages?.primary_language?.sort_code == 'es') ? strings.ORDER_ID_MRVELOZ : strings.ORDER_ID}: #${data?.order_number}`}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.orderLableStyle,
                    {
                      color: MyDarkTheme.colors.text,
                      marginVertical: moderateScaleVertical(5),
                    },
                  ]
                  : [
                    styles.orderLableStyle,
                    {
                      marginVertical: moderateScaleVertical(5),
                      color: colors.black,
                    },
                  ]
              }
            >
              {data?.date_time}
            </Text>
          </View>
        </View>
        <View
          style={[styles.borderStyle, { marginHorizontal: moderateScale(10) }]}
        ></View>
        <View
          style={{
            borderColor: colors.borderColorB,
            padding: moderateScale(10),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: moderateScaleVertical(10),
            }}
          >
            {appStyle?.homePageLayout !== 4 ? (
              <Text
                style={{
                  fontFamily: fontFamily.semiBold,
                  fontSize: textScale(14),

                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}
              >
                {`${strings.TOTAL_ITEMS}: ${data?.product_details?.length}`}
              </Text>
            ) : (
              <></>
            )}
            {!!data?.is_edited &&
              <View>
                <Text
                  style={{
                    fontFamily: fontFamily?.bold,
                    fontSize: textScale(10),
                    color: themeColors?.primary_color,
                  }}
                >
                  Edited
                </Text>
              </View>

            }

            {/* {data?.order_status?.current_status?.title == strings.DELIVERED && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setModal(true)}>
              <Image
                style={{tintColor: themeColors.primary_color}}
                source={imagePath.icAttachments}
              />
            </TouchableOpacity>
          )} */}
          </View>
          <ScrollView bounces={true}>
            {data?.product_details.map((i, inx) => {
              return (
                <View key={inx}>
                  <View
                    style={{
                      marginVertical: moderateScaleVertical(10),
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.orderLableStyle,
                              { color: MyDarkTheme.colors.text },
                            ]
                            : styles.orderLableStyle
                        }
                      >
                        {i?.title || ""}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={
                          isDarkMode
                            ? [
                              styles.qtyViewStyle,
                              {
                                color: MyDarkTheme.colors.text,
                                fontSize: textScale(10),
                              },
                            ]
                            : [styles.qtyViewStyle, { fontSize: textScale(10) }]
                        }
                      >
                        {`x ${i?.qty || ""}`}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
              marginBottom: moderateScaleVertical(10),
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={imagePath.iconPayments}
                style={{ tintColor: colors.textGreyB }}
              />
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.lableOrders,
                      {
                        paddingLeft: moderateScale(5),
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                    : [styles.lableOrders, { paddingLeft: moderateScale(5) }]
                }
              >
                {`${strings.PAYMENT} : `}
                <Text style={styles.valueOrders}>
                  {data?.payment_option_title}
                </Text>
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: themeColors.primary_color,
                  marginHorizontal: moderateScale(10),
                }}
              >
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(data?.payable_amount),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                  
                )}
              </Text>
            </View>
          </View>
          {/* <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor:themeColors?.primary_color,
              // padding:moderateScale(10),
              borderRadius:moderateScale(5),
              paddingVertical:moderateScaleVertical(8),
              paddingHorizontal:moderateScale(15)
            }}>
          
              <Text style={{...styles.valueOrders,color:colors.white}}>
                {'Pay Now'}
              </Text>
            </View>
          <View>
            <Text
              style={{
                color:colors.redB,
                marginHorizontal: moderateScale(10),
              }}>
              {'UnPaid'}
            </Text>
          </View>
        </View> */}

          <View style={[styles.borderStyle, { marginHorizontal: -15 }]}></View>

          {businessType == "laundry" && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginHorizontal: moderateScale(10),
                  marginTop: moderateScale(15),
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    color: colors.black,
                  }}
                >
                  {strings.PICKUP_SCHEDULE_DATE}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    color: colors.blackOpacity66,
                  }}
                >
                  {data?.schedule_pickup} | {data?.scheduled_slot}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginHorizontal: moderateScale(10),
                  marginTop: moderateScale(15),
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    color: colors.black,
                  }}
                >
                  {strings.DROP_OFF_SCHEDULE_DATE}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    color: colors.blackOpacity66,
                  }}
                >
                  {data?.schedule_dropoff} | {data?.dropoff_scheduled_slot}
                </Text>
              </View>
            </>
          )}

          {selectedTab && selectedTab == strings.PAST_ORDERS ? (
            <View
              style={{
                alignItems: "center",
                marginTop: moderateScale(15),
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <View style={styles.bottomFirstHalf}>
                <View style={styles.currentStatusView}>
                  <Text
                    style={[
                      styles.orderStatusStyle,
                      {
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      },
                    ]}
                  >
                    {data?.order_status?.current_status?.title}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 0.6,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                {isEmpty(data?.exchanged_of_order) &&
                  data?.order_status?.current_status?.title !== strings.REJECTED ? (
                  <View>
                    {data?.returnable ? (
                      <TouchableOpacity
                        onPress={onPressReturnOrder}
                        // style={{flex:0.6}}
                        style={{ ...styles.bottomSecondHalf, flex: 0 }}>
                        {appStyle?.homePageLayout === 4 ? null : (
                          <View style={styles.orderAcceptAndReadyStyleSecond}>
                            <Text style={styles.orderStatusStyleSecond}>
                              {strings.RETURNORDER}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ) : data?.return_request_status == 1 ? (
                      <Text
                        style={{
                          ...styles.returnRequestsTxt,
                          color: colors.greenA,
                        }}>
                        {strings.RETURN_REQUEST} {strings.ACCEPTED}
                      </Text>
                    ) : data?.return_request_status == 2 ? (
                      <Text
                        style={{ ...styles.returnRequestsTxt, color: colors.redB }}>
                        {strings.RETURN_REQUEST} {strings.REJECTED}
                      </Text>
                    ) : data?.return_request_status == 3 ? (
                      <Text
                        style={{
                          ...styles.returnRequestsTxt,
                          color: colors.blackB,
                        }}>
                        {strings.RETURN_REQUEST} {strings.PENDING}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                ) : (
                  <></>
                )}

                {isEmpty(data?.exchanged_of_order) &&
                  data?.is_exchanged_or_returned == 0 &&
                  data?.replaceable &&
                  data?.order_status?.current_status?.title !== strings.REJECTED ? (
                  <TouchableOpacity
                    // onPress={onPressRateOrder}
                    onPress={() => onReplaceOrder(data)}
                    // style={{flex:0.6}}
                    style={{
                      ...styles.bottomSecondHalf,
                      flex: 0,
                      marginLeft: moderateScale(15),
                    }}>
                    {appStyle?.homePageLayout === 4 ? null : (
                      <View style={styles.orderAcceptAndReadyStyleSecond}>
                        <Text style={styles.orderStatusStyleSecond}>{strings.REPLACE}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: moderateScale(15),
              }}
            >
              <View style={styles.bottomFirstHalf}>
                <View style={styles.currentStatusView}>
                  <Text
                    style={[
                      styles.orderStatusStyle,
                      {
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.black,
                      },
                    ]}
                  >
                    {data?.order_status?.current_status?.title}
                  </Text>
                </View>
              </View>

              {selectedTab &&
                (selectedTab != strings.ACTIVE_ORDERS ||
                  selectedTab != strings.SCHEDULED_ORDERS) ? null : (
                <View style={styles.bottomSecondHalf}>
                  {data?.order_status?.current_status?.id == 1 ? (
                    <View style={{ flexDirection: "row" }}>
                      <TouchableOpacity
                        onPress={() => updateOrderStatus(data, 8)}
                        style={styles.orderReject}
                      >
                        <Text style={styles.orderStatusStyleSecond}>
                          {strings.REJECT}
                        </Text>
                      </TouchableOpacity>
                      <View style={{ width: moderateScale(10) }} />
                      <TouchableOpacity
                        onPress={() => updateOrderStatus(data, 7)}
                        style={styles.orderAccept}
                      >
                        <Text style={styles.orderStatusStyleSecond}>
                          {strings.ACCEPT}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : data?.order_status?.upcoming_status ? (
                    <TouchableOpacity
                      onPress={() =>
                        updateOrderStatus(
                          data,
                          data?.order_status?.upcoming_status?.id
                        )
                      }
                      style={styles.orderAcceptAndReadyStyleSecond}
                    >
                      <Text style={styles.orderStatusStyleSecond}>
                        {data?.order_status?.upcoming_status?.title}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            </View>
          )}
          {data?.vendor?.cancel_order_in_processing == 1 ? (
            <View>
              {(data?.order_status?.current_status?.id == 1 ||
                data?.order_status?.current_status?.id == 2) &&
                isEmpty(data?.cancel_request) ? (
                <TouchableOpacity
                  onPress={() => onCancelOrder(data)}
                  activeOpacity={0.8}
                  style={{
                    alignSelf: 'flex-start',
                    marginLeft: moderateScale(10),
                    marginTop: moderateScaleVertical(8),
                  }}>
                  <Text
                    style={{
                      ...styles.orderStatusStyle,
                      color: colors.redB,
                      fontFamily: fontFamily.medium,
                    }}>
                    {strings.CANCEL_ORDER}
                  </Text>
                </TouchableOpacity>
              ) : (data?.order_status?.current_status?.id == 1 ||
                data?.order_status?.current_status?.id == 2) &&
                !isEmpty(data?.cancel_request) ? (
                <Text
                  style={{
                    ...styles.orderStatusStyleSecond,
                    color:
                      data?.cancel_request?.status_id == 0
                        ? colors.blueB
                        : data?.cancel_request?.status_id == 2
                          ? colors.redB
                          : colors.black,
                    marginLeft: moderateScale(10),
                  }}>
                  {strings.CANCELLATION_REQUEST}
                  {data?.cancel_request?.status_id == 0
                    ? ' pending'
                    : data?.cancel_request?.status_id == 2
                      ? ' rejected'
                      : ''}
                </Text>
              ) : null}
            </View>
          ) : (
            <></>
          )}
        </View>
        <Modal
          isVisible={!!cancellationItem ? true : false}
          onBackdropPress={hideModal}
          // animationIn="zoomIn"
          // animationOut="zoomOut"
          style={{
            margin: 0,
            justifyContent: 'flex-end',
            marginBottom:
              Platform.OS == 'ios' ? moderateScale(keyboardHeight) : 0,
          }}>
          <View
            style={{
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.white,
              borderTopLeftRadius: moderateScale(8),
              borderTopRightRadius: moderateScale(8),
              overflow: 'hidden',
              paddingHorizontal: moderateScale(16),
              paddingVertical: moderateScale(12),
              // height: moderateScaleVertical(300),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text />
              {!isCancelOrderContentLoader && (
                <Text
                  style={{
                    fontSize: textScale(16),
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                    alignSelf: 'center',
                    fontFamily: fontFamily.medium,
                  }}>
                  {strings.SELECT_CANCELLATION_REASON}
                </Text>
              )}
              <TouchableOpacity onPress={hideModal}>
                <Image
                  style={isDarkMode && { tintColor: colors.white }}
                  source={imagePath.closeButton}
                />
              </TouchableOpacity>
            </View>

            {isCancelOrderContentLoader ? (
              <View style={{}}>
                <BannerLoader
                  viewStyles={{
                    marginTop: moderateScale(8),
                    marginBottom: moderateScale(10),
                    marginHorizontal: moderateScale(0),
                  }}
                  homeLoaderHeight={moderateScaleVertical(40)}
                />
                <BannerLoader
                  viewStyles={{
                    marginBottom: moderateScale(10),
                    marginHorizontal: moderateScale(0),
                  }}
                  homeLoaderHeight={moderateScaleVertical(40)}
                />
                <BannerLoader
                  viewStyles={{
                    marginBottom: moderateScale(20),
                    marginHorizontal: moderateScale(0),
                  }}
                  homeLoaderHeight={moderateScaleVertical(40)}
                />
              </View>
            ) : (
              <View>
                {!!reasonError && selectedCancelReason?.id == 8 && (
                  <Text
                    style={{
                      fontSize: textScale(12),
                      color: colors.redB,
                      fontFamily: fontFamily.medium,
                      marginTop: moderateScaleVertical(8),
                    }}>
                    {strings.PLEASE_ENTER_CANCELLATION_REASON}*{' '}
                  </Text>
                )}
                <View style={{ height: moderateScaleVertical(20) }} />

                <ScrollView
                  style={{
                    maxHeight: moderateScaleVertical(250),
                  }}>
                  {cancelReasons.map((item) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setSelectedCancelReason(item)}
                      style={{
                        height: moderateScaleVertical(40),
                        backgroundColor: colors.blackOpacity05,
                        paddingHorizontal: moderateScale(10),
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}>
                      <Text> {item?.title}</Text>
                      {selectedCancelReason?.id == item?.id ? (
                        <Image source={imagePath.tick2} />
                      ) : (
                        <></>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {selectedCancelReason?.id == 8 ? (
                  <View
                    style={{
                      // marginVertical: moderateScaleVertical(16),
                      backgroundColor: isDarkMode
                        ? colors.whiteOpacity15
                        : colors.greyNew,
                      height: moderateScale(82),
                      borderRadius: moderateScale(4),
                      paddingHorizontal: moderateScale(8),
                      marginTop: reasonError
                        ? moderateScaleVertical(8)
                        : moderateScaleVertical(16),
                    }}>
                    <TextInput
                      multiline
                      value={reason}
                      placeholder={strings.WRITE_YOUR_REASON_HERE}
                      onChangeText={(val) => setReason(val)}
                      style={{
                        ...styles.reasonText,
                        color: isDarkMode ? colors.textGreyB : colors.black,
                        textAlignVertical: 'top',
                      }}
                      onSubmitEditing={Keyboard.dismiss}
                      placeholderTextColor={
                        isDarkMode ? colors.textGreyB : colors.blackOpacity40
                      }
                    />
                  </View>
                ) : null}
                <ButtonWithLoader
                  isLoading={cancelLoader}
                  btnText={strings.CANCEL}
                  btnStyle={{
                    backgroundColor: themeColors.primary_color,
                    borderWidth: 0,
                  }}
                  onPress={onCancel}
                />
              </View>
            )}
          </View>
        </Modal>
      </TouchableOpacity>

      {!!Number(data?.is_editable === 1) ? (
        <TouchableOpacity
          style={{
            marginVertical: moderateScaleVertical(5),
            alignItems: "center",
            backgroundColor: themeColors?.primary_color,
            // padding:moderateScale(10),
            borderRadius: moderateScale(5),
            paddingVertical: moderateScaleVertical(8),
            paddingHorizontal: moderateScale(15),
          }}
          onPress={() => _onCustomerEditOrder(data)}
        >
          <Text style={{ ...styles.valueOrders, color: colors.white }}>
            {"Edit Order"}
          </Text>
        </TouchableOpacity>
      ) : !!Number(data?.is_editable === 2) ? (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : colors.white,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              marginVertical: moderateScaleVertical(10),
              fontFamily: fontFamily?.regular,
            }}
          >
            Order is being edited in Cart
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: moderateScale(10),
            }}
            onPress={() => _onDiscardCustomerEditOrder(data)}
          >
            <Image source={imagePath.deleteRed} />
            <Text
              style={{
                marginHorizontal: moderateScale(4),
                color: colors.redB,
                fontFamily: fontFamily.bold,
              }}
            >
              DISCARD
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};
export function stylesFunc({ fontFamily, themeColors }) {
  const commonStyles = commonStylesFunc({ fontFamily });

  let cardWidth = width - 21.5;

  const styles = StyleSheet.create({
    cardStyle: {
      width: cardWidth,
      // ...commonStyles.shadowStyle,
      marginHorizontal: 2,
      justifyContent: "center",
      padding: moderateScaleVertical(5),
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.borderColorB,
      borderRadius: moderateScale(6),
    },
    lableOrders: {
      // ...commonStyles.mediumFont14Normal,
      color: colors.buyBgDark,
      lineHeight: moderateScaleVertical(19),
      fontFamily: fontFamily.medium,
      fontSize: textScale(10),
    },
    valueOrders: {
      color: colors.textGreyB,
      fontFamily: fontFamily.medium,
      fontSize: textScale(10),
      // opacity: 0.6,

      lineHeight: moderateScaleVertical(16),
    },
    orderAddEditViews: {
      color: themeColors.primary_color,
      fontFamily: fontFamily.bold,
      fontSize: textScale(14),
    },
    rateOrder: {
      color: themeColors.secondary_color,
      fontFamily: fontFamily.bold,
      fontSize: textScale(16),
    },

    //vendor app order listing styles.
    orderLableStyle: {
      color: colors.textGreyI,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
      opacity: 0.6,
    },
    userName: {
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    qtyViewStyle: {
      marginHorizontal: moderateScale(15),
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      opacity: 0.6,
    },
    borderStyle: {
      borderWidth: 0.3,
      borderStyle: "dashed",
      borderRadius: 1,
      borderColor: colors.lightGreyBgColor,
    },
    orderStatusStyle: {
      color: colors.black,
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(12),
    },
    trackOrderTextStyle: {
      color: themeColors.secondary_color,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
    },
    orderStatusStyleSecond: {
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: textScale(10),
    },
    orderAcceptAndReadyStyle: {
      backgroundColor: themeColors.primary_color,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(8.5),
      alignItems: "center",
    },
    orderAcceptAndReadyStyleSecond: {
      flex: 0.6,
      backgroundColor: themeColors.primary_color,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: "center",
    },
    orderAccept: {
      backgroundColor: colors.green,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: "center",
    },
    orderReject: {
      backgroundColor: colors.redColor,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: "center",
    },
    imageCardStyle: {
      height: width / 6,
      width: width / 6,
      borderRadius: width / 12,
      marginRight: moderateScale(5),
    },
    circularQuantityView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: themeColors.primary_color,
      position: "absolute",
      right: -2,
      top: -2,
      height: 25,
      width: 25,
      borderRadius: 25 / 2,
    },
    qunatityText: {
      color: colors.white,
      fontSize: textScale(10),
      fontFamily: fontFamily.medium,
    },
    scrollableContainer: {
      flexDirection: "row",
      // marginBottom: moderateScaleVertical(10),
      alignItems: "center",
      flexWrap: "wrap",
      paddingVertical: moderateScale(10),
    },
    currentStatusView: {
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(8.5),
      alignItems: "center",
    },
    trackStatusView: {
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(8),
      alignItems: "center",
    },
    bottomFirstHalf: {
      flex: 0.4,
      alignItems: "flex-start",
      justifyContent: "center",
      // flexWrap:'wrap'
    },
    bottomSecondHalf: {
      flex: 0.6,
      alignItems: "flex-end",
      justifyContent: "center",
      // backgroundColor: 'black',
      // flexWrap:'wrap'
    },
    ariveTextStyle: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(11),
    },
    ariveView: {
      padding: moderateScale(6),
      borderTopRightRadius: moderateScale(6),
      borderTopLeftRadius: moderateScale(6),
    },
    reasonText: {
      flex: 1,
      fontFamily: fontFamily.medium,
      textAlign: I18nManager.isRTL ? "right" : "left",
      fontSize: textScale(11),
    },
  });
  return styles;
}
export default React.memo(OrderCardVendorComponent2);
