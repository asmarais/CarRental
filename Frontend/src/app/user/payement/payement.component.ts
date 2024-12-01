import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-payement',
  templateUrl: './payement.component.html',
  styleUrls: ['./payement.component.css']
})
export class PayementComponent {
  qrData: string = '';
  apiUrl = 'http://localhost:5000/api/reservations';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.generateQrCode();
  }

  generateQrCode(): void {
    const reservationId = 'R12345'; // Remplacez par l'ID de la réservation
    const userId = 'U12345'; // Remplacez par l'ID utilisateur
    const voitureId = 'V12345'; // Remplacez par l'ID de la voiture

    this.http.get<any>(`${this.apiUrl}/${reservationId}/generateQrCode/${userId}/${voitureId}`)
      .subscribe(response => {
        if (response.token_qr) {
          this.qrData = response.token_qr; // Assignez le token pour le QR code
        } else {
          console.error('Aucun token QR reçu');
        }
      }, error => {
        console.error('Erreur de récupération du QR code:', error);
      });
  }
  printInvoice() {
    window.print();
  }
}