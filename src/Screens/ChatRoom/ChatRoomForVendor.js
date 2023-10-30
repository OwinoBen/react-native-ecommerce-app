import React, {useState, useCallback, useRef} from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import socketServices from '../../utils/scoketService';
import {useSelector} from 'react-redux';
import {useDarkMode} from 'react-native-dynamic';
import imagePath from '../../constants/imagePath';
import Header from '../../Components/Header';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import colors from '../../styles/colors';
import {MyDarkTheme} from '../../styles/theme';
import WrapperContainer from '../../Components/WrapperContainer';
import actions from '../../redux/actions';
import {textScale} from '../../styles/responsiveSize';
import _ from 'lodash';
import {showError} from '../../utils/helperFunctions';
import navigationStrings from '../../navigation/navigationStrings';
import stylesFun from './styles';
import moment from 'moment';
import CircularImages from '../../Components/CircularImages';
import strings from '../../constants/lang';

export default function ChatRoomForVendor({navigation, route}) {
  const theme = useSelector((state) => state?.initBoot?.themeColor);
  const toggleTheme = useSelector((state) => state?.initBoot?.themeToggle);
  const {appData, currencies, languages, appStyle} = useSelector(
    (state) => state.initBoot,
  );

  const {dineInType} = useSelector((state) => state?.home);
  const fontFamily = appStyle?.fontSizeData;
  const userData = useSelector((state) => state?.auth?.userData);
  const darkthemeusingDevice = useDarkMode();
  const isDarkMode = toggleTheme ? darkthemeusingDevice : theme;
  const paramData = route?.params;
  console.log(paramData, 'paramData...paramData');
  const styles = stylesFun({fontFamily, isDarkMode});
  const [state, setState] = useState({roomData: [], isLoading: true});
  const {roomData, isLoading} = state;
  const updateState = (data) => setState((state) => ({...state, ...data}));
  const roomDataRef = useRef([]);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      if (!userData?.auth_token) {
        actions.setAppSessionData('on_login');
        return;
      }
      fetchData();
    }, [navigation]),
  );
  useFocusEffect(
    useCallback(() => {
      if (!!userData?.auth_token) {
        socketServices.on('new-app-message', (data) => {
          console.log('listen in roomChat screen');
          fetchData();
        });
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
        type: 'vendor_to_user',
        db_name: appData?.profile?.database_name,
        client_id: String(appData?.profile.id),
        order_user_id: String(userData?.id),
      };

      console.log('api data+++', apiData);
      const res = await actions.fetchUserChat(apiData, headerData);
      updateState({isLoading: false});
      if (!!res?.roomData && !_.isEmpty(res?.roomData) && isFocused) {
        roomDataRef.current = res.roomData;
        updateState({roomData: res.roomData});
      }
      console.log('room res++++', res);
    } catch (error) {
      console.log('error raised in start chat api', error);
      showError(error?.message);
      updateState({isLoading: false});
    }
  };
  const goToChatRoom = useCallback((item) => {
    navigation.navigate(navigationStrings.CHAT_SCREEN_FOR_VENDOR, {
      data: {...item, id: item?.order_vendor_id},
    });
  }, []);
  const renderItem = useCallback(({item, index}) => {
    let isAnyMessage = _.isEmpty(item?.chat_Data);
    return (
      <TouchableOpacity
        onPress={() => goToChatRoom(item)}
        style={{
          ...styles.sahdowStyle,
          backgroundColor: isDarkMode ? colors.whiteOpacity22 : colors.white,
        }}>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
      </TouchableOpacity>
    );
  }, []);
  const listEmptyComponent = useCallback(() => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
        centerTitle={strings.CHAT_ROOM}
      />
      <View style={styles.container}>
        <FlatList
          data={roomData}
          renderItem={renderItem}
          ListEmptyComponent={!isLoading && listEmptyComponent}
          keyExtractor={awesomeChildListKeyExtractor}
          ItemSeparatorComponent={itemSeparatorComponent}
          contentContainerStyle={{flexGrow: 1}}
        />
      </View>
    </WrapperContainer>
  );
}
