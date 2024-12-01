import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'  // Le service est disponible globalement
})
export class LoadingService {

  constructor(private router: Router) {}

  // Fonction pour afficher le chargement et naviguer après un délai
  openLoadingPageAndNavigate(route: string, delay: number) {
    window.scroll(0,0);
    this.router.navigate(['/user/load']);
    setTimeout(() => {
      window.scroll(0,0);
      this.router.navigate([route]);  // Naviguer vers la route après un délai
    }, delay);  // Délai en millisecondes
  }
}
