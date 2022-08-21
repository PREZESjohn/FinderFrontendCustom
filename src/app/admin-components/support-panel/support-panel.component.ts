import { Component, OnInit } from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {UserService} from '../../services/user.service';
import {ReportedUser} from '../../domain/ReportedUser';
import {CodeErrors} from '../../providers/CodeErrors';

@Component({
  selector: 'app-support-panel',
  templateUrl: './support-panel.component.html',
  styleUrls: ['./support-panel.component.scss']
})
export class SupportPanelComponent implements OnInit {

  public reportedUsers:ReportedUser[];

  constructor(private userService:UserService, private alertService:AlertService) { }

  ngOnInit(): void {

  }
  loadReportedUsers(){
    this.userService.getReportedUsers().subscribe((data:any)=>{
      this.reportedUsers = data;
    },(e)=>{
      this.alertService.error(CodeErrors.get(e.error.code));
    })
  }
}
