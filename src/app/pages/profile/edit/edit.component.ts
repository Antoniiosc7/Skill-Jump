import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from '../../../services/api.service';
import {UserEntity} from '../../../services/models/user-entity.model';
@Component({
  selector: 'app-edit',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  editProfileForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: ApiService) {
    this.editProfileForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      profileImg: [''],
      coins: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe((user: UserEntity) => {
      this.editProfileForm.patchValue(user);
    });
  }

  onSubmit(): void {
    if (this.editProfileForm.valid) {
      this.userService.updateUserProfile(this.editProfileForm.value).subscribe(response => {
        // Handle successful update
      }, error => {
        // Handle error
      });
    }
  }
}
