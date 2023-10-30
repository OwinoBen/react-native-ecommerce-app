import { PayWithFlutterwave } from 'flutterwave-react-native';

export function payWithCard(detail) {
  console.log(detail, 'payWithCarddetail');
  return new Promise((resolve, reject) => {
    let configuration = new PaymentSDKConfiguration();
    configuration.profileID = detail?.profileID || '56491';
    configuration.serverKey =
      detail?.serverKey || 'SMJN92NJRN-JDHZZB6LK9-TZZ2TNGZGL';
    configuration.clientKey =
      detail?.clientKey || 'C6KM2B-2HBV6D-H992GB-MTPKRB';
    configuration.cartID = '-';
    configuration.currency = detail?.currency || 'SAR';
    configuration.cartDescription = '-';
    configuration.merchantCountryCode = 'SA';
    configuration.merchantName = detail?.merchantname || 'Flowers Store';
    configuration.amount = Number(detail?.total_payable_amount);
    configuration.screenTitle = 'Pay with Card';
    configuration.hideCardScanner = false;
    configuration.showBillingInfo = true;
    configuration.showShippingInfo = false;

    let billingDetails = new PaymentSDKBillingDetails(
      '',
      'sandy.das11@gmail.com',
      '9878654322',
      'asdasd' || 'xyz',
      'dasdsad' || 'xyz',
      'dasdasdasd' || 'xyz',
      'SA',
      '1234',
    );
    // configuration.billingDetails = billingDetails

    console.log(configuration, 'configuration');

    RNPaymentSDKLibrary.startCardPayment(JSON.stringify(configuration)).then(
      (result) => {
        if (result['PaymentDetails'] != null) {
          let paymentDetails = result['PaymentDetails'];
          resolve(paymentDetails);
        } else if (result['Event'] == 'CancelPayment') {
          // console.log("Cancel Payment Event")
          resolve('Cancel Payment Event');
        }
      },
      function (error) {
        // console.log("payment", error)
        reject(error);
      },
    );
  });
}

export async function payWithApplePay(detail) {
  let configuration = new PaymentSDKConfiguration();
  configuration.profileID = '56491';
  configuration.serverKey = 'SMJN92NJRN-JDHZZB6LK9-TZZ2TNGZGL';
  configuration.clientKey = 'C6KM2B-2HBV6D-H992GB-MTPKRB';
  configuration.cartID = '5445454454';
  configuration.currency = 'INR';
  configuration.cartDescription = 'Flowers';
  configuration.merchantCountryCode = 'IN';
  configuration.merchantName = 'Sand Box';
  configuration.amount = 1;
  configuration.merchantIdentifier = 'merchant.com.app.sponge';

  RNPaymentSDKLibrary.startApplePayPayment(JSON.stringify(configuration)).then(
    (result) => {
      console.log('payment result', result);
      if (result['PaymentDetails'] != null) {
        // Handle transaction details
        let paymentDetails = result['PaymentDetails'];
        // console.log(paymentDetails)
        return paymentDetails;
      } else if (result['Event'] == 'CancelPayment') {
        // Handle events
        // console.log("Cancel Payment Event")
        return 'Cancel Payment Event';
      }
    },
    function (error) {
      // handle errors
      // console.log(error)
      return error;
    },
  );
}
/* An example function to generate a random transaction reference */
export const generateTransactionRef = (length) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `flw_tx_ref_${result}`;
};

export function payWithFlutterWave(detail, handleOnRedirect) {
  return (
    <PayWithFlutterwave
      onRedirect={handleOnRedirect}
      options={{
        tx_ref: generateTransactionRef(10),
        authorization: 'FLWPUBK_TEST-3d894b0ac8e67651eea04e8ddc4b384b-X',
        customer: {
          email: 'customer-email@example.com',
        },
        amount: 2000,
        currency: 'NGN',
        payment_options: 'card',
      }}
    />
  );
}
