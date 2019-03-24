import { ApiConfig } from './../models/config.interface';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // apis provided from environment
  apis: Array<ApiConfig> = new Array();

  constructor(private http: HttpClient) {
    this.apis = environment.apis;
  }

  /**
  * Retrieve an api from id.
  * @param id - api Id.
  */

  getApi(id: string): ApiConfig {
    return this.apis.find((api: any) => api.id === id);
  }

  /**
   * Prepare query args.
   * @param api - api id.
   * @param query - query params.
   */
  prepareQuery(api: any, query: string): string {
    return api ? `${api.url}${query}` : query;
  }

  /**
   * Prepare options method.
   * @param api - api id
   * @param options - options.
   */
  prepareOptions(api: any, options: any = {}): Object {
    return api ? Object.assign({}, options, api.options) : options;
  }

  /**
   * Xhr Get method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param options - request options
   */
  get<T>(apiName: string, url: string, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    console.log('ENV : api utilisé ', api);
    return this.http.get<T>(this.prepareQuery(api, url), this.prepareOptions(api, options));
  }

  /**
   * Xhr post method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param data - request data
   * @param options - request options
   */
  post<T>(apiName: string, url: string, data: any, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    return this.http.post<T>(this.prepareQuery(api, url), data, this.prepareOptions(api, options));
  }

  /**
   * Xhr put method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param data - request data
   * @param options - request options
   */
  put<T>(apiName: string, url: string, data: any, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    return this.http.put<T>(this.prepareQuery(api, url), data, this.prepareOptions(api, options));
  }

  /**
   * Xhr patch method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param data - request data
   * @param options - request options
   */
  patch<T>(apiName: string, url: string, data: any, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    return this.http.patch<T>(this.prepareQuery(api, url), data, this.prepareOptions(api, options));
  }

  /**
   * Xhr delete method
   * @param apiName - api environment key
   * @param url - endpoint url
   * @param options - request options
   */
  delete<T>(apiName: string, url: string, options?: any): Observable<T> {
    const api = this.getApi(apiName);
    return this.http.delete<T>(this.prepareQuery(api, url), this.prepareOptions(api, options));
  }
}
