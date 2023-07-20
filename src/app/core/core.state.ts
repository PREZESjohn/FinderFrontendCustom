import {GamesState} from "./state/games";
import {UserState} from "./state/user";

export interface State{
  games: GamesState;
  user: UserState;
}
