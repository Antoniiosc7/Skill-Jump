import { Component } from '@angular/core';
import { TranslationService } from '../../services/translations.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentLang: string;

  constructor(private translationService: TranslationService) {
    this.currentLang = this.translationService.currentLang;
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translationService.changeLanguage(newLang);
    this.currentLang = newLang;
  }
}
