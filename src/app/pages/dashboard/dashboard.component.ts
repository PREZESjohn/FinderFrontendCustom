import {Component, OnDestroy, OnInit} from '@angular/core';

import {ControlHelperService} from '../../services/control-helper.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {FormBuilder} from '@angular/forms';
import {GroupRoom} from '../../domain/GroupRoom';
import {GroupRoomService} from '../../services/group-room.service';
import {UserService} from '../../services/user.service';
import {User} from '../../domain/User';
import {AuthService} from '../../services/auth.service';
import {CategoryService} from '../../services/categoryService';
import {GameDTO} from '../../domain/dto/GameDTO';
import {Category} from '../../domain/Category';
import {Role} from '../../domain/Role';
import {ProfilePicturesService} from '../../services/profilePicturesService';
import {Subscription} from 'rxjs';
import {CodeErrors} from '../../providers/CodeErrors';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['/dashboard.css']
})
export class DashboardComponent implements OnInit,OnDestroy {

  public data: any;
  public isAdmin = false;
  public currentUser: User;
  public chosenGame: GameDTO;
  public display = 'none';
  public chosenRole: Role;
  public chosenCategory: Category;
  public groupRooms: GroupRoom[] = [];
  public codeInputValue = '';
  public profilePictures;
  private subscriptionName: Subscription;

  constructor(private groupRoomService: GroupRoomService,
              private controlHelperService: ControlHelperService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private profilePicturesService:ProfilePicturesService,
              private categoryService: CategoryService,
              private profilePictureService:ProfilePicturesService) {
    this.subscriptionName = this.categoryService.lookForUpdate().subscribe((game:any)=>{
      this.chosenGame = game;
      this.reloadGame();
    })
  }

  ngOnInit() {
      this.reloadGame();
    if (this.checkIfLoggedIn()) {
      this.checkIfAdmin()
    }
  }
  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  joinGroup(groupId: number) {
    this.userService.joinGroup(groupId).subscribe((data:any) => {
        this.alertService.success('You joined group');
        this.reloadGame()
      },
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      })
  }

  joinGroupMethod(groupId: number) {
    this.joinGroup(groupId);
  }
  checkIfAdmin() {
    this.userService.getUser().subscribe(
      data => {
        this.currentUser = data
        if (this.currentUser?.role.name === 'ROLE_ADMIN') {
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
    } else return false;
  }

  reloadGame() {
    this.chosenGame = this.categoryService.getGame();
    this.groupRoomService.getGroupsByGame(this.chosenGame?.name).subscribe(
      (data: any) =>{ this.groupRooms = data;
    this.profilePictureService.setUsersProfilePictures(data);
    this.profilePictures = this.profilePictureService.getUsersProfilePictures();
  },
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    );
  }

  public reloadByFilters() {
    if (this.chosenRole == null && this.chosenCategory != null) {
      this.groupRoomService.getGroupsByGameAndCategory(this.chosenGame.id, this.chosenCategory.id).subscribe(
        (data: any) => this.groupRooms = data,
        () => this.alertService.error('Error while getting groups')
      );
    } else if (this.chosenCategory == null && this.chosenRole != null) {
      this.groupRoomService.getGroupsByGameAndRole(this.chosenGame.id, this.chosenRole.id).subscribe(
        (data: any) => this.groupRooms = data,
        () => this.alertService.error('Error while getting groups')
      );
    } else if (this.chosenRole != null && this.chosenCategory != null) {
      this.groupRoomService.getGroupsByGameCategoryRole(this.chosenGame.id, this.chosenCategory.id, this.chosenRole.id).subscribe(
        (data: any) => this.groupRooms = data,
        () => this.alertService.error('Error while getting groups')
      );
    } else {
      this.reloadGame();
    }
  }
  public changeCategory(e:any) {
    const temp = this.chosenGame.categories.map(a => {
      if (a.name === e.target.value) {
        return a
      } else return
    }).filter((value) => {
      return value !== undefined
    });
    // @ts-ignore
    this.chosenCategory = temp[0];
    this.reloadByFilters()
  }

  public changeRole(e:any) {
    const temp = this.chosenGame.inGameRoles.map(a => {
      if (a.name === e.target.value) {
        return a
      } else return
    }).filter((value) => {
      return value !== undefined
    });
    // @ts-ignore
    this.chosenRole = temp[0];
    this.reloadByFilters();
  }

  public joinByCode(){
    const code:string = this.codeInputValue;
    this.groupRoomService.joinByCode(code).subscribe((data:any)=>{
      history.state.data = data?.id
      this.router.navigateByUrl('/group-show');
      },(e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    )
  }
}
