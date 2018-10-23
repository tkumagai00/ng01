/**
 *顧客リストから検索文字を含むレコードを抽出
 */

import {Pipe, PipeTransform} from "@angular/core";
import {Customer} from "../class/customer.interface";

@Pipe({name: "customerFilter"})
export class CustomerFilterPipe implements PipeTransform {

  transform(record:Customer[], searchWord:string):Customer[] {

    if (!record || !searchWord) return record;
    let newRecord = record.filter(
      (rec, index)=> {
        if (rec.name_i18n.indexOf(searchWord) !== -1) return true;
        if (rec.address_i18n.indexOf(searchWord) !== -1) return true;
      });
    return newRecord;
  }

}
