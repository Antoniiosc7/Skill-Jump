import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { NgForOf, NgIf } from '@angular/common';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./room-manager.component.css']
})
export class RoomManagerComponent implements OnInit {
  availableRooms: any[] = [];
  filteredRooms: any[] = [];
  inviteLink: string | null = null;
  searchQuery: string = '';
  username!: string | null; // Replace with actual username logic

  constructor(private router: Router, private apiService: ApiService, private authService: AuthService) {}

  ngOnInit() {
    this.getAvailableRooms();
    this.username = this.authService.getUsername();
  }

  getAvailableRooms() {
    this.apiService.getAvailableRooms().subscribe((rooms: any[]) => {
      this.availableRooms = rooms;
      this.filteredRooms = rooms;
    });
  }

  createRoom() {
    this.apiService.createRoom().subscribe((room: any) => {
      this.inviteLink = `http://localhost:4200/join/${room.id}`;
    });
  }

  joinRoom(roomId: string) {
    this.router.navigate([`/join/${roomId}`]);
  }

  filterRooms() {
    this.filteredRooms = this.availableRooms.filter(room =>
      room.id.includes(this.searchQuery)
    );
  }
}
