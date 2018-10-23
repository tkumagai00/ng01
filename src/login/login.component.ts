/**
 * ログインコンポーネント
 */

import {Component, OnInit} from "@angular/core";
import {AppConfig} from "../app/class/appconfig.class";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "../app/service/http.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {HttpReqOptions} from "../app/class/httpOption.interface";

@Component({
  selector: "app-root",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {

  userId: string; //ユーザーID
  password: string; //パスワード
  autoRestore: string; //自動復元有効フラグ(enable,disable)
  alertMsg = ""; //ngx-bootstrapの警告UIの表示文字

  constructor(private titleService: Title,
              private httpService: HttpService,
              private router: Router) {
    // Cookieにトークンが残っていた場合は消去
    document.cookie = AppConfig.JWT_HEADER + "='';max-age=0";
  }

  /**
   * 初期処理
   */
  ngOnInit() {
    this.titleService.setTitle("ログイン");
    this.userId = "1234";
    // this.userId = "1000";//管理者用
    this.password = "0000";
    this.autoRestore = localStorage.getItem("autoRestore");
    if (!this.autoRestore) {
      this.autoRestore = "disable";
      localStorage.setItem("autoRestore", "disable");
    }
    this.uploadErrorLog(); //未送信エラーログ送信
  }

  /**
   * 自動復元のオン/オフ
   */
  onClickButton() {
    localStorage.setItem(
      "autoRestore", this.autoRestore);
  }

  /**
   * バックエンドへログインリクエスト
   * @returns {Promise<void>}
   */
  async submit() {
    let config: HttpReqOptions = {
      url: AppConfig.authUrl,
      body: {
        userId: this.userId,
        password: this.password
      }
    };
    // let config = RequestOptions(option);
    let res: any = await this.httpService.send("post", config);
    if (!res.success) {
      alert("ログイン失敗\n" + res.message);
      return;
    }

    //Web API接続先Url取得
    AppConfig.apiUrl = res.data.apiUrl;

    let roll = res.data.userData.roll;
    switch (roll) {
      case "admin":
        this.router.navigate(["/admin"]);
        break;
      case "user":
        this.router.navigate(["/app"]);
        break;
      default:
        alert("ログイン失敗\nroll名が不正:" + roll);
    }

  }

  /**
   *エラーログの送信
   */
  private async uploadErrorLog() {
    // localStorageからエラーログを読み取り
    let msg = localStorage.getItem(AppConfig.ERROR_LOG_NAME);
    if (!msg) return;

    //エラーログがあった場合はバックエンドへ送信
    this.alertMsg += "エラー情報を送信中";

    // 送信条件設定
    const config: HttpReqOptions = {
      body: msg,
      url: AppConfig.apiUrl + "log"
    };

    // 送信
    try {
      let result: any =
        await  this.httpService.send("post", config);
    } catch (err) {
      this.alertMsg = "異常終了しました<br>エラー情報の送信に失敗";
      console.log("@@@エラー情報の送信に失敗");
      localStorage.removeItem(AppConfig.ERROR_LOG_NAME);
      return;
    }
    this.alertMsg = "異常終了しました<br>エラー情報は送信済み";
    console.log("@@@エラー情報の送信に成功");
    localStorage.removeItem(AppConfig.ERROR_LOG_NAME);
  }

}
