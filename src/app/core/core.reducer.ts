import {ActionReducerMap, MetaReducer} from "@ngrx/store";
import {State} from "./core.state";
import * as GamesReducer from "./state/games/games.reducer"

export const reducers: ActionReducerMap<State>={
  games: GamesReducer.reducer,
}

export const metaReducers: MetaReducer<State>[]=[];
