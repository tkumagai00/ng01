/**
 * 顧客リスト画面コンポーネント
 */
import {Component, Input, OnInit} from "@angular/core";
import {CustomerListService} from "../customerlist.service";
import {Customer} from "../../../class/customer.interface";

@Component({
  selector: "my-customerlist-list",
  templateUrl: "./customerlist.list.html",
  styleUrls: ["./customerlist.list.css"]
})

export class CustomerListList implements OnInit {

  //顧客情報の配列
  @Input() customers: Customer[];
  //検索文字
  @Input() searchWord: string;
  //ロケール
  @Input() locale: string;
  //モバイル判定
  @Input() isMobile: boolean;

  constructor(private service: CustomerListService) {
    console.log("@@@@ 顧客リストのリスト部分生成");
  }

  /**
   * 初期化
   */
  ngOnInit() {
    // スクロール位置の初期化
    setTimeout(() => {
      window.scroll(0, 0);
    }, 1);
  }

  /**
   * 顧客リストのクリック
   * @param index 選択位置
   */
  onListClick(index: any) {
    this.service.selectCustomer(index);
  }

}
