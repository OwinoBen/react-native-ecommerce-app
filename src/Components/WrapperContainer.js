import React from 'react';
import { StatusBar, View,SafeAreaView } from 'react-native';
import colors from '../styles/colors';
import Loader from './Loader';
import { useSelector } from 'react-redux';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../styles/theme';


const WrapperContainer = ({
  children,
  isLoading = false,
  bgColor = colors.white,
  statusBarColor = colors.white,
  barStyle = 'dark-content',
  withModal = false,
  isSafeArea = true
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;


  if(isSafeArea){
    return(
      <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : statusBarColor,
      }}>
      <StatusBar
        backgroundColor={
          isDarkMode ? MyDarkTheme.colors.background : statusBarColor
        }
        barStyle={isDarkMode ? 'light-content' : barStyle}
      />
      <View style={{ backgroundColor: bgColor, flex: 1 }}>{children}</View>
      <Loader isLoading={isLoading} withModal={withModal} />
    </SafeAreaView>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : statusBarColor,
      }}>
      <StatusBar
        backgroundColor={
          isDarkMode ? MyDarkTheme.colors.background : statusBarColor
        }
        barStyle={isDarkMode ? 'light-content' : barStyle}
      />
      <View style={{ backgroundColor: bgColor, flex: 1 }}>{children}</View>
      <Loader isLoading={isLoading} withModal={withModal} />
    </View>
  );
};

export default React.memo(WrapperContainer);
