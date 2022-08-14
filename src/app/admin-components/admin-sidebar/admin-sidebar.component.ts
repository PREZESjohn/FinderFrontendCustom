import { Component, OnInit } from '@angular/core';
import {User} from '../../domain/User';
import {AuthService} from '../../services/auth.service';
import {Location} from '@angular/common';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [

  {
    path: '/admin-main-page',
    title: 'Admin Panel',
    rtlTitle: 'Admin Panel',
    icon: 'icon-chart-pie-36',
    class: ''
  },
  {
    path:'/manage-users',
    title: 'Manage users',
    rtlTitle: 'Manage users',
    icon: 'icon-chart-pie-36',
    class:''
  },
  {
    path:'/support',
    title: 'Support panel',
    rtlTitle: 'Support panel',
    icon: 'icon-chart-pie-36',
    class:''
  }
];

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  private listTitles: any[];
  profilePicture;
  public location
  public isOpen = false;
  menuItems: any[];
  public currentUser: User;
  public isAdmin = false;
  constructor(private authService: AuthService, location: Location,
              private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  this.checkIfAdmin();
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
}
