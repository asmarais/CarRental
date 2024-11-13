import { Component } from '@angular/core';

@Component({
  selector: 'app-payement',
  templateUrl: './payement.component.html',
  styleUrls: ['./payement.component.css']
})
export class PayementComponent {
  qrData: string = 'baha ellouze';  // Remplacez par votre URL ou texte

  printInvoice() {
    window.print();
  }
}
