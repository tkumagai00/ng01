/**
 * 売上チャート表示.のコンポーネント
 *グラフにマウスカーソルを当てると値を表示
 * 凡例をくりっぐすると項目ごとの表示・非表示ができる
 * 親コンポーネント(CustomerDetail)から値を受け取るため、
 * 処理記述はほとんど無い.
 * 描画はcanvas上で行われるため、css,htmlテンプレートの定義はなし
 */
import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {Customer} from "../../../class/customer.interface";

@Component({
  selector: "sales-chart",
  template: `
    <div
      style="display: block;width: 100%;height: 400px;">
      <canvas baseChart
              *ngIf="config && config.chartData"
              [datasets]="config.chartData "
              [labels]="config.chartLabels"
              [options]="config.chartOptions "
              [legend]="config.chartLegend "
              [chartType]="config.chartType"
              [colors]="config.chartColors"
              (chartHover)="chartHovered($event)"
              (chartClick)="chartClicked($event)"
      >
      </canvas>
    </div>
  `
})
export class SalesChartComponent implements OnChanges {

  @Input() customer: Customer;
  config: any;

  ngOnChanges(changes: SimpleChanges) {
    console.log("@@@SaleReport data change");
    if (this.customer && this.customer.pc != null) {
      this.setChart();
    }
  }

  setChart() {
    // グラフに必要なデータを配列で取得
    let category = ["PC関連", "文具", "サービス"];
    let strArray: string[] = this.customer.pc.split(",");
    let pc: number[] = strArray.map(v => parseInt(v));
    strArray = this.customer.goods.split(",");
    let goods: number[] = strArray.map(v => parseInt(v));
    strArray = this.customer.service.split(",");
    let service: number[] = strArray.map(v => parseInt(v));
    let label: string[] = this.customer.label.split(",");
    // グラフの詳細設定
    let option = {
      scales: {
        yAxes: [{
          ticks: {
            max: 200,
            min: 0,
            stepSize: 20
          }
        }]
      },
      animation: false, // グラフのアニメーションを無効
      maintainAspectRatio: false
    };
    // 棒グラフの配色
    let colors = [
      {
        backgroundColor: "rgba(65,105,225,1)",   // "royalblue",
        borderColor: "rgba(128,128,128,1)"//"gray",
      },
      {
        backgroundColor: "rgba(244,164,96,1)", // "sandybrown",
        borderColor: "rgba(128,128,128,1)" // "gray",
      },
      {
        backgroundColor: "rgba(143,188,143,1)", // "darkseagreen",
        borderColor: "rgba(128,128,128,1)" // "gray",
      }

    ];
    // グラフ設定オブジェクトの生成
    let chartObj = {
      chartType: "bar",
      chartData: [
        {
          data: pc,
          label: category[0],
          borderWidth: 2
        },
        {
          data: goods,
          label: category[1],
          borderWidth: 2
        },
        {
          data: service,
          label: category[2],
          borderWidth: 2
        }
      ],
      chartLabels: label,
      chartLegend: true,
      chartOptions: option,
      chartColors: colors
    };
    // グラフコンポーネント設定データを渡す
    this.config = chartObj;
  }

  chartClicked(e: any): void {
  }

  chartHovered(e: any): void {
  }
}
