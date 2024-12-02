import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

import {MiniHeaderComponent} from './components/mini-header/mini-header.component';
import { Title } from '@angular/platform-browser';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MiniHeaderComponent, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Skill Jump';
  showFooter = true;

  constructor(private titleService: Title, private router: Router) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showFooter = event.url !== '/game' &&  event.url !== '/multiplayer';
      }
    });
  }
}
