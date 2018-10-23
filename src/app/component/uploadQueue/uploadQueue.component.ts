/**
 * アップロード待ちデータ件数表示
 */
import {Component} from "@angular/core";
import {select} from "@angular-redux/store";
import {Observable} from "rxjs/Observable";

@Component({
  selector: "uploadQueue",
  templateUrl: "./uploadQueue.component.html",
  styleUrls: ["./uploadQueue.component.css"]
})
export class UploadQueueComponent {

  @select() uploadItems$: Observable<string[]>;

  constructor() {
    console.log("@@@ アップロード待ちデータ件数表示生成");
  }

}
