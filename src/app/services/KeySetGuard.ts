import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {ControlHelperService} from './control-helper.service';

@Injectable({providedIn: 'root'})
export class KeySetGuard implements CanActivate {

  constructor(private controlHelperService: ControlHelperService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.controlHelperService.isKeyPasswordSet()
  }
}
