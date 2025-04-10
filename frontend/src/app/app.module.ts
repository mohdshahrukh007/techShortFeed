import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShortFeedComponent } from './short-feed/short-feed.component';
import { HttpClientModule } from '@angular/common/http';
import { ShortFilterComponent } from './short-filter/short-filter.component';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environment/environment';
import { IntrestBasedSignupComponent } from './intrest-based-signup/intrest-based-signup.component';
import { RedditPlayerComponent } from './reddit-player/reddit-player.component';

@NgModule({
  declarations: [
    AppComponent,
    ShortFeedComponent,
    ShortFilterComponent,
    IntrestBasedSignupComponent,
    RedditPlayerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
