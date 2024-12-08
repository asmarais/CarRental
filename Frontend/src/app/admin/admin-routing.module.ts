import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboradComponent } from './dashborad/dashborad.component';
import { SidebarAComponent } from './sidebar-a/sidebar-a.component';
import { HeaderAComponent } from './header-a/header-a.component';
import { NavAComponent } from './nav-a/nav-a.component';
import { ListUserComponent } from './list-user/list-user.component';
import { ListCarComponent } from './list-car/list-car.component';
import { ListResComponent } from './list-res/list-res.component';
import { DetCarComponent } from './det-car/det-car.component';
import { MapsAComponent } from './maps-a/maps-a.component';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent ,
    children: [
      { path: 'dash', component: DashboradComponent },
      { path: 'sidebar', component: SidebarAComponent },
      { path: 'header', component: HeaderAComponent },
      { path: 'nava', component: NavAComponent },
      { path: 'listU', component: ListUserComponent },
      { path: 'listC', component: ListCarComponent },
      { path: 'listR', component: ListResComponent },
      { path: 'detCar/:carid', component: DetCarComponent },
      { path: 'maps', component: MapsAComponent },



    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
