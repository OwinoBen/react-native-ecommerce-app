import React from 'react';
import { Text, View } from 'react-native';
import CardLoader from '../../../Components/Loaders/CardLoader';
import colors from '../../../styles/colors';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../../styles/responsiveSize';
import { useDarkMode } from 'react-native-dynamic';
import { useSelector } from 'react-redux';

export default function ListEmptyCar({ isLoading = false }) {

  const {themeToggle, themeColor} = useSelector((state) => state?.initBoot)
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;

  if (isLoading) {
    return (
      <View style={{ marginTop: moderateScaleVertical(16) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CardLoader
              cardWidth={width / 6}
              height={moderateScaleVertical(40)}
              listSize={1}
              containerStyle={{
                marginLeft: moderateScale(16),
                //   backgroundColor: colors.white,
                justifyContent: 'center',
              }}
            />
            <View>
              <CardLoader
                cardWidth={width / 5}
                height={moderateScaleVertical(10)}
                listSize={1}
                containerStyle={{
                  marginLeft: moderateScale(16),
                  color: colors.white,
                }}
              />
              <CardLoader
                cardWidth={width / 6}
                height={moderateScaleVertical(8)}
                listSize={1}
                containerStyle={{
                  marginLeft: moderateScale(16),
                  color: colors.white,
                }}
              />
            </View>
          </View>

          <CardLoader
            cardWidth={width / 6}
            height={moderateScaleVertical(14)}
            listSize={1}
            containerStyle={{
              marginRight: moderateScale(16),
              // backgroundColor: colors.white,
              justifyContent: 'center',
            }}
          />
        </View>
        <View

          style={{
            borderBottomColor: isDarkMode
              ? colors.whiteOpacity22
              : colors.lightGreyBg,
            borderBottomWidth: 0.6,
            marginTop:moderateScaleVertical(8)
          }}
        />
      </View>
    );
  }
  return (
    <View>
      <Text></Text>
    </View>
  );
}
