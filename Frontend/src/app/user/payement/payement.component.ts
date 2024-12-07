import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

export interface PaymentResponse {
  result: {
    status: string;
    link: string;
    payment_id: string;
    developer_tracking_id: string;
    success: boolean;
  };
  code: number;
  name: string;
  version: string;
}


@Component({
  selector: 'app-payement',
  templateUrl: './payement.component.html',
  styleUrls: ['./payement.component.css']
})
export class PayementComponent implements OnInit {
  qrData: string = '';
  apiUrl = 'http://localhost:5000/api/reservations';

  userid: string | undefined;
  reservationId: string | null = null;
  pricingOption: string | null = null;

  voitureDetails: any;

  reservationDetails: any = {}; // To store reservation details
  voitureId: string | null = null; // To store the voiture ID

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUserDataFromToken();
    this.userid = userData?.userId; // Extract userId from token

    // Extract reservationId and pricingOption from the route
    this.route.paramMap.subscribe(params => {
      this.reservationId = params.get('reservationId');
      this.pricingOption = params.get('pricingOption'); 

      if (this.reservationId) {
        console.log('Reservation ID:', this.reservationId);
        console.log('Pricing Option:', this.pricingOption);
        this.getReservationDetails(this.reservationId);
      } else {
        console.error('Reservation ID is missing from the route');
      }
      
  
    });
    
  }

  getReservationDetails(reservationId: string): void {
    this.http.get<any>(`${this.apiUrl}/${reservationId}`).subscribe(
      response => {
        this.reservationDetails = response; // Store the reservation details
        this.voitureId = response.voiture_id; // Extract voiture ID
        this.generateQrCode();
        if (response.voiture_id) {
          this.fetchVoitureDetails(response.voiture_id);
        }
      },
      error => {
        console.error('Error fetching reservation details:', error);
      }
    );
  }

  apiVoituresUrl = 'http://localhost:5000/api/voitures';


  fetchVoitureDetails(voitureId: string): void {
    this.http.get<any>(`${this.apiVoituresUrl}/${voitureId}`).subscribe(
      (response) => {
        this.voitureDetails = response;
      },
      (error) => {
        console.error('Error fetching voiture details:', error);
      }
    );
  }

  generateQrCode(): void {
    if (!this.reservationId || !this.userid) {
      console.error('Missing reservationId or userId');
      return;
    }
    console.log('sfcsf',this.voitureId)
   console.log(`${this.apiUrl}/${this.reservationId}/generateQrCode/${this.userid}/${this.voitureId}`)

    this.http
      .get<any>(`${this.apiUrl}/${this.reservationId}/generateQrCode/${this.userid}/${this.voitureId}`)
      .subscribe(
        response => {
          if (response.token_qr) {
            this.qrData = response.token_qr; // Assign the QR code token
          } else {
            console.error('No QR token received');
          }
        },
        error => {
          console.error('Error fetching QR code:', error);
        }
      );
  }

  calculateTotal(): number {
    const basePrice =
      this.pricingOption === 'prix_par_jour'
        ? this.voitureDetails?.prix_par_jour || 0
        : this.voitureDetails?.prix_par_mois || 0;
    return basePrice + 108.0; // Ajout des frais de PayPal
  }

  printInvoice() {
    window.print();
  }

  onPayNow(): void {
    const amountToPay = this.calculateTotal();
    console.log('Calculated total:', amountToPay);
  
    this.http.post<PaymentResponse>('http://localhost:5000/api/paiment/', { 
      amount: amountToPay
    })
    .subscribe(response => {
      console.log('Payment response:', response);
  
      if (response && response.result && response.result.link) {
        const paymentId = response.result.payment_id;
        window.location.href = response.result.link;
  
        // Effectuer une nouvelle requête POST après redirection
        this.http.post<PaymentResponse>(`http://localhost:5000/api/paiment/${paymentId}`, {})
          .subscribe(paymentStatusResponse => {
            console.log('Payment status response:', paymentStatusResponse);
  
            if (paymentStatusResponse.result.status === "SUCCESS") {
              console.log('Payment successful!');
              this.router.navigate(['/user/payement']); // Naviguer vers la page d'accueil
            } else {
              console.error('Payment failed, deleting reservation...');
              const reservationId = this.reservationId; // Méthode pour récupérer le reservationId actuel
  
              // Supprimer la réservation en cas d'échec
              this.http.delete(`http://localhost:5000/api/reservations/${reservationId}`)
                .subscribe(() => {
                  console.log('Reservation deleted successfully');
                  this.router.navigate(['/user/home']); // Naviguer vers la page d'accueil
                }, deleteError => {
                  console.error('Failed to delete reservation:', deleteError);
                });
            }
          }, statusError => {
            console.error('Failed to check payment status:', statusError);
          });
      } else {
        console.error('Payment link not found in response');
      }
    }, error => {
      console.error('Payment request failed', error);
    });
  }
  
  
  
}
