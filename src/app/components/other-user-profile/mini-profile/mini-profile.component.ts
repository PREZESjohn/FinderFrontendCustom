import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-mini-profile',
  templateUrl: './mini-profile.component.html',
  styleUrls: ['./mini-profile.component.scss']
})
export class MiniProfileComponent implements OnInit {

  private readonly dialogRef: MatDialogRef<MiniProfileComponent>;
  private readonly triggerElementRef: ElementRef;
  constructor(
    dialogRef: MatDialogRef<MiniProfileComponent>,
    @Inject(MAT_DIALOG_DATA) data: {trigger: ElementRef}) {
    this.dialogRef=dialogRef;
    this.triggerElementRef=data.trigger;
  }

  ngOnInit() {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    const rect = this.triggerElementRef.nativeElement.getBoundingClientRect();
    matDialogConfig.position = { left: `${rect.left}px`, top: `${rect.bottom - 50}px` };
    matDialogConfig.width = '300px';
    matDialogConfig.height = '400px';
    this.dialogRef.updateSize(matDialogConfig.width, matDialogConfig.height);
    this.dialogRef.updatePosition(matDialogConfig.position);
  }
  cancel(): void {
    this.dialogRef.close(null);
  }

}
