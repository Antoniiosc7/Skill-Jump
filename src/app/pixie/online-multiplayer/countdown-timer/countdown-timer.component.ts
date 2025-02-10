import { Component, Input, OnInit } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-countdown-timer',
  template: `
    <div *ngIf="countdown > 0" class="countdown-timer">
      Game starts in {{ countdown }} seconds
    </div>
  `,
  imports: [
    NgIf
  ],
  styles: [`
    .countdown-timer {
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
      margin-top: 20px;
    }
  `]
})
export class CountdownTimerComponent implements OnInit {
  @Input() countdown: number = 10;

  ngOnInit() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
}
