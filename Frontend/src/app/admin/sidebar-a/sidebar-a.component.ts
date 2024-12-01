import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-a',
  templateUrl: './sidebar-a.component.html',
  styleUrls: ['./sidebar-a.component.css']
})
export class SidebarAComponent {
  isDashboardActive: boolean = false;
  isCarsActive: boolean = false;
  isBookingActive: boolean = false;
  isUsersActive: boolean = false;
  isMapActive: boolean = false;

  constructor(private router: Router) {}

  godash() {
    window.location.href = "/admin/dash";
  }

  gocar() {
    this.setActiveLink('cars');
    this.router.navigate(['/admin/listC']);
  }

  gores() {
    this.setActiveLink('booking');
    this.router.navigate(['/admin/listR']);
  }

  gouser() {
    this.setActiveLink('users');
    this.router.navigate(['/admin/listU']);
  }

  gomaps() {
    this.setActiveLink('map');
    this.router.navigate(['/admin/maps']);
  }

  private setActiveLink(activeLink: string) {
    this.isDashboardActive = activeLink === 'dashboard';
    this.isCarsActive = activeLink === 'cars';
    this.isBookingActive = activeLink === 'booking';
    this.isUsersActive = activeLink === 'users';
    this.isMapActive = activeLink === 'map';
  }
}
