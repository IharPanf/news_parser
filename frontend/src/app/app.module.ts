import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {MomentModule} from 'angular2-moment/moment.module';
import { AgmCoreModule } from '@agm/core';
import { ApiService } from './services/api.service';
import { AppComponent } from './components/root/app.component';
import { NewsComponent } from './components/news/news.component';

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBT8SGysuMw9yBYZQuRcHpRzEa5JbWWs1s'
    }),
    MomentModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
