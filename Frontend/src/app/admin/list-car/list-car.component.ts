import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-list-car',
  templateUrl: './list-car.component.html',
  styleUrls: ['./list-car.component.css']
})
export class ListCarComponent implements OnInit {
  ngOnInit(): void {}
    openCar(){
      $('#CarModal').modal('show');
    }
    closeCar(){
      $('#CarModal').modal('hide');
    }



}
