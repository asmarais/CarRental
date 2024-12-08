import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  car: any = {}; // Object to store car details

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const carId = this.route.snapshot.paramMap.get('carid'); // Get car ID from route
    if (carId) {
      this.getCarDetails(carId); // Fetch car details using the ID
    }
  }

  getCarDetails(carId: string): void {
    const apiUrl = `http://localhost:5000/api/voitures/${carId}`;
    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        this.car = response; // Store car details
        console.log('Car details fetched successfully:', this.car);
      },
      (error) => {
        console.error('Error fetching car details:', error);
      }
    );
  }
}
