import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {
  roomId!: string;
  roomName!: string;
  players: string[] = [];
  isCreator: boolean = false;
  private stompClient: any;
  countdown: number = 10;
  private countdownInterval: any;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.roomId = params['roomId'];
      this.connectWebSocket();
      this.fetchRoomDetails();
    });
  }

  connectWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(() => socket);
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe(`/topic/session/${this.roomId}`, (message: any) => {
        this.handleRoomUpdate(JSON.parse(message.body));
      });
      this.joinRoom();
    }, (error: any) => {
      console.error('WebSocket connection error:', error);
    });
  }

  fetchRoomDetails() {
    this.apiService.getRoomDetails(this.roomId).subscribe(room => {
      if (room) {
        this.roomName = room.name;
        this.players = [room.playerLeft, room.playerRight].filter(Boolean);
        this.isCreator = this.authService.getUsername() === room.playerLeft;
      }
    });
  }

  joinRoom() {
    console.log("Room id: ", this.roomId);
    console.log("stompClient: ", this.stompClient);

    if (this.stompClient && this.roomId) {
      this.stompClient.send('/app/join-session', {}, JSON.stringify({ sessionId: this.roomId, player: this.authService.getUsername() }));
    } else {
      console.error('stompClient is not initialized or roomId is null');
    }
  }

  handleRoomUpdate(room: any) {
    this.players = [room.playerLeft, room.playerRight].filter(Boolean);
  }

  startGame() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);
        this.router.navigate([`/game/${this.roomId}`]);
      }
    }, 1000);
  }

  closeRoom() {
    console.log("Room id: ", this.roomId);
    console.log("stompClient: ", this.stompClient);
    if (this.stompClient && this.roomId) {
      this.stompClient.send('/app/leave-session', {}, JSON.stringify({ sessionId: this.roomId, player: this.authService.getUsername() }));
      this.router.navigate(['/']);
    } else {
      console.error('stompClient is not initialized or roomId is null');
    }
  }
}
