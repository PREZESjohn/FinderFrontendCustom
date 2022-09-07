import {UserMsgDTO} from './dto/UserMsgDTO';
import {Message} from './Message';

export class Friend{
  public id:number;
  public user:UserMsgDTO;
  public chat:Message[];
}
