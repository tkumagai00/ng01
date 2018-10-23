/**
 * 報告履歴画面ナビゲーションバー
 */
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {NavigationService} from "../../../service/navigation.service";

@Component({
  selector: "reporthistory-navbar",
  templateUrl: "./reporthistory.navbar.html",
  styleUrls: ["./reporthistory.navbar.css"]
})
export class ReporthistoryNavbar {

  constructor(private router: Router,
              private transitionService: NavigationService) {
    console.log("@@@@ 報告履歴ナビバー生成");
  }

  /**
   * メニュー選択処理.
   * 選択肢[顧客情報画面へ戻る]
   * @param str
   * @param $event
   */
  onMenuClick(str: string, $event: any) {
    //リンクイベントの動作キャンセル
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    switch (str) {
      case "back": // 顧客情報画面へ戻る
        this.transitionService.canTransition = true;
        this.router.navigate(["/app/customerDetail"]);
        break;
    }
  }

}
