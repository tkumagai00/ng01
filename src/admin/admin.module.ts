import {Title} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {LogComponent} from "./log.component";
import {RouterModule} from "@angular/router";
import {AdminRootComponent} from "./adminRoot.component";
import {adminRoutes} from "./adminRoute.config";
import {HttpService} from "../app/service/http.service";
import {HttpClientModule} from "@angular/common/http";
import {CommonModule} from "@angular/common";
import {AccordionModule} from "ngx-bootstrap/accordion";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminRoutes),
    HttpClientModule,
    AccordionModule.forRoot()
  ],
  declarations: [
    AdminRootComponent,
    LogComponent
  ],
  providers: [
    Title,
    HttpService
  ]
})
export class AdminModule {
}
