import { BlurView } from '@react-native-community/blur';
import React, { useRef, useState } from 'react';
import {
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import ImgCardSmall from '../../../Components/ImgCardSmall';
import CardLoader from '../../../Components/Loaders/CardLoader';
import imagePath from '../../../constants/imagePath';
import ScaledImage from 'react-native-scalable-image';

import {
  itemWidth,
  moderateScale,
  moderateScaleVertical,
  sliderWidth,
  width,
} from '../../../styles/responsiveSize';
import { getImageUrl } from '../../../utils/helperFunctions';
import stylesFunc from '../styles';
import navigationStrings from '../../../navigation/navigationStrings';
import { SvgUri } from 'react-native-svg';
import { useDarkMode } from 'react-native-dynamic';
import { MyDarkTheme } from '../../../styles/theme';

export default function DashBoardHeaderOne({ navigation = {}, location = [] }) {
  const [state, setState] = useState({});
  const { appData, themeColors, appStyle } = useSelector(
    (state) => state?.initBoot,
  );
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const profileInfo = appData?.profile;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({ themeColors, fontFamily });
  //update state
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const imageURI = getImageUrl(
    isDarkMode
      ? profileInfo?.dark_logo?.image_fit
      : profileInfo?.logo?.image_fit,
    isDarkMode
      ? profileInfo?.dark_logo?.image_path
      : profileInfo?.logo?.image_path,
    '1000/1000',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: Platform.OS === 'ios' ? null : 10,
      }}>

      <View
        style={[
          styles.topLogo,
          { flex: 1, flexDirection: 'row', alignItems: 'center' },
        ]}>

        {appStyle?.homePageLayout == 10 ? <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.openDrawer()}
          style={{ alignItems: 'center', }}>
          <Image
            style={{
              tintColor: themeColors.primary_color,
              marginRight: moderateScale(16),
              height: moderateScale(30),
              width: moderateScale(30),
            }}
            source={imagePath.icHamburger}
            resizeMode="contain"
          />
        </TouchableOpacity> : null}

        <View>
          {!!(profileInfo && profileInfo?.logo) ? (
            <ScaledImage
              width={width / 6}
              source={{
                uri: imageURI,
              }}
            />
          ) : null}
        </View>
        {!!appData?.profile?.preferences?.is_hyperlocal ? (
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigation.navigate(navigationStrings.LOCATION, {
                  type: 'Home1',
                })
              }
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ paddingLeft: 10 }}>
                <Image
                  style={
                    isDarkMode
                      ? {
                        height: 15,
                        width: 15,
                        tintColor: MyDarkTheme.colors.text,
                      }
                      : { height: 15, width: 15 }
                  }
                  source={imagePath.locationSmall}
                />
              </View>
              <View style={{ flex: 0.8, justifyContent: 'center' }}>
                <Text numberOfLines={1} style={styles.address}>
                  {location?.address}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}></View>
        )}
      </View>
      <View style={styles.searchBarLogo}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate(navigationStrings.SEARCHPRODUCTOVENDOR)
          }>
          <Image
            style={isDarkMode ? { tintColor: MyDarkTheme.colors.text } : null}
            source={imagePath.search}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
