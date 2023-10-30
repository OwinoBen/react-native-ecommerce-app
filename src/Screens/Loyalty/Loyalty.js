import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
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
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {
  getColorCodeWithOpactiyNumber,
  showError,
} from '../../utils/helperFunctions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';

export default function Loyalty({navigation}) {
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
  const updateState = (data) => setState((state) => ({...state, ...data}));

  //Redux Store Data
  const {appData, themeColors, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const {preferences} = appData?.profile;
  const userData = useSelector((state) => state.auth.userData);
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFunc({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  //Give Rating

  useEffect(() => {
    getUserLoyaltyInfo();
  }, []);
  const getUserLoyaltyInfo = () => {
    updateState({isLoading: true});
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
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  console.log(upcomingLoyalty, 'upcomingLoyalty');

  const renderProduct = ({item, index}) => {
    const cardWidthNew = width * 0.5 - 21.5;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          {width: cardWidthNew - 10},
          {...commonStyles.shadowStyle},
          {borderRadius: 10, marginRight: 20},
        ]}>
        <ImageBackground
          source={
            item && item?.name == 'Bronze'
              ? imagePath.bronze
              : item?.name == 'Silver'
              ? imagePath.silver
              : item?.name == 'Gold'
              ? imagePath.gold
              : imagePath.platinum
          }
          imageStyle={{borderRadius: 10}}
          style={{
            width: cardWidthNew - 10,
            height: cardWidthNew - 50,
          }}></ImageBackground>
        <View style={{padding: 10}}>
          <Text
            style={
              styles.descriptionLoyalty
            }>{`${item?.points_to_reach} points to ${item?.name}`}</Text>
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
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />
      {/* current loyalty status */}
      {!!currentLoyalty ? (
        <View
          style={{
            marginTop: 30,
            width: width / 1.5,
            backgroundColor: colors.white,
            padding: 10,
            ...commonStyles.shadowStyle,
            justifyContent: 'center',
            alignSelf: 'center',
            borderRadius: moderateScale(8),
          }}>
          <View style={{flexDirection: 'row'}}>
            {!!currentLoyalty && (
              <Image
                source={
                  currentLoyalty && currentLoyalty?.name == 'Bronze'
                    ? imagePath.bronze
                    : currentLoyalty?.name == 'Silver'
                    ? imagePath.silver
                    : currentLoyalty?.name == 'Gold'
                    ? imagePath.gold
                    : imagePath.platinum
                }
                style={{height: 75, width: 75}}
              />
            )}

            <View style={{marginLeft: 10}}>
              <Text style={styles.youareat}>{'You are at'}</Text>
              <Text
                style={[
                  styles.currentLoyaltyColor,
                  {
                    color:
                      currentLoyalty?.name == 'Bronze'
                        ? '#8E572F'
                        : currentLoyalty?.name == 'Silver'
                        ? '#D2D2D2'
                        : currentLoyalty?.name == 'Gold'
                        ? '#BD9B4A'
                        : '#D2D2D2',
                  },
                ]}>
                {currentLoyalty?.name}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
      {/* Current point status */}
      <View
        style={{
          flexDirection: 'row',
          marginVertical: moderateScaleVertical(20),
          marginHorizontal: moderateScale(20),
        }}>
        {!!currentLoyalty ? (
          <ImageBackground
            source={imagePath.totalLoyaltyBackground}
            imageStyle={[styles.imageStyle, {justifyContent: 'center'}]}
            style={styles.imageStyle}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={styles.loyaltyPointsEarned}>
                {loyaltyPointsEarned}
              </Text>
              <Text style={styles.loyaltyPointsUsed}>
                {'Total Earned Points'}
              </Text>
            </View>
          </ImageBackground>
        ) : null}

        {!!currentLoyalty ? (
          <View
            style={{
              marginLeft: 10,
              borderRadius: moderateScale(8),

              ...commonStyles.shadowStyle,
              height: height / 7,
              width: width - width / 1.6,
              backgroundColor: getColorCodeWithOpactiyNumber(
                themeColors?.primary_color.substr(1),
                20,
              ),
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={[
                  styles.loyaltyPointsEarned,
                  {color: themeColors?.primary_color},
                ]}>
                {loyaltyPointsUsed}
              </Text>
              <Text
                style={[
                  styles.loyaltyPointsUsed,
                  {color: themeColors?.primary_color},
                ]}>
                {'Spendable points'}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
      <View style={{marginHorizontal: moderateScale(20), flex: 1}}>
        {upcomingLoyalty?.length ? (
          <View style={{marginBottom: 20}}>
            <Text
              style={[
                styles.upcoming,
                {color: isDarkMode ? MyDarkTheme.colors.text : colors.black},
              ]}>
              {strings.UPCOMING}
            </Text>
          </View>
        ) : null}

        <FlatList
          data={upcomingLoyalty}
          extraData={upcomingLoyalty}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderProduct}
          ItemSeparatorComponent={() => (
            <View style={{height: moderateScale(17)}} />
          )}
          ListFooterComponent={() => (
            <View style={{height: moderateScale(70)}} />
          )}
        />
      </View>
    </WrapperContainer>
  );
}
