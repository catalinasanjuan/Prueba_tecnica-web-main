import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="form-container">
      <h2>{{ isEditMode ? 'Edit User' : 'Create User' }}</h2>
      
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            formControlName="firstName"
            placeholder="Enter first name"
          />
          <div *ngIf="userForm.get('firstName')?.errors?.['required'] && userForm.get('firstName')?.touched">
            First name is required
          </div>
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            formControlName="lastName"
            placeholder="Enter last name"
          />
          <div *ngIf="userForm.get('lastName')?.errors?.['required'] && userForm.get('lastName')?.touched">
            Last name is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            placeholder="Enter email"
          />
          <div *ngIf="userForm.get('email')?.errors?.['required'] && userForm.get('email')?.touched">
            Email is required
          </div>
          <div *ngIf="userForm.get('email')?.errors?.['email'] && userForm.get('email')?.touched">
            Please enter a valid email
          </div>
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" formControlName="role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="form-group" *ngIf="!isEditMode">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            placeholder="Enter password"
          />
          <div *ngIf="userForm.get('password')?.errors?.['required'] && userForm.get('password')?.touched">
            Password is required
          </div>
        </div>

        <div class="button-group">
          <button type="button" (click)="goBack()" class="btn-secondary">Cancel</button>
          <button type="submit" [disabled]="userForm.invalid || isLoading" class="btn-primary">
            {{ isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    button {
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', Validators.required],
      password: ['']
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.userId = id;
      this.loadUser(id);
    } else {
      this.userForm.get('password')?.setValidators(Validators.required);
    }
  }

  loadUser(id: number) {
    this.userService.getUser(id).subscribe(user => {
      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      });
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true;
      const userData = this.userForm.value;

      const operation = this.isEditMode
        ? this.userService.updateUser(this.userId!, userData)
        : this.userService.createUser(userData);

      operation.subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error saving user:', error);
          this.isLoading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}