import { Component, OnInit } from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {GroupRoomService} from '../../services/group-room.service';
import {UserService} from '../../services/user.service';
import {User} from '../../domain/User';
import {GameDTO} from '../../domain/dto/GameDTO';
import {CategoryService} from '../../services/categoryService';
import {GroupRoom} from '../../domain/GroupRoom';
import {ProfilePicturesService} from '../../services/profilePicturesService';
;

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {

  currentUser: User;
  usersProfilePictures=null;
  public games: GameDTO[];
  constructor(private alertService: AlertService, private groupRoomService: GroupRoomService, private userService:UserService,
              private categoryService:CategoryService,private profilePicturesService:ProfilePicturesService) {
  }

  ngOnInit(): void {
    this.loadData();
    this.usersProfilePictures = this.profilePicturesService.getUsersProfilePictures()
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
      (data:User) => this.currentUser = data,
      () => this.alertService.error('Error while getting groups')
    );
    this.categoryService.getGames().subscribe(
      data => {
        this.games = data;
      })
  }

  leaveGroup(groupId){
    this.userService.leaveGroup(groupId).subscribe(()=> {
      this.alertService.success('You successfully left group');
      this.loadData();
    },() => this.alertService.error('Error while leaving group'));
    }

    public togglePrivate(group:GroupRoom){
    const groupId = group.id;
    const result = !group.open;
      group.open = result;
      this.groupRoomService.setIsPrivateValue(groupId,result).subscribe()
    }

}
