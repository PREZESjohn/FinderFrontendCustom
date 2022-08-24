import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert.service';
import {CodeErrors} from '../../../providers/CodeErrors';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../providers/CustomValidators";
import {PasswordChangeDto} from "../../../domain/dto/PasswordChangeDto";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  passwordEditForm: FormGroup;
  constructor(private userService:UserService,
              private router:Router,
              private alertService:AlertService,
              private formBuilder:FormBuilder,
              private dialogRef: MatDialogRef<ChangePasswordComponent>) { }

  ngOnInit(): void {
    this.passwordEditForm = this.formBuilder.group({
      editUserPassword: this.formBuilder.group({
        oldPswd: new FormControl('',[Validators.required, Validators.minLength(3)]),
        newPswd: new FormControl('',[Validators.required, Validators.minLength(3)]),
        new2Pswd: new FormControl('',[Validators.required]),
      },
        {validators:CustomValidators.mustMatch('newPswd','new2Pswd')})
    })
  }

  changePassword() {
    if(this.passwordEditForm.valid){
      const oldPswd=this.passwordEditForm.get('editUserPassword').get('oldPswd').value;
      const newPswd=this.passwordEditForm.get('editUserPassword').get('newPswd').value;
      //TODO wykozystac metode changePassword z userSerwis ale na poczatku ogarnac PasswordChangeDTO
      const data=new PasswordChangeDto();
      data.oldPassword=String(oldPswd);
      data.newPassword=String(newPswd);
      console.log(oldPswd);
      console.log(newPswd);
      console.log(data);
      this.userService.changePassword(data).subscribe(
        ()=>{
          this.alertService.success("Password updated")
          this.dialogRef.close();
        }, (e)=>{
          this.alertService.error(CodeErrors.get(e.error.code))
        }
      )
    }
  }
}
