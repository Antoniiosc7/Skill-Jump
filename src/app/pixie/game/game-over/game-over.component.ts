import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  standalone: true,
  styleUrls: ['./game-over.component.css']
})
export class GameOverComponent {
  @Output() restart = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  onRestart() {
    this.restart.emit();
  }

  onGoHome() {
    this.goHome.emit();
  }
}
