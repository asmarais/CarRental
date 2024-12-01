import { Component } from '@angular/core';
import { LoadingService } from '../loading-service.service';  // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
gohome(){
  window.location.href = "/user/home";
}
constructor(private loadingService: LoadingService) {}

  goProfil() {
    this.loadingService.openLoadingPageAndNavigate('/user/profile', 1700);  // Naviguer vers '/user/profil' après 3 secondes
  }
}
