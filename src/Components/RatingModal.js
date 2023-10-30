import {cloneDeep} from 'lodash';
import React, {useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import {useDarkMode} from 'react-native-dynamic';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating';
import {useSelector} from 'react-redux';
import GradientButton from '../Components/GradientButton';
import imagePath from '../constants/imagePath';
import strings from '../constants/lang';
import actions from '../redux/actions';
import colors from '../styles/colors';
import fontFamily from '../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../styles/responsiveSize';
import {cameraHandler} from '../utils/commonFunction';
import {showError, showSuccess} from '../utils/helperFunctions';
import Header from './Header';
import WrapperContainer from './WrapperContainer';

const RatingModal = ({
  productDetail = null,
  modalClose = () => {},
  onSuccessRating = () => {},
  isDriverRateModal = false,
  productData = {},
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const {themeToggle, appStyle, themeColors, appData, currencies, languages} =
    useSelector((state) => state?.initBoot);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : theme;

  const [state, setState] = useState({
    isLoading: false,
    rating:
      (!!productDetail?.product_rating &&
        Number(productDetail?.product_rating?.rating)) ||
      0,
    reviewText: '',
    imageArray: [],
    remove_image_ids: [],
    isRefreshing: false,
  });
  const {
    isLoading,
    rating,
    imageArray,
    reviewText,
    remove_image_ids,
    isRefreshing,
  } = state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({...state, ...data}));

  //this function use for open actionsheet
  let actionSheet = useRef();
  const showActionSheet = () => {
    {
      !!userData?.auth_token
        ? imageArray.length == 5
          ? showError(strings.MAXIMUM_PHOTO_SELECTION_LIMIT_REACHED)
          : actionSheet.current.show()
        : null;
    }
  };

  // this funtion use for camera handle
  const cameraHandle = (index) => {
    if (index == 0 || index == 1) {
      cameraHandler(index, {
        width: 300,
        height: 400,
        cropping: false,
        cropperCircleOverlay: false,
        compressImageQuality: 0.5,
        mediaType: 'photo',
      })
        .then((res) => {
          if (res && (res?.sourceURL || res?.path)) {
            let file = {
              image_id: Math.random(),
              name: res?.filename,
              type: res?.mime,
              uri: res?.sourceURL || res?.path,
            };
            let find = imageArray.find((x) => x?.name == res?.filename);
            if (find) {
              showError(strings.IMAGE_ALREADY_UPLOADED);
            } else {
              updateState({imageArray: [...imageArray, file]});
            }
          }
        })
        .catch((err) => {});
    }
  };

  /***********Remove Image from rating */
  const _removeImageFromList = (selectdImage) => {
    if (selectdImage?.id) {
      let copyArrayImages = cloneDeep(imageArray);

      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id,
      );
      updateState({
        imageArray: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(imageArray);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id,
      );
      updateState({
        imageArray: copyArrayImages,
      });
    }
  };

  const onStarRatingPress = (rating) => {
    updateState({rating: rating});
  };

  const _giveRatingToProduct = () => {
    updateState({isLoading: true});
    if (isDriverRateModal) {
      const data = {
        order_id: productData?.id,
        rating: rating,
        review: reviewText,
      };

      console.log(data, 'dataaaaa');
      actions
        .ratingToDriver(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        })
        .then((res) => {
          updateState({isLoading: false});
          console.log('res++++++', res);
          showSuccess(res?.message);
          modalClose();
          onSuccessRating();
        })
        .catch(errorMethod);
      return;
    }

    let formdata = new FormData();
    formdata.append('order_vendor_product_id', productDetail?.id);
    formdata.append('order_id', productDetail?.order_id);
    formdata.append('product_id', productDetail?.product_id);
    formdata.append('rating', rating);
    formdata.append('review', reviewText);
    if (imageArray.length) {
      imageArray.forEach((element) => {
        if (element?.id) {
        } else {
          formdata.append('file[]', {
            name: element.name,
            type: element.type,
            uri: element.uri,
          });
        }
      });
    }
    if (remove_image_ids.length) {
      remove_image_ids.forEach((element) => {
        formdata.append('remove_files[]', element);
      });
    }
    console.log('sending data', formdata);
    actions
      .giveRating(formdata, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        'Content-Type': 'multipart/form-data',
      })
      .then((res) => {
        updateState({isLoading: false});
        console.log('res++++++', res);
        showSuccess(res?.message);
        modalClose();
        onSuccessRating();
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    updateState({isLoading: false});
    console.log('error raised', error);
    showError(error?.message || error?.error);
  };

  return (
    <Modal isVisible={true} style={{margin: 0}} animationInTiming={600}>
      <View
        style={{
          backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,
          padding: moderateScale(12),
          borderTopRightRadius: moderateScale(8),
          borderTopLeftRadius: moderateScale(8),
          flex: 1,
        }}>
        <WrapperContainer
          bgColor={colors.backgroundGrey}
          statusBarColor={colors.white}
          // source={loaderOne}
          // isLoadingB={isLoading}
        >
          <Header
            leftIcon={
              appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
                ? imagePath.icBackb
                : imagePath.back
            }
            centerTitle={isDriverRateModal ? 'Rate Driver' : strings.RATEORDER}
            headerStyle={{backgroundColor: colors.white}}
            onPressLeft={modalClose}
          />

          <View
            style={{
              height: 1,
              backgroundColor: colors.lightGreyBgColor,
              opacity: 0.26,
            }}
          />
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                marginHorizontal: moderateScale(20),
                marginTop: moderateScaleVertical(20),
                marginBottom: moderateScaleVertical(20),
              }}>
              <View
                style={{
                  marginVertical: moderateScale(18),
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontFamily: fontFamily.bold,
                    fontSize: moderateScale(26),
                  }}>
                  {strings.ORDER_COMPLETED}
                </Text>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontFamily: fontFamily.medium,
                    fontSize: moderateScale(14),
                  }}>
                  {'Rate your order and your driver'}
                </Text>
              </View>
              {/* star View */}
              <View style={styles.starViewStyle}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={rating}
                  selectedStar={(rating) => onStarRatingPress(rating)}
                  fullStarColor={colors.ORANGE}
                  starSize={40}
                />
              </View>

              {/* Upload image */}
              <View style={{marginTop: moderateScaleVertical(20)}}>
                {!isDriverRateModal && (
                  <>
                    <Text style={styles.uploadImage}>
                      {strings.UPLOAD_IMAGE}
                    </Text>
                    <View
                      style={{
                        marginTop: moderateScaleVertical(10),
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}>
                      <View
                        style={{
                          marginRight: 5,
                          marginBottom: moderateScaleVertical(10),
                        }}>
                        <TouchableOpacity
                          onPress={showActionSheet}
                          style={[
                            styles.viewOverImage2,
                            {borderStyle: 'dashed'},
                          ]}>
                          <Image
                            source={imagePath.icCamIcon}
                            style={{tintColor: colors.themeColor}}
                          />
                        </TouchableOpacity>
                      </View>

                      {imageArray && imageArray.length
                        ? imageArray.map((i, inx) => {
                            return (
                              <ImageBackground
                                source={{
                                  uri: i.uri,
                                }}
                                style={styles.imageOrderStyle}
                                imageStyle={styles.imageOrderStyle}>
                                <View style={styles.viewOverImage}>
                                  <View
                                    style={{
                                      position: 'absolute',
                                      top: -10,
                                      right: -10,
                                    }}>
                                    <TouchableOpacity
                                      onPress={() => _removeImageFromList(i)}>
                                      <Image source={imagePath.icRemoveIcon} />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </ImageBackground>
                            );
                          })
                        : null}
                    </View>
                  </>
                )}

                {/* Message Container    */}
                <View style={{marginTop: moderateScaleVertical(20)}}>
                  <Text style={styles.uploadImage}>{strings.REVIEW}</Text>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={styles.textInputStyle}
                      multiline={true}
                      value={reviewText}
                      onChangeText={(text) => updateState({reviewText: text})}
                    />
                  </View>
                </View>

                <View style={{marginTop: moderateScaleVertical(20)}}>
                  <GradientButton
                    colorsArray={[
                      themeColors.primary_color,
                      themeColors.primary_color,
                    ]}
                    textStyle={styles.textStyle}
                    onPress={_giveRatingToProduct}
                    btnText={strings.SUBMIT}
                    indicatorColor={colors.white}
                    indicator={isLoading}
                  />
                </View>
              </View>
            </View>
            <ActionSheet
              ref={actionSheet}
              // title={'Choose one option'}
              options={[strings.CAMERA, strings.GALLERY, strings.CANCEL]}
              cancelButtonIndex={2}
              destructiveButtonIndex={2}
              onPress={(index) => cameraHandle(index)}
            />
          </KeyboardAwareScrollView>
        </WrapperContainer>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingVertical: 0,
    height: moderateScaleVertical(58),
    alignItems: 'center',
    borderBottomColor: colors.lightGreyBorder,
    borderBottomWidth: 0.7,
  },
  starViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadImage: {
    fontSize: textScale(12),
    fontFamily: fontFamily.bold,
    color: colors.textGreyD,
  },
  imageOrderStyle: {
    height: width / 5,
    width: width / 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: moderateScaleVertical(10),
  },
  viewOverImage: {
    height: width / 5,
    width: width / 5,
    borderRadius: 5,

    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  viewOverImage2: {
    borderWidth: 1,
    height: width / 5,
    width: width / 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,0.2)',
  },
  textInputContainer: {
    marginTop: moderateScaleVertical(10),
    borderRadius: 5,
    borderWidth: 1,
    height: width / 2,
    borderColor: colors.textGreyLight,
  },
  textInputStyle: {
    height: width / 2,
    padding: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  textStyle: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: textScale(14),
    // opacity: 0.6,
  },
});

//make this component available to the app
export default React.memo(RatingModal);
