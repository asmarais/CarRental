import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
interface Filters {
  prix_par_jour: number | null;
  prix_par_mois: number | null;
  marque: string | null;  // Nouveau filtre pour la marque
  annee: number | null;   // Nouveau filtre pour l'année
  rating: number | null;
}



@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})


export class CarComponent implements OnInit {
  filters: Filters = {
    prix_par_jour: null,
    prix_par_mois: null,
    marque: null,  // Initialiser la marque à null
    annee: null,   // Initialiser l'année à null
    rating: null,
  };
  

  filteredCars: any[] = [];
  noCarsMessage: string = ''; 
  

  cars: any[] = [];
  itemsPerPage = 9;
  currentPage = 1;
  apiUrl = 'http://localhost:5000/api/voitures';
  priceOption: 'day' | 'month' = 'day'; // Valeur par défaut : 'day'


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        // Mapping les données pour le design
        this.cars = data.map(car => ({
          name: `${car.marque} ${car.modele}`,
          category: car.type,
          price: car.prix_par_jour,
          price2: car.prix_par_mois,
          image: 'assets/images/default-car.jpg', // Image par défaut ou autre source
          pik_up_position: car.pik_up_position,
          pik_off_position: car.pik_off_position
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des voitures :', error);
      }
    );
  }

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

  applyFilters(): void {
    const params = new URLSearchParams();
  
    // Ajoutez les filtres définis
    if (this.filters.prix_par_jour !== null) {
      params.append('prix_par_jour', this.filters.prix_par_jour.toString());
    }
    if (this.filters.prix_par_mois !== null) {
      params.append('prix_par_mois', this.filters.prix_par_mois.toString());
    }
    if (this.filters.marque !== null) {
      params.append('marque', this.filters.marque);  // Ajout de la marque
    }
    if (this.filters.annee !== null) {
      params.append('annee', this.filters.annee.toString());  // Ajout de l'année
    }
    if (this.filters.rating !== null) {
      params.append('rating', this.filters.rating.toString());
    }
  
    // Construisez l'URL avec les paramètres de filtre
    const url = `http://localhost:5000/api/voitures/filters?${params.toString()}`;
  
    // Effectuez une requête HTTP pour récupérer les voitures filtrées
    this.http.get<any>(url).subscribe(
      (response) => {
        const cars = Array.isArray(response.cars) ? response.cars : [];
        if (cars.length > 0) {
          this.cars = cars.map((car: { marque: any; modele: any; type: any; prix_par_jour: any; prix_par_mois: any; image: any; pik_up_position: any; pik_off_position: any; }) => ({
            name: `${car.marque} ${car.modele}`,
            category: car.type,
            price: car.prix_par_jour,
            price2: car.prix_par_mois,
            image: car.image || 'assets/images/default-car.jpg',  // Image par défaut si aucune image n'est spécifiée
            pik_up_position: car.pik_up_position,
            pik_off_position: car.pik_off_position,
          }));
          this.noCarsMessage = ''; // Réinitialiser le message d'erreur s'il y a des voitures
        } else {
          this.noCarsMessage = 'No cars found with the given filters'; // Aucun résultat
          this.cars = []; // Réinitialiser la liste des voitures
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des voitures filtrées :', error);
        this.noCarsMessage = 'An error occurred while fetching cars'; // Afficher un message d'erreur générique
        this.cars = []; // Réinitialiser la liste des voitures en cas d'erreur
      }
    );
  }
  
  

  
}
