import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AlertService} from "../../../services/alert.service";
import {Router} from "@angular/router";
import {CodeErrors} from "../../../providers/CodeErrors";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  public token:string ="";
  public tokenInputMode = false;
  public isLoading = false;

  constructor(private userService: UserService,
              private alertService: AlertService,
              private router: Router,
              private authService: AuthService,
              private dialogRef: MatDialogRef<DeleteUserComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  deleteUser() {
    this.isLoading = true;
    this.userService.deleteUser().subscribe(
      ()=>{
        this.tokenInputMode = true;
        this.isLoading = false;
      },
      (e)=> {
        if (e.error.code == "15") {
          this.tokenInputMode = true;
          this.isLoading = false;
        } else {
          this.alertService.error(CodeErrors.get(e.error.code));
        }
      })
  }

  confirmDelete(){
    this.authService.confirmDelete(this.token).subscribe(()=>{
      this.dialogRef.close();
      this.authService.logout();
      this.router.navigateByUrl('/login');
    },
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code));
      })
  }

}
