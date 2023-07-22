import {Action, createReducer, on} from "@ngrx/store";
import {UserState, initialState} from "./user.state";
import {loadUser, loadUserFailed, loadUserSucced, editUserDataSucced, editUserDataFailed} from "./user.action";

const userReducer=createReducer(
  initialState,
  on(loadUser, (state)=>({
    ...state,
    status: 'loading',
  })),
  on(loadUserSucced, (state, {user, photo})=>({
    ...state,
    user: user,
    photo: photo,
    error: null,
    status: 'success',
  })),
  on(loadUserFailed, (state, {error})=>({
    ...state,
    error: error,
    status: "error",
  })),
  on(editUserDataSucced, (state, {user})=>({
    ...state,
    user:user,
    error: null,
    status: 'success',
  })),
  on(editUserDataFailed, (state, {error})=>({
    ...state,
    error: error,
    status: 'error',
  }))
)
export function reducer(state: UserState | undefined, action: Action){
  return userReducer(state,action);
}
