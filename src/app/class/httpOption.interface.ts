/**
 * Http通信の設定パラメータの型定義
 */
import {HttpHeaders, HttpParams} from "@angular/common/http";
import {HttpObserve} from "@angular/common/http/src/client";

export interface HttpReqOptions {
  url?: string;
  body?: any;
}

