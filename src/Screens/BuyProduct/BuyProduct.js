import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import BorderTextInputWithLable from '../../Components/BorderTextInputWithLable';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import {shortCodes} from '../../utils/constants/DynamicAppKeys';
import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';
import stylesFun from './styles';

export default function BuyProduct({navigation}) {
  const {appStyle, themeColors, appData} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily, themeColors});

  const [state, setState] = useState({
    pickupFrom: 'Chandigarh, 160022, india',
    deliverTo: 'Rumbrem, 403706, india',
    shipmentDate: 'Fri, 15 jan, 2021',
    shipmentTime: '10 : 20 AM',
    packageDesc:
      'Iphone 8 and accessories. Total of 2 items. Has lot of delicate stuff, so please handle with care.',
    packingSize: [
      {
        id: 1,
        length: 2,
        width: 3,
        height: 4,
        size: '30 x 30 x 30 cm',
        packageName: 'Small',
        icon: imagePath.ic_package2,
      },
    ],
    productWeight: '1 Kg',
    selectedPackage: null,
  });
  const {
    pickupFrom,
    deliverTo,
    shipmentDate,
    shipmentTime,
    packageDesc,
    packingSize,
    selectedPackage,
    productWeight,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  // on change text
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const selectLocation = (key) => () => {
    alert('In Progress');
  };
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName);
    };
  const continuePress = () => {
    navigation.navigate(navigationStrings.CONFIRM_DETAILS_BUY, {});
  };

  const selectPackageHandler = (data) => {
    updateState({selectedPackage: data});
  };

  //Styles in app

  //upadte box style on click
  const getAndCheckStyle = (item) => {
    if (selectedPackage && selectedPackage.id == item.id) {
      return {
        backgroundColor: colors.white,
        borderColor: themeColors.primary_color,
      };
    } else {
      return {
        backgroundColor: 'transparent',
        borderColor: getColorCodeWithOpactiyNumber('1E2428', 20),
      };
    }
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2 ? imagePath.backArrow : imagePath.back
        }
        centerTitle={strings.BUY_SOME}
        headerStyle={{backgroundColor: colors.backgroundGrey}}
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: moderateScaleVertical(20),
          marginTop: moderateScaleVertical(20),
        }}>
        <BorderTextInputWithLable
          label={strings.PICK_UP_FROM}
          value={pickupFrom}
          disabled={false}
        />
        <BorderTextInputWithLable
          label={strings.DELIEVER_TO}
          value={deliverTo}
          disabled={false}
        />
        <View style={styles.productInfoView}>
          <View style={[styles.lineStyle, {marginRight: 10}]} />
          <View>
            <Text style={styles.productInfo}>
              {strings.PRODUCT_INFORMATION}
            </Text>
          </View>
          <View style={[styles.lineStyle, {marginLeft: 10}]} />
        </View>

        <BorderTextInputWithLable
          label={strings.PRODUCT_WEIGHT}
          value={productWeight}
          disabled={true}
          placeholder={strings.PRODUCT_WEIGHT}
          onChangeText={_onChangeText('productWeight')}
          textAlignVertical={'top'}
          lableViewStyle={{flexDirection: 'row'}}
          subLabel={`(${strings.MAX_25})`}
          mainStyle={{marginTop: moderateScaleVertical(30)}}
        />

        <>
          <View
            style={{
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={[styles.labelStyle]}>
              {strings.DIMENSIONS_PER_PACKAGE}
            </Text>
            <Text style={[styles.sublabelStyle]}>
              {strings.OPTIONAL_HEIGHT_WIDTH}
            </Text>
          </View>
          <View style={{marginVertical: moderateScaleVertical(10)}}>
            {packingSize &&
              packingSize.length &&
              packingSize.map((itm, inx) => {
                return (
                  <TouchableOpacity
                    onPress={() => selectPackageHandler(itm)}
                    key={inx}
                    style={[
                      styles.packingBoxStyle,
                      {...getAndCheckStyle(itm)},
                    ]}>
                    <View style={styles.dimensions_view}>
                      <View style={styles.length_width_view}>
                        <Text numberOfLines={1} style={styles.boxTitle2}>
                          {itm.length}
                        </Text>
                      </View>
                      <View style={styles.length_width_view}>
                        <Text numberOfLines={2} style={styles.boxTitle2}>
                          {itm.width}
                        </Text>
                      </View>
                      <View style={styles.height_view}>
                        <Text numberOfLines={2} style={styles.boxTitle2}>
                          {itm.height}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </>

        <View style={styles.add_another_package}>
          <Text
            style={
              styles.addAnotherPackage
            }>{`+ ${strings.ADD_ANOTHER_PACKAGE}`}</Text>
        </View>

        <BorderTextInputWithLable
          label={strings.PACKAGE_DESC}
          value={packageDesc}
          disabled={false}
          placeholder={strings.PACKAGE_DESC}
          onChangeText={_onChangeText('packageDesc')}
          textAlignVertical={'top'}
          multiline={true}
          containerStyle={{height: moderateScaleVertical(108), padding: 5}}
        />
        <View
          style={{
            marginHorizontal: moderateScaleVertical(20),
            marginBottom: moderateScaleVertical(75),
          }}>
          <GradientButton
            textStyle={styles.textStyle}
            onPress={continuePress}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.CONTINUE}
          />
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
