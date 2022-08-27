import {AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {GroupRoom} from '../../../../domain/GroupRoom';
import {GroupRoomService} from '../../../../services/group-room.service';
import {AlertService} from '../../../../services/alert.service';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {GroupChatLogsDialogComponent} from '../group-chat-logs-dialog/group-chat-logs-dialog.component';

@Component({
  selector: 'app-group-room-table',
  templateUrl: './group-room-table.component.html',
  styleUrls: ['./group-room-table.component.scss']
})
export class GroupRoomTableComponent implements OnInit,OnChanges{

  dataSource: MatTableDataSource<GroupRoom>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Input() deleted = false;
  public displayedColumns = ['id','name','Users', 'Open','groupLeader.name','game.name','category.name']

  constructor(private groupRoomService:GroupRoomService, private alertService:AlertService,private router:Router, private dialog:MatDialog) {
      this.groupRoomService.getGroups().subscribe((data: any) => {
         this.prepareDataSource(data);
        },
        () => {
          this.alertService.error("Cant load groups")
        })
  }

  ngOnChanges() {
    if(this.deleted){
      this.groupRoomService.getDeletedGroups().subscribe((data:any)=>{
        this.prepareDataSource(data);
      })
    }
  }

  ngOnInit(): void {
  }

  public showGroupDetails(row:any){
    this.router.navigate(["admin/group-room-details",row.id])
  }


  prepareDataSource(data:any){
    this.dataSource = new MatTableDataSource<GroupRoom>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item,property)=>{
      switch(property){
        case 'groupLeader.name':return item.groupLeader.name;
        case 'game.name':return item.game.name;
        case 'category.name':return item.category.name;
        default:return item[property];
      }
    }
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showGroupChatLogs(groupRoom){
    this.dialog.open(GroupChatLogsDialogComponent,{
      width:"40%",
      height:"40%",
      data:{
        id:groupRoom.id}
      }
    )
  }
}
