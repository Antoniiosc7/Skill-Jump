import {Component, OnInit} from '@angular/core';
import {VERSIONTEXT} from '../../../config';

@Component({
  selector: 'app-mini-header',
  standalone: true,
  imports: [],
  templateUrl: './mini-header.component.html',
  styleUrl: './mini-header.component.css'
})
export class MiniHeaderComponent implements OnInit {
  version!: string;
  ngOnInit(): void {
    this.version = `${VERSIONTEXT}`;
    console.log(this.version);
  }
}
