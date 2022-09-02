import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../domain/User';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {CategoryService} from '../../services/categoryService';

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [

  {
    path: '/home-page',
    title: 'Home',
    rtlTitle: 'Home',
    icon: 'icon-chart-pie-36',
    class: ''
  },
  {
    path:'/my-groups',
    title: 'My groups',
    rtlTitle: 'My groups',
    icon: 'icon-chart-pie-36',
    class:''
  },
  {
    path:'/user-profile',
    title: 'My profile',
    rtlTitle: 'My profile',
    icon: 'icon-chart-pie-36',
    class:''
  }
];

declare var dropdown:any
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit,OnDestroy {

  menuItems: any[];
  public currentUser: User;
  public isAdmin = false;
  private listTitles: any[];
  public location
  public isOpen = false;
  public games;
  public isDarkModeOn = true;
  profilePicture=null;
  private subscriptionName: Subscription;


  constructor( private authService: AuthService, location: Location,
               private userService: UserService, private router: Router, private categoryService:CategoryService) {
    this.location = location;
    this.subscriptionName = this.userService.observeProfilePictureChange().subscribe((data:any)=>{
      this.profilePicture = data;
    }
  )
  }

  ngOnInit() {
    this.checkIfAdmin()
    new dropdown();
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.loadGames();

  }
  ngOnDestroy() {
    this.subscriptionName.unsubscribe();
  }


  sidebarHide(){
    if(this.isOpen){
      this.isOpen = false;
    }
  }

  sidebarShow(){
    if(!this.isOpen){
      this.isOpen = true;
    }
  }

  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    // tslint:disable-next-line:prefer-for-of
    for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Explore';
  }
  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
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
        this.userService.getProfilePicture(data.id).subscribe((d:any)=>{
          this.profilePicture = this.userService.setProfilePicture(d);},()=>{
          this.profilePicture = 'assets/img/default-avatar.png'
        })
        if (this.currentUser?.role.name === "ROLE_ADMIN") {
          this.isAdmin = true;
        }
      }
    );
  }


  loadGames(){
    if(this.categoryService.getAllGames().length==0) {
      this.getGames()
    }else {
      this.games = this.categoryService.getAllGames();
    }
  }

  getGames(){
    this.categoryService.getGames().subscribe(
      data => {
        this.games = data;
        this.categoryService.setAllGames(data);
      }
    )
  }

  changeDashboardColor(color){
    const body = document.getElementsByTagName('body')[0];
    if (body && color === 'white-content') {
      body.classList.add(color);
    }
    else if(body.classList.contains('white-content')) {
      body.classList.remove('white-content');
    }
  }


  toggleMode(){
    if(this.isDarkModeOn){
      this.changeDashboardColor('white-content')
      this.isDarkModeOn = false;
    }else{
      this.changeDashboardColor('black-content')
      this.isDarkModeOn = true;
    }
  }

}
