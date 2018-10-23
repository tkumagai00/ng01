import {Routes} from "@angular/router";
import {LoginComponent} from "./login.component";

export const loginRoutes: Routes = [
  {
    //URLパスがルートの時はLoginComponentで画面表示
    path: "",
    component: LoginComponent
  },
  {
    //URLパスが/appの時はAppModuleをロード
    path: "app",
    loadChildren: "../app/app.module#AppModule"
  },
  {
    //URLパスが/adminの時はAdminModuleをロード
    path: "admin",
    loadChildren: "../admin/admin.module#AdminModule"
  }
];
