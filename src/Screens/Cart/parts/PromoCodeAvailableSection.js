import React from 'react';
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    moderateScale,
} from '../../../styles/responsiveSize';
import FastImage from 'react-native-fast-image';
import colors from '../../../styles/colors';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';

/**
 * PromoCodeAvailableSection Part
 * @param {item ,styles,cartData,themeColors, _getAllOffers,_removeCoupon} props 
 * @returns 
 */

function PromoCodeAvailableSection(props) {
    const { item, styles, cartData, themeColors, _getAllOffers, _removeCoupon } = props;
    return (
        <>
            {/* offerview */}
            {
                !!item?.is_promo_code_available && (
                    <TouchableOpacity
                        disabled={item?.couponData ? true : false}
                        onPress={() => _getAllOffers(item.vendor, cartData)}
                        style={styles.offersViewB}>
                        {item?.couponData ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <View
                                    style={{
                                        flex: 0.7,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                    <FastImage
                                        source={imagePath.percent}
                                        resizeMode="contain"
                                        style={{
                                            width: moderateScale(16),
                                            height: moderateScale(16),
                                            tintColor: themeColors.primary_color,
                                        }}
                                    />
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.viewOffers,
                                            { marginLeft: moderateScale(10) },
                                        ]}>
                                        {`${item?.couponData?.name} ${strings.CODE} ${strings.APPLYED}`}
                                    </Text>
                                </View>
                                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                                    {/* <Image source={imagePath.crossBlueB}  /> */}
                                    <Text
                                        onPress={() => _removeCoupon(item, cartData)}
                                        style={[
                                            styles.removeCoupon,
                                            { color: colors.cartItemPrice },
                                        ]}>
                                        {strings.REMOVE}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <FastImage
                                    source={imagePath.percent}
                                    resizeMode="contain"
                                    style={{
                                        width: moderateScale(24),
                                        height: moderateScale(24),
                                        tintColor: themeColors.primary_color,
                                    }}
                                />

                                <Text
                                    style={[
                                        styles.viewOffers,
                                        { marginLeft: moderateScale(10) },
                                    ]}>
                                    {strings.APPLY_PROMO_CODE}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )
            }
        </>

    )

}
export default React.memo(PromoCodeAvailableSection);