import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import BrandCard from '../../Components/BrandCard';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import ListEmptyBrands from './ListEmptyBrands';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';

export default function Brand({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: true,
  });
  useEffect(() => {
    setTimeout(() => {
      updateState({isLoading: false});
    }, 500);
  }, []);
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const {isLoading} = state;
  //Redux store data
  const {appStyle, appData} = useSelector((state) => state.initBoot);
  const appMainData = useSelector((state) => state?.home?.appMainData);

  //Brand data
  const _renderItem = ({item, index}) => {
    return (
      <BrandCard
        data={item}
        onPress={moveToNewScreen(navigationStrings.BRANDDETAIL, item)}
      />
    );
  };
  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
      <Header
        centerTitle={strings.BRANDS}
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        rightIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icSearchb
            : imagePath.search
        }
        onPressRight={() =>
          navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
        }
      />

      <View style={{height: 1, backgroundColor: colors.borderLight}} />

      <FlatList
        data={isLoading ? [] : appMainData?.brands}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<View style={{height: 10}} />}
        keyExtractor={(item, index) => String(index)}
        contentContainerStyle={{flexGrow: 1}}
        ItemSeparatorComponent={() => (
          <View style={{height: moderateScaleVertical(10)}} />
        )}
        ListEmptyComponent={<ListEmptyBrands isLoading={isLoading} />}
        renderItem={_renderItem}
      />
    </WrapperContainer>
  );
}
