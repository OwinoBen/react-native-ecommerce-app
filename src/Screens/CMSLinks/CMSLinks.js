import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError} from '../../utils/helperFunctions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';

export default function CMSLinks({navigation}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    cmsLinks: [],
    isLoading: false,
  });
  //update your state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  const {cmsLinks, isLoading} = state;
  useEffect(() => {
    updateState({isLoading: true});
    getListOfAllCmsLinks();
  }, []);

  //Get list of all payment method
  const getListOfAllCmsLinks = () => {
    actions
      .getListOfAllCmsLinks(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('All Cms links', res);
        updateState({isLoadingB: false, isLoading: false, isRefreshing: false});
        if (res && res?.data) {
          updateState({cmsLinks: res?.data});
        }
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    return navigation.navigate(screenName, {data});
  };

  const _renderCmsLinks = ({item, index}) => {
    console.log(item, 'item????????');
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(navigationStrings.WEBLINKS, item)}
        style={{marginBottom: 20}}>
        <View
          style={{
            flexDirection: 'row',
            borderWidth: StyleSheet.hairlineWidth,
            paddingVertical: 15,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderColor: isDarkMode ? MyDarkTheme.colors.text : null,
          }}>
          <Text
            style={
              isDarkMode
                ? [styles.title2, {color: MyDarkTheme.colors.text}]
                : styles.title2
            }>
            {index + 1}. {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}
      isLoadingB={isLoading}
      source={loaderOne}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={strings.LINKS}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: Colors.white}
        }
      />
      <View style={{...commonStyles.headerTopLine}} />

      <ScrollView>
        <View style={{flex: 1}}>
          <View
            style={{
              marginTop: moderateScaleVertical(20),
              marginBottom: moderateScaleVertical(80),
              marginHorizontal: moderateScale(20),
            }}>
            <FlatList
              data={cmsLinks}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              // horizontal
              style={{marginTop: moderateScaleVertical(10)}}
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderCmsLinks}
            />
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
}
