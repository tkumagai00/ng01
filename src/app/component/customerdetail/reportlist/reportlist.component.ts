/**
 * 顧客詳細情報表示.のコンポーネント
 */
import {Component, Input} from "@angular/core";
import {Report} from "../../../class/report.interface";

@Component({
  selector: "report-list",
  templateUrl: "./reportlist.component.html",
  styleUrls: ["./reportlist.component.css"]
})
export class ReportListComponent {

  @Input() reports: Report[];
  @Input() locale: string;

}
