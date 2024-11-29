import { Component } from '@angular/core';
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatButton
  ],
  styleUrls: ['./warning-dialog.component.css']
})
export class WarningDialogComponent {
  constructor(public dialogRef: MatDialogRef<WarningDialogComponent>) {}

  onAccept(): void {
    this.dialogRef.close(true);
  }

  onLogin(): void {
    this.dialogRef.close(false);
  }
}
