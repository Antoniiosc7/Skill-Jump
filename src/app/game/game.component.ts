import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import {GameOverComponent} from './game-over/game-over.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  standalone: true,
  imports: [
    GameOverComponent,
    NgIf
  ],
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;
  app!: PIXI.Application;
  player!: PIXI.Sprite;
  obstacles: PIXI.Sprite[] = [];
  gravity = 1;
  velocityY = 0;
  playerSpeed = 5;
  isJumping = false;
  isGameOver = false;
  cameraOffset = 0;
  score = 0;
  scoreText!: PIXI.Text;
  elapsedTime = 0;

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
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
      });

      this.gameContainer.nativeElement.appendChild(this.app.canvas);

      const texture = await PIXI.Assets.load('assets/bunny.png');
      this.createPlayer(texture);
      this.createObstacles();
      this.createScoreText();

      this.app.ticker.add(() => this.gameLoop());

      window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    } catch (error) {
      console.error('Error initializing PixiJS:', error);
    }
  }

  createPlayer(texture: PIXI.Texture) {
    this.player = new PIXI.Sprite(texture);
    this.player.x = 100;
    this.player.y = 500;
    this.player.anchor.set(0.5);
    this.player.width = 100;
    this.player.height = 100;

    this.app.stage.addChild(this.player);
  }

  createObstacles() {
    this.obstacles = [];
    for (let i = 0; i < 20; i++) {
      const obstacle = new PIXI.Sprite(PIXI.Texture.WHITE);
      obstacle.width = 50;
      obstacle.height = 50;
      obstacle.x = 400 + i * 300;
      obstacle.y = 550;
      obstacle.tint = 0xff0000;

      this.obstacles.push(obstacle);
      this.app.stage.addChild(obstacle);
    }
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
    if (event.code === 'Space' && !this.isJumping && !this.isGameOver) {
      this.velocityY = -15;
      this.isJumping = true;
    }

    if (event.code === 'Escape' && this.isGameOver) {
      this.restartGame();
    }
  }

  gameLoop() {
    if (this.isGameOver) return;

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

    return (
      hitbox1.x < bounds2.x + bounds2.width &&
      hitbox1.x + hitbox1.width > bounds2.x &&
      hitbox1.y < bounds2.y + bounds2.height &&
      hitbox1.y + hitbox1.height > bounds2.y
    );
  }

  gameOver() {
    this.isGameOver = true;
    console.log('Game Over!');
  }

  restartGame() {
    this.isGameOver = false;
    this.score = 0;
    this.elapsedTime = 0;
    this.cameraOffset = 0;

    this.app.stage.removeChildren();
    this.app.stage.x = 0;

    this.createScoreText();
    this.createObstacles();
    const texture = this.player.texture;
    this.createPlayer(texture);
  }

  onRestart() {
    this.restartGame();
  }

  onGoHome() {
    // Navigate to home
  }
}
