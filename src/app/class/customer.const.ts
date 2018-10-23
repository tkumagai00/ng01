import {Customer} from "./customer.interface";

/**
 * 顧客クラスの初期値
 * @type {Customer}
 */
export const INIT_CUSTOMER = <Customer> {
  id: 0,
  name: "",
  tel: "",
  person: "",
  address: "",
  revenue: "",
  contract: "",
  userId: "",
  pc: "",
  goods: "",
  service: "",
  label: "",
  updateTime: 0,
  dataLabel: "",
  name_en: "",
  person_en: "",
  address_en: "",
  reportNum: 0,
  name_i18n: "", // 指定したロケールでの値
  address_i18n: "" // 指定したロケールでの値
};
