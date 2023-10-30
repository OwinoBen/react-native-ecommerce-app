//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image,TouchableOpacity } from 'react-native';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import commonStyles from '../styles/commonStyles';
import fontFamily from '../styles/fontFamily';
import { moderateScale, moderateScaleVertical, width } from '../styles/responsiveSize';

// create a component
const DashboardCount = ({
    heading = 'Pending Order',
    onPress = () => {},
    count = 0,
    desc = strings.PENDING_ORDERS,
    index = 0,
    image = imagePath.timerRoyo
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            key={String(index)}
            style={styles.dashboardBox}>
            <View style={styles.dashboardImage}>
                <Image source={image} />
            </View>
            <Text
                style={{
                    ...commonStyles.boldFont14,
                    marginTop: moderateScaleVertical(18),
                }}>
                {heading}
            </Text>
            <Text
                style={{
                    ...styles.font14Regular,
                    marginVertical: moderateScaleVertical(4),
                }}>
                {count} {desc}
            </Text>
        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    dashboardBox: {
        width: width > 600 ? width / 4.5 : width / 2.25,
        backgroundColor: '#F3F9F7',
        padding: moderateScale(16),
        borderRadius: moderateScaleVertical(6),
        marginBottom: moderateScaleVertical(16),
      },
      font14Regular: {
        fontSize: 14,
        fontFamily: fontFamily.regular,
        color: '#2E3E3A6d',
      },
      font18Semibold: {
        fontFamily: fontFamily.semiBold,
        fontSize: 18,
        color: '#2E3E3A',
      },
      dashboardImage: {
        shadowColor: 'rgba(242,96,97,0.23)',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        flexShrink: 1,
        shadowRadius: 3.84,
    
        elevation: 19,
      },
});

//make this component available to the app
export default DashboardCount;
