//import liraries
import { isEmpty } from 'lodash';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import { hitSlopProp } from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';



// create a component
const ServicesCard = ({
    data = {},
    focused = false,
    selectedType = null,
    selectedService = {},
    setCheckBoxData = () => { },
    setVariantData = () => { },
    onSelect = () => { },
    selectedFilter = null,
    onIncrement = () => { },
    onDecrement = () => { },
    selectedItemID = '',
}) => {
    const { appData, themeColors, themeLayouts, currencies, languages, themeColor, themeToggle, redirectedFrom, } = useSelector((state) => state?.initBoot)
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const styles = stylesFunc({ themeColors, fontFamily });
    const { symbol } = currencies?.all_currencies[0]
    const { id, translation_title, variant = [], qtyText, } = data
    const { price, id: variantId } = !isEmpty(variant) && variant[0]

    return (
        <View style={styles.container}>
            <View style={styles.component}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', flex: 0.8 }}
                    onPress={() => setCheckBoxData(data)}>
                    <Image style={{ height: moderateScaleVertical(18), width: moderateScale(18) }}
                        source={(focused && selectedService.id == id) ? imagePath.icCheck1 : imagePath.icCheck2} />
                    <Text
                        numberOfLines={4}
                        style={{
                            fontSize: textScale(12),
                            padding: moderateScale(10),
                            fontFamily: fontFamily.medium,
                            color: colors.black,
                        }}>
                        {translation_title || data?.translation[0]?.title}
                    </Text>

                </TouchableOpacity>
                <View
                    style={{
                        ...styles.addBtnStyle,
                        backgroundColor: isDarkMode
                            ? themeColors.primary_color
                            : colors.greyColor2,
                        flex: 0.15
                    }}>
                    <TouchableOpacity
                        disabled={selectedItemID == data?.id}
                        onPress={onDecrement}
                        activeOpacity={0.8}
                        hitSlop={hitSlopProp}>
                        <Image
                            style={{
                                tintColor: isDarkMode
                                    ? colors.white
                                    : themeColors.primary_color,
                            }}
                            source={imagePath.icMinus2}
                        />
                    </TouchableOpacity>

                    <Animatable.View>
                        <Animatable.View style={{ overflow: 'hidden' }}>
                            <Animatable.Text
                                duration={200}
                                numberOfLines={2}
                                style={{
                                    fontFamily: fontFamily.medium,
                                    fontSize: moderateScale(14),
                                    color: isDarkMode
                                        ? colors.white
                                        : themeColors.primary_color,
                                    marginHorizontal: moderateScale(8),
                                }}>
                                {qtyText}
                            </Animatable.Text>
                        </Animatable.View>
                    </Animatable.View>

                    <TouchableOpacity
                        disabled={selectedItemID == data?.id}
                        activeOpacity={0.8}
                        hitSlop={hitSlopProp}
                        onPress={onIncrement}>
                        <Image
                            style={{
                                tintColor: isDarkMode
                                    ? colors.white
                                    : themeColors.primary_color,
                            }}
                            source={imagePath.icAdd4}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// define your styles
const stylesFunc = ({ themeColors, fontFamily }) => {
    const styles = StyleSheet.create({
        container: {
            marginHorizontal: moderateScale(24),
            marginVertical: moderateScale(10),
        },
        component: {
            height: moderateScaleVertical(57),
            backgroundColor: colors.lightGray,
            borderRadius: moderateScale(4),
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: moderateScale(10),
            zIndex: 4,
            shadowColor: colors.textGreyB,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 0.5,
            elevation: 2,
            flex: 1
        },
        viewAllVeiw: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginHorizontal: moderateScale(16),
            marginBottom: moderateScaleVertical(24),
            marginTop: moderateScaleVertical(15),
        },
        menuView: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: moderateScale(4),
            borderWidth: 0.5,
            borderColor: colors.textGreyB,
            padding: moderateScale(6),
        },
        exploreStoresTxt: {
            fontFamily: fontFamily.medium,
            fontSize: textScale(14),
            textAlign: 'left',
        },

        viewAllText: {
            color: themeColors.primary_color,
            fontFamily: fontFamily.medium,
            fontSize: textScale(12),
        },
        addBtnStyle: {
            borderWidth: 1,
            borderRadius: moderateScale(8),
            borderColor: themeColors.primary_color,
            paddingVertical: 0,
            height: moderateScale(38),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: moderateScale(12),
            // width: moderateScale(50),
            alignSelf: 'center',
            flex: 0.1
        },
    });
    return styles
}

//make this component available to the app
export default ServicesCard;
