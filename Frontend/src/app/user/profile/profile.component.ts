import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  activeTab: string = 'Hist'; // Onglet par défaut
  userDetails: any = {
    user_id: 0,
    nom: '',
    prenom: '',
    email: '',
    numero_de_telephone: '',
    adresse: '', // Adresse complfvdfvdsfsète sous forme de chaîne
  };
  
  reservations: any[] = []; // Store reservations
  adresseParts: any;

  constructor(private http: HttpClient, private route: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const userData = this.authService.getUserDataFromToken();
    const userId = userData.userId;
    console.log(userId);

    // Charger les données utilisateur depuis l'API
    this.http.get(`http://localhost:5000/api/user/${userId}`).subscribe(
      (data: any) => {
        this.userDetails = data;

        // Décomposer l'adresse complète
        this.splitAdresse();
        console.log(data);
      },
      (error) => console.error('Erreur lors du chargement des données utilisateur:', error)
    );

    // Fetch reservations based on user_id
    this.http.get(`http://localhost:5000/api/reservations/filters?user_id=${userId}`).subscribe(
      (data: any) => {
        this.reservations = data.reservations;
        console.log(this.reservations);
      },
      (error) => console.error('Erreur lors du chargement des réservations:', error)
    );
  }

  // Méthode pour changer l'onglet actif
  showTab(tabName: string): void {
    this.activeTab = tabName;
  }

  // Méthode pour décomposer l'adresse
  splitAdresse(): void {
    const parts = this.userDetails.adresse.split(', ');
    this.adresseParts.street = parts[0] || '';
    this.adresseParts.city = parts[1] || '';
    this.adresseParts.state = parts[2] || '';
  }

  // Méthode pour mettre à jour l'adresse complète
  updateAdresse(): void {
    this.userDetails.adresse = `${this.adresseParts.street}, ${this.adresseParts.city}, ${this.adresseParts.state}`.trim().replace(/, $/, '');
  }

  // Méthode pour mettre à jour les données utilisateur
  updateUser(): void {
    const userId = this.userDetails.user_id;

    // Mettre à jour l'adresse avant d'envoyer les données
    this.updateAdresse();

    const updatedData = {
      nom: this.userDetails.nom,
      prenom: this.userDetails.prenom,
      email: this.userDetails.email,
      numero_de_telephone: this.userDetails.numero_de_telephone,
      adresse: this.userDetails.adresse, // Adresse complète
    };

    this.http.put(`http://localhost:5000/api/user/${userId}`, updatedData).subscribe(
      (response) => {
        console.log('Mise à jour réussie:', response);
        alert('Utilisateur mis à jour avec succès');
        // Revenir à l'onglet "Hist" après mise à jour
        this.activeTab = 'Hist';
      },
      (error) => console.error('Erreur lors de la mise à jour:', error)
    );
  }
}

