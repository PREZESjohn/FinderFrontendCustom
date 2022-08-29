import {UserMsgDTO} from './dto/UserMsgDTO';
import {InGameRoles} from './dto/InGameRoles';

export class TakenInGameRole{
  public id:number;
  public user:UserMsgDTO;
  public inGameRole:InGameRoles;
}
