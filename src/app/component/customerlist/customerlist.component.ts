/**
 * 顧客リスト画面コンポーネント
 */
import {Component, OnDestroy, OnInit} from "@angular/core";
import {Customer} from "../../class/customer.interface";
import {CustomerListService} from "./customerlist.service";
import {Observable} from "rxjs/Observable";
import {select} from "@angular-redux/store";
import {GlobalEventName, GlobalEventService} from "../../service/globalEvent.service";
import {Subscription} from "rxjs/Subscription";
import {Title} from "@angular/platform-browser";

@Component({
  selector: "my-customerlist",
  templateUrl: "./customerlist.component.html",
  styleUrls: ["./customerlist.component.css"],
  providers: [CustomerListService]
})

export class CustomerListComponent implements OnInit, OnDestroy {

  //検索文字
  @select() searchWord$: Observable<string>;
  // 顧客情報の配列
  @select() customers$: Observable<Customer[]>;
  // ロケール
  @select() locale$: Observable<string>;
  //モバイル判定値
  @select() isMobile$: Observable<boolean>;
  //自動復元ＯＮ／ＯＦＦ
  @select() isEnableSnapshot$: Observable<boolean>;

  // グローバルイベント受信Subscription
  globalEvent: Subscription[] = [];

  constructor(private titleService: Title,
              private service: CustomerListService,
              private globalEventService: GlobalEventService) {
    console.log("@@@@ 顧客リストコンポーネント生成");

    // グローバルイベント受信登録（DB更新）
    this.globalEvent.push(
      this.globalEventService
      .subscribe(GlobalEventName.ON_UPDATEDB,
        () => this.service.init())
    );
  }

  ngOnInit() {
    this.titleService.setTitle("顧客リスト");
    this.service.init();
    setTimeout(() => window.scroll(0, 0), 50);
  }

  ngOnDestroy() {
    //グローバルイベント受信の解除
    this.globalEvent
    .map(sub => sub.unsubscribe());
  }

}
