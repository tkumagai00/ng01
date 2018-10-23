import {HttpService} from "../../service/http.service";
import {Injectable} from "@angular/core";
import {AppConfig} from "../../class/appconfig.class";
import {HttpReqOptions} from "../../class/httpOption.interface";

/**
 * 報告履歴用のサービス
 **/
@Injectable()
export class ReporthistoryService {

  constructor(private httpService: HttpService) {
    console.log("@@@@ 報告履歴画面用サービス生成");
  }

  /**
   * サーバーからデータ取得
   * @param begin 取得開始位置
   * @param size　件数
   * @return {Promise<any>}
   */
  async getRecord(begin: number, size: number): Promise<any> {
    console.log("@@@@ データ受信開始:" + begin
      + "～" + (begin + size - 1));

    // HTTPリクエスト条件設定
    let config: HttpReqOptions = {
      url: AppConfig.apiUrl + "report/" + begin + "/" + size + "/"
    };
    // let config = new RequestOptions(param);

    // HTTPリクエスト
    let res: any;
    try {
      res = await this.httpService.send("get", config);
    } catch (err) {
      throw new Error("データ受信失敗:" + begin
        + "～" + (begin + size - 1));
    }
    //受信データ処理
    let rec = res.data;
    if (rec && rec.length) {
      console.log("@@@@ データ受信成功:" + rec[0].id
        + "～" + (rec[0].id + rec.length - 1));
    }
    return Promise.resolve(rec);
  }
}
