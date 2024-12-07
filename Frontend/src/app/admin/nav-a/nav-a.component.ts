import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav-a',
  templateUrl: './nav-a.component.html',
  styleUrls: ['./nav-a.component.css']
})
export class NavAComponent implements OnInit {
  notifications: any[] = []; // Array to store fetched notifications

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch notifications on component initialization
    this.getNotifications();
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
