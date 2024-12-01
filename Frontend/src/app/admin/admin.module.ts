import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HeaderAComponent } from './header-a/header-a.component';
import { NavAComponent } from './nav-a/nav-a.component';
import { DashboradComponent } from './dashborad/dashborad.component';
import { SidebarAComponent } from './sidebar-a/sidebar-a.component';
import { ListUserComponent } from './list-user/list-user.component';
import { ListResComponent } from './list-res/list-res.component';
import { DetCarComponent } from './det-car/det-car.component';
import { MapsAComponent } from './maps-a/maps-a.component';
import { FormsModule } from '@angular/forms';
import { FooterAComponent } from './footer-a/footer-a.component';


@NgModule({
  declarations: [
    AdminComponent,
    HeaderAComponent,
    NavAComponent,
    DashboradComponent,
    SidebarAComponent,
    ListUserComponent,
    ListResComponent,
    DetCarComponent,
    MapsAComponent,
    FooterAComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ]
})
export class AdminModule { }
