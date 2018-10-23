import {Component, OnDestroy, OnInit} from "@angular/core";
import {DownloadService} from "./download.service";
import {Observable} from "rxjs/Observable";
import {select} from "@angular-redux/store";
import {Title} from "@angular/platform-browser";

/**
 * ダウンロード画面Component.
 * ダウンロードの状況をメッセージとプログレスバーで表示.
 * 処理失敗時は、エラーメッセージとログイン画面へ戻るボタンを表示.
 * 処理成功時は、顧客一覧画面へ遷移
 */
@Component({
    selector: "download",
    templateUrl: "./download.component.html",
    styleUrls: ["./download.component.css"],
    providers: [DownloadService] // ダウンロード画面専用のサービス
})
export class DownloadComponent implements OnInit {

    dialogMsg = "しばらくおまちください";
    isWaiting = true;
   progress=0;

    /**
     *
     * @param sharedService
     * @param downloadService
     */
    constructor(
        private service: DownloadService,
        private titleService: Title
    ) {
        console.log("@@@@@ ダウンロードコンポーネント生成");
    };

    /**
     * ダウンロード開始.
     * 実行中はメッセージや進捗度のステート変化の通知を受ける
     */
    ngOnInit() {
        this.titleService.setTitle("ダウンロード");
        this.service.startDownload(this);
    }

    /**
     * ダウンロード失敗時は確認ボタンのクリックでログイン画面へ戻る
     */
    onClick() {
        this.service.logout();
    }
}