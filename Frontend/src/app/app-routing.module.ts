import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { NavbarComponent } from './user/navbar/navbar.component';
import { FooterComponent } from './user/footer/footer.component';
import { PriceComponent } from './user/price/price.component';
import { CarComponent } from './user/car/car.component';
import { DetailsComponent } from './user/details/details.component';
import { ContactComponent } from './user/contact/contact.component';
import { ProfileComponent } from './user/profile/profile.component';
import { LoadingComponent } from './user/loading/loading.component';
import { LoAndReComponent } from './lo-and-re/lo-and-re.component';

const routes: Routes = [
  { path:'loRe' , component:LoAndReComponent},
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: '', redirectTo: '/user/home', pathMatch: 'full' },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
