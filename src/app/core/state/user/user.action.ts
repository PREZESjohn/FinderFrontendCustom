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
export const editUserDataSubmitted = createAction(
  "[App user-profile] Edit user data submitted",
  props<{user: User}>()
);
export const editUserDataSucced = createAction(
  "[App user-profile] Edit user data succed",
  props<{user: User}>()
);
export const editUserDataFailed = createAction(
  "[App user-profile] Edit user data failed",
  props<{error: any}>()
);
