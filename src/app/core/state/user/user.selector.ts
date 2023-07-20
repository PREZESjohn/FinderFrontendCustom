import {createFeatureSelector, createSelector, props} from "@ngrx/store";
import {UserState} from "./user.state";

export const selectUser=createFeatureSelector<UserState>("user");

export const selectUserItem=createSelector(selectUser,
  (state: UserState)=>state.user);

