import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
import { loaderOne } from '../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFunc from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import { shortCodes } from '../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
  showError,
} from '../../utils/helperFunctions';
import stylesFun from './styles';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import { ScrollView } from 'react-native-gesture-handler';

export default function Loyalty({ navigation }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: false,
    isRefreshing: false,
    currentLoyalty: null,
    loyaltyPointsEarned: null,
    loyaltyPointsUsed: null,
    upcomingLoyalty: [],
  });
  const {
    isLoading,
    isRefreshing,
    currentLoyalty,
    loyaltyPointsEarned,
    loyaltyPointsUsed,
    upcomingLoyalty,
  } = state;

  //update your state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  //Redux Store Data
  const { appData, themeColors, appStyle, currencies, languages } = useSelector(
    (state) => state?.initBoot,
  );
  const { preferences } = appData?.profile;
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({ fontFamily, isDarkMode, MyDarkTheme });
  const commonStyles = commonStylesFunc({ fontFamily });

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };

  //Give Rating

  useEffect(() => {
    getUserLoyaltyInfo();
  }, []);

  const getUserLoyaltyInfo = () => {
    updateState({ isLoading: true });
    actions
      .getLoyaltyInfo(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('getUserLoyaltyInfo data', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
          currentLoyalty: res?.data?.current_loyalty,
          loyaltyPointsEarned: res?.data?.loyalty_points_earned,
          loyaltyPointsUsed: res?.data?.loyalty_points_used,
          upcomingLoyalty: res?.data?.upcoming_loyalty,
        });
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    console.log('getUserLoyaltyInfo', error);
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };

  console.log(upcomingLoyalty, 'upcomingLoyalty');

  const renderProduct = ({ item, index }) => {
    return (
      <View style={styles.rowStyle}>
        <Text
          style={{
            ...styles.commTextStyle,
            marginTop: moderateScaleVertical(8),
          }}>
          {item?.name} {strings.CARD}
        </Text>
        <Text
          style={{
            ...styles.commTextStyle,
            marginTop: moderateScaleVertical(8),
          }}>
          {item?.points_to_reach}
        </Text>
      </View>
    );
  };

  const existCard = (type) => {
    switch (type) {
      case 'Bronze':
        return imagePath.icBronze1;
      case 'Gold':
        return imagePath.icBronze1;
      case 'Bronze':
        return imagePath.icBronze1;
      case 'Bronze':
        return imagePath.icBronze1;
      default:
        break;
    }
  };

  const imageUrl = getImageUrl(
    currentLoyalty?.image?.image_fit,
    currentLoyalty?.image?.image_path,
    '1000/1000',
  );
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={strings.LOYALTYPOINTS}
        textStyle={{
          fontSize:
            appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5 ? textScale(13) : textScale(16),
        }}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
      />
      {/* current loyalty status */}
      <ScrollView>
        {
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: moderateScaleVertical(24),
            }}>
            <View
              style={{
                backgroundColor: isDarkMode
                  ? colors.grayOpacity51
                  : colors.greyColor,
                flex: 1,
                alignItems: 'center',
                paddingVertical: moderateScaleVertical(34),
              }}>
              <Text
                style={{
                  ...styles.loyaltyPointsEarned,
                  fontSize: textScale(20),
                }}>
                {loyaltyPointsEarned}
              </Text>
              <Text
                style={{
                  ...styles.loyaltyPointsUsed,
                  textTransform: 'uppercase',
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(10),
                  marginTop: moderateScaleVertical(6),
                }}>
                {strings.POINTS_EARNED}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.redOpacity52,
                flex: 1,
                alignItems: 'center',
                paddingVertical: moderateScaleVertical(34),
              }}>
              <Text
                style={{
                  ...styles.loyaltyPointsEarned,
                  color: colors.redC,
                  fontSize: textScale(20),
                }}>
                {loyaltyPointsUsed}
              </Text>
              <Text
                style={{
                  ...styles.loyaltyPointsUsed,
                  color: colors.redC,
                  textTransform: 'uppercase',
                  fontFamily: fontFamily.regular,
                  fontSize: textScale(10),
                  marginTop: moderateScaleVertical(6),
                }}>
                {strings.POINTS_SPENT}
              </Text>
            </View>
          </View>
        }

        <View
          style={{
            marginHorizontal: moderateScale(16),
          }}>
          {!!currentLoyalty && (
            <>
              <View
                style={{
                  marginTop: moderateScaleVertical(34),
                  marginBottom: moderateScaleVertical(16),
                }}>
                {/* <View
                  style={{
                    width: '100%',
                    position: 'relative',
                    zIndex: 3,
                    bottom: 60,
                    opacity: 1,
                    transform: [{scale: 0.7}],
                  }}>
                  <Image
                    source={imagePath.icBronze1}
                    style={{width: '100%'}}
                    resizeMode="stretch"
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    position: 'absolute',
                    zIndex: 3,
                    bottom: 40,
                    opacity: 1,
                    transform: [{scale: 0.8}],
                  }}>
                  <Image
                    source={imagePath.icPlatinum1}
                    style={{width: '100%'}}
                    resizeMode="stretch"
                  />
                </View>
                <View // frontmost card
                  style={{
                    width: '100%',
                    position: 'absolute',
                    zIndex: 3,
                    bottom: 20,
                    opacity: 1,
                    transform: [{scale: 0.9}],
                  }}>
                  <Image
                    source={imagePath.icSilver1}
                    style={{width: '100%'}}
                    resizeMode="stretch"
                  />
                </View>

                <View //first card
                  style={{
                    width: '100%',
                    position: 'absolute',
                    zIndex: 3,
                    bottom: 0,
                    opacity: 1,
                    transform: [{scale: 1.0}],
                  }}>
                  <Image
                    source={{uri: imageUrl}}
                    style={{width: '100%', height: moderateScale(160)}}
                    resizeMode="stretch"
                  />
                </View> */}

                <View //first card
                  style={{
                 
                  }}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={{ width: '100%', height: moderateScale(160) }}
                    resizeMode="stretch"
                  />
                </View>
              </View>
              <Text
                style={{
                  ...styles.currentLoyaltyColor,
                  fontSize: textScale(12),
                  textTransform: 'uppercase',
                  marginTop: moderateScaleVertical(6),
                }}>
                {strings.CARD_EARNED}
              </Text>
              <Text
                style={{
                  ...styles.commTextStyle,
                  fontSize: textScale(16),
                  marginTop: moderateScaleVertical(8),
                }}>
                {currentLoyalty?.name}
              </Text>
            </>
          )}

          {!!upcomingLoyalty.length > 0 && (
            <View style={{ marginTop: moderateScaleVertical(6) }}>
              <Text
                style={{
                  ...styles.commTextStyle,
                  marginTop: moderateScaleVertical(8),
                  textTransform: 'uppercase',
                  color: isDarkMode
                    ? MyDarkTheme.colors.text
                    : colors.grayOpacity51,
                  marginBottom: moderateScaleVertical(4),
                }}>
                {strings.ADDITIONAL_POINTS_REQUIRED_FOR}
              </Text>
            </View>
          )}

          {/* Current point status */}

          <View style={{ flex: 1 }}>
            <FlatList
              data={upcomingLoyalty}
              extraData={upcomingLoyalty}
              contentContainerStyle={{ flexGrow: 1 }}
              keyExtractor={(item, index) => String(index)}
              renderItem={renderProduct}
            />
          </View>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
}
