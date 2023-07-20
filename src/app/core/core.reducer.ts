import {ActionReducerMap, MetaReducer} from "@ngrx/store";
import {State} from "./core.state";
import * as GamesReducer from "./state/games/games.reducer"
import * as UserReducer from "./state/user/user.reducer"

export const reducers: ActionReducerMap<State>={
  games: GamesReducer.reducer,
  user: UserReducer.reducer,
}

export const metaReducers: MetaReducer<State>[]=[];
