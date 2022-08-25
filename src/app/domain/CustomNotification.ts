import {GroupRoomNotifDTO} from './dto/GroupRoomNotifDTO';

export class CustomNotification {
  public id:number;
  public type:string;
  public msg:string;
  public groupRoom:GroupRoomNotifDTO;
  public removedUserId:number;
}
