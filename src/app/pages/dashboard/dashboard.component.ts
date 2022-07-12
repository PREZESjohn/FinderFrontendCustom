import {Component, OnInit} from '@angular/core';

import {ControlHelperService} from '../../services/control-helper.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GroupRoom} from '../../domain/GroupRoom';
import {GroupRoomService} from '../../services/group-room.service';
import {UserService} from "../../services/user.service";
import {User} from "../../domain/User";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  public data: any;
  public isAdmin = false;
  currentUser:User;

  display = 'none';

  groupRooms: GroupRoom[] = [];

  constructor(private groupRoomService: GroupRoomService,
              private controlHelperService: ControlHelperService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private router: Router,
              private userService:UserService,
              private authService:AuthService) {
  }

  ngOnInit() {
    this.loadData();
    if(this.checkIfLoggedIn()) {
      this.checkIfAdmin()
    }
  }
  loadData() {
    this.groupRoomService.getGroups().subscribe(
      (data:any) => this.groupRooms = data,
      () => this.alertService.error('Error while getting groups')
    );
  }
  joinGroup(groupId:number){
    this.userService.joinGroup(groupId).subscribe()
  }

  joinGroupMethod(groupId: number) {
    this.joinGroup(groupId);
    window.location.reload();
  }

  deleteGroup(groupId:number){
    this.groupRoomService.deleteGroup(groupId).subscribe(
      () => {
        this.alertService.success('You succesfully removed ur group');
        this.loadData();
      },
      () => this.alertService.error('Error while removing group'));
  }
  checkIfAdmin() {
    this.userService.getUser().subscribe(
      data => {
        this.currentUser = data
        if ( this.currentUser?.role.name === "ROLE_ADMIN") {
          this.isAdmin = true;
        }
      }, () => {
        this.alertService.error('Error');
      }
    );
  }
  checkIfLoggedIn() {
    if (this.authService.getToken()) {
      return true;
    }
    else return false;
  }
  // showGroupContent(groupId:number){
  //   this.groupRoomService.showGroupContent(groupId).subscribe();
  //   this.router.navigateByUrl("/group-show")
  // }

}
