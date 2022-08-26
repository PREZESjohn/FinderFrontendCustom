import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupRoom} from '../../domain/GroupRoom';
import {User} from '../../domain/User';
import {GroupRoomService} from '../../services/group-room.service';
import {AlertService} from '../../services/alert.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {JoinCodeDTO} from '../../domain/dto/JoinCodeDTO';
import {ProfilePicturesService} from '../../services/profilePicturesService';
import {AuthService} from '../../services/auth.service';
import {CodeErrors} from '../../providers/CodeErrors';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Report} from '../../domain/Report';
import {CustomNotification} from '../../domain/CustomNotification';
import {EditGroupComponent} from './edit-group/edit-group.component';


@Component({
  selector: 'app-group-show',
  templateUrl: './group-show.component.html',
  styleUrls: ['./group-show.component.scss']
})
export class GroupShowComponent implements OnInit, OnDestroy {
  id: number;
  currentGroup: GroupRoom;
  profilePictures = null;
  isUserInGroup = false;
  isConnected = new Map();

  isAdmin = false;
  isInGroupRoomView = false;
  editGroupRoom = new GroupRoom();
  public source;
  currentUser: User;

  constructor(private groupRoomService: GroupRoomService,
              private alertService: AlertService,
              private userService: UserService,
              private profilePicturesService: ProfilePicturesService,
              private authService: AuthService,
              private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {

    this.isInGroupRoomView = true;
    this.id = +this.route.snapshot.paramMap.get('id');
    this.source = this.alertService.getSource()
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.source.addEventListener('message', message => this.notificationMethod(message))
    this.dialog.closeAll();

  }

  ngOnInit(): void {
    this.showGroupContent(this.id)
    this.checkIfAdmin();
  }

  ngOnDestroy() {
    this.isInGroupRoomView = false;
  }

  notificationMethod(message) {
      const msg: CustomNotification = JSON.parse(message.data);
      if (msg.type === 'REMOVED' && msg.removedUserId === this.currentUser.id && msg.groupRoom.id === this.currentGroup.id && this.isInGroupRoomView) {
        this.router.navigateByUrl('/home-page')
      }
      if (this.isInGroupRoomView && msg.groupRoom.id === this.currentGroup.id) {
        if (msg.type == 'REMOVED') {
          this.alertService.error(msg.msg);
        } else {
          this.alertService.success(msg.msg)
        }
        this.checkIfAdmin();
        this.showGroupContent(this.id);

      window.setTimeout(() => {
        this.alertService.clear()
      }, 8000);
    }
    this.dialog.closeAll();
  }
  navigateToProfile(profile) {
    this.router.navigate(['/profile/', profile.id])
  }

  showGroupContent(groupId: number) {
    if (groupId === undefined) {
      groupId = Number(localStorage.getItem('groupId'));
    } else {
      localStorage.setItem('groupId', groupId.toString());
    }
    this.groupRoomService.showGroupContent(groupId).subscribe((data: any) => {
        this.currentGroup = data;
        this.editGroupRoom.name = data.name;
        this.editGroupRoom.maxUsers = data.maxUsers;
        this.editGroupRoom.description = data.description;
        this.isUserInGroup = this.tableContains(data?.users, this.currentUser);
        this.profilePictures = this.profilePicturesService.getUsersProfilePictures();

        if (this.profilePictures.size === 0) {
          this.profilePicturesService.setUsersProfilePictureForGroup(data);
          this.profilePictures = this.profilePicturesService.getUsersProfilePictures();
        }
      },
      (e) => {
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    )
  }

  checkIfAdmin() {
    this.userService.getUser().subscribe(
      data => {
        this.currentUser = data
        if (this.currentUser?.role.name === 'ROLE_ADMIN') {
          this.isAdmin = true;
        }
        this.isUserInGroup = this.tableContains(this.currentGroup?.users, data);
      }, (e) => {
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    );
  }

  public joinGroup(groupId: number) {
    this.userService.joinGroup(groupId).subscribe((data: any) => {
        // this.alertService.success('You joined group');
        this.showGroupContent(groupId)
      },
      (e) => {
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  generateCode(groupRoom: GroupRoom) {
    this.groupRoomService.generateCode(groupRoom.id).subscribe((data: any) => {
      const joinCodedto: JoinCodeDTO = data;
      groupRoom.joinCode = joinCodedto?.code
    }, (e) => {
      this.alertService.error(CodeErrors.get(e.error.code))
    })
  }

  public makePartyLeader(user: User) {
    const userId = user.id;
    const groupId = this.currentGroup.id;
    this.groupRoomService.makePartyLeader(groupId, userId).subscribe((data: any) => this.currentGroup = data,
      (e) => {
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  public removeFromGroup(user: User) {
    const userId = user.id;
    const groupId = this.currentGroup.id;
    this.groupRoomService.removeFromGroup(groupId, userId).subscribe((data: any) => this.currentGroup = data,
      (e) => {
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  public tableContains(table, objectToFind): boolean {
    let found = false;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < table.length; i++) {
      if (table[i]?.id === objectToFind?.id) {
        found = true;
        break;
      }
    }
    return found
  }

  public setConnection(values: any) {
    this.isConnected.set(values[0], values[1]);
  }

  reportGroup(reason:string) {
    const report = new Report();
    report.reason = reason;
    this.currentGroup.users.forEach((user) => {
      this.userService.reportUser(report,user.id).subscribe(() => {
        this.alertService.success("Group reported")
      }, (e) => {
        this.alertService.success("Group reported")
      })
    })
  }

  openChangeGroup() {
    const dialogRef=this.dialog.open(EditGroupComponent,{
      closeOnNavigation:true,
      width:"40%",
      height:"40%",
      data:{
        groupRoom: {
          id: this.currentGroup.id,
          name: this.currentGroup.name,
          maxUsers: this.currentGroup.maxUsers,
          desc: this.currentGroup.description
        }
      }
    })
    dialogRef.afterClosed().subscribe(data=> {
        if(data.mode){
          this.currentGroup.name = data.name;
          this.currentGroup.maxUsers = data.maxUsers;
          this.currentGroup.description = data.desc;
        }
    });
  }
}
