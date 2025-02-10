import { Routes } from '@angular/router';
import { GameComponent } from './pixie/game/game.component';
import { HomeComponent } from './pages/home/home.component';
import { MultiplayerGameComponent } from './pixie/multiplayer-game/multiplayer-game.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ArticleComponent } from './pages/home/article/article.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TopScoresComponent } from './pages/top-scores/top-scores.component';
import { SkinsComponent } from './pages/skins/skins.component';
import { OnlineMultiplayerComponent } from './pixie/online-multiplayer/online-multiplayer.component';
import { RoomManagerComponent } from './pixie/online-multiplayer/room-manager/room-manager.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'multiplayer', component: MultiplayerGameComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:idUsuario', component: ProfileComponent },
  { path: 'top-scores', component: TopScoresComponent, canActivate: [AuthGuard] },
  { path: 'skins', component: SkinsComponent, canActivate: [AuthGuard] },
  /*
  { path: 'online-multiplayer', component: RoomManagerComponent, canActivate: [AuthGuard] },
  { path: 'join/:roomId', component: OnlineMultiplayerComponent, canActivate: [AuthGuard] }
  
   */
];
