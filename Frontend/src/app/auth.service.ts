import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  private logoutUrl = 'http://localhost:5000/api/auth/logout';

  isLoggedIn(): boolean {
    let token = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    // Requête POST pour déconnexion
    return this.http.post(this.logoutUrl, {}).subscribe({
      next: () => {
        localStorage.removeItem('token'); // Supprime le token du localStorage
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion :', err);
      }
    });
  }

  getUserDataFromToken(): any {
    let token = localStorage.getItem('token');
    if (token) {
      try {
        let data = JSON.parse(window.atob(token.split('.')[1]));
        return data;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  }
  
}
