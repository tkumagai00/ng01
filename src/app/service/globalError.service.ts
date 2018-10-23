import {ErrorHandler, Injectable} from "@angular/core";
import {AppConfig} from "../class/appconfig.class";

// モジュール全体のエラー発生を捕捉
@Injectable()
export class GlobalErrorService implements ErrorHandler {

  constructor() {
    console.log("@@@ globalErrorService生成 ");
  }

  /**
   * エラーハンドラーの実装
   * ダイアログ、コンソール、localStorageにエラーを出力.
   * @param e エラーオブジェクト
   */
  handleError(e: any) {
    console.error("@@@@@グローバルエラー捕捉@@@@@");

    //タイムスタンプの取得
    let dateObj = new Date();
    let timeStamp = dateObj.getTime();
    let timeStr = dateObj.toISOString();
    //スタックトレースを含むエラー情報取得
    let msg = e.name + "\n" + e.message +
      "CallStack:\n" + e.stack.split("\n").slice(2).join("\n");
    //ブラウザのユーザーエージェント取得
    let userAgent = window.navigator.userAgent;

    //コンソールへ出力
    console.error(msg);

    //ログのアップロードのために一時保存
    localStorage.setItem(AppConfig.ERROR_LOG_NAME,
      JSON.stringify({
        timeStamp: timeStamp,
        timeStr: timeStr,
        message: msg,
        userAgent: userAgent
      }));
    //ログイン画面へ戻る
    window.location.href = AppConfig.loginUrl;
  }

}
