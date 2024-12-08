import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-lo-and-re',
  templateUrl: './lo-and-re.component.html',
  styleUrls: ['./lo-and-re.component.css']
})
export class LoAndReComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: Router,private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      names: ['', Validators.required],
      surnames: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      cin: ['', Validators.required]
    });
  }

  login() {
    const loginData = {
      email: this.loginForm.value.email,
      mot_de_passe: this.loginForm.value.password,
    };
  
    this.http.post('http://localhost:5000/api/auth/login', loginData).subscribe(
      (res: any) => {
        // Utiliser res.token pour stocker le JWT
        localStorage.setItem('token', res.token);
        console.log(localStorage.getItem('token'));

        // Décoder les données utilisateur
        const userData = this.authService.getUserDataFromToken();
        console.log('User data:', userData);
  
        alert("Connexion réussie.");
        console.log("Login successful");


      // Rediriger en fonction du rôle
      if (userData.role === 'user') {
        this.route.navigate(['/user/home']);
      } else if (userData.role === 'admin') {
        this.route.navigate(['/admin/dash']);
      } else {
        console.error('Rôle inconnu:', userData.role);
        alert('Rôle inconnu, impossible de rediriger.');
      }
      },
      (error) => {
        console.error('Login error:', error);
        alert("Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
      }
    );
  }
  

  signup() {
    const signupData = {
      nom: this.signupForm.value.names,
      prenom: this.signupForm.value.surnames,
      email: this.signupForm.value.email,
      mot_de_passe: this.signupForm.value.password,
      numero_de_telephone: this.signupForm.value.phoneNumber,
      adresse: this.signupForm.value.address,
      cin: this.signupForm.value.cin 
    };
  
    this.http.post('http://localhost:5000/api/auth/signup', signupData).subscribe(
      response => console.log('Signup success:', response),

      error => console.error('Signup error:', error)
    );
    window.location.reload();

  }
  

  switchToRegister() {
    document.querySelector('.login__access')?.classList.add('hidden');
    document.querySelector('.login__register')?.classList.remove('hidden');
  }

  switchToLogin() {
    document.querySelector('.login__register')?.classList.add('hidden');
    document.querySelector('.login__access')?.classList.remove('hidden');
  }
}
