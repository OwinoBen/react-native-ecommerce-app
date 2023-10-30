import React, {Component} from 'react';
import {
  ActivityIndicator,
  Platform,
  Text,
  View,
  Button,
  ScrollView,
  DeviceEventEmitter,
  NativeEventEmitter,
  TouchableOpacity,
  Dimensions,
  Image,
  ToastAndroid,
} from 'react-native';
import {BluetoothManager} from '@brooons/react-native-bluetooth-escpos-printer';
import BackgroundService from 'react-native-background-actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import stylesFun from './styles';
import colors from '../../styles/colors';
import commonStyles from '../../styles/commonStyles';
import Header from '../../Components/Header';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import imagePath from '../../constants/imagePath';
import {printReciept, StartPrinting} from './PrinteFunc';
import _ from 'lodash';
import ModalView from '../../Components/Modal';
import {moderateScale} from '../../styles/responsiveSize';
import {getItem} from '../../utils/utils';
import strings from '../../constants/lang';

export let appData = {};
export let language = '';

const styles = stylesFun();

class PrinterScreen extends Component {
  _listeners = [];
  state = {
    devices: null,
    pairedDs: [],
    foundDs: [],
    bleOpend: false,
    loading: true,
    boundAddress: '',
    debugMsg: '',
    isLoading: false,
    isModalVisibleForPayment: false,
    unpairDeviceData: {},
  };

  topCustomComponent = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: moderateScale(20),
        }}>
        <Text style={styles.subscription2}>
          {strings.UNPAIR_DEVICE_WARNING}
        </Text>
        <TouchableOpacity
          onPress={() =>
            this.setState({...this.state, isModalVisibleForPayment: false})
          }>
          <Image source={imagePath.cross} />
        </TouchableOpacity>
      </View>
    );
  };

  //Modal main component
  modalMainContent = () => {
    return (
      <>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: moderateScale(20),
            marginVertical: moderateScale(10),
          }}>
          <Text style={styles.title}>{``}</Text>
          <TouchableOpacity
            onPress={() => {
              BluetoothManager.unpair(this.state.unpairDeviceData.address)
                .then(() => {
                  console.log('unpair success');
                  let pairedDevice = [...this.state.pairedDs];
                  pairedDevice = pairedDevice.filter(
                    (el) => el.address !== this.state.unpairDeviceData.address,
                  );
                  console.log('filterPairedDevice>>', pairedDevice);
                  this.setState({
                    ...this.state,
                    isModalVisibleForPayment: false,
                    pairedDs: pairedDevice,
                    unpairDeviceData: {},
                  });
                })
                .catch((err) => {
                  console.log('unpair catch', err);
                });
            }}
            style={styles.unpairBtn}>
            <Text style={styles.unpairBtnTxt}>{strings.UNPAIR}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  componentDidMount = async () => {
    // StartPrinting({})
    const getAppData = await getItem('appData');
    appData = getAppData;

    const getLanguage = await getItem('language');
    language = getLanguage;

    if (getLanguage) {
      strings.setLanguage(getLanguage);
    }
    AsyncStorage.getItem('BleDevice').then((res) => {
      // console.log('checking ble device storage data >>>', JSON.parse(res))
      if (res !== null) {
        this.setState({
          ...this.state,
          boundAddress: JSON.parse(res).boundAddress,
          name: JSON.parse(res).name,
        });
      }
    });
    BluetoothManager.checkBluetoothEnabled().then(
      (enabled) => {
        this.setState({
          bleOpend: Boolean(enabled),
          loading: false,
        });
        if (enabled) {
          this._scan();
        }
      },
      (err) => {
        err;
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          (rsp) => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          (rsp) => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          async () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
            AsyncStorage.removeItem('BleDevice');
            await BackgroundService.stop();
          },
        ),
      );
    } else if (Platform.OS === 'android') {
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          (rsp) => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          (rsp) => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          async () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
            AsyncStorage.removeItem('BleDevice');
            await BackgroundService.stop();
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () => {
            ToastAndroid.show(
              'Device Not Support Bluetooth !',
              ToastAndroid.LONG,
            );
          },
        ),
      );
    }
  };

  componentWillUnmount() {}

  sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  backgroundServiceInit = async () => {
    const veryIntensiveTask = async (taskDataArguments) => {
      const {delay} = taskDataArguments;
      await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
          await this.sleep(delay);
        }
        BluetoothManager.connect(row.address).then(
          (s) => {
            this.setState({
              loading: false,
              boundAddress: row.address,
              name: row.name || 'UNKNOWN',
            });
          },
          (e) => {
            this.setState({
              loading: false,
            });
            alert(e);
          },
        );

        // printReciept()
        StartPrinting({});
        // const getAppData = await getItem('appData');
        appData = appData;

        // const getLanguage = await getItem('language');
        language = language;

        // arr
        // canEnablePrinter = true

        // StartPrinting()

        // initPrinter()

        if (Platform.OS === 'ios') {
          let bluetoothManagerEmitter = new NativeEventEmitter(
            BluetoothManager,
          );
          this._listeners.push(
            bluetoothManagerEmitter.addListener(
              BluetoothManager.EVENT_CONNECTION_LOST,
              async () => {
                this.setState({
                  name: '',
                  boundAddress: '',
                });
                AsyncStorage.removeItem('BleDevice');
                await BackgroundService.stop();
              },
            ),
          );
        } else if (Platform.OS === 'android') {
          this._listeners.push(
            DeviceEventEmitter.addListener(
              BluetoothManager.EVENT_CONNECTION_LOST,
              async () => {
                this.setState({
                  name: '',
                  boundAddress: '',
                });
                AsyncStorage.removeItem('BleDevice');
                await BackgroundService.stop();
              },
            ),
          );
        }
      });
    };

    const options = {
      taskName: strings.PRINTER,
      taskTitle: strings.PRINTER_ATTACHED,
      taskDesc: strings.PRINTER_MSG,
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      parameters: {
        delay: 5,
      },
    };

    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: strings.PRINTER_MSG,
    }); // Only Android, iOS will ignore this call
    // iOS will also run everything here in the background until .stop() is called
    // await BackgroundService.stop();
  };

  async _scan() {
    this.setState({
      ...this.state,
      loading: true,
    });

    BluetoothManager.scanDevices().then(
      (s) => {
        var ss = s;
        var found = ss.found;
        try {
          found = JSON.parse(found);
        } catch (e) {
          //ignore
        }
        var fds = this.state.foundDs;
        if (found && found.length) {
          fds = found;
        }
        this.setState({
          ...this.state,
          foundDs: fds,
          loading: false,
        });
      },
      (er) => {
        this.setState({
          ...this.state,
          loading: false,
        });
        alert('error' + JSON.stringify(er));
      },
    );
  }

  _deviceAlreadPaired(rsp) {
    var ds = null;
    if (typeof rsp.devices == 'object') {
      ds = rsp.devices;
    } else {
      try {
        ds = JSON.parse(rsp.devices);
      } catch (e) {}
    }
    if (ds && ds.length) {
      let pared = this.state.pairedDs;
      pared = pared.concat(ds || []);
      pared = _.uniqBy(pared, 'address');
      this.setState({
        pairedDs: pared,
      });
    }
  }

  _deviceFoundEvent(rsp) {
    var r = null;
    try {
      if (typeof rsp.device == 'object') {
        r = rsp.device;
      } else {
        r = JSON.parse(rsp.device);
      }
    } catch (e) {
      //alert(e.message);
      //ignore
    }
    //alert('f')
    if (r) {
      let found = this.state.foundDs || [];
      if (found.findIndex) {
        let duplicated = found.findIndex(function (x) {
          return x.address == r.address;
        });
        //CHECK DEPLICATED HERE...
        if (duplicated == -1) {
          found.push(r);
          this.setState({
            foundDs: found,
          });
        }
      }
    }
  }

  connectBTFunc = (row) => {
    BluetoothManager.connect(row.address)
      .then(
        (s) => {
          this.setState({
            loading: false,
            boundAddress: row.address,
            name: row.name || 'UNKNOWN',
          });
          AsyncStorage.setItem(
            'BleDevice',
            JSON.stringify({
              boundAddress: row.address,
              name: row.name || 'UNKNOWN',
            }),
          );
          this.backgroundServiceInit(row.address);
        },
        async (e) => {
          this.setState({
            loading: false,
            boundAddress: '',
            name: '',
          });
          AsyncStorage.removeItem('BleDevice');
          await BackgroundService.stop();
          alert(e);
        },
      )
      .then(() => {
        this._scan();
      });
  };

  _renderPairedRow(rows) {
    let items = [];
    for (let i in rows) {
      let row = rows[i];
      if (row.address) {
        items.push(
          <TouchableOpacity
            key={new Date().getTime() + i}
            style={styles.PairedRowView}
            onPress={async () => {
              this.setState({
                loading: true,
              });

              AsyncStorage.getItem('BleDevice').then((res) => {
                // console.log('checking ble device storage data >>>', JSON.parse(res))
                if (res !== null) {
                  BluetoothManager.disconnect(
                    JSON.parse(res).boundAddress,
                  ).then((s) => {
                    this.connectBTFunc(row);
                  });
                } else {
                  this.connectBTFunc(row);
                }
              });
            }}>
            <View style={styles.rowContainer}>
              <View style={styles.rowContainerInner}>
                <Image source={imagePath.bluetooth} style={styles.iconImg} />
                <View>
                  <Text
                    style={[
                      styles.PairedRowName,
                      {textTransform: 'uppercase'},
                    ]}>
                    {row.name || strings.UNKNOWN}
                  </Text>
                  <Text style={styles.PairedRowAdrress}>{row.address}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    ...this.state,
                    unpairDeviceData: row,
                    isModalVisibleForPayment: true,
                  })
                }
                style={styles.rightArrowBtn}>
                <Image
                  source={imagePath.rightArrowAngle}
                  style={styles.rightArrowImg}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>,
        );
      }
    }
    return items;
  }

  _renderRow(rows) {
    let items = [];
    for (let i in rows) {
      let row = rows[i];
      if (row.address) {
        items.push(
          <TouchableOpacity
            key={new Date().getTime() + i}
            style={styles.wtf}
            onPress={async () => {
              this.setState({
                loading: true,
              });

              AsyncStorage.getItem('BleDevice').then((res) => {
                if (res !== null) {
                  BluetoothManager.disconnect(
                    JSON.parse(res).boundAddress,
                  ).then((s) => {
                    this.connectBTFunc(row);
                  });
                } else {
                  this.connectBTFunc(row);
                }
              });
            }}>
            <Text style={[styles.name, {textTransform: 'uppercase'}]}>
              {row.name || strings.UNKNOWN}
            </Text>
            <Text style={styles.address}>{row.address}</Text>
          </TouchableOpacity>,
        );
      }
    }
    return items;
  }

  render() {
    const {isModalVisibleForPayment} = this.state;
    return (
      <>
        <ModalView
          isVisible={isModalVisibleForPayment}
          onClose={() =>
            this.setState({...this.state, isModalVisibleForPayment: false})
          }
          mainViewStyle={{
            minHeight: Dimensions.get('screen').height / 4,
            maxHeight: Dimensions.get('screen').height,
          }}
          leftIcon={imagePath.cross}
          topCustomComponent={this.topCustomComponent}
          modalMainContent={this.modalMainContent}
          // modalBottomContent={modalBottomContent}
        />
        <Header
          leftIcon={imagePath.icBackb}
          centerTitle={''}
          // headerStyle={
          //   isDarkMode
          //     ? {backgroundColor: MyDarkTheme.colors.background}
          //     : {backgroundColor: colors.white}
          // }
        />
        <View style={{...commonStyles.headerTopLine}} />
        <KeyboardAwareScrollView
          style={{flex: 1, backgroundColor: 'white'}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.main}>
            <ScrollView style={styles.container}>
              <Text style={styles.title}>
                Connected:
                <Text style={{color: colors.themeColor}}>
                  {!this.state.name ? ' No Devices' : this.state.name}
                </Text>
              </Text>
              {!(
                this.state.loading ||
                !(this.state.bleOpend && this.state.boundAddress.length > 0)
              ) && (
                <TouchableOpacity
                  style={styles.disconnectBtnView}
                  onPress={async () => {
                    await BluetoothManager.disconnect(
                      this.state.boundAddress,
                    ).then(
                      async (s) => {
                        this.setState({
                          loading: false,
                          boundAddress: '',
                          name: '',
                        });
                        AsyncStorage.removeItem('BleDevice');
                        await BackgroundService.stop();
                      },
                      (e) => {
                        this.setState({
                          loading: false,
                        });
                        alert(e);
                      },
                    );
                  }}
                  disabled={
                    this.state.loading ||
                    !(this.state.bleOpend && this.state.boundAddress.length > 0)
                  }>
                  <Text style={styles.scanBtnTxt}>{strings.DISCONNECT}</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.title}>{strings.PAIRED}:</Text>
              {/* {this.state.loading ? (<ActivityIndicator animating={true} />) : null} */}
              <View style={{flex: 1, flexDirection: 'column'}}>
                {this._renderPairedRow(this.state.pairedDs)}
              </View>

              <View style={styles.scanView}>
                <Text style={[styles.title, {paddingLeft: 0}]}>
                  {strings.FOUND_DEVICES}:
                </Text>
                {this.state.loading ? (
                  <ActivityIndicator
                    animating={true}
                    color="#000000"
                    size="large"
                  />
                ) : (
                  <TouchableOpacity
                    disabled={this.state.loading || !this.state.bleOpend}
                    onPress={() => {
                      this._scan();
                    }}
                    style={styles.scanBtn}>
                    <Text style={styles.scanBtnTxt}>{strings.SCAN}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View
                style={{flex: 1, flexDirection: 'column', paddingBottom: 100}}>
                {this._renderRow(this.state.foundDs)}
              </View>
            </ScrollView>
          </View>
        </KeyboardAwareScrollView>
      </>
    );
  }
}

export default PrinterScreen;

// const base64Logo = "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"

// export const printReciept = async (data) => {
//   console.log('check notifications length >>>> 8')
//   return new Promise((resolve, reject) => {
//   const detail = {
//     Vendor: 'La Fresca de Italia',
//     order_no: '#0697030279',
//     delivery_address: 'Fatehgarh Sahib, Punjab, India',
//     Items: [
//       { name: 'Pizza', qty: 2, amt: 400, add_ons: [{ title: 'cheese' }, { title: 'capsicum' }] },
//       { name: 'Rolls', qty: 5, amt: 900 },
//       { name: 'UCB shirt', qty: 1, amt: 1300, variant: 'black' },
//     ],
//     total_items: 7,
//     total_amt: 1300,
//     delievery_fee: 10.00,
//     discount: 0.00,
//     paid_amount: 1300,
//     loyalty: 2.65,

//   }

//   BluetoothManager.checkBluetoothEnabled().then(async (enabled) => {
//     const isConnected = await BluetoothManager.getConnectedDeviceAddress()
//     if (enabled && isConnected) {
//       try {
//         await BluetoothEscposPrinter.printerInit();
//         await BluetoothEscposPrinter.printerLeftSpace(0);

//         // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
//         await BluetoothEscposPrinter.printPic(base64Logo, { width: 200, left: 175 });

//         // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
//         // await BluetoothEscposPrinter.setBlob(0);
//         await BluetoothEscposPrinter.printText(`        ${'Royo orders'}\r\n\r\n\r\n`, {
//           encoding: 'GBK',
//           codepage: 0,
//           widthtimes: 1.5,
//           heigthtimes: 1.5,
//           fonttype: 1
//         });
//         // await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});

//         // await BluetoothEscposPrinter.setBlob(0);
//         await BluetoothEscposPrinter.printText("                    Order details\r\n\r\n", {
//           encoding: 'GBK',
//           codepage: 0,
//           widthtimes: 0,
//           heigthtimes: 0,
//           fonttype: 1
//         });
//         // await BluetoothEscposPrinter.printText("\r\n", {});
//         // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
//         // await BluetoothEscposPrinter.printText("Customers: Retail customers\r\n", {});
//         await BluetoothEscposPrinter.printText(`Order Number: ${detail.order_no}\r\n`, {});
//         await BluetoothEscposPrinter.printText(`Seller: ${detail.Vendor}\r\n`, {});
//         await BluetoothEscposPrinter.printText(`Delivery Address:\r\n`, {});
//         await BluetoothEscposPrinter.printText(`${detail.delivery_address}\r\n`, {});
//         await BluetoothEscposPrinter.printText("----------------------------------------------\r\n", {});

//         /** Create Column **/
//         let columnWidths = [11, 12, 12, 11];
//         await BluetoothEscposPrinter.printColumn(columnWidths,
//           [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
//           ["Item", 'Quantity', 'Unit price', 'Amount'], {});

//         /** Add Items **/
//         await detail.Items.forEach(async (el) => {
//           const title = el.variant ? `${el.name}(${el.variant})` : `${el.name}`
//           BluetoothEscposPrinter.printColumn(columnWidths,
//             [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
//             [title, JSON.stringify(el.qty), JSON.stringify(el.amt / el.qty), JSON.stringify(el.amt)], {});

//           /** Add ons If available **/
//           if (el.add_ons) {
//             let arr = el.add_ons.map(el => el.title)
//             arr = '(' + arr.join(',') + ')'
//             BluetoothEscposPrinter.printColumn(columnWidths,
//               [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
//               [arr, '', '', ''], {});
//           }

//         });

//         await BluetoothEscposPrinter.printText("\r\n----------------------------------------------\r\n", {});

//         await BluetoothEscposPrinter.printColumn(columnWidths,
//           [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
//           ["Total", JSON.stringify(detail.total_items), " ", JSON.stringify(detail.total_amt)+'\r\n'], {});
//         // await BluetoothEscposPrinter.printText("\r\n", {});

//         await BluetoothEscposPrinter.printColumn([15, 30],
//           [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
//           ["Delivery Fee", JSON.stringify(detail.delievery_fee)+'\r\n'], {});
//         // await BluetoothEscposPrinter.printText("\r\n", {});

//         await BluetoothEscposPrinter.printColumn([15, 30],
//           [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
//           ["Discount", JSON.stringify(-detail.discount)+'\r\n'], {});
//         // await BluetoothEscposPrinter.printText("\r\n", {});

//         await BluetoothEscposPrinter.printColumn([15, 30],
//           [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
//           ["Loyalty", JSON.stringify(-detail.loyalty)+'\r\n'], {});
//         // await BluetoothEscposPrinter.printText("\r\n", {});

//         await BluetoothEscposPrinter.printColumn([15, 30],
//           [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
//           ["Paid amount", JSON.stringify(detail.paid_amount)+'\r\n'], {});
//         // await BluetoothEscposPrinter.printText("\r\n", {});

//         await BluetoothEscposPrinter.printText("----------------------------------------------\r\n\n                     Welcome next time\r\n\r\n\r\n\r\n\n", {});

//         // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
//         // await BluetoothEscposPrinter.printText("Welcome next time\r\n\r\n\r\n\r\n\n", {});

//         // await BluetoothEscposPrinter.printText("\r\n\n", {});
//         await BluetoothEscposPrinter.cutOnePoint();

//         console.log('check notifications length >>>> 9')
//         resolve(true)

//       } catch (e) {
//         alert(e.message || "ERROR");
//         console.log('check notifications length >>>> 12', e)
//       }
//     }

//   }, (err) => {
//     console.log(err)
//     console.log('check notifications length >>>> 11', err)
//   });
//   })

// }
