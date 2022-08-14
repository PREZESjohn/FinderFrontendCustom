import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})

export class UserLayoutComponent implements OnInit {

  sidebarColor;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }
  changeSidebarColor(color){
    const sidebar = document.getElementsByClassName('sidebar')[0];
    const mainPanel = document.getElementsByClassName('main-panel')[0];

    this.sidebarColor = color;

    // tslint:disable-next-line:triple-equals
    if(sidebar != undefined){
      sidebar.setAttribute('data',color);
    }
    // tslint:disable-next-line:triple-equals
    if(mainPanel != undefined){
      mainPanel.setAttribute('data',color);
    }
  }
  changeDashboardColor(color){
    const body = document.getElementsByTagName('body')[0];
    if (body && color === 'white-content') {
      body.classList.add(color);
    }
    else if(body.classList.contains('white-content')) {
      body.classList.remove('white-content');
    }
  }

  checkToken(){
    return this.authService.getToken()
  }
}
