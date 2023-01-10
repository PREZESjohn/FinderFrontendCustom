import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-confirm-email-change',
  templateUrl: './confirm-email-change.component.html',
  styleUrls: ['./confirm-email-change.component.scss']
})
export class ConfirmEmailChangeComponent implements OnInit {

  token:string =""
  constructor(private authService:AuthService,private activatedRoute:ActivatedRoute,private router:Router, private alertService:AlertService) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log(this.token)
    })
  }


  ngOnInit(): void {
    this.confirmEmailChange();
  }

  confirmEmailChange(){

    this.authService.confirmEmailChange(this.token).subscribe(()=>{
      setTimeout(this.redirectToDashboard,5000);
    })
  }
  redirectToDashboard() {
    this.router.navigateByUrl('/dashboard').then(()=>{
      const temp =  this.alertService.getSource();
      this.alertService.success("Email changed succesfully")
    });
  }
}
