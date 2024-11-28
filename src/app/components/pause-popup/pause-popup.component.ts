import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pause-popup',
  standalone: true,
  imports: [],
  templateUrl: './pause-popup.component.html',
  styleUrl: './pause-popup.component.css'
})
export class PausePopupComponent {
  constructor(private router: Router, private dialogRef: MatDialogRef<PausePopupComponent>) {}

  closePopup() {
    this.dialogRef.close();
  }

  goToHome() {
    this.router.navigate(['/']);
    this.closePopup();
  }

  continue() {
    this.dialogRef.close('resume');
  }
}
