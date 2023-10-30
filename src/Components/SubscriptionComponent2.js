import moment from 'moment';
import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
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
import GradientButton from './GradientButton';
const SubscriptionComponent2 = ({
  data = {},
  onPress = () => {},
  cardWidth,
  cardStyle = {},
  onAddtoWishlist,
  addToCart = () => {},
  activeOpacity = 1,
  bottomText = strings.BUY_NOW,
  clientCurrency = {},
  currentSubscription = false,
  payNowUpcoming = () => {},
  cancelSubscription = () => {},
  subscriptionData,
  allSubscriptions = [],
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const currentTheme = useSelector((state) => state?.appTheme);
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const {appStyle, themeColors, appData} = useSelector(
    (state) => state?.initBoot,
  );
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;
  const {themeLayouts} = currentTheme;
  const commonStyles = commonStylesFunc({fontFamily});
  const styles = stylesFunc({fontFamily, themeColors});

  const cardWidthNew = cardWidth ? cardWidth : width - 20;
  const url1 = data?.image?.image_fit;
  const url2 = data?.image?.image_path;
  const getImage = getImageUrl(url1, url2, '500/500');
  const productPrice = data?.price;
  // data?.variant[0]?.price *
  // (data?.variant[0]?.multiplier ? data?.variant[0]?.multiplier : 1);

  const currentDateValue = new Date().getTime();
  const subscriptionDateValue = moment(subscriptionData?.cancelled_at).format(
    'LL',
  );
  const subscriptionEndDateValue = moment(subscriptionData?.end_date).format(
    'LL',
  );

  const currentTimeValue = new Date().getTime();
  const subscriptionTimeValue = new Date(
    subscriptionData?.cancelled_at,
  ).getTime();
  const subscriptionEndTimeValue = new Date(
    subscriptionData?.end_date,
  ).getTime();

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      // onPress={onPress}
    >
      <ImageBackground
        source={getImage ? {uri: getImage} : ''}
        style={{
          ...styles.imageBackground,
          // backgroundColor: MyDarkTheme.colors.lightDark,
        }}
        borderRadius={10}
        resizeMode="cover">
        <View style={styles.titleBagView}>
          <Text
            style={
              isDarkMode
                ? [styles.title, {color: MyDarkTheme.colors.text}]
                : styles.title
            }>
            {data?.title}
          </Text>
          <Image
            source={imagePath.icBagA}
            style={{height: moderateScale(30), width: moderateScale(30)}}
          />
        </View>
        <View style={styles.descriptionView}>
          <Text
            style={
              isDarkMode
                ? [styles.subtitle, {color: MyDarkTheme.colors.text}]
                : [styles.subtitle]
            }>
            {(subscriptionData && subscriptionData?.plan?.description) ||
              data?.description}
          </Text>
        </View>

        <View style={styles.subscriptionView}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {subscriptionData?.plan?.deleted_at == null && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>
                  {tokenConverterPlusCurrencyNumberFormater(
                    Number(data?.price),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}
                </Text>
              </View>
            )}

            {currentSubscription ? (
              !subscriptionData?.cancelled_at &&
              subscriptionData?.plan?.deleted_at == null &&
              allSubscriptions &&
              !!allSubscriptions?.length && (
                <GradientButton
                  colorsArray={[colors.white, colors.white]}
                  textStyle={{
                    fontFamily: fontFamily.medium,
                    fontSize: textScale(10),
                    color: themeColors.primary_color,
                  }}
                  // onPress={() => onPress(data)}

                  containerStyle={{
                    height: moderateScaleVertical(29),
                    backgroundColor: colors.white,
                    paddingHorizontal: moderateScale(20),
                    borderRadius: moderateScale(7),
                  }}
                  onPress={payNowUpcoming}
                  btnText={
                    currentDateValue == subscriptionDateValue ||
                    currentTimeValue > subscriptionTimeValue
                      ? `${
                          strings.RENEW
                        } (${tokenConverterPlusCurrencyNumberFormater(
                          Number(data?.price),
                          digit_after_decimal,
                          additional_preferences,
                          currencies?.primary_currency?.symbol,
                        )})`
                      : `${
                          strings.PAY
                        } (${tokenConverterPlusCurrencyNumberFormater(
                          Number(data?.price),
                          digit_after_decimal,
                          additional_preferences,
                          currencies?.primary_currency?.symbol,
                        )})`
                  }
                />
              )
            ) : (
              <GradientButton
                colorsArray={[colors.white, colors.white]}
                textStyle={{
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(10),
                  color: themeColors.primary_color,
                }}
                onPress={() => onPress(data)}
                containerStyle={styles.subscribeBtn}
                btnText={strings.SUBSCRIBE}
              />
            )}
          </View>

          {currentSubscription && (
            <View>
              {subscriptionData?.cancelled_at ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: moderateScaleVertical(8),
                  }}>
                  <Text
                    style={[
                      styles.updateBilling,
                      {color: colors.white, fontSize: textScale(12)},
                    ]}>
                    {currentDateValue == subscriptionDateValue ||
                    currentTimeValue > subscriptionTimeValue
                      ? strings.CANCELLED_AT
                      : strings.CANCELS_AT}
                  </Text>
                  <Text style={styles.updateBilling}>
                    {currentDateValue == subscriptionDateValue ||
                    currentTimeValue > subscriptionTimeValue
                      ? moment(subscriptionData?.end_date).format('LL')
                      : moment(subscriptionData?.end_date).format('LL')}
                  </Text>
                </View>
              ) : currentDateValue !== subscriptionEndDateValue ||
                currentTimeValue > subscriptionEndTimeValue ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: moderateScaleVertical(8),
                  }}>
                  <Text
                    style={{
                      ...styles.updateBilling,
                      color: colors.white,
                      fontSize: textScale(12),
                      fontFamily: fontFamily.bold,
                    }}>
                    {``}
                  </Text>
                  <View>
                    <Text
                      style={{
                        ...styles.updateBilling,
                        color: colors.white,
                        fontSize: textScale(12),
                        fontFamily: fontFamily.bold,
                      }}>
                      {`${strings.EXPIRED_ON}`}
                    </Text>
                    <Text style={styles.updateBilling}>
                      {moment(subscriptionData?.end_date).format('LL')}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: moderateScaleVertical(8),
                  }}>
                  <Text style={[styles.updateBilling, {flex: 1}]}>
                    {strings.UPCOMING_BILLING_DATE}
                  </Text>
                  <Text style={styles.updateBilling}>
                    {moment(subscriptionData?.end_date).format('LL')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ImageBackground>
      {!!(
        !!subscriptionData?.plan?.deleted_at == null &&
        subscriptionData?.subscription_id === data?.id
      ) && (
        <View>
          {subscriptionData?.cancelled_at ||
          currentDateValue == subscriptionEndDateValue ||
          currentTimeValue > subscriptionEndTimeValue ? null : (
            <View
              style={{
                marginTop: moderateScale(10),
                flexDirection: 'row',
              }}>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={styles.textStyle}
                marginTop={moderateScaleVertical(10)}
                marginBottom={moderateScaleVertical(10)}
                borderRadius={moderateScale(5)}
                containerStyle={{
                  marginHorizontal: moderateScale(10),
                  width: width / 2,
                }}
                onPress={payNowUpcoming}
                btnText={`${
                  strings.PAYNOW
                } (${tokenConverterPlusCurrencyNumberFormater(
                  Number(data?.price),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )})`}
              />
              <GradientButton
                colorsArray={[
                  getColorCodeWithOpactiyNumber(
                    themeColors?.primary_color.substr(1),
                    20,
                  ),
                  getColorCodeWithOpactiyNumber(
                    themeColors?.primary_color.substr(1),
                    20,
                  ),
                ]}
                textStyle={styles.textStyle2}
                marginTop={moderateScaleVertical(10)}
                marginBottom={moderateScaleVertical(10)}
                borderRadius={moderateScale(5)}
                containerStyle={{
                  marginHorizontal: moderateScale(10),
                  width: width / 3,
                  backgroundColor: 'white',
                }}
                onPress={cancelSubscription}
                btnText={strings.CANCEL}
              />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export function stylesFunc({fontFamily, themeColors}) {
  const styles = StyleSheet.create({
    title: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: textScale(15),
      textAlign: 'left',
    },
    subtitle: {
      color: colors.white,
      fontFamily: fontFamily.regular,
      fontSize: textScale(13),
      textAlign: 'left',
    },
    freeDelivery: {
      color: colors.black,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      marginLeft: 5,
    },
    absolute: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      height: moderateScaleVertical(54),
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: moderateScaleVertical(5),
    },

    textStyle2: {
      color: themeColors?.primary_color,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      // opacity: 0.6,
    },
    updateBilling: {
      color: colors.white,
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      textAlign: 'left',
    },
    imageBackground: {
      width: '100%',
      minHeight: moderateScaleVertical(166),
      borderRadius: moderateScale(15),
    },
    titleBagView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: moderateScale(10),
      alignItems: 'center',
      marginTop: moderateScaleVertical(17),
    },
    descriptionView: {
      flexDirection: 'row',
      marginHorizontal: moderateScale(10),
      marginTop: moderateScale(10),
    },
    subscriptionView: {
      marginTop: 'auto',
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScaleVertical(15),
    },
    subscribeBtn: {
      height: moderateScaleVertical(29),
      backgroundColor: colors.white,
      paddingHorizontal: moderateScale(20),
      borderRadius: moderateScale(7),
    },
  });
  return styles;
}
export default React.memo(SubscriptionComponent2);
