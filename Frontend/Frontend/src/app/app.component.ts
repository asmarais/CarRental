import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DynamicStyleLoaderService } from './dynamic-style-loader.service';
import { DynamicScriptLoaderService } from './dynamic-script-loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'CarRental';

  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private styleLoader: DynamicStyleLoaderService,
    private scriptLoader: DynamicScriptLoaderService,
  ) {}
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
    ngOnInit():void{
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          if (event.urlAfterRedirects.startsWith('/user')) {
            this.loadUserStylesAndScripts();
          } else if (event.urlAfterRedirects.startsWith('/admin')) {
            this.loadAdminStylesAndScripts();
          }else{
            this.loadUserStylesAndScripts();
          }
        }
      });
  }


  private loadUserStylesAndScripts(): void {
    // User CSS
    this.styleLoader.loadStyle('../assets/css/ionicons.min.css');
    this.styleLoader.loadStyle('../assets/css/flaticon.css');
    this.styleLoader.loadStyle('../assets/css/style.css');

    // User JS

    this.scriptLoader.loadScript('../assets/js/mainlo.js');

  }

  private loadAdminStylesAndScripts(): void {
    // Admin CSS
    this.styleLoader.loadStyle('../assets/cssADMIN/style.css');
    this.styleLoader.loadStyle('../assets/iconsADMIN/simple-line-icons/css/simple-line-icons.css');
    this.styleLoader.loadStyle('../assets/iconsADMIN/material-design-iconic-font/css/materialdesignicons.min.css');
    this.styleLoader.loadStyle('../assets/iconsADMIN/flaticon_1/flaticon_1.css');

    // Admin JS
    this.scriptLoader.loadScript('../assets/vendorADMIN/global/global.min.js');
    this.scriptLoader.loadScript('../assets/vendorADMIN/chart.js/Chart.bundle.min.js');
    this.scriptLoader.loadScript('../assets/vendorADMIN/apexchart/apexchart.js');
    this.scriptLoader.loadScript('../assets/jsADMIN/dashboard/dashboard-1.js');
    this.scriptLoader.loadScript('../assets/jsADMIN/dlabnav-init.js');
  }
}
