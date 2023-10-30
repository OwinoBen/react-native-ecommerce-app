import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import strings from '../constants/lang';
import commonStylesFunc from '../styles/commonStyles';
import { moderateScale, moderateScaleVertical } from '../styles/responsiveSize';
import { getImageUrl } from '../utils/helperFunctions';
import ProgressiveImage from './ProgressiveImage';

const OffersCard = ({ data = {}, onPress = () => { } }) => {
  const { appStyle, themeColors } = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;
  const commonStyles = commonStylesFunc({ fontFamily });
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        borderRadius: 3,
        ...commonStyles.shadowStyle,
      }}>
      <ProgressiveImage
        source={{
          uri: getImageUrl(
            data?.image?.proxy_url,
            data?.image?.image_path,
            '600/400',
          ),
        }}
        borderRadius={0}
        height={moderateScaleVertical(169)}
        borderStyle={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
        width={'100%'}
      />
      <View
        style={{
          marginHorizontal: moderateScale(20),
          marginVertical: moderateScaleVertical(16),
        }}>
        <Text
          numberOfLines={2}
          style={{
            ...commonStyles.futuraHeavyBt,
            lineHeight: moderateScaleVertical(20),
          }}>
          {data?.short_desc}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            ...commonStyles.mediumFont14,
            opacity: 0.5,
            marginTop: moderateScaleVertical(5),
          }}>
          {`${strings.COUPON} ${data?.name}`}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: moderateScaleVertical(7),
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...commonStyles.futuraHeavyBt,
              color: themeColors.primary_color,
              opacity: 1,
            }}>
            {strings.APPLYSMALL}
          </Text>
          {/* <Image style={{marginLeft: 12}} source={imagePath.rightBlue} /> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default React.memo(OffersCard);
