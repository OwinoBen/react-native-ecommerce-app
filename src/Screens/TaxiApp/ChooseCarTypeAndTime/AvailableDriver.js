import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { getBundleId } from 'react-native-device-info';
import { useSelector } from 'react-redux';
import { UIActivityIndicator } from 'react-native-indicators';
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
import ListEmptyCar from './ListEmptyCar';
import stylesFun from './styles';
import RenderHTML from 'react-native-render-html';

export default function AvailableDriver({
  rideType,
  isCabPooling = false,
  isLoading = false,
  disabled,
  updateSeatNo,
  availableCarList = [],
  onPressAvailableCar,
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
        style={{
          backgroundColor: isDarkMode
            ? selectedCarOption?.id == item?.id
              ? colors.whiteOpacity15
              : colors.textGrey
            : selectedCarOption?.id == item?.id
              ? colors.lightGreyBg
              : colors.whiteOpacity77,

          borderBottomColor: isDarkMode
            ? colors.whiteOpacity22
            : colors.lightGreyBg,
          borderBottomWidth: 0.6,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onPressAvailableCar(item)}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: moderateScaleVertical(12),
            paddingHorizontal: moderateScale(16),
            // marginBottom: moderateScaleVertical(8),
            opacity: selectedCarOption?.id == item?.id ? 0.8 : 1,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

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
                    ? selectedCarOption?.id == item?.id
                      ? colors.white
                      : colors.whiteOpacity50
                    : selectedCarOption?.id == item?.id
                      ? colors.black
                      : colors.blackC,
                  fontFamily: fontFamily.medium,
                  fontSize: textScale(14),
                  textAlign: 'left',
                }}>
                {item?.translation[0]?.title}
              </Text>
              {/* <Text
                style={{
                  color: isDarkMode
                    ? selectedCarOption?.id == item?.id
                      ? colors.white
                      : colors.whiteOpacity50
                    : selectedCarOption?.id == item?.id
                      ? colors.black
                      : colors.blackOpacity66,
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(10),
                  textAlign: 'left',
                }}>
                {item?.translation[0]?.meta_description}
              </Text> */}
              <RenderHTML
                contentWidth={width}
                source={{ html: item?.translation[0]?.body_html }}
                tagsStyles={{
                  p: {
                    color: isDarkMode
                      ? selectedCarOption?.id == item?.id
                        ? colors.white
                        : colors.whiteOpacity50
                      : selectedCarOption?.id == item?.id
                        ? colors.black
                        : colors.blackOpacity66,
                    fontFamily: fontFamily.regular,
                    fontSize: textScale(10),
                    textAlign: 'left',
                  },
                }}
              />
            </View>
          </View>

          {rideType == 'bideRide' ?
            <TouchableOpacity
              onPress={() => _onShowBidePriceModal(item)}
              style={{
                backgroundColor: themeColors.primary_color,
                padding: moderateScale(8),
                borderRadius: moderateScale(4),
                borderColor: themeColors.primary_color,
              }}>
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.regular,
                  color: colors.white,
                }}>
                {'Bid Now'}
              </Text>
            </TouchableOpacity>
            :
            <Text
              numberOfLines={1}
              style={{
                color: isDarkMode
                  ? selectedCarOption?.id == item?.id
                    ? colors.white
                    : colors.whiteOpacity50
                  : selectedCarOption?.id == item?.id
                    ? colors.black
                    : colors.blackC,
                fontFamily: fontFamily.medium,
                fontSize: textScale(14),
                textAlign: 'left',
              }}>
              {tokenConverterPlusCurrencyNumberFormater(
                Number(item?.tags_price) + Number(item?.toll_fee ? item?.toll_fee : 0),
                digit_after_decimal,
                additional_preferences,
                currencies?.primary_currency?.symbol,
              )}
            </Text>

          }
        </TouchableOpacity >
        {selectedCarOption?.id == item?.id && allListedDrivers?.length ? (
          <Text
            style={{
              marginLeft: moderateScale(10),
              marginBottom: moderateScaleVertical(5),
              marginTop: moderateScaleVertical(-10),
            }}>
            {allListedDrivers[0]?.arrival_time} away
          </Text>
        ) : null
        }
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
          ListEmptyComponent={_listEmptyComponent}
        />}
    </View>
  );
}
