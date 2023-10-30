import React from 'react';
import { ScrollView, View ,StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import colors from '../styles/colors';
import commonStyles from '../styles/commonStyles';
import { moderateScale, moderateScaleVertical, width } from '../styles/responsiveSize';
import TextTabBar from './TextTabBar';


const CustomTopTabBar = ({
    selecteSwitchTab = () => { },
    firstTabBarText = strings.BOOK_FOR_ME,
    secondTabBarText = strings.BOOK_FOR_FRIEND,
    firstTabBarCustomStyle = {},
    secondTabBarCustomStyle = {},
    firstTabBarTextStyle={},
    SecondTabBarTextStyle={}
}) => {
    const insets = useSafeAreaInsets();
    const currentTheme = useSelector((state) => state.initBoot);
    const { themeColors, themeLayouts, appStyle } = currentTheme;
    return (
        <View style={styles.tabBarMainContainer}>
            <TouchableOpacity
                activeOpacity={1} style={[styles.tabBarInnerContainer, firstTabBarCustomStyle]}
                onPress={() => selecteSwitchTab(1)}>
                <Text style={[styles.tabBarText,firstTabBarTextStyle]}>{firstTabBarText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.tabBarInnerContainer, secondTabBarCustomStyle]}
                onPress={() => selecteSwitchTab(2)}>
                <Text style={[styles.tabBarText,SecondTabBarTextStyle]}>{secondTabBarText}</Text>
            </TouchableOpacity>
        </View>

    );
};
export default React.memo(CustomTopTabBar);



const styles = StyleSheet.create({
    tabBarMainContainer: {
        width: moderateScale(width / 1.22),
        marginVertical: moderateScaleVertical(12.2),
        alignSelf: 'center',
        height: moderateScaleVertical(38),
        backgroundColor: colors.lightGray,
        borderRadius: moderateScale(18),
        flexDirection: 'row'
    }, tabBarInnerContainer: {
        width: '50%',
        height: '100%',
        borderRadius: moderateScale(18),
        borderTopLeftRadius: moderateScale(18),
        borderBottomLeftRadius: moderateScale(18),
        alignItems: 'center',
        justifyContent: 'center'
    }, secondTabContainer: {
        width: '50%',
        height: '100%',
        borderRadius: moderateScale(18),

        alignItems: 'center',
        justifyContent: 'center'
    }, tabBarText: { ...commonStyles.mediumFont14 }
});

