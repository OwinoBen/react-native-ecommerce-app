import DeviceInfo from 'react-native-device-info';
import LocalizedStrings from 'react-native-localization';
import ar from './ar';
import de from './de';
import en from './en';
import es from './es';
import fa from './fa';
import fr from './fr';
import hi from './hi';
import it from './it';
import ne from './ne';
import pt from './pt';
import ru from './ru';
import sv from './sv';
import tr from './tr';
import vi from './vi';
import zh from './zh';
import bn from './bn'

import {appIds} from '../../utils/constants/DynamicAppKeys';
import ar_baytukom from './ar_baytukom';
import es_elcheragio from './es_elcheragio';
import es_heybuddy from './es_heybuddy';
import es_sabroson from './es_sabroson';
import swa from './swa';
import heb from './heb'
import fr_oxo from './fr_oxo';
import ar_oneStop from './ar_oneStop';

//Spanish fils

const spanishfile = () => {
  switch (DeviceInfo.getBundleId()) {
    case appIds?.elcheregio:
      return es_elcheragio;
    case appIds?.heyBuddy:
      return es_heybuddy;
    case appIds?.sabroson:
      return es_sabroson;
    default:
      return es;
  }
};

const arbicFile = () => {
  switch (DeviceInfo.getBundleId()) {
    case appIds?.baytukom:
      return ar_baytukom;
    case appIds.oneStop:
      return ar_oneStop;
    default:
      return ar;
  }
};
const frenchFile = () => {
  switch (DeviceInfo.getBundleId()) {
    case appIds?.oxo:
      return fr_oxo;
    default:
      return fr;
  }
};


let strings = new LocalizedStrings({
  en: en,
  ar: arbicFile(),
  es: spanishfile(),
  de: de,
  fr: frenchFile(),
  tr: tr,
  sv: sv,
  zh: zh,
  ru: ru,
  pt: pt,
  vi: vi,
  hi: hi,
  ne: ne,
  it: it,
  fa: fa,
  swa: swa,
  bn:bn,
  he: heb,
});
export const changeLaguage = (languageKey) => {
  strings.setLanguage(languageKey);
};
export default strings;
