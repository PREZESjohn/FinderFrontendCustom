import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {CategoryService} from "../../../services/categoryService";
import {loadGames} from "./games.action";
import * as GamesActions from "./games.action"
import {catchError, map, of, switchMap, tap} from "rxjs";

@Injectable()
export class GamesEffects{
  constructor(private actions$: Actions, private categoryService: CategoryService) {
  }
  loadGames$=createEffect(()=>
    this.actions$.pipe(
      ofType(loadGames),
      switchMap(()=>
        this.categoryService.getGames().pipe(
          map((gameItems)=>GamesActions.loadGamesSucced({games: gameItems})),
          catchError((error)=> of(GamesActions.loadGamesFailed({error: error})))
        )
      )
    )
  )
  init$ = createEffect(
    () => this.actions$.pipe(tap((action) => console.log(action))),
    { dispatch: false }
  );
}
