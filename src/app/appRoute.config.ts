import {Routes} from "@angular/router";
import {CustomerListComponent} from "./component/customerlist/customerlist.component";
import {CustomerDetailComponent} from "./component/customerdetail/customerdetail.component";
import {ReporthistoryComponent} from "./component/reporthistory/reporthistory.component";
import {NavigationService} from "./service/navigation.service";
import {DownloadComponent} from "./component/download/download.component";
import {RootComponent} from "./component/root.component";

/**
 *
 * ユーザーモジュールのルート定義
 */
export const appRoutes: Routes = [
    {
        path: "",
        component: RootComponent,
        children: [
            {
                path: "",
                redirectTo: "download",
                pathMatch: "full"
            }
            ,
            {
                path: "customerList",
                component: CustomerListComponent,
                canActivate: [NavigationService],
                canDeactivate: [NavigationService]
            }
            ,
            {
                path: "customerDetail",
                component: CustomerDetailComponent,
                canActivate: [NavigationService],
                canDeactivate: [NavigationService]
            }
            ,
            {
                path: "reportHistory",
                component: ReporthistoryComponent,
                canActivate: [NavigationService],
                canDeactivate: [NavigationService]
            }
            ,
            {
                path: "download",
                component: DownloadComponent,
                canActivate: [NavigationService],
                canDeactivate: [NavigationService]
            }
        ]
    }
];
