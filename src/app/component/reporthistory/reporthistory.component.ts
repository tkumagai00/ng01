import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {ReporthistoryService} from "./reporthistory.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: "report-history",
  templateUrl: "./reporthistory.component.html",
  providers: [ReporthistoryService]
})

export class ReporthistoryComponent implements OnInit {

  constructor(private titleService: Title) {
    console.log("@@@@ 報告履歴コンポーネント生成");
  }

  ngOnInit() {
    this.titleService.setTitle("報告履歴");
  }
}
