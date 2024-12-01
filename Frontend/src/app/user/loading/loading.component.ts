import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent  {
  /* constructor(private router:Router){}
  ngOnInit(): void {
    window.scroll(0,0);
    setTimeout(() => {
      this.router.navigate(["/user/pay"])
}, 1600);
  }*/
}

