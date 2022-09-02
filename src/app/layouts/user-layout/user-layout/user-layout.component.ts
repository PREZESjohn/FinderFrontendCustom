import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})

export class UserLayoutComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }

  checkToken(){
    return this.authService.getToken()
  }
}
