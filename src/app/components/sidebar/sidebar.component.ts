import {Component, OnInit} from '@angular/core';
import {User} from '../../domain/User';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {CategoryService} from '../../services/categoryService';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

declare interface RouteInfo {
  path: string;
  title: string;
  rtlTitle: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [

  {
    path: '/dashboard',
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
export class SidebarComponent implements OnInit {

  menuItems: any[];
  public isCollapsed = true;
  public currentUser: User;
  public isAdmin = false;
  private listTitles: any[];
  public location
  public sidebarColor = 'blue';
  profilePicture=null;
  constructor( private authService: AuthService, location: Location,
               private userService: UserService, private router: Router,
               private sanitizer:DomSanitizer,
               private categoryService: CategoryService) { this.location = location;}

  ngOnInit() {
    this.checkIfAdmin()
    new dropdown();
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
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
    return 'Dashboard';
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
          const newImage = URL.createObjectURL(d);
          this.profilePicture = this.sanitizer.bypassSecurityTrustUrl(newImage)})
        if (this.currentUser?.role.name === "ROLE_ADMIN") {
          this.isAdmin = true;
        }
      }
    );
  }
}
