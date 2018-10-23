import {Injectable, Renderer2} from "@angular/core";
import {AppConfig} from "../../../class/appconfig.class";
import {Actions} from "../../../store/actions";

@Injectable()
export class ResizeService {

  constructor(private actions: Actions,
              private renderer: Renderer2) {
    console.log("@@@@ 写真縮小サービス生成");
  }

  /**　これ以降は写真の縮小処理 **/
  /**
   * 選択したファイルが適切かのチェック.
   * フォーマット、サイズ等
   * @param e
   */
  async getFileData(e: any) {
    let file = e.target.files[0];
    let err = this.checkfile(file);
    if (err) {
      alert(err);
      return Promise.reject("PHOTO_FILE:ERROR");
    }

    //縮小処理実行
    try {
      await this.resizeImage(file);
    } catch (e) {
      alert("写真の縮小に失敗");
      return Promise.reject("PHOTO_RESIZE:ERROR");
    }
    return Promise.resolve("PHOTO_RESIZE:SUCCESS");
  }

  /**
   *ファイルチェック
   * @param file
   * @returns {any}
   */
  checkfile(file: any) {
    if (!file)
      return "再度ファイルを選択してください";
    if (!file.type ||
      ((file.type).indexOf("image/jpeg") !== 0))
      return "JPEG形式の写真を選択してください" + file.type;
    if (!file.size ||
      file.size > AppConfig.maxPhotoFileSize)
      return "ファイルサイズの上限を超えています-" + file.size;
  }

  /**
   * 縮小処理
   * @param file　変換対象ファイル
   */
  async resizeImage(file: any) {
    let reader: any = new FileReader();
    let img = new Image();
    let canvas = this.renderer.createElement("canvas");
    await new Promise((resolve, reject) => {
      reader.addEventListener("loadend",
        () => {
          if (reader.error) {
            return reject("ファイルの読み取りに失敗しました");
          }
          let fileData = reader.result;
          img.onload =
            () => {
              if (img.width * img.height
                > AppConfig.maxImageSize) {
                return reject("画像サイズの上限を超えています-"
                  + img.width + "x" + img.height);
              }
              let resizeWidth = AppConfig.resizePhotoWidth;
              let resizeHeight =
                img.height *
                (AppConfig.resizePhotoWidth / img.width);
              canvas.width = resizeWidth;
              canvas.height = resizeHeight;
              let ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, resizeWidth, resizeHeight);
              let tempPhoto: string
                = canvas.toDataURL("image/jpeg");
              this.actions.update({tempPhoto: tempPhoto});
              return resolve();
            };
          img.src = fileData;
        });
      reader.readAsDataURL(file);
    });
  }

}
