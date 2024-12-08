import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-sidebar-a',
  templateUrl: './sidebar-a.component.html',
  styleUrls: ['./sidebar-a.component.css']
})
export class SidebarAComponent implements OnInit{
  isDashboardActive: boolean = false;
  isCarsActive: boolean = false;
  isBookingActive: boolean = false;
  isUsersActive: boolean = false;
  isMapActive: boolean = false;

  constructor(private router: Router,private http: HttpClient, private authService: AuthService) {}
  mail: string | undefined;
  nom: string | undefined;
  userid: '' | undefined;
  ngOnInit() {
    const userData = this.authService.getUserDataFromToken();
    console.log('User data:', userData);
    const username = userData.userId;
    this.userid = username;
    console.log(this.userid);

    if (this.userid) {
      this.http.get<any>(`http://localhost:5000/api/user/${this.userid}`).subscribe(
        (response) => {
          console.log('Données utilisateur:', response);
          this.nom = response.user.nom;
          this.mail = response.user.email;
        },
        (error) => {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      );
    } else {
      console.error("L'ID utilisateur est introuvable.");
    }
  }

  godash() {
    window.location.href = "/admin/dash";
  }

  gocar() {
    this.setActiveLink('cars');
    this.router.navigate(['/admin/listC']);
  }

  gores() {
    this.setActiveLink('booking');
    this.router.navigate(['/admin/listR']);
  }

  gouser() {
    this.setActiveLink('users');
    this.router.navigate(['/admin/listU']);
  }

  gomaps() {
    this.setActiveLink('map');
    this.router.navigate(['/admin/maps']);
  }

  private setActiveLink(activeLink: string) {
    this.isDashboardActive = activeLink === 'dashboard';
    this.isCarsActive = activeLink === 'cars';
    this.isBookingActive = activeLink === 'booking';
    this.isUsersActive = activeLink === 'users';
    this.isMapActive = activeLink === 'map';
  }
}
