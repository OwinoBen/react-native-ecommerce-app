import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {UIActivityIndicator} from 'react-native-indicators';
import {useSelector} from 'react-redux';
import {dummyUser} from '../constants/constants';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import staticStrings from '../constants/staticStrings';
import navigationStrings from '../navigation/navigationStrings';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../utils/helperFunctions';
const PendingOrderCard = ({
  data = {},
  titlestyle,
  selectedTab,
  onPress,
  navigation,
  onPressRateOrder,
  updateOrderStatus,
  onPressReturnOrder,
  acceptLoader = false,
  rejectLoader = false,
  selectedOrder = null,
}) => {
  let cardWidth = width - 21.5;
  const {appData, themeColors, themeLayouts, currencies, languages, appStyle} =
    useSelector((state) => state?.initBoot);
  const {additional_preferences, digit_after_decimal} = appData?.profile?.preferences || {};

  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const imageUrl =
    data && data.user_image
      ? getImageUrl(
          data.user_image.image_fit,
          data.user_image.image_path,
          '200/200',
        )
      : dummyUser;
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({fontFamily, themeColors});
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={{
        ...styles.cardStyle,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.lightDark
          : colors.white,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View
          style={{
            flex: 0.7,
            flexDirection: 'row',
            alignItems: 'center',
            padding: moderateScale(10),
          }}>
          {/* <Image
            source={{uri: imageUrl}}
            style={{
              height: moderateScale(40),
              width: moderateScale(40),
              borderRadius: moderateScale(40 / 2),
            }}
          /> */}
          <View>
            <Text
              style={
                isDarkMode
                  ? [styles.userName, {color: MyDarkTheme.colors.text}]
                  : styles.userName
              }>
              {data?.user_name || ''}
            </Text>
            <View style={{flexWrap: 'wrap'}}>
              <Text
                style={
                  isDarkMode
                    ? [styles.orderLableStyle, {color: MyDarkTheme.colors.text}]
                    : styles.orderLableStyle
                }>{`#${data?.order_number}`}</Text>
              <Text
                style={
                  isDarkMode
                    ? [styles.orderLableStyle, {color: MyDarkTheme.colors.text}]
                    : styles.orderLableStyle
                }>{`${data?.date_time} `}</Text>
            </View>
          </View>
        </View>

        <View
          style={{flex: 0.3, alignItems: 'center', padding: moderateScale(10)}}>
          <Text
            style={
              isDarkMode
                ? [styles.userName, {color: MyDarkTheme.colors.text}]
                : [styles.userName]
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(data?.payable_amount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
              
            )}
          </Text>
        </View>
      </View>

      <View
        style={{
          borderColor: colors.borderColorB,
          padding: moderateScale(10),
        }}>
        <ScrollView
          bounces={true}
          horizontal
          contentContainerStyle={styles.scrollableContainer}>
          {data?.product_details.map((i, inx) => {
            return (
              <ImageBackground
                source={{
                  uri: getImageUrl(
                    i?.image_path?.image_fit,
                    i?.image_path?.image_path,
                    '500/500',
                  ),
                }}
                style={styles.imageCardStyle}
                imageStyle={styles.imageCardStyle}>
                <View style={styles.circularQuantityView}>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.qunatityText,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : styles.qunatityText
                    }>{`x${i.qty}`}</Text>
                </View>
              </ImageBackground>
            );
          })}
        </ScrollView>

        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
            alignItems: 'center',
          }}>
          <Image
            source={imagePath.iconPayments}
            style={{tintColor: colors.textGreyB}}
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
                : [styles.lableOrders, {paddingLeft: moderateScale(5)}]
            }>
            {`${strings.PAYMENT} : `}
            <Text style={styles.valueOrders}>{data?.payment_option_title}</Text>
          </Text>
          {/* <Image source={imagePath.card} /> */}
        </View>

        <View style={styles.borderStyle}></View>

        {selectedTab && selectedTab == strings.PAST_ORDERS ? (
          <View
            style={{
              alignItems: 'center',
              marginTop: moderateScale(15),
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <View style={styles.bottomFirstHalf}>
              <View style={styles.currentStatusView}>
                <Text style={styles.orderStatusStyle}>
                  {data?.order_status?.current_status?.title}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              // onPress={onPressRateOrder}
              onPress={onPressReturnOrder}
              // style={{flex:0.6}}
              style={styles.bottomSecondHalf}>
              <View style={styles.orderAcceptAndReadyStyleSecond}>
                <Text style={styles.orderStatusStyleSecond}>
                  {strings.RETURNORDER}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: moderateScale(15),
            }}>
            <View style={styles.bottomFirstHalf}>
              <View style={styles.currentStatusView}>
                <Text style={styles.orderStatusStyle}>
                  {data?.order_status?.current_status?.title}
                </Text>
              </View>
            </View>
            {selectedTab &&
            data?.dispatch_traking_url &&
            data?.product_details[0]?.category_type !=
              staticStrings.PICKUPANDDELIEVRY &&
            (selectedTab == strings.ACTIVE_ORDERS ||
              selectedTab == strings.SCHEDULED_ORDERS) ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navigationStrings.WEBVIEWSCREEN, {
                    title: strings.TRACKDETAIL,
                    url: data?.dispatch_traking_url,
                  })
                }
                style={{
                  borderRadius: 10,
                  backgroundColor: themeColors.primary_color,
                  justifyContent: 'center',
                }}>
                <View style={styles.trackStatusView}>
                  <Text style={styles.trackOrderTextStyle}>
                    {strings.TRACK_ORDER2}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {selectedTab &&
            (selectedTab != strings.ACTIVE_ORDERS ||
              selectedTab != strings.SCHEDULED_ORDERS) ? null : (
              <View style={styles.bottomSecondHalf}>
                {data?.order_status?.current_status?.id == 1 ? (
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      disabled={rejectLoader || acceptLoader}
                      onPress={() => updateOrderStatus(data, 8)}
                      style={styles.orderReject}>
                      {rejectLoader &&
                      !!selectedOrder &&
                      selectedOrder.id == data?.id ? (
                        <UIActivityIndicator size={16} color={colors.white} />
                      ) : (
                        <Text style={styles.orderStatusStyleSecond}>
                          {strings.REJECT}
                        </Text>
                      )}
                    </TouchableOpacity>
                    <View style={{width: moderateScale(10)}} />
                    <TouchableOpacity
                      disabled={rejectLoader || acceptLoader}
                      onPress={() => updateOrderStatus(data, 7)}
                      style={styles.orderAccept}>
                      {!!acceptLoader &&
                      !!selectedOrder &&
                      selectedOrder.id == data?.id ? (
                        <UIActivityIndicator size={16} color={colors.white} />
                      ) : (
                        <Text style={styles.orderStatusStyleSecond}>
                          {strings.ACCEPT}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : data?.order_status?.upcoming_status ? (
                  <TouchableOpacity
                    onPress={() =>
                      updateOrderStatus(
                        data,
                        data?.order_status?.upcoming_status?.id,
                      )
                    }
                    style={styles.orderAcceptAndReadyStyleSecond}>
                    <Text style={styles.orderStatusStyleSecond}>
                      {data?.order_status?.upcoming_status?.title}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
export function stylesFunc({fontFamily, themeColors}) {
  const commonStyles = commonStylesFunc({fontFamily});

  let cardWidth = width - 21.5;

  const styles = StyleSheet.create({
    cardStyle: {
      width: cardWidth,
      ...commonStyles.shadowStyle,
      marginHorizontal: 2,
      justifyContent: 'center',
      padding: moderateScaleVertical(5),
      backgroundColor: colors.white,
      borderRadius: moderateScale(6),
      margin: 2,
    },
    lableOrders: {
      // ...commonStyles.mediumFont14Normal,
      color: colors.buyBgDark,
      lineHeight: moderateScaleVertical(19),
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
    },
    valueOrders: {
      color: colors.textGreyB,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
      // opacity: 0.6,
      fontSize: textScale(13),
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
      fontSize: textScale(12),
      opacity: 0.4,
    },
    userName: {
      color: colors.textGreyI,
      fontFamily: fontFamily.medium,
      fontSize: textScale(14),
    },
    borderStyle: {
      borderWidth: 0.3,
      borderStyle: 'dashed',
      borderRadius: 1,
      borderColor: colors.lightGreyBgColor,
    },
    orderStatusStyle: {
      color: colors.statusColor,
      fontFamily: fontFamily.regular,
      fontSize: textScale(10),
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
      alignItems: 'center',
    },
    orderAcceptAndReadyStyleSecond: {
      flex: 0.6,
      backgroundColor: themeColors.primary_color,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
      borderRadius: moderateScale(3),
      alignItems: 'center',
    },
    orderAccept: {
      backgroundColor: colors.green,
      borderRadius: moderateScale(3),
      alignItems: 'center',
      minWidth: moderateScale(70),
      minHeight: moderateScale(25),
      justifyContent: 'center',
    },
    orderReject: {
      backgroundColor: colors.redColor,
      minWidth: moderateScale(70),
      minHeight: moderateScale(25),
      borderRadius: moderateScale(3),
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageCardStyle: {
      height: width / 6,
      width: width / 6,
      borderRadius: width / 12,
      marginRight: moderateScale(5),
    },
    circularQuantityView: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.primary_color,
      position: 'absolute',
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
      flexDirection: 'row',
      // marginBottom: moderateScaleVertical(10),
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingVertical: moderateScale(10),
    },
    currentStatusView: {
      backgroundColor: getColorCodeWithOpactiyNumber('FF972E', 10),
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(2),
      borderRadius: moderateScale(8.5),
      alignItems: 'center',
    },
    trackStatusView: {
      backgroundColor: getColorCodeWithOpactiyNumber('FF972E', 10),
      paddingHorizontal: moderateScale(20),
      paddingVertical: moderateScale(8),
      borderRadius: moderateScale(8.5),
      alignItems: 'center',
    },
    bottomFirstHalf: {
      flex: 0.4,
      alignItems: 'flex-start',
      justifyContent: 'center',
      // flexWrap:'wrap'
    },
    bottomSecondHalf: {
      flex: 0.6,
      alignItems: 'flex-end',
      justifyContent: 'center',
      // backgroundColor: 'black',
      // flexWrap:'wrap'
    },
  });
  return styles;
}
export default React.memo(PendingOrderCard);
