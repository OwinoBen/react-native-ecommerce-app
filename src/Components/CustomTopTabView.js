import * as React from 'react';
import {Platform, Text, TouchableOpacity, View, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import WrapperContainer from './WrapperContainer';

const CustomTopTabView = ({state, descriptors, navigation, position}) => {
  const {themeColors} = useSelector((state) => state.initBoot);
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          justifyContent: 'space-around',
          borderRadius: 18,
          marginHorizontal: moderateScale(10),
        },
        Platform.OS === 'ios' && {marginTop: moderateScaleVertical(30)},
      ]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getStyles = (value) => {
          if (value) {
            return {
              backgroundColor: themeColors.primary_color,
            };
          }
        };

        const getTextStyles = (isFocused) => {
          if (isFocused) {
            return {
              color: themeColors.secondary_color,
            };
          }
        };

        return (
          <TouchableOpacity
            onPress={onPress}
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                padding: moderateScale(10),
                margin: moderateScale(10),
                paddingHorizontal: moderateScale(40),
                borderRadius: 20,
              },
              {...getStyles(isFocused)},
            ]}>
            <Text
              style={[
                {
                  marginHorizontal: moderateScale(5),
                  color: colors.black,
                  fontFamily: fontFamily.medium,
                },
                {...getTextStyles(isFocused)},
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default React.memo(CustomTopTabView);
