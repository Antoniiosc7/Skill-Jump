import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NgForOf} from '@angular/common';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  achievements: string[] = []; // Replace with actual achievements data type

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    // Fetch achievements from a service or API
    this.achievements = ['Achievement 1', 'Achievement 2', 'Achievement 3']; // Example data
  }
}
