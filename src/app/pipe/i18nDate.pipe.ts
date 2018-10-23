/**
 * ロケールにあわせて日時の書式変更
 */

import {Pipe, PipeTransform} from "@angular/core";

//パイプの定義
@Pipe({name: "i18nDate"})
export class I18nDatePipe implements PipeTransform {

  transform(date: number, locale: string): string {

    //  タイムスタンプ（シリアル値）から日付オブジェクト生成
    let d = new Date(date);

    //日時の変換式を定義
    let dateStr = (d: Date, format: string) => {
      let f = format;
      f = f.replace("Y", d.getFullYear().toString())
          .replace("M", ("0" + (d.getMonth() + 1)).slice(-2))
          .replace("D", ("0" + d.getDate()).slice(-2))
          .replace("H", ("0" + d.getHours()).slice(-2))
          .replace("m", ("0" + d.getMinutes()).slice(-2));
      return f;
    };

    let str;
    switch (locale) {
      //  日本の日付書式に変換
      case "ja-jp":
        str = dateStr(d, "Y/M/D H:m");
        break;
      //  米国の日付書式に変換
      case "en-us":
        str = dateStr(d, "M/D/Y H:m");
        break;
    }
    return str;
  }

}
