import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { PriceComponent } from './price/price.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { CarComponent } from './car/car.component';
import { DetailsComponent } from './details/details.component';
import { LoadingComponent } from './loading/loading.component';
import { MapComponent } from './map/map.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';
import { PayementComponent } from './payement/payement.component';
import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  declarations: [
    UserComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    PriceComponent,
    CarComponent,
    DetailsComponent,
    ContactComponent,
    ProfileComponent,
    LoadingComponent,
    MapComponent,
    PayementComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    QRCodeModule,


  ]
})
export class UserModule { }
