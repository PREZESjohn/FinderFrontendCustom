import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {CodeErrors} from '../../providers/CodeErrors';
declare let EventSource:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  fieldTextType: boolean;
  returnUrl = '';
  tokenParam = '';

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route:ActivatedRoute,
              private alertService: AlertService) {
    this.route.queryParams
      .subscribe(params => {
        this.returnUrl = params.returnUrl;
        this.tokenParam = params.token
      })
  }

  ngOnInit(): void {
    if(this.authService.getToken()!==null){
      this.router.navigateByUrl('/home-page')
    }else {
      this.loginFormGroup = this.formBuilder.group({
        user: this.formBuilder.group({
          login: new FormControl('',
            [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z0-9]{3,30}$')]),
          password: new FormControl('',
            [Validators.required, Validators.minLength(8),Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\\S+$).{8,20}$')])
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
            if(this.authService.checkIfAdmin()){
              this.router.navigateByUrl('admin/admin-main-page')
            }else{
              if(this.returnUrl !== undefined && this.tokenParam !== undefined) {
                this.router.navigateByUrl('/' + this.returnUrl + "?token="+this.tokenParam).then(() => {
                  const temp = this.alertService.getSource();
                })
              }else {
                this.router.navigateByUrl('').then(() => {
                  const temp = this.alertService.getSource();
                })
              }
            }
          },
          error => {
            this.alertService.error(CodeErrors.get(error.error.code));
          }
        );
    }else{
    this.alertService.error("Wrong credetials");
  }}
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
