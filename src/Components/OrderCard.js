import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import { tokenConverterPlusCurrencyNumberFormater } from '../utils/commonFunction';
import { getImageUrl } from '../utils/helperFunctions';
import ButtonWithLoader from './ButtonWithLoader';
import {StartPrinting} from '../Screens/PrinterConnection/PrinteFunc';
import { useDarkMode } from 'react-native-dynamic';
import moment from 'moment';

const OrderCard = (props) => {
  const {
    item = {},
    onPress = () => { },
    updateOrderStatus,
    isBleDevice = false,
    index,
  } = props;
  let count = item.item_count - 1;
  const {
    appData,
    allAddresss,
    themeColors,
    currencies,
    languages,
    appStyle,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
const [localTime,setLocaleTime] = useState(null)
  const {additional_preferences, digit_after_decimal} = appData?.profile?.preferences || {};
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  console.log(item,"itemm>>")
  const date =new Date(item?.date_time)
  var createdDateTime = moment.utc(date, 'YYYY-MM-DD HH:mm').unix()
  var LocalTimeSelected = new Date(createdDateTime * 1000);
  console.log(LocalTimeSelected,"createdDateTimecreatedDateTimecreatedDateTime");



  return (
    <View style={styles.container}>
      {!!(Platform.OS === 'android' && isBleDevice) && (
        <View
          style={{
            alignSelf: 'flex-end',
            marginBottom: moderateScaleVertical(10),
          }}>
          <ButtonWithLoader
            btnText={strings.PRINT}
            btnTextStyle={{
              ...styles.btnText,
              color: colors.white,
              fontSize: textScale(12),
            }}
            btnStyle={{
              ...styles.btnContainer,
              backgroundColor: colors.themeColor2,
              marginLeft: moderateScale(10),
              height: moderateScaleVertical(25),
            }}
            onPress={() => StartPrinting({ id: item?.id })}
          />
          {/* <TouchableOpacity
                  onPress={() => StartPrinting({id: item?.id})}
                  style={styles.orderPrint}>
                  <Text
                    style={{
                      ...styles.btnText,
                      ...styles.orderStatusStyleSecond,
                    }}>
                    {strings.PRINT}
                  </Text>
                </TouchableOpacity> */}
        </View>
      )}
      <TouchableOpacity onPress={onPress}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.font13Regular}>
            {strings.ORDER} {item?.order_number}
          </Text>
          <Text style={styles.date}>{LocalTimeSelected.toString().slice(0,21)}
            </Text>
        </View>
        <View
          style={[
            styles.rowSapce,
            { flexDirection: 'column', alignItems: 'flex-start' },
          ]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                height: moderateScaleVertical(48),
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: moderateScale(8),
              }}>
              {item?.product_details?.map((val, index) => (
                <Image
                  key={index}
                  source={{
                    uri: getImageUrl(
                      val?.image_path?.image_fit,
                      val?.image_path?.image_path,
                      '500/500',
                    ),
                  }}
                  style={{
                    ...styles.image,
                    zIndex: -index,
                    marginLeft: index != 0 ? -moderateScale(20) : 0,
                  }}
                />
              ))}
            </View>
            
            <Text style={[styles.font16Regular, {flex: 1}]}>
              {item?.product_details && item?.product_details[0]
                ? item?.product_details[0].title
                : ''}{' '}
              {count == 0 ? '' : 'x' + ' ' + count + ' more'}
            </Text>
           
          </View>
          <Text
            style={{
              ...styles.font14Regular,
              color: '#35B300',
              // textAlign: 'right',
              // alignSelf: 'flex-end',
            }}>
            {item?.luxury_option_name}
          </Text>
          <Text
            style={{
              ...styles.font14Regular,
              color: '#35B300',
              textAlign: 'right',
              alignSelf: 'flex-end',
            }}>
            {item?.payment_option_title}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.line} />
      <View style={{ ...styles.rowSapce, marginTop: moderateScaleVertical(12) }}>
        <View>
          <Text style={styles.orderText}>{strings.ORDER_TOTAL}</Text>
          <Text style={styles.totalPrice}>
            {tokenConverterPlusCurrencyNumberFormater(
              Number(item?.payable_amount),
              digit_after_decimal,
              additional_preferences,
              currencies?.primary_currency?.symbol,
            )}
          </Text>
        </View>

        {item?.order_status?.current_status?.id != 1 ? (
          <View>
            <Text
              style={{
                fontFamily: fontFamily.medium,
                fontSize: 11,
                color: '#8B8B8B',
              }}>
              {strings.ORDER_STATUS}
            </Text>
            <Text
              style={{
                ...styles.font14Regular,
                color:
                  item?.order_status?.current_status?.id == 3
                    ? '#E02020'
                    : colors.black,
              }}>
              {item?.order_status?.current_status?.title}
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <ButtonWithLoader
              btnText={strings.REJECT}
              btnTextStyle={styles.btnText}
              btnStyle={styles.btnContainer}
              onPress={() => updateOrderStatus(item, 8)}
            />
            <ButtonWithLoader
              btnText={strings.CONFIRM}
              btnTextStyle={{ ...styles.btnText, color: colors.white }}
              btnStyle={{
                ...styles.btnContainer,
                backgroundColor: colors.themeColor2,
                marginLeft: moderateScale(10),
              }}
              onPress={() => updateOrderStatus(item, 7, index)}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  line: {
    borderWidth: 0.5,
    marginVertical: moderateScaleVertical(5),
    borderColor: '#9797972c',
  },
  font16Regular: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  font14Regular: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: textScale(24),
  },
  font13Regular: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.blackOpacity66,
  },
  container: {
    padding: moderateScale(16),
    backgroundColor: colors.whiteSmokeColor,
    marginBottom: moderateScaleVertical(16),
    borderRadius: moderateScale(6),
  },
  image: {
    backgroundColor: colors.white,
    // position: 'absolute',

    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(25),
  },
  date: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.blackOpacity66,
  },
  btnText: {
    color: colors.themeColor2,
    paddingHorizontal: moderateScale(8),
    textTransform: 'none',
  },
  btnContainer: {
    marginTop: 0,
    height: moderateScaleVertical(32),
    borderRadius: moderateScale(5),
    backgroundColor: colors.white,
    borderColor: colors.themeColor2,
  },
  orderText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: '#8B8B8B',
  },
  totalPrice: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.themeColor2,
    lineHeight: textScale(24),
  },
  rowSapce: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderStatusStyleSecond: {
    // color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: textScale(10),
    textAlign: 'center',
  },
});
