import {CardField, createToken, initStripe} from '@stripe/stripe-react-native';
import React, {createRef, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import {loaderOne} from '../../Components/Loaders/AnimatedLoaderFiles';
import ModalView from '../../Components/Modal';
import SubscriptionComponent from '../../Components/SubscriptionComponent';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {showError, showSuccess} from '../../utils/helperFunctions';
import ListEmptySubscriptions from './ListEmptySubscriptions';
import stylesFun from './styles';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../../styles/theme';

export default function Subscriptions({navigation, route}) {
  //   console.log(route, 'route>>>');
  const paramData = route?.params;
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const [state, setState] = useState({
    isLoading: false,
    isLoadingB: false,
    allSubscriptions: [],
    isRefreshing: false,
    limit: 12,
    currentSubscription: null,
    clientCurrency,
    isModalVisibleForPayment: false,
    selectedPlan: null,
    paymentOptions: [],
    selectedPaymentMethod: null,
    cardInfo: null,
  });

  const {
    allSubscriptions,
    isRefreshing,
    isLoading,
    isLoadingB,
    clientCurrency,
    currentSubscription,
    isModalVisibleForPayment,
    selectedPlan,
    paymentOptions,
    selectedPaymentMethod,
    cardInfo,
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
  const commonStyles = commonStylesFun({fontFamily});

  //Navigation to specific screen
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, {data});
  };

  const explosion = createRef();

  useEffect(() => {
    updateState({isLoadingB: true});
    getAllSubscriptions();
    console.log(explosion, 'explosion');
  }, []);

  useEffect(() => {
    if (
      preferences &&
      preferences?.stripe_publishable_key != '' &&
      preferences?.stripe_publishable_key != null
    ) {
      initStripe({
        publishableKey: preferences?.stripe_publishable_key,
        merchantIdentifier: 'merchant.identifier',
      });
    }
  }, []);

  //Get list of all payment method
  const getAllSubscriptions = (showSuccess) => {
    actions
      .getAllSubscriptions(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('Get all subscription plans', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
          isRefreshing: false,
          allSubscriptions: res?.data?.all_plans,
          currentSubscription: res?.data?.subscription,
        });
      })
      .catch(errorMethod);
  };

  //Subscribe for specific plan
  const selectSpecificSubscriptionPlan = (item) => {
    console.log(item, '>>>>>>>>>>>>>selectSpecificSubscriptionPlan');
    updateState({isLoading: true});
    actions
      .selectSpecificSubscriptionPlan(
        `/${item?.slug}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        if (res && res.status == 'Success') {
          updateState({
            isLoadingB: false,
            isLoading: false,
            isModalVisibleForPayment: true,
            selectedPlan: res?.data?.sub_plan,
            paymentOptions: res?.data?.payment_options
              ? res?.data?.payment_options
              : [],
          });
        } else {
          showError(res?.message);
          updateState({
            isLoadingB: false,
            isLoading: false,
          });
        }
      })
      .catch(errorMethod);
  };

  //cancel subscription
  const cancelSubscription = (item) => {
    console.log(item, 'item>>selectSpecificSubscriptionPlan');
    updateState({isLoading: true});
    actions
      .cancelSubscriptionPlan(
        `/${item?.slug}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
        });
        showSuccess(res?.message);
        getAllSubscriptions();
      })
      .catch(errorMethod);
  };
  //Error handling in screen
  const errorMethod = (error) => {
    updateState({isLoading: false, isLoadingB: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const renderProduct = ({item, index}) => {
    const {isSelectItem} = state;
    return (
      <>
        {!!allSubscriptions.length && index == 0 && (
          <View
            style={{
              marginTop: currentSubscription ? moderateScale(40) : null,
              marginBottom: moderateScale(20),
            }}>
            <Text style={styles.subscriptionTitle}>
              {currentSubscription
                ? strings.OTHERSUBSCRIPTION
                : strings.ALLSUBSCRIPTION}
            </Text>
          </View>
        )}
        <SubscriptionComponent
          data={item}
          clientCurrency={clientCurrency}
          onPress={(item) => selectSpecificSubscriptionPlan(item)}
          payNowUpcoming={() =>
            selectSpecificSubscriptionPlan(currentSubscription?.plan)
          }
          // cancelSubscription={()=>cancelSubscription(item)}
          // onPress={moveToNewScreen(navigationStrings.PRODUCTDETAIL, item)}
          // onAddtoWishlist={() => _onAddtoWishlist(item)}
          // addToCart={() => _addToCart(item)}
        />
      </>
    );
  };

  // we set the height of item is fixed
  const getItemLayout = (data, index) => ({
    length: width * 0.5 - 21.5,
    offset: (width * 0.5 - 21.5) * index,
    index,
  });

  //Pull to refresh
  const handleRefresh = () => {
    updateState({isRefreshing: true});
    getAllSubscriptions();
  };

  const topCustomComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: moderateScale(20),
        }}>
        <Text style={styles.subscription2}>{strings.SUBSCRIPTION2}</Text>
        <TouchableOpacity
          onPress={() => updateState({isModalVisibleForPayment: false})}>
          <Image source={imagePath.cross} />
        </TouchableOpacity>
      </View>
    );
  };

  const _selectPaymentMethod = (item) => {
    {
      selectedPaymentMethod && selectedPaymentMethod?.id == item?.id
        ? updateState({selectedPaymentMethod: null})
        : updateState({selectedPaymentMethod: item});
    }
  };

  const _onChangeStripeData = (cardDetails) => {
    console.log(cardDetails, '_onChangeStripeData>');
    if (cardDetails?.complete) {
      updateState({
        cardInfo: cardDetails,
      });
    } else {
      updateState({cardInfo: null});
    }
  };

  //render pyaments icons
  const _renderItemPayments = ({item, index}) => {
    
    return (
      <>
        <TouchableOpacity 
            onPress={() => _selectPaymentMethod(item)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: moderateScaleVertical(5),
            }}>
            <Image
              source={
                selectedPaymentMethod && selectedPaymentMethod?.id == item.id
                  ? imagePath.radioActive
                  : imagePath.radioInActive
              }
            />
            <Text
              style={[
                styles.title,
                {
                  color:
                    selectedPaymentMethod &&
                    selectedPaymentMethod?.id == item.id
                      ? colors.blackC
                      : colors.textGreyJ,
                  marginLeft: moderateScale(5),
                },
              ]}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>

        {selectedPaymentMethod &&
          selectedPaymentMethod?.id == item.id &&
          selectedPaymentMethod?.off_site != 1 && (
            <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 10,
              }}
              onCardChange={(cardDetails) => {
                // console.log('cardDetails', cardDetails);
                _onChangeStripeData(cardDetails);
              }}
              onBlur={() => {
                Keyboard.dismiss();
              }}
            />
        )}
      </>
    );
  };

  //Modal main component
  const modalMainContent = () => {
    return (
      <>
        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(20),
          }}>
          <Text style={styles.title}>{selectedPlan?.title}</Text>
          <Text
            style={[
              styles.title2,
              {marginTop: moderateScale(10)},
            ]}>{`${selectedPlan?.price}/${selectedPlan?.frequency}`}</Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(10),
          }}>
          <Text style={styles.title}>{strings.FEATURED_INCLUDED}</Text>

          <View
            style={{
              flexDirection: 'row',
              //   marginHorizontal: moderateScale(10),
              marginTop: moderateScale(10),
              alignItems: 'center',
            }}>
            <Image source={imagePath.tick2} />
            <Text
              style={[
                styles.title2,
                {marginLeft: moderateScale(10)},
              ]}>{`${selectedPlan?.features[0]}`}</Text>
          </View>
        </View>

        <View
          style={{
            height: 0.5,
            backgroundColor: colors.textGreyJ,
            marginTop: moderateScale(10),
          }}
        />

        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(10),
          }}>
          <View>
            <Text style={styles.title}>{strings.DEBIT_FROM}</Text>
          </View>
          <View>
            <FlatList
              data={paymentOptions}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
              // horizontal
              style={{marginTop: moderateScaleVertical(10)}}
              keyExtractor={(item, index) => String(index)}
              renderItem={_renderItemPayments}
              ListEmptyComponent={() => (
                <Text style={{textAlign: 'center'}}>
                  {strings.NO_PAYMENT_METHOD}
                </Text>
              )}
            />
          </View>
        </View>
      </>
    );
  };

  const payAmount = () => {
    updateState({isModalVisibleForPayment: false});
    console.log(selectedPaymentMethod, 'selectedPaymentMethod');
    console.log(selectedPlan, 'selectedPlan');
    if (selectedPaymentMethod?.code == 'stripe') {
      _offineLinePayment();
    } else {
      _webPayment();
    }
  };

  const _webPayment = () => {};

  //Offline payments
  const _offineLinePayment = async () => {
    if (cardInfo) {
      console.log(cardInfo, 'cardInfo>cardInfo>cardInfo');
      updateState({isModalVisibleForPayment: false});

      await createToken({...cardInfo, type: 'Card'})
        .then((res) => {
          console.log(res, 'stripe res>>');
          if (res && res?.token && res.token?.id) {
            updateState({isLoading: true});
            let selectedMethod = selectedPaymentMethod.title.toLowerCase();

            actions
              .purchaseSubscriptionPlan(
                `/${selectedPlan?.slug}`,
                {
                  payment_option_id: selectedPaymentMethod?.id,
                  transaction_id: res?.token?.id,
                  // amount: selectedPlan?.id,
                },
                {
                  code: appData?.profile?.code,
                  currency: currencies?.primary_currency?.id,
                  language: languages?.primary_language?.id,
                },
              )
              .then((res) => {
                console.log('Get purchaseSubscriptionPlan data', res);

                getAllSubscriptions(true);
                updateState({
                  isLoadingB: false,
                  isLoading: false,
                  isRefreshing: false,
                });
              })
              .catch(errorMethod);
          } else {
            if (res && res?.error) {
              updateState({
                isLoadingB: false,
                isLoading: false,
                isRefreshing: false,
              });
              showError(res?.error?.message);
            }
          }
        })
        .catch((err) => {
          updateState({isLoadingB: false});
        });
    }
  };

  const modalBottomContent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: moderateScale(10),
          }}>
          <GradientButton
            colorsArray={[themeColors.primary_color, themeColors.primary_color]}
            textStyle={styles.textStyle}
            onPress={() => updateState({isModalVisibleForPayment: false})}
            borderRadius={moderateScale(5)}
            containerStyle={{
              marginHorizontal: moderateScale(10),
              width: paymentOptions.length ? width / 3 : width - 60,
            }}
            btnText={strings.CANCEL}
          />
          {paymentOptions.length ? (
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={styles.textStyle}
              onPress={payAmount}
              borderRadius={moderateScale(5)}
              containerStyle={{
                marginHorizontal: moderateScale(10),
                width: width / 3,
              }}
              btnText={strings.PAY}
            />
          ) : null}
        </View>
      </>
    );
  };

  const _payNowUpcoming = () => {
    console.log(currentSubscription, 'currentSubscription');
    updateState({isLoading: true});
    actions
      .cancelSubscriptionPlan(
        `/${currentSubscription?.slug}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('selectSpecificSubscriptionPlan data', res);
        updateState({
          isLoadingB: false,
          isLoading: false,
        });
        showSuccess(res?.message);
        getAllSubscriptions();
      })
      .catch(errorMethod);
  };

  const listHeaderComponent = () => {
    return (
      <>
        {!!currentSubscription && (
          <>
            <View style={{marginVertical: moderateScale(10)}}>
              <Text
                style={
                  isDarkMode
                    ? [
                        styles.subscriptionTitle,
                        {color: MyDarkTheme.colors.text},
                      ]
                    : styles.subscriptionTitle
                }>
                {strings.MYSUBSCRIPTION}
              </Text>
            </View>
            <SubscriptionComponent
              data={currentSubscription?.plan}
              subscriptionData={currentSubscription}
              clientCurrency={clientCurrency}
              // onPress={(currentSubscription) =>
              //   selectSpecificSubscriptionPlan(currentSubscription?.plan)
              // }
              allSubscriptions={allSubscriptions}
              currentSubscription={true}
              payNowUpcoming={() =>
                selectSpecificSubscriptionPlan(currentSubscription?.plan)
              }
              cancelSubscription={() => cancelSubscription(currentSubscription)}
            />
          </>
        )}
      </>
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
        centerTitle={strings.SUBSCRIPTION}
        headerStyle={
          isDarkMode
            ? {backgroundColor: MyDarkTheme.colors.background}
            : {backgroundColor: colors.white}
        }
      />

      <View style={{...commonStyles.headerTopLine}} />

      <View style={{flex: 1}}>
        <View
          style={{
            marginTop: moderateScaleVertical(20),
            marginHorizontal: moderateScale(10),
          }}>
          <FlatList
            data={(!isLoadingB && allSubscriptions) || []}
            renderItem={renderProduct}
            ListHeaderComponent={listHeaderComponent()}
            keyExtractor={(item, index) => String(index)}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{height: 10}} />}
            refreshing={isRefreshing}
            //   getItemLayout={getItemLayout}
            // style={{flex:1}}
            contentContainerStyle={{flexGrow: 1}}
            initialNumToRender={12}
            maxToRenderPerBatch={10}
            windowSize={10}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor={themeColors.primary_color}
              />
            }
            ListFooterComponent={() => <View style={{height: 20}} />}
            ListEmptyComponent={
              <ListEmptySubscriptions isLoading={isLoadingB} />
            }
          />
        </View>
      </View>

      <ModalView
        data={selectedPlan}
        isVisible={isModalVisibleForPayment}
        onClose={() => updateState({isModalVisibleForPayment: false})}
        mainViewStyle={{minHeight: height / 3, maxHeight: height}}
        leftIcon={imagePath.cross}
        topCustomComponent={topCustomComponent}
        modalMainContent={modalMainContent}
        modalBottomContent={modalBottomContent}
      />
      {/* <ConfettiCannon
        count={200}
        origin={{x: -10, y: 0}}
        autoStart={false}
        ref={explosion}
        fadeOut={false}
      /> */}
    </WrapperContainer>
  );
}
