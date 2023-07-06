import {Component, OnChanges, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {GroupRoom} from "../../domain/GroupRoom";
import {Game} from "../../domain/Game";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CategoryService} from "../../services/categoryService";
import {Route, Router} from "@angular/router";
import {GameDTO} from "../../domain/dto/GameDTO";
import {AlertService} from "../../services/alert.service";

@Component({
  selector: 'app-manage-games',
  templateUrl: './manage-games.component.html',
  styleUrls: ['./manage-games.component.scss']
})
export class ManageGamesComponent implements OnInit{

  dataSource: MatTableDataSource<GameDTO>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns = ['id','name','groups']

  //06.07 wyswietlanie dostepnych gier. trzeba na backend dorobic kontroler i reszte do CRUD gier
  constructor(private categoryService:CategoryService, private alertService:AlertService ,private router:Router ) {
    this.categoryService.getGames().subscribe((data: any)=>{
      this.prepareDataSource(data);
    },
      ()=>{
        this.alertService.error("Cant load games")
      })
  }

  ngOnInit(): void {
  }
  prepareDataSource(data:any){
    this.dataSource = new MatTableDataSource<GameDTO>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item,property)=>{
      switch(property){
        case 'groups':return item.id;
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

}
