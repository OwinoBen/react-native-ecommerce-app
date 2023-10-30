import {cloneDeep} from 'lodash';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import {getColorCodeWithOpactiyNumber} from '../../utils/helperFunctions';
import stylesFunc from './styles';
import { enableFreeze } from "react-native-screens";
enableFreeze(true);


export default function BuyProduct({navigation, route}) {
  const currentTheme = useSelector((state) => state.appTheme);
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});
  const data = route.params;
  const [state, setState] = useState({
    packageDesc:
      'Iphone 8 and accessories. Total of 2 items. Has lot of delicate stuff, so please handle with care.',
    packingSize: [
      {
        id: 1,
        active: false,
      },
      {
        id: 2,
        active: false,
      },
    ],
    selectedPackage: null,
    selecteddelivery: null,
  });
  const {packingSize, deliveryPack, selectedPackage} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const payAndSubmit = () => {
    navigation.navigate(navigationStrings.PAYMENT_SUCCESS);
  };

  const selectPackageHandler = (data) => {
    let packingData = cloneDeep(packingSize);

    let newarray = packingData.map((item) => {
      if (item.id == data.id) {
        return {
          ...item,
          active: data?.active ? false : true,
        };
      } else {
        return {
          ...item,
          active: false,
        };
      }
    });

    updateState({
      packingSize: newarray,
      selectedPackage: data,
    });
  };

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
        leftIcon={imagePath.back}
        centerTitle={data.screenName}
        headerStyle={{backgroundColor: colors.backgroundGrey}}
      />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <KeyboardAwareScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: moderateScaleVertical(20)}}>
        <View style={styles.totalPayableView}>
          <View>
            <Text style={styles.totalPayableText}>{strings.TOTAL_PAYABLE}</Text>
            <Text style={styles.totalPayableValue}>{`${'$ 606.21'}`}</Text>
            <Text style={styles.allIncludedText}>
              {strings.INCLUDED_ALL_TAXES}
            </Text>
          </View>
        </View>
        {packingSize &&
          packingSize.length &&
          packingSize.map((itm, inx) => {
            if (inx == packingSize.length - 1) {
              return (
                <TouchableOpacity
                  onPress={() => selectPackageHandler(itm, inx)}
                  key={inx}
                  style={[
                    styles.caseOnDeliveryView,
                    {...getAndCheckStyle(itm)},
                  ]}>
                  <Image
                    source={
                      itm?.active
                        ? imagePath.radioActive
                        : imagePath.radioInActive
                    }
                  />
                  <Text style={styles.caseOnDeliveryText}>
                    {strings.CASH_ON_DELIVERY}
                  </Text>
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() => selectPackageHandler(itm, inx)}
                  key={inx}
                  style={[styles.packingBoxStyle, {...getAndCheckStyle(itm)}]}>
                  <View>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        marginEnd: moderateScale(10),
                      }}>
                      <Text
                        style={{color: colors.walletTextD}}>{`${'EXP'}`}</Text>
                    </View>
                    <View style={styles.cardImageView}>
                      <Image
                        source={
                          itm?.active
                            ? imagePath.radioActive
                            : imagePath.radioInActive
                        }
                      />
                      <Text>09/2030</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: moderateScaleVertical(40),
                      }}>
                      <Image
                        source={imagePath.masterCard}
                        style={styles.masterCardLogo}
                      />
                      <View
                        style={{
                          marginTop: moderateScaleVertical(5),
                          marginLeft: moderateScaleVertical(10),
                        }}>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              fontFamily: fontFamily.bold,
                              fontSize: moderateScale(14),
                            }}>
                            Master Card
                          </Text>
                        </View>

                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.priceItemLabel}>
                            **** **** **** 4589
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          })}
      </KeyboardAwareScrollView>
      <TouchableOpacity>
        <View style={styles.useNewCartView}>
          <Text style={[styles.useNewCartText]}>{strings.USE_A_NEW_CARD}</Text>
        </View>
      </TouchableOpacity>
      <View style={{marginHorizontal: moderateScaleVertical(20)}}>
        <GradientButton
          textStyle={styles.textStyle}
          onPress={payAndSubmit}
          marginTop={moderateScaleVertical(10)}
          marginBottom={moderateScaleVertical(75)}
          btnText={strings.PAY_AND_SUBMIT_REQUEST}
        />
      </View>
    </WrapperContainer>
  );
}
