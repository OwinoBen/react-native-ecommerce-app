import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import TransparentButtonWithTxtAndIcon from '../../../Components/TransparentButtonWithTxtAndIcon';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import {tokenConverterPlusCurrencyNumberFormater} from '../../../utils/commonFunction';
import {
  getColorCodeWithOpactiyNumber,
  getImageUrl,
} from '../../../utils/helperFunctions';
import ListEmptyCar from './ListEmptyCar';
import stylesFun from './styles';

export default function SelectCarModalView({
  isLoading = false,
  availableCarList = [],
  onPressPickUpNow,
  onPressPickUplater,
  onPressAvailableCar,
  selectedCarOption = null,
  availableVendors,
  selectedVendorOption = null,
  _select,
  onPressAvailableVendor,
}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const {additional_preferences, digit_after_decimal} =
    appData?.profile?.preferences || {};
  const fontFamily = appStyle?.fontSizeData;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);

  //Render all Available amounts
  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPressAvailableCar(item)}
        style={{
          borderWidth: 1,
          backgroundColor: isDarkMode
            ? selectedCarOption?.id == item?.id
              ? colors.lightBlueBackground
              : MyDarkTheme.colors.lightDark
            : selectedCarOption?.id == item?.id
            ? colors.lightBlueBackground
            : colors.white,
          borderColor:
            selectedCarOption?.id == item?.id
              ? 'transparent'
              : colors.lightGreyBorder,
          paddingVertical: moderateScaleVertical(20),
          paddingHorizontal: moderateScale(10),
          borderRadius: moderateScale(12),
          marginBottom: moderateScaleVertical(20),
        }}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flex: 0.3,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View>
              <Image
                resizeMode={'contain'}
                style={{height: 60, width: 100}}
                source={{
                  uri: getImageUrl(
                    item?.media[0]?.image?.path?.image_fit,
                    item?.media[0]?.image?.path?.image_path,
                    '150/150',
                  ),
                }}
              />
              {selectedCarOption?.id == item?.id && (
                <View style={{position: 'absolute', top: -10, left: 2}}>
                  <Image source={imagePath.checkbox} />
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5,
            }}>
            {/* <Text style={styles.carType}>{item.carType}</Text> */}
            <View style={{flex: 0.5}}>
              {/* <Text style={styles.packageSize}>{item.packageSize}</Text> */}
              <Text
                numberOfLines={1}
                style={
                  selectedCarOption?.id == item?.id
                    ? [styles.carType, {color: themeColors.primary_color}]
                    : [
                        styles.carType,
                        {
                          color: isDarkMode
                            ? colors.white
                            : colors.textGreyOpcaity7,
                        },
                      ]
                }>
                {item?.translation[0]?.title}
              </Text>
            </View>
            <View
              style={{
                flex: 0.4,
                alignItems: 'flex-end',
              }}>
              <Text
                numberOfLines={1}
                style={
                  selectedCarOption?.id == item?.id
                    ? [styles.priceStyle, {color: themeColors.primary_color}]
                    : [
                        styles.priceStyle,
                        {
                          color: isDarkMode
                            ? colors.white
                            : colors.textGreyOpcaity7,
                        },
                      ]

                  // isDarkMode
                  //   ? [styles.priceStyle, {color: MyDarkTheme.colors.text}]
                  //   : styles.priceStyle
                }>
                {tokenConverterPlusCurrencyNumberFormater(
                  Number(data?.payable_amount),
                  digit_after_decimal,
                  additional_preferences,
                  currencies?.primary_currency?.symbol,
                )}
              </Text>
            </View>

            {/* <Text style={styles.deliveryPrice}>{item.minimumDistance}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const _listEmptyComponent = () => {
    return (
      <>
        {isLoading ? (
          <View
            style={{
              // height: height / 4,
              marginVertical: moderateScaleVertical(20),
            }}>
            {[1, 2, 3, 4].map((i, inx) => {
              return (
                <View key={inx}>
                  <ListEmptyCar isLoading={isLoading} />
                </View>
              );
            })}
          </View>
        ) : (
          <View
            style={{
              height: height / 3.5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.noCarsAvailable}>
              {strings.NO_CARS_AVAILABLE}
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <View
      style={
        isDarkMode
          ? [
              styles.bottomView,
              {backgroundColor: MyDarkTheme.colors.background},
            ]
          : [styles.bottomView]
      }>
      <View style={{padding: moderateScale(20)}}>
        {/* <Text style={styles.addressMainTitle}>{addressLabel}</Text> */}

        <Text
          style={
            isDarkMode
              ? [styles.chooseSuitable, {color: MyDarkTheme.colors.text}]
              : styles.chooseSuitable
          }>
          {strings.CHOSSESUITABLECAR}
        </Text>
        {availableVendors.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {availableVendors.map((i, inx) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => onPressAvailableVendor(i)}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 8,
                    marginTop: 20,
                    width: availableVendors.length <= 2 ? width / 2 : width / 3,
                    borderBottomColor:
                      selectedVendorOption?.id == i?.id
                        ? themeColors.primary_color
                        : colors.textGreyJ,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor:
                      selectedVendorOption?.id == i?.id
                        ? getColorCodeWithOpactiyNumber(
                            themeColors.primary_color.substr(1),
                            20,
                          )
                        : 'transparent',
                    borderBottomWidth:
                      selectedVendorOption?.id == i?.id ? 3 : 1,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.carType2,
                      {
                        color:
                          selectedVendorOption?.id == i?.id
                            ? themeColors.primary_color
                            : colors.textGreyJ,
                      },
                    ]}>
                    {i.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false}>
          <FlatList
            data={availableCarList}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{
              marginVertical: isLoading
                ? moderateScaleVertical(10)
                : availableVendors.length == 1
                ? moderateScaleVertical(10)
                : moderateScaleVertical(20),
              height: isLoading
                ? height / 3
                : availableVendors.length == 1
                ? height / 3
                : height / 4,
            }}
            keyExtractor={(item, index) => String(index)}
            renderItem={_renderItem}
            ListEmptyComponent={_listEmptyComponent}
          />
        </ScrollView>

        {availableCarList.length ? (
          <View
            style={{
              // marginVertical: moderateScaleVertical(5),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',

              // backgroundColor:'red'
            }}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={{textTransform: 'none', fontSize: textScale(16)}}
              onPress={onPressPickUpNow}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.PICKUPNOW}
              containerStyle={{width: width / 2.5}}
            />

            <TransparentButtonWithTxtAndIcon
              btnText={strings.PICKUPLATER}
              borderRadius={moderateScale(13)}
              onPress={onPressPickUplater}
              marginBottom={moderateScaleVertical(10)}
              marginTop={moderateScaleVertical(10)}
              containerStyle={{width: width / 2.5}}
              textStyle={{
                color: themeColors.primary_color,
                textTransform: 'none',
                fontSize: textScale(16),
              }}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}
