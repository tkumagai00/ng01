import {ErrorHandler, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RootComponent} from "./component/root.component";
import {CustomerListComponent} from "./component/customerlist/customerlist.component";
import {ReporthistoryComponent} from "./component/reporthistory/reporthistory.component";
import {CustomerFilterPipe} from "./pipe/customer-filter.pipe";
import {I18nDatePipe} from "./pipe/i18nDate.pipe";
import {TranslaterPipe} from "./pipe/translater.pipe";
import {CollapseModule, ModalModule, ProgressbarModule, TabsModule} from "ngx-bootstrap";
import {ChartsModule} from "ng2-charts/ng2-charts";
import {DevToolsExtension, NgRedux, NgReduxModule} from "@angular-redux/store";
import {AppState, INIT_APP_STATE} from "./store/state";
import {rootReducer} from "./store/reducer";
import {DownloadComponent} from "./component/download/download.component";
import {Actions} from "./store/actions";
import {CustomerListList} from "./component/customerlist/list/customerlist.list";
import {CustomerListNavbar} from "./component/customerlist/navbar/customerlist.navbar";
import {GlobalErrorService} from "./service/globalError.service";
import {ReporthistoryNavbar} from "./component/reporthistory/navbar/reporthistory.navbar";
import {ReporthistoryList} from "./component/reporthistory/list/reporthistory.list";
import {GlobalEventService} from "./service/globalEvent.service";
import {CustomerDetailNavbar} from "./component/customerdetail/navbar/customerdetail.navbar";
import {CustomerInfoComponent} from "./component/customerdetail/customerInfo/customerInfo.component";
import {ReportListComponent} from "./component/customerdetail/reportlist/reportlist.component";
import {ReportFormComponent} from "./component/customerdetail/reportform/reportform.component";
import {SalesChartComponent} from "./component/customerdetail/saleschart/saleschart.component";
import {CustomerDetailComponent} from "./component/customerdetail/customerdetail.component";
import {DbService} from "./service/db.service";
import {NavigationService} from "./service/navigation.service";
import {CryptoService} from "./service/crypto.service";
import {CryptoStorageService} from "./service/cryptoStorage.service";
import {LogoutService} from "./service/logout.service";
import {RouterModule} from "@angular/router";
import {appRoutes} from "./appRoute.config";
import {JwtService} from "./service/jwt.service";
import {HttpService} from "./service/http.service";
import {UploadService} from "./service/upload.service";
import {DownloadService} from "./component/download/download.service";
import {UploadQueueComponent} from "./component/uploadQueue/uploadQueue.component";
import {createLogger} from "redux-logger";
import {Title} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(appRoutes),
    ProgressbarModule.forRoot(),
    CollapseModule.forRoot(),
    NgReduxModule,
    ChartsModule,
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot()
  ],

  declarations: [
    RootComponent,
    CustomerListComponent,
    CustomerListList,
    CustomerListNavbar,
    ReporthistoryComponent,
    ReporthistoryNavbar,
    ReporthistoryList,
    DownloadComponent,
    CustomerFilterPipe,
    I18nDatePipe,
    TranslaterPipe,
    CustomerDetailComponent,
    SalesChartComponent,
    ReportFormComponent,
    ReportListComponent,
    CustomerInfoComponent,
    CustomerDetailNavbar,
    UploadQueueComponent
  ],

  providers: [
    Title,
    DbService,
    HttpService,
    UploadService,
    DownloadService,
    NavigationService,
    CryptoService,
    CryptoStorageService,
    LogoutService,
    Actions,
    GlobalEventService,
    JwtService,
    {provide: ErrorHandler, useClass: GlobalErrorService}
  ],
  exports: []
})
export class AppModule {
  //  Reduxの設定
  constructor(ngRedux: NgRedux<AppState>,
              devTools: DevToolsExtension) {
    ngRedux.configureStore(rootReducer,
      <AppState>INIT_APP_STATE,
      // []
      [createLogger()],
      devTools.isEnabled() ? [devTools.enhancer()] : []
    );
  }
}
