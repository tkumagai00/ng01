/**
 * 顧客情報画面ナビゲーションバー
 */
import {Component} from "@angular/core";
import {CustomerDetailService} from "../customerdetail.service";

@Component({
  selector: "nav-customerdetail",
  templateUrl: "./customerdetail.navbar.html",
  styleUrls: ["./customerdetail.navbar.css"],
  providers: [CustomerDetailService]
})
export class CustomerDetailNavbar {

  //メニュー開閉用
  isCollapsed = true;

  //DI
  constructor(private service: CustomerDetailService) {
    console.log("@@@@ 顧客情報ナビバー生成");
  }

  /**
   * メニュー選択のイベント処理
   * @param item
   * @param $event
   */
  onMenuClick(item: string, $event: any) {
    //リンクイベントのキャンセル
    if ($event) {
      event.preventDefault();
      event.stopPropagation();
    }
    //選択項目をサービスに渡す
    this.service.onSelectMenu(item);
  }

}
