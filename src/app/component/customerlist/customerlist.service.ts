import {DbService} from "../../service/db.service";
import {Router} from "@angular/router";
import {NavigationService} from "../../service/navigation.service";
import {Injectable} from "@angular/core";
import {Customer} from "../../class/customer.interface";
import {NgRedux} from "@angular-redux/store";
import {Actions} from "../../store/actions";

/**
 * 顧客リストの処理･制御
 **/
@Injectable()
export class CustomerListService {

  constructor(private dbService: DbService,
              private router: Router,
              private transitionService: NavigationService,
              private ngRedux: NgRedux<any>,
              private actions: Actions) {
    console.log("@@@@ 顧客リスト画面用サービス生成");
  }

  init() {
    this.showList();
  }


  /**
   * ロケールの設定と表示データの取得
   */
  async showList(locale?: string) {
    // ロケール設定
    let loc = this.setLocale(locale);

    // 表示データの取得
    let data = await this.getData(loc);
    let result = this.formatData(data, loc);

    //ステートに反映
    this.actions.update({customers: result});
  }


  /**
   * ロケール設定
   * アプリ起動時に保存データ読み込み
   * 未設定の時はja-jp
   */
  setLocale(locale?: string) {
    let tmp = "";
    //ロケールが指定された時はステートを変更とlocalStorage保存
    if (!locale) {
      //AppStateに設定があれば利用
      locale = this.ngRedux.getState().locale;
      if (!locale) {
        locale = "ja-jp";
      }
    }
    this.actions.update({locale: locale});
    return locale;
  }

  /**
   * 表示データの取得.
   * テータペースから必要データを取得
   */
  getData(locale: string): Promise<any> {
    //====NeDB検索条件の作成開始====
    // 抽出条件（顧客情報全件）
    const query = {dataLabel: "customer"};
    // 抽出データ項目
    const projection = {
      id: 1, tel: 1, updateTime: 1, reportNum: 1,
      name_en: 1, address_en: 1, name: 1, address: 1
    };
    // 並べ替え条件（idの昇順）
    const sort = {id: 1};
    //====NeDB検索条件の作成終了====

    // データベース検索実行
    return this.dbService.find(query, projection, sort);
  }


  /**
   * ロケールに応じたデータに変換
   */
  formatData(data: Customer[], locale: string) {
    let formatFunction: Function;
    switch (locale) {
      case "ja-jp":
        formatFunction = (i: any) => {
          data[i].name_i18n = data[i].name;
          data[i].address_i18n = data[i].address;
        };
        break;
      case "en-us":
        formatFunction = (i: any) => {
          data[i].name_i18n = data[i].name_en;
          data[i].address_i18n = data[i].address_en;
        };
        break;
    }
    data.forEach((v, i) => {
      formatFunction(i);
    });

    return data;
  }

  /**
   *顧客リストのクリック処理.
   * @param customer 顧客オブジェクト
   */
  selectCustomer(customer: Customer) {
    this.actions.update({selectedCustomer: customer});

    this.transitionService.canTransition = true;
    this.router.navigate(["/app/customerDetail"]);
  }

  /**
   * 検索文字の入力
   * @param searchWord
   */
  setFilter(searchWord: string) {
    this.actions.update({searchWord: searchWord});
  }

}
