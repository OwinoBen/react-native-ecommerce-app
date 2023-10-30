import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from '@brooons/react-native-bluetooth-escpos-printer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { appData, language } from './PrinterScreen';
import actions from '../../redux/actions';
import BackgroundService from 'react-native-background-actions';
import { getItem } from '../../utils/utils';
import strings from '../../constants/lang';
import moment from 'moment';
import SunmiV2Printer from 'react-native-sunmi-v2-printer';
const fs = RNFetchBlob.fs;

export let arr = [];
export let canEnablePrinter = true;

/** @function : Get Details of order for print bills */
const _getOrderDetails = async (_data) => {
  let appData_ = {};
  let language_ = {};

  if (appData?.appData) {
    appData_ = appData;
  } else {
    appData_ = await getItem('appData');
  }

  if (language) {
    language_ = language;
  } else {
    language_ = await getItem('language');
  }

  console.log('check app data >>>>', JSON.stringify(_data));
  return new Promise((resolve, reject) => {
    let data = {};
    data['order_id'] = _data.id;
    // data['order_id'] = 424;
    console.log('check AppCode profile data >>>>', appData?.appData);
    actions
      .getOrderDetailForBilling(data, {
        // code: '245bae',
        code: appData_?.appData.profile?.code,
        currency: 1,
        language: language_ ? language_?.primary_language?.id : 148,
      })
      .then((res) => {
        if (res?.data) {
          resolve(res?.data);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/** @function : Queuing the jobs for printing in sequence */
export const StartPrinting = (_data) => {
  if (Platform.OS === 'android') {
    console.log('check start printing >>>>', _data);
    // arr.push({"item_count":3,"payment_option_title":"Cash On Delivery","total_discount":"0.00","address":{"address":"5, Madhya Marg, 28B, Sector 28B, Chandigarh, 160028, India","user_id":1,"id":77},"order_number":"02437024","address_id":77,"payment_option_id":1,"total_delivery_fee":"0.00","user_id":1,"total_amount":13,"id":391,"loyalty_amount_saved":"2.75","payable_amount":"10.25","taxable_amount":"0.00","vendors":[{"vendor":{"name":"La Fresca de Italia","id":2,"auto_accept_order":0},"vendor_id":2,"id":402,"order_id":391,"products":[{"addon":[],"product_id":71,"order_vendor_id":402,"variant":[{"quantity":12,"product_id":71,"id":85,"sku":"LA113","title":null}],"id":450,"product_name":" Buckhorn Burger","order_id":391},{"addon":[],"product_id":72,"order_vendor_id":402,"variant":[{"quantity":12,"product_id":72,"id":86,"sku":"LA114","title":null}],"id":451,"product_name":"Ham Sandwich","order_id":391},{"addon":[],"product_id":73,"order_vendor_id":402,"variant":[{"quantity":12,"product_id":73,"id":87,"sku":"LA115","title":null}],"id":452,"product_name":"Quesadilla","order_id":391}]}],"user":{"timezone":"Asia\/Kolkata","name":"Pankaj Pundir","id":1}})

    arr.push(_data);

    if (canEnablePrinter) {
      console.log('check start printing >>>> 1');
      initPrinter();
    }
  }
};

/** @function : Start Printing Loop for all queued jobs */
export const initPrinter = () => {
  console.log('check start printing >>>> 2', arr[0]);
  canEnablePrinter = false;

  _getOrderDetails(arr[0])
    .then((res) => {
      console.log('check _getOrderDetails response >>>', res);
      console.log(
        'check _getOrderDetails response >>>',
        SunmiV2Printer.hasPrinter,
      );
      if (SunmiV2Printer.hasPrinter) {
        console.log('printRecieptWithSunmi');
        printRecieptWithSunmi(res).then(() => {
          arr.shift();
          setTimeout(() => {
            if (arr.length > 0) {
              initPrinter();
            } else {
              canEnablePrinter = true;
            }
          }, 2000);
        });
      } else {
        console.log('printReciept');
        printReciept(res).then(() => {
          arr.shift();
          setTimeout(() => {
            if (arr.length > 0) {
              initPrinter();
            } else {
              canEnablePrinter = true;
            }
          }, 2000);
        });
      }
    })
    .catch((err) => {
      console.log('check catch block >>>', err);
      canEnablePrinter = true;
    });
};

/** @function : Get Image and convert into Base64 for print on bill */
function getBase64Image(img) {
  let imagePath = null;
  return new Promise((resolve) => {
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', img)
      // the image is now dowloaded to device's storage
      .then((resp) => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then((base64Data) => {
        // here's base64 encoded image
        // remove the file from storage
        resolve({ url: imagePath, base64String: base64Data });
        // return fs.unlink(imagePath);
      });
  });
}

const base64Logo = '';

export const printReciept = async (data) => {
  console.log('check notifications length >>>> 8', data);
  return new Promise((resolve, reject) => {
    const detail = data;
    BluetoothManager.checkBluetoothEnabled().then(
      async (enabled) => {
        let total_amt = 0;
        await detail.vendors[0].products.forEach(async (el) => {
          total_amt = total_amt + el.quantity * el.price;
        });

        console.log('check start printing >>>> 4');
        const isConnected = await BluetoothManager.getConnectedDeviceAddress();
        console.log(
          'check start printing >>>> 5',
          isConnected,
          '>>>>>>>',
          enabled,
        );
        if (enabled && isConnected) {
          console.log('check start printing >>>> 6');
          try {
            await BluetoothEscposPrinter.printerInit();

            const base64Data = await getBase64Image(
              `${detail.admin_profile.logo.image_fit}200/200${detail.admin_profile.logo.image_path}`,
            );

            await BluetoothEscposPrinter.printPic(base64Data.base64String, {
              width: 200,
              left: 0,
            });
            await fs.unlink(base64Data.url);
            await BluetoothEscposPrinter.printText(
              `\r\n\ ${detail.order_number}\r\n\r\n`,
              {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 1.5,
                heigthtimes: 1.5,
                fonttype: 1,
              },
            );
            // await BluetoothEscposPrinter.printText(`${detail.vendors[0].vendor.name}\r\n\r\n\r\n`, {
            //   encoding: 'GBK',
            //   codepage: 0,
            //   widthtimes: 1.5,
            //   heigthtimes: 1.5,
            //   fonttype: 1
            // });
            await BluetoothEscposPrinter.printerAlign(
              BluetoothEscposPrinter.ALIGN.CENTER,
            );
            await BluetoothEscposPrinter.printText(
              `${strings.ORDER_DETAILS}\r\n\r\n`,
              {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0.5,
                heigthtimes: 0.5,
                fonttype: 1,
              },
            );

            await BluetoothEscposPrinter.printerAlign(
              BluetoothEscposPrinter.ALIGN.LEFT,
            );

            if (detail.scheduled_date_time !== null) {
              await BluetoothEscposPrinter.printText(
                `${strings.CUSTOMER}: ${`${detail.user.name}`}\r\n${strings.ORDER_PLACE_ON
                }: ${`${moment(detail.created, 'DD-MM-YYYY hh:mm').format(
                  'YYYY-MM-DD [at] hh:mm A',
                )}`}\r\n${strings.TOBE_PREPARED}: ${moment(
                  detail.scheduled_date_time,
                  'DD-MM-YYYY hh:mm',
                ).format(
                  'YYYY-MM-DD [at] hh:mm A',
                )}\r\n\r\n${detail.luxury_option.title.toUpperCase()}\r\n${detail.address ? detail.address.address : ''
                }\r\n----------------------------------------------\r\n`,
                {},
              );
            } else {
              await BluetoothEscposPrinter.printText(
                `${strings.CUSTOMER}: ${`${detail.user.name}`}\r\n${strings.ORDER_PLACE_ON
                }: ${`${moment(detail.created, 'DD-MM-YYYY hh:mm').format(
                  'YYYY-MM-DD [at] hh:mm A',
                )}`}\r\n\r\n${detail.luxury_option.title.toUpperCase()}\r\n${detail.address ? detail.address.address : ''
                }\r\n----------------------------------------------\r\n`,
                {},
              );
            }

            await BluetoothEscposPrinter.setBlob(8);
            await BluetoothEscposPrinter.printerAlign(
              BluetoothEscposPrinter.ALIGN.CENTER,
            );
            /** Create Column **/
            let columnWidths = [30, 13];
            await BluetoothEscposPrinter.printColumn(
              columnWidths,
              [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.RIGHT,
              ],
              [`${strings.ITEM}`, strings.AMOUNT],
              {},
            );

            /** Add Items **/
            await detail.vendors[0].products.forEach(async (el) => {
              const title =
                el.pvariant.title && el.pvariant.title !== null
                  ? `${el.product_name}(${el.pvariant.title})`
                  : `${el.product_name}`;
              // const title = `${el.product_name}`
              BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [
                  `${el.quantity} X ${title}`,
                  JSON.stringify(el.quantity * el.price),
                ],
                {},
              );

              /** Add ons If available **/
              if (el.addon.length > 0) {
                let arr = el.addon.map((el) => el.option.title);
                arr = '(' + arr.join(',') + ')';
                BluetoothEscposPrinter.printColumn(
                  columnWidths,
                  [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                  ],
                  [arr, ''],
                  {},
                );
              }
              await BluetoothEscposPrinter.printText('\r\n', {});
            });

            await BluetoothEscposPrinter.printText(
              '\r\n----------------------------------------------\r\n',
              {},
            );

            await BluetoothEscposPrinter.printColumn(
              [16, 11, 9, 10],
              [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.CENTER,
                BluetoothEscposPrinter.ALIGN.RIGHT,
              ],
              [
                `${strings.TOTAL}`,
                JSON.stringify(detail.item_count),
                ' ',
                JSON.stringify(total_amt) + '\r\n',
              ],
              {},
            );

            await BluetoothEscposPrinter.printColumn(
              [25, 20],
              [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.RIGHT,
              ],
              [
                `${strings.DELIVERY_FEE}`,
                `${detail.total_delivery_fee.toString()}` + '\r\n',
              ],
              {},
            );

            await BluetoothEscposPrinter.printColumn(
              [15, 30],
              [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.RIGHT,
              ],
              [
                `${strings.DISCOUNT}`,
                `-${detail.total_discount.toString()}` + '\r\n',
              ],
              {},
            );

            if (!(detail.vendors.length > 1)) {
              await BluetoothEscposPrinter.printColumn(
                [15, 30],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [
                  `${strings.LOYALTY}`,
                  `-${detail.loyalty_amount_saved.toString()}` + '\r\n',
                ],
                {},
              );

              await BluetoothEscposPrinter.printColumn(
                [15, 30],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`${strings.TAXES_FEES}`, detail.taxable_amount + '\r\n'],
                {},
              );

              await BluetoothEscposPrinter.printColumn(
                [15, 30],
                [
                  BluetoothEscposPrinter.ALIGN.LEFT,
                  BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                [`${strings.PAID_AMOUNT}`, detail.payable_amount + '\r\n'],
                {},
              );
            }

            await BluetoothEscposPrinter.printText(
              `----------------------------------------------\r\n\n${strings.WELCOME_NEXT_TIME}\r\n\r\n\r\n\r\n\n`,
              {},
            );

            await BluetoothEscposPrinter.cutOnePoint();

            console.log('check start printing >>>> 9');
            setTimeout(() => {
              resolve(true);
            }, 1000);
          } catch (e) {
            alert(e.message || 'ERROR');
            console.log('check start printing >>>> 12', e);
          }
        } else {
          canEnablePrinter = true;
          // alert(strings.SOMETHING_WENT_WRONG_PRINTER_MSG);
          AsyncStorage.getItem('BleDevice').then((res) => {
            console.log(
              'checking ble device storage data >>>',
              JSON.parse(res),
            );
            if (res !== null) {
              BluetoothManager.disconnect(JSON.parse(res).boundAddress).then(
                async (s) => {
                  AsyncStorage.removeItem('BleDevice');
                  BackgroundService.stop();
                },
              );
            }
          });
        }
      },
      (err) => {
        console.log(err);
        console.log('check start printing >>>> 11', err);
      },
    );
  }).catch((err) => console.log('check start printing >>>>>> 12', err));
};

export const printRecieptWithSunmi = async (data) => {
  console.log('check notifications length >>>> sunmi', data);
  return new Promise(async (resolve, reject) => {
    const detail = data;
    let total_amt = 0;
    await detail.vendors[0].products.forEach(async (el) => {
      total_amt = total_amt + el.quantity * el.price;
    });

    console.log('check start printing >>>> 6');
    try {
      const base64Data = await getBase64Image(
        `${detail.admin_profile.logo.image_fit}200/200${detail.admin_profile.logo.image_path}`,
      );
      //set aligment: 0-left,1-center,2-right
      await SunmiV2Printer.setAlignment(1);
      await SunmiV2Printer.printBitmap(
        base64Data.base64String,
        200 /*width*/,
        200 /*height*/,
      );
      // await SunmiV2Printer.printPic(base64Data.base64String, {
      //   width: 200,
      //   left: 0,
      // });
      console.log('base64Database64Data', base64Data);
      // await fs.unlink(base64Data.url);.

      await SunmiV2Printer.setFontSize(40);
      await SunmiV2Printer.printOriginalText(`\r\n${detail.order_number}`);

      await SunmiV2Printer.setFontSize(25);
      await SunmiV2Printer.setAlignment(1);
      await SunmiV2Printer.printOriginalText(
        `\r\n\r\n${strings.ORDER_DETAILS}\r\n`,
      );

      await SunmiV2Printer.setAlignment(0);

      if (detail.scheduled_date_time !== null) {
        await SunmiV2Printer.printOriginalText(
          `${strings.CUSTOMER}: ${`${detail.user.name}`}\r\n${strings.ORDER_PLACE_ON
          }: ${`${moment(detail.created, 'DD-MM-YYYY hh:mm').format(
            'YYYY-MM-DD [at] hh:mm A',
          )}`}\r\n${strings.TOBE_PREPARED}: ${moment(
            detail.scheduled_date_time,
            'DD-MM-YYYY hh:mm',
          ).format(
            'YYYY-MM-DD [at] hh:mm A',
          )}\r\n\r\n${detail.luxury_option.title.toUpperCase()}\r\n${detail.address ? detail.address.address : ''
          }\r\n----------------------------------------------\r\n`,
        );
      } else {
        await SunmiV2Printer.printOriginalText(
          `${strings.CUSTOMER}: ${`${detail.user.name}`}\r\n${strings.ORDER_PLACE_ON
          }: ${`${moment(detail.created, 'DD-MM-YYYY hh:mm').format(
            'YYYY-MM-DD [at] hh:mm A',
          )}`}\r\n\r\n${detail.luxury_option.title.toUpperCase()}\r\n${detail.address ? detail.address.address : ''
          }\r\n----------------------------------------------\r\n`,
        );
      }

      await SunmiV2Printer.setAlignment(1);
      await SunmiV2Printer.setFontSize(22);
      /** Create Column **/
      let columnAliment = [0, 1, 2];
      let columnWidth = [25, 1, 5];
      /** Add Items **/
      var listArr = [];
      detail.vendors[0].products.forEach(async (el) => {
        const title =
          el.pvariant.title && el.pvariant.title !== null
            ? `${el.product_name}(${el.pvariant.title})`
            : `${el.product_name}`;
        // const title = `${el.product_name}`

        listArr.push([
          'price',
          el.image_base64,
          JSON.stringify(el.quantity * el.price),
        ]);
        listArr.push([
          `${el.quantity} X ${title}`,
          '',
          JSON.stringify(el.quantity * el.price),
        ]);
        // await SunmiV2Printer.printColumnsText(
        //   [`${el.quantity} X ${title}`, '', ''],
        //   columnWidth,
        //   columnAliment,
        // );
        // await SunmiV2Printer.printColumnsText(
        //   ['', '', JSON.stringify(el.quantity * el.price)],
        //   columnWidth,
        //   columnAliment,
        // );

        /** Add ons If available **/
        if (el.addon.length > 0) {
          let arr = el.addon.map((el) => el.option.title);
          arr = '(' + arr.join(',') + ')';
          // await SunmiV2Printer.printColumnsText(
          //   [arr, '', ''],
          //   columnWidth,
          //   columnAliment,
          // );
          listArr.push([arr, '', '']);
        }
        // await SunmiV2Printer.printOriginalText('\r\n');
      });
      await SunmiV2Printer.setFontSize(22);
      for (var i in listArr) {
        console.log(listArr[i]);
        console.log(columnWidth);
        console.log(columnAliment);
        if (listArr[i][0] === 'price') {
          await SunmiV2Printer.setAlignment(0);
          await SunmiV2Printer.printBitmap(
            listArr[i][1],
            100 /*width*/,
            100 /*height*/,
          );
          // await SunmiV2Printer.setAlignment(1);
          // await SunmiV2Printer.printOriginalText(listArr[i][2]);
        } else {
          await SunmiV2Printer.printOriginalText('\r\n\r');
          await SunmiV2Printer.printColumnsText(
            listArr[i],
            columnWidth,
            columnAliment,
          );
          await SunmiV2Printer.printOriginalText('\r\n\r');
        }
      }
      await SunmiV2Printer.setFontSize(25);
      await SunmiV2Printer.printOriginalText('\r\n----------------\r\n');
      await SunmiV2Printer.setFontSize(23);
      await SunmiV2Printer.printColumnsText(
        [
          `${strings.TOTAL}`,
          JSON.stringify(detail.item_count),
          JSON.stringify(total_amt),
        ],
        [15, 1, 15],
        columnAliment,
      );
      await SunmiV2Printer.printColumnsText(
        [
          `${strings.DELIVERY_FEE}`,
          '',
          `${detail.total_delivery_fee.toString()}`,
        ],
        columnWidth,
        columnAliment,
      );
      await SunmiV2Printer.printColumnsText(
        [`${strings.DISCOUNT}`, '', `-${detail.total_discount.toString()}`],
        columnWidth,
        columnAliment,
      );

      if (!(detail.vendors.length > 1)) {
        await SunmiV2Printer.printColumnsText(
          [
            `${strings.LOYALTY}`,
            '',
            `-${detail.loyalty_amount_saved.toString()}`,
          ],
          [15, 1, 15],
          columnAliment,
        );
        await SunmiV2Printer.printColumnsText(
          [`${strings.TAXES_FEES}`, '', detail.taxable_amount],
          [15, 1, 15],
          columnAliment,
        );
        await SunmiV2Printer.printOriginalText(`---------\r\n`);
        await SunmiV2Printer.setFontSize(25);
        await SunmiV2Printer.printColumnsText(
          [`${strings.PAID_AMOUNT}`, '', detail.payable_amount],
          [15, 1, 10],
          columnAliment,
        );
      }
      await SunmiV2Printer.setFontSize(23);
      // await SunmiV2Printer.printOriginalText(
      //   `----------------------------------------------\r\n\n${strings.WELCOME_NEXT_TIME}\r\n\r\n\r\n\r\n\n`,
      //   {},
      // );
      await SunmiV2Printer.setAlignment(1);
      await SunmiV2Printer.printOriginalText(
        `----\r\n\n${strings.WELCOME_NEXT_TIME}----\r\n\r\n\r\n`,
      );
      await SunmiV2Printer.printOriginalText('\n\n');
      console.log('check start printing >>>> 9');
      setTimeout(() => {
        resolve(true);
      }, 1000);
    } catch (e) {
      alert(e.message || 'ERROR');
      console.log('check start printing >>>> 12', e);
    }
  }).catch((err) => console.log('check start printing >>>>>> 12', err));
};

// /** Create Column **/
// let columnWidths = [18, 5, 11, 9];
// await BluetoothEscposPrinter.printColumn(columnWidths,
//   [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
//   ["Item", 'Qty', 'Unit price', 'Amount'], {});

// /** Add Items **/
// await detail.vendors[0].products.forEach(async (el) => {
//   const title = el.pvariant.title && el.pvariant.title !== null ? `${el.product_name}(${el.pvariant.title})` : `${el.product_name}`
//   // const title = `${el.product_name}`
//   BluetoothEscposPrinter.printColumn(columnWidths,
//     [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
//     [title, JSON.stringify(el.quantity), JSON.stringify(el.price), JSON.stringify(el.quantity * el.price)], {});

//   /** Add ons If available **/
//   if (el.addon.length > 0) {
//     let arr = el.addon.map(el => el.option.title)
//     arr = '(' + arr.join(',') + ')'
//     BluetoothEscposPrinter.printColumn(columnWidths,
//       [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
//       [arr, '', '', ''], {});
//   }

// });
