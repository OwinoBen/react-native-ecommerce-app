//import liraries
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import Header from '../../Components/Header';
import CircularProfileLoader from '../../Components/Loaders/CircularProfileLoader';
import HeaderLoader from '../../Components/Loaders/HeaderLoader';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import { moderateScale, moderateScaleVertical, width } from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';

// create a component
const ScreenLoader = ({
    isDarkMode = false,
    appStyle = {},
    paramData = undefined
}) => {
    const navigation = useNavigation()
    return (
        <WrapperContainer
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
            statusBarColor={colors.white}
        >
            <Header
                leftIcon={
                    appStyle?.homePageLayout === 2
                        ? imagePath.backArrow
                        : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                            ? imagePath.icBackb
                            : imagePath.back
                }
                centerTitle={
                    strings.ORDER +
                    ` ${"xxxxxxxx"}
                    }`
                }
                onPressLeft={
                    !!paramData?.from
                        ? () => navigation.popToTop()
                        : () => navigation.goBack()
                }
            />
                     <HeaderLoader
                widthLeft={moderateScale(width / 1.2)}
                rectWidthLeft={moderateScale(width / 1.2)}
                heightLeft={moderateScaleVertical(140)}
                rectHeightLeft={moderateScaleVertical(140)}
                isRight={false}
                rx={15}
                ry={15}
                viewStyles={{
                    marginTop: moderateScaleVertical(20),
                }}
            />
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "flex-start",
                    marginVertical: moderateScaleVertical(10),
                    marginLeft: moderateScale(15),
                }}
            >
                <CircularProfileLoader isDesc={false} />
                <View>
                    <HeaderLoader
                        widthLeft={moderateScale(130)}
                        rectWidthLeft={moderateScale(130)}
                        rectHeightLeft={moderateScaleVertical(20)}
                        isRight={false}
                        rx={4}
                        ry={4}
                    />
                    <HeaderLoader
                        widthLeft={moderateScale(70)}
                        rectWidthLeft={moderateScale(70)}
                        rectHeightLeft={moderateScaleVertical(20)}
                        isRight={false}
                        rx={4}
                        ry={4}
                    />
                </View>
            </View>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "flex-start",
                    marginLeft: moderateScale(10),
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <HeaderLoader
                        widthLeft={moderateScale(100)}
                        rectWidthLeft={moderateScale(100)}
                        heightLeft={moderateScaleVertical(100)}
                        rectHeightLeft={moderateScaleVertical(100)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                    <View>
                        <HeaderLoader
                            widthLeft={moderateScale(130)}
                            rectWidthLeft={moderateScale(130)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            heightLeft={10}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                        <HeaderLoader
                            widthLeft={moderateScale(70)}
                            rectWidthLeft={moderateScale(70)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            viewStyles={{
                                marginTop: moderateScaleVertical(10),
                            }}
                            heightLeft={10}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                        <HeaderLoader
                            widthLeft={moderateScale(70)}
                            rectWidthLeft={moderateScale(70)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            viewStyles={{
                                marginTop: moderateScaleVertical(10),
                            }}
                            heightLeft={10}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                        <HeaderLoader
                            widthLeft={moderateScale(70)}
                            rectWidthLeft={moderateScale(70)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            heightLeft={10}
                            viewStyles={{
                                marginTop: moderateScaleVertical(10),
                            }}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                        <HeaderLoader
                            widthLeft={moderateScale(70)}
                            rectWidthLeft={moderateScale(70)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            heightLeft={10}
                            viewStyles={{
                                marginTop: moderateScaleVertical(10),
                            }}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                    </View>
                </View>
                <HeaderLoader
                    widthLeft={moderateScale(20)}
                    rectWidthLeft={moderateScale(20)}
                    heightLeft={moderateScaleVertical(20)}
                    rectHeightLeft={moderateScaleVertical(20)}
                    isRight={false}
                    rx={15}
                    ry={15}
                />
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "flex-start",
                    marginLeft: moderateScale(10),
                    justifyContent: "space-between",
                    marginTop: moderateScaleVertical(20),
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <HeaderLoader
                        widthLeft={moderateScale(100)}
                        rectWidthLeft={moderateScale(100)}
                        heightLeft={moderateScaleVertical(100)}
                        rectHeightLeft={moderateScaleVertical(100)}
                        isRight={false}
                        rx={15}
                        ry={15}
                    />
                    <View>
                        <HeaderLoader
                            widthLeft={moderateScale(130)}
                            rectWidthLeft={moderateScale(130)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            heightLeft={10}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                        <HeaderLoader
                            widthLeft={moderateScale(70)}
                            rectWidthLeft={moderateScale(70)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            viewStyles={{
                                marginTop: moderateScaleVertical(10),
                            }}
                            heightLeft={10}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                        <HeaderLoader
                            widthLeft={moderateScale(70)}
                            rectWidthLeft={moderateScale(70)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            viewStyles={{
                                marginTop: moderateScaleVertical(10),
                            }}
                            heightLeft={10}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                        <HeaderLoader
                            widthLeft={moderateScale(70)}
                            rectWidthLeft={moderateScale(70)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            heightLeft={10}
                            viewStyles={{
                                marginTop: moderateScaleVertical(10),
                            }}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                        <HeaderLoader
                            widthLeft={moderateScale(70)}
                            rectWidthLeft={moderateScale(70)}
                            rectHeightLeft={moderateScaleVertical(10)}
                            heightLeft={10}
                            viewStyles={{
                                marginTop: moderateScaleVertical(10),
                            }}
                            isRight={false}
                            rx={4}
                            ry={4}
                        />
                    </View>
                </View>
                <HeaderLoader
                    widthLeft={moderateScale(20)}
                    rectWidthLeft={moderateScale(20)}
                    heightLeft={moderateScaleVertical(20)}
                    rectHeightLeft={moderateScaleVertical(20)}
                    isRight={false}
                    rx={15}
                    ry={15}
                />
            </View>
            <HeaderLoader
                widthLeft={moderateScale(80)}
                rectWidthLeft={moderateScale(80)}
                heightLeft={moderateScaleVertical(20)}
                rectHeightLeft={moderateScaleVertical(20)}
                widthRight={moderateScale(40)}
                rectWidthRight={moderateScale(40)}
                heightRight={moderateScale(20)}
                rectHeightRight={moderateScale(20)}
                isRight={true}
                rx={5}
                ry={5}
                viewStyles={{
                    alignItems: "center",
                    width: width - moderateScale(30),
                    marginTop: moderateScaleVertical(20),
                }}
                rightViewStyle={{
                    marginLeft: width / 5.5,
                }}
            />
            <HeaderLoader
                widthLeft={moderateScale(80)}
                rectWidthLeft={moderateScale(80)}
                heightLeft={moderateScaleVertical(20)}
                rectHeightLeft={moderateScaleVertical(20)}
                widthRight={moderateScale(40)}
                rectWidthRight={moderateScale(40)}
                heightRight={moderateScale(20)}
                rectHeightRight={moderateScale(20)}
                isRight={true}
                rx={5}
                ry={5}
                viewStyles={{
                    alignItems: "center",
                    width: width - moderateScale(30),
                    marginTop: moderateScaleVertical(10),
                }}
                rightViewStyle={{
                    marginLeft: width / 5.5,
                }}
            />
            <HeaderLoader
                widthLeft={moderateScale(80)}
                rectWidthLeft={moderateScale(80)}
                heightLeft={moderateScaleVertical(20)}
                rectHeightLeft={moderateScaleVertical(20)}
                isRight={false}
                rx={5}
                ry={5}
                viewStyles={{
                    alignSelf: "flex-start",
                    marginTop: moderateScaleVertical(40),
                }}
            />

            <View
                style={{
                    flexDirection: "row",
                    alignSelf: "flex-start",

                    justifyContent: "space-between",
                    marginTop: moderateScaleVertical(10),
                }}
            >
                <HeaderLoader
                    widthLeft={moderateScale(70)}
                    rectWidthLeft={moderateScale(70)}
                    heightLeft={moderateScaleVertical(70)}
                    rectHeightLeft={moderateScaleVertical(70)}
                    isRight={false}
                    rx={15}
                    ry={15}
                />

                <HeaderLoader
                    widthLeft={moderateScale(170)}
                    rectWidthLeft={moderateScale(170)}
                    rectHeightLeft={moderateScaleVertical(10)}
                    heightLeft={10}
                    isRight={false}
                    rx={4}
                    ry={4}
                    viewStyles={{
                        marginTop: moderateScaleVertical(20),
                    }}
                />
            </View>

            <HeaderLoader
                widthLeft={moderateScale(80)}
                rectWidthLeft={moderateScale(80)}
                heightLeft={moderateScaleVertical(20)}
                rectHeightLeft={moderateScaleVertical(20)}
                widthRight={moderateScale(40)}
                rectWidthRight={moderateScale(40)}
                heightRight={moderateScale(20)}
                rectHeightRight={moderateScale(20)}
                isRight={true}
                rx={5}
                ry={5}
                viewStyles={{
                    alignItems: "center",
                    width: width - moderateScale(30),
                    marginTop: moderateScaleVertical(10),
                }}
                rightViewStyle={{
                    marginLeft: width / 5.5,
                }}
            />
            <HeaderLoader
                widthLeft={moderateScale(80)}
                rectWidthLeft={moderateScale(80)}
                heightLeft={moderateScaleVertical(20)}
                rectHeightLeft={moderateScaleVertical(20)}
                widthRight={moderateScale(40)}
                rectWidthRight={moderateScale(40)}
                heightRight={moderateScale(20)}
                rectHeightRight={moderateScale(20)}
                isRight={true}
                rx={5}
                ry={5}
                viewStyles={{
                    alignItems: "center",
                    width: width - moderateScale(30),
                    marginTop: moderateScaleVertical(10),
                }}
                rightViewStyle={{
                    marginLeft: width / 5.5,
                }}
            />
            <HeaderLoader
                widthLeft={moderateScale(80)}
                rectWidthLeft={moderateScale(80)}
                heightLeft={moderateScaleVertical(20)}
                rectHeightLeft={moderateScaleVertical(20)}
                widthRight={moderateScale(40)}
                rectWidthRight={moderateScale(40)}
                heightRight={moderateScale(20)}
                rectHeightRight={moderateScale(20)}
                isRight={true}
                rx={5}
                ry={5}
                viewStyles={{
                    alignItems: "center",
                    width: width - moderateScale(30),
                    marginTop: moderateScaleVertical(10),
                }}
                rightViewStyle={{
                    marginLeft: width / 5.5,
                }}
            />
            <HeaderLoader
                widthLeft={moderateScale(80)}
                rectWidthLeft={moderateScale(80)}
                heightLeft={moderateScaleVertical(20)}
                rectHeightLeft={moderateScaleVertical(20)}
                isRight={false}
                rx={5}
                ry={5}
                viewStyles={{
                    alignItems: "center",
                    width: width - moderateScale(30),
                    marginTop: moderateScaleVertical(40),
                }}
            />
            <HeaderLoader
                widthLeft={moderateScale(80)}
                rectWidthLeft={moderateScale(80)}
                heightLeft={moderateScaleVertical(20)}
                rectHeightLeft={moderateScaleVertical(20)}
                widthRight={moderateScale(40)}
                rectWidthRight={moderateScale(40)}
                heightRight={moderateScale(20)}
                rectHeightRight={moderateScale(20)}
                isRight={true}
                rx={5}
                ry={5}
                viewStyles={{
                    alignItems: "center",
                    width: width - moderateScale(30),
                    marginTop: moderateScaleVertical(10),
                }}
                rightViewStyle={{
                    marginLeft: width / 5.5,
                }}
            />
        </WrapperContainer>
    );
};

export default React.memo(ScreenLoader);
