import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { getBundleId } from 'react-native-device-info';
import { useDarkMode } from 'react-native-dynamic';
import { UIActivityIndicator } from 'react-native-indicators';
import { useSelector } from 'react-redux';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import { tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import { getImageUrl } from '../../../utils/helperFunctions';
import ListEmptyCar from '../../TaxiApp/ChooseCarTypeAndTime/ListEmptyCar';
import stylesFun from '../styles';

export default function AvailableDriver({
  rideType,
  isCabPooling = false,
  isLoading = false,
  disabled,
  updateSeatNo,
  availableCarList = [],
  onPressAvailableCar = () => { },
  selectedCarOption = null,
  allListedDrivers,
  _onUpdateSeatNo = () => { },
  _onShowBidePriceModal = () => { }
}) {
  const { appData, themeColors, appStyle, themeToggle, themeColor, currencies } = useSelector((state) => state?.initBoot || {});
  const { additional_preferences, digit_after_decimal } = appData?.profile?.preferences || {};
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, themeColors });


  // choose a trip or swipe up for more
  //Render all Available amounts
  const _renderItem = ({ item, index }) => {
    return (
      <View
        key={String(item.id)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onPressAvailableCar(item)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
            borderTopWidth: index !== 0 ? 1 : 0,
            borderColor: colors.borderColorB,
            paddingVertical: moderateScaleVertical(12)
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 0.75, }}>

            <Image
              resizeMode={'contain'}
              style={{
                height: moderateScale(60),
                width: moderateScale(60),
              }}
              source={{
                uri: getImageUrl(
                  item?.media[0]?.image?.path?.proxy_url,
                  item?.media[0]?.image?.path?.image_path,
                  '350/350',
                ),
              }}
            />

            <View
              style={{
                marginLeft: moderateScale(16),

              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: isDarkMode
                    ? colors.whiteOpacity50
                    : colors.blackC,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(14),
                  textAlign: 'left',
                }}>
                {item?.translation[0]?.title}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  ...styles.vechilePriceName, color: isDarkMode
                    ? colors.whiteOpacity50
                    : colors.textColor,
                }}>
                {rideType == "bidRide" ? "Minimum Fare" : "Fare"} - {tokenConverterPlusCurrencyNumberFormater(
                  Number(item?.tags_price) + Number(item?.toll_fee ? item?.toll_fee : 0),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                  currencies
                )}
              </Text>
              {!!allListedDrivers[0]?.arrival_time && <Text
                style={{
                  ...styles.vechilePriceName, color: isDarkMode
                    ? colors.whiteOpacity50
                    : colors.textColor,
                }}>
                Estimated Time - {allListedDrivers[0]?.arrival_time}
              </Text>}
              {!!item?.translation[0]?.meta_description && <Text
                style={{
                  ...styles.vechilePriceName, color: isDarkMode
                    ? colors.whiteOpacity50
                    : colors.textColor,
                }}>
                {item?.translation[0]?.meta_description}
              </Text>}
            </View>
          </View>

          <Image source={imagePath.ic_right_arrow} />
        </TouchableOpacity >
      </View >
    );
  };

  const _listEmptyComponent = () => {
    return (
      <>
        {isLoading ? (
          <View
            style={{
              // height: height / 4,
              marginBottom: moderateScaleVertical(20),
            }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i, inx) => {
              return (
                <View
                  style={{ marginBottom: moderateScaleVertical(8) }}
                  key={inx}>
                  <ListEmptyCar isLoading={isLoading} />
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              height: height / 3.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                ...styles.noCarsAvailable,
                color: isDarkMode ? colors.white : colors.blackC,
              }}>
              {appIds.jiffex == getBundleId()
                ? strings.NODELIVERIESAGENTAVAILABLE
                : strings.NO_CARS_AVAILABLE}
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      {
        !!isCabPooling && (<View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // flex: 1,
            margin: moderateScale(20),
          }}>
          <View>
            <Text
              numberOfLines={1}
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB,
                fontSize: textScale(13),
                fontFamily: fontFamily.medium,
                width: width / 2.1,
              }}>
              {'Number of seats'}
            </Text>

            {/* <Text
              numberOfLines={1}
              style={{
                ...styles.priceItemLabel2,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.blackOpacity86,
                fontSize: textScale(12),
                fontFamily: fontFamily.medium,
                width: width / 2.1,
              }}>
              {i?.product?.translation[0]?.title},
            </Text> */}
          </View>

          <View
            // pointerEvents={btnLoader ? 'none' : 'auto'}
            style={{ minWidth: moderateScale(74) }}>
            <View
              style={{
                backgroundColor: themeColors.primary_color,
                borderRadius: moderateScale(16),
                paddingHorizontal: moderateScale(6),
                paddingVertical: moderateScaleVertical(4),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                disabled={updateSeatNo == 1 || disabled ? true : false}
                onPress={() => _onUpdateSeatNo('decrease')}
              >
                <Text style={{
                  fontFamily: fontFamily.bold,
                  fontSize: moderateScale(20),
                  color: colors.white,
                }}>
                  -
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  alignItems: 'center',
                  // width: moderateScale(20),
                  height: moderateScale(20),
                  justifyContent: 'center',
                }}>
                {isLoading ? (
                  <UIActivityIndicator
                    size={moderateScale(16)}
                    color={colors.white}
                  />
                ) : (
                  <Text
                    style={{
                      fontFamily: fontFamily.bold,
                      fontSize: moderateScale(12),
                      color: colors.white,
                    }}>
                    {updateSeatNo}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                disabled={disabled ? true : false}
                onPress={() => _onUpdateSeatNo('increase')}
              >
                <Text style={{
                  fontFamily: fontFamily.bold,
                  fontSize: moderateScale(20),
                  color: colors.white,
                }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        )}


      {isLoading ?
        <View
          style={{
            // height: height / 4,
            marginBottom: moderateScaleVertical(20),
          }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i, inx) => {
            return (
              <View
                style={{ marginBottom: moderateScaleVertical(8) }}
                key={inx}>
                <ListEmptyCar isLoading={isLoading} />
              </View>
            );
          })}
        </View>
        :
        <BottomSheetFlatList
          // scrollEnabled={false}
          data={availableCarList}
          extraData={availableCarList}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item?.id || ''}
          renderItem={_renderItem}
          contentContainerStyle={{
            padding: 10,
            borderWidth: 1,
            borderColor: colors.borderColorB,
            marginHorizontal: moderateScale(20),
            borderRadius: moderateScale(12)
          }}
          ListEmptyComponent={_listEmptyComponent}
        />}
    </View>
  );
}
