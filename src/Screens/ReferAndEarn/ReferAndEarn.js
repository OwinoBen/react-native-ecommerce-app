import Clipboard from '@react-native-community/clipboard';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { MultiSelect } from 'react-native-element-dropdown';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import { Row, Rows, Table } from 'react-native-table-component';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import BorderTextInput from '../../Components/BorderTextInput';
import ButtonWithLoader from '../../Components/ButtonWithLoader';
import GallaryCameraImgPicker from '../../Components/GallaryCameraImgPicker';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { cameraHandler, checkValueExistInAry } from '../../utils/commonFunction';
import { showError } from '../../utils/helperFunctions';
import { androidCameraPermission } from '../../utils/permissions';
import validations from '../../utils/validations';

export default function ReferAndEarn() {
  const {
    themeColors,
    appStyle,
    appData,
    currencies,
    languages,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
  const {
    aadhaar_back,
    aadhaar_front,
    aadhaar_number,
    account_name,
    account_number,
    bank_name,
    upi_id,
    ifsc_code,
  } = appData?.profile?.preferences || {};

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors,isDarkMode });

  const [availableInfluencerTypes, setAvailableInfluencerTypes] = useState([]);
  const [isInfluencerCategoryForm, setInfluencerCategoryForm] = useState(false);
  const [tableHead, setTableHead] = useState([
    'Order ID',
    'Product Name',
    'Total Amount',
    'User Dicount',
    'Earning Amount',
    'Order Date',
  ]);
  const [tableData, setTableData] = useState([
    ['13569983', 'Baby oil', '$500', '10%', '$50', '13/12/2022'],
    ['13569983', 'Baby oil', '$500', '10%', '$50', '13/12/2022'],
    ['13569983', 'Baby oil', '$500', '10%', '$50', '13/12/2022'],
    ['13569983', 'Baby oil', '$500', '10%', '$50', '13/12/2022'],
  ]);
  const [widthArr, setWidthArr] = useState([80, 110, 100, 100, 120, 120]);
  const [isLoading, setIsLoading] = useState(true);
  const [influencerRegistredUsers, setInfluencerRegistredUsers] = useState([]);
  const [selectedInfluencerCategory, setSelectedInfluencerCategory] = useState(
    {},
  );
  const [isLoadingCategoryAttributes, setIsLoadingCategoryAttributes] =
    useState(true);
  const [
    availableAttributesOfInfluenceCategory,
    setAvailableAttributesOfInfluenceCategory,
  ] = useState([]);
  const [isSavingInfluenceInfo, setIsSavingInfluenceInfo] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isKycForm, setIsKycForm] = useState(false);
  const [isImagePickerModal, setIsImagePickerModal] = useState(false);
  const [aadharFrontImg, setAadharFrontImg] = useState({});
  const [aadharBackImg, setAadharBackImg] = useState({});
  const [aadharNumber, setAadharNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [pickerType, setPickerType] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    getInfluencerReferEarnCategories();
  }, []);

  const getInfluencerReferEarnCategories = () => {
    actions
      .getInfluencerReferEarnCategories(
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, '<===getInfluencerReferEarnCategories');
        setIsLoading(false);
        setIsRefreshing(false);
        setAvailableInfluencerTypes(res?.data?.influencer_category);
        setInfluencerRegistredUsers(res?.data?.influencer_user);
      })
      .catch(errorMethod);
  };

  const onInfluencerCategory = (item) => {
    setSelectedInfluencerCategory(item);
    setInfluencerCategoryForm(true);
    setIsLoadingCategoryAttributes(true);
    if (item?.kyc == 1) {
      setIsKycForm(true);
    } else {
      setIsKycForm(false);
    }
    actions
      .getDetailsOfSelectedInfluenceCategory(
        `/${item?.id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, '<=== res getDetailsOfSelectedInfluenceCategory');
        setAvailableAttributesOfInfluenceCategory(res?.data?.attributes);
        setIsLoadingCategoryAttributes(false);
      })
      .catch(errorMethod);
  };

  const isValidData = () => {
    const error = validations({
      aadharNumber: aadharNumber,
      aadharFrontImg: aadharFrontImg,
      aadharBackImg: aadharBackImg,
      upiId: upiId,
      bankName: bankName,
      beneficiaryName: beneficiaryName,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const onSaveAttributeInfo = () => {
    if (isKycForm) {
      const checkValid = isValidData();
      if (!checkValid) {
        return;
      }
    }
    setIsSavingInfluenceInfo(true);
    let formData = new FormData();
    formData.append('category_id', selectedInfluencerCategory?.id);
    formData.append('kyc', isKycForm ? 1 : 0);
    formData.append('account_name', beneficiaryName);
    formData.append('bank_name', bankName);
    formData.append('account_number', accountNumber);
    formData.append('ifsc_code', ifscCode);

    if (!isEmpty(aadharFrontImg)) {
      formData.append('adhar_front', {
        name: aadharFrontImg.name,
        type: aadharFrontImg.type,
        uri: aadharFrontImg.uri,
      });
    }
    if (!isEmpty(aadharBackImg)) {
      formData.append('adhar_back', {
        name: aadharBackImg.name,
        type: aadharBackImg.type,
        uri: aadharBackImg.uri,
      });
    }
    formData.append('adhar_number', aadharNumber);
    formData.append('upi_id', upiId);
    let apiObj = {};
    let attributeInfo = [...availableAttributesOfInfluenceCategory];
    attributeInfo.map((item, index) => {
      let optionData = [];
      item?.option?.map((item, inx) => {
        optionData[inx] = {
          option_id: item?.id,
          option_title: item?.title,
        };
      });
      if (item?.values) {
        apiObj[item?.id] = {
          type: item?.type,
          id: item?.id,
          attribute_title: item?.title,
          option: optionData,
          value: item?.values,
        };
      }
    });
    formData.append('attribute', JSON.stringify(apiObj));
    console.log(formData, '<===formData sending');

    actions
      .saveInfluencerInfo(formData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        'Content-Type': 'multipart/form-data',
      })
      .then((res) => {
        console.log(res, '<=== response saveInfluencerInfo');
        setIsSavingInfluenceInfo(false);
        getInfluencerReferEarnCategories();
        setInfluencerCategoryForm(false);
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, '<=== errorinMethod');
    setIsLoading(false);
    setIsRefreshing(false);
    setIsLoadingCategoryAttributes(false);
    setIsSavingInfluenceInfo(false);
    setIsSavingInfluenceInfo(false);
    showError(error?.message || error?.error);
  };

  const onChangeDropDownOption = (value, item) => {
    const attributeInfoData = [...availableAttributesOfInfluenceCategory];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = value;
    setAvailableAttributesOfInfluenceCategory(attributeInfoData);
  };

  const onPressRadioButton = (item) => {
    const attributeInfoData = [...availableAttributesOfInfluenceCategory];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.attribute_id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [item?.id];
    setAvailableAttributesOfInfluenceCategory(attributeInfoData);
  };

  const onChangeText = (text, item) => {
    const attributeInfoData = [...availableAttributesOfInfluenceCategory];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [text];
    setAvailableAttributesOfInfluenceCategory(attributeInfoData);
  };

  const onPressCheckBoxes = (value, data) => {
    const attributeInfoData = [...availableAttributesOfInfluenceCategory];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == value?.attribute_id,
    );
    if (!isEmpty(data?.values)) {
      let existingItmIndx = data?.values.findIndex((itm) => itm == value.id);
      if (existingItmIndx == -1) {
        attributeInfoData[indexOfAttributeToUpdate].values = [
          ...data?.values,
          value?.id,
        ];
      } else {
        let index = attributeInfoData[indexOfAttributeToUpdate].values.indexOf(
          value?.id,
        );
        if (index >= 0) {
          attributeInfoData[indexOfAttributeToUpdate].values.splice(index, 1);
        }
      }
    } else {
      attributeInfoData[indexOfAttributeToUpdate].values = [value?.id];
    }
    setAvailableAttributesOfInfluenceCategory(attributeInfoData);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    getInfluencerReferEarnCategories();
  };

  const cameraHandle = async (index) => {
    const permissionStatus = await androidCameraPermission();
    if (!!permissionStatus) {
      cameraHandler(index, {
        width: 300,
        height: 400,
        cropping: false,
        cropperCircleOverlay: false,
        compressImageQuality: 0.5,
        mediaType: 'photo',
      })
        .then((res) => {
          console.log(res, 'res.....res..');
          console.log(pickerType, 'lkadjlkjfsjdf');
          if (res?.path) {
            let file = {
              id: uuidv4(),
              name: res?.path.substring(res?.path.lastIndexOf('/') + 1),
              type: res?.mime,
              uri: res?.path,
            };
            if (pickerType == 'front') {
              setAadharFrontImg(file);
              return;
            }
            if (pickerType == 'back') {
              setAadharBackImg(file);
              return;
            }
          } else {
            setIsImagePickerModal(false);
          }
        })
        .catch(() => { }, setIsImagePickerModal(false));
    }
  };

  const renderRadioBtns = useCallback(
    (item, data, index) => {
      return (
        <TouchableOpacity
          key={String(index)}
          onPress={() => onPressRadioButton(item)}
          style={styles.radioBtnTouch}>
          <Image
            source={
              !isEmpty(data?.values) && data?.values[0] == item?.id
                ? imagePath.icActiveRadio
                : imagePath.icInActiveRadio
            }
            style={{
              tintColor:
                !isEmpty(data?.values) && data?.values[0] == item?.id
                  ? themeColors.primary_color
                  : colors.blackOpacity43,
            }}
          />
          <Text style={styles.radioBtnTitle}>{item?.title}</Text>
        </TouchableOpacity>
      );
    },
    [availableAttributesOfInfluenceCategory],
  );

  const renderCheckBoxes = useCallback(
    (item, data, index) => {
      return (
        <TouchableOpacity
          key={String(index)}
          onPress={() => onPressCheckBoxes(item, data)}
          style={{
            ...styles.radioBtnTouch,
            marginBottom: moderateScaleVertical(10),
          }}>
          <Image
            source={
              checkValueExistInAry(item, data?.values)
                ? imagePath.checkBox2Active
                : imagePath.checkBox2InActive
            }
            style={{
              tintColor: checkValueExistInAry(item, data?.values)
                ? themeColors.primary_color
                : colors.blackOpacity43,
            }}
          />
          <Text style={styles.radioBtnTitle}>{item?.title}</Text>
        </TouchableOpacity>
      );
    },
    [availableAttributesOfInfluenceCategory],
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          onPress={() => onInfluencerCategory(item)}
          style={styles.categoryTitle}>
          <Text>{item?.name}</Text>
        </TouchableOpacity>
      );
    },
    [availableInfluencerTypes],
  );

  const influencerForm = () => {
    return (
      <WrapperContainer isLoading={isLoadingCategoryAttributes} 
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }>
        <Header
          leftIcon={imagePath.icBackb}
          onPressLeft={() => {
            setInfluencerCategoryForm(false);
            return;
          }}
        />
        <View
          style={{
            flex: 1,
            marginHorizontal: moderateScale(16),
          }}>
          <Text
            style={{
              ...styles.formSectionTitle,
            }}>
            {strings.INFLUENCER_FORM}
          </Text>
          <FlatList
            data={availableAttributesOfInfluenceCategory}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item, index) => String(index)}
            renderItem={renderAttributeOptions}
            ListEmptyComponent={() =>
              !isLoadingCategoryAttributes && (
                <View>
                  <Image
                    source={imagePath.noDataFound}
                    style={styles.noDataFoundImg}
                  />
                  <Text style={styles.noDataFoundTxt}>
                    {strings.NODATAFOUND}
                  </Text>
                </View>
              )
            }
            ListFooterComponent={
              !isEmpty(availableAttributesOfInfluenceCategory) ? (
                <View
                  style={{
                    paddingBottom: moderateScaleVertical(130),
                  }}>
                  {isKycForm && (
                    <View>
                      <Text
                        style={{
                          ...styles.formSectionTitle,
                          marginBottom: moderateScaleVertical(10),
                          marginTop: moderateScaleVertical(40),
                        }}>
                        {strings.KYC_DETAILS}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(14),
                          marginBottom: moderateScaleVertical(5),
                        }}>
                        {aadhaar_front || strings.AADHAR_FRONT}*
                      </Text>
                      {!isEmpty(aadharFrontImg) ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setPickerType('front');
                              setIsImagePickerModal(true);
                            }}>
                            <Image
                              source={{ uri: aadharFrontImg?.uri }}
                              style={{
                                height: moderateScaleVertical(100),
                                width: '95%',
                                borderRadius: moderateScale(6),
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setAadharFrontImg({})}
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: -10,
                            }}>
                            <Image
                              source={imagePath.crossB}
                              style={{
                                height: 20,
                                width: 20,
                                tintColor: colors.black,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setPickerType('front');
                            setIsImagePickerModal(true);
                          }}>
                          <Image source={imagePath.icPlaceholder} />
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(14),
                          marginBottom: moderateScaleVertical(5),
                          marginTop: moderateScaleVertical(14),
                        }}>
                        {aadhaar_back || strings.AADHAR_BACK}*
                      </Text>
                      {!isEmpty(aadharBackImg) ? (
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              setPickerType('front');
                              setIsImagePickerModal(true);
                            }}>
                            <Image
                              source={{ uri: aadharBackImg?.uri }}
                              style={{
                                height: moderateScaleVertical(100),
                                width: '95%',
                                borderRadius: moderateScale(6),
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setAadharBackImg({})}
                            style={{
                              position: 'absolute',
                              right: 12,
                              top: -10,
                            }}>
                            <Image
                              source={imagePath.crossB}
                              style={{
                                height: 20,
                                width: 20,
                                tintColor: colors.black,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => {
                            setPickerType('back');
                            setIsImagePickerModal(true);
                          }}>
                          <Image source={imagePath.icPlaceholder} />
                        </TouchableOpacity>
                      )}
                      <Text
                        style={{
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(14),
                          marginBottom: moderateScaleVertical(5),
                          marginTop: moderateScaleVertical(14),
                        }}>
                        {aadhaar_number || strings.AADHAR_NUMBER}*
                      </Text>
                      <BorderTextInput
                        onChangeText={(txt) => setAadharNumber(txt)}
                        value={aadharNumber}
                        keyboardType={'number-pad'}
                        maxLength={12}
                        containerStyle={{
                          borderRadius: moderateScale(5),
                        }}
                      />
                      <Text
                        style={{
                          ...styles.formSectionTitle,
                          marginBottom: moderateScaleVertical(6),
                          marginTop: moderateScaleVertical(20),
                        }}>
                        {strings.BANK_DETAILS}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(14),
                          marginVertical: moderateScaleVertical(5),
                        }}>
                        {upi_id || strings.UPI_ID}*
                      </Text>
                      <BorderTextInput
                        onChangeText={(txt) => setUpiId(txt)}
                        value={upiId}
                        containerStyle={{
                          borderRadius: moderateScale(5),
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(14),
                          marginVertical: moderateScaleVertical(5),
                        }}>
                        {bank_name || strings.BANK_NAME}*
                      </Text>
                      <BorderTextInput
                        onChangeText={(txt) => setBankName(txt)}
                        value={bankName}
                        containerStyle={{
                          borderRadius: moderateScale(5),
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(14),
                          marginBottom: moderateScaleVertical(5),
                        }}>
                        {account_name || strings.BENEFICIARY_NAME}*
                      </Text>
                      <BorderTextInput
                        onChangeText={(txt) => setBeneficiaryName(txt)}
                        value={beneficiaryName}
                        containerStyle={{
                          borderRadius: moderateScale(5),
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(14),
                          marginBottom: moderateScaleVertical(5),
                        }}>
                        {account_number || strings.ACCOUNT_NUMBER}*
                      </Text>
                      <BorderTextInput
                        onChangeText={(txt) => setAccountNumber(txt)}
                        value={accountNumber}
                        keyboardType={'number-pad'}
                        containerStyle={{
                          borderRadius: moderateScale(5),
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(14),
                          marginBottom: moderateScaleVertical(5),
                        }}>
                        {ifsc_code || strings.IFSC_CODE}*
                      </Text>
                      <BorderTextInput
                        onChangeText={(txt) => setIfscCode(txt)}
                        value={ifscCode}
                        containerStyle={{
                          borderRadius: moderateScale(5),
                        }}
                      />
                    </View>
                  )}
                  <ButtonWithLoader
                    onPress={onSaveAttributeInfo}
                    isLoading={isSavingInfluenceInfo}
                    btnText={strings.SAVE}
                    btnStyle={{
                      backgroundColor: themeColors?.primary_color,
                      borderWidth: 0,
                      marginBottom: moderateScaleVertical(10),
                    }}
                  />
                </View>
              ) : null
            }
          />
        </View>
      </WrapperContainer>
    );
  };

  const renderAttributeOptions = useCallback(
    ({ item, index }) => {
      return (
        <View
          style={{
            marginTop: moderateScaleVertical(14),
          }}>
          <Text
            style={{
              ...styles.attributeTitle,
              marginBottom: moderateScaleVertical(6),
            }}>
            {item?.title}
          </Text>
          {item?.type == 1 ? (
            <MultiSelect
              style={styles.multiSelect}
              labelField="title"
              valueField="id"
              value={!isEmpty(item?.values) ? item?.values : []}
              data={item?.option}
              onChange={(value) => onChangeDropDownOption(value, item)}
              placeholder={'Select value'}
              fontFamily={fontFamily.regular}
              placeholderStyle={styles.multiSelectPlaceholder}
            />
          ) : item?.type == 3 ? (
            <View style={styles.radioBtn}>
              {item?.option?.map((itm, indx) =>
                renderRadioBtns(itm, item, indx),
              )}
            </View>
          ) : item?.type == 4 ? (
            <TextInput
              placeholder={strings.TYPE_HERE}
              onChangeText={(text) => onChangeText(text, item)}
              style={styles.textInput}
            />
          ) : (
            <View style={styles.checkBox}>
              {item?.option?.map((itm, index) =>
                renderCheckBoxes(itm, item, index),
              )}
            </View>
          )}
        </View>
      );
    },
    [availableAttributesOfInfluenceCategory],
  );

  const InfluncerHistoryView = () => {
    return (
      <View style={{ flex: 1 }}>
        {influencerRegistredUsers?.is_approved == 0 ||
          influencerRegistredUsers?.is_approved == 2 ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              marginTop: moderateScaleVertical(200),
            }}>
            <FastImage
              source={
                influencerRegistredUsers?.is_approved == 2
                  ? imagePath.icApprovalRejected
                  : imagePath.icAwaitingApproval
              }
              style={{
                height: 160,
                width: 160,
                marginLeft: moderateScale(30),
              }}
              resizeMode="cover"
            />
            <Text
              style={{
                fontFamily: fontFamily?.bold,
                fontSize: textScale(14),
                color: colors.black,
                marginTop: moderateScaleVertical(10),
              }}>
              {influencerRegistredUsers?.is_approved == 2
                ? strings.YOUR_REQUEST_REJECTED
                : strings.WAITING_FOR_APPROVAL}
            </Text>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
            }}>
            {influencerRegistredUsers?.reffered_code && (
              <View style={styles.leftRightTxt}>
                <Text
                  style={{
                    fontFamily: fontFamily?.bold,
                    fontSize: textScale(16),
                  }}>
                  {strings.YOUR_REFFERAL_CODE}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(
                      influencerRegistredUsers?.reffered_code,
                    );
                    Toast.show(strings.COPIED);
                  }}
                  style={styles.promoBtnTouch}>
                  <Text style={styles.promoTxt}>
                    {influencerRegistredUsers?.reffered_code}
                  </Text>
                  <Image
                    source={imagePath.icTapToCopy}
                    style={{
                      height: 16,
                      width: 16,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                ...styles.leftRightTxt,
                marginTop: moderateScaleVertical(14),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily?.medium,
                  fontSize: textScale(14),
                }}>
                {'Earning amount'}
              </Text>
              <Text style={styles.promoTxt}>$ 00:00</Text>
            </View>
            <View
              style={{
                ...styles.leftRightTxt,
                marginTop: moderateScaleVertical(14),
              }}>
              <Text
                style={{
                  fontFamily: fontFamily?.medium,
                  fontSize: textScale(14),
                }}>
                {'Discount per order'}
              </Text>
              <Text style={styles.promoTxt}>10 (Fixed)</Text>
            </View>

            <View
              style={{
                paddingLeft: moderateScale(20),
              }}>
              <Text style={styles.tableTitleTxt}>
                {strings.INFLUENCER_ORDER_HISTORY}
              </Text>
              <ScrollView horizontal>
                <Table
                  borderStyle={{
                    borderWidth: 2,
                    borderColor: colors.borderColorB,
                  }}>
                  <Row
                    data={tableHead}
                    style={styles.head}
                    textStyle={styles.text}
                    widthArr={widthArr}
                  />
                  <Rows
                    data={tableData}
                    textStyle={styles.text}
                    widthArr={widthArr}
                  />
                </Table>
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={
        isDarkMode ? MyDarkTheme.colors.background : colors.backgroundGrey
      }
      isLoading={isLoading}>
      {!isInfluencerCategoryForm ? (
        <KeyboardAwareScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }>
          <Header
            centerTitle={strings.REFER_AND_EARN}
            leftIcon={imagePath.icBackb}
          />
          {isEmpty(influencerRegistredUsers) ? (
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps={'handled'}
              contentContainerStyle={{
                flexGrow: 1,
                marginHorizontal: moderateScale(10),
              }}>
              <Text style={{
                ...styles.selectCategoryTxt, color: isDarkMode
                  ? MyDarkTheme.colors.text
                  : colors.textGreyJ,
              }}>
                {strings.SELECT_INFLUENCER_CATEGORY}
              </Text>
              <FlatList
                data={availableInfluencerTypes}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                ItemSeparatorComponent={() => (
                  <View style={{ height: moderateScaleVertical(12) }} />
                )}
                ListEmptyComponent={() =>
                  !isLoading && (
                    <View>
                      <Image
                        source={imagePath.noDataFound}
                        style={styles.noDataFoundImg}
                      />
                      <Text style={{
                        ...styles.noDataFoundTxt, color: isDarkMode
                          ? MyDarkTheme.colors.text
                          : colors.textGreyJ,
                      }}>
                        {strings.NODATAFOUND}
                      </Text>
                    </View>
                  )
                }
              />
            </KeyboardAwareScrollView>
          ) : (
            <InfluncerHistoryView />
          )}
        </KeyboardAwareScrollView>
      ) : (
        <>{influencerForm()}</>
      )}
      <GallaryCameraImgPicker
        isVisible={isImagePickerModal}
        onCamera={() => cameraHandle(0)}
        onGallary={() => cameraHandle(1)}
        // isVisbleCamera={!is360ImgPicker}
        onCancel={() => setIsImagePickerModal(false)}
        onClose={() => setIsImagePickerModal(false)}
      />
    </WrapperContainer>
  );
}

const stylesFunc = ({ fontFamily, themeColors,isDarkMode }) => {
  const styles = StyleSheet.create({
    head: { height: 40, backgroundColor: '#f1f8ff' },
    text: { margin: 6, textAlign: 'center' },
    attributeTitle: {
      fontFamily: fontFamily?.regular,
      fontSize: textScale(14),
      color: colors.black,
    },
    textInput: {
      backgroundColor: colors.blackOpacity05,
      height: moderateScaleVertical(40),
      marginTop: moderateScaleVertical(5),
      borderRadius: moderateScale(5),
      paddingHorizontal: moderateScale(5),
    },
    multiSelect: {
      height: moderateScaleVertical(40),
      backgroundColor: colors.blackOpacity05,
      borderRadius: moderateScale(5),
    },
    multiSelectPlaceholder: {
      color: colors.black,
      paddingHorizontal: moderateScale(5),
      fontSize: textScale(12),
      fontFamily: fontFamily.regular,
    },
    radioBtn: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: moderateScaleVertical(5),
    },
    checkBox: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: moderateScaleVertical(5),
    },
    submitBtn: {
      marginBottom: moderateScaleVertical(20),
      backgroundColor: themeColors.primary_color,
      borderWidth: 0,
    },
    noDataFoundImg: {
      marginTop: height / 6,
      height: moderateScaleVertical(200),
      width: moderateScale(200),
      alignSelf: 'center',
    },
    noDataFoundTxt: {
      fontFamily: fontFamily.bold,
      fontSize: textScale(17),
      textAlign: 'center',
      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
    },
    selectCategoryTxt: {
      marginVertical: moderateScaleVertical(14),
      fontFamily: fontFamily?.bold,
      fontSize: textScale(16),
    },
    radioBtnTouch: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: moderateScale(20),
    },
    radioBtnTitle: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(12),
      marginLeft: moderateScale(6),
    },
    categoryTitle: {
      height: moderateScaleVertical(40),
      backgroundColor: colors.borderColorB,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(8),
      flex: 0.48,
    },
    leftRightTxt: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: moderateScale(20),
      marginTop: moderateScaleVertical(10),
    },
    promoBtnTouch: {
      padding: 6,
      borderRadius: moderateScale(4),
      borderWidth: 1,
      borderColor: colors.blackB,
      borderStyle: 'dashed',
      flexDirection: 'row',
      alignItems: 'center',
    },
    promoTxt: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      marginRight: moderateScale(4),
    },
    tableTitleTxt: {
      fontFamily: fontFamily?.medium,
      fontSize: textScale(14),
      marginBottom: moderateScaleVertical(10),
      marginTop: moderateScaleVertical(14),
    },
    formSectionTitle: {
      fontFamily: fontFamily?.bold,
      fontSize: textScale(14),
      color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
      textAlign: 'center',
    },
  });
  return styles;
};
