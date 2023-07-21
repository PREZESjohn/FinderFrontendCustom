import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {UserService} from "../../../services/user.service";
import {loadUser} from "./user.action";
import * as UserActions from "./user.action"
import {
  catchError,
  combineLatestAll,
  concat,
  concatAll,
  concatMap,
  map,
  mergeAll,
  Observable,
  of,
  switchMap,
  tap
} from "rxjs";
import {UserStateDTO} from "./user.model";
import {User} from "../../../domain/User";

@Injectable()
export class UserEffects{
  public picture = null;
  userStateModel:UserStateDTO;
  constructor(private actions$: Actions, private userService: UserService) {
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
  )
  init$ = createEffect(
    () => this.actions$.pipe(tap((action) => console.log(action))),
    { dispatch: false }
  );
}
