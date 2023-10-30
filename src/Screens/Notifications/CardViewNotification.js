import React from 'react';
import {Image, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import imagePath from '../../constants/imagePath';
import colors from '../../styles/colors';
import {moderateScale} from '../../styles/responsiveSize';
import stylesFunc from './styles';

export default function CardViewNotification({data = {}, conatinerStyle}) {
  const {appStyle} = useSelector((state) => state?.initBoot);

  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({fontFamily});
  return (
    <View style={[styles.container, conatinerStyle]}>
      <View style={{flex: 0.15, justifyContent: 'center'}}>
        <Image source={imagePath.notif} />
      </View>
      <View
        style={{
          flex: data && data.status ? 0.7 : 0.85,
          justifyContent: 'center',
        }}>
        <Text numberOfLines={1} style={styles.message}>
          {data.message}
        </Text>
        <Text style={styles.time}>{data.time}</Text>
      </View>
      {data && data.status ? (
        <View style={{flex: 0.15, justifyContent: 'center'}}>
          <View
            style={{
              padding: 5,
              alignItems: 'center',
              backgroundColor: colors.yellowB,
              borderRadius: moderateScale(5),
            }}>
            <Text style={styles.status}>{data.status}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
