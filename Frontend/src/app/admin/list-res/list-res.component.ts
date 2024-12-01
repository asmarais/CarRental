import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list-res',
  templateUrl: './list-res.component.html',
  styleUrls: ['./list-res.component.css']
})
export class ListResComponent implements OnInit {
  reservations: any[] = []; // Combined reservations data
  cars: any[] = []; // List of cars
  users: any[] = []; // List of users

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const carRequest = this.http.get<any[]>('http://localhost:5000/api/cars');
    const reservationRequest = this.http.get<any[]>('http://localhost:5000/api/reservations');
    const userRequest = this.http.get<any[]>('http://localhost:5000/api/users');
  
    Promise.all([carRequest.toPromise(), reservationRequest.toPromise(), userRequest.toPromise()])
      .then(([cars, reservations, users]) => {
        this.cars = cars || []; // Default to empty array if undefined
        this.users = users || [];
        this.reservations = (reservations || []).map(res => {
          const car = this.cars.find(c => c.id === res.voiture_id);
          const user = this.users.find(u => u.id === res.user_id);
          return { ...res, car, user }; // Combine data
        });
        console.log('Combined Reservations:', this.reservations);
      })
      .catch(err => console.error('Error loading data:', err));
  }
  
}
