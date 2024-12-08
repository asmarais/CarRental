import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './user/home/home.component';
import { NavbarComponent } from './user/navbar/navbar.component';
import { FooterComponent } from './user/footer/footer.component';
import { PriceComponent } from './user/price/price.component';
import { CarComponent } from './user/car/car.component';
import { DetailsComponent } from './user/details/details.component';
import { ContactComponent } from './user/contact/contact.component';
import { ProfileComponent } from './user/profile/profile.component';
import { LoadingComponent } from './user/loading/loading.component';
import { MapComponent } from './user/map/map.component';
import { ListCarComponent } from './admin/list-car/list-car.component';
import { LoAndReComponent } from './lo-and-re/lo-and-re.component';



@NgModule({
  declarations: [
    AppComponent,
    ListCarComponent,
    LoAndReComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
