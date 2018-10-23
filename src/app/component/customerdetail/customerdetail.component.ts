/**
 * 顧客情報画面コンポーネント.
 * 複数の子コンポーネントをまとめるコンテナとしての働きをしている.
 * 子コンポーネント
 *      CustomerDetailNavbar
 *      CustomerInfo
 *      SalesChart
 *      ReportList
 *      tmpReport
 *      inputReport
 */

import {Component, OnDestroy, OnInit} from "@angular/core";
import {Customer} from "../../class/customer.interface";
import {Observable} from "rxjs/Observable";
import {CustomerDetailService} from "./customerdetail.service";
import {select} from "@angular-redux/store";
import {Report} from "../../class/report.interface";
import {Subscription} from "rxjs/Subscription";
import {GlobalEventName, GlobalEventService} from "../../service/globalEvent.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: "my-customerdetail",
  templateUrl: "./customerdetail.component.html",
  styleUrls: ["./customerdetail.component.css"],
  providers: [CustomerDetailService]
})
export class CustomerDetailComponent
  implements OnInit, OnDestroy {

  // Reduxからの変更通知を受信
  @select() tempReport$: Observable<Report>;
  @select() tempPhoto$: Observable<string>;
  @select() reports$: Observable<Report[]>;
  @select() selectedCustomer$: Observable<Customer>;
  @select(["selectedCustomer", "id"])
  customerId$: Observable<number>;
  @select() locale$: Observable<string>;
  @select() isMobile$: Observable<boolean>;

  // グローバルイベント受信Subscription
  globalEvent: Subscription[] = [];

  constructor(private titleService: Title,
              private service: CustomerDetailService,
              private globalEventService: GlobalEventService) {
    console.log("@@@@ 顧客情報コンポーネント生成");

    // グローバルイベント受信登録（DB更新）
    this.globalEvent.push(
      this.globalEventService
      .subscribe(GlobalEventName.ON_UPDATEDB,
        () => this.service.getData())
    );
  }

  //初期処理
  ngOnInit() {
    this.titleService.setTitle("顧客情報");
    //画面の描画に必要なデータの取得
    this.service.getData();
    setTimeout(() => window.scroll(0, 0), 50);
  }

  //終了処理
  ngOnDestroy() {
    //グローバルイベント受信の解除
    this.globalEvent
    .map(sub => sub.unsubscribe());
  }

}

