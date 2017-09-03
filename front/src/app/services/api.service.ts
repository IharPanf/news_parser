import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiService {

  private urlHost = 'http://localhost:8080';
  
  public apiUrl = {
    'nearNews': '/api/news',
    'allNews': '/api/all_news',
    'countWords': '/api/words'
  };
  
  public urlGeo = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  public geoKey = '&key=AIzaSyBT8SGysuMw9yBYZQuRcHpRzEa5JbWWs1s';

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
    return this.http.get(this.urlHost + this.apiUrl.allNews)
  }

  public getCoordinates(location: string):Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('accept', 'application/json');

    var urlStr = this.urlGeo + location + this.geoKey;
      return this.http.get(urlStr)
          .map(res => res.json())
          .catch(err => {
            return Observable.throw(err);
          });
  }

  public getNearNews(lat, lng, distance): any {
    var urlStr = this.urlHost + this.apiUrl.nearNews + '?lat='+ lat +'&lng=' + lng + '&radius=' + distance;
    return this.http.get(urlStr);
  }
  
  public countWords() {
    return this.http.get(this.urlHost + this.apiUrl.countWords);
  }
}
