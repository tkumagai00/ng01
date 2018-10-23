/**
 * アップロードサービス
 * アップロードするデータを一時保管し、通信可能になった時点で自動送信する
 */
import {Injectable, OnDestroy} from "@angular/core";
import {HttpService} from "./http.service";
import {CryptoStorageService} from "./cryptoStorage.service";
import {AppConfig} from "../class/appconfig.class";
import "rxjs/add/operator/retry";
import "rxjs/add/operator/toPromise";
import {GlobalEventName, GlobalEventService} from "./globalEvent.service";
import {Subscription} from "rxjs/Subscription";
import {Actions} from "../store/actions";
import {DbService} from "./db.service";
import {HttpReqOptions} from "../class/httpOption.interface";

@Injectable()
export class UploadService implements OnDestroy {

  globalEvent: Subscription[] = [];

  constructor(private httpService: HttpService,
              private cryptoStorageService: CryptoStorageService,
              private globalEventService: GlobalEventService,
              private actions: Actions,
              private dbService: DbService) {
    console.log("@@@@ UploadService生成");

    //起動時に未送信データを再送
    this.upload();

    //グローバルイベント受信登録(ONLINE）
    this.globalEvent.push(
      this.globalEventService
      .subscribe(GlobalEventName.ONLINE,
        () => this.upload())
    );

  }

  //グローバルイベント受信解除
  ngOnDestroy(): void {
    this.globalEvent
    .map(sub => sub.unsubscribe());
  }

  /**
   * 報告データ送信の設定
   * @param name  データの種別(報告は"report")
   * @param method HTTPメソッド
   * @param config　オプション設定
   * @returns {Promise<void>}
   */
  async setReport(name: string, method: string,
                  config: HttpReqOptions) {

    let timestamp = Date.now();
    let data = {
      method: method,
      config: config　//header,bodyを含む
    };
    /**暗号データストレージに一時保存
     キーは、”UPLOAD_report<timestamp>" */
    this.cryptoStorageService.setItem(
      AppConfig.UPLOAD_PREFIX + name + timestamp, data);
    //送信
    this.upload();
  }

  /**
   * データ送信
   * @returns {Promise<void>}
   */
  private async upload() {

    //送信待ちデータ名の取得
    let items: string[] = this.getUploadItems();
    //送信待ちなしの時は何もしない
    if (items.length === 0) return;

    console.log("@@@報告の自動送信開始");
    //送信待ちデータ名を元に順に暗号ストレジから読み込み送信
    for (let i = 0; i < items.length; i++) {
      //ストレージからデータ読み込み
      let itemName = AppConfig.UPLOAD_PREFIX + items[i];
      let data = this.cryptoStorageService.getItem(itemName);
      //送信
      try {
        let result: any =
          await  this.httpService.send(data.method, data.config);
      } catch (err) {
        console.log("@@@報告送信失敗" + itemName);
        continue;
      }
      console.log("@@@報告送信成功" + itemName);
      //送信に成功したデータは削除
      this.cryptoStorageService.removeItem(itemName);
    }

    //すべての送信が成功した時はDB更新後、DB更新イベント発行
    items = this.getUploadItems();
    if (items.length === 0) {
      await this.updateDd();
      this.globalEventService.publish(GlobalEventName.ON_UPDATEDB);
    }
  }

  /**
   * DBの更新
   * @returns {Promise<void>}
   */
  private async updateDd() {
    console.log("@@@ローカルデータベースの更新");
    //顧客情報の取得WebAPIを呼び出し
    let config: HttpReqOptions = {
      url: AppConfig.apiUrl + "customer"
    };
    let result: any = await this.httpService.send("get", config);
    if (!result.data) {
      console.log("@@@DBの更新に失敗しました");
      return;
    }
    //受信した顧客データ（顧客情報、報告）をDBへ書き込み
    let data = result.data;
    await this.dbService.clear();
    await this.dbService.insert(data.customer);
    await this.dbService.insert(data.report);
  }

  /**
   * アップロード待ちデータのキーを取得
   * @returns {string[]}　キーの文字列
   */
  private getUploadItems(): string[] {
    // 暗号保存データからキーを取得、接頭語削除
    let items: string[] = this.cryptoStorageService.getKeys()
    .filter(v => v.indexOf(AppConfig.UPLOAD_PREFIX) === 0)
    .map(v => v.slice(AppConfig.UPLOAD_PREFIX.length))
    .sort(); //古いデータから先に送信（キー末尾のタイムスタンプで並べ替え）
    this.actions.update({uploadItems: items});
    return items;
  }

}
