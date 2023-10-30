import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
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
  const currentTheme = useSelector((state) => state.appTheme);
  const {appStyle, appData} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});

  const [state, setState] = useState({
    Confirm_Details: strings.CONFIRM_DETAILS,
    Products_details: 'Products details',
    Dimentions: '120 cm x 120 cm x 40 cm',
    pickupFrom: 'Chandigarh, 160022, india',
    deliverTo: 'Rumbrem, 403706, india',
    Weight: '3 kg',
    Transit_charge: '$ 20',
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
    Confirm_Details,
    Dimentions,
    Weight,
    Transit_charge,
    pickupFrom,
    Products_details,
    selectedPackage,
    deliverTo,
    packageDesc,
    productWeight,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {themeColors, themeLayouts} = currentTheme;

  // on change text
  const _onChangeText = (key) => (val) => {
    updateState({[key]: val});
  };

  const selectLocation = (key) => () => {
    alert('In Progress');
  };

  const continueToPayment = () => {
    navigation.navigate(navigationStrings.PAYMENT, {
      screenName: strings.PAYMENT,
    });
  };

  //upadte box style on click
  const getAndCheckStyle = (item) => {
    // return {}
    if (selectedPackage && selectedPackage.id == item.id) {
      return {
        backgroundColor: colors.white,
        borderColor: colors.btnABlue,
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
        style={{marginHorizontal: moderateScaleVertical(20)}}>
        <View
          style={{flexDirection: 'row', marginTop: moderateScaleVertical(20)}}>
          <Text style={styles.confirmDetailsText}>{Confirm_Details}</Text>
          <View style={styles.desh}></View>
        </View>
        <View
          style={{
            marginTop: moderateScaleVertical(20),
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.price}>{strings.PRODUCTS_DETAILS}</Text>
          </View>

          <View style={styles.dimentionView}>
            <Text style={styles.priceItemLabel}>{strings.DIMENTIONS}</Text>
            <Text style={styles.priceItemLabel}>{`${Dimentions}`}</Text>
          </View>

          <View style={styles.weightView}>
            <Text style={styles.priceItemLabel}>{strings.WEIGHT}</Text>
            <Text style={styles.priceItemLabel}>{`${Weight}`}</Text>
          </View>

          <View style={styles.weightView}>
            <Text style={styles.priceItemLabel}>{strings.TRANSIT_CHARGE}</Text>
            <Text style={styles.priceItemLabel}>{`${Transit_charge}`}</Text>
          </View>
        </View>

        <View style={styles.pickup_drop_view}>
          <View style={{width: 10}}>
            <Image source={imagePath.radioActive} />
            <View style={styles.dots}></View>
            <View style={styles.dots}></View>
            <View style={styles.dots}></View>
            <View style={styles.dots}></View>
            <View style={styles.dots}></View>
            <View style={styles.dots}></View>
            <View style={styles.dots}></View>
            <Image source={imagePath.radioInActive} />
          </View>
          <View style={{marginHorizontal: moderateScaleVertical(20)}}>
            <Text style={styles.priceItemLabel}>{strings.PICK_UP_FROM}</Text>
            <Text style={styles.pickupFromText}>{pickupFrom}</Text>
            <Text style={styles.dropOff}>{strings.DROP_OFF_ADDRESS}</Text>
            <Text style={{marginTop: moderateScaleVertical(8)}}>
              {deliverTo}
            </Text>
          </View>
        </View>
        <View style={{marginVertical: moderateScaleVertical(0)}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.packageDesc}>{strings.PACKAGE_DESC}</Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Text style={styles.packageDescText}>{packageDesc}</Text>
          </View>
        </View>
        <View
          style={{
            marginHorizontal: moderateScaleVertical(20),
            marginVertical: moderateScaleVertical(30),
          }}>
          <GradientButton
            textStyle={styles.textStyle}
            onPress={continueToPayment}
            marginBottom={moderateScaleVertical(10)}
            btnText={strings.CONTINUE_TO_PAYMENT}
          />
        </View>
      </KeyboardAwareScrollView>
    </WrapperContainer>
  );
}
