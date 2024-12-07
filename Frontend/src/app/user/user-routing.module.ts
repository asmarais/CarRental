import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DetailsComponent } from './details/details.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { LoadingComponent } from './loading/loading.component';
import { FooterComponent } from './footer/footer.component';
import { CarComponent } from './car/car.component';
import { PriceComponent } from './price/price.component';
import { MapComponent } from './map/map.component';
import { PayementComponent } from './payement/payement.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent ,
    children: [
      {path : 'home',component:HomeComponent},
      {path : 'nav',component:NavbarComponent},
      {path : 'footer',component:FooterComponent},
      {path : 'price',component:PriceComponent},
      {path : 'car',component:CarComponent},
      {path : 'det',component:DetailsComponent},
      {path : 'contact',component:ContactComponent},
      {path : 'profile',component:ProfileComponent},
      {path : 'load',component:LoadingComponent},
      {path : 'maps',component:MapComponent},
      { path: 'pay/:reservationId/:pricingOption', component: PayementComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
