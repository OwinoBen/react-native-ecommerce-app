import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import colors from '../../styles/colors';
import commonStylesFun from '../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import stylesFun from './styles';

export default function AboutUs({navigation}) {
  const currentTheme = useSelector((state) => state.appTheme);
  const {appData, appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const [state, setState] = useState({});
  const styles = stylesFun({fontFamily});
  const commonStyles = commonStylesFun({fontFamily});

  console.log('Texting');

  const updateState = (data) => setState((state) => ({...state, ...data}));
  const {themeColors, themeLayouts} = currentTheme;

  return (
    <WrapperContainer bgColor={colors.white} statusBarColor={colors.white}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2 ? imagePath.backArrow : imagePath.back
        }
        centerTitle={strings.ABOUT_US}
        // rightIcon={imagePath.cartShop}
        headerStyle={{backgroundColor: colors.white}}
      />
      <View style={{...commonStyles.headerTopLine}} />
      {/* ABOUT_US view*/}
      <ScrollView
        alwaysBounceVertical={true}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: moderateScale(10),
          marginTop: moderateScaleVertical(20),
        }}>
        <View style={{marginBottom: moderateScaleVertical(85)}}>
          <Text style={styles.titleAbout}>{'Know about us\n'}</Text>
          <Text style={styles.contentAbout}>
            {
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I"
            }
          </Text>

          <View style={{height: 40}} />

          <Text style={styles.titleAbout}>{'About our services\n'}</Text>
          <Text style={styles.contentAbout}>
            {
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. I"
            }
          </Text>
        </View>
      </ScrollView>
    </WrapperContainer>
  );
}
