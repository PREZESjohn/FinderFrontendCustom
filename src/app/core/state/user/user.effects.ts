import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {UserService} from "../../../services/user.service";
import {loadUser} from "./user.action";
import * as UserActions from "./user.action"
import {catchError, map, of, switchMap, tap} from "rxjs";
import {UserStateDTO} from "./user.model";

@Injectable()
export class UserEffects{
  private picture: any;
  private userStateModel:UserStateDTO;
  constructor(private actions$: Actions, private userService: UserService) {
  }
  loadUser$=createEffect(()=>
    this.actions$.pipe(
      ofType(loadUser),
      switchMap(()=>
        this.userService.getUser().pipe(
          tap((user)=>{
            this.userService.getProfilePicture(user.id).subscribe((d: any) => {
              this.picture = this.userService.setProfilePicture(d);
            }, () => {
              this.picture = '../assets/img/default-avatar.png'
            })
            this.userStateModel=user;
            this.userStateModel.profilePicture=this.picture;
          }),
          map((user)=>UserActions.loadUserSucced({user: this.userStateModel})),
          catchError((error)=> of(UserActions.loadUserFailed({error: error})))
        )
      )
    )
  )
  init$ = createEffect(
    () => this.actions$.pipe(tap((action) => console.log(action))),
    { dispatch: false }
  );
}
