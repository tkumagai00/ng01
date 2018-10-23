/**
 * 暗号化localStprage
 */
import {Injectable} from "@angular/core";
import {CryptoService} from "./crypto.service";

@Injectable()
export class CryptoStorageService {

  PREFIX = "encrypto_";

  constructor(private cryptoService: CryptoService) {
    console.log("@@@@ cryptoStorageService生成");
  }

  /**
   * データ保存
   * @param key　キー
   * @param data　データ(オブジェクト可)
   */
  setItem(key: string, data: any) {
    let keyStr = this.PREFIX + key;
    let str = JSON.stringify(data);
    try {
      str = this.cryptoService.enCrypt(str);
      localStorage.setItem(keyStr, str);
    } catch (e) {
      throw new Error("setItem Error:"
        + e.message);
    }
  }

  /**
   *データ 読み取り
   * @param key
   * @return {any}
   */
  getItem(key: string) {
    let keyStr = this.PREFIX + key;
    let data: any;
    let str = localStorage.getItem(keyStr);
    try {
      str = this.cryptoService.deCrypt(str);
      data = JSON.parse(str);
    } catch (e) {
      console.log("@@@getItem Error:"
        + e.message);
    }
    return data;
  }

  /**
   * 1件削除
   * @param key
   */
  removeItem(key: string) {
    let keyStr = this.PREFIX + key;
    localStorage.removeItem(keyStr);
  }

  /**
   * 登録項目名の配列取得
   * @returns {Array} キーの文字配列
   */
  getKeys(): any {

    let arrKey = [];
    Object.keys(localStorage).map((key) => {
      if (key.indexOf(this.PREFIX) !== -1) {
        arrKey.push(key.replace(this.PREFIX, ""));
      }
    });
    return arrKey;
  }

  /**
   * 保存したデータを全て削除
   */
  clearItem() {
    let keys = this.getKeys();
    keys.forEach((v, i) => localStorage.remove(this.PREFIX + keys[i]));
  }

}
