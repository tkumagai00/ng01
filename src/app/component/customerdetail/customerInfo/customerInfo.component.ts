import {Component, Input, OnInit} from "@angular/core";
import {Customer} from "../../../class/customer.interface";

@Component({
  selector: "customer-info",
  templateUrl: "./customerInfo.component.html",
  styleUrls: ["./customerInfo.component.css"]
})
export class CustomerInfoComponent {

  @Input() customer: Customer;

}
