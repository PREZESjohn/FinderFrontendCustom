import {createAction, props} from "@ngrx/store";
import {GameDTO} from "../../../domain/dto/GameDTO";

export const loadGames= createAction("[App] load Games")

export const loadGamesSucced=createAction(
  "[Server] Games load success",
  props<{games: GameDTO[]}>()
);
export const loadGamesFailed=createAction(
  "[Server] Games load failed",
  props<{error: string}>()
);
