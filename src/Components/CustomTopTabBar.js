import React from 'react';
import {ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import TextTabBar from './TextTabBar';

const CustomTopTabBar = ({
  tabBarItems,
  onPress,
  customContainerStyle,
  customTextContainerStyle = {},
  scrollEnabled = true,
  activeStyle = {},
  textStyle = {},
  textTabWidth = null,
  topBarMainView = {},
  textTabBarView = {},
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const currentTheme = useSelector((state) => state.initBoot);
  const {themeColors, themeLayouts, appStyle} = currentTheme;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',

        alignItems: 'center',
        alignSelf: 'center',
        borderBottomColor: colors.lightGreyBorder,
        borderBottomWidth: 1,

        ...customContainerStyle,
      }}>
      <ScrollView
        horizontal
        scrollEnabled={scrollEnabled}
        alwaysBounceHorizontal={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{}}>
        {tabBarItems &&
          tabBarItems.map((i, inx) => {
            return (
              <View key={inx} style={{...topBarMainView}}>
                <TextTabBar
                  text={i.title || i.name}
                  isActive={i.isActive || i.is_selected}
                  containerStyle={customTextContainerStyle}
                  onPress={() => onPress(i)}
                  textTabWidth={textTabWidth}
                  activeStyle={activeStyle}
                  textStyle={textStyle}
                  textTabBarView={textTabBarView}
                />
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};
export default React.memo(CustomTopTabBar);
