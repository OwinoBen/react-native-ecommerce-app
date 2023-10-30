//import liraries
import {cloneDeep, debounce} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector} from 'react-redux';
import imagePath from '../constants/imagePath';
import actions from '../redux/actions';
import {StartPrinting} from '../Screens/PrinterConnection/PrinteFunc';
import {
  height,
  moderateScale,
  moderateScaleVertical,
} from '../styles/responsiveSize';
import {showError} from '../utils/helperFunctions';
import PendingOrderCard from './PendingOrderCard';

const NotificationModal = () => {
  const pendingNotifications = useSelector(
    (state) => state?.pendingNotifications?.pendingNotifications,
  );
  const {appData, themeColors, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const userData = useSelector((state) => state?.auth?.userData);
  const isVendorNotification = useSelector(
    (state) => state?.pendingNotifications?.isVendorNotification,
  );

  const [state, setState] = useState({
    pageActive: 1,
    acceptLoader: false,
    rejectLoader: false,
    selectedOrder: null,
    isRefreshing: false,
  });

  const {pageActive, acceptLoader, rejectLoader, selectedOrder, isRefreshing} =
    state;

  //update state
  const updateState = (data) => setState((state) => ({...state, ...data}));

  useEffect(() => {
    if (!!userData?.auth_token && isVendorNotification) {
      (async () => {
        try {
          const res = await actions.allPendingOrders(
            `?limit=${10}&page=${pageActive}`,
            {},
            {
              code: appData?.profile?.code,
              currency: currencies?.primary_currency?.id,
              language: languages?.primary_language?.id,
              // systemuser: DeviceInfo.getUniqueId(),
            },
          );
          console.log('pending order res==>>>', res);
          let orders =
            pageActive == 1
              ? res.data.order_list.data
              : [...pendingNotifications, ...res.data.order_list.data];
          actions.pendingNotifications(orders);
        } catch (error) {
          console.log('erro rirased', error);
        }
      })();
    }
  }, [pageActive, isRefreshing, isVendorNotification]);

  const onEndReached = ({distanceFromEnd}) => {
    updateState({pageActive: pageActive + 1});
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const updateOrderStatus = (acceptRejectData, status) => {
    const {vendors} = acceptRejectData;
    console.log('accept rejecte data', acceptRejectData);
    console.log('status', status);
    updateState({selectedOrder: acceptRejectData});
    // return;
    if (status == 7) {
      updateState({acceptLoader: true});
    } else {
      updateState({rejectLoader: true});
    }
    let data = {};
    data['order_id'] = acceptRejectData?.id;
    data['vendor_id'] = vendors[0]?.vendor_id;
    data['order_status_option_id'] = status;
    actions
      .updateOrderStatus(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'res>>>acceptRejectOrder');
        if (res && res.status == 'success') {
          if (status == 7) {
            StartPrinting({id: acceptRejectData?.id});
          }
          updateLocalStatus(res, acceptRejectData);
          return;
        }
        updateState({
          acceptLoader: false,
          rejectLoader: false,
          selectedOrder: null,
        });
      })
      .catch(errorMethod);
  };

  const errorMethod = (error) => {
    console.log(error, 'error');
    updateState({
      isRefreshing: false,
      acceptLoader: false,
      rejectLoader: false,
      selectedOrder: null,
    });
    showError(error?.message || error?.error);
  };

  const updateLocalStatus = (res, acceptRejectData) => {
    let clonedArrayOrderList = cloneDeep(pendingNotifications);
    let updateOrders = clonedArrayOrderList.filter((i, inx) => {
      if (i?.id !== acceptRejectData?.id) {
        return i;
      }
    });
    actions.pendingNotifications(updateOrders);
    actions.isVendorNotification(false);
    updateState({
      acceptLoader: false,
      rejectLoader: false,
      selectedOrder: null,
    });
  };

  const renderItem = ({item}) => {
    return (
      <PendingOrderCard
        data={item}
        onPress={() => {}}
        updateOrderStatus={(data, status) => updateOrderStatus(data, status)}
        acceptLoader={acceptLoader}
        rejectLoader={rejectLoader}
        selectedOrder={selectedOrder}
      />
    );
  };

  const renderContent = () => (
    <View style={{height: height / 1.2, alignItems: 'center'}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={pendingNotifications}
        renderItem={renderItem}
        onEndReached={onEndReachedDelayed}
        keyExtractor={(item) => (!!item?.id ? item.id.toString() : '')}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View style={{height: moderateScale(100)}} />
        )}
        ListHeaderComponent={() => <View style={{height: moderateScale(10)}} />}
        ItemSeparatorComponent={() => (
          <View style={{marginBottom: moderateScaleVertical(12)}} />
        )}
      />
    </View>
  );

  return (
    <Modal
      isVisible={!!pendingNotifications.length && isVendorNotification}
      style={{
        margin: 0,
        justifyContent: 'flex-end',
      }}>
      <View style={{height: height / 1.8, alignItems: 'center'}}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{marginBottom: moderateScaleVertical(8)}}
          onPress={() => actions.isVendorNotification(false)}>
          <Image source={imagePath.close2} />
        </TouchableOpacity>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={pendingNotifications}
          renderItem={renderItem}
          onEndReached={onEndReachedDelayed}
          keyExtractor={(item) => (!!item?.id ? item.id.toString() : '')}
          onEndReachedThreshold={0.5}
          // ListFooterComponent={() => <View style={{ height: moderateScale(100) }} />}
          ListHeaderComponent={() => (
            <View style={{height: moderateScale(10)}} />
          )}
          ItemSeparatorComponent={() => (
            <View style={{marginBottom: moderateScaleVertical(12)}} />
          )}
        />
      </View>
    </Modal>
    // <BottomSheet
    //     renderHeader={() => <View style={{
    //         ...styles.toolTipStyle,
    //         backgroundColor: themeColors.primary_color,
    //     }} />}
    //     snapPoints={[height / 1.2, height / 3, 0]}
    //     borderRadius={10}
    //     renderContent={renderContent}
    // />
  );
};

const styles = StyleSheet.create({
  toolTipStyle: {
    height: moderateScale(8),
    alignItems: 'center',
    width: moderateScale(30),
    borderRadius: moderateScale(10),
    alignSelf: 'center',
    marginVertical: moderateScale(10),
  },
});

export default React.memo(NotificationModal);
