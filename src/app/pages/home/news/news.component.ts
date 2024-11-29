import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DatePipe, NgForOf} from '@angular/common';

interface NewsPost {
  id: number;
  title: string;
  content: string;
  date: Date;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe
  ],
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsPosts: NewsPost[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Ejemplo de posts de noticias
    this.newsPosts = [
      {
        id: 1,
        title: 'New Skins Available!',
        content: 'Check out the latest skins available in the game now.',
        date: new Date()
      },
      {
        id: 2,
        title: 'Update 1.2 Released',
        content: 'We have released update 1.2 with new features and bug fixes.',
        date: new Date()
      }
    ];
  }

  navigateToArticle(postId: number): void {
    this.router.navigate(['/article', postId]);
  }
}
