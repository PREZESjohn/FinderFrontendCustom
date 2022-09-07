import {UserMsgDTO} from './dto/UserMsgDTO';

export class FriendRequest{
  public id:number;
  public sendingUser:UserMsgDTO;
  public invitedUser:UserMsgDTO;
}
