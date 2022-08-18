import { Component, OnInit } from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {

  constructor(private alertService:AlertService,private authService:AuthService) {}

  ngOnInit() {
  }

  checkToken(){
    return this.authService.getToken()
  }
}
