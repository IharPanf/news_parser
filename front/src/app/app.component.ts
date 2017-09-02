import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Self education: Парсер новостей (Mongo, NodeJs, Angular)';
  lat = 53.9195866;
  lng = 27.5807409;
  listOfNews: any = [];

  constructor(private apiService: ApiService) {}

  public getAllNews() {
    this.apiService.getAllNews().subscribe((res) => {
      if (res) {
        this.listOfNews = res.json();
      }
    });
  }
}
