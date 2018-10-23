import {Injectable} from "@angular/core";
import {Actions} from "../store/actions";

@Injectable()
export class RootService {

  constructor(private actions: Actions) {
    console.log("@@@ RootService生成");
  }

  // ウィドウサイズの変更(表示デバイスのMobile判定
  onResize() {
    let isSmall = false;
    let query = "(max-width:767px)";
    if (matchMedia(query).matches)
      isSmall = true;
    console.log("@@@@ isSmall=" + isSmall);
    //ステートに書き込み
    this.actions.update({isMobile: isSmall});
    return isSmall;
  }

}


