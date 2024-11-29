import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import {PauseMenuComponent} from '../game/pause-menu/pause-menu.component';
import {GameOverComponent} from '../game/game-over/game-over.component';

@Component({
  selector: 'app-multiplayer-game',
  templateUrl: './multiplayer-game.component.html',
  standalone: true,
  imports: [
    NgIf,
    PauseMenuComponent,
    GameOverComponent
  ],
  styleUrls: ['./multiplayer-game.component.css']
})
export class MultiplayerGameComponent implements OnInit {
  @ViewChild('leftGameContainer', { static: true }) leftGameContainer!: ElementRef;
  @ViewChild('rightGameContainer', { static: true }) rightGameContainer!: ElementRef;
  leftApp!: PIXI.Application;
  rightApp!: PIXI.Application;
  leftPlayer!: PIXI.Sprite;
  rightPlayer!: PIXI.Sprite;
  leftObstacles: PIXI.Sprite[] = [];
  rightObstacles: PIXI.Sprite[] = [];
  gravity = 1;
  leftVelocityY = 0;
  rightVelocityY = 0;
  playerSpeed = 5;
  leftIsJumping = false;
  rightIsJumping = false;
  leftIsGameOver = false;
  rightIsGameOver = false;
  isPaused = false;
  leftCameraOffset = 0;
  rightCameraOffset = 0;
  leftScore = 0;
  rightScore = 0;
  leftScoreText!: PIXI.Text;
  rightScoreText!: PIXI.Text;
  elapsedTime = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializePixi();
  }

  async initializePixi() {
    if (!this.leftGameContainer || !this.rightGameContainer) {
      console.error('Game containers not found');
      return;
    }

    try {
  this.leftApp = new PIXI.Application();
  this.rightApp = new PIXI.Application();
  const halfWidth = window.innerWidth / 2;
  await this.leftApp.init({
    width: halfWidth-10,
    height: window.innerHeight-50,
    backgroundColor: 0x1099bb,
  });
  await this.rightApp.init({
    width: halfWidth-10,
    height: window.innerHeight-50,
    backgroundColor: 0x1099bb,
  });

      this.leftGameContainer.nativeElement.appendChild(this.leftApp.canvas);
      this.rightGameContainer.nativeElement.appendChild(this.rightApp.canvas);

      const texture = await PIXI.Assets.load('assets/bunny.png');
      this.createPlayer(texture, 'left');
      this.createPlayer(texture, 'right');
      this.createObstacles('left');
      this.createObstacles('right');
      this.createScoreText('left');
      this.createScoreText('right');

      this.leftApp.ticker.add(() => this.gameLoop('left'));
      this.rightApp.ticker.add(() => this.gameLoop('right'));

      window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    } catch (error) {
      console.error('Error initializing PixiJS:', error);
    }
  }

  createPlayer(texture: PIXI.Texture, side: 'left' | 'right') {
    const player = new PIXI.Sprite(texture);
    player.x = 100;
    player.y = 500;
    player.anchor.set(0.5);
    player.width = 100;
    player.height = 100;

    if (side === 'left') {
      this.leftPlayer = player;
      this.leftApp.stage.addChild(player);
    } else {
      this.rightPlayer = player;
      this.rightApp.stage.addChild(player);
    }
  }

  createObstacles(side: 'left' | 'right') {
    const obstacles = [];
    let xPosition = 400;
    for (let i = 0; i < 20; i++) {
      const obstacle = new PIXI.Sprite(PIXI.Texture.WHITE);
      obstacle.width = 50;
      obstacle.height = 50;
      obstacle.x = xPosition;
      obstacle.y = 550;
      obstacle.tint = 0xff0000;

      obstacles.push(obstacle);
      if (side === 'left') {
        this.leftApp.stage.addChild(obstacle);
      } else {
        this.rightApp.stage.addChild(obstacle);
      }

      xPosition += 200 + Math.random() * 300;
    }

    if (side === 'left') {
      this.leftObstacles = obstacles;
    } else {
      this.rightObstacles = obstacles;
    }
  }

  createScoreText(side: 'left' | 'right') {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'white',
    });

    const scoreText = new PIXI.Text({ text: 'Score: 0', style });
    scoreText.anchor.set(1, 0);
    scoreText.x = 380;
    scoreText.y = 20;

    if (side === 'left') {
      this.leftScoreText = scoreText;
      this.leftApp.stage.addChild(scoreText);
    } else {
      this.rightScoreText = scoreText;
      this.rightApp.stage.addChild(scoreText);
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space' && !this.leftIsJumping && !this.leftIsGameOver && !this.isPaused) {
      this.leftVelocityY = -15;
      this.leftIsJumping = true;
    }

    if (event.code === 'ArrowUp' && !this.rightIsJumping && !this.rightIsGameOver && !this.isPaused) {
      this.rightVelocityY = -15;
      this.rightIsJumping = true;
    }

    if (event.code === 'Escape') {
      if (this.leftIsGameOver || this.rightIsGameOver) {
        this.restartGame();
      } else {
        this.isPaused = !this.isPaused;
      }
    }
  }

  gameLoop(side: 'left' | 'right') {
    if (this.isPaused) return;

    this.elapsedTime += this.leftApp.ticker.deltaMS;
    if (side === 'left') {
      if (this.leftIsGameOver) return;
      this.leftScore = Math.floor(this.elapsedTime / 100);
      this.leftScoreText.text = `Score: ${this.leftScore}`;
      this.leftScoreText.x = this.leftCameraOffset + 380;

      this.leftVelocityY += this.gravity;
      this.leftPlayer.y += this.leftVelocityY;

      if (this.leftPlayer.y >= 550) {
        this.leftPlayer.y = 550;
        this.leftVelocityY = 0;
        this.leftIsJumping = false;
      }

      this.leftPlayer.x += this.playerSpeed;
      this.leftCameraOffset += this.playerSpeed;
      this.leftApp.stage.x = -this.leftCameraOffset;

      for (const obstacle of this.leftObstacles) {
        if (this.checkCollision(this.leftPlayer, obstacle)) {
          this.gameOver('left');
          return;
        }
      }
    } else {
      if (this.rightIsGameOver) return;
      this.rightScore = Math.floor(this.elapsedTime / 100);
      this.rightScoreText.text = `Score: ${this.rightScore}`;
      this.rightScoreText.x = this.rightCameraOffset + 380;

      this.rightVelocityY += this.gravity;
      this.rightPlayer.y += this.rightVelocityY;

      if (this.rightPlayer.y >= 550) {
        this.rightPlayer.y = 550;
        this.rightVelocityY = 0;
        this.rightIsJumping = false;
      }

      this.rightPlayer.x += this.playerSpeed;
      this.rightCameraOffset += this.playerSpeed;
      this.rightApp.stage.x = -this.rightCameraOffset;

      for (const obstacle of this.rightObstacles) {
        if (this.checkCollision(this.rightPlayer, obstacle)) {
          this.gameOver('right');
          return;
        }
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

  gameOver(side: 'left' | 'right') {
    if (side === 'left') {
      this.leftIsGameOver = true;
    } else {
      this.rightIsGameOver = true;
    }
    console.log('Game Over!');
  }

  restartGame() {
    this.leftIsGameOver = false;
    this.rightIsGameOver = false;
    this.isPaused = false;
    this.leftScore = 0;
    this.rightScore = 0;
    this.elapsedTime = 0;
    this.leftCameraOffset = 0;
    this.rightCameraOffset = 0;

    this.leftApp.stage.removeChildren();
    this.rightApp.stage.removeChildren();
    this.leftApp.stage.x = 0;
    this.rightApp.stage.x = 0;

    this.createScoreText('left');
    this.createScoreText('right');
    this.createObstacles('left');
    this.createObstacles('right');
    const texture = this.leftPlayer.texture;
    this.createPlayer(texture, 'left');
    this.createPlayer(texture, 'right');
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
