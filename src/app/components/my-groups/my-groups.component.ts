import { Component, OnInit } from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {GroupRoomService} from '../../services/group-room.service';
import {UserService} from '../../services/user.service';
import {User} from '../../domain/User';
;

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {

  user: User;
  constructor(private alertService: AlertService, private groupRoomService: GroupRoomService, private userService:UserService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  removeGroup(groupId: number) {
    this.groupRoomService.deleteGroup(groupId).subscribe(
      () => {
        this.alertService.success('You succesfully removed group');
        this.loadData();
      },
      () => this.alertService.error('Error while removing group'));
  }

  loadData() {
    this.userService.getUserGroups().subscribe(
      (data:User) => this.user = data,
      () => this.alertService.error('Error while getting groups')
    );
  }

  leaveGroup(groupId){
    this.userService.leaveGroup(groupId).subscribe(()=> {
      this.alertService.success("You successfully left group");
      this.loadData();
    },() => this.alertService.error('Error while leaving group'));
    }
}
