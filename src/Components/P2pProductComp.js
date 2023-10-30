import { isEmpty } from 'lodash';
import moment from 'moment';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { dummyUser } from '../constants/constants';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import { moderateScale, moderateScaleVertical, textScale, width } from '../styles/responsiveSize';
import { getImageUrl } from "../utils/helperFunctions";
import HTMLView from 'react-native-htmlview';
import { useDarkMode } from 'react-native-dynamic';
import RenderHTML from 'react-native-render-html';


export default function P2pProductComp({ item = {}, isMoreDetails = false, isViewDetails = true, onViewDetails = () => { }, numberOfLines = 3 }) {
    const {
        appData,
        themeColors,
        currencies,
        languages,
        appStyle,
        themeToggle,
        themeColor,
    } = useSelector((state) => state?.initBoot);
    const fontFamily = appStyle?.fontSizeData;
    const styles = stylesFunc({ fontFamily, themeColors })
    const darkthemeusingDevice = useDarkMode();
    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

    const imageUrl =
        !isEmpty(item?.product_details)
            ? getImageUrl(
                item?.product_details[0]?.image_path?.image_fit,
                item?.product_details[0]?.image_path?.image_path,
                "300/300"
            )
            : dummyUser;

    const LeftImgRightTxt = ({ image, text }) => <View style={{
        flexDirection: "row",
        marginTop: moderateScaleVertical(8)
    }}>
        <Image source={image} />
        <Text style={styles.rightTxt}>{text}</Text>
    </View>

    const renderersProps = {
        p: {
            renderersProps: {
                base: {
                    numberOfLines,
                    ellipsizeMode: 'tail',
                },
            },
        },
    };

    return (
        <TouchableOpacity style={{ ...styles.touchContainer, backgroundColor: colors.whiteSmokeColor, }}>
            <View style={{
                flexDirection: "row",
                marginBottom: moderateScaleVertical(8),
            }}>
                <FastImage
                    source={{ uri: imageUrl }}
                    style={styles.imgStyle}
                // resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.mainContainer}>
                    <View style={{
                        flex: 0.98,
                    }}>
                        <Text style={{
                            fontFamily: fontFamily?.medium,
                            fontSize: textScale(14)
                        }}>{item?.product_details[0]?.translation[0]?.title || item?.product_details[0].title}</Text>
                        <RenderHTML
                            contentWidth={width}
                            renderersProps={renderersProps}
                            source={{
                                html: item?.product_details[0]?.translation[0]?.body_html
                                    ? item?.product_details[0]?.translation[0]?.body_html
                                    : ''
                            }}
                            tagsStyles={{
                                p: {
                                    color: isDarkMode ? colors.white : colors.textGreyB,
                                },
                            }}
                        />

                    </View>
                    {isViewDetails && <TouchableOpacity
                        onPress={onViewDetails}
                        style={styles.viewDetailsBtn}>
                        <Text style={{
                            fontFamily: fontFamily?.regular,
                            color: colors.white
                        }}>View Details</Text>
                    </TouchableOpacity>}
                </View>
            </View>
            {
                isMoreDetails && <View>
                    <LeftImgRightTxt image={imagePath.icTimeOrders} text={moment(item?.products[0]?.start_date_time).format("MMM DD, YYYY hh:mm") + " - " + moment(item?.products[0]?.end_date_time).format("MMM DD, YYYY hh:mm")} />
                    <LeftImgRightTxt image={imagePath.icLocationOrders} text={item?.products[0]?.product?.address} />
                    <LeftImgRightTxt image={imagePath.icProfileOrders} text={`Lent by ${item?.vendor?.name}`} />
                </View>
            }
        </TouchableOpacity>
    )
}

export function stylesFunc({ fontFamily, themeColors }) {
    const styles = StyleSheet.create({
        viewDetailsBtn: {
            padding: moderateScale(6),
            backgroundColor: "green",
            borderRadius: moderateScale(4),
            backgroundColor: colors.black,

        },
        descTxt: {
            fontFamily: fontFamily?.medium,
            fontSize: textScale(12),
            marginTop: moderateScaleVertical(8),
            color: colors.lightGreyText
        },
        mainContainer: {
            marginLeft: moderateScale(18),
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
        },
        imgStyle: {
            height: moderateScale(65),
            width: moderateScale(65),
            borderRadius: moderateScale(12)
        },
        touchContainer: {
            marginHorizontal: moderateScale(16),
            padding: moderateScale(10),
            borderRadius: moderateScale(12)
        },
        rightTxt: {
            fontFamily: fontFamily?.regular,
            marginLeft: moderateScale(8),
            color: colors.textGreyN
        }
    })
    return styles
}