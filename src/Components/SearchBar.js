import React from 'react';
import {
  I18nManager,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import colors from '../styles/colors';
import {moderateScale, moderateScaleVertical} from '../styles/responsiveSize';
import {useDarkMode} from 'react-native-dynamic';
import {MyDarkTheme} from '../styles/theme';
import {voiceListen} from './Loaders/AnimatedLoaderFiles';
import LottieView from 'lottie-react-native';

const SearchBar = ({
  containerStyle = {},
  placeholder = '',
  onChangeText,
  showRightIcon = false,
  rightIconPress = () => {},
  searchValue = '',
  rightIconStyle,
  autoFocus,
  isVoiceRecord = false,
  onVoiceStop = () => {},
  onVoiceListen = () => {},
  showVoiceRecord = true,
  isEditableFalse,
}) => {
  const theme = useSelector((state) => state?.initBoot?.themeColor);

  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const {appStyle, themeColors} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: moderateScale(16),
        height: moderateScaleVertical(48),
        backgroundColor: colors.white,
        alignItems: 'center',
        ...containerStyle,
      }}>
      <Image
        style={{
          tintColor: isDarkMode ? MyDarkTheme.colors.text : colors.blackLight,
        }}
        source={imagePath.icSearchb}
      />
      <View style={{flex: 1, marginLeft: 10}}>
        <TextInput
          style={{
            flex: 1,
            paddingTop: 0,
            paddingBottom: 0,
            fontFamily: fontFamily.medium,
            color: isDarkMode ? MyDarkTheme.colors.text : colors.textGrey,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
          }}
          value={searchValue}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onChangeText={onChangeText}
          //onChange={onChangeText}
          placeholderTextColor={
            isDarkMode ? MyDarkTheme.colors.text : colors.textGreyB
          }
          returnKeyType={'next'}
          editable={isEditableFalse ? !isEditableFalse : true}
          // selectTextOnFocus={false}
        />
      </View>
      {
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {showVoiceRecord ? (
            <View>
              {isVoiceRecord ? (
                <TouchableOpacity onPress={onVoiceStop}>
                  <LottieView
                    style={{
                      height: moderateScale(34),
                      width: moderateScale(34),
                      marginLeft: moderateScale(3),
                    }}
                    source={voiceListen}
                    autoPlay
                    loop
                    colorFilters={[
                      {keypath: 'layers', color: themeColors.primary_color},
                      {
                        keypath: 'transparent2',
                        color: themeColors.primary_color,
                      },
                      {
                        keypath: 'transparent1',
                        color: themeColors.primary_color,
                      },
                      {keypath: '01', color: themeColors.primary_color},
                      {keypath: '02', color: themeColors.primary_color},
                      {keypath: '03', color: themeColors.primary_color},
                      {keypath: '04', color: themeColors.primary_color},
                    ]}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={onVoiceListen}>
                  <Image
                    source={imagePath.icVoice}
                    style={{
                      height: moderateScale(20),
                      width: moderateScale(20),
                      borderRadius: moderateScale(10),
                      tintColor: themeColors.primary_color,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          <View>
            {showRightIcon && (
              <TouchableOpacity
                style={{marginLeft: moderateScale(5)}}
                onPress={rightIconPress}>
                <Image
                  source={imagePath.crossBlueB}
                  style={{...rightIconStyle}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      }
    </View>
  );
};
export default React.memo(SearchBar);
