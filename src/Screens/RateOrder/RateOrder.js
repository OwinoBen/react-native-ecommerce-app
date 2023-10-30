import { cloneDeep } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  View,
  RefreshControl,
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import StarRating from "react-native-star-rating";
import { useSelector } from "react-redux";
import GradientButton from "../../Components/GradientButton";
import Header from "../../Components/Header";
import { loaderOne } from "../../Components/Loaders/AnimatedLoaderFiles";
import WrapperContainer from "../../Components/WrapperContainer";
import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang/index";
import navigationStrings from "../../navigation/navigationStrings";
import actions from "../../redux/actions";
import colors from "../../styles/colors";
import commonStylesFun from "../../styles/commonStyles";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../styles/responsiveSize";
import { cameraHandler } from "../../utils/commonFunction";
import {
  getImageUrl,
  showError,
  showSuccess,
} from "../../utils/helperFunctions";
// import OrderCardComponent from './OrderCardComponent';
import stylesFunc from "./styles";

export default function RateOrder({ navigation, route }) {
  const trackingurl=route?.params?.trackingUrl || null
  const ratingData = route?.params?.item?.product_rating;
  const isDriverRateData = route?.params?.item;


  const [state, setState] = useState({
    isLoading: false,
    rating: 0,
    reviewText: "",
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

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const currentTheme = useSelector((state) => state.initBoot);
  const { appData, currencies, languages, appStyle } = useSelector(
    (state) => state.initBoot
  );
  const businessType = appStyle?.homePageLayout;
  const { themeColors, themeLayouts } = currentTheme;
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({ themeColors, fontFamily });
  const commonStyles = commonStylesFun({ fontFamily });

  const onStarRatingPress = (rating) => {
    updateState({ rating: rating });
  };

  /***********Remove Image from rating */
  const _removeImageFromList = (selectdImage) => {
    if (selectdImage?.id) {
      let copyArrayImages = cloneDeep(imageArray);

      copyArrayImages = copyArrayImages.filter(
        (x) => x?.id !== selectdImage?.id
      );
      updateState({
        imageArray: copyArrayImages,
        remove_image_ids: [...remove_image_ids, selectdImage?.id],
      });
    } else {
      let copyArrayImages = cloneDeep(imageArray);
      copyArrayImages = copyArrayImages.filter(
        (x) => x?.image_id !== selectdImage?.image_id
      );
      updateState({
        imageArray: copyArrayImages,
      });
    }
  };

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
        mediaType: "photo",
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
              updateState({ imageArray: [...imageArray, file] });
            }
          }
        })
        .catch((err) => {});
    }
  };

  const _giveRatingToProductOrDriver = () => {
    updateState({ isLoading: true });
    if (isDriverRateData?.isDriverRate) {
      const data = {
        order_id: isDriverRateData?.order_id,
        rating: rating,
        review: reviewText,
      };

      console.log(data, "dataaaaa for driver");
      actions
        .ratingToDriver(data, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
        })
        .then((res) => {
          updateState({ isLoading: false });
          console.log("res++++++", res);
          showSuccess(res?.message);
          navigation.navigate(navigationStrings.HOMESTACK)
          // navigation.goBack();
        })
        .catch(errorMethod);
      return;
    } else {
      let data = {};
      let formdata = new FormData();
      formdata.append(
        "order_vendor_product_id",
        ratingData?.order_vendor_product_id
      );
      formdata.append("order_id", ratingData?.order_id);
      formdata.append("product_id", ratingData?.product_id);
      if (businessType === 4) {
        formdata.append("rating_for_dispatch", ratingData?.dispatchId);
      }
      formdata.append("rating", rating);
      formdata.append("review", reviewText);
      // formdata.append('vendor_id', ratingData.vendor_id);
      if (imageArray.length) {
        imageArray.forEach((element) => {
         
          let imageRandomName = (Math.random() + 1).toString(36).substring(7);
          if (element?.id) {
          } else {
            formdata.append("files[]", {
              name: element.name?element.name:imageRandomName,
              type: element.type,
              uri: element.uri,
            });
          }
        });
      }

      if (remove_image_ids.length) {
        remove_image_ids.forEach((element) => {
          formdata.append("remove_files[]", element);
        });
      }
      actions
        .giveRating(formdata, {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          "Content-Type": "multipart/form-data",
        })
        .then((res) => {
          console.log(res, "resssss");
          updateState({ isLoading: false });
          // navigation.navigate(navigationStrings.TAXIHOMESCREEN);
          navigation.goBack();
          showSuccess(res?.message);
        })
        .catch(errorMethod);
    }
  };

  //get All ratings of product


  const getProductReviewRatings = () => {
  
    actions
      .getRating(
        `?id=${ratingData?.id}`,
        {},
        {
          code: appData?.profile?.code,
          currency: currencies?.primary_currency?.id,
          language: languages?.primary_language?.id,
          // 'Content-Type': 'multipart/form-data',
        }
      )
      .then((res) => {
        console.log(res, "res>>>>res");
        updateState({
          // imageArray: res.data.review_files,
          rating: res.data.rating,
          reviewText: res.data.review,
          isLoading: false,
          isRefreshing: false,
        });
        if (res.data.review_files.length) {
          updateState({
            imageArray: res.data.review_files.map((i, inx) => {
              return {
                uri: getImageUrl(
                  i?.file?.image_fit,
                  i?.file?.image_path,
                  "600/360"
                ),
                id: i?.id,
              };
            }),
          });
        }
      })
      .catch((error) => {
        console.log(error, "error>>>>error");
        updateState({
          isLoading: false,
          isRefreshing: false,
        });
        showError(error?.message || error?.error);
      });
  };

  const getDriverReviewRatings = () => {
    actions
    .getDriverRating(
      `?id=${isDriverRateData?.driverRatingData?.id}&dispatch_traking_url=${trackingurl}`,
      {},
      {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // 'Content-Type': 'multipart/form-data',
      }
    )
    .then((res) => {
      console.log(res, "res>>>>res");
      updateState({
        // imageArray: res.data.review_files,
        rating: res.data.rating,
        reviewText:res.data.review,
        isLoading: false,
       
      });
    })
    .catch((error) => {
      updateState({
        isLoading: false,
        isRefreshing: false,
      });
      showError(error?.message || error?.error);
    }
    )
  };

  useEffect(() => {
    if (isDriverRateData?.isDriverRate) {
      updateState({ isLoading: true });
      getDriverReviewRatings();
    } else {
      if(ratingData){
        updateState({ isLoading: true });
        getProductReviewRatings();
      }
    
    }
  }, []);

  const errorMethod = (error) => {
    console.log(error, "errorrr");
    updateState({ isLoading: false });
    showError(error?.message || error?.error);
  };

  useEffect(() => {
    if (isDriverRateData?.isDriverRate) {
      getDriverReviewRatings();
    } else {
      if(ratingData){
        updateState({ isLoading: true });
        getProductReviewRatings();
      }
    }
  }, [isRefreshing]);

  //Pull to refresh
  const handleRefresh = () => {
    updateState({
      isRefreshing: true,
    });
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.white}
      source={loaderOne}
      isLoadingB={isLoading}
    >
      <Header
        leftIcon={
          appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
            ? imagePath.icBackb
            : imagePath.back
        }
        centerTitle={
          isDriverRateData?.isDriverRate ? "Rate the Driver" : strings.RATEORDER
        }
        headerStyle={{ backgroundColor: colors.white }}
      />
      <View style={{ ...commonStyles.headerTopLine }} />
      <ScrollView
        refreshing={isRefreshing}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={themeColors.primary_color}
          />
        }
      >
        <View
          style={{
            marginHorizontal: moderateScale(20),
            marginTop: moderateScaleVertical(50),
            marginBottom: moderateScaleVertical(20),
          }}
        >
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
          <View style={{ marginTop: moderateScaleVertical(20) }}>
            {!isDriverRateData?.isDriverRate && (
              <View>
                <Text style={styles.uploadImage}>{strings.UPLOAD_IMAGE}</Text>
                <View
                  style={{
                    marginTop: moderateScaleVertical(10),
                    flexDirection: "row",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <View
                    style={{
                      marginRight: 5,
                      marginBottom: moderateScaleVertical(10),
                    }}
                  >
                    <TouchableOpacity
                      onPress={showActionSheet}
                      style={[styles.viewOverImage2, { borderStyle: "dashed" }]}
                    >
                      <Image
                        source={imagePath.icCamIcon}
                        style={{ tintColor: colors.themeColor }}
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
                            imageStyle={styles.imageOrderStyle}
                          >
                            <View style={styles.viewOverImage}>
                              <View
                                style={{
                                  position: "absolute",
                                  top: -10,
                                  right: -10,
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() => _removeImageFromList(i)}
                                >
                                  <Image source={imagePath.icRemoveIcon} />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </ImageBackground>
                        );
                      })
                    : null}
                </View>
              </View>
            )}

            {/* Message Container    */}
            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <Text style={styles.uploadImage}>{strings.REVIEW}</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInputStyle}
                  multiline={true}
                  value={reviewText==null?'':reviewText}
                  onChangeText={(text) => updateState({ reviewText: text })}
                />
              </View>
            </View>

            <View style={{ marginTop: moderateScaleVertical(20) }}>
              <GradientButton
                colorsArray={[
                  themeColors.primary_color,
                  themeColors.primary_color,
                ]}
                textStyle={styles.textStyle}
                onPress={_giveRatingToProductOrDriver}
                btnText={strings.SUBMIT}
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
      </ScrollView>
    </WrapperContainer>
  );
}
