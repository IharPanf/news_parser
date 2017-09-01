import { Component } from '@angular/core';
import { NewsService } from './news.service';

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
  showFullNews: boolean = true;
  
  constructor(private newsService: NewsService) {}

  public getAllNews() {
    this.newsService.getAllNews().subscribe((res) => {
      if (res) {
        this.listOfNews = res.json();
        console.log(this.listOfNews);
      }
    });
  }
  
  public toggleFullNews() {
    this.showFullNews = !this.showFullNews;
    return this.showFullNews;
  }
}
