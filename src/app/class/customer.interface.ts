/**
 * 顧客クラスの型定義
 */
export interface Customer {
  id: number;
  name: string;
  tel: string;
  person: string;
  address: string;
  revenue: string;
  contract: string;
  userId: string;
  pc: string;
  goods: string;
  service: string;
  label: string;
  updateTime: number;
  dataLabel: string;
  name_en: string;
  person_en: string;
  address_en: string;
  reportNum: number;
  name_i18n: string; // 指定したロケールでの値
  address_i18n: string; // 指定したロケールでの値
}

