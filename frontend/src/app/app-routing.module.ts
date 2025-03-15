import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ShortFeedComponent } from './short-feed/short-feed.component';
import { IntrestBasedSignupComponent } from './intrest-based-signup/intrest-based-signup.component';

const routes: Routes = [ 
  {path: '', component: IntrestBasedSignupComponent},
  {path: 'reel', component: ShortFeedComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
