import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStylesFunc from '../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {tokenConverterPlusCurrencyNumberFormater} from '../utils/commonFunction';
import ButtonComponent from './ButtonComponent';

const OrderCardComponent = ({
  data = {},
  titlestyle,
  selectedTab,
  onPress,
  onPressRateOrder,
}) => {
  const cardWidth = width - 21.5;
  const {appData, currencies, languages, appStyle} = useSelector(
    (state) => state.initBoot,
  );
  const {additional_preferences, digit_after_decimal} = appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  return (
    <View
      style={{
        width: cardWidth,
        // ...commonStyles.shadowStyle,
        marginHorizontal: 2,
        justifyContent: 'center',
        padding: moderateScaleVertical(5),
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: 'rgba(201,215,225,0.19)',
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: moderateScaleVertical(10),
          }}>
          <Image source={imagePath.cart} />
          <Text
            style={{
              ...commonStyles.mediumFont16,
              ...titlestyle,
              marginLeft: moderateScale(10),
              color: colors.buyBgDark,
            }}>
            {'Supermarket'}
          </Text>
        </View> */}
      </View>

      <View
        style={{
          borderColor: colors.borderColorB,
          borderWidth: 1,
          margin: moderateScale(5),
          padding: moderateScale(15),
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.lableOrders}>
              {`${strings.ORDER_ID} : `}
              <Text style={styles.valueOrders}>{data?.order_number}</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.orderAddEditViews}>
              {selectedTab && selectedTab == strings.ACTIVE_ORDERS
                ? strings.VIEW_DETAIL
                : selectedTab == strings.PAST_ORDERS
                ? ''
                : strings.REPLACE_ORDERS}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
          }}>
          <Text style={styles.lableOrders}>
            {`${strings.TOTAL_AMOUNT} : `}
            <Text style={styles.valueOrders}>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(data?.payable_amount),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
          }}>
          <Text style={styles.lableOrders}>
            {`${strings.TOTAL_ITEMS} : `}
            <Text style={styles.valueOrders}>{data?.order_item_count}</Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
          }}>
          {/* 09 Oct, 2020, 11:00 PM */}
          <Text style={styles.lableOrders}>
            {`${strings.DATE_AND_TIME} : `}
            <Text style={styles.valueOrders}>{`${moment(
              data?.created_at,
            ).format('DD MMM,YYYY')} ${moment(data?.created_at).format(
              'LT',
            )} `}</Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
          }}>
          <Text style={styles.lableOrders}>
            {`${strings.ORDER_STATUS} : `}
            <Text style={styles.valueOrders}>{strings.ORDER_ACTIVE}</Text>
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginBottom: moderateScaleVertical(10),
          }}>
          <Text style={styles.lableOrders}>
            {`${strings.PAYMENT} : `}
            <Text style={styles.valueOrders}>{strings.CASH_ON_DELIVERY}</Text>
          </Text>
          {/* <Image source={imagePath.card} /> */}
        </View>
        {selectedTab && selectedTab == strings.PAST_ORDERS && (
          <View
            style={{
              alignItems: 'center',
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: moderateScaleVertical(10),
            }}>
            <ButtonComponent
              btnText={strings.REORDER}
              borderRadius={moderateScale(13)}
              containerStyle={{
                backgroundColor: 'rgba(67,162,231,0.3)',
                width: width / 3,
              }}
            />
            <TouchableOpacity onPress={onPressRateOrder}>
              <Text style={styles.rateOrder}>{strings.RATE_ORDER}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};
export function stylesFunc({fontFamily}) {
  const commonStyles = commonStylesFunc({fontFamily});

  const styles = StyleSheet.create({
    lableOrders: {
      ...commonStyles.mediumFont14Normal,
      color: colors.buyBgDark,
      lineHeight: moderateScaleVertical(19),
    },
    valueOrders: {
      color: colors.buyBgDark,
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      opacity: 0.6,
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
  });
  return styles;
}
export default React.memo(OrderCardComponent);
