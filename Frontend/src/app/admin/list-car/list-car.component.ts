import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { NgForm } from '@angular/forms'; // Import NgForm
declare var $: any;

@Component({
  selector: 'app-list-car',
  templateUrl: './list-car.component.html',
  styleUrls: ['./list-car.component.css']
})
export class ListCarComponent implements OnInit {
  cars: any[] = []; // Array to store car data
  car: any = {}; // Object to store form data
  selectedCar: any = {}; // Object to store selected car for editing

  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit(): void {
    this.getCars(); // Fetch cars when component loads
  }

  // Open modal to add a car
  openCar(): void {
    this.car = {}; // Reset the form when opening for new car
    $('#CarModal').modal('show');
  }

  // Close the modal
  closeCar(): void {
    $('#CarModal').modal('hide');
  }

  // Fetch all cars from the API
  getCars(): void {
    const apiUrl = 'http://localhost:5000/api/voitures';
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.cars = response; // Store cars fetched
        console.log('Cars fetched successfully:', this.cars);
      },
      (error) => {
        console.error('Error fetching cars:', error);
      }
    );
  }

  // Save a new car
  saveCar(): void {
    const apiUrl = 'http://localhost:5000/api/voitures';
    const carData = {
      marque: this.car.marque,
      annee: this.car.annee,
      modele: this.car.modele,
      type: this.car.type,
      immatriculation: this.car.immatriculation,
      prix_par_jour: this.car.prix_par_jour,
      prix_par_mois: this.car.prix_par_mois,
      statut: true, // Assuming car is available
      pik_up_position: this.car.pik_up_position,
      pik_off_position: this.car.pik_off_position
    };

    this.http.post(apiUrl, carData).subscribe(
      (response) => {
        console.log('Car saved successfully:', response);
        this.getCars(); // Refresh car list
        this.closeCar(); // Close modal
      },
      (error) => {
        console.error('Error saving car:', error);
      }
    );
  }

  // Fetch car details for editing
  editCar(voitureId: string): void {
    const apiUrl = `http://localhost:5000/api/voitures/${voitureId}`;
    this.http.get<any>(apiUrl).subscribe(
      (response) => {
        this.selectedCar = response; // Store the selected car details
        $('#editCarModal').modal('show'); // Open modal with car data
      },
      (error) => {
        console.error('Error fetching car details:', error);
      }
    );
  }

  // Save changes to the selected car (PUT request)
  saveCarChanges(): void {
    const apiUrl = `http://localhost:5000/api/voitures/${this.selectedCar.voiture_id}`;
    const updatedCarData = {
      marque: this.selectedCar.marque,
      annee: this.selectedCar.annee,
      modele: this.selectedCar.modele,
      type: this.selectedCar.type,
      immatriculation: this.selectedCar.immatriculation,
      prix_par_jour: this.selectedCar.prix_par_jour,
      prix_par_mois: this.selectedCar.prix_par_mois,
      statut: this.selectedCar.statut,
      pik_up_position: this.selectedCar.pik_up_position,
      pik_off_position: this.selectedCar.pik_off_position
    };

    this.http.put(apiUrl, updatedCarData).subscribe(
      (response) => {
        console.log('Car updated successfully:', response);
        this.getCars(); // Refresh the list of cars
        $('#editCarModal').modal('hide'); // Close the modal after saving
      },
      (error) => {
        console.error('Error updating car:', error);
      }
    );
  }

  // Delete a car (DELETE request)
  deleteCar(voitureId: string): void {
    const apiUrl = `http://localhost:5000/api/voitures/${voitureId}`;
    if (confirm('Are you sure you want to delete this car?')) { // Confirmation before deletion
      this.http.delete(apiUrl).subscribe(
        (response) => {
          console.log('Car deleted successfully:', response);
          this.getCars(); // Refresh car list after deletion
        },
        (error) => {
          console.error('Error deleting car:', error);
        }
      );
    }
  }
}
