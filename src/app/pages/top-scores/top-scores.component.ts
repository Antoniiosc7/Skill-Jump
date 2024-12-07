import { Component, OnInit } from '@angular/core';
import {NgForOf} from '@angular/common';
import { ApiService } from '../../services/api.service';
import { UserScore } from '../../services/models/user-score-dto.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-scores',
  templateUrl: './top-scores.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./top-scores.component.css']
})
export class TopScoresComponent implements OnInit {
  topScores: UserScore[] = [];
  monthlyScores: UserScore[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getTop10Historical().subscribe((scores: any) => {
      this.topScores = scores;
    });

    this.apiService.getTop10Month().subscribe((scores: any) => {
      this.monthlyScores = scores;
    });
  }

  navigateToProfile(username: string): void {
    this.router.navigate([`/profile/${username}`]);
  }
}
