import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-confirm-register',
  templateUrl: './confirm-register.component.html',
  styleUrls: ['./confirm-register.component.scss']
})
export class ConfirmRegisterComponent implements OnInit {

  token:string =""
  constructor(private authService:AuthService,private activatedRoute:ActivatedRoute, private router:Router, private alertService:AlertService) {

    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      this.confirmRegister();
    })
  }


  ngOnInit(): void {
  }

  confirmRegister(){
    this.authService.confirmRegister(this.token).subscribe((response:any)=>{
      this.authService.setToken(response.token);
        this.redirectToDashboard()
    })
  }

  private redirectToDashboard() {
    this.router.navigateByUrl('').then(()=>{
      const temp =  this.alertService.getSource();
      this.alertService.success("You successfully enabled your account")
    });
  }

}
