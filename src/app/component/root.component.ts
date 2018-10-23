import {Component, HostListener, OnInit, ViewContainerRef} from "@angular/core";
import {RootService} from "./root.service";
import {GlobalEventName, GlobalEventService} from "../service/globalEvent.service";

@Component({
  selector: "my-app",
  template: `
    <router-outlet></router-outlet>
  `,
  providers: [RootService]
})
export class RootComponent implements OnInit {

  constructor(public viewContainerRef: ViewContainerRef,//ngx-bootstrap用
              private globalEventService: GlobalEventService,
              private service: RootService) {
    console.log("@@@ ルートコンポーネント生成");
  }

  //コンポーネント全体の初期処理
  ngOnInit(): void {
    this.service.onResize();
  }

  //---------- イベントリスナーの登録----------
  @HostListener("window:resize", ["$event"])
  onResize($event) {
    console.log("@@@@ windowサイズ変更イベント");
    this.service.onResize();
    this.globalEventService.publish(
      GlobalEventName.ON_RESIZE, $event);
  }

  @HostListener("window:beforeunload", ["$event"])
  onBeforeunload($event) {
    console.log("@@@@ ブラウザ終了前イベント");
    this.globalEventService.publish(
      GlobalEventName.ON_BEFOREUNLOAD, $event);
  }

  @HostListener("click", ["$event"])
  onClick($event) {
    console.log("@@@@ クリックイベント");
    this.globalEventService.publish(
      GlobalEventName.ON_CLICK, $event);
  }

  @HostListener("keypress", ["$event"])
  onKeyPress($event) {
    console.log("@@@@ キー押下イベント");
    this.globalEventService.publish(
      GlobalEventName.ON_KEYPRESS, $event);
  }

  @HostListener("window:focus", ["$event"])
  onFocus($event) {
    console.log("@@@@ windowフォーカスイベント");
    this.globalEventService.publish(
      GlobalEventName.ON_FOCUS, $event);
  }

  @HostListener("window:online", ["$event"])
  onLine($event) {
    console.log("@@@@ ネットワークオンラインイベント");
    this.globalEventService.publish(
      GlobalEventName.ONLINE, $event);
  }

  @HostListener("window:offline", ["$event"])
  offLine($event) {
    console.log("@@@@ ネットワークオフラインイベント");
    this.globalEventService.publish(
      GlobalEventName.OFFLINE, $event);
  }
}
