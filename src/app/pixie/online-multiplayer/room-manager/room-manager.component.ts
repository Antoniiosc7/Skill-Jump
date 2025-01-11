import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-room-manager',
  templateUrl: './room-manager.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./room-manager.component.css']
})
export class RoomManagerComponent implements OnInit {
  availableRooms: any[] = [];
  inviteLink: string | null = null;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.getAvailableRooms();
  }

  getAvailableRooms() {
    this.apiService.getAvailableRooms().subscribe((rooms: any[]) => {
      this.availableRooms = rooms;
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
}
