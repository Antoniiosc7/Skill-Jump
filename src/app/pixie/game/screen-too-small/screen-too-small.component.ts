import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-screen-too-small',
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 class="text-3xl font-bold text-yellow-600 mb-4">Screen Too Small</h2>
        <p>The minimum height must be 1000 px. Please resize the window.</p>
        <button (click)="onAcknowledge()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">OK</button>
      </div>
    </div>
  `,
  styles: [`
    .popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      z-index: 1000;
    }
  `]
})
export class ScreenTooSmallComponent {
  @Output() acknowledge = new EventEmitter<void>();

  onAcknowledge() {
    this.acknowledge.emit();
  }
}
