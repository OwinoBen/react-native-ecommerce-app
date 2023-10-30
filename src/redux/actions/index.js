// import * as auth from "./auth";
import * as auth from './auth';
import * as brand from './brand';
import * as cart from './cart';
import * as home from './home';
import * as init from './init';
import * as product from './product';
import * as vendor from './vendor';
import * as celebrity from './celebrity';
import * as order from './order';
import * as pickup from './pickupdelivery';
import * as pendingNotifications from './pendingNotifications';
import * as addressSearch from './addressSearch';
import * as walletUserVerify from './walletUserVerify';
import * as reloadData from './reloadData';
import * as chat from './chat';
import * as chatRefresh from './chatRefresh';
import * as p2p from './p2p';

export default {
  ...init,
  ...auth,
  ...home,
  ...vendor,
  ...product,
  ...brand,
  ...cart,
  ...celebrity,
  ...order,
  ...pickup,
  ...pendingNotifications,
  ...addressSearch,
  ...walletUserVerify,
  ...reloadData,
  ...chat,
  ...chatRefresh,
  ...p2p,
};
