import { Routes } from '@angular/router';
import {GameComponent} from './game/game.component';
import {HomeComponent} from './home/home.component';
import {MultiplayerGameComponent} from './multiplayer-game/multiplayer-game.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {ArticleComponent} from './home/article/article.component';

export const routes: Routes = [
  { path: '',  component: HomeComponent },
  { path: 'game',  component: GameComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'multiplayer',  component: MultiplayerGameComponent },
];
