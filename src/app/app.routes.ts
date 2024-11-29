import { Routes } from '@angular/router';
import {GameComponent} from './pixie/game/game.component';
import {HomeComponent} from './pages/home/home.component';
import {MultiplayerGameComponent} from './pixie/multiplayer-game/multiplayer-game.component';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {ArticleComponent} from './pages/home/article/article.component';
import {ProfileComponent} from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '',  component: HomeComponent },
  { path: 'game',  component: GameComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'multiplayer',  component: MultiplayerGameComponent },
  { path: 'profile', component: ProfileComponent }
];
