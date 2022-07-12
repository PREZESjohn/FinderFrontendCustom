import { Component, OnInit } from '@angular/core';
import {GroupRoom} from '../../domain/GroupRoom';
import {AlertService} from '../../services/alert.service';
import {GroupRoomService} from '../../services/group-room.service';

@Component({
  selector: 'app-group-room',
  templateUrl: './group-room.component.html',
  styleUrls: ['./group-room.component.scss']
})
export class GroupRoomComponent implements OnInit {

  groupRooms: GroupRoom[]

  constructor(private alertService: AlertService, private groupRoomService: GroupRoomService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  removeGroup(groupId: number) {
    this.groupRoomService.deleteGroup(groupId).subscribe(
      () => {
        this.alertService.success('U successfully quit this group');
        this.loadData();
      },
      () => this.alertService.error('Error while removing group'));
  }

  loadData() {
    this.groupRoomService.getGroups().subscribe(
      (data:any) => this.groupRooms = data,
      () => this.alertService.error('Error while getting groups')
    );
  }
}

