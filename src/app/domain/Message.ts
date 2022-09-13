import {User} from './User';
import {MessageStatus} from './MessageStatus';

export class Message {
  public id:number;
  public text:string;
  public user:User;
  public groupId:number;
  public date:string;
  public time:string;
  public connectedUsers:number[];
  public negative:boolean;
  public type:string;
  public statuses:MessageStatus[];
}
