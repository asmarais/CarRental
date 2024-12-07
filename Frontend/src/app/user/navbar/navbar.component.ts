import { Component } from '@angular/core';
import { LoadingService } from '../loading-service.service';  // Assurez-vous que le chemin est correct
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
gohome(){
  window.location.href = "/user/home";
}
constructor(private loadingService: LoadingService,private authService: AuthService) {}

  goProfil() {
    this.loadingService.openLoadingPageAndNavigate('/user/profile', 1700);  // Naviguer vers '/user/profil' après 3 secondes
  }

  golore() {
    this.loadingService.openLoadingPageAndNavigate('/loRe', 1700);  
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.golore(); // Appelle la méthode logout
  }
}
