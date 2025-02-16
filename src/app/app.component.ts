import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

import {MiniHeaderComponent} from './components/mini-header/mini-header.component';
import { Title } from '@angular/platform-browser';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NgIf} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {PlatformService} from './services/platform.service';

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

  constructor(private titleService: Title, private router: Router,    private platformService: PlatformService,
              private translate: TranslateService) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showFooter = event.url !== '/game' &&  event.url !== '/multiplayer';
      }
    });
    this.translate.setDefaultLang('es');
    const browserLang = this.translate.getBrowserLang() || 'es';
    this.translate.use(browserLang.match(/en|es/) ? browserLang : 'es');

  }
}
