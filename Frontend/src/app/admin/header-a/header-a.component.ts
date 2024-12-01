import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header-a',
  templateUrl: './header-a.component.html',
  styleUrls: ['./header-a.component.css']
})
export class HeaderAComponent implements OnInit {
  dashboardText: string = 'Dashboard';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      // Change le texte en fonction de l'URL
      if (this.router.url.includes('/admin/listR')) {
        this.dashboardText = 'Booking';
      } else if (this.router.url.includes('/admin/listU')) {
        this.dashboardText = 'Users';
      } else if (this.router.url.includes('/admin/listC')) {
        this.dashboardText = 'Vehicle';
      } else if (this.router.url.includes('/admin/detCar')) {
        this.dashboardText = 'Vehicle details';
      } else if (this.router.url.includes('/admin/maps')) {
        this.dashboardText = 'Maps';
      } else {
        this.dashboardText = 'Dashboard';
      }
    });
  }
}
