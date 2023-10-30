import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Elevations from 'react-native-elevation';
import {SvgUri} from 'react-native-svg';
import {useSelector} from 'react-redux';
import colors from '../styles/colors';
import {moderateScale, textScale, width} from '../styles/responsiveSize';
import {MyDarkTheme} from '../styles/theme';
import {getImageUrl} from '../utils/helperFunctions';
import {useDarkMode} from 'react-native-dynamic';

const ServiceCategoryCard = ({data = {}, onPress = () => {}}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;
  const imageURI = getImageUrl(
    data?.icon?.proxy_url,
    data?.icon?.image_path,
    '800/400',
  );

  const isSVG = imageURI ? imageURI.includes('.svg') : null;

  return (
    <View
      style={{
        width: width / 3,
        marginBottom: moderateScale(10),
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={{
          height: moderateScale(115),
          width: moderateScale(115),
          // shadowOpacity: 0.5,
          marginVertical: moderateScale(5),
          marginHorizontal: moderateScale(2),
          borderRadius: moderateScale(5),
          backgroundColor: isDarkMode
            ? MyDarkTheme.colors.lightDark
            : colors.greyMedium,
          // alignItems: 'center',
          // justifyContent: "center",
          // ...Elevations[2],
          // borderWidth: 0.5,
          borderColor: isDarkMode ? MyDarkTheme.colors.lightDark : '#979797',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {isSVG ? (
            <SvgUri
              height={moderateScale(80)}
              width={moderateScale(80)}
              style={{
                marginHorizontal: moderateScale(5),
                position: 'absolute',
                // right: 0,
                // bottom: 0,
              }}
              uri={imageURI}
            />
          ) : (
            <View
              style={{
                height: moderateScale(50),
                width: moderateScale(50),
                // borderRadius: 15,
                overflow: 'hidden',
              }}>
              <Image
                style={{flex: 1}}
                source={{
                  uri: imageURI,
                }}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={{}}>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: textScale(11),
            // marginLeft: moderateScale(15),
            marginTop: moderateScale(5),
            color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
          }}>
          {data.name}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
export default React.memo(ServiceCategoryCard);
