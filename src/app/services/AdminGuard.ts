import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.checkIfAdmin()) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: route.url }});
    return false;
  }
}

