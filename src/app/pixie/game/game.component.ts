import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { GameOverComponent } from './game-over/game-over.component';
import { PauseMenuComponent } from './pause-menu/pause-menu.component';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import {ScreenTooSmallComponent} from './screen-too-small/screen-too-small.component';
import { ConstantesUtil } from '../../../constantes.util';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  imports: [
    GameOverComponent,
    PauseMenuComponent,
    NgIf,
    ScreenTooSmallComponent
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;
  @ViewChild(GameOverComponent) gameOverComponent!: GameOverComponent;
  app!: PIXI.Application;
  player!: PIXI.AnimatedSprite;
  ground!: PIXI.Sprite;
  obstacles: PIXI.Sprite[] = [];
  groundTiles: PIXI.TilingSprite | undefined;
  background: PIXI.TilingSprite | undefined;
  gravity = 1;
  velocityY = 0;
  playerSpeed = 5; // Slower speed
  isJumping = false;
  isGameOver = false;
  isPaused = false;
  cameraOffset = 0;
  score = 0;
  scoreText!: PIXI.Text;
  elapsedTime = 0;
  username!: any;
  isScreenTooSmall = false;

  constructor(private router: Router, private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.initializePixi();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  async initializePixi() {
    if (!this.gameContainer) {
      console.error('Game container not found');
      return;
    }

    try {
      this.app = new PIXI.Application();
      await this.app.init({
        width: window.innerWidth - 2,
        height: window.innerHeight - 120,
        backgroundColor: 0x1099bb,
      });

      this.gameContainer.nativeElement.appendChild(this.app.canvas);
      await this.createBackground();
      await this.createGround();
      await this.createPlayer(); // Ensure createPlayer is awaited


      this.createObstacles();
      this.createScoreText();

      this.app.ticker.add(() => this.gameLoop());

      window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    } catch (error) {
      console.error('Error initializing PixiJS:', error);
    }
  }

  onResize() {
    if (this.app) {
      this.app.renderer.resize(window.innerWidth - 2, window.innerHeight - 120);
      if (window.innerHeight < 725) {
        this.isScreenTooSmall = true;
      }

      if (this.background) {
        this.background.width = this.app.screen.width;
        this.background.height = this.app.screen.height;
      }
      if (this.groundTiles) {
        this.groundTiles.width = this.app.screen.width;
      }
      if (this.scoreText) {
        this.scoreText.x = this.app.renderer.width - 20;
      }
      if (this.player) {
        this.player.x = this.app.screen.width / 2;
        this.player.y = 550; // Adjust this value to match the height of the obstacles
      }
      for (const obstacle of this.obstacles) {
        obstacle.y = 550; // Adjust this value to match the height of the obstacles
      }
    }
  }

  async createPlayer() {
    this.username = this.authService.getUsername();
    const skin = this.username ? await this.apiService.getSelectedSkin(this.username).toPromise() : 'Biker';

    const spriteSheetTexture = await PIXI.Assets.load(`assets/runs/${skin}_run.png`);
    const frameWidth = 48; // Adjust according to the size of the frames in the sprite sheet
    const frameHeight = 48; // Adjust according to the size of the frames
    const totalFrames = 6; // Number of frames in the sprite sheet

    const source = spriteSheetTexture.source; // Use source instead of baseTexture
    const textures: PIXI.Texture[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const rectangle = new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
      const subTexture = new PIXI.Texture({ source, frame: rectangle }); // Create a subtexture
      textures.push(subTexture);
    }

    this.player = new PIXI.AnimatedSprite(textures);
    this.player.x = this.app.screen.width / 2;
    this.player.y = this.app.screen.height / 2;
    this.player.anchor.set(0.5);
    this.player.animationSpeed = 0.1; // Animation speed
    this.player.scale.set(1, 2); // Scale the player to be taller
    this.player.play(); // Start the animation

    this.app.stage.addChild(this.player);
  }
  updateGroundWidth() {
    this.ground.width = this.app.renderer.width;
  }


  async createObstacles() {
    this.obstacles = [];
    let xPosition = 1900;
    for (let i = 0; i < 20; i++) {
      await this.addObstacle(xPosition);
      xPosition += ConstantesUtil.MIN_OBSTACLE_DISTANCE + Math.random() * 300;
    }
  }

  async addObstacle(xPosition: number) {
    const obstacleTexture = await PIXI.Assets.load('assets/obstacle.png');
    const obstacle = new PIXI.Sprite(obstacleTexture);
    obstacle.width = 50;
    obstacle.height = 50;
    obstacle.x = xPosition;
    obstacle.y = 550;

    // Ensure the new obstacle is not too close to the previous one
    if (this.obstacles.length > 0) {
      const lastObstacle = this.obstacles[this.obstacles.length - 1];
      if (xPosition - lastObstacle.x < ConstantesUtil.MIN_OBSTACLE_DISTANCE) {
        obstacle.x = lastObstacle.x + ConstantesUtil.MIN_OBSTACLE_DISTANCE;
      }
    }

    this.obstacles.push(obstacle);
    this.app.stage.addChild(obstacle);
  }

  createScoreText() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'white',
    });

    this.scoreText = new PIXI.Text({ text: 'Score: 0', style });
    this.scoreText.anchor.set(1, 0);
    this.scoreText.x = this.app.renderer.width - 20;
    this.scoreText.y = 20;

    this.app.stage.addChild(this.scoreText);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space' && !this.isJumping && !this.isGameOver && !this.isPaused) {
      this.velocityY = -15;
      this.isJumping = true;
    }

    if (event.code === 'Escape') {
      if (this.isGameOver) {
        this.restartGame();
      } else {
        this.isPaused = !this.isPaused;
      }
    }
  }

  async createBackground() {
    const texture = await PIXI.Assets.load('assets/urbano.webp');
    this.background = new PIXI.TilingSprite({ texture, width: this.app.screen.width, height: this.app.screen.height });
    this.background.zIndex = 0; // Ensure background is at the lowest z-index
    this.app.stage.addChild(this.background);
  }

  async createGround() {
    const texture = await PIXI.Assets.load('assets/suelo.png');
    this.groundTiles = new PIXI.TilingSprite({ texture, width: this.app.screen.width, height: this.app.screen.height });
    this.groundTiles.y = 598;
    this.app.stage.addChild(this.groundTiles);
  }

  gameLoop() {
    if (this.isGameOver || this.isPaused || this.isScreenTooSmall) return;

    this.elapsedTime += this.app.ticker.deltaMS;
    this.score = Math.floor(this.elapsedTime / 100);
    this.scoreText.text = `Score: ${this.score}`;

    // Gravedad y salto del jugador
    this.velocityY += this.gravity;
    this.player.y += this.velocityY;

    if (this.player.y >= 550) {
      this.player.y = 550;
      this.velocityY = 0;
      this.isJumping = false;
    }

    // Movimiento del fondo
    if (this.background) {
      this.background.tilePosition.x -= this.playerSpeed * 0.5; // Desplaza el fondo hacia la izquierda
    }

    // Movimiento del suelo
    if (this.groundTiles) {
      this.groundTiles.tilePosition.x -= this.playerSpeed; // Desplaza el suelo hacia la izquierda
    }

    // Movimiento de los obstáculos
    for (const obstacle of this.obstacles) {
      obstacle.x -= this.playerSpeed; // Desplaza los obstáculos hacia la izquierda

      // Comprobación de colisión entre el jugador y los obstáculos
      if (this.checkCollision(this.player, obstacle)) {
        this.gameOver();
        return;
      }
    }

    // Generar nuevos obstáculos cuando el último sale de la pantalla
    const lastObstacle = this.obstacles[this.obstacles.length - 1];
    if (lastObstacle && lastObstacle.x < this.app.renderer.width - this.cameraOffset) {
      const xPosition = this.app.renderer.width + Math.random() * 300; // Posición fuera de la pantalla
      this.addObstacle(xPosition);
    }

    // Mantener la posición del texto de puntuación fija
    this.scoreText.x = this.app.renderer.width - 20;
  }

  onAcknowledgeScreenTooSmall() {
    this.isScreenTooSmall = false;
  }

  checkCollision(sprite1: PIXI.Sprite, sprite2: PIXI.Sprite): boolean {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();

    const hitbox1 = {
      x: bounds1.x + bounds1.width * 0.25,
      y: bounds1.y + bounds1.height * 0.25,
      width: bounds1.width * 0.5,
      height: bounds1.height * 0.5
    };

    const hitbox2 = {
      x: bounds2.x + bounds2.width * 0.1, // Reduce the width of the hitbox
      y: bounds2.y + bounds2.height * 0.1, // Reduce the height of the hitbox
      width: bounds2.width * 0.8, // Reduce the width of the hitbox
      height: bounds2.height * 0.8 // Reduce the height of the hitbox
    };

    return (
      hitbox1.x < hitbox2.x + hitbox2.width &&
      hitbox1.x + hitbox1.width > hitbox2.x &&
      hitbox1.y < hitbox2.y + hitbox2.height &&
      hitbox1.y + hitbox1.height > hitbox2.y
    );
  }

  gameOver() {
    this.isGameOver = true;
    console.log('Game Over!');
  }

  restartGame() {
    this.isGameOver = false;
    this.isPaused = false;
    this.score = 0;
    this.elapsedTime = 0;
    this.cameraOffset = 0;

    this.app.stage.removeChildren();
    this.app.stage.x = 0;

    this.createBackground();
    this.createGround();
    this.createObstacles();
    this.createPlayer();
    this.createScoreText(); // Ensure scoreText is created last
  }

  onRestart() {
    this.restartGame();
  }

  onContinue() {
    this.isPaused = false;
  }

  onGoHome() {
    this.router.navigate(['']);
  }
}
