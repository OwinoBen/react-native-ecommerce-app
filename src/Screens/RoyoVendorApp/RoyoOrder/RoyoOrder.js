import React, {useEffect, useState, useRef} from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import SunmiV2Printer from 'react-native-sunmi-v2-printer';
import {useSelector} from 'react-redux';
import Header from '../../../Components/Header';
import {loaderOne} from '../../../Components/Loaders/AnimatedLoaderFiles';
import MultiScreen from '../../../Components/MultiScreen';
import * as RNLocalize from 'react-native-localize';
import OrderCard from '../../../Components/OrderCard';
import SelectVendorListModal from '../../../Components/SelectVendorListModal';
import WrapperContainer from '../../../Components/WrapperContainer';
import imagePath from '../../../constants/imagePath';
import navigationStrings from '../../../navigation/navigationStrings';
import actions from '../../../redux/actions';
import colors from '../../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../../styles/responsiveSize';
import {showError} from '../../../utils/helperFunctions';
import {getItem} from '../../../utils/utils';
import stylesFunc from './styles';
import _, {debounce} from 'lodash';
import strings from '../../../constants/lang';

let dataLimit = 20;
let vendorLimit = 50;

const RoyoOrder = (props) => {
  const {navigation, route} = props;
  const {params} = route;
  const currentTheme = useSelector((state) => state.initBoot);
  const {storeSelectedVendor} = useSelector((state) => state?.order);
  const {appData, appStyle, currencies, languages} = useSelector(
    (state) => state?.initBoot,
  );
  const {themeColors, themeLayouts} = currentTheme;
  const fontFamily = appStyle?.fontSizeData;
  const styles = stylesFunc({fontFamily, themeColors});

  const [availVendor, setAvailVendor] = useState([]);
  const [data, setData] = useState([]);
  const dataPage = useRef(1);
  const dataLoadMore = useRef(true);
  const vendorPage = useRef(1);
  const vendorLoadMore = useRef(true);

  const [state, setState] = useState({
    isLoading: true,
    isLoadingB: false,
    isRefreshing: false,
    activeIndex: 0,
    isBleDevice: false,
    isVendorSelectModal: false,
  });
  const {
    isLoadingB,
    isLoading,
    isRefreshing,
    activeIndex,
    isBleDevice,
    isVendorSelectModal,
  } = state;

  const updateState = (data) => setState((state) => ({...state, ...data}));

  //reset pagination values
  useEffect(() => {
    const focus = navigation.addListener('focus', () => {
      dataPage.current = 1;
      vendorPage.current = 1;
      vendorLoadMore.current = true;
      dataLoadMore.current = true;
    });
    const blur = navigation.addListener('blur', () => {
      dataPage.current = 1;
      vendorPage.current = 1;
      vendorLoadMore.current = true;
      dataLoadMore.current = true;
    });
    return focus, blur;
  }, []);

  useEffect(() => {
    if (params) {
      console.log('focused order screen >>>> ', params);
      updateState({activeIndex: params?.index});
    }
  }, [params]);

  useEffect(() => {
    fetchAllVendors();
    _getBleDevice();
  }, []);

  useEffect(() => {
    getAllVendorOrder();
  }, [activeIndex, storeSelectedVendor]);

  const selectedOrder = (index) => {
    dataPage.current = 1;
    dataLoadMore.current = true;
    updateState({activeIndex: index});
  };

  const orderType = (inx) => {
    let type = '';
    switch (inx) {
      case 0:
        type = 'pending';
        return type;
      case 1:
        type = 'active';
        return type;
      case 2:
        type = 'cancelled';
        return type;
      case 3:
        type = 'completed';
        return type;
      default:
        return type;
    }
  };
  
  const getAllVendorOrder = async (isRefreshing = false) => {
    if (!isRefreshing) {
      updateState({ isLoadingB: true })
    }
    let type = orderType(activeIndex)
    console.log(activeIndex, "type++++", type)
    let query = `/${storeSelectedVendor?.id}?limit=${dataLimit}&page=${dataPage.current}&type=${type}`
    let headers = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,   
      language: languages?.primary_language?.id,
      timezone: RNLocalize.getTimeZone(),
    }
    console.log("sending query", query,headers)
    try {
      const res = await actions.allVendorOrders(query, headers)
      console.log("all vendor orders", res.data)
      if (res.data.data.length == 0) {
        dataLoadMore.current = false
      }
      let mergeData = dataPage.current == 1 ? res.data.data : [...data, ...res.data.data]
      setData(mergeData)
      updateState({ isLoadingB: false, isRefreshing: false })
    } catch (error) {
      console.log('error riased', error)
      showError(error?.error)
      updateState({ isLoadingB: false, isRefreshing: false })
    }
  }

  const _getBleDevice = async () => {
    if (Platform.OS == 'android') {
      const res = await getItem('BleDevice');
      const sunmiPrinterAvail = await SunmiV2Printer.hasPrinter;
      if (!!res || sunmiPrinterAvail) {
        updateState({
          isBleDevice: true,
        });
      } else {
        updateState({
          isBleDevice: false,
        });
      }
    }
  };

  const fetchAllVendors = async (value = null) => {
    let query = `?limit=${vendorLimit}&page=${vendorPage.current}`;
    let headers = {
      code: appData?.profile?.code,
      currency: currencies?.primary_currency?.id,
      language: languages?.primary_language?.id,
    };
    try {
      const res = await actions.storeVendors(query, headers);
      console.log('available vendors res', res);
      if (res.data.data.length == 0) {
        vendorLoadMore.current = false;
      }
      if (!!res?.data && res.data.data.length > 0) {
        let meregeData =
          vendorPage.current == 1
            ? res?.data?.data
            : [...availVendor, ...res?.data?.data];
        setAvailVendor(meregeData);
      }
    } catch (error) {
      console.log('error riased', error);
      showError(error?.message);
    }
  };

  //error handling
  const errorMethod = (error) => {
    updateState({
      isLoading: false,
      isLoadingB: false,
      isLoadingC: false,
      isRefreshing: false,
    });
    showError(error?.message || error?.error);
  };
const removeItemfromData=(id)=>{
     let newarray=[...data]
     newarray =newarray.filter(item=>item.id!==id)
     setData(newarray)
    
}
  const updateOrderStatus = (acceptRejectData, status) => {
    console.log(acceptRejectData, 'item');
    let data = {};
    data['order_id'] = acceptRejectData?.id;
    data['vendor_id'] = storeSelectedVendor?.id;
    data['order_status_option_id'] = status;
    updateState({isLoadingB: true});
    actions
      .updateOrderStatus(data, {
        code: appData?.profile?.code,
        currency: currencies?.primary_currency?.id,
        language: languages?.primary_language?.id,
        // systemuser: DeviceInfo.getUniqueId(),
      })
      .then((res) => {
        console.log(res, 'statausss');

        if (res && res.status == 'success') {
          // getAllVendorOrder(storeSelectedVendor?.id);
          removeItemfromData(acceptRejectData?.id)
        }
        updateState({
          isLoadingB: false,
        });
      })
      .catch(errorMethod);
  };

  //Pull to refresh
  const handleRefresh = () => {
    updateState({isRefreshing: true});
    dataPage.current = 1;
    vendorPage.current = 1;
    vendorLoadMore.current = true;
    dataLoadMore.current = true;
    getAllVendorOrder(true);
  };

  //pagination of data
  const onEndReached = ({distanceFromEnd}) => {
    if (dataLoadMore.current) {
      dataPage.current = dataPage.current + 1;
      getAllVendorOrder(true);
    }
  };

  const onEndReachedDelayed = debounce(onEndReached, 1000, {
    leading: true,
    trailing: false,
  });

  const _reDirectToVendorList = () => {
    updateState({
      isVendorSelectModal: true,
    });
  };

  const onVendorSelect = (item) => {
    updateState({isVendorSelectModal: false, pageNo: 1});
    setTimeout(() => {
      actions.savedSelectedVendor(item);
    }, 500);
  };

  const orderDetail = (item) => {
    navigation.navigate(navigationStrings.ORDER_DETAIL, {
      data: item,
      selectedVendor: storeSelectedVendor,
    });
  };
  const renderOrders = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => orderDetail(item)}
        activeOpacity={0.8}
        style={{
          // marginLeft: customMarginLeftForBox(index),
          flex: 1,
          paddingHorizontal: moderateScale(20),
        }}>
        <OrderCard
          updateOrderStatus={updateOrderStatus}
          onPress={() => orderDetail(item)}
          item={item}
          isBleDevice={isBleDevice}
        />
      </TouchableOpacity>
    );
  };

  const onEndReachedVendor = () => {
    if (vendorLoadMore.current) {
      vendorPage.current = vendorPage.current + 1;
      fetchAllVendors();
    }
    console.log('end reached');
  };

  return (
    <WrapperContainer
      bgColor="white"
      statusBarColor="white"
      barStyle="dark-content"
      isLoadingB={isLoadingB}
      source={loaderOne}>
      <Header
        headerStyle={{marginVertical: moderateScaleVertical(16)}}
        // centerTitle="Orders | Foodies hub  "
        centerTitle={strings.ORDER +' | ' + storeSelectedVendor?.name || ''}
        onPressCenterTitle={() => _reDirectToVendorList()}
        onPressImageAlongwithTitle={() => _reDirectToVendorList()}
        noLeftIcon
        imageAlongwithTitle={imagePath.dropdownTriangle}
        showImageAlongwithTitle
      />
      <View style={styles.container}>
        <MultiScreen
          tabTextStyle={{
            marginTop: moderateScaleVertical(0),
          }}
          screenName={[strings.NEW, strings.CONFIRMED, strings.CANCELLED, strings.COMPLETED]}
          selectedScreen={(index) => selectedOrder(index)}
          selectedScreenIndex={activeIndex}
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          extraData={data}
          refreshing={isRefreshing}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={themeColors.primary_color}
            />
          }
          onEndReached={onEndReachedDelayed}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyCartBody}>
                <Image source={imagePath.emptyCartRoyo} />
              </View>
            );
          }}
          renderItem={renderOrders}
          keyExtractor={(item, key) => key}
        />
      </View>
      <Modal
        isVisible={isVendorSelectModal}
        style={{
          margin: 0,
        }}>
        <View style={{flex: 1, backgroundColor: colors.white}}>
          <SelectVendorListModal
            vendorList={availVendor}
            onCloseModal={() => updateState({isVendorSelectModal: false})}
            onVendorSelect={onVendorSelect}
            selectedVendor={storeSelectedVendor}
            onEndReachedVendor={onEndReachedVendor}
          />
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default RoyoOrder;
