import {Component, ViewContainerRef} from "@angular/core";

@Component({
  selector: "admin-root",
  template: `
    <router-outlet></router-outlet>
  `
})
export class AdminRootComponent {
  constructor(public viewContainerRef: ViewContainerRef) {
  }//ngx-bootstrap用
}
