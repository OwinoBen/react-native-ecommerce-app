//import liraries
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import { height, moderateScale, moderateScaleVertical, width } from '../styles/responsiveSize';
import GradientButton from './GradientButton';



const FilterComp = ({
    isDarkMode = null,
    themeColors,
    onFilterApply = () => { },
    onShowHideFilter = () => { },
    allClearFilters = () => { },
    selectedSortFilter,
    onSelectedSortFilter,
    minimumPrice = 0,
    maximumPrice = 50000,
    updateMinMax,
    filterData = [],
    isProductListFilter = true
}) => {


    const [state, setState] = useState({
        minPrice: 0,
        maxPrice: 50000,
        filterTypes: [],
        sortFilters: [
            {
                id: 1,
                label: strings.A_TO_Z,
                labelValue: 'a_to_z',
                parent: strings.SORT_BY,
            },
            {
                id: 2,
                label: strings.Z_TO_A,
                labelValue: 'z_to_a',
                parent: strings.SORT_BY,
            },
            {
                id: 3,
                label: strings.COST_LOW_TO_HIGH,
                labelValue: 'low_to_high',
                parent: strings.SORT_BY,
            },
            {
                id: 4,
                label: strings.COST_HIGH_TO_LOW,
                labelValue: 'high_to_low',
                parent: strings.SORT_BY,
            },
            {
                id: 5,
                label: strings.POPULARITY,
                labelValue: 'popular_product',
                parent: strings.SORT_BY,
            },
            {
                id: 6,
                label: strings.RATING,
                labelValue: 'rating',
                parent: strings.SORT_BY,
            }
        ]
    })
    const { filterTypes, sortFilters } = state
    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    useEffect(() => {
        updateState({
            filterTypes: filterData,
        })
    }, [])


    const onDone = () => {
        let allFilterData = cloneDeep(filterTypes);
        var newData = [];
        var variants = [];
        var options = [];

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

        let filterData = {
            selectedSorting: selectedSortFilter?.labelValue || 0,
            selectedVariants: variants,
            selectedOptions: options,
            sleectdBrands: []
        }

        console.log(filterData, "filterDataaa")
        onFilterApply(filterData)
        isProductListFilter && onShowHideFilter()
    }

    const onClearFilter = () => {
        updateState({ selectedSorting: null })
        isProductListFilter && onShowHideFilter()
        allClearFilters()
    }

    //price range slider functions
    const _priceChangeHandler = (val) => {
        updateMinMax(val[0], val[1])
    };

    const sortingView = (val, i) => {
        return (
            <TouchableOpacity
                key={String(i)}
                activeOpacity={0.6}
                style={{
                    ...styles.sortingView,
                    marginBottom: sortFilters.length - 1 == i ? moderateScaleVertical(8) : moderateScaleVertical(20)
                }}
                onPress={() => onSelectedSortFilter(val)}
            >
                <Text style={{
                    fontSize: moderateScale(14),
                    fontFamily: fontFamily.regular
                }}>{val.label}</Text>
                <Image
                    source={selectedSortFilter?.id == val?.id ? imagePath.radioActive : imagePath.radioInActive}
                />
            </TouchableOpacity>
        )
    }




    const _selectFilterData = (item) => {
        let allFilterData = cloneDeep(filterTypes);
        let modifyFilter = [
            ...allFilterData.map((i, inx) => {
                if (i.label == item?.parent) {
                    let checkArray = i.value.map((j, jnx) => {
                        if (j.id == item.id) {
                            if (i.id == -2) {
                                return {
                                    ...j,
                                    value: { selected: j?.value?.selected ? false : true },
                                };
                            } else {
                                return {
                                    ...j,
                                    value: { selected: j?.value?.selected ? false : true },
                                };
                            }
                        } else {
                            if (i.id == -2) {
                                return {
                                    ...j,
                                    value: { selected: false },
                                };
                            } else {
                                return j;
                            }
                        }
                    });
                    return {
                        ...i,
                        value: checkArray,
                    };
                } else {
                    return i;
                }
            }),
        ]
        updateState({ filterTypes: modifyFilter })
    };

    const filterView = (val, i) => {
        return (
            <View
                key={String(i)}
                style={{ marginBottom: moderateScaleVertical(16) }}
            >
                <Text style={{
                    fontSize: moderateScale(16),
                    fontFamily: fontFamily.bold,
                    marginBottom: moderateScaleVertical(8)
                }}>{val?.label}</Text>

                {val.value.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={String(index)}
                            onPress={() => _selectFilterData(item)}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: moderateScaleVertical(8)
                            }}
                        >
                            <Image
                                source={
                                    !!item?.value?.selected ? imagePath.checkBox2Active : imagePath.icCheckBoxInactive
                                }
                                style={{
                                    tintColor: themeColors.primary_color,
                                    marginRight: moderateScale(8)
                                }}
                            />
                            <Text style={{
                                fontSize: moderateScale(14),
                                fontFamily: fontFamily.regular
                            }}>{item.label}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Modal
                onBackdropPress={onShowHideFilter}
                isVisible
                style={{
                    margin: 0,
                    justifyContent: 'flex-end',
                    // height: height / 2
                }}
            >
                <View style={{
                    backgroundColor: 'white',
                    maxHeight: height / 1.2,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    padding: moderateScale(16)
                    // flex:1
                }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps='handled'
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{
                                fontSize: moderateScale(15),
                                fontFamily: fontFamily.bold
                            }}>{strings.SORT_BY}</Text>

                            <TouchableOpacity
                                onPress={onClearFilter}
                            >
                                <Text style={{
                                    fontSize: moderateScale(14),
                                    fontFamily: fontFamily.bold,
                                    color: colors.redB
                                }}>{strings.CLEAR_FILTER}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            ...styles.horizontalLine,
                            borderBottomColor: isDarkMode
                                ? colors.whiteOpacity22
                                : colors.lightGreyBg,
                        }} />
                        {sortFilters.map((val, i) => {
                            return sortingView(val, i)
                        })}
                        <View style={{
                            ...styles.horizontalLine,
                            borderBottomColor: isDarkMode
                                ? colors.whiteOpacity22
                                : colors.lightGreyBg,
                        }} />
                        <Text style={{
                            fontSize: moderateScale(15),
                            fontFamily: fontFamily.bold
                        }}>{strings.PRICE_RANGE}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: moderateScaleVertical(8) }}>
                            <Text style={{
                                fontSize: moderateScale(14),
                                fontFamily: fontFamily.regular
                            }}>{minimumPrice}</Text>
                            <Text style={{
                                fontSize: moderateScale(14),
                                fontFamily: fontFamily.regular
                            }}>{maximumPrice}</Text>
                        </View>
                        <View style={{ marginHorizontal: moderateScale(12), marginBottom: moderateScaleVertical(8) }}>
                            <MultiSlider
                                values={[minimumPrice, maximumPrice]}
                                sliderLength={width / 1.2}
                                onValuesChange={_priceChangeHandler}
                                containerStyle={{ height: moderateScale(30) }}
                                min={0}
                                max={50000}
                                step={1}
                                allowOverlap={false}
                                selectedStyle={{
                                    ...styles.selectedStyle,
                                    backgroundColor: themeColors.primary_color,
                                }}
                                // Style={{height:40}}
                                customMarker={() => <View style={{
                                    ...styles.customMarker,
                                    backgroundColor: themeColors.primary_color,
                                }}
                                />
                                }
                            />
                        </View>
                        <View>
                            {filterTypes.map((val, i) => {
                                return filterView(val, i)
                            })}
                        </View>
                    </ScrollView>
                    <GradientButton
                        colorsArray={[
                            themeColors.primary_color,
                            themeColors.primary_color,
                        ]}
                        // textStyle={styles.textStyle}
                        onPress={onDone}
                        marginTop={moderateScaleVertical(10)}
                        marginBottom={moderateScaleVertical(30)}
                        btnText={strings.DONE}
                    />
                </View>
            </Modal>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sortingView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: moderateScaleVertical(20)
    },
    horizontalLine: {
        width: '100%',
        borderBottomWidth: 0.5,
        marginVertical: moderateScaleVertical(8)
    },
    selectedStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 3,
    },
    customMarker: {
        alignItems: 'center',
        height: 15,
        width: 15,
        borderRadius: 15 / 2,
    },
});

//make this component available to the app
export default React.memo(FilterComp);
