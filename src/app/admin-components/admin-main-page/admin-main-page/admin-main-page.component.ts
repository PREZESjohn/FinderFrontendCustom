import { Component, OnInit } from '@angular/core';
import {GroupRoom} from '../../../domain/GroupRoom';
import {GroupRoomService} from '../../../services/group-room.service';
import {AlertService} from '../../../services/alert.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-main-page',
  templateUrl: './admin-main-page.component.html',
  styleUrls: ['./admin-main-page.component.scss']
})
export class AdminMainPageComponent implements OnInit {

  public displayedColumns = ['Id','Name','Users', 'Open','Group Leader','Game','Category']
  public groupsData:GroupRoom[];

  constructor(private groupRoomService:GroupRoomService, private alertService:AlertService,private router:Router) {
    this.groupRoomService.getGroups().subscribe((data:any)=>{
      this.groupsData = data;
    },
      ()=>{
      this.alertService.error("Cant load groups")
      })
  }

  ngOnInit(): void {
  }


  public showGroupDetails(row:any){
    this.router.navigate(["admin/group-room-details",row.id])
  }
}
