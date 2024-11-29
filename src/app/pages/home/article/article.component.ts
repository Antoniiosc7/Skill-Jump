import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DatePipe, NgIf} from '@angular/common';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';

interface NewsPost {
  id: number;
  title: string;
  content: string;
  image: string;
  date: Date;
}

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  standalone: true,
  imports: [
    DatePipe,
    NgIf
  ],
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  post: NewsPost | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    // Aquí deberías cargar el post desde un servicio o una base de datos
    const newsPosts: NewsPost[] = [
      {
        id: 1,
        title: 'New Skins Available!',
        content: 'We are excited to announce the release of new skins for your characters! These skins are designed to give your characters a fresh and unique look. Each skin has been meticulously crafted to ensure it stands out in the game. Whether you prefer a more traditional look or something more modern and edgy, we have something for everyone. \n\nIn addition to the visual appeal, these skins also come with special effects that enhance your gaming experience. From glowing auras to dynamic animations, these skins are sure to make your character the center of attention. Don\'t miss out on the opportunity to customize your character with these amazing new skins!',
        image: 'https://img.craftpix.net/2021/05/Free-3-Cyberpunk-Characters-Pixel-Art.gif',
        date: new Date()
      },
      {
        id: 2,
        title: 'Update 1.2 Released',
        content: 'We are thrilled to announce the release of update 1.2! This update brings a host of new features and improvements to the game. One of the most significant additions is the new multiplayer mode, which allows you to team up with friends and take on challenges together. \n\nWe have also made several performance enhancements to ensure a smoother gaming experience. Bugs that were reported in the previous version have been fixed, and we have added new content to keep the game exciting and engaging. \n\nThank you for your continued support and feedback. We hope you enjoy the new features and improvements in update 1.2!',
        image: 'https://via.placeholder.com/800x400',
        date: new Date()
      }
    ];
    this.post = newsPosts.find(post => post.id === postId);
  }
}
