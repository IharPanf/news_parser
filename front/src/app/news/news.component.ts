import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  @Input() item: any;

  showFullNews = true;

  constructor() { }

  ngOnInit() {
  }

  public toggleFullNews() {
    this.showFullNews = !this.showFullNews;
    return this.showFullNews;
  }
}
