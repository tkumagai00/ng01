/**
 * HTTP通信サービス
 * URL末尾にtimestamp文字を付与してブラウザキャッシュ防止
 * デフォルトでCredential有効設定
 */
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfig} from "../class/appconfig.class";
import "rxjs/add/operator/retry";
import "rxjs/add/operator/toPromise";
import {HttpReqOptions} from "../class/httpOption.interface";

@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {
    console.log("@@@@ httpService生成");
  }

  /**
   *  HTTPリクエスト送信
   * @param method HTTPメソッド名
   * @param config オプション設定
   * @returns Promise{any}
   */
  send(method: string, config: HttpReqOptions): Promise<any> {

    // ネットワークの利用可否を確認
    if (!window.navigator.onLine) {
      console.log("@@@ ネットワークに接続できません");
      return Promise.reject("OFFLINE");
    }

    /* * 引数configの値を加工**/
    //url設定
    if (config.url.indexOf("http") === -1) {
      config.url = location.protocol + "//" +
        location.host + config.url;
    }

    /* * 既定の設定オブジェクトを作成**/
    //キャッシュ防止のためのダミー文字列をurlに追加
    let noCacheStr = Date.now().toString();
    let param = new HttpParams().set("dummy", noCacheStr);
    // ヘッダー設定
    let header = new HttpHeaders().set("Content-Type", "application/json; charset=utf-8");

    let reqOptions = {
      body: config.body,
      headers: header,
      params: param,
      withCredentials: true
    };

    /**通信開始**/
    console.log("@@@ req Url: " + config.url);
    return this.http.request<any>(method.toUpperCase(), config.url, reqOptions)
    .retry(AppConfig.retryNum)  //リトライ回数
    .toPromise() //ObservableをPromiseへ変換
    .then(res => this.httpSucess(res)) //通信成功時の処理
    .catch((error) => this.httpError(error)); //通信失敗時の処理
  }

  /**
   * 通信成功時の処理
   * @param res　Responseオブジェクト
   * @returns Promise<any> body
   */
  private httpSucess(res: Response): Promise<any> {
    let body: any = res || {message: "応答データが空白"};
    if (body) {
      return Promise.resolve(body);
    } else {
      throw new Error(body.message);
    }
  }

  /**
   * 通信失敗時の処理
   * @param error エラーオブジェクト
   */
  private httpError(error: any) {
    alert("通信エラー\n" + error.toString());
    throw new Error(error);
  }

}
