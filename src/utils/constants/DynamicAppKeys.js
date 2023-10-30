import { Platform } from 'react-native';
import { getBundleId } from 'react-native-device-info';

const shortCodes = {
  patazone:'3f7cc9',
  
};

const appIds = {
  patazone: Platform.select({
    ios: 'com.patazone.order',
    android: 'com.patazone.order',
  }),
  
};

const socialKeys = {
  TWITTER_COMSUMER_KEY:
    getBundleId() == appIds.runrun
      ? 'OCOQeRWzRoDAnGNbNFsbN5kuk'
      : getBundleId() == appIds.royoorder
        ? 'R66DHARfuoYAPowApUxNxwbPi'
        : getBundleId() == appIds.capcorp
          ? 'R66DHARfuoYAPowApUxNxwbPi'
          : getBundleId() == appIds.tranzit
            ? 'iOOPhwfIqnQfmyjZqDbKzMNgP'
            : getBundleId() == appIds.hmoobhub
              ? 'AvNzKlREbm3Aan3sEKYbXv0k8'
              : 'R66DHARfuoYAPowApUxNxwbPi',
  TWITTER_CONSUMER_SECRET:
    getBundleId() == appIds.runrun
      ? 'zBfzttCBVAzimuaIsDWDU1MjqI4pWzvNsrW6YOYPVZtgtzTlN8'
      : getBundleId() == appIds.royoorder
        ? 'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15'
        : getBundleId() == appIds.capcorp
          ? 'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15'
          : getBundleId() == appIds.tranzit
            ? 'pg72uq6SVPkUn0Ts3lQWPfqHSXwR09Tb64d3bPrnIcPnZdd5Tq'
            : getBundleId() == appIds.hmoobhub
              ? '5UW5ukiVG49CmpAh7hBWP333K68gz8hfeUXzmoL3p6jIWy0qQa'
              : 'itcicJ7fUV3b73B8V05GEDBo4tzxGox2Si2q0BCk5pue327k15',
};

export { appIds, socialKeys, shortCodes };
