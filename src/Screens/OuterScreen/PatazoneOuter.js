//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import WrapperContainer from '../../Components/WrapperContainer';
import colors from '../../styles/colors';
import imagePath from '../../constants/imagePath';
import { height, moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';
import LinearGradient from 'react-native-linear-gradient';
import { getColorCodeWithOpactiyNumber } from '../../utils/helperFunctions';
import { useSelector } from 'react-redux';
import strings from '../../constants/lang';
import { noOfColumn } from '../../utils/constants/constants';
import fontFamily from '../../styles/fontFamily';
import { Image } from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import navigationStrings from '../../navigation/navigationStrings';

// create a component
const PatazoneOuter = ({navigation}) => {
    const { appData, themeColors, appStyle, themeColor, themeToggle } = useSelector(
        (state) => state?.initBoot,
      );
    return (
        <WrapperContainer
        
       
        >
        <LinearGradient
        start={{ x: 0.0, y: 0.5}}
        end={{ x: 0.5, y: 1.0 }}
        // end={endcolor}
        style={{
          height: '100%',
        //   alignItems: 'center',
        //   justifyContent: 'center',
          width: '100%',
        }}
        colors={
             [colors.white,getColorCodeWithOpactiyNumber(
                themeColors.primary_color.substr(1),
                30,
              )]
        }>   
             <View style={{marginHorizontal:moderateScale(30)}}> 
            <Text numberOfLines={2} style={styles.text}>{strings.get_everything}</Text>
            <TouchableOpacity onPress={()=>navigation.navigate(navigationStrings.LOGIN)} style={{backgroundColor:themeColors.primary_color,...styles.box}}>
                <Image source={imagePath.right_arrow}/>
            </TouchableOpacity>
            </View>
        </LinearGradient>
     </WrapperContainer>
    );
};

// define your styles
const styles = StyleSheet.create({
  text:{fontSize:textScale(24),width:moderateScale(270),fontFamily:fontFamily.bold,marginTop:moderateScaleVertical(27)},
  box:{marginTop:moderateScaleVertical(22),alignItems:'center',justifyContent:'center',borderRadius:moderateScale(8), height:moderateScaleVertical(53),width:moderateScale(53),}
});

//make this component available to the app
export default PatazoneOuter;
