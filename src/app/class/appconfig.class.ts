export class AppConfig {
  /**
   * 通信関連
   */

    //通信リトライ回数
  static retryNum = 0;

  //自動ログオフ時間初期値(分)
  static AUTO_LOGOUT = 20; // 20分

  //トークンの有効期限切れチェック間隔(分)
  static CHECK_TOKEN_INTERVAL = 1;

  //BaseUrl
  // static baseUrl = "http://localhost:4200";
  static baseUrl = "";

  //ログオフ時の遷移先
  static loginUrl = AppConfig.baseUrl + "/";

  //自動アップロードのキー名の接頭語
  static UPLOAD_PREFIX = "UPLOAD_";

  //JWT関連
  static JWT_HEADER = "authorization";
  static TOKEN_PREFIX = "Bearer ";

  //エラーログ記録メッセージ
  static ERROR_STORE_MESSAGE = "エラーを記録しました";

  //エラーログ名
  static ERROR_LOG_NAME = "errorLog";

  //認証API接続先
  static authUrl = AppConfig.baseUrl + "/auth";

  //WebサービスAPI接続先
  static apiUrl = AppConfig.baseUrl + "/api/";

  /**
   * 写真処理関連
   */
    //取得する写真ファイルの制限値
  static maxPhotoFileSize = 2.5 * 1000 * 1000; // 2.5MB

  //取得する写真データの画素数制限値
  static maxImageSize = 1000 * 10000; // 1000万画素

  //写真の縮小サイズ幅
  static resizePhotoWidth = 400; // px

  /**
   * NeDB関連
   */
    //DBファイル名
  static DB_NAME = "db01";

  //NeDBをインメモリで使用時はtrue
  static isMemoryDB = false;

}
