/**
*辞書を使って文字列変換
 */

import {Pipe, PipeTransform} from "@angular/core";
import {ja_jp} from "../i18n/ja-jp";
import {en_us} from "../i18n/en-us";

//パイプの定義
@Pipe({name: "translater"})
export class TranslaterPipe implements PipeTransform {

  //  ロケールに応じた変換
  transform(str?: string, locale?: string): string {

    if (!str || !locale) {
      return "";
    }

    switch (locale) {
        //  日本語はja_jpオブジェクトで変換
      case "ja-jp":
        str = ja_jp[str];
        break;
        //  英語はen_usオブジェクトで変換
      case "en-us":
        str = en_us[str];
        break;
    }
    return str;
  }

}
