import React from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {getImageUrl} from '../../../utils/helperFunctions';
import ListEmptyCar from './ListEmptyCar';
import stylesFun from './styles';

export default function SelectVendorModalView({
  isLoading = false,
  availableVendors,
  selectedVendorOption = null,
  _select,
  onPressAvailableVendor,
}) {
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const userData = useSelector((state) => state?.auth?.userData);
  console.log(userData, 'userData');
  const {profile} = appData;
  //Render all Available amounts
  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onPressAvailableVendor(item)}
        style={{
          borderWidth: 1,
          backgroundColor:
            selectedVendorOption?.id == item?.id
              ? colors.lightBlueBackground
              : colors.white,
          borderColor:
            selectedVendorOption?.id == item?.id
              ? 'transparent'
              : colors.lightGreyBorder,

          borderRadius: moderateScale(12),
          marginBottom: moderateScaleVertical(20),
          // width: width / 2.5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            // justifyContent: 'center',
            // alignItems: 'center',
            width: width / 2.5,
            // backgroundColor:'red'
            padding: 10,
          }}>
          <View style={{alignItems: 'center', overflow: 'visible'}}>
            <View>
              <Image
                style={{height: 40, width: 100}}
                source={{
                  uri: getImageUrl(
                    item.banner.image_fit,
                    item.banner.image_path,
                    '1000/1000',
                  ),
                }}
              />
              {selectedVendorOption?.id == item?.id && (
                <View style={{position: 'absolute', top: -5, left: -10}}>
                  <Image source={imagePath.checkbox} />
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text numberOfLines={1} style={styles.carType}>
                {item.name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const _listEmptyComponent = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <View style={[styles.bottomView]}>
      <View style={{padding: moderateScale(20)}}>
        {/* <Text style={styles.addressMainTitle}>{addressLabel}</Text> */}

        <Text
          numberOfLines={1}
          style={styles.chooseSuitable}>{`Hey ${userData?.name} ,`}</Text>
        <Text style={styles.chooseSuitable}>{'what are you up to today?'}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading && (
            <>
              {[1, 2, 3, 4].map((i, inx) => {
                return <ListEmptyCar isLoading={isLoading} />;
              })}
            </>
          )}
          <FlatList
            data={availableVendors}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{
              marginVertical: moderateScaleVertical(20),
              height: height / 3.5,
            }}
            numColumns={2}
            keyExtractor={(item, index) => String(index)}
            renderItem={_renderItem}
            ListEmptyComponent={_listEmptyComponent}
          />
        </ScrollView>

        {availableVendors.length ? (
          <View
            style={{
              marginVertical: moderateScaleVertical(10),
              marginHorizontal: moderateScale(20),
            }}>
            <GradientButton
              colorsArray={[
                themeColors.primary_color,
                themeColors.primary_color,
              ]}
              textStyle={{textTransform: 'none', fontSize: textScale(16)}}
              onPress={_select}
              marginTop={moderateScaleVertical(10)}
              marginBottom={moderateScaleVertical(10)}
              btnText={strings.SELECT}
            />
            <View>
              <Text style={styles.bottomAcceptanceText}>
                {strings.BYCONFIRMING}
              </Text>
              <Text style={styles.bottomAcceptanceText}>
                {strings.DOESNTCONTAIN}
                <Text style={{color: themeColors.primary_color}}>
                  {strings.ILLEGAL_ITESM}
                </Text>
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
