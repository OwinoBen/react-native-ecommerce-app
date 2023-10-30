import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useDarkMode } from 'react-native-dynamic';
import { Dropdown } from 'react-native-element-dropdown';
import 'react-native-get-random-values';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import AddressBottomSheet from '../../../Components/AddressBottomSheet';
import BorderTextInput from '../../../Components/BorderTextInput';
import ButtonComponent from '../../../Components/ButtonComponent';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import GallaryCameraImgPicker from '../../../Components/GallaryCameraImgPicker';
import GradientButton from '../../../Components/GradientButton';
import OoryksHeader from '../../../Components/OoryksHeader';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import { hitSlopProp } from '../../../styles/commonStyles';
import {
  StatusBarHeight,
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import { MyDarkTheme } from '../../../styles/theme';
import {
  cameraHandler,
  checkValueExistInAry,
} from '../../../utils/commonFunction';
import { showError } from '../../../utils/helperFunctions';
import { androidCameraPermission } from '../../../utils/permissions';
import validations from '../../../utils/validations';

const theme = {
  // Define your custom colors here
  selectedDayBackgroundColor: colors.black,
  selectedDayTextColor: colors.white,
};

const P2pOndemandAttributeInformation = ({ route, navigation }) => {
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
  } = useSelector(state => state?.initBoot);
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ fontFamily, themeColors });
  const [attributeInfo, setAttributeInfo] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingAttributes, setLoadingAttributes] = useState(false);
  const [isLoadingSubmitAttributes, setLoadingSubmitAttributes] =
    useState(false);
  const [productImgs, setProductImgs] = useState([]);
  const [product360Imgs, setProduct360Imgs] = useState([]);
  const [isImagePickerModal, setImagePickerModal] = useState(false);
  const [is360ImgPicker, set360ImgPicker] = useState(false);
  const [isProductAddedModal, setIsProductAddedModal] = useState(false);
  const [price, setPrice] = useState('');
  // const [emirateId, setEmirateId] = useState('')
  const [productLocation, setProductLocation] = useState({})
  const [weeklyPrice, setWeeklyPrice] = useState('')
  const [monthlyPrice, setMonthlyPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [rentalDays, setRentalDays] = useState('')
  const [isCalendarModal, setIsCalendarModal] = useState(false)


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
  const [selectedDates, setSelectedDates] = useState([]);
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
      productImg: productImgs,
      productName: name,
      productDetail: description,
      // emirateId: emirateId,
      productLocation: productLocation,
      price: price,
      // originalPrice: originalPrice,
      // markedDates: getMarkedDates()

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
    let markedDates = getMarkedDates()
    if (isEmpty(markedDates) && paramData?.type_id == 10) {
      showError(strings.PLEASE_SELECT_PRODUCT_AVAILBILITY)
      return
    }
    setLoadingSubmitAttributes(true);
    let datesAry = []
    let formData = new FormData();
    for (const property in markedDates) {
      datesAry.push({
        "not_available": 0,
        "date_time": property
      })
    }

    paramData?.type_id == 10 && datesAry.forEach((obj, index) => {
      Object.keys(obj).forEach(key => {
        formData.append(`date_availability[${index}][${key}]`, obj[key]);
      });
    });

    formData.append('category_id', paramData?.category_id);
    formData.append('product_name', name);
    formData.append('body_html', description);
    formData.append('price', parseInt(price));
    formData.append('latitude', productLocation?.latitude);
    formData.append('longitude', productLocation?.longitude);
    formData.append('address', productLocation?.address);
    paramData?.type_id == 10 && formData.append('week_price', weeklyPrice);
    paramData?.type_id == 10 && formData.append('month_price', monthlyPrice);
    paramData?.type_id == 10 && formData.append('compare_at_price', originalPrice);
    paramData?.type_id == 10 && formData.append('minimum_duration', rentalDays);
    formData.append('delivery', isDelivery ? 1 : 0);

    productImgs.map(item => {
      formData.append('file[]', item);
    });

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
  const cameraHandle = async index => {
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
        .then(res => {
          if (res?.path) {
            let file = {
              id: uuidv4(),
              name: res?.path.substring(res?.path.lastIndexOf('/') + 1),
              type: res?.mime,
              uri: res?.path,
            };
            // if (isImagePickerModal) {
            setProductImgs([...productImgs, file]);
            setImagePickerModal(false);
            // } 
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
    setProductLocation(childData)
  };


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
  const handleDateSelect = (day) => {
    const selectedDate = day.dateString;
    const newSelectedDates = [...selectedDates];

    if (newSelectedDates.length === 0) {
      newSelectedDates.push(selectedDate);
    } else if (newSelectedDates.length === 1) {
      const firstDate = newSelectedDates[0];
      const currentDate = new Date(selectedDate);
      const firstDateObj = new Date(firstDate);

      if (currentDate < firstDateObj) {
        newSelectedDates.unshift(selectedDate);
      } else {
        newSelectedDates.push(selectedDate);
      }
    } else {
      newSelectedDates.length = 0;
      newSelectedDates.push(selectedDate);
    }

    setSelectedDates(newSelectedDates);
  };



  const getMarkedDates = () => {
    const markedDates = {};

    selectedDates.forEach((date) => {
      markedDates[date] = { selected: true, };
    });

    if (selectedDates.length === 2) {
      const startDate = new Date(selectedDates[0]);
      const endDate = new Date(selectedDates[1]);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const date = currentDate.toISOString().split('T')[0];
        if (!markedDates[date]) {
          markedDates[date] = { selected: true, };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return markedDates;
  };

  const getDates = () => {
    let obj = getMarkedDates()

    const keys = Object.keys(obj);
    const firstItemKey = keys[0];
    const lastItemKey = keys[keys.length - 1];


    return `${moment(firstItemKey).format("DD MMMM YYYY")} - ${moment(lastItemKey).format("DD MMMM YYYY")}`
  }

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
            <Dropdown
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
    <WrapperContainer bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white} statusBarColor={colors.white} isLoading={isLoadingSubmitAttributes}>
      <View
        style={{
          flex: 1,

        }}>
        <OoryksHeader
          leftIcon={imagePath.ic_backarrow}
          leftTitle={strings.ADD_AN_ITEM_FOR_RENT}

        />

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}>

          <View
            style={{
              paddingHorizontal: moderateScale(16),
              backgroundColor: isDarkMode ? MyDarkTheme.colors.background : colors.white
            }}>
            <View
              style={styles.imgContainer}>
              {!isEmpty(productImgs) &&
                productImgs.map((itm, indx) => (
                  <View key={String(itm?.id)}>
                    <Image
                      style={styles.productImgs}
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

            </View>
            <TouchableOpacity
              onPress={() => setImagePickerModal(true)}
              activeOpacity={0.7}
              style={{ marginBottom: moderateScaleVertical(16), alignItems: 'center', height: moderateScaleVertical(150), justifyContent: "center", borderWidth: 1, borderColor: colors.borderColorNew, backgroundColor: isDarkMode ? MyDarkTheme.colors.text : colors.white, borderRadius: moderateScale(8) }}>
              <Image source={imagePath.ic_camPicker} />
              <Text
                style={styles.uploadImgTxt}>
                {strings.UPLOAD_IMAGE}
              </Text>
            </TouchableOpacity>
            <BorderTextInput
              onChangeText={text => setName(text)}
              placeholder={strings.ITEM_NAME}
              value={name}
              containerStyle={styles.containerStyle}
              textInputStyle={styles.txtInputStyle}
            />
            <BorderTextInput
              onChangeText={text => setDescription(text)}
              placeholder={strings.DESCRIPTION}
              value={description}
              multiLine={true}
              containerStyle={{ ...styles.containerStyle, height: moderateScaleVertical(118) }}
              textInputStyle={styles.txtInputStyle}
            />

            {paramData?.type_id !== 10 && <BorderTextInput
              value={price}
              keyboardType={"number-pad"}
              onChangeText={(text) => {
                setPrice(text)

              }}
              placeholder={`${currencies?.primary_currency?.symbol} ${strings.PRICE}`}
              containerStyle={styles.containerStyle}
              textInputStyle={styles.txtInputStyle}

            />}
            <TouchableOpacity
              onPress={() => {
                updateState({
                  isVisible: true
                })
              }}
              style={{ ...styles.addLocationBtn, backgroundColor: colors.white }}>
              <Text numberOfLines={1} style={{
                flex: 1,
                ...styles.titleTxt,
                color: !isEmpty(productLocation) ? colors.black : colors.blackOpacity30
              }}>{!isEmpty(productLocation) ? productLocation?.address : strings.LOCATION_AVAILABLITY}</Text>
              <TouchableOpacity onPress={() => setProductLocation({})}>
                <Image style={{
                  height: 15, width: 15
                }} resizeMode="contain" source={imagePath.closeButton} />
              </TouchableOpacity>
            </TouchableOpacity>

            {paramData?.type_id == 10 ? <View>
              <Text
                style={{
                  marginLeft: moderateScale(1),
                  fontSize: textScale(14),
                  fontFamily: fontFamily?.medium,
                  marginTop: moderateScaleVertical(16)
                }}>
                {strings.PRICING_DETAILS_FOR} :
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: moderateScaleVertical(14),
                }}>
                <BorderTextInput
                  value={price}
                  keyboardType={"number-pad"}
                  onChangeText={(text) => {
                    setPrice(text)
                    let weekPrice = ((Number(text) * 4) / 7).toFixed(0)
                    let monthPrice = ((Number(text) * 4 * 3) / 30).toFixed(0)
                    setWeeklyPrice(text == "" ? "" : String(weekPrice))
                    setMonthlyPrice(text == "" ? "" : String(monthPrice))
                  }}
                  placeholder={`${currencies?.primary_currency?.symbol} ${strings.DOLLAR_DAY}`}
                  containerStyle={{ ...styles.containerStyle, width: moderateScale(100), }}
                  textInputStyle={styles.txtInputStyle}
                />
                <BorderTextInput
                  // onChangeText={(text) => setWeeklyPrice(text)}

                  value={weeklyPrice}
                  editable={false}
                  keyboardType={"number-pad"}
                  placeholder={`${currencies?.primary_currency?.symbol} ${strings.DOLLAR_WEEK}`}
                  containerStyle={{ ...styles.containerStyle, width: moderateScale(100), }}
                  textInputStyle={styles.txtInputStyle}
                />
                <BorderTextInput
                  // onChangeText={(text) => setMonthlyPrice(text)}
                  value={monthlyPrice}
                  editable={false}
                  keyboardType={"number-pad"}
                  placeholder={`${currencies?.primary_currency?.symbol} ${strings.DOLLAR_MONTH}`}
                  containerStyle={{ ...styles.containerStyle, width: moderateScale(100), }}
                  textInputStyle={styles.txtInputStyle}
                />
              </View>
              <BorderTextInput
                onChangeText={(text) => setOriginalPrice(text)}
                value={originalPrice}
                keyboardType={"number-pad"}
                placeholder={strings.ORIGINAL_PRICE_OF_ITEM}
                containerStyle={styles.containerStyle}
                textInputStyle={styles.txtInputStyle}
              />
              <BorderTextInput
                onChangeText={(text) => setRentalDays(text)}
                value={rentalDays}
                keyboardType={"number-pad"}
                placeholder={strings.MINIMAL_RENTAL_DAYS}
                rightIcon={imagePath.ic_down_arrow}
                containerStyle={styles.containerStyle}
                textInputStyle={styles.txtInputStyle}
              />


              <ButtonComponent
                onPress={() => setIsCalendarModal(true)}
                containerStyle={styles.availablityBtn}
                textStyle={{
                  color: colors.black,
                }}
                marginBottom={0}
                btnText={isEmpty(selectedDates) ? "Choose Availablity" : getDates()}
              />
            </View> : <View />}
            {/* <ButtonComponent
              onPress={onSubmitAttributes}
              containerStyle={{ ...styles.submitBtn, backgroundColor: isDarkMode ? themeColors?.primary_color : colors.black }}
              btnText={strings.CONFIRM_AND_CONTINUE}
            /> */}
            <View style={{
              height: moderateScaleVertical(16)
            }} />
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



        </KeyboardAwareScrollView>


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
              navigation.goBack();
            }}
            containerStyle={{ width: '50%', marginTop: moderateScaleVertical(5) }}
            colorsArray={['#FC7049', '#FD312C']}
          />
        </View>
      </Modal>


      {isVisible ? <AddressBottomSheet
        navigation={navigation}
        updateData={updateData}
        indicator={indicator}
        type={type}
        passLocation={data => addUpdateLocation(data)}
        openCloseMapAddress={openCloseMapAddress}
        selectViaMap={selectViaMap}
        onCloseSheet={onModalClose}
      />
        : null
      }
      <Modal isVisible={isCalendarModal} style={{
        margin: 0
      }}>
        <View style={{ backgroundColor: colors.white, flex: 1, paddingTop: Platform.OS == "ios" ? StatusBarHeight : 0 }}>
          <OoryksHeader
            leftTitle={"Calendar"}
            onPressLeft={() => setIsCalendarModal(false)}
            isCustomLeftPress
            titleStyle={{
              color: colors.black
            }}
          />
          <View>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={getMarkedDates()}
              theme={theme}
              minDate={new Date()}
            />
          </View>


          <ButtonComponent
            onPress={() => {
              if (isEmpty(selectedDates)) {
                alert("Please select a date range")
              }
              else {
                setIsCalendarModal(false)
              }
            }}
            containerStyle={{ ...styles.submitBtn, marginTop: moderateScaleVertical(100), marginHorizontal: moderateScale(16) }}
            btnText={strings.DONE}
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default P2pOndemandAttributeInformation;

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
      paddingHorizontal: moderateScale(20)
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
    },

    containerStyle: {
      borderWidth: 1,
      borderColor: colors.profileInputborder,
      borderRadius: 4,
      backgroundColor: colors.white,
      height: moderateScaleVertical(48),
      alignSelf: 'center',
    },
    txtInputStyle: {
      fontFamily: fontFamily.regular,
      fontSize: textScale(14),
      paddingHorizontal: 18,
      color: colors.black,
    },
    productImgs: {
      height: moderateScale(100),
      width: moderateScale(100),
      marginRight: moderateScale(10),
      marginBottom: moderateScaleVertical(10)
    },
    postAddedContainer: {
      backgroundColor: colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: moderateScale(15),
      marginHorizontal: moderateScale(30),
      paddingVertical: moderateScaleVertical(50),
    },
    postAddedTxt: {

      fontFamily: fontFamily.medium,
      fontSize: textScale(19),
      maxWidth: '70%',
      textAlign: 'center',
      marginVertical: moderateScale(18),
      lineHeight: moderateScaleVertical(30),
    },
    imgContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: moderateScaleVertical(16),
      flexWrap: 'wrap',
    },
    uploadImgTxt: {
      opacity: 0.3,
      color: colors.black,
      fontFamily: fontFamily.medium,
      fontSize: textScale(12),
      marginTop: moderateScaleVertical(10),
    },
    availablityBtn: {
      borderWidth: 1,
      height: moderateScaleVertical(48),
      width: moderateScale(350),
      alignSelf: 'center',
      borderRadius: 8,
      // marginBottom: moderateScaleVertical(60),
      backgroundColor: colors.white
    }
  });
  return styles;
}
