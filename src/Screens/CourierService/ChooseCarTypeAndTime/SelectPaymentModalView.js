import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import { getImageUrl } from '../../../utils/helperFunctions';
import stylesFun from './styles';

export default function SelectPaymentModalView({
  isLoading = false,
  onPressBack,
  _confirmAndPay,
  slectedDate = '',
  selectedTime = '',
  totalDistance = 0,
  totalDuration = 0,
  selectedCarOption,
  navigation = navigation,
  couponInfo = null,
  updatedPrice = null,
  removeCoupon,
  loyalityAmount = 0,
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  console.log(selectedCarOption, 'selectedCarOption');
  console.log(slectedDate, 'slectedDate');
  console.log(updatedPrice, 'updatedPrice');
  console.log(loyalityAmount, 'loyalityAmount');
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const styles = stylesFun({ fontFamily, themeColors });
  const commonStyles = commonStylesFun({ fontFamily });
  const { profile } = appData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
      () => {
        navigation.navigate(screenName, { data });
      };

  //Get list of all offers
  const _getAllOffers = (vendor, cartData) => {
    moveToNewScreen(navigationStrings.OFFERS, {
      vendor: vendor,
      cabOrder: true,
      // cartId: cartData.id,
    })();
  };

  return (
    <View
      style={
        isDarkMode
          ? [
            styles.bottomView,
            { backgroundColor: MyDarkTheme.colors.background },
          ]
          : styles.bottomView
      }>
      <ScrollView bounces={false}>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingTop: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity style={{ flex: 0.2 }} onPress={onPressBack}>
            <Image
              style={isDarkMode && { tintColor: MyDarkTheme.colors.text }}
              source={imagePath.backArrowCourier}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 0.6,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={1}
              style={
                isDarkMode
                  ? [styles.carType, { color: MyDarkTheme.colors.text }]
                  : styles.carType
              }>{`${slectedDate}  -  ${selectedTime}`}</Text>
          </View>
          <View style={{ flex: 0.2 }}></View>
        </View>

        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomColor: colors.borderColorD,
            borderBottomWidth: 1,
          }}>
          <View style={{ flex: 0.33 }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DISTANCE}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryValue
              }>
              {`${totalDistance} kms`}
            </Text>
          </View>
          <View style={{ flex: 0.33 }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DURATION}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryValue
              }>
              {totalDuration < 60
                ? `${totalDuration} mins`
                : `${(totalDuration / 60).toFixed(2)} hrs`}
            </Text>
          </View>
          <View style={{ flex: 0.33 }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {strings.DELIVERYFEE}
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.distanceDurationDeliveryValue,
                      {
                        textDecorationLine: updatedPrice
                          ? 'line-through'
                          : 'none',
                        opacity: updatedPrice ? 0.5 : 1,
                        color: MyDarkTheme.colors.text,
                      },
                    ]
                    : [
                      styles.distanceDurationDeliveryValue,
                      {
                        textDecorationLine: updatedPrice
                          ? 'line-through'
                          : 'none',
                        opacity: updatedPrice ? 0.5 : 1,
                      },
                    ]
                }>
                {selectedCarOption
                  ? `${tokenConverterPlusCurrencyNumberFormater(
                    Number(selectedCarOption?.variant[0]?.multiplier) *
                    Number(selectedCarOption?.variant[0]?.price),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}`
                  : ''}
              </Text>
              {updatedPrice && (
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.distanceDurationDeliveryValue,
                        { color: MyDarkTheme.colors.text },
                      ]
                      : styles.distanceDurationDeliveryValue
                  }>
                  {tokenConverterPlusCurrencyNumberFormater(
                    Number(selectedCarOption.tags_price) -
                      Number(updatedPrice) >
                      0
                      ? Number(selectedCarOption.tags_price) -
                      Number(updatedPrice)
                      : 0,
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}
                </Text>
              )}
              {/* <TouchableOpacity
                style={{marginLeft: 10, justifyContent: 'center'}}>
                <Image source={imagePath.toolTip} />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: moderateScale(20),
            paddingVertical: moderateScale(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{ flex: 0.3, justifyContent: 'center' }}>
            <View
              style={{
                // borderRadius: moderateScale(28 / 2),
                // backgroundColor: colors.textGreyK,
                // width: 60,
                height: moderateScale(28),
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Image
                style={{ height: 40, width: 100 }}
                source={
                  selectedCarOption?.media.length &&
                    selectedCarOption?.media[0]?.image?.path
                    ? {
                      uri: getImageUrl(
                        selectedCarOption?.media[0]?.image?.path?.image_fit,
                        selectedCarOption?.media[0]?.image?.path?.image_path,
                        '500/500',
                      ),
                    }
                    : imagePath.user
                }
              />
              {/* <View
                style={{
                  backgroundColor: themeColors.primary_color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: moderateScale(28),
                  width: moderateScale(28),
                  borderRadius: moderateScale(28 / 2),
                }}>
                <Image source={imagePath.briefcase} />
              </View> */}
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ justifyContent: 'center' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.distanceDurationDeliveryValue,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.distanceDurationDeliveryValue
                }>
                {selectedCarOption?.translation.length
                  ? selectedCarOption?.translation[0].title
                  : ''}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.distanceDurationDeliveryLable,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.distanceDurationDeliveryLable
                }>
                {totalDuration < 60
                  ? `${totalDuration} mins`
                  : `${(totalDuration / 60).toFixed(2)} hrs`}
              </Text>
            </View>

            {/* <TouchableOpacity style={{justifyContent: 'center'}}>
              <Image source={imagePath.chev_down} />
            </TouchableOpacity> */}
          </View>
        </View>
        {!!loyalityAmount && (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: moderateScale(20),
              justifyContent: 'space-between',
            }}>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryLable,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryLable
              }>
              {'Loyalty'}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [
                    styles.distanceDurationDeliveryValue,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.distanceDurationDeliveryValue
              }>
              {`-${tokenConverterPlusCurrencyNumberFormater(
                Number(selectedCarOption?.variant[0]?.multiplier) *
                Number(loyalityAmount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}`}
            </Text>
          </View>
        )}

        <TouchableOpacity
          // disabled={item?.couponData ? true : false}
          onPress={() => _getAllOffers(selectedCarOption, '')}
          style={styles.offersViewB}>
          {couponInfo ? (
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={{ flex: 0.7, flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ tintColor: themeColors.primary_color }}
                  source={imagePath.percent}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.viewOffers, { marginLeft: moderateScale(10) }]}>
                  {`${strings.CODE} ${couponInfo?.name} ${strings.APPLYED}`}
                </Text>
              </View>
              <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                {/* <Image source={imagePath.crossBlueB}  /> */}
                <Text
                  onPress={removeCoupon}
                  style={[styles.removeCoupon, { color: colors.cartItemPrice }]}>
                  {strings.REMOVE}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ tintColor: themeColors.primary_color }}
                source={imagePath.percent}
              />
              <Text
                style={[styles.viewOffers, { marginLeft: moderateScale(10) }]}>
                {strings.APPLY_PROMO_CODE}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      <View
        style={{
          marginVertical: moderateScaleVertical(10),
          marginHorizontal: moderateScale(20),
        }}>
        <GradientButton
          colorsArray={[themeColors.primary_color, themeColors.primary_color]}
          textStyle={{ textTransform: 'none', fontSize: textScale(16) }}
          onPress={_confirmAndPay}
          // marginTop={moderateScaleVertical(10)}
          marginBottom={moderateScaleVertical(5)}
          btnText={strings.CONFRIMANDPAY}
        />
        <View>
          <Text style={styles.bottomAcceptanceText}>
            {strings.BYCONFIRMING}
          </Text>
          <Text style={styles.bottomAcceptanceText}>
            {strings.DOESNTCONTAIN}
            <Text style={{ color: themeColors.primary_color }}>
              {strings.ILLEGAL_ITESM}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
