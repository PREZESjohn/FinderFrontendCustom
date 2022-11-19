import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {CustomValidators} from "../../providers/CustomValidators";
import {CodeErrors} from '../../providers/CodeErrors';
import {TermComponent} from "../term/term.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  loginFormGroup: FormGroup;
  selected: string;
  fieldTextType: boolean;
  public isLoading = false;
  public isEmailSend = false;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private alertService: AlertService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        username: new FormControl('',
          [Validators.required, Validators.minLength(3)]),
        email: new FormControl('',
          [Validators.required, Validators.minLength(3)]),
        password: new FormControl('',
          [Validators.required, Validators.minLength(3)]),
        repeatPassword: new FormControl('',Validators.required),
        checkTerm: new FormControl(false, Validators.requiredTrue)
      },
        {validators: CustomValidators.mustMatch('password', 'repeatPassword')})
    });
  }

  register() {
    if(this.loginFormGroup.valid){
      this.isLoading = true;
    this.authService.register(
      this.loginFormGroup.get('user').get('username').value,
      this.loginFormGroup.get('user').get('email').value,
      this.loginFormGroup.get('user').get('password').value).subscribe({
        next: response => {
            this.isEmailSend = true;
        },
        error: err => {
          this.isEmailSend = false;
          this.isLoading = false;
          this.alertService.error(CodeErrors.get(err.error.code))
        }
      }
    );}
    else {
      if (this.loginFormGroup.get('user').get('password').errors!==null || this.loginFormGroup.get('user').get('username').errors!==null) {
        this.alertService.error("Login and password must contains at least 3 characters")
      }else if(this.loginFormGroup.get('user').get('repeatPassword').errors!==null){
        this.alertService.error("Passwords are not the same")
      }else if(this.loginFormGroup.get('user').get('checkTerm').errors!==null) {
        this.alertService.error("You didn't accept terms")
      }else{
        this.alertService.error("Wrong email");
      }
    }
  }


  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  openTerm() {
    const dialogRef = this.dialog.open(TermComponent, {
      closeOnNavigation: true,
      disableClose: false,
      width: '60%',
      height: '90%'
    })
  }
}
