import {Injectable} from "@angular/core";
import * as CryptoJS from "crypto-js";
import {AppConfig} from "../class/appconfig.class";
import {Actions} from "../store/actions";

@Injectable()
export class CryptoService {
  /** 暗号キー */
  private key: string;

  constructor(private actions: Actions) {
    console.log("@@@@ cryptoService生成");
  }

  /**
   * 暗号キーの設定
   * @param key
   */
  setCryptpKey(key: string): void {
    this.key = key;
  }

  /**
   * 暗号キー設定の有無確認.
   * @returns {boolean}
   */
  isExistDbKey(): boolean {
    if (!this.key) {
      console.log("暗号キーがありません");
      location.href = AppConfig.loginUrl;
      return false;
    }
    return true;
  }

  /**
   * 暗号化
   * @param doc 入力文字列
   * @return {string} 暗号文字列(Base64形式)
   */
  enCrypt(doc: string) {
    this.isExistDbKey();
    //console.log("入力平文:", doc.substr(0,100));
    let cryptStr = CryptoJS.AES.encrypt(doc, this.key);
    let base64 = cryptStr.toString();
    //console.log("出力暗号文:", base64.substr(0,100));
    return base64;
  }

  /**
   * 復号
   * @param base64 入力文字列(Base64形式)
   * @return {string} 復号文字列(UTF-8)
   */
  deCrypt(base64: string) {
    //console.log("入力暗号文:", base64.substr(0,100));
    this.isExistDbKey();
    let decrypted = CryptoJS.AES.decrypt(base64, this.key);
    let doc = decrypted.toString(CryptoJS.enc.Utf8);
    //console.log("出力復号文:", doc.substr(0,100));
    return doc;
  }

}
