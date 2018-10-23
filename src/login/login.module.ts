import {BrowserModule, Title} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {LoginComponent} from "./login.component";
import {RouterModule} from "@angular/router";
import {LoginRootComponent} from "./loginRoot.component";
import {loginRoutes} from "./loginRoute.config";
import {HttpService} from "../app/service/http.service";
import {GlobalErrorService} from "../app/service/globalError.service";
import {GlobalEventService} from "../app/service/globalEvent.service";
import {AlertModule} from "ngx-bootstrap/alert";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    BrowserModule, //基本モジュール
    FormsModule, //双方向データバインドに必要
    RouterModule.forRoot(loginRoutes), //ルート定義
    HttpClientModule, //http通信
    //ngx-bootstrapの警告UI
    AlertModule.forRoot()
  ],
  declarations: [
    LoginRootComponent,//ルートコンポーネント
    LoginComponent//ログイン画面コンポーネント
  ],
  providers: [
    Title,//Webページタイトル
    HttpService,//WebAPIとの通信
    GlobalEventService,//独自イベント
    //モジュール全体のエラー処理
    {provide: ErrorHandler, useClass: GlobalErrorService}
  ],
  //モジュールロード後に最初に呼び出すコンポーネント
  bootstrap: [LoginRootComponent]
})
export class LoginModule {
}
