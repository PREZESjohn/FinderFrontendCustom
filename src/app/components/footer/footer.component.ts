import { Component, OnInit } from '@angular/core';
import {TermComponent} from "../term/term.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor( private dialog: MatDialog) {}

  ngOnInit() {}

  openTerm() {
    const dialogRef = this.dialog.open(TermComponent, {
      closeOnNavigation: true,
      disableClose: false,
      width: '60%',
      height: '90%'
    })
  }
}
