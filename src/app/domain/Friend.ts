import {UserMsgDTO} from './dto/UserMsgDTO';
import {Chat} from './Chat';

export class Friend{
  public id:number;
  public user:UserMsgDTO;
  public chat:Chat;
}
