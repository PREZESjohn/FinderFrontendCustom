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
  public cities = cityList;
  public pageSize = 3;
  public currentPage = 0;
  public numberOfPages = 0;
  public cityName;
  private subscriptionName: Subscription;

  constructor(private groupRoomService: GroupRoomService,
              private controlHelperService: ControlHelperService,
              private dialog:MatDialog,
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
      this.cities = cityList;
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
    this.userService.joinGroup(groupId,new InGameRoles()).subscribe((data:any) => {
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
    this.groupRoomService.getGroupsByGame(this.chosenGame?.name,this.currentPage,this.pageSize).subscribe(
      (data: any) =>{
        this.groupRooms = data.content;
        this.numberOfPages = data.totalPages;
    this.profilePictureService.setUsersProfilePictures(this.groupRooms);
    this.profilePictures = this.profilePictureService.getUsersProfilePictures();
  },
      (e)=>{
        this.alertService.error(CodeErrors.get(e.error.code))
      }
    );
  }

  public reloadByFilters() {
    this.currentPage = 0;
    if (this.chosenRole == null && this.chosenCategory != null && this.cityName == undefined) {
      this.groupRoomService.getGroupsByGameAndCategory(this.chosenGame.id, this.chosenCategory.id,this.currentPage,this.pageSize).subscribe(
        (data: any) => {
          this.groupRooms = data.content
          this.numberOfPages = data.totalPages;
        },
        () => this.alertService.error('Error while getting groups')
      );
    } else if (this.chosenCategory == null && this.chosenRole != null ) {
      this.groupRoomService.getGroupsByGameAndRole(this.chosenGame.id, this.chosenRole.id,this.currentPage,this.pageSize).subscribe(
        (data: any) => {
          this.groupRooms = data.content
          this.numberOfPages = data.totalPages;
        },
        () => this.alertService.error('Error while getting groups')
      );
    } else if (this.chosenRole != null && this.chosenCategory != null) {
      this.groupRoomService.getGroupsByGameCategoryRole(this.chosenGame.id, this.chosenCategory.id, this.chosenRole.id,this.currentPage,this.pageSize).subscribe(
        (data: any) => {
          this.groupRooms = data.content
          this.numberOfPages = data.totalPages;
        },
        () => this.alertService.error('Error while getting groups')
      );
    }
    else if (this.chosenCategory == null && this.cityName !== undefined) {
      this.groupRoomService.getGroupsByGameAndCity(this.chosenGame.id, this.cityName,this.currentPage,this.pageSize).subscribe(
        (data: any) => {
          this.groupRooms = data.content
          this.numberOfPages = data.totalPages;
        },
        () => this.alertService.error('Error while getting groups')
      );
    }else if(this.chosenCategory !== null && this.cityName !== undefined){
      this.groupRoomService.getGroupsByGameCategoryCity(this.chosenGame.id, this.chosenCategory.id, this.cityName,this.currentPage,this.pageSize).subscribe(
        (data: any) => {
          this.groupRooms = data.content
          this.numberOfPages = data.totalPages;
        },
        () => this.alertService.error('Error while getting groups')
      );
    }
    else {
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

  public changeCity(e:any){
    const temp = this.cities.map(a => {
      if (a.name === e.target.value) {
        return a
      } else return
    }).filter((value) => {
      return value !== undefined
    });
    // @ts-ignore
    this.cityName=temp[0]?.name;
    this.reloadByFilters();
  }

  public joinByCode(){
    const code:string = this.codeInputValue;
    if(code!=="") {
      this.groupRoomService.joinByCode(code).subscribe((data: any) => {
         this.navigateToGroup(data);
        }, (e) => {
          this.alertService.error(CodeErrors.get(e.error.code))
        }
      )
    }else{
      this.alertService.error("Wrong code");
    }
  }

  createNewGroup(){
    this.dialog.open(GroupAddComponent,{
      closeOnNavigation: true,
      width:"50%",
      height:'90%'
    })
  }

  navigateToGroup(groupRoom){
    this.router.navigate(['/group-show/',groupRoom.id])
  }
  public miniView=false
  @HostListener('window:resize',['$event'])
  onResize(event){
    if(window.innerWidth<1000){
      this.miniView=true;
    }else{
      this.miniView=false;
    }
  }

  goToPreviousPage() {
    if (this.currentPage != 0) {
      this.currentPage = this.currentPage - 1;
      this.reloadGame();
    }
  }
  goToNextPage(){
    if(this.currentPage!=this.numberOfPages) {
      this.currentPage = this.currentPage + 1;
      this.reloadGame();
    }
  }
  goToPage(page:number){
    this.currentPage = page;
    this.reloadGame();
  }

}
