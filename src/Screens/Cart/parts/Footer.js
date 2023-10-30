import { isEmpty } from 'lodash';
import React from 'react';
import {
  Alert,
  FlatList,
  I18nManager,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import DeviceInfo, { getBundleId } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {
  moderateScale,
  moderateScaleVertical,
  textScale
} from '../../../styles/responsiveSize';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import colors from '../../../styles/colors';
import imagePath from '../../../constants/imagePath';
import ButtonComponent from '../../../Components/ButtonComponent';
import { hitSlopProp } from '../../../styles/commonStyles';
import { MyDarkTheme } from '../../../styles/theme';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import strings from '../../../constants/lang';

function Footer(props) {
  const { instruction, preferences, showTaxFeeArea, selectedTipAmount, userData, scheduleType, isDarkMode, styles, fontFamily, codMinAmount, selectedPayment, digit_after_decimal, additional_preferences, currencies, cartData, businessType, localeDropOffDate, appData, placeLoader, _selectTime, localeSheduledOrderDate, placeOrder, selectedTipvalue, _onGiftBoxSelection, themeColors, isGiftBoxSelected, setAppSessionRedirection, updateState, selectedTip, setInstruction, setSelectedTipAmount, clearSceduleDate, _selectTimeLaundry, laundrySelectedPickupDate, laundrySelectedDropOffDate, laundrySelectedPickupSlot, laundrySelectedDropOffSlot, pickupDriverComment, setPickupDriverComment, dropOffDriverComment, setDropOffDriverComment, vendorComment, _renderUpSellProducts, _renderCrossSellProducts, onSelectPaymentMethod = () => { }, dineInType = '', cartItems, setVendorComment = null, onCategoryKYC, containerStyle } = props;
  const foundRecurringProduct = cartData?.products?.some(item => {
    return item?.vendor_products.some(item => item?.is_recurring_booking)
  })
  return (
    <View style={{}}>
      {!!cartData?.category_kyc_count && !!userData?.auth_token && (
        <ButtonComponent
          onPress={onCategoryKYC}
          btnText={strings.CATEGORY_KYC}
          borderRadius={moderateScale(13)}
          textStyle={{ color: colors.white, textTransform: 'none' }}
          containerStyle={containerStyle}
          placeLoader={false}
        />
      )}

      <TextInput
        value={instruction}
        onChangeText={(text) => setInstruction(text)}
        multiline={true}
        numberOfLines={4}
        style={{
          ...styles.instructionView,
          backgroundColor: isDarkMode
            ? colors.whiteOpacity15
            : colors.greyNew,
        }}
        placeholderTextColor={
          isDarkMode ? colors.whiteOpacity77 : colors.textGreyB
        }
        placeholder={strings.SPECIAL_INSTRUCTION}
        returnKeyType={'next'}
      />

      {/* Laundry Section only */}
      {!!(businessType == 'laundry') && (
        <View style={styles.laundrySection}>
          <View>
            <View style={{ flex: 0.5, flexWrap: 'wrap' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.LaundryApppriceItemLabel,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.LaundryApppriceItemLabel
                }>
                {strings.COMMENTFORPICKUPDRIVER}
              </Text>
            </View>
            <View style={{ flex: 0.5, marginTop: moderateScale(5) }}>
              <TextInput
                value={pickupDriverComment}
                onChangeText={(text) => setPickupDriverComment(text)}
                placeholder={strings.PLACEHOLDERCOMMENTFORPICKUPDRIVER}
                style={{
                  height: 40,
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyOpcaity7,
                  backgroundColor: colors.white,
                }}
                returnKeyType={'done'}
                placeholderTextColor={
                  isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyOpcaity7
                }
              />
            </View>
          </View>
          <View style={{ marginTop: moderateScale(15) }}>
            <View style={{ flex: 0.5, flexWrap: 'wrap' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.LaundryApppriceItemLabel,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.LaundryApppriceItemLabel
                }>
                {strings.COMMENTFORDROPUPDRIVER}
              </Text>
            </View>
            <View style={{ flex: 0.5, marginTop: moderateScale(5) }}>
              <TextInput
                value={dropOffDriverComment}
                onChangeText={(text) => setDropOffDriverComment(text)}
                placeholder={strings.PLACEHOLDERCOMMENTFORDROPUPDRIVER}
                style={{
                  height: 40,
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyOpcaity7,
                  backgroundColor: colors.white,
                }}
                returnKeyType={'done'}
                placeholderTextColor={
                  isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyOpcaity7
                }
              />
            </View>
          </View>
          <View style={{ marginTop: moderateScale(15) }}>
            <View style={{ flex: 0.5, flexWrap: 'wrap' }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.LaundryApppriceItemLabel,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.LaundryApppriceItemLabel
                }>
                {strings.COMMENTFORVENDOR}
              </Text>
            </View>
            <View style={{ flex: 0.5, marginTop: moderateScale(5) }}>
              <TextInput
                placeholder={strings.PLACEHOLDERCOMMENTFORVENDOR}
                value={vendorComment}
                onChangeText={(text) => setVendorComment(text)}
                style={{
                  height: 40,
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyOpcaity7,
                  backgroundColor: colors.white,
                }}
                returnKeyType={'done'}
                placeholderTextColor={
                  isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyOpcaity7
                }
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: moderateScale(20),
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => _selectTimeLaundry('pickup')}
              style={{ flex: 0.5, flexDirection: 'row' }}>
              <Image source={imagePath.pickUpSchedule} />
              <View>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.LaundryApppriceItemLabel2,
                        { color: MyDarkTheme.colors.text },
                      ]
                      : styles.LaundryApppriceItemLabel2
                  }>
                  {strings.SCEDULEPICKUP}
                </Text>
                {/* Schedule Pickup */}
                {laundrySelectedPickupDate && (
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.LaundryApppriceItemLabel3,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      marginLeft: 0,
                    }}>
                    {laundrySelectedPickupDate
                      ? laundrySelectedPickupDate
                      : ''}
                    {', '}
                    {laundrySelectedPickupSlot
                      ? laundrySelectedPickupSlot
                      : ''}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => _selectTimeLaundry('dropoff')}
              style={{ flex: 0.5, flexDirection: 'row' }}>
              <Image source={imagePath.dropOffSchedule} />
              <View>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.LaundryApppriceItemLabel2,
                        { color: MyDarkTheme.colors.text },
                      ]
                      : styles.LaundryApppriceItemLabel2
                  }>
                  {strings.SCEDULEDROP}
                </Text>

                {!!(businessType !== 'laundry' && localeDropOffDate) && (
                  <Text
                    numberOfLines={2}
                    style={
                      isDarkMode
                        ? [
                          styles.LaundryApppriceItemLabel3,
                          { color: MyDarkTheme.colors.text },
                        ]
                        : styles.LaundryApppriceItemLabel3
                    }>
                    {localeDropOffDate
                      ? localeDropOffDate
                      : strings.SCEDULEDROP}
                  </Text>
                )}

                {laundrySelectedDropOffDate && (
                  <Text
                    numberOfLines={2}
                    style={{
                      ...styles.LaundryApppriceItemLabel3,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.black,
                      marginLeft: 0,
                    }}>
                    {laundrySelectedDropOffDate
                      ? laundrySelectedDropOffDate
                      : ''}
                    {', '}
                    {laundrySelectedDropOffSlot
                      ? laundrySelectedDropOffSlot
                      : ''}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* tip_before_order view start */}

      {!!appData?.profile?.preferences?.tip_before_order &&
        !!cartData?.tip &&
        cartData?.tip.length > 0 && (
          <View
            style={[
              styles.bottomTabLableValue,
              {
                flexDirection: 'column',
              },
            ]}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceTipLabel, { color: MyDarkTheme.colors.text }]
                  : [styles.priceTipLabel]
              }>
              {preferences?.want_to_tip_nomenclature != '' &&
                preferences?.want_to_tip_nomenclature != null
                ? preferences?.want_to_tip_nomenclature
                : strings.DOYOUWANTTOGIVEATIP}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}>
              {cartData?.total_payable_amount !== 0 &&
                cartData?.tip.map((j, jnx) => {
                  return (
                    <TouchableOpacity
                      key={String(jnx)}
                      style={{
                        ...styles.tipArrayStyle,
                        backgroundColor:
                          selectedTipvalue?.value == j?.value
                            ? themeColors.primary_color
                            : 'transparent',
                        flex: 0.18,
                      }}
                      onPress={() => selectedTip(j)}>
                      <Text
                        style={{
                          color:
                            selectedTipvalue?.value == j?.value
                              ? colors.white
                              : isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.black,
                        }}>
                        {tokenConverterPlusCurrencyNumberFormater(
                          j?.value,
                          digit_after_decimal,
                          additional_preferences,
                          currencies?.primary_currency?.symbol,
                        )}
                      </Text>
                      <Text
                        style={{
                          color:
                            selectedTipvalue?.value == j?.value
                              ? colors.white
                              : colors.textGreyB,
                        }}>
                        {j.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

              {cartData?.total_payable_amount !== 0 && (
                <TouchableOpacity
                  style={[
                    styles.tipArrayStyle2,
                    {
                      backgroundColor:
                        selectedTipvalue == 'custom'
                          ? themeColors.primary_color
                          : 'transparent',
                      flex: cartData?.total_payable_amount !== 0 ? 0.45 : 0.2,
                    },
                  ]}
                  onPress={() => selectedTip('custom')}>
                  <Text
                    style={
                      isDarkMode
                        ? {
                          color:
                            selectedTipvalue == 'custom'
                              ? colors.white
                              : MyDarkTheme.colors.text,
                        }
                        : {
                          color:
                            selectedTipvalue == 'custom'
                              ? colors.white
                              : colors.black,
                        }
                    }>
                    {strings.CUSTOM}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {!!selectedTipvalue && selectedTipvalue == 'custom' && (
              <View
                style={{
                  borderRadius: 5,
                  borderWidth: 0.5,
                  borderColor: colors.textGreyB,
                  height: 40,
                  marginTop: moderateScaleVertical(8),
                }}>
                <TextInput
                  value={selectedTipAmount}
                  onChangeText={(text) => setSelectedTipAmount(text)}
                  style={{
                    height: 40,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7,
                  }}
                  maxLength={5}
                  returnKeyType={'done'}
                  keyboardType={'number-pad'}
                  placeholder={strings.ENTER_CUSTOM_AMOUNT}
                  placeholderTextColor={
                    isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyOpcaity7
                  }
                />
              </View>
            )}
          </View>
        )}
      {/* tip_before_order view end */}

      {appData?.profile?.preferences?.gifting == 1 && (
        <View
          style={{
            borderTopWidth: 0.8,
            borderBottomWidth: 0.8,
            paddingVertical: moderateScaleVertical(8),
            borderColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.lightGreyBg,
          }}>
          <TouchableOpacity
            onPress={_onGiftBoxSelection}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 16,
            }}
            activeOpacity={1}>
            <Image
              style={{ tintColor: themeColors.primary_color }}
              source={
                isGiftBoxSelected
                  ? imagePath.checkBox2Active
                  : imagePath.checkBox2InActive
              }
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: moderateScale(12),
              }}>
              <Image
                source={imagePath.icGiftIcon}
                style={{
                  marginTop: moderateScale(-3),
                  tintColor: colors.blackOpacity43,
                }}
              />
              <Text
                style={{
                  ...styles.priceTipLabel,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.blackOpacity43,
                  marginLeft: moderateScale(6),
                }}>
                {strings.DOES_THIS_INCLUDE_GIFT}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomTabLableValue}>
        <Text
          style={
            isDarkMode
              ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
              : styles.priceItemLabel
          }>
          {strings.SUBTOTAL}
        </Text>

        {/* V2 APi  */}

        {/* <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.sub_total) +
              Number(
                cartData?.total_container_charges
                  ? cartData?.total_container_charges
                  : 0
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text> */}
        {/* V1 APi  */}
        <Text
          style={
            isDarkMode
              ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
              : styles.priceItemLabel
          }>
          {tokenConverterPlusCurrencyNumberFormater(
            Number(cartData?.gross_paybale_amount ? cartData?.gross_paybale_amount : cartData?.sub_total ? cartData?.sub_total : 0) +
            Number(
              cartData?.total_container_charges
                ? cartData?.total_container_charges
                : 0
            ),
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
          )}
        </Text>
      </View>
      {Number(cartData?.delivery_slot_amount) > 0 && (
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {strings.DELIVERY_SLOT_FEES}
          </Text>

          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.delivery_slot_amount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      )}
      {Number(cartData?.additional_price) > 0 ? (
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {strings.ADDITIONAL_CHARGES}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.additional_price),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      ) : null}

      {/* total_delivery_fee */}
      {/* V1 v2 changes */}
      {!!(cartData?.total_delivery_fee) || !!(cartData?.delivery_charges) ? (
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {appIds?.meatEasy == DeviceInfo.getBundleId()
              ? strings?.DELIVERY_FEE
              : strings.TOTAL_DELIVERY_FEE}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(
                cartData?.total_delivery_fee
                  ? cartData?.total_delivery_fee
                  : cartData?.delivery_charges
                    ? cartData?.delivery_charges : 0,
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      ) : null}

      {!!cartData?.wallet_amount && (
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {strings.WALLET}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.wallet_amount ? cartData?.wallet_amount : 0),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      )}

      {!!cartData?.total_discount_amount && (
        <View style={styles.bottomTabLableValue}>
          <Text style={styles.priceItemLabel}>{strings.TOTAL_DISCOUNT}</Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(
                cartData?.total_discount_amount
                  ? cartData?.total_discount_amount
                  : 0,
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
        </View>
      )}

      {!!cartData?.loyalty_amount && (
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {strings.LOYALTY}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.loyalty_amount ? cartData?.loyalty_amount : 0),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
        </View>
      )}

      {!!Number(cartData?.total_fixed_fee_amount) && (
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {preferences?.fixed_fee_nomenclature != '' &&
              preferences?.fixed_fee_nomenclature != null
              ? preferences?.fixed_fee_nomenclature
              : strings.FIXED_FEE}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(
                cartData?.total_fixed_fee_amount
                  ? cartData?.total_fixed_fee_amount
                  : 0,
              ),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>
      )}
      {console.log(cartData?.total_service_fee, "cartData?.total_service_fee")}

      {!!Number(cartData?.total_service_fee) > 0 && (
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }
          >
            {"Service Fee"}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }
          >{`${tokenConverterPlusCurrencyNumberFormater(
            Number(cartData?.total_service_fee),
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol
          )}`}</Text>
        </View>
      )}

      {/* {!!Number(cartData?.total_container_charges) && (
          <View style={styles.bottomTabLableValue}>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }>
              {strings.TOTALCONTAINERCHARGES}
            </Text>
            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_container_charges),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </View>
        )} */}

      {!!cartData?.wallet_amount_used && (
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {strings.WALLET}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
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
      {!!cartData?.total_subscription_discount && (
        <View style={styles.bottomTabLableValue}>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {strings.TOTALSUBSCRIPTION}
          </Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>{`-${tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.total_subscription_discount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}`}</Text>
        </View>
      )}

      {(cartData?.total_tax > 0 || cartData?.total_taxable_amount > 0) && (
        <Animatable.View
          style={{
            ...styles.bottomTabLableValue,
            marginTop: moderateScale(8),
            marginBottom: moderateScale(2),
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            hitSlop={hitSlopProp}
            onPress={() => updateState({ showTaxFeeArea: !showTaxFeeArea })}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  ...styles.priceItemLabel,
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.textGreyB,
                }}>
                {strings.TAXES_FEES}
                {/* {`Taxes`} */}
              </Text>

              <Image
                source={imagePath.dropDownNew}
                style={{
                  transform: [{ scaleY: showTaxFeeArea ? -1 : 1 }],
                  marginHorizontal: moderateScale(2),
                }}
              />
            </View>
          </TouchableOpacity>

          <Text
            style={
              isDarkMode
                ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                : styles.priceItemLabel
            }>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(cartData?.total_tax ? cartData?.total_tax : 0),
              // + Number(cartData?.total_taxable_amount
              //   ? cartData?.total_taxable_amount
              //   : 0),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol
            )}
          </Text>
        </Animatable.View>
      )
      }
      {
        !!preferences?.advance_booking_amount &&
        cartData?.advance_payable_amount > 0 && (
          <Animatable.View
            style={{
              ...styles.bottomTabLableValue,
              marginTop: moderateScale(8),
              marginBottom: moderateScale(2),
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              hitSlop={hitSlopProp}
              onPress={() => updateState({ showTaxFeeArea: !showTaxFeeArea })}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    ...styles.priceItemLabel,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  }}
                >
                  {"Advance Payable Amount"}
                </Text>
              </View>
            </TouchableOpacity>

            <Text
              style={
                isDarkMode
                  ? [
                    styles.priceItemLabel,
                    { color: MyDarkTheme.colors.text },
                  ]
                  : styles.priceItemLabel
              }
            >
              {" "}
              {tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.advance_payable_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol
              )}
            </Text>
          </Animatable.View>
        )
      }
      {
        !!preferences?.advance_booking_amount && cartData?.pending_amount > 0 && (
          <Animatable.View
            style={{
              ...styles.bottomTabLableValue,
              marginTop: moderateScale(8),
              marginBottom: moderateScale(2),
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              hitSlop={hitSlopProp}
              onPress={() => updateState({ showTaxFeeArea: !showTaxFeeArea })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    ...styles.priceItemLabel,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  }}>
                  {'Advance Payable Amount'}
                </Text>
              </View>
            </TouchableOpacity>

            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }>
              {' '}
              {tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.pending_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </Animatable.View>
        )
      }
      {
        !!preferences?.advance_booking_amount &&
        cartData?.total_amount > 0 && (
          <Animatable.View
            style={{
              ...styles.bottomTabLableValue,
              marginTop: moderateScale(8),
              marginBottom: moderateScale(2),
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              hitSlop={hitSlopProp}
              onPress={() => updateState({ showTaxFeeArea: !showTaxFeeArea })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={{
                    ...styles.priceItemLabel,
                    color: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.textGreyB,
                  }}>
                  {'Total Amount'}
                </Text>
              </View>
            </TouchableOpacity>

            <Text
              style={
                isDarkMode
                  ? [styles.priceItemLabel, { color: MyDarkTheme.colors.text }]
                  : styles.priceItemLabel
              }>
              {' '}
              {tokenConverterPlusCurrencyNumberFormater(
                Number(cartData?.total_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}{' '}
            </Text>
          </Animatable.View>
        )
      }

      {
        showTaxFeeArea && (
          <View>
            <Animatable.View
              animation="fadeIn"
              style={{
                marginLeft: moderateScale(10),
                borderWidth: moderateScale(0.4),
                marginRight: moderateScale(5),
              }}>
              {/* {cartData?.total_service_fee > 0 && (
                <View
                  style={{...styles.bottomTabLableValue, marginVertical: 1}}>
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>
                    {strings.TOTAL_SERVICE_FEE}
                  </Text>

                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>
                    {tokenConverterPlusCurrencyNumberFormater(
                      Number(
                        cartData?.total_service_fee
                          ? cartData?.total_service_fee
                          : 0
                      ),
                      digit_after_decimal,
                      additional_preferences,
                      currencies?.primary_currency?.symbol
                    )}{" "}
                  </Text>
                </View>
              )} */}

              {

                !isEmpty(cartData?.specific_taxes) &&
                cartData?.specific_taxes.map((val, index) => {
                  return (
                    <View>
                      {val?.value > 0 && (
                        <View
                          style={{
                            ...styles.bottomTabLableValue,
                            marginVertical: 1,
                          }}>
                          <Text
                            style={{
                              ...styles.priceItemLabel,
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.textGreyB,
                              fontSize: textScale(11),
                            }}>
                            {val?.label}
                          </Text>
                          <Text
                            style={{
                              ...styles.priceItemLabel,
                              color: isDarkMode
                                ? MyDarkTheme.colors.text
                                : colors.textGreyB,
                              fontSize: textScale(11),
                            }}>{`${currencies?.primary_currency?.symbol
                              }${Number(val?.value ? val?.value : 0).toFixed(
                                appData?.profile?.preferences?.digit_after_decimal,
                              )}`}</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              }

              {/* {cartData?.tax_details.map((val) => {
                return (
                  <View>
                    {val?.value > 0 && (
                  <View
                    style={{ ...styles.bottomTabLableValue, marginVertical: 1 }}
                  >
                    <Text
                      style={{
                        ...styles.priceItemLabel,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGreyB,
                        fontSize: textScale(11),
                      }}
                    >
                      {val?.identifier}
                    </Text>

                    <Text
                      style={{
                        ...styles.priceItemLabel,
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGreyB,
                        fontSize: textScale(11),
                      }}
                    >
                      {" "}
                      {tokenConverterPlusCurrencyNumberFormater(
                        Number(val?.tax_amount ? val?.tax_amount : 0),
                        digit_after_decimal,
                        additional_preferences,
                        currencies?.primary_currency?.symbol
                      )}
                    </Text>
                  </View>
                );
              })} */}
              {/* {cartData?.total_tax > 0 && (
                
                <View
                  style={{ ...styles.bottomTabLableValue, marginVertical: 1 }}>
                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>
                    {strings.TAX_AMOUNT}
                  </Text>

                  <Text
                    style={{
                      ...styles.priceItemLabel,
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyB,
                      fontSize: textScale(11),
                    }}>{`${currencies?.primary_currency?.symbol}${Number(
                      cartData?.total_tax ? cartData?.total_tax : 0,
                    ).toFixed(
                      appData?.profile?.preferences?.digit_after_decimal,
                    )}`}</Text>
                </View>
              )} */}
            </Animatable.View >
          </View >
        )
      }

      <View style={styles.amountPayable}>
        <Text
          style={{
            ...styles.priceItemLabel2,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {strings.AMOUNT_PAYABLE}
        </Text>
        <Text
          style={
            isDarkMode
              ? [styles.priceItemLabel2, { color: MyDarkTheme.colors.text }]
              : styles.priceItemLabel2
          }>
          {tokenConverterPlusCurrencyNumberFormater(
            Number(cartData?.total_payable_amount) +
            (selectedTipAmount != null && selectedTipAmount != ''
              ? Number(selectedTipAmount)
              : 0),
            digit_after_decimal,
            additional_preferences,
            currencies?.primary_currency?.symbol,
          )}
        </Text>
      </View>

      {
        cartData &&
        Number(cartData?.total_payable_amount) +
        (selectedTipAmount != null && selectedTipAmount != ''
          ? Number(selectedTipAmount)
          : 0) >
        0 && (
          <TouchableOpacity
            onPress={onSelectPaymentMethod}
            style={{
              ...styles.paymentMainView,
              backgroundColor: isDarkMode
                ? MyDarkTheme.colors.lightDark
                : colors.greyNew,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FastImage
                source={imagePath.paymentMethod}
                resizeMode="contain"
                style={{
                  width: moderateScale(32),
                  height: moderateScale(32),
                }}
                tintColor={
                  isDarkMode ? MyDarkTheme.colors.text : colors.black
                }
              />

              <Text
                style={{
                  ...styles.priceItemLabel2,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  marginLeft: moderateScale(4),
                }}>
                {selectedPayment.title_lng
                  ? selectedPayment.title_lng
                  : selectedPayment.title
                    ? selectedPayment.title
                    : strings.SELECT_PAYMENT_METHOD}
              </Text>
            </View>
            <View>
              <FastImage
                source={imagePath.goRight}
                resizeMode="contain"
                style={{
                  width: moderateScale(14),
                  height: moderateScale(14),
                  transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
                }}
                tintColor={
                  isDarkMode ? MyDarkTheme.colors.text : colors.black
                }
                transform={[{ scaleX: I18nManager.isRTL ? -1 : 1 }]}
              />
            </View>
          </TouchableOpacity>
        )
      }

      {
        !isEmpty(codMinAmount) && Number(orderAmount) <= Number(codMinAmount) && (
          <View
            style={styles.codmessageView}>
            <Text
              style={{
                color: isDarkMode ? colors.white : colors.grayOpacity51,

                marginTop: moderateScale(-5),
              }}>
              {'*'}
            </Text>
            <Text
              style={{
                fontSize: textScale(10),
                textAlign: 'left',

                color: isDarkMode ? colors.white : colors.grayOpacity51,
              }}>{`Cash on delivery only available for amount greater then. ${codMinAmount}`}</Text>
          </View>
        )
      }
      {
        !!(
          userData?.auth_token &&
          !appData?.profile?.preferences?.off_scheduling_at_cart &&
          businessType !== 'laundry' &&
          !cartData?.cart_error_message
        ) &&
        !!(scheduleType == 'schedule' && localeSheduledOrderDate) && (
          <TouchableOpacity
            style={{
              marginTop: moderateScale(16),
              marginLeft: moderateScale(16),
              alignSelf: 'flex-start',
            }}
            onPress={
              !!cartData?.editing_order?.id
                ? () =>
                  Alert.alert(
                    'Info',
                    "you can't clear schedule date for  this order",
                    [
                      {
                        text: strings.CANCEL,
                        onPress: () => console.log('Cancel Pressed'),
                      },
                      { text: strings.OK, onPress: () => console.log('') },
                    ],
                  )
                : clearSceduleDate
            }>
            <Text
              style={{
                fontFamily: fontFamily?.bold,
                color: themeColors.primary_color,
                textAlign: 'left',
              }}>
              {strings.CLEAR_SCHEDULE_DATE}
            </Text>
          </TouchableOpacity>
        )
      }


      {
        !!(
          cartData?.deliver_status || cartData?.closed_store_order_scheduled
        ) && !cartData?.cart_error_message ? (
          <View
            pointerEvents={placeLoader ? 'none' : 'auto'}
            style={styles.paymentView}>

            {!!(
              userData?.auth_token &&
              !appData?.profile?.preferences?.off_scheduling_at_cart && !foundRecurringProduct &&
              businessType !== 'laundry' && dineInType !== 'appointment'
            ) && (
                <ButtonComponent
                  onPress={
                    !!cartData?.editing_order?.id
                      ? () =>
                        Alert.alert('Info', "you can't reschedule this order", [
                          {
                            text: strings.CANCEL,
                            onPress: () => console.log('Cancel Pressed'),
                          },
                          { text: strings.OK, onPress: () => console.log('') },
                        ])
                      : _selectTime
                  }
                  btnText={
                    localeSheduledOrderDate
                      ? localeSheduledOrderDate
                      : strings.SCHEDULE_ORDER
                  }
                  borderRadius={moderateScale(13)}
                  textStyle={{
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}
                  containerStyle={{
                    ...styles.placeOrderButtonStyle,
                    backgroundColor: colors.transparent,
                    borderColor: isDarkMode
                      ? MyDarkTheme.colors.text
                      : colors.black,
                    borderWidth: 0.8,
                  }}
                />
              )}
            {!(getBundleId() == appIds.wow && !appData?.profile?.preferences?.off_scheduling_at_cart && isEmpty(localeSheduledOrderDate) && (dineInType == 'appointment' ? (cartItems?.some(item => item?.scheduled_date_time == null)) : true)) && (
              <ButtonComponent
                onPress={placeOrder}
                btnText={strings.PLACE_ORDER}
                borderRadius={moderateScale(13)}
                textStyle={{ color: colors.white }}
                containerStyle={styles.placeOrderButtonStyle}
                placeLoader={placeLoader}
              />
            )}
          </View>
        ) : cartData?.cart_error_message ? (
          <View style={styles.cartErrorMessageContainer}>
            <Text style={{ fontFamily: fontFamily.medium, color: colors.redB }}>
              {cartData?.cart_error_message}
            </Text>
          </View>
        ) : null
      }
      {
        !!cartData &&
        !!cartData?.upSell_products &&
        !!cartData?.upSell_products.length > 0 && (
          <View
            style={{
              ...styles.suggetionView,
              marginTop: cartData?.deliver_status ? 0 : moderateScale(10),
            }}>
            <Text
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.FREQUENTLY_BOUGHT_TOGETHER}
            </Text>
            <View style={{ height: moderateScaleVertical(16) }} />
            <FlatList
              data={cartData?.upSell_products || []}
              renderItem={_renderUpSellProducts}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item, index) => String(index)}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    marginRight: moderateScale(16),
                  }}
                />
              )}
              ListFooterComponent={() => (
                <View style={{ marginRight: moderateScale(16) }} />
              )}
            />
          </View>
        )
      }
      {
        !!cartData &&
        !!cartData?.crossSell_products &&
        !!cartData?.crossSell_products.length > 0 && (
          <View style={{ ...styles.suggetionView }}>
            <Text
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.YOU_MIGHT_INTERESTED}
            </Text>
            <View style={{ height: moderateScaleVertical(16) }} />
            <FlatList
              data={cartData?.crossSell_products || []}
              renderItem={_renderCrossSellProducts}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    marginRight: moderateScale(16),
                  }}
                />
              )}
              ListFooterComponent={() => (
                <View style={{ marginRight: moderateScale(16) }} />
              )}
            />
          </View>
        )
      }
      <View
        style={{
          height: moderateScaleVertical(80),
          backgroundColor: colors.transparent,
        }}
      />
    </View >
  );
};

export default React.memo(Footer);