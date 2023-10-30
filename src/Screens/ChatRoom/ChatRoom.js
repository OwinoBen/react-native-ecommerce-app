import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import CircularImages from '../../Components/CircularImages';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import { moderateScale, textScale } from '../../styles/responsiveSize';
import { MyDarkTheme } from '../../styles/theme';
import { showError } from '../../utils/helperFunctions';
import socketServices from '../../utils/scoketService';
import stylesFun from './styles';

export default function ChatRoom({ navigation, route }) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const {appData, currencies, languages, appStyle} = useSelector((state) => state.initBoot || {});
  const {dineInType} = useSelector((state) => state?.home);
  const fontFamily = appStyle?.fontSizeData;
  const userData = useSelector((state) => state?.auth?.userData);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  console.log(paramData, 'paramData....paramData');
  const styles = stylesFun({ fontFamily, isDarkMode });
  const [state, setState] = useState({ roomData: [], isLoading: true });
  const { roomData, isLoading } = state;
  const updateState = (data) => setState((state) => ({ ...state, ...data }));
  const roomDataRef = useRef([]);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      if (userData?.auth_token) {
        fetchData();
      }
    }, [navigation]),
  );
  useFocusEffect(
    useCallback(() => {
      if (!userData?.auth_token) {
        actions.setAppSessionData('on_login');
        return;
      }
      if (!!userData?.auth_token && !appData?.profile?.socket_url) {
        showError('Invalid socket url');
        return;
      } else {
        if (socketServices) {
          socketServices.on('new-app-message', (data) => {
            fetchData();
          });
        }
        return () => {
          socketServices.removeListener('new-app-message');
        };
      }
    }, [navigation]),
  );
  console.log('paramDataparamData', appData);
  const fetchData = async () => {
    try {
      let headerData = {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
      };
      let apiData = {
        sub_domain: '192.168.101.88', //this is static value
        type:
          dineInType == 'p2p'
            ? 'user_to_user'
            : paramData?.type == 'agent_chat'
              ? 'agent_to_user'
              : 'vendor_to_user',
        db_name: appData?.profile?.database_name,
        client_id: String(appData?.profile.id),
        p2p_id: String(userData?.vendor_id),
        vendor_id: String(userData?.vendor_id),
      };
      if (paramData?.allVendors) {
        apiData['vendor_id'] = paramData?.allVendors.map((val) => val.id);
      } else {
        apiData['order_user_id'] = String(userData?.id);
      }
      console.log('api data+++', apiData);
      const res =
        dineInType == 'p2p'
          ? await actions.fetchP2pUserToUsertChat(apiData, headerData)
          : paramData?.type == 'user_chat'
            ? await actions.fetchUserChat(apiData, headerData)
            : paramData?.type == 'vendor_chat'
              ? await actions.fetchVendorChat(apiData, headerData)
              : await actions.fetchAgentChat(apiData, headerData);
      updateState({ isLoading: false });
      if (!!res?.roomData && !_.isEmpty(res?.roomData) && isFocused) {
        roomDataRef.current = res.roomData;
        updateState({ roomData: res.roomData });
      }
      console.log('room res++++', res);
    } catch (error) {
      console.log('error raised in start chat api', error);
      showError(error?.message);
      updateState({ isLoading: false });
    }
  };
  const goToChatRoom = useCallback((item) => {
    navigation.navigate(navigationStrings.CHAT_SCREEN, {
      data: { ...item, id: item?.order_vendor_id },
    });
  }, []);
  const renderItem = useCallback(({ item, index }) => {
    let isAnyMessage = _.isEmpty(item?.chat_Data);
    return (
      <TouchableOpacity
        onPress={() => goToChatRoom(item)}
        style={{
          ...styles.sahdowStyle,
          backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,
        }}>
        <View>
          {dineInType == 'p2p' ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 0.85,
                }}>
                <FastImage
                  source={
                    _.isEmpty(item?.user_Data)
                      ? imagePath.icDefaultImg
                      : { uri: item?.user_Data[0]?.display_image }
                  }
                  resizeMode={'cover'}
                  style={{
                    width: moderateScale(40),
                    height: moderateScale(40),
                    borderRadius: moderateScale(40) / 2,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                />

                <View
                  style={{
                    marginLeft: moderateScale(5),
                    alignItems: 'flex-start',
                  }}>
                  {!isAnyMessage ? (
                    <Text
                      style={{
                        fontFamily: fontFamily?.bold,
                        color: colors.black,
                      }}>
                      {userData?.vendor_id == item?.vendor_id
                        ? item?.user_Data[0]?.username
                        : item?.vendor_name}{' '}
                      {!!item?.product_name ? `(${item?.product_name})` : ''}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: fontFamily?.bold,
                        color: colors.black,
                      }}>
                      {item?.vendor_name || userData?.name}
                      {!!item?.product_name ? ` (${item?.product_name})` : ''}
                    </Text>
                  )}

                  <Text numberOfLines={2} style={styles.textDesc}>
                    {!isAnyMessage ? (
                      item?.chat_Data[0]?.message
                    ) : (
                      <Text
                        style={{
                          fontFamily: fontFamily?.regular,
                          fontSize: textScale(10),
                          color: colors.blueB,
                        }}>
                        • New Chat
                      </Text>
                    )}
                  </Text>
                </View>
              </View>

              {!isAnyMessage ? (
                <View>
                  <Text style={styles.timeStyle}>
                    {moment(item?.chat_Data[0]?.created_date).format(
                      'DD/MM/YYYY',
                    )}
                  </Text>
                  <Text style={{ ...styles.timeStyle, textAlign: 'right' }}>
                    {moment(item?.chat_Data[0]?.created_date).format('hh:mm A')}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.timeStyle}>
                    {moment(item?.created_date).format('DD/MM/YYYY')}
                  </Text>
                  <Text style={{ ...styles.timeStyle, textAlign: 'right' }}>
                    {moment(item?.created_date).format('hh:mm A')}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View>
              <View style={styles.flexView}>
                <Text style={styles.textStyle}>
                  <Text>{strings.ORDER}</Text> # {item?.room_id}
                </Text>
                {!isAnyMessage ? (
                  <Text style={styles.timeStyle}>
                    {moment(item?.chat_Data[0]?.created_date).format('LLL')}
                  </Text>
                ) : null}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {_.isEmpty(item?.user_Data) ? null : (
                  <CircularImages
                    fontFamily={fontFamily}
                    isDarkMode={isDarkMode}
                    data={item?.user_Data}
                  />
                )}
                {!isAnyMessage ? (
                  <Text numberOfLines={2} style={styles.textDesc}>
                    {item?.chat_Data[0]?.message}
                  </Text>
                ) : null}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }, []);
  const listEmptyComponent = useCallback(() => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: textScale(16),
            fontFamily: fontFamily.bold,
            color: isDarkMode ? colors.white : colors.black,
          }}>
          {strings.CHAT_EMPTY_ROOM}
        </Text>
      </View>
    );
  }, []);
  const awesomeChildListKeyExtractor = useCallback(
    (item) => `awesome-child-key-${item?._id}`,
    [roomData],
  );
  const itemSeparatorComponent = useCallback(() => {
    return <View style={styles.borderStyle} />;
  }, []);
  return (
    <WrapperContainer
      bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}
      statusBarColor={colors.white}
      isLoading={isLoading}>
      <Header
        leftIcon={
          appStyle?.homePageLayout === 2
            ? imagePath.backArrow
            : appStyle?.homePageLayout === 3 || appStyle?.homePageLayout === 5
              ? imagePath.icBackb
              : imagePath.back
        }
        noLeftIcon={dineInType == 'p2p'}
        centerTitle={strings.CHAT_ROOM}
      />
      <View style={styles.container}>
        <FlatList
          data={roomData}
          renderItem={renderItem}
          ListEmptyComponent={!isLoading && listEmptyComponent}
          keyExtractor={awesomeChildListKeyExtractor}
          ItemSeparatorComponent={itemSeparatorComponent}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      </View>
    </WrapperContainer>
  );
}
