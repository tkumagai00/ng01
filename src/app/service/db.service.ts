/**
 * NeDB ラッパーAPI.
 * NeDBのデータ暗号化とユーティリティ機能.
 */
import {Injectable} from "@angular/core";
import {AppConfig} from "../class/appconfig.class";
import {CryptoService} from "./crypto.service";
import * as NeDB from "nedb";
import {DataStoreOptions} from "nedb";

@Injectable()
export class DbService {

  db: NeDB;
  DB_NAME = AppConfig.DB_NAME;

  constructor(private cryptoService: CryptoService) {
    console.log("@@@@ dbService生成");
  }

  /**
   * データベースを開く.
   * @return {Promise<any>}
   */
  async open(): Promise<any> {

    //すでに開いているときは何もしない.
    if (this.db) {
      return Promise.resolve("DB_SUCCESS:EXIST");
    }

    console.log("@@@@@ DBオープン開始");
    let dbParam: DataStoreOptions = {};
    dbParam.filename = this.DB_NAME;

    /*
    *暗号処理関数の定義
    * コールバック呼び出しで利用されるためthisの固定を行う
    */
    dbParam.afterSerialization =
      this.cryptoService.enCrypt.bind(this.cryptoService);
    dbParam.beforeDeserialization =
      this.cryptoService.deCrypt.bind(this.cryptoService);

    //インメモリ動作のオン・オフ
    dbParam.inMemoryOnly = AppConfig.isMemoryDB;

    //DBインスタンス生成
    this.db = new NeDB(dbParam);

    //DBオープン
    return await new Promise<any>((resolve, reject) => {
      this.db.loadDatabase((err) => {
        if (!err) {
          console.log("@@@ DBオープン成功");
          return resolve("DB_SUCCESS:OPEN");
        } else {
          alert(" DBオープン失敗  DBをリセットします\n" + err.toString());
          indexedDB.deleteDatabase("NeDB");
          location.href = AppConfig.loginUrl;
        }
      });
    });
  }

  /**
   * データインサート
   * @param obj　追加データ
   * @return {Promise<any>} インサートされた件数
   */
  async insert(obj: any): Promise<any> {
    console.log("@@@@ DB insert開始");

    await this.open();

    return await new Promise<any>((resolve, reject) => {
      this.db.insert(obj, (err, newDocs) => {
        if (!err) {
          if (newDocs.length === obj.length) {
            console.log("@@@@ DB insert成功:" + newDocs.length + "件");
            return resolve(newDocs.length);
          }
        }
        throw new Error("@@@ DB insert失敗");
      });
    });
  }

  /**
   * データ更新
   * @param query　条件
   * @param updateData　更新データ
   * @return {Promise<any>} 更新された件数
   */
  async update(query: any, updateData: any): Promise<any> {
    console.log("@@@@ DB update開始");

    await this.open();

    return await new Promise<any>((resolve, reject) => {
      this.db.update(query, updateData, {multi: true},
        (err, numReplaced) => {
          if (!err) {
            console.log("@@@@ DB update成功=" + numReplaced);
            return resolve(numReplaced);
          } else {
            throw new Error("@@@@ DB update失敗");
          }
        });
    });
  }

  /**
   * データ削除
   * @param query 条件
   * @return {Promise<any>}
   */
  async remove(query: any): Promise<any> {
    console.log("@@@@ DB remove開始");

    await this.open();

    return await  new Promise<any>((resolve, reject) => {
      this.db.remove(query, {multi: true},
        (err, numRemoved) => {
          if (!err) {
            console.log("@@@ DB remove成功" + numRemoved);
            return resolve(numRemoved);
          } else {
            throw new Error("@@@ DB remove失敗");
          }
        });
    });
  }

  /**
   * データ検索
   * @param query 検索条件
   * @param projection　出力項目
   * @param sort　並べ替え
   * @return {Promise<any>}
   */
  async find(query: any, projection = {}, sort = {}): Promise<any> {
    console.log("@@@@ DB find開始");

    await this.open();

    return await new Promise<any>((resolve, reject) => {
      this.db.find(query, projection).sort(sort)
      .exec((err, docs) => {
        if (!err) {
          console.log("@@@ DB find成功" + docs.length);
          return resolve(docs);
        } else {
          throw new Error("@@@ DB find失敗");
        }
      });
    });
  }

  /**
   * データ件数
   * @param query 検索条件
   * @return {Promise<any>}
   */
  async count(query: any): Promise<any> {
    console.log("@@@@ DB count開始");

    await this.open();

    return await new Promise<any>((resolve, reject) => {
      this.db.count(query, (err, count) => {
        if (!err) {
          console.log("@@@ DB count成功=" + count);
          return resolve(count);
        } else {
          throw new Error("@@@ DB count失敗");
        }
      });
    });
  }

  /**
   * データの全件削除
   * @return {Promise<any>}
   */
  async clear(): Promise<any> {
    console.log("@@@@ DB clear開始");

    await this.open();

    return await new Promise<any>((resolve, reject) => {
      this.db.remove({}, {multi: true}, (err, numRemoved) => {
        if (!err) {
          console.log("@@@ DB clear成功" + numRemoved);
          //DB圧縮
          this.db.persistence.compactDatafile();
          return resolve(numRemoved);
        } else {
          throw new Error("@@@ DB clear失敗");
        }
      });
    });
  }

}
