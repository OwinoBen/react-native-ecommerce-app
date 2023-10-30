import React, {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useSelector} from 'react-redux';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang/index';
import colors from '../../styles/colors';
import {moderateScaleVertical} from '../../styles/responsiveSize';
import CardViewNotification from './CardViewNotification';
import stylesFunc from './styles';
export default function Notifications({navigation}) {
  const currentTheme = useSelector((state) => state.appTheme);
  const {themeColors, themeLayouts} = currentTheme;
  const {appStyle} = useSelector((state) => state?.initBoot);
  const fontFamily = appStyle?.fontSizeData;

  const styles = stylesFunc({themeColors, fontFamily});

  const [state, setState] = useState({
    notificationsList: [
      {
        id: 1,
        message: 'Your order has been confirmed.',
        time: '15 mins ago',
        status: 'new',
      },
      {
        id: 2,
        message: '50% Promo wiil be expire on today .Hurry up!!!.',
        time: '15 mins ago',
        status: 'new',
      },
      {
        id: 3,
        message: 'Your order has been Canceled Successfully.',
        time: '15 mins ago',
        status: 0,
      },
      {
        id: 4,
        message: 'Your order has been confirmed.',
        time: '15 mins ago',
        status: 0,
      },
      {
        id: 5,
        message: 'Get 15% off on your First Order.',
        time: '15 mins ago',
        status: 0,
      },
      {
        id: 6,
        message: 'Your Card has been Added successfully.',
        time: '15 mins ago',
        status: 0,
      },
      {
        id: 7,
        message: '50% Promo wiil be expire on...',
        time: '15 mins ago',
        status: 0,
      },
      {
        id: 8,
        message: 'Your order has been confirmed.',
        time: '15 mins ago',
        status: 0,
      },
    ],
  });
  const {notificationsList} = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  const renderOrders = ({item, index}) => {
    return <CardViewNotification data={item} />;
  };

  return (
    <WrapperContainer
      bgColor={colors.backgroundGreyC}
      statusBarColor={colors.backgroundGreyC}>
      <Header
        leftIcon={imagePath.cross}
        centerTitle={strings.NOTIFICATION}
        headerStyle={{backgroundColor: colors.backgroundGreyC}}
      />

      <View style={styles.headerLine} />
      {/* Notification listing*/}

      <SwipeListView
        data={notificationsList}
        renderItem={renderOrders}
        keyExtractor={(item, index) => String(index)}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            {/* <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={() => closeRow(rowMap, data.item.key)}
                    >
                        <Text style={styles.backTextWhite}>Close</Text>
                    </TouchableOpacity> */}
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              // onPress={() => deleteRow(rowMap, data.item.key)}
            >
              <Image source={imagePath.delete} />
            </TouchableOpacity>
          </View>
        )}
        disableRightSwipe
        leftOpenValue={75}
        rightOpenValue={-150}
        previewRowKey={'0'}
        previewOpenDelay={3000}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: moderateScaleVertical(20),
          paddingBottom: moderateScaleVertical(80),
        }}
        ItemSeparatorComponent={() => <View style={{height: 20}} />}
        ListFooterComponent={() => <View style={{height: 20}} />}
      />
    </WrapperContainer>
  );
}
