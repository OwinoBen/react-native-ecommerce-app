import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {getImageUrl} from '../utils/helperFunctions';
import ButtonWithLoader from './ButtonWithLoader';
import ModalDropDownComp from '../Components/ModalDropDown';
import {isEmpty} from 'lodash';
import {TouchableHighlight} from 'react-native-gesture-handler';

const LaundryAddonModal = ({
  isVisible = false,
  hideModal = () => {},
  flatlistData = [],
  selectedLaundryCategory = {},
  onPressLaundryCategory = () => {},
  onLaundryAddonSelect = () => {},
  selectedAddonSet = [],
  onFindVendors = () => {},
  minMaxError = [],
  isOnPressed = false,
  selectedHomeCategory = {},
  unPresentAry = [],
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

  const checkIdPresentInAddon = (itmId, addonId) => {
    return selectedAddonSet.some(
      (item) => item?.id == itmId && item?.estimate_addon_id == addonId,
    );
  };

  const renderLaundryCategoryItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressLaundryCategory(item)}
        style={{
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri: getImageUrl(
              item?.icon?.image_fit,
              item?.icon?.image_path,
              '600/6000',
            ),
          }}
          style={{
            ...styles.categoryImgStyle,
            borderWidth: selectedLaundryCategory?.id == item?.id ? 4 : 0,
          }}
        />
        <Text style={styles.categoryTitle}>
          {item?.estimate_product_translation?.name ||
            item?.estimate_product_translation?.slug ||
            ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEstimateProductAddons = (itm, indx) => {
    return (
      <View>
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: textScale(13),
          }}>
          {itm?.estimate_addon_set?.title}
        </Text>
        <Text
          style={{
            ...styles.minMaxTxt,
            color:
              isOnPressed &&
              unPresentAry.some(
                (item) => item?.addon_id == itm?.estimate_addon_id,
              )
                ? colors.redB
                : colors.black,
            opacity:
              isOnPressed &&
              unPresentAry.some(
                (item) => item?.addon_id == itm?.estimate_addon_id,
              )
                ? 1
                : 0.5,
          }}>
          Min {itm?.estimate_addon_set?.min_select} Max{' '}
          {itm?.estimate_addon_set?.max_select} sellections allowed
        </Text>
        {itm?.estimate_addon_set?.option.length <= 4 ? (
          <FlatList
            data={itm?.estimate_addon_set?.option}
            renderItem={({item, index}) => renderAddonOptions(item, itm)}
            ItemSeparatorComponent={() => (
              <View style={{height: moderateScaleVertical(8)}} />
            )}
          />
        ) : (
          <ModalDropDownComp
            options={itm?.estimate_addon_set?.option}
            defaultValue={'Select addon'}
            _onSelect={(idx, value) => onLaundryAddonSelect(value, itm)}
            _renderButtonText={(rowData) => <Text> {rowData?.title}</Text>}
            _renderRow={(rowData) => {
              return (
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor="cornflowerblue"
                  style={{backgroundColor: colors.white}}>
                  <Text
                    style={{
                      paddingVertical: 10,
                      marginHorizontal: 10,
                    }}>
                    {rowData?.title}
                  </Text>
                </TouchableHighlight>
              );
            }}
            _renderRightComponent={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                }}>
                <Image source={imagePath.icDropdown} />
              </View>
            )}
            modalMainStyle={{
              width: '100%',
              height: 40,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.borderColorB,
              paddingHorizontal: moderateScale(20),
            }}
          />
        )}
      </View>
    );
  };

  const renderAddonOptions = (item, categoryDetails) => {
    return (
      <TouchableOpacity
        onPress={() => onLaundryAddonSelect(item, categoryDetails)}
        style={styles.addonRowTouchable}>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
          }}>
          {item?.title}
        </Text>

        {checkIdPresentInAddon(
          item?.id,
          categoryDetails?.estimate_addon_set?.id,
        ) ? (
          <Image source={imagePath.checkBox2Active} />
        ) : (
          <Image source={imagePath.checkBox2InActive} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      style={{margin: 0, justifyContent: 'flex-end'}}
      onBackdropPress={hideModal}>
      <View style={styles.mainContainer}>
        <Text
          style={{
            ...styles.titleText,
            paddingHorizontal: moderateScale(12),
            textTransform: 'uppercase',
          }}>
          {selectedHomeCategory?.name}
        </Text>
        <View
          style={{
            paddingHorizontal: moderateScale(12),
            paddingVertical: moderateScaleVertical(15),
          }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            horizontal
            data={flatlistData || []}
            renderItem={renderLaundryCategoryItem}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  width: moderateScale(15),
                }}
              />
            )}
          />
        </View>
        <View style={styles.horizontaLine} />
        <View
          style={{
            paddingHorizontal: moderateScale(12),
          }}>
          <Text
            style={{
              ...styles.titleText,
              paddingVertical: moderateScaleVertical(15),
            }}>
            {'ADD ONS'}{' '}
          </Text>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={selectedLaundryCategory?.estimate_product_addons || []}
            renderItem={({item, index}) =>
              renderEstimateProductAddons(item, index)
            }
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: moderateScale(20),
                }}
              />
            )}
            ListFooterComponent={() => (
              <ButtonWithLoader
                btnText="Find Vendors"
                onPress={onFindVendors}
                btnTextStyle={styles.proceedBtnTitle}
                btnStyle={styles.proceedBtn}
              />
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
      height: '70%',
    },
    titleText: {
      fontSize: textScale(14),
      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      fontFamily: fontFamily.medium,
    },
    horizontaLine: {
      borderBottomWidth: 0.6,
      marginTop: moderateScaleVertical(8),
      borderBottomColor: isDarkMode
        ? colors.whiteOpacity22
        : colors.lightGreyBg,
    },
    proceedBtn: {
      marginTop: moderateScaleVertical(20),
      height: moderateScaleVertical(45),
      borderRadius: moderateScale(5),
      backgroundColor: themeColors.primary_color,
      borderWidth: 0,
      marginBottom: moderateScaleVertical(300),
    },
    proceedBtnTitle: {
      color: colors.white,
      textTransform: 'none',
      fontSize: textScale(14),
    },
    itmPrice: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(11),
      marginRight: moderateScale(10),
    },
    addonRowTouchable: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    minMaxTxt: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      marginVertical: moderateScaleVertical(10),
    },
    categoryTitle: {
      width: moderateScaleVertical(100),
      textAlign: 'center',
      marginTop: moderateScaleVertical(15),
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
    },
    categoryImgStyle: {
      height: moderateScaleVertical(100),
      width: moderateScaleVertical(100),
      borderRadius: moderateScale(10),
      borderColor: themeColors.primary_color,
    },
  });
  return styles;
}

export default React.memo(LaundryAddonModal);
