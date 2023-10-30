//import liraries
import React, {Component, useState} from 'react';
import Modal from 'react-native-modal';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import colors from '../styles/colors';
import {UIActivityIndicator} from 'react-native-indicators';
import {hitSlopProp} from '../styles/commonStyles';
import strings from '../constants/lang';

// create a component
const DifferentAddOns = ({
  data = [],
  selectedDiffAdsOnItem = {},
  hideDifferentAddOns = () => {},
  difAddOnsLoader = false,
  difAddOnsAdded = () => {},
  selectedDiffAdsOnSection = null,
  storeLocalQty = null,
  differentAddsOnsModal = false,
  btnLoader,
  selectedDiffAdsOnId = 0,
}) => {
  const {
    themeColor,
    themeToggle,
    appStyle,
    themeColors,
    languages,
    currencies,
  } = useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors, isDarkMode});

  const [selectedItem, setSelectedItem] = useState(false);

  const onIncrementDecrement = (item, index, type) => {
    setSelectedItem(item);

    var totalProductQty = 0;
    var batchCount = !!item?.product?.batch_count
      ? item?.product?.batch_count
      : 1;

    if (!!storeLocalQty) {
      totalProductQty = storeLocalQty;
    } else {
      if (
        selectedDiffAdsOnItem?.variant &&
        selectedDiffAdsOnItem?.variant[0]?.check_if_in_cart_app
      ) {
        selectedDiffAdsOnItem?.variant[0]?.check_if_in_cart_app.map((val) => {
          totalProductQty = totalProductQty + val?.quantity;
        });
      }
    }
    difAddOnsAdded(
      selectedDiffAdsOnItem,
      item?.quantity,
      item?.cart_id,
      item?.id,
      selectedDiffAdsOnSection,
      index,
      type,
      type == 1 ? totalProductQty + batchCount : totalProductQty - batchCount, //update total quantity
    );
  };

  console.log('selectedDiffAdsOnItem', selectedDiffAdsOnItem);
  console.log('selectedDiffAdsOnItem datadata', data);
  const renderItem = ({item, index}) => {
    const {product, pvariant, addon_set} = item;
    return (
      <View pointerEvents={btnLoader ? 'none' : 'auto'} style={{}}>
        <View style={styles.flexView}>
          <View>
            <Text style={styles.titleText}>
              {!!product?.title ? product?.title.trim() : ''}
            </Text>
            <Text style={styles.titleText}>
              {currencies?.primary_currency.symbol}
              {pvariant?.price}
            </Text>
          </View>

          <View
            style={{
              ...styles.addBtnStyle,
              paddingVertical: 0,

              height: 35,
              // backgroundColor: themeColors.primary_color,
              backgroundColor: colors.greyColor2,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderRadius: moderateScale(8),
              paddingHorizontal: moderateScale(8),
            }}>
            <TouchableOpacity
              disabled={false}
              // onPress={onDecrement}
              activeOpacity={0.8}
              hitSlop={hitSlopProp}
              onPress={() => onIncrementDecrement(item, index, 2)}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                  fontSize: moderateScale(16),
                  color: themeColors.primary_color,
                }}>
                -
              </Text>
            </TouchableOpacity>
            <View>
              {selectedItem?.id == item?.id && btnLoader ? (
                <UIActivityIndicator
                  size={moderateScale(18)}
                  color={themeColors.primary_color}
                />
              ) : (
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    fontSize: moderateScale(16),
                    color: themeColors.primary_color,
                  }}>
                  {item?.quantity || ''}
                </Text>
              )}
            </View>
            <TouchableOpacity
              // disabled={selectedItemID == data?.id}
              activeOpacity={0.8}
              hitSlop={hitSlopProp}
              onPress={() => onIncrementDecrement(item, index, 1)}>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                  fontSize: moderateScale(20),
                  color: themeColors.primary_color,
                }}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {addon_set.map((val, i) => {
          return (
            <View style={{}} key={String(i)}>
              <Text
                style={{
                  ...styles.titleText,
                  fontSize: textScale(12),
                }}>
                {val?.addon_set_translation_title}
              </Text>
              {val.options.map((values, inx) => {
                return (
                  <View style={{marginVertical: 2}} key={String(inx)}>
                    <Text
                      style={{
                        ...styles.titleText,
                        fontSize: textScale(12),
                        color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.blackOpacity66,
                      }}>
                      {values?.option_translation_title}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Modal
      isVisible={differentAddsOnsModal}
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={hideDifferentAddOns}>
      <View style={styles.mainContainer}>
        <Text
          style={{
            ...styles.titleText,
            fontSize: textScale(15),
            paddingHorizontal: moderateScale(12),
          }}>
          {strings.CUSTOMIZZATION_FOR}{' '}
          {selectedDiffAdsOnItem?.translation_title}
        </Text>
        <View style={styles.horizontaLine} />
        <View style={{paddingHorizontal: moderateScale(12)}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={!!data ? data : []}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  ...styles.horizontaLine,
                  marginVertical: moderateScaleVertical(8),
                }}
              />
            )}
            ListHeaderComponent={() => (
              <View style={{height: moderateScale(8)}} />
            )}
            ListFooterComponent={() => (
              <View style={{height: moderateScale(40)}} />
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export function stylesFunc({fontFamily, themeColors, isDarkMode}) {
  const styles = StyleSheet.create({
    mainContainer: {
      borderTopLeftRadius: moderateScaleVertical(15),
      borderTopRightRadius: moderateScale(15),
      paddingVertical: moderateScale(10),
      backgroundColor: isDarkMode
        ? MyDarkTheme.colors.background
        : colors.white,
      maxHeight: '70%',
    },
    horizontaLine: {
      borderBottomWidth: 0.6,
      marginTop: moderateScaleVertical(8),
      borderBottomColor: isDarkMode
        ? colors.whiteOpacity22
        : colors.lightGreyBg,
    },
    titleText: {
      fontSize: textScale(14),
      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      fontFamily: fontFamily.regular,
    },
    flexView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: moderateScaleVertical(2),
    },
    addBtnStyle: {
      borderWidth: StyleSheet.hairlineWidth,
      paddingVertical: moderateScaleVertical(6),
      borderRadius: moderateScale(8),
      borderColor: themeColors.primary_color,
      justifyContent: 'center',
      alignItems: 'center',
      width: 79,
      height: 35,
      // flexDirection:"row"
      // width: moderateScale(80),
    },
  });
  return styles;
}

export default React.memo(DifferentAddOns);
