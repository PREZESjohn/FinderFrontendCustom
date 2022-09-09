import {Component, OnInit, ElementRef, OnDestroy} from '@angular/core';
import {ROUTES} from '../sidebar/sidebar.component';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {User} from '../../domain/User';
import {CategoryService} from '../../services/categoryService';
import {GameDTO} from '../../domain/dto/GameDTO';
import {Subscription} from 'rxjs';
import {AlertService} from '../../services/alert.service';
import {NotificationService} from '../../services/NotificationService';
import {CustomNotification} from '../../domain/CustomNotification';
import {FriendRequest} from '../../domain/FriendRequest';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  location: Location;
  private sidebarVisible: boolean;

  public currentUser: User;
  public isAdmin = false;
  public games: GameDTO[];
  public chosenGame: GameDTO;
  public user;
  public source;
  public notificationsNumber = 0;
  public notifications: CustomNotification[] = [];
  public profilePicture = null;
  private subscriptionName: Subscription;
  public friendRequests:FriendRequest[];
  public friendRequestsNumber = 0;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private alertService: AlertService,
    private modalService: NgbModal,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
  ) {
      this.source = this.alertService.getSource();

      this.source.addEventListener('message', message => {
        this.getNotifications();
        this.getFriendRequests();
      })
    this.location = location;
    this.sidebarVisible = false;
    this.checkIfAdmin();
    this.subscriptionName = this.userService.observeProfilePictureChange().subscribe((data: any) => {
      this.profilePicture = data;
    })
  }


  ngOnInit() {
    console.log('Navbar reload')
    this.getFriendRequests();

    if (this.categoryService.getAllGames().length == 0) {
      this.getGames()
    } else {
      this.chosenGame = this.categoryService.getGame();
      this.games = this.categoryService.getAllGames();
    }
  }

  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }

  public getFriendRequests(){
    this.userService.getFriendRequests().subscribe((data:any)=>{
      this.friendRequests = data;
      this.friendRequestsNumber = this.friendRequests.length;
    })
  }

  public getNotifications(){
    this.notificationService.getAllNotifications().subscribe((data: any) => {
      this.notifications = data;
      this.notificationsNumber = data.length;
    })
  }

  public navigateToGroup(id:number,index,notifId){
    console.log(notifId)
    this.notificationService.removeNotification(notifId).subscribe()
    this.router.navigate(['/group-show/',id]).then(()=> {
        this.notifications.splice(index, 1);
        this.notificationsNumber = this.notifications.length;
      }
    )
  }

  removeNotif(index,notifId){
    this.notificationService.removeNotification(notifId).subscribe()
    this.notifications.splice(index, 1);
    this.notificationsNumber = this.notifications.length;
  }


  checkIfLoggedIn() {
    if (this.authService.getToken()) {
      return true;
    }
  }

  checkIfAdmin() {
    this.userService.getUser().subscribe(
      data => {
        this.currentUser = data
        this.getNotifications();
        this.userService.getProfilePicture(data.id).subscribe((d: any) => {
          this.profilePicture = this.userService.setProfilePicture(d);
        }, () => {
          this.profilePicture = '../assets/img/default-avatar.png'
        })
        if (this.currentUser?.role.name === 'ROLE_ADMIN') {
          this.isAdmin = true;
        }
      }
    );
  }

  getGames() {
    this.categoryService.getGames().subscribe(
      data => {
        this.games = data;
        this.categoryService.setAllGames(data);
        this.chosenGame = this.categoryService.getGame();
        if (this.chosenGame === undefined) {
          this.chosenGame = data[0]
        }
        this.categoryService.setGame(this.chosenGame);
      }
    )
  }

  setGame(game: GameDTO) {
    this.categoryService.setGame(game);
    this.chosenGame = game;
  }

  public checkPath() {
    return this.router.url === '/home-page';
  }

  public declineFriendRequest(index,requestId:number){
    this.userService.declineFriendRequest(requestId).subscribe(()=>{
      this.friendRequests.splice(index, 1);
      this.friendRequestsNumber -= 1;

    })

  }

  public acceptFriendRequest(index,requestId:number){
    this.userService.acceptFriendRequest(requestId).subscribe((data:any)=>{
      this.friendRequests.splice(index, 1);
      this.friendRequestsNumber -= 1;
    })
  }

}
