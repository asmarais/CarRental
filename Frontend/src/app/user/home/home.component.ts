import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any; // Déclarez jQuery

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  //l'année de début de l'expérience
  startYear: number = 2023;
  currentYear: number = new Date().getFullYear();
  experienceYears: number = this.currentYear - this.startYear;

  //   carousel pour l'items
  ngAfterViewInit() {
    // Initialize the carousel after the view is initialized
    $('.carousel-testimony,.carousel-car').owlCarousel({
      loop: true,           // Pour faire défiler indéfiniment
      margin: 10,          // Espacement entre les éléments
      nav: true,           // Affiche les flèches de navigation
      autoplay: true,      // Démarre le carrousel automatiquement
      autoplayTimeout: 5000, // Durée avant de changer d'élément (en millisecondes)
      autoplayHoverPause: true, // Met en pause le carrousel au survol
      responsive: {
        0: {
          items: 1 // Nombre d'éléments pour les écrans très petits
        },
        600: {
          items: 2 // Nombre d'éléments pour les écrans moyens
        },
        1000: {
          items: 3 // Nombre d'éléments pour les écrans larges
        }
      }
    });
  }
  bas(){
    window.scrollTo(0, 530);
  }

}
