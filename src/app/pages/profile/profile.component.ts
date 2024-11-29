import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { NgForOf, NgIf, DatePipe } from '@angular/common';
import { UserScore } from '../../services/models/user-score-dto.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  topScores: UserScore[] = [];
  idUsuario: string | null = null;
  topProfiles: UserScore[] = [];
  isLoggedIn: boolean = false;
  achievements: string[] = [];

  constructor(private authService: AuthService, private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.route.paramMap.subscribe(params => {
      this.idUsuario = params.get('idUsuario');
      if (this.idUsuario) {
        this.loadUserProfile(this.idUsuario);
      } else {
        this.loadTopProfiles();
      }
    });
  }

  loadUserProfile(idUsuario: string) {
    this.username = `${idUsuario}`;
    this.apiService.getTop10User(this.username!).subscribe(
      (scores: UserScore[]) => {
        this.topScores = scores;
        this.achievements = scores.map(score => `Score: ${score.score} on ${new Date(score.date).toLocaleDateString()} at ${new Date(score.date).toLocaleTimeString()}`);
      },
      error => {
        console.error('Error fetching top scores', error);
      }
    );
  }

  loadTopProfiles() {
    this.apiService.getTop10Month().subscribe(
      (profiles: UserScore[]) => {
        this.topProfiles = profiles;
      },
      error => {
        console.error('Error fetching top profiles', error);
      }
    );
  }

  searchUserProfile(username: string) {
    // Implement search logic to find user profile by username
  }
}
