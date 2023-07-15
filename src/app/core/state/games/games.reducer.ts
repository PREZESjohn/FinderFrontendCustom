import {Action, createReducer, on} from "@ngrx/store";
import {GamesState, initialState} from "./games.state";
import {loadGames, loadGamesFailed, loadGamesSucced} from "./games.action";
import {state} from "@angular/animations";


const gamesReducer=createReducer(
  initialState,
  on(loadGames, (state)=>({
    ...state,
    status: 'loading',
  })),
  on(loadGamesSucced, (state, {games})=>({
    ...state,
    gamesItems: games,
    error: null,
    status: 'success',
  })),
  on(loadGamesFailed, (state, {error})=>({
    ...state,
    error: error,
    status: "error",
  }))
)
export function reducer(state: GamesState | undefined, action: Action){
  return gamesReducer(state,action);
}
