import {NgRedux} from "@angular-redux/store";
import {Injectable} from "@angular/core";
import {AppState} from "./state";
import * as merge from "deepmerge";

/**
 * Reduxのアクション定義
 */
@Injectable()
export class Actions {

  constructor(private ngRedux: NgRedux<AppState>) {
  }

  static UPDATE_STATE = "UPDATE_STATE";
  static INIT_STATE = "INIT_STATE";

  //初期化アクション
  init(): void {
    this.ngRedux.dispatch(
      {type: Actions.INIT_STATE});
  }

  //更新アクション
  update(newValue: AppState): void {
    this.ngRedux.dispatch(
      {type: Actions.UPDATE_STATE, payload: newValue});
  }

  // 現在の状態オブジェクトのコピーを取得
  getState(): AppState {
    let state = this.ngRedux.getState();
    return merge({}, state, {clone: true});
  }

}
