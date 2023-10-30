import React, { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import navigationStrings from '../../navigation/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical
} from '../../styles/responsiveSize';
import stylesFun from './styles';

export default function Delivery({navigation, route}) {
  const paramData = route?.params;
  console.log(paramData, 'paramData>');
  const [state, setState] = useState({
    isModalVisible: false,
    sendOrBuy: 'send',
    textData: [
      {
        id: 1,
        name: 'Cash & Bearer Bonds',
      },
      {
        id: 2,
        name: 'Gold and Other Precious Metals',
      },
      {
        id: 3,
        name: 'Liquids',
      },
      {
        id: 4,
        name: 'Drugs & Narcotics',
      },
      {
        id: 5,
        name: 'Chemicals',
      },
      {
        id: 6,
        name: 'Weapons & Firearms',
      },
      {
        id: 7,
        name: 'Explosive Materials',
      },
      {
        id: 8,
        name: 'Perishables (Food,fresh, and Veggies)',
      },
      {
        id: 9,
        name: 'Plants & Flowers',
      },
      {
        id: 10,
        name: 'Live Animals',
      },
      {
        id: 11,
        name: 'Counterfeit & Illegal goods',
      },
      {
        id: 12,
        name: 'Human Remains',
      },
    ],
  });

  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFun({fontFamily});

  const {isModalVisible, sendOrBuy, textData} = state;
  //Naviagtion to specific screen
  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };
  //Update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  const continuePress = () => {
    updateState({isModalVisible: false});
    if (paramData?.data?.template_type_id == 1) {
      moveToNewScreen(navigationStrings.SEND_PRODUCT, paramData.data)();
    } else {
      moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, paramData.data)();
    }
  };

  const buySomeThing = () => {
    updateState({isModalVisible: true, sendOrBuy: 'buy'});
  };

  const modalMainContent = () => {
    return (
      <ScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: moderateScale(20)}}>
          <View
            style={{
              alignItems: 'center',
              marginVertical: moderateScaleVertical(10),
            }}>
            <Image source={imagePath.ic_package1} />
          </View>
          <Text style={styles.topTextStyle}>
            {
              'To make sure that your shipment does not contain items that are classifield as hazardousmaterial, dangerous goods, prohibited or restricted article by international and local shipping regulation, please allow us to inspect your shipment in your presence before picking it up'
            }
          </Text>
          {textData &&
            textData.length &&
            textData.map((itm, inx) => {
              return <Text style={styles.bottomTextStyle}>{itm.name}</Text>;
            })}
        </View>
        {modalBottomContent()}
      </ScrollView>
    );
  };

  const modalBottomContent = () => {
    return (
      <View
        style={{
          marginHorizontal: moderateScale(20),
          marginBottom: moderateScaleVertical(20),
        }}>
        <GradientButton
          textStyle={styles.textStyle}
          onPress={continuePress}
          marginTop={moderateScaleVertical(20)}
          marginBottom={moderateScaleVertical(30)}
          btnText={strings.CONTINUE}
        />
      </View>
    );
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}>
      <Header centerTitle={strings.WHAT_WOULD_YOU_LIKE_TO_DO} />
      <View style={{height: 1, backgroundColor: colors.borderLight}} />
      <View style={{marginVertical: moderateScaleVertical(10)}}>
        {modalMainContent()}
        {/* {modalBottomContent()} */}
        {/* <ListItemHorizontal
          onRightIconPress={() =>
            updateState({isModalVisible: true, sendOrBuy: 'send'})
          }
          iconLeft={imagePath.contactLess}
          centerHeading={strings.SEND_SOMETHING}
          centerText={strings.WE_WILL_PICK}
          iconRight={imagePath.forwardCircle}
        />
        <View style={{height: moderateScaleVertical(30)}} />
        <ListItemHorizontal
          onRightIconPress={() =>
            updateState({isModalVisible: true, sendOrBuy: 'buy'})
          }
          iconLeft={imagePath.packageTransfer}
          centerHeading={strings.BUY_SOMETHING}
          centerText={strings.WE_WILL_PURCHASE_AND_DELIVER}
          iconRight={imagePath.forwardCircle}
        />
        <View style={{height: moderateScaleVertical(30)}} />
        <ListItemHorizontal
          onRightIconPress={moveToNewScreen(navigationStrings.TRACKING)}
          containerStyle={{borderBottomWidth: 0}}
          iconLeft={imagePath.trackOrder}
          centerHeading={strings.TRACK_YOUR_ORDER}
          centerText={strings.YOU_CAN_TRACK}
          iconRight={imagePath.forwardCircle}
        />

        {isModalVisible && (
          <ModalView
            isVisible={isModalVisible}
            onClose={() => updateState({isModalVisible: false})}
            modalBottomContent={modalBottomContent}
            modalMainContent={modalMainContent}
            leftIcon={imagePath.cross}
            centerTitle={strings.PROHIBITED_ITEMS}
            onPressLeft={() => updateState({isModalVisible: false})}
          />
        )} */}
      </View>
    </WrapperContainer>
  );
}
