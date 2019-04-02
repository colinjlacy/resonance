import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

declare interface ConfirmationBoxData {
  action: string;
  message: string;
  positiveLabel?: string;
  negativeLabel?: string;
  hideCancel?: string;
  hideConfirm?: string;
}

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.css']
})
export class ConfirmationBoxComponent implements OnInit {
  
  positiveLabel: string;
  negativeLabel: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationBoxData, public dialogRef: MatDialogRef<ConfirmationBoxComponent>) { }

  ngOnInit() {
    this.positiveLabel = this.data.positiveLabel ? this.data.positiveLabel : `Yes`;
    this.negativeLabel = this.data.negativeLabel ? this.data.negativeLabel : `No, cancel`;
  }
  
  confirm() {
    this.dialogRef.close(true);
  }
  
  cancel() {
    this.dialogRef.close(false);
  }

}
