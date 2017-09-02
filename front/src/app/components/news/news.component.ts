import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  @Input() item: any;

  showFullNews = true;

  constructor() { }

  public toggleFullNews() {
    this.showFullNews = !this.showFullNews;
    return this.showFullNews;
  }
}
