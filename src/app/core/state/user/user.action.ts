import {createAction, props} from "@ngrx/store";

import {User} from "../../../domain/User";

export const loadUser= createAction("[App] load current user")

export const loadUserSucced=createAction(
  "[Server] User load success",
  props<{user: User, photo:any}>()
);
export const loadUserFailed=createAction(
  "[Server] User load failed",
  props<{error: string}>()
);
