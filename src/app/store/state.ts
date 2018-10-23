import {Report} from "../class/report.interface";
import {Customer} from "../class/customer.interface";
import {INIT_CUSTOMER} from "../class/customer.const";
import {INIT_REPORT} from "../class/report.const";

/**
 *アプリ全体を管理するReduxステート情報の構造を定義しています
 *ステート情報の初期値についても定義しています
 */
export interface AppState {
  searchWord?: string;//顧客リスト画面の検索ワード
  customers?: Customer[];//顧客情報
  selectedCustomer?: Customer;//画面で選択された顧客情報
  reports?: Report[];//報告書履歴
  tempReport?: Report;//作成中の報告書
  tempPhoto?: string;//作成中の報告書に添付の写真
  userId?: number; //このアプリを使っているユーザーID
  locale?: string;//ロケール
  isMobile?: boolean; //モバイル画面か？
  isOpenModal?: boolean;//モーダル画面は開いているか？
  url?: string;//表示しているコンポーネントのルーターパス
  uploadItems?: string[];//アップロード待ちのキー名の配列
}

/**
 * アプリ全体のステート初期値.
 * app.module.ts内で初期化実施.
 * @type {AppState}
 */
export const INIT_APP_STATE: AppState = <AppState> {
  searchWord: "",
  customers: null,
  selectedCustomer: INIT_CUSTOMER,
  reports: null,
  tempReport: INIT_REPORT,
  tempPhoto: "",
  locale: "",
  userId: 0,
  isMobile: false,
  isOpenModal: false,
  url: "",
  uploadItems: []
};


