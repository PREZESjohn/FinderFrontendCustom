import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../services/user.service';
import {AuthService} from '../../../services/auth.service';
import {AlertService} from '../../../services/alert.service';
import {CodeErrors} from '../../../providers/CodeErrors';
import {EmailDto} from '../../../domain/dto/EmailDto';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-email-change',
  templateUrl: './email-change.component.html',
  styleUrls: ['./email-change.component.scss']
})
export class EmailChangeComponent implements OnInit {

  emailChangeFormGroup: FormGroup;
  public inputMode = true;


  constructor(private alertService: AlertService,
              private formBuilder:FormBuilder,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.emailChangeFormGroup = this.formBuilder.group({
      emailChange:this.formBuilder.group({
        email: new FormControl('',[Validators.required,Validators.pattern('^[a-z0-9._-]+@[a-z0-9.-]+\\.[a-z]{2,}$')])
      })
    })
  }

  changeEmail() {
    let emailDTO = new EmailDto();
    if(this.emailChangeFormGroup.valid){
    emailDTO.email = this.emailChangeFormGroup.get('emailChange').get('email').value;

      this.authService.changeEmail(emailDTO).subscribe(() => {
        this.inputMode = false;
      }, (error) => {
        this.inputMode = true;
        if (error.error.code == null) {
          this.alertService.error('Type correct email. Example - example@gmail.com')
        } else {
          this.alertService.error(CodeErrors.get(error.error.code))
        }
      });
    }else{
      this.alertService.error('Bad email')
    }

  }
}
