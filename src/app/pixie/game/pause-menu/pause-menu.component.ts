import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pause-menu',
  templateUrl: './pause-menu.component.html',
  standalone: true,
  styleUrls: ['./pause-menu.component.css']
})
export class PauseMenuComponent {
  @Output() restart = new EventEmitter<void>();
  @Output() continue = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  onRestart() {
    this.restart.emit();
  }

  onContinue() {
    this.continue.emit();
  }

  onGoHome() {
    this.goHome.emit();
  }
}
