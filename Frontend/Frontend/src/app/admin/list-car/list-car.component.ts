import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importer HttpClient
declare var $: any;


@Component({
  selector: 'app-list-car',
  templateUrl: './list-car.component.html',
  styleUrls: ['./list-car.component.css']
})
export class ListCarComponent implements OnInit {
  cars: any[] = []; // Tableau pour stocker les données des voitures

  constructor(private http: HttpClient) {} // Injecter HttpClient dans le constructeur

  ngOnInit(): void {
    this.getCars(); // Appeler la méthode pour récupérer les voitures au chargement
  }

  // Méthode pour ouvrir le modal
  openCar(): void {
    $('#CarModal').modal('show');
  }

  // Méthode pour fermer le modal
  closeCar(): void {
    $('#CarModal').modal('hide');
  }

  // Méthode pour récupérer les voitures depuis l'API
  getCars(): void {
    const apiUrl = 'http://localhost:5000/api/voitures/cars';
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.cars = response; // Stocker les voitures récupérées
        console.log('Cars fetched successfully:', this.cars);
      },
      (error) => {
        console.error('Error fetching cars:', error);
      }
    );
  }
}
