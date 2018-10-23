import {Injectable} from "@angular/core";
import {JwtHelper} from "angular2-jwt";
import {AppConfig} from "../class/appconfig.class";

@Injectable()
export class JwtService {

  private jwtHelper: JwtHelper;

  constructor() {
    console.log("@@@@ JwtService生成");
    this.jwtHelper = new JwtHelper();
  }

  /**
   * Cookieからトークンを取得
   * @returns string トークン文字列
   */
  private getTokenFromCookie(): string {
    let key = AppConfig.JWT_HEADER;
    let cookies = document.cookie.split(";");
    let item = cookies.find((v, i) => {
      return (v.indexOf(key) !== -1);
    });
    if (!item) {
      console.log("＠＠＠トークンがありません");
      return "";
    }
    let tmpArr = item.split("=");
    if (!tmpArr || tmpArr.length !== 2) return "";
    let token = (tmpArr[1]).replace("%20", " ");
    if (!token) {
      console.log("@@@ トークンの取得失敗");
      return "";
    }
    return token;
  }

  /**
   * cookieにあるトークンの有効期限確認
   * @returns {boolean} 有効か？
   */
  isValidToken(): boolean {
    let token = this.getTokenFromCookie();
    if (!token) {
      return false;
    }
    let ret = !this.jwtHelper.isTokenExpired(token);
    let ret3 = this.jwtHelper.getTokenExpirationDate(token);
    if (!ret) {
      console.log("@@@ トークン有効期限切れ");
    }
    return ret;
  }

}
