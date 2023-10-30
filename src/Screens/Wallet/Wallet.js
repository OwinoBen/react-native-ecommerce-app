import { useFocusEffect } from '@react-navigation/native';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  Keyboard,
  Image,
  TextInput,
  I18nManager,
  Platform,
  TouchableOpacity,
} from 'react-native';
import HTMLView from 'react-native-htmlview';
import { useSelector } from 'react-redux';
import Header from '../../Components/Header';
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
  textScale,
} from '../../styles/responsiveSize';
import {
  currencyNumberFormatter,
  getValuebyKeyInArray,
  tokenConverterPlusCurrencyNumberFormater,
} from '../../utils/commonFunction';
import { appIds, shortCodes } from '../../utils/constants/DynamicAppKeys';
import stylesFun from './styles';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../styles/theme';
import Modal from 'react-native-modal';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import { getImageUrl, showError } from '../../utils/helperFunctions';
import { showMessage } from 'react-native-flash-message';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';
import { BarIndicator, UIActivityIndicator } from 'react-native-indicators';

import BorderTextInput from '../../Components/BorderTextInput';
import { getBuildId, getBundleId } from 'react-native-device-info';

export default function Wallet({ navigation }) {
  const [state, setState] = useState({
    pageNo: 1,
    limit: 12,
    wallet_amount: 0,
    walletHistory: [],
    isRefreshing: false,
    transferModal: false,
    transferEmail: '',
    transferAmount: '',
    verifiedUser: null,
    confirmLoader: false,
    searchLoader: false,
    errorRaised: null,
  });

  const { appData, themeColors, currencies, themeColor, themeToggle, appStyle } =
    useSelector((state) => state?.initBoot || {});
  const { additional_preferences, digit_after_decimal } =
    appData?.profile?.preferences || {};
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFun({ fontFamily });
  const styles = stylesFun({ fontFamily, themeColors, isDarkMode, MyDarkTheme });
  const moveToNewScreen = (screenName, data) => () => {
    navigation.navigate(screenName, { data });
  };
  const {
    pageNo,
    walletHistory,
    limit,
    wallet_amount,
    isRefreshing,
    transferModal,
    transferAmount,
    transferEmail,
    verifiedUser,
    confirmLoader,
    errorRaised,
    searchLoader,
  } = state;

  useFocusEffect(
    React.useCallback(() => {
      getWalletData();
    }, [isRefreshing]),
  );



  useEffect(() => {
    getWalletData();
  }, [pageNo, isRefreshing]);

  const getWalletData = () => {
    actions
      .walletHistory(
        `?page=${pageNo}&limit=${limit}`,
        {},
        {
          code: appData?.profile?.code,
        },
      )
      .then((res) => {
        console.log(res, 'Wallet Responce');
        updateState({
          isRefreshing: false,
          isLoading: false,
          isLoadingB: false,
          wallet_amount: res?.data?.wallet_amount,
          walletHistory:
            pageNo == 1
              ? res.data.transactions.data
              : [...walletHistory, ...res.data.transactions.data],
        });
      })
      .catch(errorMethod);
  };

  //Error handling in screen
  const errorMethod = (error) => {
    updateState({ isLoading: false, isLoadingB: false, isRefreshing: false });
    showError(error?.message || error?.error);
  };

  useEffect(() => { }, []);

  const searchUser = async (val) => {
    try {
      let data = { username: val };
      const res = await actions.walletUserVerify(data, {
        code: appData?.profile?.code,
      });
      const imageUrl = getImageUrl(
        res.data.image.image_fit,
        res.data.image.image_path,
        '400/400',
      );
      console.log('verifiedUser res++', imageUrl);
      const resData = { name: res?.data?.name || '', image: imageUrl || '' };
      updateState({
        verifiedUser: resData,
        errorRaised: null,
        searchLoader: false,
      });
    } catch (error) {
      console.log('erro raised', error);
      updateState({
        verifiedUser: null,
        errorRaised: error?.message,
        searchLoader: false,
      });
    }
  };

  useEffect(() => {
    const searchInterval = setTimeout(() => {
      let searchObj = {};
      if (transferEmail.trim()) {
        updateState({ searchLoader: true });
        searchObj.search_text = transferEmail;
      }
      if (!!searchObj.search_text) {
        searchUser(searchObj.search_text);
      } else {
        updateState({
          searchLoader: false,
          verifiedUser: null,
          errorRaised: null,
        });
      }
    }, 600);
    return () => {
      if (searchInterval) {
        clearInterval(searchInterval);
      }
    };
  }, [transferEmail]);

  const checkValid = () => {
    if (transferAmount == '') {
      alert(strings.ENTER_AMOUNT);
      return false;
    }
    if (transferAmount == 0) {
      alert(strings.INVALID_AMOUNT);
      return;
    }
    if (transferAmount > Number(wallet_amount)) {
      alert(strings.INSUFFICIENT_FUNDS_IN_WALLET);
      return;
    }
    if (transferEmail == '') {
      alert(strings.ENTER_EMAIL_OR_PHONE_NUMBER_WITH_COUNTRY_CODE);
      return false;
    }
    if (!verifiedUser) {
      alert(strings.USER_DOES_NOT_EXIST);
      return false;
    }
    return true;
  };
  const onConfirm = async () => {
    const isValid = checkValid();
    if (isValid) {
      updateState({ confirmLoader: true });
      try {
        let data = {
          username: transferEmail,
          amount: transferAmount,
        };
        const res = await actions.walletTransferConfirm(data, {
          code: appData?.profile?.code,
        });
        console.log('sent succeffully', res);
        showMessage(res?.message);
        getWalletData();
        updateState({
          pageNo: 1,
          transferEmail: '',
          transferAmount: '',
          verifiedUser: null,
          confirmLoader: false,
          errorRaised: null,
          transferModal: false,
        });
      } catch (error) {
        console.log('error raised', error);
        showError(error?.message || '');
        updateState({ confirmLoader: false });
      }
    }
  };

  const modalClose = () => {
    updateState({
      transferEmail: '',
      transferAmount: '',
      verifiedUser: null,
      confirmLoader: false,
      errorRaised: null,
      transferModal: false,
    });
  };

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity>
        <View
          style={{
            backgroundColor: isDarkMode
              ? MyDarkTheme.colors.background
              : '#fff',
            flexDirection: 'row',
            paddingVertical: moderateScaleVertical(10),
          }}>
          <View style={styles.addedMoneyTimeCon}>
            <Text
              style={{
                ...styles.addedMoneyMonth,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.walletTextD,
              }}>
              {moment(item.created_at).format('ll')}
            </Text>
            <Text
              style={{
                ...styles.addedMoneyMonth,
                color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.walletTextD,
              }}>
              {moment(item.created_at).format('LT')}
            </Text>
          </View>
          <View
            style={[styles.addMoneyListDesc, { backgroundColor: 'transparent' }]}>
            <HTMLView
              stylesheet={isDarkMode ? htmlStyle : null}
              value={`<p>${item?.meta?.description || item?.meta}</p>`}
            />
            {/* <Text numberOfLines={2} style={styles.addedText}>
              {item.description}
            </Text> */}
          </View>
          <View style={styles.addedMoneyValueCon}>
            <Text
              numberOfLines={2}
              style={
                isDarkMode
                  ? [styles.addedMoneyValue, { color: MyDarkTheme.colors.text }]
                  : styles.addedMoneyValue
              }>
              {getValuebyKeyInArray(
                'is_token_currency_enable',
                additional_preferences,
              ) && item.type == 'withdraw'
                ? tokenConverterPlusCurrencyNumberFormater(
                  item.amount,
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )
                : item.type == 'deposit'
                  ? `+${currencies?.primary_currency?.symbol
                  } ${currencyNumberFormatter(
                    item.amount,
                    appData?.profile?.preferences?.digit_after_decimal,
                  )}`
                  : `${currencies?.primary_currency?.symbol
                  } ${currencyNumberFormatter(
                    item.amount,
                    appData?.profile?.preferences?.digit_after_decimal,
                  )}`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const goToAddMoney = () => {
    moveToNewScreen(navigationStrings.ADD_MONEY, {})();
  };

  //pagination of data
  const onEndReached = ({ distanceFromEnd }) => {
    updateState({ pageNo: pageNo + 1 });
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({ pageNo: 1, isRefreshing: true });
  };

  const onTransferFunds = () => {
    updateState({ transferModal: true });
  };
  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const addTransferMoneyView = () => {
    return (
      <View style={styles.addMoneyCon}>
        <TouchableOpacity onPress={goToAddMoney} style={styles.addMoneybtn}>
          <Text style={{ ...styles.addMoneyText, letterSpacing: 1 }}>
            {strings.ADD_MONEY}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onTransferFunds} style={styles.addMoneybtn}>
          <Text style={{ ...styles.addMoneyText, letterSpacing: 1 }}>
            {strings.TRANSFER_FUNDS}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      statusBarColor={colors.white}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        centerTitle={strings.WALLET}
        headerStyle={
          isDarkMode
            ? { backgroundColor: MyDarkTheme.colors.background }
            : { backgroundColor: colors.white }
        }
      />

      {/* <Header
        leftIcon={imagePath.back}
        centerTitle={strings.WALLET}
        // rightIcon={imagePath.cartShop}
        headerStyle={{backgroundColor: Colors.white}}
      /> */}
      <View style={{ ...commonStyles.headerTopLine }} />
      {!getValuebyKeyInArray(
        'is_token_currency_enable',
        additional_preferences,
      ) ? (
        <View>
          <View
            style={
              isDarkMode
                ? [
                  styles.availableBalanceCon,
                  { backgroundColor: MyDarkTheme.colors.background },
                ]
                : styles.availableBalanceCon
            }>
            <View style={styles.balanceCon}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.availableBalanceText,
                        { color: MyDarkTheme.colors.text },
                      ]
                      : styles.availableBalanceText
                  }>
                  {strings.AVAILABLE_BALANCE}
                </Text>
              </View>

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={
                    isDarkMode
                      ? [
                        styles.availableBalanceValue,
                        { color: MyDarkTheme.colors.text },
                      ]
                      : styles.availableBalanceValue
                  }>
                  {currencies?.primary_currency?.symbol}{' '}
                  {currencyNumberFormatter(
                    wallet_amount,
                    appData?.profile?.preferences?.digit_after_decimal,
                  )}
                </Text>
              </View>
            </View>
            {addTransferMoneyView()}
          </View>
        </View>
      ) : (
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: moderateScale(40),
              marginTop: moderateScaleVertical(10),
            }}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.availableBalanceValue,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.availableBalanceValue
                }>
                {currencies?.primary_currency?.symbol}{' '}
                {currencyNumberFormatter(
                  wallet_amount,
                  appData?.profile?.preferences?.digit_after_decimal,
                )}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.availableBalanceText,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.availableBalanceText
                }>
                {strings.AVAILABLE_BALANCE}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
              }}>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.availableBalanceValue,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.availableBalanceValue
                }>
                {tokenConverterPlusCurrencyNumberFormater(
                  wallet_amount,
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
              <Text
                style={
                  isDarkMode
                    ? [
                      styles.availableBalanceText,
                      { color: MyDarkTheme.colors.text },
                    ]
                    : styles.availableBalanceText
                }>
                {'Token Balance'}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: moderateScaleVertical(10),
            }}>
            <TouchableOpacity
              onPress={goToAddMoney}
              style={{
                flex: 1,
                backgroundColor: themeColors?.primary_color,
                padding: moderateScaleVertical(10),
                marginHorizontal: moderateScaleVertical(8),
                borderRadius: moderateScale(5),
                alignItems: 'center',
              }}>
              <Text style={{ ...styles.addMoneyText, letterSpacing: 1 }}>
                {strings.ADD_MONEY}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onTransferFunds}
              style={{
                flex: 1,
                backgroundColor: themeColors?.primary_color,
                padding: moderateScaleVertical(10),
                marginHorizontal: moderateScaleVertical(8),
                borderRadius: moderateScale(5),
                alignItems: 'center',
              }}>
              <Text style={{ ...styles.addMoneyText, letterSpacing: 1 }}>
                {strings.TRANSFER_FUNDS}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View
        style={
          isDarkMode
            ? [
              styles.transactionHistoryCon,
              { backgroundColor: MyDarkTheme.colors.background },
            ]
            : styles.transactionHistoryCon
        }>
        <Text
          style={
            isDarkMode
              ? [
                styles.transactionHistoryText,
                { color: MyDarkTheme.colors.text },
              ]
              : styles.transactionHistoryText
          }>
          {strings.TRANSACTION_HISTORY}
        </Text>
      </View>
      <View style={{ ...commonStyles.headerTopLine }} />
      <View
        style={{
          backgroundColor: isDarkMode ? MyDarkTheme.colors.background : '#fff',
          flex: 1,
          paddingBottom:
            appStyle?.tabBarLayout == 3
              ? moderateScaleVertical(85)
              : moderateScaleVertical(32),
        }}>
        <FlatList
          data={walletHistory}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<View style={{ height: 4 }} />}
          ItemSeparatorComponent={(walletHistory, index) =>
            index == walletHistory.length ? null : (
              <View style={styles.cartItemLine}></View>
            )
          }
          keyExtractor={(item, index) => String(index)}
          // ListEmptyComponent={<ListEmptyOffers isLoading={true} />}
          // ListFooterComponent={() => <View style={{height: 10}} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          initialNumToRender={12}
          maxToRenderPerBatch={10}
          onEndReached={onEndReachedDelayed}
          onEndReachedThreshold={0.5}
          renderItem={_renderItem}
        />
      </View>
      <Modal
        avoidKeyboard
        isVisible={transferModal}
        // isVisible={true}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
          backgroundColor: isDarkMode ? colors.black : colors.white,
        }}
        onBackdropPress={modalClose}>
        <View
          style={{
            backgroundColor: isDarkMode ? colors.whiteOpacity15 : colors.white,
            padding: moderateScale(12),
            borderTopLeftRadius: moderateScale(12),
            borderTopRightRadius: moderateScale(12),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: moderateScaleVertical(8),
            }}>
            <Text
              style={{
                ...styles.nameTextStyle,
                marginLeft: 0,
                fontSize: textScale(16),
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {strings.TRANSFER_FUNDS}
            </Text>
            <TouchableOpacity onPress={modalClose} activeOpacity={0.8}>
              <Image source={imagePath.closeButton} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              ...styles.availableBalanceText,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB,
            }}>
            {strings.AVAILABLE_BALANCE}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                ...styles.availableBalanceValue,
                color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              }}>
              {currencies?.primary_currency?.symbol}{' '}
              {currencyNumberFormatter(
                wallet_amount,
                appData?.profile?.preferences?.digit_after_decimal,
              )}
            </Text>
          </View>

          <Text
            style={{
              ...styles.headingStyle,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
            }}>
            {strings.AMOUNT_TO_TRANSFER}
          </Text>
          <View style={styles.textInputView}>
            <TextInput
              placeholder={strings.ENTER_AMOUNT}
              placeholderTextColor={
                isDarkMode ? MyDarkTheme.colors.text : colors.grayOpacity51
              }
              onChangeText={(text) => updateState({ transferAmount: text })}
              style={styles.textInputStyle}
              keyboardType="number-pad"
            />
          </View>
          <Text
            style={{
              ...styles.headingStyle,
              color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
              marginTop: moderateScaleVertical(10),
            }}>
            {strings.TRANSFER_TO}
          </Text>
          <View style={{ ...styles.textInputView, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <TextInput
                placeholder={
                  getBundleId() == appIds.qdelo ? 'Email / Phone Ex: 919876543210 ' : strings.ENTER_EMAIL_OR_PHONE_NUMBER_WITH_COUNTRY_CODE
                }
                placeholderTextColor={
                  isDarkMode ? MyDarkTheme.colors.text : colors.grayOpacity51
                }
                onChangeText={(text) => updateState({ transferEmail: text })}
                style={styles.textInputStyle}
              />
            </View>
            {searchLoader ? (
              <View style={{ flex: 0.1, alignItems: 'flex-end' }}>
                <UIActivityIndicator
                  size={20}
                  color={themeColors.primary_color}
                />
              </View>
            ) : null}
          </View>

          <View
            style={{
              height: moderateScale(60),
              marginTop: moderateScaleVertical(12),
            }}>
            {!!errorRaised ? (
              <Text
                style={{
                  ...styles.nameTextStyle,
                  color: colors.redB,
                }}>
                {!!errorRaised ? errorRaised : ''}
              </Text>
            ) : null}
            {!!verifiedUser ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: verifiedUser?.image || '' }}
                  style={{
                    height: moderateScale(50),
                    width: moderateScale(50),
                    borderRadius: moderateScale(25),
                    backgroundColor: colors.blackOpacity20,
                  }}
                />
                <Text
                  style={{
                    ...styles.nameTextStyle,
                    color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  }}>
                  {verifiedUser?.name}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: moderateScaleVertical(24),
            }}>
            <ButtonWithLoader
              btnStyle={{
                flex: 1,
                backgroundColor: themeColors.primary_color,
                borderWidth: 0,
              }}
              btnText={strings.CONFIRM}
              isLoading={confirmLoader}
              onPress={onConfirm}
            />
            <View style={{ marginHorizontal: moderateScaleVertical(8) }} />
            <ButtonWithLoader
              btnStyle={{
                flex: 1,
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: themeColors.primary_color,
              }}
              btnText={strings.CANCEL}
              btnTextStyle={{
                color: themeColors.primary_color,
              }}
              onPress={modalClose}
            />
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
}
const htmlStyle = StyleSheet.create({
  p: {
    fontWeight: '300',
    color: '#e5e5e7', // make links coloured pink
  },
});
