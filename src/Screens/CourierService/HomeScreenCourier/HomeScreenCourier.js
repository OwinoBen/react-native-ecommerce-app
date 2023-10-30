import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import GradientButton from '../../../Components/GradientButton';
import HeaderWithFilters from '../../../Components/HeaderWithFilters';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import navigationStrings from '../../../navigation/navigationStrings';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../../styles/responsiveSize';
import {showError} from '../../../utils/helperFunctions';
import stylesFunc from './styles';
const {height, width} = Dimensions.get('window');

export default function HomeScreenCourier({navigation, route}) {
  const paramData = route?.params;
  console.log(paramData, 'paramData>');
  const [state, setState] = useState({
    isLoading: false,

    packageArray: [
      {
        id: 1,
        icon: imagePath.bmi,
        title: 'Watch the weight',
        subTitle:
          'Please ensure that the package can be carried in a hatchback car.',
      },
      {
        id: 2,
        icon: imagePath.openBox,
        title: 'Keep them ready to go',
        subTitle:
          'Please keep the items ready before the partner arrives for pickup.',
      },
    ],
  });
  const {isLoading, packageArray} = state;
  const userData = useSelector((state) => state?.auth?.userData);

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {appData, themeColors, currencies, languages, appStyle} = useSelector(
    (state) => state.initBoot,
  );
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily});

  const moveToNewScreen =
    (screenName, data = {}) =>
    () => {
      navigation.navigate(screenName, {data});
    };

  const errorMethod = (error) => {
    updateState({isLoading: false, isLoading: false, isLoadingC: false});
    showError(error?.message || error?.error);
  };

  const sendPackage = () => {
    if (paramData?.data?.template_type_id == 1) {
      moveToNewScreen(navigationStrings.SEND_PRODUCT, paramData.data)();
    } else {
      moveToNewScreen(navigationStrings.MULTISELECTCATEGORY, paramData.data)();
    }
  };
  return (
    <WrapperContainer
      bgColor={colors.backgroundGrey}
      statusBarColor={colors.backgroundGrey}
      source={loaderOne}
      isLoadingB={isLoading}>
      <ImageBackground
        source={imagePath.frameorder}
        style={{width: width - moderateScale(20), height: height / 3.5}}>
        <HeaderWithFilters
          leftIcon={imagePath.backArrowCourier}
          headerStyle={{marginTop: moderateScaleVertical(20)}}
        />
      </ImageBackground>
      <ScrollView bounces={false}>
        <View style={styles.mainComponent}>
          <Text style={styles.pickUpAndDrop}>{strings.PICKUPANDDROP}</Text>
          <Text style={styles.pickUpAndDropContent}>
            {strings.PICKUPDROPCONTENT}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: moderateScale(20),
              marginVertical: moderateScaleVertical(20),
            }}>
            <ScrollView
              bounces={false}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {packageArray.map((item, index) => {
                return (
                  <View key={index} style={styles.boxStyle}>
                    <Image source={item.icon} />
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subTitle}>{item.subTitle}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          marginHorizontal: moderateScale(20),
          position: 'absolute',
          bottom: 10,
          top: height - height / 5,
          left: 0,
          right: 0,
        }}>
        <GradientButton
          colorsArray={[themeColors.primary_color, themeColors.primary_color]}
          textStyle={styles.textStyle}
          onPress={sendPackage}
          marginTop={moderateScaleVertical(10)}
          marginBottom={moderateScaleVertical(10)}
          btnText={strings.sendPackage}
        />
        <Text style={styles.bottomAcceptanceText}>{strings.BYTAPPING}</Text>
        <Text style={styles.bottomAcceptanceText}>
          {strings.DOESNTCONTAIN}
          <Text style={{color: themeColors.primary_color}}>
            {strings.ILLEGAL_ITESM}
          </Text>
        </Text>
      </View>
    </WrapperContainer>
  );
}
