import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  users: any[] = []; // Liste des utilisateurs
  selectedUser: any = null; // Utilisateur sélectionné pour les détails ou la mise à jour
  apiUrl = 'http://localhost:5000/api/user'; // URL de base de l'API

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get(`${this.apiUrl}/`).subscribe(
      (response: any) => {
        this.users = response.users;
        console.log('Users fetched successfully:', this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  OpenProfil(userId: number): void {
    this.http.get(`${this.apiUrl}/${userId}`).subscribe(
      (response: any) => {
        this.selectedUser = response; // Assignation correcte des données sélectionnées
        console.log('User details:', this.selectedUser);
        $('#profileModal').modal('show');
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  CloseProfil(): void {
    $('#profileModal').modal('hide');
  }

  OpenEdit(userId: number): void {
    this.http.get(`${this.apiUrl}/${userId}`).subscribe(
      (response: any) => {
        this.selectedUser = response;
        console.log('User data for edit:', this.selectedUser);
        $('#editProfil').modal('show');
      },
      (error) => {
        console.error('Error fetching user data for edit:', error);
      }
    );
  }


  CloseEdit(): void {
    $('#editProfil').modal('hide');
  }

  updateUser(): void {
    console.log(this.selectedUser);
    if (this.selectedUser) {
      this.http.put(`${this.apiUrl}/${this.selectedUser.user.user_id}`, this.selectedUser).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.fetchUsers(); // Rafraîchir la liste après mise à jour
          this.CloseEdit();
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrl}/${userId}`).subscribe(
        (response) => {
          console.log('User deleted successfully:', response);
          this.fetchUsers(); // Rafraîchir la liste après suppression
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }
}
