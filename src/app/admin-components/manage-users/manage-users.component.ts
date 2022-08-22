import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import{SearchUserDialogComponentComponent} from './search-user-dialog-component/search-user-dialog-component.component';
import {BannedUsersComponent} from './banned-users/banned-users.component';
import {ReportsComponent} from './reports/reports.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
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
}


