import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ControlHelperService {

  constructor(private router: Router,
              private authService: AuthService) {
  }

  isKeyPasswordSet(): boolean {
    if (this.authService.getPasswordKeyStorage() !== null && this.authService.getPasswordKeyStorage() === 'true') {
      return true;
    }

    this.router.navigateByUrl('/key-set');
    return false;
  }
}
