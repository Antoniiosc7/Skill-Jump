import {Component, OnInit, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import * as PIXI from 'pixi.js';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import {PauseMenuComponent} from '../game/pause-menu/pause-menu.component';
import {GameOverComponent} from '../game/game-over/game-over.component';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-multiplayer-game',
  templateUrl: './multiplayer-game.component.html',
  standalone: true,
  imports: [
    NgIf,
    GameOverComponent,
    PauseMenuComponent
  ],
  styleUrls: ['./multiplayer-game.component.css']
})
export class MultiplayerGameComponent implements OnInit {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;
  @ViewChild(GameOverComponent) gameOverComponent!: GameOverComponent;
  appLeft!: PIXI.Application;
  appRight!: PIXI.Application;
  playerLeft!: PIXI.AnimatedSprite;
  playerRight!: PIXI.AnimatedSprite;
  groundLeft!: PIXI.Sprite;
  groundRight!: PIXI.Sprite;
  obstaclesLeft: PIXI.Sprite[] = [];
  obstaclesRight: PIXI.Sprite[] = [];
  groundTilesLeft: PIXI.TilingSprite | undefined;
  groundTilesRight: PIXI.TilingSprite | undefined;
  backgroundLeft: PIXI.TilingSprite | undefined;
  backgroundRight: PIXI.TilingSprite | undefined;
  gravity = 1;
  velocityYLeft = 0;
  velocityYRight = 0;
  playerSpeed = 5;
  isJumpingLeft = false;
  isJumpingRight = false;
  isGameOverLeft = false;
  isGameOverRight = false;
  isPaused = false;
  cameraOffset = 0;
  scoreLeft = 0;
  scoreRight = 0;
  scoreTextLeft!: PIXI.Text;
  scoreTextRight!: PIXI.Text;
  elapsedTimeLeft = 0;
  elapsedTimeRight = 0;
  username!: any;

  constructor(private router: Router, private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.initializePixi();
  }

  async initializePixi() {
    if (!this.gameContainer) {
      console.error('Game container not found');
      return;
    }

    try {
      this.appLeft = new PIXI.Application();
      this.appRight = new PIXI.Application();

      await this.appLeft.init({ width: window.innerWidth / 2 -10, height: window.innerHeight - 150, backgroundColor: 0x1099bb });
      await this.appRight.init({ width: window.innerWidth / 2 -10, height: window.innerHeight - 150, backgroundColor: 0x1099bb });

      this.gameContainer.nativeElement.appendChild(this.appLeft.canvas);
      this.gameContainer.nativeElement.appendChild(this.appRight.canvas);

      await this.createBackground(this.appLeft, 'left');
      await this.createBackground(this.appRight, 'right');
      await this.createGround(this.appLeft, 'left');
      await this.createGround(this.appRight, 'right');
      await this.createPlayer(this.appLeft, 'left');
      await this.createPlayer(this.appRight, 'right');

      this.createObstacles(this.appLeft, 'left');
      this.createObstacles(this.appRight, 'right');
      this.createScoreText(this.appLeft, 'left');
      this.createScoreText(this.appRight, 'right');

      this.appLeft.ticker.add(() => this.gameLoop(this.appLeft, 'left'));
      this.appRight.ticker.add(() => this.gameLoop(this.appRight, 'right'));

      window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    } catch (error) {
      console.error('Error initializing PixiJS:', error);
    }
  }

  async createPlayer(app: PIXI.Application, side: 'left' | 'right') {
    const skin = side === 'left' ? 'Biker' : 'Punk';

    const spriteSheetTexture = await PIXI.Assets.load(`assets/runs/${skin}_run.png`);
    const frameWidth = 48;
    const frameHeight = 48;
    const totalFrames = 6;

    const source = spriteSheetTexture.source;
    const textures: PIXI.Texture[] = [];

    for (let i = 0; i < totalFrames; i++) {
      const rectangle = new PIXI.Rectangle(i * frameWidth, 0, frameWidth, frameHeight);
      const subTexture = new PIXI.Texture({ source, frame: rectangle });
      textures.push(subTexture);
    }

    const player = new PIXI.AnimatedSprite(textures);
    player.x = app.screen.width / 2;
    player.y = app.screen.height / 2;
    player.anchor.set(0.5);
    player.animationSpeed = 0.1;
    player.scale.set(1, 2);
    player.play();

    app.stage.addChild(player);

    if (side === 'left') {
      this.playerLeft = player;
    } else {
      this.playerRight = player;
     }
  }

  async createBackground(app: PIXI.Application, side: 'left' | 'right') {
    const texture = await PIXI.Assets.load('assets/urbano.webp');
    const background = new PIXI.TilingSprite({ texture, width: app.screen.width, height: app.screen.height });
    background.y = -240;
    app.stage.addChild(background);

    if (side === 'left') {
      this.backgroundLeft = background;
    } else {
      this.backgroundRight = background;
    }
  }

  async createGround(app: PIXI.Application, side: 'left' | 'right') {
    const texture = await PIXI.Assets.load('assets/suelo.png');
    const groundTiles = new PIXI.TilingSprite({ texture, width: app.screen.width, height: app.screen.height });
    groundTiles.y = 598;
    app.stage.addChild(groundTiles);

    if (side === 'left') {
      this.groundTilesLeft = groundTiles;
    } else {
      this.groundTilesRight = groundTiles;
    }
  }

  async createObstacles(app: PIXI.Application, side: 'left' | 'right') {
    const obstacles: PIXI.Sprite[] = [];
    let xPosition = 1900;
    for (let i = 0; i < 20; i++) {
      const obstacleTexture = await PIXI.Assets.load('assets/obstacle.png');
      const obstacle = new PIXI.Sprite(obstacleTexture);
      obstacle.width = 50;
      obstacle.height = 50;
      obstacle.x = xPosition;
      obstacle.y = 550;

      obstacles.push(obstacle);
      app.stage.addChild(obstacle);
      xPosition += 200 + Math.random() * 300;
    }

    if (side === 'left') {
      this.obstaclesLeft = obstacles;
    } else {
      this.obstaclesRight = obstacles;
    }
  }

  createScoreText(app: PIXI.Application, side: 'left' | 'right') {
    const style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 'white',
    });

    const scoreText = new PIXI.Text({ text: 'Score: 0', style });
    scoreText.anchor.set(1, 0);
    scoreText.x = app.renderer.width - 20;
    scoreText.y = 20;

    app.stage.addChild(scoreText);

    if (side === 'left') {
      this.scoreTextLeft = scoreText;
    } else {
      this.scoreTextRight = scoreText;
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space' && !this.isJumpingLeft && !this.isGameOverLeft && !this.isPaused) {
      this.velocityYLeft = -15;
      this.isJumpingLeft = true;
    }

    if (event.code === 'ArrowUp' && !this.isJumpingRight && !this.isGameOverRight && !this.isPaused) {
      this.velocityYRight = -15;
      this.isJumpingRight = true;
    }

    if (event.code === 'Escape') {
      if (this.isGameOverLeft || this.isGameOverRight) {
        this.restartGame();
      } else {
        this.isPaused = !this.isPaused;
      }
    }
  }

  gameLoop(app: PIXI.Application, side: 'left' | 'right') {
    if (this.isGameOverLeft || this.isGameOverRight || this.isPaused) return;

    if (side === 'left') {
      this.elapsedTimeLeft += app.ticker.deltaMS;
      this.scoreLeft = Math.floor(this.elapsedTimeLeft / 100);
      this.scoreTextLeft.text = `Score: ${this.scoreLeft}`;

      this.velocityYLeft += this.gravity;
      this.playerLeft.y += this.velocityYLeft;

      if (this.playerLeft.y >= 550) {
        this.playerLeft.y = 550;
        this.velocityYLeft = 0;
        this.isJumpingLeft = false;
      }

      if (this.backgroundLeft) {
        this.backgroundLeft.tilePosition.x -= this.playerSpeed * 0.5;
      }

      if (this.groundTilesLeft) {
        this.groundTilesLeft.tilePosition.x -= this.playerSpeed;
      }

      for (const obstacle of this.obstaclesLeft) {
        obstacle.x -= this.playerSpeed;

        if (this.checkCollision(this.playerLeft, obstacle)) {
          this.gameOver('right');
          return;
        }
      }

      const lastObstacle = this.obstaclesLeft[this.obstaclesLeft.length - 1];
      if (lastObstacle && lastObstacle.x < app.renderer.width - this.cameraOffset) {
        const xPosition = app.renderer.width + Math.random() * 300;
        this.addObstacle(app, xPosition, 'left');
      }

      this.scoreTextLeft.x = app.renderer.width - 20;
    } else {
      this.elapsedTimeRight += app.ticker.deltaMS;
      this.scoreRight = Math.floor(this.elapsedTimeRight / 100);
      this.scoreTextRight.text = `Score: ${this.scoreRight}`;

      this.velocityYRight += this.gravity;
      this.playerRight.y += this.velocityYRight;

      if (this.playerRight.y >= 550) {
        this.playerRight.y = 550;
        this.velocityYRight = 0;
        this.isJumpingRight = false;
      }

      if (this.backgroundRight) {
        this.backgroundRight.tilePosition.x -= this.playerSpeed * 0.5;
      }

      if (this.groundTilesRight) {
        this.groundTilesRight.tilePosition.x -= this.playerSpeed;
      }

      for (const obstacle of this.obstaclesRight) {
        obstacle.x -= this.playerSpeed;

        if (this.checkCollision(this.playerRight, obstacle)) {
          this.gameOver('left');
          return;
        }
      }

      const lastObstacle = this.obstaclesRight[this.obstaclesRight.length - 1];
      if (lastObstacle && lastObstacle.x < app.renderer.width - this.cameraOffset) {
        const xPosition = app.renderer.width + Math.random() * 300;
        this.addObstacle(app, xPosition, 'right');
      }

      this.scoreTextRight.x = app.renderer.width - 20;
    }
  }

  async addObstacle(app: PIXI.Application, xPosition: number, side: 'left' | 'right') {
    const obstacleTexture = await PIXI.Assets.load('assets/obstacle.png');
    const obstacle = new PIXI.Sprite(obstacleTexture);
    obstacle.width = 50;
    obstacle.height = 50;
    obstacle.x = xPosition;
    obstacle.y = 550;

    if (side === 'left') {
      this.obstaclesLeft.push(obstacle);
    } else {
      this.obstaclesRight.push(obstacle);
    }

    app.stage.addChild(obstacle);
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
      x: bounds2.x + bounds2.width * 0.1,
      y: bounds2.y + bounds2.height * 0.1,
      width: bounds2.width * 0.8,
      height: bounds2.height * 0.8
    };

    return (
      hitbox1.x < hitbox2.x + hitbox2.width &&
      hitbox1.x + hitbox1.width > hitbox2.x &&
      hitbox1.y < hitbox2.y + hitbox2.height &&
      hitbox1.y + hitbox1.height > hitbox2.y
    );
  }

  gameOver(winner: 'left' | 'right') {
    if (winner === 'left') {
      this.isGameOverRight = true;
    } else {
      this.isGameOverLeft = true;
    }
    console.log(`Game Over! ${winner} player wins!`);
  }

  restartGame() {
    this.isGameOverLeft = false;
    this.isGameOverRight = false;
    this.isPaused = false;
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.elapsedTimeLeft = 0;
    this.elapsedTimeRight = 0;
    this.cameraOffset = 0;

    this.appLeft.stage.removeChildren();
    this.appRight.stage.removeChildren();
    this.appLeft.stage.x = 0;
    this.appRight.stage.x = 0;

    this.createBackground(this.appLeft, 'left');
    this.createBackground(this.appRight, 'right');
    this.createGround(this.appLeft, 'left');
    this.createGround(this.appRight, 'right');
    this.createObstacles(this.appLeft, 'left');
    this.createObstacles(this.appRight, 'right');
    this.createPlayer(this.appLeft, 'left');
    this.createPlayer(this.appRight, 'right');
    this.createScoreText(this.appLeft, 'left');
    this.createScoreText(this.appRight, 'right');
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
