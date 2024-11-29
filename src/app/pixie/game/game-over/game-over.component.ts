import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  standalone: true,
  styleUrls: ['./game-over.component.css']
})
export class GameOverComponent implements OnChanges {
  @Output() restart = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();
  @Input() score: number = 0;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['score'] && !changes['score'].isFirstChange()) {
      this.ngOnInit();
    }
  }

  ngOnInit() {
    console.log(this.score);
    console.log(this.authService.isLoggedIn());
    if (this.authService.isLoggedIn()) {
      const username = this.authService.getUsername();
      if (username) {
        this.apiService.postScore(username, this.score).subscribe(
          response => console.log('Score posted successfully'),
          error => console.error('Error posting score', error)
        );
      }
    }
  }

  onRestart() {
    this.restart.emit();
  }

  onGoHome() {
    this.goHome.emit();
  }
}
