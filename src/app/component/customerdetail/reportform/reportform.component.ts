/**
 * 報告入力コンポーネント.
 * モーダルダイアログで表示）
 */
import {DbService} from "../../../service/db.service";
import {
  AfterViewInit, Component, ElementRef, Input, OnDestroy,
  OnInit, Renderer2, ViewChild
} from "@angular/core";
import {Report} from "../../../class/report.interface";
import {ModalDirective} from "ngx-bootstrap";
import {CryptoStorageService} from "../../../service/cryptoStorage.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {NgRedux, select} from "@angular-redux/store";
import {Actions} from "../../../store/actions";
import {AppState} from "../../../store/state";
import {CustomerDetailService} from "../../customerdetail/customerdetail.service";
import {ResizeService} from "./resize.service";
import {INIT_REPORT} from "../../../class/report.const";

@Component({
  selector: "input-modal",
  templateUrl: "./reportform.component.html",
  styleUrls: ["./reportform.component.css"],
  providers: [ResizeService]
})
export class ReportFormComponent implements OnInit, AfterViewInit, OnDestroy {

  //親コンポーネントからデータ受け取り
  @Input() tempReport: Report;
  @Input() tempPhoto: string;

  //ngx-bootstrapのモーダルへの参照
  @ViewChild(ModalDirective) modalRef: ModalDirective;

  //写真ファイル選択input要素への参照
  @ViewChild("refFileSelect") fileSelectRef: ElementRef;

  //親コンポーネントから開閉指示を受けるステート変数
  @select() isOpenModal$: Observable<boolean>;

  // 指示待ちのSubscription
  subscription: Subscription;

  //選択した写真
  file: any = null;
  //写真縮小処理中のメッセージ表示フラグ
  isWaiting = false;

  //メニューの折り畳みフラグ
  isCollapsed = true;

  constructor(private dbService: DbService,
              private renderer: Renderer2,
              private storageService: CryptoStorageService,
              private ngRedux: NgRedux<AppState>,
              private service: CustomerDetailService,
              private  actions: Actions,
              private  resizeService: ResizeService) {
    console.log("@@@@ reportform生成");
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // 写真選択のイベントリスナー(通常の選択）
    this.renderer.listen(this.fileSelectRef.nativeElement,
      "change", this.onChangefile.bind(this));

    //表示中と同じファイルを選択した時
    this.renderer.listen(this.fileSelectRef.nativeElement, "click",
      (e: any) => {
        e.target.value = "";
      });

    //モーダルの開閉指示まちObserverを予約
    this.subscription = this.isOpenModal$
    .subscribe((isOpen: boolean) => {
      //開閉指示を受けたときの処理
      if (isOpen) {
        this.modalRef.show();
      } else {
        this.modalRef.hide();
      }
    });
  }

  // コンポーネント廃棄時にObservableの予約解除
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * 入力された報告文は逐一ステートに保存（レジューム機能のため）
   */
  onChangeReport() {
    this.actions.update({tempReport: this.tempReport});
  }

  async onChangefile(event: any) {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }
    this.isWaiting = true;
    try {
      await this.resizeService.getFileData(event);
    } catch (err) {
      console.log("@@@@ getFileData Error:" + err);
    }
    this.isWaiting = false;
    return Promise.resolve();
  }

  /**
   * ボタンイベントの処理.
   */
  onClickButton(item: string) {

    switch (item) {

      case "send"://保存ボタンのクリック
        if (!this.tempReport.title || !this.tempReport.reportStr) {
          alert("表題と本文の両方を入力してください");
          return;
        }
        this.actions.update({isOpenModal: false});
        this.service.sendReport();
        break;

      case "delete"://削除ボタンのクリック
        this.actions.update({
          isOpenModal: false,
          tempReport: INIT_REPORT,
          tempPhoto: null
        });
        break;

      case "photoDelete"://ゴミ箱ボタンのクリック
        this.actions.update({tempPhoto: null});
        break;

      case "photo"://カメラボタンのクリック
        this.fileSelectRef.nativeElement.click();
        break;
    }
  }
}
