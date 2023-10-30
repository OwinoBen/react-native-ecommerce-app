import LottieView from 'lottie-react-native';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {useDarkMode} from 'react-native-dynamic';
// import { getBundleId } from 'react-native-device-info';
import {useSelector} from 'react-redux';
import ButtonWithLoader from '../../../Components/ButtonWithLoader';
import {searchingLoader} from '../../../Components/Loaders/AnimatedLoaderFiles';
import imagePath from '../../../constants/imagePath';
import strings from '../../../constants/lang';
import colors from '../../../styles/colors';
import commonStylesFun from '../../../styles/commonStyles';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../../styles/responsiveSize';
import {MyDarkTheme} from '../../../styles/theme';
import {appIds} from '../../../utils/constants/DynamicAppKeys';
import stylesFun from './styles';
import DeviceInfo, {getBundleId} from 'react-native-device-info';

export default function ({
  isWaitingOver = false,
  cancleOrder = () => {},
  isBtnLoader = false,
  scheduleDate=null
  
}) {
  const {appData, themeColors, appStyle} = useSelector(
    (state) => state?.initBoot,
  );

  // alert(isShowRating);
  const fontFamily = appStyle?.fontSizeData;
  const currencies = useSelector((state) => state?.initBoot?.currencies);
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const styles = stylesFun({fontFamily, themeColors});
  const commonStyles = commonStylesFun({fontFamily});
  const {profile} = appData;

  //give review and update the rate

  return (
    <View
      style={{
        paddingHorizontal: 10,
        zIndex: 1000,
        backgroundColor: isDarkMode
          ? MyDarkTheme.colors.background
          : colors.white,
      }}>
        {
          !!scheduleDate ? 
          
          ( <View>
            <Image 
              source={imagePath?.timer}
              style={{
                height:moderateScale(120),
                width:moderateScale(120),
                alignSelf:'center',
                marginVertical:moderateScale(16),
                resizeMode:'contain'
              }}
            />
            <Text 
              style={{
                alignSelf:'center',
                fontFamily:fontFamily?.regular,
                fontSize:moderateScale(16),
                marginBottom:moderateScale(20),
                textAlign:'center'
              }}
            >
             your ride has been schedule for {scheduleDate}
            </Text>
            </View>)
          :(<View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={{
              height: moderateScaleVertical(100),
              width: moderateScale(100),
              // marginVertical: moderateScaleVertical(40),
            }}>
            {(isWaitingOver && !appData?.profile?.preferences?.is_one_push_book_enable)? (
              <View>
                <Image
                  source={imagePath.icNoDrivers}
                  style={{
                    height: moderateScale(110),
                    width: moderateScale(110),
                  }}
                  resizeMode="contain"
                />
              </View>
            ) 
            
            : (
              <View>
                <LottieView
                  source={searchingLoader}
                  autoPlay
                  loop
                  style={{
                    height: moderateScaleVertical(100),
                    width: moderateScale(100),
                  }}
                  colorFilters={[
                    {keypath: 'Shape Layer 16', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 15', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 14', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 13', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 12', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 11', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 10', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 9', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 8', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 7', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 6', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 5', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 20', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 19', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 18', color: themeColors.primary_color},
                    {keypath: 'Shape Layer 17', color: themeColors.primary_color},
                  ]}
                />
              </View>
            )}
          </View>
          {(isWaitingOver  )? (
            <View>
              <Text
                style={{
                  ...styles.DriverUnavailable,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                No drivers available now!!
              </Text>
              <ButtonWithLoader
                btnText={strings.CANCEL_ORDER}
                btnTextStyle={{color: colors.redE}}
                onPress={cancleOrder}
                btnStyle={{borderColor: colors.redE, marginBottom: 40}}
              />
            </View>
          ) : (
            <View>
              <Text
                style={{
                  ...styles.DriverUnavailable,
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                }}>
                {appIds.jiffex == getBundleId()
                  ? strings.CONNECTING_YOU_TO_NEARBY_DELIVERY_AGENT
                  
                  : strings.CONNECTING_YOU_TO_NEARBY_DERIVER}
              </Text>
              <Text
                style={{
                  fontSize: textScale(12),
                  fontFamily: fontFamily.regular,
                  marginVertical: moderateScaleVertical(20),
                  color: isDarkMode ? MyDarkTheme.colors.text : colors.black,
                  alignSelf:'center'
                }}>
                {appIds.jiffex == getBundleId()
                  ? strings.YOUR_ORDER_WILL_START_SOON
                  : strings.YOUR_RIDE_WILL_START_SOON}
              </Text>
            </View>
          )}
        </View>)
        }
      
    </View>
  );
}
