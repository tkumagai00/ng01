/**
 * レポートクラスの型定義
 */
export interface Report {
  title?: string;
  timeStamp: number;
  customerId: number;
  action?: string;
  reportId?: string;
  userId?: string;
  reportStr?: string;
  isFileExist?: boolean;
  resizePhoto: string;
}
