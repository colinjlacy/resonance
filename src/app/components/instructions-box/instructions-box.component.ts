import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-instructions-box',
  templateUrl: './instructions-box.component.html',
  styleUrls: ['./instructions-box.component.scss']
})
export class InstructionsBoxComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<InstructionsBoxComponent>) { }
  
  ngOnInit() {
  }
  
  cancel() {
    this.dialogRef.close(true);
  }

}
