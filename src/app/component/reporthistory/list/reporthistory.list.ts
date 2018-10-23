import {Component, ElementRef, OnInit, Renderer, ViewChild} from "@angular/core";
import {NgRedux} from "@angular-redux/store";
import {ReporthistoryService} from "../reporthistory.service";

/**
 * 報告履歴
 * デモ用のため選択した顧客に関係なく同じデータを表示.
 * 無限スクロールのサンプル実装.
 *      データの受信件数を１度に３０件＝１ブロックとし上下１ブロックの合計３ブロックを表示バッファに準備.
 *      上下それぞれの次バッファを事前準備
 *      画面のちらつきを抑えるため、バッファは一度にすべて交換
 */

@Component({
  selector: "reporthistory-list",
  templateUrl: "./reporthistory.list.html",
  styleUrls: ["./reporthistory.list.css"]
})

export class ReporthistoryList implements OnInit {

  //ステートの利用
  @ViewChild("dataTable") tableRef: ElementRef;

  isMobile: boolean; //モバイル判定
  BLOCK_SIZE = 30;//サーバからの受信するデータ件数

  /**バッファ関連**/
  currentBuffer: any;//表示用バッファ
  startRow: number;//表示バッファの先頭行番号
  endRow: number;//表示バッファの末尾行番号
  nextBuffer: any; //次バッファ（下方向）
  nextBufferNum: number;//次バッファの数(下方向)
  prevBuffer: any; //次バッファ（上方向）
  prevBufferNum: number;//次バッファの数(上方向)
  isEnd = false;//最後のバッファを使用中
  BUFFER_THRESHOLD: number;//バッファ交換のしきい値
  RENDER_WAIT = 70;//msec　バッファ交換時の安定待ち時間
  isLoaded = false;//バッファ充填完了
  isReady = false;//スクロールイベントの受信準備完了?

  /**スクロール関連**/
  pageHeight: number;//コンテンツ全体の高さ
  clientHeight: number;//表示画面の高さ
  topScrollMargine: number; // 上方向スクロール可能サイズ
  bottomScrollMargine: number; // 下方向スクロール可能サイズ
  offset: number;//スクロール補正サイズ
  html: any;//documentElementへの参照

  constructor(private elementRef: ElementRef,
              private renderer: Renderer,
              private ngRedux: NgRedux<any>,
              private service: ReporthistoryService) {
    console.log("@@@@ 報告履歴リスト部分生成");
  }

  /**
   * 初期処理
   */
  async ngOnInit() {

    //起動待ちのアニメーションアイコンを表示
    this.isLoaded = false;

    //モバイル画面の判別
    let state = this.ngRedux.getState();
    this.isMobile = state.isMobile;

    // サーバーから初期表示データ取得(120件)
    let rec: any = await this.service.getRecord(1, this.BLOCK_SIZE * 4);
    if (rec.length !== this.BLOCK_SIZE * 4) {
      alert("データ件数が不足しています");
      return;
    }
    // 表示用バッファ作成（先頭から30x3=90件
    this.currentBuffer = rec.slice(0, this.BLOCK_SIZE * 3);
    // 次バッファ(下方向)作成（末尾から30x3=90件）
    this.nextBuffer = rec.slice(-this.BLOCK_SIZE * 3);
    this.prevBuffer = null; // 次バッファ(上方向)
    this.startRow = 1; // バッファ先頭の行番号
    this.endRow = this.BLOCK_SIZE * 3; // バッファ末尾の行番号
    this.nextBufferNum = 1;//次バッファの件数(下方向)
    this.prevBufferNum = 0;//次バッファの件数(上方向)
    console.log("@@@@ 初期バッファ充填完了");
    //documentElementへの参照取得
    this.html = document.documentElement;

    //起動待ちのアニメーションアイコンを非表示
    this.isLoaded = true;

    //HTMLレンダリング待ち後、スクロールイベント受信開始
    setTimeout(() => {
      window.scroll(0, 0);
      this.isReady = true;
    }, this.RENDER_WAIT);

    return;
  }

  /**
   * スクロールイベント処理.
   * @param event
   */
  async onScroll(event: any) {

    // 初期処理完了前のスクロールイベントは無視
    if (!this.isReady) return;

    // コンテンツ全体の高さ
    this.pageHeight = this.html.scrollHeight;
    // 画面表示域の高さ
    this.clientHeight = this.html.clientHeight;
    // データ表示テーブルの高さ
    let tableHeight =
      this.tableRef.nativeElement.clientHeight;
    //バッファ切り替えのスクロール可能サイズしきい値(単位px)
    this.BUFFER_THRESHOLD = tableHeight / 6;
    // 上方向スクロール可能サイズ
    this.topScrollMargine = window.pageYOffset;
    // 下方向スクロール可能サイズ
    this.bottomScrollMargine =
      this.pageHeight - this.clientHeight - this.topScrollMargine;

    //デバッグ用
    // console.log("@@@@ \nbotttomMargine:" + this.bottomScrollMargine
    //     + "\nnextBlockSize:" + this.nextBufferNum
    //     + "\ntopMargine:" + this.topScrollMargine
    //     + "\nprevBlockSize:" + this.prevBufferNum
    //     + "\nTableHeight:" + tableHeight
    //     + "\nPageHeight:" + this.pageHeight
    //     + "\nClientHeight:" + this.clientHeight
    //     + "\nstatRow:" + this.startRow
    //     + "\nendRow:" + this.endRow
    //     + "\nYScrollPostion(%):" + (this.topScrollMargine / tableHeight) * 100
    // );

    //===================================
    // バッファ追加の判定
    //===================================

    /**
     * バッファ追加の判定(下方向)３つの条件を満たす
     * 1.下方向スクロール可能サイズがしきい値未満
     * 2.データ最後のバッファでない
     * 3.次のバッファが準備されている
     */
    if (this.bottomScrollMargine < this.BUFFER_THRESHOLD &&
      !this.isEnd &&
      this.nextBufferNum === 1
    ) {
      //次バッファのカウントを消費
      --this.nextBufferNum;
      //処理中はスクロールイベントを処理しない
      this.isReady = false;
      console.log("@@@@下方向バッファ取得開始");
      //バッファデータ交換と追加データ受信
      this.addNextBuffer();
      return;
    }

    /**
     * バッファ追加の判定(上方向)３つの条件を満たす
     * 1.上方向スクロール可能サイズがしきい値未満
     * 2.データ先頭のバッファでない
     * 3.次のバッファが準備されている
     */
    if ((this.topScrollMargine <
        this.BUFFER_THRESHOLD) &&
      (this.startRow !== 1) &&
      (this.prevBufferNum === 1)) {
      //次バッファのカウントを消費
      --this.prevBufferNum;
      //処理中はスクロールイベントを処理しない
      this.isReady = false;
      console.log("@@@@上方向バッファ取得開始");
      //バッファデータ交換と追加データ受信
      this.addPrevBuffer();
      return;
    }

    //===================================
    //バッファ枯渇の場合
    //===================================

    // バッファ枯渇の場合はBottomで反転バウンド(下方向)
    if (!this.isEnd &&
      (this.bottomScrollMargine <
        this.BUFFER_THRESHOLD * 0.1)) {
      console.log("@@@@下方向バッファ枯渇");
      scrollBy(0, -this.BUFFER_THRESHOLD * 0.2);
    }

    // バッファ枯渇の場合はTopで反転バウンド(上方向)
    if ((this.startRow !== 1) &&
      (this.topScrollMargine <
        this.BUFFER_THRESHOLD * 0.1)) {
      console.log("@@@@上方向バッファ枯渇");
      scrollBy(0, this.BUFFER_THRESHOLD * 0.2);
    }

  }


  //===================================
  // バッファデータ交換と追加データ受信
  //===================================

  // バッファ追加(下方向)
  async addNextBuffer() {

    //バッファデータ交換で移動するスクロール量
    this.offset =
      -(this.elementRef.nativeElement.querySelector
        ("#row" + (this.BLOCK_SIZE + 1)).offsetTop
        - this.elementRef.nativeElement.querySelector
        ("#row1").offsetTop);

    //現在のスクロール位置取得
    this.topScrollMargine = window.pageYOffset;

    // 次の上方向バッファデータを現在のデータから取得
    this.prevBuffer = this.currentBuffer.slice(0, this.BLOCK_SIZE * 3);

    //次の上方向バッファ数更新
    this.prevBufferNum = 1;

    // 表示データ書き換え
    this.currentBuffer = this.nextBuffer;

    // 表示位置カウンタの更新
    this.startRow += this.BLOCK_SIZE;
    this.endRow += this.currentBuffer.length - this.BLOCK_SIZE * 2;

    //スクロール位置補正
    this.setScrollOffset();

    //次の追加のための新規バッファをサーバから取得開始
    this.getNextBuffer();

    return;
  }

  /**
   * バッファデータ交換(上方向)
   */
  async addPrevBuffer() {

    // 次の下方向バッファを現在のデータから取得
    this.nextBuffer = this.currentBuffer.slice(0, this.BLOCK_SIZE * 3);
    //次の下方向バッファ数の更新
    this.nextBufferNum = 1;

    //現在のスクロール位置取得
    this.topScrollMargine = window.pageYOffset;

    // 表示データ書き換え
    this.currentBuffer = this.prevBuffer;

    // 表示位置カウンタの更新
    this.startRow -= this.currentBuffer.length - this.BLOCK_SIZE * 2;
    this.endRow -= this.BLOCK_SIZE;

    //バッファデータ交換で移動するスクロール量
    this.offset =
      this.elementRef.nativeElement.querySelector
      ("#row" + (this.BLOCK_SIZE + 1)).offsetTop
      - this.elementRef.nativeElement.querySelector
      ("#row1").offsetTop;

    //スクロール位置補正
    this.setScrollOffset();

    //次の追加のための新規バッファをサーバから取得開始
    if (this.startRow !== 1) {
      this.getPrevBuffer();
    }

    return;
  }

  /**
   *バッファ追加後のスクロール位置補正
   * RENDER_WAITの期間待機して画面が安定してから実行
   */
  setScrollOffset() {
    setTimeout(() => {
      scroll(0, this.offset + this.topScrollMargine);
      this.isReady = true;
    }, this.RENDER_WAIT);
  }

  //===================================
  //受信データから次バッファ生成
  //===================================

  /**
   * 次バッファ作成(下方向)
   */
  async getNextBuffer() {

    //サーバーからデータ受信
    let rec: any = await this.service.getRecord(
      this.endRow + 1, this.BLOCK_SIZE);

    /**３種類のケースにわけてバッファの生成**/

    // 追加データなし(データ末尾)
    if (!rec || rec.length === 0) {
      this.isEnd = true;
      return;
    }
    if (rec.length === this.BLOCK_SIZE) {
      // ブロックサイズ分の追加データあり
      this.isEnd = false;
      this.nextBuffer = this.currentBuffer
      .slice(-this.BLOCK_SIZE * 2).concat(rec);
    } else {
      // データ末尾でブロックサイズ以下の端数データ
      this.isEnd = true;
      this.currentBuffer = this.currentBuffer.concat(rec);
    }

    this.nextBufferNum = 1;
    console.log("@@@@ 下方向バッファ準備完了");
    return;
  }

  /**
   * 次バッファ作成(上方向)
   */
  async getPrevBuffer() {
    //サーバーからデータ取得
    let rec: any = await this.service.getRecord(
      this.startRow - this.BLOCK_SIZE, this.BLOCK_SIZE);

    //バッファ生成
    this.prevBuffer = rec.concat
    (this.currentBuffer.slice(0, this.BLOCK_SIZE * 2));

    //プロパティ更新
    this.prevBufferNum = 1;
    this.isEnd = false;

    console.log("@@@@ 上方向バッファ準備完了");
    return;
  }

}
