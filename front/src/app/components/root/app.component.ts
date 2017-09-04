import { Component } from '@angular/core';
import { ApiService } from './../../services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Self education: Парсер новостей (Mongo, NodeJS, Angular)';
  lat = 53.9195866;
  lng = 27.5807409;
  listOfNews: any = [];
  listOfWords: any = [];
  location = '';
  distance: any;
  locLat = '';
  locLng = '';
  emptyResults = '';
  errorStr = '';
  constructor(private apiService: ApiService) {}

  /**
   * 
   */
  public getAllNews(): void {
    this.setInitialValue();
    this.apiService.getAllNews().subscribe(
        (res) => {
          if (res) {
            this.listOfNews = res.json();
            this.listOfWords = [];
          }
        },
        (err) => {
          this.errorStr = 'Error connection to server..';
          console.log(this.errorStr, err);
        }
    );
  }

  /**
   * 
   * @param location
   * @param distance
   */
  public getCoordinates(location: string, distance: any): void {
    this.setInitialValue();
    this.distance = distance;
    if (location) {
      this.apiService.getCoordinates(location).subscribe(
        (res) => {
          if (res && res.results && res.results[0].geometry && res.results[0].geometry.location) {
            this.locLat = res.results[0].geometry.location.lat;
            this.locLng = res.results[0].geometry.location.lng;
          
            if (distance) {
              this.getNearNews(this.locLat, this.locLng, distance);
            }
          }
        },
        (err) => {
          this.errorStr = 'Error connection to server..';
          console.log(this.errorStr, err);
        }
      );
    }
  }

  /**
   * 
   * @param lat
   * @param lng
   * @param distance
   */
  public getNearNews(lat: string, lng: string, distance: any): void {
    this.setInitialValue();
    this.apiService.getNearNews(lat, lng, distance).subscribe(
      (res) => {
        if (res) {
          this.listOfNews = res.json();
          this.listOfWords = [];
          this.emptyResults = '';
          if (this.listOfNews.length === 0) {
            this.emptyResults = 'Нет новостей в заданном радиусе от выбранной точки';
          }
        }
      },
      (err) => {
        this.errorStr = 'Error connection to server..';
        console.log(this.errorStr, err);
      }
    );
  }

  /**
   * 
   */
  public countWords(): void {
    this.setInitialValue();
    this.apiService.countWords().subscribe(
      (res) => {
        if (res) {
          this.listOfWords = res.json();
        }
      },
      (err) => {
        this.errorStr = 'Error connection to server..';
        console.log(this.errorStr, err);
      }
    );
  }

  /**
   * 
   */
  private setInitialValue(): void {
    this.errorStr = '';
    this.listOfNews = [];
    this.listOfWords = [];
  }
}
