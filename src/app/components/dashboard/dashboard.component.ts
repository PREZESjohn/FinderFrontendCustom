import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';

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
import {MatDialog} from '@angular/material/dialog';
import {GroupAddComponent} from '../group-add/group-add.component';
import {cityList} from '../../providers/Cities';
import {InGameRoles} from '../../domain/dto/InGameRoles';
import {SearchCriteria} from '../../domain/SearchCriteria';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['/dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

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
  public cities = cityList;
  public pageSize = 3;
  public currentPage = 0;
  public numberOfPages = 0;
  public cityName;
  private subscriptionName: Subscription;

  constructor(private groupRoomService: GroupRoomService,
              private controlHelperService: ControlHelperService,
              private dialog: MatDialog,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private router: Router,
              private userService: UserService,
              private authService: AuthService,
              private profilePicturesService: ProfilePicturesService,
              private categoryService: CategoryService,
              private profilePictureService: ProfilePicturesService) {
    this.subscriptionName = this.categoryService.lookForUpdate().subscribe((game: any) => {
      this.chosenGame = game;
      this.currentPage = 0;
      this.cities = cityList;
      this.removeFilters();
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
    this.userService.joinGroup(groupId, new InGameRoles()).subscribe((data: any) => {
        this.alertService.success('You joined group');
        this.reloadGame()
      },
      (e) => {
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
    this.groupRoomService.getGroupsByGame(this.chosenGame?.name,this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.groupRooms = data.content;
        this.numberOfPages = data.totalPages;
        this.profilePictureService.setUsersProfilePictures(this.groupRooms);
        this.profilePictures = this.profilePictureService.getUsersProfilePictures();
      },
      (e) => {
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    );
  }

  public removeFilters() {
    this.chosenCategory = null
    this.chosenRole = null
    this.cityName = null;
  }

  public prepareCriteriaObject(): SearchCriteria {
    let criteria = new SearchCriteria();
    if (this.chosenGame != null) {
      criteria.gameId = this.chosenGame.id;
    } else {
      criteria.gameId = null;
    }
    if (this.chosenRole != null) {
      criteria.roleId = this.chosenRole.id;
    } else {
      criteria.roleId = null;
    }
    if (this.chosenCategory != null) {
      criteria.categoryId = this.chosenCategory.id;
    } else {
      criteria.categoryId = null;
    }
    if (this.cityName != undefined) {
      criteria.cityName = this.cityName;
    } else {
      criteria.cityName = null;
    }
    return criteria;
  }

  public reloadByFilters() {
    this.currentPage = 0;
    let criteria = this.prepareCriteriaObject();

    this.groupRoomService.getGroupsByCriteria(criteria,this.currentPage, this.pageSize).subscribe(
      (data: any) => {
        this.groupRooms = data.content
        this.numberOfPages = data.totalPages;
      }
    );
  }

  public changeCategory(e: any) {
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

  public changeRole(e: any) {
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

  public changeCity(e: any) {
    const temp = this.cities.map(a => {
      if (a.name === e.target.value) {
        return a
      } else return
    }).filter((value) => {
      return value !== undefined
    });
    // @ts-ignore
    this.cityName = temp[0]?.name;
    this.reloadByFilters();
  }

  public joinByCode() {
    const code: string = this.codeInputValue;
    if (code !== "") {
      this.groupRoomService.joinByCode(code).subscribe((data: any) => {
          this.navigateToGroup(data);
        }, (e) => {
          this.alertService.error(CodeErrors.get(e.error.code))
        }
      )
    } else {
      this.alertService.error("Wrong code");
    }
  }

  createNewGroup() {
    this.dialog.open(GroupAddComponent, {
      closeOnNavigation: true,
      width: "50%",
      height: '90%'
    })
  }

  navigateToGroup(groupRoom) {
    this.router.navigate(['/group-show/', groupRoom.id])
  }

  public miniView = false

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth < 1000) {
      this.miniView = true;
    } else {
      this.miniView = false;
    }
  }

  goToPreviousPage() {
    if (this.currentPage != 0) {
      this.currentPage = this.currentPage - 1;
      this.reloadGame();
    }
  }

  goToNextPage() {
    if (this.currentPage != this.numberOfPages) {
      this.currentPage = this.currentPage + 1;
      this.reloadGame();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.reloadGame();
  }

}
