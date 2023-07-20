import {UserStateDTO} from "src/app/core/state/user/user.model";

export interface UserState{
  user: UserStateDTO;
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}
export const initialState: UserState={
  user: null,
  error: null,
  status: 'pending',
}
