import validator from 'is_js';
import strings from '../constants/lang';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { isEmpty } from 'lodash';
const checkEmpty = (val, key, key2 = true) => {
  if (validator.empty(val.trim())) {
    return `${strings.PLEASE_ENTER} ${key2 ? `${strings.YOUR} ` : ''}${key}`;
  } else {
    return '';
  }
};

const checkEmptyForSelection = (val, key, key2 = true) => {
  if (validator.empty(val)) {
    return `${strings.PLEASE_SELECT} ${key2 ? `${strings.YOUR} ` : ''}${key}`;
  } else {
    return '';
  }
};

const checkMinLength = (val, minLength, key) => {
  if (val.trim().length < minLength) {
    return `${strings.PLEASE_ENTER_VALID} ${key}`;
  } else {
    return '';
  }
};

const checkNumeric = (val, key) => {
  if (isNaN(val)) {
    return false;
  } else {
    return `${strings.PLEASE_ENTER_VALID_NUMERIC} ${key}`;
  }
};

export default function (data) {
  let error = '';
  const {
    username,
    email,
    name,
    password,
    phoneNumber,
    newPassword,
    confirmPassword,
    message,
    otp,
    address,
    street,
    city,
    pincode,
    states,
    country,
    callingCode,
    promocode,
    vendorName,
    vendorAddress,
    driverType,
    driverTeam,
    driverTransportDetails,
    driverUID,
    driverLicencePlate,
    driverColor,
    driverTransportType,
    selectedBuisnessType,
    productCategory,
    productDetail,
    productName,
    mrp,
    salePrice,
    vendorLogo,
    vendorTitle,
    vendorDesc,
    isTermsConditions,
    price,
    aadharNumber,
    aadharFrontImg,
    aadharBackImg,
    upiId,
    bankName,
    beneficiaryName,
    accountNumber,
    ifscCode,
    houseNo,
    productImg,
    productLocation
  } = data;

  if (productImg !== undefined) {
    if (isEmpty(productImg)) {
      return 'Please upload product images';
    }
  }

  if (username !== undefined) {
    let emptyValidationText = checkEmpty(username, strings.NAME);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(username, 3, strings.NAME);
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (name !== undefined) {
    let emptyValidationText = checkEmpty(name, strings.NAME);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(name, 3, strings.NAME);
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }
  if (selectedBuisnessType !== undefined) {
    let emptyValidationText = checkEmpty(
      selectedBuisnessType,
      strings.ENTER_NEW_ADDRESS,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (productCategory !== undefined) {
    let emptyValidationText = checkEmpty(
      productCategory,
      strings.ENTER_NEW_ADDRESS,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (productName !== undefined) {
    let emptyValidationText = checkEmpty(
      productName,
      strings.PRODUCT_NAME,
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (productDetail !== undefined) {
    let emptyValidationText = checkEmpty(
      productDetail,
      strings.ENTER_PRODUCT_DESC,
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (mrp !== undefined) {
    let emptyValidationText = checkEmpty(mrp, strings.ENTER_NEW_ADDRESS);
    let checkNumericValue = checkNumeric(mrp, strings.ENTER_NEW_ADDRESS);
    console.log(checkNumericValue, 'checkNumericValue');
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else if (checkNumericValue) {
      return checkNumericValue;
    }
  }
  if (salePrice !== undefined) {
    let emptyValidationText = checkEmpty(salePrice, strings.ENTER_NEW_ADDRESS);
    let checkNumericValue = checkNumeric(salePrice, strings.ENTER_NEW_ADDRESS);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else if (checkNumericValue) {
      return checkNumericValue;
    }
  }

  if (productLocation !== undefined) {
    if (isEmpty(productLocation)) {
      return "Please select product availablity location"
    }
  }

  if (price !== undefined) {
    let emptyValidationText = checkEmpty(price, strings.PRICE, false);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (address !== undefined) {
    let emptyValidationText = checkEmpty(address, strings.ENTER_NEW_ADDRESS);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (street !== undefined) {
    let emptyValidationText = checkEmpty(street, strings.ENTER_STREET);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (city !== undefined) {
    console.log(city, 'city>>>>>>>>>>>');
    let emptyValidationText = checkEmpty(city, strings.CITY);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (states !== undefined) {
    let emptyValidationText = checkEmpty(states, strings.STATE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (country !== undefined) {
    let emptyValidationText = checkEmpty(country, strings.COUNTRY);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (pincode !== undefined) {
    let emptyValidationText = checkEmpty(pincode, strings.PINCODE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  // if (lastName !== undefined) {
  // 	let emptyValidationText = checkEmpty(lastName, 'last name');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	} else {
  // 		let minLengthValidation = checkMinLength(lastName, 3, 'Last name');
  // 		if (minLengthValidation !== '') {
  // 			return minLengthValidation;
  // 		}
  // 	}
  // // }

  // if (date !== undefined) {
  // 	let emptyValidationText = checkEmpty(date, 'date');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	} else {
  // 		if (validator.date(date)) {
  // 			ToastAndroid.showWithGravityAndOffset(`please Valid ${date}`,
  //   ToastAndroid.LONG,
  //   ToastAndroid.TOP,
  //   0,
  //   100
  //   )
  // 			return 'Please enter valid email';
  // 		}
  // 	}
  // }

  if (email !== undefined) {
    if (email === 'emptyValid') {
      return;
    }
    let emptyValidationText = checkEmpty(email, strings.EMAIL);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      if (!validator.email(email)) {
        return strings.PLEASE_ENTER_VALID_EMAIL;
      }
    }
  }

  if (phoneNumber !== undefined) {
    if (phoneNumber === 'emptyValid') {
      return;
    }
    // let emptyValidationText = checkEmpty(phoneNumber, strings.PHONE_NUMBER);
    // if (emptyValidationText !== '') {
    //   return emptyValidationText;
    // }
    if (!/^[0][1-9]$|^[0-9]\d{4,14}$/.test(phoneNumber)) {
      return strings.PLEASE_ENTER_VALID_PHONE_NUMBER;
    }

    // let isTrue = isValidPhoneNumber(`+${callingCode}${phoneNumber}`);

    if (phoneNumber == '') {
      return strings.PLEASE_ENTER_YOUR_PHONE_NUMBER;
    }
    // if (isTrue) {
    // } else {
    //   return strings.PHONE_NUMBER_NOT_VALID;
    // }
  }

  if (otp !== undefined) {
    let emptyValidationText = checkEmpty(otp, strings.OTP);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  // if(emailMobile!==undefined){
  // 	let emptyValidationText = checkEmpty(emailMobile, 'Email or mobile');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	}
  // 	if (!/^[0][1-9]$|^[1-9]\d{8,14}$/.test(emailMobile)) {
  // 		if (!validator.email(emailMobile)) {
  // 			return 'Please enter valid email or mobile';
  // 		}
  // 	}
  // }

  if (vendorTitle !== undefined) {
    let emptyValidationText = checkEmpty(vendorTitle, 'title', false);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (password !== undefined) {
    let emptyValidationText = checkEmpty(password, strings.PASSWORD);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(password, 6, strings.PASSWORD);
      if (minLengthValidation !== '') {
        if (password != undefined) {
          return strings.PASSWORD_REQUIRE_SIX_CHARACTRES;
        }
        return strings.INVALID_PASSWORD;
      }
    }
  }

  if (newPassword !== undefined) {
    let emptyValidationText = checkEmpty(newPassword, strings.PASSWORD);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(
        newPassword,
        6,
        strings.PASSWORD,
      );
      if (minLengthValidation !== '') {
        if (newPassword != undefined) {
          return strings.NEW_PASSWORD_REQUIRE_SIX_CHARACTRES;
        }
        return strings.NEW_INCORRECT_PASSWORD;
      }
    }
  }

  if (confirmPassword !== undefined) {
    let emptyValidationText = checkEmpty(
      confirmPassword,
      strings.CONFIRM_PASSWORD,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
    if (confirmPassword != newPassword) {
      return strings.PASSWORD_NOT_MATCH;
    }
  }

  if (message !== undefined) {
    let emptyValidationText = checkEmpty(message, strings.MESSAGE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(message, 6, strings.MESSAGE);
      if (minLengthValidation !== '') {
        return strings.PLEASE_ENTER_AT_LEAST_SIX_CHARACTERS;
      }
    }
  }

  if (promocode !== undefined) {
    let emptyValidationText = checkEmpty(promocode, strings.PROMO_CODE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(
        promocode,
        3,
        strings.PROMO_CODE,
      );
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (vendorLogo !== undefined) {
    if (validator.empty(vendorLogo)) {
      return 'Please upload vendor logo';
    }
  }

  if (vendorName !== undefined) {
    let emptyValidationText = checkEmpty(
      vendorName,
      strings.ENTER_VENDOR_NAME,
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(
        vendorName,
        3,
        strings.ENTER_VENDOR_NAME,
      );
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (vendorDesc !== undefined) {
    let emptyValidationText = checkEmpty(vendorDesc, 'description', false);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (vendorAddress !== undefined) {
    let emptyValidationText = checkEmpty(
      vendorAddress,
      strings.VENDOR_ADDRESS,
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  // if(!isTermsConditions){
  //   return "Please accecpt Terms & Conditions"
  // }

  if (driverType !== undefined) {
    let emptyValidationText = checkEmptyForSelection(
      driverType,
      'valid driver type',
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (driverTeam !== undefined) {
    let emptyValidationText = checkEmptyForSelection(
      driverTeam,
      'valid driver team',
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (driverTransportDetails !== undefined) {
    let emptyValidationText = checkEmpty(
      driverTransportDetails,
      'year, make , model',
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (driverUID !== undefined) {
    let emptyValidationText = checkEmpty(driverUID, strings.UID, false);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (driverLicencePlate !== undefined) {
    let emptyValidationText = checkEmpty(
      driverLicencePlate,
      'valid Licence Plate',
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (driverColor !== undefined) {
    let emptyValidationText = checkEmpty(
      driverColor,
      'valid color name',
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (driverTransportType !== undefined) {
    let emptyValidationText = checkEmptyForSelection(
      driverTransportType,
      'valid transport type',
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  //

  if (aadharNumber !== undefined) {
    let emptyValidationText = checkEmpty(aadharNumber, 'Aadhar number', false);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (aadharFrontImg !== undefined) {
    if (isEmpty(aadharFrontImg)) {
      return 'Please upload Aadhar front image';
    }
  }

  if (aadharBackImg !== undefined) {
    if (isEmpty(aadharBackImg)) {
      return 'Please upload Aadhar back image';
    }
  }

  if (upiId !== undefined) {
    let emptyValidationText = checkEmpty(upiId, 'UPI id', false);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (bankName !== undefined) {
    let emptyValidationText = checkEmpty(bankName, 'bank name', false);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (beneficiaryName !== undefined) {
    let emptyValidationText = checkEmpty(
      beneficiaryName,
      'account holder name',
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (accountNumber !== undefined) {
    let emptyValidationText = checkEmpty(
      accountNumber,
      'account number',
      false,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (ifscCode !== undefined) {
    let emptyValidationText = checkEmpty(ifscCode, 'IFSC code', false);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (houseNo !== undefined) {
    let emptyValidationText = checkEmpty(houseNo, strings.HOUSE_NO);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
}

