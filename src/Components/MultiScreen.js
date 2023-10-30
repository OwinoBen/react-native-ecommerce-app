import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';

const MultiScreen = (props) => {
  const {
    screenName,
    mainViewStyle = {},
    selectedScreen,
    selectedScreenIndex,
    activeTintColor = colors.themeColor2,
    inActiveTintColor = colors.blackOpacity66,
    borderWidth = 1,
    tabTextStyle,
    itemStyle = {},
    scrollEnabled = true,
    scrollViewStyle = {},
  } = props;
  return (
    <View style={{...styles.mainView, ...mainViewStyle}}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={{
          width: '100%',
          justifyContent: 'space-evenly',
          ...scrollViewStyle,
        }}>
        {screenName.map((value, index) => {
          return (
            <TouchableOpacity
              style={{...itemStyle}}
              key={index}
              onPress={() => selectedScreen(index)}>
              <Text
                style={[
                  styles.activeContractTextStyle,
                  {
                    textAlign: 'left',
                    fontFamily:
                      selectedScreenIndex == index
                        ? fontFamily.bold
                        : fontFamily.regular,
                    color:
                      selectedScreenIndex === index
                        ? activeTintColor
                        : inActiveTintColor,
                  },
                  tabTextStyle,
                ]}>
                {value}
              </Text>
              <View
                style={{
                  marginTop: moderateScaleVertical(5),
                  borderWidth: selectedScreenIndex === index ? borderWidth : 0,
                  borderColor: colors.themeColor2,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MultiScreen;

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.blackOpacity20,
    borderBottomWidth: 0.5,
    marginBottom: moderateScaleVertical(16),
  },
  mainView: {
    width: width,
    // paddingLeft: moderateScale(20),
    height: 40,
  },
  activeContractTextStyle: {
    fontSize: textScale(14),
    color: colors.blackOpacity43,
    fontFamily: fontFamily.bold,
    marginTop: moderateScaleVertical(20),
  },
});
