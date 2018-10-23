/**
 * 以下の方法でログオフ
 * ログオフ時はデータ消去
 * １.logoffメソッド
 * ２.一定時間操作が無いとき
 * ３.JWTトークンの有効祈願が切れたとき
 * スリープ対応のため
 * ウェイクアップ時のチェック
 */
import {Injectable, OnDestroy} from "@angular/core";
import {AppConfig} from "../class/appconfig.class";
import {Subscription} from "rxjs/Subscription";
import {JwtService} from "./jwt.service";
import {GlobalEventName, GlobalEventService} from "./globalEvent.service";
import {CryptoService} from "./crypto.service";
import {AppState} from "../store/state";
import {CryptoStorageService} from "./cryptoStorage.service";
import {Actions} from "../store/actions";
import {NgRedux} from "@angular-redux/store";

@Injectable()
export class LogoutService implements OnDestroy {

  startTime = 0;
  timer: any = null;
  globalEvent: Subscription[] = [];
  isSavedState = false;

  constructor(private jwtService: JwtService,
              private globalEventService: GlobalEventService,
              private cryptoService: CryptoService,
              private cryptoStorageService: CryptoStorageService,
              private ngRedux: NgRedux<any>) {
    console.log("@@@@ logoutService生成");

    // ログアウトイベント受信登録
    this.globalEvent.push(
      this.globalEventService
      .subscribe(GlobalEventName.LOGOUT,
        () => this.logout())
    );

    // ブラウザ終了前イベント受信登録
    this.globalEvent.push(
      this.globalEventService
      .subscribe(GlobalEventName.ON_BEFOREUNLOAD,
        () => this.saveSnapshot())
    );

    // ウェイクアップ時の受信登録
    this.globalEvent.push(
      this.globalEventService
      .subscribe(GlobalEventName.ON_FOCUS,
        () => this.checkTimeout())
    );
    // マウスクリック時の受信登録
    this.globalEvent.push(
      this.globalEventService
      .subscribe(GlobalEventName.ON_CLICK,
        () => this.resetLogoutTimer())
    );
    // キーボード操作時の受信登録
    this.globalEvent.push(
      this.globalEventService
      .subscribe(GlobalEventName.ON_KEYPRESS,
        () => this.resetLogoutTimer())
    );
  }

  // グローバルイベント受信登録の解除
  ngOnDestroy(): void {
    this.globalEvent
    .map(sub => sub.unsubscribe());
  }

  /**
   * 定期間隔間隔でタイムアウトを監視
   */
  startMonitorLogoutTime() {
    this.timer =
      setInterval(() => this.checkTimeout(),
        AppConfig.CHECK_TOKEN_INTERVAL * 60 * 1000);
    this.resetLogoutTimer();
  }

  /**
   *  タイムアウト経過時間のリセット
   */
  private resetLogoutTimer() {
    this.startTime = Date.now();//利用時刻の更新
  }

  /**
   * タイムアウト確認
   * タイムアウト時はログアウト
   */
  private checkTimeout() {

    console.log("@@@ タイムアウトのチェック");

    // トークン有効期限
    if (!this.jwtService.isValidToken()) {
      console.log("@@@ トークン期限切れログアウト");
      this.logout();
      return;
    }

    //無操作の経過時間
    let now = Date.now();//現在時刻
    let diff = now - this.startTime;//経過時間
    if (diff > (AppConfig.AUTO_LOGOUT * 60 * 1000)) {
      console.log("@@@ 自動ログアウト時間経過");
      this.logout();
      return;
    }
  }

  /**
   * ログアウト
   * ローカルデータ消去と状態オブジェクト保存後、ログイン画面へ遷移
   */
  logout() {
    console.log("@@@ Logout開始");

    //自動ログアウト管理タイマー停止
    window.clearInterval(this.timer);

    //状態オブジェクト保存
    this.saveSnapshot();

    // Cookieトークン消去
    document.cookie = AppConfig.JWT_HEADER + "='';max-age=0";

    //暗号キー消去
    this.cryptoService.setCryptpKey("");

    //ログイン画面へ遷移
    location.href = AppConfig.loginUrl;
  }

  /**
   * 状態オブジェクトの保存
   */
  saveSnapshot() {

    //二重保存防止
    if (this.isSavedState) {
      return;
    }

    if (!this.cryptoService.isExistDbKey()) {
      console.log(
        "@@@ DB暗号キーが無いため状態オブジェクトを保存しません");
      return;
    }

    console.log("@@@@ 状態オブジェクトの保存開始");
    let state = this.ngRedux.getState();
    let snapshot: AppState = {
      url: state.url as string,
      selectedCustomer: state.selectedCustomer,
      userId: state.user,
      isOpenModal: state.isOpenModal,
      searchWord: state.searchWord,
      tempReport: state.tempReport,
      tempPhoto: state.tempPhoto,
      locale: state.locale
    };
    this.cryptoStorageService.setItem("snapshot", snapshot);
    console.log("@@@@ 状態オブジェクトの保存完了");

    //状態オブジェクト保存済みフラグ
    this.isSavedState = true;

  }


}


