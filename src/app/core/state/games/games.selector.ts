import {createFeatureSelector, createSelector, props} from "@ngrx/store";
import {GamesState} from "./games.state";

export const selectGames=createFeatureSelector<GamesState>("games");

export const selectGamesItems=createSelector(selectGames,
  (state: GamesState)=>state.gamesItems);

export const selectGameItem=(props:{id: number})=>createSelector(selectGamesItems,
  (gameItems)=>gameItems.find((gameItem)=>gameItem.id===props.id)
);
