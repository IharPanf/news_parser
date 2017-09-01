import { Component } from '@angular/core';
import { NewsService } from './services/news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Self education: Парсер новостей (Mongo, NodeJs, Angular)';
  lat: number = 53.9195866;
  lng: number = 27.5807409;
  listOfNews: any = [];
  
  constructor(private newsService: NewsService) {}

  public getAllNews() {
    this.newsService.getAllNews().subscribe((res) => {
      if (res) {
        this.listOfNews = res.json();
      }
    });
  }
}
