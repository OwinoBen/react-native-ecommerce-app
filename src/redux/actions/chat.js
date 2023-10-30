import {
  AGENT_CHAT,
  ALL_ROOM_USER,
  GET_ALL_MESSAGES,
  GET_PRODUCT_RELATED_TO_CHAT,
  P2P_USER_TO_USER_CHAT,
  SEND_MESSAGE,
  SEND_NOTIFCATION,
  START_CHAT,
  USER_CHAT,
  VENDOR_CHAT,
} from '../../config/urls';
import { apiGet, apiPost, getItem } from '../../utils/utils';

export function onStartChat(data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    apiPost(START_CHAT, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function fetchUserChat(data = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    const getAppData = await getItem('appData');

    const socketUrl = getAppData?.appData?.profile?.socket_url;

    apiPost(socketUrl + USER_CHAT, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function fetchVendorChat(data = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    const getAppData = await getItem('appData');
    const socketUrl = getAppData?.appData?.profile?.socket_url
    console.log("socketUrlsocketUrl vendor", socketUrl)
    apiPost(socketUrl + VENDOR_CHAT, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function fetchAgentChat(data = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    const getAppData = await getItem('appData');
    const socketUrl = getAppData?.appData?.profile?.socket_url;
    console.log('getAppDatagetAppData', getAppData);

    apiPost(socketUrl + AGENT_CHAT, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function sendMessage(data = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    const getAppData = await getItem('appData');
    const socketUrl = getAppData?.appData?.profile?.socket_url;

    apiPost(socketUrl + SEND_MESSAGE, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getAllMessages(query = '', data = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    const getAppData = await getItem('appData');
    const socketUrl = getAppData?.appData?.profile?.socket_url;

    apiGet(socketUrl + GET_ALL_MESSAGES + query, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getAllRoomUser(query = '', data = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    const getAppData = await getItem('appData');
    const socketUrl = getAppData?.appData?.profile?.socket_url;

    console.log("socekt url", socketUrl + ALL_ROOM_USER + query)

    apiGet(socketUrl + ALL_ROOM_USER + query, data, headers)
      .then((response) => {
        console.log("room user response", response)
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function sendNotification(data = {}, headers = {}) {
  console.log(SEND_NOTIFCATION, data, 'all notification data');
  return new Promise(async (resolve, reject) => {
    apiPost(SEND_NOTIFCATION, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function fetchP2pUserToUsertChat(data = {}, headers = {}) {
  return new Promise(async (resolve, reject) => {
    const getAppData = await getItem('appData');
    const socketUrl = getAppData?.appData?.profile?.socket_url;
    console.log(socketUrl + P2P_USER_TO_USER_CHAT, "aksjfkjdshf")
    apiPost(socketUrl + P2P_USER_TO_USER_CHAT, data, headers)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getProuctDetailsRelatedToChat(data = {}, headers = {}) {
  return apiPost(GET_PRODUCT_RELATED_TO_CHAT, data, headers);
}
