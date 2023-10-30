import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale } from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';

export default function CategoriesCard({ item = {}, onPress = () => { } }) {
    const {
        appStyle
    } = useSelector(state => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;

    const styles = stylesData({ fontFamily })

    let imageURI = getImageUrl(
        item?.image?.image_fit,
        item?.image?.image_path,
        '900/900',
    );
    return (
        <TouchableOpacity style={{
            borderRadius: moderateScale(16),
        }} onPress={onPress}>
            <View style={styles.shadowContainer} />
            <FastImage
                style={{
                    borderRadius: moderateScale(16),
                    height: moderateScaleVertical(149),
                    width: moderateScale(166),
                }}
                source={{
                    uri: imageURI, cache: FastImage.cacheControl.immutable,
                    priority: FastImage.priority.high,
                }} />
            <Text style={styles.title}>{item?.name}</Text>
        </TouchableOpacity>
    )
}

function stylesData({ fontFamily }) {
    const styles = StyleSheet.create({
        shadowContainer: {
            borderRadius: moderateScale(16),
            height: moderateScaleVertical(149),
            width: moderateScale(166),
            position: "absolute",
            backgroundColor: colors.blackOpacity40,
            zIndex: 1
        },
        title: { position: 'absolute', bottom: 10, left: 10, color: colors.white, fontFamily: fontFamily?.medium, fontSize: textScale(16), zIndex: 2 }

    })

    return styles
}