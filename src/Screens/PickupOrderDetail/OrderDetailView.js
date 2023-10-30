import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import ScaledImage from 'react-native-scalable-image';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import TransparentButtonWithTxtAndIcon from '../../Components/TransparentButtonWithTxtAndIcon';
import {dummyUser} from '../../constants/constants';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {MyDarkTheme} from '../../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../../utils/commonFunction';
import {getImageUrl} from '../../utils/helperFunctions';
import stylesFun from './styles';

import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function OrderDetailView({
  isLoading = false,
  orderDetail = {},
  productDetail = {},
  onPressCall,
  onPressChat,
  agent_location,
  agent_image = null,
}) {
  //   console.log(selectedCarOption, 'selectedCarOption');
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};

  const fontFamily = appStyle?.fontSizeData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  console.log(productDetail, 'productDetail>>>');
  console.log(orderDetail, 'orderDetail>>>');
  console.log(agent_image, 'agent_image>>>');
  return (
    <>
      <View
        style={{
          marginBottom: -30,
          paddingHorizontal: 10,
          zIndex: 1000,
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.background
            : colors.white,
        }}>
        <ScaledImage
          width={width / 3}
          source={
            productDetail?.product_details &&
            productDetail?.product_details.length
              ? {
                  uri: getImageUrl(
                    productDetail?.product_details[0]?.image_path?.image_fit,
                    productDetail?.product_details[0]?.image_path?.image_path,
                    '500/500',
                  ),
                }
              : productDetail?.media && productDetail?.media.length
              ? {
                  uri: getImageUrl(
                    productDetail?.media[0]?.image?.path?.image_fit,
                    productDetail?.media[0]?.image?.path?.image_path,
                    '500/500',
                  ),
                }
              : imagePath.cabImage
          }
        />
      </View>
      <View
        style={
          isDarkMode
            ? [
                styles.bottomView,
                {backgroundColor: MyDarkTheme.colors.background},
              ]
            : styles.bottomView
        }>
        <ScrollView
          // bounces={true}
          showsVerticalScrollIndicator={false}
          style={{
            marginVertical: moderateScaleVertical(20),
            height: height / 3.5,
          }}>
          <View style={{padding: moderateScale(20)}}>
            <View
              style={{
                // marginTop: moderateScale(10),
                flexDirection: 'row',
                justifyContent: 'space-between',
                borderBottomColor: colors.borderColorD,
                borderBottomWidth: 1,
                paddingVertical: moderateScale(10),
                alignItems: 'center',
              }}>
              <View style={{flex: 0.8}}>
                <Text
                  style={
                    isDarkMode
                      ? [styles.lable1, {color: MyDarkTheme.colors.text}]
                      : styles.lable1
                  }>
                  {!!agent_location
                    ? orderDetail?.name || ''
                    : 'Searching for nearby drivers'}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [styles.lable2, {color: MyDarkTheme.colors.text}]
                      : styles.lable2
                  }>
                  {/* {'Jason is on the way to pick up the package'} */}
                  {!!agent_location
                    ? orderDetail?.phone_number || ''
                    : 'Processing...'}
                </Text>
              </View>
              {!!agent_location && (
                <View
                  style={{
                    flex: 0.3,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  <FastImage
                    source={{
                      uri:
                        agent_image != null &&
                        agent_image != '' &&
                        agent_image != undefined
                          ? agent_image
                          : dummyUser,
                      priority: FastImage.priority.high,
                    }}
                    style={{
                      height: moderateScale(64),
                      width: moderateScale(64),
                      borderRadius: moderateScale(64 / 2),
                    }}
                  />
                </View>
              )}
            </View>

            <View
              style={{
                // paddingHorizontal: moderateScale(20),
                paddingVertical: moderateScale(20),
                flexDirection: 'row',
                justifyContent: 'space-between',
                // borderBottomColor: colors.borderColorD,
                // borderBottomWidth: 1,
              }}>
              <View style={{flex: 0.33}}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.distanceDurationDeliveryLable,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.distanceDurationDeliveryLable
                  }>
                  {strings.ETA}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.distanceDurationDeliveryLable,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.distanceDurationDeliveryValue
                  }>
                  {'--'}
                </Text>
              </View>
              <View style={{flex: 0.33}}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.distanceDurationDeliveryLable,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.distanceDurationDeliveryLable
                  }>
                  {strings.orderID}
                </Text>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.distanceDurationDeliveryValue,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.distanceDurationDeliveryValue
                  }>
                  {productDetail && productDetail?.order_number
                    ? productDetail?.order_number
                    : '--'}
                </Text>
              </View>
              <View style={{flex: 0.33}}>
                <Text
                  style={
                    isDarkMode
                      ? [
                          styles.distanceDurationDeliveryLable,
                          {color: MyDarkTheme.colors.text},
                        ]
                      : styles.distanceDurationDeliveryLable
                  }>
                  {strings.amountPaid}
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={
                      isDarkMode
                        ? [
                            styles.distanceDurationDeliveryValue,
                            {color: MyDarkTheme.colors.text},
                          ]
                        : styles.distanceDurationDeliveryValue
                    }>
                    {productDetail && productDetail?.payable_amount
                      ? `${tokenConverterPlusCurrencyNumberFormater(
                          Number(productDetail?.payable_amount),
                          digit_after_decimal,
                          additional_preferences,
                          currencies?.primary_currency?.symbol,
                        )}`
                      : '--'}
                  </Text>
                  {/* <TouchableOpacity
                    // onPress={_oPressTooltip}
                    style={{marginLeft: 10, justifyContent: 'center'}}>
                    <Image source={imagePath.toolTip} />
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {agent_location && (
          <View
            style={{
              // marginVertical: moderateScaleVertical(5),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: moderateScaleVertical(10),
              marginHorizontal: moderateScale(20),
              // backgroundColor:'red'
            }}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={{textTransform: 'none', fontSize: textScale(16)}}
              onPress={() => onPressCall(orderDetail)}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.CALL}
              containerStyle={{width: width / 2.5}}
            />

            <TransparentButtonWithTxtAndIcon
              btnText={strings.CHAT}
              borderRadius={moderateScale(13)}
              onPress={() => onPressChat(orderDetail)}
              marginBottom={moderateScaleVertical(10)}
              marginTop={moderateScaleVertical(10)}
              containerStyle={{width: width / 2.5}}
              textStyle={{
                color: themeColors.primary_color,
                textTransform: 'none',
                fontSize: textScale(16),
              }}
            />
          </View>
        )}
      </View>
    </>
  );
}
