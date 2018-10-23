/**
 * 顧客リスト画面コンポーネント
 */
import {Component, Input, OnInit} from "@angular/core";
import {CustomerListService} from "../customerlist.service";
import {GlobalEventName, GlobalEventService} from "../../../service/globalEvent.service";

@Component({
  selector: "my-customerlist-navbar",
  templateUrl: "./customerlist.navbar.html",
  styleUrls: ["./customerlist.navbar.css"]
})
export class CustomerListNavbar implements OnInit {

  //検索文字
  @Input() searchWord: string;
  // ロケール
  @Input() locale: string;
  //モバイル判定
  @Input() isMobile: boolean;
  //自動復元ＯＮ／ＯＦＦ
  @Input() isEnableSnapshot: boolean;

  //モバイル時のメニュー開閉用フラグ
  isCollapsed = true;
  collapse: boolean;

  constructor(private service: CustomerListService,
              private globalEventService: GlobalEventService) {
    console.log("@@@@ 顧客リストナビバー生成");

  }

  /**
   * 初期化
   */
  ngOnInit() {
    //初期表示
    console.log("@@@@@ onInit CustomerList");

  }

  //
  /**
   * ロケール変更
   * @param locale
   */
  onLocaleChange(locale: string) {
    this.service.showList(locale);
  }

  /**
   * 検索処理
   * @param $event
   */
  onChangeSearchWord($event: any) {
    this.service.setFilter($event);
  }

  /**
   * ログアウト
   */
  logout() {
    console.log("@@@グローバルイベント発行(LOGOUT)");
    this.globalEventService.publish(GlobalEventName.LOGOUT);
  }

}
