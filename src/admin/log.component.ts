/**
 * ログ表示コンポーネント
 */

import {Component, OnInit} from "@angular/core";
import {AppConfig} from "../app/class/appconfig.class";
import {HttpService} from "../app/service/http.service";
import {Title} from "@angular/platform-browser";
import {HttpReqOptions} from "../app/class/httpOption.interface";

@Component({
  selector: "log-compo",
  templateUrl: "./log.component.html",
  styleUrls: ["./log.component.css"]
})
export class LogComponent implements OnInit {

  logArray: {
    id: number,
    timeStamp: string,
    message: string,
    shortMessage: string,
    userAgent: string;
  }[];

  constructor(private httpService: HttpService,
              private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle("エラーログ");
    this.getLog();
  }

  //エラーログの受信
  private async getLog() {

    // 送信条件設定
    let config: HttpReqOptions = {
      url: AppConfig.apiUrl + "log"
    };

    // 送信
    let result: any;
    try {
      result = await  this.httpService.send("get", config);
    } catch (err) {
      alert("ログの受信に失敗");
      return;
    }

    let arr = [];
    result.data.map((obj) => {
      let d = new Date(obj.timeStamp);
      let dateStr = d.toLocaleString();
      arr.push(
        {
          id: obj.id,
          timeStamp: dateStr,
          shortMessage: obj.message.substring(0, 200),
          message: obj.message,
          userAgent: obj.userAgent
        });
    });
    this.logArray = arr;
    //     .map(row=>)
    console.log("@@@ログの受信に成功");
  }

  onMenuClick(name: string, eventt: any) {
    location.href = AppConfig.loginUrl;
  }
}
