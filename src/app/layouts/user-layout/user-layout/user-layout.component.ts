import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {Store} from "@ngrx/store";
import {loadGames} from "../../../core/state/games";

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.scss']
})

export class UserLayoutComponent implements OnInit {

  constructor(private authService:AuthService,
              private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(loadGames());
  }

  checkToken(){
    return this.authService.getToken()
  }
}
