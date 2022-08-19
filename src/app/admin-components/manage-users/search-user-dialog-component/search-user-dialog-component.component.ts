import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertService} from '../../../services/alert.service';
import {CodeErrors} from '../../../providers/CodeErrors';

@Component({
  selector: 'app-search-user-dialog-component',
  templateUrl: './search-user-dialog-component.component.html',
  styleUrls: ['./search-user-dialog-component.component.scss']
})
export class SearchUserDialogComponentComponent implements OnInit {

  public username;
  constructor(private userService:UserService, private router:Router, private alertService:AlertService) { }

  ngOnInit(): void {
  }

  findUserByUsername(){
    console.log(this.username)
    this.userService.getUserByUsername(this.username).subscribe((data:any)=>{
      this.router.navigate(['admin/user-details',data.id]).then(
      );
    },
      (e)=>{
      console.log(e)
          this.alertService.error(CodeErrors.get(e.error.code))
      })
  }
}
