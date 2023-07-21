import {Action, createReducer, on} from "@ngrx/store";
import {UserState, initialState} from "./user.state";
import {loadUser, loadUserFailed, loadUserSucced} from "./user.action";

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
  }))
)
export function reducer(state: UserState | undefined, action: Action){
  return userReducer(state,action);
}
