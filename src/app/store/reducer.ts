import {AppState, INIT_APP_STATE} from "./state";
import * as merge from "deepmerge";
import {Actions} from "./actions";

/**
 * Redux Reducer定義
 * ここでActionの依頼を受けてステートの変更を行う
 */
export function rootReducer(state: AppState = INIT_APP_STATE, action: any) {

  console.log("@@@@ action:" + action.type);

  switch (action.type) {

    /** ステートの初期化 */
    case Actions.INIT_STATE:
      return INIT_APP_STATE;

    /** ステートの更新 */
    case Actions.UPDATE_STATE:
      return merge({}, {...state, ...action.payload}, {clone: true});

    default:
      return state;
  }
}
