import {DbService} from "../../service/db.service";
import {Router} from "@angular/router";
import {NavigationService} from "../../service/navigation.service";
import {Injectable} from "@angular/core";
import {Report} from "../../class/report.interface";
import {AppConfig} from "../../class/appconfig.class";
import {INIT_REPORT} from "../../class/report.const";
import {NgRedux} from "@angular-redux/store";
import {AppState} from "../../store/state";
import {Actions} from "../../store/actions";
import {LogoutService} from "../../service/logout.service";
import {UploadService} from "../../service/upload.service";
import * as deepmerge from "deepmerge";
import {HttpReqOptions} from "../../class/httpOption.interface";

@Injectable()
export class CustomerDetailService {

  constructor(private dbService: DbService,
              private uploadService: UploadService,
              private router: Router,
              private transitionService: NavigationService,
              private ngRedux: NgRedux<any>,
              private actions: Actions,
              private logoutService: LogoutService) {
    console.log("@@@@ 顧客情報画面用サービス生成");
  }


  /**
   * DBから表示データの取得（メインメソッド）
   * @param id
   */
  async getData(id?: number) {

    let customerId = id;
    let state = this.ngRedux.getState();

    //表示する顧客を判別できないときは顧客リストへ戻る
    if (!state.selectedCustomer) {
      this.transitionService.canTransition = true;
      this.router.navigate(["/app/customerList"]);
      return;
    }

    if (!customerId) {
      customerId = state.selectedCustomer.id;
    }
    console.log("@@@@ 顧客Id=" + customerId);

    this.actions.update({
      reports: null
    });
    let result: any;
    console.log("@@@@ 顧客情報の読み込み開始");
    try {

      //顧客詳細情報
      let query: any = {id: customerId};
      result = await this.dbService.find(query);
      let tmpcustomer = result[0];
      this.actions.update({selectedCustomer: tmpcustomer});

      //営業報告
      query = {
        dataLabel: "report",
        customerId: customerId
      };
      let sort = {timeStamp: -1};
      result = await this.dbService.find(query, {}, sort);
      this.actions.update({reports: result});

    } catch (e) {
      alert("顧客情報の読み込み失敗");
      return Promise.reject(e);
    }

    console.log("@@@@ 顧客情報の読み込み成功");
    return Promise.resolve(result);
  }


  /**
   * ナビバーメニューの処理
   */
  onSelectMenu(item: string) {

    switch (item) {
      case "back":
        console.log("@@@@戻る　顧客リスト画面へ");
        this.goCustomerList();
        break;
      case "report":
        console.log("@@@@報告入力");
        this.inputReport();
        break;
      case "history":
        console.log("@@@@報告履歴画面へ");
        this.goReportHistory();
        break;
      case "logout":
        console.log("@@@@ログアウト");
        this.logoutService.logout();
        break;
    }
  }

  /**
   * ヘッダーメニュー項目ごとの処理.
   * 戻る　顧客リスト画面へ遷移
   */
  goCustomerList() {
    //画面遷移
    this.transitionService.canTransition = true;
    this.router.navigate(["/app/customerList"]);
  }

  /**
   * 報告入力.
   */
  inputReport() {
    console.log("@@@@新規レポート生成");
    let state = this.ngRedux.getState();
    let tmp = <Report>deepmerge({}, INIT_REPORT);
    tmp.timeStamp = Date.now();
    tmp.userId = state.userId;
    tmp.customerId = state.selectedCustomer.id;
    console.log("@@@@新規レポート登録、入力ダイアログ開く");
    this.actions.update({
      isOpenModal: true,
      tempReport: tmp
    });
  }

  /**
   * 報告履歴画面へ遷移
   */
  goReportHistory() {
    //画面遷移の許可
    this.transitionService.canTransition = true;
    //画面遷移
    this.router.navigate(["/app/reportHistory"]);
  }

  //送信データの削除.
  removeTempReport() {
    this.actions.update({
      tempReport: INIT_REPORT,
      tempPhoto: ""
    });
  }

  //報告の送信
  sendReport() {
    let state: AppState = this.ngRedux.getState();

    // 報告IDの生成（再送時は同一のIDを使用）
    if (!state.tempReport.reportId) {
      let timestamp = Date.now();
      state.tempReport.reportId = "" + state.userId + timestamp;
      this.actions.update({tempReport: state.tempReport});
    }
    // 送信条件設定
    const config: HttpReqOptions = {
      url: AppConfig.apiUrl + "report",
      body: JSON.stringify({
        report: state.tempReport,
        resizePhoto: state.tempPhoto
      })
    };
    // アップロードサービスへ値を渡す
    this.uploadService.setReport("report", "post", config);
    console.log("@@@@ 報告のアップロード登録完了");
    this.removeTempReport();
  }

}
