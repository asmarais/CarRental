import { Component } from '@angular/core';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent {
  cars = [
    // Remplacez par vos données réelles de voitures
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-1.jpg' },
    { name: 'Range Rover', category: 'Subaru', price: 500, image: 'assets/images/car-2.jpg' },
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-3.jpg' },
    // Ajoutez d'autres voitures ici...
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-1.jpg' },
    { name: 'Range Rover', category: 'Subaru', price: 500, image: 'assets/images/car-2.jpg' },
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-3.jpg' },
    // Ajoutez d'autres voitures ici...
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-1.jpg' },
    { name: 'Range Rover', category: 'Subaru', price: 500, image: 'assets/images/car-2.jpg' },
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-3.jpg' },
    // Ajoutez d'autres voitures ici...
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-1.jpg' },
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-1.jpg' },
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-1.jpg' },
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-1.jpg' },
    { name: 'Range Rover', category: 'Subaru', price: 500, image: 'assets/images/car-2.jpg' },
    { name: 'Mercedes Grand Sedan', category: 'Chevrolet', price: 500, image: 'assets/images/car-3.jpg' },
    // Ajoutez d'autres voitures ici...
    ];

  itemsPerPage = 9;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.cars.length / this.itemsPerPage);
  }

  get paginatedCars() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.cars.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      window.scrollTo(0, 670);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo(0, 670);
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo(0, 670);
    }
  }
}
