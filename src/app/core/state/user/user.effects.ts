import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {UserService} from "../../../services/user.service";
import {loadUser, editUserDataSubmitted} from "./user.action";
import * as UserActions from "./user.action"
import {
  catchError,
  map,
  of,
  switchMap,
  tap
} from "rxjs";
import {UserStateDTO} from "./user.model";
import {User} from "../../../domain/User";
import {Router} from "@angular/router";
import {AlertService} from "../../../services/alert.service";
import {CodeErrors} from "../../../providers/CodeErrors";

@Injectable()
export class UserEffects{
  public picture = null;
  userStateModel:UserStateDTO;
  constructor(private actions$: Actions, private userService: UserService, private router: Router, private alertService: AlertService) {
  }
  loadUser$=createEffect(()=>
    this.actions$.pipe(
      ofType(loadUser),
      switchMap(()=>
        this.userService.getUser().pipe(
          switchMap((user)=>
            this.userService.getProfilePicture(user.id).pipe(
              map((photo:any)=>(UserActions.loadUserSucced({user: user,photo:this.userService.setProfilePicture(photo)}))),
              catchError((error)=> of(UserActions.loadUserFailed({error: error}))),
            ))
        )
      )
    )
  );
  editUser$=createEffect(()=>
    this.actions$.pipe(
      ofType(editUserDataSubmitted),
      switchMap((action)=>
        this.userService.editUser(action.user).pipe(
          tap(()=>{
            this.router.navigateByUrl('/user-profile');
            this.alertService.success('Data updated');}
          ),
          map(()=>
            UserActions.editUserDataSucced({user:action.user})
          ),
          catchError((error)=>{
            this.alertService.error(CodeErrors.get(error.error.code));
            return of(UserActions.editUserDataFailed({error: error}));
            }
          )
        )
      )
    )
  )
  init$ = createEffect(
    () => this.actions$.pipe(tap((action) => console.log(action))),
    { dispatch: false }
  );
}
