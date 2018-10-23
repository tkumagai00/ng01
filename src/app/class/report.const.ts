import {Report} from "./report.interface";

/**
 * レポートクラスの初期値
 * @type {Report}
 */
export const INIT_REPORT = <Report>{
  title: "",
  timeStamp: 0,
  customerId: 0,
  action: "",
  reportId: "",
  userId: "",
  reportStr: "",
  isFileExist: false,
  resizePhoto: ""
};
