import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  token:string =""
  constructor(private authService:AuthService,private activatedRoute:ActivatedRoute) {

   this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    })
  }


  ngOnInit(): void {
  }

  confirmDelete(){

    this.authService.confirmDelete(this.token).subscribe(()=>{
      this.authService.logout();
    })
  }
}
