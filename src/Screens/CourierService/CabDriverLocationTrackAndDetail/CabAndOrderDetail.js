import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import ScaledImage from 'react-native-scalable-image';
import {useSelector} from 'react-redux';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import {tokenConverterPlusCurrencyNumberFormater} from '../../../utils/commonFunction';
import {getImageUrl} from '../../../utils/helperFunctions';
import stylesFun from './styles';

export default function CabAndOrderDetail({
  isLoading = false,
  availableCarList = [],
  onPressCall,
  onPressChat,
  onPressAvailableCar,
  selectedCarOption = null,
  _oPressTooltip,
  paramData = null,
}) {
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);

  return (
    <>
      <View style={{marginBottom: -30, paddingHorizontal: 10, zIndex: 1000}}>
        <ScaledImage
          width={width / 2.5}
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
              : imagePath.cabLarge
          }
        />
      </View>
      <View style={[styles.bottomView]}>
        <ScrollView
          bounces={false}
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
              }}>
              <View style={{flex: 1}}>
                <Text style={styles.lable1}>{'Driver en route to pickup'}</Text>
                <Text style={styles.lable2}>
                  {/* {'Jason is on the way to pick up the package'} */}
                  {'Processing.....'}
                </Text>
              </View>
              {/* <View
                style={{
                  flex: 0.3,
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <Image
                  source={{uri: dummyUser}}
                  style={{
                    height: moderateScale(64),
                    width: moderateScale(64),
                    borderRadius: moderateScale(64 / 2),
                  }}
                />
              </View> */}
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
              <View style={{flex: 0.2}}>
                <Text style={styles.distanceDurationDeliveryLable}>
                  {strings.ETA}
                </Text>
                <Text style={styles.distanceDurationDeliveryValue}>{'--'}</Text>
              </View>
              <View style={{flex: 0.4}}>
                <Text style={styles.distanceDurationDeliveryLable}>
                  {strings.orderID}
                </Text>
                <Text style={styles.distanceDurationDeliveryValue}>
                  {paramData &&
                  paramData?.orderDetail &&
                  paramData?.orderDetail?.order_number
                    ? `#${paramData?.orderDetail?.order_number}`
                    : '--'}
                </Text>
              </View>
              <View style={{flex: 0.4}}>
                <Text style={styles.distanceDurationDeliveryLable}>
                  {strings.amountPaid}
                </Text>

                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.distanceDurationDeliveryValue}>
                    {paramData &&
                    paramData?.orderDetail &&
                    paramData?.orderDetail?.payable_amount
                      ? `${tokenConverterPlusCurrencyNumberFormater(
                          Number(paramData?.orderDetail?.payable_amount),
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
        {/* <View
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
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={{textTransform: 'none', fontSize: textScale(16)}}
            onPress={onPressCall}
            marginTop={moderateScaleVertical(10)}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.CALL}
            containerStyle={{width: width / 2.5}}
          />

          <TransparentButtonWithTxtAndIcon
            btnText={strings.CHAT}
            borderRadius={moderateScale(13)}
            containerStyle={{
              marginHorizontal: 20,
              alignItems: 'center',
            }}
            onPress={onPressChat}
            marginBottom={moderateScaleVertical(10)}
            marginTop={moderateScaleVertical(10)}
            containerStyle={{width: width / 2.5}}
            textStyle={{
              color: themeColors.primary_color,
              textTransform: 'none',
              fontSize: textScale(16),
            }}
          />
        </View> */}
      </View>
    </>
  );
}
