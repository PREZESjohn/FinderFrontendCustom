import {User} from './User';

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
}
