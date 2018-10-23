import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";

// グローバルイベント名
export enum GlobalEventName {
  ONLINE, OFFLINE, LOGOUT, ON_UPDATEDB,
  ON_CLICK, ON_FOCUS, ON_BEFOREUNLOAD, ON_RESIZE,
  ON_KEYPRESS
}

// グローバルイベントの型
interface GlobalEvent {
  name: GlobalEventName;
  data?: any;
}

// グローバルイベントサービス
@Injectable()
export class GlobalEventService {

  private sub = new Subject<GlobalEvent>();

  constructor() {
    console.log("@@@ globalEventService生成 ");
  }

  /**
   * イベント受信側の登録
   * @param name イベント名
   * @param cb 呼び出されるコールバック関数
   * @returns {Subscription}
   */
  subscribe(name: GlobalEventName,
            cb: (data: any) => void): Subscription {
    return this.sub
    .filter(event => event.name === name)
    .map(event => event.data)
    .subscribe(cb);
  }

  /**
   * イベントの発行
   * @param name イベント名
   * @param data　データ
   */
  publish(name: GlobalEventName, data?: any) {
    this.sub.next({name, data});
  }

}
