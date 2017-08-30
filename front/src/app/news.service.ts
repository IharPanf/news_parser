import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';

@Injectable()
export class NewsService {

  private urlHost: string = 'http://127.0.0.1:8080';

  public apiUrl = '/api/news';

  /**
   * 
   * @param http
   */
  constructor(private http: Http) {}


  /**
   * 
   * @param type
   * @param performanceId
   * @returns {any}
     */

  public getAllNews(): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('accept', 'application/json');

    return this.http
        .get(this.urlHost + this.apiUrl, { headers })
        .subscribe((res) => {
          return res.json();
        });
  }
}
