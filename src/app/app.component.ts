import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MiniHeaderComponent} from './components/mini-header/mini-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MiniHeaderComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gamev3';
}
