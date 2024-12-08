import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { LoadingService } from 'src/app/user/loading-service.service';

@Component({
  selector: 'app-header-a',
  templateUrl: './header-a.component.html',
  styleUrls: ['./header-a.component.css']
})
export class HeaderAComponent implements OnInit {
  dashboardText: string = 'Dashboard';
  notifications: any[] = []; // Array to store fetched notifications
  

  constructor(private router: Router, private route: ActivatedRoute,private http: HttpClient,private authService: AuthService,private loadingService: LoadingService) {}

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
    this.getNotifications();
  }

  logout() {
    this.authService.logout();
    this.golore(); // Appelle la méthode logout
  }

  golore() {
    this.loadingService.openLoadingPageAndNavigate('/loRe', 1700);  
  }

  // Method to call the notifications endpoint
  getNotifications() {
    this.http.get<any>('http://localhost:5000/api/notifications/filters')
      .subscribe(
        (response) => {
          console.log('Notifications fetched:', response);
          this.notifications = response.notifications; // Store notifications
        },
        (error) => {
          console.error('Error fetching notifications:', error);
        }
      );
  }
}
