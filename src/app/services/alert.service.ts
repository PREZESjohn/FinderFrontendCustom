import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<any>();
  private source = null;
  private keepAfterRouteChange = false;

  constructor(private router: Router,private authService:AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.clear();
        }
      }
    });
  }

  getSource(){
    if(this.source == null){
      this.source = new EventSource('http://localhost:8080/api/v1/notify/test?token=' + this.authService.getToken());
      return this.source;
    }else {
      return this.source;
    }
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'success', text: message });
    window.setTimeout(()=> {
      this.clear()},5000);
  }

  error(message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'error', text: message });
    window.setTimeout(()=> {
      this.clear()},5000);
  }

  clear() {
    // @ts-ignore
    this.subject.next();
  }
}
