import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.checkToken()) {
      return true;
    }
    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: route.url, token:route.queryParamMap.get("token") }});
    return false;
  }
}
