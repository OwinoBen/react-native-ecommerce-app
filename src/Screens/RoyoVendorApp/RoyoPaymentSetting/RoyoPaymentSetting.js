import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import fontFamily from '../../../styles/fontFamily';
import colors from '../../../styles/colors';
import strings from '../../../constants/lang';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import Modal from 'react-native-modal';
import DropDown from '../../../Components/DropDown';
import {TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInputWithUnderlineAndLabel from '../../../Components/TextInputWithUnderlineAndLabel';
import Header from '../../../Components/Header';
import {useSelector} from 'react-redux';
import actions from '../../../redux/actions';
import navigationStrings from '../../../navigation/navigationStrings';
import {showMessage} from 'react-native-flash-message';

const PaymentSettings = (props) => {
  const {navigation} = props;

  const [state, setState] = useState({
    selectedVendor: null,
    vendor_list: [],
    isLoading: false,
    isRefreshing: false,
    accountModalVisible: false,
    selectedBuisnessType: '',
    productName: '',
    accountType: '',
    accouontNumber: '',
    AccountHolderName: '',
    ifsc: '',
  });

  const {
    selectedVendor,
    vendor_list,
    isLoading,
    isRefreshing,
    accountModalVisible,
    accountType,
    accouontNumber,
    AccountHolderName,
    ifsc,
  } = state;
  const {appData, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const {storeSelectedVendor} = useSelector((state) => state?.order);
  useEffect(() => {
    updateState({
      // selectedTab: null,
      selectedVendor: storeSelectedVendor,
      // isLoading: true,
    });
  }, [storeSelectedVendor]);

  useEffect(() => {
    _getListOfVendor();
  }, []);

  const _reDirectToVendorList = () => {
    navigation.navigate(navigationStrings.VENDORLIST, {
      selectedVendor: selectedVendor,
      allVendors: vendor_list,
      screenType: navigationStrings.ROYO_VENDOR_PAYMENT_SETTINGS,
    });
  };
  const _getListOfVendor = () => {
    let vendordId = !!storeSelectedVendor?.id
      ? storeSelectedVendor?.id
      : selectedVendor?.id
      ? selectedVendor?.id
      : '';
    actions
      ._getListOfVendorOrders(
        `?limit=${1}&page=${1}&selected_vendor_id=${vendordId}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log('vendor orders res', res);
        updateState({
          vendor_list: res.data.vendor_list,
          selectedVendor: !!storeSelectedVendor?.id
            ? storeSelectedVendor
            : res.data.vendor_list.find((x) => x.is_selected),
          isLoading: false,
          isRefreshing: false,
        });
      })
      .catch(errorMethod);
  };
  const errorMethod = (error) => {
    updateState({isLoading: false, isRefreshing: false});
    showError(error?.message || error?.error);
  };

  const toggleAccountModal = () => {
    updateState({accountModalVisible: !accountModalVisible});
  };

  const dropDownData = ['account 1', 'account 2', 'account 3', 'account 4'];

  const showError = (message) => {
    showMessage({
      type: 'danger',
      icon: 'danger',
      message: message,
    });
  };

  const onChangeText = (key) => {
    return (value) => {
      updateState({[key]: value});
    };
  };

  const onSelectAccountType = (data) => {
    updateState({accountType: data});
  };

  const renderAddAccountModal = () => {
    return (
      <KeyboardAwareScrollView
        bounces={false}
        style={styles.modalContainerStyle}>
        <TouchableOpacity
          onPress={toggleAccountModal}
          style={{
            alignSelf: 'center',
            marginVertical: moderateScaleVertical(24),
          }}>
          <Image source={imagePath.closeRoyo} />
        </TouchableOpacity>
        <View style={styles.modalBody}>
          <Text style={styles.modalHeaderText}>{strings.ADD_NEW_ACCOUNT}</Text>

          <TextInputWithUnderlineAndLabel
            labelStyle={styles.labelText}
            mainStyle={{
              ...styles.textInputView,
              flex: 0.48,
              // backgroundColor: 'red',
            }}
            containerStyle={{}}
            txtInputStyle={styles.textInput}
            underlineColor="transparent"
            label={strings.ACCOUNT_HOLDER_NAME}
            value={AccountHolderName}
            onChangeText={onChangeText('AccountHolderName')}
            placeholder={strings.EXAMPLE}
            marginBottom={0}
          />
          {/* <View style={{...styles.textInputView}}>
          <Text style={styles.labelText}>Account Type</Text>
          <DropDown
            value={accountType}
            inputStyle={{
              ...styles.dropDown,
            }}
            selectedIndexByProps={-1}
            placeholder="Choose Accouont type"
            data={dropDownData}
            fetchValues={onSelectAccountType}
            marginBottom={2}
            // inputStyle={{ borderColor: countryError !== '' ? colors.redColor : colors.lightGray }}
          />
        </View> */}
          <View
            style={{
              ...styles.textInputView,
              marginTop: moderateScaleVertical(10),
            }}>
            <Text style={styles.labelText}>{strings.ACCOUNT_TYPE}</Text>
            <DropDown
              value={accountType}
              inputStyle={styles.textInput}
              selectedIndexByProps={-1}
              placeholder={strings.CHOOSE_ACCOUNT_TYPE}
              data={dropDownData}
              fetchValues={onSelectAccountType}
              marginBottom={0}
              // inputStyle={{ borderColor: countryError !== '' ? colors.redColor : colors.lightGray }}
            />
          </View>
          <TextInputWithUnderlineAndLabel
            labelStyle={styles.labelText}
            mainStyle={{
              ...styles.textInputView,
              zIndex: -9,
              // marginTop: moderateScaleVertical(10),
            }}
            containerStyle={{}}
            txtInputStyle={styles.textInput}
            underlineColor="transparent"
            label={strings.ACCOUNT_NUMBER}
            value={accouontNumber}
            onChangeText={onChangeText('accouontNumber')}
            placeholder="xxxxxxxxxxxxxx"
            marginBottom={0}
          />

          <TextInputWithUnderlineAndLabel
            labelStyle={styles.labelText}
            mainStyle={{
              ...styles.textInputView,
              zIndex: -9,
              marginTop: moderateScaleVertical(10),
            }}
            txtInputStyle={styles.textInput}
            underlineColor="transparent"
            label={strings.IFSC}
            value={ifsc}
            onChangeText={onChangeText('ifsc')}
            placeholder={strings.ENTER_IFSC}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content">
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        leftIcon={imagePath.backRoyo}
        centerTitle={'Payment settings | ' + selectedVendor?.name || ''}
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        showImageAlongwithTitle
        imageAlongwithTitle={imagePath.dropdownTriangle}
      />
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.cashBox, {alignItems: 'center'}]}>
          <Image source={imagePath.selectedRoyo} />
          <Text style={styles.cashOnDeliver}>{strings.CASH_ON_DELIVERY}</Text>
        </TouchableOpacity>
        <View
          style={{borderWidth: 0.5, borderColor: colors.lightGreyBgColor}}
        />

        <View
          style={[styles.cardBox, {flexDirection: 'column', width: '100%'}]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={imagePath.deselectedRoyo} />
            <Text
              style={[
                styles.accouontTransfer,
                {marginLeft: moderateScale(10)},
              ]}>
              {strings.BANK_ACCOUNT_TRANSFER}
            </Text>
          </TouchableOpacity>
          <View style={{width: '100%'}}>
            {[1, 2].map((val, index) => (
              <View
                key={index}
                style={[
                  styles.paymentCardBox,
                  {width: '95%', alignSelf: 'flex-end'},
                ]}>
                <Image source={imagePath.masterCardRoyo} />
                <View
                  style={{
                    // flex: 1,
                    width: '100%',
                    marginLeft: moderateScale(12),
                    // justifyContent: 'space-around',
                  }}>
                  <Text style={styles.cardNumber}>1234 5678 9234 2345</Text>
                  <Text style={styles.cardName}>{strings.MASTER_CARD}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={{alignSelf: 'flex-end'}}>
            <Text onPress={toggleAccountModal} style={styles.addAccount}>
              {strings.ADD_ACCOUNT}
            </Text>
          </View>
        </View>
      </View>
      <Modal
        isVisible={accountModalVisible}
        onBackButtonPress={toggleAccountModal}
        onBackdropPress={toggleAccountModal}
        style={styles.modalStyle}>
        {renderAddAccountModal()}
      </Modal>
    </WrapperContainer>
  );
};

export default PaymentSettings;

const styles = StyleSheet.create({
  container: {
    paddingBottom: moderateScaleVertical(24),
    paddingHorizontal: moderateScale(16),
  },
  cashBox: {
    flexDirection: 'row',
    paddingBottom: moderateScaleVertical(16),
    paddingTop: moderateScaleVertical(10),
    alignItems: 'baseline',
  },
  cashOnDeliver: {
    marginLeft: moderateScale(12),
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  cardBox: {
    flexDirection: 'row',
    paddingTop: moderateScaleVertical(16),
    alignItems: 'baseline',
  },
  accouontTransfer: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.black,
  },
  paymentCardBox: {
    marginTop: moderateScaleVertical(15),
    borderRadius: moderateScale(6),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScaleVertical(24),
    backgroundColor: '#D8D8D850',
  },
  cardNumber: {
    fontFamily: fontFamily.medium,
    fontSize: textScale(13),
    lineHeight: textScale(24),
    color: colors.blackOpacity86,
  },
  cardName: {
    fontFamily: fontFamily.medium,
    fontSize: textScale(12),
    color: colors.blackOpacity43,
  },
  addAccount: {
    textAlign: 'right',
    marginTop: moderateScaleVertical(15),
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: '#44D7B6',
  },
  modalStyle: {
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: colors.transparent,
  },
  modalContainerStyle: {
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 12,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalBody: {
    backgroundColor: colors.white,

    paddingVertical: moderateScaleVertical(26),
    paddingHorizontal: moderateScale(32),
    borderTopLeftRadius: moderateScale(12),
    borderTopRightRadius: moderateScale(12),
  },
  modalHeaderText: {
    fontSize: 18,
    fontFamily: fontFamily.medium,
    textAlign: 'center',
  },
  labelText: {
    color: colors.black,
    marginBottom: moderateScaleVertical(8),
  },
  textInputView: {
    marginTop: moderateScaleVertical(24),
    // zIndex: 123,
  },
  textInput: {
    backgroundColor: colors.white,
    borderColor: colors.borderColorGrey,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    color: colors.black,
    height: moderateScaleVertical(48),
    paddingHorizontal: moderateScale(12),
    fontSize: 14,
    marginBottom: 0,
    marginTop: 0,
  },
  dropDown: {
    backgroundColor: colors.white,
    borderColor: colors.borderColorGrey,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    color: colors.black,
    marginTop: moderateScaleVertical(8),
    padding: moderateScale(9),
    height: moderateScaleVertical(48),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
