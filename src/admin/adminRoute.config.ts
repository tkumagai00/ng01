import {Routes} from "@angular/router";
import {LogComponent} from "./log.component";
import {AdminRootComponent} from "./adminRoot.component";


export const adminRoutes: Routes = [
  {
    path: "",
    component: AdminRootComponent,
    children: [
      {
        path: "",
        redirectTo: "log",
        pathMatch: "full"
      }
      ,
      {
        path: "log",
        component: LogComponent
      }
    ]
  }
];
