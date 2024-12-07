import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  startYear: number = 2023;
  currentYear: number = new Date().getFullYear();
  experienceYears: number = this.currentYear - this.startYear;

  cars: any[] = []; // Stocker les données des voitures

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCars(); // Appeler la méthode pour récupérer les voitures
  }

  fetchCars(): void {
    this.http.get('http://localhost:5000/api/voitures').subscribe({
      next: (data: any) => {
        this.cars = data; // Stocker les données des voitures
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des voitures', err);
      }
    });
  }

  ngAfterViewInit(): void {
    $('.carousel-testimony,.carousel-car').owlCarousel({
      loop: true,
      margin: 10,
      nav: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1 },
        600: { items: 2 },
        1000: { items: 3 }
      }
    });
  }

  bas() {
    window.scrollTo(0, 530);
  }
}
