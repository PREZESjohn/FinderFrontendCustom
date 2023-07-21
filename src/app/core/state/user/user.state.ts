import {UserStateDTO} from "src/app/core/state/user/user.model";

export interface UserState{
  user: UserStateDTO;
  photo:any;
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}
export const initialState: UserState={
  user: null,
  photo: null,
  error: null,
  status: 'pending',
}
