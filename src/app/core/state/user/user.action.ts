import {createAction, props} from "@ngrx/store";
import {UserStateDTO} from "src/app/core/state/user/user.model";

export const loadUser= createAction("[App] load current user")

export const loadUserSucced=createAction(
  "[Server] User load success",
  props<{user: UserStateDTO}>()
);
export const loadUserFailed=createAction(
  "[Server] User load failed",
  props<{error: string}>()
);
