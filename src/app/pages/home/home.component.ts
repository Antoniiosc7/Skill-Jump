import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { AuthService } from '../../services/auth.service';
import { NewsComponent } from './news/news.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    NgClass,
    NewsComponent,
  ],
  standalone: true,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router, private dialog: MatDialog, private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  navigateToGame() {
    if (!this.isLoggedIn) {
      const dialogRef = this.dialog.open(WarningDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['/game']);
        } else {
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/game']);
    }
  }

  navigateToTopScores(): void {
    this.router.navigate(['/top-scores']);
  }

  navigateToMultiplayer() {
    this.router.navigate(['/multiplayer']);
  }

  navigateToSkins() {
    this.router.navigate(['/skins']);
  }

  navigateToOnlineMultiplayer() {
    this.router.navigate(['/online-multiplayer']);
  }
}
