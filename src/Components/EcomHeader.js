//import liraries
import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet, Image } from 'react-native';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import colors from '../styles/colors';
import imagePath from '../constants/imagePath';
import SearchBar3 from './SearchBar3';
import navigationStrings from '../navigation/navigationStrings';
import LinearGradient from 'react-native-linear-gradient';
import { getColorCodeWithOpactiyNumber } from '../utils/helperFunctions';
import { useSelector } from 'react-redux';


// create a component
const Ecomheader = ({
    isDarkMode = false,
    navigation = {},
    style = {},
    themeColors = { primary_color: colors.themeColor },
    showLeftIcon = true,
    defaultBottomColor = 40
}) => {

    const userData = useSelector((state) => state?.auth?.userData || {});

    console.log("userDatauserData",userData)

    return (
        <LinearGradient
            colors={[themeColors?.primary_color, themeColors?.primary_color, getColorCodeWithOpactiyNumber(
                themeColors.primary_color.substr(1),
                defaultBottomColor)]}
        >
      
            <SafeAreaView>
                <View style={{
                    ...styles.container,
                    ...style,
                }}>
                    {showLeftIcon ? <TouchableOpacity
                        onPress={() => navigation.goBack()} hitSlop={styles.hitSlop} style={{ marginLeft: moderateScale(8) }}>
                        <Image style={{ tintColor: isDarkMode ? colors.white : colors.black }} source={imagePath.backArrowCourier} />
                    </TouchableOpacity> : null}

                    <View style={{ flex: 1 }}>
                        <SearchBar3
                            onPress={() => navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)}
                            containerStyle={{
                                marginVertical: moderateScaleVertical(0),
                                marginBottom: moderateScaleVertical(0),
                                height: moderateScale(38),

                            }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: "row", justifyContent: 'space-between', alignItems: 'center'
    },
    hitSlop: {
        top: 50,
        right: 50,
        left: 50,
        bottom: 50,
    }
});

//make this component available to the app
export default React.memo(Ecomheader);
