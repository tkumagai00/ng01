import {Injectable} from "@angular/core";
import {DbService} from "../../service/db.service";
import {HttpService} from "../../service/http.service";
import {Router} from "@angular/router";
import {NavigationService} from "../../service/navigation.service";
import {CryptoService} from "../../service/crypto.service";
import {NgRedux} from "@angular-redux/store";
import {AppState} from "../../store/state";
import {Actions} from "../../store/actions";
import {AppConfig} from "../../class/appconfig.class";
import {CryptoStorageService} from "../../service/cryptoStorage.service";
import {DownloadComponent} from "./download.component";
import {LogoutService} from "../../service/logout.service";
import {HttpReqOptions} from "../../class/httpOption.interface";

//ダウンロード画面専用のサービス
@Injectable()
export class DownloadService {

  constructor(private dbService: DbService,
              private httpService: HttpService,
              private router: Router,
              private transitionService: NavigationService,
              private cryptoService: CryptoService,
              private cryptoStorageService: CryptoStorageService,
              private ngRedux: NgRedux<AppState>,
              private actions: Actions,
              private  logoutService: LogoutService) {
    console.log("@@@@ DownloadService生成");
  }

  async startDownload(ref: DownloadComponent) {

    // 暗号キーとユーザID取得と設定
    await this.getUserData();

    //顧客情報の更新
    await this.download(ref);

    //自動復元のON/OFF確認
    let autoRestore =
      localStorage.getItem("autoRestore") === "enable";

    /**自動復元ONの時**/
    if (autoRestore) {
      const snapshot = this.cryptoStorageService.getItem("snapshot");
      if (snapshot) {
        this.cryptoStorageService.removeItem("snapshot");
        console.log("@@@@ 状態オブジェクトの読み込み");
        console.dir(snapshot);
      }
      if (snapshot &&
        autoRestore &&
        snapshot.url &&
        snapshot.url !== "/app" &&
        snapshot.url !== "/app/download"
      ) {
        this.actions.update(snapshot);
        console.log("@@@@ 前回終了時を復元" + snapshot.url);
        this.transitionService.canTransition = true;
        this.router.navigate([snapshot.url]);
        return;
      }
    }

    /**自動復元OFFの時**/
    // ステートを初期化して顧客リスト画面へ移動
    this.actions.update({searchWord: "", isOpenModal: false});
    this.transitionService.canTransition = true;
    this.router.navigate(["/app/customerList"]);
  }


  /**
   * 起動時の処理.
   */
  async download(ref: DownloadComponent) {
    console.log("@@@　初期ダウンロード処理開始");
    ref.progress = 30;
    console.log("@@@ データベース初期化");
    await  this.dbService.clear();
    console.log("@@@ 顧客情報ダウンロード");
    ref.progress = 70;
    let result = await  this.getCustomerData();
    console.log("@@@ 顧客情報保存");
    ref.progress = 90;
    await  this.storeCustomerData(result);
  }


  /**
   * ユーザーデータと暗号キーをサーバーから取得して保存
   */
  async getUserData() {
    //ユーザー認証リクエスト送信
    // let option =
    let config: HttpReqOptions = {url: AppConfig.apiUrl + "user"};
    let res: any = await this.httpService.send("get", config);

    //アプリの動作設定値をサーバーからの指示で上書き
    let bconfig = res.data.browserConfig;
    //自動ログアウトまでの時間
    AppConfig.AUTO_LOGOUT = bconfig.AUTO_LOGOUT;
    //トークンの有効期限確認間隔
    AppConfig.CHECK_TOKEN_INTERVAL = bconfig.CHECK_TOKEN_INTERVAL;
    //ログアウトタイマー開始
    this.logoutService.startMonitorLogoutTime();

    //暗号キーの設定
    this.cryptoService.setCryptpKey(bconfig.DB_KEY);
    //ユーザーIDの設定
    this.actions.update({userId: res.data.userData.id});//ユーザーID
    console.log("@@@ ユーザー情報の設定完了");
  }

  /**
   * 顧客データと報告履歴をサーバーから取得
   */
  private async getCustomerData() {
    let state: AppState = this.ngRedux.getState();
    let config: HttpReqOptions = {
      url: AppConfig.apiUrl + "customer"
    };
    // let config = new RequestOptions(param);
    let res = await
      this.httpService.send("get", config);
    return res;
  }

  /**
   * 顧客データと報告履歴を保存
   */
  private async storeCustomerData(result: any) {
    let data = result.data;
    await  this.dbService.insert(data.customer);
    await  this.dbService.insert(data.report);
  }

  logout() {
    this.logoutService.logout();
  }
}
