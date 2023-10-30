import React, { useState } from 'react';
import {
    Animated,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import { UIActivityIndicator } from 'react-native-indicators';
import {
    getColorCodeWithOpactiyNumber,
    getImageUrl
} from '../../../utils/helperFunctions';
import {
    height,
    moderateScale,
    moderateScaleVertical,
    textScale,
    width,
} from '../../../styles/responsiveSize';
import { getBundleId } from 'react-native-device-info';
import { cloneDeep, isEmpty } from 'lodash';
import FastImage from 'react-native-fast-image';
import { getHourAndMinutes, tokenConverterPlusCurrencyNumberFormater } from '../../../utils/commonFunction';
import { MyDarkTheme } from '../../../styles/theme';
import imagePath from '../../../constants/imagePath';
import colors from '../../../styles/colors';
import { appIds } from '../../../utils/constants/DynamicAppKeys';
import strings from '../../../constants/lang';
import { useSelector } from 'react-redux';
import commonStylesFunc, { hitSlopProp } from '../../../styles/commonStyles';




/**
 * SwipeableSection Part
 * @param {item ,deleteItem,addDeleteCartItems,swipeRef,swipeKey,swipeBtns,isDarkMode,stylesfontFamily,btnLoadrId,btnLoader,digit_after_decimal,additional_preferences,currencies,cartData,scheduleType,openDeleteView,openPickerForPrescription,selectCartItem,parentIndex,showCheckBox} props 
 * @returns 
 */

function SwipeableSection(props) {

    const { item, deleteItem, addDeleteCartItems, swipeRef, swipeKey, swipeBtns, isDarkMode, styles, fontFamily, btnLoadrId, btnLoader, digit_after_decimal, additional_preferences, currencies, cartData, scheduleType, openDeleteView, openPickerForPrescription, selectCartItem, parentIndex, showCheckBox = false } = props;
    const { themeColors } = useSelector((state) => state?.initBoot);

    const commonStyles = commonStylesFunc({ fontFamily });

    return (

        <>
            {item?.vendor_products.length > 0
                ? item?.vendor_products.map((i, inx) => {
                    return (
                        <Swipeable
                            ref={swipeRef}
                            key={swipeKey + Math.random()}
                            renderRightActions={swipeBtns}
                            onSwipeableOpen={() => deleteItem(i, inx)}
                            rightThreshold={width / 1.4}
                            enabled={false}
                        // overshootFriction={8}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* {showCheckBox ? <TouchableOpacity
                                    onPress={() => selectCartItem(i)} style={{ marginHorizontal: moderateScale(5) }}>
                                    <FastImage style={{
                                        height: moderateScale(20),
                                        width: moderateScale(20)
                                    }} source={i?.is_cart_checked ? imagePath.checkBox2Active : imagePath.checkBox2InActive} />
                                </TouchableOpacity> : null} */}
                                <Animated.View
                                    style={{
                                        backgroundColor: isDarkMode
                                            ? MyDarkTheme.colors.lightDark
                                            : colors.transactionHistoryBg,
                                        marginBottom: moderateScaleVertical(12),
                                        // marginRight: moderateScale(8),
                                        borderRadius: moderateScale(12),
                                        transform: [],
                                    }}
                                    key={inx}>

                                    <View
                                        style={{
                                            ...styles.cartItemMainContainer,
                                            minHeight: moderateScaleVertical(110),
                                            width: showCheckBox ? moderateScale(330) : width / 1.06,
                                            alignItems: 'center'
                                        }}>

                                        <View
                                            style={[
                                                styles.cartItemImage,
                                                {
                                                    backgroundColor: isDarkMode
                                                        ? MyDarkTheme.colors.lightDark
                                                        : colors.white,
                                                },
                                            ]}
                                        >

                                            <FastImage
                                                source={
                                                    i?.cartImg != "" && i?.cartImg != null
                                                        ? {
                                                            uri: getImageUrl(
                                                                i?.cartImg?.path?.proxy_url,
                                                                i?.cartImg?.path?.image_path,
                                                                "300/300"
                                                            ),
                                                            priority: FastImage.priority.high,
                                                            cache: FastImage.cacheControl.immutable,
                                                        }
                                                        : imagePath.patternOne
                                                }
                                                style={styles.imageStyle}
                                            />
                                        </View>

                                        <View style={styles.cartItemDetailsCon}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}>
                                                <View style={{ flex: 1 }}>
                                                    {i?.luxury_option_id !== 4 ? (
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                flex: 1,
                                                            }}>
                                                            <View style={{ flex: 0.6 }}>

                                                                {/* {!!i?.product?.category_name?.name && (
                                                                    <Text
                                                                        numberOfLines={1}
                                                                        style={{
                                                                            ...styles.priceItemLabel2,
                                                                            color: isDarkMode
                                                                                ? MyDarkTheme.colors.text
                                                                                : colors.textGreyB,
                                                                            fontSize: textScale(12),
                                                                            fontFamily: fontFamily.medium,

                                                                        }}>
                                                                        {i?.product?.category_name.name},
                                                                    </Text>
                                                                )} */}
                                                                <Text
                                                                    numberOfLines={1}
                                                                    style={{
                                                                        ...styles.priceItemLabel2,
                                                                        color: isDarkMode
                                                                            ? MyDarkTheme.colors.text
                                                                            : colors.blackOpacity86,
                                                                        fontSize: textScale(14),
                                                                        fontFamily: fontFamily.bold,

                                                                    }}>
                                                                    {i?.product?.translation[0]?.title},
                                                                </Text>

                                                            </View>

                                                            <View style={{ marginHorizontal: moderateScale(8) }} />


                                                        </View>
                                                    ) : null}

                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent:'space-between',
                                                            marginVertical: moderateScaleVertical(4)
                                                        }}>
                                                        {/* <Text
                                                            style={{
                                                                ...styles.priceItemLabel2,
                                                                fontSize: textScale(12),
                                                                fontFamily:fontFamily.regular,
                                                                color: isDarkMode
                                                                    ? MyDarkTheme.colors.text
                                                                    : colors.textGreyOpcaity7,
                                                                // marginTop: moderateScaleVertical(4),
                                                                fontFamily: fontFamily.regular,
                                                            }}>
                                                            {i?.quantity} X

                                                            {(i?.recurring_day_data != undefined && i?.recurring_day_data != null) &&
                                                                <Text> ({(i?.recurring_day_data.match(/,/g) || []).length + 1}) Days  X{' '}</Text>
                                                            }

                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontFamily:fontFamily.regular,
                                                                color: isDarkMode
                                                                    ? MyDarkTheme.colors.text
                                                                    : colors.textGreyOpcaity7,
                                                            }}>
                                                            {tokenConverterPlusCurrencyNumberFormater(
                                                                Number(i?.variants?.price),
                                                                digit_after_decimal,
                                                                additional_preferences,
                                                                currencies?.primary_currency?.symbol,
                                                            )}
                                                        </Text>
                                                        <Text> = </Text> */}
                                                        <Text
                                                            style={{
                                                                fontFamily:fontFamily.regular,
                                                                color: isDarkMode
                                                                    ? MyDarkTheme.colors.text
                                                                    : colors.black,
                                                                    fontSize:textScale(14),
                                                                    fontFamily:fontFamily.bold
                                                            }}>
                                                            {tokenConverterPlusCurrencyNumberFormater(
                                                                Number(i?.variants?.quantity_price),
                                                                digit_after_decimal,
                                                                additional_preferences,
                                                                currencies?.primary_currency?.symbol,
                                                            )}
                                                        </Text>
                                                        <View style={{ flex: 0.5,flexDirection:'row',alignItems:'center' }}>
                                                                <View style={{
                                                                    ...commonStyles.buttonRect,
                                                                    borderWidth: 0.4,
                                                                    borderRadius: moderateScale(20),
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'space-between',
                                                                    paddingHorizontal: moderateScale(12),
                                                                    backgroundColor:  themeColors.primary_color,
                                                                    width: moderateScale(70),
                                                                    borderColor: themeColors?.primary_color,
                                                                    height: moderateScale(24),
                                                                    marginVertical: moderateScaleVertical(4)
                                                                }}>
                                                                    <TouchableOpacity
                                                                        style={{ alignItems: 'center' }}
                                                                        onPress={() =>
                                                                            addDeleteCartItems(i, inx, 2)
                                                                        }>
                                                                        <FastImage
                                                                            tintColor={colors.white}
                                                                            style={{
                                                                                height: moderateScale(10),
                                                                                width: moderateScale(10),


                                                                            }}
                                                                            resizeMode='contain'
                                                                            source={imagePath.icMinus2}
                                                                        />
                                                                    </TouchableOpacity>
                                                                    <View
                                                                        style={{
                                                                            alignItems: 'center',
                                                                            // width: moderateScale(20),
                                                                            height: moderateScale(20),
                                                                            justifyContent: 'center',
                                                                        }}>

                                                                        <View style={{

                                                                            width: moderateScale(20),
                                                                            alignItems: 'center'
                                                                        }}>
                                                                            {btnLoadrId === i.id && btnLoader ? (
                                                                                <UIActivityIndicator
                                                                                    size={moderateScale(16)}
                                                                                    color={colors.white}
                                                                                />
                                                                            ) : (
                                                                                <Text style={{

                                                                                    fontSize: textScale(13),
                                                                                    color: isDarkMode
                                                                                        ? MyDarkTheme.colors.text
                                                                                        : colors.white,
                                                                                    fontFamily: fontFamily.medium,
                                                                                }}>
                                                                                    {i?.quantity}
                                                                                </Text>
                                                                            )}
                                                                        </View>

                                                                    </View>

                                                                    <TouchableOpacity
                                                                        style={{ alignItems: 'center' }}
                                                                        onPress={() =>
                                                                            addDeleteCartItems(i, inx, 1)
                                                                        }>
                                                                        <FastImage
                                                                            tintColor={colors.white}
                                                                            style={{
                                                                                height: moderateScale(10),
                                                                                width: moderateScale(10),

                                                                                // marginLeft: moderateScale(3)
                                                                            }}
                                                                            resizeMode='contain'
                                                                            source={imagePath.plus}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                                <TouchableOpacity

                                                                    onPress={() => openDeleteView(i)}>
                                                                    <FastImage
                                                                        source={imagePath.deleteRed}
                                                                        resizeMode="contain"
                                                                        style={{
                                                                            width: moderateScale(16),
                                                                            height: moderateScale(18),
                                                                            marginLeft:moderateScale(10)

                                                                        }}
                                                                    />
                                                                </TouchableOpacity>
                                                            </View>
                                                    </View>
                                                    {!!i?.schedule_slot ?<Text style={{
                                                        fontFamily:fontFamily.regular,
                                                        fontSize:textScale(10),
                                                         color: isDarkMode
                                                         ? MyDarkTheme.colors.text
                                                         : colors.blackOpacity40,
                                                        marginBottom:moderateScaleVertical(4)
                                                    }} > {i?.scheduled_date_time} {i?.schedule_slot}</Text>:null}
                                                  
                                                    {/* {i?.variant_options.length > 0
                                                        ? i?.variant_options.map((j, jnx) => {
                                                            return (
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Text
                                                                        style={
                                                                            isDarkMode
                                                                                ? [
                                                                                    styles.cartItemWeight2,
                                                                                    {
                                                                                        color:
                                                                                            MyDarkTheme.colors.text,
                                                                                    },
                                                                                ]
                                                                                : styles.cartItemWeight2
                                                                        }
                                                                        numberOfLines={1}>
                                                                        {j.title}{' '}
                                                                    </Text>
                                                                    <Text
                                                                        style={
                                                                            isDarkMode
                                                                                ? [
                                                                                    styles.cartItemWeight2,
                                                                                    {
                                                                                        color:
                                                                                            MyDarkTheme.colors.text,
                                                                                    },
                                                                                ]
                                                                                : styles.cartItemWeight2
                                                                        }
                                                                        numberOfLines={
                                                                            1
                                                                        }>{`(${j.option})`}</Text>
                                                                </View>
                                                            );
                                                        })
                                                        : null} */}
                                                </View>
                                            </View>

                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}>
                                                {/* <View
                                                    style={{
                                                        flex: 1,
                                                        justifyContent: 'center',
                                                    }}>
                                                    {!!i?.product_addons.length > 0 ? (
                                                        <View>
                                                            <Text
                                                                style={{
                                                                    ...styles.cartItemWeight2,
                                                                    color: isDarkMode
                                                                        ? MyDarkTheme.colors.text
                                                                        : colors.textGreyOpcaity7,
                                                                    marginBottom: moderateScale(2),
                                                                    marginTop: moderateScaleVertical(6),
                                                                    fontFamily: fontFamily.bold,
                                                                }}>
                                                                {strings.EXTRA}
                                                            </Text>
                                                        </View>
                                                    ) : (
                                                        <View />
                                                    )}

                                                    <View>
                                                        {i?.product_addons.length > 0
                                                            ? i?.product_addons.map((j, jnx) => {
                                                                return (
                                                                    <View
                                                                        style={{
                                                                            marginBottom:
                                                                                moderateScaleVertical(4),
                                                                        }}>
                                                                        <View
                                                                            style={{
                                                                                marginRight: moderateScale(10),
                                                                            }}>
                                                                            <Text
                                                                                style={
                                                                                    isDarkMode
                                                                                        ? [
                                                                                            styles.cartItemWeight2,
                                                                                            {
                                                                                                color:
                                                                                                    MyDarkTheme.colors
                                                                                                        .text,
                                                                                            },
                                                                                        ]
                                                                                        : styles.cartItemWeight2
                                                                                }
                                                                            // numberOfLines={1}
                                                                            >
                                                                                {j.addon_title}{" "}
                                                                                {`(${j.option_title})`} ={" "}
                                                                                {
                                                                                    tokenConverterPlusCurrencyNumberFormater(
                                                                                        Number(j.price),
                                                                                        digit_after_decimal,
                                                                                        additional_preferences,
                                                                                        currencies?.primary_currency?.symbol,
                                                                                    )
                                                                                }
                                                                            </Text >
                                                                        </View >
                                                                    </View >
                                                                );
                                                            })
                                                            : null}
                                                    </View >
                                                    {!!(
                                                        !!i?.pvariant &&
                                                        Number(i?.pvariant?.container_charges)
                                                    ) && (
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    marginTop: moderateScale(2),
                                                                }}>
                                                                <View>
                                                                    <Text
                                                                        style={{
                                                                            ...styles.cartItemWeight2,
                                                                            color: isDarkMode
                                                                                ? MyDarkTheme.colors.text
                                                                                : colors.textGreyB,
                                                                            marginBottom: moderateScale(2),
                                                                            // marginTop: moderateScaleVertical(6),
                                                                        }}>
                                                                        {`${strings.CONTAINERCHARGES} : `}
                                                                    </Text>
                                                                </View>
                                                                {!!(
                                                                    !!i?.pvariant &&
                                                                    Number(i?.pvariant?.container_charges)
                                                                ) && (
                                                                        <View
                                                                            style={{
                                                                                marginBottom: moderateScaleVertical(2),
                                                                            }}>
                                                                            <View
                                                                                style={{
                                                                                    marginRight: moderateScale(10),
                                                                                }}>
                                                                                <Text
                                                                                    style={
                                                                                        isDarkMode
                                                                                            ? [
                                                                                                styles.cartItemWeight2,
                                                                                                {
                                                                                                    color:
                                                                                                        MyDarkTheme.colors.text,
                                                                                                },
                                                                                            ]
                                                                                            : styles.cartItemWeight2
                                                                                    }
                                                                                // numberOfLines={1}
                                                                                >
                                                                                    {tokenConverterPlusCurrencyNumberFormater(
                                                                                        Number(
                                                                                            i?.pvariant?.container_charges
                                                                                        ) * Number(i?.quantity),
                                                                                        digit_after_decimal,
                                                                                        additional_preferences,
                                                                                        currencies?.primary_currency?.symbol
                                                                                    )}
                                                                                </Text>
                                                                            </View>
                                                                        </View>
                                                                    )}
                                                            </View>
                                                        )}
                                                </View> */}

                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        alignSelf: 'flex-end',
                                                        marginTop: moderateScale(6),
                                                    }}>
                                                    {!!(
                                                        i?.faq_count &&
                                                        i?.user_product_order_form == null
                                                    ) && (
                                                            <>
                                                                <TouchableOpacity
                                                                    style={{
                                                                        marginRight: moderateScale(14),
                                                                    }}
                                                                    onPress={() => getProductFAQs(i)}>
                                                                    <FastImage
                                                                        source={imagePath.edit1Royo}
                                                                        resizeMode="contain"
                                                                        style={{
                                                                            width: moderateScale(16),
                                                                            height: moderateScale(16),
                                                                        }}
                                                                    />
                                                                </TouchableOpacity>
                                                            </>
                                                        )}
                                                    <View>
                                                        {!!i?.product?.pharmacy_check && (
                                                            <TouchableOpacity
                                                                onPress={() => openPickerForPrescription(i)}
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    marginBottom: moderateScaleVertical(24),
                                                                }}>
                                                                {/* <Image source={imagePath.icAddPlaceholder} /> */}
                                                                <Image source={imagePath.icPrescription} />
                                                            </TouchableOpacity>
                                                        )}

                                                    </View>
                                                </View>
                                            </View >
                                        </View >
                                        {!!cartData?.delay_date && (
                                            <Text
                                                style={{
                                                    fontSize: moderateScale(12),
                                                    fontFamily: fontFamily.medium,
                                                    color: colors.redFireBrick,
                                                    marginBottom: moderateScale(3),
                                                }}>{`${i?.product.delay_order_hrs > 0 ||
                                                    i?.product.delay_order_min > 0
                                                    ? strings.PREPARATION_TIME_IS
                                                    : ''
                                                    }${i?.product.delay_order_hrs > 0
                                                        ? ` ${i?.product.delay_order_hrs} hrs`
                                                        : ''
                                                    }${i?.product.delay_order_min > 0
                                                        ? ` ${i?.product.delay_order_min} mins`
                                                        : ''
                                                    }`}</Text>
                                        )}
                                    </View >
                                    {!!i?.is_processor_enable && (
                                        <View>
                                            <Text
                                                style={{
                                                    fontSize: moderateScale(14),
                                                    fontFamily: fontFamily.regular,
                                                    color: colors.black,
                                                }}>
                                                {'Processor Name : '} {i?.processor_name}{' '}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: moderateScale(14),
                                                    fontFamily: fontFamily.regular,
                                                    color: colors.black,
                                                }}>
                                                {'Date : '} {i?.processor_date}{' '}
                                            </Text>
                                        </View>
                                    )}
                                    {
                                        i?.luxury_option_id == 4 ? (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    marginHorizontal: moderateScale(20),
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                }}>
                                                <View>
                                                    <Text style={styles.startEndDateTitle}>
                                                        {strings.START_DATE}
                                                    </Text>
                                                    <Text style={styles.startEndDateValueTxt}>
                                                        {i?.start_date_time}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.startEndDateTitle}>
                                                        {strings.END_DATE}
                                                    </Text >
                                                    <Text style={styles.startEndDateValueTxt}>
                                                        {i?.end_date_time}
                                                    </Text>
                                                </View >
                                                <View>
                                                    <Text style={styles.startEndDateTitle}>
                                                        {strings.DURATION}
                                                    </Text >
                                                    <Text style={styles.startEndDateValueTxt}>
                                                        {getHourAndMinutes(Number(i?.total_booking_time))}
                                                    </Text>
                                                </View >
                                            </View >
                                        ) : null
                                    }
                                    {
                                        !!i?.delivery_date ? (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    marginHorizontal: moderateScale(20),
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginBottom: 3,
                                                }}>
                                                <View>
                                                    <Text style={styles.startEndDateTitle}>
                                                        {strings.DELIVERY_DATE}
                                                    </Text>
                                                    <Text style={styles.startEndDateValueTxt}>
                                                        {i?.delivery_date}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.startEndDateTitle}>
                                                        {strings.DELIVERY_SLOT}
                                                    </Text>
                                                    <Text style={styles.startEndDateValueTxt}>
                                                        {`${i?.product_delivery_slot?.title} (${i?.product_delivery_slot?.start_time} - ${i?.product_delivery_slot?.end_time})`}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.startEndDateTitle}>
                                                        {strings.SLOT_PRICE}
                                                    </Text>
                                                    <Text style={styles.startEndDateValueTxt}>
                                                        {tokenConverterPlusCurrencyNumberFormater(
                                                            Number(i?.product_delivery_slot?.price || 0),
                                                            digit_after_decimal,
                                                            additional_preferences,
                                                            currencies?.primary_currency?.symbol,
                                                        )}
                                                    </Text>
                                                </View>
                                            </View>
                                        ) : null
                                    }
                                    {/* <View style={styles.dashedLine} /> */}

                                    {i.is_recurring_booking == 1 && !!scheduleType ?
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                marginHorizontal: moderateScale(20),
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: 3,
                                            }}>
                                            <View >
                                                <Text style={styles.startEndDateTitle}>
                                                    {'Schedule Type'}
                                                </Text>
                                                <Text style={styles.startEndDateValueTxt}>
                                                    {scheduleType}
                                                </Text>
                                            </View>
                                            {scheduleType !== "Custom" &&
                                                <View style={{ width: moderateScale(200) }}>
                                                    <Text style={styles.startEndDateTitle}>
                                                        {'Start and End Date'}
                                                    </Text>
                                                    <Text style={styles.startEndDateValueTxt}>
                                                        {`${i?.recurring_day_data}`}
                                                    </Text>
                                                </View>
                                            }
                                            {!isEmpty(i?.recurring_week_day) &&
                                                <View>
                                                    <Text style={styles.startEndDateTitle}>
                                                        {'Week Days'}
                                                    </Text>
                                                    <Text style={styles.startEndDateValueTxt}>
                                                        {`${i?.recurring_week_day}`}
                                                    </Text>
                                                </View>
                                            }
                                            {/* <View>
                            <Text style={styles.startEndDateTitle}>
                              {strings.SLOT_PRICE}
                            </Text>
                            <Text style={styles.startEndDateValueTxt}>
                              {tokenConverterPlusCurrencyNumberFormater(
                                Number(i?.product_delivery_slot?.price || 0),
                                digit_after_decimal,
                                additional_preferences,
                                currencies?.primary_currency?.symbol,
                              )}
                            </Text>
                          </View> */}
                                        </View>
                                        : null}
                                </Animated.View >
                            </View>
                        </Swipeable >
                    );
                })
                : null}
        </>

    )

}
export default React.memo(SwipeableSection);