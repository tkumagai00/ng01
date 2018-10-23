/**
 * ルータの画面遷移処理のフック.
 */
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot} from "@angular/router";

import {Observable} from "rxjs/Observable";
import {Actions} from "../store/actions";
import {AppConfig} from "../class/appconfig.class";
import {JwtService} from "./jwt.service";
import {CryptoService} from "./crypto.service";

@Injectable()
export class NavigationService implements CanActivate, CanDeactivate<any> {

  currentUrl = "";
  canTransition = false;

  constructor(private actions: Actions,
              private jwtService: JwtService,
              private cryptoService: CryptoService) {
    console.log("@@@@ transitionService生成");
  }

  /**
   * 表示中画面を閉じる前の処理
   * @param component
   * @param route
   * @param state
   * @returns {boolean}
   */
  canDeactivate(component: any,
                route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean | Observable<any> {
    console.log("@@@@ 遷移元Url:" + state.url);

    if (!this.canTransition) {
      alert("画面遷移は許可されていません");
      history.pushState(null, null, this.currentUrl);
      return false;
    }
    this.canTransition = false;

    // Jwtトークンが無効の時はログイン画面へ遷移
    if ((state.url !== "/app")
      && (!this.jwtService.isValidToken())) {
      alert("トークンが無効です");
      location.href = AppConfig.loginUrl;
      return false;
    }
    return true;
  }

  /**
   * 新たな画面を開く前の処理
   * @param route
   * @param state
   * @returns {boolean}
   */
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    console.log("@@@@ 遷移先Url:" + state.url);

    // 暗号キーが無効の時はログイン画面へ遷移
    if ((state.url !== "/app/download")
      && (!this.cryptoService.isExistDbKey())) {
      console.log("暗号キーが無効です");
      location.href = AppConfig.loginUrl;
      return false;
    }

    //新しいURLパスをReduxへ通知
    this.actions.update({
      url: state.url
    });
    return true;
  }

}
