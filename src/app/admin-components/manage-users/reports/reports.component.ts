import { Component, OnInit } from '@angular/core';
import {CodeErrors} from '../../../providers/CodeErrors';
import {ReportedUser} from '../../../domain/ReportedUser';
import {UserService} from '../../../services/user.service';
import {AlertService} from '../../../services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public reportedUsers:ReportedUser[];
  public panelOpenState = false;
  constructor(private userService:UserService, private alertService:AlertService, private router:Router) { }

  ngOnInit(): void {
    this.reportedUsers = this.userService.getReportedUsersFromService();
  }

  inspectProfile(user){
    console.log(user)
    this.router.navigate(['admin/user-details',user.reportedUser.id])
  }
}
