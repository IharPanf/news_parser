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
  location = '';
  locLat: number;
  locLng: number;
  
  constructor(private apiService: ApiService) {}

  public getAllNews() {
    this.apiService.getAllNews().subscribe((res) => {
      if (res) {
        this.listOfNews = res.json();
      }
    });
  }
  
  public getCoordinates(location: string) {
    this.apiService.getCoordinates(location).subscribe((res) => {
      if (res && res.results && res.results[0].geometry && res.results[0].geometry.location) {
        this.locLat = res.results[0].geometry.location.lat;
        this.locLng = res.results[0].geometry.location.lng;
      }
    });
  }
}
