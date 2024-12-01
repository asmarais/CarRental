import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent {
OpenProfil(){
  $('#profileModal').modal('show');
}
CloseProfil(){
  $('#profileModal').modal('hide');
}
OpenEdit(){
  $('#editProfil').modal('show');
}
CloseEdit(){
  $('#editProfil').modal('hide');
}
}
