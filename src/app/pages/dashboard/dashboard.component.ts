import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';

import {ControlHelperService} from '../../services/control-helper.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GroupRoom} from '../../domain/GroupRoom';
import {GroupRoomService} from '../../services/group-room.service';
import {UserService} from '../../services/user.service';
import {User} from '../../domain/User';
import {AuthService} from '../../services/auth.service';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {CategoryService} from '../../services/categoryService';
import {GameDTO} from '../../domain/dto/GameDTO';
import {Category} from '../../domain/Category';
import {Role} from '../../domain/Role';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['/dashboard.css']
})
export class DashboardComponent implements OnInit {

  public data: any;
  public isAdmin = false;
  public currentUser: User;
  public chosenGame: GameDTO;
  public display = 'none';
  public chosenRole: Role;
  public chosenCategory: Category;
  public groupRooms: GroupRoom[] = [];

  constructor(private groupRoomService: GroupRoomService,
              private controlHelperService: ControlHelperService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.chosenGame = this.categoryService.getGame();
    this.reloadGame()
    if (this.checkIfLoggedIn()) {
      this.checkIfAdmin()
    }
  }

  loadData() {
    this.groupRoomService.getGroups().subscribe(
      (data: any) => this.groupRooms = data,
      () => this.alertService.error('Error while getting groups')
    );
  }

  joinGroup(groupId: number) {
    this.userService.joinGroup(groupId).subscribe(() => {
        this.alertService.success('You joined group');
        this.reloadGame()
      },
      () => this.alertService.error('Error while joining group'))
  }

  joinGroupMethod(groupId: number) {
    this.joinGroup(groupId);
  }

  deleteGroup(groupId: number) {
    this.groupRoomService.deleteGroup(groupId).subscribe(
      () => {
        this.alertService.success('You succesfully removed ur group');
        this.reloadGame();
      },
      () => this.alertService.error('Error while removing group'));
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
      (data: any) => this.groupRooms = data,
      () => this.alertService.error('Error while getting groups')
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
  public changeCategory(e) {
    const temp = this.chosenGame.categories.map(a => {
      if (a.name === e.target.value) {
        return a
      } else return
    }).filter((value) => {
      return value !== undefined
    });
    this.chosenCategory = temp[0];
    this.reloadByFilters()
  }

  public changeRole(e) {
    const temp = this.chosenGame.inGameRoles.map(a => {
      if (a.name === e.target.value) {
        return a
      } else return
    }).filter((value) => {
      return value !== undefined
    });
    this.chosenRole = temp[0];
    this.reloadByFilters();
  }
}
