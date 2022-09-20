import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-confirm-email-change',
  templateUrl: './confirm-email-change.component.html',
  styleUrls: ['./confirm-email-change.component.scss']
})
export class ConfirmEmailChangeComponent implements OnInit {

  token:string =""
  constructor(private authService:AuthService,private activatedRoute:ActivatedRoute) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
    })
  }


  ngOnInit(): void {
  }

  confirmEmailChange(){

    this.authService.confirmDelete(this.token).subscribe(()=>{
      this.authService.logout();
    })
  }

}
