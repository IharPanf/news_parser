import { Component } from '@angular/core';
import { ApiService } from './../../services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'News parser';
  defaultLatitude = 53.9195866;
  defaultlongitude = 27.5807409;
  listOfNews: any = [];
  listOfWords: any = [];
  selectedLocationLatitude = '';
  selectedLocationlongitude = '';
  noResultMessage = '';
  errorMessage = '';
  
  constructor(private apiService: ApiService) {}
  
  public loadNews(): void {
    this.resetValue();
    this.apiService.getAllNews().subscribe(
        (response) => {
          if (response) {
            this.listOfNews = response.json();
          }
        },
        (error) => {
          this.showErrorMessage(error);
        }
    );
  };
  
  public loadNewsByCoordinates(location: string, distance: any): void {
    this.resetValue();
    distance = parseInt(distance, 10);
    if (location && distance >= 0 ) {
      this.apiService.getCoordinates(location).subscribe(
        (response) => {
          if (response.results && response.results[0].geometry && response.results[0].geometry.location) {
            this.selectedLocationLatitude = response.results[0].geometry.location.lat;
            this.selectedLocationlongitude = response.results[0].geometry.location.lng;
            this.getNearNews(this.selectedLocationLatitude, this.selectedLocationlongitude, distance);
          } else {
            this.noResultMessage = 'No news for selected location';
          } 
        },
        (error) => {
          this.showErrorMessage(error);
        }
      );
    }
  };
  
  public getNearNews(lat: string, lng: string, distance: any): void {
    this.resetValue();
    this.apiService.getNearNews(lat, lng, distance).subscribe(
      (response) => {
        if (response) {
          this.listOfNews = response.json();
          if (this.listOfNews.length === 0) {
            this.noResultMessage = 'No news in the specified radius from the selected point';
          }
        }
      },
      (error) => {
        this.showErrorMessage(error);
      }
    );
  };
  
  public countWords(): void {
    this.resetValue();
    this.apiService.countWords().subscribe(
      (resonse) => {
        if (resonse) {
          this.listOfWords = resonse.json();
        }
      },
      (error) => {
        this.showErrorMessage(error);
      }
    );
  };
  
  private resetValue(): void {
    this.errorMessage = '';
    this.listOfNews = [];
    this.listOfWords = [];
    this.noResultMessage = '';
  };
  
  private showErrorMessage(error: any) {
    this.errorMessage = 'Server connection error..';
    console.log(this.errorMessage, error);
  };
}
