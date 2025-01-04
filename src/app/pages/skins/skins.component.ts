import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as PIXI from 'pixi.js';
import { ApiService } from '../../services/api.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-skins',
  templateUrl: './skins.component.html',
  styleUrls: ['./skins.component.css']
})
export class SkinsComponent implements AfterViewInit {
  @ViewChild('pixiContainer', { static: true }) pixiContainer!: ElementRef;
  skins = [
    { name: 'Biker', image: 'assets/idles/Biker_idle.png', frameWidth: 48, frameHeight: 48, frames: 4 },
    { name: 'Cyborg', image: 'assets/idles/Cyborg_idle.png', frameWidth: 48, frameHeight: 48, frames: 4 },
    { name: 'Punk', image: 'assets/idles/Punk_idle.png', frameWidth: 48, frameHeight: 48, frames: 4 }
  ];

  selectedSkinIndex = 0;
  app!: PIXI.Application;
  animatedSprite!: PIXI.AnimatedSprite;
  username!: any;
  constructor(private router: Router, private authService: AuthService, private apiService: ApiService) {}

  ngAfterViewInit() {
    this.initializePixi();
  }

  async initializePixi() {
    try {
      this.app = new PIXI.Application();
      await this.app.init({
        width: 256, // Aumentar el ancho
        height: 256, // Aumentar el alto
        backgroundColor: 0x1099bb,
      });

      this.pixiContainer.nativeElement.appendChild(this.app.canvas);
      this.loadSkin(this.selectedSkinIndex);

    } catch (error) {
      console.error('Error initializing PixiJS:', error);
    }
  }

  loadSkin(index: number) {
    const skin = this.skins[index];
    PIXI.Assets.load(skin.image).then((texture) => {
      const textures: PIXI.Texture[] = [];
      for (let i = 0; i < skin.frames; i++) {
        const frame = new PIXI.Rectangle(i * skin.frameWidth, 0, skin.frameWidth, skin.frameHeight);
        const frameTexture = new PIXI.Texture({ source: texture.source, frame });
        textures.push(frameTexture);
      }

      // Elimina el sprite anterior si existe
      if (this.animatedSprite) {
        this.app.stage.removeChild(this.animatedSprite);
        this.animatedSprite.destroy();
      }

      // Crea el nuevo sprite animado
      this.animatedSprite = new PIXI.AnimatedSprite(textures);
      this.animatedSprite.anchor.set(0.5); // Establece el punto de anclaje al centro
      this.animatedSprite.scale.set(2); // Escala para hacerlo más grande

      // Centra el sprite en el canvas
      this.animatedSprite.x = this.app.view.width / 2; // Centrado horizontal exacto
      this.animatedSprite.y = this.app.view.height / 2; // Centrado vertical exacto
      this.animatedSprite.animationSpeed = 0.1;
      this.animatedSprite.play();

      // Agrega el sprite al escenario
      this.app.stage.addChild(this.animatedSprite);
    });
  }



  previousSkin() {
    this.selectedSkinIndex = (this.selectedSkinIndex - 1 + this.skins.length) % this.skins.length;
    this.loadSkin(this.selectedSkinIndex);
  }

  nextSkin() {
    this.selectedSkinIndex = (this.selectedSkinIndex + 1) % this.skins.length;
    this.loadSkin(this.selectedSkinIndex);
  }

  confirmSelection() {
    const selectedSkin = this.skins[this.selectedSkinIndex].name;
    this.username = this.authService.getUsername();
    this.apiService.changeSelectedSkin(this.username, selectedSkin).subscribe(
      (response: string) => {
        console.log('Skin changed successfully:', response);
      },
      (error: any) => {
        console.error('Error changing skin:', error);
      }
    );
  }

  goBack() {
    this.router.navigate(['']); // Navega a la ruta principal o a la ruta deseada
  }

}
