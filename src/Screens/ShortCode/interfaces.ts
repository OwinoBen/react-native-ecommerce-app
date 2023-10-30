export interface initBootInterface {
  auth: any,
  themeToggle: boolean,
  themeColor: boolean,
  deepLinkUrl: string
}
export interface IRootState {
  initBoot: initBootInterface;
  auth: userDataInterface;
}

export interface userDataInterface {
  auth_token: string;
  userData: object;
}
