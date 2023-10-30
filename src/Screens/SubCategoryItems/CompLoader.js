//import liraries
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import BannerLoader from '../../Components/Loaders/BannerLoader';
import CategoryLoader2 from '../../Components/Loaders/CategoryLoader2';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import { moderateScale, moderateScaleVertical, width } from '../../styles/responsiveSize';
import Ecomheader from '../../Components/EcomHeader';

// create a component
const CompLoader = ({
    appStyle = { homePageLayout: 1 },
    isDarkMode = { isDarkMode },
    themeColors = { themeColors },
    navigation={navigation}
}) => {
    return (
        <>
            <Ecomheader
                isDarkMode={isDarkMode}
                navigation={navigation}
                style={{ marginBottom: moderateScaleVertical(16) }}
                themeColors={themeColors}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                }}>
                <CategoryLoader2 viewStyles={{ marginVertical: moderateScale(16) }} />

                {appStyle?.homePageLayout === 5 ? (
                    <CategoryLoader2 viewStyles={{ marginBottom: moderateScale(16) }} />
                ) : null}
                {appStyle?.homePageLayout === 5 ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            marginBottom: moderateScaleVertical(16),
                        }}>
                        <HeaderLoader
                            widthLeft={moderateScale(width / 1.2)}
                            rectWidthLeft={moderateScale(width / 1.2)}
                            heightLeft={moderateScaleVertical(140)}
                            rectHeightLeft={moderateScaleVertical(140)}
                            isRight={false}
                            rx={15}
                            ry={15}
                        />
                        <HeaderLoader
                            widthLeft={moderateScale(width / 1.2)}
                            rectWidthLeft={moderateScale(width / 1.2)}
                            heightLeft={moderateScaleVertical(140)}
                            rectHeightLeft={moderateScaleVertical(140)}
                            isRight={false}
                            rx={15}
                            ry={15}
                        />
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row' }}>
                        <HeaderLoader
                            viewStyles={{
                                marginTop: moderateScaleVertical(8),
                                marginBottom: moderateScaleVertical(16),
                            }}
                            widthLeft={moderateScale(150)}
                            rectWidthLeft={moderateScale(150)}
                            heightLeft={moderateScaleVertical(240)}
                            rectHeightLeft={moderateScaleVertical(240)}
                            isRight={false}
                            rx={15}
                            ry={15}
                        />
                        <HeaderLoader
                            viewStyles={{
                                marginTop: moderateScaleVertical(8),
                                marginBottom: moderateScaleVertical(16),
                            }}
                            widthLeft={moderateScale(150)}
                            rectWidthLeft={moderateScale(150)}
                            heightLeft={moderateScaleVertical(240)}
                            rectHeightLeft={moderateScaleVertical(240)}
                            isRight={false}
                            rx={15}
                            ry={15}
                        />
                        <HeaderLoader
                            viewStyles={{
                                marginTop: moderateScaleVertical(8),
                                marginBottom: moderateScaleVertical(16),
                            }}
                            widthLeft={moderateScale(150)}
                            rectWidthLeft={moderateScale(150)}
                            heightLeft={moderateScaleVertical(240)}
                            rectHeightLeft={moderateScaleVertical(240)}
                            isRight={false}
                            rx={15}
                            ry={15}
                        />
                    </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <HeaderLoader
                        widthLeft={moderateScale(180)}
                        rectWidthLeft={moderateScale(180)}
                        rectHeightLeft={moderateScaleVertical(60)}
                        isRight={false}
                        rx={4}
                        ry={4}
                    />
                    <HeaderLoader
                        widthLeft={moderateScale(100)}
                        rectWidthLeft={moderateScale(100)}
                        rectHeightLeft={moderateScaleVertical(60)}
                        isRight={false}
                        rx={4}
                        ry={4}
                    />
                </View>

                <BannerLoader
                    // isVendorLoader
                    viewStyles={{ marginTop: moderateScale(12) }}
                />
                <BannerLoader
                    // isVendorLoader
                    viewStyles={{ marginTop: moderateScale(12) }}
                />
                <BannerLoader
                    // isVendorLoader
                    viewStyles={{ marginTop: moderateScale(12) }}
                />

            </ScrollView>
        </>
    );
};


export default CompLoader;
