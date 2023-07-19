import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {InGameRoles} from '../../domain/dto/InGameRoles';
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {MiniProfilOverlayService} from "../../services/mini-profil-overlay.service";
import {UserPreviewOverlayRef} from "../other-user-profile/mini-profilev2/user-preview-overlay-ref";
import {debounceTime, fromEvent} from "rxjs";


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
  inGameRoles = [];
  inGameRolesMap = new Map();
  currentUser: User;
  isOpen: boolean;
  private overlayRef: OverlayRef;
  public dialogRef: UserPreviewOverlayRef;
  private closeTimeout: any;
  private isFocused: boolean;
  private prevElement: HTMLElement | null=null;
  overlayOpen:boolean;
  @ViewChild('img-responsive img-thumbnail mt-1') private overlayElem: ElementRef;
  miniProfileUser: User;
  timeoutId: any;
  constructor(private groupRoomService: GroupRoomService,
              private alertService: AlertService,
              private userService: UserService,
              private profilePicturesService: ProfilePicturesService,
              private authService: AuthService,
              private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private previewDialog: MiniProfilOverlayService) {

    this.isInGroupRoomView = true;
    this.overlayOpen=false;
    this.id = +this.route.snapshot.paramMap.get('id');
    this.source = this.alertService.getSource()
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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
    if (msg.type === 'REMOVED' && msg.removedUserId === this.currentUser.id && msg.groupRoom?.id === this.currentGroup.id && this.isInGroupRoomView) {
      this.router.navigateByUrl('/home-page')
    }
    if (this.isInGroupRoomView && msg.groupRoom?.id === this.currentGroup.id) {
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

      this.dialogRef.close();

    this.router.navigate(['/profile/', profile.id])
  }

  showGroupContent(groupId: number) {
    if (groupId === undefined) {
      groupId = Number(localStorage.getItem('groupId'));
    } else {
      localStorage.setItem('groupId', groupId.toString());
    }
    this.groupRoomService.showGroupContent(groupId).subscribe((data: any) => {
        this.loadData(data)
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

  loadData(data){
    this.inGameRoles = [];
    this.inGameRolesMap = new Map();
    console.log(data)
    this.currentGroup = data;
    this.currentGroup.takenInGameRoles.forEach((takenRole) => {
      if (takenRole.user === null) {
        this.inGameRoles.push(takenRole.inGameRole);
        console.log(data)
      }else{
        this.inGameRolesMap.set(takenRole.user.id,takenRole.inGameRole)
      }
    })
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

  public joinGroup(groupId: number,inGameRole:InGameRoles) {
    if(inGameRole==undefined){
      inGameRole = new InGameRoles();
    }
    this.userService.joinGroup(groupId,inGameRole).subscribe((data: any) => {
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
    this.groupRoomService.removeFromGroup(groupId, userId).subscribe((data: any) => {
      this.loadData(data)
      },
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

  reportGroup(reason: string) {
    const report = new Report();
    report.reason = reason;
    this.currentGroup.users.forEach((user) => {
      this.userService.reportUser(report, user.id).subscribe(() => {
        this.alertService.success('Group reported')
      }, (e) => {
        this.alertService.success('Group reported')
      })
    })
  }

  openChangeGroup() {
    const dialogRef = this.dialog.open(EditGroupComponent, {
      closeOnNavigation: true,
      disableClose: true,
      width: '50%',
      height: '60%',
      data: {
        groupRoom: {
          id: this.currentGroup.id,
          name: this.currentGroup.name,
          maxUsers: this.currentGroup.maxUsers,
          usersInGroup: this.currentGroup.users.length,
          desc: this.currentGroup.description,
          activeRoles: this.currentGroup.inGameRolesActive
        }
      }
    })
    dialogRef.afterClosed().subscribe(data => {
      if (data.mode) {
        this.currentGroup.name = data.name;
        this.currentGroup.maxUsers = data.maxUsers;
        this.currentGroup.description = data.desc;
      }
    });
  }

  showPreview(evt: MouseEvent, user: User){
    const target = new ElementRef(evt.currentTarget);
    this.isFocused=true;
    clearTimeout(this.closeTimeout);

    const currentElement=evt.target as HTMLElement;
    if(this.prevElement && currentElement !== this.prevElement){
      this.dialogRef.close()

    }
    this.prevElement=currentElement;
    this.dialogRef = this.previewDialog.open(target, user);
  }
  closePreview(){

    this.isFocused=false;
    this.closeTimeout=setTimeout(()=>{
      if(!this.isFocused){
          this.dialogRef.close()
          this.prevElement=null;
      }
    },1000)

  }

}
