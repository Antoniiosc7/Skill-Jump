import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { GameOverComponent } from './game-over/game-over.component';
import { PauseMenuComponent } from './pause-menu/pause-menu.component';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  standalone: true,
  imports: [
    GameOverComponent,
    PauseMenuComponent,
    NgIf
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializePixi();
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

      await this.createPlayer(); // Ensure createPlayer is awaited
      this.createGround();
      this.createObstacles();
      this.createScoreText();

      this.app.ticker.add(() => this.gameLoop());

      window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    } catch (error) {
      console.error('Error initializing PixiJS:', error);
    }
  }

  async createPlayer() {
    const spriteSheetTexture = await PIXI.Assets.load('assets/Biker_run.png');
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
    this.player.x = 100;
    this.player.y = 400;
    this.player.anchor.set(0.5);
    this.player.animationSpeed = 0.1; // Animation speed
    this.player.scale.set(1, 2  ); // Scale the player to be taller
    this.player.play(); // Start the animation

    this.app.stage.addChild(this.player);
  }

  createGround() {
    this.ground = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.ground.height = 50;
    this.ground.y = 575 ;
    this.ground.tint = 0x654321;
    this.updateGroundWidth();

    this.app.stage.addChild(this.ground);

    window.addEventListener('resize', () => this.updateGroundWidth());
  }

  updateGroundWidth() {
    this.ground.width = this.app.renderer.width;
  }

  async createObstacles() {
    this.obstacles = [];
    let xPosition = 400;
    for (let i = 0; i < 20; i++) {
      const obstacleTexture = await PIXI.Assets.load('assets/obstacle.png'); // Ensure the path is correct
      const obstacle = new PIXI.Sprite(obstacleTexture);
      obstacle.width = 50;
      obstacle.height = 50;
      obstacle.x = xPosition;
      obstacle.y = 550;

      this.obstacles.push(obstacle);
      this.app.stage.addChild(obstacle);

      // Randomize the distance to the next obstacle
      xPosition += 200 + Math.random() * 300;
    }
  }

  createScoreText() {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'white',
    });

    this.scoreText = new PIXI.Text('Score: 0', style);
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

  gameLoop() {
    if (this.isGameOver || this.isPaused) return;

    this.elapsedTime += this.app.ticker.deltaMS;
    this.score = Math.floor(this.elapsedTime / 100);
    this.scoreText.text = `Score: ${this.score}`;

    this.scoreText.x = this.cameraOffset + this.app.renderer.width - 20;

    this.velocityY += this.gravity;
    this.player.y += this.velocityY;

    if (this.player.y >= 550) {
      this.player.y = 550;
      this.velocityY = 0;
      this.isJumping = false;
    }

    this.player.x += this.playerSpeed;
    this.cameraOffset += this.playerSpeed;
    this.app.stage.x = -this.cameraOffset;

    for (const obstacle of this.obstacles) {
      if (this.checkCollision(this.player, obstacle)) {
        this.gameOver();
        return;
      }
    }
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

    this.createScoreText();
    this.createGround();
    this.createObstacles();
    this.createPlayer();
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
