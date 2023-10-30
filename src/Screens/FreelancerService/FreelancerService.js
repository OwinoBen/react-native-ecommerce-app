//import liraries
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useDarkMode } from 'react-native-dynamic';
import { ScrollView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import ServicesCard from '../../Components/ServicesCard';
import GradientButton from '../../Components/GradientButton';
import Header from '../../Components/Header';
import WrapperContainer from '../../Components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import { height, moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';
// import RBSheet from 'react-native-raw-bottom-sheet';
import { isEmpty } from 'lodash';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from 'react-native-popup-menu';
import AddressModal3 from '../../Components/AddressModal3';
import ChooseAddressModal from '../../Components/ChooseAddressModal';
import navigationStrings from '../../navigation/navigationStrings';
import actions from '../../redux/actions';
import fontFamily from '../../styles/fontFamily';
import { MyDarkTheme } from '../../styles/theme';
import { showError, showSuccess } from '../../utils/helperFunctions';
import stylesFunc from './styles';

// create a component
const FreelancerService = ({ route, navigation }) => {
    const { data } = route.params;
    const moveToNewScreen = (screenName, data) => () => {
        navigation.navigate(screenName, { data });
    };
    const darkthemeusingDevice = useDarkMode();

    const { appData, themeColors, themeLayouts, currencies, languages, themeColor, themeToggle, redirectedFrom, } = useSelector((state) => state?.initBoot)
    const { dineInType, location } = useSelector((state) => state?.home);
    const { reloadData } = useSelector((state) => state?.reloadData);
    const { userData } = useSelector((state) => state?.auth);
    const selectedAddressData = useSelector((state) => state?.cart?.selectedAddress);

    const isDarkMode = themeToggle ? darkthemeusingDevice : themeColor;
    const styles = stylesFunc({ themeColors, fontFamily, isDarkMode });

    const [state, setState] = useState({
        pageNo: 1, focused: false, selectedService: {}, selectedVariant: {}, openDateTimePicker: false,
        serviceDateTime: '', serviceTimeSlot: {}, isVisibleAddressModal: false, selectViaMap: false, isVisible: false,
        timeSlots: [
            "08:00 - 10:00",
            "10:01 - 12:00",
            "12:01 - 14:00",
            "14:01 - 16:00",
            "16:01 - 18:00",
            "18:01 - 20:00",
            "18:40 - 20:42",
        ], menuOpened: false, OrderOptionsType: 2,
        OrderOptionsTypeSelected: true,
        isBookingTypeMenu: false,
        selectedBookingType: {
            id: 1,
            name: "Book Now"
        },
        bookingTypes: [{
            id: 1,
            name: "Book Now"
        }, {
            id: 2,
            name: "Schedule"
        }]
    });
    const { pageNo, focused, selectedService, selectedVariant, openDateTimePicker,
        serviceDateTime, isVisibleAddressModal, selectViaMap, isVisible, serviceTimeSlot, timeSlots, menuOpened, OrderOptionsTypeSelected, OrderOptionsType, isBookingTypeMenu, selectedBookingType, bookingTypes } = state;

    const updateState = (data) => { setState((state) => ({ ...state, ...data })) };

    const currentDate = moment(new Date()).format('YYYY-MM-DD');

    const [productListId, setProductListId] = useState(data);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productListData, setProductListData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [type, setType] = useState('');
    const [selectedAddress, setSelectedAddress] = useState(selectedAddressData ? selectedAddressData : null);

    useEffect(() => {
        if (!!data?.isVendorList) {
            getAllProductsByVendor()
        }
        else {
            getAllProductsByCategoryId();
        }

    }, [navigation, languages, currencies, reloadData, productListId]);

    const getAllProductsByCategoryId = () => {
        actions.getProductByCategoryIdOptamize(
            `/${productListId?.id}?page=${pageNo}&product_list=${data?.rootProducts ? true : false}&type=${dineInType} `,
            {},
            {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                systemuser: DeviceInfo.getUniqueId(),
            })
            .then((res) => {
                console.log(res, '<===res getProductByCategoryIdOptamize');
                if (!!res?.data) {
                    setCategoryInfo(categoryInfo ? categoryInfo : res.data.category);
                    const newProductData = res.data.listData.data.map(v => ({ ...v, qtyText: 1 }))
                    const newProductListDataWithQty = pageNo == 1 ? newProductData : [...productListData, newProductData]

                    setProductListData(newProductListDataWithQty);

                    if (
                        pageNo == 1 &&
                        res?.data?.listData?.data.length == 0 &&
                        res?.data?.category &&
                        res?.data?.category?.childs.length
                    ) {
                        setSelectedCategory(res.data.category.childs[0]);
                        setProductListId(res.data.category.childs[0]);
                        updateState({
                            pageNo: 1,

                        });
                    }
                }
                setLoading(false);
            })

            .catch(errorMethod);
    };


    /****Get all list items by vendor id */
    const getAllProductsByVendor = (pageNo = 1) => {


        let vendorId = data?.id

        let apiData = `/${vendorId}?page=${pageNo ? pageNo : 1
            }&type=${dineInType}&limit=40`;

        if (!!data?.categoryExist) {
            apiData = apiData + `&category_id=${data?.categoryExist}`;
        }
        actions
            .getProductByVendorIdOptamizeV2(
                apiData,
                {},
                {
                    code: appData.profile.code,
                    currency: currencies?.primary_currency?.id,
                    language: languages?.primary_language?.id,
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    systemuser: DeviceInfo.getUniqueId(),
                },
            )
            .then(async res => {
                console.log('get all products by vendor res', res?.data, pageNo);
                setLoading(false);

                const newProductData = res?.data?.products?.data?.map(v => ({ ...v, qtyText: 1 }))
                const newProductListDataWithQty = pageNo == 1 ? newProductData : [...productListData, newProductData]

                setProductListData(newProductListDataWithQty);

            })
            .catch(errorMethod);
    };



    const getDriverTimeSlots = (date) => {
        actions.getDriverSlots(`?date=${moment(date).format('YYYY-MM-DD')}`, {},
            {
                code: appData?.profile?.code,
                currency: currencies?.primary_currency?.id,
                language: languages?.primary_language?.id,
                systemuser: DeviceInfo.getUniqueId(),
            })
            .then((res) => {
                console.log(res, '<===res getDriverSlots');
                if (!!res?.Slots) {
                    updateState({ timeSlots: res?.Slots })
                }
                setLoading(false);
            })
            .catch(errorMethod);
    };

    const errorMethod = (error) => {
        console.log('checking error', error);
        updateState({
            updateQtyLoader: false,
            selectedItemID: -1,
            btnLoader: false,
        });
        setLoading(false);
        showError(error?.message || error?.error);
    };

    const setCheckBoxData = (data) => {
        const { id } = data
        if (selectedService.id === id) {
            updateState({
                focused: false,
                selectedService: {},
                selectedType: {},
                selectedVariant: {},
            })
        } else {
            updateState({
                focused: true,
                selectedService: data,
            })
        }
    }

    const checkIsCustomize = useCallback((item, index, type) => {
        // increment
        if (type == 1) {
            const incVal = ++item.qtyText
            console.log("incVal =>", incVal);
            console.log("item =>", item);
            const newProductListDataWithQty = [...productListData]
            newProductListDataWithQty.map((element) => {
                element.id === item.id ? { ...item } : element
            });
            setProductListData(newProductListDataWithQty);
        }

        //decrement
        if (type == 2) {
            if (item.qtyText == 1) {
                return showError(strings.ACCEPTING_ORDER_MSG)
            }
            const incVal = --item.qtyText
            console.log("incVal =>", incVal);
            console.log("item =>", item);
            const newProductListDataWithQty = [...productListData]
            newProductListDataWithQty.map((element, index) => {
                element.id === item.id ? { ...item } : element
            });
            setProductListData(newProductListDataWithQty);

        }
    }, [productListData])

    const renderChooseService = useCallback(({ item, index }) => {
        return (
            <ServicesCard
                data={item}
                focused={focused}
                selectedService={selectedService}
                selectedVariant={selectedVariant}
                selectedType={selectedVariant}
                setCheckBoxData={setCheckBoxData}
                onSelect={(val) => updateState({ selectedVariant: val })}
                onIncrement={() => checkIsCustomize(item, index, 1)}
                onDecrement={() => checkIsCustomize(item, index, 2)}
            />
        )
    }, [productListData, focused, setCheckBoxData])

    const _chooseDay = () => {
        updateState({ openDateTimePicker: !openDateTimePicker })
    };

    const onPressChildCards = (item) => {
        setSelectedCategory(item);
        setProductListId(item);
        updateState({
            pageNo: 1,


        });
    };

    const sendProductVariantData = () => {

        if (!isEmpty(selectedService?.check_if_in_cart_app)) {
            showError("The service is already added in cart.")
            return
        }
        if (isEmpty(selectedService)) {
            return showError("Service and it's Variant should not be empty");
        }
        if (selectedBookingType?.id == 2) {

            if (!serviceDateTime || isEmpty(serviceTimeSlot)) {
                return showError("Service Date and Time should not be empty");
            }
        }
        if (isEmpty(selectedAddress)) {
            return showError("Service Address should not be empty");
        }
        let item = {
            "variant_id": selectedService?.variant[0].id,
            "address_id": selectedAddress?.id,
            "sku": selectedService?.variant[0]?.sku,
            "qty": selectedService?.qtyText,
            "booking_option": selectedBookingType?.id,
            "slot": selectedBookingType?.id == 2 ? serviceTimeSlot?.value : serviceTimeSlot?.value,
            "bookingdateTime": selectedBookingType?.id == 2 ? moment(serviceDateTime).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD HH:mm")
        }

        moveToNewScreen(navigationStrings.AVAILABLE_TECHNICIANS, item)()
    }



    const setModalVisibleForAddessModal = (visible, type, id, data) => {
        updateState({ selectViaMap: false });
        if (!!userData?.auth_token) {
            updateState({ isVisible: false });
            setTimeout(() => {
                setType(type);
                updateState({
                    updateData: data,
                    isVisibleAddressModal: visible,
                    selectedId: id,
                });

            }, 1000);
        } else {
            setAppSessionRedirection();
        }
    };
    const setAppSessionRedirection = () => {
        actions.setAppSessionData('on_login');
    };

    //Add and update the addreess
    const addUpdateLocation = (childData) => {
        updateState({ isLoading: true });
        actions

            .addAddress(childData, {
                code: appData?.profile?.code,
            })
            .then((res) => {
                updateState({
                    isVisibleAddressModal: false,
                    selectViaMap: false,
                    isVisible: false,
                });
                getAllAddress();
                setTimeout(() => {
                    let address = res.data;
                    address['is_primary'] = 1;
                    setSelectedAddress(address);
                    actions.saveAddress(address);
                });
                showSuccess(res.message);
            })
            .catch((error) => {
                updateState({
                    isVisibleAddressModal: false,
                    isVisible: false,
                });
                showError(error?.message || error?.error);
            });
    };

    //get All address
    const getAllAddress = () => {
        if (!!userData?.auth_token) {
            actions
                .getAddress(
                    {},
                    {
                        code: appData?.profile?.code,
                    },
                )
                .then((res) => {

                    if (res.data) {
                        actions.saveAllUserAddress(res.data);
                    }
                })
                .catch(errorMethod);
        }
    };

    const openCloseMapAddress = (type) => {
        updateState({ selectViaMap: type == 1 ? true : false });
    };


    const setModalVisible = (visible, type, id, data) => {
        if (!!userData?.auth_token) {
            setType(type);
            updateState({
                updateData: data,
                isVisible: visible,
                selectedId: id,
            });
        } else {
            setAppSessionRedirection();
        }
    };


    //SelectAddress
    const selectAddress = (address) => {
        if (!!userData?.auth_token) {
            let data = {};
            let query = `/${address?.id}`;
            actions
                .setPrimaryAddress(query, data, {
                    code: appData?.profile?.code,
                })
                .then((res) => {
                    console.log(res, '<===res setPrimaryAddress');
                    actions.saveAddress(address);
                    setSelectedAddress(address);
                    updateState({
                        isVisible: false,

                    });
                })
                .catch(errorMethod);
        }
    };

    const onChangeDateTime = (date) => {
        console.log("onChangeDateTime => ", date, moment(date, "HH:mm"));
        const sameDateTrue = moment().isSame(date, 'day')
        updateState({
            serviceDateTime: date,
            openDateTimePicker: false,

            serviceTimeSlot: {},
        })
        getDriverTimeSlots(date)
    }
    // }
    const checkDatIsSelected = () => {
        if (!serviceDateTime) {
            updateState({ menuOpened: false })
            return showError(strings.SELECT_SERVICE_DATE)
        }
        updateState({ menuOpened: !menuOpened })
    }

    const checkOptionsType = (type) => {
        if (type == 1) {

            updateState({
                OrderOptionsTypeSelected: true,
                OrderOptionsType: type
            })
        } else if (type == 2) {
            OrderOptionsTypeSelected && OrderOptionsType == type ?
                updateState({
                    OrderOptionsTypeSelected: true,
                    OrderOptionsType: 1
                })
                :
                updateState({
                    OrderOptionsTypeSelected: true,
                    OrderOptionsType: type
                })
        }
    }

    const listEmptyComponent = () => <View>
        <FastImage
            source={imagePath.noDataFound}
            resizeMode="contain"
            style={{
                width: moderateScale(140),
                height: moderateScale(140),
                alignSelf: 'center',
                marginTop: moderateScaleVertical(30),
            }}
        />
        <Text
            style={{
                textAlign: 'center',
                fontSize: textScale(11),
                fontFamily: fontFamily.regular,
                marginHorizontal: moderateScale(10),
                lineHeight: moderateScale(20),
                marginTop: moderateScale(5),
            }}>
            {strings.NO_SERVICE_FOUND}
        </Text>
    </View>


    return (
        <WrapperContainer
            isLoading={isLoading}
            bgColor={isDarkMode ? MyDarkTheme.colors.background : colors.white}>
            <Header centerTitle={data?.name} />
            <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                {!!categoryInfo && categoryInfo?.childs?.length > 0 && (
                    <View style={{ marginHorizontal: moderateScale(20) }}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            style={{
                                marginTop: moderateScaleVertical(5),
                            }}>
                            {categoryInfo?.childs?.map((item, inx) => {
                                return (
                                    <View key={inx}>
                                        <TouchableOpacity
                                            style={{
                                                padding: moderateScale(10),
                                                // backgroundColor: colors.lightGreyBg,
                                                marginRight: moderateScale(10),
                                                borderRadius: moderateScale(12),
                                                backgroundColor:
                                                    selectedCategory && selectedCategory?.id == item?.id
                                                        ? themeColors.primary_color
                                                        : colors.lightGreyBg,
                                            }}
                                            onPress={() => onPressChildCards(item)}>
                                            <Text
                                                style={{
                                                    color:
                                                        selectedCategory && selectedCategory?.id == item?.id
                                                            ? colors.white
                                                            : colors.black,
                                                    opacity:
                                                        selectedCategory && selectedCategory?.id == item?.id
                                                            ? 1
                                                            : 0.61,
                                                    fontSize: textScale(12),
                                                    fontFamily: fontFamily.medium,
                                                }}>
                                                {item?.translation[0]?.name}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}
                <View style={{}}>
                    <FlatList
                        data={productListData || []}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderChooseService}
                        ListHeaderComponent={() => {
                            return (
                                <View style={styles.mainView}>
                                    <Text style={{
                                        color: isDarkMode ? MyDarkTheme.colors.text : colors.black
                                    }}>{strings.CHOOSE_SERVICES}</Text>
                                </View>
                            )
                        }}
                        ListEmptyComponent={listEmptyComponent}
                    />
                </View>



                <View style={styles.datePickerView}>
                    <View>
                        <View style={styles.timeView}>
                            <Text>{"BOOKING TYPE"}</Text>
                        </View>
                        <View style={{ ...styles.timePickerView, marginTop: 0, marginBottom: moderateScaleVertical(30) }}>
                            <Text style={[styles.textStyleTime]}>{"Type"}:</Text>
                            <Menu style={{ alignSelf: 'center' }} opened={isBookingTypeMenu} onBackdropPress={() => updateState({
                                isBookingTypeMenu: !isBookingTypeMenu
                            })}>
                                <MenuTrigger onPress={() => {
                                    updateState({
                                        isBookingTypeMenu: !isBookingTypeMenu
                                    })
                                }} >
                                    <View style={styles.pickerView}>
                                        <Text style={[styles.textStyleTime, { width: moderateScale(140) }]}>
                                            {!isEmpty(selectedBookingType) ? selectedBookingType?.name : "Select booking type"}
                                        </Text>
                                        <Image
                                            style={[styles.imageStyle,]}
                                            resizeMode="contain"
                                            source={imagePath.icDropdown}
                                        />
                                    </View>
                                </MenuTrigger>
                                <MenuOptions
                                    customStyles={{
                                        optionsContainer: {
                                            marginTop: moderateScaleVertical(36),
                                            width: moderateScale(180),
                                            height: moderateScale(100),
                                        },
                                        optionsWrapper: {
                                            width: moderateScale(180),
                                            height: moderateScale(100),
                                        },
                                    }}>
                                    <ScrollView>
                                        {bookingTypes.map((item, index) => {
                                            // const time_12_1 = moment(item.split('-', 2)[0], 'HH:mm').format('hh:mm a')
                                            // const time_12_2 = moment(item.split('-', 2)[1], 'HH:mm').format('hh:mm a')
                                            return (
                                                <View key={index}>
                                                    <MenuOption
                                                        onSelect={() => updateState({ selectedBookingType: item, isBookingTypeMenu: !isBookingTypeMenu })}
                                                        key={String(index)}
                                                        // text={`${time_12_1} - ${time_12_2}`}
                                                        text={item.name}
                                                        style={{
                                                            marginVertical: moderateScaleVertical(5),
                                                            backgroundColor: selectedBookingType?.name === item?.name ? colors.greyColor : colors.whiteOpacity15
                                                        }}
                                                        customStyles={{
                                                            optionText: { textAlign: 'center', }
                                                        }}
                                                    />
                                                    <View
                                                        style={{
                                                            borderBottomWidth: 1,
                                                            borderBottomColor: colors.greyColor,
                                                        }}
                                                    />
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                </MenuOptions>
                            </Menu>
                        </View>
                    </View>
                    {
                        selectedBookingType?.id == 2 && <View>
                            <View style={styles.timeView}>
                                <Text>{"SCHEDULE TIME"}</Text>
                            </View>
                            <View style={styles.pickerStyle}>
                                <Text style={[styles.textStyleTime]}>{strings.DATE}:</Text>
                                <TouchableOpacity style={styles.pickerView} onPress={_chooseDay}>
                                    <Text style={[styles.textStyleTime, { width: moderateScale(140) }]}>
                                        {serviceDateTime ? moment(serviceDateTime).format("YYYY-MM-DD") : strings.SELECT_DATE}
                                    </Text>
                                    <Image
                                        style={styles.imageStyle}
                                        resizeMode="contain"
                                        source={imagePath.calendarA}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.timePickerView}>
                                <Text style={[styles.textStyleTime]}>{strings.TIME}:</Text>
                                <Menu style={{ alignSelf: 'center' }} opened={menuOpened} onBackdropPress={checkDatIsSelected}>
                                    <MenuTrigger onPress={checkDatIsSelected} >
                                        <View style={styles.pickerView}>
                                            <Text style={[styles.textStyleTime, { width: moderateScale(140) }]}>
                                                {!isEmpty(serviceTimeSlot) ? serviceTimeSlot.name : strings.SELECT_SLOT}
                                            </Text>
                                            <Image
                                                style={[styles.imageStyle,]}
                                                resizeMode="contain"
                                                source={imagePath.icDropdown}
                                            />
                                        </View>
                                    </MenuTrigger>
                                    <MenuOptions
                                        customStyles={{
                                            optionsContainer: {
                                                marginTop: moderateScaleVertical(36),
                                                width: moderateScale(180),
                                                height: moderateScale(100),
                                            },
                                            optionsWrapper: {
                                                width: moderateScale(180),
                                                height: moderateScale(100),
                                            },
                                        }}>
                                        <ScrollView>
                                            {timeSlots.map((item, index) => {
                                                // const time_12_1 = moment(item.split('-', 2)[0], 'HH:mm').format('hh:mm a')
                                                // const time_12_2 = moment(item.split('-', 2)[1], 'HH:mm').format('hh:mm a')
                                                return (
                                                    <View key={index}>
                                                        <MenuOption
                                                            onSelect={() => updateState({ serviceTimeSlot: item, menuOpened: !menuOpened })}
                                                            key={String(index)}
                                                            // text={`${time_12_1} - ${time_12_2}`}
                                                            text={item.name}
                                                            style={{
                                                                marginVertical: moderateScaleVertical(5),
                                                                backgroundColor: serviceTimeSlot === item ? colors.greyColor : colors.whiteOpacity15
                                                            }}
                                                            customStyles={{
                                                                optionText: { textAlign: 'center', }
                                                            }}
                                                        />
                                                        <View
                                                            style={{
                                                                borderBottomWidth: 1,
                                                                borderBottomColor: colors.greyColor,
                                                            }}
                                                        />
                                                    </View>
                                                );
                                            })}
                                        </ScrollView>
                                    </MenuOptions>
                                </Menu>
                            </View>
                        </View>
                    }
                    <View style={styles.addressView}>
                        <Text style={[styles.textStyleTime]}>{strings.ADDRESS}:</Text>
                        <TouchableOpacity style={styles.pickerView}
                            onPress={() => { updateState({ isVisible: true }) }}>
                            <Text
                                //  numberOfLines={1}
                                style={[styles.textStyleTime, { width: moderateScale(140) }]}>
                                {selectedAddress?.address ? selectedAddress?.address : 'Select Address'}
                            </Text>
                            <Image
                                style={styles.imageStyle}
                                resizeMode="contain"
                                source={imagePath.icDropdown}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.btnStyle}>
                    <View style={{ marginVertical: moderateScaleVertical(20), }}>
                        {/* <TouchableOpacity style={{ flex: 0.6, flexDirection: 'row', alignItems: 'center', marginVertical: moderateScaleVertical(10), }}
                            onPress={() => checkOptionsType(1)}>
                            <View style={{ marginLeft: moderateScale(14), marginRight: moderateScale(10) }}>
                                <Image style={{ height: moderateScaleVertical(20), width: moderateScale(20) }}
                                    source={(OrderOptionsTypeSelected && OrderOptionsType == 1) ? imagePath.icCheck1 : imagePath.icCheck2} />
                            </View>
                            <Text style={styles.yearView}>{strings.FLEXIBLE}</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={{ flex: 0.6, flexDirection: 'row', alignItems: 'center' }} onPress={() => checkOptionsType(2)}>
                            <View style={{ marginLeft: moderateScale(14), marginRight: moderateScale(10) }}>
                                <Image style={{ height: moderateScaleVertical(20), width: moderateScale(20) }}
                                    source={(OrderOptionsTypeSelected && OrderOptionsType == 2) ? imagePath.icCheck1 : imagePath.icCheck2} />
                            </View>
                            <Text style={{ ...styles.yearView, color: isDarkMode ? colors.white : colors.blackB }}>{strings.EMERGENCY}</Text>
                        </TouchableOpacity>
                    </View>
                    <GradientButton onPress={sendProductVariantData} btnText={strings.PROCEED} />
                </View>
                <View style={{ height: moderateScaleVertical(80) }} />
            </ScrollView>
            <DatePicker
                date={moment().toDate()}
                minimumDate={moment().toDate()}
                modal={true}
                open={openDateTimePicker}
                onCancel={() => { updateState({ openDateTimePicker: !openDateTimePicker }) }}
                onConfirm={(date) => onChangeDateTime(date)}
                mode={"date"}
                textColor={isDarkMode ? colors.white : colors.blackB}

                style={{
                    width: width / 1.1,
                    height: height / 2.6,
                    backgroundColor: isDarkMode
                        ? MyDarkTheme.colors.lightDark
                        : colors.white,
                    alignSelf: 'center',
                }}
                theme={isDarkMode ? 'dark' : 'light'}
            />

            <AddressModal3
                isVisible={isVisibleAddressModal}
                onClose={() => setModalVisibleForAddessModal(!isVisibleAddressModal)}
                type={type}
                passLocation={(data) => addUpdateLocation(data)}
                navigation={navigation}
                selectViaMap={selectViaMap}
                openCloseMapAddress={openCloseMapAddress}
                constCurrLoc={location}
            />
            <ChooseAddressModal
                isVisible={isVisible}
                onClose={() => { setModalVisible(false); }}
                openAddressModal={() => setModalVisibleForAddessModal(true, 'addAddress')}
                selectAddress={(data) => selectAddress(data)}
                selectedAddress={selectedAddressData}
            />
        </WrapperContainer>
    );
};

export default FreelancerService;