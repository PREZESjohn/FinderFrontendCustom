import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {Error} from '../../domain/Error';
import {COMMON_ERROR_MESSAGE} from '../../domain/CommonMessages';
import {Message} from '../../domain/Message';
declare let EventSource:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  fieldTextType: boolean;


  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    if(this.authService.getToken()!==null){
      this.router.navigateByUrl('/home-page')
    }else {
      this.loginFormGroup = this.formBuilder.group({
        user: this.formBuilder.group({
          login: new FormControl('',
            [Validators.required, Validators.minLength(3)]),
          password: new FormControl('',
            [Validators.required, Validators.minLength(3)])
        })
      });
    }
    // this.connect();
  }

  login() {
    if(this.loginFormGroup.valid) {
      this.authService.login(this.loginFormGroup.get('user').get('login').value, this.loginFormGroup.get('user').get('password').value)
        .subscribe(
          response => {
            this.authService.setToken(response.token);
            window.location.reload();
          },
          error => {
            this.alertService.error("Wrong credetials");
          }
        );
    }else{
    this.alertService.error("Wrong credetials");
  }}
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
