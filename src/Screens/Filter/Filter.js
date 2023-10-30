import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {cloneDeep} from 'lodash';
import React, {useEffect, useState} from 'react';
import {I18nManager, Image, ScrollView, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import stylesFunc from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';

export default function Filter({route, navigation}) {
  const {themeColors, appStyle, appData} = useSelector(
    (state) => state?.initBoot,
  );
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({themeColors, fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});
  const {
    allFilters,
    getProductBasedOnFilter,
    minPrice,
    maxPrice,
    checkForMinimumPriceChange,
    checkForMaximumPriceChange,
    showBrands = true,
    showSortBy = true,
  } = route.params.data;

  console.log(
    allFilters,
    getProductBasedOnFilter,
    minPrice,
    maxPrice,
    checkForMinimumPriceChange,
    checkForMaximumPriceChange,
    'show all filter data',
  );

  const [state, setState] = useState({
    isLoading: false,
    filterTypes: [],
    selectedFiltertab: [],
    showPriceView: false,
    minimumPrice: minPrice ? minPrice : 0,
    maximumPrice: maxPrice ? maxPrice : 50000,
    checkForMinimumPrice: checkForMinimumPriceChange,
    checkForMaximumPrice: checkForMaximumPriceChange,
  });

  useEffect(() => {
    updateState({
      filterTypes: allFilters,
      selectedFiltertab: allFilters[0]?.value,
    });
  }, []);

  const {
    isLoading,
    filterTypes,
    selectedFiltertab,
    showPriceView,
    minimumPrice,
    maximumPrice,
    checkForMinimumPrice,
    checkForMaximumPrice,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName);
    };

  //***********filter lables******** */
  const filterTypesListView = (item, indx) => {
    return (
      <TouchableOpacity
        key={indx}
        onPress={() => selectLableBasedOnValues(item)}
        style={{
          borderBottomColor: colors.lightGreyBorder,
          borderBottomWidth: 1,
          padding: moderateScale(10),
        }}>
        <Text
          style={
            isDarkMode
              ? [styles.lableStyle, {color: MyDarkTheme.colors.text}]
              : styles.lableStyle
          }>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const _selectFilterData = (item) => {
    let allFilterData = cloneDeep(filterTypes);
    updateState({
      filterTypes: [
        ...allFilterData.map((i, inx) => {
          if (i.label == item?.parent) {
            let checkArray = i.value.map((j, jnx) => {
              if (j.label == item.label) {
                if (i.id == -2) {
                  return {
                    ...j,
                    value: {selected: j?.value?.selected ? false : true},
                  };
                } else {
                  return {
                    ...j,
                    value: {selected: j?.value?.selected ? false : true},
                  };
                }
              } else {
                if (i.id == -2) {
                  return {
                    ...j,
                    value: {selected: false},
                  };
                } else {
                  return j;
                }
              }
            });
            updateState({selectedFiltertab: checkArray});
            return {
              ...i,
              value: checkArray,
            };
          } else {
            return i;
          }
        }),
      ],
      // selectedFiltertab: item.value,
    });
  };

  /***************Select Price range****** */

  const selectPriceBasedOnValues = () => {
    updateState({
      showPriceView: true,
    });
  };
  /******select label value based on label category */
  const selectLableBasedOnValues = (item) => {
    let newArray = cloneDeep(filterTypes);
    let find = newArray.find((element) => {
      if (element.id == item.id) {
        return element;
      }
    });
    updateState({
      showPriceView: false,
      selectedFiltertab: find ? find.value : item.value,
    });
  };

  //***********CANCEL FILTER******** */
  const cancelFilters = () => {
    updateState({
      isLoading: true,
    });
    let allFilterData = cloneDeep(filterTypes);
    updateState({
      selectedFiltertab: selectedFiltertab?.map((itm, index) => {
        itm['value'] = {selected: false};
        return itm;
      }),
      filterTypes: [
        ...allFilterData.map((i, inx) => {
          let checkArray = i.value.map((j, jnx) => {
            return {
              ...j,
              value: {selected: false},
            };
          });
          return {
            ...i,
            value: checkArray,
          };
        }),
      ],
    });
    getProductBasedOnFilter(
      0,
      50000,
      false,
      false,
      [],
      [],
      [],
      [],
      filterTypes,
    );
    setTimeout(() => {
      updateState({
        isLoading: false,
        // minimumPrice: val[0],
        // maximumPrice: val[1],
      });
      navigation.goBack();
    }, 1000);
  };

  //************Apply filter***** */

  const applyFilters = () => {
    updateState({
      isLoading: true,
    });

    //console.log(filterTypes, 'FILTER TYPES');
    let allFilterData = cloneDeep(filterTypes);
    var newData = [];
    var variants = [];
    var options = [];
    var brandsIds = [];
    var sortByIds = [];

    // //Slected Sortby

    if (showSortBy) {
      sortByIds = allFilterData
        .filter((i) => i?.id == -2)[0]
        .value.filter((itm) => itm?.value?.selected == true)
        .map((j) => {
          return j.labelValue;
        });
      console.log(sortByIds, 'SORT IDS');
    }
    //All Brand Ids

    if (showBrands) {
      brandsIds = allFilterData
        .filter((i) => i?.id == -1)[0]
        .value.filter((itm) => itm?.value?.selected == true)
        .map((j) => {
          return j.id;
        });

      console.log(brandsIds, 'BRAND IDS');
    }
    var allSelectedVariantOptionsPairs = allFilterData
      .filter((i) => i?.id != -1 && i?.id != -2)
      .map((itm, inx) => {
        return itm?.value;
      })
      .map((j, jnx) => {
        if (j.length) return j.filter((x) => x?.value?.selected);
      })
      .filter((final) => final?.length)
      .map((finalArray, finalIndex) => {
        finalArray?.map((z, znx) => {
          newData?.push(z);
        });
        return finalArray;
      });

    if (newData.length) {
      newData.map((i) => {
        variants.push(i?.variant_type_id);
        options.push(i?.id);
      });
      allSelectedVariantOptionsPairs = newData;
    }

    getProductBasedOnFilter(
      minimumPrice,
      maximumPrice,
      checkForMinimumPrice,
      checkForMaximumPrice,
      sortByIds,
      brandsIds,
      variants,
      options,
      allFilterData,
    );
    setTimeout(() => {
      updateState({
        isLoading: false,
      });
      navigation.goBack();
      // navigation.navigate(navigationStrings.PRODUCT_LIST);
    }, 1000);
    //
  };

  /**********Filter values views******/
  const filterValuesListView = (item) => {
    if (item.label) {
      return (
        <TouchableOpacity
          onPress={() => _selectFilterData(item)}
          style={{
            borderBottomColor: colors.lightGreyBorder,
            borderBottomWidth: 1,
            padding: moderateScale(10),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/* radioInActive */}
          <Image
            source={
              item?.value?.selected
                ? imagePath.radioActive
                : imagePath.radioInActive
            }
          />
          <Text
            style={
              isDarkMode
                ? [
                    styles.lableStyle,
                    {
                      paddingLeft: moderateScale(5),
                      color: isDarkMode ? MyDarkTheme.colors.text : null,
                    },
                  ]
                : [
                    styles.lableStyle,
                    {
                      paddingLeft: moderateScale(5),
                    },
                  ]
            }>
            {item.label}
          </Text>
        </TouchableOpacity>
      );
    } else return <></>;
  };

  //Price range handler
  const _priceChangeHandler = (val) => {
    if ((Array.isArray(val[0]) && val[0][0] == 0) || val[0] == 0) {
      updateState({checkForMinimumPrice: false});
    } else {
      updateState({checkForMinimumPrice: true});
    }
    if ((Array.isArray(val[1]) && val[1][0] == 50000) || val[1] == 50000) {
      updateState({checkForMaximumPrice: false});
    } else {
      updateState({checkForMaximumPrice: true});
    }

    updateState({
      minimumPrice: val[0],
      maximumPrice: val[1],
    });
  };

  /**********Show Price bar View******* */
  const _showPriceBarView = () => {
    return (
      <View>
        <View style={{alignItems: 'center'}}>
          <MultiSlider
            values={[minimumPrice, maximumPrice]}
            sliderLength={width / 2 - 20}
            onValuesChange={_priceChangeHandler}
            min={0}
            max={50000}
            step={1}
            allowOverlap={false}
            selectedStyle={styles.selectedStyle}
            // Style={{height:40}}
            customMarker={() => <View style={styles.customMarker} />}
          />
        </View>
        <View
          style={{
            marginTop: moderateScaleVertical(-10),
            width: width / 2 - 40,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={
              isDarkMode
                ? [styles.priceMinrange, {color: MyDarkTheme.colors.text}]
                : styles.priceMinrange
            }>{`${minimumPrice}`}</Text>
          <Text
            style={
              isDarkMode
                ? [styles.priceMinrange, {color: MyDarkTheme.colors.text}]
                : styles.priceMinrange
            }>{`${maximumPrice}`}</Text>
        </View>
      </View>
    );
  };

  console.log(filterTypes, 'filterTypes');

  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        customLeft={() => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={
                  appStyle?.homePageLayout === 2
                    ? imagePath.backArrow
                    : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                    ? imagePath.icBackb
                    : imagePath.back
                }
                style={
                  isDarkMode
                    ? {
                        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
                        tintColor: MyDarkTheme.colors.text,
                      }
                    : {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}
                }
              />
            </TouchableOpacity>

            <Text
              style={
                isDarkMode
                  ? [
                      styles.textStyle,
                      {marginLeft: 20, color: MyDarkTheme.colors.text},
                    ]
                  : [styles.textStyle, {marginLeft: 20}]
              }>
              {strings.FILTER}
            </Text>
          </View>
        )}
        rightViewStyle={{flex: 0.3}}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: moderateScale(10),
        }}>
        <Text
          style={
            isDarkMode
              ? [styles.categoryText, {color: MyDarkTheme.colors.text}]
              : styles.categoryText
          }>
          {strings.CATEGORY}
        </Text>
        <TouchableOpacity
          onPress={moveToNewScreen(navigationStrings.SEARCHPRODUCTOVENDOR)}>
          <Image
            style={isDarkMode ? {tintColor: MyDarkTheme.colors.text} : null}
            source={
              appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icSearchb
                : imagePath.search
            }
          />
        </TouchableOpacity>
      </View>
      <View style={{...commonStyles.headerTopLine}} />
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View
          style={{
            flex: 0.5,
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.lightDark
              : colors.backGroundGreyD,
          }}>
          <ScrollView>
            {filterTypes && filterTypes.length
              ? filterTypes.map((i, inx) => {
                  return filterTypesListView(i, inx);
                })
              : null}
            {/* Price view */}
            <TouchableOpacity
              onPress={() => selectPriceBasedOnValues()}
              style={{
                borderBottomColor: colors.lightGreyBorder,
                borderBottomWidth: 1,
                padding: moderateScale(10),
              }}>
              <Text
                style={
                  isDarkMode
                    ? [styles.lableStyle, {color: MyDarkTheme.colors.text}]
                    : styles.lableStyle
                }>
                {strings.PRICE}
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.bottomViewButtonStyle}>
            <TouchableOpacity
              onPress={() => cancelFilters()}
              style={[styles.buttonMainView, {backgroundColor: colors.white}]}>
              <Text style={styles.cancel}>{strings.CLEAR}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{flex: 0.5}}>
          {showPriceView
            ? _showPriceBarView()
            : selectedFiltertab && selectedFiltertab.length
            ? selectedFiltertab.map((i, inx) => {
                return filterValuesListView(i);
              })
            : null}

          <View style={styles.bottomViewButtonStyle}>
            <TouchableOpacity
              onPress={() => applyFilters()}
              style={[
                styles.buttonMainView,
                {backgroundColor: themeColors.primary_color},
              ]}>
              <Text style={styles.apply}>{strings.APPLY}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </WrapperContainer>
  );
}
