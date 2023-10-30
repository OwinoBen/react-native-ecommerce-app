import { cloneDeep, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { MultiSelect } from 'react-native-element-dropdown';
import 'react-native-get-random-values';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import AddressBottomSheet from '../../../Components/AddressBottomSheet';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import GallaryCameraImgPicker from '../../../Components/GallaryCameraImgPicker';
import GradientButton from '../../../Components/GradientButton';
import Header from '../../../Components/Header';
import HeaderLoader from '../../../Components/Loaders/HeaderLoader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import { hitSlopProp } from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {
  cameraHandler,
  checkValueExistInAry,
} from '../../../utils/commonFunction';
import { showError } from '../../../utils/helperFunctions';
import { androidCameraPermission } from '../../../utils/permissions';
import validations from '../../../utils/validations';
import ToggleSwitch from 'toggle-switch-react-native';

const AttributeInformation = ({ route, navigation }) => {
  let paramData = route?.params;
  console.log(paramData, '<===paramData');
  const darkthemeusingDevice = useDarkMode();

  const {
    appData,
    currencies,
    languages,
    appStyle,
    themeColors,
    themeColor,
    themeToggle,
  } = useSelector((state) => state?.initBoot);
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors });
  const [attributeInfo, setAttributeInfo] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingAttributes, setLoadingAttributes] = useState(true);
  const [isLoadingSubmitAttributes, setLoadingSubmitAttributes] =
    useState(false);
  const [productImgs, setProductImgs] = useState([]);
  const [product360Imgs, setProduct360Imgs] = useState([]);
  const [isImagePickerModal, setImagePickerModal] = useState(false);
  const [is360ImgPicker, set360ImgPicker] = useState(false);
  const [isProductAddedModal, setIsProductAddedModal] = useState(false);
  const [price, setPrice] = useState('');
  const [state, setState] = useState({
    updateData: {},
    indicator: false,
    type: '',
    selectViaMap: false,
    isVisible: false,
    selectedId: '',
    isDelivery: false
  })
  const [selectedLocationAtt, setSelectedLocationAtt] = useState({})

  const { updateData, indicator, type, selectViaMap, isVisible, isDelivery } = state;
  const updateState = data => setState(state => ({ ...state, ...data }));


  useEffect(() => {
    getListOfAvailableAttributes();
  }, []);

  const getListOfAvailableAttributes = () => {
    actions
      .getAvailableAttributes(
        `?category_id=${paramData?.category_id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        },
      )
      .then((res) => {
        console.log(res, '<===res getAvailableAttributes');
        setLoadingAttributes(false);
        setAttributeInfo(res?.data || []);
      })
      .catch(errorMethod);
  };

  const isValidData = () => {
    const error = validations({
      productName: name,
      productDetail: description,
      price: price,
    });
    if (error) {
      showError(error);
      return;
    }
    return true;
  };

  const onSubmitAttributes = () => {
    const checkValid = isValidData();
    if (!checkValid) {
      return;
    }
    setLoadingSubmitAttributes(true);
    let formData = new FormData();
    formData.append('category_id', paramData?.category_id);
    formData.append('product_name', name);
    formData.append('body_html', description);
    formData.append('price', price);
    formData.append('delivery', isDelivery ? 1 : 0);
    productImgs.map((item) => {
      formData.append('file[]', item);
    });
    product360Imgs.map((item) => {
      formData.append('file_360[]', item);
    });
    let apiObj = {};
    attributeInfo.map((item, index) => {
      let optionData = [];
      item?.option?.map((itm, inx) => {
        optionData[inx] = {
          option_id: itm?.id,
          option_title: itm?.title,
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
        if (item?.type == 6) {
          apiObj[item?.id].latitude = item?.values?.latitude;
          apiObj[item?.id].longitude = item?.values?.longitude;
          apiObj[item?.id].address = item?.values?.value;
        }
      }
    });

    console.log(apiObj, "apiObj>>>>>>>apiObj")
    formData.append('attribute', JSON.stringify(apiObj));
    console.log(formData, '<===formData onSubmitAttributes');
    actions
      .submitProductWithAttributes(formData, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        'Content-Type': 'multipart/form-data',
      })
      .then((res) => {
        setLoadingSubmitAttributes(false);
        console.log(res, '<===response onSubmitAttributes');
        setIsProductAddedModal(true);
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    setLoadingAttributes(false);
    setLoadingSubmitAttributes(false);

    showError(error?.message || error?.error);
  };

  const onChangeDropDownOption = (value, item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = value;
    setAttributeInfo(attributeInfoData);
  };

  const onPressRadioButton = (item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.attribute_id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [item?.id];
    setAttributeInfo(attributeInfoData);
  };

  const onChangeText = (text, item) => {
    const attributeInfoData = [...attributeInfo];
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == item?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = [text];
    setAttributeInfo(attributeInfoData);
  };


  const onPressCheckBoxes = (value, data) => {
    const attributeInfoData = [...attributeInfo];
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
    setAttributeInfo(attributeInfoData);
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
          if (res?.path) {
            let file = {
              id: uuidv4(),
              name: res?.path.substring(res?.path.lastIndexOf('/') + 1),
              type: res?.mime,
              uri: res?.path,
            };
            if (isImagePickerModal) {
              setProductImgs([...productImgs, file]);
              setImagePickerModal(false);
            } else {
              if (res?.height >= 4096 && res?.width >= 2048) {
                setProduct360Imgs([...product360Imgs, file]);
                set360ImgPicker(false);
              } else {
                showError(
                  'Please upload atleast 4096x2048 size image for 360° media',
                );
                return;
              }
            }
          } else {
            closeMediaPicker();
          }
        })
        .catch(closeMediaPicker);
    }
  };

  const closeMediaPicker = () => {
    set360ImgPicker(false);
    setImagePickerModal(false);
  };

  const removeProductImg = (item, type) => {
    if (type == 1) {
      const productImgsData = [...productImgs];
      let itmIndx = productImgsData.findIndex((itm) => itm?.id == item?.uri);
      productImgsData.splice(itmIndx, 1);
      setProductImgs(productImgsData);
    } else {
      const product360ImgsData = [...product360Imgs];
      let itmIndx = product360ImgsData.findIndex((itm) => itm?.id == item?.uri);
      product360ImgsData.splice(itmIndx, 1);
      setProduct360Imgs(product360ImgsData);
    }
  };

  const onClearLocationField = () => {
    const attributeInfoData = cloneDeep(attributeInfo)
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == selectedLocationAtt?.id,
    );
    delete attributeInfoData[indexOfAttributeToUpdate].values
    setAttributeInfo(attributeInfoData);
  }


  const addUpdateLocation = childData => {
    updateState({
      selectViaMap: false,
      isVisible: false,
    });
    const attributeInfoData = cloneDeep(attributeInfo)
    let indexOfAttributeToUpdate = attributeInfoData.findIndex(
      (itm) => itm?.id == selectedLocationAtt?.id,
    );
    attributeInfoData[indexOfAttributeToUpdate].values = {
      latitude: childData?.latitude,
      longitude: childData?.longitude,
      value: childData?.address
    };
    setAttributeInfo(attributeInfoData);
  };

  console.log(attributeInfo, "attributeInfo>>>>")

  const openCloseMapAddress = type => {
    updateState({ selectViaMap: type == 1 ? true : false });
  };

  const onModalClose = () => {
    setModalVisible(false);
    updateState({ selectViaMap: false });
  };


  const setModalVisible = (visible = false, type = '', id = '', data = {}) => {
    updateState({
      updateData: data,
      isVisible: visible,
      type: type,
      selectedId: id,
    });
  };

  const renderRadioBtns = useCallback(
    (item, data, index) => {
      return (
        <TouchableOpacity
          key={String(index)}
          onPress={() => onPressRadioButton(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: moderateScale(20),
          }}>
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
          <Text
            style={styles.titleTxt}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [attributeInfo],
  );

  const renderCheckBoxes = useCallback(
    (item, data, index) => {
      return (
        <TouchableOpacity
          key={String(index)}
          onPress={() => onPressCheckBoxes(item, data)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: moderateScale(20),
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
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: textScale(12),
              marginLeft: moderateScale(6),
            }}>
            {item?.title}
          </Text>
        </TouchableOpacity>
      );
    },
    [attributeInfo],
  );

  const renderAttributeOptions = useCallback(
    ({ item, index }) => {
      return (
        <View>
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
          ) : item?.type == 6 ? <TouchableOpacity
            onPress={() => {
              updateState({
                isVisible: true
              })
              setSelectedLocationAtt(item)
            }}
            style={styles.addLocationBtn}>
            <Text numberOfLines={1} style={{
              flex: 1,
              ...styles.titleTxt
            }}>{!isEmpty(item?.values) ? item?.values?.value : "Add Location"}</Text>
            {!isEmpty(item?.values) && <TouchableOpacity onPress={onClearLocationField}><Image source={imagePath.closeButton} /></TouchableOpacity>}
          </TouchableOpacity> : (
            <View style={styles.checkBox}>
              {item?.option?.map((itm, index) =>
                renderCheckBoxes(itm, item, index),
              )}
            </View>
          )}
        </View>
      );
    },
    [attributeInfo],
  );


  const listFooterComponent = () => {
    return (
      <ButtonWithLoader
        btnText="Submit"
        btnStyle={styles.submitBtn}
        onPress={onSubmitAttributes}
        colorsArray={['#FF8D8A', '#FC7049', '#FD312C']}
        isLoading={isLoadingSubmitAttributes}
        btnTextStyle={{
          textTransform: 'none',
        }}
      />
    );
  };

  return (
    <WrapperContainer>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}>
        <Header
          centerTitle={paramData?.category_name}
          leftIcon={imagePath.icBackb}
        />
        {isLoadingAttributes ? (
          <View style={{ flex: 1 }}>
            {['', '', '', '', '', '', '', '', ''].map((itm, indx) => (
              <View
                key={String(indx)}
                style={{
                  marginTop: moderateScaleVertical(20),
                }}>
                <HeaderLoader
                  isRight={false}
                  widthLeft={moderateScale(100)}
                  rectWidthLeft={moderateScale(100)}
                  heightLeft={moderateScaleVertical(30)}
                  rectHeightLeft={moderateScaleVertical(30)}
                  rx={5}
                  ry={5}
                />
                <HeaderLoader
                  isRight={false}
                  widthLeft={width - moderateScale(30)}
                  rectWidthLeft={width - moderateScale(30)}
                  heightLeft={moderateScaleVertical(35)}
                  rectHeightLeft={moderateScaleVertical(35)}
                  rx={5}
                  ry={5}
                  viewStyles={{
                    marginTop: moderateScaleVertical(5),
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}>
            {!isEmpty(attributeInfo) ? (
              <View
                style={{
                  paddingHorizontal: moderateScale(20),
                }}>
                <Text
                  style={{
                    ...styles.attributeTitle,
                    marginTop: moderateScaleVertical(20),
                  }}>
                  Name
                </Text>
                <TextInput
                  placeholder="Enter name"
                  onChangeText={(text) => setName(text)}
                  style={styles.textInput}
                />

                <Text
                  style={{
                    ...styles.attributeTitle,
                    marginTop: moderateScaleVertical(20),
                  }}>
                  Description
                </Text>
                <TextInput
                  placeholder="Enter description"
                  onChangeText={(text) => setDescription(text)}
                  multiline
                  style={{
                    ...styles.textInput,
                    height: moderateScaleVertical(100),
                  }}
                />
                <Text
                  style={{
                    ...styles.attributeTitle,
                    marginTop: moderateScaleVertical(20),
                  }}>
                  Price
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: colors.blackOpacity05,
                    borderRadius: moderateScale(5),
                  }}>
                  <View
                    style={{
                      width: moderateScale(25),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text>{currencies?.primary_currency?.symbol || '$'}</Text>
                  </View>
                  <TextInput
                    placeholder="Enter price"
                    onChangeText={(text) => setPrice(text)}
                    keyboardType="number-pad"
                    style={{ ...styles.textInput, backgroundColor: colors.transparent }}
                  />
                </View>
                <Text
                  style={{
                    ...styles.attributeTitle,
                    marginTop: moderateScaleVertical(20),
                  }}>
                  Add Image
                </Text>

                <View
                  style={{
                    marginTop: moderateScaleVertical(10),
                    paddingLeft: moderateScale(10),
                  }}>
                  <Text
                    style={{
                      ...styles.attributeTitle,
                      fontFamily: fontFamily?.medium,
                    }}>
                    Photo
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: moderateScaleVertical(7),
                      flexWrap: 'wrap',
                    }}>
                    {!isEmpty(productImgs) &&
                      productImgs.map((itm, indx) => (
                        <View style={String(indx)}>
                          <Image
                            style={{
                              height: moderateScale(90),
                              width: moderateScale(90),
                              marginRight: moderateScale(10),
                            }}
                            source={{ uri: itm?.uri }}
                          />
                          <TouchableOpacity
                            hitSlop={hitSlopProp}
                            onPress={() => removeProductImg(itm, 1)}
                            style={{ position: 'absolute', right: 4, top: -2 }}>
                            <Image source={imagePath.icRemoveIcon} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    <TouchableOpacity
                      onPress={() => setImagePickerModal(true)}
                      activeOpacity={0.7}>
                      <Image
                        source={imagePath.icPhoto}
                        style={{
                          marginTop: moderateScaleVertical(5),
                          height: moderateScale(90),
                          width: moderateScale(90),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{ flexDirection: "row", alignContent: "center", marginVertical: moderateScale(15) }}>
                  <Text
                    style={{
                      // marginBottom: moderateScaleVertical(8),
                      fontFamily: fontFamily.medium,
                      paddingRight: moderateScale(4),
                      color: isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.textGreyOpcaity7,
                      ...styles.attributeTitle,
                    }}>
                    {strings.DELIVERY}
                  </Text>
                  <ToggleSwitch
                    isOn={isDelivery}
                    onColor={themeColors.primary_color}
                    offColor={
                      isDarkMode
                        ? MyDarkTheme.colors.text
                        : colors.borderLight
                    }
                    size="small"
                    onToggle={() => updateState({ isDelivery: !isDelivery })}
                  />
                </View>
                <View
                  style={{
                    marginTop: moderateScaleVertical(16),
                  }}>
                  <FlatList
                    data={attributeInfo}
                    keyboardShouldPersistTaps={'handled'}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => String(index)}
                    ItemSeparatorComponent={() => (
                      <View
                        style={{
                          height: moderateScaleVertical(18),
                        }}
                      />
                    )}
                    renderItem={renderAttributeOptions}
                    ListFooterComponent={listFooterComponent}
                  />
                  <View style={{ height: moderateScaleVertical(65) }} />
                </View>
              </View>
            ) : (
              <View
                style={{
                  marginTop: height / 3.5,
                  alignItems: 'center',
                }}>
                <Image source={imagePath.icEmptyCart} />
              </View>
            )}

          </KeyboardAwareScrollView>
        )}

      </View>
      <GallaryCameraImgPicker
        isVisible={isImagePickerModal || is360ImgPicker}
        onCamera={() => cameraHandle(0)}
        onGallary={() => cameraHandle(1)}
        // isVisbleCamera={!is360ImgPicker}
        onCancel={closeMediaPicker}
        onClose={closeMediaPicker}
      />

      <Modal isVisible={isProductAddedModal}>
        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: moderateScale(15),
            marginHorizontal: moderateScale(30),
            paddingVertical: moderateScaleVertical(50),
          }}>
          <Image source={imagePath.check3} />
          <Text
            style={{
              color: isDarkMode ? colors.white : colors.black,
              fontFamily: fontFamily.medium,
              fontSize: textScale(19),
              maxWidth: '70%',
              textAlign: 'center',
              marginVertical: moderateScale(18),
              lineHeight: moderateScaleVertical(30),
            }}>
            {strings.POST_UPLOADED_SUCCESS}
          </Text>
          <GradientButton
            btnText={'Ok'}
            onPress={() => {
              setIsProductAddedModal(false);
              // navigation.goBack();
            }}
            containerStyle={{ width: '50%', marginTop: moderateScaleVertical(5) }}
            colorsArray={['#FC7049', '#FD312C']}
          />
        </View>
      </Modal>

      {isVisible ? (
        <AddressBottomSheet
          navigation={navigation}
          updateData={updateData}
          indicator={indicator}
          type={type}
          passLocation={data => addUpdateLocation(data)}
          openCloseMapAddress={openCloseMapAddress}
          selectViaMap={selectViaMap}
          onCloseSheet={onModalClose}
        />
      ) : null}
    </WrapperContainer>
  );
};

export default AttributeInformation;

function stylesFunc({ fontFamily, themeColors }) {
  const styles = StyleSheet.create({
    header: {
      marginTop: moderateScale(32),
      marginBottom: moderateScale(20),
      fontSize: 19,
      fontFamily: fontFamily.medium,
    },
    categoryStyle: {
      flex: 1,
      backgroundColor: colors.blackOpacity05,
      borderRadius: moderateScale(12),
      marginHorizontal: moderateScale(10),
      height: height / 6,
      width: width / 2.5,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: moderateScale(10),
    },
    textStyle: {
      fontFamily: fontFamily.medium,
      letterSpacing: 0.3,
      maxWidth: 100,
      marginTop: moderateScale(8),
      textAlign: 'center',
    },
    modalStyle: {
      overflow: 'hidden',
      justifyContent: 'flex-end',
      marginHorizontal: 0,
      marginBottom: 0,
    },
    modalViewStyle: {
      flex: 0.5,
      backgroundColor: 'white',
      padding: moderateScale(16),
      // alignItems: 'center',
      borderTopRightRadius: moderateScale(24),
      borderTopLeftRadius: moderateScale(24),
    },
    txtStyle: {
      fontFamily: fontFamily.medium,
      fontSize: 16,
      letterSpacing: 0.3,
      textAlign: 'center',
      marginVertical: moderateScale(18),
    },
    linkStyle: {
      color: colors.orange1,
      fontFamily: fontFamily.regular,
      fontSize: 16,
      marginTop: moderateScale(12),
      textAlign: 'center',
    },
    labelText: {
      textAlign: 'left',
      marginVertical: moderateScale(12),
      fontFamily: fontFamily.regular,
    },
    linkButton: { flex: 1, justifyContent: 'flex-end', marginBottom: '5%' },
    labelStyle: {
      fontFamily: fontFamily.bold,
      color: colors.blackOpacity43,
      fontSize: textScale(12),
      marginBottom: moderateScale(10),
    },
    attributeTitle: {
      fontFamily: fontFamily.bold,
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
    addLocationBtn: {
      borderWidth: 1,
      borderColor: colors.borderColorB,
      borderRadius: moderateScale(8),
      paddingHorizontal: moderateScale(12),
      height: moderateScaleVertical(48),
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center"

    },
    titleTxt: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      marginLeft: moderateScale(6),
    }
  });
  return styles;
}
