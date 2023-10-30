import React, {useRef} from 'react';
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
  const viewRef2 = useRef();
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot || {},
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
    console.log(item, 'itemsssssssssss');
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPressAvailableCar(item)}>
        <View
          style={{
            paddingVertical: moderateScaleVertical(12),
            paddingHorizontal: moderateScale(10),

            marginBottom: moderateScaleVertical(20),

            opacity: selectedCarOption?.id == item?.id ? 0.8 : 1,
            backgroundColor:
              selectedCarOption?.id == item?.id
                ? colors.lightGreyBg
                : colors.whiteOpacity77,
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
                  style={{height: 40, width: 100}}
                  source={{
                    uri: getImageUrl(
                      item?.media[0]?.image?.path?.proxy_url,
                      item?.media[0]?.image?.path?.image_path,
                      '150/150',
                    ),
                  }}
                />
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
                      ? [
                          styles.carType,
                          {
                            color: colors.black,
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                          },
                        ]
                      : [
                          styles.carType,
                          {
                            color: colors.blackC,
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
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
                      ? [
                          styles.priceStyle,
                          {
                            color: colors.black,
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                          },
                        ]
                      : [
                          styles.priceStyle,
                          {
                            color: isDarkMode
                              ? colors.white
                              : colors.textGreyOpcaity7,
                            fontFamily: fontFamily.medium,
                            fontSize: textScale(12),
                          },
                        ]
                    // isDarkMode
                    //   ? [styles.priceStyle, {color: MyDarkTheme.colors.text}]
                    //   : styles.priceStyle
                  }>
                  {tokenConverterPlusCurrencyNumberFormater(
                    Number(item.tags_price),
                    digit_after_decimal,
                    additional_preferences,
                    currencies?.primary_currency?.symbol,
                  )}
                </Text>
              </View>

              {/* <Text style={styles.deliveryPrice}>{item.minimumDistance}</Text> */}
            </View>
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
      style={{
        ...styles.bottomView,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
      <View
        style={{
          padding: availableCarList.length
            ? moderateScale(0)
            : moderateScale(20),
        }}>
        <View
          style={{
            width: moderateScale(40),
            height: moderateScaleVertical(2),
            backgroundColor: colors.textGreyJ,
            marginVertical: moderateScaleVertical(10),
            alignSelf: 'center',
          }}></View>

        {/* <Text
          style={
            isDarkMode
              ? [styles.chooseSuitable, {color: MyDarkTheme.colors.text}]
              : styles.chooseSuitable
          }>
          {strings.CHOSSESUITABLECAR}
        </Text> */}
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
                    width:
                      availableVendors.length <= 2
                        ? width / 2 - moderateScale(12)
                        : width / 3 - moderateScale(12),
                    borderBottomColor:
                      selectedVendorOption?.id == i?.id
                        ? themeColors.primary_color
                        : colors.textGreyJ,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // backgroundColor:
                    //   selectedVendorOption?.id == i?.id
                    //     ? getColorCodeWithOpactiyNumber(
                    //         themeColors.primary_color.substr(1),
                    //         20,
                    //       )
                    //     : 'transparent',
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
                        fontSize: textScale(10),
                      },
                    ]}>
                    {i.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <FlatList
          // scrollEnabled={false}
          data={availableCarList}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => String(index)}
          renderItem={_renderItem}
          ListEmptyComponent={_listEmptyComponent}
          ListFooterComponent={() => {
            if (availableCarList.length)
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginHorizontal: 20,
                    marginBottom: moderateScaleVertical(24),
                  }}>
                  <GradientButton
                    // endcolor={{x: 0.0, y: 0.25}}
                    // startcolor={{x: 0.0, y: 0.0}}
                    colorsArray={[
                      themeColors.primary_color,
                      getColorCodeWithOpactiyNumber(
                        themeColors.primary_color.substr(1),
                        70,
                      ),
                      getColorCodeWithOpactiyNumber(
                        themeColors.primary_color.substr(1),
                        70,
                      ),
                      themeColors.primary_color,
                    ]}
                    textStyle={{textTransform: 'none', fontSize: textScale(14)}}
                    onPress={
                      selectedCarOption?.variant[0]?.price > 0
                        ? onPressPickUpNow
                        : () => {}
                    }
                    btnText={
                      selectedCarOption?.variant[0]?.price > 0
                        ? strings.CONFIRM
                        : strings.NORIDEAVAILABLE
                    }
                    containerStyle={{flex: 1}}
                  />
                  {/* <TouchableOpacity
                style={{
                  flex: 0.14,
                  borderRadius: moderateScaleVertical(15),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: themeColors.primary_color,
                }}
                onPress={onPressPickUplater}>
                <Image
                  source={imagePath.calendarA}
                  style={{
                    tintColor: themeColors.primary_color,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity> */}
                </View>
              );
            else return <></>;
          }}
        />

        {/* </ScrollView> */}
      </View>
    </View>
  );
}
