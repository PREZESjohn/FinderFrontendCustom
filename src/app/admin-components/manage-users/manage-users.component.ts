import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import{SearchUserDialogComponentComponent} from './search-user-dialog-component/search-user-dialog-component.component';
import {BannedUsersComponent} from './banned-users/banned-users.component';
import {ReportsComponent} from './reports/reports.component';
import {CodeErrors} from '../../providers/CodeErrors';
import { UserService } from 'src/app/services/user.service';
import {ReportedUser} from '../../domain/ReportedUser';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  public reportedUsers:ReportedUser[]=[];
  constructor(public dialog: MatDialog,private userService:UserService) { }

  ngOnInit(): void {
    this.loadReportedUsers()
  }

  openDialog() {
    this.dialog.open(SearchUserDialogComponentComponent,{
      closeOnNavigation: true,
      width:'500px',
      height:'220px',
    });
  }

  showBannedUsers(){
    this.dialog.open(BannedUsersComponent,{
      closeOnNavigation: true,
      width:"90%",
      height:'80%'
    })
  }

  showReportedUsers(){
    this.dialog.open(ReportsComponent,{
      closeOnNavigation: true,
      width:"90%",
      height:'80%'
    })
  }

  loadReportedUsers(){
    this.userService.getReportedUsers().subscribe((data:any)=>{
      this.reportedUsers = data;
      this.userService.setReportedUsers(data);
    })
  }

}


